var Pe = Object.defineProperty;
var He = (c, e, t) => e in c ? Pe(c, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : c[e] = t;
var f = (c, e, t) => (He(c, typeof e != "symbol" ? e + "" : e, t), t);
import { getCurrentInstance as We, ref as te, inject as Ne, useAttrs as De, toRaw as ce, onMounted as be, onUnmounted as Fe, openBlock as fe, createElementBlock as Ce, unref as le, createBlock as Be, renderSlot as Ee, watch as z, defineAsyncComponent as Xe, provide as Ye, nextTick as we, createElementVNode as qe } from "vue";
function k(c, e = 350) {
  let t, n, i = 0;
  return function() {
    t = this, n = arguments;
    let o = new Date().valueOf();
    o - i > e && (c.apply(t, n), i = o);
  };
}
function Ge(c) {
  return c.replace(/[A-Z]/g, function(e) {
    return "-" + e.toLowerCase();
  });
}
const F = (c = {}, e = {}, t = !1, n = []) => {
  const i = {};
  return Object.keys(e).forEach((o) => {
    Object.keys(c).includes(o) && !n.includes(o) && (t ? i[o] = e[o] !== void 0 ? e[o] : c[o] : c[o] = e[o] !== void 0 ? e[o] : c[o]);
  }), t ? i : c;
}, V = (c) => {
  let e = Array.isArray(c) ? [] : {};
  if (c && typeof c == "object")
    for (let t in c)
      c.hasOwnProperty(t) && (c[t] && typeof c[t] == "object" ? e[t] = V(c[t]) : e[t] = c[t]);
  return e;
}, Le = (c) => {
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
}, A = (c, e = !1) => {
  let t = null;
  const n = c.touchTarget ? c.touchTarget : c.target;
  if (n._isGridContainer_)
    t = n._gridContainer_;
  else
    for (let i = 0; i < c.path.length && !(c.path[i]._isGridContainer_ && (t = c.path[i]._gridContainer_, !e)); i++)
      ;
  return t;
}, je = (c, e = !1) => {
  let t = null;
  const n = c.touchTarget ? c.touchTarget : c.target;
  if (n._isGridContainerArea)
    t = n;
  else
    for (let i = 0; i < c.path.length && !(c.path[i]._isGridContainerArea && (t = c.path[i], !e)); i++)
      ;
  return t;
}, q = (c, e = !1) => {
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
}, Ue = {
  name: "GridItem",
  inheritAttrs: !1
}, $e = /* @__PURE__ */ Object.assign(Ue, {
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
    nested: { required: !1, type: Boolean, default: void 0 },
    draggable: { required: !1, type: Boolean, default: void 0 },
    resize: { required: !1, type: Boolean, default: void 0 },
    close: { required: !1, type: Boolean, default: void 0 },
    follow: { required: !1, type: Boolean, default: void 0 },
    dragOut: { required: !1, type: Boolean, default: void 0 },
    dragIgnoreEls: { required: !1, type: Array, default: void 0 },
    dragAllowEls: { required: !1, type: Array, default: void 0 },
    itemAPI: { required: !1, type: Object, default: {} }
  },
  setup(c) {
    const e = c;
    We();
    const t = te();
    let n = null;
    const i = () => {
      z(() => e.pos, () => {
        !n || (Object.keys(e.pos).forEach((a) => {
          const h = e.pos[a];
          if (!!h && (typeof h == "number" || !isNaN(h))) {
            if (n.pos[a] === h)
              return;
            ["minW", "maxW", "minH", "maxH"].includes(a) && (n.pos[a] = h), ["w", "h"].includes(a) && (n.pos[a] = h), ["x", "y"].includes(a) && (n.container.responsive || (n.pos[a] = h));
          }
        }), n.container.updateLayout(!0));
      }, { deep: !0 }), z(() => e.transition, (a) => {
        (typeof a == "boolean" || typeof a == "object" || typeof a == "number") && (n.transition = a);
      }, { deep: !0 }), z(() => e.name, (a) => {
        typeof a == "string" && (n.name = a);
      }), z(() => e.type, (a) => {
        typeof a == "string" && (n.type = a);
      }), z(() => e.static, (a) => {
        typeof a == "boolean" && (n.static = a);
      }), z(() => e.nested, (a) => {
        typeof a == "boolean" && (n.nested = a);
      }), z(() => e.draggable, (a) => {
        typeof a == "boolean" && (n.draggable = a);
      }), z(() => e.resize, (a) => {
        typeof a == "boolean" && (n.resize = a);
      }), z(() => e.close, (a) => {
        typeof a == "boolean" && (n.close = a);
      }), z(() => e.follow, (a) => {
        typeof a == "boolean" && (n.follow = a);
      }), z(() => e.dragOut, (a) => {
        typeof a == "boolean" && (n.dragOut = a);
      }), z(() => e.dragIgnoreEls, (a) => {
        Array.isArray(a) && (n.dragIgnoreEls = a);
      }), z(() => e.dragAllowEls, (a) => {
        Array.isArray(a) && (n.dragAllowEls = a);
      });
    };
    let o, l = null, u = {}, s = te(!1);
    const m = Ne("_grid_item_components_"), d = () => {
      const a = m[e.type];
      a ? typeof a != "function" && console.error("components\u4E2D\u7684", e.type, '\u5E94\u8BE5\u662F\u4E00\u4E2A\u51FD\u6570,\u5E76\u4F7F\u7528import("XXX")\u5F02\u6B65\u5BFC\u5165') : console.error("\u672A\u5728components\u4E2D\u5B9A\u4E49", e.type, "\u7EC4\u4EF6"), o = Xe(a);
    };
    e.type && Object.keys(m).length > 0 && (u = {
      ...De(),
      ...ce(e)
    }, d(), s.value = !0);
    const g = () => {
      if (!l)
        return;
      const a = l.col, h = l.row, y = l.engine.autoSetColAndRows(l);
      (a !== y.col || h !== y.row) && l.updateContainerStyleSize();
    };
    return be(() => {
      const a = ce(e);
      l = Le(t.value), l.__ownTemp__, e.pos.autoOnce = !e.pos.x || !e.pos.y;
      const h = e.pos.doItemCrossContainerExchange;
      if (delete e.pos.doItemCrossContainerExchange, n = l.add({
        el: t.value,
        ...a
      }), !n) {
        t.value.parentNode.removeChild(t.value);
        return;
      }
      n.updateStyle({
        height: "100%",
        width: "100%",
        display: "block",
        overflow: "hidden",
        position: "absolute"
      }, t.value), n.mount(), e.itemAPI.getItem = () => n, e.itemAPI.exportConfig = () => n.exportConfig(), typeof h == "function" && h(n), n._VueEvents.vueItemResizing = (y, p, E) => {
        e.pos.w && e.pos.w !== p && (e.pos.w = p), e.pos.h && e.pos.h !== E && (e.pos.h = E);
      }, n._VueEvents.vueItemMovePositionChange = (y, p, E, M) => {
        e.pos.x && e.pos.x !== E && (e.pos.x = E), e.pos.y && e.pos.y !== M && (e.pos.y = M);
      }, g(), i();
    }), Fe(() => {
      n && n.remove(), g();
    }), (a, h) => (fe(), Ce("div", {
      class: "grid-item",
      ref_key: "gridItem",
      ref: t
    }, [
      le(s) ? (fe(), Be(le(o), {
        key: 0,
        attrs: le(u)
      }, null, 8, ["attrs"])) : Ee(a.$slots, "default", { key: 1 })
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
    let n = 0, i = typeof e.timeout == "number" ? e.timeout : T.timeout, o = typeof e.intervalTime == "number" ? e.intervalTime : T.intervalTime, l = () => {
      let m;
      if (typeof e == "function")
        m = e.call(e, ...t);
      else if (typeof e == "object") {
        if (!e.func)
          throw new Error("func\u51FD\u6570\u5FC5\u987B\u4F20\u5165");
        m = e.func.call(e.func, ...t) || void 0;
      }
      e.callback && e.callback(m);
    }, u = () => e.rule ? e.rule() : T.ready;
    if (u())
      return l(), !0;
    let s = setInterval(() => {
      typeof e.max == "number" && e.max < n && (clearInterval(s), s = null), i < n * o && (clearInterval(s), s = null), u() && (clearInterval(s), s = null, l()), n++;
    }, o);
  }
};
let C = T;
f(C, "ready", !1), f(C, "ins", !1), f(C, "timeout", 12e3), f(C, "intervalTime", 50);
class J {
  constructor(e) {
    f(this, "el", null);
    f(this, "i", "");
    f(this, "w", 1);
    f(this, "h", 1);
    f(this, "x", 1);
    f(this, "y", 1);
    f(this, "col", null);
    f(this, "row", null);
    f(this, "minW", 1);
    f(this, "maxW", 1 / 0);
    f(this, "minH", 1);
    f(this, "maxH", 1 / 0);
    f(this, "iName", "");
    f(this, "nextStaticPos", null);
    f(this, "beforePos", null);
    f(this, "autoOnce", null);
    typeof e == "object" && this.update(e);
  }
  update(e) {
    return F(this, this._typeCheck(e)), this;
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
const G = {
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
}, D = class {
  constructor() {
  }
  static getInstance() {
    return D.ins || (D.ins = new D(), D.ins = !0), D;
  }
};
let H = D;
f(H, "ins", !1), f(H, "store", {
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
  deviceEventMode: "mouse",
  allowTouchMoveItem: !1,
  timeOutEvent: null,
  nestingMountPointList: []
}), f(H, "ItemStore", {});
const r = H.store, se = class {
  static startEventFromItem(e) {
  }
  static removeEventFromItem(e) {
  }
  static startEventFromContainer(e) {
  }
  static removeEventFromContainer(e) {
  }
  static startGlobalEvent() {
    document.addEventListener("mousedown", b.container.touchstartOrMousedown), document.addEventListener("touchstart", b.container.touchstartOrMousedown, { passive: !1 }), document.addEventListener("mousemove", b.container.touchmoveOrMousemove), document.addEventListener("touchmove", b.container.touchmoveOrMousemove, { passive: !1 }), document.addEventListener("mouseup", b.container.touchendOrMouseup), document.addEventListener("touchend", b.container.touchendOrMouseup, { passive: !1 });
  }
  static removeGlobalEvent() {
    document.removeEventListener("mousedown", b.container.touchstartOrMousedown), document.removeEventListener("touchstart", b.container.touchstartOrMousedown), document.removeEventListener("mousemove", b.container.touchmoveOrMousemove), document.removeEventListener("touchmove", b.container.touchmoveOrMousemove), document.removeEventListener("mouseup", b.container.touchendOrMouseup), document.removeEventListener("touchend", b.container.touchendOrMouseup);
  }
  static startEvent(e = null, t = null) {
    r.editItemNum === 0 && se.startGlobalEvent();
  }
  static removeEvent(e = null, t = null) {
    t && !t.draggable && t.resize, r.editItemNum === 0 && se.removeGlobalEvent();
  }
};
let W = se;
f(W, "_eventEntrustFunctor", {
  itemResize: {
    doResize: k((e) => {
      const t = r.mousedownEvent, n = r.isLeftMousedown, i = r.fromItem;
      if (i === null || t === null || !n)
        return;
      const o = i.container;
      r.cloneElement === null && (r.cloneElement = i.element.cloneNode(!0), r.cloneElement.classList.add("grid-clone-el", "grid-resizing-clone-el"), r.cloneElement && r.fromContainer.contentElement.appendChild(r.cloneElement), i.updateStyle({ transition: "none" }, r.cloneElement), i.addClass("grid-resizing-source-el"));
      const l = i.container.contentElement.getBoundingClientRect();
      let u = e.pageX - l.left - window.scrollX - i.offsetLeft(), s = e.pageY - l.top - window.scrollY - i.offsetTop();
      const m = {
        w: Math.ceil(u / (i.size[0] + i.margin[0])),
        h: Math.ceil(s / (i.size[1] + i.margin[1]))
      };
      m.w < 1 && (m.w = 1), m.h < 1 && (m.h = 1);
      const d = ({ w: h, h: y }) => {
        const p = i.pos;
        return h + p.x > o.col && (h = o.col - p.x + 1), h < p.minW && (h = p.minW), h > p.maxW && p.maxW !== 1 / 0 && (h = p.maxW), i.container.autoGrowRow || y + p.y > o.row && (y = o.row - p.y + 1), y < p.minH && (y = p.minH), y > p.maxH && p.maxH !== 1 / 0 && (y = p.maxH), {
          w: h,
          h: y
        };
      }, g = () => (u > i.maxWidth() && (u = i.maxWidth()), s > i.maxHeight() && (s = i.maxHeight()), u < i.minWidth() && (u = i.minWidth()), s < i.minHeight() && (s = i.minHeight()), {
        width: u,
        height: s
      }), a = d(m);
      if (i.container.responsive) {
        if (i.container.responsive) {
          F(i.pos, a);
          const h = g();
          i.updateStyle({
            width: h.width + "px",
            height: h.height + "px"
          }, r.cloneElement);
        }
      } else {
        const h = g(), y = i.container.engine.findStaticBlankMaxMatrixFromItem(i), p = {};
        if (a.w > y.minW && a.h > y.minH)
          return;
        y.maxW >= a.w ? (p.width = h.width + "px", i.pos.w = a.w) : a.w = i.pos.w, y.maxH >= a.h ? (p.height = h.height + "px", i.pos.h = a.h) : a.h = i.pos.h, Object.keys(p).length > 0 && i.updateStyle(p, r.cloneElement);
      }
      i.__temp__.resized || (i.__temp__.resized = { w: 1, h: 1 }), (i.__temp__.resized.w !== m.w || i.__temp__.resized.h !== m.h) && (i.__temp__.resized = a, typeof i._VueEvents.vueItemResizing == "function" && i._VueEvents.vueItemResizing(i, a.w, a.h), i.container.eventManager._callback_("itemResizing", a.w, a.h, i), r.fromContainer.updateLayout([i]), i.updateStyle(i._genLimitSizeStyle()), i.container.updateContainerStyleSize());
    }, 15),
    mouseup: (e) => {
      const t = r.fromItem;
      t !== null && (t.__temp__.clientWidth = t.nowWidth(), t.__temp__.clientHeight = t.nowHeight(), r.isLeftMousedown = !1, t.updateStyle(t._genItemStyle()));
    }
  },
  check: {
    resizeOrDrag: (e) => {
      var n, i;
      if (!!A(e)) {
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
      o && o.container === t || (r.isLeftMousedown && C.run({
        func: () => {
          t.eventManager._callback_("enterContainerArea", t, r.exchangeItems.new), r.exchangeItems.new = null, r.exchangeItems.old = null;
        },
        rule: () => r.exchangeItems.new,
        intervalTime: 2,
        timeout: 200
      }), t.__ownTemp__.firstEnterUnLock = !0, r.moveContainer = t);
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
      if (!(!n.container.exchange || !o.container.exchange))
        try {
          o.pos.el = null;
          let l = n.element;
          const u = new ne({
            pos: o.pos,
            size: e.size,
            margin: e.margin,
            el: l,
            name: o.name,
            type: o.type,
            nested: o.nested,
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
          }), s = n.container.eventManager._callback_("crossContainerExchange", o, u);
          if (s === !1 || s === null)
            return;
          const m = (a) => {
            typeof t == "function" && t(a);
          }, d = () => {
            e._VueEvents.vueCrossContainerExchange(u, r, (a) => {
              o.unmount(), o.remove(), m(a), e && (o !== a && !o.container.responsive ? o.container.engine.updateLayout([o]) : o.container.engine.updateLayout(!0));
            });
          }, g = () => {
            e.responsive ? u.pos.autoOnce = !0 : e.responsive || (u.pos.autoOnce = !1), e.add(u), o.unmount(), o.remove(), e && (u.container.responsive ? u.container.engine.updateLayout() : u.container.engine.updateLayout([u]), o !== u && !o.container.responsive ? o.container.engine.updateLayout([o]) : o.container.engine.updateLayout()), u.mount(), r.moveItem = u, r.fromItem = u, r.exchangeItems.old = o, r.exchangeItems.new = u, m(u);
          };
          e.__ownTemp__.firstEnterUnLock = !1, e.__ownTemp__.nestingEnterBlankUnLock = !1, e.platform === "vue" ? d() : g();
        } catch (l) {
          console.error("\u8DE8\u5BB9\u5668Item\u79FB\u52A8\u51FA\u9519", l);
        }
    },
    mousemoveFromItemChange: k((e) => {
      if (e.stopPropagation(), !r.isDragging)
        return;
      let t = r.fromItem, n = q(e);
      n && (r.toItem = n);
      const i = r.moveItem, o = r.mousedownEvent;
      if (t === null || o === null || !r.isLeftMousedown)
        return;
      let l = r.moveItem !== null ? i : t;
      const u = A(e), s = u || l.container;
      if (s.parentItem && s.parentItem === l || (e.touchTarget ? e.touchTarget : e.target)._isGridContainer_)
        return;
      const d = r.mousedownItemOffsetLeft * (s.size[0] / r.fromContainer.size[0]), g = r.mousedownItemOffsetTop * (s.size[1] / r.fromContainer.size[1]), a = s.contentElement.getBoundingClientRect(), h = e.pageX - d - (window.scrollX + a.left), y = e.pageY - g - (window.scrollY + a.top);
      if (l.container.followScroll) {
        const w = s.contentElement.parentElement.getBoundingClientRect(), P = s.scrollSpeedX ? s.scrollSpeedX : Math.round(w.width / 20), U = s.scrollSpeedY ? s.scrollSpeedY : Math.round(w.height / 20), L = (Y, N) => {
          const R = l.container.eventManager._callback_("autoScroll", Y, N, l.container);
          if (R === !1 || R === null)
            return;
          typeof R == "object" && (typeof R.offset == "number" && (N = R.offset), ["X", "Y"].includes(R.direction) && (Y = R.direction));
          const Z = s ? s.scrollWaitTime : 800;
          r.scrollReactionStatic === "stop" && (r.scrollReactionStatic = "wait", r.scrollReactionTimer = setTimeout(() => {
            r.scrollReactionStatic = "scroll", clearTimeout(r.scrollReactionTimer);
          }, Z)), Y === "X" && r.scrollReactionStatic === "scroll" && (s.contentElement.parentElement.scrollLeft += N), Y === "Y" && r.scrollReactionStatic === "scroll" && (s.contentElement.parentElement.scrollTop += N);
        };
        let B = !1, X = !1;
        e.pageX - window.scrollX - w.left < w.width * 0.25 ? L("X", -P) : e.pageX - window.scrollX - w.left > w.width * 0.75 ? L("X", P) : B = !0, e.pageY - window.scrollY - w.top < w.height * 0.25 ? L("Y", -U) : e.pageY - window.scrollY - w.top > w.height * 0.75 ? L("Y", U) : X = !0, B && X && (r.scrollReactionStatic = "stop", clearTimeout(r.scrollReactionTimer));
      }
      const p = (I) => {
        const w = I / (s.size[0] + s.margin[0]);
        return w + l.pos.w >= s.containerW ? s.containerW - l.pos.w + 1 : Math.round(w) + 1;
      }, E = (I) => {
        const w = I / (s.size[1] + s.margin[1]);
        return w + l.pos.h >= s.containerH ? s.containerH - l.pos.h + 1 : Math.round(w) + 1;
      };
      let M = p(h), v = E(y);
      M < 1 && (M = 1), v < 1 && (v = 1), l.container.eventManager._callback_("itemMoving", M, v, l);
      const S = () => {
        let I, w, P = Date.now();
        w = e.screenX, I = e.screenY;
        const U = () => {
          let x = P - r.mouseSpeed.timestamp, $ = Math.abs(w - r.mouseSpeed.endX), K = Math.abs(I - r.mouseSpeed.endY), ye = $ > K ? $ : K, ke = Math.round(ye / x * 1e3);
          return r.mouseSpeed.endX = w, r.mouseSpeed.endY = I, r.mouseSpeed.timestamp = P, { distance: ye, speed: ke };
        };
        if (!s.__ownTemp__.firstEnterUnLock && r.deviceEventMode === "mouse") {
          const { distance: x, speed: $ } = U();
          if (s.size[0] < 30 || s.size[1] < 30) {
            if (x < 3)
              return;
          } else if (s.size[0] < 60 || s.size[1] < 60) {
            if (x < 7)
              return;
          } else if (x < 10 || $ < 10)
            return;
          if (l === null)
            return;
        }
        const L = {
          x: M < 1 ? 1 : M,
          y: v < 1 ? 1 : v,
          w: l.pos.w,
          h: l.pos.h
        };
        let B = !1;
        const X = () => {
          if (!l.follow)
            return;
          const x = s.engine.findCoverItemFromPosition(L.x, L.y, L.w, L.h);
          x.length > 0 ? n = x.filter((K) => l !== K)[0] : B = !0;
        }, Y = () => {
          const x = s.engine.findResponsiveItemFromPosition(L.x, L.y, L.w, L.h);
          !x || (n = x);
        };
        if (s.__ownTemp__.firstEnterUnLock ? X() : l.follow ? n ? X() : Y() : X(), B && n && n.nested && (n = null), s.__ownTemp__.firstEnterUnLock) {
          if (!B && !n)
            return;
          if (l.pos.nextStaticPos = new J(l.pos), l.pos.nextStaticPos.x = L.x, l.pos.nextStaticPos.y = L.y, l.pos.autoOnce = !0, n) {
            if (r.fromItem.container.parentItem === n || l.container === n.container)
              return;
            _.itemDrag.mousemoveExchange(s, (x) => {
              s.engine.move(x, n.i);
            });
          } else
            _.itemDrag.mousemoveExchange(s);
          r.dragContainer = s;
          return;
        }
        if (!n)
          return;
        const N = l.element.getBoundingClientRect(), R = Math.abs(e.pageX - N.left - r.mousedownItemOffsetLeft) / n.element.clientWidth, Z = Math.abs(e.pageY - N.top - r.mousedownItemOffsetTop) / n.element.clientHeight, Ae = R > Z;
        if (Math.abs(R - Z) < s.sensitivity || s.__ownTemp__.exchangeLock === !0)
          return;
        const ge = 3, Q = s.__ownTemp__.beforeOverItems;
        let pe = 0;
        for (let x = 0; x < Q.length && !(x >= 3); x++)
          Q[x] === n && pe++;
        if (pe >= ge) {
          s.__ownTemp__.exchangeLock = !0;
          let x = setTimeout(() => {
            s.__ownTemp__.exchangeLock = !1, clearTimeout(x), x = null;
          }, 200);
        } else if (Q.length < ge && n.draggable && n.transition && n.transition.time) {
          s.__ownTemp__.exchangeLock = !0;
          let x = setTimeout(() => {
            s.__ownTemp__.exchangeLock = !1, clearTimeout(x), x = null;
          }, n.transition.time);
        }
        l !== n && (s.__ownTemp__.beforeOverItems.unshift(n), Q.length > 20 && s.__ownTemp__.beforeOverItems.pop());
        const _e = l.container.eventManager._callback_("itemExchange", t, n);
        _e === !1 || _e === null || (s.responseMode === "default" ? Ae ? (s.engine.sortResponsiveItem(), s.engine.move(l, n.i)) : s.engine.exchange(l, n) : s.responseMode === "stream" ? (s.engine.sortResponsiveItem(), s.engine.move(l, n.i)) : s.responseMode === "exchange" && s.engine.exchange(l, n), s.engine.updateLayout());
      }, O = () => {
        if (!l.follow && !A(e))
          return;
        l.pos.nextStaticPos = new J(l.pos), l.pos.nextStaticPos.x = M < 1 ? 1 : M, l.pos.nextStaticPos.y = v < 1 ? 1 : v;
        let I = s.engine.findCoverItemFromPosition(
          l.pos.nextStaticPos.x,
          l.pos.nextStaticPos.y,
          l.pos.w,
          l.pos.h
        );
        if (I.length > 0 && (I = I.filter((w) => l !== w)), I.length === 0)
          s.__ownTemp__.firstEnterUnLock ? (_.itemDrag.mousemoveExchange(s), r.dragContainer = s) : (l.pos.x = l.pos.nextStaticPos.x, l.pos.y = l.pos.nextStaticPos.y, l.pos.nextStaticPos = null, s.engine.updateLayout([l])), u && _.cursor.cursor !== "mousedown" && _.cursor.mousedown(e);
        else {
          l.pos.nextStaticPos = null;
          const w = q(e);
          w && l !== w && _.cursor.cursor !== "drag-to-item-no-drop" && _.cursor.dragToItemNoDrop();
        }
      };
      C.run(() => {
        const I = Object.assign({}, l.pos);
        if (s.responsive ? S() : O(), I.x !== l.pos.x || I.y !== l.pos.y) {
          const w = l._VueEvents.vueItemMovePositionChange;
          typeof w == "function" && w(I.x, I.y, l.pos.x, l.pos.y), l.container.eventManager._callback_("itemMovePositionChange", I.x, I.y, l.pos.x, l.pos.y);
        }
      });
    }, 36),
    mousemoveFromClone: (e) => {
      const t = r.mousedownEvent, n = r.fromItem, i = r.moveItem;
      if (t === null || n === null)
        return;
      let o = r.moveItem !== null ? i : n;
      const l = A(e);
      o.__temp__.dragging = !0, r.cloneElement === null ? (r.cloneElement = o.element.cloneNode(!0), r.cloneElement.classList.add("grid-clone-el", "grid-dragging-clone-el"), document.body.appendChild(r.cloneElement), o.addClass("grid-dragging-source-el"), o.updateStyle({
        pointerEvents: "none",
        transitionProperty: "none",
        transitionDuration: "none"
      }, r.cloneElement)) : l && l.__ownTemp__.firstEnterUnLock && C.run({
        func: () => {
          const m = r.fromItem, d = "grid-dragging-source-el";
          m.hasClass(d) || m.addClass(d);
        },
        rule: () => {
          var m;
          return l === ((m = r.fromItem) == null ? void 0 : m.container);
        },
        intervalTime: 2,
        timeout: 200
      });
      let u = e.pageX - r.mousedownItemOffsetLeft, s = e.pageY - r.mousedownItemOffsetTop;
      if (!o.dragOut) {
        const m = l.contentElement.getBoundingClientRect(), d = window.scrollX + m.left, g = window.scrollY + m.top, a = window.scrollX + m.left + l.contentElement.clientWidth - o.nowWidth(), h = window.scrollY + m.top + l.contentElement.clientHeight - o.nowHeight();
        u < d && (u = d), u > a && (u = a), s < g && (s = g), s > h && (s = h);
      }
      o.updateStyle({
        left: u + "px",
        top: s + "px"
      }, r.cloneElement);
    }
  }
}), f(W, "_eventPerformer", {
  item: {
    mouseenter: (e) => {
      if (e.stopPropagation(), !!A(e) && (e.target._gridItem_ && (r.toItem = q(e)), r.toItem === null))
        return !1;
    }
  },
  other: {
    updateSlidePageInfo: k((e, t) => {
      r.slidePageOffsetInfo.newestPageX = e, r.slidePageOffsetInfo.newestPageY = t;
    }),
    slidePage: (e) => {
      const t = r.fromContainer;
      if (!t || !t.slidePage)
        return;
      const n = t.element;
      let i = e.pageX - r.mousedownEvent.pageX, o = e.pageY - r.mousedownEvent.pageY;
      const l = r.slidePageOffsetInfo.offsetLeft - i, u = r.slidePageOffsetInfo.offsetTop - o;
      l >= 0 && (n.scrollLeft = l), u >= 0 && (n.scrollTop = u), b.other.updateSlidePageInfo(e.pageX, e.pageY);
    }
  },
  container: {
    mousedown: (e) => {
      if (r.isDragging || r.isResizing)
        return;
      const t = A(e);
      if (!t || (r.fromItem = q(e), !t && !r.fromItem))
        return;
      r.fromItem && !r.fromItem.static ? _.cursor.mousedown() : t && !r.fromItem && !e.touches && (_.cursor.mousedown(), r.slidePageOffsetInfo = {
        offsetTop: t.element.scrollTop,
        offsetLeft: t.element.scrollLeft,
        newestPageX: 0,
        newestPageY: 0
      }, r.dragOrResize = "slidePage");
      const n = e.target.className;
      if (r.mouseDownElClassName = n, !n.includes("grid-clone-el") && !n.includes("grid-item-close-btn")) {
        if (n.includes("grid-item-resizable-handle"))
          r.dragOrResize = "resize";
        else if (r.fromItem) {
          if (!r.fromItem.container.responsive && r.fromItem.static)
            return;
          const i = r.fromItem;
          if ((i.dragIgnoreEls || []).length > 0) {
            let l = !0;
            for (let u = 0; u < i.dragIgnoreEls.length; u++) {
              const s = i.dragIgnoreEls[u];
              if (s instanceof Element)
                e.target === s && (l = !1);
              else if (typeof s == "string") {
                const m = i.element.querySelectorAll(s);
                Array.from(m).forEach((d) => {
                  e.path.includes(d) && (l = !1);
                });
              }
              if (l === !1)
                return;
            }
          }
          if ((i.dragAllowEls || []).length > 0) {
            let l = !1;
            for (let u = 0; u < i.dragAllowEls.length; u++) {
              const s = i.dragAllowEls[u];
              if (s instanceof Element) {
                if (e.target === s) {
                  l = !0;
                  break;
                }
              } else if (typeof s == "string") {
                const m = i.element.querySelectorAll(s);
                Array.from(m).forEach((d) => {
                  e.path.includes(d) && (l = !0);
                });
              }
            }
            if (l === !1)
              return;
          }
          if (r.dragOrResize = "drag", r.fromItem.__temp__.dragging)
            return;
          const o = r.fromItem.element.getBoundingClientRect();
          r.mousedownItemOffsetLeft = e.pageX - (o.left + window.scrollX), r.mousedownItemOffsetTop = e.pageY - (o.top + window.scrollY);
        }
        r.isLeftMousedown = !0, r.mousedownEvent = e, r.fromContainer = t, _.check.resizeOrDrag(e), r.fromItem && (r.fromItem.__temp__.clientWidth = r.fromItem.nowWidth(), r.fromItem.__temp__.clientHeight = r.fromItem.nowHeight(), r.offsetPageX = r.fromItem.offsetLeft(), r.offsetPageY = r.fromItem.offsetTop());
      }
    },
    mousemove: k((e) => {
      const t = je(e), n = Le(t), i = q(e);
      if (r.isLeftMousedown) {
        if (r.beforeContainerArea = r.currentContainerArea, r.currentContainerArea = t || null, r.beforeContainer = r.currentContainer, r.currentContainer = n || null, r.currentContainerArea !== null && r.beforeContainerArea !== null ? r.currentContainerArea !== r.beforeContainerArea && _.moveOuterContainer.leaveToEnter(r.beforeContainer, r.currentContainer) : (r.currentContainerArea !== null || r.beforeContainerArea !== null) && (r.beforeContainerArea === null && _.moveOuterContainer.mouseenter(null, r.currentContainer), r.currentContainerArea === null && _.moveOuterContainer.mouseleave(null, r.beforeContainer)), r.dragOrResize === "slidePage") {
          b.other.slidePage(e);
          return;
        }
        const o = () => {
          n ? n && (n.responsive ? _.cursor.cursor !== "mousedown" && _.cursor.mousedown() : n.responsive) : _.cursor.cursor !== "no-drop" && _.cursor.notDrop();
        };
        r.isDragging ? (_.itemDrag.mousemoveFromClone(e), o()) : r.isResizing && _.itemResize.doResize(e);
      } else if (i) {
        const o = e.target.classList;
        o.contains("grid-item-close-btn") ? _.cursor.cursor !== "item-close" && _.cursor.itemClose() : o.contains("grid-item-resizable-handle") ? _.cursor.cursor !== "item-resize" && _.cursor.itemResize() : i.static && n && !n.responsive ? _.cursor.cursor !== "static-no-drop" && _.cursor.staticItemNoDrop() : _.cursor.cursor !== "in-container" && _.cursor.inContainer();
      } else
        A(e) ? _.cursor.cursor !== "in-container" && _.cursor.inContainer() : _.cursor.cursor !== "default" && _.cursor.default();
    }, 12),
    mouseup: (e) => {
      const t = A(e);
      r.isResizing && _.itemResize.mouseup(e), t && _.cursor.cursor !== "in-container" && _.cursor.inContainer();
      const n = r.fromItem, i = r.moveItem ? r.moveItem : r.fromItem;
      if (r.cloneElement !== null) {
        let s = null;
        const m = document.querySelectorAll(".grid-clone-el");
        for (let d = 0; d < m.length; d++) {
          let a = function() {
            i.removeClass("grid-dragging-source-el", "grid-resizing-source-el");
            try {
              g.parentNode.removeChild(g);
            } catch {
            }
            i.__temp__.dragging = !1, n.__temp__.dragging = !1, clearTimeout(s), s = null;
          };
          const g = m[d];
          if (i.transition) {
            const h = i.container.contentElement.getBoundingClientRect();
            if (r.isDragging) {
              let y = window.scrollX + h.left + i.offsetLeft(), p = window.scrollY + h.top + i.offsetTop();
              i.updateStyle({
                transitionProperty: `${i.transition.field}`,
                transitionDuration: `${i.transition.time}ms`,
                width: `${i.nowWidth()}px`,
                height: `${i.nowHeight()}px`,
                left: `${y}px`,
                top: `${p}px`
              }, g);
            } else
              r.isResizing && i.updateStyle({
                transitionProperty: `${i.transition.field}`,
                transitionDuration: `${i.transition.time}ms`,
                width: `${i.nowWidth()}px`,
                height: `${i.nowHeight()}px`,
                left: `${i.offsetLeft()}px`,
                top: `${i.offsetTop()}px`
              }, g);
          }
          i.transition ? s = setTimeout(a, i.transition.time) : a();
        }
      }
      const o = document.querySelectorAll(".grid-item-mask");
      for (let s = 0; s < o.length; s++) {
        const m = o[s];
        m.parentElement.removeChild(m);
      }
      const l = r.mouseDownElClassName;
      if (l && l.includes("grid-item-close-btn") && (e.touchTarget ? e.touchTarget : e.target).classList.contains("grid-item-close-btn")) {
        const m = q(e);
        m === r.fromItem && m.remove(!0);
      }
      const u = r.moveContainer ? r.moveContainer : r.fromContainer;
      if (u && (u.__ownTemp__.firstEnterUnLock = !1, u.__ownTemp__.exchangeLock = !1, u.__ownTemp__.beforeOverItems = [], u.__ownTemp__.moveCount = 0, r.fromContainer && u !== r.fromContainer && (r.fromContainer.__ownTemp__.firstEnterUnLock = !1)), n && (n.container.engine.updateLayout(!0), n.container.childContainer.forEach((d) => {
        d.nestingItem === n && d.container.engine.updateLayout(!0);
      })), n && i.container !== n.container && (i == null || i.container.engine.updateLayout(!0)), i && (r.isDragging && i.container.eventManager._callback_("itemMoved", i.pos.x, i.pos.y, i), r.isResizing && i.container.eventManager._callback_("itemResized", i.pos.w, i.pos.h, i)), r.isLeftMousedown && r.dragOrResize === "slidePage") {
        const s = r.slidePageOffsetInfo, m = s.newestPageX - e.pageX, d = s.newestPageY - e.pageY;
        let g = 500;
        const a = r.fromContainer;
        if (a.slidePage && (d >= 20 || m >= 20)) {
          let h = setInterval(() => {
            g -= 20, a.element.scrollTop += parseInt((d / 100 * g / 30 || 0).toString()), a.element.scrollLeft += parseInt((m / 100 * g / 30 || 0).toString()), (g <= 0 || r.isLeftMousedown) && (clearInterval(h), h = null);
          }, 20);
        }
      }
      r.fromContainer = null, r.moveContainer = null, r.dragContainer = null, r.beforeContainerArea = null, r.currentContainerArea = null, r.cloneElement = null, r.fromItem = null, r.toItem = null, r.moveItem = null, r.offsetPageX = null, r.offsetPageY = null, r.isDragging = !1, r.isResizing = !1, r.isLeftMousedown = !1, r.dragOrResize = null, r.mousedownEvent = null, r.mousedownItemOffsetLeft = null, r.mousedownItemOffsetTop = null, r.mouseDownElClassName = null, r.exchangeItems = {
        new: null,
        old: null
      };
    },
    touchstartOrMousedown: (e) => {
      if (e = e || window.event, e.touches ? (e.stopPropagation && e.stopPropagation(), r.deviceEventMode = "touch", e = ae(e)) : r.deviceEventMode = "mouse", r.deviceEventMode === "touch") {
        r.allowTouchMoveItem = !1;
        const t = A(e);
        document.addEventListener("contextmenu", _.prevent.contextmenu);
        const n = t ? t.pressTime : 360;
        r.timeOutEvent = setTimeout(() => {
          r.allowTouchMoveItem = !0, b.container.mousemove(e);
          let i = setTimeout(() => {
            document.removeEventListener("contextmenu", _.prevent.contextmenu), clearTimeout(i), i = null;
          }, 600);
          clearTimeout(r.timeOutEvent);
        }, n);
      }
      b.container.mousedown(e);
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
      e.stopPropagation && e.stopPropagation(), _.itemDrag.mousemoveFromItemChange(e), b.container.mousemove(e);
    },
    touchendOrMouseup: (e) => {
      e = e || window.event, e.touches ? (clearTimeout(r.timeOutEvent), r.allowTouchMoveItem = !1, r.deviceEventMode = "touch", e = ae(e), document.removeEventListener("contextmenu", _.prevent.contextmenu)) : r.deviceEventMode = "mouse", b.container.mouseup(e);
    }
  }
});
const _ = W._eventEntrustFunctor, b = W._eventPerformer;
class ze {
  constructor() {
    f(this, "element", null);
    f(this, "observer", null);
  }
  updateStyle(e, t = null, n = !0) {
    if (Object.keys(e).length === 0)
      return;
    t = t || this.element;
    let i = "";
    Object.keys(e).forEach((o) => {
      n ? i = `${i} ${Ge(o)}:${e[o]}; ` : t.style[o] = e[o];
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
      this.observer = new o(k(e, t));
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
    e.includes("on") || (e = "on" + e), o[e] || (o[e] = k(t, i));
  }
  addEvent(e, t, n = null, i = {}) {
    let o = 350, l = !1;
    i.throttleTime && (o = i.throttleTime), i.capture && (l = i.capture);
    const u = n || this.element, s = k(t, o);
    return u.addEventListener(e, s, l), s;
  }
  removeEvent(e, t, n = null) {
    (n || this.element).removeEventListener(e, t);
  }
  throttle(e, t) {
    return k(e, t);
  }
}
const ue = H.store;
class ne extends ze {
  constructor(t) {
    super();
    f(this, "el", "");
    f(this, "name", "");
    f(this, "type", null);
    f(this, "follow", !0);
    f(this, "dragOut", !0);
    f(this, "className", "grid-item");
    f(this, "dragIgnoreEls", []);
    f(this, "dragAllowEls", []);
    f(this, "transition", null);
    f(this, "draggable", null);
    f(this, "resize", null);
    f(this, "close", null);
    f(this, "static", !1);
    f(this, "margin", [null, null]);
    f(this, "size", [null, null]);
    f(this, "nested", !1);
    f(this, "i", null);
    f(this, "element", null);
    f(this, "container", null);
    f(this, "tagName", "div");
    f(this, "classList", []);
    f(this, "attr", []);
    f(this, "pos", {});
    f(this, "edit", null);
    f(this, "parentElement", null);
    f(this, "_VueEvents", {});
    f(this, "_mounted", !1);
    f(this, "_resizeTabEl", null);
    f(this, "_closeEl", null);
    f(this, "__temp__", {
      eventRecord: {},
      event: {},
      editNumUsing: !1,
      styleLock: !1,
      maskEl: null,
      height: 0,
      width: 0,
      dragging: !1,
      clientWidth: 0,
      clientHeight: 0,
      resized: {
        w: 1,
        h: 1
      }
    });
    f(this, "exportConfig", () => {
      const t = this, n = {};
      let i = {};
      i = t.pos.export(), this.responsive && (delete i.x, delete i.y), n.pos = i, Array.from(["static", "draggable", "resize", "close", "nested"]).forEach((l) => {
        t[l] !== !1 && (n[l] = t[l]);
      }), Array.from(["follow", "dragOut"]).forEach((l) => {
        t[l] !== !0 && (n[l] = t[l]);
      }), typeof t.name == "string" && (n.name = t.name), typeof t.type == "string" && (n.type = t.type);
      let o = {};
      return t.transition.field !== "top,left,width,height" ? (o.field = t.transition.field, t.transition.time !== 180 && (o.time = t.transition.time)) : o = t.transition.time, n.transition = o, n;
    });
    f(this, "nowWidth", (t) => {
      let n = 0;
      const i = t || this.pos.w;
      return i > 1 && (n = (i - 1) * this.margin[0]), i * this.size[0] + n;
    });
    f(this, "nowHeight", (t) => {
      let n = 0;
      const i = t || this.pos.h;
      return i > 1 && (n = (i - 1) * this.margin[1]), i * this.size[1] + n;
    });
    f(this, "minHeight", () => {
      let t = 0;
      return this.pos.minH === 1 / 0 ? 1 / 0 : (this.pos.minH > 1 && (t = (this.pos.minH - 1) * this.margin[1]), this.pos.minH * this.size[1] + t);
    });
    f(this, "maxHeight", () => {
      let t = 0;
      return this.pos.maxH === 1 / 0 ? 1 / 0 : (t = (this.pos.maxH - 1) * this.margin[1], this.pos.maxH * this.size[1] + t);
    });
    f(this, "_genItemStyle", () => this.styleLock() ? {} : {
      width: this.nowWidth() + "px",
      height: this.nowHeight() + "px",
      left: this.offsetLeft() + "px",
      top: this.offsetTop() + "px"
    });
    f(this, "_genLimitSizeStyle", () => this.styleLock() ? {} : {
      minWidth: this.minWidth() + "px",
      minHeight: this.minHeight() + "px",
      maxWidth: this.maxWidth() + "px",
      maxHeight: this.maxHeight() + "px"
    });
    t.el instanceof Element && (this.el = t.el, this.element = t.el), this._define(), F(this, t), this.pos = new J(t.pos), this._itemSizeLimitCheck();
  }
  _define() {
    const t = this;
    let n = !1, i = !1, o = !1, l = !1, u = {
      time: 180,
      field: "top,left,width,height"
    };
    Object.defineProperties(this, {
      draggable: {
        configurable: !1,
        get: () => n,
        set(s) {
          if (typeof s == "boolean") {
            if (n === s)
              return;
            n = s, t.edit = n || i || o;
          }
        }
      },
      resize: {
        configurable: !1,
        get: () => i,
        set(s) {
          if (typeof s == "boolean") {
            if (i === s)
              return;
            i = s, t._handleResize(s), t.edit = n || i || o;
          }
        }
      },
      close: {
        configurable: !1,
        get: () => o,
        set(s) {
          if (typeof s == "boolean") {
            if (o === s)
              return;
            o = s, t._closeBtn(s), t.edit = n || i || o;
          }
        }
      },
      edit: {
        configurable: !1,
        get: () => l,
        set(s) {
          if (typeof s == "boolean") {
            if (l === s)
              return;
            l = s, t._edit(l);
          }
        }
      },
      transition: {
        configurable: !1,
        get: () => u,
        set(s) {
          s === !1 && (u.time = 0), typeof s == "number" && (u.time = s), typeof s == "object" && (s.time && s.time !== u.time && (u.time = s.time), s.field && s.field !== u.field && (u.field = s.field)), t.animation(u);
        }
      }
    });
  }
  mount() {
    const t = () => {
      this._mounted || (this.container.platform !== "vue" && (this.element === null && (this.element = document.createElement(this.tagName)), this.container.contentElement.appendChild(this.element)), this.attr = Array.from(this.element.attributes), this.element.classList.add(this.className), this.classList = Array.from(this.element.classList), this.updateStyle(G.gridItem), this.updateStyle(this._genItemStyle()), this.__temp__.w = this.pos.w, this.__temp__.h = this.pos.h, this.element._gridItem_ = this, this.element._isGridItem_ = !0, this._mounted = !0, this.container.eventManager._callback_("itemMounted", this));
    };
    this.container.platform === "vue" ? t() : C.run(t);
  }
  unmount(t = !1) {
    C.run(() => {
      this._mounted ? (this.__temp__.editNumUsing && (this.__temp__.editNumUsing = !1, ue.editItemNum--), this._handleResize(!1), this._closeBtn(!1), this.container.contentElement.removeChild(this.element), this.container.eventManager._callback_("itemUnmounted", this)) : this.container.eventManager._error_("ItemAlreadyRemove", "\u8BE5Item\u5BF9\u5E94\u7684element\u672A\u5728\u6587\u6863\u4E2D\u6302\u8F7D\uFF0C\u53EF\u80FD\u5DF2\u7ECF\u88AB\u79FB\u9664", this);
    }), t && this.remove(), this._mounted = !1;
  }
  remove(t = !1) {
    this.container.engine.remove(this), t && this.unmount();
  }
  _edit(t = !1) {
    this.edit === !0 ? this.__temp__.editNumUsing || (W.startEvent(null, this), this.__temp__.editNumUsing = !0, ue.editItemNum++) : this.edit === !1 && this.__temp__.editNumUsing && (W.removeEvent(null, this), ue.editItemNum--, this.__temp__.editNumUsing = !1);
  }
  animation(t) {
    if (typeof t != "object") {
      console.log("\u53C2\u6570\u5E94\u8BE5\u662F\u5BF9\u8C61\u5F62\u5F0F{time:Number, field:String}");
      return;
    }
    C.run(() => {
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
        const l = document.createElement("span");
        l.innerHTML = "\u22BF", this.updateStyle(G.gridResizableHandle, l), this.element.appendChild(l), l.classList.add(i), this._resizeTabEl = l;
      } else if (this.element && t === !1)
        for (let o = 0; o < this.element.children.length; o++) {
          const l = this.element.children[o];
          l.className.includes(i) && (this.element.removeChild(l), this._resizeTabEl = null);
        }
    };
    this.element ? n() : C.run(n);
  }
  _closeBtn(t = !1) {
    const n = () => {
      const i = "grid-item-close-btn";
      if (t && this._closeEl === null) {
        const o = document.createElement("div");
        this.updateStyle(G.gridItemCloseBtn, o), this._closeEl = o, o.classList.add(i), this.element.appendChild(o), o.innerHTML = G.gridItemCloseBtn.innerHTML;
      }
      if (this._closeEl !== null && !t)
        for (let o = 0; o < this.element.children.length; o++) {
          const l = this.element.children[o];
          l.className.includes(i) && (this.element.removeChild(l), this._closeEl = null);
        }
    };
    this.element ? n() : C.run(n);
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
class Ve {
  constructor() {
    f(this, "isDebugger", !1);
    f(this, "DebuggerTemp", {});
    f(this, "count", 0);
    f(this, "_mode", "grid");
    f(this, "_layoutMatrix", []);
    f(this, "layoutPositions", []);
    f(this, "col", null);
    f(this, "minRow", null);
    f(this, "maxRow", null);
    f(this, "row", null);
    f(this, "isAutoRow", !1);
    f(this, "iNameHash", "");
    f(this, "addRow", (e = null) => {
      if (!!e) {
        for (let t = 0; t < e; t++)
          this._layoutMatrix.push(new Array(this.col).fill(!1));
        this.row = this._layoutMatrix.length;
      }
    });
    f(this, "removeOneRow", () => this._layoutMatrix.length === 0 ? (console.log("\u6805\u683C\u5185\u884C\u6570\u5DF2\u7ECF\u4E3A\u7A7A"), !1) : this._layoutMatrix[this._layoutMatrix.length - 1].includes(!0) ? (console.log("\u8BA1\u5212\u5220\u9664\u7684\u6805\u683C\u5185\u5B58\u5728\u7EC4\u4EF6,\u672A\u5220\u9664\u5305\u542B\u7EC4\u4EF6\u7684\u6805\u683C"), !1) : (this._layoutMatrix.pop(), this.row = this._layoutMatrix.length, !0));
    f(this, "removeBlankRow", (e) => {
      for (let t = 0; t < e; t++)
        if (!this.removeOneRow())
          return;
    });
    f(this, "findItem", (e, t = !1) => {
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
    const u = this.toINameHash(e.i), s = e.x + e.w - 1, m = e.y + e.h - 1;
    if (s > this.col || m > this.row)
      return !1;
    for (let d = n - 1; d <= o - 1; d++)
      for (let g = t - 1; g <= i - 1; g++) {
        const a = this._layoutMatrix[d][g];
        if (u.toString() !== a && a !== !1) {
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
    let n = 0, i = this.col - 1, o = 0, l = [];
    e > this.col && (console.warn("ITEM:", "w:" + e, "x", "h:" + t, "\u7684\u5BBD\u5EA6", e, "\u8D85\u8FC7\u6805\u683C\u5927\u5C0F\uFF0C\u81EA\u52A8\u8C03\u6574\u8BE5ITEM\u5BBD\u5EA6\u4E3A\u6805\u683C\u6700\u5927\u5BBD\u5EA6", this.col), e = this.col);
    let u = 0;
    for (; u++ < 500; ) {
      this._layoutMatrix.length < t + o && this.isAutoRow && this.addRow(t + o - this._layoutMatrix.length);
      let s = !0, m = !1;
      if (!this.col)
        throw new Error("\u672A\u627E\u5230\u7ECF\u8FC7\u5F15\u64CE\u5904\u7406\u8FC7\u540E\u7684col\uFF0C\u53EF\u80FD\u662F\u5C11\u4F20\u53C2\u6570\u6216\u8005\u4EE3\u7801\u6267\u884C\u987A\u5E8F\u6709\u8BEF\uFF0C\u5018\u82E5\u8FD9\u6837\uFF0C\u4E0D\u7528\u95EE\uFF0C\u8FD9\u5C31\u662Fbug");
      for (let d = 0; d < t; d++) {
        l = this._layoutMatrix[o + d], this.DebuggerTemp.yPointStart = o;
        let g = this._findRowBlank(l, e, n, i);
        if (g.success === !1) {
          if (s = !1, m || (d = -1, n = i + 1, i = this.col - 1), n > i) {
            m = !0;
            break;
          }
        } else
          g.success === !0 && (s = !0, d === 0 && (n = g.xStart, i = g.xEnd));
      }
      if (s)
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
    let u = l !== null ? l : o.toString();
    for (let s = t - 1; s <= i - 1; s++)
      for (let m = e - 1; m <= n - 1; m++)
        try {
          this.isDebugger ? this._layoutMatrix[s][m] = "__debugger__" : this._layoutMatrix[s][m] = u;
        } catch (d) {
          console.log(d);
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
    f(this, "container", null);
    f(this, "useLayoutConfig", {});
    f(this, "option", {});
    f(this, "_defaultLayoutConfig", Je);
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
    var M;
    let t = {}, n = {};
    e = e || ((M = this.container.element) == null ? void 0 : M.clientWidth);
    const i = this.container.layouts.sort((v, S) => v.px - S.px);
    for (let v = 0; v < i.length && (n = i[v], Array.isArray(n.data) || (n.data = []), i.length !== 1); v++)
      if (!(n.px < e))
        break;
    if (e === 0 && !t.col)
      throw new Error("\u8BF7\u5728layout\u4E2D\u4F20\u5165col\u7684\u503C\u6216\u8005\u4E3AContainer\u8BBE\u7F6E\u4E00\u4E2A\u521D\u59CB\u5BBD\u5EA6");
    t = Object.assign(V(this.option.global), V(n));
    let {
      col: o = null,
      ratio: l = this.container.ratio,
      size: u = [null, null],
      margin: s = [null, null],
      padding: m = 0,
      sizeWidth: d,
      sizeHeight: g,
      marginX: a,
      marginY: h,
      marginLimit: y = {}
    } = t;
    if (!o && !(u[0] || d))
      throw new Error("col\u6216\u8005size[0]\u5FC5\u987B\u8981\u8BBE\u5B9A\u4E00\u4E2A,\u60A8\u4E5F\u53EF\u4EE5\u8BBE\u5B9Acol\u6216sizeWidth\u4E24\u4E2A\u4E2D\u7684\u4E00\u4E2A\u4FBF\u80FD\u8FDB\u884C\u5E03\u5C40");
    if (a && (s[0] = a), h && (s[1] = h), d && (u[0] = d), g && (u[1] = g), o)
      if (u[0] === null && s[0] === null)
        parseInt(o) === 1 ? (s[0] = 0, u[0] = e / o) : (s[0] = e / (o - 1 + o / l), u[0] = s[0] / l, u[0] = (e - (o - 1) * s[0]) / o);
      else if (u[0] !== null && s[0] === null)
        parseInt(o) === 1 ? s[0] = 0 : s[0] = (e - o * u[0]) / (o - 1), s[0] <= 0 && (s[0] = 0);
      else if (u[0] === null && s[0] !== null) {
        if (parseInt(o) === 1 && (s[0] = 0), u[0] = (e - (o - 1) * s[0]) / o, u[0] <= 0)
          throw new Error("\u5728margin[0]\u6216\u5728marginX\u4E3A" + s[0] + "\u7684\u60C5\u51B5\u4E0B,size[0]\u6216sizeWidth\u7684Item\u4E3B\u9898\u5BBD\u5EA6\u5DF2\u7ECF\u5C0F\u4E8E0");
      } else
        u[0] !== null && s[0];
    else
      o === null && (s[0] === null && u[0] !== null ? e <= u[0] ? (s[0] = 0, o = 1) : (o = Math.floor(e / u[0]), s[0] = (e - u[0] * o) / o) : s[0] !== null && u[0] !== null && (e <= u[0] ? (s[0] = 0, o = 1) : o = Math.floor((e - s[0]) / (s[0] + u[0]))));
    t = Object.assign(t, {
      padding: m,
      margin: s,
      size: u,
      col: o
    });
    let p = (v) => {
      let { margin: S, size: O, minCol: I, maxCol: w, col: P, padding: U } = v;
      return S[0] = S[0] ? parseFloat(S[0].toFixed(1)) : 0, S[1] = S[1] ? parseFloat(S[1].toFixed(1)) : parseFloat(S[0].toFixed(1)), O[0] = O[0] ? parseFloat(O[0].toFixed(1)) : 0, O[1] = O[1] ? parseFloat(O[1].toFixed(1)) : parseFloat(O[0].toFixed(1)), P < I && (v.col = I), P > w && (v.col = w), v;
    };
    const E = {};
    for (const v in t)
      (this.option.global[v] !== void 0 || n[v] !== void 0) && (E[v] = t[v]);
    return this.useLayoutConfig = Object.assign(this.useLayoutConfig, p(t)), this.container.layout = n, this.container.useLayout = t, {
      layout: n,
      global: this.option.global,
      useLayoutConfig: t,
      currentLayout: E
    };
  }
}
class Qe {
  constructor(e) {
    f(this, "items", []);
    f(this, "option", {});
    f(this, "layoutManager", null);
    f(this, "container", null);
    f(this, "layoutConfig", null);
    f(this, "initialized", !1);
    f(this, "__temp__", {
      responsiveFunc: null,
      staticIndexCount: 0
    });
    this.option = e;
  }
  init() {
    this.initialized || (this.layoutManager = new Ve(), this.layoutConfig = new Ze(this.option), this.layoutConfig.setContainer(this.container), this.layoutConfig.initLayoutInfo(), this.initialized = !0);
  }
  _sync() {
    let e = this.layoutConfig.genLayoutConfig();
    this._syncLayoutConfig(e.useLayoutConfig);
  }
  _syncLayoutConfig(e = null) {
    if (!!e) {
      if (Object.keys(e).length === 0 && !this.option.col)
        throw new Error("\u672A\u627E\u5230layout\u76F8\u5173\u51B3\u5B9A\u5E03\u5C40\u914D\u7F6E\u4FE1\u606F\uFF0C\u60A8\u53EF\u80FD\u662F\u672A\u4F20\u5165col\u5B57\u6BB5");
      F(this.container, e, !1, ["events"]), this.autoSetColAndRows(this.container), this.items.forEach((t) => {
        F(t, {
          margin: e.margin,
          size: e.size
        });
      });
    }
  }
  autoSetColAndRows(e, t = !0) {
    let n = e.col, i = e.row, o = n, l = i;
    const u = e.engine.items, s = (a) => {
      let h = 1, y = 1;
      return a.length > 0 && a.forEach((p) => {
        p.pos.x + p.pos.w - 1 > h && (h = p.pos.x + p.pos.w - 1), p.pos.y + p.pos.h - 1 > y && (y = p.pos.y + p.pos.h - 1);
      }), { smartCol: h, smartRow: y };
    }, m = (a, h) => (e.minCol && e.maxCol && e.minCol > e.maxCol ? (a = e.maxCol, console.warn("minCol\u6307\u5B9A\u7684\u503C\u5927\u4E8EmaxCol,\u5C06\u4EE5maxCol\u6307\u5B9A\u7684\u503C\u4E3A\u4E3B")) : e.maxCol && a > e.maxCol ? a = e.maxCol : e.minCol && a < e.minCol && (a = e.minCol), e.minRow && e.maxRow && e.minRow > e.maxRow ? (h = e.maxRow, console.warn("minRow\u6307\u5B9A\u7684\u503C\u5927\u4E8EmaxRow,\u5C06\u4EE5maxRow\u6307\u5B9A\u7684\u503C\u4E3A\u4E3B")) : e.maxRow && h > e.maxRow ? h = e.maxRow : e.minRow && h < e.minRow && (h = e.minRow), {
      limitCol: a,
      limitRow: h
    }), d = () => {
      if (!this.initialized)
        e.row ? i = e.row : this.layoutManager.autoRow(), e.maxRow && console.warn("\u3010\u54CD\u5E94\u5F0F\u3011\u6A21\u5F0F\u4E2D\u4E0D\u5EFA\u8BAE\u4F7F\u7528maxRow,\u60A8\u5982\u679C\u4F7F\u7528\u8BE5\u503C\uFF0C\u53EA\u4F1A\u9650\u5236\u5BB9\u5668\u76D2\u5B50(Container)\u7684\u9AD8\u5EA6,\u4E0D\u80FD\u9650\u5236\u6210\u5458\u6392\u5217\u7684row\u503C \u56E0\u4E3A\u54CD\u5E94\u5F0F\u8BBE\u8BA1\u662F\u80FD\u81EA\u52A8\u7BA1\u7406\u5BB9\u5668\u7684\u9AD8\u5EA6\uFF0C\u60A8\u5982\u679C\u60F3\u8981\u9650\u5236Container\u663E\u793A\u533A\u57DF\u4E14\u83B7\u5F97\u5185\u5BB9\u6EDA\u52A8\u80FD\u529B\uFF0C\u60A8\u53EF\u4EE5\u5728Container\u5916\u90E8\u52A0\u4E0A\u4E00\u5C42\u76D2\u5B50\u5E76\u8BBE\u7F6E\u6210overflow:scroll");
      else if (this.initialized) {
        this.layoutManager.autoRow(), i = s(u).smartRow;
        const h = m(n, i);
        o = h.limitCol, l = h.limitRow;
      }
    }, g = () => {
      const a = m(e.col, e.row);
      o = n = a.limitCol, l = i = a.limitRow;
    };
    if (e.responsive ? d() : e.responsive || g(), t) {
      this.container.col = n, this.container.row = i, this.container.containerW = o, this.container.containerH = l, this.layoutManager.setColNum(n), this.layoutManager.setRowNum(i), this.layoutManager.addRow(i - this.layoutManager._layoutMatrix.length);
      const a = this.container.__ownTemp__.preCol, h = this.container.__ownTemp__.preRow;
      if (n !== a) {
        this.container.__ownTemp__.preCol = n, this.container.eventManager._callback_("colChange", n, a, e);
        const y = this.container._VueEvents.vueColChange;
        typeof y == "function" && y(n, a, e);
      }
      if (i !== h) {
        this.container.__ownTemp__.preRow = i, this.container.eventManager._callback_("rowChange", i, h, e);
        const y = this.container._VueEvents.vueRowChange;
        typeof y == "function" && y(i, h, e);
      }
    }
    return {
      col: n,
      row: i,
      containerW: o,
      containerH: l
    };
  }
  findCoverItemFromPosition(e, t, n, i, o = null) {
    o = o || this.items;
    const l = [];
    for (let u = 0; u < o.length; u++) {
      let s = o[u];
      const m = e, d = t, g = e + n - 1, a = t + i - 1, h = s.pos.x, y = s.pos.y, p = s.pos.x + s.pos.w - 1, E = s.pos.y + s.pos.h - 1;
      ((p >= m && p <= g || h >= m && h <= g || m >= h && g <= p) && (E >= d && E <= a || y >= d && y <= a || d >= y && a <= E) || m >= h && g <= p && d >= y && a <= E) && l.push(s);
    }
    return l;
  }
  findResponsiveItemFromPosition(e, t, n, i) {
    let o = null, l = 1;
    this.items.length > 0 && (l = this.items[this.items.length - 1].pos.y);
    for (let u = 0; u < this.items.length; u++) {
      let s = this.items[u];
      const m = s.pos.x, d = s.pos.y, g = s.pos.x + s.pos.w - 1, a = s.pos.y + s.pos.h - 1;
      m === e && (t > l && (t = l), e === m && t === d && (o = s));
    }
    return o;
  }
  findStaticBlankMaxMatrixFromItem(e) {
    const t = e.pos.x, n = e.pos.y, i = e.pos.w, o = e.pos.h;
    let l = this.container.col - t + 1, u = this.container.row - n + 1, s = l, m = u;
    for (let d = 0; d < this.items.length; d++) {
      const g = this.items[d], a = g.pos;
      e !== g && (a.x + a.w - 1 < t || a.y + a.h - 1 < n || (a.x >= t && a.x - t < l && (n + o - 1 >= a.y && n + o - 1 <= a.y + a.h - 1 || a.y + a.h - 1 >= n && a.y + a.h - 1 <= n + o - 1) && (l = a.x - t), a.y >= n && a.y - n < u && (t + i - 1 >= a.x && t + i - 1 <= a.x + a.w - 1 || a.x + a.w - 1 >= t && a.x + a.w - 1 <= t + i - 1) && (u = a.y - n), a.x >= t && a.x - t < s && (n + u - 1 >= a.y && n + u - 1 <= a.y + a.h - 1 || a.y + a.h - 1 >= n && a.y + a.h - 1 <= n + u - 1) && (s = a.x - t), a.y >= n && a.y - n < m && (t + l - 1 >= a.x && t + l - 1 <= a.x + a.w - 1 || a.x + a.w - 1 >= t && a.x + a.w - 1 <= t + l - 1) && (m = a.y - n)));
    }
    return {
      maxW: l,
      maxH: u,
      minW: s,
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
      e.pos.i = e.i = this.__temp__.staticIndexCount++, !this.container._mounted || this.container.responsive ? e.pos.autoOnce = !0 : this.container.responsive || !e._mounted && e.pos.autoOnce === null && (e.pos.autoOnce = !0);
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
    let n = !1;
    if (t)
      if (this.items.length <= 1)
        this.items.push(e), n = !0;
      else {
        let i, o;
        for (let l = 0; l < this.items.length; l++)
          if (this.items.length > l && (o = this.items[l], i = this.items[l + 1]), i) {
            const u = o.pos, s = i.pos;
            if (u.y <= t.y && s.y > t.y) {
              this.insert(e, l + 1), n = !0;
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
    return o.i = e.i, i = this.layoutManager.findItem(o, t), i !== null ? (n && (this.layoutManager.addItem(i), e.pos = new J(F(this._genItemPosArg(e), i)), e.pos.nextStaticPos = null, e.pos.autoOnce = !1), i) : null;
  }
  updateLayout(e = null, t = []) {
    if (this.container.responsive) {
      this.reset(), this._sync(), this.renumber();
      let o = e;
      (e === !0 || o === null) && (o = []), e = this.items, o = o.filter((u) => e.includes(u));
      const l = (u) => {
        this._isCanAddItemToContainer_(u, u.autoOnce, !0) && u.updateItemLayout();
      };
      o.forEach((u) => {
        u.autoOnce = !1, l(u);
      }), e.forEach((u) => {
        o.includes(u) || (u.autoOnce = !0, l(u));
      }), this.autoSetColAndRows(this.container);
    } else if (!this.container.responsive) {
      let o = [];
      if (e === null)
        o = [];
      else if (Array.isArray(e))
        o = e;
      else if (e !== !0 && o.length === 0)
        return;
      this.reset(), this._sync(), this.renumber(), e = this.items, o = o.filter((u) => e.includes(u)), this._sync();
      const l = (u) => {
        this._isCanAddItemToContainer_(u, !1, !0), u.updateItemLayout();
      };
      e.forEach((u) => {
        o.includes(u) || l(u);
      }), o.forEach((u) => {
        l(u);
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
        const l = n(i);
        i.__ownTemp__.beforeContainerSizeInfo = n(i), this.container.eventManager._callback_("containerSizeChange", o, l, i);
      }
    }
  }
  _genItemPosArg(e) {
    return e.pos.i = e.i, e.pos.col = (() => this.container.col)(), e.pos.row = (() => this.container.row)(), e.pos;
  }
}
class de extends Error {
  constructor() {
    super(...arguments);
    f(this, "name", de.name);
    f(this, "message", "getErrAttr=>[name|message] \u5BB9\u5668\u6EA2\u51FA\uFF0C\u53EA\u6709\u9759\u6001\u6A21\u5F0F\u4E0B\u4F1A\u51FA\u73B0\u6B64\u9519\u8BEF,\u60A8\u53EF\u4EE5\u4F7F\u7528error\u4E8B\u4EF6\u51FD\u6570\u63A5\u6536\u8BE5\u9519\u8BEF\uFF0C\u90A3\u4E48\u8BE5\u9519\u8BEF\u5C31\u4E0D\u4F1A\u629B\u51FA\u800C\u662F\u5C06\u9519\u8BEF\u4F20\u5230error\u4E8B\u4EF6\u51FD\u6570\u7684\u7B2C\u4E8C\u4E2A\u5F62\u53C2");
  }
}
const Ke = {
  ContainerOverflowError: de
};
class xe {
  static index(e) {
    return e ? Ke[e] : Error;
  }
}
class et {
  constructor(e) {
    f(this, "error", null);
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
class tt {
  constructor(e = {}) {
    f(this, "className", "grid-container");
    f(this, "responsive", !1);
    f(this, "responseMode", "default");
    f(this, "data", []);
    f(this, "col", null);
    f(this, "row", null);
    f(this, "margin", [null, null]);
    f(this, "marginX", null);
    f(this, "marginY", null);
    f(this, "size", [null, null]);
    f(this, "sizeWidth", null);
    f(this, "sizeHeight", null);
    f(this, "minCol", null);
    f(this, "maxCol", null);
    f(this, "minRow", null);
    f(this, "maxRow", null);
    f(this, "autoGrowRow", !0);
    f(this, "ratio", 0.1);
    f(this, "followScroll", !0);
    f(this, "sensitivity", 0.45);
    f(this, "itemLimit", {});
    f(this, "exchange", !1);
    f(this, "pressTime", 360);
    f(this, "scrollWaitTime", 800);
    f(this, "scrollSpeedX", null);
    f(this, "scrollSpeedY", null);
    f(this, "resizeReactionDelay", 200);
    f(this, "slidePage", !0);
    f(this, "nestedOutExchange", !1);
    F(this, e);
  }
}
const Me = function() {
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
}(), nt = function() {
  return typeof requestAnimationFrame == "function" ? requestAnimationFrame.bind(ie) : function(c) {
    return setTimeout(function() {
      return c(Date.now());
    }, 1e3 / 60);
  };
}(), it = 2;
function ot(c, e) {
  let t = !1, n = !1, i = 0;
  function o() {
    t && (t = !1, c()), n && u();
  }
  function l() {
    nt(o);
  }
  function u() {
    const s = Date.now();
    if (t) {
      if (s - i < it)
        return;
      n = !0;
    } else
      t = !0, n = !1, setTimeout(l, e);
    i = s;
  }
  return u;
}
const st = 20, rt = ["top", "right", "bottom", "left", "width", "height", "size", "weight"], lt = typeof MutationObserver < "u", at = function() {
  function c() {
    this.connected_ = !1, this.mutationEventsAdded_ = !1, this.mutationsObserver_ = null, this.observers_ = [], this.onTransitionEnd_ = this.onTransitionEnd_.bind(this), this.refresh = ot(this.refresh.bind(this), st);
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
    !me || this.connected_ || (document.addEventListener("transitionend", this.onTransitionEnd_), window.addEventListener("resize", this.refresh), lt ? (this.mutationsObserver_ = new MutationObserver(this.refresh), this.mutationsObserver_.observe(document, {
      attributes: !0,
      childList: !0,
      characterData: !0,
      subtree: !0
    })) : (document.addEventListener("DOMSubtreeModified", this.refresh), this.mutationEventsAdded_ = !0), this.connected_ = !0);
  }, c.prototype.disconnect_ = function() {
    !me || !this.connected_ || (document.removeEventListener("transitionend", this.onTransitionEnd_), window.removeEventListener("resize", this.refresh), this.mutationsObserver_ && this.mutationsObserver_.disconnect(), this.mutationEventsAdded_ && document.removeEventListener("DOMSubtreeModified", this.refresh), this.mutationsObserver_ = null, this.mutationEventsAdded_ = !1, this.connected_ = !1);
  }, c.prototype.onTransitionEnd_ = function(e) {
    const t = e.propertyName, n = t === void 0 ? "" : t;
    rt.some(function(o) {
      return !!~n.indexOf(o);
    }) && this.refresh();
  }, c.getInstance = function() {
    return this.instance_ || (this.instance_ = new c()), this.instance_;
  }, c.instance_ = null, c;
}(), Te = function(c, e) {
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
}, Se = re(0, 0, 0, 0);
function oe(c) {
  return parseFloat(c) || 0;
}
function ve(c) {
  const e = [];
  for (let t = 1; t < arguments.length; t++)
    e[t - 1] = arguments[t];
  return e.reduce(function(t, n) {
    const i = c["border-" + n + "-width"];
    return t + oe(i);
  }, 0);
}
function ut(c) {
  const e = ["top", "right", "bottom", "left"], t = {};
  for (let n = 0, i = e; n < i.length; n++) {
    const o = i[n], l = c["padding-" + o];
    t[o] = oe(l);
  }
  return t;
}
function ct(c) {
  const e = c.getBBox();
  return re(0, 0, e.width, e.height);
}
function ft(c) {
  const e = c.clientWidth, t = c.clientHeight;
  if (!e && !t)
    return Se;
  const n = j(c).getComputedStyle(c), i = ut(n), o = i.left + i.right, l = i.top + i.bottom;
  let u = oe(n.width), s = oe(n.height);
  if (n.boxSizing === "border-box" && (Math.round(u + o) !== e && (u -= ve(n, "left", "right") + o), Math.round(s + l) !== t && (s -= ve(n, "top", "bottom") + l)), !ht(c)) {
    const m = Math.round(u + o) - e, d = Math.round(s + l) - t;
    Math.abs(m) !== 1 && (u -= m), Math.abs(d) !== 1 && (s -= d);
  }
  return re(i.left, i.top, u, s);
}
const mt = function() {
  return typeof SVGGraphicsElement < "u" ? function(c) {
    return c instanceof j(c).SVGGraphicsElement;
  } : function(c) {
    return c instanceof j(c).SVGElement && typeof c.getBBox == "function";
  };
}();
function ht(c) {
  return c === j(c).document.documentElement;
}
function dt(c) {
  return me ? mt(c) ? ct(c) : ft(c) : Se;
}
function gt(c) {
  const e = c.x, t = c.y, n = c.width, i = c.height, l = Object.create((typeof DOMRectReadOnly < "u" ? DOMRectReadOnly : Object).prototype);
  return Te(l, {
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
    var e = dt(this.target);
    return this.contentRect_ = e, e.width !== this.broadcastWidth || e.height !== this.broadcastHeight;
  }, c.prototype.broadcastRect = function() {
    var e = this.contentRect_;
    return this.broadcastWidth = e.width, this.broadcastHeight = e.height, e;
  }, c;
}(), _t = function() {
  function c(e, t) {
    var n = gt(t);
    Te(this, { target: e, contentRect: n });
  }
  return c;
}(), yt = function() {
  function c(e, t, n) {
    if (this.activeObservations_ = [], this.observations_ = new Me(), typeof e != "function")
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
      return new _t(n.target, n.broadcastRect());
    });
    this.callback_.call(e, t, e), this.clearActive();
  }, c.prototype.clearActive = function() {
    this.activeObservations_.splice(0);
  }, c.prototype.hasActive = function() {
    return this.activeObservations_.length > 0;
  }, c;
}(), Re = typeof WeakMap < "u" ? /* @__PURE__ */ new WeakMap() : new Me(), Oe = function() {
  function c(e) {
    if (!(this instanceof c))
      throw new TypeError("Cannot call a class as a function.");
    if (!arguments.length)
      throw new TypeError("1 argument required, but only 0 present.");
    const t = at.getInstance(), n = new yt(e, t, this);
    Re.set(this, n);
  }
  return c;
}();
[
  "observe",
  "unobserve",
  "disconnect"
].forEach(function(c) {
  Oe.prototype[c] = function() {
    let e;
    return (e = Re.get(this))[c].apply(e, arguments);
  };
});
const wt = function() {
  return typeof ie.ResizeObserver < "u" ? ie.ResizeObserver : Oe;
}(), ee = H.store;
class xt extends ze {
  constructor(t) {
    super();
    f(this, "el", "");
    f(this, "parent", null);
    f(this, "platform", "native");
    f(this, "layouts", []);
    f(this, "events", []);
    f(this, "global", {});
    f(this, "element", null);
    f(this, "contentElement", null);
    f(this, "classList", []);
    f(this, "attr", []);
    f(this, "engine", []);
    f(this, "px", null);
    f(this, "layout", {});
    f(this, "useLayout", {});
    f(this, "childContainer", []);
    f(this, "isNesting", !1);
    f(this, "parentItem", null);
    f(this, "containerH", null);
    f(this, "containerW", null);
    f(this, "eventManager", null);
    f(this, "_VueEvents", {});
    f(this, "_mounted", !1);
    f(this, "__store__", ee);
    f(this, "__ownTemp__", {
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
      nestingFirstMounted: !1
    });
    f(this, "genGridContainerBox", () => {
      this.contentElement = document.createElement("div"), this.contentElement.classList.add("grid-container-area"), this.contentElement._isGridContainerArea = !0, this.element.appendChild(this.contentElement), this.updateStyle(G.gridContainer, this.contentElement), this.contentElement.classList.add(this.className);
    });
    f(this, "genContainerStyle", () => ({
      width: this.nowWidth() + "px",
      height: this.nowHeight() + "px"
    }));
    f(this, "nowWidth", () => {
      let t = 0, n = this.containerW;
      return n > 1 && (t = (n - 1) * this.margin[0]), n * this.size[0] + t || 0;
    });
    f(this, "nowHeight", () => {
      let t = 0, n = this.containerH;
      return n > 1 && (t = (n - 1) * this.margin[1]), n * this.size[1] + t || 0;
    });
    t.el, this.el = t.el, typeof t.platform == "string" && (this.platform = t.platform), Object.assign(this, new tt()), this._define(), this.eventManager = new et(t.events), this.engine = new Qe(t), t.global && (this.global = t.global), t.parent && (this.parent = t.parent, this.parent.childContainer.push(this), this.isNesting = !0), this.engine.setContainer(this), t.itemLimit && (this.itemLimit = new J(t.itemLimit));
  }
  _define() {
    let t = null, n = null;
    Object.defineProperties(this, {
      col: {
        get: () => t,
        set: (i) => {
          t === i || i <= 0 || !isFinite(i) || (t = i);
        }
      },
      row: {
        get: () => n,
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
      if (this.element._gridContainer_ = this, this.element._isGridContainer_ = !0, this.engine.init(), this.platform === "vue" ? this.contentElement = this.element.querySelector(".grid-container-area") : (this.genGridContainerBox(), this.updateStyle(G.gridContainerArea)), this.attr = Array.from(this.element.attributes), this.classList = Array.from(this.element.classList), this.element && this.element.clientWidth > 0) {
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
    this.platform === "vue" ? n() : C.run(n);
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
    C.run(() => {
      this.element && this.element.clientWidth <= 0 || (typeof t == "function" && t(this.useLayout.data || [], this.useLayout, this.element), this.updateLayout(!0));
    });
  }
  _nestingMount(t = null) {
    t = t || ee.nestingMountPointList;
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
    const t = () => {
      if (!this._mounted)
        return;
      const n = this.element.clientWidth;
      if (n <= 0)
        return;
      let i = this.engine.layoutConfig.genLayoutConfig(n), { useLayoutConfig: o, currentLayout: l, layout: u } = i;
      const s = this.eventManager._callback_("mountPointElementResizing", o, n, this.container);
      if (!(s === null || s === !1)) {
        if (typeof s == "object" && (o = s), this.px && o.px && this.px !== o.px) {
          this.platform, this.eventManager._callback_("useLayoutChange", l, n, this.container);
          const m = this._VueEvents.vueUseLayoutChange;
          typeof m == "function" && m(i);
        }
        this.engine.updateLayout(!0);
      }
    };
    window.addEventListener("resize", t), this.__ownTemp__.observer = new wt(k(t, this.resizeReactionDelay)), this.__ownTemp__.observer.observe(this.element);
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
const vt = {
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
    const e = c, t = te(null), n = te(null), i = new xt({
      platform: "vue",
      layouts: e.config.layouts,
      events: e.events,
      global: e.config.global
    });
    let o = {}, l = !1;
    return Ye("_grid_item_components_", e.components), be(() => {
      i.el = t.value, i.engine.init(), i.vue = e, i.updateStyle({
        width: "100%",
        height: "100%",
        display: "block"
      }, t.value), i.updateStyle({
        position: "relative",
        display: "block",
        margin: "0 auto",
        background: "#5df8eb"
      }, n.value), o = i.engine.layoutConfig.genLayoutConfig(t.value.clientWidth), n.value._isGridContainerArea = !0;
      const u = V(o.currentLayout);
      e.render === null ? Object.assign(e.useLayout, u) : typeof e.render == "function" && e.render(u, o.useLayoutConfig, e.config.layouts), i.mount(), e.containerAPI.getContainer = () => i, e.containerAPI.exportData = () => i.exportUseLayout().data, e.containerAPI.exportUseLayout = () => i.exportUseLayout(), console.log(i), setTimeout(() => {
        const s = i.exportData();
        e.useLayout.data && e.useLayout.data.length !== s.length && (e.useLayout.data = [], we(() => {
          e.useLayout.data = s, o.layout.data = s, i.updateLayout(!0);
        }));
      }), i._VueEvents.vueUseLayoutChange = (s) => {
        l = !0, e.useLayout.data = [], we(() => {
          o = s;
          const m = V(s.currentLayout);
          for (let d in e.useLayout)
            delete e.useLayout[d];
          e.layoutChange === null ? Object.assign(e.useLayout, s.currentLayout) : typeof e.layoutChange == "function" && (l = !1, e.layoutChange(m, s.useLayoutConfig, i.layouts));
        });
      }, i._VueEvents.vueCrossContainerExchange = (s, m, d) => {
        const g = s.exportConfig();
        s.pos.nextStaticPos && (g.pos.nextStaticPos = s.pos.nextStaticPos, g.pos.x = s.pos.nextStaticPos.x, g.pos.y = s.pos.nextStaticPos.y), g.pos.doItemCrossContainerExchange = (a) => {
          m.exchangeItems.old = m.fromItem, m.exchangeItems.new = a, m.moveItem = a, m.fromItem = a, d(a);
        }, e.useLayout.data.push(g);
      };
    }), z(e.useLayout, () => {
      if (!l) {
        for (let u in e.useLayout) {
          const s = e.useLayout[u], m = typeof s;
          !Array.isArray(s) && ["data", "margin", "size"].includes(u) && console.error(u, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2A\u6570\u7EC4"), m !== "boolean" && ["responsive", "followScroll", "exchange", "slidePage", "autoGrowRow"].includes(u) && console.error(u, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2Aboolean\u503C"), (m !== "number" || isNaN(s) || !isFinite(s)) && [
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
            "ratio",
            "sensitivity",
            "pressTime",
            "scrollWaitTime",
            "scrollSpeedX",
            "scrollSpeedY",
            "resizeReactionDelay"
          ].includes(u) && console.error(u, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2A\u975ENaN\u7684number\u503C"), m !== "string" && ["responseMode", "className"].includes(u) && (u === "responseMode" ? console.error(u, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2Astring\u503C", "\u4E14\u6709\u4E09\u79CD\u5E03\u5C40\u4EA4\u6362\u6A21\u5F0F\uFF0C\u5206\u522B\u662Fdefault,exchange,stream") : console.error(u, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2Astring\u503C")), m !== "object" && ["itemLimit"].includes(u) && (u === "itemLimit" ? console.error(u, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2Aobject\u503C,\u5305\u542B\u53EF\u9009\u952EminW,minH,maxH,maxW\u4F5C\u7528\u4E8E\u6240\u6709Item\u5927\u5C0F\u9650\u5236") : console.error(u, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2Aobject\u503C")), o.layout[u] = ce(s);
        }
        i.updateLayout(!0);
      }
    }, { deep: !0 }), (u, s) => (fe(), Ce("div", {
      ref_key: "gridContainer",
      ref: t
    }, [
      qe("div", {
        ref_key: "gridContainerArea",
        ref: n,
        class: "grid-container-area"
      }, [
        Ee(u.$slots, "default")
      ], 512)
    ], 512));
  }
}, Ie = {
  GridContainer: vt,
  GridItem: $e
}, he = (c) => {
  he.installed || (he.installed = !0, Object.keys(Ie).forEach((e) => c.component(e, Ie[e])));
}, Ct = {
  install: he
};
export {
  vt as GridContainer,
  $e as GridItem,
  Ct as default,
  he as install
};
