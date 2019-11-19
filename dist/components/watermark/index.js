"use strict";!function(t,e){if("function"==typeof define&&define.amd)define(["exports","canvax","mmvis","../component"],e);else if("undefined"!=typeof exports)e(exports,require("canvax"),require("mmvis"),require("../component"));else{var n={};e(n,t.canvax,t.mmvis,t.component),t.undefined=n}}(void 0,function(t,e,o,n){Object.defineProperty(t,"__esModule",{value:!0});var u=r(e);function r(t){return t&&t.__esModule?t:{default:t}}function i(t){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function a(t){return(a=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function f(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function l(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function c(t,e,n){return e&&l(t.prototype,e),n&&l(t,n),t}function p(t,e){return(p=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var s=(function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&p(t,e)}(d,r(n).default),c(d,null,[{key:"defaultProps",value:function(){return{text:{detail:"水印内容",default:"chartx"},fontSize:{detail:"字体大小",default:20},fontColor:{detail:"水印颜色",default:"#cccccc"},alpha:{detail:"水印透明度",default:.2},rotation:{detail:"水印旋转角度",default:45}}}}]),c(d,[{key:"draw",value:function(){for(var t=new u.default.Display.Text(this.text,{context:{fontSize:this.fontSize,fillStyle:this.fontColor}}),e=t.getTextWidth(),n=t.getTextHeight(),o=parseInt(this.height/(5*n))+1,r=parseInt(this.width/(1.5*e))+1,i=0;i<o;i++)for(var a=0;a<r;a++){var f=new u.default.Display.Text(this.text,{context:{rotation:this.rotation,fontSize:this.fontSize,fillStyle:this.fontColor,globalAlpha:this.alpha}});f.context.x=1.5*e*a+.25*e,f.context.y=5*n*i,this.spripte.addChild(f)}}}]),d);function d(t,e){var n;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,d),(n=function(t,e){return!e||"object"!==i(e)&&"function"!=typeof e?f(t):e}(this,a(d).call(this,t,e))).name="waterMark",n.width=n.app.width,n.height=n.app.height,o._.extend(!0,f(n),(0,o.getDefaultProps)(d.defaultProps()),t),n.spripte=new u.default.Display.Sprite({id:"watermark"}),n.app.stage.addChild(n.spripte),n.draw(),n}o.global.registerComponent(s,"waterMark"),t.default=s});