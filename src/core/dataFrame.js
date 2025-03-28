/**
* 把原始的数据
* field1 field2 field3
*   1      2      3
*   2      3      4
* 这样的数据格式转换为内部的
* [{field:'field1',index:0,data:[1,2]} ......]
* 这样的结构化数据格式。
*/
import {_} from "canvax"

//如果应用传入的数据是[{name:name, sex:sex ...} , ...] 这样的数据，就自动转换为chartx需要的矩阵格式数据
function parse2MatrixData( list )
{
    if( list === undefined || list === null ){
        list = [];
    };
    //检测第一个数据是否为一个array, 否就是传入了一个json格式的数据
    if( list.length > 0 && !_.isArray( list[0] ) ){
        let newArr = [];
        let fields = [];
        let fieldNum = 0;
        for( let i=0,l=list.length ; i<l ; i++ ){
            let row = list[i];
            if( i == 0 ){
                for( let f in row ){
                    fields.push( f ); 
                };
                newArr.push( fields );
                fieldNum = fields.length;
            };
            let _rowData = [];
            for( let ii=0 ; ii<fieldNum ; ii++ ){
                _rowData.push( row[ fields[ii] ] );
            };
            newArr.push( _rowData );
        };
        
        return newArr;
    } else {
        return list
    }
}
function parse2JsonData( list ){
    let newArr = list;
    //检测第一个数据是否为一个array, 否就是传入了一个json格式的数据
    if( list.length > 0 && _.isArray( list[0] ) ){
        newArr = [];
        let fields = list[0];
        let fl = fields.length;

        for( let i=1,l=list.length ; i<l ; i++ ){
            let obj = {};
            for( let fi=0; fi<fl; fi++ ){
                obj[ fields[fi] ] = list[i][fi];
            };
            newArr.push( obj );
        };
        
        return newArr;
    };
}


