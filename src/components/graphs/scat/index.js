import Canvax from "canvax"
import GraphsBase from "../index"
import {getDefaultProps} from "../../../utils/tools"
import hull from "../../../utils/hull/index"

let { _,event } = Canvax;
let Circle = Canvax.Shapes.Circle;
let Rect = Canvax.Shapes.Rect;
let Line = Canvax.Shapes.Line;
let Polygon = Canvax.Shapes.Polygon;

//TODO iGroup 的实现有问题

class ScatGraphs extends GraphsBase
{
    static defaultProps(){
        return {
            field: {
                detail: '字段配置',
                default: null
            },
            groupField: {
                detail: '分组字段',
                default: null,
                documentation: '分组字段，如果area配置enabled为true，那么需要groupField来构建几个area'
            },
            dataFilter: {
                detail: '散点过滤数据',
                default: null,
                documentation: "数据过滤器，可以和groupField实现交叉过滤"
            },
            aniOrigin: {
                detail: '节点动画的原点',
                default:'default',
                documentation: '可选的还有center（坐标正中）、origin（坐标原点）'
            },
            node: {
                detail: '单数据节点图形设置',
                propertys: {
                    dataKey : {
                        detail: '元素的数据id，默认索引匹配',
                        default: '__index__'
                    },
                    shapeType: {
                        detail: '图形类型',
                        default: 'circle',
                        documentation: '节点的现状可以是圆 ，也可以是rect，也可以是三角形，后面两种后面实现'
                    },
                    maxRadius: {
                        detail: '节点最大半径',
                        default: 25
                    },
                    minRadius: {
                        detail: '节点最小半径',
                        default: 5
                    },
                    radius: {
                        detail: '半径',
                        default: null
                    },
                    radiusScale: {
                        detail: '半径缩放比例',
                        documentation: '在计算好真实半径后缩放，主要用在,缩略图中，比如datazoom的缩略图',
                        default: 1
                    },
                    normalRadius: {
                        detail: '默认半径',
                        default: 15
                    },
                    fillStyle: {
                        detail: '节点景色',
                        default: null
                    },
                    fillAlpha: {
                        detail: '节点透明度',
                        default: 0.8
                    },
                    strokeStyle: {
                        detail: '节点描边颜色',
                        default: null
                    },
                    lineWidth: {
                        detail: '节点描边线宽',
                        default: 0
                    },
                    strokeAlpha: {
                        detail : '节点描边透明度',
                        default: 1
                    },
    
                    focus: {
                        detail: "节点hover态设置",
                        propertys: {
                            enabled: {
                                detail: '是否开启',
                                default: true
                            },
                            lineWidth: {
                                detail: 'hover后的边框大小',
                                default: 6
                            },
                            strokeAlpha: {
                                detail: 'hover后的边框透明度',
                                default: 0.2
                            },
                            fillAlpha: {
                                detail: 'hover后的背景透明度',
                                default: 0.8
                            }
                        }
                    },
    
                    select: {
                        detail: "节点选中态设置",
                        propertys: {
                            enabled: {
                                detail: '是否开启',
                                default: false
                            },
                            lineWidth: {
                                detail: '选中后的边框大小',
                                default: 8
                            },
                            strokeAlpha: {
                                detail: '选中后的边框透明度',
                                default: 0.4
                            },
                            fillAlpha: {
                                detail: '选中后的背景透明度',
                                default: 1
                            }
                        }
                    }
                }
            },
            line: {
                detail: '每个节点和指标轴线的连线',
                propertys: {
                    enabled: {
                        detail: '是否开启',
                        default: false
                    },
                    lineWidth: {
                        detail: '连线宽',
                        default: 1
                    },
                    strokeStyle: {
                        detail: '连线颜色',
                        default: '#ccc'
                    },
                    lineType: {
                        detail: '连线类型',
                        default: 'dashed'
                    }
                }
            },
            area: {
                detail: '散点集合组成的面',
                propertys: {
                    enabled: {
                        detail: '是否开启',
                        default: false
                    },
                    concavity: {
                        detail: '凹凸系数，默认80，越大越凸',
                        default: 88
                    },
                    quantile : {
                        detail : '散点用来计入面积的分位数',
                        default: 8,
                    },
                    fillStyle: {
                        detail: '散点集合面的背景色',
                        default: null
                    },
                    fillAlpha: {
                        detail: '散点集合面的透明度',
                        default: 0.15
                    },
                    strokeStyle: {
                        detail: '散点集合面的描边颜色',
                        default: null
                    },
                    lineWidth: {
                        detail: '散点集合面的描边线宽',
                        default: 0
                    },
                    strokeAlpha: {
                        detail : '散点集合面的描边透明度',
                        default: 0.5
                    }
                }
            },
            label: {
                detail: '文本设置',
                propertys: {
                    enabled: {
                        detail: '是否开启',
                        default: true
                    },
                    field: {
                        detail: '获取label的字段',
                        default: null
                    },
                    format: {
                        detail: 'label格式化处理函数',
                        default:function(txt){ 
                            return txt 
                        }
                    },
                    fontSize: {
                        detail: 'label字体大小',
                        default: 13
                    },
                    fontColor: {
                        detail: '字体颜色',
                        default: '#888'
                    },
                    strokeStyle: {
                        detail: '字体描边颜色',
                        default: '#ffffff'
                    },
                    lineWidth: {
                        detail: '描边大小',
                        default: 0
                    },
    
                    textAlign: {
                        detail: '水平对齐方式',
                        default:'center'
                    },
                    verticalAlign: {
                        detail: '垂直基线对齐方式',
                        default:'middle'
                    },
                    position: {
                        detail: '文本布局位置',
                        documentation:'auto(目前等于center，还未实现),center,top,right,bottom,left',
                        default:'center'
                    },
                    offsetX: {
                        detail: 'x方向偏移量',
                        default: 0
                    },
                    offsetY: {
                        detail: 'y方向偏移量',
                        default: 0
                    }
                }
            }
        }
    }

