"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = flextree;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _d3Hierarchy = require("d3-hierarchy");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var defaults = Object.freeze({
  children: function children(data) {
    return data.children;
  },
  nodeSize: function nodeSize(node) {
    return node.data.size;
  },
  spacing: 0
}); // Create a layout function with customizable options. Per D3-style, the
// options can be set at any time using setter methods. The layout function
// will compute the tree node positions based on the options in effect at the
// time it is called.

function flextree(options) {
  var opts = Object.assign({}, defaults, options);

  function accessor(name) {
    var opt = opts[name];
    return typeof opt === 'function' ? opt : function () {
      return opt;
    };
  }

  function layout(tree) {
    var wtree = wrap(getWrapper(), tree, function (node) {
      return node.children;
    });
    wtree.update();
    return wtree.data;
  }

  function getFlexNode() {
    var nodeSize = accessor('nodeSize');

    var _spacing = accessor('spacing');

    return /*#__PURE__*/function (_hierarchy$prototype$) {
      (0, _inherits2["default"])(FlexNode, _hierarchy$prototype$);

      var _super = _createSuper(FlexNode);

      function FlexNode(data) {
        (0, _classCallCheck2["default"])(this, FlexNode);
        return _super.call(this, data);
      }

      (0, _createClass2["default"])(FlexNode, [{
        key: "copy",
        value: function copy() {
          var c = wrap(this.constructor, this, function (node) {
            return node.children;
          });
          c.each(function (node) {
            return node.data = node.data.data;
          });
          return c;
        }
      }, {
        key: "size",
        get: function get() {
          return nodeSize(this);
        }
      }, {
        key: "spacing",
        value: function spacing(oNode) {
          return _spacing(this, oNode);
        }
      }, {
        key: "nodes",
        get: function get() {
          return this.descendants();
        }
      }, {
        key: "xSize",
        get: function get() {
          return this.size[0];
        }
      }, {
        key: "ySize",
        get: function get() {
          return this.size[1];
        }
      }, {
        key: "top",
        get: function get() {
          return this.y;
        }
      }, {
        key: "bottom",
        get: function get() {
          return this.y + this.ySize;
        }
      }, {
        key: "left",
        get: function get() {
          return this.x - this.xSize / 2;
        }
      }, {
        key: "right",
        get: function get() {
          return this.x + this.xSize / 2;
        }
      }, {
        key: "root",
        get: function get() {
          var ancs = this.ancestors();
          return ancs[ancs.length - 1];
        }
      }, {
        key: "numChildren",
        get: function get() {
          return this.hasChildren ? this.children.length : 0;
        }
      }, {
        key: "hasChildren",
        get: function get() {
          return !this.noChildren;
        }
      }, {
        key: "noChildren",
        get: function get() {
          return this.children === null;
        }
      }, {
        key: "firstChild",
        get: function get() {
          return this.hasChildren ? this.children[0] : null;
        }
      }, {
        key: "lastChild",
        get: function get() {
          return this.hasChildren ? this.children[this.numChildren - 1] : null;
        }
      }, {
        key: "extents",
        get: function get() {
          return (this.children || []).reduce(function (acc, kid) {
            return FlexNode.maxExtents(acc, kid.extents);
          }, this.nodeExtents);
        }
      }, {
        key: "nodeExtents",
        get: function get() {
          return {
            top: this.top,
            bottom: this.bottom,
            left: this.left,
            right: this.right
          };
        }
      }], [{
        key: "maxExtents",
        value: function maxExtents(e0, e1) {
          return {
            top: Math.min(e0.top, e1.top),
            bottom: Math.max(e0.bottom, e1.bottom),
            left: Math.min(e0.left, e1.left),
            right: Math.max(e0.right, e1.right)
          };
        }
      }]);
      return FlexNode;
    }(_d3Hierarchy.hierarchy.prototype.constructor);
  }

  function getWrapper() {
    var FlexNode = getFlexNode();
    var nodeSize = accessor('nodeSize');

    var _spacing2 = accessor('spacing');

    return /*#__PURE__*/function (_FlexNode) {
      (0, _inherits2["default"])(_class, _FlexNode);

      var _super2 = _createSuper(_class);

      function _class(data) {
        var _this;

        (0, _classCallCheck2["default"])(this, _class);
        _this = _super2.call(this, data);
        Object.assign((0, _assertThisInitialized2["default"])(_this), {
          x: 0,
          y: 0,
          relX: 0,
          prelim: 0,
          shift: 0,
          change: 0,
          lExt: (0, _assertThisInitialized2["default"])(_this),
          lExtRelX: 0,
          lThr: null,
          rExt: (0, _assertThisInitialized2["default"])(_this),
          rExtRelX: 0,
          rThr: null
        });
        return _this;
      }

      (0, _createClass2["default"])(_class, [{
        key: "size",
        get: function get() {
          return nodeSize(this.data);
        }
      }, {
        key: "spacing",
        value: function spacing(oNode) {
          return _spacing2(this.data, oNode.data);
        }
      }, {
        key: "x",
        get: function get() {
          return this.data.x;
        },
        set: function set(v) {
          this.data.x = v;
        }
      }, {
        key: "y",
        get: function get() {
          return this.data.y;
        },
        set: function set(v) {
          this.data.y = v;
        }
      }, {
        key: "update",
        value: function update() {
          layoutChildren(this);
          resolveX(this);
          return this;
        }
      }]);
      return _class;
    }(FlexNode);
  }

  function wrap(FlexClass, treeData, children) {
    var _wrap = function _wrap(data, parent) {
      var node = new FlexClass(data);
      Object.assign(node, {
        parent: parent,
        depth: parent === null ? 0 : parent.depth + 1,
        height: 0,
        length: 1
      });
      var kidsData = children(data) || [];
      node.children = kidsData.length === 0 ? null : kidsData.map(function (kd) {
        return _wrap(kd, node);
      });

      if (node.children) {
        Object.assign(node, node.children.reduce(function (hl, kid) {
          return {
            height: Math.max(hl.height, kid.height + 1),
            length: hl.length + kid.length
          };
        }, node));
      }

      return node;
    };

    return _wrap(treeData, null);
  }

  Object.assign(layout, {
    nodeSize: function nodeSize(arg) {
      return arguments.length ? (opts.nodeSize = arg, layout) : opts.nodeSize;
    },
    spacing: function spacing(arg) {
      return arguments.length ? (opts.spacing = arg, layout) : opts.spacing;
    },
    children: function children(arg) {
      return arguments.length ? (opts.children = arg, layout) : opts.children;
    },
    hierarchy: function hierarchy(treeData, children) {
      var kids = typeof children === 'undefined' ? opts.children : children;
      return wrap(getFlexNode(), treeData, kids);
    },
    dump: function dump(tree) {
      var nodeSize = accessor('nodeSize');

      var _dump = function _dump(i0) {
        return function (node) {
          var i1 = i0 + '  ';
          var i2 = i0 + '    ';
          var x = node.x,
              y = node.y;
          var size = nodeSize(node);
          var kids = node.children || [];
          var kdumps = kids.length === 0 ? ' ' : ",".concat(i1, "children: [").concat(i2).concat(kids.map(_dump(i2)).join(i2)).concat(i1, "],").concat(i0);
          return "{ size: [".concat(size.join(', '), "],").concat(i1, "x: ").concat(x, ", y: ").concat(y).concat(kdumps, "},");
        };
      };

      return _dump('\n')(tree);
    }
  });
  return layout;
}

