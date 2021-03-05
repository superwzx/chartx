import Component from "../component"
import Canvax from "canvax"
import {getDefaultProps} from "../../utils/tools"
import {lineRect} from "../../utils/intersect"
import { getMutableClone } from "typescript";

let { _, event } = Canvax;
let BrokenLine = Canvax.Shapes.BrokenLine;
let Arrow = Canvax.Shapes.Arrow;
let Text = Canvax.Display.Text;
let Circle = Canvax.Shapes.Circle;

class relationBackLine extends Component
{
    static defaultProps(){
        return {
            key : {
                detail: '和relation的line保持一致，用逗号分割',
                default: null
            },
            line : {
                detail: '线的配置',
                propertys: {
                    enabled: {
                        detail: '是否开启',
                        default: true
                    },
                    pointList: {
                        detail: '回链线的points',
                        default: null
                    },
                    lineWidth: {
                        detail: '线宽',
                        default: 1
                    },
                    strokeStyle: {
                        detail: '线的颜色',
                        default: '#e5e5e5'
                    },
                    lineType: {
                        detail: '线的样式，虚线(dashed)实线(solid)',
                        default: 'solid'
                    },
                    dissY: {
                        detail: '拐点和起始节点的距离',
                        default: null
                    }
                }
            },
            icon : {
                detail: 'line上面的icon',
                propertys: {
                    enabled: {
                        detail: '是否开启线上的icon设置',
                        default: true
                    },
                    charCode: {
                        detail: 'iconfont上面对应的unicode中&#x后面的字符',
                        default: null
                    },
                    lineWidth: {
                        detail: 'icon描边线宽',
                        default: 1
                    },
                    strokeStyle: {
                        detail: 'icon的描边颜色',
                        default: '#e5e5e5'
                    },
                    fontColor: {
                        detail: 'icon的颜色',
                        default: '#e5e5e5'
                    },
                    fontFamily: {
                        detail: 'font-face的font-family设置',
                        default: 'iconfont'
                    },
                    fontSize : {
                        detail: 'icon的字体大小',
                        default: 14
                    },
                    offset: {
                        detail: 'icon的位置，函数，参数是整个edge对象',
                        default: null
                    },
                    offsetX: {
                        detail: '在计算出offset后的X再次便宜量',
                        default: 1
                    },
                    offsetY: {
                        detail: '在计算出offset后的Y再次便宜量',
                        default: 2
                    },
                    background:{
                        detail: 'icon的背景颜色，背景为圆形',
                        default: "#fff"
                    }
                }
            }
        }
    }

    constructor( opt, app )
    {
        super(opt, app);
        this.name = "relation_backline";
        _.extend(true, this, getDefaultProps( relationBackLine.defaultProps() ), opt );

        this.pointList = null;

        this.sprite = new Canvax.Display.Sprite();

        this._line   = null;
        this._arrow  = null;
        this._label  = null;
        this._icon   = null;
    }

    draw( opt )
    {
        !opt && (opt = {});
        this.width   = opt.width;
        this.height  = opt.height;
        this.origin  = opt.origin;

        this._widget();

    }

    reset( opt ){
        opt && _.extend(true, this, opt);
        this._widget();
    }

    _widget(){

        let _graphs = this.app.getGraphs();

        if( _graphs.length ){
            let _graph = _graphs[0];
            _graph.on( 'complete', ()=>{

                this._setPoints( _graph );
                this._drawLine();
                this._drawArrow();
                this._drawIcon();

                _graph.graphsSp.addChild(this.sprite);
            } );
        };

    }

