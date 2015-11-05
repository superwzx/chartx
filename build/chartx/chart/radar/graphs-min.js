define("chartx/chart/radar/graphs",["canvax/index","canvax/shape/Polygon","canvax/shape/Circle","canvax/animation/Tween","chartx/components/tips/tip","chartx/chart/theme"],function(a,b,c,d,e,f){var g=function(a,b,c){this.pos={x:0,y:0},this.r=0,this.data=[],this.yDataSection=[],this.xDataSection=[],this._colors=f.colors,this.fillStyle=null,this.alpha=.5,this.lineWidth=1,this.sprite=null,this.currentAngInd=null,this.tips=b,this.domContainer=c,this._tip=null,this._circlesSp=[],this.init(a)};return g.prototype={init:function(b){_.deepExtend(this,b),this.sprite=new a.Display.Sprite({id:"graphsEl"}),this._tip=new e(this.tips,this.domContainer),this.sprite.addChild(this._tip.sprite)},getFillStyle:function(a,b,c){var d=null;return _.isArray(this.fillStyle)&&(d=this.fillStyle[a]),_.isFunction(this.fillStyle)&&(d=this.fillStyle(a,b,c)),d&&""!=d||(d=this._colors[a]),d},draw:function(a,b){this.data=a,_.deepExtend(this,b),this._widget()},angOver:function(a,b){this._tip.show(this._getTipsInfo(a,b))},angMove:function(a,b){b!=this.currentAngInd&&(null!=this.currentAngInd&&this._setCircleStyleForInd(this.currentAngInd),this.currentAngInd=b,this._setCircleStyleForInd(b)),this._tip.move(this._getTipsInfo(a,b))},angOut:function(a){this._setCircleStyleForInd(this.currentAngInd),this.currentAngInd=null,this._tip.hide(a)},_getTipsInfo:function(a,b){return a.tipsInfo={iGroup:a.groupInd||0,iNode:b,nodesInfoList:this._getTipsInfoList(a,b)},a},_getTipsInfoList:function(a,b){var c=[],d=this;return _.each(this.data,function(a,e){c.push({value:a[b],fillStyle:d.getFillStyle(e,b,a[b])})}),c},_setCircleStyleForInd:function(a){_.each(this._circlesSp,function(b,c){var d=b.getChildAt(a);if(d){var e=d.context,f=e.fillStyle;e.fillStyle=e.strokeStyle,e.strokeStyle=f}})},setPosition:function(a,b){var c=this.sprite.context;c.x=a,c.y=b},_widget:function(){if(0!=this.data.length){var d=this.data[0].length;if(d&&!(2>d)){var e=y=this.r,f=2*Math.PI/d,g=-Math.PI/2,h=g,i=this.yDataSection[this.yDataSection.length-1];this._circlesSp=[];for(var j=0,k=this.data.length;k>j;j++){var l=[],m=new a.Display.Sprite({id:"radarGroup_"+j}),n=new a.Display.Sprite({});this._circlesSp.push(n);for(var o=0,p=d;p>o;o++){var q=this.data[j][o];if(null!=q&&void 0!=q){var r=this.r*(q/i),s=e+r*Math.cos(h),t=y+r*Math.sin(h);l.push([s,t]),h+=f,n.addChild(new c({context:{x:s,y:t,r:5,fillStyle:this.getFillStyle(j,o,q),strokeStyle:"#ffffff",lineWidth:2}}))}}if(h=g,0!=n.children.length){var u=new b({id:"radar_bg_"+j,context:{pointList:l,globalAlpha:this.alpha,fillStyle:this.getFillStyle(j)}}),v=new b({id:"radar_Border_"+j,context:{pointList:l,lineWidth:2,cursor:"pointer",fillStyle:"RGBA(0,0,0,0)",strokeStyle:this.getFillStyle(j)}});v.groupInd=j,v.bg=u,v.hover(function(a){a.groupInd=this.groupInd,this.parent.toFront(),this.bg.context.globalAlpha+=.3},function(){var a=this.parent.parent.getNumChildren();this.parent.toBack(a-this.groupInd-1),this.bg.context.globalAlpha-=.3}),v.on("click",function(a){a.groupInd=this.groupInd}),m.addChild(u),m.addChild(v),m.addChild(n),this.sprite.addChild(m)}else n.destroy()}}}}},g});