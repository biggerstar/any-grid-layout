var ke = Object.defineProperty;
var Pe = (a, e, t) => e in a ? ke(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t;
var c = (a, e, t) => (Pe(a, typeof e != "symbol" ? e + "" : e, t), t);
import { getCurrentInstance as He, ref as te, inject as We, useAttrs as Ne, toRaw as fe, onMounted as be, onUnmounted as Fe, openBlock as me, createElementBlock as Ce, unref as ae, createBlock as De, renderSlot as Ee, watch as R, defineAsyncComponent as Be, provide as Xe, nextTick as K, createElementVNode as Ye } from "vue";
function W(a, e = 350) {
  let t, n, i = 0;
  return function() {
    t = this, n = arguments;
    let o = new Date().valueOf();
    o - i > e && (a.apply(t, n), i = o);
  };
}
function qe(a) {
  return a.replace(/[A-Z]/g, function(e) {
    return "-" + e.toLowerCase();
  });
}
const X = (a = {}, e = {}, t = !1, n = []) => {
  const i = {};
  return Object.keys(e).forEach((o) => {
    Object.keys(a).includes(o) && !n.includes(o) && (t ? i[o] = e[o] !== void 0 ? e[o] : a[o] : a[o] = e[o] !== void 0 ? e[o] : a[o]);
  }), t ? i : a;
}, $ = (a) => {
  let e = Array.isArray(a) ? [] : {};
  if (a && typeof a == "object")
    for (let t in a)
      a.hasOwnProperty(t) && (a[t] && typeof a[t] == "object" ? e[t] = $(a[t]) : e[t] = a[t]);
  return e;
}, Le = (a) => {
  let e;
  if (a instanceof Element)
    do {
      if (a._isGridContainer_) {
        e = a._gridContainer_;
        break;
      }
      a = a.parentNode;
    } while (a.parentNode);
  return e;
}, H = (a, e = !1) => {
  let t = null;
  const n = a.touchTarget ? a.touchTarget : a.target;
  if (n._isGridContainer_)
    t = n._gridContainer_;
  else
    for (let i = 0; i < a.path.length && !(a.path[i]._isGridContainer_ && (t = a.path[i]._gridContainer_, !e)); i++)
      ;
  return t;
}, Ge = (a, e = !1) => {
  let t = null;
  const n = a.touchTarget ? a.touchTarget : a.target;
  if (n._isGridContainerArea)
    t = n;
  else
    for (let i = 0; i < a.path.length && !(a.path[i]._isGridContainerArea && (t = a.path[i], !e)); i++)
      ;
  return t;
}, Y = (a, e = !1) => {
  let t = null;
  const n = a.touchTarget ? a.touchTarget : a.target;
  if (n._isGridItem_)
    t = n._gridItem_;
  else
    for (let i = 0; i < a.path.length && !(a.path[i]._isGridItem_ && (t = a.path[i]._gridItem_, !e)); i++)
      ;
  return t;
}, ue = (a) => {
  let e = "touches";
  if (a.touches && a.touches.length === 0 && (e = "changedTouches"), a[e] && a[e].length) {
    for (let t in a[e][0])
      ["target"].includes(t) || (a[t] = a[e][0][t]);
    a.touchTarget = document.elementFromPoint(a.clientX, a.clientY);
  }
  return a;
}, Ue = {
  name: "GridItem",
  inheritAttrs: !1
}, je = /* @__PURE__ */ Object.assign(Ue, {
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
    dragIgnoreEls: { required: !1, type: Array, default: void 0 },
    dragAllowEls: { required: !1, type: Array, default: void 0 },
    itemAPI: { required: !1, type: Object, default: {} }
  },
  setup(a) {
    const e = a;
    He();
    const t = te();
    let n = null;
    const i = () => {
      R(() => e.pos, () => {
        !n || Object.keys(e.pos).forEach((u) => {
          const g = e.pos[u];
          if (!!g && (typeof g == "number" || !isNaN(g))) {
            if (n.pos[u] === g)
              return;
            ["minW", "maxW", "minH", "maxH"].includes(u) && (n.pos[u] = g), ["w", "h"].includes(u) && (n.pos[u] = g), ["x", "y"].includes(u) && (n.container.responsive || (n.pos[u] = g));
          }
        });
      }, { deep: !0 }), R(() => e.transition, (u) => {
        (typeof u == "boolean" || typeof u == "object" || typeof u == "number") && (n.transition = u);
      }, { deep: !0 }), R(() => e.name, (u) => {
        typeof u == "string" && (n.name = u);
      }), R(() => e.type, (u) => {
        typeof u == "string" && (n.type = u);
      }), R(() => e.static, (u) => {
        typeof u == "boolean" && (n.static = u);
      }), R(() => e.exchange, (u) => {
        typeof u == "boolean" && (n.exchange = u);
      }), R(() => e.draggable, (u) => {
        typeof u == "boolean" && (n.draggable = u);
      }), R(() => e.resize, (u) => {
        typeof u == "boolean" && (n.resize = u);
      }), R(() => e.close, (u) => {
        typeof u == "boolean" && (n.close = u);
      }), R(() => e.follow, (u) => {
        typeof u == "boolean" && (n.follow = u);
      }), R(() => e.dragOut, (u) => {
        typeof u == "boolean" && (n.dragOut = u);
      }), R(() => e.dragIgnoreEls, (u) => {
        Array.isArray(u) && (n.dragIgnoreEls = u);
      }), R(() => e.dragAllowEls, (u) => {
        Array.isArray(u) && (n.dragAllowEls = u);
      });
    };
    let o, r = null, s = {}, f = te(!1);
    const m = We("_grid_item_components_"), h = () => {
      const u = m[e.type];
      u ? typeof u != "function" && console.error("components\u4E2D\u7684", e.type, '\u5E94\u8BE5\u662F\u4E00\u4E2A\u51FD\u6570,\u5E76\u4F7F\u7528import("XXX")\u5F02\u6B65\u5BFC\u5165') : console.error("\u672A\u5728components\u4E2D\u5B9A\u4E49", e.type, "\u7EC4\u4EF6"), o = Be(u);
    };
    e.type && Object.keys(m).length > 0 && (s = {
      ...Ne(),
      ...fe(e)
    }, h(), f.value = !0);
    const d = () => {
      if (!r)
        return;
      const u = r.col, g = r.row, y = r.engine.autoSetColAndRows(r);
      (u !== y.col || g !== y.row) && r.updateContainerStyleSize();
    };
    return be(() => {
      const u = fe(e);
      r = Le(t.value), r.__ownTemp__, e.pos.autoOnce = !e.pos.x || !e.pos.y;
      const g = e.pos.doItemCrossContainerExchange;
      if (delete e.pos.doItemCrossContainerExchange, n = r.add({
        el: t.value,
        ...u
      }), !n) {
        t.value.parentNode.removeChild(t.value);
        return;
      }
      n.mount(), e.itemAPI.getItem = () => n, e.itemAPI.exportConfig = () => n.exportConfig(), typeof g == "function" && g(n), n._VueEvents.vueItemResizing = (y, p, C) => {
        e.pos.w && e.pos.w !== p && (e.pos.w = p), e.pos.h && e.pos.h !== C && (e.pos.h = C);
      }, n._VueEvents.vueItemMovePositionChange = (y, p, C, M) => {
        e.pos.x && e.pos.x !== C && (e.pos.x = C), e.pos.y && e.pos.y !== M && (e.pos.y = M);
      }, d(), i();
    }), Fe(() => {
      n && n.remove(), d();
    }), (u, g) => (me(), Ce("div", {
      class: "grid-item",
      ref_key: "gridItem",
      ref: t,
      style: { display: "block", position: "absolute", overflow: "hidden" }
    }, [
      ae(f) ? (me(), De(ae(o), {
        key: 0,
        attrs: ae(s)
      }, null, 8, ["attrs"])) : Ee(u.$slots, "default", { key: 1 })
    ], 512));
  }
}), T = class {
  constructor() {
    T.intervalTime = 10;
    const e = () => {
      T.ready = !0, T.intervalTime = 50, document.removeEventListener("readystatechange", e);
    };
    document.addEventListener("readystatechange", e);
  }
  static init() {
    T.ins || (new T(), T.ins = !0);
  }
  static run(e, ...t) {
    T.init();
    let n = 0, i = typeof e.timeout == "number" ? e.timeout : T.timeout, o = typeof e.intervalTime == "number" ? e.intervalTime : T.intervalTime, r = () => {
      let m;
      if (typeof e == "function")
        m = e.call(e, ...t);
      else if (typeof e == "object") {
        if (!e.func)
          throw new Error("func\u51FD\u6570\u5FC5\u987B\u4F20\u5165");
        m = e.func.call(e.func, ...t) || void 0;
      }
      e.callback && e.callback(m);
    }, s = () => e.rule ? e.rule() : T.ready;
    if (s())
      return r(), !0;
    let f = setInterval(() => {
      typeof e.max == "number" && e.max < n && (clearInterval(f), f = null), i < n * o && (clearInterval(f), f = null), s() && (clearInterval(f), f = null, r()), n++;
    }, o);
  }
};
let z = T;
c(z, "ready", !1), c(z, "ins", !1), c(z, "timeout", 12e3), c(z, "intervalTime", 50);
class V {
  constructor(e) {
    c(this, "el", null);
    c(this, "i", "");
    c(this, "w", 1);
    c(this, "h", 1);
    c(this, "x", 1);
    c(this, "y", 1);
    c(this, "col", null);
    c(this, "row", null);
    c(this, "minW", 1);
    c(this, "maxW", 1 / 0);
    c(this, "minH", 1);
    c(this, "maxH", 1 / 0);
    c(this, "iName", "");
    c(this, "nextStaticPos", null);
    c(this, "beforePos", null);
    c(this, "autoOnce", null);
    typeof e == "object" && this.update(e);
  }
  update(e) {
    return X(this, this._typeCheck(e)), this;
  }
  export() {
    const e = {};
    return Object.keys(this).forEach((t) => {
      ["w", "h", "x", "y"].includes(t) && (e[t] = this[t]), ["minW", "minH"].includes(t) && this[t] > 1 && (e[t] = this[t]), ["maxW", "maxH"].includes(t) && this[t] !== 1 / 0 && (e[t] = this[t]);
    }), e;
  }
  _typeCheck(e) {
    return Object.keys(e).forEach((t) => {
      if (["w", "h", "x", "y", "col", "row", "minW", "maxW", "minH", "maxH"].includes(t)) {
        if (e[t] === 1 / 0 || e[t] === void 0)
          return;
        e[t] = parseInt(e[t]);
      }
      ["autoOnce"].includes(t) && (e[t] = e[t]);
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
}, B = class {
  constructor() {
  }
  static getInstance() {
    return B.ins || (B.ins = new B(), B.ins = !0), B;
  }
};
let F = B;
c(F, "ins", !1), c(F, "store", {
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
}), c(F, "ItemStore", {});
const l = F.store, se = class {
  static startEventFromItem(e) {
  }
  static removeEventFromItem(e) {
  }
  static startEventFromContainer(e) {
  }
  static removeEventFromContainer(e) {
  }
  static startGlobalEvent() {
    document.addEventListener("mousedown", E.container.touchstartOrMousedown), document.addEventListener("touchstart", E.container.touchstartOrMousedown, { passive: !1 }), document.addEventListener("mousemove", E.container.touchmoveOrMousemove), document.addEventListener("touchmove", E.container.touchmoveOrMousemove, { passive: !1 }), document.addEventListener("mouseup", E.container.touchendOrMouseup), document.addEventListener("touchend", E.container.touchendOrMouseup, { passive: !1 }), document.addEventListener("mouseleave", _.windowResize.setResizeFlag), document.addEventListener("mouseenter", _.windowResize.removeResizeFlag);
  }
  static removeGlobalEvent() {
    document.removeEventListener("mousedown", E.container.touchstartOrMousedown), document.removeEventListener("touchstart", E.container.touchstartOrMousedown), document.removeEventListener("mousemove", E.container.touchmoveOrMousemove), document.removeEventListener("touchmove", E.container.touchmoveOrMousemove), document.removeEventListener("mouseup", E.container.touchendOrMouseup), document.removeEventListener("touchend", E.container.touchendOrMouseup), document.removeEventListener("mouseleave", _.windowResize.setResizeFlag), document.removeEventListener("mouseenter", _.windowResize.removeResizeFlag);
  }
  static startEvent(e = null, t = null) {
    l.editItemNum === 0 && se.startGlobalEvent();
  }
  static removeEvent(e = null, t = null) {
    t && !t.draggable && t.resize, l.editItemNum === 0 && se.removeGlobalEvent();
  }
};
let D = se;
c(D, "_eventEntrustFunctor", {
  itemResize: {
    doResize: W((e) => {
      const t = l.mousedownEvent, n = l.isLeftMousedown, i = l.fromItem;
      if (i === null || t === null || !n)
        return;
      const o = i.container;
      l.cloneElement === null && (l.cloneElement = i.element.cloneNode(!0), l.cloneElement.classList.add("grid-clone-el", "grid-resizing-clone-el"), l.cloneElement && l.fromContainer.contentElement.appendChild(l.cloneElement), i.updateStyle({ transition: "none" }, l.cloneElement), i.addClass("grid-resizing-source-el"));
      const r = i.container.contentElement.getBoundingClientRect();
      let s = e.pageX - r.left - window.scrollX - i.offsetLeft(), f = e.pageY - r.top - window.scrollY - i.offsetTop();
      const m = {
        w: Math.ceil(s / (i.size[0] + i.margin[0])),
        h: Math.ceil(f / (i.size[1] + i.margin[1]))
      };
      m.w < 1 && (m.w = 1), m.h < 1 && (m.h = 1);
      const h = ({ w: g, h: y }) => {
        const p = i.pos;
        return g + p.x > o.col && (g = o.col - p.x + 1), g < p.minW && (g = p.minW), g > p.maxW && p.maxW !== 1 / 0 && (g = p.maxW), i.container.autoGrowRow || y + p.y > o.row && (y = o.row - p.y + 1), y < p.minH && (y = p.minH), y > p.maxH && p.maxH !== 1 / 0 && (y = p.maxH), {
          w: g,
          h: y
        };
      }, d = () => (s > i.maxWidth() && (s = i.maxWidth()), f > i.maxHeight() && (f = i.maxHeight()), s < i.minWidth() && (s = i.minWidth()), f < i.minHeight() && (f = i.minHeight()), {
        width: s,
        height: f
      }), u = h(m);
      if (i.container.responsive) {
        if (i.container.responsive) {
          X(i.pos, u);
          const g = d();
          i.updateStyle({
            width: g.width + "px",
            height: g.height + "px"
          }, l.cloneElement);
        }
      } else {
        const g = d(), y = i.container.engine.findStaticBlankMaxMatrixFromItem(i), p = {};
        if (u.w > y.minW && u.h > y.minH)
          return;
        y.maxW >= u.w ? (p.width = g.width + "px", i.pos.w = u.w) : u.w = i.pos.w, y.maxH >= u.h ? (p.height = g.height + "px", i.pos.h = u.h) : u.h = i.pos.h, Object.keys(p).length > 0 && i.updateStyle(p, l.cloneElement);
      }
      i.__temp__.resized || (i.__temp__.resized = { w: 1, h: 1 }), (i.__temp__.resized.w !== m.w || i.__temp__.resized.h !== m.h) && (i.__temp__.resized = u, typeof i._VueEvents.vueItemResizing == "function" && i._VueEvents.vueItemResizing(i, u.w, u.h), i.container.eventManager._callback_("itemResizing", u.w, u.h, i), l.fromContainer.updateLayout([i]), i.updateStyle(i._genLimitSizeStyle()), i.container.updateContainerStyleSize());
    }, 15),
    mouseup: (e) => {
      const t = l.fromItem;
      t !== null && (t.__temp__.clientWidth = t.nowWidth(), t.__temp__.clientHeight = t.nowHeight(), l.isLeftMousedown = !1, t.updateStyle(t._genItemStyle()));
    }
  },
  check: {
    resizeOrDrag: (e) => {
      var n, i;
      if (!!H(e)) {
        if (((n = l.fromItem) == null ? void 0 : n.draggable) && l.dragOrResize === "drag")
          return l.isDragging = !0, l.isResizing = !1, "drag";
        if (((i = l.fromItem) == null ? void 0 : i.resize) && l.dragOrResize === "resize")
          return l.isResizing = !0, l.isDragging = !1, "resize";
        if (l.dragOrResize === "slidePage")
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
    setResizeFlag: () => l.isWindowResize = !0,
    removeResizeFlag: () => l.isWindowResize = !1
  },
  moveOuterContainer: {
    leaveToEnter: function(e, t) {
      if (!l.isDragging || !e || !t)
        return;
      let n = l.fromItem, i = l.moveItem, o = l.moveItem !== null ? i : n;
      if (this.mouseleave(null, e), o.container === t) {
        l.fromContainer = t;
        return;
      }
      t.isNesting && (t.parentItem === o || t.parentItem.element === o.element) || (t.__ownTemp__.nestingEnterBlankUnLock = !0, this.mouseenter(null, t));
    },
    mouseenter: function(e, t = null) {
      !t && e.target._isGridContainer_ && (e.preventDefault(), t = e.target._gridContainer_);
      let n = l.fromItem;
      const i = l.moveItem;
      let o = l.moveItem !== null ? i : n;
      o && o.container === t || (l.isLeftMousedown && z.run({
        func: () => {
          t.eventManager._callback_("enterContainerArea", t, l.exchangeItems.new), l.exchangeItems.new = null, l.exchangeItems.old = null;
        },
        rule: () => l.exchangeItems.new,
        intervalTime: 2,
        timeout: 200
      }), t.__ownTemp__.firstEnterUnLock = !0, l.moveContainer = t);
    },
    mouseleave: function(e, t = null) {
      let n = l.fromItem, i = l.moveItem, o = l.moveItem !== null ? i : n;
      t.__ownTemp__.firstEnterUnLock = !1, t.__ownTemp__.nestingEnterBlankUnLock = !1, l.isLeftMousedown && t.eventManager._callback_("leaveContainerArea", t, o);
    }
  },
  itemDrag: {
    mousemoveExchange: (e, t = null) => {
      let n = l.fromItem;
      const i = l.moveItem;
      if (!l.isDragging || n === null || !e || !l.isLeftMousedown)
        return;
      let o = l.moveItem !== null ? i : n;
      if (!(!e.exchange || !n.container.exchange || !o.container.exchange || !o.exchange))
        try {
          o.pos.el = null;
          let r = n.element;
          const s = new ne({
            pos: o.pos,
            size: e.size,
            margin: e.margin,
            el: r,
            name: o.name,
            type: o.type,
            draggable: o.draggable,
            resize: o.resize,
            close: o.close,
            transition: o.transition,
            static: o.static,
            follow: o.follow,
            dragOut: o.dragOut,
            className: o.className,
            dragIgnoreEls: o.dragIgnoreEls,
            dragAllowEls: o.dragAllowEls
          }), f = n.container.eventManager._callback_("crossContainerExchange", o, s);
          if (f === !1 || f === null)
            return;
          const m = (u) => {
            typeof t == "function" && t(u);
          }, h = () => {
            e._VueEvents.vueCrossContainerExchange(s, l, (u) => {
              o.unmount(), o.remove(), m(u), e && (o !== u && !o.container.responsive ? o.container.engine.updateLayout([o]) : o.container.engine.updateLayout(!0));
            });
          }, d = () => {
            e.responsive ? s.pos.autoOnce = !0 : e.responsive || (s.pos.autoOnce = !1), e.add(s), o.unmount(), o.remove(), e && (s.container.responsive ? s.container.engine.updateLayout() : s.container.engine.updateLayout([s]), o !== s && !o.container.responsive ? o.container.engine.updateLayout([o]) : o.container.engine.updateLayout()), s.mount(), l.moveItem = s, l.fromItem = s, l.exchangeItems.old = o, l.exchangeItems.new = s, m(s);
          };
          e.__ownTemp__.firstEnterUnLock = !1, e.__ownTemp__.nestingEnterBlankUnLock = !1, e.platform === "vue" ? h() : d();
        } catch (r) {
          console.error("\u8DE8\u5BB9\u5668Item\u79FB\u52A8\u51FA\u9519", r);
        }
    },
    mousemoveFromItemChange: W((e) => {
      if (e.stopPropagation(), !l.isDragging)
        return;
      let t = l.fromItem, n = Y(e);
      n && (l.toItem = n);
      const i = l.moveItem, o = l.mousedownEvent;
      if (t === null || o === null || !l.isLeftMousedown)
        return;
      let r = l.moveItem !== null ? i : t, s = r.container, f = null;
      if (r.exchange && (f = H(e), f && (s = f), r.container !== f && s.parentItem && s.parentItem === r))
        return;
      const m = l.mousedownItemOffsetLeft * (s.size[0] / l.fromContainer.size[0]), h = l.mousedownItemOffsetTop * (s.size[1] / l.fromContainer.size[1]), d = s.contentElement.getBoundingClientRect(), u = e.pageX - m - (window.scrollX + d.left), g = e.pageY - h - (window.scrollY + d.top);
      if (r.container.followScroll) {
        const w = s.contentElement.parentElement.getBoundingClientRect(), N = s.scrollSpeedX ? s.scrollSpeedX : Math.round(w.width / 20), b = s.scrollSpeedY ? s.scrollSpeedY : Math.round(w.height / 20), x = (k, S) => {
          const O = r.container.eventManager._callback_("autoScroll", k, S, r.container);
          if (O === !1 || O === null)
            return;
          typeof O == "object" && (typeof O.offset == "number" && (S = O.offset), ["X", "Y"].includes(O.direction) && (k = O.direction));
          const P = s ? s.scrollWaitTime : 800;
          l.scrollReactionStatic === "stop" && (l.scrollReactionStatic = "wait", l.scrollReactionTimer = setTimeout(() => {
            l.scrollReactionStatic = "scroll", clearTimeout(l.scrollReactionTimer);
          }, P)), k === "X" && l.scrollReactionStatic === "scroll" && (s.contentElement.parentElement.scrollLeft += S), k === "Y" && l.scrollReactionStatic === "scroll" && (s.contentElement.parentElement.scrollTop += S);
        };
        let L = !1, A = !1;
        e.pageX - window.scrollX - w.left < w.width * 0.25 ? x("X", -N) : e.pageX - window.scrollX - w.left > w.width * 0.75 ? x("X", N) : L = !0, e.pageY - window.scrollY - w.top < w.height * 0.25 ? x("Y", -b) : e.pageY - window.scrollY - w.top > w.height * 0.75 ? x("Y", b) : A = !0, L && A && (l.scrollReactionStatic = "stop", clearTimeout(l.scrollReactionTimer));
      }
      const y = (I) => {
        const w = I / (s.size[0] + s.margin[0]);
        return w + r.pos.w >= s.containerW ? s.containerW - r.pos.w + 1 : Math.round(w) + 1;
      }, p = (I) => {
        const w = I / (s.size[1] + s.margin[1]);
        return w + r.pos.h >= s.containerH ? s.containerH - r.pos.h + 1 : Math.round(w) + 1;
      };
      let C = y(u), M = p(g);
      C < 1 && (C = 1), M < 1 && (M = 1), r.container.eventManager._callback_("itemMoving", C, M, r);
      const J = () => {
        let I, w, N = Date.now();
        w = e.screenX, I = e.screenY;
        const b = () => {
          let v = N - l.mouseSpeed.timestamp, j = Math.abs(w - l.mouseSpeed.endX), Q = Math.abs(I - l.mouseSpeed.endY), we = j > Q ? j : Q, Ae = Math.round(we / v * 1e3);
          return l.mouseSpeed.endX = w, l.mouseSpeed.endY = I, l.mouseSpeed.timestamp = N, { distance: we, speed: Ae };
        };
        if (!s.__ownTemp__.firstEnterUnLock) {
          const { distance: v, speed: j } = b();
          if (l.deviceEventMode === "mouse" && n && n.pos.w > 2 && n.pos.h > 2) {
            if (s.size[0] < 30 || s.size[1] < 30) {
              if (v < 3)
                return;
            } else if (s.size[0] < 60 || s.size[1] < 60) {
              if (v < 7)
                return;
            } else if (v < 10 || j < 10)
              return;
            if (r === null)
              return;
          }
        }
        const x = {
          x: C < 1 ? 1 : C,
          y: M < 1 ? 1 : M,
          w: r.pos.w,
          h: r.pos.h
        };
        let L = !1;
        const A = () => {
          if (!r.follow)
            return;
          const v = s.engine.findCoverItemFromPosition(x.x, x.y, x.w, x.h);
          v.length > 0 ? n = v.filter((Q) => r !== Q)[0] : L = !0;
        }, k = () => {
          const v = s.engine.findResponsiveItemFromPosition(x.x, x.y, x.w, x.h);
          !v || (n = v);
        };
        if (s.__ownTemp__.firstEnterUnLock ? A() : r.follow ? n ? A() : k() : A(), L && n && n.nested && (n = null), s.__ownTemp__.firstEnterUnLock) {
          if (!L && !n)
            return;
          if (r.pos.nextStaticPos = new V(r.pos), r.pos.nextStaticPos.x = x.x, r.pos.nextStaticPos.y = x.y, r.pos.autoOnce = !0, n) {
            if (l.fromItem.container.parentItem === n || r.container === n.container)
              return;
            _.itemDrag.mousemoveExchange(s, (v) => {
              s.engine.move(v, n.i);
            });
          } else
            _.itemDrag.mousemoveExchange(s);
          l.dragContainer = s;
          return;
        }
        if (!n)
          return;
        const S = r.element.getBoundingClientRect(), O = Math.abs(e.pageX - S.left - l.mousedownItemOffsetLeft) / n.element.clientWidth, P = Math.abs(e.pageY - S.top - l.mousedownItemOffsetTop) / n.element.clientHeight, U = O > P;
        if (Math.abs(O - P) < s.sensitivity || s.__ownTemp__.exchangeLock === !0)
          return;
        const pe = 3, Z = s.__ownTemp__.beforeOverItems;
        let _e = 0;
        for (let v = 0; v < Z.length && !(v >= 3); v++)
          Z[v] === n && _e++;
        if (_e >= pe) {
          s.__ownTemp__.exchangeLock = !0;
          let v = setTimeout(() => {
            s.__ownTemp__.exchangeLock = !1, clearTimeout(v), v = null;
          }, 200);
        } else if (Z.length < pe && n.draggable && n.transition && n.transition.time) {
          s.__ownTemp__.exchangeLock = !0;
          let v = setTimeout(() => {
            s.__ownTemp__.exchangeLock = !1, clearTimeout(v), v = null;
          }, n.transition.time);
        }
        r !== n && (s.__ownTemp__.beforeOverItems.unshift(n), Z.length > 20 && s.__ownTemp__.beforeOverItems.pop());
        const ye = r.container.eventManager._callback_("itemExchange", t, n);
        ye === !1 || ye === null || (s.responseMode === "default" ? U ? (s.engine.sortResponsiveItem(), s.engine.move(r, n.i)) : s.engine.exchange(r, n) : s.responseMode === "stream" ? (s.engine.sortResponsiveItem(), s.engine.move(r, n.i)) : s.responseMode === "exchange" && s.engine.exchange(r, n), s.engine.updateLayout());
      }, le = () => {
        if (!r.follow && !H(e))
          return;
        r.pos.nextStaticPos = new V(r.pos), r.pos.nextStaticPos.x = C < 1 ? 1 : C, r.pos.nextStaticPos.y = M < 1 ? 1 : M;
        let I = s.engine.findCoverItemFromPosition(
          r.pos.nextStaticPos.x,
          r.pos.nextStaticPos.y,
          r.pos.w,
          r.pos.h
        );
        if (I.length > 0 && (I = I.filter((w) => r !== w)), I.length === 0)
          s.__ownTemp__.firstEnterUnLock ? (_.itemDrag.mousemoveExchange(s), l.dragContainer = s) : (r.pos.x = r.pos.nextStaticPos.x, r.pos.y = r.pos.nextStaticPos.y, r.pos.nextStaticPos = null, s.engine.updateLayout([r])), f && _.cursor.cursor !== "mousedown" && _.cursor.mousedown(e);
        else {
          r.pos.nextStaticPos = null;
          const w = Y(e);
          w && r !== w && _.cursor.cursor !== "drag-to-item-no-drop" && _.cursor.dragToItemNoDrop();
        }
      };
      z.run(() => {
        const I = Object.assign({}, r.pos);
        if (s.responsive ? J() : le(), I.x !== r.pos.x || I.y !== r.pos.y) {
          const w = r._VueEvents.vueItemMovePositionChange;
          typeof w == "function" && w(I.x, I.y, r.pos.x, r.pos.y), r.container.eventManager._callback_("itemMovePositionChange", I.x, I.y, r.pos.x, r.pos.y);
        }
      });
    }, 36),
    mousemoveFromClone: (e) => {
      const t = l.mousedownEvent, n = l.fromItem, i = l.moveItem;
      if (t === null || n === null)
        return;
      let o = l.moveItem !== null ? i : n;
      const r = H(e);
      o.__temp__.dragging = !0, l.cloneElement === null ? (l.cloneElement = o.element.cloneNode(!0), l.cloneElement.classList.add("grid-clone-el", "grid-dragging-clone-el"), document.body.appendChild(l.cloneElement), o.addClass("grid-dragging-source-el"), o.updateStyle({
        pointerEvents: "none",
        transitionProperty: "none",
        transitionDuration: "none"
      }, l.cloneElement)) : r && r.__ownTemp__.firstEnterUnLock && z.run({
        func: () => {
          const m = l.fromItem, h = "grid-dragging-source-el";
          m.hasClass(h) || m.addClass(h);
        },
        rule: () => {
          var m;
          return r === ((m = l.fromItem) == null ? void 0 : m.container);
        },
        intervalTime: 2,
        timeout: 200
      });
      let s = e.pageX - l.mousedownItemOffsetLeft, f = e.pageY - l.mousedownItemOffsetTop;
      if (!o.dragOut) {
        const m = r.contentElement.getBoundingClientRect(), h = window.scrollX + m.left, d = window.scrollY + m.top, u = window.scrollX + m.left + r.contentElement.clientWidth - o.nowWidth(), g = window.scrollY + m.top + r.contentElement.clientHeight - o.nowHeight();
        s < h && (s = h), s > u && (s = u), f < d && (f = d), f > g && (f = g);
      }
      o.updateStyle({
        left: s + "px",
        top: f + "px"
      }, l.cloneElement);
    }
  }
}), c(D, "_eventPerformer", {
  item: {
    mouseenter: (e) => {
      if (e.stopPropagation(), !!H(e) && (e.target._gridItem_ && (l.toItem = Y(e)), l.toItem === null))
        return !1;
    }
  },
  other: {
    updateSlidePageInfo: W((e, t) => {
      l.slidePageOffsetInfo.newestPageX = e, l.slidePageOffsetInfo.newestPageY = t;
    }),
    slidePage: (e) => {
      const t = l.fromContainer;
      if (!t || !t.slidePage)
        return;
      const n = t.element;
      let i = e.pageX - l.mousedownEvent.pageX, o = e.pageY - l.mousedownEvent.pageY;
      const r = l.slidePageOffsetInfo.offsetLeft - i, s = l.slidePageOffsetInfo.offsetTop - o;
      r >= 0 && (n.scrollLeft = r), s >= 0 && (n.scrollTop = s), E.other.updateSlidePageInfo(e.pageX, e.pageY);
    }
  },
  container: {
    mousedown: (e) => {
      if (l.isDragging || l.isResizing)
        return;
      const t = H(e);
      if (!t || (l.fromItem = Y(e), !t && !l.fromItem))
        return;
      l.fromItem && !l.fromItem.static ? _.cursor.mousedown() : t && !l.fromItem && !e.touches && (_.cursor.mousedown(), l.slidePageOffsetInfo = {
        offsetTop: t.element.scrollTop,
        offsetLeft: t.element.scrollLeft,
        newestPageX: 0,
        newestPageY: 0
      }, l.dragOrResize = "slidePage");
      const n = e.target.className;
      if (l.mouseDownElClassName = n, !n.includes("grid-clone-el") && !n.includes("grid-item-close-btn")) {
        if (n.includes("grid-item-resizable-handle"))
          l.dragOrResize = "resize", l.fromItem && (l.fromItem.__temp__.resizeLock = !0);
        else if (l.fromItem) {
          if (!l.fromItem.container.responsive && l.fromItem.static)
            return;
          const i = l.fromItem;
          if ((i.dragIgnoreEls || []).length > 0) {
            let r = !0;
            for (let s = 0; s < i.dragIgnoreEls.length; s++) {
              const f = i.dragIgnoreEls[s];
              if (f instanceof Element)
                e.target === f && (r = !1);
              else if (typeof f == "string") {
                const m = i.element.querySelectorAll(f);
                Array.from(m).forEach((h) => {
                  e.path.includes(h) && (r = !1);
                });
              }
              if (r === !1)
                return;
            }
          }
          if ((i.dragAllowEls || []).length > 0) {
            let r = !1;
            for (let s = 0; s < i.dragAllowEls.length; s++) {
              const f = i.dragAllowEls[s];
              if (f instanceof Element) {
                if (e.target === f) {
                  r = !0;
                  break;
                }
              } else if (typeof f == "string") {
                const m = i.element.querySelectorAll(f);
                Array.from(m).forEach((h) => {
                  e.path.includes(h) && (r = !0);
                });
              }
            }
            if (r === !1)
              return;
          }
          if (l.dragOrResize = "drag", l.fromItem.__temp__.dragging)
            return;
          const o = l.fromItem.element.getBoundingClientRect();
          l.mousedownItemOffsetLeft = e.pageX - (o.left + window.scrollX), l.mousedownItemOffsetTop = e.pageY - (o.top + window.scrollY);
        }
        l.isLeftMousedown = !0, l.mousedownEvent = e, l.fromContainer = t, _.check.resizeOrDrag(e), l.fromItem && (l.fromItem.__temp__.clientWidth = l.fromItem.nowWidth(), l.fromItem.__temp__.clientHeight = l.fromItem.nowHeight(), l.offsetPageX = l.fromItem.offsetLeft(), l.offsetPageY = l.fromItem.offsetTop());
      }
    },
    mousemove: W((e) => {
      const t = Ge(e), n = Le(t), i = Y(e);
      if (l.isLeftMousedown) {
        if (l.beforeContainerArea = l.currentContainerArea, l.currentContainerArea = t || null, l.beforeContainer = l.currentContainer, l.currentContainer = n || null, l.currentContainerArea !== null && l.beforeContainerArea !== null ? l.currentContainerArea !== l.beforeContainerArea && _.moveOuterContainer.leaveToEnter(l.beforeContainer, l.currentContainer) : (l.currentContainerArea !== null || l.beforeContainerArea !== null) && (l.beforeContainerArea === null && _.moveOuterContainer.mouseenter(null, l.currentContainer), l.currentContainerArea === null && _.moveOuterContainer.mouseleave(null, l.beforeContainer)), l.dragOrResize === "slidePage") {
          E.other.slidePage(e);
          return;
        }
        const o = () => {
          n ? n && (n.responsive ? _.cursor.cursor !== "mousedown" && _.cursor.mousedown() : n.responsive) : _.cursor.cursor !== "no-drop" && _.cursor.notDrop();
        };
        l.isDragging ? (_.itemDrag.mousemoveFromClone(e), o()) : l.isResizing && _.itemResize.doResize(e);
      } else if (i) {
        const o = e.target.classList;
        o.contains("grid-item-close-btn") ? _.cursor.cursor !== "item-close" && _.cursor.itemClose() : o.contains("grid-item-resizable-handle") ? _.cursor.cursor !== "item-resize" && _.cursor.itemResize() : i.static && n && !n.responsive ? _.cursor.cursor !== "static-no-drop" && _.cursor.staticItemNoDrop() : _.cursor.cursor !== "in-container" && _.cursor.inContainer();
      } else
        H(e) ? _.cursor.cursor !== "in-container" && _.cursor.inContainer() : _.cursor.cursor !== "default" && _.cursor.default();
    }, 12),
    mouseup: (e) => {
      const t = H(e);
      l.isResizing && _.itemResize.mouseup(e), t && _.cursor.cursor !== "in-container" && _.cursor.inContainer();
      const n = l.fromItem, i = l.moveItem ? l.moveItem : l.fromItem;
      if (l.cloneElement !== null) {
        let f = null;
        const m = document.querySelectorAll(".grid-clone-el");
        for (let h = 0; h < m.length; h++) {
          let u = function() {
            i.removeClass("grid-dragging-source-el", "grid-resizing-source-el");
            try {
              d.parentNode.removeChild(d);
            } catch {
            }
            i.__temp__.dragging = !1, n.__temp__.dragging = !1, clearTimeout(f), f = null;
          };
          const d = m[h];
          if (i.transition) {
            const g = i.container.contentElement.getBoundingClientRect();
            if (l.isDragging) {
              let y = window.scrollX + g.left + i.offsetLeft(), p = window.scrollY + g.top + i.offsetTop();
              i.updateStyle({
                transitionProperty: `${i.transition.field}`,
                transitionDuration: `${i.transition.time}ms`,
                width: `${i.nowWidth()}px`,
                height: `${i.nowHeight()}px`,
                left: `${y}px`,
                top: `${p}px`
              }, d);
            } else
              l.isResizing && i.updateStyle({
                transitionProperty: `${i.transition.field}`,
                transitionDuration: `${i.transition.time}ms`,
                width: `${i.nowWidth()}px`,
                height: `${i.nowHeight()}px`,
                left: `${i.offsetLeft()}px`,
                top: `${i.offsetTop()}px`
              }, d);
          }
          i.transition ? f = setTimeout(u, i.transition.time) : u();
        }
      }
      const o = document.querySelectorAll(".grid-item-mask");
      for (let f = 0; f < o.length; f++) {
        const m = o[f];
        m.parentElement.removeChild(m);
      }
      const r = l.mouseDownElClassName;
      if (r && r.includes("grid-item-close-btn") && (e.touchTarget ? e.touchTarget : e.target).classList.contains("grid-item-close-btn")) {
        const m = Y(e);
        m === l.fromItem && m.remove(!0);
      }
      const s = l.moveContainer ? l.moveContainer : l.fromContainer;
      if (s && (s.__ownTemp__.firstEnterUnLock = !1, s.__ownTemp__.exchangeLock = !1, s.__ownTemp__.beforeOverItems = [], s.__ownTemp__.moveCount = 0, l.fromContainer && s !== l.fromContainer && (l.fromContainer.__ownTemp__.firstEnterUnLock = !1)), n && (n.container.engine.updateLayout(!0), n.container.childContainer.forEach((h) => {
        h.nestingItem === n && h.container.engine.updateLayout(!0);
      })), n && i.container !== n.container && (i == null || i.container.engine.updateLayout(!0)), i && (l.isDragging && i.container.eventManager._callback_("itemMoved", i.pos.x, i.pos.y, i), l.isResizing && i.container.eventManager._callback_("itemResized", i.pos.w, i.pos.h, i)), l.isLeftMousedown && l.dragOrResize === "slidePage") {
        const f = l.slidePageOffsetInfo, m = f.newestPageX - e.pageX, h = f.newestPageY - e.pageY;
        let d = 500;
        const u = l.fromContainer;
        if (u.slidePage && (h >= 20 || m >= 20)) {
          let g = setInterval(() => {
            d -= 20, u.element.scrollTop += parseInt((h / 100 * d / 30 || 0).toString()), u.element.scrollLeft += parseInt((m / 100 * d / 30 || 0).toString()), (d <= 0 || l.isLeftMousedown) && (clearInterval(g), g = null);
          }, 20);
        }
      }
      l.fromItem && (l.fromItem.__temp__.resizeLock = !1), l.fromContainer = null, l.moveContainer = null, l.dragContainer = null, l.beforeContainerArea = null, l.currentContainerArea = null, l.cloneElement = null, l.fromItem = null, l.toItem = null, l.moveItem = null, l.offsetPageX = null, l.offsetPageY = null, l.isDragging = !1, l.isResizing = !1, l.isLeftMousedown = !1, l.dragOrResize = null, l.mousedownEvent = null, l.mousedownItemOffsetLeft = null, l.mousedownItemOffsetTop = null, l.mouseDownElClassName = null, l.exchangeItems = {
        new: null,
        old: null
      };
    },
    touchstartOrMousedown: (e) => {
      if (e = e || window.event, e.touches ? (e.stopPropagation && e.stopPropagation(), l.deviceEventMode = "touch", e = ue(e)) : l.deviceEventMode = "mouse", l.deviceEventMode === "touch") {
        l.allowTouchMoveItem = !1;
        const t = H(e);
        document.addEventListener("contextmenu", _.prevent.contextmenu);
        const n = t ? t.pressTime : 360;
        l.timeOutEvent = setTimeout(() => {
          l.allowTouchMoveItem = !0, E.container.mousemove(e);
          let i = setTimeout(() => {
            document.removeEventListener("contextmenu", _.prevent.contextmenu), clearTimeout(i), i = null;
          }, 600);
          clearTimeout(l.timeOutEvent);
        }, n);
      }
      E.container.mousedown(e);
    },
    touchmoveOrMousemove: (e) => {
      if (e = e || window.event, e.touches) {
        if (l.deviceEventMode = "touch", l.allowTouchMoveItem)
          e.preventDefault && e.preventDefault();
        else {
          clearTimeout(l.timeOutEvent);
          return;
        }
        e = ue(e);
      } else
        l.deviceEventMode = "mouse";
      e.stopPropagation && e.stopPropagation(), _.itemDrag.mousemoveFromItemChange(e), E.container.mousemove(e);
    },
    touchendOrMouseup: (e) => {
      e = e || window.event, e.touches ? (clearTimeout(l.timeOutEvent), l.allowTouchMoveItem = !1, l.deviceEventMode = "touch", e = ue(e), document.removeEventListener("contextmenu", _.prevent.contextmenu)) : l.deviceEventMode = "mouse", E.container.mouseup(e);
    }
  }
});
const _ = D._eventEntrustFunctor, E = D._eventPerformer;
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
    let o = 350, r = !1;
    i.throttleTime && (o = i.throttleTime), i.capture && (r = i.capture);
    const s = n || this.element, f = W(t, o);
    return s.addEventListener(e, f, r), f;
  }
  removeEvent(e, t, n = null) {
    (n || this.element).removeEventListener(e, t);
  }
  throttle(e, t) {
    return W(e, t);
  }
}
const ce = F.store;
class ne extends ze {
  constructor(t) {
    super();
    c(this, "el", "");
    c(this, "name", "");
    c(this, "type", null);
    c(this, "follow", !0);
    c(this, "dragOut", !0);
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
      resized: {
        w: 1,
        h: 1
      }
    });
    c(this, "exportConfig", () => {
      const t = this, n = {};
      let i = {};
      i = t.pos.export(), this.responsive && (delete i.x, delete i.y), n.pos = i, Array.from(["static", "draggable", "resize", "close"]).forEach((r) => {
        t[r] !== !1 && (n[r] = t[r]);
      }), Array.from(["follow", "dragOut", "exchange"]).forEach((r) => {
        t[r] !== !0 && (n[r] = t[r]);
      }), typeof t.name == "string" && (n.name = t.name), typeof t.type == "string" && (n.type = t.type);
      let o = {};
      return t.transition.field !== "top,left,width,height" ? (o.field = t.transition.field, t.transition.time !== 180 && (o.time = t.transition.time), n.transition = o) : t.transition.time !== 180 && (n.transition = t.transition.time), n;
    });
    c(this, "nowWidth", (t) => {
      let n = 0;
      const i = t || this.pos.w;
      return i > 1 && (n = (i - 1) * this.margin[0]), i * this.size[0] + n;
    });
    c(this, "nowHeight", (t) => {
      let n = 0;
      const i = t || this.pos.h;
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
    t.el instanceof Element && (this.el = t.el, this.element = t.el), this._define(), X(this, t), this.pos = new V(t.pos), this._itemSizeLimitCheck();
  }
  _define() {
    const t = this;
    let n = !1, i = !1, o = !1, r = !1, s = {
      time: 180,
      field: "top,left,width,height"
    };
    Object.defineProperties(this, {
      draggable: {
        configurable: !1,
        get: () => n,
        set(f) {
          if (typeof f == "boolean") {
            if (n === f)
              return;
            n = f, t.edit = n || i || o;
          }
        }
      },
      resize: {
        configurable: !1,
        get: () => i,
        set(f) {
          if (typeof f == "boolean") {
            if (i === f)
              return;
            i = f, t._handleResize(f), t.edit = n || i || o;
          }
        }
      },
      close: {
        configurable: !1,
        get: () => o,
        set(f) {
          if (typeof f == "boolean") {
            if (o === f)
              return;
            o = f, t._closeBtn(f), t.edit = n || i || o;
          }
        }
      },
      edit: {
        configurable: !1,
        get: () => r,
        set(f) {
          if (typeof f == "boolean") {
            if (r === f)
              return;
            r = f, t._edit(r);
          }
        }
      },
      transition: {
        configurable: !1,
        get: () => s,
        set(f) {
          f === !1 && (s.time = 0), typeof f == "number" && (s.time = f), typeof f == "object" && (f.time && f.time !== s.time && (s.time = f.time), f.field && f.field !== s.field && (s.field = f.field)), t.animation(s);
        }
      }
    });
  }
  mount() {
    const t = () => {
      this._mounted || (this.container.platform !== "vue" && (this.element === null && (this.element = document.createElement(this.tagName)), this.container.contentElement.appendChild(this.element)), this.attr = Array.from(this.element.attributes), this.element.classList.add(this.className), this.classList = Array.from(this.element.classList), this.updateStyle(q.gridItem), this.updateStyle(this._genItemStyle()), this.__temp__.w = this.pos.w, this.__temp__.h = this.pos.h, this.element._gridItem_ = this, this.element._isGridItem_ = !0, this._mounted = !0, this.container.eventManager._callback_("itemMounted", this));
    };
    this.container.platform === "vue" ? t() : z.run(t);
  }
  unmount(t = !1) {
    z.run(() => {
      this._mounted ? (this.__temp__.editNumUsing && (this.__temp__.editNumUsing = !1, ce.editItemNum--), this._handleResize(!1), this._closeBtn(!1), this.container.contentElement.removeChild(this.element), this.container.eventManager._callback_("itemUnmounted", this)) : this.container.eventManager._error_("ItemAlreadyRemove", "\u8BE5Item\u5BF9\u5E94\u7684element\u672A\u5728\u6587\u6863\u4E2D\u6302\u8F7D\uFF0C\u53EF\u80FD\u5DF2\u7ECF\u88AB\u79FB\u9664", this);
    }), t && this.remove(), this._mounted = !1;
  }
  remove(t = !1) {
    this.container.engine.remove(this), t && this.unmount();
  }
  _edit(t = !1) {
    this.edit === !0 ? this.__temp__.editNumUsing || (D.startEvent(null, this), this.__temp__.editNumUsing = !0, ce.editItemNum++) : this.edit === !1 && this.__temp__.editNumUsing && (D.removeEvent(null, this), ce.editItemNum--, this.__temp__.editNumUsing = !1);
  }
  animation(t) {
    if (typeof t != "object") {
      console.log("\u53C2\u6570\u5E94\u8BE5\u662F\u5BF9\u8C61\u5F62\u5F0F{time:Number, field:String}");
      return;
    }
    z.run(() => {
      const n = {};
      t.time > 0 ? (n.transitionProperty = t.field, n.transitionDuration = t.time + "ms", n.transitionTimingFunction = "ease-out") : t.time === 0 && (n.transition = "none"), this.updateStyle(n);
    });
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
        const r = document.createElement("span");
        r.innerHTML = "\u22BF", this.updateStyle(q.gridResizableHandle, r), this.element.appendChild(r), r.classList.add(i), this._resizeTabEl = r;
      } else if (this.element && t === !1)
        for (let o = 0; o < this.element.children.length; o++) {
          const r = this.element.children[o];
          r.className.includes(i) && (this.element.removeChild(r), this._resizeTabEl = null);
        }
    };
    this.element ? n() : z.run(n);
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
          const r = this.element.children[o];
          r.className.includes(i) && (this.element.removeChild(r), this._closeEl = null);
        }
    };
    this.element ? n() : z.run(n);
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
    let r = !0;
    const s = this.toINameHash(e.i), f = e.x + e.w - 1, m = e.y + e.h - 1;
    if (f > this.col || m > this.row)
      return !1;
    for (let h = n - 1; h <= o - 1; h++)
      for (let d = t - 1; d <= i - 1; d++) {
        const u = this._layoutMatrix[h][d];
        if (s.toString() !== u && u !== !1) {
          r = !1;
          break;
        }
      }
    return r;
  }
  _findRowBlank(e = [], t, n, i) {
    let o = 0;
    for (let r = n; r <= i; r++)
      if (e[r] !== !1 ? o = 0 : e[r] === !1 && o++, o === t)
        return {
          success: !0,
          xStart: r + 1 - t,
          xEnd: r,
          xWidth: t
        };
    return { success: !1 };
  }
  _findBlankPosition(e, t) {
    let n = 0, i = this.col - 1, o = 0, r = [];
    e > this.col && (console.warn("ITEM:", "w:" + e, "x", "h:" + t, "\u7684\u5BBD\u5EA6", e, "\u8D85\u8FC7\u6805\u683C\u5927\u5C0F\uFF0C\u81EA\u52A8\u8C03\u6574\u8BE5ITEM\u5BBD\u5EA6\u4E3A\u6805\u683C\u6700\u5927\u5BBD\u5EA6", this.col), e = this.col);
    let s = 0;
    for (; s++ < 500; ) {
      this._layoutMatrix.length < t + o && this.isAutoRow && this.addRow(t + o - this._layoutMatrix.length);
      let f = !0, m = !1;
      if (!this.col)
        throw new Error("\u672A\u627E\u5230\u7ECF\u8FC7\u5F15\u64CE\u5904\u7406\u8FC7\u540E\u7684col\uFF0C\u53EF\u80FD\u662F\u5C11\u4F20\u53C2\u6570\u6216\u8005\u4EE3\u7801\u6267\u884C\u987A\u5E8F\u6709\u8BEF\uFF0C\u5018\u82E5\u8FD9\u6837\uFF0C\u4E0D\u7528\u95EE\uFF0C\u8FD9\u5C31\u662Fbug");
      for (let h = 0; h < t; h++) {
        r = this._layoutMatrix[o + h], this.DebuggerTemp.yPointStart = o;
        let d = this._findRowBlank(r, e, n, i);
        if (d.success === !1) {
          if (f = !1, m || (h = -1, n = i + 1, i = this.col - 1), n > i) {
            m = !0;
            break;
          }
        } else
          d.success === !0 && (f = !0, h === 0 && (n = d.xStart, i = d.xEnd));
      }
      if (f)
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
  _updateSeatLayout({ xStart: e, yStart: t, xEnd: n, yEnd: i, iName: o }, r = null) {
    o === void 0 && (o = "true");
    let s = r !== null ? r : o.toString();
    for (let f = t - 1; f <= i - 1; f++)
      for (let m = e - 1; m <= n - 1; m++)
        try {
          this.isDebugger ? this._layoutMatrix[f][m] = "__debugger__" : this._layoutMatrix[f][m] = s;
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
    c(this, "container", null);
    c(this, "useLayoutConfig", {});
    c(this, "option", {});
    c(this, "_defaultLayoutConfig", Ve);
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
  genLayoutConfig(e = null) {
    var w, N;
    let t = {}, n = {};
    e = e || ((w = this.container.element) == null ? void 0 : w.clientWidth);
    const i = (N = this.container.element) == null ? void 0 : N.clientHeight, o = this.container.layouts.sort((b, x) => b.px - x.px);
    for (let b = 0; b < o.length && (n = o[b], Array.isArray(n.data) || (n.data = []), o.length !== 1); b++)
      if (!(n.px < e))
        break;
    if (e === 0 && !t.col)
      throw new Error("\u8BF7\u5728layout\u4E2D\u4F20\u5165col\u7684\u503C\u6216\u8005\u4E3AContainer\u8BBE\u7F6E\u4E00\u4E2A\u521D\u59CB\u5BBD\u5EA6");
    t = Object.assign($(this.option.global), $(n));
    let {
      col: r = null,
      row: s = this.container.row,
      ratioCol: f = this.container.ratioCol,
      ratioRow: m = this.container.ratioRow,
      size: h = [null, null],
      margin: d = [null, null],
      padding: u = 0,
      sizeWidth: g,
      sizeHeight: y,
      marginX: p,
      marginY: C,
      marginLimit: M = {}
    } = t;
    const J = (b = "") => {
      const x = t[b];
      Array.isArray(x) && (!["number", "string"].includes(typeof x[0]) || !["number", "string"].includes(typeof x[1])) && console.error(b, "\u6570\u7EC4\u5185\u7684\u53C2\u6570\u503C\u53EA\u80FD\u4E3A\u6570\u5B57\u6216\u8005\u6570\u5B57\u5F62\u5F0F\u7684\u5B57\u7B26\u4E32");
    };
    if (J("margin"), J("size"), !r && !(h[0] || g))
      throw new Error("col\u6216\u8005size[0]\u5FC5\u987B\u8981\u8BBE\u5B9A\u4E00\u4E2A,\u60A8\u4E5F\u53EF\u4EE5\u8BBE\u5B9Acol\u6216sizeWidth\u4E24\u4E2A\u4E2D\u7684\u4E00\u4E2A\u4FBF\u80FD\u8FDB\u884C\u5E03\u5C40");
    if (p && (d[0] = p), C && (d[1] = C), g && (h[0] = g), y && (h[1] = y), r)
      if (h[0] === null && d[0] === null)
        parseInt(r) === 1 ? (d[0] = 0, h[0] = e / r) : (d[0] = e / (r - 1 + r / f), h[0] = d[0] / f, h[0] = (e - (r - 1) * d[0]) / r);
      else if (h[0] !== null && d[0] === null)
        parseInt(r) === 1 ? d[0] = 0 : d[0] = (e - r * h[0]) / (r - 1), d[0] <= 0 && (d[0] = 0);
      else if (h[0] === null && d[0] !== null) {
        if (parseInt(r) === 1 && (d[0] = 0), h[0] = (e - (r - 1) * d[0]) / r, h[0] <= 0)
          throw new Error("\u5728margin[0]\u6216\u5728marginX\u4E3A" + d[0] + "\u7684\u60C5\u51B5\u4E0B,size[0]\u6216sizeWidth\u7684Item\u4E3B\u4F53\u5BBD\u5EA6\u5DF2\u7ECF\u5C0F\u4E8E0,\u60A8\u53EF\u4EE5\u8C03\u5C0Fmargin\u6216\u8005\u8BBE\u5B9AContainer\u6700\u5C0F\u5BBD\u5EA6\u6216\u8005\u9AD8\u5EA6(css:min-XXX),\u4E14\u4FDD\u8BC1margin*(col||row)\u5927\u4E8E\u6700\u5C0F\u5BBD\u5EA6");
      } else
        h[0] !== null && d[0];
    else
      r === null && (d[0] === null && h[0] !== null ? e <= h[0] ? (d[0] = 0, r = 1) : (r = Math.floor(e / h[0]), d[0] = (e - h[0] * r) / r) : d[0] !== null && h[0] !== null && (e <= h[0] ? (d[0] = 0, r = 1) : r = Math.floor((e + d[0]) / (d[0] + h[0]))));
    t = Object.assign(t, {
      padding: u,
      margin: d,
      size: h,
      col: r
    });
    let le = (b) => {
      let { margin: x, size: L, minCol: A, maxCol: k, col: S, padding: O } = b;
      x[0] = x[0] ? parseFloat(x[0].toFixed(1)) : 0, L[0] = L[0] ? parseFloat(L[0].toFixed(1)) : 0;
      let P = null, U = null;
      return i && !x[1] && !L[1] ? (P = i / (s - 1 + S / m), U = P / m, U = (i - (s - 1) * P) / s, x[1] = parseFloat(P.toFixed(1)), L[1] = parseFloat(U.toFixed(1))) : (x[1] = x[1] ? parseFloat(x[1].toFixed(1)) : parseFloat(x[0].toFixed(1)), L[1] = L[1] ? parseFloat(L[1].toFixed(1)) : parseFloat(L[0].toFixed(1))), S < A && (b.col = A), S > k && (b.col = k), b;
    };
    const I = {};
    for (const b in t)
      (this.option.global[b] !== void 0 || n[b] !== void 0) && (I[b] = t[b]);
    return this.useLayoutConfig = Object.assign(this.useLayoutConfig, le(t)), this.container.layout = n, this.container.useLayout = t, {
      layout: n,
      global: this.option.global,
      useLayoutConfig: t,
      currentLayout: I
    };
  }
}
class Ze {
  constructor(e) {
    c(this, "items", []);
    c(this, "option", {});
    c(this, "layoutManager", null);
    c(this, "container", null);
    c(this, "layoutConfig", null);
    c(this, "initialized", !1);
    c(this, "__temp__", {
      responsiveFunc: null,
      staticIndexCount: 0
    });
    this.option = e;
  }
  init() {
    this.initialized || (this.layoutManager = new $e(), this.layoutConfig = new Je(this.option), this.layoutConfig.setContainer(this.container), this.layoutConfig.initLayoutInfo(), this.initialized = !0);
  }
  _sync() {
    let e = this.layoutConfig.genLayoutConfig();
    this._syncLayoutConfig(e.useLayoutConfig);
  }
  _syncLayoutConfig(e = null) {
    if (!!e) {
      if (Object.keys(e).length === 0 && !this.option.col)
        throw new Error("\u672A\u627E\u5230layout\u76F8\u5173\u51B3\u5B9A\u5E03\u5C40\u914D\u7F6E\u4FE1\u606F\uFF0C\u60A8\u53EF\u80FD\u662F\u672A\u4F20\u5165col\u5B57\u6BB5");
      X(this.container, e, !1, ["events"]), this.autoSetColAndRows(this.container), this.items.forEach((t) => {
        X(t, {
          margin: e.margin,
          size: e.size
        });
      });
    }
  }
  autoSetColAndRows(e, t = !0) {
    let n = e.col, i = e.row, o = n, r = i;
    const s = e.engine.items, f = (u) => {
      let g = 1, y = 1;
      return u.length > 0 && u.forEach((p) => {
        p.pos.x + p.pos.w - 1 > g && (g = p.pos.x + p.pos.w - 1), p.pos.y + p.pos.h - 1 > y && (y = p.pos.y + p.pos.h - 1);
      }), { smartCol: g, smartRow: y };
    }, m = (u, g) => (e.minCol && e.maxCol && e.minCol > e.maxCol ? (u = e.maxCol, console.warn("minCol\u6307\u5B9A\u7684\u503C\u5927\u4E8EmaxCol,\u5C06\u4EE5maxCol\u6307\u5B9A\u7684\u503C\u4E3A\u4E3B")) : e.maxCol && u > e.maxCol ? u = e.maxCol : e.minCol && u < e.minCol && (u = e.minCol), e.minRow && e.maxRow && e.minRow > e.maxRow ? (g = e.maxRow, console.warn("minRow\u6307\u5B9A\u7684\u503C\u5927\u4E8EmaxRow,\u5C06\u4EE5maxRow\u6307\u5B9A\u7684\u503C\u4E3A\u4E3B")) : e.maxRow && g > e.maxRow ? g = e.maxRow : e.minRow && g < e.minRow && (g = e.minRow), {
      limitCol: u,
      limitRow: g
    }), h = () => {
      if (!this.initialized)
        e.row ? i = e.row : this.layoutManager.autoRow(), e.maxRow && console.warn("\u3010\u54CD\u5E94\u5F0F\u3011\u6A21\u5F0F\u4E2D\u4E0D\u5EFA\u8BAE\u4F7F\u7528maxRow,\u60A8\u5982\u679C\u4F7F\u7528\u8BE5\u503C\uFF0C\u53EA\u4F1A\u9650\u5236\u5BB9\u5668\u76D2\u5B50(Container)\u7684\u9AD8\u5EA6,\u4E0D\u80FD\u9650\u5236\u6210\u5458\u6392\u5217\u7684row\u503C \u56E0\u4E3A\u54CD\u5E94\u5F0F\u8BBE\u8BA1\u662F\u80FD\u81EA\u52A8\u7BA1\u7406\u5BB9\u5668\u7684\u9AD8\u5EA6\uFF0C\u60A8\u5982\u679C\u60F3\u8981\u9650\u5236Container\u663E\u793A\u533A\u57DF\u4E14\u83B7\u5F97\u5185\u5BB9\u6EDA\u52A8\u80FD\u529B\uFF0C\u60A8\u53EF\u4EE5\u5728Container\u5916\u90E8\u52A0\u4E0A\u4E00\u5C42\u76D2\u5B50\u5E76\u8BBE\u7F6E\u6210overflow:scroll");
      else if (this.initialized) {
        this.layoutManager.autoRow(), i = f(s).smartRow;
        const g = m(n, i);
        o = g.limitCol, r = g.limitRow;
      }
    }, d = () => {
      const u = m(e.col, e.row);
      o = n = u.limitCol, r = i = u.limitRow;
    };
    if (e.responsive ? h() : e.responsive || d(), t) {
      this.container.col = n, this.container.row = i, this.container.containerW = o, this.container.containerH = r, this.layoutManager.setColNum(n), this.layoutManager.setRowNum(i), this.layoutManager.addRow(i - this.layoutManager._layoutMatrix.length);
      const u = this.container.__ownTemp__.preCol, g = this.container.__ownTemp__.preRow;
      if (n !== u) {
        this.container.__ownTemp__.preCol = n, this.container.eventManager._callback_("colChange", n, u, e);
        const y = this.container._VueEvents.vueColChange;
        typeof y == "function" && y(n, u, e);
      }
      if (i !== g) {
        this.container.__ownTemp__.preRow = i, this.container.eventManager._callback_("rowChange", i, g, e);
        const y = this.container._VueEvents.vueRowChange;
        typeof y == "function" && y(i, g, e);
      }
    }
    return {
      col: n,
      row: i,
      containerW: o,
      containerH: r
    };
  }
  findCoverItemFromPosition(e, t, n, i, o = null) {
    o = o || this.items;
    const r = [];
    for (let s = 0; s < o.length; s++) {
      let f = o[s];
      const m = e, h = t, d = e + n - 1, u = t + i - 1, g = f.pos.x, y = f.pos.y, p = f.pos.x + f.pos.w - 1, C = f.pos.y + f.pos.h - 1;
      ((p >= m && p <= d || g >= m && g <= d || m >= g && d <= p) && (C >= h && C <= u || y >= h && y <= u || h >= y && u <= C) || m >= g && d <= p && h >= y && u <= C) && r.push(f);
    }
    return r;
  }
  findResponsiveItemFromPosition(e, t, n, i) {
    let o = null, r = 1;
    this.items.length > 0 && (r = this.items[this.items.length - 1].pos.y);
    for (let s = 0; s < this.items.length; s++) {
      let f = this.items[s];
      if (!f)
        continue;
      const m = f.pos.x, h = f.pos.y, d = f.pos.x + f.pos.w - 1, u = f.pos.y + f.pos.h - 1;
      m === e && (t > r && (t = r), e === m && t === h && (o = f));
    }
    return o;
  }
  findStaticBlankMaxMatrixFromItem(e) {
    const t = e.pos.x, n = e.pos.y, i = e.pos.w, o = e.pos.h;
    let r = this.container.col - t + 1, s = this.container.row - n + 1, f = r, m = s;
    for (let h = 0; h < this.items.length; h++) {
      const d = this.items[h], u = d.pos;
      e !== d && (u.x + u.w - 1 < t || u.y + u.h - 1 < n || (u.x >= t && u.x - t < r && (n + o - 1 >= u.y && n + o - 1 <= u.y + u.h - 1 || u.y + u.h - 1 >= n && u.y + u.h - 1 <= n + o - 1) && (r = u.x - t), u.y >= n && u.y - n < s && (t + i - 1 >= u.x && t + i - 1 <= u.x + u.w - 1 || u.x + u.w - 1 >= t && u.x + u.w - 1 <= t + i - 1) && (s = u.y - n), u.x >= t && u.x - t < f && (n + s - 1 >= u.y && n + s - 1 <= u.y + u.h - 1 || u.y + u.h - 1 >= n && u.y + u.h - 1 <= n + s - 1) && (f = u.x - t), u.y >= n && u.y - n < m && (t + r - 1 >= u.x && t + r - 1 <= u.x + u.w - 1 || u.x + u.w - 1 >= t && u.x + u.w - 1 <= t + r - 1) && (m = u.y - n)));
    }
    return {
      maxW: r,
      maxH: s,
      minW: f,
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
  sortStatic() {
    const e = [], t = [];
    return this.items.forEach((n) => {
      !n instanceof ne || !n._mounted || n.element.parentNode === null || (n.pos.static === !0 ? e.push(n) : t.push(n));
    }), this.renumber(), e.concat(t);
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
      !this.container._mounted || this.container.responsive ? e.pos.autoOnce = !0 : this.container.responsive || !e._mounted && e.pos.autoOnce === null && (e.pos.autoOnce = !0);
      const i = this.push(e);
      return i ? n._callback_("addItemSuccess", e) : this.container.responsive || n._error_(
        "ContainerOverflowError",
        "getErrAttr=>[name|message] \u5BB9\u5668\u6EA2\u51FA\uFF0C\u53EA\u6709\u9759\u6001\u6A21\u5F0F\u4E0B\u4F1A\u51FA\u73B0\u6B64\u9519\u8BEF,\u60A8\u53EF\u4EE5\u4F7F\u7528error\u4E8B\u4EF6\u51FD\u6570\u63A5\u6536\u8BE5\u9519\u8BEF\uFF0C\u90A3\u4E48\u8BE5\u9519\u8BEF\u5C31\u4E0D\u4F1A\u629B\u51FA\u800C\u662F\u5C06\u9519\u8BEF\u4F20\u5230error\u4E8B\u4EF6\u51FD\u6570\u7684\u7B2C\u4E8C\u4E2A\u5F62\u53C2",
        e,
        e
      ), i ? e : null;
    }
    return null;
  }
  push(e) {
    const t = this._isCanAddItemToContainer_(e, e.pos.autoOnce, !0);
    if (!this.container.autoReorder)
      return this.items.push(e), !0;
    let n = !1;
    if (t)
      if (this.items.length <= 1)
        this.items.push(e), n = !0;
      else {
        let i, o;
        for (let r = 0; r < this.items.length; r++)
          if (this.items.length > r && (o = this.items[r], i = this.items[r + 1]), i) {
            const s = o.pos, f = i.pos;
            if (s.y <= t.y && f.y > t.y) {
              this.insert(e, r + 1), n = !0;
              break;
            }
          } else {
            this.items.push(e), n = !0;
            break;
          }
      }
    return n;
  }
  sortResponsiveItem() {
    const e = [];
    for (let t = 1; t <= this.container.row; t++)
      for (let n = 1; n <= this.container.col; n++)
        for (let i = 0; i < this.items.length; i++) {
          const o = this.items[i];
          if (!o)
            debugger;
          if (o.pos.x === n && o.pos.y === t) {
            e.push(o);
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
  _isCanAddItemToContainer_(e, t = !1, n = !1) {
    let i, o = e.pos.nextStaticPos !== null ? e.pos.nextStaticPos : e.pos;
    return o.i = e.i, i = this.layoutManager.findItem(o, t), i !== null ? (n && (this.layoutManager.addItem(i), e.pos = new V(X(this._genItemPosArg(e), i)), e.pos.nextStaticPos = null, e.pos.autoOnce = !1), i) : null;
  }
  updateLayout(e = null, t = []) {
    if (this.container.responsive) {
      this.reset(), this._sync(), this.renumber();
      let o = e;
      (e === !0 || o === null) && (o = []), e = this.items, o = o.filter((s) => e.includes(s)), o.length === 0 && (o = e.filter((s) => s.__temp__.resizeLock));
      const r = (s) => {
        this._isCanAddItemToContainer_(s, s.autoOnce, !0) && s.updateItemLayout();
      };
      o.forEach((s) => {
        s.autoOnce = !1, r(s);
      }), e.forEach((s) => {
        o.includes(s) || (s.autoOnce = !0, r(s));
      }), this.autoSetColAndRows(this.container);
    } else if (!this.container.responsive) {
      let o = [];
      if (e === null)
        o = [];
      else if (Array.isArray(e))
        o = e;
      else if (e !== !0 && o.length === 0)
        return;
      this.reset(), this._sync(), this.renumber(), e = this.items, o = o.filter((s) => e.includes(s)), this._sync();
      const r = (s) => {
        this._isCanAddItemToContainer_(s, !1, !0), s.updateItemLayout();
      };
      e.forEach((s) => {
        o.includes(s) || r(s);
      }), o.forEach((s) => {
        r(s);
      });
    }
    this.container.layout.data = this.container.exportData(), this.container.updateContainerStyleSize();
    const n = (o) => ({
      row: o.row,
      col: o.col,
      containerW: o.containerW,
      containerH: o.containerH,
      width: o.nowWidth(),
      height: o.nowHeight()
    }), i = this.container;
    if (!i.__ownTemp__.beforeContainerSizeInfo)
      i.__ownTemp__.beforeContainerSizeInfo = n(i);
    else {
      const o = i.__ownTemp__.beforeContainerSizeInfo;
      if (o.containerW !== i.containerW || o.containerH !== i.containerH) {
        const r = n(i);
        i.__ownTemp__.beforeContainerSizeInfo = n(i), this.container.eventManager._callback_("containerSizeChange", o, r, i);
      }
    }
  }
  _genItemPosArg(e) {
    return e.pos.col = (() => this.container.col)(), e.pos.row = (() => this.container.row)(), e.pos;
  }
}
class ge extends Error {
  constructor() {
    super(...arguments);
    c(this, "name", ge.name);
    c(this, "message", "getErrAttr=>[name|message] \u5BB9\u5668\u6EA2\u51FA\uFF0C\u53EA\u6709\u9759\u6001\u6A21\u5F0F\u4E0B\u4F1A\u51FA\u73B0\u6B64\u9519\u8BEF,\u60A8\u53EF\u4EE5\u4F7F\u7528error\u4E8B\u4EF6\u51FD\u6570\u63A5\u6536\u8BE5\u9519\u8BEF\uFF0C\u90A3\u4E48\u8BE5\u9519\u8BEF\u5C31\u4E0D\u4F1A\u629B\u51FA\u800C\u662F\u5C06\u9519\u8BEF\u4F20\u5230error\u4E8B\u4EF6\u51FD\u6570\u7684\u7B2C\u4E8C\u4E2A\u5F62\u53C2");
  }
}
const Qe = {
  ContainerOverflowError: ge
};
class xe {
  static index(e) {
    return e ? Qe[e] : Error;
  }
}
class Ke {
  constructor(e) {
    c(this, "error", null);
    Object.assign(this, e);
  }
  _errback_(e, ...t) {
    if (typeof this.error != "function")
      throw new (xe.index(e))();
    this.error.call(this.error, new (xe.index(e))(), ...t);
  }
  _callback_(e, ...t) {
    if (typeof this[e] == "function")
      return this[e](...t);
  }
  _error_(e, t = "", n = "", ...i) {
    typeof this.error == "function" ? this.error.call(this.error, {
      name: e,
      msg: "getErrAttr=>[name|message|data]  " + t,
      from: n
    }, ...i) : console.error(e, t + "(\u4F60\u53EF\u4EE5\u7528error\u51FD\u6570\u6765\u63A5\u53D7\u5904\u7406\u8BE5\u9519\u8BEF)", n);
  }
}
class et {
  constructor(e = {}) {
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
    X(this, e);
  }
}
const Re = function() {
  if (typeof Map < "u")
    return Map;
  function a(e, t) {
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
      const n = a(this.__entries__, t), i = this.__entries__[n];
      return i && i[1];
    }, e.prototype.set = function(t, n) {
      var i = a(this.__entries__, t);
      ~i ? this.__entries__[i][1] = n : this.__entries__.push([t, n]);
    }, e.prototype.delete = function(t) {
      const n = this.__entries__, i = a(n, t);
      ~i && n.splice(i, 1);
    }, e.prototype.has = function(t) {
      return !!~a(this.__entries__, t);
    }, e.prototype.clear = function() {
      this.__entries__.splice(0);
    }, e.prototype.forEach = function(t, n) {
      n === void 0 && (n = null);
      for (let o = 0, r = this.__entries__; o < r.length; o++) {
        var i = r[o];
        t.call(n, i[1], i[0]);
      }
    }, e;
  }();
}(), he = typeof window < "u" && typeof document < "u" && window.document === document, ie = function() {
  return typeof global < "u" && global.Math === Math ? global : typeof self < "u" && self.Math === Math ? self : typeof window < "u" && window.Math === Math ? window : Function("return this")();
}(), tt = function() {
  return typeof requestAnimationFrame == "function" ? requestAnimationFrame.bind(ie) : function(a) {
    return setTimeout(function() {
      return a(Date.now());
    }, 1e3 / 60);
  };
}(), nt = 2;
function it(a, e) {
  let t = !1, n = !1, i = 0;
  function o() {
    t && (t = !1, a()), n && s();
  }
  function r() {
    tt(o);
  }
  function s() {
    const f = Date.now();
    if (t) {
      if (f - i < nt)
        return;
      n = !0;
    } else
      t = !0, n = !1, setTimeout(r, e);
    i = f;
  }
  return s;
}
const ot = 20, st = ["top", "right", "bottom", "left", "width", "height", "size", "weight"], rt = typeof MutationObserver < "u", lt = function() {
  function a() {
    this.connected_ = !1, this.mutationEventsAdded_ = !1, this.mutationsObserver_ = null, this.observers_ = [], this.onTransitionEnd_ = this.onTransitionEnd_.bind(this), this.refresh = it(this.refresh.bind(this), ot);
  }
  return a.prototype.addObserver = function(e) {
    ~this.observers_.indexOf(e) || this.observers_.push(e), this.connected_ || this.connect_();
  }, a.prototype.removeObserver = function(e) {
    const t = this.observers_, n = t.indexOf(e);
    ~n && t.splice(n, 1), !t.length && this.connected_ && this.disconnect_();
  }, a.prototype.refresh = function() {
    this.updateObservers_() && this.refresh();
  }, a.prototype.updateObservers_ = function() {
    const e = this.observers_.filter(function(t) {
      return t.gatherActive(), t.hasActive();
    });
    return e.forEach(function(t) {
      return t.broadcastActive();
    }), e.length > 0;
  }, a.prototype.connect_ = function() {
    !he || this.connected_ || (document.addEventListener("transitionend", this.onTransitionEnd_), window.addEventListener("resize", this.refresh), rt ? (this.mutationsObserver_ = new MutationObserver(this.refresh), this.mutationsObserver_.observe(document, {
      attributes: !0,
      childList: !0,
      characterData: !0,
      subtree: !0
    })) : (document.addEventListener("DOMSubtreeModified", this.refresh), this.mutationEventsAdded_ = !0), this.connected_ = !0);
  }, a.prototype.disconnect_ = function() {
    !he || !this.connected_ || (document.removeEventListener("transitionend", this.onTransitionEnd_), window.removeEventListener("resize", this.refresh), this.mutationsObserver_ && this.mutationsObserver_.disconnect(), this.mutationEventsAdded_ && document.removeEventListener("DOMSubtreeModified", this.refresh), this.mutationsObserver_ = null, this.mutationEventsAdded_ = !1, this.connected_ = !1);
  }, a.prototype.onTransitionEnd_ = function(e) {
    const t = e.propertyName, n = t === void 0 ? "" : t;
    st.some(function(o) {
      return !!~n.indexOf(o);
    }) && this.refresh();
  }, a.getInstance = function() {
    return this.instance_ || (this.instance_ = new a()), this.instance_;
  }, a.instance_ = null, a;
}(), Te = function(a, e) {
  for (let t = 0, n = Object.keys(e); t < n.length; t++) {
    const i = n[t];
    Object.defineProperty(a, i, {
      value: e[i],
      enumerable: !1,
      writable: !1,
      configurable: !0
    });
  }
  return a;
}, G = function(a) {
  return a && a.ownerDocument && a.ownerDocument.defaultView || ie;
}, Me = re(0, 0, 0, 0);
function oe(a) {
  return parseFloat(a) || 0;
}
function ve(a) {
  const e = [];
  for (let t = 1; t < arguments.length; t++)
    e[t - 1] = arguments[t];
  return e.reduce(function(t, n) {
    const i = a["border-" + n + "-width"];
    return t + oe(i);
  }, 0);
}
function at(a) {
  const e = ["top", "right", "bottom", "left"], t = {};
  for (let n = 0, i = e; n < i.length; n++) {
    const o = i[n], r = a["padding-" + o];
    t[o] = oe(r);
  }
  return t;
}
function ut(a) {
  const e = a.getBBox();
  return re(0, 0, e.width, e.height);
}
function ct(a) {
  const e = a.clientWidth, t = a.clientHeight;
  if (!e && !t)
    return Me;
  const n = G(a).getComputedStyle(a), i = at(n), o = i.left + i.right, r = i.top + i.bottom;
  let s = oe(n.width), f = oe(n.height);
  if (n.boxSizing === "border-box" && (Math.round(s + o) !== e && (s -= ve(n, "left", "right") + o), Math.round(f + r) !== t && (f -= ve(n, "top", "bottom") + r)), !mt(a)) {
    const m = Math.round(s + o) - e, h = Math.round(f + r) - t;
    Math.abs(m) !== 1 && (s -= m), Math.abs(h) !== 1 && (f -= h);
  }
  return re(i.left, i.top, s, f);
}
const ft = function() {
  return typeof SVGGraphicsElement < "u" ? function(a) {
    return a instanceof G(a).SVGGraphicsElement;
  } : function(a) {
    return a instanceof G(a).SVGElement && typeof a.getBBox == "function";
  };
}();
function mt(a) {
  return a === G(a).document.documentElement;
}
function ht(a) {
  return he ? ft(a) ? ut(a) : ct(a) : Me;
}
function dt(a) {
  const e = a.x, t = a.y, n = a.width, i = a.height, r = Object.create((typeof DOMRectReadOnly < "u" ? DOMRectReadOnly : Object).prototype);
  return Te(r, {
    x: e,
    y: t,
    width: n,
    height: i,
    top: t,
    right: e + n,
    bottom: i + t,
    left: e
  }), r;
}
function re(a, e, t, n) {
  return { x: a, y: e, width: t, height: n };
}
const gt = function() {
  function a(e) {
    this.broadcastWidth = 0, this.broadcastHeight = 0, this.contentRect_ = re(0, 0, 0, 0), this.target = e;
  }
  return a.prototype.isActive = function() {
    var e = ht(this.target);
    return this.contentRect_ = e, e.width !== this.broadcastWidth || e.height !== this.broadcastHeight;
  }, a.prototype.broadcastRect = function() {
    var e = this.contentRect_;
    return this.broadcastWidth = e.width, this.broadcastHeight = e.height, e;
  }, a;
}(), pt = function() {
  function a(e, t) {
    var n = dt(t);
    Te(this, { target: e, contentRect: n });
  }
  return a;
}(), _t = function() {
  function a(e, t, n) {
    if (this.activeObservations_ = [], this.observations_ = new Re(), typeof e != "function")
      throw new TypeError("The callback provided as parameter 1 is not a function.");
    this.callback_ = e, this.controller_ = t, this.callbackCtx_ = n;
  }
  return a.prototype.observe = function(e) {
    if (!arguments.length)
      throw new TypeError("1 argument required, but only 0 present.");
    if (typeof Element > "u" || !(Element instanceof Object))
      return;
    if (!(e instanceof G(e).Element))
      throw new TypeError('parameter 1 is not of type "Element".');
    const t = this.observations_;
    t.has(e) || (t.set(e, new gt(e)), this.controller_.addObserver(this), this.controller_.refresh());
  }, a.prototype.unobserve = function(e) {
    if (!arguments.length)
      throw new TypeError("1 argument required, but only 0 present.");
    if (typeof Element > "u" || !(Element instanceof Object))
      return;
    if (!(e instanceof G(e).Element))
      throw new TypeError('parameter 1 is not of type "Element".');
    const t = this.observations_;
    !t.has(e) || (t.delete(e), t.size || this.controller_.removeObserver(this));
  }, a.prototype.disconnect = function() {
    this.clearActive(), this.observations_.clear(), this.controller_.removeObserver(this);
  }, a.prototype.gatherActive = function() {
    const e = this;
    this.clearActive(), this.observations_.forEach(function(t) {
      t.isActive() && e.activeObservations_.push(t);
    });
  }, a.prototype.broadcastActive = function() {
    if (!this.hasActive())
      return;
    const e = this.callbackCtx_, t = this.activeObservations_.map(function(n) {
      return new pt(n.target, n.broadcastRect());
    });
    this.callback_.call(e, t, e), this.clearActive();
  }, a.prototype.clearActive = function() {
    this.activeObservations_.splice(0);
  }, a.prototype.hasActive = function() {
    return this.activeObservations_.length > 0;
  }, a;
}(), Se = typeof WeakMap < "u" ? /* @__PURE__ */ new WeakMap() : new Re(), Oe = function() {
  function a(e) {
    if (!(this instanceof a))
      throw new TypeError("Cannot call a class as a function.");
    if (!arguments.length)
      throw new TypeError("1 argument required, but only 0 present.");
    const t = lt.getInstance(), n = new _t(e, t, this);
    Se.set(this, n);
  }
  return a;
}();
[
  "observe",
  "unobserve",
  "disconnect"
].forEach(function(a) {
  Oe.prototype[a] = function() {
    let e;
    return (e = Se.get(this))[a].apply(e, arguments);
  };
});
const yt = function() {
  return typeof ie.ResizeObserver < "u" ? ie.ResizeObserver : Oe;
}(), ee = F.store;
class wt extends ze {
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
    c(this, "__store__", ee);
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
      this.contentElement = document.createElement("div"), this.contentElement.classList.add("grid-container-area"), this.contentElement._isGridContainerArea = !0, this.element.appendChild(this.contentElement), this.updateStyle(q.gridContainer, this.contentElement), this.contentElement.classList.add(this.className);
    });
    c(this, "genContainerStyle", () => ({
      width: this.nowWidth() + "px",
      height: this.nowHeight() + "px"
    }));
    c(this, "nowWidth", () => {
      let t = 0, n = this.containerW;
      return n > 1 && (t = (n - 1) * this.margin[0]), n * this.size[0] + t || 0;
    });
    c(this, "nowHeight", () => {
      let t = 0, n = this.containerH;
      return n > 1 && (t = (n - 1) * this.margin[1]), n * this.size[1] + t || 0;
    });
    t.el, this.el = t.el, typeof t.platform == "string" && (this.platform = t.platform), Object.assign(this, new et()), this._define(), this.eventManager = new Ke(t.events), this.engine = new Ze(t), t.global && (this.global = t.global), t.parent && (this.parent = t.parent, this.parent.childContainer.push(this), this.isNesting = !0), this.engine.setContainer(this), t.itemLimit && (this.itemLimit = new V(t.itemLimit));
  }
  _define() {
    let t = null, n = null;
    Object.defineProperties(this, {
      col: {
        get: () => t || 1,
        set: (i) => {
          t === i || i <= 0 || !isFinite(i) || (t = i);
        }
      },
      row: {
        get: () => n || 1,
        set: (i) => {
          n === i || i <= 0 || !isFinite(i) || (n = i);
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
    this.platform === "vue" ? n() : z.run(n);
  }
  mountItems(t) {
    t.forEach((n) => container.add(n)), this.engine.mountAll();
  }
  exportData() {
    return this.engine.items.map((t) => t.exportConfig());
  }
  exportUseLayout() {
    return this.useLayout;
  }
  render(t) {
    z.run(() => {
      this.element && this.element.clientWidth <= 0 || (typeof t == "function" && t(this.useLayout.data || [], this.useLayout, this.element), this.updateLayout(!0));
    });
  }
  _nestingMount(t = null) {
    t = t || ee.nestingMountPointList;
    for (let n = 0; n < this.engine.items.length; n++) {
      const i = this.engine.items[n];
      for (let o = 0; o < t.length; o++)
        if (t[o].id === (i.nested || "").replace("#", "")) {
          let r = t[o];
          r = r.cloneNode(!0), i.element.appendChild(r);
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
      const o = this.element.clientWidth;
      if (o <= 0)
        return;
      let r = this.engine.layoutConfig.genLayoutConfig(o), { useLayoutConfig: s, currentLayout: f, layout: m } = r;
      const h = this.eventManager._callback_("mountPointElementResizing", s, o, this.container);
      if (!(h === null || h === !1)) {
        if (typeof h == "object" && (s = h), this.px && s.px && this.px !== s.px) {
          this.platform, this.eventManager._callback_("useLayoutChange", f, o, this.container);
          const d = this._VueEvents.vueUseLayoutChange;
          typeof d == "function" && d(r);
        }
        this.engine.updateLayout(!0);
      }
    }, n = (o, r = 350) => {
      let s = this.__ownTemp__;
      return function() {
        s.deferUpdatingLayoutTimer && clearTimeout(s.deferUpdatingLayoutTimer), s.deferUpdatingLayoutTimer = setTimeout(() => {
          o.apply(this, arguments), s.deferUpdatingLayoutTimer = null;
        }, r);
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
      ee.nestingMountPointList.includes(this.element.children[t]) || ee.nestingMountPointList.push(document.adoptNode(this.element.children[t]));
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
      const r = this.add({ el: n, ...o });
      r && (r.name = r.getAttr("name")), t.push(t);
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
  setup(a) {
    const e = a, t = te(null), n = te(null), i = new wt({
      platform: "vue",
      layouts: e.config.layouts,
      events: e.events,
      global: e.config.global
    });
    let o = {}, r = !1;
    return Xe("_grid_item_components_", e.components), be(() => {
      i.el = t.value, i.engine.init(), i.vue = e, K(() => {
        o = i.engine.layoutConfig.genLayoutConfig(t.value.clientWidth), n.value._isGridContainerArea = !0;
        const s = $(o.currentLayout);
        e.render === null ? Object.assign(e.useLayout, s) : typeof e.render == "function" && e.render(s, o.useLayoutConfig, e.config.layouts), i.mount();
      }), setTimeout(() => {
        const s = i.exportData();
        e.useLayout.data && e.useLayout.data.length !== s.length && (e.useLayout.data = [], K(() => {
          e.useLayout.data = s, o.layout.data = s, i.updateLayout(!0);
        }));
      }), e.containerAPI.getContainer = () => i, e.containerAPI.exportData = () => i.exportUseLayout().data, e.containerAPI.exportUseLayout = () => i.exportUseLayout(), i._VueEvents.vueUseLayoutChange = (s) => {
        r = !0, e.useLayout.data = [], K(() => {
          o = s;
          const f = $(s.currentLayout);
          for (let m in e.useLayout)
            delete e.useLayout[m];
          e.layoutChange === null ? Object.assign(e.useLayout, s.currentLayout) : typeof e.layoutChange == "function" && (r = !1, e.layoutChange(f, s.useLayoutConfig, i.layouts));
        });
      }, i._VueEvents.vueCrossContainerExchange = (s, f, m) => {
        const h = s.exportConfig();
        s.pos.nextStaticPos && (h.pos.nextStaticPos = s.pos.nextStaticPos, h.pos.x = s.pos.nextStaticPos.x, h.pos.y = s.pos.nextStaticPos.y), h.pos.doItemCrossContainerExchange = (d) => {
          f.exchangeItems.old = f.fromItem, f.exchangeItems.new = d, f.moveItem = d, f.fromItem = d, m(d);
        }, e.useLayout.data.push(h), K(() => {
          i.updateLayout(!0);
        });
      };
    }), R(e.useLayout, () => {
      if (!r) {
        for (let s in e.useLayout) {
          const f = e.useLayout[s], m = typeof f;
          !Array.isArray(f) && ["data", "margin", "size"].includes(s) && console.error(s, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2A\u6570\u7EC4"), m !== "boolean" && ["responsive", "followScroll", "exchange", "slidePage", "autoGrowRow", "autoReorder"].includes(s) && console.error(s, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2Aboolean\u503C"), (m !== "number" || isNaN(f) || !isFinite(f)) && [
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
          ].includes(s) && console.error(s, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2A\u975ENaN\u7684number\u503C"), m !== "string" && ["responseMode", "className"].includes(s) && (s === "responseMode" ? console.error(s, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2Astring\u503C", "\u4E14\u6709\u4E09\u79CD\u5E03\u5C40\u4EA4\u6362\u6A21\u5F0F\uFF0C\u5206\u522B\u662Fdefault,exchange,stream") : console.error(s, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2Astring\u503C")), m !== "object" && ["itemLimit"].includes(s) && (s === "itemLimit" ? console.error(s, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2Aobject\u503C,\u5305\u542B\u53EF\u9009\u952EminW,minH,maxH,maxW\u4F5C\u7528\u4E8E\u6240\u6709Item\u5927\u5C0F\u9650\u5236") : console.error(s, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2Aobject\u503C")), o.layout[s] = fe(f);
        }
        i.updateLayout(!0);
      }
    }, { deep: !0 }), (s, f) => (me(), Ce("div", {
      ref_key: "gridContainer",
      ref: t,
      style: { display: "block" }
    }, [
      Ye("div", {
        ref_key: "gridContainerArea",
        ref: n,
        class: "grid-container-area",
        style: { display: "block", position: "relative" }
      }, [
        Ee(s.$slots, "default")
      ], 512)
    ], 512));
  }
}, Ie = {
  GridContainer: xt,
  GridItem: je
}, de = (a) => {
  de.installed || (de.installed = !0, Object.keys(Ie).forEach((e) => a.component(e, Ie[e])));
}, bt = {
  install: de
};
export {
  xt as GridContainer,
  je as GridItem,
  bt as default,
  de as install
};
