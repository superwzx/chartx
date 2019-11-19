"use strict";!function(t,e){if("function"==typeof define&&define.amd)define(["exports","canvax","../index","../../../layout/partition","mmvis"],e);else if("undefined"!=typeof exports)e(exports,require("canvax"),require("../index"),require("../../../layout/partition"),require("mmvis"));else{var n={};e(n,t.canvax,t.index,t.partition,t.mmvis),t.undefined=n}}(void 0,function(t,e,n,a,s){Object.defineProperty(t,"__esModule",{value:!0});var i=u(e),o=u(n),r=u(a);function u(t){return t&&t.__esModule?t:{default:t}}function l(t){return(l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function f(t){return(f=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function c(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function d(t,e){for(var n=0;n<e.length;n++){var a=e[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(t,a.key,a)}}function h(t,e,n){return e&&d(t.prototype,e),n&&d(t,n),t}function p(t,e){return(p=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var y=i.default.Shapes.Sector,v=(function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&p(t,e)}(_,o.default),h(_,null,[{key:"defaultProps",value:function(){return{keyField:{detail:"key字段",default:"name"},valueField:{detail:"value字段",default:"value"},parentField:{detail:"parent字段",default:"parent"},node:{detail:"单个节点图形设置",propertys:{strokeStyle:{detail:"描边色",default:"#ffffff"},lineWidth:{detail:"描边线宽",default:1},strokeAlpha:{detail:"描边边框透明度",default:1},fillStyle:{detail:"背景色",default:null},fillAlpha:{detail:"背景透明度",default:1},blurAlpha:{detail:"非激活状态透明度",documentation:"比如选中其中一项，其他不先关的要降低透明度",default:.4}}}}}}]),h(_,[{key:"init",value:function(){}},{key:"draw",value:function(t){t=t||{},s._.extend(!0,this,t),this.data=this._trimGraphs(),this.dataGroup=this._getDataGroupOfDepth(),this._widget(),this.sprite.context.x=this.width/2+this.origin.x,this.sprite.context.y=this.height/2+this.origin.y,this.fire("complete")}},{key:"_trimGraphs",value:function(){var e=this,t=parseInt(Math.min(this.width,this.height)/2),n=(0,r.default)().sort(null).size([2*Math.PI,t*t]).value(function(t){return t[e.valueField]}),a=this._tansTreeData();return this.data=n(a,0),this.data}},{key:"_getDataGroupOfDepth",value:function(){var e={};s._.each(this.data,function(t){e[t.depth]=[]}),s._.each(this.data,function(t){e[t.depth].push(t)});var t=[];for(var n in e)t.push(e[n]);return t}},{key:"_tansTreeData",value:function(){var t=this.dataFrame,e={},l=t.getFieldData(this.keyField),f=t.getFieldData(this.valueField),c=t.getFieldData(this.parentField);return function a(i,t,e){for(var n=t?t.name:void 0,o=e||0;o<c.length;o++){var r=c[o];if(r||0===r||(r=void 0),n===r){i.name=l[o],i.iNode=o;var u=f[o];!u&&0!==u||(i.value=u),s._.each(c,function(t,e){if(t===i.name){i.children||(i.children=[]);var n={};a(n,i,e),i.children.push(n)}});break}}}(e),e}},{key:"_widget",value:function(){var u=this;s._.each(this.dataGroup,function(o,r){s._.each(o,function(e,t){if(e.depth){var n=Math.sqrt(e.y+e.dy),a={r0:Math.sqrt(e.y),r:Math.sqrt(e.y)+2,startAngle:180*e.x/Math.PI,endAngle:180*(e.x+e.dx)/Math.PI,fillStyle:e.color||u.app.getTheme(e.iNode),strokeStyle:u.node.strokeStyle,lineWidth:u.node.lineWidth,globalAlpha:0},i=new y({id:"sector_"+r+"_"+t,context:a});(i.layoutData=e).sector=i,e.group=o,u.sprite.addChild(i),i.hover(function(t){u._focus(e,o)},function(t){u._unfocus(e,o)}),i.on(s.event.types.get(),function(t){t.eventInfo={trigger:u.node,iNode:e.iNode},u.app.fire(t.type,t)}),r<=1?(i.context.r=n,i.context.globalAlpha=1):setTimeout(function(){i.context&&(i.context.globalAlpha=1,i.animate({r:n},{duration:350}))},350*(r-1))}})})}},{key:"getNodesAt",value:function(e){var t=[];if(void 0!==e){var n=s._.find(this.data,function(t){return t.iNode==e});n.type="sunburst",n&&t.push(n)}return t}},{key:"_focus",value:function(e,t){var n=this;s._.each(t,function(t){t!==e&&(t.sector.context.globalAlpha=n.node.blurAlpha,n._focusChildren(t,function(t){t.sector.context.globalAlpha=n.node.blurAlpha}))}),n._focusParent(e)}},{key:"_unfocus",value:function(){s._.each(this.data,function(t){t.sector&&(t.sector.context.globalAlpha=1)})}},{key:"_focusChildren",value:function(t,e){var n=this;t.children&&t.children.length&&s._.each(t.children,function(t){e(t),n._focusChildren(t,e)})}},{key:"_focusParent",value:function(e){var n=this;e.parent&&e.parent.sector&&e.parent.group&&s._.each(e.parent.group,function(t){t===e.parent?(t.sector.context.globalAlpha=1,n._focusParent(e.parent)):t.sector.context.globalAlpha=n.node.blurAlpha})}}]),_);function _(t,e){var n;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,_),(n=function(t,e){return!e||"object"!==l(e)&&"function"!=typeof e?c(t):e}(this,f(_).call(this,t,e))).type="sunburst",s._.extend(!0,c(n),(0,s.getDefaultProps)(_.defaultProps()),t),n.data=[],n.dataGroup=[],n.init(),n}s.global.registerComponent(v,"graphs","sunburst"),t.default=v});