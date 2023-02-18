var ke = Object.defineProperty;
var He = (c, e, t) => e in c ? ke(c, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : c[e] = t;
var u = (c, e, t) => (He(c, typeof e != "symbol" ? e + "" : e, t), t);
import { getCurrentInstance as We, ref as ee, inject as Pe, useAttrs as Ne, toRaw as ce, onMounted as Ie, onUnmounted as De, openBlock as fe, createElementBlock as Ce, unref as le, createBlock as Fe, renderSlot as be, watch as T, defineAsyncComponent as Xe, provide as Ye, nextTick as Q, createElementVNode as Be } from "vue";
function W(c, e = 350) {
  let t, n, i = 0;
  return function() {
    t = this, n = arguments;
    let o = new Date().valueOf();
    o - i > e && (c.apply(t, n), i = o);
  };
}
function qe(c) {
  return c.replace(/[A-Z]/g, function(e) {
    return "-" + e.toLowerCase();
  });
}
const G = (c = {}, e = {}, t = !1, n = []) => {
  const i = {};
  return Object.keys(e).forEach((o) => {
    Object.keys(c).includes(o) && !n.includes(o) && (t ? i[o] = e[o] !== void 0 ? e[o] : c[o] : c[o] = e[o] !== void 0 ? e[o] : c[o]);
  }), t ? i : c;
}, Y = (c) => {
  let e = Array.isArray(c) ? [] : {};
  if (c && typeof c == "object")
    for (let t in c)
      c.hasOwnProperty(t) && (c[t] && typeof c[t] == "object" ? e[t] = Y(c[t]) : e[t] = c[t]);
  return e;
}, Ee = (c) => {
  let e;
  if (c instanceof Element)
    do {
      if (c._isGridContainer_) {
        e = c._gridContainer_;
        break;
      }
      c = c.parentNode;
    } while (c.parentNode);
  return e;
}, H = (c, e = !1) => {
  let t = null;
  const n = c.touchTarget ? c.touchTarget : c.target;
  if (n._isGridContainer_)
    t = n._gridContainer_;
  else
    for (let i = 0; i < c.path.length && !(c.path[i]._isGridContainer_ && (t = c.path[i]._gridContainer_, !e)); i++)
      ;
  return t;
}, Ge = (c, e = !1) => {
  let t = null;
  const n = c.touchTarget ? c.touchTarget : c.target;
  if (n._isGridContainerArea)
    t = n;
  else
    for (let i = 0; i < c.path.length && !(c.path[i]._isGridContainerArea && (t = c.path[i], !e)); i++)
      ;
  return t;
}, $ = (c, e = !1) => {
  let t = null;
  const n = c.touchTarget ? c.touchTarget : c.target;
  if (n._isGridItem_)
    t = n._gridItem_;
  else
    for (let i = 0; i < c.path.length && !(c.path[i]._isGridItem_ && (t = c.path[i]._gridItem_, !e)); i++)
      ;
  return t;
}, ae = (c) => {
  let e = "touches";
  if (c.touches && c.touches.length === 0 && (e = "changedTouches"), c[e] && c[e].length) {
    for (let t in c[e][0])
      ["target"].includes(t) || (c[t] = c[e][0][t]);
    c.touchTarget = document.elementFromPoint(c.clientX, c.clientY);
  }
  return c;
}, je = {
  name: "GridItem",
  inheritAttrs: !1
}, Ue = /* @__PURE__ */ Object.assign(je, {
  props: {
    item: { required: !0, type: Object, default: void 0 },
    pos: {
      required: !0,
      type: Object,
      default: {
        w: { required: !0, type: Number, default: void 0 },
        h: { required: !0, type: Number, default: void 0 },
        x: { required: !1, type: Number, default: void 0 },
        y: { required: !1, type: Number, default: void 0 },
        minW: { required: !1, type: Number, default: void 0 },
        maxW: { required: !1, type: Number, default: void 0 },
        minH: { required: !1, type: Number, default: void 0 },
        maxH: { required: !1, type: Number, default: void 0 }
      }
    },
    name: { required: !1, type: String, default: void 0 },
    type: { required: !1, type: String, default: void 0 },
    transition: { required: !1, type: [Boolean, Object, Number], default: void 0 },
    static: { required: !1, type: Boolean, default: void 0 },
    exchange: { required: !1, type: Boolean, default: void 0 },
    draggable: { required: !1, type: Boolean, default: void 0 },
    resize: { required: !1, type: Boolean, default: void 0 },
    close: { required: !1, type: Boolean, default: void 0 },
    follow: { required: !1, type: Boolean, default: void 0 },
    dragOut: { required: !1, type: Boolean, default: void 0 },
    resizeOut: { required: !1, type: Boolean, default: void 0 },
    dragIgnoreEls: { required: !1, type: Array, default: void 0 },
    dragAllowEls: { required: !1, type: Array, default: void 0 },
    itemAPI: { required: !1, type: Object, default: {} }
  },
  setup(c) {
    const e = c;
    We();
    const t = ee();
    let n = null;
    const i = () => {
      T(() => e.pos, () => {
        !n || Object.keys(e.pos).forEach((f) => {
          const _ = e.pos[f];
          if (!!_ && (typeof _ == "number" || !isNaN(_))) {
            if (n.pos[f] === _)
              return;
            ["minW", "maxW", "minH", "maxH"].includes(f) && (n.pos[f] = _), ["w", "h"].includes(f) && (n.pos[f] = _), ["x", "y"].includes(f) && (n.container.responsive || (n.pos[f] = _));
          }
        });
      }, { deep: !0 }), T(() => e.transition, (f) => {
        (typeof f == "boolean" || typeof f == "object" || typeof f == "number") && (n.transition = f);
      }, { deep: !0 }), T(() => e.name, (f) => {
        typeof f == "string" && (n.name = f);
      }), T(() => e.type, (f) => {
        typeof f == "string" && (n.type = f);
      }), T(() => e.static, (f) => {
        typeof f == "boolean" && (n.static = f);
      }), T(() => e.exchange, (f) => {
        typeof f == "boolean" && (n.exchange = f);
      }), T(() => e.draggable, (f) => {
        typeof f == "boolean" && (n.draggable = f);
      }), T(() => e.resize, (f) => {
        typeof f == "boolean" && (n.resize = f);
      }), T(() => e.close, (f) => {
        typeof f == "boolean" && (n.close = f);
      }), T(() => e.follow, (f) => {
        typeof f == "boolean" && (n.follow = f);
      }), T(() => e.dragOut, (f) => {
        typeof f == "boolean" && (n.dragOut = f);
      }), T(() => e.resizeOut, (f) => {
        typeof f == "boolean" && (n.resizeOut = f);
      }), T(() => e.dragIgnoreEls, (f) => {
        Array.isArray(f) && (n.dragIgnoreEls = f);
      }), T(() => e.dragAllowEls, (f) => {
        Array.isArray(f) && (n.dragAllowEls = f);
      });
    };
    let o, l = null, s = {}, a = ee(!1);
    const m = Pe("_grid_item_components_"), h = () => {
      const f = m[e.type];
      f ? typeof f != "function" && console.error("components\u4E2D\u7684", e.type, '\u5E94\u8BE5\u662F\u4E00\u4E2A\u51FD\u6570,\u5E76\u4F7F\u7528import("XXX")\u5F02\u6B65\u5BFC\u5165') : console.error("\u672A\u5728components\u4E2D\u5B9A\u4E49", e.type, "\u7EC4\u4EF6"), o = Xe(f);
    };
    e.type && Object.keys(m).length > 0 && (s = {
      ...Ne(),
      ...ce(e)
    }, h(), a.value = !0);
    const d = () => {
      if (!l)
        return;
      const f = l.col, _ = l.row, y = l.engine.layoutConfig.autoSetColAndRows(l);
      (f !== y.col || _ !== y.row) && l.updateContainerStyleSize();
    };
    return Ie(() => {
      const f = ce(e);
      l = Ee(t.value), l.__ownTemp__, e.pos.autoOnce = !e.pos.x || !e.pos.y;
      const _ = e.pos.doItemCrossContainerExchange;
      if (delete e.pos.doItemCrossContainerExchange, n = l.add({
        el: t.value,
        ...f
      }), !n) {
        t.value.parentNode.removeChild(t.value);
        return;
      }
      n.mount(), e.itemAPI.getItem = () => n, e.itemAPI.exportConfig = () => n.exportConfig(), typeof _ == "function" && _(n), n._VueEvents.vueItemResizing = (y, w, p) => {
        e.pos.w && e.pos.w !== w && (e.pos.w = w), e.pos.h && e.pos.h !== p && (e.pos.h = p);
      }, n._VueEvents.vueItemMovePositionChange = (y, w, p, b) => {
        e.pos.x && e.pos.x !== p && (e.pos.x = p), e.pos.y && e.pos.y !== b && (e.pos.y = b);
      }, d(), i();
    }), De(() => {
      n && n.remove(), d();
    }), (f, _) => (fe(), Ce("div", {
      class: "grid-item",
      ref_key: "gridItem",
      ref: t,
      style: { display: "block", position: "absolute", overflow: "hidden" }
    }, [
      le(a) ? (fe(), Fe(le(o), {
        key: 0,
        attrs: le(s)
      }, null, 8, ["attrs"])) : be(f.$slots, "default", { key: 1 })
    ], 512));
  }
}), A = class {
  constructor() {
    A.intervalTime = 10;
    const e = () => {
      A.ready = !0, A.intervalTime = 50, document.removeEventListener("readystatechange", e);
    };
    document.readyState === "complete" || document.readyState === "interactive" ? e() : document.addEventListener("readystatechange", e);
  }
  static init() {
    A.ins || (new A(), A.ins = !0);
  }
  static run(e, ...t) {
    A.init();
    let n = 0, i = typeof e.timeout == "number" ? e.timeout : A.timeout, o = typeof e.intervalTime == "number" ? e.intervalTime : A.intervalTime, l = () => {
      let m;
      if (typeof e == "function")
        m = e.call(e, ...t);
      else if (typeof e == "object") {
        if (!e.func)
          throw new Error("func\u51FD\u6570\u5FC5\u987B\u4F20\u5165");
        m = e.func.call(e.func, ...t) || void 0;
      }
      e.callback && e.callback(m);
    }, s = () => e.rule ? e.rule() : A.ready;
    if (s())
      return l(), !0;
    let a = setInterval(() => {
      typeof e.max == "number" && e.max < n && (clearInterval(a), a = null), i < n * o && (clearInterval(a), a = null), s() && (clearInterval(a), a = null, l()), n++;
    }, o);
  }
};
let M = A;
u(M, "ready", !1), u(M, "ins", !1), u(M, "timeout", 12e3), u(M, "intervalTime", 50);
class te {
  constructor(e) {
    u(this, "el", null);
    u(this, "i", "");
    u(this, "w", 1);
    u(this, "h", 1);
    u(this, "x", null);
    u(this, "y", null);
    u(this, "initialX", null);
    u(this, "initialY", null);
    u(this, "col", null);
    u(this, "row", null);
    u(this, "minW", 1);
    u(this, "maxW", 1 / 0);
    u(this, "minH", 1);
    u(this, "maxH", 1 / 0);
    u(this, "iName", "");
    u(this, "nextStaticPos", null);
    u(this, "tempW", null);
    u(this, "tempH", null);
    u(this, "beforePos", null);
    u(this, "autoOnce", null);
    u(this, "posHash", "");
    this._define(), typeof e == "object" && this.update(e);
    for (let t = 0; t < 4; t++)
      this.posHash = this.posHash + String.fromCharCode(Math.floor(Math.random() * 26) + "a".charCodeAt(0));
  }
  _define() {
    let e = null, t = null;
    Object.defineProperties(this, {
      tempW: {
        get: () => e,
        set: (n) => {
          if (!(typeof n != "number" || !isFinite(n))) {
            if (n === this.w) {
              e = null;
              return;
            }
            n <= 0 ? e = 1 : e = n;
          }
        }
      },
      tempH: {
        get: () => t,
        set: (n) => {
          if (!(typeof n != "number" || !isFinite(n))) {
            if (n === this.h) {
              t = null;
              return;
            }
            n <= 0 ? t = 1 : t = n;
          }
        }
      }
    });
  }
  update(e) {
    return G(this, this._typeCheck(e)), this;
  }
  export(e = []) {
    const t = {};
    return Object.keys(this).forEach((n) => {
      ["w", "h", "x", "y"].includes(n) && (t[n] = this[n]), ["minW", "minH"].includes(n) && this[n] > 1 && (t[n] = this[n]), ["maxW", "maxH"].includes(n) && this[n] !== 1 / 0 && (t[n] = this[n]), e.includes(n) && this[n] && (t[n] = this[n]);
    }), t;
  }
  _typeCheck(e) {
    return Object.keys(e).forEach((t) => {
      if (["w", "h", "x", "y", "col", "row", "minW", "maxW", "minH", "maxH", "tempW", "tempH"].includes(t)) {
        if (e[t] === 1 / 0 || e[t] === void 0 || e[t] === null)
          return;
        e[t] = parseInt(e[t].toString());
      }
      t === "x" && (this.initialX = parseInt(e[t].toString())), t === "y" && (this.initialY = parseInt(e[t].toString()));
    }), e;
  }
}
const q = {
  gridContainerArea: {
    display: "block"
  },
  gridContainer: {
    height: "auto",
    width: "100%",
    position: "relative",
    display: "block",
    margin: "0 auto"
  },
  gridItem: {
    height: "100%",
    width: "100%",
    display: "block",
    overflow: "hidden",
    position: "absolute",
    userSelect: "none",
    touchCallout: "none"
  },
  gridResizableHandle: {
    height: "20px",
    width: "20px",
    position: "absolute",
    bottom: "0",
    right: "0",
    fontSize: "1.3rem",
    fontWeight: "800",
    color: "grey",
    textAlign: "right"
  },
  gridItemCloseBtn: {
    height: "20px",
    width: "20px",
    position: "absolute",
    right: "0",
    top: "0",
    innerHTML: "\xD7",
    fontSize: "1.2rem",
    textAlign: "center",
    lineHeight: "20px",
    borderRadius: "50%"
  }
}, X = class {
  constructor() {
  }
  static getInstance() {
    return X.ins || (X.ins = new X(), X.ins = !0), X;
  }
};
let N = X;
u(N, "ins", !1), u(N, "store", {
  screenWidth: null,
  screenHeight: null,
  editItemNum: 0,
  belongContainer: null,
  fromContainer: null,
  dragContainer: null,
  draggingLock: !1,
  currentContainer: null,
  beforeContainer: null,
  currentContainerArea: null,
  beforeContainerArea: null,
  fromItem: null,
  toItem: null,
  moveItem: null,
  exchangeItems: {
    old: null,
    new: null
  },
  cloneElement: null,
  mousedownEvent: null,
  mousedownItemOffsetLeft: null,
  mousedownItemOffsetTop: null,
  dragOrResize: null,
  isDragging: !1,
  isResizing: !1,
  dragItemTrans: null,
  resizeWidth: null,
  resizeHeight: null,
  offsetPageX: null,
  offsetPageY: null,
  scrollReactionStatic: "stop",
  scrollReactionTimer: null,
  isLeftMousedown: !1,
  mouseDownElClassName: null,
  mouseSpeed: {
    timestamp: 0,
    endX: 0,
    endY: 0
  },
  slidePageOffsetInfo: {
    offsetTop: 0,
    offsetLeft: 0,
    newestPageX: 0,
    newestPageY: 0
  },
  isWindowResize: !0,
  deviceEventMode: "mouse",
  allowTouchMoveItem: !1,
  timeOutEvent: null,
  nestingMountPointList: []
}), u(N, "ItemStore", {});
const r = N.store, se = class {
  static startEventFromItem(e) {
  }
  static removeEventFromItem(e) {
  }
  static startEventFromContainer(e) {
  }
  static removeEventFromContainer(e) {
  }
  static startGlobalEvent() {
    document.addEventListener("mousedown", R.container.touchstartOrMousedown), document.addEventListener("touchstart", R.container.touchstartOrMousedown, { passive: !1 }), document.addEventListener("mousemove", R.container.touchmoveOrMousemove), document.addEventListener("touchmove", R.container.touchmoveOrMousemove, { passive: !1 }), document.addEventListener("mouseup", R.container.touchendOrMouseup), document.addEventListener("touchend", R.container.touchendOrMouseup, { passive: !1 }), document.addEventListener("mouseleave", g.windowResize.setResizeFlag), document.addEventListener("mouseenter", g.windowResize.removeResizeFlag);
  }
  static removeGlobalEvent() {
    document.removeEventListener("mousedown", R.container.touchstartOrMousedown), document.removeEventListener("touchstart", R.container.touchstartOrMousedown), document.removeEventListener("mousemove", R.container.touchmoveOrMousemove), document.removeEventListener("touchmove", R.container.touchmoveOrMousemove), document.removeEventListener("mouseup", R.container.touchendOrMouseup), document.removeEventListener("touchend", R.container.touchendOrMouseup), document.removeEventListener("mouseleave", g.windowResize.setResizeFlag), document.removeEventListener("mouseenter", g.windowResize.removeResizeFlag);
  }
  static startEvent(e = null, t = null) {
    r.editItemNum === 0 && se.startGlobalEvent();
  }
  static removeEvent(e = null, t = null) {
    t && !t.draggable && t.resize, r.editItemNum === 0 && se.removeGlobalEvent();
  }
};
let D = se;
u(D, "_eventEntrustFunctor", {
  itemResize: {
    doResize: W((e) => {
      const t = r.mousedownEvent, n = r.isLeftMousedown, i = r.fromItem;
      if (i === null || t === null || !n)
        return;
      const o = i.container;
      r.cloneElement === null && (r.cloneElement = i.element.cloneNode(!0), r.cloneElement.classList.add("grid-clone-el", "grid-resizing-clone-el"), r.cloneElement && r.fromContainer.contentElement.appendChild(r.cloneElement), i.updateStyle({ transition: "none" }, r.cloneElement), i.addClass("grid-resizing-source-el"));
      const l = i.container.contentElement.getBoundingClientRect();
      let s = e.pageX - l.left - window.scrollX - i.offsetLeft(), a = e.pageY - l.top - window.scrollY - i.offsetTop();
      const m = {
        w: Math.ceil(s / (i.size[0] + i.margin[0])),
        h: Math.ceil(a / (i.size[1] + i.margin[1]))
      };
      m.w < 1 && (m.w = 1), m.h < 1 && (m.h = 1);
      const h = ({ w: y, h: w }) => {
        const p = i.pos;
        return i.resizeOut && y + p.x > o.col && (y = o.col - p.x + 1), y < p.minW && (y = p.minW), y > p.maxW && p.maxW !== 1 / 0 && (y = p.maxW), i.resizeOut && w + p.y > o.row && (w = o.row - p.y + 1), w < p.minH && (w = p.minH), w > p.maxH && p.maxH !== 1 / 0 && (w = p.maxH), {
          w: y,
          h: w
        };
      }, d = () => (s > i.maxWidth() && (s = i.maxWidth()), a > i.maxHeight() && (a = i.maxHeight()), s < i.minWidth() && (s = i.minWidth()), a < i.minHeight() && (a = i.minHeight()), {
        width: s,
        height: a
      });
      let f = h(m);
      if (f = (({ w: y, h: w }) => {
        const p = d(), b = i.container.engine.findStaticBlankMaxMatrixFromItem(i), S = {};
        return y > b.minW && w > b.minH ? !1 : (b.maxW >= y ? (S.width = p.width + "px", i.pos.w = y) : y = i.pos.w, b.maxH >= w ? (S.height = p.height + "px", i.pos.h = w) : w = i.pos.h, Object.keys(S).length > 0 && i.updateStyle(S, r.cloneElement), {
          w: y,
          h: w
        });
      })(f), i.__temp__.resized || (i.__temp__.resized = { w: 1, h: 1 }), i.__temp__.resized.w !== m.w || i.__temp__.resized.h !== m.h) {
        if (!f)
          return;
        i.__temp__.resized = f, typeof i._VueEvents.vueItemResizing == "function" && i._VueEvents.vueItemResizing(i, f.w, f.h), i.container.eventManager._callback_("itemResizing", f.w, f.h, i), r == null || r.fromContainer.updateLayout([i]), i.updateStyle(i._genLimitSizeStyle()), i.container.updateContainerStyleSize();
      }
    }, 15),
    mouseup: (e) => {
      const t = r.fromItem;
      t !== null && (t.container, t.__temp__.clientWidth = t.nowWidth(), t.__temp__.clientHeight = t.nowHeight(), r.isLeftMousedown = !1, t.updateStyle(t._genItemStyle()));
    }
  },
  check: {
    resizeOrDrag: (e) => {
      var n, i;
      if (!!H(e)) {
        if (((n = r.fromItem) == null ? void 0 : n.draggable) && r.dragOrResize === "drag")
          return r.isDragging = !0, r.isResizing = !1, "drag";
        if (((i = r.fromItem) == null ? void 0 : i.resize) && r.dragOrResize === "resize")
          return r.isResizing = !0, r.isDragging = !1, "resize";
        if (r.dragOrResize === "slidePage")
          return "slidePage";
      }
    }
  },
  cursor: {
    cursor: "notFound",
    removeAllCursors: () => {
      document.body.classList.forEach((e) => {
        e.includes("grid-cursor") && document.body.classList.remove(e);
      });
    },
    default: function() {
      this.removeAllCursors(), document.body.classList.add("grid-cursor-default"), this.cursor = "default";
    },
    inContainer: function() {
      this.removeAllCursors(), document.body.classList.add("grid-cursor-in-container"), this.cursor = "in-container";
    },
    mousedown: function() {
      this.removeAllCursors(), document.body.classList.add("grid-cursor-mousedown"), this.cursor = "mousedown";
    },
    notDrop: function() {
      this.removeAllCursors(), document.body.classList.add("grid-cursor-no-drop"), this.cursor = "no-drop";
    },
    staticItemNoDrop: function() {
      this.removeAllCursors(), document.body.classList.add("grid-cursor-static-item"), this.cursor = "static-no-drop";
    },
    dragToItemNoDrop: function() {
      this.removeAllCursors(), document.body.classList.add("grid-cursor-drag-to-item"), this.cursor = "drag-to-item-no-drop";
    },
    itemClose: function() {
      this.removeAllCursors(), document.body.classList.add("grid-cursor-item-close"), this.cursor = "item-close";
    },
    itemResize: function() {
      this.removeAllCursors(), document.body.classList.add("grid-cursor-item-resize"), this.cursor = "item-resize";
    },
    removeAllCursor: function() {
      this.removeAllCursors(), this.cursor = "notFound";
    }
  },
  prevent: {
    default: (e) => e.preventDefault(),
    false: (e) => !1,
    contextmenu: (e) => e.preventDefault()
  },
  windowResize: {
    setResizeFlag: () => r.isWindowResize = !0,
    removeResizeFlag: () => r.isWindowResize = !1
  },
  moveOuterContainer: {
    leaveToEnter: function(e, t) {
      if (!r.isDragging || !e || !t)
        return;
      let n = r.fromItem, i = r.moveItem, o = r.moveItem !== null ? i : n;
      if (this.mouseleave(null, e), o.container === t) {
        r.fromContainer = t;
        return;
      }
      t.isNesting && (t.parentItem === o || t.parentItem.element === o.element) || (t.__ownTemp__.nestingEnterBlankUnLock = !0, this.mouseenter(null, t));
    },
    mouseenter: function(e, t = null) {
      !t && e.target._isGridContainer_ && (e.preventDefault(), t = e.target._gridContainer_);
      let n = r.fromItem;
      const i = r.moveItem;
      let o = r.moveItem !== null ? i : n;
      if (r.isLeftMousedown) {
        if (o && o.container !== t)
          M.run({
            func: () => {
              t.eventManager._callback_("enterContainerArea", t, r.exchangeItems.new), r.exchangeItems.new = null, r.exchangeItems.old = null;
            },
            rule: () => r.exchangeItems.new,
            intervalTime: 2,
            timeout: 200
          });
        else if (t.eventManager._callback_("enterContainerArea", t, o), o && o.container === t)
          return;
      }
      t.__ownTemp__.firstEnterUnLock = !0, r.moveContainer = t;
    },
    mouseleave: function(e, t = null) {
      let n = r.fromItem, i = r.moveItem, o = r.moveItem !== null ? i : n;
      t.__ownTemp__.firstEnterUnLock = !1, t.__ownTemp__.nestingEnterBlankUnLock = !1, r.isLeftMousedown && t.eventManager._callback_("leaveContainerArea", t, o);
    }
  },
  itemDrag: {
    mousemoveExchange: (e, t = null) => {
      let n = r.fromItem;
      const i = r.moveItem;
      if (!r.isDragging || n === null || !e || !r.isLeftMousedown)
        return;
      let o = r.moveItem !== null ? i : n;
      if (!(!e.exchange || !n.container.exchange || !o.container.exchange || !o.exchange))
        try {
          o.pos.el = null;
          let l = n.element;
          const s = new ne({
            pos: o.pos,
            size: e.size,
            margin: e.margin,
            el: l,
            name: o.name,
            type: o.type,
            draggable: o.draggable,
            resize: o.resize,
            close: o.close,
            transition: o.transition,
            static: o.static,
            follow: o.follow,
            dragOut: o.dragOut,
            resizeOut: o.resizeOut,
            className: o.className,
            dragIgnoreEls: o.dragIgnoreEls,
            dragAllowEls: o.dragAllowEls
          }), a = n.container.eventManager._callback_("crossContainerExchange", o, s);
          if (a === !1 || a === null)
            return;
          const m = (f) => {
            typeof t == "function" && t(f);
          }, h = () => {
            e._VueEvents.vueCrossContainerExchange(s, r, (f) => {
              o.unmount(), o.remove(), m(f), e && (o !== f && !o.container.responsive ? o.container.engine.updateLayout([o]) : o.container.engine.updateLayout(!0));
            });
          }, d = () => {
            e.responsive ? s.pos.autoOnce = !0 : e.responsive || (s.pos.autoOnce = !1), e.add(s), o.unmount(), o.remove(), e && (s.container.responsive ? s.container.engine.updateLayout(!0) : s.container.engine.updateLayout([s]), o !== s && !o.container.responsive ? o.container.engine.updateLayout([o]) : o.container.engine.updateLayout(!0)), s.mount(), r.moveItem = s, r.fromItem = s, r.exchangeItems.old = o, r.exchangeItems.new = s, m(s);
          };
          e.__ownTemp__.firstEnterUnLock = !1, e.__ownTemp__.nestingEnterBlankUnLock = !1, e.platform === "vue" ? h() : d();
        } catch (l) {
          console.error("\u8DE8\u5BB9\u5668Item\u79FB\u52A8\u51FA\u9519", l);
        }
    },
    mousemoveFromItemChange: W((e) => {
      if (e.stopPropagation(), !r.isDragging)
        return;
      let t = r.fromItem, n = $(e);
      n && (r.toItem = n);
      const i = r.moveItem, o = r.mousedownEvent;
      if (t === null || o === null || !r.isLeftMousedown)
        return;
      let l = r.moveItem !== null ? i : t, s = l.container, a = null;
      if (l.exchange && (a = H(e), a && (s = a), l.container !== a && s.parentItem && s.parentItem === l) || !s.__ownTemp__.firstEnterUnLock && l.container && a && l.container !== a && (l.container.childContainer.length > 0 || a.childContainer.length > 0))
        return;
      const m = r.mousedownItemOffsetLeft * (s.size[0] / r.fromContainer.size[0]), h = r.mousedownItemOffsetTop * (s.size[1] / r.fromContainer.size[1]), d = s.contentElement.getBoundingClientRect(), f = e.pageX - m - (window.scrollX + d.left), _ = e.pageY - h - (window.scrollY + d.top);
      if (l.container.followScroll) {
        const x = s.contentElement.parentElement.getBoundingClientRect(), E = s.scrollSpeedX ? s.scrollSpeedX : Math.round(x.width / 20), L = s.scrollSpeedY ? s.scrollSpeedY : Math.round(x.height / 20), v = (P, F) => {
          const k = l.container.eventManager._callback_("autoScroll", P, F, l.container);
          if (k === !1 || k === null)
            return;
          typeof k == "object" && (typeof k.offset == "number" && (F = k.offset), ["X", "Y"].includes(k.direction) && (P = k.direction));
          const V = s ? s.scrollWaitTime : 800;
          r.scrollReactionStatic === "stop" && (r.scrollReactionStatic = "wait", r.scrollReactionTimer = setTimeout(() => {
            r.scrollReactionStatic = "scroll", clearTimeout(r.scrollReactionTimer);
          }, V)), P === "X" && r.scrollReactionStatic === "scroll" && (s.contentElement.parentElement.scrollLeft += F), P === "Y" && r.scrollReactionStatic === "scroll" && (s.contentElement.parentElement.scrollTop += F);
        };
        let z = !1, O = !1;
        e.pageX - window.scrollX - x.left < x.width * 0.25 ? v("X", -E) : e.pageX - window.scrollX - x.left > x.width * 0.75 ? v("X", E) : z = !0, e.pageY - window.scrollY - x.top < x.height * 0.25 ? v("Y", -L) : e.pageY - window.scrollY - x.top > x.height * 0.75 ? v("Y", L) : O = !0, z && O && (r.scrollReactionStatic = "stop", clearTimeout(r.scrollReactionTimer));
      }
      const y = (I) => {
        const x = I / (s.size[0] + s.margin[0]);
        return x + l.pos.w >= s.containerW ? s.containerW - l.pos.w + 1 : Math.round(x) + 1;
      }, w = (I) => {
        const x = I / (s.size[1] + s.margin[1]);
        return x + l.pos.h >= s.containerH ? s.containerH - l.pos.h + 1 : Math.round(x) + 1;
      };
      let p = y(f), b = w(_);
      p < 1 && (p = 1), b < 1 && (b = 1), l.container.eventManager._callback_("itemMoving", p, b, l);
      const S = () => {
        if (l === n)
          return;
        let I, x, E = Date.now();
        x = e.screenX, I = e.screenY;
        const L = () => {
          let C = E - r.mouseSpeed.timestamp, U = Math.abs(x - r.mouseSpeed.endX), Z = Math.abs(I - r.mouseSpeed.endY), ye = U > Z ? U : Z, Ae = Math.round(ye / C * 1e3);
          return r.mouseSpeed.endX = x, r.mouseSpeed.endY = I, r.mouseSpeed.timestamp = E, { distance: ye, speed: Ae };
        };
        if (!s.__ownTemp__.firstEnterUnLock) {
          const { distance: C, speed: U } = L();
          if (r.deviceEventMode === "mouse" && n && n.pos.w > 2 && n.pos.h > 2) {
            if (s.size[0] < 30 || s.size[1] < 30) {
              if (C < 3)
                return;
            } else if (s.size[0] < 60 || s.size[1] < 60) {
              if (C < 7)
                return;
            } else if (C < 10 || U < 10)
              return;
            if (l === null)
              return;
          }
        }
        const v = {
          x: p < 1 ? 1 : p,
          y: b < 1 ? 1 : b,
          w: l.pos.w,
          h: l.pos.h
        };
        let z = !1;
        const O = () => {
          if (!l.follow)
            return;
          const C = s.engine.findCoverItemFromPosition(v.x, v.y, v.w, v.h);
          C.length > 0 ? n = C.filter((Z) => l !== Z)[0] : z = !0;
        }, P = () => {
          const C = s.engine.findResponsiveItemFromPosition(v.x, v.y, v.w, v.h);
          !C || (n = C);
        };
        if (s.__ownTemp__.firstEnterUnLock ? O() : l.follow ? n ? O() : P() : O(), z && n && n.nested && (n = null), s.__ownTemp__.firstEnterUnLock) {
          if (!z && !n)
            return;
          if (l.pos.nextStaticPos = new te(l.pos), l.pos.nextStaticPos.x = v.x, l.pos.nextStaticPos.y = v.y, l.pos.autoOnce = !0, n) {
            if (r.fromItem.container.parentItem === n || l.container === n.container)
              return;
            g.itemDrag.mousemoveExchange(s, (C) => {
              s.engine.move(C, n.i);
            });
          } else
            g.itemDrag.mousemoveExchange(s);
          r.dragContainer = s;
          return;
        }
        if (!n)
          return;
        const F = l.element.getBoundingClientRect(), k = Math.abs(e.pageX - F.left - r.mousedownItemOffsetLeft) / n.element.clientWidth, V = Math.abs(e.pageY - F.top - r.mousedownItemOffsetTop) / n.element.clientHeight, Oe = k > V;
        if (Math.abs(k - V) < s.sensitivity || s.__ownTemp__.exchangeLock === !0)
          return;
        const pe = 3, J = s.__ownTemp__.beforeOverItems;
        let ge = 0;
        for (let C = 0; C < J.length && !(C >= 3); C++)
          J[C] === n && ge++;
        if (ge >= pe) {
          s.__ownTemp__.exchangeLock = !0;
          let C = setTimeout(() => {
            s.__ownTemp__.exchangeLock = !1, clearTimeout(C), C = null;
          }, 200);
        } else if (J.length < pe && n.draggable && n.transition && n.transition.time) {
          s.__ownTemp__.exchangeLock = !0;
          let C = setTimeout(() => {
            s.__ownTemp__.exchangeLock = !1, clearTimeout(C), C = null;
          }, n.transition.time);
        }
        if (l !== n)
          s.__ownTemp__.beforeOverItems.unshift(n), J.length > 20 && s.__ownTemp__.beforeOverItems.pop();
        else
          return !1;
        const _e = l.container.eventManager._callback_("itemExchange", t, n);
        _e === !1 || _e === null || (s.responseMode === "default" ? Oe ? (s.engine.sortResponsiveItem(), s.engine.move(l, n.i)) : s.engine.exchange(l, n) : s.responseMode === "stream" ? (s.engine.sortResponsiveItem(), s.engine.move(l, n.i)) : s.responseMode === "exchange" && s.engine.exchange(l, n), s.engine.updateLayout(!0));
      }, B = () => {
        if (!l.follow && !H(e))
          return;
        l.pos.nextStaticPos = new te(l.pos), l.pos.nextStaticPos.x = p < 1 ? 1 : p, l.pos.nextStaticPos.y = b < 1 ? 1 : b;
        let I = s.engine.findCoverItemFromPosition(
          l.pos.nextStaticPos.x,
          l.pos.nextStaticPos.y,
          l.pos.w,
          l.pos.h
        );
        I.length > 0 && (I = I.filter((x) => l !== x)), I.length === 0 ? (s.__ownTemp__.firstEnterUnLock ? (g.itemDrag.mousemoveExchange(s), r.dragContainer = s) : (l.pos.x !== l.pos.nextStaticPos.x || l.pos.y !== l.pos.nextStaticPos.y) && (l.pos.x = l.pos.nextStaticPos.x, l.pos.y = l.pos.nextStaticPos.y, l.pos.nextStaticPos = null, s.engine.updateLayout([l])), a && g.cursor.cursor !== "mousedown" && g.cursor.mousedown(e)) : l.pos.nextStaticPos = null;
      };
      M.run(() => {
        const I = Object.assign({}, l.pos);
        if (s.responsive ? S() : B(), I.x !== l.pos.x || I.y !== l.pos.y) {
          const x = l._VueEvents.vueItemMovePositionChange;
          typeof x == "function" && x(I.x, I.y, l.pos.x, l.pos.y), l.container.eventManager._callback_("itemMovePositionChange", I.x, I.y, l.pos.x, l.pos.y);
        }
      });
    }, 36),
    mousemoveFromClone: (e) => {
      const t = r.mousedownEvent, n = r.fromItem, i = r.moveItem;
      if (t === null || n === null)
        return;
      let o = r.moveItem !== null ? i : n;
      const l = H(e);
      o.__temp__.dragging = !0, r.cloneElement === null ? (r.cloneElement = o.element.cloneNode(!0), r.cloneElement.classList.add("grid-clone-el", "grid-dragging-clone-el"), document.body.appendChild(r.cloneElement), o.addClass("grid-dragging-source-el"), o.updateStyle({
        pointerEvents: "none",
        transitionProperty: "none",
        transitionDuration: "none"
      }, r.cloneElement)) : l && l.__ownTemp__.firstEnterUnLock && M.run({
        func: () => {
          const m = r.fromItem, h = "grid-dragging-source-el";
          m.hasClass(h) || m.addClass(h);
        },
        rule: () => {
          var m;
          return l === ((m = r.fromItem) == null ? void 0 : m.container);
        },
        intervalTime: 2,
        timeout: 200
      });
      let s = e.pageX - r.mousedownItemOffsetLeft, a = e.pageY - r.mousedownItemOffsetTop;
      if (!o.dragOut) {
        const m = l.contentElement.getBoundingClientRect(), h = window.scrollX + m.left, d = window.scrollY + m.top, f = window.scrollX + m.left + l.contentElement.clientWidth - o.nowWidth(), _ = window.scrollY + m.top + l.contentElement.clientHeight - o.nowHeight();
        s < h && (s = h), s > f && (s = f), a < d && (a = d), a > _ && (a = _);
      }
      o.updateStyle({
        left: s + "px",
        top: a + "px"
      }, r.cloneElement);
    }
  }
}), u(D, "_eventPerformer", {
  item: {
    mouseenter: (e) => {
      if (e.stopPropagation(), !!H(e) && (e.target._gridItem_ && (r.toItem = $(e)), r.toItem === null))
        return !1;
    }
  },
  other: {
    updateSlidePageInfo: W((e, t) => {
      r.slidePageOffsetInfo.newestPageX = e, r.slidePageOffsetInfo.newestPageY = t;
    }),
    slidePage: (e) => {
      const t = H(e);
      if (!t || !t.slidePage)
        return;
      const n = t.element;
      let i = e.pageX - r.mousedownEvent.pageX, o = e.pageY - r.mousedownEvent.pageY;
      const l = r.slidePageOffsetInfo.offsetLeft - i, s = r.slidePageOffsetInfo.offsetTop - o;
      l >= 0 && (n.scrollLeft = l), s >= 0 && (n.scrollTop = s), R.other.updateSlidePageInfo(e.pageX, e.pageY);
    }
  },
  container: {
    mousedown: (e) => {
      var i;
      if (r.isDragging || r.isResizing)
        return;
      const t = H(e);
      if (!t || (r.fromItem = $(e), !t && !r.fromItem))
        return;
      r.fromItem && (r == null ? void 0 : r.fromItem.container) === t && !r.fromItem.static ? g.cursor.mousedown() : t && (!r.fromItem || (r == null ? void 0 : r.fromItem.container) !== t) && !e.touches && (g.cursor.mousedown(), r.slidePageOffsetInfo = {
        offsetTop: t.element.scrollTop,
        offsetLeft: t.element.scrollLeft,
        newestPageX: 0,
        newestPageY: 0
      }, r.dragOrResize = "slidePage");
      const n = e.target.className;
      if (r.mouseDownElClassName = n, !n.includes("grid-clone-el") && !n.includes("grid-item-close-btn")) {
        if (n.includes("grid-item-resizable-handle"))
          r.dragOrResize = "resize", r.fromItem && (r.fromItem.__temp__.resizeLock = !0);
        else if (r.fromItem && r.dragOrResize !== "slidePage" || r.fromItem && r.fromItem.draggable) {
          if (r.fromItem.static)
            return;
          const o = r.fromItem;
          if ((o.dragIgnoreEls || []).length > 0) {
            let s = !0;
            for (let a = 0; a < o.dragIgnoreEls.length; a++) {
              const m = o.dragIgnoreEls[a];
              if (m instanceof Element)
                e.target === m && (s = !1);
              else if (typeof m == "string") {
                const h = o.element.querySelectorAll(m);
                Array.from(h).forEach((d) => {
                  e.path.includes(d) && (s = !1);
                });
              }
              if (s === !1)
                return;
            }
          }
          if ((o.dragAllowEls || []).length > 0) {
            let s = !1;
            for (let a = 0; a < o.dragAllowEls.length; a++) {
              const m = o.dragAllowEls[a];
              if (m instanceof Element) {
                if (e.target === m) {
                  s = !0;
                  break;
                }
              } else if (typeof m == "string") {
                const h = o.element.querySelectorAll(m);
                Array.from(h).forEach((d) => {
                  e.path.includes(d) && (s = !0);
                });
              }
            }
            if (s === !1)
              return;
          }
          if (r.dragOrResize = "drag", r.fromItem.__temp__.dragging)
            return;
          const l = r.fromItem.element.getBoundingClientRect();
          r.mousedownItemOffsetLeft = e.pageX - (l.left + window.scrollX), r.mousedownItemOffsetTop = e.pageY - (l.top + window.scrollY);
        }
        r.isLeftMousedown = !0, r.mousedownEvent = e, r.fromContainer = ((i = r == null ? void 0 : r.fromItem) == null ? void 0 : i.container) || t, g.check.resizeOrDrag(e), r.fromItem && (r.fromItem.__temp__.clientWidth = r.fromItem.nowWidth(), r.fromItem.__temp__.clientHeight = r.fromItem.nowHeight(), r.offsetPageX = r.fromItem.offsetLeft(), r.offsetPageY = r.fromItem.offsetTop());
      }
    },
    mousemove: W((e) => {
      const t = Ge(e), n = Ee(t), i = $(e);
      if (r.isLeftMousedown) {
        if (r.beforeContainerArea = r.currentContainerArea, r.currentContainerArea = t || null, r.beforeContainer = r.currentContainer, r.currentContainer = n || null, r.currentContainerArea !== null && r.beforeContainerArea !== null ? r.currentContainerArea !== r.beforeContainerArea && g.moveOuterContainer.leaveToEnter(r.beforeContainer, r.currentContainer) : (r.currentContainerArea !== null || r.beforeContainerArea !== null) && (r.beforeContainerArea === null && g.moveOuterContainer.mouseenter(null, r.currentContainer), r.currentContainerArea === null && g.moveOuterContainer.mouseleave(null, r.beforeContainer)), r.dragOrResize === "slidePage") {
          R.other.slidePage(e);
          return;
        }
        const o = () => {
          r.moveItem || r.fromItem, n ? n && (i ? i.static && g.cursor.cursor !== "drag-to-item-no-drop" && g.cursor.dragToItemNoDrop() : !i && n.responsive && g.cursor.cursor !== "mousedown" && g.cursor.mousedown()) : g.cursor.cursor !== "no-drop" && g.cursor.notDrop();
        };
        r.isDragging ? (g.itemDrag.mousemoveFromClone(e), o()) : r.isResizing && g.itemResize.doResize(e);
      } else if (i) {
        const o = e.target.classList;
        o.contains("grid-item-close-btn") ? g.cursor.cursor !== "item-close" && g.cursor.itemClose() : o.contains("grid-item-resizable-handle") ? g.cursor.cursor !== "item-resize" && g.cursor.itemResize() : i.static && n ? g.cursor.cursor !== "static-no-drop" && g.cursor.staticItemNoDrop() : g.cursor.cursor !== "in-container" && g.cursor.inContainer();
      } else
        H(e) ? g.cursor.cursor !== "in-container" && g.cursor.inContainer() : g.cursor.cursor !== "default" && g.cursor.default();
    }, 12),
    mouseup: (e) => {
      const t = H(e);
      r.isResizing && g.itemResize.mouseup(e), t && g.cursor.cursor !== "in-container" && g.cursor.inContainer();
      const n = r.fromItem, i = r.moveItem ? r.moveItem : r.fromItem;
      if (r.cloneElement !== null) {
        let a = null;
        const m = document.querySelectorAll(".grid-clone-el");
        for (let h = 0; h < m.length; h++) {
          let f = function() {
            i.removeClass("grid-dragging-source-el", "grid-resizing-source-el");
            try {
              d.parentNode.removeChild(d);
            } catch {
            }
            i.__temp__.dragging = !1, n.__temp__.dragging = !1, clearTimeout(a), a = null;
          };
          const d = m[h];
          if (i.transition) {
            const _ = i.container.contentElement.getBoundingClientRect();
            if (r.isDragging) {
              let y = window.scrollX + _.left + i.offsetLeft(), w = window.scrollY + _.top + i.offsetTop();
              i.updateStyle({
                transitionProperty: `${i.transition.field}`,
                transitionDuration: `${i.transition.time}ms`,
                width: `${i.nowWidth()}px`,
                height: `${i.nowHeight()}px`,
                left: `${y}px`,
                top: `${w}px`
              }, d);
            } else
              r.isResizing && i.updateStyle({
                transitionProperty: `${i.transition.field}`,
                transitionDuration: `${i.transition.time}ms`,
                width: `${i.nowWidth()}px`,
                height: `${i.nowHeight()}px`,
                left: `${i.offsetLeft()}px`,
                top: `${i.offsetTop()}px`
              }, d);
          }
          i.transition ? a = setTimeout(f, i.transition.time) : f();
        }
      }
      const o = document.querySelectorAll(".grid-item-mask");
      for (let a = 0; a < o.length; a++) {
        const m = o[a];
        m.parentElement.removeChild(m);
      }
      (t || n && n.container.responsive) && (t || n.container).engine.sortResponsiveItem();
      const l = r.mouseDownElClassName;
      if (l && l.includes("grid-item-close-btn") && (e.touchTarget ? e.touchTarget : e.target).classList.contains("grid-item-close-btn")) {
        const m = $(e);
        if (m === r.fromItem) {
          const h = m.container.eventManager._callback_("itemClosing", m);
          h === null || h === !1 || (m.remove(!0), m.container.engine.updateLayout(!0), m.container.eventManager._callback_("itemClosed", m));
        }
      }
      const s = r.moveContainer ? r.moveContainer : r.fromContainer;
      if (s && (s.__ownTemp__.firstEnterUnLock = !1, s.__ownTemp__.exchangeLock = !1, s.__ownTemp__.beforeOverItems = [], s.__ownTemp__.moveCount = 0, r.fromContainer && s !== r.fromContainer && (r.fromContainer.__ownTemp__.firstEnterUnLock = !1)), n && (n.container.engine.updateLayout(!0), n.container.childContainer.forEach((h) => {
        h.nestingItem === n && h.container.engine.updateLayout(!0);
      })), n && i.container !== n.container && (i == null || i.container.engine.updateLayout(!0)), i && (r.isDragging && i.container.eventManager._callback_("itemMoved", i.pos.x, i.pos.y, i), r.isResizing && i.container.eventManager._callback_("itemResized", i.pos.w, i.pos.h, i)), r.isLeftMousedown && r.dragOrResize === "slidePage") {
        const a = r.slidePageOffsetInfo, m = a.newestPageX - e.pageX, h = a.newestPageY - e.pageY;
        let d = 500;
        const f = r.fromContainer;
        if (f.slidePage && (h >= 20 || m >= 20)) {
          let _ = setInterval(() => {
            d -= 20, f.element.scrollTop += parseInt((h / 100 * d / 30 || 0).toString()), f.element.scrollLeft += parseInt((m / 100 * d / 30 || 0).toString()), (d <= 0 || r.isLeftMousedown) && (clearInterval(_), _ = null);
          }, 20);
        }
      }
      r.fromItem && (r.fromItem.__temp__.resizeLock = !1), r.fromContainer = null, r.moveContainer = null, r.dragContainer = null, r.beforeContainerArea = null, r.currentContainerArea = null, r.cloneElement = null, r.fromItem = null, r.toItem = null, r.moveItem = null, r.offsetPageX = null, r.offsetPageY = null, r.isDragging = !1, r.isResizing = !1, r.isLeftMousedown = !1, r.dragOrResize = null, r.mousedownEvent = null, r.mousedownItemOffsetLeft = null, r.mousedownItemOffsetTop = null, r.mouseDownElClassName = null, r.exchangeItems = {
        new: null,
        old: null
      };
    },
    touchstartOrMousedown: (e) => {
      if (e = e || window.event, e.touches ? (e.stopPropagation && e.stopPropagation(), r.deviceEventMode = "touch", e = ae(e)) : r.deviceEventMode = "mouse", r.deviceEventMode === "touch") {
        r.allowTouchMoveItem = !1;
        const t = H(e);
        document.addEventListener("contextmenu", g.prevent.contextmenu);
        const n = t ? t.pressTime : 360;
        r.timeOutEvent = setTimeout(() => {
          r.allowTouchMoveItem = !0, R.container.mousemove(e);
          let i = setTimeout(() => {
            document.removeEventListener("contextmenu", g.prevent.contextmenu), clearTimeout(i), i = null;
          }, 600);
          clearTimeout(r.timeOutEvent);
        }, n);
      }
      R.container.mousedown(e);
    },
    touchmoveOrMousemove: (e) => {
      if (e = e || window.event, e.touches) {
        if (r.deviceEventMode = "touch", r.allowTouchMoveItem)
          e.preventDefault && e.preventDefault();
        else {
          clearTimeout(r.timeOutEvent);
          return;
        }
        e = ae(e);
      } else
        r.deviceEventMode = "mouse";
      e.stopPropagation && e.stopPropagation(), g.itemDrag.mousemoveFromItemChange(e), R.container.mousemove(e);
    },
    touchendOrMouseup: (e) => {
      e = e || window.event, e.touches ? (clearTimeout(r.timeOutEvent), r.allowTouchMoveItem = !1, r.deviceEventMode = "touch", e = ae(e), document.removeEventListener("contextmenu", g.prevent.contextmenu)) : r.deviceEventMode = "mouse", R.container.mouseup(e);
    }
  }
});
const g = D._eventEntrustFunctor, R = D._eventPerformer;
class Le {
  constructor() {
    u(this, "element", null);
    u(this, "observer", null);
  }
  updateStyle(e, t = null, n = !0) {
    if (Object.keys(e).length === 0)
      return;
    t = t || this.element;
    let i = "";
    Object.keys(e).forEach((o) => {
      n ? i = `${i} ${qe(o)}:${e[o]}; ` : t.style[o] = e[o];
    }), n && (t.style.cssText = t.style.cssText + ";" + i);
  }
  hasClass(e) {
    return this.element.classList.contains(e);
  }
  addClass(...e) {
    this.element.classList.add(...e);
  }
  removeClass(...e) {
    this.element.classList.remove(...e);
  }
  replaceClass(e, t) {
    this.element.classList.replace(e, t);
  }
  getAttr(e) {
    var t, n;
    return ((n = (t = this == null ? void 0 : this.element) == null ? void 0 : t.attributes) == null ? void 0 : n.getNamedItem(e)) || null;
  }
  addAttr(e) {
    try {
      Object.keys(e).forEach((t) => {
        var i, o;
        const n = document.createAttribute(t);
        n.value = e[t], (o = (i = this == null ? void 0 : this.element) == null ? void 0 : i.attributes) == null || o.setNamedItem(n);
      });
    } catch {
    }
  }
  getDataSet(e = "") {
    return e.replace(" ", "") === "" ? Object.assign({}, this.element.dataset) : this.element.dataset[e];
  }
  removeAttr(e) {
    try {
      typeof e == "string" ? this.element.attributes.removeNamedItem(e) : Array.isArray(e) && e.forEach((t) => {
        this.element.attributes.removeNamedItem(t);
      });
    } catch {
    }
  }
  observe(e, t = 200, n = []) {
    if (this.observer === null) {
      let o = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
      this.observer = new o(W(e, t));
    }
    const i = ["style", "class"].concat(n);
    this.observer.observe(this.element, { attributeFilter: i, attribute: !0, attributeOldValue: !0 });
  }
  unObserve() {
    this.observer.disconnect();
  }
  onResize(e) {
    this.observe((t) => {
      t.forEach((n) => {
        if (n.attributeName === "style") {
          let i = getComputedStyle(this.element).getPropertyValue("width"), o = getComputedStyle(this.element).getPropertyValue("height");
          typeof e == "function" && e.call(e, {
            width: parseInt(i),
            height: parseInt(o)
          });
        }
      });
    }, 500);
  }
  onEvent(e, t, n = null, i = 350) {
    const o = n || this.element;
    e.includes("on") || (e = "on" + e), o[e] || (o[e] = W(t, i));
  }
  addEvent(e, t, n = null, i = {}) {
    let o = 350, l = !1;
    i.throttleTime && (o = i.throttleTime), i.capture && (l = i.capture);
    const s = n || this.element, a = W(t, o);
    return s.addEventListener(e, a, l), a;
  }
  removeEvent(e, t, n = null) {
    (n || this.element).removeEventListener(e, t);
  }
  throttle(e, t) {
    return W(e, t);
  }
}
const ue = N.store;
class ne extends Le {
  constructor(t) {
    super();
    u(this, "el", "");
    u(this, "name", "");
    u(this, "type", null);
    u(this, "follow", !0);
    u(this, "dragOut", !0);
    u(this, "resizeOut", !1);
    u(this, "className", "grid-item");
    u(this, "dragIgnoreEls", []);
    u(this, "dragAllowEls", []);
    u(this, "transition", null);
    u(this, "draggable", null);
    u(this, "resize", null);
    u(this, "close", null);
    u(this, "static", !1);
    u(this, "exchange", !0);
    u(this, "margin", [null, null]);
    u(this, "size", [null, null]);
    u(this, "i", null);
    u(this, "element", null);
    u(this, "container", null);
    u(this, "tagName", "div");
    u(this, "classList", []);
    u(this, "attr", []);
    u(this, "pos", {});
    u(this, "autoOnce", null);
    u(this, "edit", null);
    u(this, "nested", !1);
    u(this, "parentElement", null);
    u(this, "_VueEvents", {});
    u(this, "_mounted", !1);
    u(this, "_resizeTabEl", null);
    u(this, "_closeEl", null);
    u(this, "__temp__", {
      eventRecord: {},
      event: {},
      editNumUsing: !1,
      styleLock: !1,
      maskEl: null,
      height: 0,
      width: 0,
      resizeLock: !1,
      dragging: !1,
      clientWidth: 0,
      clientHeight: 0,
      isDelayLoadAnimation: !1,
      resized: {
        w: 1,
        h: 1
      }
    });
    u(this, "exportConfig", (t = [], n = []) => {
      const i = this, o = {};
      let l = {};
      l = i.pos.export(t), n.includes("x") && delete l.x, n.includes("y") && delete l.y, o.pos = l, Array.from(["static", "draggable", "resize", "close"]).forEach((a) => {
        i[a] !== !1 && (o[a] = i[a]);
      }), Array.from(["follow", "dragOut", "resizeOut", "exchange"]).forEach((a) => {
        i[a] !== !0 && (o[a] = i[a]);
      }), typeof i.name == "string" && (o.name = i.name), typeof i.type == "string" && (o.type = i.type);
      let s = {};
      return i.transition.field !== "top,left,width,height" ? (s.field = i.transition.field, i.transition.time !== 180 && (s.time = i.transition.time), o.transition = s) : i.transition.time !== 180 && (o.transition = i.transition.time), o;
    });
    u(this, "nowWidth", (t) => {
      let n = 0;
      const i = t || (this.pos.tempW ? this.pos.tempW : this.pos.w);
      return i > 1 && (n = (i - 1) * this.margin[0]), i * this.size[0] + n;
    });
    u(this, "nowHeight", (t) => {
      let n = 0;
      const i = t || (this.pos.tempH ? this.pos.tempH : this.pos.h);
      return i > 1 && (n = (i - 1) * this.margin[1]), i * this.size[1] + n;
    });
    u(this, "minHeight", () => {
      let t = 0;
      return this.pos.minH === 1 / 0 ? 1 / 0 : (this.pos.minH > 1 && (t = (this.pos.minH - 1) * this.margin[1]), this.pos.minH * this.size[1] + t);
    });
    u(this, "maxHeight", () => {
      let t = 0;
      return this.pos.maxH === 1 / 0 ? 1 / 0 : (t = (this.pos.maxH - 1) * this.margin[1], this.pos.maxH * this.size[1] + t);
    });
    u(this, "_genItemStyle", () => this.styleLock() ? {} : {
      width: this.nowWidth() + "px",
      height: this.nowHeight() + "px",
      left: this.offsetLeft() + "px",
      top: this.offsetTop() + "px"
    });
    u(this, "_genLimitSizeStyle", () => this.styleLock() ? {} : {
      minWidth: this.minWidth() + "px",
      minHeight: this.minHeight() + "px",
      maxWidth: this.maxWidth() + "px",
      maxHeight: this.maxHeight() + "px"
    });
    t.el instanceof Element && (this.el = t.el, this.element = t.el), this._define(), G(this, t), this.pos = new te(t.pos), this._itemSizeLimitCheck();
  }
  _define() {
    const t = this;
    let n = !1, i = !1, o = !1, l = !1, s = {
      time: 180,
      field: "top,left,width,height"
    };
    Object.defineProperties(this, {
      draggable: {
        configurable: !1,
        get: () => n,
        set(a) {
          if (typeof a == "boolean") {
            if (n === a)
              return;
            n = a, t.edit = n || i || o;
          }
        }
      },
      resize: {
        configurable: !1,
        get: () => i,
        set(a) {
          if (typeof a == "boolean") {
            if (i === a)
              return;
            i = a, t._handleResize(a), t.edit = n || i || o;
          }
        }
      },
      close: {
        configurable: !1,
        get: () => o,
        set(a) {
          if (typeof a == "boolean") {
            if (o === a)
              return;
            o = a, t._closeBtn(a), t.edit = n || i || o;
          }
        }
      },
      edit: {
        configurable: !1,
        get: () => l,
        set(a) {
          if (typeof a == "boolean") {
            if (l === a)
              return;
            l = a, t._edit(l);
          }
        }
      },
      transition: {
        configurable: !1,
        get: () => s,
        set(a) {
          a === !1 && (s.time = 0), typeof a == "number" && (s.time = a), typeof a == "object" && (a.time && a.time !== s.time && (s.time = a.time), a.field && a.field !== s.field && (s.field = a.field)), t.animation(s);
        }
      }
    });
  }
  mount() {
    const t = () => {
      this._mounted || (this.container.platform !== "vue" && (this.element === null && (this.element = document.createElement(this.tagName)), this.container.contentElement.appendChild(this.element)), this.attr = Array.from(this.element.attributes), this.element.classList.add(this.className), this.classList = Array.from(this.element.classList), this.updateStyle(q.gridItem), this.updateStyle(this._genItemStyle()), this.__temp__.w = this.pos.w, this.__temp__.h = this.pos.h, this.element._gridItem_ = this, this.element._isGridItem_ = !0, this._mounted = !0, this.container.eventManager._callback_("itemMounted", this));
    };
    this.container.platform === "vue" ? t() : M.run(t);
  }
  unmount(t = !1) {
    M.run(() => {
      this._mounted ? (this.__temp__.editNumUsing && (this.__temp__.editNumUsing = !1, ue.editItemNum--), this._handleResize(!1), this._closeBtn(!1), this.container.contentElement.removeChild(this.element), this.container.eventManager._callback_("itemUnmounted", this)) : this.container.eventManager._error_("ItemAlreadyRemove", "\u8BE5Item\u5BF9\u5E94\u7684element\u672A\u5728\u6587\u6863\u4E2D\u6302\u8F7D\uFF0C\u53EF\u80FD\u5DF2\u7ECF\u88AB\u79FB\u9664", this);
    }), t && this.remove(), this._mounted = !1;
  }
  remove(t = !1) {
    this.container.engine.remove(this), t && this.unmount();
  }
  _edit(t = !1) {
    this.edit === !0 ? this.__temp__.editNumUsing || (D.startEvent(null, this), this.__temp__.editNumUsing = !0, ue.editItemNum++) : this.edit === !1 && this.__temp__.editNumUsing && (D.removeEvent(null, this), ue.editItemNum--, this.__temp__.editNumUsing = !1);
  }
  animation(t) {
    if (typeof t != "object") {
      console.log("\u53C2\u6570\u5E94\u8BE5\u662F\u5BF9\u8C61\u5F62\u5F0F{time:Number, field:String}");
      return;
    }
    M.run({
      func: () => {
        const n = {};
        t.time > 0 ? (n.transitionProperty = t.field, n.transitionDuration = t.time + "ms", n.transitionTimingFunction = "ease-out") : t.time === 0 && (n.transition = "none"), this.updateStyle(n);
      },
      rule: () => this.__temp__.isDelayLoadAnimation
    }), this.__temp__.isDelayLoadAnimation = !0;
  }
  followStatus(t = !0) {
    this.follow = t;
  }
  updateItemLayout() {
    this.updateStyle(this._genItemStyle());
  }
  offsetLeft() {
    let t = 0;
    return this.pos.x > 1 && (t = (this.pos.x - 1) * this.margin[0]), (this.pos.x - 1) * this.size[0] + t;
  }
  offsetTop() {
    let t = 0;
    return this.pos.y > 1 && (t = (this.pos.y - 1) * this.margin[1]), (this.pos.y - 1) * this.size[1] + t;
  }
  minWidth() {
    let t = 0;
    return this.pos.minW === 1 / 0 ? 1 / 0 : (this.pos.minW > 1 && (t = (this.pos.minW - 1) * this.margin[0]), this.pos.minW * this.size[0] + t);
  }
  maxWidth() {
    let t = 0;
    return this.pos.maxW === 1 / 0 ? 1 / 0 : (t = (this.pos.maxW - 1) * this.margin[0], this.pos.maxW * this.size[0] + t);
  }
  styleLock(t = null) {
    if (t === null)
      return this.__temp__.styleLock;
    if (t === !0)
      return this.__temp__.styleLock = !0;
    if (t === !1)
      return this.__temp__.styleLock = !1;
  }
  _handleResize(t = !1) {
    const n = () => {
      const i = "grid-item-resizable-handle";
      if (t && this._resizeTabEl === null) {
        if (this.element.querySelectorAll("." + i).length > 0)
          return;
        const l = document.createElement("span");
        l.innerHTML = "\u22BF", this.updateStyle(q.gridResizableHandle, l), this.element.appendChild(l), l.classList.add(i), this._resizeTabEl = l;
      } else if (this.element && t === !1)
        for (let o = 0; o < this.element.children.length; o++) {
          const l = this.element.children[o];
          l.className.includes(i) && (this.element.removeChild(l), this._resizeTabEl = null);
        }
    };
    this.element ? n() : M.run(n);
  }
  _closeBtn(t = !1) {
    const n = () => {
      const i = "grid-item-close-btn";
      if (t && this._closeEl === null) {
        const o = document.createElement("div");
        this.updateStyle(q.gridItemCloseBtn, o), this._closeEl = o, o.classList.add(i), this.element.appendChild(o), o.innerHTML = q.gridItemCloseBtn.innerHTML;
      }
      if (this._closeEl !== null && !t)
        for (let o = 0; o < this.element.children.length; o++) {
          const l = this.element.children[o];
          l.className.includes(i) && (this.element.removeChild(l), this._closeEl = null);
        }
    };
    this.element ? n() : M.run(n);
  }
  _mask_(t = !1) {
    if (t) {
      const n = document.createElement("div");
      this.updateStyle({
        backgroundColor: "transparent",
        height: this.element.clientHeight + "px",
        width: this.element.clientWidth + "px",
        position: "absolute",
        left: "0",
        top: "0"
      }, n), this.__temp__.maskEl = n, this.element.appendChild(n), n.classList.add("grid-item-mask");
    }
    if (this.__temp__.maskEl !== null && !t)
      try {
        this.element.removeChild(this.__temp__.maskEl);
      } catch {
      }
  }
  _itemSizeLimitCheck() {
    const t = this.pos;
    let n = t.w, i = t.h;
    t.minW >= t.maxW && t.maxW >= t.w && t.maxW !== 1 / 0 || t.w > t.maxW && t.maxW !== 1 / 0 ? n = t.maxW : t.w < t.minW && (n = t.minW), t.minH >= t.maxH && t.maxH >= t.h && t.maxH !== 1 / 0 || t.h > t.maxH && t.maxH !== 1 / 0 ? i = t.maxH : t.h < t.minH && (i = t.minH), this.pos.w = n, this.pos.h = i;
  }
}
class $e {
  constructor() {
    u(this, "isDebugger", !1);
    u(this, "DebuggerTemp", {});
    u(this, "count", 0);
    u(this, "_mode", "grid");
    u(this, "_layoutMatrix", []);
    u(this, "layoutPositions", []);
    u(this, "col", null);
    u(this, "minRow", null);
    u(this, "maxRow", null);
    u(this, "row", null);
    u(this, "isAutoRow", !1);
    u(this, "iNameHash", "");
    u(this, "addRow", (e = null) => {
      if (!!e) {
        for (let t = 0; t < e; t++)
          this._layoutMatrix.push(new Array(this.col).fill(!1));
        this.row = this._layoutMatrix.length;
      }
    });
    u(this, "addCol", (e = null) => {
      if (!!e) {
        for (let t = 0; t < this._layoutMatrix.length; t++)
          for (let n = 0; n < e; n++)
            this._layoutMatrix[t].push(!1);
        this._layoutMatrix.length > 0 && (this.col = this._layoutMatrix[0].length);
      }
    });
    u(this, "removeOneRow", () => this._layoutMatrix.length === 0 ? (console.log("\u6805\u683C\u5185\u884C\u6570\u5DF2\u7ECF\u4E3A\u7A7A"), !1) : this._layoutMatrix[this._layoutMatrix.length - 1].includes(!0) ? (console.log("\u8BA1\u5212\u5220\u9664\u7684\u6805\u683C\u5185\u5B58\u5728\u7EC4\u4EF6,\u672A\u5220\u9664\u5305\u542B\u7EC4\u4EF6\u7684\u6805\u683C"), !1) : (this._layoutMatrix.pop(), this.row = this._layoutMatrix.length, !0));
    u(this, "removeBlankRow", (e) => {
      for (let t = 0; t < e; t++)
        if (!this.removeOneRow())
          return;
    });
    u(this, "findItem", (e, t = !1) => {
      if (e.w <= 0 || e.h <= 0)
        throw new Error(" w \u6216 h \u662F\u4E00\u4E2A\u6B63\u6574\u6570");
      let n;
      if (t) {
        if (n = this._findBlankPosition(e.w, e.h), n === void 0)
          return null;
        e.i !== void 0 && (n.iName = this.toINameHash(e.i)), n.row = this._layoutMatrix.length;
      } else
        return this.isStaticBlank(e) ? (n = this.itemPosToItemLayout(e), n) : null;
      return t === !1 && this.isOverFlowMatrix(e) ? null : n;
    });
    for (let e = 0; e < 4; e++)
      this.iNameHash = this.iNameHash + String.fromCharCode(Math.floor(Math.random() * 26) + "a".charCodeAt(0));
  }
  len() {
    return this.layoutPositions.length;
  }
  setColNum(e) {
    this.col = e;
  }
  setRowNum(e) {
    this.row = e;
  }
  toINameHash(e) {
    return this.iNameHash + e;
  }
  autoRow(e = !0) {
    this.isAutoRow = e;
  }
  reset() {
    this._layoutMatrix = [], this.layoutPositions = [];
  }
  isOverlap(e) {
  }
  computedNeedRow(e) {
  }
  itemPosToItemLayout(e) {
    return {
      w: e.w,
      h: e.h,
      x: e.x,
      y: e.y,
      xStart: e.x,
      yStart: e.y,
      xEnd: e.x + e.w - 1,
      yEnd: e.y + e.h - 1,
      iName: this.toINameHash(e.i)
    };
  }
  addItem(e) {
    if (this._updateSeatLayout(e), this.isDebugger) {
      const t = this._layoutMatrix.map((n) => n.map((i) => i ? "\u25CF" : "\u25CB"));
      console.log(`[${this.count++}]`, e), console.log("       ", t[0].map((n, i) => i).join("    ")), t.forEach((n, i) => {
        console.log(" " + i, ":", n);
      }), console.log("---------------------------------------------");
    }
  }
  isOverFlowMatrix(e) {
    return e.x + e.w - 1 > this.col || e.y + e.h - 1 > this.row;
  }
  isStaticBlank(e) {
    if (e === null)
      return !1;
    const { xStart: t, yStart: n, xEnd: i, yEnd: o } = this.itemPosToItemLayout(e);
    let l = !0;
    const s = this.toINameHash(e.i), a = e.x + e.w - 1, m = e.y + e.h - 1;
    if (a > this.col || m > this.row)
      return !1;
    for (let h = n - 1; h <= o - 1; h++)
      for (let d = t - 1; d <= i - 1; d++) {
        const f = this._layoutMatrix[h][d];
        if (s.toString() !== f && f !== !1) {
          l = !1;
          break;
        }
      }
    return l;
  }
  _findRowBlank(e = [], t, n, i) {
    let o = 0;
    for (let l = n; l <= i; l++)
      if (e[l] !== !1 ? o = 0 : e[l] === !1 && o++, o === t)
        return {
          success: !0,
          xStart: l + 1 - t,
          xEnd: l,
          xWidth: t
        };
    return { success: !1 };
  }
  _findBlankPosition(e, t) {
    let n = 0, i = this.col - 1, o = 0, l = [], s = 0;
    for (; s++ < 500; ) {
      this._layoutMatrix.length < t + o && this.isAutoRow && this.addRow(t + o - this._layoutMatrix.length);
      let a = !0, m = !1;
      if (!this.col)
        break;
      for (let h = 0; h < t; h++) {
        l = this._layoutMatrix[o + h], this.DebuggerTemp.yPointStart = o;
        let d = this._findRowBlank(l, e, n, i);
        if (d.success === !1) {
          if (a = !1, m || (h = -1, n = i + 1, i = this.col - 1), n > i) {
            m = !0;
            break;
          }
        } else
          d.success === !0 && (a = !0, h === 0 && (n = d.xStart, i = d.xEnd));
      }
      if (a)
        return {
          w: e,
          h: t,
          xStart: n + 1,
          yStart: o + 1,
          xEnd: i + 1,
          yEnd: o + t - 1 + 1,
          x: n + 1,
          y: o + 1,
          col: this.col,
          row: this.row
        };
      n = 0, i = this.col - 1, o++;
    }
  }
  _updateSeatLayout({ xStart: e, yStart: t, xEnd: n, yEnd: i, iName: o }, l = null) {
    o === void 0 && (o = "true");
    let s = l !== null ? l : o.toString();
    for (let a = t - 1; a <= i - 1; a++)
      for (let m = e - 1; m <= n - 1; m++)
        try {
          this.isDebugger ? this._layoutMatrix[a][m] = "__debugger__" : this._layoutMatrix[a][m] = s;
        } catch (h) {
          console.log(h);
        }
  }
}
const Ve = [
  {
    px: 1920,
    col: 12,
    size: [80, 80],
    margin: [10, 10]
  },
  {
    px: 1200,
    col: 10,
    size: [80, 80],
    margin: [10, 10]
  },
  {
    px: 992,
    col: 8,
    size: [80, 80],
    margin: [10, 10]
  },
  {
    px: 768,
    col: 6,
    size: [80, 80],
    margin: [10, 10]
  },
  {
    px: 480,
    col: 4,
    size: [80, 80],
    margin: [10, 10]
  }
];
class Je {
  constructor(e) {
    u(this, "container", null);
    u(this, "customLayout", {});
    u(this, "option", {});
    u(this, "_defaultLayoutConfig", Ve);
    u(this, "computeSmartRowAndCol", (e) => {
      let t = null, n = null;
      return e.length > 0 && e.forEach((i) => {
        i.pos.x + i.pos.w - 1 > t && (t = i.pos.x + i.pos.w - 1), i.pos.y + i.pos.h - 1 > n && (n = i.pos.y + i.pos.h - 1);
      }), { smartCol: t, smartRow: n };
    });
    u(this, "checkLayoutValue", (e) => {
      let { margin: t, size: n } = e;
      return t && (t[0] !== null && (t[0] = t[0] ? parseFloat(t[0].toFixed(1)) : 0, t[1] === null && (t[1] = t[0])), t[1] !== null && (t[1] = t[1] ? parseFloat(t[1].toFixed(1)) : 0, t[0] === null && (t[0] = t[1]))), n && (n[0] !== null && (n[0] = n[0] ? parseFloat(n[0].toFixed(1)) : 0, n[1] === null && (n[1] = n[0])), n[1] !== null && (n[1] = n[1] ? parseFloat(n[1].toFixed(1)) : 0, n[0] === null && (n[0] = n[1]))), e;
    });
    this.option = e;
  }
  setContainer(e) {
    this.container = e;
  }
  initLayoutInfo() {
    const e = this.option;
    let t = [];
    if (Array.isArray(e.layouts))
      t = e.layouts;
    else if (typeof e.layouts == "object")
      t.push(e.layouts);
    else if (e.layouts === !0)
      t = this._defaultLayoutConfig;
    else
      throw new Error("\u8BF7\u4F20\u5165layout\u914D\u7F6E\u4FE1\u606F");
    Array.isArray(t) && t.length > 1 && t.sort((n, i) => {
      if (typeof n.px != "number" && typeof i.px != "number")
        throw new Error("\u4F7F\u7528\u591A\u4E2Alayout\u9884\u8BBE\u5E03\u5C40\u65B9\u6848\u8BF7\u5FC5\u987B\u6307\u5B9A\u5BF9\u5E94\u7684\u50CF\u7D20px,\u5355\u4F4D\u4E3A\u6570\u5B57,\u5047\u8BBEpx=1024\u8868\u793AContainer\u5BBD\u5EA61024\u50CF\u7D20\u4EE5\u4E0B\u6267\u884C\u8BE5\u5E03\u5C40\u65B9\u6848");
      return n.px - i.px;
    }), this.container.layouts = JSON.parse(JSON.stringify(t));
  }
  autoComputeSizeInfo(e, t, n, i, o) {
    if (e) {
      if (n === null && i === null)
        parseInt(e.toString()) === 1 ? (i = 0, n = t / e) : (i = t / (e - 1 + e / o), n = (t - (e - 1) * i) / e);
      else if (n !== null && i === null)
        parseInt(e.toString()) === 1 ? i = 0 : i = (t - e * n) / (e - 1), i <= 0 && (i = 0);
      else if (n === null && i !== null && (parseInt(e.toString()) === 1 && (i = 0), n = (t - (e - 1) * i) / e, n <= 0))
        throw new Error("\u5728margin[*(0 or 1)]\u6216\u5728margin* (X or Y)\u4E3A" + i + "\u7684\u60C5\u51B5\u4E0B,size[*(0 or 1)]\u6216size*(Width or Height)\u7684Item\u4E3B\u4F53\u5BBD\u5EA6\u5DF2\u7ECF\u5C0F\u4E8E0,\u60A8\u53EF\u4EE5\u8C03\u5C0Fmargin\u6216\u8005\u8BBE\u5B9AContainer\u6700\u5C0F\u5BBD\u5EA6\u6216\u8005\u9AD8\u5EA6(css:min-XXX),\u4E14\u4FDD\u8BC1margin*(col||row)\u5927\u4E8E\u6700\u5C0F\u5BBD\u5EA6");
    } else
      e === null && (i === null && n !== null ? t <= n ? (i = 0, e = 1) : (e = Math.floor(t / n), i = (t - n * e) / e) : i !== null && n !== null ? t <= n ? (i = 0, e = 1) : e = Math.floor((t + i) / (i + n)) : i !== null && n === null && (n = i / o, t <= n ? e = 1 : e = Math.floor((t + i) / (i + n))));
    return {
      direction: e,
      size: n,
      margin: i
    };
  }
  genLayoutConfig(e = null, t = null) {
    var L, v;
    let n = {}, i = {};
    e = e || ((L = this.container.element) == null ? void 0 : L.clientWidth), t = t || ((v = this.container.element) == null ? void 0 : v.clientHeight);
    const o = this.container.layouts.sort((z, O) => z.px - O.px);
    for (let z = 0; z < o.length && (i = o[z], Array.isArray(i.data) || (i.data = []), o.length !== 1); z++)
      if (!(i.px < e))
        break;
    if (e === 0 && !n.col)
      throw new Error("\u8BF7\u5728layout\u4E2D\u4F20\u5165col\u7684\u503C\u6216\u8005\u4E3AContainer\u8BBE\u7F6E\u4E00\u4E2A\u521D\u59CB\u5BBD\u5EA6");
    n = Object.assign(Y(this.option.global), Y(i));
    let {
      col: l = null,
      row: s = null,
      ratioCol: a = this.container.ratioCol,
      ratioRow: m = this.container.ratioRow,
      size: h = [null, null],
      margin: d = [null, null],
      sizeWidth: f,
      sizeHeight: _,
      marginX: y,
      marginY: w
    } = n;
    y && (d[0] = y), w && (d[1] = w), f && (h[0] = f), _ && (h[1] = _);
    const p = Array.from(d), b = Array.from(h), S = this.computeSmartRowAndCol(this.container.engine.items);
    !l && !d[0] && !h[0] && (l = S.smartCol), (!s || n.responsive) && (s = S.smartRow), !n.responsive && !l && this.container.col && this.container.col !== 1 && (l = this.container.col);
    const B = this.autoComputeSizeInfo(l, e, h[0], d[0], a);
    d[0] = B.margin, h[0] = B.size, !n.responsive && !s && this.container.row && this.container.row !== 1 && (s = this.container.row);
    const I = this.autoComputeSizeInfo(s, t, h[1], d[1], m);
    d[1] = I.margin, h[1] = I.size, (p[0] !== null || p[1] !== null) && (n.margin = d), (b[0] !== null || b[1] !== null) && (n.size = h);
    const x = this.option.global || {};
    for (const z in n)
      (x !== void 0 || i[z] !== void 0) && (n[z] = n[z]);
    this.container.layout = i, this.container.useLayout = this.customLayout = this.checkLayoutValue(n);
    const E = this.checkLayoutValue({
      ...this.customLayout,
      margin: d,
      size: h
    });
    return {
      layout: i,
      global: this.option.global,
      customLayout: n,
      useLayout: E
    };
  }
  autoSetColAndRows(e, t = !0) {
    const n = this.container.engine.layoutManager;
    let i = e.col, o = e.row, l = Object.assign(Y(this.option.global), Y(e.layout || {})), {
      col: s = null,
      row: a = null,
      ratioCol: m = e.ratioCol,
      ratioRow: h = e.ratioRow,
      size: d = [null, null],
      margin: f = [null, null],
      sizeWidth: _,
      sizeHeight: y,
      marginX: w,
      marginY: p
    } = l, b = i, S = o;
    const B = e.engine.items, I = (E, L) => (e.minCol && e.maxCol && e.minCol > e.maxCol ? (E = e.maxCol, this.container.eventManager.warn("limitOverlap", "minCol\u6307\u5B9A\u7684\u503C\u5927\u4E8EmaxCol,\u5C06\u4EE5maxCol\u6307\u5B9A\u7684\u503C\u4E3A\u4E3B")) : e.maxCol && E > e.maxCol ? E = e.maxCol : e.minCol && E < e.minCol && (E = e.minCol), e.minRow && e.maxRow && e.minRow > e.maxRow ? (L = e.maxRow, this.container.eventManager.warn("limitOverlap", "minRow\u6307\u5B9A\u7684\u503C\u5927\u4E8EmaxRow,\u5C06\u4EE5maxRow\u6307\u5B9A\u7684\u503C\u4E3A\u4E3B")) : e.maxRow && L > e.maxRow ? L = e.maxRow : e.minRow && L < e.minRow && (L = e.minRow), {
      limitCol: E,
      limitRow: L
    });
    if ((() => {
      var v, z;
      n.autoRow(!a || l.responsive), w && (f[0] = w), p && (f[1] = p), _ && (d[0] = _), y && (d[1] = y);
      const E = this.computeSmartRowAndCol(B);
      if (!s && !f[0] && !d[0])
        i = E.smartCol;
      else {
        const O = (v = this.container.element) == null ? void 0 : v.clientWidth;
        !l.responsive && !s && this.container.col && this.container.col !== 1 && (s = this.container.col), i = this.autoComputeSizeInfo(s, O, d[0], f[0], m).direction;
      }
      if (!a || l.responsive)
        o = E.smartRow;
      else {
        const O = (z = this.container.element) == null ? void 0 : z.clientHeight;
        !l.responsive && !a && this.container.row && this.container.row !== 1 && (a = this.container.row), o = this.autoComputeSizeInfo(a, O, d[1], f[1], h).direction;
      }
      const L = I(i, o);
      b = L.limitCol, S = L.limitRow;
    })(), t && i && o) {
      e.col = i, e.row = o, e.containerW = b, e.containerH = S, n.setColNum(i), n.setRowNum(o), n.addRow(o - n._layoutMatrix.length), n.addCol(i - n._layoutMatrix[0].length);
      const E = e.__ownTemp__.preCol, L = e.__ownTemp__.preRow;
      if (i !== E) {
        e.__ownTemp__.preCol = i, e.eventManager._callback_("colChange", i, E, e);
        const v = e._VueEvents.vueColChange;
        typeof v == "function" && v(i, E, e);
      }
      if (o !== L) {
        e.__ownTemp__.preRow = o, e.eventManager._callback_("rowChange", o, L, e);
        const v = e._VueEvents.vueRowChange;
        typeof v == "function" && v(o, L, e);
      }
    }
    return {
      col: i,
      row: o,
      containerW: b,
      containerH: S
    };
  }
}
class Ze {
  constructor(e) {
    u(this, "items", []);
    u(this, "option", {});
    u(this, "layoutManager", null);
    u(this, "container", null);
    u(this, "layoutConfig", null);
    u(this, "useLayout", null);
    u(this, "initialized", !1);
    u(this, "__temp__", {
      responsiveFunc: null,
      firstLoaded: !1,
      staticIndexCount: 0,
      previousHash: ""
    });
    this.option = e;
  }
  init() {
    this.initialized || (this.layoutManager = new $e(), this.layoutConfig = new Je(this.option), this.layoutConfig.setContainer(this.container), this.layoutConfig.initLayoutInfo(), this.initialized = !0);
  }
  _sync() {
    this.layoutConfig.autoSetColAndRows(this.container);
    let e = this.layoutConfig.genLayoutConfig();
    this.useLayout = e, this._syncLayoutConfig(e.useLayout);
  }
  _checkUpdated() {
    let e = "";
    this.items.forEach((t) => {
      const n = t.pos;
      e = e + n.posHash + (n.w || n.tempW) + (n.h || n.tempH) + n.x + n.y + ";";
    }), this.__temp__.previousHash !== e && (this.container.eventManager._callback_("updated", this.container), this.__temp__.previousHash = e);
  }
  _syncLayoutConfig(e = null) {
    if (!!e) {
      if (Object.keys(e).length === 0 && !this.option.col)
        throw new Error("\u672A\u627E\u5230layout\u76F8\u5173\u51B3\u5B9A\u5E03\u5C40\u914D\u7F6E\u4FE1\u606F\uFF0C\u60A8\u53EF\u80FD\u662F\u672A\u4F20\u5165col\u5B57\u6BB5");
      G(this.container, e, !1, ["events"]), this.items.forEach((t) => {
        G(t, {
          margin: e.margin,
          size: e.size
        });
      });
    }
  }
  findCoverItemFromPosition(e, t, n, i, o = null) {
    o = o || this.items;
    const l = [];
    for (let s = 0; s < o.length; s++) {
      let a = o[s];
      const m = e, h = t, d = e + n - 1, f = t + i - 1, _ = a.pos.x, y = a.pos.y, w = a.pos.x + a.pos.w - 1, p = a.pos.y + a.pos.h - 1;
      ((w >= m && w <= d || _ >= m && _ <= d || m >= _ && d <= w) && (p >= h && p <= f || y >= h && y <= f || h >= y && f <= p) || m >= _ && d <= w && h >= y && f <= p) && l.push(a);
    }
    return l;
  }
  findResponsiveItemFromPosition(e, t, n, i) {
    let o = null, l = 1;
    this.items.length > 0 && (l = this.items[this.items.length - 1].pos.y);
    for (let s = 0; s < this.items.length; s++) {
      let a = this.items[s];
      if (!a)
        continue;
      const m = a.pos.x, h = a.pos.y, d = a.pos.x + a.pos.w - 1, f = a.pos.y + a.pos.h - 1;
      m === e && (t > l && (t = l), e === m && t === h && (o = a));
    }
    return o;
  }
  findStaticBlankMaxMatrixFromItem(e) {
    const t = e.pos.x, n = e.pos.y, i = e.pos.w, o = e.pos.h;
    let l = this.container.col - t + 1, s = this.container.row - n + 1, a = l, m = s;
    for (let h = 0; h < this.items.length; h++) {
      const d = this.items[h], f = d.pos;
      this.container.responsive && !d.static || e !== d && (f.x + f.w - 1 < t || f.y + f.h - 1 < n || (f.x >= t && f.x - t < l && (n + o - 1 >= f.y && n + o - 1 <= f.y + f.h - 1 || f.y + f.h - 1 >= n && f.y + f.h - 1 <= n + o - 1) && (l = f.x - t), f.y >= n && f.y - n < s && (t + i - 1 >= f.x && t + i - 1 <= f.x + f.w - 1 || f.x + f.w - 1 >= t && f.x + f.w - 1 <= t + i - 1) && (s = f.y - n), f.x >= t && f.x - t < a && (n + s - 1 >= f.y && n + s - 1 <= f.y + f.h - 1 || f.y + f.h - 1 >= n && f.y + f.h - 1 <= n + s - 1) && (a = f.x - t), f.y >= n && f.y - n < m && (t + l - 1 >= f.x && t + l - 1 <= f.x + f.w - 1 || f.x + f.w - 1 >= t && f.x + f.w - 1 <= t + l - 1) && (m = f.y - n)));
    }
    return {
      maxW: l,
      maxH: s,
      minW: a,
      minH: m
    };
  }
  setColNum(e) {
    this.layoutManager.setColNum(e);
  }
  setContainer(e) {
    this.container = e;
  }
  len() {
    return this.items.length;
  }
  getItemList() {
    return this.items;
  }
  index(e) {
    for (let t = 0; t < this.items.length; t++)
      if (this.items[t].i === e)
        return this.items[t];
    return null;
  }
  sortStatic(e = !1) {
    const t = [], n = [];
    return this.items.forEach((i) => {
      !i instanceof ne || (i.static === !0 ? (t.push(i), console.log(i)) : n.push(i));
    }), this.renumber(), e && (this.items = n), t.concat(n);
  }
  mountAll() {
    this.items.forEach((e) => e.mount()), this.container.responsive && (this.container.row = this.layoutManager.row);
  }
  unmount(e) {
    this.items.forEach((t) => t.unmount(e)), this.reset();
  }
  remount() {
    this.unmount(), this.container.mount();
  }
  addItem(e) {
    const t = this.container.itemLimit, n = this.container.eventManager;
    if (t.minW > e.pos.w)
      n._error_("itemLimitError", `itemLimit\u914D\u7F6E\u6307\u5B9AminW\u4E3A:${t.minW},\u5F53\u524Dw\u4E3A${e.pos.w}`, e, e);
    else if (t.maxW < e.pos.w)
      n._error_("itemLimitError", `itemLimit\u914D\u7F6E\u6307\u5B9AmaxW\u4E3A:${t.maxW},\u5F53\u524Dw\u4E3A${e.pos.w}`, e, e);
    else if (t.minH > e.pos.h)
      n._error_("itemLimitError", `itemLimit\u914D\u7F6E\u6307\u5B9AminH\u4E3A:${t.minH},\u5F53\u524Dh\u4E3A${e.pos.h}`, e, e);
    else if (t.maxH < e.pos.h)
      n._error_("itemLimitError", `itemLimit\u914D\u7F6E\u6307\u5B9AmaxH\u4E3A:${t.maxH},\u5F53\u524Dh\u4E3A${e.pos.h}`, e, e);
    else {
      e.autoOnce = !(e.pos.x && e.pos.y);
      const i = this.push(e);
      return i ? n._callback_("addItemSuccess", e) : n._error_(
        "ContainerOverflowError",
        "getErrAttr=>[name|message] \u5BB9\u5668\u6EA2\u51FA\uFF0C\u53EA\u6709\u9759\u6001\u6A21\u5F0F\u4E0B\u4F1A\u51FA\u73B0\u6B64\u9519\u8BEF,\u60A8\u53EF\u4EE5\u4F7F\u7528error\u4E8B\u4EF6\u51FD\u6570\u63A5\u6536\u8BE5\u9519\u8BEF\uFF0C\u90A3\u4E48\u8BE5\u9519\u8BEF\u5C31\u4E0D\u4F1A\u629B\u51FA\u800C\u662F\u5C06\u9519\u8BEF\u4F20\u5230error\u4E8B\u4EF6\u51FD\u6570\u7684\u7B2C\u4E8C\u4E2A\u5F62\u53C2",
        e,
        e
      ), i ? e : null;
    }
    return null;
  }
  push(e) {
    const t = () => {
      let i = !1;
      if (this.items.length <= 1)
        this.items.push(e), i = !0;
      else {
        let o, l;
        for (let s = 0; s < this.items.length; s++)
          if (this.items.length > s && (l = this.items[s], o = this.items[s + 1]), o) {
            const a = l.pos, m = o.pos;
            if (!n)
              return !1;
            if (a.y <= n.y && m.y > n.y) {
              this.insert(e, s + 1), i = !0;
              break;
            }
          } else {
            this.items.push(e), i = !0;
            break;
          }
      }
      return i;
    };
    let n = null;
    return e.autoOnce === !1 ? (this.items.push(e), this.layoutConfig.autoSetColAndRows(this.container), this._isCanAddItemToContainer_(e, e.autoOnce, !0), !0) : (n = this._isCanAddItemToContainer_(e, e.autoOnce, !0), n ? this.container.autoReorder && this.container.responsive ? t() : (this.items.push(e), !0) : !1);
  }
  sortResponsiveItem() {
    const e = [];
    for (let t = 1; t <= this.container.row; t++)
      for (let n = 1; n <= this.container.col; n++)
        for (let i = 0; i < this.items.length; i++) {
          const o = this.items[i];
          if (n >= o.pos.x && n < o.pos.x + o.pos.w && t >= o.pos.y && t < o.pos.y + o.pos.h) {
            e.includes(o) || e.push(o);
            break;
          }
        }
    this.items = e;
  }
  removeItem(e) {
    for (let t = 0; t < this.items.length; t++)
      this.items[t] === e && this.items.splice(t, 1);
  }
  reset() {
    this.layoutManager.reset();
  }
  clear() {
    this.items = [];
  }
  includes(e) {
    return this.items.includes(e);
  }
  remove(e) {
    for (let t = 0; t < this.items.length; t++)
      if (e === this.items[t]) {
        this.items.splice(t, 1);
        break;
      }
  }
  insert(e, t) {
    this.items.splice(t, 0, e);
  }
  move(e, t) {
    t < 0 && (t = 0);
    let n = null;
    for (let i = 0; i < this.items.length; i++)
      if (this.items[i] === e) {
        n = i;
        break;
      }
    n !== null && (this.items.splice(n, 1), this.items.splice(t, 0, e));
  }
  exchange(e, t) {
    this.items.includes(e) && this.items.includes(t) && (this.items[e.i] = t, this.items[t.i] = e);
  }
  renumber(e) {
    e = e || this.items, e.forEach((t, n) => {
      t.i = n, t.pos.i = n;
    });
  }
  createItem(e) {
    return e.container = this.container, e.size = this.container.size, e.margin = this.container.margin, e.resize = Boolean(e.resize), e.draggable = Boolean(e.draggable), e.close = Boolean(e.close), e.i = this.len(), new ne(e);
  }
  findItem(e) {
    return this.items.filter((t) => t.name === e || t.classList.includes(e) || t.element === e);
  }
  checkOverflow(e, t = !0) {
    const n = e.pos, i = n.w, o = n.h;
    let l = !1;
    const s = e.container.col - n.x + 1, a = e.container.row - n.y + 1;
    (i + n.x - 1 > this.container.col || n.tempW) && (this.container.responsive || (n.tempW !== s && n.tempW <= i && (l = !0), t && i > n.tempW && s <= i && s <= i && (n.tempW = s))), (o + n.y - 1 > this.container.row || n.tempH) && (this.container.responsive || (n.tempH !== a && n.tempH <= o && (l = !0), t && o > n.tempH && a <= o && a <= o && (n.tempH = a))), (i > this.container.col || n.tempW) && (n.tempW !== s && n.tempW <= i && (l = !0), t && i > n.tempW && s <= i && s <= i && (n.tempW = s)), (o > this.container.row || n.tempH) && (n.tempH !== a && n.tempH <= o && (l = !0), t && o > n.tempH && a <= o && a <= o && (n.tempH = a)), l && this.items.includes(e) && this.container.eventManager._warn_(
      "temporaryResetItemSize",
      "ITEM: w:" + i + " h:" + o + "\u8D85\u8FC7\u6805\u683C\u5927\u5C0F\uFF0C\u4E34\u65F6\u8C03\u6574\u8BE5ITEM\u5C3A\u5BF8\u4E3Aw:" + (n.tempW ? n.tempW : n.w) + " h:" + (n.tempH ? n.tempH : n.h) + "\u8FDB\u884C\u9002\u914D\u5BB9\u5668\u7A7A\u95F4,\u6B64\u65F6pos.w\u548Cpos.h\u8FD8\u662F\u539F\u6765\u7684\u5C3A\u5BF8,\u5728\u5BB9\u5668\u4E2D\u4E00\u4F46\u5B58\u5728\u8DB3\u591F\u7A7A\u95F4\u5219\u8BE5Item\u4FBF\u4F1A\u6062\u590D\u539F\u6765\u7684\u5C3A\u5BF8",
      e
    );
  }
  _isCanAddItemToContainer_(e, t = !1, n = !1) {
    let i, o = e.pos.nextStaticPos !== null ? e.pos.nextStaticPos : e.pos;
    o.i = e.i;
    const l = Object.assign({}, o);
    return e.pos.tempW && (l.w = e.pos.tempW), e.pos.tempH && (l.h = e.pos.tempH), i = this.layoutManager.findItem(l, t), i !== null ? (n && (this.layoutManager.addItem(i), i.w = o.w, i.h = o.h, G(e.pos, Object.assign(this._genItemPosArg(e), i)), e.pos.nextStaticPos = null, e.autoOnce = !1), i) : null;
  }
  updateLayout(e = null, t = []) {
    const n = this.items.filter((a) => a.static && a.pos.x && a.pos.y && this.items.includes(a) ? a : !1);
    let i = [];
    if (e === null)
      i = [];
    else if (Array.isArray(e))
      i = e;
    else if (e !== !0 && i.length === 0)
      return;
    e === !0 && (e = this.items), this.reset(), this.renumber(), this._sync(), i = i.filter((a) => e.includes(a) && !a.static), i.length === 0 && (i = e.filter((a) => a.__temp__.resizeLock));
    const o = (a) => {
      this._isCanAddItemToContainer_(a, !!a.autoOnce, !0), this.checkOverflow(a), a.updateItemLayout();
    };
    n.forEach((a) => {
      a.autoOnce = !1, o(a);
    }), i.forEach((a) => {
      a.autoOnce = !1, o(a);
    }), e.forEach((a) => {
      i.includes(a) || n.includes(a) || (this.container.responsive && (a.autoOnce = !0), o(a));
    }), this._checkUpdated(), this.layoutConfig.autoSetColAndRows(this.container), this.container.layout.data = this.container.exportData(), this.container.updateContainerStyleSize();
    const l = (a) => ({
      row: a.row,
      col: a.col,
      containerW: a.containerW,
      containerH: a.containerH,
      width: a.nowWidth(),
      height: a.nowHeight()
    }), s = this.container;
    if (!s.__ownTemp__.beforeContainerSizeInfo)
      s.__ownTemp__.beforeContainerSizeInfo = l(s);
    else {
      const a = s.__ownTemp__.beforeContainerSizeInfo;
      if (a.containerW !== s.containerW || a.containerH !== s.containerH) {
        const m = l(s);
        s.__ownTemp__.beforeContainerSizeInfo = l(s), this.container.eventManager._callback_("containerSizeChange", a, m, s);
      }
    }
  }
  _genItemPosArg(e) {
    return e.pos.col = (() => this.container.col)(), e.pos.row = (() => this.container.row)(), e.pos;
  }
}
class de extends Error {
  constructor() {
    super(...arguments);
    u(this, "name", de.name);
    u(this, "message", "getErrAttr=>[name|message] \u5BB9\u5668\u6EA2\u51FA\uFF0C\u53EA\u6709\u9759\u6001\u6A21\u5F0F\u4E0B\u4F1A\u51FA\u73B0\u6B64\u9519\u8BEF,\u60A8\u53EF\u4EE5\u4F7F\u7528error\u4E8B\u4EF6\u51FD\u6570\u63A5\u6536\u8BE5\u9519\u8BEF\uFF0C\u90A3\u4E48\u8BE5\u9519\u8BEF\u5C31\u4E0D\u4F1A\u629B\u51FA\u800C\u662F\u5C06\u9519\u8BEF\u4F20\u5230error\u4E8B\u4EF6\u51FD\u6570\u7684\u7B2C\u4E8C\u4E2A\u5F62\u53C2");
  }
}
const Qe = {
  ContainerOverflowError: de
};
class we {
  static index(e) {
    return e ? Qe[e] : Error;
  }
}
class Ke {
  constructor(e) {
    u(this, "error", null);
    u(this, "warn", null);
    Object.assign(this, e);
  }
  _errback_(e, ...t) {
    if (typeof this.error != "function")
      throw new (we.index(e))();
    this.error.call(this.error, new (we.index(e))(), ...t);
  }
  _callback_(e, ...t) {
    if (typeof this[e] == "function")
      return this[e](...t);
  }
  _error_(e, t = "", n = "", ...i) {
    typeof this.error == "function" ? this.error.call(this.error, {
      type: "error",
      name: e,
      msg: "getErrAttr=>[name|type|msg|from]  " + t,
      from: n
    }, ...i) : console.error(e, t + "(\u4F60\u53EF\u4EE5\u7528error\u4E8B\u4EF6\u51FD\u6570\u6765\u63A5\u53D7\u5904\u7406\u8BE5\u9519\u8BEF\u4F7F\u5176\u4E0D\u5728\u63A7\u5236\u53F0\u663E\u793A)", n);
  }
  _warn_(e, t = "", n = "", ...i) {
    typeof this.warn == "function" ? this.warn.call(this.warn, {
      type: "warn",
      name: e,
      msg: "getWarnAttr=>[name|type|msg|from]  " + t,
      from: n
    }, ...i) : console.warn(e, t + "(\u4F60\u53EF\u4EE5\u7528warn\u4E8B\u4EF6\u51FD\u6570\u6765\u63A5\u53D7\u5904\u7406\u6216\u8005\u5FFD\u7565\u8BE5\u8B66\u544A\u4F7F\u5176\u4E0D\u5728\u63A7\u5236\u53F0\u663E\u793A)", n);
  }
}
class et {
  constructor(e = {}) {
    u(this, "className", "grid-container");
    u(this, "responsive", !1);
    u(this, "responseMode", "default");
    u(this, "data", []);
    u(this, "col", null);
    u(this, "row", null);
    u(this, "margin", [null, null]);
    u(this, "marginX", null);
    u(this, "marginY", null);
    u(this, "size", [null, null]);
    u(this, "sizeWidth", null);
    u(this, "sizeHeight", null);
    u(this, "minCol", null);
    u(this, "maxCol", null);
    u(this, "minRow", null);
    u(this, "maxRow", null);
    u(this, "autoGrowRow", !0);
    u(this, "autoReorder", !0);
    u(this, "ratioCol", 0.1);
    u(this, "ratioRow", 0.1);
    u(this, "followScroll", !0);
    u(this, "sensitivity", 0.45);
    u(this, "itemLimit", {});
    u(this, "exchange", !1);
    u(this, "pressTime", 360);
    u(this, "scrollWaitTime", 800);
    u(this, "scrollSpeedX", null);
    u(this, "scrollSpeedY", null);
    u(this, "resizeReactionDelay", 50);
    u(this, "slidePage", !0);
    u(this, "nestedOutExchange", !1);
    G(this, e);
  }
}
const ze = function() {
  if (typeof Map < "u")
    return Map;
  function c(e, t) {
    let n = -1;
    return e.some(function(i, o) {
      return i[0] === t ? (n = o, !0) : !1;
    }), n;
  }
  return function() {
    function e() {
      this.__entries__ = [];
    }
    return Object.defineProperty(e.prototype, "size", {
      get: function() {
        return this.__entries__.length;
      },
      enumerable: !0,
      configurable: !0
    }), e.prototype.get = function(t) {
      const n = c(this.__entries__, t), i = this.__entries__[n];
      return i && i[1];
    }, e.prototype.set = function(t, n) {
      var i = c(this.__entries__, t);
      ~i ? this.__entries__[i][1] = n : this.__entries__.push([t, n]);
    }, e.prototype.delete = function(t) {
      const n = this.__entries__, i = c(n, t);
      ~i && n.splice(i, 1);
    }, e.prototype.has = function(t) {
      return !!~c(this.__entries__, t);
    }, e.prototype.clear = function() {
      this.__entries__.splice(0);
    }, e.prototype.forEach = function(t, n) {
      n === void 0 && (n = null);
      for (let o = 0, l = this.__entries__; o < l.length; o++) {
        var i = l[o];
        t.call(n, i[1], i[0]);
      }
    }, e;
  }();
}(), me = typeof window < "u" && typeof document < "u" && window.document === document, ie = function() {
  return typeof global < "u" && global.Math === Math ? global : typeof self < "u" && self.Math === Math ? self : typeof window < "u" && window.Math === Math ? window : Function("return this")();
}(), tt = function() {
  return typeof requestAnimationFrame == "function" ? requestAnimationFrame.bind(ie) : function(c) {
    return setTimeout(function() {
      return c(Date.now());
    }, 1e3 / 60);
  };
}(), nt = 2;
function it(c, e) {
  let t = !1, n = !1, i = 0;
  function o() {
    t && (t = !1, c()), n && s();
  }
  function l() {
    tt(o);
  }
  function s() {
    const a = Date.now();
    if (t) {
      if (a - i < nt)
        return;
      n = !0;
    } else
      t = !0, n = !1, setTimeout(l, e);
    i = a;
  }
  return s;
}
const ot = 20, st = ["top", "right", "bottom", "left", "width", "height", "size", "weight"], rt = typeof MutationObserver < "u", lt = function() {
  function c() {
    this.connected_ = !1, this.mutationEventsAdded_ = !1, this.mutationsObserver_ = null, this.observers_ = [], this.onTransitionEnd_ = this.onTransitionEnd_.bind(this), this.refresh = it(this.refresh.bind(this), ot);
  }
  return c.prototype.addObserver = function(e) {
    ~this.observers_.indexOf(e) || this.observers_.push(e), this.connected_ || this.connect_();
  }, c.prototype.removeObserver = function(e) {
    const t = this.observers_, n = t.indexOf(e);
    ~n && t.splice(n, 1), !t.length && this.connected_ && this.disconnect_();
  }, c.prototype.refresh = function() {
    this.updateObservers_() && this.refresh();
  }, c.prototype.updateObservers_ = function() {
    const e = this.observers_.filter(function(t) {
      return t.gatherActive(), t.hasActive();
    });
    return e.forEach(function(t) {
      return t.broadcastActive();
    }), e.length > 0;
  }, c.prototype.connect_ = function() {
    !me || this.connected_ || (document.addEventListener("transitionend", this.onTransitionEnd_), window.addEventListener("resize", this.refresh), rt ? (this.mutationsObserver_ = new MutationObserver(this.refresh), this.mutationsObserver_.observe(document, {
      attributes: !0,
      childList: !0,
      characterData: !0,
      subtree: !0
    })) : (document.addEventListener("DOMSubtreeModified", this.refresh), this.mutationEventsAdded_ = !0), this.connected_ = !0);
  }, c.prototype.disconnect_ = function() {
    !me || !this.connected_ || (document.removeEventListener("transitionend", this.onTransitionEnd_), window.removeEventListener("resize", this.refresh), this.mutationsObserver_ && this.mutationsObserver_.disconnect(), this.mutationEventsAdded_ && document.removeEventListener("DOMSubtreeModified", this.refresh), this.mutationsObserver_ = null, this.mutationEventsAdded_ = !1, this.connected_ = !1);
  }, c.prototype.onTransitionEnd_ = function(e) {
    const t = e.propertyName, n = t === void 0 ? "" : t;
    st.some(function(o) {
      return !!~n.indexOf(o);
    }) && this.refresh();
  }, c.getInstance = function() {
    return this.instance_ || (this.instance_ = new c()), this.instance_;
  }, c.instance_ = null, c;
}(), Re = function(c, e) {
  for (let t = 0, n = Object.keys(e); t < n.length; t++) {
    const i = n[t];
    Object.defineProperty(c, i, {
      value: e[i],
      enumerable: !1,
      writable: !1,
      configurable: !0
    });
  }
  return c;
}, j = function(c) {
  return c && c.ownerDocument && c.ownerDocument.defaultView || ie;
}, Me = re(0, 0, 0, 0);
function oe(c) {
  return parseFloat(c) || 0;
}
function xe(c) {
  const e = [];
  for (let t = 1; t < arguments.length; t++)
    e[t - 1] = arguments[t];
  return e.reduce(function(t, n) {
    const i = c["border-" + n + "-width"];
    return t + oe(i);
  }, 0);
}
function at(c) {
  const e = ["top", "right", "bottom", "left"], t = {};
  for (let n = 0, i = e; n < i.length; n++) {
    const o = i[n], l = c["padding-" + o];
    t[o] = oe(l);
  }
  return t;
}
function ut(c) {
  const e = c.getBBox();
  return re(0, 0, e.width, e.height);
}
function ct(c) {
  const e = c.clientWidth, t = c.clientHeight;
  if (!e && !t)
    return Me;
  const n = j(c).getComputedStyle(c), i = at(n), o = i.left + i.right, l = i.top + i.bottom;
  let s = oe(n.width), a = oe(n.height);
  if (n.boxSizing === "border-box" && (Math.round(s + o) !== e && (s -= xe(n, "left", "right") + o), Math.round(a + l) !== t && (a -= xe(n, "top", "bottom") + l)), !mt(c)) {
    const m = Math.round(s + o) - e, h = Math.round(a + l) - t;
    Math.abs(m) !== 1 && (s -= m), Math.abs(h) !== 1 && (a -= h);
  }
  return re(i.left, i.top, s, a);
}
const ft = function() {
  return typeof SVGGraphicsElement < "u" ? function(c) {
    return c instanceof j(c).SVGGraphicsElement;
  } : function(c) {
    return c instanceof j(c).SVGElement && typeof c.getBBox == "function";
  };
}();
function mt(c) {
  return c === j(c).document.documentElement;
}
function ht(c) {
  return me ? ft(c) ? ut(c) : ct(c) : Me;
}
function dt(c) {
  const e = c.x, t = c.y, n = c.width, i = c.height, l = Object.create((typeof DOMRectReadOnly < "u" ? DOMRectReadOnly : Object).prototype);
  return Re(l, {
    x: e,
    y: t,
    width: n,
    height: i,
    top: t,
    right: e + n,
    bottom: i + t,
    left: e
  }), l;
}
function re(c, e, t, n) {
  return { x: c, y: e, width: t, height: n };
}
const pt = function() {
  function c(e) {
    this.broadcastWidth = 0, this.broadcastHeight = 0, this.contentRect_ = re(0, 0, 0, 0), this.target = e;
  }
  return c.prototype.isActive = function() {
    var e = ht(this.target);
    return this.contentRect_ = e, e.width !== this.broadcastWidth || e.height !== this.broadcastHeight;
  }, c.prototype.broadcastRect = function() {
    var e = this.contentRect_;
    return this.broadcastWidth = e.width, this.broadcastHeight = e.height, e;
  }, c;
}(), gt = function() {
  function c(e, t) {
    var n = dt(t);
    Re(this, { target: e, contentRect: n });
  }
  return c;
}(), _t = function() {
  function c(e, t, n) {
    if (this.activeObservations_ = [], this.observations_ = new ze(), typeof e != "function")
      throw new TypeError("The callback provided as parameter 1 is not a function.");
    this.callback_ = e, this.controller_ = t, this.callbackCtx_ = n;
  }
  return c.prototype.observe = function(e) {
    if (!arguments.length)
      throw new TypeError("1 argument required, but only 0 present.");
    if (typeof Element > "u" || !(Element instanceof Object))
      return;
    if (!(e instanceof j(e).Element))
      throw new TypeError('parameter 1 is not of type "Element".');
    const t = this.observations_;
    t.has(e) || (t.set(e, new pt(e)), this.controller_.addObserver(this), this.controller_.refresh());
  }, c.prototype.unobserve = function(e) {
    if (!arguments.length)
      throw new TypeError("1 argument required, but only 0 present.");
    if (typeof Element > "u" || !(Element instanceof Object))
      return;
    if (!(e instanceof j(e).Element))
      throw new TypeError('parameter 1 is not of type "Element".');
    const t = this.observations_;
    !t.has(e) || (t.delete(e), t.size || this.controller_.removeObserver(this));
  }, c.prototype.disconnect = function() {
    this.clearActive(), this.observations_.clear(), this.controller_.removeObserver(this);
  }, c.prototype.gatherActive = function() {
    const e = this;
    this.clearActive(), this.observations_.forEach(function(t) {
      t.isActive() && e.activeObservations_.push(t);
    });
  }, c.prototype.broadcastActive = function() {
    if (!this.hasActive())
      return;
    const e = this.callbackCtx_, t = this.activeObservations_.map(function(n) {
      return new gt(n.target, n.broadcastRect());
    });
    this.callback_.call(e, t, e), this.clearActive();
  }, c.prototype.clearActive = function() {
    this.activeObservations_.splice(0);
  }, c.prototype.hasActive = function() {
    return this.activeObservations_.length > 0;
  }, c;
}(), Te = typeof WeakMap < "u" ? /* @__PURE__ */ new WeakMap() : new ze(), Se = function() {
  function c(e) {
    if (!(this instanceof c))
      throw new TypeError("Cannot call a class as a function.");
    if (!arguments.length)
      throw new TypeError("1 argument required, but only 0 present.");
    const t = lt.getInstance(), n = new _t(e, t, this);
    Te.set(this, n);
  }
  return c;
}();
[
  "observe",
  "unobserve",
  "disconnect"
].forEach(function(c) {
  Se.prototype[c] = function() {
    let e;
    return (e = Te.get(this))[c].apply(e, arguments);
  };
});
const yt = function() {
  return typeof ie.ResizeObserver < "u" ? ie.ResizeObserver : Se;
}(), K = N.store;
class wt extends Le {
  constructor(t) {
    super();
    u(this, "el", "");
    u(this, "parent", null);
    u(this, "platform", "native");
    u(this, "layouts", []);
    u(this, "events", []);
    u(this, "global", {});
    u(this, "element", null);
    u(this, "contentElement", null);
    u(this, "classList", []);
    u(this, "attr", []);
    u(this, "engine", []);
    u(this, "px", null);
    u(this, "layout", {});
    u(this, "useLayout", {});
    u(this, "childContainer", []);
    u(this, "isNesting", !1);
    u(this, "parentItem", null);
    u(this, "containerH", null);
    u(this, "containerW", null);
    u(this, "eventManager", null);
    u(this, "_VueEvents", {});
    u(this, "_mounted", !1);
    u(this, "__store__", K);
    u(this, "__ownTemp__", {
      preCol: 0,
      preRow: 0,
      exchangeLock: !1,
      firstInitColNum: null,
      firstEnterUnLock: !1,
      nestingEnterBlankUnLock: !1,
      moveExchangeLock: !1,
      beforeOverItems: [],
      moveCount: 0,
      offsetPageX: 0,
      offsetPageY: 0,
      exchangeLockX: !1,
      exchangeLockY: !1,
      beforeContainerSizeInfo: null,
      observer: null,
      deferUpdatingLayoutTimer: null,
      nestingFirstMounted: !1
    });
    u(this, "genGridContainerBox", () => {
      this.contentElement = document.createElement("div"), this.contentElement.classList.add("grid-container-area"), this.contentElement._isGridContainerArea = !0, this.element.appendChild(this.contentElement), this.updateStyle(q.gridContainer, this.contentElement), this.contentElement.classList.add(this.className);
    });
    u(this, "genContainerStyle", () => {
      const t = this.nowWidth() + "px", n = this.nowHeight() + "px";
      return {
        width: t,
        height: n
      };
    });
    u(this, "nowWidth", () => {
      let t = 0, n = this.containerW;
      return n > 1 && (t = (n - 1) * this.margin[0]), n * this.size[0] + t || 0;
    });
    u(this, "nowHeight", () => {
      let t = 0, n = this.containerH;
      return n > 1 && (t = (n - 1) * this.margin[1]), n * this.size[1] + t || 0;
    });
    t.el, this.el = t.el, typeof t.platform == "string" && (this.platform = t.platform), Object.assign(this, new et()), this._define(), this.eventManager = new Ke(t.events), this.engine = new Ze(t), t.global && (this.global = t.global), t.parent && (this.parent = t.parent, this.parent.childContainer.push(this), this.isNesting = !0), this.engine.setContainer(this), t.itemLimit && (this.itemLimit = new te(t.itemLimit));
  }
  _define() {
    let t = null, n = null;
    Object.defineProperties(this, {
      col: {
        get: () => t,
        set: (i) => {
          t === i || i <= 0 || typeof i != "number" || !isFinite(i) || (t = i);
        }
      },
      row: {
        get: () => n,
        set: (i) => {
          n === i || i <= 0 || typeof i != "number" || !isFinite(i) || (n = i);
        }
      }
    });
  }
  setColNum(t) {
    if (t > 30 || t < 0)
      throw new Error("\u5217\u6570\u91CF\u53EA\u80FD\u6700\u4F4E\u4E3A1,\u6700\u9AD8\u4E3A30,\u5982\u679C\u60A8\u975E\u8981\u8BBE\u7F6E\u66F4\u9AD8\u503C\uFF0C\u8BF7\u76F4\u63A5\u5C06\u503C\u7ED9\u5230\u672C\u7C7B\u4E2D\u7684\u6210\u5458col\uFF0C\u800C\u4E0D\u662F\u901A\u8FC7\u8BE5\u51FD\u6570\u8FDB\u884C\u8BBE\u7F6E");
    return this.col = t, this.engine.setColNum(t), this;
  }
  setRowNum(t) {
    return this.row = t, this;
  }
  getItemList() {
    return this.engine.getItemList();
  }
  addRowSpace(t = 1) {
    this.row += t;
  }
  removeRowSpace(t = 1) {
    if (this.row = this.row - t, this.row < 0)
      throw new Error("\u884C\u6570\u4E0D\u5E94\u8BE5\u5C0F\u4E8E0\uFF0C\u8BF7\u8BBE\u7F6E\u4E00\u4E2A\u5927\u4E8E0\u7684\u503C");
    this.updateLayout(!0);
  }
  mount(t) {
    if (this._mounted)
      return;
    const n = () => {
      if (this.el instanceof Element && (this.element = this.el), this.element === null && (this.isNesting || (this.element = document.querySelector(this.el)), this.element === null)) {
        const o = "\u5728DOM\u4E2D\u672A\u627E\u5230\u6307\u5B9AID\u5BF9\u5E94\u7684:" + this.el + "\u5143\u7D20";
        throw new Error(o);
      }
      if (this.element._gridContainer_ = this, this.element._isGridContainer_ = !0, this.engine.init(), this.platform === "vue" ? this.contentElement = this.element.querySelector(".grid-container-area") : (this.genGridContainerBox(), this.updateStyle(q.gridContainerArea)), this.attr = Array.from(this.element.attributes), this.classList = Array.from(this.element.classList), this.element && this.element.clientWidth > 0) {
        if (this.engine._sync(), !this.responsive && !this.row)
          throw new Error("\u4F7F\u7528\u9759\u6001\u5E03\u5C40row,\u548CsizeWidth\u5FC5\u987B\u90FD\u6307\u5B9A\u503C,sizeWidth\u7B49\u4EF7\u4E8Esize[0],\u82E5\u6CA1\u5B9A\u4E49col\u5219\u4F1A\u81EA\u52A8\u751F\u6210");
        if (!this.element.clientWidth)
          throw new Error("\u60A8\u5E94\u8BE5\u4E3AContainer\u6307\u5B9A\u4E00\u4E2A\u5BBD\u5EA6\uFF0C\u54CD\u5E94\u5F0F\u5E03\u5C40\u4F7F\u7528\u6307\u5B9A\u52A8\u6001\u5BBD\u5EA6\uFF0C\u9759\u6001\u5E03\u5C40\u53EF\u4EE5\u76F4\u63A5\u8BBE\u5B9A\u56FA\u5B9A\u5BBD\u5EA6");
      }
      this._observer_();
      let i = setTimeout(() => {
        this._isNestingContainer_(), clearTimeout(i), i = null;
      });
      this.__ownTemp__.firstInitColNum = this.col, this.__store__.screenWidth = window.screen.width, this.__store__.screenHeight = window.screen.height, this._mounted = !0, this.eventManager._callback_("containerMounted", this), typeof t == "function" && t.bind(this)(this);
    };
    this.platform === "vue" ? n() : M.run(n);
  }
  exportData(t = []) {
    return this.engine.items.map((n) => n.exportConfig(t));
  }
  exportGlobal() {
    return this.global;
  }
  exportLayouts() {
    let t = this.layouts;
    return this.layout.data = this.exportData(), t && t.length === 1 && (t = t[0]), t;
  }
  exportConfig() {
    return {
      global: this.exportGlobal(),
      layouts: this.exportLayouts()
    };
  }
  render(t) {
    M.run(() => {
      this.element && this.element.clientWidth <= 0 || (typeof t == "function" && t(this.useLayout.data || [], this.useLayout, this.element), this.updateLayout(!0));
    });
  }
  _nestingMount(t = null) {
    t = t || K.nestingMountPointList;
    for (let n = 0; n < this.engine.items.length; n++) {
      const i = this.engine.items[n];
      for (let o = 0; o < t.length; o++)
        if (t[o].id === (i.nested || "").replace("#", "")) {
          let l = t[o];
          l = l.cloneNode(!0), i.element.appendChild(l);
          break;
        }
    }
  }
  toItemList(t) {
    return t.map((n) => this.engine.createItem(n));
  }
  unmount(t = !1) {
    this.engine.unmount(t), this._mounted = !1, this._disconnect_(), this.eventManager._callback_("containerUnmounted", this);
  }
  remount() {
    this.engine.remount();
  }
  remove(t) {
    this.engine.items.forEach((n) => {
      t === n && n.remove();
    });
  }
  updateLayout(t = null, n = []) {
    this.engine.updateLayout(t, n);
  }
  _disconnect_() {
    this.__ownTemp__.observer.disconnect();
  }
  _observer_() {
    this.__store__;
    const t = () => {
      if (!this._mounted)
        return;
      const o = this.element.clientWidth, l = this.element.clientHeight;
      if (o <= 0 || l <= 0)
        return;
      let s = this.engine.layoutConfig.genLayoutConfig(o, l), { useLayout: a, customLayout: m } = s;
      const h = this.eventManager._callback_("mountPointElementResizing", s, o, this.container);
      if (!(h === null || h === !1)) {
        if (typeof h == "object" && (a = h), this.px && a.px && this.px !== a.px) {
          this.platform, this.eventManager._callback_("useLayoutChange", m, o, this.container);
          const d = this._VueEvents.vueUseLayoutChange;
          typeof d == "function" && d(s);
        }
        this.engine.updateLayout(!0);
      }
    }, n = (o, l = 350) => {
      let s = this.__ownTemp__;
      return function() {
        s.deferUpdatingLayoutTimer && clearTimeout(s.deferUpdatingLayoutTimer), s.deferUpdatingLayoutTimer = setTimeout(() => {
          o.apply(this, arguments), s.deferUpdatingLayoutTimer = null;
        }, l);
      };
    }, i = () => {
      t(), n(() => {
        t();
      }, 100)();
    };
    this.__ownTemp__.observer = new yt(W(i, 50)), this.__ownTemp__.observer.observe(this.element);
  }
  isBlank(t, n) {
    return this.engine._isCanAddItemToContainer_(t, n);
  }
  add(t) {
    return t.container = this, t.parentElement = this.contentElement, t instanceof ne || (t = this.engine.createItem(t)), this.engine.addItem(t);
  }
  find(t) {
    return this.engine.findItem(t);
  }
  updateContainerStyleSize() {
    this.updateStyle(this.genContainerStyle(), this.contentElement);
  }
  _collectNestingMountPoint() {
    for (let t = 0; t < this.element.children.length; t++)
      K.nestingMountPointList.includes(this.element.children[t]) || K.nestingMountPointList.push(document.adoptNode(this.element.children[t]));
  }
  _isNestingContainer_(t = null) {
    if (t = t || this.element, !!t)
      for (; ; ) {
        if (t.parentElement === null) {
          this.__ownTemp__.offsetPageX = this.contentElement.offsetLeft, this.__ownTemp__.offsetPageY = this.contentElement.offsetTop;
          break;
        }
        if (t = t.parentElement, t._isGridItem_) {
          const n = t._gridItem_;
          this.__ownTemp__.offsetPageX = n.element.offsetLeft + n.container.__ownTemp__.offsetPageX, this.__ownTemp__.offsetPageY = n.element.offsetTop + n.container.__ownTemp__.offsetPageY, t._gridItem_.container.childContainer.push({
            parent: t._gridItem_.container,
            container: this,
            nestingItem: t._gridItem_
          }), t._gridItem_.nested = !0, this.isNesting = !0, this.parentItem = n;
          break;
        }
      }
  }
  _childCollect() {
    const t = [];
    return Array.from(this.contentElement.children).forEach((n, i) => {
      let o = Object.assign({}, n.dataset);
      const l = this.add({ el: n, ...o });
      l && (l.name = l.getAttr("name")), t.push(t);
    }), t;
  }
  test() {
    this.margin = [10, 10], this.mount();
    for (let t = 0; t < 20; t++)
      this.add({
        w: Math.ceil(Math.random() * 2),
        h: Math.ceil(Math.random() * 2)
      }).mount();
  }
  testUnmount() {
    this.engine.getItemList().forEach((t, n) => {
      t.mount();
      let i = setTimeout(() => {
        t.unmount(), clearTimeout(i), i = null;
      }, n * 1e3);
    });
  }
}
const xt = {
  __name: "GridContainer",
  props: {
    render: { required: !1, type: Function, default: null },
    layoutChange: { required: !1, type: Function, default: null },
    containerAPI: { required: !1, type: Object, default: {} },
    useLayout: { required: !0, type: Object, default: null },
    events: { required: !1, type: Object },
    components: { required: !1, type: Object, default: {} },
    config: {
      required: !0,
      type: Object,
      default: {
        layouts: { required: !0, type: [Object, Array] },
        global: { required: !1, type: Object }
      }
    }
  },
  setup(c) {
    const e = c, t = ee(null), n = ee(null), i = new wt({
      platform: "vue",
      layouts: e.config.layouts,
      events: e.events,
      global: e.config.global
    });
    let o = {}, l = !1;
    return Ye("_grid_item_components_", e.components), Ie(() => {
      i.el = t.value, i.engine.init(), i.vue = e, Q(() => {
        o = i.engine.layoutConfig.genLayoutConfig(t.value.clientWidth, t.value.clientHeight), n.value._isGridContainerArea = !0;
        const s = Y(o.customLayout);
        e.render === null ? Object.assign(e.useLayout, s) : typeof e.render == "function" && e.render(s, o.useLayout, e.config.layouts), i.mount();
      }), setTimeout(() => {
        let s = i.exportData(["initialX", "initialY"]);
        s = s.map((a) => {
          const m = a.pos;
          return m.initialX || delete m.x, m.initialY || delete m.y, delete m.initialX, delete m.initialY, a;
        }), e.useLayout.data && e.useLayout.data.length !== s.length && (e.useLayout.data = [], Q(() => {
          e.useLayout.data = s, o.layout.data = s, i.updateLayout(!0);
        }));
      }), e.containerAPI.getContainer = () => i, e.containerAPI.exportData = () => i.exportData(), e.containerAPI.exportGlobal = () => i.exportGlobal(), e.containerAPI.exportLayouts = () => i.exportLayouts(), e.containerAPI.exportConfig = () => i.exportConfig(), i._VueEvents.vueUseLayoutChange = (s) => {
        l = !0, e.useLayout.data = [], Q(() => {
          o = s;
          const a = Y(s.customLayout);
          for (let m in e.useLayout)
            delete e.useLayout[m];
          e.layoutChange === null ? Object.assign(e.useLayout, s.customLayout) : typeof e.layoutChange == "function" && (l = !1, e.layoutChange(a, s.useLayout, i.layouts));
        });
      }, i._VueEvents.vueCrossContainerExchange = (s, a, m) => {
        const h = s.exportConfig();
        s.pos.nextStaticPos && (h.pos.nextStaticPos = s.pos.nextStaticPos, h.pos.x = s.pos.nextStaticPos.x, h.pos.y = s.pos.nextStaticPos.y), h.pos.doItemCrossContainerExchange = (d) => {
          a.exchangeItems.old = a.fromItem, a.exchangeItems.new = d, a.moveItem = d, a.fromItem = d, m(d);
        }, e.useLayout.data.push(h), Q(() => {
          i.updateLayout(!0);
        });
      };
    }), T(e.useLayout, () => {
      if (!l) {
        for (let s in e.useLayout) {
          const a = e.useLayout[s], m = typeof a;
          !Array.isArray(a) && ["data", "margin", "size"].includes(s) && console.error(s, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2A\u6570\u7EC4"), m !== "boolean" && ["responsive", "followScroll", "exchange", "slidePage", "autoGrowRow", "autoReorder"].includes(s) && console.error(s, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2Aboolean\u503C"), (m !== "number" || isNaN(a) || !isFinite(a)) && [
            "col",
            "row",
            "marginX",
            "marginY",
            "sizeWidth",
            "sizeHeight",
            "minCol",
            "maxCol",
            "minRow",
            "maxRow",
            "ratioCol",
            "ratioRow",
            "sensitivity",
            "pressTime",
            "scrollWaitTime",
            "scrollSpeedX",
            "scrollSpeedY",
            "resizeReactionDelay"
          ].includes(s) && console.error(s, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2A\u975ENaN\u7684number\u503C"), m !== "string" && ["responseMode", "className"].includes(s) && (s === "responseMode" ? console.error(s, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2Astring\u503C", "\u4E14\u6709\u4E09\u79CD\u5E03\u5C40\u4EA4\u6362\u6A21\u5F0F\uFF0C\u5206\u522B\u662Fdefault,exchange,stream") : console.error(s, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2Astring\u503C")), m !== "object" && ["itemLimit"].includes(s) && (s === "itemLimit" ? console.error(s, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2Aobject\u503C,\u5305\u542B\u53EF\u9009\u952EminW,minH,maxH,maxW\u4F5C\u7528\u4E8E\u6240\u6709Item\u5927\u5C0F\u9650\u5236") : console.error(s, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2Aobject\u503C")), o.layout[s] = ce(a);
        }
        i.updateLayout(!0);
      }
    }, { deep: !0 }), (s, a) => (fe(), Ce("div", {
      ref_key: "gridContainer",
      ref: t,
      style: { display: "block" }
    }, [
      Be("div", {
        ref_key: "gridContainerArea",
        ref: n,
        class: "grid-container-area",
        style: { display: "block", position: "relative" }
      }, [
        be(s.$slots, "default")
      ], 512)
    ], 512));
  }
}, ve = {
  GridContainer: xt,
  GridItem: Ue
}, he = (c) => {
  he.installed || (he.installed = !0, Object.keys(ve).forEach((e) => c.component(e, ve[e])));
}, Ct = {
  install: he
};
export {
  xt as GridContainer,
  Ue as GridItem,
  Ct as default,
  he as install
};