    constructor(opt, app)
    {
        super( opt, app );
        this.type = "scat";

        //计算半径的时候需要用到， 每次执行_trimGraphs都必须要初始化一次
        this._rData = null;
        this._rMaxValue = null;
        this._rMinValue = null;

        this._groupData = {}; //groupField配置有的情况下会被赋值，在_trimGraphs会被先置空，然后赋值

        _.extend( true, this , getDefaultProps( ScatGraphs.defaultProps() ), opt );

        this.init();
    }

    init()
    {
        this._shapesp = new Canvax.Display.Sprite({ 
            id : "scat_shapesp"
        });
        this._textsp = new Canvax.Display.Sprite({ 
            id : "textsp"
        });
        this._linesp = new Canvax.Display.Sprite({ 
            id : "textsp"
        });
        this._areasp = new Canvax.Display.Sprite({
            id : "areasp"
        });
        
        this.sprite.addChild( this._areasp );
        this.sprite.addChild( this._linesp );
        this.sprite.addChild( this._shapesp );
        this.sprite.addChild( this._textsp );
        
    }

    draw(opt)
    {
        !opt && (opt ={});

        _.extend( true, this , opt );
        this.data = this._trimGraphs(); 
        this._widget();
        this.sprite.context.x = this.origin.x;
        this.sprite.context.y = this.origin.y;

        let me = this;
        
        if( this.animation && !opt.resize && !me.inited ){
            this.grow( function(){
                me.fire("complete");
            } );
        } else {
            this.fire("complete");
        };

        //inited 和 complete还不同，complete 是需要等动画结束
        this.inited = true;
        return this;
    }

    resetData( dataFrame )
    {
        this.dataFrame = dataFrame;
        this.data = this._trimGraphs();
        this._widget();
        this.grow();
    }

    getNodesAt()
    {
        return []
    }

