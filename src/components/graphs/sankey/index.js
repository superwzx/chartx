/*
* 太阳图
*/
import Canvax from "canvax"
import GraphsBase from "../index"
import sankeyLayout from "../../../layout/sankey/index"
import {getDefaultProps} from "../../../utils/tools"

let { _,event } = Canvax;
let Path = Canvax.Shapes.Path;
let Rect = Canvax.Shapes.Rect;

class sankeyGraphs extends GraphsBase
{
    static defaultProps(){
        return {
            keyField: {
                detail: 'key字段',
                default: null
            },
            field: {
                detail: 'value字段',
                default: 'value'
            },
            parentField: {
                detail: 'parent字段',
                default: null
            },
            node : {
                detail: 'node',
                propertys: {
                    width: {
                        detail: '节点宽',
                        default: 18
                    },
                    padding: {
                        detail: '节点间距',
                        default: 10
                    },
                    sort : {
                        detail: '节点排序字段',
                        default: function(a, b) {
                            return a.y - b.y;
                        }
                    },
                    fillStyle: {
                        detail: '节点背景色',
                        default: null
                    }
                }
            },
            line: {
                detail: '线设置',
                propertys: {
                    strokeStyle: {
                        detail: '线颜色',
                        default: 'blue'
                    },
                    alpha: {
                        detail: '线透明度',
                        default: 0.3
                    },
                    focus: {
                        detail: '图形的hover设置',
                        propertys: {
                            enabled: {
                                detail: '是否开启',
                                default: true
                            }
                        }
                    }
                }
            },
            label: {
                detail: '文本设置',
                propertys: {
                    fontColor: {
                        detail: '文本颜色',
                        default: '#666666'
                    },
                    fontSize: {
                        detail: '文本字体大小',
                        default: 12
                    },
                    textAlign: {
                        detail: '水平对齐方式',
                        default: 'left'
                    },
                    verticalAlign: {
                        detail: '垂直对齐方式',
                        default: 'middle'
                    },
                    format: {
                        detail: '文本格式函数',
                        default:null
                    }
                }
            }
        }
    }

    static polyfill( opt ){
        if( opt.valueField ){ 
            //20220304 所有的graph都统一一个field
            opt.field = opt.valueField;
            delete opt.valueField;
        }
        return opt
    }

    constructor(opt, app)
    {
        super( opt, app );
        this.type = "sankey";

        _.extend( true, this, getDefaultProps( sankeyGraphs.defaultProps() ), opt );

        this.init( );
    }

    init()
    {
        this._links = new Canvax.Display.Sprite();
        this._nodes = new Canvax.Display.Sprite();
        this._labels = new Canvax.Display.Sprite();

        this.sprite.addChild(this._links);
        this.sprite.addChild(this._nodes);
        this.sprite.addChild(this._labels);
    }


    draw( opt )
    {
        
        !opt && (opt ={});
        _.extend( true, this , opt );

        this.data = this._trimGraphs();

        this._widget();
        
        this.sprite.context.x = this.origin.x;
        this.sprite.context.y = this.origin.y;

        this.fire("complete");
    }

    _trimGraphs(){

        let me = this;
        let nodes = [];
        let links = [];
        let keyDatas = me.dataFrame.getFieldData( me.keyField );
        let valueDatas = me.dataFrame.getFieldData( me.field );
        let parentFields = me.dataFrame.getFieldData( me.parentField );

        let nodeMap = {}; //name:ind
        _.each( keyDatas, function( key, i ){
            let nodeNames = [];
            if( me.parentField ){
                nodeNames.push( parentFields[i] );
            };
            nodeNames = nodeNames.concat( key.split(/[|]/) );

            _.each( nodeNames, function( name ){
                if( nodeMap[ name ] === undefined ){
                    nodeMap[ name ] = nodes.length;
                    nodes.push( {
                        name : name
                    } );
                }
            } );
        } );


        _.each( keyDatas, function( key , i ){
            //let nodeNames = key.split(/[,|]/);
            let nodeNames = [];
            if( me.parentField ){
                nodeNames.push( parentFields[i] );
            };
            nodeNames = nodeNames.concat( key.split(/[|]/) );

            if( nodeNames.length == 2 ){
                links.push({
                    source : nodeMap[ nodeNames[0] ],
                    target : nodeMap[ nodeNames[1] ],
                    value  : valueDatas[i] 
                })
            }
        } );

        return sankeyLayout()
            .nodeWidth( this.node.width )
            .nodePadding( this.node.padding )
            .nodeSort( this.node.sort )
            .size([this.width, this.height])
            .nodes(nodes)
            .links(links)
            .layout(16);
 
    }

