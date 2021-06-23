"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _component = _interopRequireDefault(require("../component"));

var _canvax = _interopRequireDefault(require("canvax"));

var _tools = require("../../utils/tools");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var _ = _canvax["default"]._;

var barGuide = /*#__PURE__*/function (_Component) {
  (0, _inherits2["default"])(barGuide, _Component);

  var _super = _createSuper(barGuide);

  function barGuide(opt, app) {
    var _this;

    (0, _classCallCheck2["default"])(this, barGuide);
    _this = _super.call(this, opt, app);
    _this.name = "barGuide";
    _this.data = null;
    _this.barDatas = null;
    _this._yAxis = null;
    _this.sprite = null;

    _.extend(true, (0, _assertThisInitialized2["default"])(_this), (0, _tools.getDefaultProps)(barGuide.defaultProps()), opt);

    _this._yAxis = _this.app.getComponent({
      name: 'coord'
    })._yAxis[_this.yAxisAlign == "left" ? 0 : 1];
    _this.sprite = new _canvax["default"].Display.Sprite();

    _this.app.graphsSprite.addChild(_this.sprite);

    return _this;
  }

  (0, _createClass2["default"])(barGuide, [{
    key: "reset",
    value: function reset(opt) {
      _.extend(true, this, opt);

      this.barDatas = null;
      this.data = null;
      this.sprite.removeAllChildren();
      this.draw();
    }
  }, {
    key: "draw",
    value: function draw() {
      var me = this;

      var _coord = this.app.getComponent({
        name: 'coord'
      });

      this.pos = {
        x: _coord.origin.x,
        y: _coord.origin.y
      };
      this.setPosition();

      _.each(me.app.getComponents({
        name: 'graphs'
      }), function (_g) {
        if (_g.type == "bar" && _g.data[me.barField]) {
          me.barDatas = _g.data[me.barField];
          return false;
        }
      });

      this.data = _.flatten(me.app.dataFrame.getDataOrg(me.field));

      if (!this.barDatas) {
        return;
      }

      ;

      _.each(this.data, function (val, i) {
        var y = -me._yAxis.getPosOfVal(val);
        var barData = me.barDatas[i];

        var _node = new _canvax["default"].Shapes.Circle({
          context: {
            x: barData.x + barData.width / 2,
            y: y,
            r: me.node.radius,
            fillStyle: me.node.fillStyle,
            strokeStyle: me.node.strokeStyle,
            lineWidth: me.node.lineWidth
          }
        });

        var _label = val;

        if (_.isFunction(me.label.format)) {
          _label = me.label.format(val, barData);
        }

        ;

        var _txt = new _canvax["default"].Display.Text(_label, {
          context: {
            x: barData.x + barData.width / 2,
            y: y - me.node.radius - 1,
            fillStyle: me.label.fontColor,
            lineWidth: me.label.lineWidth,
            strokeStyle: me.label.strokeStyle,
            fontSize: me.label.fontSize,
            textAlign: me.label.textAlign,
            textBaseline: me.label.verticalAlign
          }
        });

        me.sprite.addChild(_node);
        me.sprite.addChild(_txt);
      });
    }
  }, {
    key: "_getProp",
    value: function _getProp(val, tgi, i) {
      var res = val;

      if (_.isFunction(val)) {
        res = val.apply(this, [tgi, i]);
      }

      return res;
    }
  }], [{
    key: "defaultProps",
    value: function defaultProps() {
      return {
        field: {
          detail: '字段配置',
          "default": null
        },
        barField: {
          detail: '这个guide对应的bar Graph 的field',
          "default": null
        },
        yAxisAlign: {
          detail: '这个guide组件回到到哪个y轴',
          "default": 'left'
        },
        node: {
          detail: '单个节点配置',
          propertys: {
            shapeType: {
              detail: '节点绘制的图形类型',
              "default": 'circle'
            },
            lineWidth: {
              detail: '图表描边线宽',
              "default": 3
            },
            radius: {
              detail: '图形半径',
              "default": 6
            },
            fillStyle: {
              detail: '填充色',
              "default": '#19dea1'
            },
            strokeStyle: {
              detail: '描边色',
              "default": '#fff'
            }
          }
        },
        label: {
          detail: '文本配置',
          propertys: {
            fontSize: {
              detail: '字体大小',
              "default": 12
            },
            fontColor: {
              detail: '字体颜色',
              "default": '#19dea1'
            },
            verticalAlign: {
              detail: '垂直对齐方式',
              "default": 'bottom'
            },
            textAlign: {
              detail: '水平对齐方式',
              "default": 'center'
            },
            strokeStyle: {
              detail: '文本描边颜色',
              "default": '#fff'
            },
            lineWidth: {
              detail: '文本描边线宽',
              "default": 0
            },
            format: {
              detail: '文本格式处理函数',
              "default": null
            }
          }
        }
      };
    }
  }]);
  return barGuide;
}(_component["default"]);

_component["default"].registerComponent(barGuide, 'barGuide');

var _default = barGuide;
exports["default"] = _default;