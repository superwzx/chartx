define(
    "chartx/components/xaxis/xAxis", [
        "canvax/index",
        "canvax/core/Base",
        "canvax/shape/Line",
        "chartx/utils/tools"
    ],
    function(Canvax, CanvaxBase, Line, Tools) {
        var xAxis = function(opt, data) {
            this.graphw = 0;
            this.graphh = 0;
            this.yAxisW = 0;
            this.width = 0;
            this.height = 0;

            this.disY = 1;
            this.dis = 6; //线到文本的距离

            this.label = "";
            this._label = null; //this.label对应的文本对象

            this.line = {
                enabled: 1, //是否有line
                width: 1,
                height: 4,
                strokeStyle: '#cccccc'
            };

            this.text = {
                fillStyle: '#999',
                fontSize: 12,
                rotation: 0,
                format: null,
                textAlign: null
            };
            this.maxTxtH = 0;

            this.pos = {
                x: null,
                y: null
            };

            //this.display = "block";
            this.enabled = 1; //1,0 true ,false 

            this.disXAxisLine = 6; //x轴两端预留的最小值
            this.disOriginX = 0; //背景中原点开始的x轴线与x轴的第一条竖线的偏移量
            this.xGraphsWidth = 0; //x轴宽(去掉两端)

            this.dataOrg = []; //源数据
            this.dataSection = []; //默认就等于源数据
            this._layoutDataSection = []; //dataSection的format后的数据
            this.data = []; //{x:100, content:'1000'}
            this.layoutData = []; //this.data(可能数据过多),重新编排过滤后的数据集合, 并根据此数组展现文字和线条
            this.sprite = null;

            this._textMaxWidth = 0;
            this.leftDisX = 0; //x轴最左边需要的间距。默认等于第一个x value字符串长度的一半

            //过滤器，可以用来过滤哪些yaxis 的 节点是否显示已经颜色之类的
            //@params params包括 dataSection , 索引index，txt(canvax element) ，line(canvax element) 等属性
            this.filter = null; //function(params){}; 

            this.isH = false; //是否为横向转向的x轴

            this.animation = true;
            this.resize = false;
    
            this.maxVal = null; 
            this.minVal = null; 

            this.xDis1 = 0; //x方向一维均分长度,layoutType==peak的时候要用到

            this.layoutType = "step"; //step , rule , peak

            this.init(opt, data);
        };

        xAxis.prototype = {
            init: function(opt, data) {
                this.sprite = new Canvax.Display.Sprite({
                    id: "xAxisSprite"
                });
                this._initHandle(opt, data);
                window.xaxis = this;
            },
            _initHandle: function(opt, data) {

                data && data.org && (this.dataOrg = data.org);

                if (opt) {
                    _.deepExtend(this, opt);
                };

                if (this.text.rotation != 0 && this.text.rotation % 90 == 0) {
                    this.isH = true;
                };

                if (!this.line.enabled) {
                    this.line.height = 1
                };

                if (this.dataSection.length == 0) {
                    this.dataSection = this._initDataSection(this.dataOrg);
                };

                //先计算出来显示文本
                this._layoutDataSection = this._formatDataSectionText(this.dataSection);

                //然后计算好最大的width 和 最大的height，外部组件需要用
                this._setTextMaxWidth();
                this._setXAxisHeight();

                //取第一个数据来判断xaxis的刻度值类型是否为 number
                this.minVal == null && (this.minVal = _.min( this.dataSection ));
                this.maxVal == null && (this.maxVal = _.max( this.dataSection ));

            },
            /**
             *return dataSection 默认为xAxis.dataOrg的的faltten
             *即 [ [1,2,3,4] ] -- > [1,2,3,4]
             */
            _initDataSection: function(data) {
                return _.flatten(data);
            },
            setX: function($n) {
                this.sprite.context.x = $n
            },
            setY: function($n) {
                this.sprite.context.y = $n
            },
            //数据变化，配置没变的情况
            resetData: function(data , opt) {
                if (opt) {
                    _.deepExtend(this, opt);
                };
                this.sprite.removeAllChildren();
                this.dataSection = [];

                this._initHandle(null, data);

                this.draw();
            },
            getIndexOfVal : function(xvalue){
                var i;
                for( var ii=0,il=this.data.length ; ii<il ; ii++ ){
                    var obj = this.data[ii];
                    if(obj.content == xvalue){
                        i = ii;
                        break;
                    }
                };

                return i;
            },
            //配置和数据变化
            update: function(opt, data) {
                //先在field里面删除一个字段，然后重新计算
                _.deepExtend(this, opt);
                this.resetData(data);
            },
            draw: function(opt) {
                // this.data = [{x:0,content:'0000'},{x:100,content:'10000'},{x:200,content:'20000'},{x:300,content:'30000'},{x:400,content:'0000'},{x:500,content:'10000'},{x:600,content:'20000'}]
                if( this.data.length == 0 ){

                };
                this._getLabel();
                this._initConfig(opt);
                this.data = this._trimXAxis(this.dataSection, this.xGraphsWidth);
                var me = this;
                _.each(this.data, function(obj, i) {
                    obj.layoutText = me._layoutDataSection[i];
                });

                this._trimLayoutData();

                this.setX(this.pos.x);
                this.setY(this.pos.y);

                if (this.enabled) { //this.display != "none"
                    this._widget();

                    if (!this.text.rotation) {
                        this._layout();
                    }
                }

                this.resize = false;
                // this.data = this.layoutData
            },
            _getLabel: function() {
                if (this.label && this.label != "") {

                    this._label = new Canvax.Display.Text(this.label, {
                        context: {
                            fontSize: this.text.fontSize,
                            textAlign: this.isH ? "center" : "left",
                            textBaseline: this.isH ? "top" : "middle",
                            fillStyle: this.text.fillStyle,
                            rotation: this.isH ? -90 : 0
                        }
                    });
                }
            },
            //初始化配置
            _initConfig: function(opt) {
                if (opt) {
                    _.deepExtend(this, opt);
                };

                this.yAxisW = Math.max(this.yAxisW, this.leftDisX);
                this.width = this.graphw - this.yAxisW;
                if (this.pos.x == null) {
                    this.pos.x = this.yAxisW + this.disOriginX;
                };
                if (this.pos.y == null) {
                    this.pos.y = this.graphh - this.height;
                };
                this.xGraphsWidth = parseInt(this.width - this._getXAxisDisLine());

                if (this._label) {
                    if (this.isH) {
                        this.xGraphsWidth -= this._label.getTextHeight() + 5
                    } else {
                        this.xGraphsWidth -= this._label.getTextWidth() + 5
                    }
                };
                this.disOriginX = parseInt((this.width - this.xGraphsWidth) / 2);
            },
            //获取x对应的位置
            //val ind 至少要有一个
            getPosX: function( opt ){
                var x = 0;
                var val = opt.val; 
                var ind = "ind" in opt ? opt.ind : _.indexOf( this.dataSection , val );//如果没有ind 那么一定要有val
                var dataLen = "dataLen" in opt ? opt.dataLen : this.dataSection.length;
                var xGraphsWidth = "xGraphsWidth" in opt ? opt.xGraphsWidth : this.xGraphsWidth;
                var layoutType = "layoutType" in opt ? opt.layoutType : this.layoutType;

                if( dataLen == 1 ){
                    x =  xGraphsWidth / 2;
                } else {
                    if( layoutType == "rule" ){
                        x = ind / (dataLen - 1) * xGraphsWidth;
                    };
                    if( layoutType == "proportion" ){
                        //按照数据真实的值在minVal - maxVal区间中的比例值
                        if( val == undefined ){
                            val = (ind * (this.maxVal - this.minVal)/(dataLen-1)) + this.minVal;
                        };
                        x = xGraphsWidth * ( (val - this.minVal) / (this.maxVal - this.minVal) );
                    };
                    if( layoutType == "peak" ){
                        x = this.xDis1 * (ind+1) - this.xDis1/2;
                    };
                    if( layoutType == "step" ){
                        x = (xGraphsWidth / (dataLen + 1)) * (ind + 1);
                    };
                }
                return parseInt( x , 10 );
            },
            _trimXAxis: function($data, $xGraphsWidth) {
                var tmpData = [];
                var data = $data || this.dataSection;
                var xGraphsWidth = xGraphsWidth || this.xGraphsWidth;

                this.xDis1 = xGraphsWidth / data.length;//这个属性目前主要是柱状图有分组柱状图的场景在用

                for (var a = 0, al  = data.length; a < al; a++ ) {
                    var o = {
                        'content':data[a], 
                        'x': this.getPosX({
                            val : data[a],
                            ind : a,
                            dataLen: al,
                            xGraphsWidth : xGraphsWidth
                        })
                    };
                    tmpData.push( o );
                };
                return tmpData;

                /*
                if( data.length == 1 ){
                    //当只有一个数据的时候
                    tmpData.push({
                        content : data[0],
                        x       : parseInt( xGraphsWidth / 2 )
                    });

                    //目前只有柱状图用到的peak布局模型里才会用的到
                    this.xDis1  = xGraphsWidth;
                    return tmpData;
                }; 

                if ( this.layoutType == "rule" ){
                    //标尺布局法，从0开始，到最后都有布局点,主要是折线图用的多
                    for (var a = 0, al  = data.length; a < al; a++ ) {
                        //默认string类型的情况下是均分
                        var x = parseInt(a / (data.length - 1) * xGraphsWidth);
                        if( this.layoutType == "number" ){
                            //nam 刻度的x要根据 maxVal - minVal 来计算
                            x = xGraphsWidth * ( (data[a] - this.minVal) / (this.maxVal - this.minVal) );
                        };
                        var o = {
                            'content':data[a], 
                            'x': x
                        };
                        tmpData.push( o );
                    };
                } else if( this.layoutType == "peak" ){
                    //主要是柱状图在使用波峰布局
                    this.xDis1  = xGraphsWidth / data.length;
                    for (var a = 0, al = data.length; a < al; a++ ) {
                        var o = {
                            'content' : data[a],
                            'x'       : this.xDis1 * (a+1) - this.xDis1/2
                        };
                        tmpData.push( o );
                    };
                } else if( this.layoutType == "step" ) {
                    //梯子布局
                    var dis = xGraphsWidth / (data.length + 1);

                    for (var a = 0, al = data.length; a < al; a++) {
                        var o = {
                            'content': data[a],
                            'x': parseInt(dis * (a + 1))
                        }
                        tmpData.push(o);
                    };
                };
                return tmpData;
                */
            },
            _formatDataSectionText: function(arr) {
                if (!arr) {
                    arr = this.dataSection;
                };
                var me = this;
                var currArr = [];
                _.each(arr, function(val) {
                    currArr.push(me._getFormatText(val));
                });
                return currArr;
            },
            _getXAxisDisLine: function() { //获取x轴两端预留的距离
                var disMin = this.disXAxisLine
                var disMax = 2 * disMin
                var dis = disMin
                dis = disMin + this.width % _.flatten(this.dataOrg).length
                dis = dis > disMax ? disMax : dis
                dis = isNaN(dis) ? 0 : dis
                return dis
            },
            _setXAxisHeight: function() { //检测下文字的高等
                if (!this.enabled) { //this.display == "none"
                    this.dis = 0;
                    this.height = 3; //this.dis;//this.max.txtH;
                } else {
                    var txt = new Canvax.Display.Text(this._layoutDataSection[0] || "test", {
                        context: {
                            fontSize: this.text.fontSize
                        }
                    });

                    this.maxTxtH = txt.getTextHeight();

                    if (!!this.text.rotation) {
                        if (this.text.rotation % 90 == 0) {
                            this.height = this._textMaxWidth + this.line.height + this.disY + this.dis + 3;
                        } else {
                            var sinR = Math.sin(Math.abs(this.text.rotation) * Math.PI / 180);
                            var cosR = Math.cos(Math.abs(this.text.rotation) * Math.PI / 180);
                            this.height = sinR * this._textMaxWidth + txt.getTextHeight() + 5;
                            this.leftDisX = cosR * txt.getTextWidth() + 8;
                        }
                    } else {
                        this.height = this.disY + this.line.height + this.dis + this.maxTxtH;
                        this.leftDisX = txt.getTextWidth() / 2;
                    }
                }
            },
            _getFormatText: function(text) {
                var res;
                if (_.isFunction(this.text.format)) {
                    res = this.text.format(text);
                } else {
                    res = text
                }
                if (_.isArray(res)) {
                    res = Tools.numAddSymbol(res);
                }
                if (!res) {
                    res = text;
                };
                return res;
            },
            _widget: function() {
                var arr = this.layoutData

                if (this._label) {
                    this._label.context.x = this.xGraphsWidth + 5;
                    this.sprite.addChild(this._label);
                };

                var delay = Math.min(1000 / arr.length, 25);

                for (var a = 0, al = arr.length; a < al; a++) {
                    var xNode = new Canvax.Display.Sprite({
                        id: "xNode" + a
                    });

                    var o = arr[a]
                    var x = o.x,
                        y = this.disY + this.line.height + this.dis;

                    //文字
                    var txt = new Canvax.Display.Text((o.layoutText || o.content), {
                        id: "xAxis_txt_" + CanvaxBase.getUID(),
                        context: {
                            x: x,
                            y: y + 20,
                            fillStyle: this.text.fillStyle,
                            fontSize: this.text.fontSize,
                            rotation: -Math.abs(this.text.rotation),
                            textAlign: this.text.textAlign || (!!this.text.rotation ? "right" : "center"),
                            textBaseline: !!this.text.rotation ? "middle" : "top",
                            globalAlpha: 0
                        }
                    });
                    xNode.addChild(txt);

                    if (!!this.text.rotation && this.text.rotation != 90) {
                        txt.context.x += 5;
                        txt.context.y += 3;
                    };

                    if (this.line.enabled) {
                        //线条
                        var line = new Line({
                            context: {
                                x: x,
                                y: this.disY,
                                xEnd: 0,
                                yEnd: this.line.height + this.disY,
                                lineWidth: this.line.width,
                                strokeStyle: this.line.strokeStyle
                            }
                        });
                        xNode.addChild(line);
                    };

                    //这里可以由用户来自定义过滤 来 决定 该node的样式
                    _.isFunction(this.filter) && this.filter({
                        layoutData: arr,
                        index: a,
                        txt: txt,
                        line: line || null
                    });

                    this.sprite.addChild(xNode);

                    if (this.animation && !this.resize) {
                        txt.animate({
                            globalAlpha: 1,
                            y: txt.context.y - 20
                        }, {
                            duration: 500,
                            easing: 'Back.Out', //Tween.Easing.Elastic.InOut
                            delay: a * delay,
                            id: txt.id
                        });
                    } else {
                        txt.context.y = txt.context.y - 20;
                        txt.context.globalAlpha = 1;
                    };
                };
            },
            /*校验最后一个文本是否超出了界限。然后决定是否矫正*/
            _layout: function() {

                if (this.data.length == 0 || this.sprite.getNumChildren() <=2 ){
                    //压根没数据 或者 如果都只有两个节点，当然也不需要矫正了
                    return;
                };

                var popText = this.sprite.getChildAt(this.sprite.getNumChildren() - 1).getChildAt(0);
                if (popText) {
                    var pc = popText.context;
                    if (pc.textAlign == "center" &&
                        pc.x + popText.context.width / 2 > this.width) {
                        pc.x = this.width - popText.context.width / 2
                    };
                    if (pc.textAlign == "left" &&
                        pc.x + popText.context.width > this.width) {
                        pc.x = this.width - popText.context.width
                    };
                    if (this.sprite.getNumChildren() > 2) {
                        //倒数第二个text
                        var popPreText = this.sprite.getChildAt(this.sprite.getNumChildren() - 2).getChildAt(0);
                        var ppc = popPreText.context;
                        //如果最后一个文本 和 倒数第二个 重叠了，就 隐藏掉
                        if (ppc.visible && pc.x < ppc.x + ppc.width) {
                            pc.visible = false;
                        }
                    }
                }
            },
            _setTextMaxWidth: function() {
                var arr = this._layoutDataSection;
                var maxLenText = arr[0];

                for (var a = 0, l = arr.length; a < l; a++) {
                    if (arr[a].length > maxLenText.length) {
                        maxLenText = arr[a];
                    }
                };

                var txt = new Canvax.Display.Text(maxLenText || "test", {
                    context: {
                        fillStyle: this.text.fillStyle,
                        fontSize: this.text.fontSize
                    }
                });

                this._textMaxWidth = txt.getTextWidth();
                this._textMaxHeight = txt.getTextHeight();

                return this._textMaxWidth;
            },
            _trimLayoutData: function() {

                var tmp = []
                var arr = this.data

                var mw = this._textMaxWidth + 10;

                if (!!this.text.rotation) {
                    mw = this._textMaxHeight * 1.5;
                };

                //总共能多少像素展现
                var n = Math.min(Math.floor(this.width / mw), arr.length - 1); //能展现几个

                if (n >= arr.length - 1) {
                    this.layoutData = arr;
                } else {
                    //需要做间隔
                    var dis = Math.max(Math.ceil(arr.length / n - 1), 0); //array中展现间隔
                    //存放展现的数据
                    for (var a = 0; a < n; a++) {
                        var obj = arr[a + dis * a];
                        obj && tmp.push(obj);
                    };
                    this.layoutData = tmp;
                };
            }
        };

        return xAxis;

    }
)
