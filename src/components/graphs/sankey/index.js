/*
* 太阳图
*/
import Canvax from "canvax"
import GraphsBase from "../index"
import sankeyLayout from "../../../layout/sankey/index"

const _ = Canvax._;
const Path = Canvax.Shapes.Path;
const Rect = Canvax.Shapes.Rect;

export default class sankeyGraphs extends GraphsBase
{
    constructor(opt, root)
    {
        super( opt, root );

        this.type = "sankey";

        this.keyField = null; //key, parent指向的值
        this.valueField = 'value';

        
        //坚持一个数据节点的设置都在一个node下面
        this.node = {
            width : 18,
            padding : 10,

            fillStyle : null,
            fillAlpha : 1,

            blurAlpha : 0.4,
            focus : {
                enabled : true,
                lineAlpha : 1
            }

        };

        this.line = {
            strokeStyle: "blue",
            lineWidth : 1,
            lineAlpha : 1,

            blurAlpha : 0.4,
            focus : {
                enabled : true,
                lineAlpha : 1
            }
        };

        this.label = {
            fontColor : "#666",
            fontSize  : 12,
            align : "left",  //left center right
            verticalAlign : "middle", //top middle bottom
            position : "right", //left,center right
            offsetX : 0,
            offsetY : 0
        };

        _.extend( true, this , opt );

        this.init( );
    }

    init()
    {
        this.sprite = new Canvax.Display.Sprite();
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
        

        this.fire("complete");
    }

    _trimGraphs(){

        var me = this;
        var nodes = [];
        var links = [];
        var keyDatas = me.dataFrame.getFieldData( me.keyField );
        var valueDatas = me.dataFrame.getFieldData( me.valueField );

        var nodeMap = {}; //name:ind
        _.each( keyDatas, function( key ){
            var nodeNames = key.split(/[,|]/);
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
            var nodeNames = key.split(/[,|]/);
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
        var me = this;
        var color = style;
        if( _.isArray( color ) ){
            color = color[ ind ];
        }
        if( _.isFunction( color ) ){
            color = color( node );
        }
        if( !color ){
            color = me.root.getTheme( ind );
        }
        return color;
    }

    _drawNodes() {
        
        var nodes = this.data.nodes();
        var me = this;
        _.each(nodes, function(node, i) {
           
            var nodeColor = me._getColor( me.node.fillStyle, node, i );
            var nodeEl = new Rect({
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
        var links = this.data.links();
        var me = this;
        _.each(links, function(link, i) {
            var linkColor = me._getColor( me.line.strokeStyle, link , i);
            var d = me.data.link()(link);
        
            var path = new Path({
                xyToInt : false,
                context: {
                    path: d,
                    fillStyle: linkColor,
                    //lineWidth: Math.max(1, link.dy),
                    globalAlpha: 0.3,
                    cursor:"pointer"
                }
            });

            path.link = link;
            path.hover(function(e){
                this.context.globalAlpha += 0.2;
            } , function(e){
                this.context.globalAlpha -= 0.2;
            });

            me._links.addChild( path );
        });
    }

    _drawLabels(){
        
        var nodes = this.data.nodes();
        var me = this;
        _.each(nodes, function(node){
            var label = new Canvax.Display.Text(node.name , {
                context: {
                    x : node.x+me.data.nodeWidth(),
                    y : node.y+Math.max(node.dy / 2 , 1),
                    fillStyle : me.label.fontColor,
                    fontSize  : me.label.fontSize,
                    textAlign   : me.label.align,
                    textBaseline: me.label.verticalAlign
                }
            });
            me._labels.addChild( label );
        });
    }



}