import baseAxis from "../../core/axis"
import { _ } from "canvax"
import {getDefaultProps} from "../../utils/tools"

export default class Axis extends baseAxis
{
    static defaultProps(){
        return {
            field : {
                detail : '轴字段配置',
                documentation: '目前x轴的field只支持单维度设置，也就是说只支持一条x轴',
                default: []
            },
            layoutType : {
                detail : '布局方式',
                default: 'rule'
            },
            width : {
                detail : '轴宽',
                default: 0
            },
            height : {
                detail : '轴高',
                default: 0
            },
            enabled : {
                detail : '是否显示轴',
                default: true
            },
            animation: {
                detail: '是否开启动画',
                default: true
            },
            title : {
                detail : '轴名称',
                propertys : {
                    shapeType  : "text",
                    textAlign  : {
                        detail : '水平对齐方式',
                        default: 'center'
                    },
                    textBaseline : {
                        detail : '基线对齐方式',
                        default: 'middle'
                    },
                    strokeStyle : {
                        detail : '文本描边颜色',
                        default: null
                    },
                    lineHeight : {
                        detail : '行高',
                        default: 0
                    },
                    text : {
                        detail : '轴名称的内容',
                        default: ''
                    },
                    fontColor : {
                        detail : '颜色',
                        default: '#999'
                    },
                    fontSize : {
                        detail : '字体大小',
                        default: 12
                    }
                }
            },
            tickLine : {
                detail : '刻度线',
                propertys: {
                    enabled : {
                        detail : '是否开启',
                        default: true
                    },
                    lineWidth : {
                        detail : '刻度线宽',
                        default: 1
                    },
                    lineLength: {
                        detail : '刻度线长度',
                        default: 4
                    },
                    distance: {
                        detail: '和前面一个元素的距离',
                        default: 2
                    },
                    strokeStyle: {
                        detail: '描边颜色',
                        default: '#e6e6e6'
                    }
                }
            },
            axisLine : {
                detail : '轴线配置',
                propertys: {
                    enabled : {
                        detail : '是否有轴线',
                        default: true
                    },
                    position : {
                        detail : '轴线的位置',
                        documentation: 'default在align的位置（left，right），可选 "center" 和 具体的值',
                        default: 'default'
                    },
                    lineWidth: {
                        detail: '轴线宽度',
                        default: 1
                    },
                    strokeStyle: {
                        detail: '轴线的颜色',
                        default: '#e6e6e6'
                    }
                }
            },
            label : {
                detail : '刻度文本',
                propertys: {
                    enabled : {
                        detail : '是否显示刻度文本',
                        default: true
                    },
                    fontColor: {
                        detail: '文本颜色',
                        default: '#999',
                    },
                    fontSize: {
                        detail: '字体大小',
                        default: 10
                    },
                    rotation: {
                        detail: '旋转角度',
                        default: 0
                    },
                    format: {
                        detail: 'label文本的格式化处理函数',
                        default: null
                    },
                    distance: {
                        detail: '和轴线之间的间距',
                        default: 2
                    },
                    textAlign: {
                        detail: '水平方向对齐方式',
                        default: 'center'
                    },
                    lineHeight: {
                        detail: '文本的行高',
                        default: 1
                    },
                    evade: {
                        detail: '是否开启逃避算法,目前的逃避只是隐藏',
                        default: true
                    }
                }
            },
            filter: {
                detail: '过滤函数',
                documentation: '可以用来过滤哪些yaxis 的 节点是否显示已经颜色之类的',
                default: null
            },
            trimLayout: {
                detail: '自定义的显示规则函数',
                documentation: '如果用户有手动的 trimLayout ，那么就全部visible为true，然后调用用户自己的过滤程序',
                default : null
            }
        }
    }

    constructor(opt, dataOrg)
    {
        super(opt, dataOrg);
        _.extend( true, this, getDefaultProps( Axis.defaultProps() ) );
    }

    addValToSection(y)
    {
        //如果y在现有的数据区间里面， 就不需要重新计算和绘制了
        if( this.layoutType == "proportion" ){
            if( y >= this._min && y<= this._max ){
                return;
            }
        };

        //如果y不在当前datasection范围内，那么就要重新绘制
        this.dataSection = [];
        this._addValToSection( y );
        this._initHandle();
        this.draw();

        //然后要检测下依附于这个轴的所有graphs，都要重新绘制
        this._coord.resetGraphsOfAxis( this );
    }
    
}