    _trimGraphs()
    {
        let tmplData = [];
        this._groupData = {};

        let _coord = this.app.getComponent({name:'coord'});
        
        let dataLen  = this.dataFrame.length;

        ////计算半径的时候需要用到， 每次执行_trimGraphs都必须要初始化一次
        this._rData = null;
        this._rMaxValue = null;
        this._rMinValue = null;

        for( let i=0; i<dataLen; i++ ){
            
            let rowData = this.dataFrame.getRowDataAt(i);
            let fieldConfig = _coord.getFieldConfig( this.field );

            let point = _coord.getPoint( {
                iNode : i,
                field : this.field,
                value : {
                    //x:
                    y : rowData[ this.field ]
                }
            } );

            if( point.pos.x == undefined || point.pos.y == undefined ){
                continue;
            };

            let nodeLayoutData = {
                type       : "scat",
                rowData    : rowData,
                x          : point.pos.x,
                y          : point.pos.y,
                value      : point.value,
                field      : this.field,
                fieldColor : fieldConfig.color,
                iNode      : i,

                focused    : false,
                selected   : false,

                //下面的属性都单独设置
                radius     : null,   //这里先不设置，在下面的_setR里单独设置
                fillStyle  : null,
                color      : null,
                strokeStyle: null,
                strokeAlpha: 1,
                lineWidth  : 0,
                shapeType  : null,
                label      : null,
                fillAlpha  : 1,

                nodeElement: null //对应的canvax 节点， 在widget之后赋值
            };

            this._setR( nodeLayoutData );
            this._setFillStyle( nodeLayoutData );
            this._setFillAlpha( nodeLayoutData );
            this._setStrokeStyle( nodeLayoutData );
            this._setLineWidth( nodeLayoutData );
            this._setStrokeAlpha( nodeLayoutData );
            this._setNodeType( nodeLayoutData );
            this._setText( nodeLayoutData );

            
            if( this.dataFilter ){
                if( _.isFunction( this.dataFilter ) ){
                    if( !this.dataFilter.apply( this, [ nodeLayoutData ] ) ){
                        continue;
                    }
                }
            }

            //如果有分组字段，则记录在_groupData，供后面的一些分组需求用，比如area
            if( this.groupField ){
                let groupVal = rowData[ this.groupField ];
                if( groupVal ){
                    if( !this._groupData[ groupVal ] ){
                        this._groupData[ groupVal ] = [];
                    };
                    !this._groupData[ groupVal ].push( nodeLayoutData );
                }
            } else {
                if( !this._groupData.all ){
                    this._groupData.all = [];
                };
                this._groupData.all.push( nodeLayoutData );
            }

            tmplData.push( nodeLayoutData );
        };

        return tmplData;
    }

    _setR( nodeLayoutData )
    {

        let r = this.node.normalRadius;
        let rowData = nodeLayoutData.rowData;
        if( this.node.radius != null ){
            if( _.isString( this.node.radius ) && rowData[ this.node.radius ] ){
                //如果配置了某个字段作为r，那么就要自动计算比例
                if( !this._rData && !this._rMaxValue && !this._rMinValue ){
                    this._rData = this.dataFrame.getFieldData( this.node.radius );
                    this._rMaxValue = _.max( this._rData );
                    this._rMinValue = _.min( this._rData );
                };

                let rVal = rowData[ this.node.radius ];

                if( this._rMaxValue ==  this._rMinValue ){
                    r = this.node.minRadius + ( this.node.maxRadius - this.node.minRadius )/2;
                } else {
                    r = this.node.minRadius + (rVal-this._rMinValue)/( this._rMaxValue-this._rMinValue ) * ( this.node.maxRadius - this.node.minRadius )
                };
            };
            if( _.isFunction( this.node.radius ) ){
                r = this.node.radius( rowData );
            };
            if( !isNaN( parseInt( this.node.radius ) ) ){
                r = parseInt( this.node.radius )
            };
        };

        r = Math.max( r * this.node.radiusScale , 2 );

        nodeLayoutData.radius = r;
        return this;

    }

