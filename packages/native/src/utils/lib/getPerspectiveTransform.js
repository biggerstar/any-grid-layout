/**
 * 算法项目地址 https://github.com/fccm/getPerspectiveTransform
 * */

export function getPerspectiveTransform(...args) {
  const [op0, op1, op2, op3, np0, np1, np2, np3] = args

  function Xt(t, e, r, n, i, o, a, s) {
    let u = t[0],
      c = t[1],
      l = e[0],
      f = e[1],
      p = r[0],
      h = r[1],
      d = n[0],
      g = n[1],
      v = i[0],
      m = i[1],
      b = o[0],
      y = o[1],
      x = a[0],
      E = a[1],
      S = s[0],
      M = s[1],
      D = St([u, c, 1, 0, 0, 0, -v * u, -v * c, 0, 0, 0, u, c, 1, -m * u, -m * c, l, f, 1, 0, 0, 0, -b * l, -b * f, 0, 0,
        0, l, f, 1, -y * l, -y * f, p, h, 1, 0, 0, 0, -x * p, -x * h, 0, 0, 0, p, h, 1, -E * p, -E * h, d, g, 1, 0, 0, 0,
        -S * d, -S * g, 0, 0, 0, d, g, 1, -M * d, -M * g
      ], 8);
    if (!D.length) {
      return [];
    }
    let w = Ot(D, [v, m, b, y, x, E, S, M], 8);
    w[8] = 1
    return Ct(w, 3, 4)
  }

  function St(t, e) {
    void 0 === e && (e = Math.sqrt(t.length));
    let n = kt(e)
    for (let r = t.slice(), i = 0; i < e; ++i) {
      let o = e * i,
        a = e * (i + 1),
        s = o + i;
      if (0 === r[s]) {
        for (let u = i + 1; u < e; ++u) {
          if (r[e * u + i]) {
            !function (t, e, r, n, i) {
              for (let o = r; o < n; ++o) {
                let a = t[o],
                  s = e[o];
                t[o] = t[i + o - r]
                t[i + o - r] = a
                e[o] = e[i + o - r]
                e[i + o - r] = s
              }
            }(r, n, o, a, e * u);
            break
          }
        }
      }
      if (!r[s]) {
        return [];
      }
      !function (t, e, r, n, i) {
        for (let o = r; o < n; ++o) {
          t[o] /= i
          e[o] /= i
        }
      }(r, n, o, a, r[s]);
      for (let u = 0; u < e; ++u) {
        let c = e * u,
          l = c + e,
          f = r[c + i];
        0 !== f && i !== u && function (t, e, r, n, i, o) {
          for (let a = r; a < n; ++a) {
            t[a] += t[i + a - r] * o
            e[a] += e[i + a - r] * o
          }
        }(r, n, c, l, o, -f)
      }
    }
    return n
  }

  function Ct(t, e, r) {
    void 0 === e && (e = Math.sqrt(t.length))
    if (e === r) {
      return t;
    }
    let n = kt(r)
    for (let i = Math.min(e, r), o = 0; o < i - 1; ++o) {
      for (let a = 0; a < i - 1; ++a) {
        n[o * r + a] = t[o * e + a];
      }
      n[(o + 1) * r - 1] = t[(o + 1) * e - 1]
      n[(r - 1) * r + o] = t[(e - 1) * e + o]
    }
    n[r * r - 1] = t[e * e - 1]
    return n
  }

  function kt(t) {
    let r = []
    for (let e = t * t, n = 0; n < e; ++n) {
      r[n] = n % (t + 1) ? 0 : 1;
    }
    return r
  }

  function Ot(t, e, r) {
    let n = [],
      i = t.length / r,
      o = e.length / i;
    if (!i) {
      return e;
    }
    if (!o) {
      return t;
    }
    for (let a = 0; a < r; ++a) {
      for (let s = 0; s < o; ++s) {
        for (let u = n[a * o + s] = 0; u < i; ++u) {
          n[a * o + s] += t[a * i + u] * e[u * o + s];
        }
      }
    }
    return n
  }

  function At(t) {
    return 9 === t.length ? [t[0], t[3], t[1], t[4], t[2], t[5]] : Mt(t)
  }

  function Mt(t, e) {
    void 0 === e && (e = Math.sqrt(t.length))
    let r = []
    for (let n = 0; n < e; ++n) {
      for (let i = 0; i < e; ++i) {
        r[i * e + n] = t[e * n + i];
      }
    }
    return r
  }

  function Rt(t, e, r) {
    void 0 === r && (r = Math.sqrt(t.length));
    let n = []
    for (let i = t.length / r, o = e.length / i, a = 0; a < r; ++a) {
      for (let s = 0; s < o; ++s) {
        for (let u = n[a + s * o] = 0; u < i; ++u) {
          n[a + s * o] += t[a + u * i] * e[u + s * o];
        }
      }
    }
    return n
  }

  let l = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];  // the initial identity matrix
  return At(Ot(l, Xt(op0, op1, op2, op3, np0, np1, np2, np3), 4));
}