    _setPoints( _graph ){
        
        if( !this.line.pointList ){
            let key = this.key;
          
            let beginNode = _graph.data.nodes.find( (_g)=>_g.key == key.split(',')[0] );
            let beginNodeBBox = {
                x : beginNode.x - beginNode.width / 2,
                y : beginNode.y - beginNode.height / 2,
                width : beginNode.width,
                height: beginNode.height
            };

            let endNode   = _graph.data.nodes.find( (_g)=>_g.key == key.split(',')[1] );
            let endNodeBBox = {
                x : endNode.x - endNode.width / 2,
                y : endNode.y - endNode.height / 2,
                width : endNode.width,
                height: endNode.height
            };

            let fristPoint  = [ beginNodeBBox.x+beginNodeBBox.width, beginNodeBBox.y+beginNodeBBox.height/2 ];
            let secondPoint = [ beginNodeBBox.x+beginNodeBBox.width+20, beginNodeBBox.y+beginNodeBBox.height/2 ];

            let endPoint;
            let endNodePointX = endNodeBBox.x+endNodeBBox.width/2;
            let endNodeTopPoint = [ endNodePointX, endNodeBBox.y ];
            let endNodeBottomPoint = [ endNodePointX, endNodeBBox.y+endNodeBBox.height ];
            
            endPoint = endNodeTopPoint

            let getThroughNodesNum = ( dissY )=>{
                let y = secondPoint[1] + dissY;
                let num = 0;
                _graph.data.nodes.forEach( node => {
                    let rectX = node.x;
                    let rectY = node.y;
                    if( node.shapeType == "diamond"){
                        rectX -= node.width/2;
                        rectY -= node.height/2;
                    };
                    let nodeRect = {
                        x : rectX,
                        y : rectY,
                        xMax: rectX+node.width,
                        yMax: rectY+node.height
                    };
                    
                    if( lineRect( {x: secondPoint[0], y}, { x: endNodePointX, y} , nodeRect) ){
                        num ++
                    };
                });
                return num;
            }

            let dissY, topDissY,bottomDissY, lines=[];
            if( this.line.dissY == null ){
                
                topDissY = -(secondPoint[1] - (Math.min( endNodeBBox.y, beginNodeBBox.y ) - 10));
                lines.push({
                    dissY: topDissY,
                    throughNodesNum: getThroughNodesNum(topDissY),
                    endPoint: endNodeTopPoint,
                    type: 'n'
                });

                //如果发现两个节点中间有足够的间隙，还可以
                if( endNodeBBox.y - (beginNodeBBox.y+beginNodeBBox.height) > 20 ){
                    //向下连接 z 形状
                    topDissY = ((beginNodeBBox.y+beginNodeBBox.height) + (endNodeBBox.y - (beginNodeBBox.y+beginNodeBBox.height))/2) - secondPoint[1];
                    lines.push({
                        dissY: topDissY,
                        throughNodesNum: getThroughNodesNum(topDissY),
                        endPoint: endNodeTopPoint,
                        type: 'down_z'
                    });
                };
                

                //然后检测出来连接目标节点下面的点，只能从下往上
                let endBottomY = endNodeBottomPoint[1];
                bottomDissY = (Math.max( endBottomY, beginNodeBBox.y+beginNodeBBox.height ) + 10) - secondPoint[1]
                lines.push({
                    dissY: bottomDissY,
                    throughNodesNum: getThroughNodesNum(bottomDissY),
                    endPoint: endNodeBottomPoint,
                    type: 'u'
                });


                if( beginNodeBBox.y - endBottomY > 20 ){
                    //向上的z 形状连接
                    bottomDissY = ( endBottomY + (beginNodeBBox.y - endBottomY)/2 ) - secondPoint[1];
                    lines.push({
                        dissY: bottomDissY,
                        throughNodesNum: getThroughNodesNum(bottomDissY),
                        endPoint: endNodeBottomPoint,
                        type: 'up_z'
                    });
                };

                //先按照最小的穿过node的数量排序， 取穿过node最少的line
                lines = lines.sort( function(a,b){return a.throughNodesNum - b.throughNodesNum} );

                //如果前面有几个是throughNodesNum相同的，组成一个小组，重新按照dissY的绝对值最小值排序
                let _lines = [];
                lines.forEach( line => {
                    if( line.throughNodesNum == lines[0].throughNodesNum ){
                        _lines.push( line );
                    }
                });
                _lines = _lines.sort( function(a,b){ return Math.abs(a.dissY) - Math.abs(b.dissY) } );

                dissY = _lines[0].dissY;
                endPoint = _lines[0].endPoint;

            } else {
                dissY = this.line.dissY;
            };

            let thirdPoint,secondLastPoint;
            thirdPoint = [ secondPoint[0], secondPoint[1]+dissY ];
            secondLastPoint = [ endPoint[0], secondPoint[1]+dissY ];

            this.pointList = [ fristPoint, secondPoint, thirdPoint, secondLastPoint, endPoint ];           
        } else {
            this.pointList = this.line.pointList;
        }
    }

    _drawLine(){
        let me = this;
        if( !me.line.enabled ) return;

        let lineOpt     = {
            pointList   : this.pointList,
            lineWidth   : this.line.lineWidth,
            strokeStyle : this.line.strokeStyle,
            lineType    : this.line.lineType
        };


        if( this._line ){
            _.extend( this._line.context , lineOpt );
        } else {
            this._line = new BrokenLine({
                context : lineOpt
            });
            this.sprite.addChild( this._line );
        };
        //线条渲染结束
    }