    _setText( nodeLayoutData )
    {
        if( this.label.field != null ){
            if( _.isString( this.label.field ) && nodeLayoutData.rowData[ this.label.field ] ){
                nodeLayoutData.label = this.label.format( nodeLayoutData.rowData[ this.label.field ], nodeLayoutData );
            }
        }
    }

    _setFillStyle( nodeLayoutData )
    {
        nodeLayoutData.color = nodeLayoutData.fillStyle = this._getStyle( this.node.fillStyle, nodeLayoutData );
        return this;
    }
    _setFillAlpha( nodeLayoutData )
    {
        nodeLayoutData.fillAlpha = this._getProp( this.node.fillAlpha, nodeLayoutData );
        return this;
    }

    _setStrokeAlpha( nodeLayoutData ){
        nodeLayoutData.strokeAlpha = this._getProp( this.node.strokeAlpha, nodeLayoutData );
        return this;
    }

    _setStrokeStyle( nodeLayoutData )
    {
        nodeLayoutData.strokeStyle = this._getStyle( (this.node.strokeStyle || this.node.fillStyle), nodeLayoutData );
        return this;
    }

    _getProp( prop, nodeLayoutData )
    {
        let _prop = prop;
        if( _.isArray( prop ) ){
            _prop = prop[ nodeLayoutData.iGroup ]
        };
        if( _.isFunction( prop ) ){
            _prop = prop.apply( this, [nodeLayoutData] );
        };
        return _prop;
    }
    _getStyle( style, nodeLayoutData )
    {
        let _style = style;
        if( _.isArray( style ) ){
            _style = style[ nodeLayoutData.iGroup ]
        };
        if( _.isFunction( style ) ){
            _style = style.apply( this, [nodeLayoutData] );
        };
        if( !_style ){
            _style = nodeLayoutData.fieldColor;
        };
        return _style;
    }

    _setLineWidth( nodeLayoutData )
    {
        nodeLayoutData.lineWidth = this._getProp( this.node.lineWidth, nodeLayoutData );
        return this;
    }

    _setNodeType( nodeLayoutData )
    {
        let shapeType = this.node.shapeType;
        if( _.isArray( shapeType ) ){
            shapeType = shapeType[ nodeLayoutData.iGroup ]
        };
        if( _.isFunction( shapeType ) ){
            shapeType = shapeType( nodeLayoutData );
        };
        if( !shapeType ){
            shapeType = "circle"
        };
        nodeLayoutData.shapeType = shapeType;
        return this;
    }

