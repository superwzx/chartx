define("chartx/components/markpoint/index",["canvax/index","canvax/animation/Tween"],function(a,b){var c=function(a,c,d){this.data=d,this.point={x:0,y:0},this.normalColor="#6B95CF",this.shapeType="circle",this.fillStyle=null,this.strokeStyle=null,this.lineWidth=1,this.globalAlpha=.7,this.duration=800,this.easing=b.Easing.Linear.None,this.hr=5,this.vr=8,this.r=5,this.sprite=null,this.shape=null,this._doneHandle=null,this.done=function(a){this._doneHandle=a},this.realTime=!1,"markPoint"in a&&(this.enabled=!0,_.deepExtend(this,a.markPoint)),c&&_.deepExtend(this,c),this.init()};return c.prototype={init:function(){var b=this;this.sprite=new a.Display.Sprite({context:{x:this.point.x,y:this.point.y}}),setTimeout(function(){b.widget()},10)},widget:function(){switch(this._fillStyle=this._getColor(this.fillStyle,this.data),this._strokeStyle=this._getColor(this.strokeStyle,this.data),this.shapeType.toLocaleLowerCase()){case"circle":this._initCircleMark();break;case"droplet":this._initDropletMark()}},_getColor:function(a,b,c){var d=a;return _.isFunction(a)&&(d=a(b)),d&&""!=d||(d=arguments.length>=3?c:this.normalColor),d},_done:function(){this.shape.context.visible=!0,this.shapeBg&&(this.shapeBg.context.visible=!0),_.isFunction(this._doneHandle)&&this._doneHandle.apply(this,[])},_initCircleMark:function(){var a=this;require(["canvax/shape/Circle"],function(b){var c={r:a.r,fillStyle:a._fillStyle,lineWidth:a.lineWidth,strokeStyle:a._strokeStyle,globalAlpha:a.globalAlpha,cursor:"point",visible:!1};a.shape=new b({context:c}),a.sprite.addChild(a.shape),a._realTimeAnimate(),a._done()})},_realTimeAnimate:function(){function a(){d=requestAnimationFrame(a),b.update()}var c=this;if(c.realTime){c.shapeBg||(c.shapeBg=c.shape.clone(),c.sprite.addChildAt(c.shapeBg,0));var d=null,e=function(){new b.Tween({r:c.r,alpha:c.globalAlpha}).to({r:3*c.r,alpha:0},c.duration).onUpdate(function(){c.shapeBg.context.r=this.r,c.shapeBg.context.globalAlpha=this.alpha}).repeat(1/0).delay(800).easing(c.easing).start();a()};e()}},_initDropletMark:function(){var a=this;require(["canvax/shape/Droplet"],function(b){var c={y:-a.vr,scaleY:-1,hr:a.hr,vr:a.vr,fillStyle:a._fillStyle,lineWidth:a.lineWidth,strokeStyle:a._strokeStyle,globalAhpla:a.globalAhpla,cursor:"point",visible:!1};a.shape=new b({context:c}),a.sprite.addChild(a.shape),a._done()})}},c});