    _drawArrow(){
        let pointsList = this.pointList;
        let offsetY = 2;
        let endPoint = pointsList[ pointsList.length-1 ];
        let secondLastPoint = pointsList[ pointsList.length-2 ];
        if( secondLastPoint[1] < endPoint[1] ){
            offsetY = -2
        }

        let strokeStyle = this.line.strokeStyle;

        let ctx = {
            y:  offsetY,
            control     : {
                x : secondLastPoint[0],
                y : secondLastPoint[1]
            },
            point       : {
                x : endPoint[0],
                y : endPoint[1]
            },
            strokeStyle : strokeStyle,
            fillStyle   : strokeStyle
        }

        if( this._arrow ){
            _.extend( true, this._arrow.context , ctx );
            // this._line.context.y = ctx.y;
            // this._line.context.control.x = ctx.control.x;
            // this._line.context.control.y = ctx.control.y;
            // this._line.context.point.x = ctx.point.x;
            // this._line.context.point.y = ctx.point.y;
            // this._line.context.strokeStyle = ctx.strokeStyle;
            // this._line.context.fillStyle = ctx.fillStyle;
        } else {
            this._arrow = new Arrow({
                context: ctx
            });
            
            this.sprite.addChild(this._arrow);
        }
        
    }

    _drawIcon(){
        let me = this;
        if(this.icon.enabled){
            let _chartCode = this._getProp( this.icon.charCode, this );
            let charCode   = String.fromCharCode(parseInt( _chartCode , 16));
                
            if( _chartCode != '' ){

                let secondPoint  = this.pointList[1]

                let lineWidth    = this._getProp( this.icon.lineWidth   , this );
                let strokeStyle  = this._getProp( this.icon.strokeStyle , this );
                let fontFamily   = this._getProp( this.icon.fontFamily  , this );
                let fontSize     = this._getProp( this.icon.fontSize    , this );
                let fontColor    = this._getProp( this.icon.fontColor   , this );
                let background   = this._getProp( this.icon.background  , this );
                let textAlign    = 'center';
                let textBaseline = 'middle';

                let offset       = this._getProp( this.icon.offset  , this );
                let offsetX      = this._getProp( this.icon.offsetX  , this );
                let offsetY      = this._getProp( this.icon.offsetY  , this );
                if( !offset ) {  //default 使用edge.x edge.y 也就是edge label的位置
                    offset = {
                        x: secondPoint[0] + offsetX,
                        y: secondPoint[1] + offsetY
                    }
                };

                let _iconBackCtx   = {
                    x : offset.x,
                    y : offset.y - 1,
                    r : parseInt(fontSize*0.5)+2,
                    fillStyle : background,
                    strokeStyle,
                    lineWidth
                };
                if( this._iconBack ){
                    //_.extend( true, _iconBack.context, _iconBackCtx )
                    Object.assign(this._iconBack.context, _iconBackCtx);
                } else {
                    this._iconBack = new Circle({
                        context: _iconBackCtx
                    });
                    this.sprite.addChild( this._iconBack );
                };

                if( this._icon ){

                    this._icon.resetText( charCode );
                    this._icon.context.x            = offset.x;
                    this._icon.context.y            = offset.y;
                    this._icon.context.fontSize     = fontSize;
                    this._icon.context.fillStyle    = fontColor;
                    this._icon.context.textAlign    = textAlign;
                    this._icon.context.textBaseline = textBaseline;
                    this._icon.context.fontFamily   = fontFamily;
                    this._icon.context.lineWidth    = lineWidth;
                    this._icon.context.strokeStyle  = strokeStyle;

                } else {
                    this._icon = new Canvax.Display.Text( charCode, {
                        context: {
                            x         : offset.x,
                            y         : offset.y,
                            fillStyle : fontColor,
                            cursor    : 'pointer',
                            fontSize,
                            textAlign,
                            textBaseline,
                            fontFamily,
                            lineWidth,
                            strokeStyle
                        }
                    });
                    this._icon.on(event.types.get(), function (e) {
                        
                        let trigger = me.line;
                        if( me.icon[ 'on'+e.type ] ){
                            trigger = me.icon;
                        };
                        e.eventInfo = {
                            trigger,
                            nodes: [ {
                                name : me.key
                            } ]
                        };
                        me.app.fire(e.type, e);

                    });
                    me.sprite.addChild( this._icon );
                }
                

            }
        }
    }

    _getProp( prop, nodeData ) {
        let _prop = prop;
      
        if( _.isFunction( prop ) ){
            _prop = prop.apply( this, [ nodeData ] );
        };
        
        return _prop;
    }
}


Component.registerComponent( relationBackLine, 'relation_backline' );

export default relationBackLine;