var layoutChildren = function layoutChildren(w) {
  var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  w.y = y;
  (w.children || []).reduce(function (acc, kid) {
    var _acc = (0, _slicedToArray2["default"])(acc, 2),
        i = _acc[0],
        lastLows = _acc[1];

    layoutChildren(kid, w.y + w.ySize); // The lowest vertical coordinate while extreme nodes still point
    // in current subtree.

    var lowY = (i === 0 ? kid.lExt : kid.rExt).bottom;
    if (i !== 0) separate(w, i, lastLows);
    var lows = updateLows(lowY, i, lastLows);
    return [i + 1, lows];
  }, [0, null]);
  shiftChange(w);
  positionRoot(w);
  return w;
}; // Resolves the relative coordinate properties - relX and prelim --
// to set the final, absolute x coordinate for each node. This also sets
// `prelim` to 0, so that `relX` for each node is its x-coordinate relative
// to its parent.


var resolveX = function resolveX(w, prevSum, parentX) {
  // A call to resolveX without arguments is assumed to be for the root of
  // the tree. This will set the root's x-coord to zero.
  if (typeof prevSum === 'undefined') {
    prevSum = -w.relX - w.prelim;
    parentX = 0;
  }

  var sum = prevSum + w.relX;
  w.relX = sum + w.prelim - parentX;
  w.prelim = 0;
  w.x = parentX + w.relX;
  (w.children || []).forEach(function (k) {
    return resolveX(k, sum, w.x);
  });
  return w;
}; // Process shift and change for all children, to add intermediate spacing to
// each child's modifier.


var shiftChange = function shiftChange(w) {
  (w.children || []).reduce(function (acc, child) {
    var _acc2 = (0, _slicedToArray2["default"])(acc, 2),
        lastShiftSum = _acc2[0],
        lastChangeSum = _acc2[1];

    var shiftSum = lastShiftSum + child.shift;
    var changeSum = lastChangeSum + shiftSum + child.change;
    child.relX += changeSum;
    return [shiftSum, changeSum];
  }, [0, 0]);
}; // Separates the latest child from its previous sibling

