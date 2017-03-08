define("chartx/chart/line/markcolumn",["canvax/index","canvax/shape/Line","canvax/core/Base","canvax/event/EventDispatcher","canvax/shape/Circle"],function(a,b,c,d,e){var f=function(a,b){this.xVal=null,this.line={enabled:1,eventEnabled:!0},this.node={enabled:1},this.sprite=null,this._line=null,this._nodes=null,this._isShow=!1,this.enabled=!0,this.y=0,this.h=0,this._eventMap={},this.init(a,b)};return c.creatClass(f,d,{init:function(b,c){_.deepExtend(this,b),this.sprite=new a.Display.Sprite({id:"tips"})},show:function(a,b){return this.eventInfo=a.eventInfo,this.sprite.context.visible=!0,this._showLine(b),this._showNodes(a,b),this},hide:function(){this.sprite.context.visible=!1},move:function(a,b){this.eventInfo=a.eventInfo,this._line&&(this._line.context.x=parseInt(b.x)),void 0!==b.xVal&&(this.xVal=b.xVal),this._resetNodesStatus(a,b)},destroy:function(){this.sprite.destroy(),this._line=null,this._nodes=null},_showLine:function(a){var c=this,d=_.deepExtend({x:parseInt(a.x),y:c.y,xStart:0,yStart:c.h,xEnd:0,yEnd:0,lineWidth:1,strokeStyle:this.line.strokeStyle||"#cccccc"},this.line);return this.line.enabled&&(this._line?_.extend(this._line.context,d):(this._line=new b({id:"tipsLine",context:d}),this._line.name="_markcolumn_line",this.sprite.addChild(this._line),this.line.eventEnabled&&(this._line.on("mouseover",function(a){a.fromTarget&&"_markcolumn_node"==a.fromTarget.name||(a.eventInfo=c.eventInfo,null!==c.xVal&&(a.eventInfo.xAxis={value:c.xVal}),c.fire("mouseover",a))}),this._line.on("mousemove",function(a){a.eventInfo=c.eventInfo,null!==c.xVal&&(a.eventInfo.xAxis={value:c.xVal}),c.fire("mousemove",a)}),this._line.on("mouseout",function(a){a.toTarget&&"_markcolumn_node"==a.toTarget.name||(a.eventInfo=c.eventInfo,null!==c.xVal&&(a.eventInfo.xAxis={value:c.xVal}),c.fire("mouseout",a))})))),this},_showNodes:function(b,c){var d=this;if(this.node.enabled){if(this._nodes)this._resetNodesStatus(b,c);else{this._nodes=new a.Display.Sprite({context:{x:parseInt(c.x),y:d.y}});var d=this;_.each(b.eventInfo.nodesInfoList,function(c){var f=new a.Display.Sprite({context:{y:d.h-Math.abs(c.y)}}),g=new e({context:{r:c.r+2,fillStyle:d.node.backFillStyle||"white",strokeStyle:d.node.strokeStyle||c.strokeStyle,lineWidth:c.lineWidth,cursor:"pointer"}});g.name="_markcolumn_node",g.eventInfo={iGroup:0,iNode:b.eventInfo.iNode,nodesInfoList:[c]},f.addChild(g),d._nodes.addChild(f),g.on("mouseover",function(a){(!a.fromTarge||"_markcolumn_line"!=a.fromTarget.name&&"_markcolumn_node"!=a.fromTarget.name)&&(a.eventInfo=a.target.eventInfo,null!==d.xVal&&(a.eventInfo.xAxis={value:d.xVal}),d.fire("mouseover",a))}),g.on("mousemove",function(a){a.eventInfo=a.target.eventInfo,null!==d.xVal&&(a.eventInfo.xAxis={value:d.xVal}),d.fire("mousemove",a)}),g.on("mouseout",function(a){(!a.toTarge||"_markcolumn_line"!=a.toTarget.name&&"_markcolumn_node"!=a.toTarget.name)&&(a.eventInfo=a.target.eventInfo,null!==d.xVal&&(a.eventInfo.xAxis={value:d.xVal}),d.fire("mouseout",a))}),g.on("click",function(a){var b={eventInfo:_.clone(a.target.eventInfo)};null!==d.xVal&&(b.eventInfo.xAxis={value:d.xVal}),d.sprite.fire("nodeclick",b)})}),this.sprite.addChild(this._nodes)}return this}},_resetNodesStatus:function(a,b){if(this.node.enabled){var c=this;this._nodes.children.length!=a.eventInfo.nodesInfoList.length&&(this._nodes.removeAllChildren(),this._nodes=null,this._showNodes(a,b)),this._nodes.context.x=parseInt(b.x),_.each(a.eventInfo.nodesInfoList,function(b,d){var e=c._nodes.getChildAt(d).context;e.y=c.h-Math.abs(b.y);var f=c._nodes.getChildAt(d).getChildAt(0);f.eventInfo={iGroup:0,iNode:a.eventInfo.iNode,nodesInfoList:[b]}})}}}),f});