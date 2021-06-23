"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _canvax = _interopRequireDefault(require("canvax"));

var _tools = require("../../../utils/tools");

var _ = _canvax["default"]._,
    event = _canvax["default"].event;
var Circle = _canvax["default"].Shapes.Circle;

var PlanetGroup = /*#__PURE__*/function () {
  function PlanetGroup(opt, dataFrame, _graphs) {
    (0, _classCallCheck2["default"])(this, PlanetGroup);
    this._opt = opt;
    this.dataFrame = dataFrame;
    this._graphs = _graphs;
    this.app = _graphs.app;
    this.field = null;
    this.iGroup = 0;
    this.groupLen = 1; //分组可以绘制的半径范围

    this.rRange = {
      start: 0,
      to: 0
    };
    this.width = 0;
    this.height = 0;
    this.selectInds = []; //会从外面的index中传入一个统一的selectInds 引用

    this.layoutType = "radian"; //坑位，用来做占位

    this.pit = {
      radius: 30
    };
    this.planets = [];
    this.maxRingNum = 0;
    this.ringNum = 0;

    _.extend(true, this, (0, _tools.getDefaultProps)(PlanetGroup.defaultProps()), opt); //circle.maxRadius 绝对不能大于最大 占位 pit.radius


    if (this.node.maxRadius > this.pit.radius) {
      this.pit.radius = this.node.maxRadius;
    }

    ;
    this.init();
  }

  (0, _createClass2["default"])(PlanetGroup, [{
    key: "init",
    value: function init() {
      //let me = this;
      var _coord = this.app.getComponent({
        name: 'coord'
      });

      this.sprite = new _canvax["default"].Display.Sprite({
        id: "group_" + this.iGroup,
        context: {
          x: _coord.origin.x,
          y: _coord.origin.y
        }
      });

      this._trimGraphs();

      this.draw();
    }
  }, {
    key: "_trimGraphs",
    value: function _trimGraphs() {
      var me = this;

      var _coord = this.app.getComponent({
        name: 'coord'
      });

      var _coordMaxDis = _coord.getMaxDisToViewOfOrigin();

      if ((_coordMaxDis - this.rRange.to) / (this.pit.radius * 2) < this.groupLen - 1 - this.iGroup) {
        //要保证后面的group至少能有意个ringNum
        this.rRange.to = _coordMaxDis - (this.groupLen - 1 - this.iGroup) * this.pit.radius * 2;
      }

      ;

      if (this.rRange.to - this.rRange.start < this.pit.radius * 2) {
        this.rRange.to = this.rRange.start + this.pit.radius * 2;
      }

      ; //计算该group中可以最多分布多少ring

      if (!this.maxRingNum) {
        this.maxRingNum = parseInt((this.rRange.to - this.rRange.start) / (this.pit.radius * 2), 10);
        /* TODO: 这个目前有问题
        //如果可以划10个环，但是其实数据只有8条， 那么就 当然是只需要划分8ring
        //this.ringNum = Math.min( this.maxRingNum , this.dataFrame.length );
        */

        this.ringNum = this.maxRingNum;
      }

      ; //重新计算修改 rRange.to的值

      this.rRange.to = this.rRange.start + this.ringNum * this.pit.radius * 2; //根据数据创建n个星球

      var planets = [];
      var dataLen = this.dataFrame.length;

      for (var i = 0; i < dataLen; i++) {
        var rowData = this.dataFrame.getRowDataAt(i);
        var planetLayoutData = {
          type: "planet",
          groupLen: this.groupLen,
          iGroup: me.iGroup,
          iNode: i,
          nodeElement: null,
          //canvax元素
          labelElement: null,
          //label的canvax元素
          rowData: rowData,
          //下面这些都只能在绘制的时候确定然后赋值
          iRing: null,
          iPlanet: null,
          fillStyle: null,
          color: null,
          //给tips用
          strokeStyle: null,
          pit: null,
          //假设这个planet是个萝卜，那么 pit 就是这个萝卜的坑
          ringInd: -1,
          field: me.field,
          label: rowData[me.field],
          focused: false,
          selected: !!~_.indexOf(this.selectInds, rowData.__index__)
        };
        planets.push(planetLayoutData);
      }

      ;

      if (me.sortField) {
        planets = planets.sort(function (a, b) {
          var field = me.sortField;

          if (me.sort == "desc") {
            return b.rowData[field] - a.rowData[field];
          } else {
            return a.rowData[field] - b.rowData[field];
          }
        }); //修正下 排序过后的 iNode

        _.each(planets, function (planet, i) {
          planet.iNode = i;
        });
      }

      ;
      this._rings = this["_setRings_" + this.layoutType + "Range"](planets);
      this.planets = planets;
    } //根据弧度对应可以排列多少个星球的占比来分段

  }, {
    key: "_setRings_radianRange",
    value: function _setRings_radianRange(planets) {
      var me = this;
      var _rings = [];

      var _coord = this.app.getComponent({
        name: 'coord'
      });

      for (var i = 0, l = this.ringNum; i < l; i++) {
        var _r = i * this.pit.radius * 2 + this.pit.radius + this.rRange.start;

        if (!me._graphs.center.enabled) {
          _r = i * this.pit.radius * 2 + this.rRange.start;
        }

        ; //该半径上面的弧度集合

        var arcs = _coord.getRadiansAtR(_r, me.width, me.height); //测试代码begin---------------------------------------------------
        //用来绘制弧度的辅助线

        /*
        _.each( arcs, function( arc ){
            let sector = new Canvax.Shapes.Sector({
                context: {
                    r: _r,
                    startAngle: arc[0].radian*180/Math.PI,
                    endAngle: arc[1].radian*180/Math.PI, //secc.endAngle,
                    strokeStyle: "#ccc",
                    lineWidth:1
                },
            });
            me.sprite.addChild( sector );
        } );
        */
        //测试代码end------------------------------------------------------
        //该半径圆弧上，可以绘制一个星球的最小弧度值
        //let minRadianItem = Math.atan( this.pit.radius / _r );


        _rings.push({
          arcs: arcs,
          pits: [],
          //萝卜坑
          planets: [],
          //将要入坑的萝卜
          radius: _r,
          //这个ring所在的半径轨道
          max: 0 //这个环上面最多能布局下的 planet 数量

        });
      }

      ;
      var allplanetsMax = 0; //所有ring里面
      //计算每个环的最大可以创建星球数量,然后把所有的数量相加做分母。
      //然后计算自己的比例去 planets 里面拿对应比例的数据

      _.each(_rings, function (ring) {
        //先计算上这个轨道上排排站一共可以放的下多少个星球
        //一个星球需要多少弧度
        var minRadian = Math.asin(me.pit.radius / ring.radius) * 2;

        if (ring.radius == 0) {
          //说明就在圆心
          minRadian = Math.PI * 2;
        }

        ;
        var _count = 0;

        _.each(ring.arcs, function (arc) {
          var _adiff = me._getDiffRadian(arc[0].radian, arc[1].radian);

          if (_adiff >= minRadian) {
            var _arc_count = parseInt(_adiff / minRadian, 10);

            _count += _arc_count; //这个弧段里可以放_count个坑位

            for (var p = 0; p < _arc_count; p++) {
              var pit = {
                hasRadish: false,
                //是否已经有萝卜(一个萝卜一个坑)
                start: (arc[0].radian + minRadian * p + Math.PI * 2) % (Math.PI * 2)
              };
              pit.middle = (pit.start + minRadian / 2 + Math.PI * 2) % (Math.PI * 2);
              pit.to = (pit.start + minRadian + Math.PI * 2) % (Math.PI * 2);
              ring.pits.push(pit); //测试占位情况代码begin---------------------------------------------

              /*
              let point = me.app.getComponent({name:'coord'}).getPointInRadianOfR( pit.middle , ring.radius )
              me.sprite.addChild(new Circle({
                  context:{
                      x : point.x,
                      y : point.y,
                      r : me.pit.radius,
                      fillStyle: "#ccc",
                      strokeStyle: "red",
                      lineWidth: 1,
                      globalAlpha:0.3
                  }
              }));
              */
              //测试占位情况代码end-----------------------------------------------     
            }

            ;
          } else {//这个arc圆弧上面放不下一个坑位
          }
        });

        ring.max = _count;
        allplanetsMax += _count; //坑位做次随机乱序

        ring.pits = _.shuffle(ring.pits);
      }); //allplanetsMax有了后作为分明， 可以给每个ring去分摊 planet 了


      var preAllCount = 0;

      _.each(_rings, function (ring, i) {
        if (preAllCount >= planets.length) {
          return false;
        }

        ;
        var num = Math.ceil(ring.max / allplanetsMax * planets.length);
        num = Math.min(ring.max, num);
        ring.planets = planets.slice(preAllCount, preAllCount + num);

        if (i == _rings.length - 1) {
          ring.planets = planets.slice(preAllCount);
        }

        ;
        preAllCount += num; //给每个萝卜分配一个坑位

        _.each(ring.planets, function (planet, ii) {
          if (ii >= ring.pits.length) {
            //如果萝卜已经比这个ring上面的坑要多，就要扔掉， 没办法的
            return;
          }

          ;

          var pits = _.filter(ring.pits, function (pit) {
            return !pit.hasRadish;
          });

          var targetPit = pits[parseInt(Math.random() * pits.length)];
          targetPit.hasRadish = true;
          planet.pit = targetPit;
        });
      });

      return _rings;
    }
  }, {
    key: "_getDiffRadian",
    value: function _getDiffRadian(_start, _to) {
      var _adiff = _to - _start;

      if (_to < _start) {
        _adiff = (_to + Math.PI * 2 - _start) % (Math.PI * 2);
      }

      return _adiff;
    } //索引区间分段法 待实现

  }, {
    key: "_setRings_indexRange",
    value: function _setRings_indexRange() {} //值区间分段法
    //todo:这样确实就很可能数据集中在两段中间没有 待实现

  }, {
    key: "_setRings_valRange",
    value: function _setRings_valRange() {}
  }, {
    key: "draw",
    value: function draw() {
      var me = this;

      var _coord = this.app.getComponent({
        name: 'coord'
      });

      _.each(this._rings, function (ring, i) {
        var _ringCtx = {
          rotation: 0
        };

        if (ring.arcs.length == 1 && ring.arcs[0][0].radian == 0 && ring.arcs[0][1].radian == Math.PI * 2) {
          //如果这个是一个整个的内圆，那么就做个随机的旋转
          _ringCtx.rotation = parseInt(Math.random() * 360);
        }

        ;

        var _ringSp = new _canvax["default"].Display.Sprite({
          context: _ringCtx
        });

        _.each(ring.planets, function (p, ii) {
          if (!p.pit) {
            //如果这个萝卜没有足够的坑位可以放，很遗憾，只能扔掉了
            return;
          }

          ;

          var point = _coord.getPointInRadianOfR(p.pit.middle, ring.radius);

          var r = me._getRProp(me.node.radius, i, ii, p); //计算该萝卜在坑位（pit）中围绕pit的圆心可以随机移动的范围（r）


          var _transR = me.node.maxRadius - r; //然后围绕pit的圆心随机找一个点位，重新设置Point


          var _randomTransR = parseInt(Math.random() * _transR);

          var _randomAngle = parseInt(Math.random() * 360);

          var _randomRadian = _randomAngle * Math.PI / 180;

          if (_randomTransR != 0) {
            //说明还是在圆心， 就没必要重新计算point
            point.x += Math.sin(_randomRadian) * _randomTransR;
            point.y += Math.cos(_randomRadian) * _randomTransR;
          }

          ;
          var node = me.node;

          if (p.selected) {
            node = me.node.select;
          }

          ;

          var _fillStyle = me._getProp(me.node.fillStyle, p);

          var _strokeStyle = me._getProp(node.strokeStyle, p);

          var _lineAlpha = me._getProp(node.strokeAlpha, p);

          var _lineWidth = me._getProp(node.lineWidth, p);

          var circleCtx = {
            x: point.x,
            y: point.y,
            r: r,
            fillStyle: _fillStyle,
            lineWidth: _lineWidth,
            strokeStyle: _strokeStyle,
            strokeAlpha: _lineAlpha,
            cursor: "pointer"
          }; //设置好p上面的fillStyle 和 strokeStyle

          p.color = p.fillStyle = _fillStyle;
          p.strokeStyle = _strokeStyle;
          p.iRing = i;
          p.iPlanet = ii;

          var _circle = new Circle({
            hoverClone: false,
            context: circleCtx
          });

          _circle.on(event.types.get(), function (e) {
            e.eventInfo = {
              title: null,
              trigger: me.node,
              nodes: [this.nodeData]
            };

            if (this.nodeData.label) {
              e.eventInfo.title = this.nodeData.label;
            }

            ;

            if (me.node.focus.enabled) {
              if (e.type == "mouseover") {
                me.focusAt(this.nodeData);
              }

              if (e.type == "mouseout") {
                me.unfocusAt(this.nodeData);
              }
            }

            ;

            if (me.node.select.enabled && e.type == me.node.select.triggerEventType) {
              //如果开启了图表的选中交互
              //TODO:这里不能
              var onbefore = me.node.select.onbefore;
              var onend = me.node.select.onend;

              if (!onbefore || typeof onbefore == 'function' && onbefore.apply(me, [this.nodeData]) !== false) {
                if (this.nodeData.selected) {
                  //说明已经选中了
                  me.unselectAt(this.nodeData);
                } else {
                  me.selectAt(this.nodeData);
                }

                onend && typeof onend == 'function' && onend.apply(me, [this.nodeData]);
              }
            }

            ; //fire到root上面去的是为了让root去处理tips

            me.app.fire(e.type, e);
          }); //互相用属性引用起来


          _circle.nodeData = p;
          p.nodeElement = _circle;
          _circle.ringInd = i;
          _circle.planetIndInRing = ii;

          _ringSp.addChild(_circle); //如果有开启入场动画


          if (me._graphs.animation) {
            var _r = _circle.context.r;
            var _globalAlpha = _circle.context.globalAlpha;
            _circle.context.r = 1;
            _circle.context.globalAlpha = 0.1;

            _circle.animate({
              r: _r,
              globalAlpha: _globalAlpha
            }, {
              delay: Math.round(Math.random() * 1500),
              onComplete: function onComplete() {
                //这个时候再把label现实出来
                _circle.labelElement && (_circle.labelElement.context.visible = true);

                var _cloneNode = _circle.clone();

                _ringSp.addChildAt(_cloneNode, 0);

                _cloneNode.animate({
                  r: _r + 10,
                  globalAlpha: 0
                }, {
                  onComplete: function onComplete() {
                    _cloneNode.destroy();
                  }
                });
              }
            });
          }

          ; //然后添加label
          //绘制实心圆上面的文案
          //x,y 默认安装圆心定位，也就是position == 'center'

          var _labelCtx = {
            x: point.x,
            y: point.y,
            //point.y + r +3
            fontSize: me.label.fontSize,
            textAlign: me.label.textAlign,
            textBaseline: me.label.verticalAlign,
            fillStyle: me.label.fontColor,
            rotation: -_ringCtx.rotation,
            rotateOrigin: {
              x: 0,
              y: 0 //-(r + 3)

            }
          };

          var _label = new _canvax["default"].Display.Text(p.label, {
            context: _labelCtx
          });

          var _labelWidth = _label.getTextWidth();

          var _labelHeight = _label.getTextHeight();

          if (_labelWidth > r * 2) {
            _labelCtx.fontSize = me.label.fontSize - 3;
          }

          ; //最开始提供这个function模式，是因为还没有实现center,bottom,auto
          //只能用function的形式用户自定义实现
          //现在已经实现了center,bottom,auto，但是也还是先留着吧，也不碍事

          if (_.isFunction(me.label.position)) {
            var _pos = me.label.position({
              node: _circle,
              circleR: r,
              circleCenter: {
                x: point.x,
                y: point.y
              },
              textWidth: _labelWidth,
              textHeight: _labelHeight
            });

            _labelCtx.rotation = -_ringCtx.rotation;
            _labelCtx.rotateOrigin = {
              x: -(_pos.x - _labelCtx.x),
              y: -(_pos.y - _labelCtx.y)
            };
            _labelCtx.x = _pos.x;
            _labelCtx.y = _pos.y;
          }

          ;

          if (me.label.position == 'auto') {
            if (_labelWidth > r * 2) {
              setPositionToBottom();
            }

            ;
          }

          ;

          if (me.label.position == 'bottom') {
            setPositionToBottom();
          }

          ;

          function setPositionToBottom() {
            _labelCtx.y = point.y + r + 3; //_labelCtx.textBaseline = "top";

            _labelCtx.rotation = -_ringCtx.rotation;
            _labelCtx.rotateOrigin = {
              x: 0,
              y: -(r + _labelHeight * 0.7)
            };
          }

          ;
          _labelCtx.x += me.label.offsetX;
          _labelCtx.y += me.label.offsetY; //TODO:这里其实应该是直接可以修改 _label.context. 属性的
          //但是这里版本的canvax有问题。先重新创建文本对象吧

          _label = new _canvax["default"].Display.Text(p.label, {
            context: _labelCtx
          }); //互相用属性引用起来

          _circle.labelElement = _label;
          _label.nodeData = p;
          p.labelElement = _label;

          if (me._graphs.animation) {
            _label.context.visible = false;
          }

          ;

          _ringSp.addChild(_label);
        });

        me.sprite.addChild(_ringSp);
      });
    }
  }, {
    key: "_getRProp",
    value: function _getRProp(r, ringInd, iNode, nodeData) {
      var me = this;

      if (_.isString(r) && _.indexOf(me.dataFrame.fields, r) > -1) {
        if (this.__rValMax == undefined && this.__rValMax == undefined) {
          this.__rValMax = 0;
          this.__rValMin = 0;

          _.each(me.planets, function (planet) {
            me.__rValMax = Math.max(me.__rValMax, planet.rowData[r]);
            me.__rValMin = Math.min(me.__rValMin, planet.rowData[r]);
          });
        }

        ;
        var rVal = nodeData.rowData[r];
        return me.node.minRadius + (rVal - this.__rValMin) / (this.__rValMax - this.__rValMin) * (me.node.maxRadius - me.node.minRadius);
      }

      ;
      return me._getProp(r, nodeData);
    }
  }, {
    key: "_getProp",
    value: function _getProp(p, nodeData) {
      var iGroup = this.iGroup;

      if (_.isFunction(p)) {
        return p.apply(this, [nodeData, iGroup]); //return p( nodeData );
      }

      ;
      return p;
    }
  }, {
    key: "getPlanetAt",
    value: function getPlanetAt(target) {
      var planet = target;

      if (_.isNumber(target)) {
        _.each(this.planets, function (_planet) {
          if (_planet.rowData.__index__ == target) {
            planet = _planet;
            return false;
          }
        });
      }

      ;
      return planet;
    } //这里的ind是原始的__index__

  }, {
    key: "selectAt",
    value: function selectAt(ind) {
      if (!this.node.select.enabled) return;
      var planet = this.getPlanetAt(ind);
      planet.selected = true; //可能这个数据没有显示的，就没有nodeElement

      if (planet.nodeElement) {
        planet.nodeElement.context.lineWidth = this._getProp(this.node.select.lineWidth, planet);
        planet.nodeElement.context.strokeStyle = this._getProp(this.node.select.strokeStyle, planet);
        planet.nodeElement.context.strokeAlpha = this._getProp(this.node.select.strokeAlpha, planet);
      }

      ;

      for (var i = 0; i < this.selectInds.length; i++) {
        if (ind === this.selectInds[i]) {
          this.selectInds.splice(i--, 1);
          break;
        }

        ;
      }

      ;
    } //这里的ind是原始的__index__

  }, {
    key: "unselectAt",
    value: function unselectAt(ind) {
      if (!this.node.select.enabled) return;
      var planet = this.getPlanetAt(ind);
      planet.selected = false;

      if (planet.nodeElement) {
        planet.nodeElement.context.lineWidth = this._getProp(this.node.lineWidth, planet);
        planet.nodeElement.context.strokeAlpha = this._getProp(this.node.strokeAlpha, planet);
      }

      ;
      this.selectInds.push(ind);
    }
  }, {
    key: "getSelectedNodes",
    value: function getSelectedNodes() {
      return _.filter(this.planets, function (planet) {
        return planet.selected;
      });
    }
  }, {
    key: "focusAt",
    value: function focusAt(ind) {
      if (!this.node.focus.enabled) return;
      var planet = this.getPlanetAt(ind);
      if (planet.selected) return;
      planet.focused = true;

      if (planet.nodeElement) {
        planet.nodeElement.context.lineWidth = this._getProp(this.node.focus.lineWidth, planet);
        planet.nodeElement.context.strokeStyle = this._getProp(this.node.focus.strokeStyle, planet);
        planet.nodeElement.context.strokeAlpha = this._getProp(this.node.focus.strokeAlpha, planet);
      }

      ;
    }
  }, {
    key: "unfocusAt",
    value: function unfocusAt(ind) {
      if (!this.node.focus.enabled) return;
      var planet = this.getPlanetAt(ind);
      if (planet.selected) return;
      planet.focused = false;

      if (planet.nodeElement) {
        planet.nodeElement.context.lineWidth = this._getProp(this.node.lineWidth, planet);
        planet.nodeElement.context.strokeAlpha = this._getProp(this.node.strokeAlpha, planet);
      }

      ;
    }
  }], [{
    key: "defaultProps",
    value: function defaultProps() {
      return {
        sort: {
          detail: '排序',
          "default": 'desc'
        },
        sortField: {
          detail: '用来排序的字段',
          "default": 'null'
        },
        node: {
          detail: '单个数据节点图形配置',
          propertys: {
            maxRadius: {
              detail: '最大半径',
              "default": 30
            },
            minRadius: {
              detail: '最小半径',
              "default": 5
            },
            radius: {
              detail: '半径',
              "default": 15,
              documentation: '也可以是个function,也可以配置{field:"pv"}来设置字段， 自动计算r'
            },
            lineWidth: {
              detail: '描边线宽',
              "default": 1
            },
            strokeStyle: {
              detail: '描边颜色',
              "default": '#ffffff'
            },
            fillStyle: {
              detail: '图形填充色',
              "default": '#f2fbfb'
            },
            strokeAlpha: {
              detail: '边框透明度',
              "default": 0.6
            },
            focus: {
              detail: 'hover态设置',
              propertys: {
                enabled: {
                  detail: '是否开启',
                  "default": true
                },
                strokeAlpha: {
                  detail: 'hover时候边框透明度',
                  "default": 0.7
                },
                lineWidth: {
                  detail: 'hover时候边框大小',
                  "default": 2
                },
                strokeStyle: {
                  detail: 'hover时候边框颜色',
                  "default": '#fff'
                }
              }
            },
            select: {
              detail: '选中态设置',
              propertys: {
                enabled: {
                  detail: '是否开启',
                  "default": false
                },
                strokeAlpha: {
                  detail: '选中时候边框透明度',
                  "default": 1
                },
                lineWidth: {
                  detail: '选中时候边框大小',
                  "default": 2
                },
                strokeStyle: {
                  detail: '选中时候边框颜色',
                  "default": '#fff'
                },
                triggerEventType: {
                  detail: '触发事件',
                  "default": 'click'
                },
                onbefore: {
                  detail: '执行select处理函数的前处理函数，返回false则取消执行select',
                  "default": null
                },
                onend: {
                  detail: '执行select处理函数的后处理函数',
                  "default": null
                }
              }
            }
          }
        },
        label: {
          detail: '文本设置',
          propertys: {
            enabled: {
              detail: '是否开启',
              "default": true
            },
            fontColor: {
              detail: '文本颜色',
              "default": '#666666'
            },
            fontSize: {
              detail: '文本字体大小',
              "default": 13
            },
            textAlign: {
              detail: '水平对齐方式',
              "default": 'center'
            },
            verticalAlign: {
              detail: '基线对齐方式',
              "default": 'middle'
            },
            position: {
              detail: '文本布局位置',
              "default": 'center'
            },
            offsetX: {
              detail: 'x方向偏移量',
              "default": 0
            },
            offsetY: {
              detail: 'y方向偏移量',
              "default": 0
            }
          }
        }
      };
    }
  }]);
  return PlanetGroup;
}();

exports["default"] = PlanetGroup;