    //根据layoutdata开始绘制
    _widget()
    {
        let me = this;
        
        _.each( _.flatten([me._shapesp.children,me._textsp.children,me._linesp.children]), function( el ){
            el.__used = false
        } );
 
        
        _.each( me.data , function( nodeData, iNode ){

            let _nodeElement = me._getNodeElement( nodeData, iNode );
            if( !_nodeElement ){
                nodeData.__isNew = true;
            };

            let _context = me._getNodeContext( nodeData );
            let Shape = nodeData.shapeType == "circle" ? Circle : Rect;

            //let _nodeElement = me._shapesp.getChildAt( iNode );
            
            if( !_nodeElement ){
                _nodeElement = new Shape({
                    id: "shape_"+iNode,
                    hoverClone : false,
                    context : _context
                });
                me._shapesp.addChild( _nodeElement );

                _nodeElement.on(event.types.get(), function(e) {
                     e.eventInfo = {
                         title: null,
                         trigger: me.node,
                         nodes: [ this.nodeData ]
                     };
                     if( this.nodeData.label ){
                         e.eventInfo.title = this.nodeData.label;
                     };
            
                     if( e.type == 'mouseover' ){
                        me.focusAt( this.nodeData.iNode );
                     };
                     if( e.type == 'mouseout' ) {
                        !this.nodeData.selected && me.unfocusAt( this.nodeData.iNode );
                     };

                     //fire到root上面去的是为了让root去处理tips
                     //先触发用户事件，再处理后面的选中事件
                     me.app.fire( e.type, e );

                });

            } else {
                //_nodeElement.context = _context;
                //_.extend( _nodeElement.context, _context );
                _nodeElement.animate( _context );
            };
            _nodeElement.__used = true;
        
            //数据和canvax原件相互引用
            _nodeElement.nodeData = nodeData;
            _nodeElement.iNode = iNode;
            nodeData.nodeElement = _nodeElement;

            if( me.line.enabled ){

                let _line = _nodeElement.lineElement;//me._linesp.getChildAt( iNode );
                let _lineContext = {
                    start : {
                        x : _context.x,
                        y : _context.y+_context.r
                    },
                    end : {
                        x : _context.x,
                        y : 0
                    },
                    lineWidth : me.line.lineWidth,
                    strokeStyle : me.line.strokeStyle,
                    lineType: me.line.lineType
                };

                if(!_line){
                    _line = new Line({
                        context : _lineContext
                    });
                    me._linesp.addChild( _line );
                } else {
                    _line.animate( _lineContext );
                };
                _line.__used = true;

                _nodeElement.lineElement = _line;
                
            };

            //如果有label
            if( nodeData.label && me.label.enabled ){
        
                let _label = _nodeElement.labelElement;//me._textsp.getChildAt( iNode );
                let _labelContext = {};
                if( !_label ){
                    _label = new Canvax.Display.Text( nodeData.label , {
                        id: "scat_text_"+iNode,
                        context: {}
                    });
                    _labelContext = me._getTextContext( _label, _context );
                    //_label.animate( _labelContext );
                    _.extend( _label.context , _labelContext );
                    me._textsp.addChild( _label );
                    
                } else {
                    _label.resetText(  nodeData.label );
                    _labelContext = me._getTextContext( _label, _context );
                    _label.animate( _labelContext );
                };
                _label.__used = true;

                //图形节点和text文本相互引用
                _nodeElement.labelElement = _label;
                _label.nodeElement = _nodeElement;
            };
        
        } );

        if( me.area.enabled ){

            me._areasp.removeAllChildren();

            let gi = 0;
            for( let _groupKey in this._groupData ){
                let _group = this._groupData[ _groupKey ];
                let _groupData = {
                    name : _groupKey,
                    iGroup : gi,
                    data : _group
                };
                let _groupPoints = [];

                function getCirclePoints( nodeData, n ){

                    if( !n || n == 1 ){
                        return [ [ nodeData.x, nodeData.y ] ]
                    };

                    let _points = [];
                    for( let i=0; i<n; i++ ){
                        let degree = 360/(n-1) * i;
                        let r = nodeData.radius + 3;
                        let x = nodeData.x +  Math.cos(Math.PI * 2 / 360 * degree) * r;
                        let y = nodeData.y+ Math.sin(Math.PI * 2 / 360 * degree) * r;
                        _points.push( [x,y] );
                    };
                    return _points;
                }

                _.each( _group, function( nodeData ){
                    _groupPoints = _groupPoints.concat( getCirclePoints( nodeData , me.area.quantile) );
                } );
                let areaPoints = hull( _groupPoints, me.area.concavity );

                let defStyle = me.app.getTheme( gi );

                let areaFillStyle = me._getStyle( me.area.fillStyle, _groupData ) || defStyle;
                let areaFillAlpha = me._getProp( me.area.fillAlpha , _groupData );
                let areaStrokeStyle = me._getStyle( me.area.strokeStyle, _groupData ) || defStyle;
                let areaLineWidth = me._getProp( me.area.lineWidth , _groupData );
                let areaStrokeAlpha = me._getProp( me.area.strokeAlpha, _groupData );

                let _areaElement = new Polygon({
                    context : {
                        pointList   : areaPoints,
                        fillStyle   : areaFillStyle,
                        fillAlpha   : areaFillAlpha,
                        strokeStyle : areaStrokeStyle,
                        lineWidth   : areaLineWidth,
                        strokeAlpha : areaStrokeAlpha,
                        smooth      : false
                    }
                });
                me._areasp.addChild( _areaElement );

                gi++;
                
            }
        };

        //多余的元素渐隐后销毁
        _.each( _.flatten([me._shapesp.children,me._textsp.children,me._linesp.children]), function( el ){
            if(!el.__used ){
                el.animate({
                    globalAlpha: 0,
                    r : 0
                },{
                    onComplete: function() {
                        el.destroy();
                    }
                });
            }
        } );
     
    }

