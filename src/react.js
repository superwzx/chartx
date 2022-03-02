//https://babeljs.io/repl/#?babili=false&evaluate=true&lineWrap=false&presets=es2015%2Creact%2Cstage-0&code=function%20hello()%20%7B%0A%20%20return%20%3Cdiv%3EHello%20world!%3C%2Fdiv%3E%3B%0A%7D
//用上面的地址转换成es的react模块，不用jsx
import React from "react"
import Chartx from "./index"

class chartxReact extends React.Component {

  static defaultProps = {
    chartId   : null, //chartpark项目中对应的图表id
    width     : null, //支持 100px 100em 等字符串，也支持100number，会主动加上px，也支持小数0.5，主动变成50%
    height    : null, //功能同上
    className : ""  , //附加在dom容器上面的className，有一个默认的 .chartx-react
    options   : {}  , //用户传入的options配置，非必填，和chartId至少要有一个
    data      : []  , //图表渲染数据
    variables : {}    //图表变量
  }

  constructor(props) {
    super(props);

    this.myRef = React.createRef();

    this.chart = null;

    this.chartOptions = this.getChartOptions(); //最终用来渲染的options，如果有props.chartId和props.options，两者会做一次extend

  }


  /**
   * 组件update完毕，reset对应的图表实例
   */
  componentDidUpdate(prevProps, prevState){

    const dom = this.myRef.current;
    let newChartOptions = this.getChartOptions(this.props);
    let data = this.props.data;

    if( !this.chart ){
        if (JSON.stringify( newChartOptions ) === '{}' ) {
            return false; // 如果为空,返回false
        };
        this.createChart( dom, data, newChartOptions );
        return;
    };

    if (prevProps.width != this.props.width || prevProps.height != this.props.height || prevProps.className != this.props.className) {
        this.chart && this.chart.resize();
    };

    let optionsChange = (JSON.stringify( this.getChartOptions(prevProps) ) != JSON.stringify(newChartOptions));
    let dataChange = (JSON.stringify( data ) != JSON.stringify(prevProps.data));
    if (optionsChange) {
        this.chartOptions = newChartOptions;
        this.chart && this.chart.reset(newChartOptions, data);
    } else if (dataChange) {
        this.chart &&this.chart.resetData(data);
    };

  }

  /**
   * 构建一个用来渲染图表的容易dom节点
   */
  render() {
    /*
    let styles = this.getStyles();
    return (
      <div ref={this.myRef} 
      className={"chartx-react " + this.props.className} 
      style={styles}
      ></div>
    );
    */

    let styles = this.getStyles();
    return React.createElement("div", { ref: this.myRef,
      className: "chartx-react " + (this.props.className || ""),
      style: styles
    });
  }

  /**
   * 组件首次转载完毕
   * create对应的图表
   */
  componentDidMount(){
   
    const dom   = this.myRef.current;
    let data    = this.props.data;

    if (JSON.stringify(this.chartOptions) === '{}') {
        //配置都没有，那么就不绘制图表了
        return false;
    };
    
    this.createChart( dom, data, this.chartOptions );

  }

  createChart( dom, data, options ){

    this.chart = Chartx.create( dom, data, options );

    if( !Chartx._registWindowOnResize && window && window.addEventListener ){
        //整个Chartx只需要注册一次window.onresize就够了
        window.addEventListener("resize", (e)=>{
            Chartx.resize();
        }, false);
        Chartx._registWindowOnResize = true;
    };

  }

  /**
   * 组件销毁
   * 销毁对应的图表
   */
  componentWillUnmount(){
    this.chart && this.chart.destroy();
  }

  getChartOptions( props ){

    let options = props ? props.options : this.props.options;
    let variables = props ? props.variables : this.props.variables;
    let data  = props ? props.data : this.props.data;
    if( this.props.chartId ){
        options = Chartx.getOptions( this.props.chartId , options, data, variables );
    };
    return options;

  }

  getStyles(){
    let styles = {};
    this.setSize("width" , styles);
    this.setSize("height" , styles);
    return styles;
  }

  setSize( sizeType , styles ){
    if( this.props[sizeType] != null ){
      let _width = this.props[sizeType];
      if( !isNaN( _width ) ){
          if( _width < 1 ){
            styles[sizeType] = _width*100+"%";
          } else {
            styles[sizeType] = _width+"px";
          }
      } else {
        if( typeof _width == "string" ){
          styles[sizeType] = _width;
        }
      }
    };
  }

  getOptions( chartPark_cid ){
    return Chartx.getOptions( chartPark_cid );
  }

}

export default chartxReact;