define("chartx/chart/line/graphs",["canvax/index","canvax/shape/Rect","chartx/utils/tools","chartx/chart/line/group"],function(a,b,c,d){var e=function(a,b){this.w=0,this.h=0,this.y=0,this.opt=a,this.root=b,this.ctx=b.stage.context2D,this.field=null,this._yAxisFieldsMap={},this._setyAxisFieldsMap(),this.data=[],this.disX=0,this.groups=[],this.iGroup=0,this.iNode=-1,this.sprite=null,this.induce=null,this.eventEnabled=a.eventEnabled||!0,this.init(a)};return e.prototype={init:function(b){this.opt=b,this.sprite=new a.Display.Sprite},setX:function(a){this.sprite.context.x=a},setY:function(a){this.sprite.context.y=a},getX:function(){return this.sprite.context.x},getY:function(){return this.sprite.context.y},draw:function(a){_.deepExtend(this,a),this._widget(a);var b=this;_.each(this.groups,function(a){b._yAxisFieldsMap[a.field].line=a.line})},resetData:function(a,b){var c=this;c.data=a,b&&_.deepExtend(c,b);for(var d=0,e=c.field.length;e>d;d++){var f=c.groups[d];f.resetData({data:c.data[c._yAxisFieldsMap[f.field].ind]})}},grow:function(a){_.each(this.groups,function(b,c){b._grow(a)})},_setyAxisFieldsMap:function(){var a=this;_.each(_.flatten(this._getYaxisField()),function(b,c){var d=a._yAxisFieldsMap[b];d?a._yAxisFieldsMap[b].ind=c:a._yAxisFieldsMap[b]={ind:c}})},_addyAxisFieldsMap:function(a){if(!this._yAxisFieldsMap[a]){var b;for(var c in this._yAxisFieldsMap)isNaN(b)&&(b=0),b=Math.max(this._yAxisFieldsMap[c].ind,b);this._yAxisFieldsMap[a]={ind:isNaN(b)?0:++b}}},_getYaxisField:function(a){return this.root.type&&this.root.type.indexOf("line")>=0?this.field=this.root._lineChart.dataFrame.yAxis.field:this.field=this.root.dataFrame.yAxis.field,this.field},creatFields:function(a,b){var c=this,d=[];return _.each(b,function(b,e){_.isArray(b)?d.push(c.creatFields(a,b)):a==b?d.push(b):d.push(null)}),d},yAxisFieldChange:function(a,b){!b&&(b=c.data);var c=this;_.isString(a)&&(a=[a]);for(var d=0,e=c.field.length;e>d;d++){var f=c.field[d],g=_.find(a,function(a){return a==f});g||(c.remove(d),c.field.splice(d,1),delete c._yAxisFieldsMap[f],c.update({data:b}),d--,e--)}_.each(a,function(a,d){var e=_.find(c.groups,function(b){return b.field==a});e||c.add({data:b},a)}),c._setyAxisFieldsMap(),_.each(c.groups,function(a,b){a.update({_groupInd:b})})},add:function(a,b){_.deepExtend(this,a),this._addyAxisFieldsMap(b);var c=this.creatFields(b,this._getYaxisField());this._setGroupsForYfield(c,this.data,this._yAxisFieldsMap[b].ind),this.update()},remove:function(a){var b=this.groups.splice(a,1)[0];b.destroy()},update:function(a){a&&_.deepExtend(this,a);var b=this;_.each(this.groups,function(a,c){a.update({data:b.data[c]})})},_setGroupsForYfield:function(a,b,c){for(var e=[],f=this,g=0,h=a.length;h>g;g++)if(b[g]&&a[g]){var i=f.root._yAxis.sort,j=f.root.biaxial,k=f.root._yAxis,l=c||0===c?c:g;if(_.isArray(a[g]))f._setGroupsForYfield(a[g],b[g],g);else{_.isArray(i)&&(i=i[l]||"asc"),j&&l>0&&(k=f.root._yAxisR);var m=f._yAxisFieldsMap[a[g]];m._yAxis=k,m._sort=i,m._groupInd=l;var n=new d(a[g],l,f.opt,f.ctx,i,k,f.h,f.w);n.draw({data:b[g]}),f.sprite.addChildAt(n.sprite,l);for(var o=!1,p=0,q=f.groups.length;q>p;p++)if(f.groups[p]._groupInd>l){f.groups.splice(p,0,n),o=!0;break}o||f.groups.push(n),e.push(n)}}return e},_widget:function(a){var c=this;c.eventEnabled&&(c._setGroupsForYfield(c._getYaxisField(),c.data),c.induce=new b({id:"induce",context:{y:-c.h,width:c.w,height:c.h,fillStyle:"#000000",globalAlpha:0,cursor:"pointer"}}),c.sprite.addChild(c.induce),c.induce.on("panstart mouseover",function(a){a.eventInfo=c._getInfoHandler(a)}),c.induce.on("panmove mousemove",function(a){a.eventInfo=c._getInfoHandler(a)}),c.induce.on("panend mouseout",function(a){a.eventInfo=c._getInfoHandler(a),c.iGroup=0,c.iNode=-1}),c.induce.on("tap click",function(a){a.eventInfo=c._getInfoHandler(a)}))},_getInfoHandler:function(a){var b=a.point.x,d=a.point.y-this.h;b=b>this.w?this.w:b;for(var e=0==this.disX?0:parseInt((b+this.disX/2)/this.disX),f=[],g=0,h=this.groups.length;h>g;g++){var i=this.groups[g].getNodeInfoAt(e);i&&f.push(i)}var j=c.getDisMinATArr(d,_.pluck(f,"y"));this.iGroup=j,this.iNode=e;var k={iGroup:this.iGroup,iNode:this.iNode,nodesInfoList:_.clone(f)};return k}},e});