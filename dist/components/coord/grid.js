"use strict";!function(e,t){if("function"==typeof define&&define.amd)define(["exports","canvax","mmvis"],t);else if("undefined"!=typeof exports)t(exports,require("canvax"),require("mmvis"));else{var i={};t(i,e.canvax,e.mmvis),e.undefined=i}}(void 0,function(e,t,p){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i,a=(i=t)&&i.__esModule?i:{default:i};function l(e){return(l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function n(e){return(n=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function o(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function r(e,t){for(var i=0;i<t.length;i++){var l=t[i];l.enumerable=l.enumerable||!1,l.configurable=!0,"value"in l&&(l.writable=!0),Object.defineProperty(e,l.key,l)}}function s(e,t,i){return t&&r(e.prototype,t),i&&r(e,i),e}function d(e,t){return(d=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var y=a.default.Shapes.Line,c=a.default.Shapes.Rect,f=(function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&d(e,t)}(u,p.event.Dispatcher),s(u,null,[{key:"defaultProps",value:function(){return{enabled:{detail:"是否开启grid绘制",default:!0},line:{detail:"网格线条配置",propertys:{xDimension:{detail:"一维方向的网格线",propertys:{enabled:{detail:"是否开启",default:!0},data:[],lineType:{detail:"线的样式，虚线或者实现",default:"solid"},lineWidth:{detail:"线宽",default:1},strokeStyle:{detail:"线颜色",default:"#f0f0f0"}}},yDimension:{detail:"二维方向的网格线",propertys:{enabled:{detail:"是否开启",default:!1},data:[],lineType:{detail:"线的样式，虚线或者实现",default:"solid"},lineWidth:{detail:"线宽",default:1},strokeStyle:{detail:"线颜色",default:"#f0f0f0"}}}}},fill:{detail:"背景色配置",propertys:{xDimension:{detail:"以为方向的背景色块，x方向",propertys:{enabled:{detail:"是否开启",default:!1},splitVals:{detail:"从x轴上面用来分割区块的vals",default:null},fillStyle:{detail:"背景颜色",default:null},alpha:{detail:"背景透明度",default:null}}},yDimension:{detail:"以为方向的背景色块，y方向",propertys:{enabled:{detail:"是否开启",default:!1},splitVals:{detail:"从x轴上面用来分割区块的vals",default:null},fillStyle:{detail:"背景颜色",default:null},alpha:{detail:"背景透明度",default:null}}}}}}}}]),s(u,[{key:"init",value:function(e){p._.extend(!0,this,e),this.sprite=new a.default.Display.Sprite}},{key:"setX",value:function(e){this.sprite.context.x=e}},{key:"setY",value:function(e){this.sprite.context.y=e}},{key:"draw",value:function(e){p._.extend(!0,this,e),this._widget(),this.setX(this.pos.x),this.setY(this.pos.y)}},{key:"clean",value:function(){this.sprite.removeAllChildren()}},{key:"reset",value:function(e){this.sprite.removeAllChildren(),this.draw(e)}},{key:"_widget",value:function(){var d=this;if(this.enabled){var e,f=d._coord._yAxis[0],u=d._coord._xAxis;this.fillSp=new a.default.Display.Sprite,this.sprite.addChild(this.fillSp),p._.each([d.fill.xDimension,d.fill.yDimension],function(n,a){var e=a?f:u,t=[];if(n.enabled){n.splitVals?(t=[e.dataSection[0]].concat(p._.flatten([n.splitVals]))).push(e.dataSection.slice(-1)[0]):t=e.dataSection;var i=[];if(2<=t.length){for(var l=[],o=0,r=t.length;o<r;o++){var s=e.getPosOf({val:t[o]});if(l.length){if(1==l.length){if(s-l[0]<1)continue;l.push(s),i.push(l),l=[l[1]]}}else l.push(s)}p._.each(i,function(e,t){var i={fillStyle:d.getProp(n.fillStyle,t,"#000"),fillAlpha:d.getProp(n.alpha,t,t%2*.02)};a?(i.x=0,i.y=-e[0],i.width=d.width,i.height=-(e[1]-e[0])):(i.x=e[0],i.y=0,i.width=e[1]-e[0],i.height=-d.height);var l=new c({context:i});d.fillSp.addChild(l)})}}}),d.xAxisSp=new a.default.Display.Sprite,d.sprite.addChild(d.xAxisSp),d.yAxisSp=new a.default.Display.Sprite,d.sprite.addChild(d.yAxisSp);for(var t=0,i=(e=f.layoutData).length;t<i;t++)if((n=e[t]).visible){var l=new y({id:"back_line_"+t,context:{y:n.y,lineType:d.getProp(d.line.xDimension.lineType,t,"solid"),lineWidth:d.getProp(d.line.xDimension.lineWidth,t,1),strokeStyle:d.getProp(d.line.xDimension.strokeStyle,t,"#f0f0f0"),visible:!0}});d.line.xDimension.enabled&&(d.xAxisSp.addChild(l),l.context.start.x=0,l.context.end.x=d.width)}for(t=0,i=(e=u.layoutData).length;t<i;t++){var n=e[t];l=new y({context:{x:n.x,start:{x:0,y:0},end:{x:0,y:-d.height},lineType:d.getProp(d.line.yDimension.lineType,t,"solid"),lineWidth:d.getProp(d.line.yDimension.lineWidth,t,1),strokeStyle:d.getProp(d.line.yDimension.strokeStyle,t,"#f0f0f0"),visible:!0}}),d.line.yDimension.enabled&&d.yAxisSp.addChild(l)}}}},{key:"getProp",value:function(e,t,i){var l=i;return null!=e&&null!=e&&((p._.isString(e)||p._.isNumber(e))&&(l=e),p._.isFunction(e)&&(l=e.apply(this,[t,i])),p._.isArray(e)&&(l=e[t])),l}}]),u);function u(e,t){var i;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,u),i=function(e,t){return!t||"object"!==l(t)&&"function"!=typeof t?o(e):t}(this,n(u).call(this,e,t)),p._.extend(!0,o(i),(0,p.getDefaultProps)(u.defaultProps())),i.width=0,i.height=0,i._coord=t,i.pos={x:0,y:0},i.sprite=null,i.xAxisSp=null,i.yAxisSp=null,i.init(e),i}e.default=f});