    _widget(){
        this._drawNodes();
        this._drawLinks();
        this._drawLabels();
    }

    _getColor( style, node, ind ){
        let me = this;
        let color = style;
        if( _.isArray( color ) ){
            color = color[ ind ];
        }
        if( _.isFunction( color ) ){
            color = color( node );
        }
        if( !color ){
            color = me.app.getTheme( ind );
        }
        return color;
    }

    _drawNodes() {
        
        let nodes = this.data.nodes();
        let me = this;
        _.each(nodes, function(node, i) {

            node.field = me.field;
           
            let nodeColor = me._getColor( me.node.fillStyle, node, i );
            let nodeEl = new Rect({
                xyToInt:false,
                context: {
                    x: node.x,
                    y: node.y,
                    width: me.data.nodeWidth(),
                    height: Math.max(node.dy , 1),
                    fillStyle: nodeColor
                }
            });
            nodeEl.data = node;

            me._nodes.addChild(nodeEl);
        });
    }

    _drawLinks(){
        let links = this.data.links();
        let me = this;
        _.each(links, function(link, i) {

            

            let linkColor = me._getColor( me.line.strokeStyle, link , i);
            let d = me.data.link()(link);
        
            let _path = new Path({
                xyToInt : false,
                context: {
                    path: d,
                    fillStyle: linkColor,
                    //lineWidth: Math.max(1, link.dy),
                    globalAlpha: me.line.alpha,
                    cursor:"pointer"
                }
            });

            _path.__glpha = me.line.alpha;

            _path.link = link;

            _path.on( event.types.get(), function(e) {
                
                if( me.line.focus.enabled ){
                    if( e.type == 'mouseover' ){
                        this.__glpha += 0.1;
                    };
                    if( e.type == 'mouseout' ){
                        this.__glpha -= 0.1;
                    };
                };
                
                let linkData = this.link;

                //type给tips用
                linkData.type = "sankey";
                link.field = me.field;
                link.__no__name = true

                e.eventInfo = {
                    trigger : me.node,
                    title : linkData.source.name+" <span style='display:inline-block;margin-left:4px;position:relative;top:-0.5px;font-size:16px;left:-3px;'>></span> "+linkData.target.name,
                    nodes : [ linkData ]
                };
    
                //fire到root上面去的是为了让root去处理tips
                me.app.fire( e.type, e );
             });


            me._links.addChild( _path );
        });
    }

    _drawLabels(){
        
        let nodes = this.data.nodes();
        let me = this;
        _.each(nodes, function(node){
            let textAlign = me.label.textAlign;

            let x = node.x+me.data.nodeWidth()+4;

            /*
            if( x > me.width/2 ){
                x  = node.x - 4;
                textAlign = 'right';
            } else {
                x += 4;
            };
            */

            let y = node.y + Math.max(node.dy / 2 , 1);

            let txt = me.label.format ? me.label.format( node.name, node ) : node.name;

            let label = new Canvax.Display.Text( txt , {
                context: {
                    x : x,
                    y : y,
                    fillStyle    : me.label.fontColor,
                    fontSize     : me.label.fontSize,
                    textAlign    : textAlign,
                    textBaseline : me.label.verticalAlign
                }
            });
            me._labels.addChild( label );

            if( label.getTextWidth()+x > me.width ){
                label.context.x = node.x - 4;
                label.context.textAlign = 'right';
            };

        });
    }

}

GraphsBase.registerComponent( sankeyGraphs, 'graphs', 'sankey' );

export default sankeyGraphs;
