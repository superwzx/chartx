define("chartx/chart/hybrid/bar_tgi",["canvax/index","chartx/chart/index","chartx/chart/bar/index","chartx/components/yaxis/yAxis","canvax/shape/Line","chartx/utils/datasection"],function(a,b,c,d,e,f){var g=c.extend({_init:function(a,b,c){var d=this;this.tgi={yAxis:{field:"tgi",text:{format:function(a){return 200==a?d.maxOrgYaxis:a}},place:"right"},back:{line:{strokeStyle:"#b7e6f8"}}},c.tgi&&_.deepExtend(this.tgi,c.tgi);var d=this;this._tgiData=_.find(this.dataFrame.data,function(a){return a.field==d.tgi.yAxis.field}),this.on("_dataZoomDragIng",function(a){d.redraw()})},draw:function(){this._setStages(),this._initModule(),this._setTgiYaxis(),this._startDraw(),this._drawEnd(),this._tgiDraw(),this.inited=!0},redraw:function(){var a=this;this._tgiData=_.find(this.dataFrame.data,function(b){return b.field==a.tgi.yAxis.field}),this.maxOrgYaxis=_.max(f.section(this._tgiData.data,3)),this._yAxisR.dataSection=[0,100,200],this._yAxisR.draw(),this._tgiGraphs.removeAllChildren(),this._tgiGraphsDraw()},_setTgiYaxis:function(){var a=this;this._yAxisR=new d(_.extend(_.clone(this.tgi.yAxis),{place:"right"}),a._tgiData),this.maxOrgYaxis=_.max(this._yAxisR.dataSection),this._yAxisR._bottomNumber=0,this._yAxisR.baseNumber=0,this._yAxisR.dataSection=[0,100,200]},_tgiDraw:function(){this._yAxisR&&this.core.addChild(this._yAxisR.sprite),this._tgiBg=new a.Display.Sprite({id:"tgiBg",context:{x:this._back.sprite.context.x,y:this._back.sprite.context.y}}),this.core.addChildAt(this._tgiBg,0);var b=new e({context:{xStart:this._graphs.w,yStart:this._yAxisR.layoutData[1].y,xEnd:0,yEnd:this._yAxisR.layoutData[1].y,lineWidth:2,strokeStyle:this.tgi.back.line.strokeStyle}}),c=new e({context:{xStart:this._graphs.w,yStart:0,xEnd:this._graphs.w,yEnd:-this._graphs.h,lineWidth:2,strokeStyle:this.tgi.back.line.strokeStyle}});this._tgiBg.addChild(b),this._tgiBg.addChild(c),this._tgiGraphs=new a.Display.Sprite({id:"tgiGraphs",context:{x:this._graphs.sprite.context.x,y:this._graphs.sprite.context.y}}),this.core.addChild(this._tgiGraphs),this._tgiGraphsDraw()},_tgiGraphsDraw:function(){var a=this,b=this._tgiData.data.length,c=this._graphs.w/b;_.each(this._tgiData.data,function(b,d){var f=c*d+(c-a._graphs.bar._width)/2-2,g=0;g=100>=b?-a._graphs.h/2*b/100:-(a._graphs.h/2+a._graphs.h/2*(b-100)/(a.maxOrgYaxis-100));var h=new e({context:{xStart:f,yStart:g,xEnd:f+a._graphs.bar._width+4,yEnd:g,lineWidth:2,strokeStyle:b>100?"#43cbb5":"#ff6060"}});a._tgiGraphs.addChild(h)})},_startDraw:function(a){var b=(a&&a.w||this.width,a&&a.h||this.height),c=parseInt(b-this._xAxis.h),d=c-this.padding.top-this.padding.bottom;this._yAxis.draw({pos:{x:this.padding.left,y:c-this.padding.bottom},yMaxHeight:d});var e=this._yAxis.w,f=0;this._yAxisR&&(this._yAxisR.draw({pos:{x:0,y:c-this.padding.bottom},yMaxHeight:d}),f=this._yAxisR.w,this._yAxisR.setX(this.width-f-this.padding.right+1)),this.dataZoom.enabled&&(this.__cloneBar=this._getCloneBar(g),this._yAxis.resetData(this.__cloneBar.thumbBar.dataFrame.yAxis,{animation:!1})),this._xAxis.draw({graphh:b-this.padding.bottom,graphw:this.width-f-this.padding.right,yAxisW:e}),this._xAxis.yAxisW!=e&&(this._yAxis.resetWidth(this._xAxis.yAxisW),e=this._xAxis.yAxisW);var h=this._yAxis.yGraphsHeight;this._back.draw({w:this._xAxis.xGraphsWidth,h:h,xAxis:{data:this._yAxis.layoutData},yAxis:{data:this._xAxis.layoutData},pos:{x:e,y:c-this.padding.bottom}}),this._setaverageLayoutData();var i=this._trimGraphs();this._graphs.draw(i.data,{w:this._xAxis.xGraphsWidth,h:this._yAxis.yGraphsHeight,pos:{x:e,y:c-this.padding.bottom},yDataSectionLen:this._yAxis.dataSection.length,sort:this._yAxis.sort}),this.dataZoom.enabled&&this._initDataZoom()}});return g});