define("chartx/chart/map/index",["chartx/chart/index","canvax/shape/Path","chartx/chart/map/mapdata","./tips"],function(a,b,c,d){return a.extend({init:function(){this.itemStyle={strokeStyle:"white",fillStyle:"#c9bbe6",lineWidth:3},this.itemHoverStyle={strokeStyle:"#9378ce",fillStyle:"#c9bbe6",lineWidth:3}},draw:function(){this._initModule(),this._widget()},_widget:function(){var a=this,d=c.get();_.each(d,function(c){var d=new b({context:{x:0,y:0,path:c.d,lineWidth:a.itemStyle.lineWidth,fillStyle:a.itemStyle.fillStyle,strokeStyle:a.itemStyle.strokeStyle}});d.mapData=c,d.on("mouseover hold",function(b){this.context.strokeStyle=a.itemHoverStyle.strokeStyle,this.context.lineWidth=a.itemHoverStyle.lineWidth,a._tips.show(b)}),d.on("mouseout release",function(b){this.context.strokeStyle=a.itemStyle.strokeStyle,this.context.lineWidth=a.itemStyle.lineWidth,a._tips.hide(b)}),a.stage.addChild(d)})},_initModule:function(){this._tips=new d(this.tips,{context:"\u4e2d\u56fd\u5730\u56fe"},this.canvax.getDomContainer()),this.canvax.getHoverStage().addChild(this._tips.sprite)}})});