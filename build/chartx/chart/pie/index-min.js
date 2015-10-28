define("chartx/chart/pie/pie",["canvax/index","canvax/shape/Sector","canvax/shape/Line","canvax/shape/BrokenLine","canvax/shape/Rect","chartx/utils/tools","canvax/animation/Tween","chartx/components/tips/tip"],function(Canvax,Sector,Line,BrokenLine,Rect,Tools,Tween,Tip){var Pie=function(a,b,c){this.data=null,this.sprite=null,this.branchSp=null,this.branchTxtSp=null,this.dataLabel={enabled:!0,allowLine:!0},this.tips=_.deepExtend({enabled:!0},b),this.domContainer=c,this._tip=null,this.init(a),this.colorIndex=0,this.sectors=[],this.sectorMap=[],this.isMoving=!1};return Pie.prototype={init:function(a){_.deepExtend(this,a),this.sprite=new Canvax.Display.Sprite,this._tip=new Tip(this.tips,this.domContainer),this._tip._getDefaultContent=this._getTipDefaultContent,this.sprite.addChild(this._tip.sprite),this.dataLabel.enabled&&(this.branchSp=new Canvax.Display.Sprite,this.branchTxtSp=new Canvax.Display.Sprite),this._configData(),this._configColors()},setX:function(a){this.sprite.context.x=a},setY:function(a){this.sprite.context.y=a},_configData:function(){var a=this;a.total=0,a.currentAngle=0;var b=12*a.boundWidth/1e3;a.labelFontSize=12>b?12:b;var c=2,d=a.data.data;if(a.clickMoveDis=a.r/11,d.length&&d.length>0){for(var e=0;e<d.length;e++)a.total+=d[e].y;if(a.total>0){for(var f=0,g=0,h=0,i=0;i<d.length;i++){var j=d[i].y/a.total,k=+(100*j).toFixed(c),l=Math.abs(100*j-k);h+=k,i>0&&j>d[f].orginPercentage&&(f=i),i>0&&l>d[g].percentageOffset&&(g=i);var m=360*j,n=a.currentAngle+m>360?360:a.currentAngle+m,o=Math.cos((a.currentAngle+m/2)/180*Math.PI),p=Math.sin((a.currentAngle+m/2)/180*Math.PI),q=a.currentAngle+m/2;o=o.toFixed(5),p=p.toFixed(5);var r=function(a){return a>360&&(a=360),a>=0&&90>=a?1:a>90&&180>=a?2:a>180&&270>=a?3:a>270&&360>=a?4:void 0}(q);_.extend(d[i],{start:a.currentAngle,end:n,midAngle:q,outOffsetx:a.clickMoveDis*o,outOffsety:a.clickMoveDis*p,centerx:(a.r-a.clickMoveDis)*o,centery:(a.r-a.clickMoveDis)*p,outx:(a.r+a.clickMoveDis)*o,outy:(a.r+a.clickMoveDis)*p,edgex:(a.r+2*a.clickMoveDis)*o,edgey:(a.r+2*a.clickMoveDis)*p,orginPercentage:j,percentage:k,percentageOffset:l,txt:k+"%",quadrant:r,labelDirection:1==r||4==r?1:0,index:i,isMax:!1}),a.currentAngle+=m,a.currentAngle>360&&(a.currentAngle=360)}d[f].isMax=!0;var s=(100-h).toFixed(c);0!=s&&(d[g].percentage+=+s,d[g].percentage=d[g].percentage.toFixed(c),d[g].txt=d[g].percentage.toFixed(c)+"%")}}},getList:function(){var a=this,b=[];return a.sectors&&a.sectors.length>0&&(b=a.sectors),b},showHideSector:function(a){var b=this,c=b.sectorMap;c[a]&&(c[a].visible?b._hideSector(a):b._showSector(a))},slice:function(a){var b=this,c=b.sectorMap;c[a]&&b.moveSector(c[a].sector)},getTopAndBottomIndex:function(){var a,b,c=self.data,d={},e=270,f=90,g=90,h=90;return c.length>0&&_.each(self.data,function(){1==c.quadrant||2==c.quadrant?(b=Math.abs(c.middleAngle-f),h>b&&(d.bottomIndex=c.index,h=b)):(3==c.quadrant||4==c.quadrant)&&(a=Math.abs(c.middleAngle-e),g>a&&(d.topIndex=c.index,g=a))}),d},getColorByIndex:function(a,b){return b>=a.length&&((this.data.data.length-1)%a.length==0&&b%a.length==0?b=b%a.length+1:b%=a.length),a[b]},_configColors:function(){var a=["#f05836","#7270b1","#359cde","#4fd2c4","#f4c646","#999","#FF7D00","#516DCC","#8ACC5F","#A262CB","#FFD202","#CC3E3C","#00A5FF","#009964","#CCB375","#694C99"];this.colors=this.colors?this.colors:a},draw:function(a){var b=this;b.setX(b.x),b.setY(b.y),b._widget(),a.animation&&b.grow(),a.complete&&a.complete.call(b)},moveSector:function(a){function b(){e=requestAnimationFrame(b),Tween.update()}if(a){var c=this,d=c.data.data,e=null;new Tween.Tween({percent:0}).to({percent:1},100).easing(Tween.Easing.Quadratic.InOut).onUpdate(function(){var b=this;_.each(c.sectors,function(c){c.context&&(c.index!=a.__dataIndex||c.sector.__isSelected?c.sector.__isSelected&&(c.context.x=d[c.sector.__dataIndex].outOffsetx*(1-b.percent),c.context.y=d[c.sector.__dataIndex].outOffsety*(1-b.percent)):(c.context.x=d[c.sector.__dataIndex].outOffsetx*b.percent,c.context.y=d[c.sector.__dataIndex].outOffsety*b.percent))})}).onComplete(function(){cancelAnimationFrame(e),_.each(c.sectors,function(b){b.sector&&(b=b.sector,b.__dataIndex!=a.__dataIndex||b.__isSelected?b.__isSelected&&(b.__isSelected=!1):b.__isSelected=!0)}),c.isMoving=!1}).start();c.isMoving=!0,b()}},grow:function(){function a(){c=requestAnimationFrame(a),Tween.update()}var b=this,c=null;_.each(b.sectors,function(a,b){a.context&&(a.context.r0=0,a.context.r=0,a.context.startAngle=0,a.context.endAngle=0)}),b._hideDataLabel();var d=function(){new Tween.Tween({process:0,r:0,r0:0}).to({process:1,r:b.r,r0:b.r0},800).onUpdate(function(){for(var a=this,c=0;c<b.sectors.length;c++)if(b.sectors[c].context)if(b.sectors[c].context.r=a.r,b.sectors[c].context.r0=a.r0,b.sectors[c].context.globalAlpha=a.process,0==c)b.sectors[c].context.startAngle=b.sectors[c].startAngle,b.sectors[c].context.endAngle=b.sectors[c].endAngle*a.process;else{var d=function(a){var c=a-1;return 0==c?b.sectors[c].context?b.sectors[c].context.endAngle:0:b.sectors[c].context?b.sectors[c].context.endAngle:arguments.callee(c)}(c);b.sectors[c].context.startAngle=d,b.sectors[c].context.endAngle=b.sectors[c].context.startAngle+(b.sectors[c].endAngle-b.sectors[c].startAngle)*a.process}}).onComplete(function(){cancelAnimationFrame(c),b.isMoving=!1,b._showDataLabel()}).start();a()};b.isMoving=!0,d()},_showDataLabel:function(){this.branchSp&&this.branchTxtSp&&(this.branchSp.context.globalAlpha=1,this.branchTxtSp.context.globalAlpha=1)},_hideDataLabel:function(){this.branchSp&&this.branchTxtSp&&(this.branchSp.context.globalAlpha=0,this.branchTxtSp.context.globalAlpha=0)},_showTip:function(a,b){this._tip.show(this._getTipsInfo(a,b))},_hideTip:function(a){this._tip.hide(a)},_moveTip:function(a,b){this._tip.move(this._getTipsInfo(a,b))},_getTipDefaultContent:function(a){return"<div style='color:"+a.fillStyle+"'><div style='padding-bottom:3px;'>"+a.name+"："+a.value+"</div>"+parseInt(a.percentage)+"%</div>"},_getTipsInfo:function(a,b){var c=this.data.data[b],d=this.getColorByIndex(this.colors,b);return a.tipsInfo={iNode:b,name:c.name,percentage:c.percentage,value:c.y,fillStyle:d,data:this.data.org[b]},a},_hideSector:function(a){this.sectorMap[a]&&(this.sectorMap[a].context.visible=!1,this.sectorMap[a].visible=!1,this._hideLabel(a))},_showSector:function(a){this.sectorMap[a]&&(this.sectorMap[a].context.visible=!0,this.sectorMap[a].visible=!0,this._showLabel(a))},_sectorFocus:function(a,b){this.sectorMap[b]&&this.focusCallback&&a&&this.focusCallback.focus(a,b)},_sectorUnfocus:function(a,b){this.focusCallback&&a&&this.focusCallback.unfocus(a,b)},_sectorClick:function(a,b){this.sectorMap[b]&&this.clickCallback&&this.clickCallback(a,b)},_getByIndex:function(a){return this.sectorMap[a]},_widgetLabel:function(quadrant,indexs,lmin,rmin,isEnd,ySpaceInfo){var self=this,data=self.data.data,sectorMap=self.sectorMap,minTxtDis=15,labelOffsetX=5,outCircleRadius=self.r+2*self.clickMoveDis,currentIndex,baseY,clockwise,isleft,minPercent,currentY,adjustX,txtDis,bkLineStartPoint,bklineMidPoint,bklineEndPoint,branchLine,brokenline,branchTxt,bwidth,bheight,bx,by,isMixed,yBound,remainingNum,remainingY,adjustY;for(clockwise=2==quadrant||4==quadrant,isleft=2==quadrant||3==quadrant,isup=3==quadrant||4==quadrant,minPercent=isleft?lmin:rmin,i=0;i<indexs.length;i++)if(currentIndex=indexs[i],!(0!=data[currentIndex].y&&data[currentIndex].percentage<=minPercent)){currentY=data[currentIndex].edgey,adjustX=Math.abs(data[currentIndex].edgex),txtDis=currentY-baseY,0!=i&&(Math.abs(txtDis)<minTxtDis||isup&&0>txtDis||!isup&&txtDis>0)&&(currentY=isup?baseY+minTxtDis:baseY-minTxtDis,outCircleRadius-Math.abs(currentY)>0&&(adjustX=Math.sqrt(Math.pow(outCircleRadius,2)-Math.pow(currentY,2))),(isleft&&-adjustX>data[currentIndex].edgex||!isleft&&adjustX<data[currentIndex].edgex)&&(adjustX=Math.abs(data[currentIndex].edgex))),isEnd&&(yBound=isleft?ySpaceInfo.left:ySpaceInfo.right,remainingNum=indexs.length-i,remainingY=isup?yBound-remainingNum*minTxtDis:yBound+remainingNum*minTxtDis,(isup&&currentY>remainingY||!isup&&remainingY>currentY)&&(currentY=remainingY)),bkLineStartPoint=[data[currentIndex].outx,data[currentIndex].outy],bklineMidPoint=[isleft?-adjustX:adjustX,currentY],bklineEndPoint=[isleft?-adjustX-labelOffsetX:adjustX+labelOffsetX,currentY],baseY=currentY,isEnd||(isleft?ySpaceInfo.left=baseY:ySpaceInfo.right=baseY),branchLine=new Line({context:{xStart:data[currentIndex].centerx,yStart:data[currentIndex].centery,xEnd:data[currentIndex].outx,yEnd:data[currentIndex].outy,lineWidth:1,strokeStyle:sectorMap[currentIndex].color,lineType:"solid"}}),brokenline=new BrokenLine({context:{lineType:"solid",smooth:!1,pointList:[bkLineStartPoint,bklineMidPoint,bklineEndPoint],lineWidth:1,strokeStyle:sectorMap[currentIndex].color}});var labelTxt="",formatReg=/\{.+?\}/g,point=data[currentIndex];switch(labelTxt=self.dataLabel.format?self.dataLabel.format.replace(formatReg,function(match,index){var matchStr=match.replace(/\{([\s\S]+?)\}/g,"$1"),vals=matchStr.split("."),obj=eval(vals[0]),pro=vals[1];return obj[pro]}):data[currentIndex].name+" : "+data[currentIndex].txt,branchTxt=new Canvax.Display.Text(labelTxt,{context:{x:data[currentIndex].edgex,y:data[currentIndex].edgey,fontSize:self.labelFontSize,fontWeight:"normal",fillStyle:sectorMap[currentIndex].color}}),bwidth=branchTxt.getTextWidth(),bheight=branchTxt.getTextHeight(),bx=isleft?-adjustX:adjustX,by=currentY,quadrant){case 1:bx+=labelOffsetX,by-=bheight/2;break;case 2:bx-=bwidth+labelOffsetX,by-=bheight/2;break;case 3:bx-=bwidth+labelOffsetX,by-=bheight/2;break;case 4:bx+=labelOffsetX,by-=bheight/2}branchTxt.context.x=bx,branchTxt.context.y=by,self.dataLabel.allowLine&&(self.branchSp.addChild(branchLine),self.branchSp.addChild(brokenline)),self.branchTxtSp.addChild(branchTxt),self.sectorMap[currentIndex].label={line1:branchLine,line2:brokenline,label:branchTxt}}},_hideLabel:function(a){if(this.sectorMap[a]){var b=this.sectorMap[a].label;b.line1.context.visible=!1,b.line2.context.visible=!1,b.label.context.visible=!1}},_showLabel:function(a){if(this.sectorMap[a]){var b=this.sectorMap[a].label;b.line1.context.visible=!0,b.line2.context.visible=!0,b.label.context.visible=!0}},_startWidgetLabel:function(){for(var a=this,b=a.data.data,c=0,d=0,e=[],f=[{indexs:[],count:0},{indexs:[],count:0},{indexs:[],count:0},{indexs:[],count:0}],g={right:{startQuadrant:4,endQuadrant:1,clockwise:!0,indexs:[]},left:{startQuadrant:3,endQuadrant:2,clockwise:!1,indexs:[]}},h=0;h<b.length;h++){var i=b[h].quadrant;f[i-1].indexs.push(h),f[i-1].count++}f[0].count>1&&f[0].indexs.reverse(),f[2].count>1&&f[2].indexs.reverse(),f[0].count>f[3].count&&(g.right.startQuadrant=1,g.right.endQuadrant=4,g.right.clockwise=!1),f[1].count>f[2].count&&(g.left.startQuadrant=2,g.left.endQuadrant=3,g.left.clockwise=!0),g.right.indexs=f[g.right.startQuadrant-1].indexs.concat(f[g.right.endQuadrant-1].indexs),g.left.indexs=f[g.left.startQuadrant-1].indexs.concat(f[g.left.endQuadrant-1].indexs);var j,k;g.right.indexs.length>15&&(k=g.right.indexs.slice(0),k.sort(function(a,c){return b[c].percentage-b[a].percentage}),j=k.slice(15),c=b[j[0]].percentage),g.left.indexs.length>15&&(k=g.left.indexs.slice(0),k.sort(function(a,c){return b[c].percentage-b[a].percentage}),j=k.slice(15),d=b[j[0]].percentage),e.push(g.right.startQuadrant),e.push(g.right.endQuadrant),e.push(g.left.startQuadrant),e.push(g.left.endQuadrant);var l={};for(h=0;h<e.length;h++){var m=1==h||3==h;a._widgetLabel(e[h],f[e[h]-1].indexs,d,c,m,l)}},_widget:function(){var a,b=this,c=b.data.data;if(c.length>0&&b.total>0){b.branchSp&&b.sprite.addChild(b.branchSp),b.branchTxtSp&&b.sprite.addChild(b.branchTxtSp);for(var d=0;d<c.length;d++){b.colorIndex>=b.colors.length&&(b.colorIndex=0);var e=b.getColorByIndex(b.colors,d);if(c[d].end>c[d].start){var f=new Sector({hoverClone:!1,context:{x:c[d].sliced?c[d].outOffsetx:0,y:c[d].sliced?c[d].outOffsety:0,r0:b.r0,r:b.r,startAngle:c[d].start,endAngle:c[d].end,fillStyle:e,index:c[d].index,cursor:"pointer"},id:"sector"+d});f.__data=c[d],f.__colorIndex=d,f.__dataIndex=d,f.__isSliced=c[d].sliced,f.hover(function(a){b.tips.enabled&&b._showTip(a,this.__dataIndex),b._sectorFocus(a,this.__dataIndex),b.allowPointSelect&&b.moveSector(this)},function(a){b.tips.enabled&&b._hideTip(a),b._sectorUnfocus(a,this.__dataIndex),b.allowPointSelect&&b.moveSector(this)}),f.on("mousemove",function(a){b.tips.enabled&&b._moveTip(a,this.__dataIndex)}),f.on("click",function(a){b._sectorClick(a,this.__dataIndex),!b.allowPointSelect&&b.moveSector(this)}),b.sprite.addChild(f),a={name:c[d].name,value:c[d].y,sector:f,context:f.context,originx:f.context.x,originy:f.context.y,r:b.r,startAngle:f.context.startAngle,endAngle:f.context.endAngle,color:e,index:d,percentage:c[d].percentage,visible:!0},b.sectors.push(a)}else c[d].end==c[d].start&&b.sectors.push({name:c[d].name,sector:null,context:null,originx:0,originy:0,r:b.r,startAngle:c[d].start,endAngle:c[d].end,color:e,index:d,percentage:0,visible:!0})}if(b.sectors.length>0){b.sectorMap={};for(var d=0;d<b.sectors.length;d++)b.sectorMap[b.sectors[d].index]=b.sectors[d]}b.dataLabel.enabled&&b._startWidgetLabel()}}},Pie}),define("chartx/chart/pie/index",["chartx/chart/index","chartx/chart/pie/pie"],function(a,b){var c=a.Canvax;return a.extend({init:function(a,b,c){this.config={mode:1,event:{enabled:1}},this.xAxis={field:null},this.yAxis={field:null},_.deepExtend(this,c),this.dataFrame=this._initData(b,this)},draw:function(){this.stageBg=new c.Display.Sprite({id:"bg"}),this.core=new c.Display.Sprite({id:"core"}),this.stageTip=new c.Display.Stage({id:"stageTip"}),this.canvax.addChild(this.stageTip),this.stageTip.toFront(),this.stage.addChild(this.core),this._initModule(),this._startDraw(),this._drawEnd(),this.inited=!0},getByIndex:function(a){return this._pie._getByIndex(a)},getList:function(){var a,b=this,c=[];if(b._pie){var d=b._pie.getList();if(d.length>0)for(var e=0;e<d.length;e++)a=d[e],c.push({name:a.name,index:a.index,color:a.color,r:a.r,value:a.value,percentage:a.percentage})}return c},focusAt:function(a){if(this._pie){this._pie._sectorFocus(null,a);var b=this.getByIndex(a).sector;b.__isSelected||this._pie.moveSector(b)}},unfocusAt:function(a){if(this._pie){this._pie._sectorUnfocus(null,a);var b=this.getByIndex(a).sector;b.__isSelected&&this._pie.moveSector(b)}},slice:function(a){this._pie&&this._pie.slice(a)},_initData:function(a,b){var c=[];if(this.xAxis.field){var d=a.shift(),e=_.indexOf(d,this.xAxis.field),f=e+1;f>=d.length&&(f=0),this.yAxis.field&&(f=_.indexOf(d,this.yAxis.field)),_.each(a,function(a){var b=[];_.isArray(a)?(b.push(a[e]),b.push(a[f])):"object"==typeof a&&(b.push(a.name),b.push(a.y)),c.push(b)})}else c=a;var g={};if(g.org=c,g.data=[],_.isArray(a))for(var h=0;h<a.length;h++){var i={};_.isArray(a[h])?(i.name=a[h][0],i.y=parseFloat(a[h][1]),i.sliced=!1,i.selected=!1):"object"==typeof a[h]&&(i.name=a[h].name,i.y=parseFloat(a[h].y),i.sliced=a[h].sliced||!1,i.selected=a[h].selected||!1),i.name&&g.data.push(i)}return g},clear:function(){this.stageBg.removeAllChildren(),this.core.removeAllChildren(),this.stageTip.removeAllChildren()},reset:function(a,b){this.clear(),this.width=parseInt(this.element.width()),this.height=parseInt(this.element.height()),this.draw(a,b)},_initModule:function(){var a=this,c=a.width,d=a.height,e=2*Math.min(c,d)/3/2;0==a.dataLabel.enabled&&(e=Math.min(c,d)/2,e-=e/11);var f=parseInt(a.innerRadius||0),g=2*e/3;f=f>=0?f:0,f=g>=f?f:g;var h=c/2,i=d/2;a.pie={x:h,y:i,r0:f,r:e,boundWidth:c,boundHeight:d,data:a.dataFrame,allowPointSelect:a.allowPointSelect,animation:a.animation,colors:a.colors,focusCallback:{focus:function(b,c){b.sectorIndex=c,b.eventInfo={sectorIndex:c},a.fire("focused",b)},unfocus:function(b,c){b.sectorIndex=c,b.eventInfo={sectorIndex:c},a.fire("unfocused",b)}},clickCallback:function(b,c){b.sectorIndex=c,b.eventInfo={sectorIndex:c},a.fire("click",b)}},a.dataLabel&&(a.pie.dataLabel=a.dataLabel),a._pie=new b(a.pie,a.tips,a.canvax.getDomContainer())},_startDraw:function(){this._pie.draw(this)},_drawEnd:function(){this.core.addChild(this._pie.sprite),this._tip&&this.stageTip.addChild(this._tip.sprite),this.fire("complete",{data:this.getList()})}})});