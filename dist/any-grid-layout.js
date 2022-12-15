var Ae = Object.defineProperty;
var Pe = (u, e, t) => e in u ? Ae(u, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : u[e] = t;
var c = (u, e, t) => (Pe(u, typeof e != "symbol" ? e + "" : e, t), t);
import { ref as ae, onMounted as ve, toRaw as be, onUnmounted as ke, openBlock as Ie, createElementBlock as Ee, renderSlot as Ce, watch as M, nextTick as pe, createElementVNode as He } from "vue";
function A(u, e = 350) {
  let t, n, i = 0;
  return function() {
    t = this, n = arguments;
    let o = new Date().valueOf();
    o - i > e && (u.apply(t, n), i = o);
  };
}
function We(u) {
  return u.replace(/[A-Z]/g, function(e) {
    return "-" + e.toLowerCase();
  });
}
const D = (u = {}, e = {}, t = !1, n = []) => {
  const i = {};
  return Object.keys(e).forEach((o) => {
    Object.keys(u).includes(o) && !n.includes(o) && (t ? i[o] = e[o] !== void 0 ? e[o] : u[o] : u[o] = e[o] !== void 0 ? e[o] : u[o]);
  }), t ? i : u;
}, $ = (u) => {
  let e = Array.isArray(u) ? [] : {};
  if (u && typeof u == "object")
    for (let t in u)
      u.hasOwnProperty(t) && (u[t] && typeof u[t] == "object" ? e[t] = $(u[t]) : e[t] = u[t]);
  return e;
}, Ne = (u) => {
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
}, S = (u, e = !1) => {
  let t = null;
  const n = u.touchTarget ? u.touchTarget : u.target;
  if (n._isGridContainer_)
    t = n._gridContainer_;
  else
    for (let i = 0; i < u.path.length && !(u.path[i]._isGridContainer_ && (t = u.path[i]._gridContainer_, !e)); i++)
      ;
  return t;
}, De = (u, e = !1) => {
  let t = null;
  const n = u.touchTarget ? u.touchTarget : u.target;
  if (n._isGridContainerArea)
    t = n;
  else
    for (let i = 0; i < u.path.length && !(u.path[i]._isGridContainerArea && (t = u.path[i], !e)); i++)
      ;
  return t;
}, Y = (u, e = !1) => {
  let t = null;
  const n = u.touchTarget ? u.touchTarget : u.target;
  if (n._isGridItem_)
    t = n._gridItem_;
  else
    for (let i = 0; i < u.path.length && !(u.path[i]._isGridItem_ && (t = u.path[i]._gridItem_, !e)); i++)
      ;
  return t;
}, re = (u) => {
  let e = "touches";
  if (u.touches && u.touches.length === 0 && (e = "changedTouches"), u[e] && u[e].length) {
    for (let t in u[e][0])
      ["target"].includes(t) || (u[t] = u[e][0][t]);
    u.touchTarget = document.elementFromPoint(u.clientX, u.clientY);
  }
  return u;
};
const Fe = (u, e) => {
  const t = u.__vccOpts || u;
  for (const [n, i] of e)
    t[n] = i;
  return t;
}, Ye = {
  __name: "GridItem",
  props: {
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
    transition: { required: !1, type: [Boolean, Object, Number], default: void 0 },
    static: { required: !1, type: Boolean, default: void 0 },
    draggable: { required: !1, type: Boolean, default: void 0 },
    resize: { required: !1, type: Boolean, default: void 0 },
    close: { required: !1, type: Boolean, default: void 0 },
    follow: { required: !1, type: Boolean, default: void 0 },
    dragOut: { required: !1, type: Boolean, default: void 0 },
    dragIgnoreEls: { required: !1, type: Array, default: void 0 },
    dragAllowEls: { required: !1, type: Array, default: void 0 },
    getItem: { required: !1, type: Function, default: null }
  },
  setup(u) {
    const e = u, t = ae();
    let n = null;
    const i = () => {
      M(() => e.pos, () => {
        !n || (Object.keys(e.pos).forEach((l) => {
          const s = e.pos[l];
          if (!!s && (typeof s == "number" || !isNaN(s))) {
            if (n.pos[l] === s)
              return;
            ["minW", "maxW", "minH", "maxH"].includes(l) && (n.pos[l] = s), ["w", "h"].includes(l) && (n.pos[l] = s), ["x", "y"].includes(l) && (n.container.responsive || (n.pos[l] = s));
          }
        }), n.container.updateLayout(!0));
      }, { deep: !0 }), M(() => e.transition, (l) => {
        (typeof l == "boolean" || typeof l == "object" || typeof l == "number") && (n.transition = l);
      }, { deep: !0 }), M(() => e.static, (l) => {
        typeof l == "boolean" && (n.static = l);
      }), M(() => e.draggable, (l) => {
        typeof l == "boolean" && (n.draggable = l);
      }), M(() => e.resize, (l) => {
        typeof l == "boolean" && (n.resize = l);
      }), M(() => e.close, (l) => {
        typeof l == "boolean" && (n.close = l);
      }), M(() => e.follow, (l) => {
        typeof l == "boolean" && (n.follow = l);
      }), M(() => e.dragOut, (l) => {
        typeof l == "boolean" && (n.dragOut = l);
      }), M(() => e.dragIgnoreEls, (l) => {
        Array.isArray(l) && (n.dragIgnoreEls = l);
      }), M(() => e.dragAllowEls, (l) => {
        Array.isArray(l) && (n.dragAllowEls = l);
      });
    };
    let o = null;
    const a = () => {
      if (!o)
        return;
      const l = o.col, s = o.row, m = o.engine.autoSetColAndRows(o);
      (l !== m.col || s !== m.row) && o.updateContainerStyleSize();
    };
    return ve(() => {
      const l = be(e);
      o = Ne(t.value), e.pos.autoOnce = !e.pos.x || !e.pos.y;
      const s = e.pos.doItemCrossContainerExchange;
      if (delete e.pos.doItemCrossContainerExchange, n = o.add({
        el: t.value,
        ...l
      }), !n) {
        t.value.parentNode.removeChild(t.value);
        return;
      }
      n.mount(), typeof e.getItem == "function" && e.getItem(n), typeof s == "function" && s(n), n._VueEvents.vueItemResizing = (m, h, d) => {
        e.pos.w && e.pos.w !== h && (e.pos.w = h), e.pos.h && e.pos.h !== d && (e.pos.h = d);
      }, n._VueEvents.vueItemMovePositionChange = (m, h, d, f) => {
        e.pos.x && e.pos.x !== d && (e.pos.x = d), e.pos.y && e.pos.y !== f && (e.pos.y = f);
      }, a(), i();
    }), ke(() => {
      n && n.remove(), a();
    }), (l, s) => (Ie(), Ee("div", {
      class: "grid-item",
      ref_key: "gridItem",
      ref: t
    }, [
      Ce(l.$slots, "default", {}, void 0, !0)
    ], 512));
  }
}, Xe = /* @__PURE__ */ Fe(Ye, [["__scopeId", "data-v-6ea5dd28"]]), z = class {
  constructor() {
    z.intervalTime = 10;
    const e = () => {
      z.ready = !0, z.intervalTime = 50, document.removeEventListener("readystatechange", e);
    };
    document.addEventListener("readystatechange", e);
  }
  static init() {
    z.ins || (new z(), z.ins = !0);
  }
  static run(e, ...t) {
    z.init();
    let n = 0, i = typeof e.timeout == "number" ? e.timeout : z.timeout, o = typeof e.intervalTime == "number" ? e.intervalTime : z.intervalTime, a = () => {
      let m;
      if (typeof e == "function")
        m = e.call(e, ...t);
      else if (typeof e == "object") {
        if (!e.func)
          throw new Error("func\u51FD\u6570\u5FC5\u987B\u4F20\u5165");
        m = e.func.call(e.func, ...t) || void 0;
      }
      e.callback && e.callback(m);
    }, l = () => e.rule ? e.rule() : z.ready;
    if (l())
      return a(), !0;
    let s = setInterval(() => {
      typeof e.max == "number" && e.max < n && clearInterval(s), i < n * o && clearInterval(s), l() && (clearInterval(s), a()), n++;
    }, o);
  }
};
let C = z;
c(C, "ready", !1), c(C, "ins", !1), c(C, "timeout", 12e3), c(C, "intervalTime", 50);
class ie {
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
    return D(this, this._typeCheck(e)), this;
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
  mainContainer: {
    display: "block"
  },
  gridContainer: {
    height: "auto",
    width: "100%",
    boxSizing: "border-box",
    position: "relative"
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
}, N = class {
  constructor() {
  }
  static getInstance() {
    return N.ins || (N.ins = new N(), N.ins = !0), N;
  }
};
let P = N;
c(P, "ins", !1), c(P, "store", {
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
}), c(P, "ItemStore", {});
const r = P.store, ne = class {
  static startEventFromItem(e) {
  }
  static removeEventFromItem(e) {
  }
  static startEventFromContainer(e) {
  }
  static removeEventFromContainer(e) {
  }
  static startGlobalEvent() {
    document.addEventListener("mousedown", I.container.touchstartOrMousedown), document.addEventListener("touchstart", I.container.touchstartOrMousedown, { passive: !1 }), document.addEventListener("mousemove", I.container.touchmoveOrMousemove), document.addEventListener("touchmove", I.container.touchmoveOrMousemove, { passive: !1 }), document.addEventListener("mouseup", I.container.touchendOrMouseup), document.addEventListener("touchend", I.container.touchendOrMouseup, { passive: !1 });
  }
  static removeGlobalEvent() {
    document.removeEventListener("mousedown", I.container.touchstartOrMousedown), document.removeEventListener("touchstart", I.container.touchstartOrMousedown), document.removeEventListener("mousemove", I.container.touchmoveOrMousemove), document.removeEventListener("touchmove", I.container.touchmoveOrMousemove), document.removeEventListener("mouseup", I.container.touchendOrMouseup), document.removeEventListener("touchend", I.container.touchendOrMouseup);
  }
  static startEvent(e = null, t = null) {
    r.editItemNum === 0 && ne.startGlobalEvent();
  }
  static removeEvent(e = null, t = null) {
    t && !t.draggable && t.resize, r.editItemNum === 0 && ne.removeGlobalEvent();
  }
};
let k = ne;
c(k, "_eventEntrustFunctor", {
  itemResize: {
    doResize: A((e) => {
      const t = r.mousedownEvent, n = r.isLeftMousedown, i = r.fromItem;
      if (i === null || t === null || !n)
        return;
      const o = i.container;
      r.cloneElement === null && (r.cloneElement = i.element.cloneNode(!0), r.cloneElement.classList.add("grid-clone-el", "grid-resizing-clone-el"), r.cloneElement && r.fromContainer.contentElement.appendChild(r.cloneElement), i.updateStyle({ transition: "none" }, r.cloneElement), i.addClass("grid-resizing-source-el"));
      const a = i.container.contentElement.getBoundingClientRect();
      let l = e.pageX - a.left - window.scrollX - i.offsetLeft(), s = e.pageY - a.top - window.scrollY - i.offsetTop();
      const m = {
        w: Math.ceil(l / (i.size[0] + i.margin[0])),
        h: Math.ceil(s / (i.size[1] + i.margin[1]))
      };
      m.w < 1 && (m.w = 1), m.h < 1 && (m.h = 1);
      const h = ({ w: g, h: y }) => {
        const p = i.pos;
        return g + p.x > o.col && (g = o.col - p.x + 1), g < p.minW && (g = p.minW), g > p.maxW && p.maxW !== 1 / 0 && (g = p.maxW), i.container.autoGrowRow || y + p.y > o.row && (y = o.row - p.y + 1), y < p.minH && (y = p.minH), y > p.maxH && p.maxH !== 1 / 0 && (y = p.maxH), {
          w: g,
          h: y
        };
      }, d = () => (l > i.maxWidth() && (l = i.maxWidth()), s > i.maxHeight() && (s = i.maxHeight()), l < i.minWidth() && (l = i.minWidth()), s < i.minHeight() && (s = i.minHeight()), {
        width: l,
        height: s
      }), f = h(m);
      if (i.container.responsive) {
        if (i.container.responsive) {
          D(i.pos, f);
          const g = d();
          i.updateStyle({
            width: g.width + "px",
            height: g.height + "px"
          }, r.cloneElement);
        }
      } else {
        const g = d(), y = i.container.engine.findStaticBlankMaxMatrixFromItem(i), p = {};
        if (f.w > y.minW && f.h > y.minH)
          return;
        y.maxW >= f.w ? (p.width = g.width + "px", i.pos.w = f.w) : f.w = i.pos.w, y.maxH >= f.h ? (p.height = g.height + "px", i.pos.h = f.h) : f.h = i.pos.h, Object.keys(p).length > 0 && i.updateStyle(p, r.cloneElement);
      }
      i.__temp__.resized || (i.__temp__.resized = { w: 1, h: 1 }), (i.__temp__.resized.w !== m.w || i.__temp__.resized.h !== m.h) && (i.__temp__.resized = f, typeof i._VueEvents.vueItemResizing == "function" && i._VueEvents.vueItemResizing(i, f.w, f.h), i.container.eventManager._callback_("itemResizing", f.w, f.h, i), r.fromContainer.updateLayout([i]), i.updateStyle(i._genLimitSizeStyle()), i.container.updateContainerStyleSize());
    }, 15),
    mouseup: (e) => {
      const t = r.fromItem;
      t !== null && (t.__temp__.clientWidth = t.nowWidth(), t.__temp__.clientHeight = t.nowHeight(), r.isLeftMousedown = !1, t.updateStyle(t._genItemStyle()));
    }
  },
  check: {
    resizeOrDrag: (e) => {
      var n, i;
      if (!!S(e)) {
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
      this.mouseenter(null, t);
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
      r.isLeftMousedown && t.eventManager._callback_("leaveContainerArea", t, o);
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
          let a = n.element;
          const l = new K({
            pos: o.pos,
            size: e.size,
            margin: e.margin,
            el: a,
            name: o.name,
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
          }), s = n.container.eventManager._callback_("crossContainerExchange", o, l);
          if (s === !1 || s === null)
            return;
          const m = () => {
            e._VueEvents.vueCrossContainerExchange(l, r), o.unmount(), o.remove(), e && (o !== l && !o.container.responsive ? o.container.engine.updateLayout([o]) : o.container.engine.updateLayout()), e.__ownTemp__.firstEnterUnLock = !1;
          }, h = () => {
            e.responsive ? l.pos.autoOnce = !0 : e.responsive || (l.pos.autoOnce = !1), e.add(l), o.unmount(), o.remove(), e && (l.container.responsive ? l.container.engine.updateLayout() : l.container.engine.updateLayout([l]), o !== l && !o.container.responsive ? o.container.engine.updateLayout([o]) : o.container.engine.updateLayout()), l.mount(), e.__ownTemp__.firstEnterUnLock = !1, r.moveItem = l, r.fromItem = l, r.exchangeItems.old = o, r.exchangeItems.new = l;
          };
          if (e.platform === "vue" ? m() : h(), typeof t == "function" && t(l) === !1)
            return;
        } catch (a) {
          console.error("\u8DE8\u5BB9\u5668Item\u79FB\u52A8\u51FA\u9519", a);
        }
    },
    mousemoveFromItemChange: A((e) => {
      if (e.stopPropagation(), !r.isDragging)
        return;
      let t = r.fromItem, n = Y(e);
      n && (r.toItem = n);
      const i = r.moveItem, o = r.mousedownEvent;
      if (t === null || o === null || !r.isLeftMousedown)
        return;
      let a = r.moveItem !== null ? i : t;
      const l = S(e), s = l || a.container;
      if (s.parentItem && s.parentItem === a || (e.touchTarget ? e.touchTarget : e.target)._isGridContainer_)
        return;
      const h = r.mousedownItemOffsetLeft * (s.size[0] / r.fromContainer.size[0]), d = r.mousedownItemOffsetTop * (s.size[1] / r.fromContainer.size[1]), f = s.contentElement.getBoundingClientRect(), g = e.pageX - h - (window.scrollX + f.left), y = e.pageY - d - (window.scrollY + f.top);
      if (a.container.followScroll) {
        const w = s.contentElement.parentElement.getBoundingClientRect(), F = s.scrollSpeedX ? s.scrollSpeedX : Math.round(w.width / 20), U = s.scrollSpeedY ? s.scrollSpeedY : Math.round(w.height / 20), L = (H, W) => {
          const T = a.container.eventManager._callback_("autoScroll", H, W, a.container);
          if (T === !1 || T === null)
            return;
          typeof T == "object" && (typeof T.offset == "number" && (W = T.offset), ["X", "Y"].includes(T.direction) && (H = T.direction));
          const se = s ? s.scrollWaitTime : 800;
          r.scrollReactionStatic === "stop" && (r.scrollReactionStatic = "wait", r.scrollReactionTimer = setTimeout(() => {
            r.scrollReactionStatic = "scroll", clearTimeout(r.scrollReactionTimer);
          }, se)), H === "X" && r.scrollReactionStatic === "scroll" && (s.contentElement.parentElement.scrollLeft += W), H === "Y" && r.scrollReactionStatic === "scroll" && (s.contentElement.parentElement.scrollTop += W);
        };
        let G = !1, V = !1;
        e.pageX - window.scrollX - w.left < w.width * 0.25 ? L("X", -F) : e.pageX - window.scrollX - w.left > w.width * 0.75 ? L("X", F) : G = !0, e.pageY - window.scrollY - w.top < w.height * 0.25 ? L("Y", -U) : e.pageY - window.scrollY - w.top > w.height * 0.75 ? L("Y", U) : V = !0, G && V && (r.scrollReactionStatic = "stop", clearTimeout(r.scrollReactionTimer));
      }
      const p = (v) => {
        const w = v / (s.size[0] + s.margin[0]);
        return w + a.pos.w >= s.containerW ? s.containerW - a.pos.w + 1 : Math.round(w) + 1;
      }, R = (v) => {
        const w = v / (s.size[1] + s.margin[1]);
        return w + a.pos.h >= s.containerH ? s.containerH - a.pos.h + 1 : Math.round(w) + 1;
      };
      let x = p(g), E = R(y);
      x < 1 && (x = 1), E < 1 && (E = 1), a.container.eventManager._callback_("itemMoving", x, E, a);
      const O = () => {
        let v, w, F = Date.now();
        w = e.screenX, v = e.screenY;
        const U = () => {
          let b = F - r.mouseSpeed.timestamp, q = Math.abs(w - r.mouseSpeed.endX), Z = Math.abs(v - r.mouseSpeed.endY), ge = q > Z ? q : Z, Oe = Math.round(ge / b * 1e3);
          return r.mouseSpeed.endX = w, r.mouseSpeed.endY = v, r.mouseSpeed.timestamp = F, { distance: ge, speed: Oe };
        };
        if (!s.__ownTemp__.firstEnterUnLock && r.deviceEventMode === "mouse") {
          const { distance: b, speed: q } = U();
          if (s.size[0] < 30 || s.size[1] < 30) {
            if (b < 3)
              return;
          } else if (s.size[0] < 60 || s.size[1] < 60) {
            if (b < 7)
              return;
          } else if (b < 10 || q < 10)
            return;
          if (a === null)
            return;
        }
        const L = {
          x: x < 1 ? 1 : x,
          y: E < 1 ? 1 : E,
          w: a.pos.w,
          h: a.pos.h
        }, G = () => {
          if (!n && !a.follow)
            return;
          const b = s.engine.findCoverItemFromPosition(L.x, L.y, L.w, L.h);
          b.length > 0 && (n = b.filter((Z) => a !== Z)[0]);
        }, V = () => {
          const b = s.engine.findResponsiveItemFromPosition(L.x, L.y, L.w, L.h);
          !b || (n = b);
        };
        if (a.follow ? n ? G() : V() : G(), s.__ownTemp__.firstEnterUnLock) {
          a.pos.autoOnce = !0, n ? _.itemDrag.mousemoveExchange(s, (b) => {
            s.engine.move(b, n.i);
          }) : _.itemDrag.mousemoveExchange(s), r.dragContainer = s;
          return;
        }
        if (!n)
          return;
        const H = a.element.getBoundingClientRect(), W = Math.abs(e.pageX - H.left - r.mousedownItemOffsetLeft) / n.element.clientWidth, T = Math.abs(e.pageY - H.top - r.mousedownItemOffsetTop) / n.element.clientHeight, se = W > T;
        if (Math.abs(W - T) < s.sensitivity || s.__ownTemp__.exchangeLock === !0)
          return;
        const me = 3, J = s.__ownTemp__.beforeOverItems;
        let he = 0;
        for (let b = 0; b < J.length && !(b >= 3); b++)
          J[b] === n && he++;
        if (he >= me) {
          s.__ownTemp__.exchangeLock = !0;
          const b = setTimeout(() => {
            s.__ownTemp__.exchangeLock = !1, clearTimeout(b);
          }, 200);
        } else if (J.length < me && n.draggable && n.transition && n.transition.time) {
          s.__ownTemp__.exchangeLock = !0;
          const b = setTimeout(() => {
            s.__ownTemp__.exchangeLock = !1, clearTimeout(b);
          }, n.transition.time);
        }
        a !== n && (s.__ownTemp__.beforeOverItems.unshift(n), J.length > 20 && s.__ownTemp__.beforeOverItems.pop());
        const de = a.container.eventManager._callback_("itemExchange", t, n);
        de === !1 || de === null || (s.responseMode === "default" ? se ? (s.engine.sortResponsiveItem(), s.engine.move(a, n.i)) : s.engine.exchange(a, n) : s.responseMode === "stream" ? (s.engine.sortResponsiveItem(), s.engine.move(a, n.i)) : s.responseMode === "exchange" && s.engine.exchange(a, n), s.engine.updateLayout());
      }, j = () => {
        if (!a.follow && !S(e))
          return;
        a.pos.nextStaticPos = new ie(a.pos), a.pos.nextStaticPos.x = x < 1 ? 1 : x, a.pos.nextStaticPos.y = E < 1 ? 1 : E;
        let v = s.engine.findCoverItemFromPosition(
          a.pos.nextStaticPos.x,
          a.pos.nextStaticPos.y,
          a.pos.w,
          a.pos.h
        );
        if (v.length > 0 && (v = v.filter((w) => a !== w)), v.length === 0)
          s.__ownTemp__.firstEnterUnLock ? (_.itemDrag.mousemoveExchange(s), r.dragContainer = s) : (a.pos.x = a.pos.nextStaticPos.x, a.pos.y = a.pos.nextStaticPos.y, a.pos.nextStaticPos = null, s.engine.updateLayout([a])), l && _.cursor.cursor !== "mousedown" && _.cursor.mousedown(e);
        else {
          a.pos.nextStaticPos = null;
          const w = Y(e);
          w && a !== w && _.cursor.cursor !== "drag-to-item-no-drop" && _.cursor.dragToItemNoDrop();
        }
      };
      C.run(() => {
        const v = Object.assign({}, a.pos);
        if (s.responsive ? O() : j(), v.x !== a.pos.x || v.y !== a.pos.y) {
          const w = a._VueEvents.vueItemMovePositionChange;
          typeof w == "function" && w(v.x, v.y, a.pos.x, a.pos.y), a.container.eventManager._callback_("itemMovePositionChange", v.x, v.y, a.pos.x, a.pos.y);
        }
      });
    }, 36),
    mousemoveFromClone: (e) => {
      const t = r.mousedownEvent, n = r.fromItem, i = r.moveItem;
      if (t === null || n === null)
        return;
      let o = r.moveItem !== null ? i : n;
      const a = S(e);
      o.__temp__.dragging = !0, r.cloneElement === null ? (r.cloneElement = o.element.cloneNode(!0), r.cloneElement.classList.add("grid-clone-el", "grid-dragging-clone-el"), document.body.appendChild(r.cloneElement), o.addClass("grid-dragging-source-el"), o.updateStyle({
        pointerEvents: "none",
        transitionProperty: "none",
        transitionDuration: "none"
      }, r.cloneElement)) : a && a.__ownTemp__.firstEnterUnLock && C.run({
        func: () => {
          const m = r.fromItem, h = "grid-dragging-source-el";
          m.hasClass(h) || m.addClass(h);
        },
        rule: () => a === r.fromItem.container,
        intervalTime: 2,
        timeout: 200
      });
      let l = e.pageX - r.mousedownItemOffsetLeft, s = e.pageY - r.mousedownItemOffsetTop;
      if (!o.dragOut) {
        const m = a.contentElement.getBoundingClientRect(), h = window.scrollX + m.left, d = window.scrollY + m.top, f = window.scrollX + m.left + a.contentElement.clientWidth - o.nowWidth(), g = window.scrollY + m.top + a.contentElement.clientHeight - o.nowHeight();
        l < h && (l = h), l > f && (l = f), s < d && (s = d), s > g && (s = g);
      }
      o.updateStyle({
        left: l + "px",
        top: s + "px"
      }, r.cloneElement);
    }
  }
}), c(k, "_eventPerformer", {
  item: {
    mouseenter: (e) => {
      if (e.stopPropagation(), !!S(e) && (e.target._gridItem_ && (r.toItem = Y(e)), r.toItem === null))
        return !1;
    }
  },
  other: {
    updateSlidePageInfo: A((e, t) => {
      r.slidePageOffsetInfo.newestPageX = e, r.slidePageOffsetInfo.newestPageY = t;
    }),
    slidePage: (e) => {
      const t = r.fromContainer;
      if (!t || !t.slidePage)
        return;
      const n = t.element;
      let i = e.pageX - r.mousedownEvent.pageX, o = e.pageY - r.mousedownEvent.pageY;
      const a = r.slidePageOffsetInfo.offsetLeft - i, l = r.slidePageOffsetInfo.offsetTop - o;
      a >= 0 && (n.scrollLeft = a), l >= 0 && (n.scrollTop = l), I.other.updateSlidePageInfo(e.pageX, e.pageY);
    }
  },
  container: {
    mousedown: (e) => {
      if (r.isDragging || r.isResizing)
        return;
      const t = S(e);
      if (!t || (r.fromItem = Y(e), !t && !r.fromItem))
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
            let a = !0;
            for (let l = 0; l < i.dragIgnoreEls.length; l++) {
              const s = i.dragIgnoreEls[l];
              if (s instanceof Element)
                e.target === s && (a = !1);
              else if (typeof s == "string") {
                const m = i.element.querySelectorAll(s);
                Array.from(m).forEach((h) => {
                  e.path.includes(h) && (a = !1);
                });
              }
              if (a === !1)
                return;
            }
          }
          if ((i.dragAllowEls || []).length > 0) {
            let a = !1;
            for (let l = 0; l < i.dragAllowEls.length; l++) {
              const s = i.dragAllowEls[l];
              if (s instanceof Element) {
                if (e.target === s) {
                  a = !0;
                  break;
                }
              } else if (typeof s == "string") {
                const m = i.element.querySelectorAll(s);
                Array.from(m).forEach((h) => {
                  e.path.includes(h) && (a = !0);
                });
              }
            }
            if (a === !1)
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
    mousemove: A((e) => {
      const t = S(e), n = Y(e);
      if (r.isLeftMousedown) {
        const i = De(e);
        if (r.beforeContainerArea = r.currentContainerArea, r.currentContainerArea = i || null, r.beforeContainer = r.currentContainer, r.currentContainer = t || null, r.currentContainerArea !== null && r.beforeContainerArea !== null ? r.currentContainerArea !== r.beforeContainerArea && _.moveOuterContainer.leaveToEnter(r.beforeContainer, r.currentContainer) : (r.currentContainerArea !== null || r.beforeContainerArea !== null) && (r.beforeContainerArea === null && _.moveOuterContainer.mouseenter(null, r.currentContainer), r.currentContainerArea === null && _.moveOuterContainer.mouseleave(null, r.beforeContainer)), r.dragOrResize === "slidePage") {
          I.other.slidePage(e);
          return;
        }
        const o = () => {
          t ? t && (t.responsive ? _.cursor.cursor !== "mousedown" && _.cursor.mousedown() : t.responsive) : _.cursor.cursor !== "no-drop" && _.cursor.notDrop();
        };
        r.isDragging ? (_.itemDrag.mousemoveFromClone(e), o()) : r.isResizing && _.itemResize.doResize(e);
      } else if (n) {
        const i = e.target.classList;
        i.contains("grid-item-close-btn") ? _.cursor.cursor !== "item-close" && _.cursor.itemClose() : i.contains("grid-item-resizable-handle") ? _.cursor.cursor !== "item-resize" && _.cursor.itemResize() : n.static && t && !t.responsive ? _.cursor.cursor !== "static-no-drop" && _.cursor.staticItemNoDrop() : _.cursor.cursor !== "in-container" && _.cursor.inContainer();
      } else
        S(e) ? _.cursor.cursor !== "in-container" && _.cursor.inContainer() : _.cursor.cursor !== "default" && _.cursor.default();
    }, 12),
    mouseup: (e) => {
      const t = S(e);
      r.isResizing && _.itemResize.mouseup(e), t && _.cursor.cursor !== "in-container" && _.cursor.inContainer();
      const n = r.fromItem, i = r.moveItem ? r.moveItem : r.fromItem;
      if (r.cloneElement !== null) {
        let s = null;
        const m = document.querySelectorAll(".grid-clone-el");
        for (let h = 0; h < m.length; h++) {
          let f = function() {
            i.removeClass("grid-dragging-source-el", "grid-resizing-source-el");
            try {
              d.parentNode.removeChild(d);
            } catch {
            }
            i.__temp__.dragging = !1, n.__temp__.dragging = !1, clearTimeout(s);
          };
          const d = m[h];
          if (i.transition) {
            const g = i.container.contentElement.getBoundingClientRect();
            if (r.isDragging) {
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
              r.isResizing && i.updateStyle({
                transitionProperty: `${i.transition.field}`,
                transitionDuration: `${i.transition.time}ms`,
                width: `${i.nowWidth()}px`,
                height: `${i.nowHeight()}px`,
                left: `${i.offsetLeft()}px`,
                top: `${i.offsetTop()}px`
              }, d);
          }
          i.transition ? s = setTimeout(f, i.transition.time) : f();
        }
      }
      const o = document.querySelectorAll(".grid-item-mask");
      for (let s = 0; s < o.length; s++) {
        const m = o[s];
        m.parentElement.removeChild(m);
      }
      const a = r.mouseDownElClassName;
      if (a && a.includes("grid-item-close-btn") && (e.touchTarget ? e.touchTarget : e.target).classList.contains("grid-item-close-btn")) {
        const m = Y(e);
        m === r.fromItem && m.remove(!0);
      }
      const l = r.moveContainer ? r.moveContainer : r.fromContainer;
      if (l && (l.__ownTemp__.firstEnterUnLock = !1, l.__ownTemp__.exchangeLock = !1, l.__ownTemp__.beforeOverItems = [], l.__ownTemp__.moveCount = 0, r.fromContainer && l !== r.fromContainer && (r.fromContainer.__ownTemp__.firstEnterUnLock = !1)), n && n.container.engine.updateLayout(!0), n && i.container !== n.container && (i == null || i.container.engine.updateLayout(!0)), i && (r.isDragging && i.container.eventManager._callback_("itemMoved", i.pos.x, i.pos.y, i), r.isResizing && i.container.eventManager._callback_("itemResized", i.pos.w, i.pos.h, i)), r.isLeftMousedown && r.dragOrResize === "slidePage") {
        const s = r.slidePageOffsetInfo, m = s.newestPageX - e.pageX, h = s.newestPageY - e.pageY;
        let d = 500;
        const f = r.fromContainer;
        if (f.slidePage && (h >= 20 || m >= 20)) {
          const g = setInterval(() => {
            d -= 20, f.element.scrollTop += parseInt((h / 100 * d / 30 || 0).toString()), f.element.scrollLeft += parseInt((m / 100 * d / 30 || 0).toString()), (d <= 0 || r.isLeftMousedown) && clearInterval(g);
          }, 20);
        }
      }
      r.fromContainer = null, r.moveContainer = null, r.dragContainer = null, r.beforeContainerArea = null, r.currentContainerArea = null, r.cloneElement = null, r.fromItem = null, r.toItem = null, r.moveItem = null, r.offsetPageX = null, r.offsetPageY = null, r.isDragging = !1, r.isResizing = !1, r.isLeftMousedown = !1, r.dragOrResize = null, r.mousedownEvent = null, r.mousedownItemOffsetLeft = null, r.mousedownItemOffsetTop = null, r.mouseDownElClassName = null, r.exchangeItems = {
        new: null,
        old: null
      };
    },
    touchstartOrMousedown: (e) => {
      if (e = e || window.event, e.touches ? (e.stopPropagation && e.stopPropagation(), r.deviceEventMode = "touch", e = re(e)) : r.deviceEventMode = "mouse", r.deviceEventMode === "touch") {
        r.allowTouchMoveItem = !1;
        const t = S(e);
        document.addEventListener("contextmenu", _.prevent.contextmenu);
        const n = t ? t.pressTime : 360;
        r.timeOutEvent = setTimeout(() => {
          r.allowTouchMoveItem = !0, I.container.mousemove(e);
          const i = setTimeout(() => {
            document.removeEventListener("contextmenu", _.prevent.contextmenu), clearTimeout(i);
          }, 600);
          clearTimeout(r.timeOutEvent);
        }, n);
      }
      I.container.mousedown(e);
    },
    touchmoveOrMousemove: (e) => {
      if (e = e || window.event, e.touches) {
        if (r.deviceEventMode = "touch", r.allowTouchMoveItem)
          e.preventDefault && e.preventDefault();
        else {
          clearTimeout(r.timeOutEvent);
          return;
        }
        e = re(e);
      } else
        r.deviceEventMode = "mouse";
      e.stopPropagation && e.stopPropagation(), _.itemDrag.mousemoveFromItemChange(e), I.container.mousemove(e);
    },
    touchendOrMouseup: (e) => {
      e = e || window.event, e.touches ? (clearTimeout(r.timeOutEvent), r.allowTouchMoveItem = !1, r.deviceEventMode = "touch", e = re(e), document.removeEventListener("contextmenu", _.prevent.contextmenu)) : r.deviceEventMode = "mouse", I.container.mouseup(e);
    }
  }
});
const _ = k._eventEntrustFunctor, I = k._eventPerformer;
class Le {
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
      n ? i = `${i} ${We(o)}:${e[o]}; ` : t.style[o] = e[o];
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
      this.observer = new o(A(e, t));
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
    e.includes("on") || (e = "on" + e), o[e] || (o[e] = A(t, i));
  }
  addEvent(e, t, n = null, i = {}) {
    let o = 350, a = !1;
    i.throttleTime && (o = i.throttleTime), i.capture && (a = i.capture);
    const l = n || this.element, s = A(t, o);
    return l.addEventListener(e, s, a), s;
  }
  removeEvent(e, t, n = null) {
    (n || this.element).removeEventListener(e, t);
  }
  throttle(e, t) {
    return A(e, t);
  }
}
const le = P.store;
class K extends Le {
  constructor(t) {
    super();
    c(this, "el", "");
    c(this, "name", "");
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
    c(this, "parentElement", null);
    c(this, "nesting", null);
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
      i = t.pos.export(), this.responsive && (delete i.x, delete i.y), n.pos = i, Array.from(["static", "draggable", "resize", "close"]).forEach((a) => {
        t[a] !== !1 && (n[a] = t[a]);
      }), Array.from(["follow", "dragOut"]).forEach((a) => {
        t[a] !== !0 && (n[a] = t[a]);
      });
      let o = {};
      return t.transition.field !== "top,left,width,height" ? (o.field = t.transition.field, t.transition.time !== 180 && (o.time = t.transition.time)) : o = t.transition.time, n.transition = o, n;
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
    t.el instanceof Element && (this.el = t.el, this.element = t.el), this._define(), D(this, t), this.pos = new ie(t.pos), this._itemSizeLimitCheck();
  }
  _define() {
    const t = this;
    let n = !1, i = !1, o = !1, a = !1, l = {
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
        get: () => a,
        set(s) {
          if (typeof s == "boolean") {
            if (a === s)
              return;
            a = s, t._edit(a);
          }
        }
      },
      transition: {
        configurable: !1,
        get: () => l,
        set(s) {
          s === !1 && (l.time = 0), typeof s == "number" && (l.time = s), typeof s == "object" && (s.time && s.time !== l.time && (l.time = s.time), s.field && s.field !== l.field && (l.field = s.field)), t.animation(l);
        }
      }
    });
  }
  mount() {
    const t = () => {
      this._mounted || (this.container.platform !== "vue" && (this.element === null && (this.element = document.createElement(this.tagName)), this.container.contentElement.appendChild(this.element)), this.attr = Array.from(this.element.attributes), this.element.classList.add(this.className), this.classList = Array.from(this.element.classList), this.updateStyle(X.gridItem), this.updateStyle(this._genItemStyle()), this.__temp__.w = this.pos.w, this.__temp__.h = this.pos.h, this.element._gridItem_ = this, this.element._isGridItem_ = !0, this._mounted = !0, this.container.eventManager._callback_("itemMounted", this), this.static && (this.element.innerHTML = this.element.innerHTML + `--
                ${this.pos.i}</br>
                ${this.pos.w},${this.pos.h}</br>
                ${this.pos.x},${this.pos.y} `));
    };
    this.container.platform === "vue" ? t() : C.run(t);
  }
  unmount(t = !1) {
    C.run(() => {
      this._mounted ? (this.__temp__.editNumUsing && (this.__temp__.editNumUsing = !1, le.editItemNum--), this._handleResize(!1), this._closeBtn(!1), this.container.contentElement.removeChild(this.element), this.container.eventManager._callback_("itemUnmounted", this)) : this.container.eventManager._error_("ItemAlreadyRemove", "\u8BE5Item\u5BF9\u5E94\u7684element\u672A\u5728\u6587\u6863\u4E2D\u6302\u8F7D\uFF0C\u53EF\u80FD\u5DF2\u7ECF\u88AB\u79FB\u9664", this);
    }), t && this.remove(), this._mounted = !1;
  }
  remove(t = !1) {
    this.container.engine.remove(this), t && this.unmount();
  }
  _edit(t = !1) {
    this.edit === !0 ? this.__temp__.editNumUsing || (k.startEvent(null, this), this.__temp__.editNumUsing = !0, le.editItemNum++) : this.edit === !1 && this.__temp__.editNumUsing && (k.removeEvent(null, this), le.editItemNum--, this.__temp__.editNumUsing = !1);
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
        const a = document.createElement("span");
        a.innerHTML = "\u22BF", this.updateStyle(X.gridResizableHandle, a), this.element.appendChild(a), a.classList.add(i), this._resizeTabEl = a;
      } else if (this.element && t === !1)
        for (let o = 0; o < this.element.children.length; o++) {
          const a = this.element.children[o];
          a.className.includes(i) && (this.element.removeChild(a), this._resizeTabEl = null);
        }
    };
    this.element ? n() : C.run(n);
  }
  _closeBtn(t = !1) {
    const n = () => {
      const i = "grid-item-close-btn";
      if (t && this._closeEl === null) {
        const o = document.createElement("div");
        this.updateStyle(X.gridItemCloseBtn, o), this._closeEl = o, o.classList.add(i), this.element.appendChild(o), o.innerHTML = X.gridItemCloseBtn.innerHTML;
      }
      if (this._closeEl !== null && !t)
        for (let o = 0; o < this.element.children.length; o++) {
          const a = this.element.children[o];
          a.className.includes(i) && (this.element.removeChild(a), this._closeEl = null);
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
class Be {
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
    let a = !0;
    const l = this.toINameHash(e.i), s = e.x + e.w - 1, m = e.y + e.h - 1;
    if (s > this.col || m > this.row)
      return !1;
    for (let h = n - 1; h <= o - 1; h++)
      for (let d = t - 1; d <= i - 1; d++) {
        const f = this._layoutMatrix[h][d];
        if (l.toString() !== f && f !== !1) {
          a = !1;
          break;
        }
      }
    return a;
  }
  _findRowBlank(e = [], t, n, i) {
    let o = 0;
    for (let a = n; a <= i; a++)
      if (e[a] !== !1 ? o = 0 : e[a] === !1 && o++, o === t)
        return {
          success: !0,
          xStart: a + 1 - t,
          xEnd: a,
          xWidth: t
        };
    return { success: !1 };
  }
  _findBlankPosition(e, t) {
    let n = 0, i = this.col - 1, o = 0, a = [];
    e > this.col && (console.warn("ITEM:", "w:" + e, "x", "h:" + t, "\u7684\u5BBD\u5EA6", e, "\u8D85\u8FC7\u6805\u683C\u5927\u5C0F\uFF0C\u81EA\u52A8\u8C03\u6574\u8BE5ITEM\u5BBD\u5EA6\u4E3A\u6805\u683C\u6700\u5927\u5BBD\u5EA6", this.col), e = this.col);
    let l = 0;
    for (; l++ < 500; ) {
      this._layoutMatrix.length < t + o && this.isAutoRow && this.addRow(t + o - this._layoutMatrix.length);
      let s = !0, m = !1;
      if (!this.col)
        throw new Error("\u672A\u627E\u5230\u7ECF\u8FC7\u5F15\u64CE\u5904\u7406\u8FC7\u540E\u7684col\uFF0C\u53EF\u80FD\u662F\u5C11\u4F20\u53C2\u6570\u6216\u8005\u4EE3\u7801\u6267\u884C\u987A\u5E8F\u6709\u8BEF\uFF0C\u5018\u82E5\u8FD9\u6837\uFF0C\u4E0D\u7528\u95EE\uFF0C\u8FD9\u5C31\u662Fbug");
      for (let h = 0; h < t; h++) {
        a = this._layoutMatrix[o + h], this.DebuggerTemp.yPointStart = o;
        let d = this._findRowBlank(a, e, n, i);
        if (d.success === !1) {
          if (s = !1, m || (h = -1, n = i + 1, i = this.col - 1), n > i) {
            m = !0;
            break;
          }
        } else
          d.success === !0 && (s = !0, h === 0 && (n = d.xStart, i = d.xEnd));
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
  _updateSeatLayout({ xStart: e, yStart: t, xEnd: n, yEnd: i, iName: o }, a = null) {
    o === void 0 && (o = "true");
    let l = a !== null ? a : o.toString();
    for (let s = t - 1; s <= i - 1; s++)
      for (let m = e - 1; m <= n - 1; m++)
        try {
          this.isDebugger ? this._layoutMatrix[s][m] = "__debugger__" : this._layoutMatrix[s][m] = l;
        } catch (h) {
          console.log(h);
        }
  }
}
const Ge = [
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
class qe {
  constructor(e) {
    c(this, "container", null);
    c(this, "useLayoutConfig", {});
    c(this, "option", {});
    c(this, "_defaultLayoutConfig", Ge);
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
    let t = {}, n = {};
    e = e || this.container.element.clientWidth;
    const i = this.container.layouts.sort((x, E) => x.px - E.px);
    for (let x = 0; x < i.length && (n = i[x], Array.isArray(n.data) || (n.data = []), i.length !== 1); x++)
      if (!(n.px < e))
        break;
    if (e === 0 && !t.col)
      throw new Error("\u8BF7\u5728layout\u4E2D\u4F20\u5165col\u7684\u503C\u6216\u8005\u4E3AContainer\u8BBE\u7F6E\u4E00\u4E2A\u521D\u59CB\u5BBD\u5EA6");
    t = Object.assign($(this.option.global), $(n));
    let {
      col: o = null,
      ratio: a = this.container.ratio,
      size: l = [null, null],
      margin: s = [null, null],
      padding: m = 0,
      sizeWidth: h,
      sizeHeight: d,
      marginX: f,
      marginY: g,
      marginLimit: y = {}
    } = t;
    if (!o && !(l[0] || h))
      throw new Error("col\u6216\u8005size[0]\u5FC5\u987B\u8981\u8BBE\u5B9A\u4E00\u4E2A,\u60A8\u4E5F\u53EF\u4EE5\u8BBE\u5B9Acol\u6216sizeWidth\u4E24\u4E2A\u4E2D\u7684\u4E00\u4E2A\u4FBF\u80FD\u8FDB\u884C\u5E03\u5C40");
    if (f && (s[0] = f), g && (s[1] = g), h && (l[0] = h), d && (l[1] = d), o)
      if (l[0] === null && s[0] === null)
        parseInt(o) === 1 ? (s[0] = 0, l[0] = e / o) : (s[0] = e / (o - 1 + o / a), l[0] = s[0] / a, l[0] = (e - (o - 1) * s[0]) / o);
      else if (l[0] !== null && s[0] === null)
        parseInt(o) === 1 ? s[0] = 0 : s[0] = (e - o * l[0]) / (o - 1), s[0] <= 0 && (s[0] = 0);
      else if (l[0] === null && s[0] !== null) {
        if (parseInt(o) === 1 && (s[0] = 0), l[0] = (e - (o - 1) * s[0]) / o, l[0] <= 0)
          throw new Error("\u5728margin[0]\u6216\u5728marginX\u4E3A" + s[0] + "\u7684\u60C5\u51B5\u4E0B,size[0]\u6216sizeWidth\u7684Item\u4E3B\u9898\u5BBD\u5EA6\u5DF2\u7ECF\u5C0F\u4E8E0");
      } else
        l[0] !== null && s[0];
    else
      o === null && (s[0] === null && l[0] !== null ? e <= l[0] ? (s[0] = 0, o = 1) : (o = Math.floor(e / l[0]), s[0] = (e - l[0] * o) / o) : s[0] !== null && l[0] !== null && (e <= l[0] ? (s[0] = 0, o = 1) : o = Math.floor((e - s[0]) / (s[0] + l[0]))));
    t = Object.assign(t, {
      padding: m,
      margin: s,
      size: l,
      col: o
    });
    let p = (x) => {
      let { margin: E, size: O, minCol: j, maxCol: v, col: w, padding: F } = x;
      return E[0] = E[0] ? parseFloat(E[0].toFixed(1)) : 0, E[1] = E[1] ? parseFloat(E[1].toFixed(1)) : parseFloat(E[0].toFixed(1)), O[0] = O[0] ? parseFloat(O[0].toFixed(1)) : 0, O[1] = O[1] ? parseFloat(O[1].toFixed(1)) : parseFloat(O[0].toFixed(1)), w < j && (x.col = j), w > v && (x.col = v), x;
    };
    const R = {};
    for (const x in t)
      (this.option.global[x] !== void 0 || n[x] !== void 0) && (R[x] = t[x]);
    return this.useLayoutConfig = Object.assign(this.useLayoutConfig, p(t)), this.container.layout = n, this.container.useLayout = t, {
      layout: n,
      global: this.option.global,
      useLayoutConfig: t,
      currentLayout: R
    };
  }
}
class $e {
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
    this.initialized || (this.layoutManager = new Be(), this.layoutConfig = new qe(this.option), this.layoutConfig.setContainer(this.container), this.layoutConfig.initLayoutInfo(), this.initialized = !0);
  }
  _sync() {
    let e = this.layoutConfig.genLayoutConfig();
    this._syncLayoutConfig(e.useLayoutConfig);
  }
  _syncLayoutConfig(e = null) {
    if (!!e) {
      if (Object.keys(e).length === 0 && !this.option.col)
        throw new Error("\u672A\u627E\u5230layout\u76F8\u5173\u51B3\u5B9A\u5E03\u5C40\u914D\u7F6E\u4FE1\u606F\uFF0C\u60A8\u53EF\u80FD\u662F\u672A\u4F20\u5165col\u5B57\u6BB5");
      D(this.container, e, !1, ["events"]), this.autoSetColAndRows(this.container), this.items.forEach((t) => {
        D(t, {
          margin: e.margin,
          size: e.size
        });
      });
    }
  }
  autoSetColAndRows(e, t = !0) {
    let n = e.col, i = e.row, o = n, a = i;
    const l = e.engine.items, s = (f) => {
      let g = 1, y = 1;
      return f.length > 0 && f.forEach((p) => {
        p.pos.x + p.pos.w - 1 > g && (g = p.pos.x + p.pos.w - 1), p.pos.y + p.pos.h - 1 > y && (y = p.pos.y + p.pos.h - 1);
      }), { smartCol: g, smartRow: y };
    }, m = (f, g) => (e.minCol && e.maxCol && e.minCol > e.maxCol ? (f = e.maxCol, console.warn("minCol\u6307\u5B9A\u7684\u503C\u5927\u4E8EmaxCol,\u5C06\u4EE5maxCol\u6307\u5B9A\u7684\u503C\u4E3A\u4E3B")) : e.maxCol && f > e.maxCol ? f = e.maxCol : e.minCol && f < e.minCol && (f = e.minCol), e.minRow && e.maxRow && e.minRow > e.maxRow ? (g = e.maxRow, console.warn("minRow\u6307\u5B9A\u7684\u503C\u5927\u4E8EmaxRow,\u5C06\u4EE5maxRow\u6307\u5B9A\u7684\u503C\u4E3A\u4E3B")) : e.maxRow && g > e.maxRow ? g = e.maxRow : e.minRow && g < e.minRow && (g = e.minRow), {
      limitCol: f,
      limitRow: g
    }), h = () => {
      if (!this.initialized)
        e.row ? i = e.row : this.layoutManager.autoRow(), e.maxRow && console.warn("\u3010\u54CD\u5E94\u5F0F\u3011\u6A21\u5F0F\u4E2D\u4E0D\u5EFA\u8BAE\u4F7F\u7528maxRow,\u60A8\u5982\u679C\u4F7F\u7528\u8BE5\u503C\uFF0C\u53EA\u4F1A\u9650\u5236\u5BB9\u5668\u76D2\u5B50(Container)\u7684\u9AD8\u5EA6,\u4E0D\u80FD\u9650\u5236\u6210\u5458\u6392\u5217\u7684row\u503C \u56E0\u4E3A\u54CD\u5E94\u5F0F\u8BBE\u8BA1\u662F\u80FD\u81EA\u52A8\u7BA1\u7406\u5BB9\u5668\u7684\u9AD8\u5EA6\uFF0C\u60A8\u5982\u679C\u60F3\u8981\u9650\u5236Container\u663E\u793A\u533A\u57DF\u4E14\u83B7\u5F97\u5185\u5BB9\u6EDA\u52A8\u80FD\u529B\uFF0C\u60A8\u53EF\u4EE5\u5728Container\u5916\u90E8\u52A0\u4E0A\u4E00\u5C42\u76D2\u5B50\u5E76\u8BBE\u7F6E\u6210overflow:scroll");
      else if (this.initialized) {
        this.layoutManager.autoRow(), i = s(l).smartRow;
        const g = m(n, i);
        o = g.limitCol, a = g.limitRow;
      }
    }, d = () => {
      const f = m(e.col, e.row);
      o = n = f.limitCol, a = i = f.limitRow;
    };
    return e.responsive ? h() : e.responsive || d(), t && (this.container.col = n, this.container.row = i, this.container.containerW = o, this.container.containerH = a, this.layoutManager.setColNum(n), this.layoutManager.setRowNum(i), this.layoutManager.addRow(i - this.layoutManager._layoutMatrix.length)), {
      col: n,
      row: i,
      containerW: o,
      containerH: a
    };
  }
  findCoverItemFromPosition(e, t, n, i, o = null) {
    o = o || this.items;
    const a = [];
    for (let l = 0; l < o.length; l++) {
      let s = o[l];
      const m = e, h = t, d = e + n - 1, f = t + i - 1, g = s.pos.x, y = s.pos.y, p = s.pos.x + s.pos.w - 1, R = s.pos.y + s.pos.h - 1;
      ((p >= m && p <= d || g >= m && g <= d || m >= g && d <= p) && (R >= h && R <= f || y >= h && y <= f || h >= y && f <= R) || m >= g && d <= p && h >= y && f <= R) && a.push(s);
    }
    return a;
  }
  findResponsiveItemFromPosition(e, t, n, i) {
    let o = null, a = 1;
    this.items.length > 0 && (a = this.items[this.items.length - 1].pos.y);
    for (let l = 0; l < this.items.length; l++) {
      let s = this.items[l];
      const m = s.pos.x, h = s.pos.y, d = s.pos.x + s.pos.w - 1, f = s.pos.y + s.pos.h - 1;
      m === e && (t > a && (t = a), e === m && t === h && (o = s));
    }
    return o;
  }
  findStaticBlankMaxMatrixFromItem(e) {
    const t = e.pos.x, n = e.pos.y, i = e.pos.w, o = e.pos.h;
    let a = this.container.col - t + 1, l = this.container.row - n + 1, s = a, m = l;
    for (let h = 0; h < this.items.length; h++) {
      const d = this.items[h], f = d.pos;
      e !== d && (f.x + f.w - 1 < t || f.y + f.h - 1 < n || (f.x >= t && f.x - t < a && (n + o - 1 >= f.y && n + o - 1 <= f.y + f.h - 1 || f.y + f.h - 1 >= n && f.y + f.h - 1 <= n + o - 1) && (a = f.x - t), f.y >= n && f.y - n < l && (t + i - 1 >= f.x && t + i - 1 <= f.x + f.w - 1 || f.x + f.w - 1 >= t && f.x + f.w - 1 <= t + i - 1) && (l = f.y - n), f.x >= t && f.x - t < s && (n + l - 1 >= f.y && n + l - 1 <= f.y + f.h - 1 || f.y + f.h - 1 >= n && f.y + f.h - 1 <= n + l - 1) && (s = f.x - t), f.y >= n && f.y - n < m && (t + a - 1 >= f.x && t + a - 1 <= f.x + f.w - 1 || f.x + f.w - 1 >= t && f.x + f.w - 1 <= t + a - 1) && (m = f.y - n)));
    }
    return {
      maxW: a,
      maxH: l,
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
      !n instanceof K || !n._mounted || n.element.parentNode === null || (n.pos.static === !0 ? e.push(n) : t.push(n));
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
        for (let a = 0; a < this.items.length; a++)
          if (this.items.length > a && (o = this.items[a], i = this.items[a + 1]), i) {
            const l = o.pos, s = i.pos;
            if (l.y <= t.y && s.y > t.y) {
              this.insert(e, a + 1), n = !0;
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
    return e.container = this.container, e.size = this.container.size, e.margin = this.container.margin, e.resize = Boolean(e.resize), e.draggable = Boolean(e.draggable), e.close = Boolean(e.close), e.i = this.len(), new K(e);
  }
  findItem(e) {
    return this.items.filter((t) => t.name === e || t.classList.includes(e) || t.element === e);
  }
  _isCanAddItemToContainer_(e, t = !1, n = !1) {
    let i, o = e.pos.nextStaticPos !== null ? e.pos.nextStaticPos : e.pos;
    return o.i = e.i, i = this.layoutManager.findItem(o, t), i !== null ? (n && (this.layoutManager.addItem(i), e.pos = new ie(D(this._genItemPosArg(e), i)), e.pos.nextStaticPos = null, e.pos.autoOnce = !1), i) : null;
  }
  updateLayout(e = null, t = []) {
    if (this.container.responsive) {
      this.reset(), this._sync(), this.renumber();
      let o = e;
      (e === !0 || o === null) && (o = []), e = this.items, o = o.filter((l) => e.includes(l));
      const a = (l) => {
        this._isCanAddItemToContainer_(l, l.autoOnce, !0) && l.updateItemLayout();
      };
      o.forEach((l) => {
        l.autoOnce = !1, a(l);
      }), e.forEach((l) => {
        o.includes(l) || (l.autoOnce = !0, a(l));
      }), this.autoSetColAndRows(this.container);
    } else if (!this.container.responsive) {
      let o = [];
      if (e === null)
        o = [];
      else if (Array.isArray(e))
        o = e;
      else if (e !== !0 && o.length === 0)
        return;
      this.reset(), this._sync(), this.renumber(), e = this.items, o = o.filter((l) => e.includes(l)), this._sync();
      const a = (l) => {
        this._isCanAddItemToContainer_(l, !1, !0), l.updateItemLayout();
      };
      e.forEach((l) => {
        o.includes(l) || a(l);
      }), o.forEach((l) => {
        a(l);
      });
    }
    this.container.updateContainerStyleSize();
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
        const a = n(i);
        i.__ownTemp__.beforeContainerSizeInfo = n(i), this.container.eventManager._callback_("containerSizeChange", o, a, i);
      }
    }
  }
  _genItemPosArg(e) {
    return e.pos.i = e.i, e.pos.col = (() => this.container.col)(), e.pos.row = (() => this.container.row)(), e.pos;
  }
}
class fe extends Error {
  constructor() {
    super(...arguments);
    c(this, "name", fe.name);
    c(this, "message", "getErrAttr=>[name|message] \u5BB9\u5668\u6EA2\u51FA\uFF0C\u53EA\u6709\u9759\u6001\u6A21\u5F0F\u4E0B\u4F1A\u51FA\u73B0\u6B64\u9519\u8BEF,\u60A8\u53EF\u4EE5\u4F7F\u7528error\u4E8B\u4EF6\u51FD\u6570\u63A5\u6536\u8BE5\u9519\u8BEF\uFF0C\u90A3\u4E48\u8BE5\u9519\u8BEF\u5C31\u4E0D\u4F1A\u629B\u51FA\u800C\u662F\u5C06\u9519\u8BEF\u4F20\u5230error\u4E8B\u4EF6\u51FD\u6570\u7684\u7B2C\u4E8C\u4E2A\u5F62\u53C2");
  }
}
const je = {
  ContainerOverflowError: fe
};
class _e {
  static index(e) {
    return e ? je[e] : Error;
  }
}
class Ue {
  constructor(e) {
    c(this, "error", null);
    Object.assign(this, e);
  }
  _errback_(e, ...t) {
    if (typeof this.error != "function")
      throw new (_e.index(e))();
    this.error.call(this.error, new (_e.index(e))(), ...t);
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
class we {
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
    c(this, "ratio", 0.1);
    c(this, "followScroll", !0);
    c(this, "sensitivity", 0.45);
    c(this, "itemLimit", {});
    c(this, "exchange", !1);
    c(this, "pressTime", 360);
    c(this, "scrollWaitTime", 800);
    c(this, "scrollSpeedX", null);
    c(this, "scrollSpeedY", null);
    c(this, "resizeReactionDelay", 200);
    c(this, "slidePage", !0);
    c(this, "nestedOutExchange", !1);
    D(this, e);
  }
}
const ze = function() {
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
      for (let o = 0, a = this.__entries__; o < a.length; o++) {
        var i = a[o];
        t.call(n, i[1], i[0]);
      }
    }, e;
  }();
}(), ue = typeof window < "u" && typeof document < "u" && window.document === document, ee = function() {
  return typeof global < "u" && global.Math === Math ? global : typeof self < "u" && self.Math === Math ? self : typeof window < "u" && window.Math === Math ? window : Function("return this")();
}(), Ve = function() {
  return typeof requestAnimationFrame == "function" ? requestAnimationFrame.bind(ee) : function(u) {
    return setTimeout(function() {
      return u(Date.now());
    }, 1e3 / 60);
  };
}(), Je = 2;
function Ze(u, e) {
  let t = !1, n = !1, i = 0;
  function o() {
    t && (t = !1, u()), n && l();
  }
  function a() {
    Ve(o);
  }
  function l() {
    const s = Date.now();
    if (t) {
      if (s - i < Je)
        return;
      n = !0;
    } else
      t = !0, n = !1, setTimeout(a, e);
    i = s;
  }
  return l;
}
const Qe = 20, Ke = ["top", "right", "bottom", "left", "width", "height", "size", "weight"], et = typeof MutationObserver < "u", tt = function() {
  function u() {
    this.connected_ = !1, this.mutationEventsAdded_ = !1, this.mutationsObserver_ = null, this.observers_ = [], this.onTransitionEnd_ = this.onTransitionEnd_.bind(this), this.refresh = Ze(this.refresh.bind(this), Qe);
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
    !ue || this.connected_ || (document.addEventListener("transitionend", this.onTransitionEnd_), window.addEventListener("resize", this.refresh), et ? (this.mutationsObserver_ = new MutationObserver(this.refresh), this.mutationsObserver_.observe(document, {
      attributes: !0,
      childList: !0,
      characterData: !0,
      subtree: !0
    })) : (document.addEventListener("DOMSubtreeModified", this.refresh), this.mutationEventsAdded_ = !0), this.connected_ = !0);
  }, u.prototype.disconnect_ = function() {
    !ue || !this.connected_ || (document.removeEventListener("transitionend", this.onTransitionEnd_), window.removeEventListener("resize", this.refresh), this.mutationsObserver_ && this.mutationsObserver_.disconnect(), this.mutationEventsAdded_ && document.removeEventListener("DOMSubtreeModified", this.refresh), this.mutationsObserver_ = null, this.mutationEventsAdded_ = !1, this.connected_ = !1);
  }, u.prototype.onTransitionEnd_ = function(e) {
    const t = e.propertyName, n = t === void 0 ? "" : t;
    Ke.some(function(o) {
      return !!~n.indexOf(o);
    }) && this.refresh();
  }, u.getInstance = function() {
    return this.instance_ || (this.instance_ = new u()), this.instance_;
  }, u.instance_ = null, u;
}(), Me = function(u, e) {
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
}, B = function(u) {
  return u && u.ownerDocument && u.ownerDocument.defaultView || ee;
}, Te = oe(0, 0, 0, 0);
function te(u) {
  return parseFloat(u) || 0;
}
function ye(u) {
  const e = [];
  for (let t = 1; t < arguments.length; t++)
    e[t - 1] = arguments[t];
  return e.reduce(function(t, n) {
    const i = u["border-" + n + "-width"];
    return t + te(i);
  }, 0);
}
function nt(u) {
  const e = ["top", "right", "bottom", "left"], t = {};
  for (let n = 0, i = e; n < i.length; n++) {
    const o = i[n], a = u["padding-" + o];
    t[o] = te(a);
  }
  return t;
}
function it(u) {
  const e = u.getBBox();
  return oe(0, 0, e.width, e.height);
}
function ot(u) {
  const e = u.clientWidth, t = u.clientHeight;
  if (!e && !t)
    return Te;
  const n = B(u).getComputedStyle(u), i = nt(n), o = i.left + i.right, a = i.top + i.bottom;
  let l = te(n.width), s = te(n.height);
  if (n.boxSizing === "border-box" && (Math.round(l + o) !== e && (l -= ye(n, "left", "right") + o), Math.round(s + a) !== t && (s -= ye(n, "top", "bottom") + a)), !rt(u)) {
    const m = Math.round(l + o) - e, h = Math.round(s + a) - t;
    Math.abs(m) !== 1 && (l -= m), Math.abs(h) !== 1 && (s -= h);
  }
  return oe(i.left, i.top, l, s);
}
const st = function() {
  return typeof SVGGraphicsElement < "u" ? function(u) {
    return u instanceof B(u).SVGGraphicsElement;
  } : function(u) {
    return u instanceof B(u).SVGElement && typeof u.getBBox == "function";
  };
}();
function rt(u) {
  return u === B(u).document.documentElement;
}
function lt(u) {
  return ue ? st(u) ? it(u) : ot(u) : Te;
}
function at(u) {
  const e = u.x, t = u.y, n = u.width, i = u.height, a = Object.create((typeof DOMRectReadOnly < "u" ? DOMRectReadOnly : Object).prototype);
  return Me(a, {
    x: e,
    y: t,
    width: n,
    height: i,
    top: t,
    right: e + n,
    bottom: i + t,
    left: e
  }), a;
}
function oe(u, e, t, n) {
  return { x: u, y: e, width: t, height: n };
}
const ut = function() {
  function u(e) {
    this.broadcastWidth = 0, this.broadcastHeight = 0, this.contentRect_ = oe(0, 0, 0, 0), this.target = e;
  }
  return u.prototype.isActive = function() {
    var e = lt(this.target);
    return this.contentRect_ = e, e.width !== this.broadcastWidth || e.height !== this.broadcastHeight;
  }, u.prototype.broadcastRect = function() {
    var e = this.contentRect_;
    return this.broadcastWidth = e.width, this.broadcastHeight = e.height, e;
  }, u;
}(), ct = function() {
  function u(e, t) {
    var n = at(t);
    Me(this, { target: e, contentRect: n });
  }
  return u;
}(), ft = function() {
  function u(e, t, n) {
    if (this.activeObservations_ = [], this.observations_ = new ze(), typeof e != "function")
      throw new TypeError("The callback provided as parameter 1 is not a function.");
    this.callback_ = e, this.controller_ = t, this.callbackCtx_ = n;
  }
  return u.prototype.observe = function(e) {
    if (!arguments.length)
      throw new TypeError("1 argument required, but only 0 present.");
    if (typeof Element > "u" || !(Element instanceof Object))
      return;
    if (!(e instanceof B(e).Element))
      throw new TypeError('parameter 1 is not of type "Element".');
    const t = this.observations_;
    t.has(e) || (t.set(e, new ut(e)), this.controller_.addObserver(this), this.controller_.refresh());
  }, u.prototype.unobserve = function(e) {
    if (!arguments.length)
      throw new TypeError("1 argument required, but only 0 present.");
    if (typeof Element > "u" || !(Element instanceof Object))
      return;
    if (!(e instanceof B(e).Element))
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
      return new ct(n.target, n.broadcastRect());
    });
    this.callback_.call(e, t, e), this.clearActive();
  }, u.prototype.clearActive = function() {
    this.activeObservations_.splice(0);
  }, u.prototype.hasActive = function() {
    return this.activeObservations_.length > 0;
  }, u;
}(), Se = typeof WeakMap < "u" ? /* @__PURE__ */ new WeakMap() : new ze(), Re = function() {
  function u(e) {
    if (!(this instanceof u))
      throw new TypeError("Cannot call a class as a function.");
    if (!arguments.length)
      throw new TypeError("1 argument required, but only 0 present.");
    const t = tt.getInstance(), n = new ft(e, t, this);
    Se.set(this, n);
  }
  return u;
}();
[
  "observe",
  "unobserve",
  "disconnect"
].forEach(function(u) {
  Re.prototype[u] = function() {
    let e;
    return (e = Se.get(this))[u].apply(e, arguments);
  };
});
const mt = function() {
  return typeof ee.ResizeObserver < "u" ? ee.ResizeObserver : Re;
}(), Q = P.store;
class ht extends Le {
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
    c(this, "__store__", Q);
    c(this, "__ownTemp__", {
      exchangeLock: !1,
      firstInitColNum: null,
      firstEnterUnLock: !1,
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
    c(this, "genGridContainerBox", () => {
      this.contentElement = document.createElement("div"), this.contentElement.classList.add("grid-container-area"), this.contentElement._isGridContainerArea = !0, this.element.appendChild(this.contentElement), this.updateStyle(X.gridContainer, this.contentElement), this.contentElement.classList.add(this.className);
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
    t.el, this.el = t.el, typeof t.platform == "string" && (this.platform = t.platform), Object.assign(this, new we()), this._define(), this.eventManager = new Ue(t.events), this.engine = new $e(t), t.global && (this.global = t.global), t.parent && (this.parent = t.parent, this.parent.childContainer.push(this), this.isNesting = !0), this.engine.setContainer(this), t.itemLimit && (this.itemLimit = new ie(t.itemLimit));
  }
  _define() {
    let t = null, n = null;
    Object.defineProperties(this, {
      col: {
        get: () => t,
        set: (i) => {
          t !== i && (t = i);
        }
      },
      row: {
        get: () => n,
        set: (i) => {
          n !== i && (n = i);
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
        const i = "\u5728DOM\u4E2D\u672A\u627E\u5230\u6307\u5B9AID\u5BF9\u5E94\u7684:" + this.el + "\u5143\u7D20";
        throw new Error(i);
      }
      if (this.element._gridContainer_ = this, this.element._isGridContainer_ = !0, this.engine.init(), this.platform === "vue" ? this.contentElement = this.element.querySelector(".grid-container-area") : (this.genGridContainerBox(), this.updateStyle(X.mainContainer)), this.attr = Array.from(this.element.attributes), this.classList = Array.from(this.element.classList), this.element && this.element.clientWidth > 0) {
        if (this.engine._sync(), !this.responsive && !this.row)
          throw new Error("\u4F7F\u7528\u9759\u6001\u5E03\u5C40row,\u548CsizeWidth\u5FC5\u987B\u90FD\u6307\u5B9A\u503C,sizeWidth\u7B49\u4EF7\u4E8Esize[0],\u82E5\u6CA1\u5B9A\u4E49col\u5219\u4F1A\u81EA\u52A8\u751F\u6210");
        if (!this.element.clientWidth)
          throw new Error("\u60A8\u5E94\u8BE5\u4E3AContainer\u6307\u5B9A\u4E00\u4E2A\u5BBD\u5EA6\uFF0C\u54CD\u5E94\u5F0F\u5E03\u5C40\u4F7F\u7528\u6307\u5B9A\u52A8\u6001\u5BBD\u5EA6\uFF0C\u9759\u6001\u5E03\u5C40\u53EF\u4EE5\u76F4\u63A5\u8BBE\u5B9A\u56FA\u5B9A\u5BBD\u5EA6");
      }
      this._observer_(), this.__ownTemp__.firstInitColNum = this.col, this.__store__.screenWidth = window.screen.width, this.__store__.screenHeight = window.screen.height, this._mounted = !0, this.eventManager._callback_("containerMounted", this), typeof t == "function" && t.bind(this)(this);
    };
    this.platform === "vue" ? n() : C.run(n);
  }
  mountItems(t) {
    t.forEach((n) => container.add(n)), this.engine.mountAll();
  }
  exportData() {
    return this.engine.items.map((t) => t.exportConfig());
  }
  render(t) {
    C.run(() => {
      this.element && this.element.clientWidth <= 0 || (typeof t == "function" && t(this.useLayout.data || [], this.useLayout, this.element), this.updateLayout(!0));
    });
  }
  _nestingMount(t = null) {
    t = t || Q.nestingMountPointList;
    for (let n = 0; n < this.engine.items.length; n++) {
      const i = this.engine.items[n];
      for (let o = 0; o < t.length; o++)
        if (t[o].id === (i.nesting || "").replace("#", "")) {
          let a = t[o];
          a = a.cloneNode(!0), i.element.appendChild(a);
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
      let i = this.engine.layoutConfig.genLayoutConfig(n), { useLayoutConfig: o, currentLayout: a, layout: l } = i;
      new we(o);
      const s = this.eventManager._callback_("mountPointElementResizing", o, n, this.container);
      s === null || s === !1 || (typeof s == "object" && (o = s), this.px && o.px && this.px !== o.px && (this.platform, this.eventManager._callback_("useLayoutChange", a, n, this.container), this._VueEvents.vueUseLayoutChange(i)), this.engine.updateLayout(!0));
    };
    window.addEventListener("resize", t), this.__ownTemp__.observer = new mt(A(t, this.resizeReactionDelay)), this.__ownTemp__.observer.observe(this.element);
  }
  isBlank(t, n) {
    return this.engine._isCanAddItemToContainer_(t, n);
  }
  add(t) {
    return t.container = this, t.parentElement = this.contentElement, t instanceof K || (t = this.engine.createItem(t)), this.engine.addItem(t);
  }
  find(t) {
    return this.engine.findItem(t);
  }
  updateContainerStyleSize() {
    this.updateStyle(this.genContainerStyle(), this.contentElement);
  }
  _collectNestingMountPoint() {
    for (let t = 0; t < this.element.children.length; t++)
      Q.nestingMountPointList.includes(this.element.children[t]) || Q.nestingMountPointList.push(document.adoptNode(this.element.children[t]));
  }
  _isNestingContainer_(t = null) {
    if (t = t || this.contentElement, !!t)
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
          }), this.isNesting = !0, this.parentItem = n;
          break;
        }
      }
  }
  _childCollect() {
    const t = [];
    return Array.from(this.contentElement.children).forEach((n, i) => {
      let o = Object.assign({}, n.dataset);
      const a = this.add({ el: n, ...o });
      a && (a.name = a.getAttr("name")), t.push(t);
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
      const i = setTimeout(() => {
        t.unmount(), clearTimeout(i);
      }, n * 1e3);
    });
  }
}
const dt = {
  __name: "GridContainer",
  props: {
    render: { required: !1, type: Function, default: null },
    layoutChange: { required: !1, type: Function, default: null },
    getContainer: { required: !1, type: Function, default: null },
    useLayout: { required: !0, type: Object, default: null },
    events: { required: !1, type: Object },
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
    const e = u, t = ae(null), n = ae(null), i = new ht({
      platform: "vue",
      layouts: e.config.layouts,
      events: e.events,
      global: e.config.global
    });
    let o = {}, a = !1;
    return ve(() => {
      i.el = t.value, i.engine.init(), i.vue = e, o = i.engine.layoutConfig.genLayoutConfig(t.value.clientWidth), n.value._isGridContainerArea = !0;
      const l = $(o.currentLayout);
      e.render === null ? Object.assign(e.useLayout, l) : typeof e.render == "function" && e.render(l, e.config.layouts), i.mount(), typeof e.getContainer == "function" && e.getContainer(i), window.con || (window.con = []), console.log(i), window.con.push(i), setTimeout(() => {
        const s = i.exportData();
        e.useLayout.data.length !== s.length && (e.useLayout.data = [], pe(() => {
          o.layout.data = s, e.useLayout.data = s, i.updateLayout(!0);
        }));
      }), i._VueEvents.vueUseLayoutChange = (s) => {
        a = !0, e.useLayout.data = [], pe(() => {
          o = s;
          const m = $(s.currentLayout);
          if (e.layoutChange === null) {
            for (let h in e.useLayout)
              m[h] === void 0 && delete e.useLayout[h];
            Object.assign(s, s.currentLayout);
          } else
            typeof e.layoutChange == "function" && (a = !1, e.layoutChange(m));
        });
      }, i._VueEvents.vueCrossContainerExchange = (s, m) => {
        const h = s.exportConfig();
        s.pos.nextStaticPos && (h.pos.nextStaticPos = s.pos.nextStaticPos, h.pos.x = s.pos.nextStaticPos.x, h.pos.y = s.pos.nextStaticPos.y), h.pos.doItemCrossContainerExchange = (d) => {
          m.exchangeItems.old = m.fromItem, m.exchangeItems.new = d, m.moveItem = d, m.fromItem = d;
          const f = Array.from(s.element.childNodes), g = Array.from(d.element.childNodes), y = (p) => p.classList && (p.classList.contains("grid-item-resizable-handle") || p.classList.contains("grid-item-close-btn"));
          g.forEach((p) => {
            y(p) || p.remove();
          }), f.forEach((p) => {
            y(p) || d.element.appendChild(document.adoptNode(p));
          });
        }, e.useLayout.data.push(h);
      };
    }), M(e.useLayout, () => {
      if (!a) {
        for (let l in e.useLayout) {
          const s = e.useLayout[l], m = typeof s;
          !Array.isArray(s) && ["data", "margin", "size"].includes(l) && console.error(l, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2A\u6570\u7EC4"), m !== "boolean" && ["responsive", "followScroll", "exchange", "slidePage", "autoGrowRow"].includes(l) && console.error(l, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2Aboolean\u503C"), (m !== "number" || isNaN(s) || !isFinite(s)) && [
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
          ].includes(l) && console.error(l, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2A\u975ENaN\u7684number\u503C"), m !== "string" && ["responseMode", "className"].includes(l) && (l === "responseMode" ? console.error(l, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2Astring\u503C", "\u4E14\u6709\u4E09\u79CD\u5E03\u5C40\u4EA4\u6362\u6A21\u5F0F\uFF0C\u5206\u522B\u662Fdefault,exchange,stream") : console.error(l, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2Astring\u503C")), m !== "object" && ["itemLimit"].includes(l) && (l === "itemLimit" ? console.error(l, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2Aobject\u503C,\u5305\u542B\u53EF\u9009\u952EminW,minH,maxH,maxW\u4F5C\u7528\u4E8E\u6240\u6709Item\u5927\u5C0F\u9650\u5236") : console.error(l, "\u952E\u5E94\u8BE5\u662F\u4E00\u4E2Aobject\u503C")), o.layout[l] = be(s);
        }
        i.updateLayout(!0);
      }
    }, { deep: !0 }), (l, s) => (Ie(), Ee("div", {
      ref_key: "gridContainer",
      ref: t
    }, [
      He("div", {
        ref_key: "gridContainerArea",
        ref: n,
        class: "grid-container-area"
      }, [
        Ce(l.$slots, "default")
      ], 512)
    ], 512));
  }
}, xe = {
  GridContainer: dt,
  GridItem: Xe
}, ce = (u) => {
  ce.installed || (ce.installed = !0, Object.keys(xe).forEach((e) => u.component(e, xe[e])));
}, _t = {
  install: ce
};
export {
  dt as GridContainer,
  Xe as GridItem,
  _t as default,
  ce as install
};
