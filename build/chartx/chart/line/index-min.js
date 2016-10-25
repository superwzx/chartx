define("chartx/chart/line/tips",["canvax/index","canvax/shape/Line","canvax/shape/Circle","chartx/components/tips/tip"],function(a,b,c,d){var e=function(a,b,c){this.line={enabled:1},this.node={},this.sprite=null,this._line=null,this._nodes=null,this._tip=null,this._isShow=!1,this.enabled=!0,this.init(a,b,c)};return e.prototype={init:function(b,c,e){_.deepExtend(this,b),this.sprite=new a.Display.Sprite({id:"tips"}),this._tip=new d(b,e)},reset:function(a){_.deepExtend(this._tip,a)},show:function(a,b){this.enabled&&(b||(b={}),b=_.extend(this._getTipsPoint(a),b),this._initLine(a,b),this._initNodes(a,b),this.sprite.addChild(this._tip.sprite),this._tip.show(a,b),this._isShow=!0)},move:function(a){this.enabled&&(this._resetStatus(a),this._tip.move(a))},hide:function(a){this.enabled&&(this.sprite.removeAllChildren(),this._line=null,this._nodes=null,this._tip.hide(a),this._isShow=!1)},_getTipsPoint:function(a){return a.target.localToGlobal(a.eventInfo.nodesInfoList[a.eventInfo.iGroup])},_resetStatus:function(a){var b=this._getTipsPoint(a);this._line&&(this._line.context.x=parseInt(b.x)),this._resetNodesStatus(a,b)},_initLine:function(a,c){var d=_.deepExtend({x:parseInt(c.x),y:c.lineTop||a.target.localToGlobal().y,xStart:0,yStart:c.lineH||a.target.context.height,xEnd:0,yEnd:0,lineWidth:1,strokeStyle:this.line.strokeStyle||"#cccccc"},this.line);this.line.enabled&&(this._line=new b({id:"tipsLine",context:d}),this.sprite.addChild(this._line))},_initNodes:function(b,d){var e=this;this._nodes=new a.Display.Sprite({id:"line-tipsNodes",context:{x:parseInt(d.x),y:b.target.localToGlobal().y}});var e=this;_.each(b.eventInfo.nodesInfoList,function(d){var f=new a.Display.Sprite({context:{y:b.target.context.height-Math.abs(d.y)}}),g=new c({context:{r:d.r+2,fillStyle:e.node.backFillStyle||"white",strokeStyle:e.node.strokeStyle||d.strokeStyle,lineWidth:d.lineWidth,cursor:"pointer"}});g.name="node",g.eventInfo={iGroup:d._groupInd,iNode:b.eventInfo.iNode,nodesInfoList:[d]},f.addChild(g),e._nodes.addChild(f),g.on("mousemove",function(a){a.eventInfo=a.target.eventInfo,e._tip.move(a)}),g.on("click",function(a){var b={eventInfo:_.clone(a.target.eventInfo)};e.sprite.fire("nodeclick",b)})}),this.sprite.addChild(this._nodes)},_resetNodesStatus:function(a,b){var c=this;this._nodes.children.length!=a.eventInfo.nodesInfoList.length&&(this._nodes.removeAllChildren(),this._initNodes(a,b)),this._nodes.context.x=parseInt(b.x),_.each(a.eventInfo.nodesInfoList,function(b,d){var e=c._nodes.getChildAt(d).context;e.y=a.target.context.height-Math.abs(b.y);var f=c._nodes.getChildAt(d).getChildAt(0);f.eventInfo={iGroup:b._groupInd,iNode:a.eventInfo.iNode,nodesInfoList:[b]}})}},e}),define("chartx/chart/line/xaxis",["chartx/components/xaxis/xAxis"],function(a){var b=function(a,c){b.superclass.constructor.apply(this,arguments)};return Chartx.extend(b,a,{_trimXAxis:function(a,b){var c=a.length,d=[];if(1==c)d.push({content:a[0],x:parseInt(b/2)});else for(var e=0,f=a.length;f>e;e++){var g={content:a[e],x:parseInt(e/(c-1)*b)};d.push(g)}return d}}),b}),define("chartx/chart/line/group",["canvax/index","canvax/shape/BrokenLine","canvax/shape/Circle","canvax/shape/Path","chartx/utils/tools","chartx/utils/colorformat","canvax/animation/Tween","chartx/chart/theme","canvax/animation/AnimationFrame"],function(a,b,c,d,e,f,g,h,i){window.Canvax=a;var j=function(a,b,c,d,e,f,g,i){this.field=a,this._groupInd=b,this._nodeInd=-1,this._yAxis=f,this.sort=e,this.ctx=d,this.w=i,this.h=g,this.y=0,this.animation=!0,this.resize=!1,this.colors=h.colors,this.line={enabled:1,strokeStyle:this.colors[this._groupInd],lineWidth:2,lineType:"solid",smooth:!0},this.node={enabled:1,corner:!1,r:2,fillStyle:"#ffffff",strokeStyle:null,lineWidth:4},this.text={enabled:0,fillStyle:null,strokeStyle:null,fontSize:13,format:null},this.fill={fillStyle:null,alpha:.05},this.dataOrg=[],this.data=[],this.sprite=null,this._pointList=[],this._currPointList=[],this._bline=null,this.__lineStrokeStyle=null,this.init(c)};return j.prototype={init:function(b){_.deepExtend(this,b),this.sprite=new a.Display.Sprite;var c=this;this.sprite.on("destroy",function(){c._growTween&&i.destroyTween(c._growTween)})},draw:function(a){_.deepExtend(this,a),this._widget()},update:function(a){if(this._bline&&(_.deepExtend(this,a),a.data&&(this._pointList=this._getPointList(this.data),this._grow()),void 0!==a._groupInd)){var b=this._getLineStrokeStyle();this._bline.context.strokeStyle=b,this._fill.context.fillStyle=this._getFillStyle()||b,this._setNodesStyle()}},destroy:function(){this.sprite.remove()},_getColor:function(a){var b=this._getProp(a);return b&&""!=b||(b=this.colors[this._groupInd]),b},_getProp:function(a){if(_.isArray(a))return a[this._groupInd];if(_.isFunction(a)){var b={iGroup:this._groupInd,iNode:this._nodeInd,field:this.field};return this._nodeInd>=0&&(b.value=this.data[this._nodeInd].value),a.apply(this,[b])}return a},getNodeInfoAt:function(a){var b=this;b._nodeInd=a;var c=_.clone(b.dataOrg[a]);return c&&null!=c.value&&void 0!=c.value&&""!==c.value?(c.r=b._getProp(b.node.r),c.fillStyle=b._getProp(b.node.fillStyle)||"#ffffff",c.strokeStyle=b._getProp(b.node.strokeStyle)||b._getLineStrokeStyle(),c.color=b._getProp(b.node.strokeStyle)||b._getLineStrokeStyle(),c.lineWidth=b._getProp(b.node.lineWidth)||2,c.alpha=b._getProp(b.fill.alpha),c.field=b.field,c._groupInd=b._groupInd,c):null},resetData:function(a){var b=this;b._pointList=this._getPointList(a.data);var c=b._pointList.length,d=b._currPointList.length;if(d>c){for(var e=c,f=d;f>e;e++)b._circles.removeChildAt(e),b._texts.removeChildAt(e),f--,e--;b._currPointList.length=c}if(c>d){diffLen=c-d;for(var e=0;e<diffLen;e++)b._currPointList.push(_.clone(b._currPointList[d-1]))}b._circles&&b._circles.removeAllChildren(),b._texts&&b._texts.removeAllChildren(),b._createNodes(),b._createTexts(),b._grow()},_grow:function(a){var b=this;(!b.animation||b.resize)&&a&&a(b),0!=b._currPointList.length&&(this._growTween=i.registTween({from:b._getPointPosStr(b._currPointList),to:b._getPointPosStr(b._pointList),onUpdate:function(){for(var a in this){var c=parseInt(a.split("_")[2]),d=parseInt(a.split("_")[1]);b._currPointList[c]&&(b._currPointList[c][d]=this[a])}var e=b._getLineStrokeStyle();b._bline.context.pointList=_.clone(b._currPointList),b._bline.context.strokeStyle=e,b._fill.context.path=b._fillLine(b._bline),b._fill.context.fillStyle=b._getFillStyle()||e,b._circles&&_.each(b._circles.children,function(a,c){var d=parseInt(a.id.split("_")[1]);a.context.y=b._currPointList[d][1],a.context.x=b._currPointList[d][0]}),b._texts&&_.each(b._texts.children,function(a,c){var d=parseInt(a.id.split("_")[1]);a.context.y=b._currPointList[d][1]-3,a.context.x=b._currPointList[d][0],b._checkTextPos(a,c)})},onComplete:function(){b._growTween=null,a&&a(b)}}))},_getPointPosStr:function(a){var b={};return _.each(a,function(a,c){b["p_1_"+c]=a[1],b["p_0_"+c]=a[0]}),b},_isNotNum:function(a){return void 0===a||isNaN(a)||null===a||""===a},_filterEmptyValue:function(a){for(var b=0,c=a.length;c>b&&this._isNotNum(a[b].value);b++)a.shift(),c--,b--;for(var b=a.length-1;b>0&&this._isNotNum(a[b].value);b--)a.pop()},_getPointList:function(a){var b=this;b.dataOrg=_.clone(a),b._filterEmptyValue(a);for(var c=[],d=0,e=a.length;e>d;d++){var f=a[d];c.push([f.x,f.y])}return c},_widget:function(){var a=this;if(a._pointList=this._getPointList(a.data),0!=a._pointList.length){var c=[];if(a.animation&&!a.resize)for(var e=0,f=a.data.length;f>e;e++){var g=a.data[e],h=0;"right"==a._yAxis.place&&(h=f-1),c.push([g.x,a.data[h].y])}else c=a._pointList;a._currPointList=c;var i=new b({context:{pointList:c,lineWidth:a.line.lineWidth,y:a.y,smooth:a.line.smooth,lineType:a._getProp(a.line.lineType),smoothFilter:function(b){b[1]>0?b[1]=0:Math.abs(b[1])>a.h&&(b[1]=-a.h)}}});this.line.enabled||(i.context.visible=!1),a.sprite.addChild(i),a._bline=i;var j=a._getLineStrokeStyle();i.context.strokeStyle=j;var k=new d({context:{path:a._fillLine(i),fillStyle:a._getFillStyle()||j,globalAlpha:_.isArray(a.fill.alpha)?1:a.fill.alpha}});a.sprite.addChild(k),a._fill=k,a._createNodes(),a._createTexts()}},_getFillStyle:function(){var a=this,b=null,c=a.fill.fillStyle;if(c||(c=a._getLineStrokeStyle("fillStyle")),c||(c=a._getColor(a.fill.fillStyle)),_.isArray(a.fill.alpha)&&!(c instanceof CanvasGradient)){a.fill.alpha.length=2,void 0==a.fill.alpha[0]&&(a.fill.alpha[0]=0),void 0==a.fill.alpha[1]&&(a.fill.alpha[1]=0);var d=_.min(a._bline.context.pointList,function(a){return a[1]});b=a.ctx.createLinearGradient(d[0],d[1],d[0],0);var e=f.colorRgb(c),g=e.replace(")",", "+a._getProp(a.fill.alpha[0])+")").replace("RGB","RGBA");b.addColorStop(0,g);var h=e.replace(")",", "+a.fill.alpha[1]+")").replace("RGB","RGBA");b.addColorStop(1,h),c=b}return c},_getLineStrokeStyle:function(a){var b=this;if(this.line.strokeStyle.lineargradient){var c=_.min(b._bline.context.pointList,function(a){return a[1]}),d=_.max(b._bline.context.pointList,function(a){return a[1]});"fillStyle"==a&&(d=[0,0]),this.__lineStrokeStyle=b.ctx.createLinearGradient(c[0],c[1],c[0],d[1]),_.isArray(this.line.strokeStyle.lineargradient)||(this.line.strokeStyle.lineargradient=[this.line.strokeStyle.lineargradient]),_.each(this.line.strokeStyle.lineargradient,function(a,c){b.__lineStrokeStyle.addColorStop(a.position,a.color)})}else this.__lineStrokeStyle=this._getColor(this.line.strokeStyle);return this.__lineStrokeStyle},_setNodesStyle:function(){var a=this,b=a._currPointList;if((a.node.enabled||1==b.length)&&a.line.lineWidth)for(var c=0,d=b.length;d>c;c++){a._nodeInd=c;var e=a._circles.getChildAt(c),f=a._getProp(a.node.strokeStyle)||a._getLineStrokeStyle();e.context.fillStyle=1==b.length?f:a._getProp(a.node.fillStyle)||"#ffffff",e.context.strokeStyle=f,a._nodeInd=-1}},_createNodes:function(){var b=this,d=b._currPointList;if((b.node.enabled||1==d.length)&&b.line.lineWidth){this._circles=new a.Display.Sprite({}),this.sprite.addChild(this._circles);for(var e=0,f=d.length;f>e;e++){var g={x:b._currPointList[e][0],y:b._currPointList[e][1],r:b._getProp(b.node.r),lineWidth:b._getProp(b.node.lineWidth)||2},h=new c({id:"circle_"+e,context:g});if(b.node.corner){var i=b._pointList[e][1],j=b._pointList[e-1],k=b._pointList[e+1];j&&k&&i==j[1]&&i==k[1]&&(h.context.visible=!1)}b._circles.addChild(h)}}this._setNodesStyle()},_createTexts:function(){var b=this,c=b._currPointList;if(b.text.enabled,!0){this._texts=new a.Display.Sprite({}),this.sprite.addChild(this._texts);for(var d=0,e=c.length;e>d;d++){b._nodeInd=d;var f=b._getProp(b.text.fillStyle)||b._getProp(b.node.strokeStyle)||b._getLineStrokeStyle();b._nodeInd=-1;var g={x:b._currPointList[d][0],y:b._currPointList[d][1]-3,fontSize:this.text.fontSize,textAlign:"center",textBaseline:"bottom",fillStyle:f,lineWidth:1,strokeStyle:"#ffffff"},h=b.data[d].value;_.isFunction(b.text.format)&&(h=b.text.format(h,d));var i=new a.Display.Text(h,{id:"text_"+d,context:g});b._texts.addChild(i),b._checkTextPos(i,d)}}this._setNodesStyle()},_checkTextPos:function(a,b){var c=this,d=c._currPointList,e=d[b-1],f=d[b+1];0==b&&(a.context.textAlign="left"),b==d.length-1&&(a.context.textAlign="right"),e&&f&&e[1]<a.context.y&&f[1]<a.context.y&&(a.context.y+=7,a.context.textBaseline="top")},_fillLine:function(a){var b=_.clone(a.context.pointList);if(0==b.length)return"";var c=0;return"desc"==this.sort&&(c=-this.h),b.push([b[b.length-1][0],c],[b[0][0],c],[b[0][0],b[0][1]]),e.getPath(b)}},j}),define("chartx/chart/line/graphs",["canvax/index","canvax/shape/Rect","chartx/utils/tools","chartx/chart/line/group"],function(a,b,c,d){var e=function(a,b){this.w=0,this.h=0,this.y=0,this.opt=a,this.root=b,this.ctx=b.stage.context2D,this.field=null,this._yAxisFieldsMap={},this._setyAxisFieldsMap(),this.data=[],this.disX=0,this.groups=[],this.iGroup=0,this.iNode=-1,this.sprite=null,this.induce=null,this.eventEnabled=a.eventEnabled||!0,this.init(a)};return e.prototype={init:function(b){this.opt=b,this.sprite=new a.Display.Sprite},setX:function(a){this.sprite.context.x=a},setY:function(a){this.sprite.context.y=a},getX:function(){return this.sprite.context.x},getY:function(){return this.sprite.context.y},draw:function(a){_.deepExtend(this,a),this._widget(a);var b=this;_.each(this.groups,function(a){b._yAxisFieldsMap[a.field].line=a.line})},resetData:function(a,b){var c=this;c.data=a,b&&_.deepExtend(c,b);for(var d=0,e=c.field.length;e>d;d++){var f=c.groups[d];f.resetData({data:c.data[c._yAxisFieldsMap[f.field].ind]})}},grow:function(a){_.each(this.groups,function(b,c){b._grow(a)})},_setyAxisFieldsMap:function(){var a=this;_.each(_.flatten(this._getYaxisField()),function(b,c){var d=a._yAxisFieldsMap[b];d?a._yAxisFieldsMap[b].ind=c:a._yAxisFieldsMap[b]={ind:c}})},_addyAxisFieldsMap:function(a){if(!this._yAxisFieldsMap[a]){var b;for(var c in this._yAxisFieldsMap)isNaN(b)&&(b=0),b=Math.max(this._yAxisFieldsMap[c].ind,b);this._yAxisFieldsMap[a]={ind:isNaN(b)?0:++b}}},_getYaxisField:function(a){return this.root.type&&this.root.type.indexOf("line")>=0?this.field=this.root._lineChart.dataFrame.yAxis.field:this.field=this.root.dataFrame.yAxis.field,this.field},creatFields:function(a,b){var c=this,d=[];return _.each(b,function(b,e){_.isArray(b)?d.push(c.creatFields(a,b)):a==b?d.push(b):d.push(null)}),d},yAxisFieldChange:function(a,b){!b&&(b=c.data);var c=this;_.isString(a)&&(a=[a]);for(var d=0,e=c.field.length;e>d;d++){var f=c.field[d],g=_.find(a,function(a){return a==f});g||(c.remove(d),c.field.splice(d,1),delete c._yAxisFieldsMap[f],c.update({data:b}),d--,e--)}_.each(a,function(a,d){var e=_.find(c.groups,function(b){return b.field==a});e||c.add({data:b},a)}),c._setyAxisFieldsMap(),_.each(c.groups,function(a,b){a.update({_groupInd:b})})},add:function(a,b){_.deepExtend(this,a),this._addyAxisFieldsMap(b);var c=this.creatFields(b,this._getYaxisField());this._setGroupsForYfield(c,this.data,this._yAxisFieldsMap[b].ind),this.update()},remove:function(a){var b=this.groups.splice(a,1)[0];b.destroy()},update:function(a){a&&_.deepExtend(this,a);var b=this;_.each(this.groups,function(a,c){a.update({data:b.data[c]})})},_setGroupsForYfield:function(a,b,c){for(var e=[],f=this,g=0,h=a.length;h>g;g++)if(b[g]&&a[g]){var i=f.root._yAxis.sort,j=f.root.biaxial,k=f.root._yAxis,l=c||0===c?c:g;if(_.isArray(a[g]))f._setGroupsForYfield(a[g],b[g],g);else{_.isArray(i)&&(i=i[l]||"asc"),j&&l>0&&(k=f.root._yAxisR);var m=f._yAxisFieldsMap[a[g]];m._yAxis=k,m._sort=i,m._groupInd=l;var n=new d(a[g],l,f.opt,f.ctx,i,k,f.h,f.w);n.draw({data:b[g],resize:f.resize}),f.sprite.addChildAt(n.sprite,l);for(var o=!1,p=0,q=f.groups.length;q>p;p++)if(f.groups[p]._groupInd>l){f.groups.splice(p,0,n),o=!0;break}o||f.groups.push(n),e.push(n)}}return e},_widget:function(a){var c=this;c.eventEnabled&&(c._setGroupsForYfield(c._getYaxisField(),c.data),c.induce=new b({id:"induce",context:{y:-c.h,width:c.w,height:c.h,fillStyle:"#000000",globalAlpha:0,cursor:"pointer"}}),c.sprite.addChild(c.induce),c.induce.on("panstart mouseover",function(a){a.eventInfo=c._getInfoHandler(a)}),c.induce.on("panmove mousemove",function(a){a.eventInfo=c._getInfoHandler(a)}),c.induce.on("panend mouseout",function(a){a.eventInfo=c._getInfoHandler(a),c.iGroup=0,c.iNode=-1}),c.induce.on("tap click",function(a){a.eventInfo=c._getInfoHandler(a)})),c.resize=!1},_getInfoHandler:function(a){var b=a.point.x,d=a.point.y-this.h;b=b>this.w?this.w:b;for(var e=0==this.disX?0:parseInt((b+this.disX/2)/this.disX),f=[],g=0,h=this.groups.length;h>g;g++){var i=this.groups[g].getNodeInfoAt(e);i&&f.push(i)}var j=c.getDisMinATArr(d,_.pluck(f,"y"));this.iGroup=j,this.iNode=e;var k={iGroup:this.iGroup,iNode:this.iNode,nodesInfoList:_.clone(f)};return k}},e}),define("chartx/chart/line/index",["chartx/chart/index","chartx/utils/tools","chartx/utils/datasection","chartx/chart/line/xaxis","chartx/components/yaxis/yAxis","chartx/components/back/Back","chartx/components/anchor/Anchor","chartx/chart/line/graphs","chartx/chart/line/tips","chartx/utils/dataformat","chartx/components/datazoom/index","chartx/components/legend/index"],function(a,b,c,d,e,f,g,h,i,j,k,l){var m=a.Canvax,n=a.extend({init:function(a,b,c){this._node=a,this._data=b,this._opts=c,this.dataZoom={enabled:!1,range:{start:0,end:b.length-1}},c.dataZoom&&(this.dataZoom.enabled=!0,this.padding.bottom+=c.dataZoom.height||46),this._xAxis=null,this._yAxis=null,this._anchor=null,this._back=null,this._graphs=null,this._tips=null,this.xAxis={},this.yAxis={},this.graphs={},this.biaxial=!1,_.deepExtend(this,c),this.dataFrame=this._initData(b,this)},draw:function(a){this._setLegend(a),this.stageTip=new m.Display.Sprite({id:"tip"}),this.core=new m.Display.Sprite({id:"core"}),this.stageBg=new m.Display.Sprite({id:"bg"}),this.stage.addChild(this.stageBg),this.stage.addChild(this.core),this.stage.addChild(this.stageTip),this.rotate&&this._rotate(this.rotate),this._initModule(),this._startDraw(a),this._endDraw(),this.inited=!0},reset:function(a){var b=this;this._reset&&this._reset(a);var c,d=this.dataFrame.org||[];if(a&&a.options){_.deepExtend(this,a.options);for(var e in a.options)this["_"+e]&&(this["_"+e].reset?this["_"+e].reset(a.options[e]):_.deepExtend(this["_"+e],a.options[e]));c=a.options.yAxis&&a.options.yAxis.field}a&&a.data&&(d=a.data);var f=this._resetDataFrameAndGetTrimData(a.data);c&&b._graphs.yAxisFieldChange(c,f),d&&this.resetData(d,f)},resetData:function(a,b){b||(b=_resetDataFrameAndGetTrimData(a)),this._graphs.resetData(b,{disX:this._getGraphsDisX()})},_resetDataFrameAndGetTrimData:function(a){return this.dataFrame=this._initData(a,this),this._xAxis.resetData(this.dataFrame.xAxis),this._yAxis.resetData(this.dataFrame.yAxis),this._trimGraphs()},add:function(a){var b=this;_.indexOf(this.yAxis.field,a)>0||(b._graphs._yAxisFieldsMap[a]?this.yAxis.field.splice(b._graphs._yAxisFieldsMap[a].ind,0,a):this.yAxis.field.push(a),this.dataFrame=this._initData(this.dataFrame.org,this),this._yAxis.update(this.yAxis,this.dataFrame.yAxis),this._back.update({xAxis:{data:this._yAxis.layoutData}}),this._graphs.add({data:this._trimGraphs()},a))},remove:function(a,b){var c=null;c=_.isNumber(a)?a:_.indexOf(this.yAxis.field,a),null!=c&&void 0!=c&&-1!=c&&this._remove(c)},_remove:function(a){this.dataFrame.yAxis.field.splice(a,1),this.dataFrame.yAxis.org.splice(a,1),this._yAxis.update(this.yAxis,this.dataFrame.yAxis),this._back.update({xAxis:{data:this._yAxis.layoutData}}),this._graphs.remove(a),this._graphs.update({data:this._trimGraphs()})},_initData:function(a,b){var c,d=this.dataZoom||b&&b.dataZoom;if(d&&d.enabled){var e=[a[0]];e=e.concat(a.slice(d.range.start+1,d.range.end+1+1)),c=j.apply(this,[e,b])}else c=j.apply(this,arguments);return c},_initModule:function(){this._xAxis=new d(this.xAxis,this.dataFrame.xAxis),this.biaxial&&(this.yAxis.biaxial=!0);var a=[];this.markLine&&this.markLine.y&&a.push(this.markLine.y),this._yAxis=new e(this.yAxis,this.dataFrame.yAxis,a),this.biaxial&&(this._yAxisR=new e(_.extend(_.clone(this.yAxis),{place:"right"}),this.dataFrame.yAxis)),this._back=new f(this.back),this.stageBg.addChild(this._back.sprite),this._anchor=new g(this.anchor),this.stageBg.addChild(this._anchor.sprite),this._graphs=new h(this.graphs,this),this._tips=new i(this.tips,this.dataFrame,this.canvax.getDomContainer())},_startDraw:function(a){var b=this;!a&&(a={});var c=(a.w||this.width,a.h||this.height),d=this.height-this._xAxis.h,e=d-this.padding.top-this.padding.bottom;this._yAxis.draw({pos:{x:this.padding.left,y:d-this.padding.bottom},yMaxHeight:e,resize:a.resize}),this.dataZoom.enabled&&(this.__cloneChart=this._getCloneLine(),this._yAxis.resetData(this.__cloneChart.thumbBar.dataFrame.yAxis,{animation:!1}));var f=this._yAxis.w,g=0;this._yAxisR&&(this._yAxisR.draw({pos:{x:0,y:d-this.padding.bottom},yMaxHeight:e,resize:a.resize}),g=this._yAxisR.w,this._yAxisR.setX(this.width-g-this.padding.right+1)),this._xAxis.draw({graphh:c-this.padding.bottom,graphw:this.width-g-this.padding.right,yAxisW:f,resize:a.resize}),this._xAxis.yAxisW!=f&&(this._yAxis.resetWidth(this._xAxis.yAxisW),f=this._xAxis.yAxisW);var h=this._yAxis.yGraphsHeight;this._back.draw({w:this._xAxis.xGraphsWidth,h:h,xAxis:{data:this._yAxis.layoutData},yAxis:{data:this._xAxis.layoutData},yOrigin:{biaxial:this.biaxial},pos:{x:f,y:d-this.padding.bottom},resize:a.resize}),this._graphs.draw({w:this._xAxis.xGraphsWidth,h:this._yAxis.yGraphsHeight,data:this._trimGraphs(),disX:this._getGraphsDisX(),smooth:this.smooth,inited:this.inited,resize:a.resize}),this._graphs.setX(f),this._graphs.setY(d-this.padding.bottom);var i=this;if(this.inited||this._graphs.grow(function(a){i._initPlugs(i._opts,a)}),this.bindEvent(this._graphs.sprite),this._tips.sprite.on("nodeclick",function(a){b._setXaxisYaxisToTipsInfo(a),b.fire("nodeclick",a.eventInfo)}),this._anchor.enabled){var j=this._getPosAtGraphs(this._anchor.xIndex,this._anchor.num);this._anchor.draw({w:this._xAxis.xGraphsWidth,h:h,cross:{x:j.x,y:h+j.y},pos:{x:f,y:d-h}})}this.dataZoom.enabled&&this._initDataZoom(),!this._legend||this._legend.inited&&!a.resize||(this._legend.pos({x:f}),_.each(this._graphs.groups,function(a){i._legend.setStyle(a.field,{fillStyle:a.__lineStrokeStyle})}),this._legend.inited=!0)},_endDraw:function(){this.core.addChild(this._xAxis.sprite),this.core.addChild(this._yAxis.sprite),this._yAxisR&&this.core.addChild(this._yAxisR.sprite),this.core.addChild(this._graphs.sprite),this.stageTip.addChild(this._tips.sprite)},_setLegend:function(a){!a&&(a={});var b=this;if(!(!this.legend||this.legend&&"enabled"in this.legend&&!this.legend.enabled)){var c=_.deepExtend({enabled:!0,label:function(a){return a.field},onChecked:function(a){b.add(a)},onUnChecked:function(a){b.remove(a)}},this._opts.legend);this._legend=new l(this._getLegendData(),c),this.stage.addChild(this._legend.sprite),this._legend.pos({x:0,y:this.padding.top+(a.resize?-this._legend.height:0)}),!a.resize&&(this.padding.top+=this._legend.height)}},_getLegendData:function(){var a=this,b=[];return _.each(_.flatten(a.dataFrame.yAxis.field),function(a,c){b.push({field:a,value:null,fillStyle:null})}),b},_initPlugs:function(a,b){a.markLine&&this._initMarkLine(b),a.markPoint&&this._initMarkPoint(b)},_getCloneLine:function(a){var b=this;a=a||n;var c=b.el.cloneNode();c.innerHTML="",c.id=b.el.id+"_currclone",c.style.position="absolute",c.style.width=b.el.offsetWidth+"px",c.style.height=b.el.offsetHeight+"px",c.style.top="10000px",document.body.appendChild(c);var d=_.deepExtend({},b._opts);_.deepExtend(d,{graphs:{line:{lineWidth:1,strokeStyle:"#ececec"},node:{enabled:!1},fill:{alpha:.5,fillStyle:"#ececec"},animation:!1,eventEnabled:!1,text:{enabled:!1}},dataZoom:{enabled:!1},xAxis:{},yAxis:{}});var e=new a(c,b._data,d);return e.draw(),{thumbBar:e,cloneEl:c}},_initDataZoom:function(a){var b=this,c=_.deepExtend({w:b._xAxis.xGraphsWidth,pos:{x:b._xAxis.pos.x,y:b._xAxis.pos.y+b._xAxis.h},count:b._data.length-1,dragIng:function(a){(parseInt(a.start)!=parseInt(b.dataZoom.range.start)||parseInt(a.end)!=parseInt(b.dataZoom.range.end))&&(b.dataZoom.range.start=parseInt(a.start),b.dataZoom.range.end=parseInt(a.end),b.resetData(b._data))}},b.dataZoom),d=b.el.cloneNode();d.innerHTML="",d.id=b.el.id+"_currclone",d.style.position="absolute",d.style.top="10000px",document.body.appendChild(d);var e=_.deepExtend({},b._opts);_.deepExtend(e,{graphs:{line:{lineWidth:1,strokeStyle:"#ececec"},node:{enabled:!1},fill:{alpha:.5,fillStyle:"#ececec"},animation:!1},dataZoom:null}),b._dataZoom=new k(c);var f=this.__cloneChart.thumbBar._graphs.sprite;f.id=f.id+"_datazoomthumbbarbg",f.context.x=0,f.context.y=b._dataZoom.h-b._dataZoom.barY,f.context.scaleY=b._dataZoom.barH/this.__cloneChart.thumbBar._graphs.h,b._dataZoom.dataZoomBg.addChild(f),b.core.addChild(b._dataZoom.sprite),this.__cloneChart.thumbBar.destroy(),this.__cloneChart.cloneEl.parentNode.removeChild(this.__cloneChart.cloneEl)},_initMarkPoint:function(a){var b=this;require(["chartx/components/markpoint/index"],function(c){_.each(a.data,function(d,e){var f=a._circles.children[e],g={value:d.value,markTarget:a.field,point:f.localToGlobal(),r:f.context.r+2,groupLen:a.data.length,iNode:e,iGroup:a._groupInd};b._opts.markPoint&&"circle"!=b._opts.markPoint.shapeType&&(g.point.y-=f.context.r+3),new c(b._opts,g).done(function(){b.core.addChild(this.sprite);var a=this;this.shape.hover(function(a){this.context.hr++,this.context.cursor="pointer",a.stopPropagation()},function(a){this.context.hr--,a.stopPropagation()}),this.shape.on("mousemove",function(a){a.stopPropagation()}),this.shape.on("tap click",function(c){c.stopPropagation(),c.eventInfo=a,b.fire("markpointclick",c)})})})})},_initMarkLine:function(a,b){var c=this,d=a._groupInd;_.clone(a._pointList);b||(b=c.dataFrame);var e=parseInt(b.yAxis.center[d].agPosition);require(["chartx/components/markline/index"],function(f){var g=a.field+"均值",h=a.line.strokeStyle;if(c.markLine.text&&c.markLine.text.enabled&&_.isFunction(c.markLine.text.format)){var i={iGroup:d,value:b.yAxis.center[d].agValue};g=c.markLine.text.format(i)}var j=e;if(void 0!=c.markLine.y){var j=c.markLine.y;_.isFunction(j)&&(j=j(a.field)),_.isArray(j)&&(j=j[d]),void 0!=j&&(j=a._yAxis.getYposFromVal(j))}var i={w:c._xAxis.xGraphsWidth,h:c._yAxis.yGraphsHeight,origin:{x:c._back.pos.x,y:c._back.pos.y},line:{y:j,list:[[0,0],[c._xAxis.xGraphsWidth,0]],strokeStyle:h},text:{content:g,fillStyle:h},field:a.field};new f(_.deepExtend(i,c._opts.markLine)).done(function(){c.core.addChild(this.sprite)})})},bindEvent:function(a,b){var c=this;b||(b=c._setXaxisYaxisToTipsInfo),a.on("panstart mouseover",function(a){c._tips.enabled&&a.eventInfo.nodesInfoList.length>0&&(c._tips.hide(a),b.apply(c,[a]),c._tips.show(a))}),a.on("panmove mousemove",function(a){c._tips.enabled&&(a.eventInfo.nodesInfoList.length>0?(b.apply(c,[a]),c._tips._isShow?c._tips.move(a):c._tips.show(a)):c._tips._isShow&&c._tips.hide(a))}),a.on("panend mouseout",function(a){a.toTarget&&"node"==a.toTarget.name||c._tips.enabled&&c._tips.hide(a)}),a.on("tap",function(a){c._tips.enabled&&a.eventInfo.nodesInfoList.length>0&&(c._tips.hide(a),b.apply(c,[a]),c._tips.show(a))}),a.on("click",function(a){b.apply(c,[a]),c.fire("click",a.eventInfo)})},_setXaxisYaxisToTipsInfo:function(a){if(a.eventInfo){var b=this;a.eventInfo.xAxis={field:this.dataFrame.xAxis.field,value:this.dataFrame.xAxis.org[0][a.eventInfo.iNode]},a.eventInfo.dataZoom=b.dataZoom,a.eventInfo.rowData=this.dataFrame.getRowData(a.eventInfo.iNode),a.eventInfo.iNode+=this.dataZoom.range.start}},_trimGraphs:function(a,b){function c(b,d,g,h,i){for(var j=0,k=b.length;k>j;j++){var l=d[j];if(!l)return;var m=[];if(g.push(m),i&&e.biaxial&&j>0&&(a=e._yAxisR,f=a.dataSection[a.dataSection.length-1]),_.isArray(b[j])){var n=[];h.push(n),c(b[j],l,m,n)}else{var o=0;h[j]={};for(var p=0,q=l.length;q>p&&!(p>=e._xAxis.data.length);p++){var r=e._xAxis.data[p].x,s=-(l[p]-a._bottomNumber)/(f-a._bottomNumber)*a.yGraphsHeight;s=isNaN(s)?0:s,m[p]={value:l[p],x:r,y:s},o+=l[p]}h[j].agValue=o/q,h[j].agPosition=-(h[j].agValue-a._bottomNumber)/(f-a._bottomNumber)*a.yGraphsHeight}}}function d(a){return e.type&&e.type.indexOf("line")>=0?e._lineChart.dataFrame.yAxis.field:e.dataFrame.yAxis.field}a||(a=this._yAxis),b||(b=this.dataFrame);var e=this,f=a.dataSection[a.dataSection.length-1],g=b.yAxis.org,h=[],i=[];return c(d(),g,h,i,!0),b.yAxis.center=i,h},_getPosAtGraphs:function(a,b){var c=this._xAxis.data[a].x,d=this._graphs.data[0][a].y;return{x:c,y:d}},_getGraphsDisX:function(){var a=this._xAxis.dataSection.length,b=this._xAxis.xGraphsWidth/(a-1);return 1==a&&(b=0),b}});return n});