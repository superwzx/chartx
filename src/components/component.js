import global from "../global"
import Canvax from "canvax"
import {getDefaultProps} from "../utils/tools"

let { event, _ } = Canvax;


export default class Component extends event.Dispatcher
{
    static defaultProps(){
        return {
            enabled : {
                detail : '是否开启该组件',
                default: false
            }
        }
    }

    static registerComponent( compModule, name, type ){
        return global.registerComponent( compModule, name, type );
    }

    //global.getProps 中会用到
    static _isComponentRoot(){ return true }

    constructor(opt, app)
    {
        super( opt, app );
        _.extend( true, this, getDefaultProps( Component.defaultProps() ) , opt );

        this.name = "component"; //组件名称
        this.type = null; //组件子类型，比如 Graphs组件下面的bar,line,scat等

        //this.enabled = false; //是否加载该组件
        this._opt = opt;
        this.app = app; //这个组件挂在哪个app上面（图表）
        
        this.width = 0;
        this.height = 0; //height 不包含margin
        this.pos = {
            x : 0,
            y : 0
        };
        this.margin = {
            top: 0, right: 0, bottom: 0, left: 0
        };
        this.__cid =  Canvax.utils.createId("comp_");

        this.ctx = app.stage.ctx || app.stage.canvas.getContext("2d");
        
    }

    init( opt, data )
    {
              
    }

    draw()
    {

    }

    //组件的销毁
    destroy()
    {

    }

    reset()
    {
        
    }

    // resetData(){
    //     console.log( ( this.type || '' ) + '暂无resetData的实现' );
    // }

    setPosition( pos )
    {
        !pos && ( pos = this.pos );
        pos.x && (this.sprite.context.x = pos.x);
        pos.y && (this.sprite.context.y = pos.y);
    }

    layout()
    {

    }
    
}