"use strict";

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "canvax", "../index", "mmvis", "./data"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("canvax"), require("../index"), require("mmvis"), require("./data"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.canvax, global.index, global.mmvis, global.data);
    global.undefined = mod.exports;
  }
})(void 0, function (exports, _canvax, _index, _mmvis, _data) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _canvax2 = _interopRequireDefault(_canvax);

  var _index2 = _interopRequireDefault(_index);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    }
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  var Rect = _canvax2["default"].Shapes.Rect;
  var Path = _canvax2["default"].Shapes.Path;
  var Arrow = _canvax2["default"].Shapes.Arrow;
  var Circle = _canvax2["default"].Shapes.Circle;
  /**
   * 关系图中 包括了  配置，数据，和布局数据，
   * 默认用配置和数据可以完成绘图， 但是如果有布局数据，就绘图玩额外调用一次绘图，把布局数据传入修正布局效果
   */

  var Relation = function (_GraphsBase) {
    _inherits(Relation, _GraphsBase);

    _createClass(Relation, null, [{
      key: "defaultProps",
      value: function defaultProps() {
        return {
          field: {
            detail: 'key字段设置',
            documentation: '',
            "default": null
          },
          childrenField: {
            detail: '树结构数据的关联字段',
            documentation: '如果是树结构的关联数据，不是行列式，那么就通过这个字段来建立父子关系',
            "default": 'children'
          },
          //rankdir: "TB",
          //align: "DR",
          //nodesep: 0,//同级node之间的距离
          //edgesep: 0,
          //ranksep: 0, //排与排之间的距离
          rankdir: {
            detail: '布局方向',
            "default": null
          },
          node: {
            detail: '单个节点的配置',
            propertys: {
              shapeType: {
                detail: '节点图形，目前只支持rect',
                "default": 'rect'
              },
              maxWidth: {
                detail: '节点最大的width',
                "default": 200
              },
              width: {
                detail: '内容的width',
                "default": null
              },
              height: {
                detail: '内容的height',
                "default": null
              },
              radius: {
                detail: '圆角角度',
                "default": 6
              },
              fillStyle: {
                detail: '节点背景色',
                "default": '#ffffff'
              },
              strokeStyle: {
                detail: '描边颜色',
                "default": '#e5e5e5'
              },
              padding: {
                detail: 'node节点容器到内容的边距',
                "default": 10
              },
              content: {
                detail: '节点内容配置',
                propertys: {
                  field: {
                    detail: '内容字段',
                    documentation: '默认content字段',
                    "default": 'content'
                  },
                  fontColor: {
                    detail: '内容文本颜色',
                    "default": '#666'
                  },
                  format: {
                    detail: '内容格式化处理函数',
                    "default": null
                  },
                  textAlign: {
                    detail: "textAlign",
                    "default": "center"
                  },
                  textBaseline: {
                    detail: 'textBaseline',
                    "default": "middle"
                  }
                }
              }
            }
          },
          line: {
            detail: '两个节点连线配置',
            propertys: {
              isTree: {
                detail: '是否树结构的连线',
                documentation: '非树结构启用该配置可能会有意想不到的惊喜，慎用',
                "default": false
              },
              inflectionRadius: {
                detail: '树状连线的拐点圆角半径',
                "default": 0
              },
              shapeType: {
                detail: '连线的图形样式 brokenLine or bezier',
                "default": 'bezier'
              },
              lineWidth: {
                detail: '线宽',
                "default": 1
              },
              strokeStyle: {
                detail: '连线的颜色',
                "default": '#e5e5e5'
              },
              lineType: {
                detail: '连线样式（虚线等）',
                "default": 'solid'
              },
              arrow: {
                detail: '是否有箭头',
                "default": true
              }
            }
          },
          layout: {
            detail: '采用的布局引擎,比如dagre',
            "default": "dagre"
          },
          layoutOpts: {
            detail: '布局引擎对应的配置,dagre详见dagre的官方wiki',
            propertys: {}
          },
          status: {
            detail: '一些开关配置',
            propertys: {
              transform: {
                detail: "是否启动拖拽缩放整个画布",
                propertys: {
                  fitView: {
                    detail: "自动缩放",
                    "default": '' //autoZoom

                  },
                  enabled: {
                    detail: "是否开启",
                    "default": true
                  },
                  scale: {
                    detail: "缩放值",
                    "default": 1
                  },
                  scaleOrigin: {
                    detail: "缩放原点",
                    "default": {
                      x: 0,
                      y: 0
                    }
                  }
                }
              }
            }
          }
        };
      }
    }]);

    function Relation(opt, app) {
      var _this;

      _classCallCheck(this, Relation);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Relation).call(this, opt, app));
      _this.type = "relation";

      _mmvis._.extend(true, _assertThisInitialized(_this), (0, _mmvis.getDefaultProps)(Relation.defaultProps()), opt);

      if (_this.layout === 'dagre') {
        var dagreOpts = {
          graph: {
            rankdir: 'TB',
            nodesep: 10,
            ranksep: 10,
            edgesep: 10,
            acyclicer: "greedy"
          },
          node: {},
          edge: {//labelpos: 'c'
          }
        };

        _mmvis._.extend(true, dagreOpts, _this.layoutOpts);

        _mmvis._.extend(true, _this.layoutOpts, dagreOpts);

        if (!_this.rankdir) {
          _this.rankdir = _this.layoutOpts.graph.rankdir;
        } else {
          //如果有设置this.randdir 则已经 ta 为准
          _this.layoutOpts.graph.rankdir = _this.rankdir;
        }

        ;
      }

      ;
      _this.domContainer = app.canvax.domView;
      _this.induce = null;

      _this.init();

      return _this;
    }

    _createClass(Relation, [{
      key: "init",
      value: function init() {
        this.initInduce();
        this.nodesSp = new _canvax2["default"].Display.Sprite({
          id: "nodesSp"
        });
        this.edgesSp = new _canvax2["default"].Display.Sprite({
          id: "edgesSp"
        });
        this.graphsSp = new _canvax2["default"].Display.Sprite({
          id: "graphsSp"
        });
        this.graphsSp.addChild(this.edgesSp);
        this.graphsSp.addChild(this.nodesSp); //clone一份graphsSp

        this._grahsSpClone = new _canvax2["default"].Display.Sprite({
          id: "graphsSp_clone"
        });
        this.sprite.addChild(this.graphsSp);
        this.sprite.addChild(this._grahsSpClone);
        window.gsp = this.graphsSp;
      }
    }, {
      key: "initInduce",
      value: function initInduce() {
        var me = this;
        this.induce = new Rect({
          id: "induce",
          context: {
            width: 0,
            height: 0,
            fillStyle: "#000000",
            globalAlpha: 0
          }
        });
        this.sprite.addChild(this.induce);
        var _mosedownIng = false;
        var _lastDragPoint = null;
        var _preCursor = me.app.canvax.domView.style.cursor; //滚轮缩放相关

        var _wheelHandleTimeLen = 32; //16*2

        var _wheelHandleTimeer = null;
        var _deltaY = 0;
        this.induce.on(_mmvis.event.types.get(), function (e) {
          if (me.status.transform.enabled) {
            if (e.type == "mousedown") {
              me.induce.toFront();
              _mosedownIng = true;
              _lastDragPoint = e.point;
              me.app.canvax.domView.style.cursor = "move";
            }

            ;

            if (e.type == "mouseup" || e.type == "mouseout") {
              me.induce.toBack();
              _mosedownIng = false;
              _lastDragPoint = null;
              me.app.canvax.domView.style.cursor = _preCursor;
            }

            ;

            if (e.type == "mousemove") {
              if (_mosedownIng) {
                me.graphsSp.context.x += e.point.x - _lastDragPoint.x;
                me.graphsSp.context.y += e.point.y - _lastDragPoint.y;
                _lastDragPoint = e.point;
              }
            }

            ;

            if (e.type == "wheel") {
              if (Math.abs(e.deltaY) > Math.abs(_deltaY)) {
                _deltaY = e.deltaY;
              }

              ;

              if (!_wheelHandleTimeer) {
                _wheelHandleTimeer = setTimeout(function () {
                  var itemLen = 0.02;

                  var _scale = e.deltaY / 30 * itemLen;

                  if (Math.abs(_scale) < 0.04) {
                    _scale = Math.sign(_scale) * 0.04;
                  }

                  if (Math.abs(_scale) > 0.08) {
                    _scale = Math.sign(_scale) * 0.08;
                  }

                  var scale = me.status.transform.scale + _scale;

                  if (scale <= 0.1) {
                    scale = 0.1;
                  }

                  if (scale >= 1) {
                    //关系图里面放大看是没必要的
                    scale = 1;
                  }

                  var point = e.target.localToGlobal(e.point);
                  me.scale(scale, point);
                  _wheelHandleTimeer = null;
                  _deltaY = 0;
                }, _wheelHandleTimeLen);
              }

              ;
              e.preventDefault();
            }

            ;
          }

          ;
        });
      }
    }, {
      key: "scale",
      value: function scale(_scale2, point) {
        return;

        if (this.status.transform.scale == _scale2) {
          return;
        }

        ;
        var scaleOrigin = point ? this._grahsSpClone.globalToLocal(point) : {
          x: 0,
          y: 0
        };
        console.log(_scale2, JSON.stringify(point), JSON.stringify(scaleOrigin), JSON.stringify(this.graphsSp._transform));
        this.status.transform.scale = _scale2;
        this.status.transform.scaleOrigin.x = scaleOrigin.x;
        this.status.transform.scaleOrigin.y = scaleOrigin.y;
        this.graphsSp.context.scaleOrigin.x = scaleOrigin.x;
        this.graphsSp.context.scaleOrigin.y = scaleOrigin.y;
        this.graphsSp.context.scaleX = _scale2;
        this.graphsSp.context.scaleY = _scale2;
        var newLeftTopPoint = this.graphsSp.localToGlobal({
          x: 0,
          y: 0
        }, this.sprite);
        console.log(JSON.stringify(newLeftTopPoint)); //this._grahsSpClone.context.x = newLeftTopPoint.x;
        //this._grahsSpClone.context.y = newLeftTopPoint.y;
      }
    }, {
      key: "draw",
      value: function draw(opt) {
        !opt && (opt = {});

        _mmvis._.extend(true, this, opt);

        this.data = opt.data || this._initData();

        if (this.layout == "dagre") {
          this.dagreLayout(this.data);
        } else if (this.layout == "tree") {
          this.treeLayout(this.data);
        } else if (_mmvis._.isFunction(this.layout)) {
          //layout需要设置好data中nodes的xy， 以及edges的points，和 size的width，height
          this.layout(this.data);
        }

        ;
        this.widget();
        this.sprite.context.x = this.origin.x;
        this.sprite.context.y = this.origin.y;

        if (this.status.transform.fitView == 'autoZoom') {
          this.sprite.context.scaleX = this.width / this.data.size.width;
          this.sprite.context.scaleY = this.height / this.data.size.height;
        }

        var _offsetLet = (this.width - this.data.size.width) / 2;

        if (_offsetLet < 0) {
          _offsetLet = 0;
        }

        ;
        this.graphsSp.context.x = _offsetLet;
        this._grahsSpClone.context.x = _offsetLet;
      }
    }, {
      key: "_initData",
      value: function _initData() {
        var data = {
          nodes: [//{ type,key,content,ctype,width,height,x,y }
          ],
          edges: [//{ type,key[],content,ctype,width,height,x,y }
          ],
          size: {
            width: 0,
            height: 0
          }
        };
        var originData = this.app._data;

        if ((0, _data.checkDataIsJson)(originData, this.field, this.childrenField)) {
          this.jsonData = (0, _data.jsonToArrayForRelation)(originData, this, this.childrenField);
          this.dataFrame = this.app.dataFrame = (0, _mmvis.dataFrame)(this.jsonData);
        } else {
          if (this.layout == "tree") {
            //源数据就是图表标准数据，只需要转换成json的Children格式
            //app.dataFrame.jsonOrg ==> [{name: key:} ...] 不是children的树结构
            //tree layout算法需要children格式的数据，蛋疼
            this.jsonData = (0, _data.arrayToTreeJsonForRelation)(this.app.dataFrame.jsonOrg, this);
          }

          ;
        }

        ;
        var _nodeMap = {};

        for (var i = 0; i < this.dataFrame.length; i++) {
          var rowData = this.dataFrame.getRowDataAt(i);

          var fields = _mmvis._.flatten([(rowData[this.field] + "").split(",")]);

          var content = this._getContent(rowData);

          var node = {
            type: "relation",
            iNode: i,
            rowData: rowData,
            key: fields.length == 1 ? fields[0] : fields,
            content: content,
            ctype: this._checkHtml(content) ? 'html' : 'canvas',
            //下面三个属性在_setElementAndSize中设置
            element: null,
            //外面传的layout数据可能没有element，widget的时候要检测下
            width: null,
            height: null,
            //这个在layout的时候设置
            x: null,
            y: null,
            shapeType: null,
            //如果是edge，要填写这两节点
            source: null,
            target: null
          };

          _mmvis._.extend(node, this._getElementAndSize(node));

          if (fields.length == 1) {
            node.shapeType = this.getProp(this.node.shapeType, node);
            data.nodes.push(node);
            _nodeMap[node.key] = node;
          } else {
            node.shapeType = this.getProp(this.line.shapeType, node);
            data.edges.push(node);
          }

          ;
        }

        ; //然后给edge填写source 和 target

        _mmvis._.each(data.edges, function (edge) {
          var keys = edge.key;
          edge.source = _nodeMap[keys[0]];
          edge.target = _nodeMap[keys[1]];
        });

        return data;
      }
    }, {
      key: "dagreLayout",
      value: function dagreLayout(data) {
        var layout = _mmvis.global.layout.dagre;
        var g = new layout.graphlib.Graph();
        g.setGraph(this.layoutOpts.graph);
        g.setDefaultEdgeLabel(function () {
          //其实我到现在都还没搞明白setDefaultEdgeLabel的作用
          return {};
        });

        _mmvis._.each(data.nodes, function (node) {
          g.setNode(node.key, node);
        });

        _mmvis._.each(data.edges, function (edge) {
          g.setEdge.apply(g, _toConsumableArray(edge.key).concat([edge]));
        });

        layout.layout(g);
        data.size.width = g.graph().width;
        data.size.height = g.graph().height;
        return data;
      }
    }, {
      key: "treeLayout",
      value: function treeLayout(data) {
        var tree = _mmvis.global.layout.tree().separation(function (a, b) {
          //设置横向节点之间的间距
          var totalWidth = a.width + b.width;
          return totalWidth / 2 + 10;
        });

        var nodes = tree.nodes(this.jsonData[0]).reverse();
        var links = tree.links(nodes);
      }
    }, {
      key: "widget",
      value: function widget() {
        var me = this;

        _mmvis._.each(this.data.edges, function (edge) {
          if (me.line.isTree) {
            me._setTreePoints(edge);
          }

          ;
          var lineWidth = me.getProp(me.line.lineWidth, edge);
          var strokeStyle = me.getProp(me.line.strokeStyle, edge);

          var _bl = new Path({
            context: {
              path: me._getPathStr(edge, me.line.inflectionRadius),
              lineWidth: lineWidth,
              strokeStyle: strokeStyle
            }
          });

          var arrowControl = edge.points.slice(-2, -1)[0];

          if (me.line.shapeType == "bezier") {
            if (me.rankdir == "TB" || me.rankdir == "BT") {
              arrowControl.x += (edge.source.x - edge.target.x) / 20;
            }

            if (me.rankdir == "LR" || me.rankdir == "RL") {
              arrowControl.y += (edge.source.y - edge.target.y) / 20;
            }
          }

          ;
          me.edgesSp.addChild(_bl);
          /*  edge的xy 就是 可以用来显示label的位置
          var _circle = new Circle({
              context : {
                  r : 4,
                  x : edge.x,
                  y : edge.y,
                  fillStyle: "red"
              }
          })
          me.edgesSp.addChild( _circle );
          */

          if (me.line.arrow) {
            var _arrow = new Arrow({
              context: {
                control: arrowControl,
                point: edge.points.slice(-1)[0],
                strokeStyle: strokeStyle //fillStyle: strokeStyle

              }
            });

            me.edgesSp.addChild(_arrow);
          }

          ;
        });

        _mmvis._.each(this.data.nodes, function (node) {
          var _boxShape = new Rect({
            context: {
              x: node.x - node.width / 2,
              y: node.y - node.height / 2,
              width: node.width,
              height: node.height,
              lineWidth: 1,
              fillStyle: me.getProp(me.node.fillStyle, node),
              strokeStyle: me.getProp(me.node.strokeStyle, node),
              radius: _mmvis._.flatten([me.getProp(me.node.radius, node)])
            }
          });

          _boxShape.nodeData = node;
          me.nodesSp.addChild(_boxShape);

          _boxShape.on(_mmvis.event.types.get(), function (e) {
            e.eventInfo = {
              trigger: me.node,
              nodes: [this.nodeData]
            };
            me.app.fire(e.type, e);
          });

          if (node.ctype == "canvas") {
            node.element.context.x = node.x - node.width / 2;
            node.element.context.y = node.y - node.height / 2;
            me.nodesSp.addChild(node.element);
          }

          ;

          if (node.ctype == "html") {
            //html的话，要等 _boxShape 被添加进舞台，拥有了世界矩阵后才能被显示出来和移动位置
            //而且要监听 _boxShape 的任何形变跟随
            _boxShape.on("transform", function () {
              var devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
              node.element.style.transform = "matrix(" + _boxShape.worldTransform.clone().scale(1 / devicePixelRatio, 1 / devicePixelRatio).toArray().join() + ")";
              node.element.style.transformOrigin = "left top"; //修改为左上角为旋转中心点来和canvas同步

              node.element.style.marginLeft = me.getProp(me.node.padding, node) * me.status.transform.scale + "px";
              node.element.style.marginTop = me.getProp(me.node.padding, node) * me.status.transform.scale + "px";
              node.element.style.visibility = "visible";
            });
          }

          ;
        });

        this.induce.context.width = this.width;
        this.induce.context.height = this.height;
      }
    }, {
      key: "_setTreePoints",
      value: function _setTreePoints(edge) {
        var points = edge.points;

        if (this.rankdir == "TB" || this.rankdir == "BT") {
          points[0] = {
            x: edge.source.x,
            y: edge.source.y + (this.rankdir == "BT" ? -1 : 1) * edge.source.height / 2
          };
          points.splice(1, 0, {
            x: edge.source.x,
            y: points.slice(-2, -1)[0].y
          });
        }

        if (this.rankdir == "LR" || this.rankdir == "RL") {
          points[0] = {
            x: edge.source.x + (this.rankdir == "RL" ? -1 : 1) * edge.source.width / 2,
            y: edge.source.y
          };
          points.splice(1, 0, {
            x: points.slice(-2, -1)[0].x,
            y: edge.source.y
          });
        }

        edge.points = points;
      }
    }, {
      key: "_getPathStr",
      value: function _getPathStr(edge, inflectionRadius) {
        var points = edge.points;
        var head = points[0];
        var tail = points.slice(-1)[0];
        var str = "M" + head.x + " " + head.y;

        if (edge.shapeType == "bezier") {
          if (points.length == 3) {
            str += ",Q" + points[1].x + " " + points[1].y + " " + tail.x + " " + tail.y;
          }

          if (points.length == 4) {
            str += ",C" + points[1].x + " " + points[1].y + " " + points[2].x + " " + points[2].y + " " + tail.x + " " + tail.y;
          }
        }

        ;

        if (edge.shapeType == "brokenLine") {
          _mmvis._.each(points, function (point, i) {
            if (i) {
              if (inflectionRadius && i < points.length - 1) {
                //圆角连线
                var prePoint = points[i - 1];
                var nextPoint = points[i + 1]; //要从这个点到上个点的半径距离，已point为控制点，绘制nextPoint的半径距离

                var radius = inflectionRadius; //radius要做次二次校验，取radius 以及 point 和prePoint距离以及和 nextPoint 的最小值
                //var _disPre = Math.abs(Math.sqrt( (prePoint.x - point.x)*(prePoint.x - point.x) + (prePoint.y - point.y)*(prePoint.y - point.y) ));
                //var _disNext = Math.abs(Math.sqrt( (nextPoint.x - point.x)*(nextPoint.x - point.x) + (nextPoint.y - point.y)*(nextPoint.y - point.y) ));

                var _disPre = Math.max(Math.abs(prePoint.x - point.x) / 2, Math.abs(prePoint.y - point.y) / 2);

                var _disNext = Math.max(Math.abs(nextPoint.x - point.x) / 2, Math.abs(nextPoint.y - point.y) / 2);

                radius = _mmvis._.min([radius, _disPre, _disNext]); //console.log(Math.atan2( point.y - prePoint.y , point.x - prePoint.x ),Math.atan2( nextPoint.y - point.y , nextPoint.x - point.x ))

                if (point.x == prePoint.x && point.y == prePoint.y || point.x == nextPoint.x && point.y == nextPoint.y || Math.atan2(point.y - prePoint.y, point.x - prePoint.x) == Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x)) {
                  //如果中间的这个点 ， 和前后的点在一个直线上面，就略过
                  return;
                } else {
                  var getPointOf = function getPointOf(p) {
                    var _atan2 = Math.atan2(p.y - point.y, p.x - point.x);

                    return {
                      x: point.x + radius * Math.cos(_atan2),
                      y: point.y + radius * Math.sin(_atan2)
                    };
                  };

                  ;
                  var bezierBegin = getPointOf(prePoint);
                  var bezierEnd = getPointOf(nextPoint);
                  str += ",L" + bezierBegin.x + " " + bezierBegin.y + ",Q" + point.x + " " + point.y + " " + bezierEnd.x + " " + bezierEnd.y;
                }
              } else {
                //直角连线
                str += ",L" + point.x + " " + point.y;
              }

              ;
            }
          });
        }

        ; //str += "z"

        return str;
      }
    }, {
      key: "_checkHtml",
      value: function _checkHtml(str) {
        var reg = /<[^>]+>/g;
        return reg.test(str);
      }
    }, {
      key: "_getContent",
      value: function _getContent(rowData) {
        var me = this;

        var _c; //this.node.content;


        if (this._isField(this.node.content.field)) {
          _c = rowData[this.node.content.field];
        }

        ;

        if (me.node.content.format && _mmvis._.isFunction(me.node.content.format)) {
          _c = me.node.content.format.apply(this, [_c, rowData]);
        }

        ;
        return _c;
      }
    }, {
      key: "_isField",
      value: function _isField(str) {
        return ~this.dataFrame.fields.indexOf(str);
      }
    }, {
      key: "_getElementAndSize",
      value: function _getElementAndSize(node) {
        var me = this;
        var contentType = node.ctype;

        if (me._isField(contentType)) {
          contentType = node.rowData[contentType];
        }

        ;
        !contentType && (contentType = 'canvas');

        if (contentType == 'canvas') {
          return me._getEleAndsetCanvasSize(node);
        }

        ;

        if (contentType == 'html') {
          return me._getEleAndsetHtmlSize(node);
        }

        ;
      }
    }, {
      key: "_getEleAndsetCanvasSize",
      value: function _getEleAndsetCanvasSize(node) {
        var me = this;
        var content = node.content;
        var width = node.rowData.width,
            height = node.rowData.height;
        var sprite = new _canvax2["default"].Display.Sprite({}); //先创建text，根据 text 来计算node需要的width和height

        var label = new _canvax2["default"].Display.Text(content, {
          context: {
            fillStyle: me.getProp(me.node.content.fontColor, node),
            textAlign: me.getProp(me.node.content.textAlign, node),
            textBaseline: me.getProp(me.node.content.textBaseline, node)
          }
        });

        if (!width) {
          width = label.getTextWidth() + me.getProp(me.node.padding, node) * me.status.transform.scale * 2;
        }

        ;

        if (!height) {
          height = label.getTextHeight() + me.getProp(me.node.padding, node) * me.status.transform.scale * 2;
        }

        ;
        sprite.addChild(label);
        sprite.context.width = parseInt(width);
        sprite.context.height = parseInt(height);
        label.context.x = parseInt(width / 2);
        label.context.y = parseInt(height / 2);
        return {
          element: sprite,
          width: width,
          height: height
        };
      }
    }, {
      key: "_getEleAndsetHtmlSize",
      value: function _getEleAndsetHtmlSize(node) {
        var me = this;
        var content = node.content;
        var width = node.rowData.width,
            height = node.rowData.height;

        var _dom = document.createElement("div");

        _dom.className = "chartx_relation_node";
        _dom.style.cssText += "; position:absolute;visibility:hidden;";
        _dom.style.cssText += "; color:" + me.getProp(me.node.content.fontColor, node) + ";";
        _dom.style.cssText += "; text-align:" + me.getProp(me.node.content.textAlign, node) + ";";
        _dom.style.cssText += "; vertical-align:" + me.getProp(me.node.content.textBaseline, node) + ";";
        _dom.innerHTML = content;
        this.domContainer.appendChild(_dom);

        if (!width) {
          width = _dom.offsetWidth + me.getProp(me.node.padding, node) * me.status.transform.scale * 2;
        }

        ;

        if (!height) {
          height = _dom.offsetHeight + me.getProp(me.node.padding, node) * me.status.transform.scale * 2;
        }

        ;
        return {
          element: _dom,
          width: width,
          height: height
        };
      }
    }, {
      key: "getNodesAt",
      value: function getNodesAt(index) {}
    }, {
      key: "getProp",
      value: function getProp(prop, nodeData) {
        var _prop = prop;

        if (this._isField(prop)) {
          _prop = nodeData.rowData[prop];
        } else {
          if (_mmvis._.isArray(prop)) {
            _prop = prop[nodeData.iNode];
          }

          ;

          if (_mmvis._.isFunction(prop)) {
            _prop = prop.apply(this, [nodeData]);
          }

          ;
        }

        ;
        return _prop;
      }
    }]);

    return Relation;
  }(_index2["default"]);

  _mmvis.global.registerComponent(Relation, 'graphs', 'relation');

  exports["default"] = Relation;
});