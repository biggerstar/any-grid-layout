var ke = Object.defineProperty;
var Pe = (u, e, t) => e in u ? ke(u, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : u[e] = t;
var f = (u, e, t) => (Pe(u, typeof e != "symbol" ? e + "" : e, t), t);
import { getCurrentInstance as He, ref as te, inject as We, useAttrs as Ne, toRaw as fe, onMounted as be, onUnmounted as Fe, openBlock as me, createElementBlock as Ce, unref as ae, createBlock as De, renderSlot as Ee, watch as R, defineAsyncComponent as Be, provide as Xe, nextTick as K, createElementVNode as Ye } from "vue";
function W(u, e = 350) {
  let t, n, i = 0;
  return function() {
    t = this, n = arguments;
    let s = new Date().valueOf();
    s - i > e && (u.apply(t, n), i = s);
  };
}
function qe(u) {
  return u.replace(/[A-Z]/g, function(e) {
    return "-" + e.toLowerCase();
  });
}
const Y = (u = {}, e = {}, t = !1, n = []) => {
  const i = {};
  return Object.keys(e).forEach((s) => {
    Object.keys(u).includes(s) && !n.includes(s) && (t ? i[s] = e[s] !== void 0 ? e[s] : u[s] : u[s] = e[s] !== void 0 ? e[s] : u[s]);
  }), t ? i : u;
}, $ = (u) => {
  let e = Array.isArray(u) ? [] : {};
  if (u && typeof u == "object")
    for (let t in u)
      u.hasOwnProperty(t) && (u[t] && typeof u[t] == "object" ? e[t] = $(u[t]) : e[t] = u[t]);
  return e;
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
  else
    for (let i = 0; i < u.path.length && !(u.path[i]._isGridContainer_ && (t = u.path[i]._gridContainer_, !e)); i++)
      ;
  return t;
}, Ge = (u, e = !1) => {
  let t = null;
  const n = u.touchTarget ? u.touchTarget : u.target;
  if (n._isGridContainerArea)
    t = n;
  else
    for (let i = 0; i < u.path.length && !(u.path[i]._isGridContainerArea && (t = u.path[i], !e)); i++)
      ;
  return t;
}, j = (u, e = !1) => {
  let t = null;
  const n = u.touchTarget ? u.touchTarget : u.target;
  if (n._isGridItem_)
    t = n._gridItem_;
  else
    for (let i = 0; i < u.path.length && !(u.path[i]._isGridItem_ && (t = u.path[i]._gridItem_, !e)); i++)
      ;
  return t;
}, ue = (u) => {
  let e = "touches";
  if (u.touches && u.touches.length === 0 && (e = "changedTouches"), u[e] && u[e].length) {
    for (let t in u[e][0])
      ["target"].includes(t) || (u[t] = u[e][0][t]);
    u.touchTarget = document.elementFromPoint(u.clientX, u.clientY);
  }
  return u;
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
  setup(u) {
    const e = u;
    He();
    const t = te();
    let n = null;
    const i = () => {
      R(() => e.pos, () => {
        !n || Object.keys(e.pos).forEach((c) => {
          const g = e.pos[c];
          if (!!g && (typeof g == "number" || !isNaN(g))) {
            if (n.pos[c] === g)
              return;
            ["minW", "maxW", "minH", "maxH"].includes(c) && (n.pos[c] = g), ["w", "h"].includes(c) && (n.pos[c] = g), ["x", "y"].includes(c) && (n.container.responsive || (n.pos[c] = g));
          }
        });
      }, { deep: !0 }), R(() => e.transition, (c) => {
        (typeof c == "boolean" || typeof c == "object" || typeof c == "number") && (n.transition = c);
      }, { deep: !0 }), R(() => e.name, (c) => {
        typeof c == "string" && (n.name = c);
      }), R(() => e.type, (c) => {
        typeof c == "string" && (n.type = c);
      }), R(() => e.static, (c) => {
        typeof c == "boolean" && (n.static = c);
      }), R(() => e.exchange, (c) => {
        typeof c == "boolean" && (n.exchange = c);
      }), R(() => e.draggable, (c) => {
        typeof c == "boolean" && (n.draggable = c);
      }), R(() => e.resize, (c) => {
        typeof c == "boolean" && (n.resize = c);
      }), R(() => e.close, (c) => {
        typeof c == "boolean" && (n.close = c);
      }), R(() => e.follow, (c) => {
        typeof c == "boolean" && (n.follow = c);
      }), R(() => e.dragOut, (c) => {
        typeof c == "boolean" && (n.dragOut = c);
      }), R(() => e.dragIgnoreEls, (c) => {
        Array.isArray(c) && (n.dragIgnoreEls = c);
      }), R(() => e.dragAllowEls, (c) => {
        Array.isArray(c) && (n.dragAllowEls = c);
      });
    };
    let s, o = null, r = {}, a = te(!1);
    const m = We("_grid_item_components_"), h = () => {
      const c = m[e.type];
      c ? typeof c != "function" && console.error("components\u4E2D\u7684", e.type, '\u5E94\u8BE5\u662F\u4E00\u4E2A\u51FD\u6570,\u5E76\u4F7F\u7528import("XXX")\u5F02\u6B65\u5BFC\u5165') : console.error("\u672A\u5728components\u4E2D\u5B9A\u4E49", e.type, "\u7EC4\u4EF6"), s = Be(c);
    };
    e.type && Object.keys(m).length > 0 && (r = {
      ...Ne(),
      ...fe(e)
    }, h(), a.value = !0);
    const d = () => {
      if (!o)
        return;
      const c = o.col, g = o.row, y = o.engine.autoSetColAndRows(o);
      (c !== y.col || g !== y.row) && o.updateContainerStyleSize();
    };
    return be(() => {
      const c = fe(e);
      o = Le(t.value), o.__ownTemp__, e.pos.autoOnce = !e.pos.x || !e.pos.y;
      const g = e.pos.doItemCrossContainerExchange;
      if (delete e.pos.doItemCrossContainerExchange, n = o.add({
        el: t.value,
        ...c
      }), !n) {
        t.value.parentNode.removeChild(t.value);
        return;
      }
      n.mount(), e.itemAPI.getItem = () => n, e.itemAPI.exportConfig = () => n.exportConfig(), typeof g == "function" && g(n), n._VueEvents.vueItemResizing = (y, w, _) => {
        e.pos.w && e.pos.w !== w && (e.pos.w = w), e.pos.h && e.pos.h !== _ && (e.pos.h = _);
      }, n._VueEvents.vueItemMovePositionChange = (y, w, _, M) => {
        e.pos.x && e.pos.x !== _ && (e.pos.x = _), e.pos.y && e.pos.y !== M && (e.pos.y = M);
      }, d(), i();
    }), Fe(() => {
      n && n.remove(), d();
    }), (c, g) => (me(), Ce("div", {
      class: "grid-item",
      ref_key: "gridItem",
      ref: t,
      style: { display: "block", position: "absolute", overflow: "hidden" }
    }, [
      ae(a) ? (me(), De(ae(s), {
        key: 0,
        attrs: ae(r)
      }, null, 8, ["attrs"])) : Ee(c.$slots, "default", { key: 1 })
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
    let n = 0, i = typeof e.timeout == "number" ? e.timeout : T.timeout, s = typeof e.intervalTime == "number" ? e.intervalTime : T.intervalTime, o = () => {
      let m;
      if (typeof e == "function")
        m = e.call(e, ...t);
      else if (typeof e == "object") {
        if (!e.func)
          throw new Error("func\u51FD\u6570\u5FC5\u987B\u4F20\u5165");
        m = e.func.call(e.func, ...t) || void 0;
      }
      e.callback && e.callback(m);
    }, r = () => e.rule ? e.rule() : T.ready;
    if (r())
      return o(), !0;
    let a = setInterval(() => {
      typeof e.max == "number" && e.max < n && (clearInterval(a), a = null), i < n * s && (clearInterval(a), a = null), r() && (clearInterval(a), a = null, o()), n++;
    }, s);
  }
};
let z = T;
f(z, "ready", !1), f(z, "ins", !1), f(z, "timeout", 12e3), f(z, "intervalTime", 50);
class V {
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
    return Y(this, this._typeCheck(e)), this;
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
const X = {
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
f(F, "ins", !1), f(F, "store", {
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
}), f(F, "ItemStore", {});
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
    document.addEventListener("mousedown", E.container.touchstartOrMousedown), document.addEventListener("touchstart", E.container.touchstartOrMousedown, { passive: !1 }), document.addEventListener("mousemove", E.container.touchmoveOrMousemove), document.addEventListener("touchmove", E.container.touchmoveOrMousemove, { passive: !1 }), document.addEventListener("mouseup", E.container.touchendOrMouseup), document.addEventListener("touchend", E.container.touchendOrMouseup, { passive: !1 }), document.addEventListener("mouseleave", p.windowResize.setResizeFlag), document.addEventListener("mouseenter", p.windowResize.removeResizeFlag);
  }
  static removeGlobalEvent() {
    document.removeEventListener("mousedown", E.container.touchstartOrMousedown), document.removeEventListener("touchstart", E.container.touchstartOrMousedown), document.removeEventListener("mousemove", E.container.touchmoveOrMousemove), document.removeEventListener("touchmove", E.container.touchmoveOrMousemove), document.removeEventListener("mouseup", E.container.touchendOrMouseup), document.removeEventListener("touchend", E.container.touchendOrMouseup), document.removeEventListener("mouseleave", p.windowResize.setResizeFlag), document.removeEventListener("mouseenter", p.windowResize.removeResizeFlag);
  }
  static startEvent(e = null, t = null) {
    l.editItemNum === 0 && se.startGlobalEvent();
  }
  static removeEvent(e = null, t = null) {
    t && !t.draggable && t.resize, l.editItemNum === 0 && se.removeGlobalEvent();
  }
};
let D = se;
f(D, "_eventEntrustFunctor", {
  itemResize: {
    doResize: W((e) => {
      const t = l.mousedownEvent, n = l.isLeftMousedown, i = l.fromItem;
      if (i === null || t === null || !n)
        return;
      const s = i.container;
      l.cloneElement === null && (l.cloneElement = i.element.cloneNode(!0), l.cloneElement.classList.add("grid-clone-el", "grid-resizing-clone-el"), l.cloneElement && l.fromContainer.contentElement.appendChild(l.cloneElement), i.updateStyle({ transition: "none" }, l.cloneElement), i.addClass("grid-resizing-source-el"));
      const o = i.container.contentElement.getBoundingClientRect();
      let r = e.pageX - o.left - window.scrollX - i.offsetLeft(), a = e.pageY - o.top - window.scrollY - i.offsetTop();
      const m = {
        w: Math.ceil(r / (i.size[0] + i.margin[0])),
        h: Math.ceil(a / (i.size[1] + i.margin[1]))
      };
      m.w < 1 && (m.w = 1), m.h < 1 && (m.h = 1);
      const h = ({ w: y, h: w }) => {
        const _ = i.pos;
        return y + _.x > s.col && (y = s.col - _.x + 1), y < _.minW && (y = _.minW), y > _.maxW && _.maxW !== 1 / 0 && (y = _.maxW), i.container.autoGrowRow || w + _.y > s.row && (w = s.row - _.y + 1), w < _.minH && (w = _.minH), w > _.maxH && _.maxH !== 1 / 0 && (w = _.maxH), {
          w: y,
          h: w
        };
      }, d = () => (r > i.maxWidth() && (r = i.maxWidth()), a > i.maxHeight() && (a = i.maxHeight()), r < i.minWidth() && (r = i.minWidth()), a < i.minHeight() && (a = i.minHeight()), {
        width: r,
        height: a
      }), c = h(m);
      (() => {
        const y = d(), w = i.container.engine.findStaticBlankMaxMatrixFromItem(i), _ = {};
        c.w > w.minW && c.h > w.minH || (w.maxW >= c.w ? (_.width = y.width + "px", i.pos.w = c.w) : c.w = i.pos.w, w.maxH >= c.h ? (_.height = y.height + "px", i.pos.h = c.h) : c.h = i.pos.h, Object.keys(_).length > 0 && i.updateStyle(_, l.cloneElement));
      })(), i.__temp__.resized || (i.__temp__.resized = { w: 1, h: 1 }), (i.__temp__.resized.w !== m.w || i.__temp__.resized.h !== m.h) && (i.__temp__.resized = c, typeof i._VueEvents.vueItemResizing == "function" && i._VueEvents.vueItemResizing(i, c.w, c.h), i.container.eventManager._callback_("itemResizing", c.w, c.h, i), l.fromContainer.updateLayout([i]), i.updateStyle(i._genLimitSizeStyle()), i.container.updateContainerStyleSize());
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
      let n = l.fromItem, i = l.moveItem, s = l.moveItem !== null ? i : n;
      if (this.mouseleave(null, e), s.container === t) {
        l.fromContainer = t;
        return;
      }
      t.isNesting && (t.parentItem === s || t.parentItem.element === s.element) || (t.__ownTemp__.nestingEnterBlankUnLock = !0, this.mouseenter(null, t));
    },
    mouseenter: function(e, t = null) {
      !t && e.target._isGridContainer_ && (e.preventDefault(), t = e.target._gridContainer_);
      let n = l.fromItem;
      const i = l.moveItem;
      let s = l.moveItem !== null ? i : n;
      s && s.container === t || (l.isLeftMousedown && z.run({
        func: () => {
          t.eventManager._callback_("enterContainerArea", t, l.exchangeItems.new), l.exchangeItems.new = null, l.exchangeItems.old = null;
        },
        rule: () => l.exchangeItems.new,
        intervalTime: 2,
        timeout: 200
      }), t.__ownTemp__.firstEnterUnLock = !0, l.moveContainer = t);
    },
    mouseleave: function(e, t = null) {
      let n = l.fromItem, i = l.moveItem, s = l.moveItem !== null ? i : n;
      t.__ownTemp__.firstEnterUnLock = !1, t.__ownTemp__.nestingEnterBlankUnLock = !1, l.isLeftMousedown && t.eventManager._callback_("leaveContainerArea", t, s);
    }
  },
  itemDrag: {
    mousemoveExchange: (e, t = null) => {
      let n = l.fromItem;
      const i = l.moveItem;
      if (!l.isDragging || n === null || !e || !l.isLeftMousedown)
        return;
      let s = l.moveItem !== null ? i : n;
      if (!(!e.exchange || !n.container.exchange || !s.container.exchange || !s.exchange))
        try {
          s.pos.el = null;
          let o = n.element;
          const r = new ne({
            pos: s.pos,
            size: e.size,
            margin: e.margin,
            el: o,
            name: s.name,
            type: s.type,
            draggable: s.draggable,
            resize: s.resize,
            close: s.close,
            transition: s.transition,
            static: s.static,
            follow: s.follow,
            dragOut: s.dragOut,
            className: s.className,
            dragIgnoreEls: s.dragIgnoreEls,
            dragAllowEls: s.dragAllowEls
          }), a = n.container.eventManager._callback_("crossContainerExchange", s, r);
          if (a === !1 || a === null)
            return;
          const m = (c) => {
            typeof t == "function" && t(c);
          }, h = () => {
            e._VueEvents.vueCrossContainerExchange(r, l, (c) => {
              s.unmount(), s.remove(), m(c), e && (s !== c && !s.container.responsive ? s.container.engine.updateLayout([s]) : s.container.engine.updateLayout(!0));
            });
          }, d = () => {
            e.responsive ? r.pos.autoOnce = !0 : e.responsive || (r.pos.autoOnce = !1), e.add(r), s.unmount(), s.remove(), e && (r.container.responsive ? r.container.engine.updateLayout() : r.container.engine.updateLayout([r]), s !== r && !s.container.responsive ? s.container.engine.updateLayout([s]) : s.container.engine.updateLayout()), r.mount(), l.moveItem = r, l.fromItem = r, l.exchangeItems.old = s, l.exchangeItems.new = r, m(r);
          };
          e.__ownTemp__.firstEnterUnLock = !1, e.__ownTemp__.nestingEnterBlankUnLock = !1, e.platform === "vue" ? h() : d();
        } catch (o) {
          console.error("\u8DE8\u5BB9\u5668Item\u79FB\u52A8\u51FA\u9519", o);
        }
    },
    mousemoveFromItemChange: W((e) => {
      if (e.stopPropagation(), !l.isDragging)
        return;
      let t = l.fromItem, n = j(e);
      n && (l.toItem = n);
      const i = l.moveItem, s = l.mousedownEvent;
      if (t === null || s === null || !l.isLeftMousedown)
        return;
      let o = l.moveItem !== null ? i : t, r = o.container;
      if (o === n)
        return;
      let a = null;
      if (o.exchange && (a = H(e), a && (r = a), o.container !== a && r.parentItem && r.parentItem === o))
        return;
      const m = l.mousedownItemOffsetLeft * (r.size[0] / l.fromContainer.size[0]), h = l.mousedownItemOffsetTop * (r.size[1] / l.fromContainer.size[1]), d = r.contentElement.getBoundingClientRect(), c = e.pageX - m - (window.scrollX + d.left), g = e.pageY - h - (window.scrollY + d.top);
      if (o.container.followScroll) {
        const v = r.contentElement.parentElement.getBoundingClientRect(), N = r.scrollSpeedX ? r.scrollSpeedX : Math.round(v.width / 20), C = r.scrollSpeedY ? r.scrollSpeedY : Math.round(v.height / 20), x = (k, S) => {
          const O = o.container.eventManager._callback_("autoScroll", k, S, o.container);
          if (O === !1 || O === null)
            return;
          typeof O == "object" && (typeof O.offset == "number" && (S = O.offset), ["X", "Y"].includes(O.direction) && (k = O.direction));
          const P = r ? r.scrollWaitTime : 800;
          l.scrollReactionStatic === "stop" && (l.scrollReactionStatic = "wait", l.scrollReactionTimer = setTimeout(() => {
            l.scrollReactionStatic = "scroll", clearTimeout(l.scrollReactionTimer);
          }, P)), k === "X" && l.scrollReactionStatic === "scroll" && (r.contentElement.parentElement.scrollLeft += S), k === "Y" && l.scrollReactionStatic === "scroll" && (r.contentElement.parentElement.scrollTop += S);
        };
        let L = !1, A = !1;
        e.pageX - window.scrollX - v.left < v.width * 0.25 ? x("X", -N) : e.pageX - window.scrollX - v.left > v.width * 0.75 ? x("X", N) : L = !0, e.pageY - window.scrollY - v.top < v.height * 0.25 ? x("Y", -C) : e.pageY - window.scrollY - v.top > v.height * 0.75 ? x("Y", C) : A = !0, L && A && (l.scrollReactionStatic = "stop", clearTimeout(l.scrollReactionTimer));
      }
      const y = (b) => {
        const v = b / (r.size[0] + r.margin[0]);
        return v + o.pos.w >= r.containerW ? r.containerW - o.pos.w + 1 : Math.round(v) + 1;
      }, w = (b) => {
        const v = b / (r.size[1] + r.margin[1]);
        return v + o.pos.h >= r.containerH ? r.containerH - o.pos.h + 1 : Math.round(v) + 1;
      };
      let _ = y(c), M = w(g);
      _ < 1 && (_ = 1), M < 1 && (M = 1), o.container.eventManager._callback_("itemMoving", _, M, o);
      const J = () => {
        let b, v, N = Date.now();
        v = e.screenX, b = e.screenY;
        const C = () => {
          let I = N - l.mouseSpeed.timestamp, U = Math.abs(v - l.mouseSpeed.endX), Q = Math.abs(b - l.mouseSpeed.endY), we = U > Q ? U : Q, Ae = Math.round(we / I * 1e3);
          return l.mouseSpeed.endX = v, l.mouseSpeed.endY = b, l.mouseSpeed.timestamp = N, { distance: we, speed: Ae };
        };
        if (!r.__ownTemp__.firstEnterUnLock) {
          const { distance: I, speed: U } = C();
          if (l.deviceEventMode === "mouse" && n && n.pos.w > 2 && n.pos.h > 2) {
            if (r.size[0] < 30 || r.size[1] < 30) {
              if (I < 3)
                return;
            } else if (r.size[0] < 60 || r.size[1] < 60) {
              if (I < 7)
                return;
            } else if (I < 10 || U < 10)
              return;
            if (o === null)
              return;
          }
        }
        const x = {
          x: _ < 1 ? 1 : _,
          y: M < 1 ? 1 : M,
          w: o.pos.w,
          h: o.pos.h
        };
        let L = !1;
        const A = () => {
          if (!o.follow)
            return;
          const I = r.engine.findCoverItemFromPosition(x.x, x.y, x.w, x.h);
          I.length > 0 ? n = I.filter((Q) => o !== Q)[0] : L = !0;
        }, k = () => {
          const I = r.engine.findResponsiveItemFromPosition(x.x, x.y, x.w, x.h);
          !I || (n = I);
        };
        if (r.__ownTemp__.firstEnterUnLock ? A() : o.follow ? n ? A() : k() : A(), L && n && n.nested && (n = null), r.__ownTemp__.firstEnterUnLock) {
          if (!L && !n)
            return;
          if (o.pos.nextStaticPos = new V(o.pos), o.pos.nextStaticPos.x = x.x, o.pos.nextStaticPos.y = x.y, o.pos.autoOnce = !0, n) {
            if (l.fromItem.container.parentItem === n || o.container === n.container)
              return;
            p.itemDrag.mousemoveExchange(r, (I) => {
              r.engine.move(I, n.i);
            });
          } else
            p.itemDrag.mousemoveExchange(r);
          l.dragContainer = r;
          return;
        }
        if (!n)
          return;
        const S = o.element.getBoundingClientRect(), O = Math.abs(e.pageX - S.left - l.mousedownItemOffsetLeft) / n.element.clientWidth, P = Math.abs(e.pageY - S.top - l.mousedownItemOffsetTop) / n.element.clientHeight, G = O > P;
        if (Math.abs(O - P) < r.sensitivity || r.__ownTemp__.exchangeLock === !0)
          return;
        const pe = 3, Z = r.__ownTemp__.beforeOverItems;
        let _e = 0;
        for (let I = 0; I < Z.length && !(I >= 3); I++)
          Z[I] === n && _e++;
        if (_e >= pe) {
          r.__ownTemp__.exchangeLock = !0;
          let I = setTimeout(() => {
            r.__ownTemp__.exchangeLock = !1, clearTimeout(I), I = null;
          }, 200);
        } else if (Z.length < pe && n.draggable && n.transition && n.transition.time) {
          r.__ownTemp__.exchangeLock = !0;
          let I = setTimeout(() => {
            r.__ownTemp__.exchangeLock = !1, clearTimeout(I), I = null;
          }, n.transition.time);
        }
        if (o !== n)
          r.__ownTemp__.beforeOverItems.unshift(n), Z.length > 20 && r.__ownTemp__.beforeOverItems.pop();
        else
          return !1;
        const ye = o.container.eventManager._callback_("itemExchange", t, n);
        ye === !1 || ye === null || (r.responseMode === "default" ? G ? (r.engine.sortResponsiveItem(), r.engine.move(o, n.i)) : r.engine.exchange(o, n) : r.responseMode === "stream" ? (r.engine.sortResponsiveItem(), r.engine.move(o, n.i)) : r.responseMode === "exchange" && r.engine.exchange(o, n), r.engine.updateLayout(!0));
      }, le = () => {
        if (!o.follow && !H(e))
          return;
        o.pos.nextStaticPos = new V(o.pos), o.pos.nextStaticPos.x = _ < 1 ? 1 : _, o.pos.nextStaticPos.y = M < 1 ? 1 : M;
        let b = r.engine.findCoverItemFromPosition(
          o.pos.nextStaticPos.x,
          o.pos.nextStaticPos.y,
          o.pos.w,
          o.pos.h
        );
        b.length > 0 && (b = b.filter((v) => o !== v)), b.length === 0 ? (r.__ownTemp__.firstEnterUnLock ? (p.itemDrag.mousemoveExchange(r), l.dragContainer = r) : (o.pos.x !== o.pos.nextStaticPos.x || o.pos.y !== o.pos.nextStaticPos.y) && (o.pos.x = o.pos.nextStaticPos.x, o.pos.y = o.pos.nextStaticPos.y, o.pos.nextStaticPos = null, r.engine.updateLayout([o])), a && p.cursor.cursor !== "mousedown" && p.cursor.mousedown(e)) : o.pos.nextStaticPos = null;
      };
      z.run(() => {
        const b = Object.assign({}, o.pos);
        if (r.responsive ? J() : le(), b.x !== o.pos.x || b.y !== o.pos.y) {
          const v = o._VueEvents.vueItemMovePositionChange;
          typeof v == "function" && v(b.x, b.y, o.pos.x, o.pos.y), o.container.eventManager._callback_("itemMovePositionChange", b.x, b.y, o.pos.x, o.pos.y);
        }
      });
    }, 36),
    mousemoveFromClone: (e) => {
      const t = l.mousedownEvent, n = l.fromItem, i = l.moveItem;
      if (t === null || n === null)
        return;
      let s = l.moveItem !== null ? i : n;
      const o = H(e);
      s.__temp__.dragging = !0, l.cloneElement === null ? (l.cloneElement = s.element.cloneNode(!0), l.cloneElement.classList.add("grid-clone-el", "grid-dragging-clone-el"), document.body.appendChild(l.cloneElement), s.addClass("grid-dragging-source-el"), s.updateStyle({
        pointerEvents: "none",
        transitionProperty: "none",
        transitionDuration: "none"
      }, l.cloneElement)) : o && o.__ownTemp__.firstEnterUnLock && z.run({
        func: () => {
          const m = l.fromItem, h = "grid-dragging-source-el";
          m.hasClass(h) || m.addClass(h);
        },
        rule: () => {
          var m;
          return o === ((m = l.fromItem) == null ? void 0 : m.container);
        },
        intervalTime: 2,
        timeout: 200
      });
      let r = e.pageX - l.mousedownItemOffsetLeft, a = e.pageY - l.mousedownItemOffsetTop;
      if (!s.dragOut) {
        const m = o.contentElement.getBoundingClientRect(), h = window.scrollX + m.left, d = window.scrollY + m.top, c = window.scrollX + m.left + o.contentElement.clientWidth - s.nowWidth(), g = window.scrollY + m.top + o.contentElement.clientHeight - s.nowHeight();
        r < h && (r = h), r > c && (r = c), a < d && (a = d), a > g && (a = g);
      }
      s.updateStyle({
        left: r + "px",
        top: a + "px"
      }, l.cloneElement);
    }
  }
}), f(D, "_eventPerformer", {
  item: {
    mouseenter: (e) => {
      if (e.stopPropagation(), !!H(e) && (e.target._gridItem_ && (l.toItem = j(e)), l.toItem === null))
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
      let i = e.pageX - l.mousedownEvent.pageX, s = e.pageY - l.mousedownEvent.pageY;
      const o = l.slidePageOffsetInfo.offsetLeft - i, r = l.slidePageOffsetInfo.offsetTop - s;
      o >= 0 && (n.scrollLeft = o), r >= 0 && (n.scrollTop = r), E.other.updateSlidePageInfo(e.pageX, e.pageY);
    }
  },
  container: {
    mousedown: (e) => {
      if (l.isDragging || l.isResizing)
        return;
      const t = H(e);
      if (!t || (l.fromItem = j(e), !t && !l.fromItem))
        return;
      l.fromItem && !l.fromItem.static ? p.cursor.mousedown() : t && !l.fromItem && !e.touches && (p.cursor.mousedown(), l.slidePageOffsetInfo = {
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
          if (l.fromItem.static)
            return;
          const i = l.fromItem;
          if ((i.dragIgnoreEls || []).length > 0) {
            let o = !0;
            for (let r = 0; r < i.dragIgnoreEls.length; r++) {
              const a = i.dragIgnoreEls[r];
              if (a instanceof Element)
                e.target === a && (o = !1);
              else if (typeof a == "string") {
                const m = i.element.querySelectorAll(a);
                Array.from(m).forEach((h) => {
                  e.path.includes(h) && (o = !1);
                });
              }
              if (o === !1)
                return;
            }
          }
          if ((i.dragAllowEls || []).length > 0) {
            let o = !1;
            for (let r = 0; r < i.dragAllowEls.length; r++) {
              const a = i.dragAllowEls[r];
              if (a instanceof Element) {
                if (e.target === a) {
                  o = !0;
                  break;
                }
              } else if (typeof a == "string") {
                const m = i.element.querySelectorAll(a);
                Array.from(m).forEach((h) => {
                  e.path.includes(h) && (o = !0);
                });
              }
            }
            if (o === !1)
              return;
          }
          if (l.dragOrResize = "drag", l.fromItem.__temp__.dragging)
            return;
          const s = l.fromItem.element.getBoundingClientRect();
          l.mousedownItemOffsetLeft = e.pageX - (s.left + window.scrollX), l.mousedownItemOffsetTop = e.pageY - (s.top + window.scrollY);
        }
        l.isLeftMousedown = !0, l.mousedownEvent = e, l.fromContainer = t, p.check.resizeOrDrag(e), l.fromItem && (l.fromItem.__temp__.clientWidth = l.fromItem.nowWidth(), l.fromItem.__temp__.clientHeight = l.fromItem.nowHeight(), l.offsetPageX = l.fromItem.offsetLeft(), l.offsetPageY = l.fromItem.offsetTop());
      }
    },
    mousemove: W((e) => {
      const t = Ge(e), n = Le(t), i = j(e);
      if (l.isLeftMousedown) {
        if (l.beforeContainerArea = l.currentContainerArea, l.currentContainerArea = t || null, l.beforeContainer = l.currentContainer, l.currentContainer = n || null, l.currentContainerArea !== null && l.beforeContainerArea !== null ? l.currentContainerArea !== l.beforeContainerArea && p.moveOuterContainer.leaveToEnter(l.beforeContainer, l.currentContainer) : (l.currentContainerArea !== null || l.beforeContainerArea !== null) && (l.beforeContainerArea === null && p.moveOuterContainer.mouseenter(null, l.currentContainer), l.currentContainerArea === null && p.moveOuterContainer.mouseleave(null, l.beforeContainer)), l.dragOrResize === "slidePage") {
          E.other.slidePage(e);
          return;
        }
        const s = () => {
          l.moveItem || l.fromItem, n ? n && (i ? i.static && p.cursor.cursor !== "drag-to-item-no-drop" && p.cursor.dragToItemNoDrop() : !i && n.responsive && p.cursor.cursor !== "mousedown" && p.cursor.mousedown()) : p.cursor.cursor !== "no-drop" && p.cursor.notDrop();
        };
        l.isDragging ? (p.itemDrag.mousemoveFromClone(e), s()) : l.isResizing && p.itemResize.doResize(e);
      } else if (i) {
        const s = e.target.classList;
        s.contains("grid-item-close-btn") ? p.cursor.cursor !== "item-close" && p.cursor.itemClose() : s.contains("grid-item-resizable-handle") ? p.cursor.cursor !== "item-resize" && p.cursor.itemResize() : i.static && n ? p.cursor.cursor !== "static-no-drop" && p.cursor.staticItemNoDrop() : p.cursor.cursor !== "in-container" && p.cursor.inContainer();
      } else
        H(e) ? p.cursor.cursor !== "in-container" && p.cursor.inContainer() : p.cursor.cursor !== "default" && p.cursor.default();
    }, 12),
    mouseup: (e) => {
      const t = H(e);
      l.isResizing && p.itemResize.mouseup(e), t && p.cursor.cursor !== "in-container" && p.cursor.inContainer();
      const n = l.fromItem, i = l.moveItem ? l.moveItem : l.fromItem;
      if (l.cloneElement !== null) {
        let a = null;
        const m = document.querySelectorAll(".grid-clone-el");
        for (let h = 0; h < m.length; h++) {
          let c = function() {
            i.removeClass("grid-dragging-source-el", "grid-resizing-source-el");
            try {
              d.parentNode.removeChild(d);
            } catch {
            }
            i.__temp__.dragging = !1, n.__temp__.dragging = !1, clearTimeout(a), a = null;
          };
          const d = m[h];
          if (i.transition) {
            const g = i.container.contentElement.getBoundingClientRect();
            if (l.isDragging) {
              let y = window.scrollX + g.left + i.offsetLeft(), w = window.scrollY + g.top + i.offsetTop();
              i.updateStyle({
                transitionProperty: `${i.transition.field}`,
                transitionDuration: `${i.transition.time}ms`,
                width: `${i.nowWidth()}px`,
                height: `${i.nowHeight()}px`,
                left: `${y}px`,
                top: `${w}px`
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
          i.transition ? a = setTimeout(c, i.transition.time) : c();
        }
      }
      const s = document.querySelectorAll(".grid-item-mask");
      for (let a = 0; a < s.length; a++) {
        const m = s[a];
        m.parentElement.removeChild(m);
      }
      const o = l.mouseDownElClassName;
      if (o && o.includes("grid-item-close-btn") && (e.touchTarget ? e.touchTarget : e.target).classList.contains("grid-item-close-btn")) {
        const m = j(e);
        m === l.fromItem && m.remove(!0);
      }
      const r = l.moveContainer ? l.moveContainer : l.fromContainer;
      if (r && (r.__ownTemp__.firstEnterUnLock = !1, r.__ownTemp__.exchangeLock = !1, r.__ownTemp__.beforeOverItems = [], r.__ownTemp__.moveCount = 0, l.fromContainer && r !== l.fromContainer && (l.fromContainer.__ownTemp__.firstEnterUnLock = !1)), n && (n.container.engine.updateLayout(!0), n.container.childContainer.forEach((h) => {
        h.nestingItem === n && h.container.engine.updateLayout(!0);
      })), n && i.container !== n.container && (i == null || i.container.engine.updateLayout(!0)), i && (l.isDragging && i.container.eventManager._callback_("itemMoved", i.pos.x, i.pos.y, i), l.isResizing && i.container.eventManager._callback_("itemResized", i.pos.w, i.pos.h, i)), l.isLeftMousedown && l.dragOrResize === "slidePage") {
        const a = l.slidePageOffsetInfo, m = a.newestPageX - e.pageX, h = a.newestPageY - e.pageY;
        let d = 500;
        const c = l.fromContainer;
        if (c.slidePage && (h >= 20 || m >= 20)) {
          let g = setInterval(() => {
            d -= 20, c.element.scrollTop += parseInt((h / 100 * d / 30 || 0).toString()), c.element.scrollLeft += parseInt((m / 100 * d / 30 || 0).toString()), (d <= 0 || l.isLeftMousedown) && (clearInterval(g), g = null);
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
        document.addEventListener("contextmenu", p.prevent.contextmenu);
        const n = t ? t.pressTime : 360;
        l.timeOutEvent = setTimeout(() => {
          l.allowTouchMoveItem = !0, E.container.mousemove(e);
          let i = setTimeout(() => {
            document.removeEventListener("contextmenu", p.prevent.contextmenu), clearTimeout(i), i = null;
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
      e.stopPropagation && e.stopPropagation(), p.itemDrag.mousemoveFromItemChange(e), E.container.mousemove(e);
    },
    touchendOrMouseup: (e) => {
      e = e || window.event, e.touches ? (clearTimeout(l.timeOutEvent), l.allowTouchMoveItem = !1, l.deviceEventMode = "touch", e = ue(e), document.removeEventListener("contextmenu", p.prevent.contextmenu)) : l.deviceEventMode = "mouse", E.container.mouseup(e);
    }
  }
});
const p = D._eventEntrustFunctor, E = D._eventPerformer;
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
    Object.keys(e).forEach((s) => {
      n ? i = `${i} ${qe(s)}:${e[s]}; ` : t.style[s] = e[s];
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
        var i, s;
        const n = document.createAttribute(t);
        n.value = e[t], (s = (i = this == null ? void 0 : this.element) == null ? void 0 : i.attributes) == null || s.setNamedItem(n);
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
      let s = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
      this.observer = new s(W(e, t));
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
          let i = getComputedStyle(this.element).getPropertyValue("width"), s = getComputedStyle(this.element).getPropertyValue("height");
          typeof e == "function" && e.call(e, {
            width: parseInt(i),
            height: parseInt(s)
          });
        }
      });
    }, 500);
  }
  onEvent(e, t, n = null, i = 350) {
    const s = n || this.element;
    e.includes("on") || (e = "on" + e), s[e] || (s[e] = W(t, i));
  }
  addEvent(e, t, n = null, i = {}) {
    let s = 350, o = !1;
    i.throttleTime && (s = i.throttleTime), i.capture && (o = i.capture);
    const r = n || this.element, a = W(t, s);
    return r.addEventListener(e, a, o), a;
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
    f(this, "exchange", !0);
    f(this, "margin", [null, null]);
    f(this, "size", [null, null]);
    f(this, "i", null);
    f(this, "element", null);
    f(this, "container", null);
    f(this, "tagName", "div");
    f(this, "classList", []);
    f(this, "attr", []);
    f(this, "pos", {});
    f(this, "edit", null);
    f(this, "nested", !1);
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
      resizeLock: !1,
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
      i = t.pos.export(), this.responsive && (delete i.x, delete i.y), n.pos = i, Array.from(["static", "draggable", "resize", "close"]).forEach((o) => {
        t[o] !== !1 && (n[o] = t[o]);
      }), Array.from(["follow", "dragOut", "exchange"]).forEach((o) => {
        t[o] !== !0 && (n[o] = t[o]);
      }), typeof t.name == "string" && (n.name = t.name), typeof t.type == "string" && (n.type = t.type);
      let s = {};
      return t.transition.field !== "top,left,width,height" ? (s.field = t.transition.field, t.transition.time !== 180 && (s.time = t.transition.time), n.transition = s) : t.transition.time !== 180 && (n.transition = t.transition.time), n;
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
    t.el instanceof Element && (this.el = t.el, this.element = t.el), this._define(), Y(this, t), this.pos = new V(t.pos), this._itemSizeLimitCheck();
  }
  _define() {
    const t = this;
    let n = !1, i = !1, s = !1, o = !1, r = {
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
            n = a, t.edit = n || i || s;
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
            i = a, t._handleResize(a), t.edit = n || i || s;
          }
        }
      },
      close: {
        configurable: !1,
        get: () => s,
        set(a) {
          if (typeof a == "boolean") {
            if (s === a)
              return;
            s = a, t._closeBtn(a), t.edit = n || i || s;
          }
        }
      },
      edit: {
        configurable: !1,
        get: () => o,
        set(a) {
          if (typeof a == "boolean") {
            if (o === a)
              return;
            o = a, t._edit(o);
          }
        }
      },
      transition: {
        configurable: !1,
        get: () => r,
        set(a) {
          a === !1 && (r.time = 0), typeof a == "number" && (r.time = a), typeof a == "object" && (a.time && a.time !== r.time && (r.time = a.time), a.field && a.field !== r.field && (r.field = a.field)), t.animation(r);
        }
      }
    });
  }
  mount() {
    const t = () => {
      this._mounted || (this.container.platform !== "vue" && (this.element === null && (this.element = document.createElement(this.tagName)), this.container.contentElement.appendChild(this.element)), this.attr = Array.from(this.element.attributes), this.element.classList.add(this.className), this.classList = Array.from(this.element.classList), this.updateStyle(X.gridItem), this.updateStyle(this._genItemStyle()), this.__temp__.w = this.pos.w, this.__temp__.h = this.pos.h, this.element._gridItem_ = this, this.element._isGridItem_ = !0, this._mounted = !0, this.container.eventManager._callback_("itemMounted", this));
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
        const o = document.createElement("span");
        o.innerHTML = "\u22BF", this.updateStyle(X.gridResizableHandle, o), this.element.appendChild(o), o.classList.add(i), this._resizeTabEl = o;
      } else if (this.element && t === !1)
        for (let s = 0; s < this.element.children.length; s++) {
          const o = this.element.children[s];
          o.className.includes(i) && (this.element.removeChild(o), this._resizeTabEl = null);
        }
    };
    this.element ? n() : z.run(n);
  }
  _closeBtn(t = !1) {
    const n = () => {
      const i = "grid-item-close-btn";
      if (t && this._closeEl === null) {
        const s = document.createElement("div");
        this.updateStyle(X.gridItemCloseBtn, s), this._closeEl = s, s.classList.add(i), this.element.appendChild(s), s.innerHTML = X.gridItemCloseBtn.innerHTML;
      }
      if (this._closeEl !== null && !t)
        for (let s = 0; s < this.element.children.length; s++) {
          const o = this.element.children[s];
          o.className.includes(i) && (this.element.removeChild(o), this._closeEl = null);
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
    const { xStart: t, yStart: n, xEnd: i, yEnd: s } = this.itemPosToItemLayout(e);
    let o = !0;
    const r = this.toINameHash(e.i), a = e.x + e.w - 1, m = e.y + e.h - 1;
    if (a > this.col || m > this.row)
      return !1;
    for (let h = n - 1; h <= s - 1; h++)
      for (let d = t - 1; d <= i - 1; d++) {
        const c = this._layoutMatrix[h][d];
        if (r.toString() !== c && c !== !1) {
          o = !1;
          break;
        }
      }
    return o;
  }
  _findRowBlank(e = [], t, n, i) {
    let s = 0;
    for (let o = n; o <= i; o++)
      if (e[o] !== !1 ? s = 0 : e[o] === !1 && s++, s === t)
        return {
          success: !0,
          xStart: o + 1 - t,
          xEnd: o,
          xWidth: t
        };
    return { success: !1 };
  }
  _findBlankPosition(e, t) {
    let n = 0, i = this.col - 1, s = 0, o = [];
    e > this.col && (console.warn("ITEM:", "w:" + e, "x", "h:" + t, "\u7684\u5BBD\u5EA6", e, "\u8D85\u8FC7\u6805\u683C\u5927\u5C0F\uFF0C\u81EA\u52A8\u8C03\u6574\u8BE5ITEM\u5BBD\u5EA6\u4E3A\u6805\u683C\u6700\u5927\u5BBD\u5EA6", this.col), e = this.col);
    let r = 0;
    for (; r++ < 500; ) {
      this._layoutMatrix.length < t + s && this.isAutoRow && this.addRow(t + s - this._layoutMatrix.length);
      let a = !0, m = !1;
      if (!this.col)
        throw new Error("\u672A\u627E\u5230\u7ECF\u8FC7\u5F15\u64CE\u5904\u7406\u8FC7\u540E\u7684col\uFF0C\u53EF\u80FD\u662F\u5C11\u4F20\u53C2\u6570\u6216\u8005\u4EE3\u7801\u6267\u884C\u987A\u5E8F\u6709\u8BEF\uFF0C\u5018\u82E5\u8FD9\u6837\uFF0C\u4E0D\u7528\u95EE\uFF0C\u8FD9\u5C31\u662Fbug");
      for (let h = 0; h < t; h++) {
        o = this._layoutMatrix[s + h], this.DebuggerTemp.yPointStart = s;
        let d = this._findRowBlank(o, e, n, i);
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
          yStart: s + 1,
          xEnd: i + 1,
          yEnd: s + t - 1 + 1,
          x: n + 1,
          y: s + 1,
          col: this.col,
          row: this.row
        };
      n = 0, i = this.col - 1, s++;
    }
  }
  _updateSeatLayout({ xStart: e, yStart: t, xEnd: n, yEnd: i, iName: s }, o = null) {
    s === void 0 && (s = "true");
    let r = o !== null ? o : s.toString();
    for (let a = t - 1; a <= i - 1; a++)
      for (let m = e - 1; m <= n - 1; m++)
        try {
          this.isDebugger ? this._layoutMatrix[a][m] = "__debugger__" : this._layoutMatrix[a][m] = r;
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
    f(this, "container", null);
    f(this, "useLayoutConfig", {});
    f(this, "option", {});
    f(this, "_defaultLayoutConfig", Ve);
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
    var v, N;
    let t = {}, n = {};
    e = e || ((v = this.container.element) == null ? void 0 : v.clientWidth);
    const i = (N = this.container.element) == null ? void 0 : N.clientHeight, s = this.container.layouts.sort((C, x) => C.px - x.px);
    for (let C = 0; C < s.length && (n = s[C], Array.isArray(n.data) || (n.data = []), s.length !== 1); C++)
      if (!(n.px < e))
        break;
    if (e === 0 && !t.col)
      throw new Error("\u8BF7\u5728layout\u4E2D\u4F20\u5165col\u7684\u503C\u6216\u8005\u4E3AContainer\u8BBE\u7F6E\u4E00\u4E2A\u521D\u59CB\u5BBD\u5EA6");
    t = Object.assign($(this.option.global), $(n));
    let {
      col: o = null,
      row: r = this.container.row,
      ratioCol: a = this.container.ratioCol,
      ratioRow: m = this.container.ratioRow,
      size: h = [null, null],
      margin: d = [null, null],
      padding: c = 0,
      sizeWidth: g,
      sizeHeight: y,
      marginX: w,
      marginY: _,
      marginLimit: M = {}
    } = t;
    const J = (C = "") => {
      const x = t[C];
      Array.isArray(x) && (!["number", "string"].includes(typeof x[0]) || !["number", "string"].includes(typeof x[1])) && console.error(C, "\u6570\u7EC4\u5185\u7684\u53C2\u6570\u503C\u53EA\u80FD\u4E3A\u6570\u5B57\u6216\u8005\u6570\u5B57\u5F62\u5F0F\u7684\u5B57\u7B26\u4E32");
    };
    if (J("margin"), J("size"), !o && !(h[0] || g))
      throw new Error("col\u6216\u8005size[0]\u5FC5\u987B\u8981\u8BBE\u5B9A\u4E00\u4E2A,\u60A8\u4E5F\u53EF\u4EE5\u8BBE\u5B9Acol\u6216sizeWidth\u4E24\u4E2A\u4E2D\u7684\u4E00\u4E2A\u4FBF\u80FD\u8FDB\u884C\u5E03\u5C40");
    if (w && (d[0] = w), _ && (d[1] = _), g && (h[0] = g), y && (h[1] = y), o)
      if (h[0] === null && d[0] === null)
        parseInt(o) === 1 ? (d[0] = 0, h[0] = e / o) : (d[0] = e / (o - 1 + o / a), h[0] = d[0] / a, h[0] = (e - (o - 1) * d[0]) / o);
      else if (h[0] !== null && d[0] === null)
        parseInt(o) === 1 ? d[0] = 0 : d[0] = (e - o * h[0]) / (o - 1), d[0] <= 0 && (d[0] = 0);
      else if (h[0] === null && d[0] !== null) {
        if (parseInt(o) === 1 && (d[0] = 0), h[0] = (e - (o - 1) * d[0]) / o, h[0] <= 0)
          throw new Error("\u5728margin[0]\u6216\u5728marginX\u4E3A" + d[0] + "\u7684\u60C5\u51B5\u4E0B,size[0]\u6216sizeWidth\u7684Item\u4E3B\u4F53\u5BBD\u5EA6\u5DF2\u7ECF\u5C0F\u4E8E0,\u60A8\u53EF\u4EE5\u8C03\u5C0Fmargin\u6216\u8005\u8BBE\u5B9AContainer\u6700\u5C0F\u5BBD\u5EA6\u6216\u8005\u9AD8\u5EA6(css:min-XXX),\u4E14\u4FDD\u8BC1margin*(col||row)\u5927\u4E8E\u6700\u5C0F\u5BBD\u5EA6");
      } else
        h[0] !== null && d[0];
    else
      o === null && (d[0] === null && h[0] !== null ? e <= h[0] ? (d[0] = 0, o = 1) : (o = Math.floor(e / h[0]), d[0] = (e - h[0] * o) / o) : d[0] !== null && h[0] !== null && (e <= h[0] ? (d[0] = 0, o = 1) : o = Math.floor((e + d[0]) / (d[0] + h[0]))));
    t = Object.assign(t, {
      padding: c,
      margin: d,
      size: h,
      col: o
    });
    let le = (C) => {
      let { margin: x, size: L, minCol: A, maxCol: k, col: S, padding: O } = C;
      x[0] = x[0] ? parseFloat(x[0].toFixed(1)) : 0, L[0] = L[0] ? parseFloat(L[0].toFixed(1)) : 0;
      let P = null, G = null;
      return i && !x[1] && !L[1] ? (P = i / (r - 1 + S / m), G = P / m, G = (i - (r - 1) * P) / r, x[1] = parseFloat(P.toFixed(1)), L[1] = parseFloat(G.toFixed(1))) : (x[1] = x[1] ? parseFloat(x[1].toFixed(1)) : parseFloat(x[0].toFixed(1)), L[1] = L[1] ? parseFloat(L[1].toFixed(1)) : parseFloat(L[0].toFixed(1))), S < A && (C.col = A), S > k && (C.col = k), C;
    };
    const b = {};
    for (const C in t)
      (this.option.global[C] !== void 0 || n[C] !== void 0) && (b[C] = t[C]);
    return this.useLayoutConfig = Object.assign(this.useLayoutConfig, le(t)), this.container.layout = n, this.container.useLayout = t, {
      layout: n,
      global: this.option.global,
      useLayoutConfig: t,
      currentLayout: b
    };
  }
}
class Ze {
  constructor(e) {
    f(this, "items", []);
    f(this, "option", {});
    f(this, "layoutManager", null);
    f(this, "container", null);
    f(this, "layoutConfig", null);
    f(this, "useLayoutConfig", null);
    f(this, "initialized", !1);
    f(this, "__temp__", {
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
    this.useLayoutConfig = e, this._syncLayoutConfig(e.useLayoutConfig);
  }
  _syncLayoutConfig(e = null) {
    if (!!e) {
      if (Object.keys(e).length === 0 && !this.option.col)
        throw new Error("\u672A\u627E\u5230layout\u76F8\u5173\u51B3\u5B9A\u5E03\u5C40\u914D\u7F6E\u4FE1\u606F\uFF0C\u60A8\u53EF\u80FD\u662F\u672A\u4F20\u5165col\u5B57\u6BB5");
      Y(this.container, e, !1, ["events"]), this.autoSetColAndRows(this.container), this.items.forEach((t) => {
        Y(t, {
          margin: e.margin,
          size: e.size
        });
      });
    }
  }
  autoSetColAndRows(e, t = !0) {
    let n = e.col, i = e.row, s = n, o = i;
    const r = e.engine.items, a = (c) => {
      let g = 1, y = 1;
      return c.length > 0 && c.forEach((w) => {
        w.pos.x + w.pos.w - 1 > g && (g = w.pos.x + w.pos.w - 1), w.pos.y + w.pos.h - 1 > y && (y = w.pos.y + w.pos.h - 1);
      }), { smartCol: g, smartRow: y };
    }, m = (c, g) => (e.minCol && e.maxCol && e.minCol > e.maxCol ? (c = e.maxCol, console.warn("minCol\u6307\u5B9A\u7684\u503C\u5927\u4E8EmaxCol,\u5C06\u4EE5maxCol\u6307\u5B9A\u7684\u503C\u4E3A\u4E3B")) : e.maxCol && c > e.maxCol ? c = e.maxCol : e.minCol && c < e.minCol && (c = e.minCol), e.minRow && e.maxRow && e.minRow > e.maxRow ? (g = e.maxRow, console.warn("minRow\u6307\u5B9A\u7684\u503C\u5927\u4E8EmaxRow,\u5C06\u4EE5maxRow\u6307\u5B9A\u7684\u503C\u4E3A\u4E3B")) : e.maxRow && g > e.maxRow ? g = e.maxRow : e.minRow && g < e.minRow && (g = e.minRow), {
      limitCol: c,
      limitRow: g
    }), h = () => {
      if (!this.initialized)
        e.row ? i = e.row : this.layoutManager.autoRow(), e.maxRow && console.warn("\u3010\u54CD\u5E94\u5F0F\u3011\u6A21\u5F0F\u4E2D\u4E0D\u5EFA\u8BAE\u4F7F\u7528maxRow,\u60A8\u5982\u679C\u4F7F\u7528\u8BE5\u503C\uFF0C\u53EA\u4F1A\u9650\u5236\u5BB9\u5668\u76D2\u5B50(Container)\u7684\u9AD8\u5EA6,\u4E0D\u80FD\u9650\u5236\u6210\u5458\u6392\u5217\u7684row\u503C \u56E0\u4E3A\u54CD\u5E94\u5F0F\u8BBE\u8BA1\u662F\u80FD\u81EA\u52A8\u7BA1\u7406\u5BB9\u5668\u7684\u9AD8\u5EA6\uFF0C\u60A8\u5982\u679C\u60F3\u8981\u9650\u5236Container\u663E\u793A\u533A\u57DF\u4E14\u83B7\u5F97\u5185\u5BB9\u6EDA\u52A8\u80FD\u529B\uFF0C\u60A8\u53EF\u4EE5\u5728Container\u5916\u90E8\u52A0\u4E0A\u4E00\u5C42\u76D2\u5B50\u5E76\u8BBE\u7F6E\u6210overflow:scroll");
      else if (this.initialized) {
        this.layoutManager.autoRow(), i = a(r).smartRow;
        const g = m(n, i);
        s = g.limitCol, o = g.limitRow;
      }
    }, d = () => {
      const c = this.useLayoutConfig;
      if (c && !c.layout.col || !c.layout.row) {
        const y = a(r);
        n = y.smartCol, i = y.smartRow;
      }
      c.layout.col && (n = e.col), c.layout.row && (i = e.row);
      const g = m(n, i);
      s = n = g.limitCol, o = i = g.limitRow;
    };
    if (e.responsive ? h() : e.responsive || d(), t) {
      this.container.col = n, this.container.row = i, this.container.containerW = s, this.container.containerH = o, this.layoutManager.setColNum(n), this.layoutManager.setRowNum(i), this.layoutManager.addRow(i - this.layoutManager._layoutMatrix.length);
      const c = this.container.__ownTemp__.preCol, g = this.container.__ownTemp__.preRow;
      if (n !== c) {
        this.container.__ownTemp__.preCol = n, this.container.eventManager._callback_("colChange", n, c, e);
        const y = this.container._VueEvents.vueColChange;
        typeof y == "function" && y(n, c, e);
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
      containerW: s,
      containerH: o
    };
  }
  findCoverItemFromPosition(e, t, n, i, s = null) {
    s = s || this.items;
    const o = [];
    for (let r = 0; r < s.length; r++) {
      let a = s[r];
      const m = e, h = t, d = e + n - 1, c = t + i - 1, g = a.pos.x, y = a.pos.y, w = a.pos.x + a.pos.w - 1, _ = a.pos.y + a.pos.h - 1;
      ((w >= m && w <= d || g >= m && g <= d || m >= g && d <= w) && (_ >= h && _ <= c || y >= h && y <= c || h >= y && c <= _) || m >= g && d <= w && h >= y && c <= _) && o.push(a);
    }
    return o;
  }
  findResponsiveItemFromPosition(e, t, n, i) {
    let s = null, o = 1;
    this.items.length > 0 && (o = this.items[this.items.length - 1].pos.y);
    for (let r = 0; r < this.items.length; r++) {
      let a = this.items[r];
      if (!a)
        continue;
      const m = a.pos.x, h = a.pos.y, d = a.pos.x + a.pos.w - 1, c = a.pos.y + a.pos.h - 1;
      m === e && (t > o && (t = o), e === m && t === h && (s = a));
    }
    return s;
  }
  findStaticBlankMaxMatrixFromItem(e) {
    const t = e.pos.x, n = e.pos.y, i = e.pos.w, s = e.pos.h;
    let o = this.container.col - t + 1, r = this.container.row - n + 1, a = o, m = r;
    for (let h = 0; h < this.items.length; h++) {
      const d = this.items[h], c = d.pos;
      e !== d && (c.x + c.w - 1 < t || c.y + c.h - 1 < n || (c.x >= t && c.x - t < o && (n + s - 1 >= c.y && n + s - 1 <= c.y + c.h - 1 || c.y + c.h - 1 >= n && c.y + c.h - 1 <= n + s - 1) && (o = c.x - t), c.y >= n && c.y - n < r && (t + i - 1 >= c.x && t + i - 1 <= c.x + c.w - 1 || c.x + c.w - 1 >= t && c.x + c.w - 1 <= t + i - 1) && (r = c.y - n), c.x >= t && c.x - t < a && (n + r - 1 >= c.y && n + r - 1 <= c.y + c.h - 1 || c.y + c.h - 1 >= n && c.y + c.h - 1 <= n + r - 1) && (a = c.x - t), c.y >= n && c.y - n < m && (t + o - 1 >= c.x && t + o - 1 <= c.x + c.w - 1 || c.x + c.w - 1 >= t && c.x + c.w - 1 <= t + o - 1) && (m = c.y - n)));
    }
    return {
      maxW: o,
      maxH: r,
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
  sortStatic() {
    const e = [], t = [];
    return this.items.forEach((n) => {
      !n instanceof ne || !n._mounted || n.element.parentNode === null || (n.static === !0 ? e.push(n) : t.push(n));
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
    const t = () => {
      let i = !1;
      if (this.items.length <= 1)
        this.items.push(e), i = !0;
      else {
        let s, o;
        for (let r = 0; r < this.items.length; r++)
          if (this.items.length > r && (o = this.items[r], s = this.items[r + 1]), s) {
            const a = o.pos, m = s.pos;
            if (a.y <= n.y && m.y > n.y) {
              this.insert(e, r + 1), i = !0;
              break;
            }
          } else {
            this.items.push(e), i = !0;
            break;
          }
      }
      return i;
    };
    e.static && (e.pos.autoOnce = !1);
    const n = this._isCanAddItemToContainer_(e, e.pos.autoOnce, !0);
    return !n && !this.container.responsive ? this.useLayoutConfig && (!this.useLayoutConfig.layout.col || !this.useLayoutConfig.layout.row) ? (this.items.push(e), !0) : !1 : this.container.autoReorder ? t() : (this.items.push(e), !0);
  }
  sortResponsiveItem() {
    const e = [];
    for (let t = 1; t <= this.container.row; t++)
      for (let n = 1; n <= this.container.col; n++)
        for (let i = 0; i < this.items.length; i++) {
          const s = this.items[i];
          if (!s)
            debugger;
          if (s.pos.x === n && s.pos.y === t) {
            e.push(s);
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
    let i, s = e.pos.nextStaticPos !== null ? e.pos.nextStaticPos : e.pos;
    return s.i = e.i, i = this.layoutManager.findItem(s, t), i !== null ? (n && (this.layoutManager.addItem(i), e.pos = new V(Y(this._genItemPosArg(e), i)), e.pos.nextStaticPos = null, e.pos.autoOnce = !1), i) : null;
  }
  updateLayout(e = null, t = []) {
    const n = this.items.filter((o) => o.static && o.pos.x && o.pos.y ? o : !1);
    if (this.container.responsive) {
      this.reset(), this._sync(), this.renumber();
      let o = e;
      (e === !0 || o === null) && (o = []), e = this.items, o = o.filter((a) => e.includes(a) && !a.static), o.length === 0 && (o = e.filter((a) => a.__temp__.resizeLock));
      const r = (a) => {
        this._isCanAddItemToContainer_(a, a.autoOnce, !0) && a.updateItemLayout();
      };
      n.forEach((a) => {
        a.autoOnce = !1, r(a);
      }), o.forEach((a) => {
        a.autoOnce = !1, r(a);
      }), e.forEach((a) => {
        o.includes(a) || n.includes(a) || (a.autoOnce = !0, r(a));
      }), this.autoSetColAndRows(this.container);
    } else if (!this.container.responsive) {
      let o = [];
      if (e === null)
        o = [];
      else if (Array.isArray(e))
        o = e;
      else if (e !== !0 && o.length === 0)
        return;
      this.reset(), this._sync(), this.renumber(), e = this.items, o = o.filter((a) => e.includes(a) && !a.static), this._sync();
      const r = (a) => {
        this._isCanAddItemToContainer_(a, !1, !0), a.updateItemLayout();
      };
      n.forEach((a) => {
        a.autoOnce = !1, r(a);
      }), e.forEach((a) => {
        o.includes(a) || n.includes(a) || r(a);
      }), o.forEach((a) => {
        r(a);
      });
    }
    this.container.layout.data = this.container.exportData(), this.container.updateContainerStyleSize();
    const i = (o) => ({
      row: o.row,
      col: o.col,
      containerW: o.containerW,
      containerH: o.containerH,
      width: o.nowWidth(),
      height: o.nowHeight()
    }), s = this.container;
    if (!s.__ownTemp__.beforeContainerSizeInfo)
      s.__ownTemp__.beforeContainerSizeInfo = i(s);
    else {
      const o = s.__ownTemp__.beforeContainerSizeInfo;
      if (o.containerW !== s.containerW || o.containerH !== s.containerH) {
        const r = i(s);
        s.__ownTemp__.beforeContainerSizeInfo = i(s), this.container.eventManager._callback_("containerSizeChange", o, r, s);
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
    f(this, "name", ge.name);
    f(this, "message", "getErrAttr=>[name|message] \u5BB9\u5668\u6EA2\u51FA\uFF0C\u53EA\u6709\u9759\u6001\u6A21\u5F0F\u4E0B\u4F1A\u51FA\u73B0\u6B64\u9519\u8BEF,\u60A8\u53EF\u4EE5\u4F7F\u7528error\u4E8B\u4EF6\u51FD\u6570\u63A5\u6536\u8BE5\u9519\u8BEF\uFF0C\u90A3\u4E48\u8BE5\u9519\u8BEF\u5C31\u4E0D\u4F1A\u629B\u51FA\u800C\u662F\u5C06\u9519\u8BEF\u4F20\u5230error\u4E8B\u4EF6\u51FD\u6570\u7684\u7B2C\u4E8C\u4E2A\u5F62\u53C2");
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
class et {
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
    f(this, "autoReorder", !0);
    f(this, "ratioCol", 0.1);
    f(this, "ratioRow", 0.1);
    f(this, "followScroll", !0);
    f(this, "sensitivity", 0.45);
    f(this, "itemLimit", {});
    f(this, "exchange", !1);
    f(this, "pressTime", 360);
    f(this, "scrollWaitTime", 800);
    f(this, "scrollSpeedX", null);
    f(this, "scrollSpeedY", null);
    f(this, "resizeReactionDelay", 50);
    f(this, "slidePage", !0);
    f(this, "nestedOutExchange", !1);
    Y(this, e);
  }
}
const Re = function() {
  if (typeof Map < "u")
    return Map;
  function u(e, t) {
    let n = -1;
    return e.some(function(i, s) {
      return i[0] === t ? (n = s, !0) : !1;
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
      for (let s = 0, o = this.__entries__; s < o.length; s++) {
        var i = o[s];
        t.call(n, i[1], i[0]);
      }
    }, e;
  }();
}(), he = typeof window < "u" && typeof document < "u" && window.document === document, ie = function() {
  return typeof global < "u" && global.Math === Math ? global : typeof self < "u" && self.Math === Math ? self : typeof window < "u" && window.Math === Math ? window : Function("return this")();
}(), tt = function() {
  return typeof requestAnimationFrame == "function" ? requestAnimationFrame.bind(ie) : function(u) {
    return setTimeout(function() {
      return u(Date.now());
    }, 1e3 / 60);
  };
}(), nt = 2;
function it(u, e) {
  let t = !1, n = !1, i = 0;
  function s() {
    t && (t = !1, u()), n && r();
  }
  function o() {
    tt(s);
  }
  function r() {
    const a = Date.now();
    if (t) {
      if (a - i < nt)
        return;
      n = !0;
    } else
      t = !0, n = !1, setTimeout(o, e);
    i = a;
  }
  return r;
}
const ot = 20, st = ["top", "right", "bottom", "left", "width", "height", "size", "weight"], rt = typeof MutationObserver < "u", lt = function() {
  function u() {
    this.connected_ = !1, this.mutationEventsAdded_ = !1, this.mutationsObserver_ = null, this.observers_ = [], this.onTransitionEnd_ = this.onTransitionEnd_.bind(this), this.refresh = it(this.refresh.bind(this), ot);
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
    !he || this.connected_ || (document.addEventListener("transitionend", this.onTransitionEnd_), window.addEventListener("resize", this.refresh), rt ? (this.mutationsObserver_ = new MutationObserver(this.refresh), this.mutationsObserver_.observe(document, {
      attributes: !0,
      childList: !0,
      characterData: !0,
      subtree: !0
    })) : (document.addEventListener("DOMSubtreeModified", this.refresh), this.mutationEventsAdded_ = !0), this.connected_ = !0);
  }, u.prototype.disconnect_ = function() {
    !he || !this.connected_ || (document.removeEventListener("transitionend", this.onTransitionEnd_), window.removeEventListener("resize", this.refresh), this.mutationsObserver_ && this.mutationsObserver_.disconnect(), this.mutationEventsAdded_ && document.removeEventListener("DOMSubtreeModified", this.refresh), this.mutationsObserver_ = null, this.mutationEventsAdded_ = !1, this.connected_ = !1);
  }, u.prototype.onTransitionEnd_ = function(e) {
    const t = e.propertyName, n = t === void 0 ? "" : t;
    st.some(function(s) {
      return !!~n.indexOf(s);
    }) && this.refresh();
  }, u.getInstance = function() {
    return this.instance_ || (this.instance_ = new u()), this.instance_;
  }, u.instance_ = null, u;
}(), Te = function(u, e) {
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
}, q = function(u) {
  return u && u.ownerDocument && u.ownerDocument.defaultView || ie;
}, Me = re(0, 0, 0, 0);
function oe(u) {
  return parseFloat(u) || 0;
}
function ve(u) {
  const e = [];
  for (let t = 1; t < arguments.length; t++)
    e[t - 1] = arguments[t];
  return e.reduce(function(t, n) {
    const i = u["border-" + n + "-width"];
    return t + oe(i);
  }, 0);
}
function at(u) {
  const e = ["top", "right", "bottom", "left"], t = {};
  for (let n = 0, i = e; n < i.length; n++) {
    const s = i[n], o = u["padding-" + s];
    t[s] = oe(o);
  }
  return t;
}
function ut(u) {
  const e = u.getBBox();
  return re(0, 0, e.width, e.height);
}
function ct(u) {
  const e = u.clientWidth, t = u.clientHeight;
  if (!e && !t)
    return Me;
  const n = q(u).getComputedStyle(u), i = at(n), s = i.left + i.right, o = i.top + i.bottom;
  let r = oe(n.width), a = oe(n.height);
  if (n.boxSizing === "border-box" && (Math.round(r + s) !== e && (r -= ve(n, "left", "right") + s), Math.round(a + o) !== t && (a -= ve(n, "top", "bottom") + o)), !mt(u)) {
    const m = Math.round(r + s) - e, h = Math.round(a + o) - t;
    Math.abs(m) !== 1 && (r -= m), Math.abs(h) !== 1 && (a -= h);
  }
  return re(i.left, i.top, r, a);
}
const ft = function() {
  return typeof SVGGraphicsElement < "u" ? function(u) {
    return u instanceof q(u).SVGGraphicsElement;
  } : function(u) {
    return u instanceof q(u).SVGElement && typeof u.getBBox == "function";
  };
}();
function mt(u) {
  return u === q(u).document.documentElement;
}
function ht(u) {
  return he ? ft(u) ? ut(u) : ct(u) : Me;
}
function dt(u) {
  const e = u.x, t = u.y, n = u.width, i = u.height, o = Object.create((typeof DOMRectReadOnly < "u" ? DOMRectReadOnly : Object).prototype);
  return Te(o, {
    x: e,
    y: t,
    width: n,
    height: i,
    top: t,
    right: e + n,
    bottom: i + t,
    left: e
  }), o;
}
function re(u, e, t, n) {
  return { x: u, y: e, width: t, height: n };
}
const gt = function() {
  function u(e) {
    this.broadcastWidth = 0, this.broadcastHeight = 0, this.contentRect_ = re(0, 0, 0, 0), this.target = e;
  }
  return u.prototype.isActive = function() {
    var e = ht(this.target);
    return this.contentRect_ = e, e.width !== this.broadcastWidth || e.height !== this.broadcastHeight;
  }, u.prototype.broadcastRect = function() {
    var e = this.contentRect_;
    return this.broadcastWidth = e.width, this.broadcastHeight = e.height, e;
  }, u;
}(), pt = function() {
  function u(e, t) {
    var n = dt(t);
    Te(this, { target: e, contentRect: n });
  }
  return u;
}(), _t = function() {
  function u(e, t, n) {
    if (this.activeObservations_ = [], this.observations_ = new Re(), typeof e != "function")
      throw new TypeError("The callback provided as parameter 1 is not a function.");
    this.callback_ = e, this.controller_ = t, this.callbackCtx_ = n;
  }
  return u.prototype.observe = function(e) {
    if (!arguments.length)
      throw new TypeError("1 argument required, but only 0 present.");
    if (typeof Element > "u" || !(Element instanceof Object))
      return;
    if (!(e instanceof q(e).Element))
      throw new TypeError('parameter 1 is not of type "Element".');
    const t = this.observations_;
    t.has(e) || (t.set(e, new gt(e)), this.controller_.addObserver(this), this.controller_.refresh());
  }, u.prototype.unobserve = function(e) {
    if (!arguments.length)
      throw new TypeError("1 argument required, but only 0 present.");
    if (typeof Element > "u" || !(Element instanceof Object))
      return;
    if (!(e instanceof q(e).Element))
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
      return new pt(n.target, n.broadcastRect());
    });
    this.callback_.call(e, t, e), this.clearActive();
  }, u.prototype.clearActive = function() {
    this.activeObservations_.splice(0);
  }, u.prototype.hasActive = function() {
    return this.activeObservations_.length > 0;
  }, u;
}(), Se = typeof WeakMap < "u" ? /* @__PURE__ */ new WeakMap() : new Re(), Oe = function() {
  function u(e) {
    if (!(this instanceof u))
      throw new TypeError("Cannot call a class as a function.");
    if (!arguments.length)
      throw new TypeError("1 argument required, but only 0 present.");
    const t = lt.getInstance(), n = new _t(e, t, this);
    Se.set(this, n);
  }
  return u;
}();
[
  "observe",
  "unobserve",
  "disconnect"
].forEach(function(u) {
  Oe.prototype[u] = function() {
    let e;
    return (e = Se.get(this))[u].apply(e, arguments);
  };
});
const yt = function() {
  return typeof ie.ResizeObserver < "u" ? ie.ResizeObserver : Oe;
}(), ee = F.store;
class wt extends ze {
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
      deferUpdatingLayoutTimer: null,
      nestingFirstMounted: !1
    });
    f(this, "genGridContainerBox", () => {
      this.contentElement = document.createElement("div"), this.contentElement.classList.add("grid-container-area"), this.contentElement._isGridContainerArea = !0, this.element.appendChild(this.contentElement), this.updateStyle(X.gridContainer, this.contentElement), this.contentElement.classList.add(this.className);
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
        const s = "\u5728DOM\u4E2D\u672A\u627E\u5230\u6307\u5B9AID\u5BF9\u5E94\u7684:" + this.el + "\u5143\u7D20";
        throw new Error(s);
      }
      if (this.element._gridContainer_ = this, this.element._isGridContainer_ = !0, this.engine.init(), this.platform === "vue" ? this.contentElement = this.element.querySelector(".grid-container-area") : (this.genGridContainerBox(), this.updateStyle(X.gridContainerArea)), this.attr = Array.from(this.element.attributes), this.classList = Array.from(this.element.classList), this.element && this.element.clientWidth > 0) {
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
      for (let s = 0; s < t.length; s++)
        if (t[s].id === (i.nested || "").replace("#", "")) {
          let o = t[s];
          o = o.cloneNode(!0), i.element.appendChild(o);
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
      const s = this.element.clientWidth;
      if (s <= 0)
        return;
      let o = this.engine.layoutConfig.genLayoutConfig(s), { useLayoutConfig: r, currentLayout: a, layout: m } = o;
      const h = this.eventManager._callback_("mountPointElementResizing", r, s, this.container);
      if (!(h === null || h === !1)) {
        if (typeof h == "object" && (r = h), this.px && r.px && this.px !== r.px) {
          this.platform, this.eventManager._callback_("useLayoutChange", a, s, this.container);
          const d = this._VueEvents.vueUseLayoutChange;
          typeof d == "function" && d(o);
        }
        this.engine.updateLayout(!0);
      }
    }, n = (s, o = 350) => {
      let r = this.__ownTemp__;
      return function() {
        r.deferUpdatingLayoutTimer && clearTimeout(r.deferUpdatingLayoutTimer), r.deferUpdatingLayoutTimer = setTimeout(() => {
          s.apply(this, arguments), r.deferUpdatingLayoutTimer = null;
        }, o);
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
      let s = Object.assign({}, n.dataset);
      const o = this.add({ el: n, ...s });
      o && (o.name = o.getAttr("name")), t.push(t);
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
    const e = u, t = te(null), n = te(null), i = new wt({
      platform: "vue",
      layouts: e.config.layouts,
      events: e.events,
      global: e.config.global
    });
    let s = {}, o = !1;
    return Xe("_grid_item_components_", e.components), be(() => {
      i.el = t.value, i.engine.init(), i.vue = e, K(() => {
        s = i.engine.layoutConfig.genLayoutConfig(t.value.clientWidth), n.value._isGridContainerArea = !0;
        const r = $(s.currentLayout);
        e.render === null ? Object.assign(e.useLayout, r) : typeof e.render == "function" && e.render(r, s.useLayoutConfig, e.config.layouts), i.mount();
      }), setTimeout(() => {
        const r = i.exportData();
        e.useLayout.data && e.useLayout.data.length !== r.length && (e.useLayout.data = [], K(() => {
          e.useLayout.data = r, s.layout.data = r, i.updateLayout(!0);
        }));
      }), e.containerAPI.getContainer = () => i, e.containerAPI.exportData = () => i.exportUseLayout().data, e.containerAPI.exportUseLayout = () => i.exportUseLayout(), i._VueEvents.vueUseLayoutChange = (r) => {
        o = !0, e.useLayout.data = [], K(() => {
          s = r;
          const a = $(r.currentLayout);
          for (let m in e.useLayout)
            delete e.useLayout[m];
          e.layoutChange === null ? Object.assign(e.useLayout, r.currentLayout) : typeof e.layoutChange == "function" && (o = !1, e.layoutChange(a, r.useLayoutConfig, i.layouts));
        });
      }, i._VueEvents.vueCrossContainerExchange = (r, a, m) => {
        const h = r.exportConfig();
        r.pos.nextStaticPos && (h.pos.nextStaticPos = r.pos.nextStaticPos, h.pos.x = r.pos.nextStaticPos.x, h.pos.y = r.pos.nextStaticPos.y), h.pos.doItemCrossContainerExchange = (d) => {
          a.exchangeItems.old = a.fromItem, a.exchangeItems.new = d, a.moveItem = d, a.fromItem = d, m(d);
        }, e.useLayout.data.push(h), K(() => {
          i.updateLayout(!0);
        });
      };
    }), R(e.useLayout, () => {
      if (!o) {
        for (let r in e.useLayout) {
          const a = e.useLayout[r], m = typeof a;
          !Array.isArray(a) && ["data", "margin", "size"].includes(r) && console.error(r, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2A\u6570\u7EC4"), m !== "boolean" && ["responsive", "followScroll", "exchange", "slidePage", "autoGrowRow", "autoReorder"].includes(r) && console.error(r, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2Aboolean\u503C"), (m !== "number" || isNaN(a) || !isFinite(a)) && [
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
          ].includes(r) && console.error(r, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2A\u975ENaN\u7684number\u503C"), m !== "string" && ["responseMode", "className"].includes(r) && (r === "responseMode" ? console.error(r, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2Astring\u503C", "\u4E14\u6709\u4E09\u79CD\u5E03\u5C40\u4EA4\u6362\u6A21\u5F0F\uFF0C\u5206\u522B\u662Fdefault,exchange,stream") : console.error(r, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2Astring\u503C")), m !== "object" && ["itemLimit"].includes(r) && (r === "itemLimit" ? console.error(r, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2Aobject\u503C,\u5305\u542B\u53EF\u9009\u952EminW,minH,maxH,maxW\u4F5C\u7528\u4E8E\u6240\u6709Item\u5927\u5C0F\u9650\u5236") : console.error(r, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2Aobject\u503C")), s.layout[r] = fe(a);
        }
        i.updateLayout(!0);
      }
    }, { deep: !0 }), (r, a) => (me(), Ce("div", {
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
        Ee(r.$slots, "default")
      ], 512)
    ], 512));
  }
}, Ie = {
  GridContainer: xt,
  GridItem: je
}, de = (u) => {
  de.installed || (de.installed = !0, Object.keys(Ie).forEach((e) => u.component(e, Ie[e])));
}, bt = {
  install: de
};
export {
  xt as GridContainer,
  je as GridItem,
  bt as default,
  de as install
};
