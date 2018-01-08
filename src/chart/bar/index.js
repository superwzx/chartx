import Chart from "../descartes"
import Canvax from "canvax2d"

import {numAddSymbol} from "../../utils/tools"
import Coordinate from "../../components/descartes/index"
import Graphs from "./graphs"
import Tips from "../../components/tips/index"

const _ = Canvax._;

export default class Bar extends Chart
{
    constructor( node, data, opts )
    {
        super( node, data, opts );
        this.type = "bar";
        
        //如果需要绘制百分比的柱状图
        if (opts.graphs && opts.graphs.proportion) {
            this._initProportion(node, data, opts);
        } else {
            _.extend( true, this, opts);
        };

        this.dataFrame = this.initData(data);

        //一些继承自该类的 constructor 会拥有_init来做一些覆盖，比如横向柱状图,柱折混合图...
        this._init && this._init(node, data, opts);
        this.draw();
    }
    
    
    _initModule(opt)
    {
        var me = this
        //首先是创建一个坐标系对象
        this._coordinate = new Coordinate( this.coordinate, this );
        this.coordinateSprite.addChild( this._coordinate.sprite );

        _.each( this.graphs , function( graphs ){
            var _g = new Graphs( graphs, me );
            me._graphs.push( _g );
            me.graphsSprite.addChild( _g.sprite );
        } );
        
        this._tips = new Tips(this.tips, this.canvax.domView);
        this.stageTips.addChild(this._tips.sprite);
    }

    //比例柱状图
    _initProportion(node, data, opts) 
    {
        !opts.tips && (opts.tips = {});

        opts.tips = _.extend(true, {
            content: function(info) {
                
                var str = "<table style='border:none'>";
                var self = this;
                _.each(info.nodesInfoList, function(node, i) {
                    str += "<tr style='color:" + (node.color || node.fillStyle) + "'>";
                   
                    var tsStyle="style='border:none;white-space:nowrap;word-wrap:normal;'";
                
                    str += "<td "+tsStyle+">" + node.field + "：</td>";
                    str += "<td "+tsStyle+">" + numAddSymbol(node.value);
                    if( node.vCount ){
                        str += "（" + Math.round(node.value / node.vCount * 100) + "%）";
                    };

                    str +="</td></tr>";
                });
                str += "</table>";
                return str;
            }
        } , opts.tips );

        _.extend(true, this, opts);
        _.each( _.flatten( [this.coordinate.yAxis] ) ,function( yAxis ){
            _.extend(true, yAxis, {
                dataSection: [0, 20, 40, 60, 80, 100],
                text: {
                    format: function(n) {
                        return n + "%"
                    }
                }
            });
        });
       
        !this.graphs && (this.graphs = {});
        _.extend(true, this.graphs, {
            bar: {
                radius: 0
            }
        });
    }

}