/*
* 太阳图
*/
import Canvax from "canvax"
import GraphsBase from "../index"
import Partition from "../../../layout/partition"
import {getDefaultProps} from "../../../utils/tools"

let { _,event } = Canvax;
let Sector = Canvax.Shapes.Sector;

class sunburstGraphs extends GraphsBase
{
    static defaultProps(){
        return {
            keyField: {
                detail: 'key字段',
                default: ''
            },
            field: {
                detail: 'value字段',
                default: ''
            },
            parentKeyField: {
                detail: 'parent字段',
                default: ''
            },
            node: {
                detail: '单个节点图形设置',
                propertys: {
                    strokeStyle: {
                        detail: '描边色',
                        default: '#ffffff'
                    },
                    lineWidth: {
                        detail: '描边线宽',
                        default:1
                    },
                    strokeAlpha: {
                        detail: '描边边框透明度',
                        default: 1
                    },
                    fillStyle: {
                        detail: '背景色',
                        default: null
                    },
                    fillAlpha: {
                        detail: '背景透明度',
                        default: 1
                    },
                    blurAlpha: {
                        detail: '非激活状态透明度',
                        documentation: '比如选中其中一项，其他不先关的要降低透明度',
                        default: 0.4
                    }
                }
            }
        }
    }

    static polyfill( opt ){
        return opt
    }

    constructor(opt, app)
    {
        super( opt, app );
        this.type = "sunburst";

        _.extend( true, this , getDefaultProps(sunburstGraphs.defaultProps()), opt );

        this.data = []; //布局算法布局后的数据
        this.dataGroup = []; //data数据按照深度的分组

        this.init();
    }

    init()
    {

    }


    draw( opt )
    {
        !opt && (opt ={});
        _.extend( true, this , opt );

        this.data = this._trimGraphs();
        this.dataGroup = this._getDataGroupOfDepth();

        this._widget();
        
        this.sprite.context.x = this.width / 2 + this.origin.x;
        this.sprite.context.y = this.height / 2  + this.origin.y;

        this.fire("complete");
    }

    _trimGraphs(){

        let me = this;
        let radius = parseInt( Math.min( this.width, this.height ) / 2 );
        let partition = Partition()
            .sort(null)
            .size([2 * Math.PI, radius * radius])
            .value(function(d) {
                //return 1; 
                return  d[ me.field ] //d.size
            });


        //安装深度分组
        let _treeData = this._tansTreeData();
        this.data = partition( _treeData , 0 );
        
        this.data.forEach( item => {
            item.field = this.field;
        });

        return this.data;
    }

    _getDataGroupOfDepth(){
        let map = {};
        _.each( this.data, function( d ){
            map[ d.depth ] = [];
        } );
        _.each( this.data, function( d ){
            map[ d.depth ].push( d );
        } );

        let arr = [];
        for( let p in map ){
            arr.push( map[ p ] );
        }
        
        return arr;
    }

    _tansTreeData()
    {
        let dataFrame = this.dataFrame;
        let treeData = {};

        let keyData = dataFrame.getFieldData( this.keyField );
        let valueData = dataFrame.getFieldData( this.field );
        let parentData = dataFrame.getFieldData( this.parentKeyField ); //用parentField去找index

        function findChild( obj, parent , ki ){
            let parentKey = parent ? parent.name : undefined;
            for( let i=(ki || 0); i<parentData.length; i++ ){
                let key = parentData[i];
                if( !key && key !== 0 ){
                    key = undefined
                };
                if( parentKey === key ){
                    obj.name = keyData[i];
                    obj.iNode = i;
                    let value = valueData[i];
                    if( !!value || value === 0 ){
                        obj.value = value;
                    };
                    //然后寻找到parent.key === obj.name的，作为children
                    _.each( parentData, function( key, ki ){
                        if( key === obj.name ){
                            //这个是obj的children
                            if( !obj.children ){
                                obj.children = [];
                            };
                            let child = {};
                            findChild(child, obj, ki)
                            obj.children.push( child );
                        }
                    } );

                    break;
                };
            };
        };
        findChild( treeData );
        
        return treeData;
    }

    _widget(){

        let me = this;

        _.each( this.dataGroup , function( group , g ){
            _.each( group , function( layoutData, i ){

                if( !layoutData.depth ){
                    //最中间的大圆隐藏
                    return;
                };

                let r = Math.sqrt( layoutData.y + layoutData.dy );
                let sectorContext = {
                    r0         : Math.sqrt( layoutData.y ),
                    r          : Math.sqrt( layoutData.y )+2,
                    startAngle : layoutData.x * 180 / Math.PI,
                    endAngle   : (layoutData.x + layoutData.dx) * 180 / Math.PI, //secc.endAngle,
                    
                    fillStyle  : layoutData.color || me.app.getTheme( layoutData.iNode ),
                    strokeStyle: me.node.strokeStyle,
                    lineWidth  : me.node.lineWidth,
                    globalAlpha: 0
                };

                let sector = new Sector({
                    id : "sector_"+g+"_"+i,
                    context : sectorContext
                });

                sector.layoutData = layoutData;
                layoutData.sector = sector;
                layoutData.group = group; //所在的group

                me.sprite.addChild( sector );

                sector.hover(function(){
                    me._focus( layoutData , group );
                } , function(){
                    me._unfocus( layoutData , group );
                });
                sector.on(event.types.get(), function(e) {
                    //fire到root上面去的是为了让root去处理tips
                    e.eventInfo = {
                        trigger : me.node,
                        iNode : layoutData.iNode
                    };
                    me.app.fire( e.type, e );
                });

                if( g<=1 ){
                    sector.context.r = r;
                    sector.context.globalAlpha = 1;
                } else {
                    //从第二组开始，延时动画出现
                    setTimeout(function(){
                        if( !sector.context ){
                            //这个时候可能图表已经被销毁了
                            return;
                        }
                        sector.context.globalAlpha = 1;
                        sector.animate({
                            r : r
                        } , {
                            duration : 350
                        })
                    } , 350*(g-1))
                }

            } );

        } )
    }

    getNodesAt( iNode ){
        let nodes = [];
        if( iNode !== undefined ){
            let node = _.find( this.data, function( item ){
                return item.iNode == iNode
            } );

            //type给到tips用主要
            node.type = 'sunburst';

            node && nodes.push( node );
        };
        return  nodes;
    }

    _focus(layoutData, group){
        let me = this;
        _.each( group , function( d ){
            if( d !== layoutData ){
                d.sector.context.globalAlpha = me.node.blurAlpha;
                me._focusChildren( d, function( child ){
                    child.sector.context.globalAlpha = me.node.blurAlpha;
                } );
            }
        } );
        me._focusParent( layoutData );
    }

    _unfocus(){
        _.each( this.data , function( d ){
            d.sector && (d.sector.context.globalAlpha = 1);
        } );
    }

    _focusChildren(d, callback){
        let me = this;
        if(d.children && d.children.length){
            _.each( d.children , function(child){
                callback( child );
                me._focusChildren( child, callback );
            } );
        }
    }

    _focusParent(layoutData){
        let me = this;
        if( layoutData.parent && layoutData.parent.sector && layoutData.parent.group ){
            _.each( layoutData.parent.group , function( d ){
                if( d === layoutData.parent ){
                    d.sector.context.globalAlpha = 1;
                    me._focusParent( layoutData.parent );
                } else {
                    d.sector.context.globalAlpha = me.node.blurAlpha;
                }
            } );
        }
    }
}

GraphsBase.registerComponent( sunburstGraphs, 'graphs', 'sunburst' );
export default sunburstGraphs;
