define("chartx/chart/tree/index",["chartx/chart/index","canvax/shape/Rect","canvax/shape/Line","canvax/shape/Circle","chartx/layout/tree/dagre","canvax/animation/Tween"],function(a,b,c,d,e,f){var g=a.Canvax;return a.extend({init:function(a,b,c){this.data=b,this.nodeFillStyle="#ffffff",this.nodeStrokeStyle="#58c592",this.linkStrokeStyle="#e5e5e5",this.labelColor="#58c592",this.graph={rankdir:"TB",nodesep:30,edgesep:30,ranksep:50},this.node={width:88,height:88},_.deepExtend(this,c),this._nodesRect={left:0,top:0,right:0,bottom:0},window._nodesRect=this._nodesRect},draw:function(){this._scaleDragHandRect=new b({context:{width:this.width,height:this.height,fillStyle:"black",globalAlpha:0}}),this.stage.addChild(this._scaleDragHandRect),this.sprite=new g.Display.Sprite,this.stage.addChild(this.sprite),this.nodesSp=new g.Display.Sprite({id:"nodesSprite"}),this.sprite.addChild(this.nodesSp),this.linksSp=new g.Display.Sprite({id:"linksSprite"}),this.sprite.addChild(this.linksSp),this.g=new e.graphlib.Graph,this.g.setGraph(this.graph),this.g.setDefaultEdgeLabel(function(){return{}}),this._initNodesAndLinks(),this._widget(),this._initNodesSpritePos(),this._initEventHand()},_initEventHand:function(){var a=this,b=!1;this._scaleDragHandRect.on("mousedown",function(c){a._scaleDragHandRect.toFront(),b=!0,a._dragTreeBegin(c)}),this._scaleDragHandRect.on("mousemove",function(c){b&&a._dragTreeIng(c)}),this._scaleDragHandRect.on("mouseup mouseout",function(c){a._scaleDragHandRect.toBack(),b=!1,a._dragTreeEnd(c)})},_lastDragPoint:null,_dragTreeBegin:function(a){this._lastDragPoint=a.point},_dragTreeIng:function(a){this.sprite.context.x+=a.point.x-this._lastDragPoint.x,this.sprite.context.y+=a.point.y-this._lastDragPoint.y,this._lastDragPoint=a.point},_dragTreeEnd:function(){this._lastDragPoint=null},addTo:function(a,b){for(i in a){if(this.data[i])return;this.data[i]=a[i],_.contains(this.data[b].link,i)||this.data[b].link.push(i);var c={};c[i]=a[i];var d=this._initNodesAndLinks(c);c=null,this._setParentLink(a[i],b),d.push(this._creatLinkLine(b,i)),this.g.setEdge(b,i),this._updateLayout(function(){_.each(d,function(a){a.context.globalAlpha=1}),d=null})}},remove:function(a){this._remove(a),this._updateLayout()},_remove:function(a){var b=this,c=this.data[a];_.each(c.parent,function(c){b.g.removeEdge(c,a),b.linksSp.getChildById("link_"+c+"_"+a).remove()}),_.each(c.link,function(a){b._remove(a)}),delete this.data[a],this.g.removeNode(a),this.nodesSp.getChildById("label_"+a).remove(),this.nodesSp.getChildById("rect_"+a).remove(),c=null},_setParentLink:function(a,b){a.parent?_.contains(a.parent,b)||a.parent.push(b):a.parent=[b]},getNodeContent:function(a){var b=new g.Display.Sprite({}),c=new g.Display.Text(a.label,{context:{fillStyle:this.labelColor,textAlign:"center",textBaseline:"middle"}});return a.width||(a.width=c.getTextWidth()+20),a.height||(a.height=c.getTextHeight()+15),b.addChild(c),b.context.width=a.width,b.context.height=a.height,c.context.x=a.width/2,c.context.y=a.height/2,b},_initNodesAndLinks:function(a){var c=this,d=null;a?d=[]:a=c.data;for(var e in a){var f=a[e];!f.width&&this.node.width&&(f.width=this.node.width),!f.height&&this.node.height&&(f.height=this.node.height);var h=new g.Display.Sprite({id:"node_"+e,context:{globalAlpha:0}}),i=new b({id:"rect_"+e,context:{fillStyle:this.nodeFillStyle,strokeStyle:this.nodeStrokeStyle,lineWidth:1,width:f.width,height:f.height}});h.addChild(i),h.addChild(this.getNodeContent(f)),_.isArray(f.link)&&f.link.length>0&&h.addChild(this._getTail(a)),this.nodesSp.addChild(h),_.isArray(d)&&d.push(h),c.g.setNode(e,f),f.link||(f.link=[]);var j=f.link;j.length>0&&_.each(j,function(b){c._creatLinkLine(e,b),c._setParentLink(a[b],e),c.g.setEdge(e,b)})}return d},_creatLinkLine:function(a,b){var d=new c({id:"link_"+a+"_"+b,context:{strokeStyle:this.nodeStrokeStyle,lineWidth:1,globalAlpha:0}});return this.linksSp.addChild(d),d},_widget:function(){var a=this;e.layout(a.g),a.g.nodes().forEach(function(b){var c=a.g.node(b),d=a.nodesSp.getChildById("node_"+b).context;d.x=c.x,d.y=c.y,d.globalAlpha=1,a._nodesRect.left=Math.min(a._nodesRect.left,c.x-c.width/2),a._nodesRect.top=Math.min(a._nodesRect.top,c.y-c.height/2),a._nodesRect.right=Math.max(a._nodesRect.right,c.x+c.width/2),a._nodesRect.bottom=Math.max(a._nodesRect.bottom,c.y+c.height/2)})},_updateLayout:function(a){this._tweenLayout(this._getLayoutChanged(),a)},_getLayoutChanged:function(){var a=this,b={};_.each(a.nodesSp.children,function(a){var c=a.context;b[a.id+"_x"]=c.x,b[a.id+"_y"]=c.y}),_.each(a.linksSp.children,function(a){var c=a.context;b[a.id+"_xStart"]=c.xStart,b[a.id+"_yStart"]=c.yStart,b[a.id+"_xEnd"]=c.xEnd,b[a.id+"_yEnd"]=c.yEnd}),e.layout(a.g);var c={};return a.g.nodes().forEach(function(b){var d=a.g.node(b),e="label_"+b;c[e+"_x"]=d.x,c[e+"_y"]=d.y;var f="rect_"+b;c[f+"_x"]=d.x-d.width/2,c[f+"_y"]=d.y-d.height/2}),a.g.edges().forEach(function(b){var d=a.g.edge(b),e="link_"+b.v+"_"+b.w;c[e+"_xStart"]=d.points[0].x,c[e+"_yStart"]=d.points[0].y,c[e+"_xEnd"]=d.points[2].x,c[e+"_yEnd"]=d.points[2].y}),{pos:b,posTo:c}},_tweenLayout:function(a,b){function c(){e=requestAnimationFrame(c),f.update()}var d=this,e=null,g=function(){new f.Tween(a.pos).to(a.posTo,300).onUpdate(function(){for(var a in this){var b=this[a],c=a.slice(a.lastIndexOf("_")).replace("_","");a=a.substr(0,a.lastIndexOf("_")),"x"==c||"y"==c?d.nodesSp.getChildById(a).context[c]=b:d.linksSp.getChildById(a).context[c]=b}}).onComplete(function(){cancelAnimationFrame(e),b&&b()}).start();c()};g()},_initNodesSpritePos:function(){this.sprite.context.x=(this.width-(this._nodesRect.right-this._nodesRect.left))/2,this.sprite.context.y=10}})});