    _getNodeElement( nodeData, iNode ){
        let me = this;
        let nodeEle;
        let dataKey = me.node.dataKey;
        if( !dataKey ){
            nodeEle = me._shapesp.getChildAt( iNode );
        } else {
            
            if( _.isString( dataKey ) ){
                dataKey = dataKey.split(",");
            };

            for( let i=0,l=this._shapesp.children.length; i<l; i++ ){
                let _nodeEle = this._shapesp.children[i];
                let isThisNodeEle=true;
                for( let ii=0,ll=dataKey.length; ii<ll; ii++ ){
                    let key = dataKey[ii];
                    if( _nodeEle.nodeData.rowData[ key ] != nodeData.rowData[key] ){
                        isThisNodeEle = false;
                        break;
                    };
                };
                if( isThisNodeEle && dataKey.length ){
                    nodeEle = _nodeEle;
                    break;
                };
            };
        };
        return nodeEle;
        
    }

    _getTextPosition( _label, opt )
    {
        let x=0,y=0;
        switch( this.label.position ){
            case "center" :
                x = opt.x;
                y = opt.y;
                break;
            case "top" :
                x = opt.x;
                y = opt.y - opt.r;
                break;
            case "right" :
                x = opt.x + opt.r;
                y = opt.y;
                break;
            case "bottom" :
                x = opt.x;
                y = opt.y + opt.r;
                break;
            case "left" :
                x = opt.x - opt.r;
                y = opt.y;
                break;
            case "auto" :
                x = opt.x;
                y = opt.y;
                if( _label.getTextWidth() > opt.r*2 ){
                    y = opt.y + opt.r + _label.getTextHeight() * 0.5;
                };
                break;
        };

        let point = {
            x: x + this.label.offsetX,
            y: y + this.label.offsetY
        };

        return point;
    }

    _getTextContext( _label, _context )
    {
        let textPoint = this._getTextPosition( _label, _context );

        let fontSize = this.label.fontSize;
        if( _label.getTextWidth() > _context.r*2 ){
            fontSize -= 2;
        };
        
        let ctx = {
            x: textPoint.x,
            y: textPoint.y,
            fillStyle: this.label.fontColor || _context.fillStyle,
            fontSize: fontSize,
            strokeStyle : this.label.strokeStyle || _context.fillStyle,
            lineWidth : this.label.lineWidth,
            textAlign : this.label.textAlign,
            textBaseline : this.label.verticalAlign
        };

        if( this.animation && !this.inited ){
            this._setCtxAniOrigin(ctx);
        };
        
        return ctx;
    }

    _setCtxAniOrigin( ctx ) {
        if( this.aniOrigin == "default" ){
            ctx.y = 0;
        };
        if( this.aniOrigin == "origin" ){
            let _coord = this.app.getComponent({name:'coord'});
            let originPoint = _coord.getOriginPos( {field: this.field} );
            ctx.x = originPoint.x;
            ctx.y = originPoint.y;
        };
        if( this.aniOrigin == "center" ){
            ctx.x = this.width/2;
            ctx.y = -(this.height/2);
        }; 
    }

    _getNodeContext( nodeData )
    {
        if( nodeData.shapeType == "circle" ){
            return this._getCircleContext( nodeData );
        }
    }

