var He = Object.defineProperty;
var Pe = (u, e, t) => e in u ? He(u, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : u[e] = t;
var c = (u, e, t) => (Pe(u, typeof e != "symbol" ? e + "" : e, t), t);
import { getCurrentInstance as We, ref as ee, inject as Ne, useAttrs as De, toRaw as ce, onMounted as Ie, onUnmounted as Fe, openBlock as fe, createElementBlock as be, unref as le, createBlock as Xe, renderSlot as Ee, watch as T, defineAsyncComponent as Ye, provide as Be, nextTick as Q, createElementVNode as qe } from "vue";
function P(u, e = 350) {
  let t, n, i = 0;
  return function() {
    t = this, n = arguments;
    let o = new Date().valueOf();
    o - i > e && (u.apply(t, n), i = o);
  };
}
function Ue(u) {
  return u.replace(/[A-Z]/g, function(e) {
    return "-" + e.toLowerCase();
  });
}
const q = (u = {}, e = {}, t = !1, n = []) => {
  const i = {};
  return Object.keys(e).forEach((o) => {
    Object.keys(u).includes(o) && !n.includes(o) && (t ? i[o] = e[o] !== void 0 ? e[o] : u[o] : u[o] = e[o] !== void 0 ? e[o] : u[o]);
  }), t ? i : u;
}, V = (u) => {
  let e = Array.isArray(u) ? [] : {};
  if (u && typeof u == "object")
    for (let t in u)
      u.hasOwnProperty(t) && (u[t] && typeof u[t] == "object" ? e[t] = V(u[t]) : e[t] = u[t]);
  return e;
}, de = (u, e) => {
  const t = [];
  if (e.touchTarget)
    u = e.touchTarget;
  else {
    if (e.composedPath)
      return e.composedPath();
    u = document.elementFromPoint(e.clientX, e.clientY);
  }
  if (u instanceof Element)
    do
      t.push(u), u = u.parentNode;
    while (u && u.parentNode);
  return t;
}, Le = (u) => {
  let e;
  if (u instanceof Element)
    do {
      if (u._isGridContainer_) {
        e = u._gridContainer_;
        break;
      }
      u = u.parentNode;
    } while (u.parentNode);
  return e;
}, H = (u, e = !1) => {
  let t = null;
  const n = u.touchTarget ? u.touchTarget : u.target;
  if (n._isGridContainer_)
    t = n._gridContainer_;
  else {
    const i = u.target || u.toElement || u.srcElement, o = de(i, u);
    for (let s = 0; s < o.length && !(o[s]._isGridContainer_ && (t = o[s]._gridContainer_, !e)); s++)
      ;
  }
  return t;
}, Ge = (u, e = !1) => {
  let t = null;
  const n = u.touchTarget ? u.touchTarget : u.target;
  if (n._isGridContainerArea)
    t = n;
  else {
    const i = u.target || u.toElement || u.srcElement, o = de(i, u);
    for (let s = 0; s < o.length && !(o[s]._isGridContainerArea && (t = o[s], !e)); s++)
      ;
  }
  return t;
}, j = (u, e = !1) => {
  let t = null;
  const n = u.touchTarget ? u.touchTarget : u.target;
  if (n._isGridItem_)
    t = n._gridItem_;
  else {
    const i = u.target || u.toElement || u.srcElement, o = de(i, u);
    for (let s = 0; s < o.length && !(o[s]._isGridItem_ && (t = o[s]._gridItem_, !e)); s++)
      ;
  }
  return t;
}, ae = (u) => {
  let e = "touches";
  if (u.touches && u.touches.length === 0 && (e = "changedTouches"), u[e] && u[e].length) {
    for (let t in u[e][0])
      ["target"].includes(t) || u[t] === void 0 && (u[t] = u[e][0][t]);
    u.touchTarget = document.elementFromPoint(u.clientX, u.clientY);
  }
  return u;
}, je = {
  name: "GridItem",
  inheritAttrs: !1
}, Ve = /* @__PURE__ */ Object.assign(je, {
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
  setup(u) {
    const e = u;
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
    let o, s = null, l = {}, a = ee(!1);
    const m = Ne("_grid_item_components_"), h = () => {
      const f = m[e.type];
      f ? typeof f != "function" && console.error("components\u4E2D\u7684", e.type, '\u5E94\u8BE5\u662F\u4E00\u4E2A\u51FD\u6570,\u5E76\u4F7F\u7528import("XXX")\u5F02\u6B65\u5BFC\u5165') : console.error("\u672A\u5728components\u4E2D\u5B9A\u4E49", e.type, "\u7EC4\u4EF6"), o = Ye(f);
    };
    e.type && Object.keys(m).length > 0 && (l = {
      ...De(),
      ...ce(e)
    }, h(), a.value = !0);
    const d = () => {
      if (!s)
        return;
      const f = s.col, _ = s.row, y = s.engine.layoutConfig.autoSetColAndRows(s);
      (f !== y.col || _ !== y.row) && s.updateContainerStyleSize();
    };
    return Ie(() => {
      const f = ce(e);
      s = Le(t.value), s.__ownTemp__, e.pos.autoOnce = !e.pos.x || !e.pos.y;
      const _ = e.pos.doItemCrossContainerExchange;
      if (delete e.pos.doItemCrossContainerExchange, n = s.add({
        el: t.value,
        ...f
      }), !n) {
        t.value.parentNode.removeChild(t.value);
        return;
      }
      n.mount(), e.itemAPI.getItem = () => n, e.itemAPI.exportConfig = () => n.exportConfig(), typeof _ == "function" && _(n), n._VueEvents.vueItemResizing = (y, w, g) => {
        e.pos.w && e.pos.w !== w && (e.pos.w = w), e.pos.h && e.pos.h !== g && (e.pos.h = g);
      }, n._VueEvents.vueItemMovePositionChange = (y, w, g, L) => {
        e.pos.x && e.pos.x !== g && (e.pos.x = g), e.pos.y && e.pos.y !== L && (e.pos.y = L);
      }, d(), i();
    }), Fe(() => {
      n && n.remove(), d();
    }), (f, _) => (fe(), be("div", {
      class: "grid-item",
      ref_key: "gridItem",
      ref: t,
      style: { display: "block", position: "absolute", overflow: "hidden" }
    }, [
      le(a) ? (fe(), Xe(le(o), {
        key: 0,
        attrs: le(l)
      }, null, 8, ["attrs"])) : Ee(f.$slots, "default", { key: 1 })
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
    let n = 0, i = typeof e.timeout == "number" ? e.timeout : A.timeout, o = typeof e.intervalTime == "number" ? e.intervalTime : A.intervalTime, s = () => {
      let m;
      if (typeof e == "function")
        m = e.call(e, ...t);
      else if (typeof e == "object") {
        if (!e.func)
          throw new Error("func\u51FD\u6570\u5FC5\u987B\u4F20\u5165");
        m = e.func.call(e.func, ...t) || void 0;
      }
      e.callback && e.callback(m);
    }, l = () => e.rule ? e.rule() : A.ready;
    if (l())
      return s(), !0;
    let a = setInterval(() => {
      typeof e.max == "number" && e.max < n && (clearInterval(a), a = null), i < n * o && (clearInterval(a), a = null), l() && (clearInterval(a), a = null, s()), n++;
    }, o);
  }
};
let R = A;
c(R, "ready", !1), c(R, "ins", !1), c(R, "timeout", 12e3), c(R, "intervalTime", 50);
class te {
  constructor(e) {
    c(this, "el", null);
    c(this, "i", "");
    c(this, "w", 1);
    c(this, "h", 1);
    c(this, "x", null);
    c(this, "y", null);
    c(this, "initialX", null);
    c(this, "initialY", null);
    c(this, "col", null);
    c(this, "row", null);
    c(this, "minW", 1);
    c(this, "maxW", 1 / 0);
    c(this, "minH", 1);
    c(this, "maxH", 1 / 0);
    c(this, "iName", "");
    c(this, "nextStaticPos", null);
    c(this, "tempW", null);
    c(this, "tempH", null);
    c(this, "beforePos", null);
    c(this, "autoOnce", null);
    c(this, "posHash", "");
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
    return q(this, this._typeCheck(e)), this;
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
const B = {
  gridContainerArea: {
    display: "block"
  },
  gridContainer: {
    height: "auto",
    width: "100%",
    position: "relative",
    display: "block",
    margin: "0 auto",
    mosUserSelect: "none",
    webkitUserSelect: "none",
    msUserSelect: "none",
    userSelect: "none"
  },
  gridItem: {
    height: "100%",
    width: "100%",
    display: "block",
    overflow: "hidden",
    position: "absolute",
    touchCallout: "none",
    mosUserSelect: "none",
    webkitUserSelect: "none",
    msUserSelect: "none",
    userSelect: "none"
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
c(N, "ins", !1), c(N, "store", {
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
}), c(N, "ItemStore", {});
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
    document.addEventListener("mousedown", M.container.touchstartOrMousedown), document.addEventListener("touchstart", M.container.touchstartOrMousedown, { passive: !1 }), document.addEventListener("dragstart", p.prevent.false), document.addEventListener("selectstart", p.prevent.defaultAndFalse, !1), document.addEventListener("mousemove", M.container.touchmoveOrMousemove), document.addEventListener("touchmove", M.container.touchmoveOrMousemove, { passive: !1 }), document.addEventListener("mouseup", M.container.touchendOrMouseup), document.addEventListener("touchend", M.container.touchendOrMouseup, { passive: !1 }), document.addEventListener("mouseleave", p.windowResize.setResizeFlag), document.addEventListener("mouseenter", p.windowResize.removeResizeFlag);
  }
  static removeGlobalEvent() {
    document.removeEventListener("mousedown", M.container.touchstartOrMousedown), document.removeEventListener("touchstart", M.container.touchstartOrMousedown), document.removeEventListener("dragstart", p.prevent.false), document.removeEventListener("selectstart", p.prevent.defaultAndFalse), document.removeEventListener("mousemove", M.container.touchmoveOrMousemove), document.removeEventListener("touchmove", M.container.touchmoveOrMousemove), document.removeEventListener("mouseup", M.container.touchendOrMouseup), document.removeEventListener("touchend", M.container.touchendOrMouseup), document.removeEventListener("mouseleave", p.windowResize.setResizeFlag), document.removeEventListener("mouseenter", p.windowResize.removeResizeFlag);
  }
  static startEvent(e = null, t = null) {
    r.editItemNum === 0 && se.startGlobalEvent();
  }
  static removeEvent(e = null, t = null) {
    t && !t.draggable && t.resize, r.editItemNum === 0 && se.removeGlobalEvent();
  }
};
let D = se;
c(D, "_eventEntrustFunctor", {
  itemResize: {
    doResize: P((e) => {
      const t = r.mousedownEvent, n = r.isLeftMousedown, i = r.fromItem;
      if (i === null || t === null || !n)
        return;
      const o = i.container;
      r.cloneElement === null && (r.cloneElement = i.element.cloneNode(!0), r.cloneElement.classList.add("grid-clone-el", "grid-resizing-clone-el"), r.cloneElement && r.fromContainer.contentElement.appendChild(r.cloneElement), i.updateStyle({ transition: "none" }, r.cloneElement), i.addClass("grid-resizing-source-el"));
      const s = i.container.contentElement.getBoundingClientRect();
      let l = e.pageX - s.left - window.scrollX - i.offsetLeft(), a = e.pageY - s.top - window.scrollY - i.offsetTop();
      const m = {
        w: Math.ceil(l / (i.size[0] + i.margin[0])),
        h: Math.ceil(a / (i.size[1] + i.margin[1]))
      };
      m.w < 1 && (m.w = 1), m.h < 1 && (m.h = 1);
      const h = ({ w: y, h: w }) => {
        const g = i.pos;
        return i.resizeOut && y + g.x > o.col && (y = o.col - g.x + 1), y < g.minW && (y = g.minW), y > g.maxW && g.maxW !== 1 / 0 && (y = g.maxW), i.resizeOut && w + g.y > o.row && (w = o.row - g.y + 1), w < g.minH && (w = g.minH), w > g.maxH && g.maxH !== 1 / 0 && (w = g.maxH), {
          w: y,
          h: w
        };
      }, d = () => (l > i.maxWidth() && (l = i.maxWidth()), a > i.maxHeight() && (a = i.maxHeight()), l < i.minWidth() && (l = i.minWidth()), a < i.minHeight() && (a = i.minHeight()), {
        width: l,
        height: a
      });
      let f = h(m);
      if (f = (({ w: y, h: w }) => {
        const g = d(), L = i.container.engine.findStaticBlankMaxMatrixFromItem(i), O = {};
        return y > L.minW && w > L.minH ? !1 : (L.maxW >= y ? (O.width = g.width + "px", i.pos.w = y) : y = i.pos.w, L.maxH >= w ? (O.height = g.height + "px", i.pos.h = w) : w = i.pos.h, Object.keys(O).length > 0 && i.updateStyle(O, r.cloneElement), {
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
    defaultAndFalse: (e) => (e.preventDefault(), !1),
    contextmenu: (e) => e.preventDefault()
  },
  windowResize: {
    setResizeFlag: () => r.isWindowResize = !0,
    removeResizeFlag: () => r.isWindowResize = !1
  },
  moveOuterContainer: {
    leaveToEnter: function(e, t) {
      if (!e || !t)
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
          R.run({
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
          let s = n.element;
          const l = new ne({
            pos: o.pos,
            size: e.size,
            margin: e.margin,
            el: s,
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
          }), a = n.container.eventManager._callback_("crossContainerExchange", o, l);
          if (a === !1 || a === null)
            return;
          const m = (f) => {
            typeof t == "function" && t(f);
          }, h = () => {
            e._VueEvents.vueCrossContainerExchange(l, r, (f) => {
              o.unmount(), o.remove(), r.deviceEventMode === "touch" && r.cloneElement && r.cloneElement.appendChild(document.adoptNode(o.element)), m(f), e && (o !== f && !o.container.responsive ? o.container.engine.updateLayout([o]) : o.container.engine.updateLayout(!0));
            });
          }, d = () => {
            e.responsive ? l.pos.autoOnce = !0 : e.responsive || (l.pos.autoOnce = !1), e.add(l), o.unmount(), o.remove(), e && (l.container.responsive ? l.container.engine.updateLayout(!0) : l.container.engine.updateLayout([l]), o !== l && !o.container.responsive ? o.container.engine.updateLayout([o]) : o.container.engine.updateLayout(!0)), l.mount(), r.moveItem = l, r.fromItem = l, r.exchangeItems.old = o, r.exchangeItems.new = l, m(l);
          };
          e.__ownTemp__.firstEnterUnLock = !1, e.__ownTemp__.nestingEnterBlankUnLock = !1, e.platform === "vue" ? h() : d();
        } catch (s) {
          console.error("\u8DE8\u5BB9\u5668Item\u79FB\u52A8\u51FA\u9519", s);
        }
    },
    mousemoveFromItemChange: P((e) => {
      if (e.stopPropagation(), !r.isDragging)
        return;
      let t = r.fromItem, n = j(e);
      n && (r.toItem = n);
      const i = r.moveItem, o = r.mousedownEvent;
      if (t === null || o === null || !r.isLeftMousedown)
        return;
      let s = r.moveItem !== null ? i : t, l = s.container, a = null;
      if (s.exchange && (a = H(e), a && (l = a), s.container !== a && l.parentItem && l.parentItem === s) || !l.__ownTemp__.firstEnterUnLock && s.container && a && s.container !== a && (s.container.childContainer.length > 0 || a.childContainer.length > 0))
        return;
      const m = r.mousedownItemOffsetLeft * (l.size[0] / r.fromContainer.size[0]), h = r.mousedownItemOffsetTop * (l.size[1] / r.fromContainer.size[1]), d = l.contentElement.getBoundingClientRect(), f = e.pageX - m - (window.scrollX + d.left), _ = e.pageY - h - (window.scrollY + d.top);
      if (s.container.followScroll) {
        const x = l.contentElement.parentElement.getBoundingClientRect(), S = l.scrollSpeedX ? l.scrollSpeedX : Math.round(x.width / 20), z = l.scrollSpeedY ? l.scrollSpeedY : Math.round(x.height / 20), v = (W, F) => {
          const k = s.container.eventManager._callback_("autoScroll", W, F, s.container);
          if (k === !1 || k === null)
            return;
          typeof k == "object" && (typeof k.offset == "number" && (F = k.offset), ["X", "Y"].includes(k.direction) && (W = k.direction));
          const $ = l ? l.scrollWaitTime : 800;
          r.scrollReactionStatic === "stop" && (r.scrollReactionStatic = "wait", r.scrollReactionTimer = setTimeout(() => {
            r.scrollReactionStatic = "scroll", clearTimeout(r.scrollReactionTimer);
          }, $)), W === "X" && r.scrollReactionStatic === "scroll" && (l.contentElement.parentElement.scrollLeft += F), W === "Y" && r.scrollReactionStatic === "scroll" && (l.contentElement.parentElement.scrollTop += F);
        };
        let b = !1, E = !1;
        e.pageX - window.scrollX - x.left < x.width * 0.25 ? v("X", -S) : e.pageX - window.scrollX - x.left > x.width * 0.75 ? v("X", S) : b = !0, e.pageY - window.scrollY - x.top < x.height * 0.25 ? v("Y", -z) : e.pageY - window.scrollY - x.top > x.height * 0.75 ? v("Y", z) : E = !0, b && E && (r.scrollReactionStatic = "stop", clearTimeout(r.scrollReactionTimer));
      }
      const y = (C) => {
        const x = C / (l.size[0] + l.margin[0]);
        return x + s.pos.w >= l.containerW ? l.containerW - s.pos.w + 1 : Math.round(x) + 1;
      }, w = (C) => {
        const x = C / (l.size[1] + l.margin[1]);
        return x + s.pos.h >= l.containerH ? l.containerH - s.pos.h + 1 : Math.round(x) + 1;
      };
      let g = y(f), L = w(_);
      g < 1 && (g = 1), L < 1 && (L = 1), s.container.eventManager._callback_("itemMoving", g, L, s);
      const O = () => {
        if (s === n)
          return;
        let C, x, S = Date.now();
        x = e.screenX, C = e.screenY;
        const z = () => {
          let I = S - r.mouseSpeed.timestamp, G = Math.abs(x - r.mouseSpeed.endX), Z = Math.abs(C - r.mouseSpeed.endY), we = G > Z ? G : Z, ke = Math.round(we / I * 1e3);
          return r.mouseSpeed.endX = x, r.mouseSpeed.endY = C, r.mouseSpeed.timestamp = S, { distance: we, speed: ke };
        };
        if (!l.__ownTemp__.firstEnterUnLock) {
          const { distance: I, speed: G } = z();
          if (r.deviceEventMode === "mouse" && n && n.pos.w > 2 && n.pos.h > 2) {
            if (l.size[0] < 30 || l.size[1] < 30) {
              if (I < 3)
                return;
            } else if (l.size[0] < 60 || l.size[1] < 60) {
              if (I < 7)
                return;
            } else if (I < 10 || G < 10)
              return;
            if (s === null)
              return;
          }
        }
        const v = {
          x: g < 1 ? 1 : g,
          y: L < 1 ? 1 : L,
          w: s.pos.w,
          h: s.pos.h
        };
        let b = !1;
        const E = () => {
          if (!s.follow)
            return;
          const I = l.engine.findCoverItemFromPosition(v.x, v.y, v.w, v.h);
          I.length > 0 ? n = I.filter((Z) => s !== Z)[0] : b = !0;
        }, W = () => {
          const I = l.engine.findResponsiveItemFromPosition(v.x, v.y, v.w, v.h);
          !I || (n = I);
        };
        if (l.__ownTemp__.firstEnterUnLock ? E() : s.follow ? n ? E() : W() : E(), b && n && n.nested && (n = null), l.__ownTemp__.firstEnterUnLock) {
          if (!b && !n)
            return;
          if (s.pos.nextStaticPos = new te(s.pos), s.pos.nextStaticPos.x = v.x, s.pos.nextStaticPos.y = v.y, s.pos.autoOnce = !0, n) {
            if (r.fromItem.container.parentItem === n || s.container === n.container)
              return;
            p.itemDrag.mousemoveExchange(l, (I) => {
              l.engine.move(I, n.i);
            });
          } else
            p.itemDrag.mousemoveExchange(l);
          r.dragContainer = l;
          return;
        }
        if (!n)
          return;
        const F = s.element.getBoundingClientRect(), k = Math.abs(e.pageX - F.left - r.mousedownItemOffsetLeft) / n.element.clientWidth, $ = Math.abs(e.pageY - F.top - r.mousedownItemOffsetTop) / n.element.clientHeight, Oe = k > $;
        if (Math.abs(k - $) < l.sensitivity || l.__ownTemp__.exchangeLock === !0)
          return;
        const ge = 3, J = l.__ownTemp__.beforeOverItems;
        let _e = 0;
        for (let I = 0; I < J.length && !(I >= 3); I++)
          J[I] === n && _e++;
        if (_e >= ge) {
          l.__ownTemp__.exchangeLock = !0;
          let I = setTimeout(() => {
            l.__ownTemp__.exchangeLock = !1, clearTimeout(I), I = null;
          }, 200);
        } else if (J.length < ge && n.draggable && n.transition && n.transition.time) {
          l.__ownTemp__.exchangeLock = !0;
          let I = setTimeout(() => {
            l.__ownTemp__.exchangeLock = !1, clearTimeout(I), I = null;
          }, n.transition.time);
        }
        if (s !== n)
          l.__ownTemp__.beforeOverItems.unshift(n), J.length > 20 && l.__ownTemp__.beforeOverItems.pop();
        else
          return !1;
        const ye = s.container.eventManager._callback_("itemExchange", t, n);
        ye === !1 || ye === null || (l.responseMode === "default" ? Oe ? (l.engine.sortResponsiveItem(), l.engine.move(s, n.i)) : l.engine.exchange(s, n) : l.responseMode === "stream" ? (l.engine.sortResponsiveItem(), l.engine.move(s, n.i)) : l.responseMode === "exchange" && l.engine.exchange(s, n), l.engine.updateLayout(!0));
      }, Y = () => {
        if (!s.follow && !H(e))
          return;
        s.pos.nextStaticPos = new te(s.pos), s.pos.nextStaticPos.x = g < 1 ? 1 : g, s.pos.nextStaticPos.y = L < 1 ? 1 : L;
        let C = l.engine.findCoverItemFromPosition(
          s.pos.nextStaticPos.x,
          s.pos.nextStaticPos.y,
          s.pos.w,
          s.pos.h
        );
        C.length > 0 && (C = C.filter((x) => s !== x)), C.length === 0 ? (l.__ownTemp__.firstEnterUnLock ? (p.itemDrag.mousemoveExchange(l), r.dragContainer = l) : (s.pos.x !== s.pos.nextStaticPos.x || s.pos.y !== s.pos.nextStaticPos.y) && (s.pos.x = s.pos.nextStaticPos.x, s.pos.y = s.pos.nextStaticPos.y, s.pos.nextStaticPos = null, l.engine.updateLayout([s])), a && p.cursor.cursor !== "mousedown" && p.cursor.mousedown(e)) : s.pos.nextStaticPos = null;
      };
      R.run(() => {
        const C = Object.assign({}, s.pos);
        let x = l;
        if (a && a.__ownTemp__.firstEnterUnLock && (x = a), x.responsive ? O() : Y(), C.x !== s.pos.x || C.y !== s.pos.y) {
          const S = s._VueEvents.vueItemMovePositionChange;
          typeof S == "function" && S(C.x, C.y, s.pos.x, s.pos.y), s.container.eventManager._callback_("itemMovePositionChange", C.x, C.y, s.pos.x, s.pos.y);
        }
      });
    }, 36),
    mousemoveFromClone: (e) => {
      const t = r.mousedownEvent, n = r.fromItem, i = r.moveItem;
      if (t === null || n === null)
        return;
      let o = r.moveItem !== null ? i : n;
      const s = H(e);
      o.__temp__.dragging = !0, r.cloneElement === null ? (r.cloneElement = o.element.cloneNode(!0), r.cloneElement.classList.add("grid-clone-el", "grid-dragging-clone-el"), document.body.appendChild(r.cloneElement), o.addClass("grid-dragging-source-el"), o.updateStyle({
        pointerEvents: "none",
        transitionProperty: "none",
        transitionDuration: "none"
      }, r.cloneElement)) : s && s.__ownTemp__.firstEnterUnLock && R.run({
        func: () => {
          const m = r.fromItem, h = "grid-dragging-source-el";
          m.hasClass(h) || m.addClass(h);
        },
        rule: () => {
          var m;
          return s === ((m = r.fromItem) == null ? void 0 : m.container);
        },
        intervalTime: 2,
        timeout: 200
      });
      let l = e.pageX - r.mousedownItemOffsetLeft, a = e.pageY - r.mousedownItemOffsetTop;
      if (!o.dragOut) {
        const m = s.contentElement.getBoundingClientRect(), h = window.scrollX + m.left, d = window.scrollY + m.top, f = window.scrollX + m.left + s.contentElement.clientWidth - o.nowWidth(), _ = window.scrollY + m.top + s.contentElement.clientHeight - o.nowHeight();
        l < h && (l = h), l > f && (l = f), a < d && (a = d), a > _ && (a = _);
      }
      o.updateStyle({
        left: l + "px",
        top: a + "px"
      }, r.cloneElement);
    }
  }
}), c(D, "_eventPerformer", {
  item: {
    mouseenter: (e) => {
      if (e.stopPropagation(), !!H(e) && (e.target._gridItem_ && (r.toItem = j(e)), r.toItem === null))
        return !1;
    }
  },
  other: {
    updateSlidePageInfo: P((e, t) => {
      r.slidePageOffsetInfo.newestPageX = e, r.slidePageOffsetInfo.newestPageY = t;
    }),
    slidePage: (e) => {
      const t = H(e);
      if (!t || !t.slidePage)
        return;
      const n = t.element;
      let i = e.pageX - r.mousedownEvent.pageX, o = e.pageY - r.mousedownEvent.pageY;
      const s = r.slidePageOffsetInfo.offsetLeft - i, l = r.slidePageOffsetInfo.offsetTop - o;
      s >= 0 && (n.scrollLeft = s), l >= 0 && (n.scrollTop = l), M.other.updateSlidePageInfo(e.pageX, e.pageY);
    }
  },
  container: {
    mousedown: (e) => {
      var i;
      if (r.isDragging || r.isResizing)
        return;
      const t = H(e);
      if (!t || (r.fromItem = j(e), !t && !r.fromItem))
        return;
      r.fromItem && (r == null ? void 0 : r.fromItem.container) === t && !r.fromItem.static ? p.cursor.mousedown() : t && (!r.fromItem || (r == null ? void 0 : r.fromItem.container) !== t) && !e.touches && (p.cursor.mousedown(), r.slidePageOffsetInfo = {
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
            let l = !0;
            for (let a = 0; a < o.dragIgnoreEls.length; a++) {
              const m = o.dragIgnoreEls[a];
              if (m instanceof Element)
                e.target === m && (l = !1);
              else if (typeof m == "string") {
                const h = o.element.querySelectorAll(m);
                Array.from(h).forEach((d) => {
                  e.path.includes(d) && (l = !1);
                });
              }
              if (l === !1)
                return;
            }
          }
          if ((o.dragAllowEls || []).length > 0) {
            let l = !1;
            for (let a = 0; a < o.dragAllowEls.length; a++) {
              const m = o.dragAllowEls[a];
              if (m instanceof Element) {
                if (e.target === m) {
                  l = !0;
                  break;
                }
              } else if (typeof m == "string") {
                const h = o.element.querySelectorAll(m);
                Array.from(h).forEach((d) => {
                  e.path.includes(d) && (l = !0);
                });
              }
            }
            if (l === !1)
              return;
          }
          if (r.dragOrResize = "drag", r.fromItem.__temp__.dragging)
            return;
          const s = r.fromItem.element.getBoundingClientRect();
          r.mousedownItemOffsetLeft = e.pageX - (s.left + window.scrollX), r.mousedownItemOffsetTop = e.pageY - (s.top + window.scrollY);
        }
        r.isLeftMousedown = !0, r.mousedownEvent = e, r.fromContainer = ((i = r == null ? void 0 : r.fromItem) == null ? void 0 : i.container) || t, p.check.resizeOrDrag(e), r.fromItem && (r.fromItem.__temp__.clientWidth = r.fromItem.nowWidth(), r.fromItem.__temp__.clientHeight = r.fromItem.nowHeight(), r.offsetPageX = r.fromItem.offsetLeft(), r.offsetPageY = r.fromItem.offsetTop());
      }
    },
    mousemove: P((e) => {
      const t = Ge(e), n = Le(t), i = j(e);
      if (r.isLeftMousedown) {
        if (r.beforeContainerArea = r.currentContainerArea, r.currentContainerArea = t || null, r.beforeContainer = r.currentContainer, r.currentContainer = n || null, r.currentContainerArea !== null && r.beforeContainerArea !== null ? r.currentContainerArea !== r.beforeContainerArea && p.moveOuterContainer.leaveToEnter(r.beforeContainer, r.currentContainer) : (r.currentContainerArea !== null || r.beforeContainerArea !== null) && (r.beforeContainerArea === null && p.moveOuterContainer.mouseenter(null, r.currentContainer), r.currentContainerArea === null && p.moveOuterContainer.mouseleave(null, r.beforeContainer)), r.dragOrResize === "slidePage") {
          M.other.slidePage(e);
          return;
        }
        const o = () => {
          r.moveItem || r.fromItem, n ? n && (i ? i.static && p.cursor.cursor !== "drag-to-item-no-drop" && p.cursor.dragToItemNoDrop() : !i && n.responsive && p.cursor.cursor !== "mousedown" && p.cursor.mousedown()) : p.cursor.cursor !== "no-drop" && p.cursor.notDrop();
        };
        r.isDragging ? (p.itemDrag.mousemoveFromClone(e), o()) : r.isResizing && p.itemResize.doResize(e);
      } else if (i) {
        const o = e.target.classList;
        o.contains("grid-item-close-btn") ? p.cursor.cursor !== "item-close" && p.cursor.itemClose() : o.contains("grid-item-resizable-handle") ? p.cursor.cursor !== "item-resize" && p.cursor.itemResize() : i.static && n ? p.cursor.cursor !== "static-no-drop" && p.cursor.staticItemNoDrop() : p.cursor.cursor !== "in-container" && p.cursor.inContainer();
      } else
        H(e) ? p.cursor.cursor !== "in-container" && p.cursor.inContainer() : p.cursor.cursor !== "default" && p.cursor.default();
    }, 12),
    mouseup: (e) => {
      const t = H(e);
      r.isResizing && p.itemResize.mouseup(e), t && p.cursor.cursor !== "in-container" && p.cursor.inContainer();
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
      const s = r.mouseDownElClassName;
      if (s && s.includes("grid-item-close-btn") && (e.touchTarget ? e.touchTarget : e.target).classList.contains("grid-item-close-btn")) {
        const m = j(e);
        if (m === r.fromItem) {
          const h = m.container.eventManager._callback_("itemClosing", m);
          h === null || h === !1 || (m.remove(!0), m.container.engine.updateLayout(!0), m.container.eventManager._callback_("itemClosed", m));
        }
      }
      const l = r.moveContainer ? r.moveContainer : r.fromContainer;
      if (l && (l.__ownTemp__.firstEnterUnLock = !1, l.__ownTemp__.exchangeLock = !1, l.__ownTemp__.beforeOverItems = [], l.__ownTemp__.moveCount = 0, r.fromContainer && l !== r.fromContainer && (r.fromContainer.__ownTemp__.firstEnterUnLock = !1)), n && (n.container.engine.updateLayout(!0), n.container.childContainer.forEach((h) => {
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
        document.addEventListener("contextmenu", p.prevent.defaultAndFalse);
        const n = t ? t.pressTime : 300;
        r.timeOutEvent = setTimeout(() => {
          e.preventDefault && e.preventDefault(), r.allowTouchMoveItem = !0, M.container.mousemove(e);
          let i = setTimeout(() => {
            document.removeEventListener("contextmenu", p.prevent.defaultAndFalse), clearTimeout(i), i = null;
          }, 600);
          clearTimeout(r.timeOutEvent);
        }, n);
      }
      M.container.mousedown(e);
    },
    touchmoveOrMousemove: (e) => {
      if (e = e || window.event, e.stopPropagation && e.stopPropagation(), e.touches) {
        if (r.deviceEventMode = "touch", r.allowTouchMoveItem)
          e.preventDefault && e.preventDefault();
        else {
          clearTimeout(r.timeOutEvent);
          return;
        }
        e = ae(e);
      } else
        r.deviceEventMode = "mouse";
      p.itemDrag.mousemoveFromItemChange(e), M.container.mousemove(e);
    },
    touchendOrMouseup: (e) => {
      e = e || window.event, e.touches ? (clearTimeout(r.timeOutEvent), r.allowTouchMoveItem = !1, r.deviceEventMode = "touch", e = ae(e), document.removeEventListener("contextmenu", p.prevent.contextmenu)) : r.deviceEventMode = "mouse", M.container.mouseup(e);
    }
  }
});
const p = D._eventEntrustFunctor, M = D._eventPerformer;
class ze {
  constructor() {
    c(this, "element", null);
    c(this, "observer", null);
  }
  updateStyle(e, t = null, n = !0) {
    if (Object.keys(e).length === 0)
      return;
    t = t || this.element;
    let i = "";
    Object.keys(e).forEach((o) => {
      n ? i = `${i} ${Ue(o)}:${e[o]}; ` : t.style[o] = e[o];
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
      this.observer = new o(P(e, t));
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
    e.includes("on") || (e = "on" + e), o[e] || (o[e] = P(t, i));
  }
  addEvent(e, t, n = null, i = {}) {
    let o = 350, s = !1;
    i.throttleTime && (o = i.throttleTime), i.capture && (s = i.capture);
    const l = n || this.element, a = P(t, o);
    return l.addEventListener(e, a, s), a;
  }
  removeEvent(e, t, n = null) {
    (n || this.element).removeEventListener(e, t);
  }
  throttle(e, t) {
    return P(e, t);
  }
}
const ue = N.store;
class ne extends ze {
  constructor(t) {
    super();
    c(this, "el", "");
    c(this, "name", "");
    c(this, "type", null);
    c(this, "follow", !0);
    c(this, "dragOut", !0);
    c(this, "resizeOut", !1);
    c(this, "className", "grid-item");
    c(this, "dragIgnoreEls", []);
    c(this, "dragAllowEls", []);
    c(this, "transition", null);
    c(this, "draggable", null);
    c(this, "resize", null);
    c(this, "close", null);
    c(this, "static", !1);
    c(this, "exchange", !0);
    c(this, "margin", [null, null]);
    c(this, "size", [null, null]);
    c(this, "i", null);
    c(this, "element", null);
    c(this, "container", null);
    c(this, "tagName", "div");
    c(this, "classList", []);
    c(this, "attr", []);
    c(this, "pos", {});
    c(this, "autoOnce", null);
    c(this, "edit", null);
    c(this, "nested", !1);
    c(this, "parentElement", null);
    c(this, "_VueEvents", {});
    c(this, "_mounted", !1);
    c(this, "_resizeTabEl", null);
    c(this, "_closeEl", null);
    c(this, "__temp__", {
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
    c(this, "exportConfig", (t = [], n = []) => {
      const i = this, o = {};
      let s = {};
      s = i.pos.export(t), n.includes("x") && delete s.x, n.includes("y") && delete s.y, o.pos = s, Array.from(["static", "draggable", "resize", "close"]).forEach((a) => {
        i[a] !== !1 && (o[a] = i[a]);
      }), Array.from(["follow", "dragOut", "resizeOut", "exchange"]).forEach((a) => {
        i[a] !== !0 && (o[a] = i[a]);
      }), typeof i.name == "string" && (o.name = i.name), typeof i.type == "string" && (o.type = i.type);
      let l = {};
      return i.transition.field !== "top,left,width,height" ? (l.field = i.transition.field, i.transition.time !== 180 && (l.time = i.transition.time), o.transition = l) : i.transition.time !== 180 && (o.transition = i.transition.time), o;
    });
    c(this, "nowWidth", (t) => {
      let n = 0;
      const i = t || (this.pos.tempW ? this.pos.tempW : this.pos.w);
      return i > 1 && (n = (i - 1) * this.margin[0]), i * this.size[0] + n;
    });
    c(this, "nowHeight", (t) => {
      let n = 0;
      const i = t || (this.pos.tempH ? this.pos.tempH : this.pos.h);
      return i > 1 && (n = (i - 1) * this.margin[1]), i * this.size[1] + n;
    });
    c(this, "minHeight", () => {
      let t = 0;
      return this.pos.minH === 1 / 0 ? 1 / 0 : (this.pos.minH > 1 && (t = (this.pos.minH - 1) * this.margin[1]), this.pos.minH * this.size[1] + t);
    });
    c(this, "maxHeight", () => {
      let t = 0;
      return this.pos.maxH === 1 / 0 ? 1 / 0 : (t = (this.pos.maxH - 1) * this.margin[1], this.pos.maxH * this.size[1] + t);
    });
    c(this, "_genItemStyle", () => this.styleLock() ? {} : {
      width: this.nowWidth() + "px",
      height: this.nowHeight() + "px",
      left: this.offsetLeft() + "px",
      top: this.offsetTop() + "px"
    });
    c(this, "_genLimitSizeStyle", () => this.styleLock() ? {} : {
      minWidth: this.minWidth() + "px",
      minHeight: this.minHeight() + "px",
      maxWidth: this.maxWidth() + "px",
      maxHeight: this.maxHeight() + "px"
    });
    t.el instanceof Element && (this.el = t.el, this.element = t.el), this._define(), q(this, t), this.pos = new te(t.pos), this._itemSizeLimitCheck();
  }
  _define() {
    const t = this;
    let n = !1, i = !1, o = !1, s = !1, l = {
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
        get: () => s,
        set(a) {
          if (typeof a == "boolean") {
            if (s === a)
              return;
            s = a, t._edit(s);
          }
        }
      },
      transition: {
        configurable: !1,
        get: () => l,
        set(a) {
          a === !1 && (l.time = 0), typeof a == "number" && (l.time = a), typeof a == "object" && (a.time && a.time !== l.time && (l.time = a.time), a.field && a.field !== l.field && (l.field = a.field)), t.animation(l);
        }
      }
    });
  }
  mount() {
    const t = () => {
      this._mounted || (this.container.platform !== "vue" && (this.element === null && (this.element = document.createElement(this.tagName)), this.container.contentElement.appendChild(this.element)), this.attr = Array.from(this.element.attributes), this.element.classList.add(this.className), this.classList = Array.from(this.element.classList), this.updateStyle(B.gridItem), this.updateStyle(this._genItemStyle()), this.__temp__.w = this.pos.w, this.__temp__.h = this.pos.h, this.element._gridItem_ = this, this.element._isGridItem_ = !0, this._mounted = !0, this.container.eventManager._callback_("itemMounted", this));
    };
    this.container.platform === "vue" ? t() : R.run(t);
  }
  unmount(t = !1) {
    R.run(() => {
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
    R.run({
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
        const s = document.createElement("span");
        s.innerHTML = "\u22BF", this.updateStyle(B.gridResizableHandle, s), this.element.appendChild(s), s.classList.add(i), this._resizeTabEl = s;
      } else if (this.element && t === !1)
        for (let o = 0; o < this.element.children.length; o++) {
          const s = this.element.children[o];
          s.className.includes(i) && (this.element.removeChild(s), this._resizeTabEl = null);
        }
    };
    this.element ? n() : R.run(n);
  }
  _closeBtn(t = !1) {
    const n = () => {
      const i = "grid-item-close-btn";
      if (t && this._closeEl === null) {
        const o = document.createElement("div");
        this.updateStyle(B.gridItemCloseBtn, o), this._closeEl = o, o.classList.add(i), this.element.appendChild(o), o.innerHTML = B.gridItemCloseBtn.innerHTML;
      }
      if (this._closeEl !== null && !t)
        for (let o = 0; o < this.element.children.length; o++) {
          const s = this.element.children[o];
          s.className.includes(i) && (this.element.removeChild(s), this._closeEl = null);
        }
    };
    this.element ? n() : R.run(n);
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
    c(this, "isDebugger", !1);
    c(this, "DebuggerTemp", {});
    c(this, "count", 0);
    c(this, "_mode", "grid");
    c(this, "_layoutMatrix", []);
    c(this, "layoutPositions", []);
    c(this, "col", null);
    c(this, "minRow", null);
    c(this, "maxRow", null);
    c(this, "row", null);
    c(this, "isAutoRow", !1);
    c(this, "iNameHash", "");
    c(this, "addRow", (e = null) => {
      if (!!e) {
        for (let t = 0; t < e; t++)
          this._layoutMatrix.push(new Array(this.col).fill(!1));
        this.row = this._layoutMatrix.length;
      }
    });
    c(this, "addCol", (e = null) => {
      if (!!e) {
        for (let t = 0; t < this._layoutMatrix.length; t++)
          for (let n = 0; n < e; n++)
            this._layoutMatrix[t].push(!1);
        this._layoutMatrix.length > 0 && (this.col = this._layoutMatrix[0].length);
      }
    });
    c(this, "removeOneRow", () => this._layoutMatrix.length === 0 ? (console.log("\u6805\u683C\u5185\u884C\u6570\u5DF2\u7ECF\u4E3A\u7A7A"), !1) : this._layoutMatrix[this._layoutMatrix.length - 1].includes(!0) ? (console.log("\u8BA1\u5212\u5220\u9664\u7684\u6805\u683C\u5185\u5B58\u5728\u7EC4\u4EF6,\u672A\u5220\u9664\u5305\u542B\u7EC4\u4EF6\u7684\u6805\u683C"), !1) : (this._layoutMatrix.pop(), this.row = this._layoutMatrix.length, !0));
    c(this, "removeBlankRow", (e) => {
      for (let t = 0; t < e; t++)
        if (!this.removeOneRow())
          return;
    });
    c(this, "findItem", (e, t = !1) => {
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
    let s = !0;
    const l = this.toINameHash(e.i), a = e.x + e.w - 1, m = e.y + e.h - 1;
    if (a > this.col || m > this.row)
      return !1;
    for (let h = n - 1; h <= o - 1; h++)
      for (let d = t - 1; d <= i - 1; d++) {
        const f = this._layoutMatrix[h][d];
        if (l.toString() !== f && f !== !1) {
          s = !1;
          break;
        }
      }
    return s;
  }
  _findRowBlank(e = [], t, n, i) {
    let o = 0;
    for (let s = n; s <= i; s++)
      if (e[s] !== !1 ? o = 0 : e[s] === !1 && o++, o === t)
        return {
          success: !0,
          xStart: s + 1 - t,
          xEnd: s,
          xWidth: t
        };
    return { success: !1 };
  }
  _findBlankPosition(e, t) {
    let n = 0, i = this.col - 1, o = 0, s = [], l = 0;
    for (; l++ < 500; ) {
      this._layoutMatrix.length < t + o && this.isAutoRow && this.addRow(t + o - this._layoutMatrix.length);
      let a = !0, m = !1;
      if (!this.col)
        break;
      for (let h = 0; h < t; h++) {
        s = this._layoutMatrix[o + h], this.DebuggerTemp.yPointStart = o;
        let d = this._findRowBlank(s, e, n, i);
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
  _updateSeatLayout({ xStart: e, yStart: t, xEnd: n, yEnd: i, iName: o }, s = null) {
    o === void 0 && (o = "true");
    let l = s !== null ? s : o.toString();
    for (let a = t - 1; a <= i - 1; a++)
      for (let m = e - 1; m <= n - 1; m++)
        try {
          this.isDebugger ? this._layoutMatrix[a][m] = "__debugger__" : this._layoutMatrix[a][m] = l;
        } catch (h) {
          console.log(h);
        }
  }
}
const Je = [
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
class Ze {
  constructor(e) {
    c(this, "container", null);
    c(this, "customLayout", {});
    c(this, "option", {});
    c(this, "_defaultLayoutConfig", Je);
    c(this, "computeSmartRowAndCol", (e) => {
      let t = 1, n = 1;
      return e.length > 0 && e.forEach((i) => {
        i.pos.x + i.pos.w - 1 > t && (t = i.pos.x + i.pos.w - 1), i.pos.y + i.pos.h - 1 > n && (n = i.pos.y + i.pos.h - 1);
      }), { smartCol: t, smartRow: n };
    });
    c(this, "checkLayoutValue", (e) => {
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
  genLayoutConfig(e = null, t = null, n = null) {
    var z, v;
    let i = {};
    e = e || ((z = this.container.element) == null ? void 0 : z.clientWidth), t = t || ((v = this.container.element) == null ? void 0 : v.clientHeight);
    const o = this.container.layouts.sort((b, E) => b.px - E.px);
    for (let b = 0; b < o.length && (i = o[b], Array.isArray(i.data) || (i.data = []), o.length !== 1); b++)
      if (!(i.px < e))
        break;
    if (e === 0 && !n.col)
      throw new Error("\u8BF7\u5728layout\u4E2D\u4F20\u5165col\u7684\u503C\u6216\u8005\u4E3AContainer\u8BBE\u7F6E\u4E00\u4E2A\u521D\u59CB\u5BBD\u5EA6");
    n || (n = this.genCustomLayout(this.container, i));
    let {
      col: s = null,
      row: l = null,
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
    const g = Array.from(d), L = Array.from(h), O = this.computeSmartRowAndCol(this.container.engine.items);
    !s && !d[0] && !h[0] && (s = O.smartCol), (!l || n.responsive) && (l = O.smartRow), !n.responsive && !s && this.container.col && this.container.col !== 1 && (s = this.container.col);
    const Y = this.autoComputeSizeInfo(s, e, h[0], d[0], a);
    d[0] = Y.margin, h[0] = Y.size, !n.responsive && !l && this.container.row && this.container.row !== 1 && (l = this.container.row);
    const C = this.autoComputeSizeInfo(l, t, h[1], d[1], m);
    d[1] = C.margin, h[1] = C.size, (g[0] !== null || g[1] !== null) && (n.margin = d), (L[0] !== null || L[1] !== null) && (n.size = h);
    const x = this.option.global || {};
    for (const b in n)
      (x !== void 0 || i[b] !== void 0) && (n[b] = n[b]);
    this.container.layout = i, this.container.useLayout = this.customLayout = this.checkLayoutValue(n);
    const S = this.checkLayoutValue({
      ...this.customLayout,
      margin: d,
      size: h
    });
    return {
      layout: i,
      global: this.option.global,
      customLayout: n,
      useLayout: S
    };
  }
  autoSetColAndRows(e, t = !0, n = null) {
    const i = this.container.engine.layoutManager;
    e || (e = this.container);
    let o = e.col, s = e.row;
    n || (n = this.genCustomLayout(e));
    let {
      col: l = null,
      row: a = null,
      ratioCol: m = e.ratioCol,
      ratioRow: h = e.ratioRow,
      size: d = [null, null],
      margin: f = [null, null],
      sizeWidth: _,
      sizeHeight: y,
      marginX: w,
      marginY: g,
      cover: L = !1
    } = n;
    const O = e.engine.items, Y = (z, v) => (e.minCol && e.maxCol && e.minCol > e.maxCol ? (z = e.maxCol, this.container.eventManager.warn("limitOverlap", "minCol\u6307\u5B9A\u7684\u503C\u5927\u4E8EmaxCol,\u5C06\u4EE5maxCol\u6307\u5B9A\u7684\u503C\u4E3A\u4E3B")) : e.maxCol && z > e.maxCol ? z = e.maxCol : e.minCol && z < e.minCol && (z = e.minCol), e.minRow && e.maxRow && e.minRow > e.maxRow ? (v = e.maxRow, this.container.eventManager.warn("limitOverlap", "minRow\u6307\u5B9A\u7684\u503C\u5927\u4E8EmaxRow,\u5C06\u4EE5maxRow\u6307\u5B9A\u7684\u503C\u4E3A\u4E3B")) : e.maxRow && v > e.maxRow ? v = e.maxRow : e.minRow && v < e.minRow && (v = e.minRow), {
      limitCol: z,
      limitRow: v
    });
    (() => {
      var v, b;
      i.autoRow(!a || n.responsive), w && (f[0] = w), g && (f[1] = g), _ && (d[0] = _), y && (d[1] = y);
      const z = this.computeSmartRowAndCol(O);
      if (L || !l && !f[0] && !d[0])
        o = z.smartCol;
      else {
        const E = (v = this.container.element) == null ? void 0 : v.clientWidth;
        o = this.autoComputeSizeInfo(l || o, E, d[0], f[0], m).direction;
      }
      if (L || !a || n.responsive)
        s = z.smartRow;
      else {
        const E = (b = this.container.element) == null ? void 0 : b.clientHeight;
        s = this.autoComputeSizeInfo(a || s, E, d[1], f[1], h).direction;
      }
    })();
    let x = o, S = s;
    if (t && o && s) {
      const z = Y(o, s);
      if (x = z.limitCol, S = z.limitRow, e.containerW = x, e.containerH = S, e.col = o, e.row = s, l && (e.layout.col = o), a && (e.layout.row = s), e.platform === "vue") {
        const E = e.vue.useLayout;
        E.col && (E.col = o), E.row && (E.row = s);
      }
      i.setColNum(o), i.setRowNum(s), i.addRow(s - i._layoutMatrix.length), i.addCol(o - i._layoutMatrix[0].length);
      const v = e.__ownTemp__.preCol, b = e.__ownTemp__.preRow;
      if (o !== v) {
        e.__ownTemp__.preCol = o, e.eventManager._callback_("colChange", o, v, e);
        const E = e._VueEvents.vueColChange;
        typeof E == "function" && E(o, v, e);
      }
      if (s !== b) {
        e.__ownTemp__.preRow = s, e.eventManager._callback_("rowChange", s, b, e);
        const E = e._VueEvents.vueRowChange;
        typeof E == "function" && E(s, b, e);
      }
    }
    return {
      col: o,
      row: s,
      containerW: x,
      containerH: S
    };
  }
  genCustomLayout(e = null, t = null) {
    return e || (e = this.container), t || (t = e.layout), Object.assign(V(this.option.global), V(t || {}));
  }
}
class Qe {
  constructor(e) {
    c(this, "items", []);
    c(this, "option", {});
    c(this, "layoutManager", null);
    c(this, "container", null);
    c(this, "layoutConfig", null);
    c(this, "useLayout", null);
    c(this, "initialized", !1);
    c(this, "__temp__", {
      responsiveFunc: null,
      firstLoaded: !1,
      staticIndexCount: 0,
      previousHash: ""
    });
    this.option = e;
  }
  init() {
    this.initialized || (this.layoutManager = new $e(), this.layoutConfig = new Ze(this.option), this.layoutConfig.setContainer(this.container), this.layoutConfig.initLayoutInfo(), this.initialized = !0);
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
      q(this.container, e, !1, ["events"]), this.items.forEach((t) => {
        q(t, {
          margin: e.margin,
          size: e.size
        });
      });
    }
  }
  findCoverItemFromPosition(e, t, n, i, o = null) {
    o = o || this.items;
    const s = [];
    for (let l = 0; l < o.length; l++) {
      let a = o[l];
      const m = e, h = t, d = e + n - 1, f = t + i - 1, _ = a.pos.x, y = a.pos.y, w = a.pos.x + a.pos.w - 1, g = a.pos.y + a.pos.h - 1;
      ((w >= m && w <= d || _ >= m && _ <= d || m >= _ && d <= w) && (g >= h && g <= f || y >= h && y <= f || h >= y && f <= g) || m >= _ && d <= w && h >= y && f <= g) && s.push(a);
    }
    return s;
  }
  findResponsiveItemFromPosition(e, t, n, i) {
    let o = null, s = 1;
    this.items.length > 0 && (s = this.items[this.items.length - 1].pos.y);
    for (let l = 0; l < this.items.length; l++) {
      let a = this.items[l];
      if (!a)
        continue;
      const m = a.pos.x, h = a.pos.y, d = a.pos.x + a.pos.w - 1, f = a.pos.y + a.pos.h - 1;
      m === e && (t > s && (t = s), e === m && t === h && (o = a));
    }
    return o;
  }
  findStaticBlankMaxMatrixFromItem(e) {
    const t = e.pos.x, n = e.pos.y, i = e.pos.w, o = e.pos.h;
    let s = this.container.col - t + 1, l = this.container.row - n + 1, a = s, m = l;
    for (let h = 0; h < this.items.length; h++) {
      const d = this.items[h], f = d.pos;
      this.container.responsive && !d.static || e !== d && (f.x + f.w - 1 < t || f.y + f.h - 1 < n || (f.x >= t && f.x - t < s && (n + o - 1 >= f.y && n + o - 1 <= f.y + f.h - 1 || f.y + f.h - 1 >= n && f.y + f.h - 1 <= n + o - 1) && (s = f.x - t), f.y >= n && f.y - n < l && (t + i - 1 >= f.x && t + i - 1 <= f.x + f.w - 1 || f.x + f.w - 1 >= t && f.x + f.w - 1 <= t + i - 1) && (l = f.y - n), f.x >= t && f.x - t < a && (n + l - 1 >= f.y && n + l - 1 <= f.y + f.h - 1 || f.y + f.h - 1 >= n && f.y + f.h - 1 <= n + l - 1) && (a = f.x - t), f.y >= n && f.y - n < m && (t + s - 1 >= f.x && t + s - 1 <= f.x + f.w - 1 || f.x + f.w - 1 >= t && f.x + f.w - 1 <= t + s - 1) && (m = f.y - n)));
    }
    return {
      maxW: s,
      maxH: l,
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
        let o, s;
        for (let l = 0; l < this.items.length; l++)
          if (this.items.length > l && (s = this.items[l], o = this.items[l + 1]), o) {
            const a = s.pos, m = o.pos;
            if (!n)
              return !1;
            if (a.y <= n.y && m.y > n.y) {
              this.insert(e, l + 1), i = !0;
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
    let s = !1;
    const l = e.container.col - n.x + 1, a = e.container.row - n.y + 1;
    (i + n.x - 1 > this.container.col || n.tempW) && (this.container.responsive || (n.tempW !== l && n.tempW <= i && (s = !0), t && i > n.tempW && l <= i && l <= i && (n.tempW = l))), (o + n.y - 1 > this.container.row || n.tempH) && (this.container.responsive || (n.tempH !== a && n.tempH <= o && (s = !0), t && o > n.tempH && a <= o && a <= o && (n.tempH = a))), (i > this.container.col || n.tempW) && (n.tempW !== l && n.tempW <= i && (s = !0), t && i > n.tempW && l <= i && l <= i && (n.tempW = l)), (o > this.container.row || n.tempH) && (n.tempH !== a && n.tempH <= o && (s = !0), t && o > n.tempH && a <= o && a <= o && (n.tempH = a)), s && this.items.includes(e) && this.container.eventManager._warn_(
      "temporaryResetItemSize",
      "ITEM: w:" + i + " h:" + o + "\u8D85\u8FC7\u6805\u683C\u5927\u5C0F\uFF0C\u4E34\u65F6\u8C03\u6574\u8BE5ITEM\u5C3A\u5BF8\u4E3Aw:" + (n.tempW ? n.tempW : n.w) + " h:" + (n.tempH ? n.tempH : n.h) + "\u8FDB\u884C\u9002\u914D\u5BB9\u5668\u7A7A\u95F4,\u6B64\u65F6pos.w\u548Cpos.h\u8FD8\u662F\u539F\u6765\u7684\u5C3A\u5BF8,\u5728\u5BB9\u5668\u4E2D\u4E00\u4F46\u5B58\u5728\u8DB3\u591F\u7A7A\u95F4\u5219\u8BE5Item\u4FBF\u4F1A\u6062\u590D\u539F\u6765\u7684\u5C3A\u5BF8",
      e
    );
  }
  _isCanAddItemToContainer_(e, t = !1, n = !1) {
    let i, o = e.pos.nextStaticPos !== null ? e.pos.nextStaticPos : e.pos;
    o.i = e.i;
    const s = Object.assign({}, o);
    return e.pos.tempW && (s.w = e.pos.tempW), e.pos.tempH && (s.h = e.pos.tempH), i = this.layoutManager.findItem(s, t), i !== null ? (n && (this.layoutManager.addItem(i), i.w = o.w, i.h = o.h, q(e.pos, Object.assign(this._genItemPosArg(e), i)), e.pos.nextStaticPos = null, e.autoOnce = !1), i) : null;
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
    const s = (a) => ({
      row: a.row,
      col: a.col,
      containerW: a.containerW,
      containerH: a.containerH,
      width: a.nowWidth(),
      height: a.nowHeight()
    }), l = this.container;
    if (!l.__ownTemp__.beforeContainerSizeInfo)
      l.__ownTemp__.beforeContainerSizeInfo = s(l);
    else {
      const a = l.__ownTemp__.beforeContainerSizeInfo;
      if (a.containerW !== l.containerW || a.containerH !== l.containerH) {
        const m = s(l);
        l.__ownTemp__.beforeContainerSizeInfo = s(l), this.container.eventManager._callback_("containerSizeChange", a, m, l);
      }
    }
  }
  _genItemPosArg(e) {
    return e.pos.col = (() => this.container.col)(), e.pos.row = (() => this.container.row)(), e.pos;
  }
}
class pe extends Error {
  constructor() {
    super(...arguments);
    c(this, "name", pe.name);
    c(this, "message", "getErrAttr=>[name|message] \u5BB9\u5668\u6EA2\u51FA\uFF0C\u53EA\u6709\u9759\u6001\u6A21\u5F0F\u4E0B\u4F1A\u51FA\u73B0\u6B64\u9519\u8BEF,\u60A8\u53EF\u4EE5\u4F7F\u7528error\u4E8B\u4EF6\u51FD\u6570\u63A5\u6536\u8BE5\u9519\u8BEF\uFF0C\u90A3\u4E48\u8BE5\u9519\u8BEF\u5C31\u4E0D\u4F1A\u629B\u51FA\u800C\u662F\u5C06\u9519\u8BEF\u4F20\u5230error\u4E8B\u4EF6\u51FD\u6570\u7684\u7B2C\u4E8C\u4E2A\u5F62\u53C2");
  }
}
const Ke = {
  ContainerOverflowError: pe
};
class ve {
  static index(e) {
    return e ? Ke[e] : Error;
  }
}
class et {
  constructor(e) {
    c(this, "error", null);
    c(this, "warn", null);
    Object.assign(this, e);
  }
  _errback_(e, ...t) {
    if (typeof this.error != "function")
      throw new (ve.index(e))();
    this.error.call(this.error, new (ve.index(e))(), ...t);
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
class tt {
  constructor(e = {}) {
    c(this, "name", "");
    c(this, "className", "grid-container");
    c(this, "responsive", !1);
    c(this, "responseMode", "default");
    c(this, "data", []);
    c(this, "col", null);
    c(this, "row", null);
    c(this, "margin", [null, null]);
    c(this, "marginX", null);
    c(this, "marginY", null);
    c(this, "size", [null, null]);
    c(this, "sizeWidth", null);
    c(this, "sizeHeight", null);
    c(this, "minCol", null);
    c(this, "maxCol", null);
    c(this, "minRow", null);
    c(this, "maxRow", null);
    c(this, "autoGrowRow", !0);
    c(this, "autoReorder", !0);
    c(this, "ratioCol", 0.1);
    c(this, "ratioRow", 0.1);
    c(this, "followScroll", !0);
    c(this, "sensitivity", 0.45);
    c(this, "itemLimit", {});
    c(this, "exchange", !1);
    c(this, "pressTime", 360);
    c(this, "scrollWaitTime", 800);
    c(this, "scrollSpeedX", null);
    c(this, "scrollSpeedY", null);
    c(this, "resizeReactionDelay", 50);
    c(this, "slidePage", !0);
    c(this, "nestedOutExchange", !1);
    q(this, e);
  }
}
const Me = function() {
  if (typeof Map < "u")
    return Map;
  function u(e, t) {
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
      const n = u(this.__entries__, t), i = this.__entries__[n];
      return i && i[1];
    }, e.prototype.set = function(t, n) {
      var i = u(this.__entries__, t);
      ~i ? this.__entries__[i][1] = n : this.__entries__.push([t, n]);
    }, e.prototype.delete = function(t) {
      const n = this.__entries__, i = u(n, t);
      ~i && n.splice(i, 1);
    }, e.prototype.has = function(t) {
      return !!~u(this.__entries__, t);
    }, e.prototype.clear = function() {
      this.__entries__.splice(0);
    }, e.prototype.forEach = function(t, n) {
      n === void 0 && (n = null);
      for (let o = 0, s = this.__entries__; o < s.length; o++) {
        var i = s[o];
        t.call(n, i[1], i[0]);
      }
    }, e;
  }();
}(), me = typeof window < "u" && typeof document < "u" && window.document === document, ie = function() {
  return typeof global < "u" && global.Math === Math ? global : typeof self < "u" && self.Math === Math ? self : typeof window < "u" && window.Math === Math ? window : Function("return this")();
}(), nt = function() {
  return typeof requestAnimationFrame == "function" ? requestAnimationFrame.bind(ie) : function(u) {
    return setTimeout(function() {
      return u(Date.now());
    }, 1e3 / 60);
  };
}(), it = 2;
function ot(u, e) {
  let t = !1, n = !1, i = 0;
  function o() {
    t && (t = !1, u()), n && l();
  }
  function s() {
    nt(o);
  }
  function l() {
    const a = Date.now();
    if (t) {
      if (a - i < it)
        return;
      n = !0;
    } else
      t = !0, n = !1, setTimeout(s, e);
    i = a;
  }
  return l;
}
const st = 20, rt = ["top", "right", "bottom", "left", "width", "height", "size", "weight"], lt = typeof MutationObserver < "u", at = function() {
  function u() {
    this.connected_ = !1, this.mutationEventsAdded_ = !1, this.mutationsObserver_ = null, this.observers_ = [], this.onTransitionEnd_ = this.onTransitionEnd_.bind(this), this.refresh = ot(this.refresh.bind(this), st);
  }
  return u.prototype.addObserver = function(e) {
    ~this.observers_.indexOf(e) || this.observers_.push(e), this.connected_ || this.connect_();
  }, u.prototype.removeObserver = function(e) {
    const t = this.observers_, n = t.indexOf(e);
    ~n && t.splice(n, 1), !t.length && this.connected_ && this.disconnect_();
  }, u.prototype.refresh = function() {
    this.updateObservers_() && this.refresh();
  }, u.prototype.updateObservers_ = function() {
    const e = this.observers_.filter(function(t) {
      return t.gatherActive(), t.hasActive();
    });
    return e.forEach(function(t) {
      return t.broadcastActive();
    }), e.length > 0;
  }, u.prototype.connect_ = function() {
    !me || this.connected_ || (document.addEventListener("transitionend", this.onTransitionEnd_), window.addEventListener("resize", this.refresh), lt ? (this.mutationsObserver_ = new MutationObserver(this.refresh), this.mutationsObserver_.observe(document, {
      attributes: !0,
      childList: !0,
      characterData: !0,
      subtree: !0
    })) : (document.addEventListener("DOMSubtreeModified", this.refresh), this.mutationEventsAdded_ = !0), this.connected_ = !0);
  }, u.prototype.disconnect_ = function() {
    !me || !this.connected_ || (document.removeEventListener("transitionend", this.onTransitionEnd_), window.removeEventListener("resize", this.refresh), this.mutationsObserver_ && this.mutationsObserver_.disconnect(), this.mutationEventsAdded_ && document.removeEventListener("DOMSubtreeModified", this.refresh), this.mutationsObserver_ = null, this.mutationEventsAdded_ = !1, this.connected_ = !1);
  }, u.prototype.onTransitionEnd_ = function(e) {
    const t = e.propertyName, n = t === void 0 ? "" : t;
    rt.some(function(o) {
      return !!~n.indexOf(o);
    }) && this.refresh();
  }, u.getInstance = function() {
    return this.instance_ || (this.instance_ = new u()), this.instance_;
  }, u.instance_ = null, u;
}(), Re = function(u, e) {
  for (let t = 0, n = Object.keys(e); t < n.length; t++) {
    const i = n[t];
    Object.defineProperty(u, i, {
      value: e[i],
      enumerable: !1,
      writable: !1,
      configurable: !0
    });
  }
  return u;
}, U = function(u) {
  return u && u.ownerDocument && u.ownerDocument.defaultView || ie;
}, Te = re(0, 0, 0, 0);
function oe(u) {
  return parseFloat(u) || 0;
}
function xe(u) {
  const e = [];
  for (let t = 1; t < arguments.length; t++)
    e[t - 1] = arguments[t];
  return e.reduce(function(t, n) {
    const i = u["border-" + n + "-width"];
    return t + oe(i);
  }, 0);
}
function ut(u) {
  const e = ["top", "right", "bottom", "left"], t = {};
  for (let n = 0, i = e; n < i.length; n++) {
    const o = i[n], s = u["padding-" + o];
    t[o] = oe(s);
  }
  return t;
}
function ct(u) {
  const e = u.getBBox();
  return re(0, 0, e.width, e.height);
}
function ft(u) {
  const e = u.clientWidth, t = u.clientHeight;
  if (!e && !t)
    return Te;
  const n = U(u).getComputedStyle(u), i = ut(n), o = i.left + i.right, s = i.top + i.bottom;
  let l = oe(n.width), a = oe(n.height);
  if (n.boxSizing === "border-box" && (Math.round(l + o) !== e && (l -= xe(n, "left", "right") + o), Math.round(a + s) !== t && (a -= xe(n, "top", "bottom") + s)), !ht(u)) {
    const m = Math.round(l + o) - e, h = Math.round(a + s) - t;
    Math.abs(m) !== 1 && (l -= m), Math.abs(h) !== 1 && (a -= h);
  }
  return re(i.left, i.top, l, a);
}
const mt = function() {
  return typeof SVGGraphicsElement < "u" ? function(u) {
    return u instanceof U(u).SVGGraphicsElement;
  } : function(u) {
    return u instanceof U(u).SVGElement && typeof u.getBBox == "function";
  };
}();
function ht(u) {
  return u === U(u).document.documentElement;
}
function dt(u) {
  return me ? mt(u) ? ct(u) : ft(u) : Te;
}
function pt(u) {
  const e = u.x, t = u.y, n = u.width, i = u.height, s = Object.create((typeof DOMRectReadOnly < "u" ? DOMRectReadOnly : Object).prototype);
  return Re(s, {
    x: e,
    y: t,
    width: n,
    height: i,
    top: t,
    right: e + n,
    bottom: i + t,
    left: e
  }), s;
}
function re(u, e, t, n) {
  return { x: u, y: e, width: t, height: n };
}
const gt = function() {
  function u(e) {
    this.broadcastWidth = 0, this.broadcastHeight = 0, this.contentRect_ = re(0, 0, 0, 0), this.target = e;
  }
  return u.prototype.isActive = function() {
    var e = dt(this.target);
    return this.contentRect_ = e, e.width !== this.broadcastWidth || e.height !== this.broadcastHeight;
  }, u.prototype.broadcastRect = function() {
    var e = this.contentRect_;
    return this.broadcastWidth = e.width, this.broadcastHeight = e.height, e;
  }, u;
}(), _t = function() {
  function u(e, t) {
    var n = pt(t);
    Re(this, { target: e, contentRect: n });
  }
  return u;
}(), yt = function() {
  function u(e, t, n) {
    if (this.activeObservations_ = [], this.observations_ = new Me(), typeof e != "function")
      throw new TypeError("The callback provided as parameter 1 is not a function.");
    this.callback_ = e, this.controller_ = t, this.callbackCtx_ = n;
  }
  return u.prototype.observe = function(e) {
    if (!arguments.length)
      throw new TypeError("1 argument required, but only 0 present.");
    if (typeof Element > "u" || !(Element instanceof Object))
      return;
    if (!(e instanceof U(e).Element))
      throw new TypeError('parameter 1 is not of type "Element".');
    const t = this.observations_;
    t.has(e) || (t.set(e, new gt(e)), this.controller_.addObserver(this), this.controller_.refresh());
  }, u.prototype.unobserve = function(e) {
    if (!arguments.length)
      throw new TypeError("1 argument required, but only 0 present.");
    if (typeof Element > "u" || !(Element instanceof Object))
      return;
    if (!(e instanceof U(e).Element))
      throw new TypeError('parameter 1 is not of type "Element".');
    const t = this.observations_;
    !t.has(e) || (t.delete(e), t.size || this.controller_.removeObserver(this));
  }, u.prototype.disconnect = function() {
    this.clearActive(), this.observations_.clear(), this.controller_.removeObserver(this);
  }, u.prototype.gatherActive = function() {
    const e = this;
    this.clearActive(), this.observations_.forEach(function(t) {
      t.isActive() && e.activeObservations_.push(t);
    });
  }, u.prototype.broadcastActive = function() {
    if (!this.hasActive())
      return;
    const e = this.callbackCtx_, t = this.activeObservations_.map(function(n) {
      return new _t(n.target, n.broadcastRect());
    });
    this.callback_.call(e, t, e), this.clearActive();
  }, u.prototype.clearActive = function() {
    this.activeObservations_.splice(0);
  }, u.prototype.hasActive = function() {
    return this.activeObservations_.length > 0;
  }, u;
}(), Se = typeof WeakMap < "u" ? /* @__PURE__ */ new WeakMap() : new Me(), Ae = function() {
  function u(e) {
    if (!(this instanceof u))
      throw new TypeError("Cannot call a class as a function.");
    if (!arguments.length)
      throw new TypeError("1 argument required, but only 0 present.");
    const t = at.getInstance(), n = new yt(e, t, this);
    Se.set(this, n);
  }
  return u;
}();
[
  "observe",
  "unobserve",
  "disconnect"
].forEach(function(u) {
  Ae.prototype[u] = function() {
    let e;
    return (e = Se.get(this))[u].apply(e, arguments);
  };
});
const wt = function() {
  return typeof ie.ResizeObserver < "u" ? ie.ResizeObserver : Ae;
}(), K = N.store;
class vt extends ze {
  constructor(t) {
    super();
    c(this, "el", "");
    c(this, "parent", null);
    c(this, "platform", "native");
    c(this, "layouts", []);
    c(this, "events", []);
    c(this, "global", {});
    c(this, "element", null);
    c(this, "contentElement", null);
    c(this, "classList", []);
    c(this, "attr", []);
    c(this, "engine", []);
    c(this, "px", null);
    c(this, "layout", {});
    c(this, "useLayout", {});
    c(this, "childContainer", []);
    c(this, "isNesting", !1);
    c(this, "parentItem", null);
    c(this, "containerH", null);
    c(this, "containerW", null);
    c(this, "eventManager", null);
    c(this, "_VueEvents", {});
    c(this, "_mounted", !1);
    c(this, "__store__", K);
    c(this, "__ownTemp__", {
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
    c(this, "genGridContainerBox", () => {
      this.contentElement = document.createElement("div"), this.contentElement.classList.add("grid-container-area"), this.contentElement._isGridContainerArea = !0, this.element.appendChild(this.contentElement), this.updateStyle(B.gridContainer, this.contentElement), this.contentElement.classList.add(this.className);
    });
    c(this, "genContainerStyle", () => {
      const t = this.nowWidth() + "px", n = this.nowHeight() + "px";
      return {
        width: t,
        height: n
      };
    });
    c(this, "nowWidth", () => {
      let t = 0, n = this.containerW;
      return n > 1 && (t = (n - 1) * this.margin[0]), n * this.size[0] + t || 0;
    });
    c(this, "nowHeight", () => {
      let t = 0, n = this.containerH;
      return n > 1 && (t = (n - 1) * this.margin[1]), n * this.size[1] + t || 0;
    });
    t.el, this.el = t.el, typeof t.platform == "string" && (this.platform = t.platform), Object.assign(this, new tt()), this._define(), this.eventManager = new et(t.events), this.engine = new Qe(t), t.global && (this.global = t.global), t.parent && (this.parent = t.parent, this.parent.childContainer.push(this), this.isNesting = !0), this.engine.setContainer(this), t.itemLimit && (this.itemLimit = new te(t.itemLimit));
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
      if (this.element._gridContainer_ = this, this.element._isGridContainer_ = !0, this.engine.init(), this.platform === "vue" ? this.contentElement = this.element.querySelector(".grid-container-area") : (this.genGridContainerBox(), this.updateStyle(B.gridContainerArea)), this.attr = Array.from(this.element.attributes), this.classList = Array.from(this.element.classList), this.element && this.element.clientWidth > 0) {
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
    this.platform === "vue" ? n() : R.run(n);
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
    R.run(() => {
      this.element && this.element.clientWidth <= 0 || (typeof t == "function" && t(this.useLayout.data || [], this.useLayout, this.element), this.updateLayout(!0));
    });
  }
  _nestingMount(t = null) {
    t = t || K.nestingMountPointList;
    for (let n = 0; n < this.engine.items.length; n++) {
      const i = this.engine.items[n];
      for (let o = 0; o < t.length; o++)
        if (t[o].id === (i.nested || "").replace("#", "")) {
          let s = t[o];
          s = s.cloneNode(!0), i.element.appendChild(s);
          break;
        }
    }
  }
  toItemList(t) {
    return t.map((n) => this.engine.createItem(n));
  }
  cover() {
    let t = this.engine.layoutConfig.genCustomLayout();
    this.engine.layoutConfig.autoSetColAndRows(this, !0, {
      ...t,
      cover: !0
    }), this.updateLayout(!0);
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
      const o = this.element.clientWidth, s = this.element.clientHeight;
      if (o <= 0 || s <= 0)
        return;
      let l = this.engine.layoutConfig.genLayoutConfig(o, s), { useLayout: a, customLayout: m } = l;
      const h = this.eventManager._callback_("mountPointElementResizing", l, o, this.container);
      if (!(h === null || h === !1)) {
        if (typeof h == "object" && (a = h), this.px && a.px && this.px !== a.px) {
          this.platform, this.eventManager._callback_("useLayoutChange", m, o, this.container);
          const d = this._VueEvents.vueUseLayoutChange;
          typeof d == "function" && d(l);
        }
        this.engine.updateLayout(!0);
      }
    }, n = (o, s = 350) => {
      let l = this.__ownTemp__;
      return function() {
        l.deferUpdatingLayoutTimer && clearTimeout(l.deferUpdatingLayoutTimer), l.deferUpdatingLayoutTimer = setTimeout(() => {
          o.apply(this, arguments), l.deferUpdatingLayoutTimer = null;
        }, s);
      };
    }, i = () => {
      t(), n(() => {
        t();
      }, 100)();
    };
    this.__ownTemp__.observer = new wt(P(i, 50)), this.__ownTemp__.observer.observe(this.element);
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
      const s = this.add({ el: n, ...o });
      s && (s.name = s.getAttr("name")), t.push(t);
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
  setup(u) {
    const e = u, t = ee(null), n = ee(null), i = new vt({
      platform: "vue",
      layouts: e.config.layouts,
      events: e.events,
      global: e.config.global
    });
    let o = {}, s = !1;
    return Be("_grid_item_components_", e.components), Ie(() => {
      i.el = t.value, i.engine.init(), i.vue = e, Q(() => {
        o = i.engine.layoutConfig.genLayoutConfig(t.value.clientWidth, t.value.clientHeight), n.value._isGridContainerArea = !0;
        const l = V(o.customLayout);
        e.render === null ? Object.assign(e.useLayout, l) : typeof e.render == "function" && e.render(l, o.useLayout, e.config.layouts), i.mount();
      }), setTimeout(() => {
        let l = i.exportData(["initialX", "initialY"]);
        l = l.map((a) => {
          const m = a.pos;
          return m.initialX || delete m.x, m.initialY || delete m.y, delete m.initialX, delete m.initialY, a;
        }), e.useLayout.data && e.useLayout.data.length !== l.length && (e.useLayout.data = [], Q(() => {
          e.useLayout.data = l, o.layout.data = l, i.updateLayout(!0);
        }));
      }), e.containerAPI.getContainer = () => i, e.containerAPI.exportData = () => i.exportData(), e.containerAPI.exportGlobal = () => i.exportGlobal(), e.containerAPI.exportLayouts = () => i.exportLayouts(), e.containerAPI.exportConfig = () => i.exportConfig(), i._VueEvents.vueUseLayoutChange = (l) => {
        s = !0, e.useLayout.data = [], Q(() => {
          o = l;
          const a = V(l.customLayout);
          for (let m in e.useLayout)
            delete e.useLayout[m];
          e.layoutChange === null ? Object.assign(e.useLayout, l.customLayout) : typeof e.layoutChange == "function" && (s = !1, e.layoutChange(a, l.useLayout, i.layouts));
        });
      }, i._VueEvents.vueCrossContainerExchange = (l, a, m) => {
        const h = l.exportConfig();
        l.pos.nextStaticPos && (h.pos.nextStaticPos = l.pos.nextStaticPos, h.pos.x = l.pos.nextStaticPos.x, h.pos.y = l.pos.nextStaticPos.y), h.pos.doItemCrossContainerExchange = (d) => {
          a.exchangeItems.old = a.fromItem, a.exchangeItems.new = d, a.moveItem = d, a.fromItem = d, m(d);
        }, e.useLayout.data.push(h), Q(() => {
          i.updateLayout(!0);
        });
      };
    }), T(e.useLayout, () => {
      if (s)
        return;
      for (let m in e.useLayout) {
        const h = e.useLayout[m], d = typeof h;
        !Array.isArray(h) && ["data", "margin", "size"].includes(m) && console.error(m, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2A\u6570\u7EC4"), d !== "boolean" && ["responsive", "followScroll", "exchange", "slidePage", "autoGrowRow", "autoReorder"].includes(m) && console.error(m, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2Aboolean\u503C"), (d !== "number" || isNaN(h) || !isFinite(h)) && [
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
        ].includes(m) && console.error(m, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2A\u975ENaN\u7684number\u503C"), d !== "string" && ["responseMode", "className"].includes(m) && (m === "responseMode" ? console.error(m, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2Astring\u503C", "\u4E14\u6709\u4E09\u79CD\u5E03\u5C40\u4EA4\u6362\u6A21\u5F0F\uFF0C\u5206\u522B\u662Fdefault,exchange,stream") : console.error(m, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2Astring\u503C")), d !== "object" && ["itemLimit"].includes(m) && (m === "itemLimit" ? console.error(m, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2Aobject\u503C,\u5305\u542B\u53EF\u9009\u952EminW,minH,maxH,maxW\u4F5C\u7528\u4E8E\u6240\u6709Item\u5927\u5C0F\u9650\u5236") : console.error(m, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2Aobject\u503C")), o.layout[m] = ce(h);
      }
      i.updateLayout(!0);
      const l = i.useLayout, a = i.vue.useLayout;
      for (let m in i.useLayout) {
        const h = l[m], d = a[m];
        let f = !1;
        h !== d && (["col", "row"].includes(m) && h && (a[m] = h, f = !0), ["size", "margin"].includes(m) && Array.isArray(h) && (h[0] !== d[0] && (d[0] = h[0], f = !0), h[1] !== d[1] && (d[1] = h[1], f = !0))), f && i.eventManager._error_("vueUseLayoutModificationFailed", m + " \u4FEE\u6539\u5931\u8D25", e.useLayout);
      }
    }, { deep: !0 }), (l, a) => (fe(), be("div", {
      ref_key: "gridContainer",
      ref: t,
      style: { display: "block" }
    }, [
      qe("div", {
        ref_key: "gridContainerArea",
        ref: n,
        class: "grid-container-area",
        style: { display: "block", position: "relative" }
      }, [
        Ee(l.$slots, "default")
      ], 512)
    ], 512));
  }
}, Ce = {
  GridContainer: xt,
  GridItem: Ve
}, he = (u) => {
  he.installed || (he.installed = !0, Object.keys(Ce).forEach((e) => u.component(e, Ce[e])));
}, bt = {
  install: he
};
export {
  xt as GridContainer,
  Ve as GridItem,
  bt as default,
  he as install
};
