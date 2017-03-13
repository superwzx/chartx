define("chartx/components/xaxis/xAxis",["canvax/index","canvax/core/Base","canvax/shape/Line","chartx/utils/tools"],function(a,b,c,d){var e=function(a,b){this.graphw=0,this.graphh=0,this.yAxisW=0,this.width=0,this.height=0,this.disY=1,this.dis=6,this.label="",this._label=null,this.line={enabled:1,width:1,height:4,strokeStyle:"#cccccc"},this.text={fillStyle:"#999",fontSize:12,rotation:0,format:null,textAlign:"center"},this.maxTxtH=0,this.pos={x:null,y:null},this.enabled=1,this.disXAxisLine=6,this.disOriginX=0,this.xGraphsWidth=0,this.dataOrg=[],this.dataSection=[],this._layoutDataSection=[],this.data=[],this.layoutData=[],this.sprite=null,this._textMaxWidth=0,this.leftDisX=0,this.filter=null,this.isH=!1,this.animation=!0,this.resize=!1,this.maxVal=null,this.minVal=null,this.xDis=0,this.layoutType="step",this.autoTrimLayout=!0,this.init(a,b)};return e.prototype={init:function(b,c){this.sprite=new a.Display.Sprite({id:"xAxisSprite"}),this.rulesSprite=new a.Display.Sprite({id:"rulesSprite"}),this.sprite.addChild(this.rulesSprite),this._initHandle(b,c)},_initHandle:function(a,b){b&&b.org&&(this.dataOrg=b.org),a&&(_.deepExtend(this,a),!a.dataSection&&this.dataOrg&&(this.dataSection=this._initDataSection(this.dataOrg))),0!=this.text.rotation&&(this.text.rotation%90==0&&(this.isH=!0),this.text.textAlign="right"),this.line.enabled||(this.line.height=1),this._layoutDataSection=this._formatDataSectionText(this.dataSection),this._setTextMaxWidth(),this._setXAxisHeight(),null==this.minVal&&(this.minVal=_.min(this.dataSection)),null==this.maxVal&&(this.maxVal=_.max(this.dataSection))},_initDataSection:function(a){return _.flatten(a)},setX:function(a){this.sprite.context.x=a},setY:function(a){this.sprite.context.y=a},reset:function(a,b){_.deepExtend(this,a),this._initHandle(a,b),this.draw()},resetData:function(a){this.sprite.removeAllChildren(),this.dataSection=[],this._initHandle(null,a),this.draw()},getIndexOfVal:function(a){for(var b,c=0,d=this.data.length;d>c;c++){var e=this.data[c];if(e.content==a){b=c;break}}return b},draw:function(a){0==this.data.length,this._getLabel(),this._initConfig(a),this.data=this._trimXAxis(this.dataSection,this.xGraphsWidth);var b=this;_.each(this.data,function(a,c){a.layoutText=b._layoutDataSection[c]}),this._trimLayoutData(),this.setX(this.pos.x),this.setY(this.pos.y),this.enabled&&this._widget(),this.resize=!1},_getLabel:function(){this.label&&""!=this.label&&(this._label=new a.Display.Text(this.label,{context:{fontSize:this.text.fontSize,textAlign:this.isH?"center":"left",textBaseline:this.isH?"top":"middle",fillStyle:this.text.fillStyle,rotation:this.isH?-90:0}}))},_initConfig:function(a){a&&_.deepExtend(this,a),this.yAxisW=Math.max(this.yAxisW,this.leftDisX),this.width=this.graphw-this.yAxisW,null==this.pos.x&&(this.pos.x=this.yAxisW+this.disOriginX),null==this.pos.y&&(this.pos.y=this.graphh-this.height),this.xGraphsWidth=parseInt(this.width-this._getXAxisDisLine()),this._label&&(this.isH?this.xGraphsWidth-=this._label.getTextHeight()+5:this.xGraphsWidth-=this._label.getTextWidth()+5),this.disOriginX=parseInt((this.width-this.xGraphsWidth)/2)},getPosX:function(a){var b=0,c=a.val,d="ind"in a?a.ind:_.indexOf(this.dataSection,c),e="dataLen"in a?a.dataLen:this.dataSection.length,f="xGraphsWidth"in a?a.xGraphsWidth:this.xGraphsWidth,g="layoutType"in a?a.layoutType:this.layoutType;return 1==e?b=f/2:("rule"==g&&(b=d/(e-1)*f),"proportion"==g&&(void 0==c&&(c=d*(this.maxVal-this.minVal)/(e-1)+this.minVal),b=f*((c-this.minVal)/(this.maxVal-this.minVal))),"peak"==g&&(b=this.xDis*(d+1)-this.xDis/2),"step"==g&&(b=f/(e+1)*(d+1))),parseInt(b,10)},_trimXAxis:function(b,c){var d=[],e=b||this.dataSection,f=f||this.xGraphsWidth;this.xDis=parseInt(f/e.length);for(var g=0,h=e.length;h>g;g++){var i=new a.Display.Text(e[g],{context:{fontSize:this.text.fontSize}}),j={content:e[g],x:this.getPosX({val:e[g],ind:g,dataLen:h,xGraphsWidth:f}),textWidth:i.getTextWidth()};d.push(j)}return d},_formatDataSectionText:function(a){a||(a=this.dataSection);var b=this,c=[];return _.each(a,function(a){c.push(b._getFormatText(a))}),c},_getXAxisDisLine:function(){var a=this.disXAxisLine,b=2*a,c=a;return c=a+this.width%_.flatten(this.dataOrg).length,c=c>b?b:c,c=isNaN(c)?0:c},_setXAxisHeight:function(){if(this.enabled){var b=new a.Display.Text(this._layoutDataSection[0]||"test",{context:{fontSize:this.text.fontSize}});if(this.maxTxtH=b.getTextHeight(),this.text.rotation)if(this.text.rotation%90==0)this.height=this._textMaxWidth+this.line.height+this.disY+this.dis+3;else{var c=Math.sin(Math.abs(this.text.rotation)*Math.PI/180),d=Math.cos(Math.abs(this.text.rotation)*Math.PI/180);this.height=c*this._textMaxWidth+b.getTextHeight()+5,this.leftDisX=d*b.getTextWidth()+8}else this.height=this.disY+this.line.height+this.dis+this.maxTxtH,this.leftDisX=b.getTextWidth()/2}else this.dis=0,this.height=3},_getFormatText:function(a){var b;return b=_.isFunction(this.text.format)?this.text.format(a):a,_.isArray(b)&&(b=d.numAddSymbol(b)),b||(b=a),b},_widget:function(){var d=this.layoutData;this._label&&(this._label.context.x=this.xGraphsWidth+5,this.sprite.addChild(this._label));for(var e=Math.min(1e3/d.length,25),f=0,g=d.length;g>f;f++){xNodeId="xNode"+f;var h=this.rulesSprite.getChildById(xNodeId);h||(h=new a.Display.Sprite({id:xNodeId}),this.rulesSprite.addChild(h));var i=!0;void 0!==d[f].visible&&(i=d[f].visible),h.context.visible=i;var j=d[f],k=j.x,l=this.disY+this.line.height+this.dis,m={x:j.text_x||j.x,y:l+20,fillStyle:this.text.fillStyle,fontSize:this.text.fontSize,rotation:-Math.abs(this.text.rotation),textAlign:this.text.textAlign,textBaseline:this.text.rotation?"middle":"top",globalAlpha:0};if(h._txt?(h._txt.resetText(j.layoutText+""),this.animation?h._txt.animate({x:m.x},{duration:300}):h._txt.context.x=m.x):(h._txt=new a.Display.Text(j.layoutText,{id:"xAxis_txt_"+b.getUID(),context:m}),h.addChild(h._txt),this.animation&&!this.resize?h._txt.animate({globalAlpha:1,y:h._txt.context.y-20},{duration:500,easing:"Back.Out",delay:f*e,id:h._txt.id}):(h._txt.context.y=h._txt.context.y-20,h._txt.context.globalAlpha=1)),this.text.rotation&&90!=this.text.rotation&&(h._txt.context.x+=5,h._txt.context.y+=3),this.line.enabled){var n={x:k,y:this.disY,xEnd:0,yEnd:this.line.height+this.disY,lineWidth:this.line.width,strokeStyle:this.line.strokeStyle};h._line?this.animation?h._line.animate({x:n.x},{duration:300}):h._line.context.x=n.x:(h._line=new c({context:n}),h.addChild(h._line))}_.isFunction(this.filter)&&this.filter({layoutData:d,index:f,txt:h._txt,line:h._line||null})}if(this.rulesSprite.children.length>d.length)for(var g=d.length,o=this.rulesSprite.children.length;o>g;g++)this.rulesSprite.getChildAt(g).remove(),g--,o--},_setTextMaxWidth:function(){for(var b=this._layoutDataSection,c=b[0],d=0,e=b.length;e>d;d++)b[d].length>c.length&&(c=b[d]);var f=new a.Display.Text(c||"test",{context:{fillStyle:this.text.fillStyle,fontSize:this.text.fontSize}});return this._textMaxWidth=f.getTextWidth(),this._textMaxHeight=f.getTextHeight(),this._textMaxWidth},_trimLayoutData:function(){function a(e){var f=c[e];f.visible=!0;for(var g=e;d-1>g;g++){var h=c[g+1],i=h.x-h.textWidth/2;if(g==d-2&&("center"==b.text.textAlign&&h.x+h.textWidth/2>b.width&&(i=b.width-h.textWidth,h.text_x=b.width-h.textWidth/2),"left"==b.text.textAlign&&h.x+h.textWidth>b.width&&(i=b.width-h.textWidth,h.text_x=b.width-h.textWidth)),!(i<f.x+f.textWidth/2)){a(g+1);break}if(g==d-2)return h.visible=!0,void(f.visible=!1);h.visible=!1}}var b=this,c=this.data,d=c.length;this.text.rotation||a(0),this.layoutData=this.data}},e});