export default function( dataOrg, opt ){

    let dataFrame  = {        //数据框架集合
        length        : 0,
        org           : [],   //最原始的数据，一定是个行列式，因为如果发现是json格式数据，会自动转换为行列式
        jsonOrg       : [],   //原始数据的json格式

        data          : [],   //最原始的数据转化后的数据格式(range取段过后的数据)：[o,o,o] o={field:'val1',index:0,data:[1,2,3]}

        getRowDataAt  : _getRowDataAt,
        getRowDataOf  : _getRowDataOf,
        getFieldData  : _getFieldData,
        getDataOrg    : getDataOrg,

        resetData     : _resetData,

        fields        : [],
        range         : {
            start     : 0,
            end       : 0
        },
        filters       : {}    //数据过滤器，在range的基础上
    };

    function _init( dataOrg ){

        //数据的最外面一定是个数组
        if( !Array.isArray( dataOrg ) ){
            dataOrg = [ dataOrg ]
        }

        if( !dataOrg || dataOrg.length == 0 ){
            return dataFrame
        };

        //检测第一个数据是否为一个array, 否就是传入了一个json格式的数据
        if( dataOrg.length > 0 && !_.isArray( dataOrg[0] ) ){
            dataFrame.jsonOrg = dataOrg;
            dataOrg = parse2MatrixData( dataOrg );
            dataFrame.org = dataOrg;
        } else {
            dataFrame.org = dataOrg;
            dataFrame.jsonOrg = parse2JsonData( dataOrg );
        };

        //设置好数据区间end值
        dataFrame.range.end = dataOrg.length - 1 - 1;
        //然后检查opts中是否有dataZoom.range
        if( opt ){ 
            //兼容下dataZoom 和 datazoom 的大小写配置
            let _datazoom = opt.dataZoom || opt.datazoom;
            _datazoom && _datazoom.range && _.extend( dataFrame.range, _datazoom.range );
        };

        if( dataOrg.length && dataOrg[0].length && !~dataOrg[0].indexOf("__index__") ){
            //如果数据中没有用户自己设置的__index__，那么就主动添加一个__index__，来记录元数据中的index
            for( let i=0,l=dataOrg.length; i<l; i++ ){
                if( !i ){
                    dataOrg[0].push( "__index__" );
                } else {
                    dataOrg[i].push( i-1 );
                    dataFrame.jsonOrg[i-1][ "__index__" ] = i-1;
                }
            }
        };

        dataFrame.fields = dataOrg[0] ? dataOrg[0] : []; //所有的字段集合;
        
        return dataFrame;
    }

    function _resetData( dataOrg ){

        if( dataOrg ){
            //重置一些数据
            dataFrame.org = [];
            dataFrame.jsonOrg = [];
            dataFrame.fields = [];
            dataFrame.data = [];

            let preRange = _.extend( true, {}, dataFrame.range );
            let preLen = dataFrame.length; //设置数据之前的数据长度

            _init( dataOrg );
            dataFrame.data = _getDataAndSetDataLen();

            //如果之前是有数据的情况，一些当前状态恢复到dataFrame里去 begin
            if( preLen !== 0 ){
                if( opt && opt.dataZoom && opt.dataZoom.range ){
                    //如果有配置过dataZoom.range， 那么就要回复最近一次的range
                    _.extend( true, dataFrame.range, preRange );
                    if( dataFrame.range.end > dataFrame.length-1 ){
                        dataFrame.range.end = dataFrame.length-1
                    };
                    if( dataFrame.range.start > dataFrame.length-1 || dataFrame.range.start > dataFrame.range.end ){
                        dataFrame.range.start = 0;
                    };
                }

                //一些当前状态恢复到dataFrame里去 end  
            } else {
                //如果之前是没有数据的，那么就不用管了
            }
             
        } else {
            //就算没有dataOrg，但是data还是要重新构建一边的，因为可能dataFrame上面的其他状态被外界改变了
            //比如datazoom修改了dataFrame.range
            dataFrame.data = _getDataAndSetDataLen();
        }
    };

    function _getDataAndSetDataLen(){
        let total = [];//已经处理成[o,o,o]   o={field:'val1',index:0,data:[1,2,3]}
        for(let a = 0, al = dataFrame.fields.length; a < al; a++){
            let o = {};
            o.field = dataFrame.fields[a];
            o.index = a;
            o.data  = [];
            total.push(o);
        };

        let rows = _getValidRows(function( rowData ){
            _.each( dataFrame.fields, function( _field ){
                let _val = rowData[ _field ];

                if( opt.coord && 
                    ( 
                        (opt.coord.xAxis && _field == opt.coord.xAxis.field && opt.coord.xAxis.layoutType != 'proportion') || 
                        (opt.coord.aAxis && _field == opt.coord.aAxis.field) 
                    )
                ){
                    //如果是x轴， 并且轴的layoutType不是 proportion ，这两者就不需要强制转换为number
                    
                } else {
                    //其他数据都需要保证是number
                    //如果是可以转换为number的数据就尽量转换为number
                    if( !isNaN( _val ) && _val !== "" && _val !== null ){
                        _val = Number( _val );
                    };
                }
                

                let gData = _.find( total, function( g ){
                    return g.field == _field;
                } );
                gData && gData.data.push( _val );
            } );
        });

        //到这里保证了data一定是行列式
        dataFrame.length = rows.length;

        return total;
    };

    function _getValidRows( callback ){
        let validRowDatas = [];
        
        _.each( dataFrame.jsonOrg.slice( dataFrame.range.start, dataFrame.range.end+1 ), function( rowData ){
            let validRowData=true;
            if( _.keys(dataFrame.filters).length ){
                _.each( dataFrame.filters, function( filter ){
                    if( _.isFunction( filter ) && !filter( rowData ) ){
                        validRowData = false;
                        return false;
                    };
                } );
            };

            if( validRowData ){
                callback && callback( rowData );
                validRowDatas.push( rowData );
            };

        } );
        return validRowDatas;
    };

    //会按照$field的格式转换成对应一一对应的 org 的结构
    function getDataOrg( $field, format, totalList , lev){
        
        if( !lev ) lev = 0;

        let arr = totalList || _getDataAndSetDataLen();
        if( !arr ){
            return;
        }
        if( !format ){
            format = function( e ){ return e }
        };

        function _format( d ){
            for( let i=0,l=d.length; i<l; i++ ){
                d[i] = format( d[i] );
            };
            return d;
        };

        if( !_.isArray($field) ){
            $field = [$field];
        };

        //这个时候的arr只是totalList的过滤，还没有完全的按照$field 中的排序
        let newData = [];
        for( let i=0,l=$field.length; i<l ; i++ ){
            let fieldInTotal = false; //如果该field在数据里面根本没有，那么就说明是无效的field配置
            if( _.isArray($field[i]) ){
                newData.push( getDataOrg( $field[i], format, totalList , lev+1) );
            } else {
            
                let _fieldData = newData;
                if( !lev ){
                    _fieldData = [];
                };
                for( let ii=0,iil=arr.length ; ii<iil ; ii++ ){
                     if( $field[i] == arr[ii].field ){
                         fieldInTotal = true;
                         _fieldData.push( _format( arr[ii].data ) );
                         break;
                     }
                };
                if( !lev ){
                    newData.push( _fieldData );
                };
            };
        }
        return newData;
    };

    /*
     * 获取某一行数据,当前dataFrame.data中
    */ 
    function _getRowDataAt(index){
        let o = {}
        let data = dataFrame.data
        for(let a = 0; a < data.length; a++){
            o[data[a].field] = data[a].data[ index ]
        };
        return o;
    }

    /**
     * obj => {uv: 100, pv: 10 ...}
     */
    function _getRowDataOf( obj ){
        !obj && (obj={});
        let arr = [];

        let expCount = 0;
        for( let p in obj ){
            expCount++;
        };

        if( expCount ){
            for( let i=dataFrame.range.start; i<= dataFrame.range.end; i++ ){
                let matchNum = 0;
                _.each( dataFrame.data, function( fd ){
                    if( fd.field in obj && fd.data[i] == obj[ fd.field ] ){
                        matchNum++;
                    }
                } );
                if( matchNum == expCount ){
                    //说明这条数据是完全和查询
                    arr.push( _getRowDataAt(i) );
                };
            };
        };

        return arr;
    }

    function _getFieldData( field ){
        let list = [];
        let _f = _.find( dataFrame.data, function( obj ){
            return obj.field == field;
        } );
        _f && (list = _f.data)

        return list;
    }

    _init( dataOrg );
    dataFrame.data = _getDataAndSetDataLen();

    return dataFrame;
}