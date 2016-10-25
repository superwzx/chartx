define("chartx/chart/line/group",["canvax/index","canvax/shape/BrokenLine","canvax/shape/Circle","canvax/shape/Path","chartx/utils/tools","chartx/utils/colorformat","canvax/animation/Tween","chartx/chart/theme","canvax/animation/AnimationFrame"],function(a,b,c,d,e,f,g,h,i){window.Canvax=a;var j=function(a,b,c,d,e,f,g,i){this.field=a,this._groupInd=b,this._nodeInd=-1,this._yAxis=f,this.sort=e,this.ctx=d,this.w=i,this.h=g,this.y=0,this.animation=!0,this.resize=!1,this.colors=h.colors,this.line={enabled:1,strokeStyle:this.colors[this._groupInd],lineWidth:2,lineType:"solid",smooth:!0},this.node={enabled:1,corner:!1,r:2,fillStyle:"#ffffff",strokeStyle:null,lineWidth:4},this.text={enabled:0,fillStyle:null,strokeStyle:null,fontSize:13,format:null},this.fill={fillStyle:null,alpha:.05},this.dataOrg=[],this.data=[],this.sprite=null,this._pointList=[],this._currPointList=[],this._bline=null,this.__lineStrokeStyle=null,this.init(c)};return j.prototype={init:function(b){_.deepExtend(this,b),this.sprite=new a.Display.Sprite;var c=this;this.sprite.on("destroy",function(){c._growTween&&i.destroyTween(c._growTween)})},draw:function(a){_.deepExtend(this,a),this._widget()},update:function(a){if(this._bline&&(_.deepExtend(this,a),a.data&&(this._pointList=this._getPointList(this.data),this._grow()),void 0!==a._groupInd)){var b=this._getLineStrokeStyle();this._bline.context.strokeStyle=b,this._fill.context.fillStyle=this._getFillStyle()||b,this._setNodesStyle()}},destroy:function(){this.sprite.remove()},_getColor:function(a){var b=this._getProp(a);return b&&""!=b||(b=this.colors[this._groupInd]),b},_getProp:function(a){if(_.isArray(a))return a[this._groupInd];if(_.isFunction(a)){var b={iGroup:this._groupInd,iNode:this._nodeInd,field:this.field};return this._nodeInd>=0&&(b.value=this.data[this._nodeInd].value),a.apply(this,[b])}return a},getNodeInfoAt:function(a){var b=this;b._nodeInd=a;var c=_.clone(b.dataOrg[a]);return c&&null!=c.value&&void 0!=c.value&&""!==c.value?(c.r=b._getProp(b.node.r),c.fillStyle=b._getProp(b.node.fillStyle)||"#ffffff",c.strokeStyle=b._getProp(b.node.strokeStyle)||b._getLineStrokeStyle(),c.color=b._getProp(b.node.strokeStyle)||b._getLineStrokeStyle(),c.lineWidth=b._getProp(b.node.lineWidth)||2,c.alpha=b._getProp(b.fill.alpha),c.field=b.field,c._groupInd=b._groupInd,c):null},resetData:function(a){var b=this;b._pointList=this._getPointList(a.data);var c=b._pointList.length,d=b._currPointList.length;if(d>c){for(var e=c,f=d;f>e;e++)b._circles.removeChildAt(e),b._texts.removeChildAt(e),f--,e--;b._currPointList.length=c}if(c>d){diffLen=c-d;for(var e=0;e<diffLen;e++)b._currPointList.push(_.clone(b._currPointList[d-1]))}b._circles&&b._circles.removeAllChildren(),b._texts&&b._texts.removeAllChildren(),b._createNodes(),b._createTexts(),b._grow()},_grow:function(a){var b=this;(!b.animation||b.resize)&&a&&a(b),0!=b._currPointList.length&&(this._growTween=i.registTween({from:b._getPointPosStr(b._currPointList),to:b._getPointPosStr(b._pointList),onUpdate:function(){for(var a in this){var c=parseInt(a.split("_")[2]),d=parseInt(a.split("_")[1]);b._currPointList[c]&&(b._currPointList[c][d]=this[a])}var e=b._getLineStrokeStyle();b._bline.context.pointList=_.clone(b._currPointList),b._bline.context.strokeStyle=e,b._fill.context.path=b._fillLine(b._bline),b._fill.context.fillStyle=b._getFillStyle()||e,b._circles&&_.each(b._circles.children,function(a,c){var d=parseInt(a.id.split("_")[1]);a.context.y=b._currPointList[d][1],a.context.x=b._currPointList[d][0]}),b._texts&&_.each(b._texts.children,function(a,c){var d=parseInt(a.id.split("_")[1]);a.context.y=b._currPointList[d][1]-3,a.context.x=b._currPointList[d][0],b._checkTextPos(a,c)})},onComplete:function(){b._growTween=null,a&&a(b)}}))},_getPointPosStr:function(a){var b={};return _.each(a,function(a,c){b["p_1_"+c]=a[1],b["p_0_"+c]=a[0]}),b},_isNotNum:function(a){return void 0===a||isNaN(a)||null===a||""===a},_filterEmptyValue:function(a){for(var b=0,c=a.length;c>b&&this._isNotNum(a[b].value);b++)a.shift(),c--,b--;for(var b=a.length-1;b>0&&this._isNotNum(a[b].value);b--)a.pop()},_getPointList:function(a){var b=this;b.dataOrg=_.clone(a),b._filterEmptyValue(a);for(var c=[],d=0,e=a.length;e>d;d++){var f=a[d];c.push([f.x,f.y])}return c},_widget:function(){var a=this;if(a._pointList=this._getPointList(a.data),0!=a._pointList.length){var c=[];if(a.animation&&!a.resize)for(var e=0,f=a.data.length;f>e;e++){var g=a.data[e],h=0;"right"==a._yAxis.place&&(h=f-1),c.push([g.x,a.data[h].y])}else c=a._pointList;a._currPointList=c;var i=new b({context:{pointList:c,lineWidth:a.line.lineWidth,y:a.y,smooth:a.line.smooth,lineType:a._getProp(a.line.lineType),smoothFilter:function(b){b[1]>0?b[1]=0:Math.abs(b[1])>a.h&&(b[1]=-a.h)}}});this.line.enabled||(i.context.visible=!1),a.sprite.addChild(i),a._bline=i;var j=a._getLineStrokeStyle();i.context.strokeStyle=j;var k=new d({context:{path:a._fillLine(i),fillStyle:a._getFillStyle()||j,globalAlpha:_.isArray(a.fill.alpha)?1:a.fill.alpha}});a.sprite.addChild(k),a._fill=k,a._createNodes(),a._createTexts()}},_getFillStyle:function(){var a=this,b=null,c=a.fill.fillStyle;if(c||(c=a._getLineStrokeStyle("fillStyle")),c||(c=a._getColor(a.fill.fillStyle)),_.isArray(a.fill.alpha)&&!(c instanceof CanvasGradient)){a.fill.alpha.length=2,void 0==a.fill.alpha[0]&&(a.fill.alpha[0]=0),void 0==a.fill.alpha[1]&&(a.fill.alpha[1]=0);var d=_.min(a._bline.context.pointList,function(a){return a[1]});b=a.ctx.createLinearGradient(d[0],d[1],d[0],0);var e=f.colorRgb(c),g=e.replace(")",", "+a._getProp(a.fill.alpha[0])+")").replace("RGB","RGBA");b.addColorStop(0,g);var h=e.replace(")",", "+a.fill.alpha[1]+")").replace("RGB","RGBA");b.addColorStop(1,h),c=b}return c},_getLineStrokeStyle:function(a){var b=this;if(this.line.strokeStyle.lineargradient){var c=_.min(b._bline.context.pointList,function(a){return a[1]}),d=_.max(b._bline.context.pointList,function(a){return a[1]});"fillStyle"==a&&(d=[0,0]),this.__lineStrokeStyle=b.ctx.createLinearGradient(c[0],c[1],c[0],d[1]),_.isArray(this.line.strokeStyle.lineargradient)||(this.line.strokeStyle.lineargradient=[this.line.strokeStyle.lineargradient]),_.each(this.line.strokeStyle.lineargradient,function(a,c){b.__lineStrokeStyle.addColorStop(a.position,a.color)})}else this.__lineStrokeStyle=this._getColor(this.line.strokeStyle);return this.__lineStrokeStyle},_setNodesStyle:function(){var a=this,b=a._currPointList;if((a.node.enabled||1==b.length)&&a.line.lineWidth)for(var c=0,d=b.length;d>c;c++){a._nodeInd=c;var e=a._circles.getChildAt(c),f=a._getProp(a.node.strokeStyle)||a._getLineStrokeStyle();e.context.fillStyle=1==b.length?f:a._getProp(a.node.fillStyle)||"#ffffff",e.context.strokeStyle=f,a._nodeInd=-1}},_createNodes:function(){var b=this,d=b._currPointList;if((b.node.enabled||1==d.length)&&b.line.lineWidth){this._circles=new a.Display.Sprite({}),this.sprite.addChild(this._circles);for(var e=0,f=d.length;f>e;e++){var g={x:b._currPointList[e][0],y:b._currPointList[e][1],r:b._getProp(b.node.r),lineWidth:b._getProp(b.node.lineWidth)||2},h=new c({id:"circle_"+e,context:g});if(b.node.corner){var i=b._pointList[e][1],j=b._pointList[e-1],k=b._pointList[e+1];j&&k&&i==j[1]&&i==k[1]&&(h.context.visible=!1)}b._circles.addChild(h)}}this._setNodesStyle()},_createTexts:function(){var b=this,c=b._currPointList;if(b.text.enabled){this._texts=new a.Display.Sprite({}),this.sprite.addChild(this._texts);for(var d=0,e=c.length;e>d;d++){b._nodeInd=d;var f=b._getProp(b.text.fillStyle)||b._getProp(b.node.strokeStyle)||b._getLineStrokeStyle();b._nodeInd=-1;var g={x:b._currPointList[d][0],y:b._currPointList[d][1]-3,fontSize:this.text.fontSize,textAlign:"center",textBaseline:"bottom",fillStyle:f,lineWidth:1,strokeStyle:"#ffffff"},h=b.data[d].value;_.isFunction(b.text.format)&&(h=b.text.format.apply(b,[h,d])||h);var i=new a.Display.Text(h,{id:"text_"+d,context:g});b._texts.addChild(i),b._checkTextPos(i,d)}}this._setNodesStyle()},_checkTextPos:function(a,b){var c=this,d=c._currPointList,e=d[b-1],f=d[b+1];0==b&&(a.context.textAlign="left"),b==d.length-1&&(a.context.textAlign="right"),e&&f&&e[1]<a.context.y&&f[1]<a.context.y&&(a.context.y+=7,a.context.textBaseline="top")},_fillLine:function(a){var b=_.clone(a.context.pointList);if(0==b.length)return"";var c=0;return"desc"==this.sort&&(c=-this.h),b.push([b[b.length-1][0],c],[b[0][0],c],[b[0][0],b[0][1]]),e.getPath(b)}},j});