    _getCircleContext( nodeData )
    {
        let ctx = {
            x : nodeData.x,
            y : nodeData.y,
            r : nodeData.radius,
            fillStyle : nodeData.fillStyle,
            strokeStyle : nodeData.strokeStyle,
            strokeAlpha : nodeData.strokeAlpha,
            lineWidth : nodeData.lineWidth,
            fillAlpha : nodeData.fillAlpha,
            cursor : "pointer"
        };

        if( this.animation && (!this.inited || nodeData.__isNew) ){
            this._setCtxAniOrigin(ctx);
            ctx.r = 1;
        };
        return ctx;
    }

    /**
     * 生长动画
     */
    grow( callback )
    {
        let i = 0;
        let l = this.data.length-1;
        let me = this;
        _.each( this.data , function( nodeData ){
            if( nodeData.__isNew ){
                me._growNode( nodeData, function(){
                    i = i+1;
                    delete nodeData.__isNew;
                    if( i == l ){
                        callback && callback();
                    }
                } );
            };
        } );
    }

    _growNode( nodeData, callback ){
        let me = this;
        nodeData.nodeElement.animate({
            x : nodeData.x,
            y : nodeData.y,
            r : nodeData.radius
        }, {
            onUpdate: function( opt ){
                if( this.labelElement && this.labelElement.context ){
                    let _textPoint = me._getTextPosition( this.labelElement, opt );
                    this.labelElement.context.x = _textPoint.x;
                    this.labelElement.context.y = _textPoint.y;
                };
                if( this.lineElement && this.lineElement.context ){
                    this.lineElement.context.start.y = opt.y+opt.r;
                };
            },
            delay : Math.round(Math.random()*300),
            onComplete : function(){
                callback && callback()
            }
        })
    }


    focusAt( ind ){
        let nodeData = this.data[ ind ];
        if( !this.node.focus.enabled || nodeData.focused ) return;

        let nctx = nodeData.nodeElement.context; 
        nctx.lineWidth = this.node.focus.lineWidth;
        nctx.strokeAlpha = this.node.focus.strokeAlpha;
        nctx.fillAlpha = this.node.focus.fillAlpha;
        nodeData.focused = true;
    }
    
    unfocusAt( ind ){
        let nodeData = this.data[ ind ];
        if( !this.node.focus.enabled || !nodeData.focused ) return;
        let nctx = nodeData.nodeElement.context; 
        nctx.lineWidth = nodeData.lineWidth;
        nctx.strokeAlpha = nodeData.strokeAlpha;
        nctx.fillAlpha = nodeData.fillAlpha;
        nctx.strokeStyle = nodeData.strokeStyle;

        nodeData.focused = false;
    }
    
    selectAt( ind ){
        
        let nodeData = this.data[ ind ];
        if( !this.node.select.enabled || nodeData.selected ) return;
        
        let nctx = nodeData.nodeElement.context; 
        nctx.lineWidth = this.node.select.lineWidth;
        nctx.strokeAlpha = this.node.select.strokeAlpha;
        nctx.fillAlpha = this.node.select.fillAlpha;

        nodeData.selected = true;
    }

    unselectAt( ind ){
        let nodeData = this.data[ ind ];
        if( !this.node.select.enabled || !nodeData.selected ) return;
       
        let nctx = nodeData.nodeElement.context; 

        if( nodeData.focused ) {
            //有e 说明这个函数是事件触发的，鼠标肯定还在node上面
            nctx.lineWidth = this.node.focus.lineWidth;
            nctx.strokeAlpha = this.node.focus.strokeAlpha;
            nctx.fillAlpha = this.node.focus.fillAlpha;
        } else {
            nctx.lineWidth = nodeData.lineWidth;
            nctx.strokeAlpha = nodeData.strokeAlpha;
            nctx.fillAlpha = nodeData.fillAlpha;
        };

        nodeData.selected = false;
    }

    getNodesOfPos( )
    {
        //sat的 getNodesOfPos 一定要有两个点
        let _nodesInfoList = []; //节点信息集合
        return _nodesInfoList;
    }

}

GraphsBase.registerComponent( ScatGraphs, 'graphs', 'scat' );

export default ScatGraphs;