/* eslint-disable complexity */


var separate = function separate(w, i, lows) {
  var lSib = w.children[i - 1];
  var curSubtree = w.children[i];
  var rContour = lSib;
  var rSumMods = lSib.relX;
  var lContour = curSubtree;
  var lSumMods = curSubtree.relX;
  var isFirst = true;

  while (rContour && lContour) {
    if (rContour.bottom > lows.lowY) lows = lows.next; // How far to the left of the right side of rContour is the left side
    // of lContour? First compute the center-to-center distance, then add
    // the "spacing"

    var dist = rSumMods + rContour.prelim - (lSumMods + lContour.prelim) + rContour.xSize / 2 + lContour.xSize / 2 + rContour.spacing(lContour);

    if (dist > 0 || dist < 0 && isFirst) {
      lSumMods += dist; // Move subtree by changing relX.

      moveSubtree(curSubtree, dist);
      distributeExtra(w, i, lows.index, dist);
    }

    isFirst = false; // Advance highest node(s) and sum(s) of modifiers

    var rightBottom = rContour.bottom;
    var leftBottom = lContour.bottom;

    if (rightBottom <= leftBottom) {
      rContour = nextRContour(rContour);
      if (rContour) rSumMods += rContour.relX;
    }

    if (rightBottom >= leftBottom) {
      lContour = nextLContour(lContour);
      if (lContour) lSumMods += lContour.relX;
    }
  } // Set threads and update extreme nodes. In the first case, the
  // current subtree is taller than the left siblings.


  if (!rContour && lContour) setLThr(w, i, lContour, lSumMods); // In the next case, the left siblings are taller than the current subtree
  else if (rContour && !lContour) setRThr(w, i, rContour, rSumMods);
};
/* eslint-enable complexity */
// Move subtree by changing relX.


var moveSubtree = function moveSubtree(subtree, distance) {
  subtree.relX += distance;
  subtree.lExtRelX += distance;
  subtree.rExtRelX += distance;
};

var distributeExtra = function distributeExtra(w, curSubtreeI, leftSibI, dist) {
  var curSubtree = w.children[curSubtreeI];
  var n = curSubtreeI - leftSibI; // Are there intermediate children?

  if (n > 1) {
    var delta = dist / n;
    w.children[leftSibI + 1].shift += delta;
    curSubtree.shift -= delta;
    curSubtree.change -= dist - delta;
  }
};

var nextLContour = function nextLContour(w) {
  return w.hasChildren ? w.firstChild : w.lThr;
};

var nextRContour = function nextRContour(w) {
  return w.hasChildren ? w.lastChild : w.rThr;
};

var setLThr = function setLThr(w, i, lContour, lSumMods) {
  var firstChild = w.firstChild;
  var lExt = firstChild.lExt;
  var curSubtree = w.children[i];
  lExt.lThr = lContour; // Change relX so that the sum of modifier after following thread is correct.

  var diff = lSumMods - lContour.relX - firstChild.lExtRelX;
  lExt.relX += diff; // Change preliminary x coordinate so that the node does not move.

  lExt.prelim -= diff; // Update extreme node and its sum of modifiers.

  firstChild.lExt = curSubtree.lExt;
  firstChild.lExtRelX = curSubtree.lExtRelX;
}; // Mirror image of setLThr.


var setRThr = function setRThr(w, i, rContour, rSumMods) {
  var curSubtree = w.children[i];
  var rExt = curSubtree.rExt;
  var lSib = w.children[i - 1];
  rExt.rThr = rContour;
  var diff = rSumMods - rContour.relX - curSubtree.rExtRelX;
  rExt.relX += diff;
  rExt.prelim -= diff;
  curSubtree.rExt = lSib.rExt;
  curSubtree.rExtRelX = lSib.rExtRelX;
}; // Position root between children, taking into account their modifiers


var positionRoot = function positionRoot(w) {
  if (w.hasChildren) {
    var k0 = w.firstChild;
    var kf = w.lastChild;
    var prelim = (k0.prelim + k0.relX - k0.xSize / 2 + kf.relX + kf.prelim + kf.xSize / 2) / 2;
    Object.assign(w, {
      prelim: prelim,
      lExt: k0.lExt,
      lExtRelX: k0.lExtRelX,
      rExt: kf.rExt,
      rExtRelX: kf.rExtRelX
    });
  }
}; // Make/maintain a linked list of the indexes of left siblings and their
// lowest vertical coordinate.


var updateLows = function updateLows(lowY, index, lastLows) {
  // Remove siblings that are hidden by the new subtree.
  while (lastLows !== null && lowY >= lastLows.lowY) {
    lastLows = lastLows.next;
  } // Prepend the new subtree.


  return {
    lowY: lowY,
    index: index,
    next: lastLows
  };
};