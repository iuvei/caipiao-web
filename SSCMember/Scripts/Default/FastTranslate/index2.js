define(function(require, exports, module) {
	!
	function(t) {
		function n(r) {
			if (e[r]) return e[r].exports;
			var i = e[r] = {
				i: r,
				l: !1,
				exports: {}
			};
			return t[r].call(i.exports, i, i.exports, n), i.l = !0, i.exports
		}
		var e = {};
		n.m = t, n.c = e, n.d = function(t, e, r) {
			n.o(t, e) || Object.defineProperty(t, e, {
				configurable: !1,
				enumerable: !0,
				get: r
			})
		}, n.n = function(t) {
			var e = t && t.__esModule ?
			function() {
				return t.
			default
			} : function() {
				return t
			};
			return n.d(e, "a", e), e
		}, n.o = function(t, n) {
			return Object.prototype.hasOwnProperty.call(t, n)
		}, n.p = "", n(n.s = 44)
	}([function(t, n, e) {
		var r = e(33)("wks"),
			i = e(24),
			o = e(2).Symbol,
			u = "function" == typeof o;
		(t.exports = function(t) {
			return r[t] || (r[t] = u && o[t] || (u ? o : i)("Symbol." + t))
		}).store = r
	}, function(t, n, e) {
		"use strict";

		function r(t) {
			return t && t.__esModule ? t : {
			default:
				t
			}
		}
		var i = e(69),
			o = r(i),
			u = e(28),
			a = r(u),
			c = function(t) {
				return (0, a.
			default)(new o.
			default (t))
			};
		n.CPrint = function(t, n) {
			function e(t, n, i) {
				if (0 === i) return void(r[r.length] = t);
				for (var o = 0, u = n.length - i; o <= u; o++) {
					var a = t.slice();
					a.push(n[o]), e(a, n.slice(o + 1), i - 1)
				}
			}
			var r = [];
			return n = n || t.length, t.length <= n ? [t] : (e([], t, n), r)
		}, n.APrint = function(t, n) {
			var e = [];
			return n = n || t.length, function t(n, r, i) {
				if (0 == i) return e.push(n.join(""));
				for (var o = 0, u = r.length; o < u; o++) t(n.concat(r[o]), r.slice(0, o).concat(r.slice(o + 1)), i - 1)
			}([], t, n), c(e)
		}, n.combFromSum = function(t, n) {
			function e(n, i, o) {
				for (var u = 0; u <= 9; u++) i - 1 > 0 ? e(u + n, i - 1, o.concat(u)) : String(n + u).slice(-1) - t == 0 && r.push(o.concat(u).sort(function(t, n) {
					return t - n > 0 ? 1 : -1
				}).join(""))
			}
			var r = [];
			return t -= 0, e(0, n, []), c(r)
		}, n.deduplication = c, n.replaceAt = function(t, n, e) {
			return t.substr(0, n) + e + t.substr(n + e.length)
		}, n.join = function() {
			return Array.prototype.join.call(arguments, "")
		}, n.reverse = function(t) {
			return t.split("").reverse().join("")
		}, n.getDuplication = function(t) {
			var n = {},
				e = {
					times: 0,
					num: ""
				};
			t.forEach(function(t) {
				n[t] = (n[t] || 0) + 1
			});
			for (var r in n) n[r] > e.times && (e = {
				times: n[r],
				num: r
			});
			return n = null, e
		}, n.arrangePos = function(t, n) {
			var e = [],
				r = "",
				i = 0;
			return t.match(/[^\d]\d+/g).forEach(function(t) {
				var n = Number(dict[t.slice(0, 1)]);
				e[n] = (e[n] || "") + t.slice(1), i++
			}), n && 1 === i && (e[0] ? e[1] || (e[1] = "0123456789百") : e[0] = "0123456789千"), e.forEach(function(t, n) {
				r += dict[String(n)] + utils.deduplication(t.split("")).join("")
			}), r
		}, n.x = function() {
			return ["X", "X", "X", "X"]
		}
	}, function(t, n) {
		var e = t.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();
		"number" == typeof __g && (__g = e)
	}, function(t, n, e) {
		var r = e(10),
			i = e(54),
			o = e(55),
			u = Object.defineProperty;
		n.f = e(6) ? Object.defineProperty : function(t, n, e) {
			if (r(t), n = o(n, !0), r(e), i) try {
				return u(t, n, e)
			} catch (t) {}
			if ("get" in e || "set" in e) throw TypeError("Accessors not supported!");
			return "value" in e && (t[n] = e.value), t
		}
	}, function(t, n, e) {
		"use strict";
		n.__esModule = !0;
		var r = e(28),
			i = function(t) {
				return t && t.__esModule ? t : {
				default:
					t
				}
			}(r);
		n.
	default = function(t) {
			if (Array.isArray(t)) {
				for (var n = 0, e = Array(t.length); n < t.length; n++) e[n] = t[n];
				return e
			}
			return (0, i.
		default)(t)
		}
	}, function(t, n, e) {
		var r = e(3),
			i = e(20);
		t.exports = e(6) ?
		function(t, n, e) {
			return r.f(t, n, i(1, e))
		} : function(t, n, e) {
			return t[n] = e, t
		}
	}, function(t, n, e) {
		t.exports = !e(16)(function() {
			return 7 != Object.defineProperty({}, "a", {
				get: function() {
					return 7
				}
			}).a
		})
	}, function(t, n) {
		var e = t.exports = {
			version: "2.4.0"
		};
		"number" == typeof __e && (__e = e)
	}, function(t, n) {
		t.exports = function(t) {
			return "object" == typeof t ? null !== t : "function" == typeof t
		}
	}, function(t, n, e) {
		var r = e(53);
		t.exports = function(t, n, e) {
			if (r(t), void 0 === n) return t;
			switch (e) {
			case 1:
				return function(e) {
					return t.call(n, e)
				};
			case 2:
				return function(e, r) {
					return t.call(n, e, r)
				};
			case 3:
				return function(e, r, i) {
					return t.call(n, e, r, i)
				}
			}
			return function() {
				return t.apply(n, arguments)
			}
		}
	}, function(t, n, e) {
		var r = e(8);
		t.exports = function(t) {
			if (!r(t)) throw TypeError(t + " is not an object!");
			return t
		}
	}, function(t, n) {
		var e = {}.hasOwnProperty;
		t.exports = function(t, n) {
			return e.call(t, n)
		}
	}, function(t, n) {
		t.exports = {}
	}, function(t, n, e) {
		"use strict";
		t.exports = {
			"二": 2,
			"三": 3,
			"四": 4,
			"上奖": "shangjiang",
			"倒": "quandao",
			"合": "hefen",
			"定": "ding",
			"现": "xian",
			"千": 0,
			"百": 1,
			"十": 2,
			"个": 3,
			"单": "13579",
			"双": "02468",
			"大": "56789",
			"小": "01234",
			0: "千",
			1: "百",
			2: "十",
			3: "个",
			pos: ["千", "百", "十", "个"]
		}
	}, function(t, n) {
		t.exports = function(t) {
			if (void 0 == t) throw TypeError("Can't call method on  " + t);
			return t
		}
	}, function(t, n, e) {
		var r = e(2),
			i = e(7),
			o = e(9),
			u = e(5),
			a = function(t, n, e) {
				var c, f, s, l = t & a.F,
					p = t & a.G,
					d = t & a.S,
					v = t & a.P,
					h = t & a.B,
					g = t & a.W,
					m = p ? i : i[n] || (i[n] = {}),
					y = m.prototype,
					x = p ? r : d ? r[n] : (r[n] || {}).prototype;
				p && (e = n);
				for (c in e)(f = !l && x && void 0 !== x[c]) && c in m || (s = f ? x[c] : e[c], m[c] = p && "function" != typeof x[c] ? e[c] : h && f ? o(s, r) : g && x[c] == s ?
				function(t) {
					var n = function(n, e, r) {
							if (this instanceof t) {
								switch (arguments.length) {
								case 0:
									return new t;
								case 1:
									return new t(n);
								case 2:
									return new t(n, e)
								}
								return new t(n, e, r)
							}
							return t.apply(this, arguments)
						};
					return n.prototype = t.prototype, n
				}(s) : v && "function" == typeof s ? o(Function.call, s) : s, v && ((m.virtual || (m.virtual = {}))[c] = s, t & a.R && y && !y[c] && u(y, c, s)))
			};
		a.F = 1, a.G = 2, a.S = 4, a.P = 8, a.B = 16, a.W = 32, a.U = 64, a.R = 128, t.exports = a
	}, function(t, n) {
		t.exports = function(t) {
			try {
				return !!t()
			} catch (t) {
				return !0
			}
		}
	}, function(t, n, e) {
		var r = e(18),
			i = Math.min;
		t.exports = function(t) {
			return t > 0 ? i(r(t), 9007199254740991) : 0
		}
	}, function(t, n) {
		var e = Math.ceil,
			r = Math.floor;
		t.exports = function(t) {
			return isNaN(t = +t) ? 0 : (t > 0 ? r : e)(t)
		}
	}, function(t, n, e) {
		"use strict";
		var r = e(52),
			i = e(15),
			o = e(56),
			u = e(5),
			a = e(11),
			c = e(12),
			f = e(57),
			s = e(25),
			l = e(64),
			p = e(0)("iterator"),
			d = !([].keys && "next" in [].keys()),
			v = function() {
				return this
			};
		t.exports = function(t, n, e, h, g, m, y) {
			f(e, n, h);
			var x, b, _, E = function(t) {
					if (!d && t in $) return $[t];
					switch (t) {
					case "keys":
					case "values":
						return function() {
							return new e(this, t)
						}
					}
					return function() {
						return new e(this, t)
					}
				},
				j = n + " Iterator",
				A = "values" == g,
				C = !1,
				$ = t.prototype,
				w = $[p] || $["@@iterator"] || g && $[g],
				k = w || E(g),
				F = g ? A ? E("entries") : k : void 0,
				S = "Array" == n ? $.entries || w : w;
			if (S && (_ = l(S.call(new t))) !== Object.prototype && (s(_, j, !0), r || a(_, p) || u(_, p, v)), A && w && "values" !== w.name && (C = !0, k = function() {
				return w.call(this)
			}), r && !y || !d && !C && $[p] || u($, p, k), c[n] = k, c[j] = v, g) if (x = {
				values: A ? k : E("values"),
				keys: m ? k : E("keys"),
				entries: F
			}, y) for (b in x) b in $ || o($, b, x[b]);
			else i(i.P + i.F * (d || C), n, x);
			return x
		}
	}, function(t, n) {
		t.exports = function(t, n) {
			return {
				enumerable: !(1 & t),
				configurable: !(2 & t),
				writable: !(4 & t),
				value: n
			}
		}
	}, function(t, n, e) {
		var r = e(32),
			i = e(14);
		t.exports = function(t) {
			return r(i(t))
		}
	}, function(t, n) {
		var e = {}.toString;
		t.exports = function(t) {
			return e.call(t).slice(8, -1)
		}
	}, function(t, n, e) {
		var r = e(33)("keys"),
			i = e(24);
		t.exports = function(t) {
			return r[t] || (r[t] = i(t))
		}
	}, function(t, n) {
		var e = 0,
			r = Math.random();
		t.exports = function(t) {
			return "Symbol(".concat(void 0 === t ? "" : t, ")_", (++e + r).toString(36))
		}
	}, function(t, n, e) {
		var r = e(3).f,
			i = e(11),
			o = e(0)("toStringTag");
		t.exports = function(t, n, e) {
			t && !i(t = e ? t : t.prototype, o) && r(t, o, {
				configurable: !0,
				value: n
			})
		}
	}, function(t, n, e) {
		var r = e(14);
		t.exports = function(t) {
			return Object(r(t))
		}
	}, function(t, n, e) {
		var r = e(9),
			i = e(35),
			o = e(36),
			u = e(10),
			a = e(17),
			c = e(37),
			f = {},
			s = {},
			n = t.exports = function(t, n, e, l, p) {
				var d, v, h, g, m = p ?
				function() {
					return t
				} : c(t), y = r(e, l, n ? 2 : 1), x = 0;
				if ("function" != typeof m) throw TypeError(t + " is not iterable!");
				if (o(m)) {
					for (d = a(t.length); d > x; x++) if ((g = n ? y(u(v = t[x])[0], v[1]) : y(t[x])) === f || g === s) return g
				} else for (h = m.call(t); !(v = h.next()).done;) if ((g = i(h, y, v.value, n)) === f || g === s) return g
			};
		n.BREAK = f, n.RETURN = s
	}, function(t, n, e) {
		t.exports = {
		default:
			e(50), __esModule: !0
		}
	}, function(t, n, e) {
		"use strict";
		var r = e(51)(!0);
		e(19)(String, "String", function(t) {
			this._t = String(t), this._i = 0
		}, function() {
			var t, n = this._t,
				e = this._i;
			return e >= n.length ? {
				value: void 0,
				done: !0
			} : (t = r(n, e), this._i += t.length, {
				value: t,
				done: !1
			})
		})
	}, function(t, n, e) {
		var r = e(8),
			i = e(2).document,
			o = r(i) && r(i.createElement);
		t.exports = function(t) {
			return o ? i.createElement(t) : {}
		}
	}, function(t, n, e) {
		var r = e(10),
			i = e(58),
			o = e(34),
			u = e(23)("IE_PROTO"),
			a = function() {},
			c = function() {
				var t, n = e(30)("iframe"),
					r = o.length;
				for (n.style.display = "none", e(63).appendChild(n), n.src = "javascript:", t = n.contentWindow.document, t.open(), t.write("<script>document.F=Object<\/script>"), t.close(), c = t.F; r--;) delete c.prototype[o[r]];
				return c()
			};
		t.exports = Object.create ||
		function(t, n) {
			var e;
			return null !== t ? (a.prototype = r(t), e = new a, a.prototype = null, e[u] = t) : e = c(), void 0 === n ? e : i(e, n)
		}
	}, function(t, n, e) {
		var r = e(22);
		t.exports = Object("z").propertyIsEnumerable(0) ? Object : function(t) {
			return "String" == r(t) ? t.split("") : Object(t)
		}
	}, function(t, n, e) {
		var r = e(2),
			i = r["__core-js_shared__"] || (r["__core-js_shared__"] = {});
		t.exports = function(t) {
			return i[t] || (i[t] = {})
		}
	}, function(t, n) {
		t.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")
	}, function(t, n, e) {
		var r = e(10);
		t.exports = function(t, n, e, i) {
			try {
				return i ? n(r(e)[0], e[1]) : n(e)
			} catch (n) {
				var o = t.
				return;
				throw void 0 !== o && r(o.call(t)), n
			}
		}
	}, function(t, n, e) {
		var r = e(12),
			i = e(0)("iterator"),
			o = Array.prototype;
		t.exports = function(t) {
			return void 0 !== t && (r.Array === t || o[i] === t)
		}
	}, function(t, n, e) {
		var r = e(38),
			i = e(0)("iterator"),
			o = e(12);
		t.exports = e(7).getIteratorMethod = function(t) {
			if (void 0 != t) return t[i] || t["@@iterator"] || o[r(t)]
		}
	}, function(t, n, e) {
		var r = e(22),
			i = e(0)("toStringTag"),
			o = "Arguments" == r(function() {
				return arguments
			}()),
			u = function(t, n) {
				try {
					return t[n]
				} catch (t) {}
			};
		t.exports = function(t) {
			var n, e, a;
			return void 0 === t ? "Undefined" : null === t ? "Null" : "string" == typeof(e = u(n = Object(t), i)) ? e : o ? r(n) : "Object" == (a = r(n)) && "function" == typeof n.callee ? "Arguments" : a
		}
	}, function(t, n) {
		t.exports = function(t, n) {
			return {
				value: n,
				done: !! t
			}
		}
	}, function(t, n, e) {
		var r = e(5);
		t.exports = function(t, n, e) {
			for (var i in n) e && t[i] ? t[i] = n[i] : r(t, i, n[i]);
			return t
		}
	}, function(t, n) {
		t.exports = function(t, n, e, r) {
			if (!(t instanceof n) || void 0 !== r && r in t) throw TypeError(e + ": incorrect invocation!");
			return t
		}
	}, function(t, n, e) {
		var r = e(24)("meta"),
			i = e(8),
			o = e(11),
			u = e(3).f,
			a = 0,
			c = Object.isExtensible ||
		function() {
			return !0
		}, f = !e(16)(function() {
			return c(Object.preventExtensions({}))
		}), s = function(t) {
			u(t, r, {
				value: {
					i: "O" + ++a,
					w: {}
				}
			})
		}, l = function(t, n) {
			if (!i(t)) return "symbol" == typeof t ? t : ("string" == typeof t ? "S" : "P") + t;
			if (!o(t, r)) {
				if (!c(t)) return "F";
				if (!n) return "E";
				s(t)
			}
			return t[r].i
		}, p = function(t, n) {
			if (!o(t, r)) {
				if (!c(t)) return !0;
				if (!n) return !1;
				s(t)
			}
			return t[r].w
		}, d = function(t) {
			return f && v.NEED && c(t) && !o(t, r) && s(t), t
		}, v = t.exports = {
			KEY: r,
			NEED: !1,
			fastKey: l,
			getWeak: p,
			onFreeze: d
		}
	}, function(t, n, e) {
		"use strict";
		var r = e(1),
			i = e(13);
		t.exports = function(t, n) {
			function e() {
				var t = [].slice.call(arguments),
					n = t.map(function(t) {
						return f[t[0]][t[1]]
					}),
					e = o;
				return n.forEach(function(t) {
					return e = e.replace(/[*]/, t)
				}), e
			}
			var o = ["X", "X", "X", "X"];
			/^\d/.test(t) && (t = r.reverse(t));
			var u = [],
				a = "",
				c = 0;
			t.match(/[^\d]\d+/g).forEach(function(t) {
				var n = Number(i[t.slice(0, 1)]);
				u[n] = (u[n] || "") + t.slice(1), c++
			}), n && 1 === c && (u[0] ? u[1] || (u[1] = "0123456789百") : u[0] = "0123456789千"), u.forEach(function(t, n) {
				a += i[String(n)] + r.deduplication(t.split("")).join("")
			}), t = a, /千/.test(t) && (o[0] = "*"), /百/.test(t) && (o[1] = "*"), /十/.test(t) && (o[2] = "*"), /个/.test(t) && (o[3] = "*"), o = o.join("");
			var f = t.match(/\d+/g).map(function(t) {
				return r.deduplication(t.split(""))
			}),
				s = [];
			switch (f.length) {
			case 1:
				for (var l = 0, p = f[0].length; l < p; l++) s.push(e([0, l]));
				break;
			case 2:
				for (var d = 0, v = f[0].length; d < v; d++) for (var h = 0, g = f[1].length; h < g; h++) s.push(e([0, d], [1, h]));
				break;
			case 3:
				for (var m = 0, y = f[0].length; m < y; m++) for (var x = 0, b = f[1].length; x < b; x++) for (var _ = 0, E = f[2].length; _ < E; _++) s.push(e([0, m], [1, x], [2, _]));
				break;
			case 4:
				for (var j = 0, A = f[0].length; j < A; j++) for (var C = 0, $ = f[1].length; C < $; C++) for (var w = 0, k = f[2].length; w < k; w++) for (var F = 0, S = f[3].length; F < S; F++) s.push(e([0, j], [1, C], [2, w], [3, F]))
			}
			return s
		}
	}, function(t, n, e) {
		t.exports = e(45)
	}, function(t, n, e) {
		"use strict";
		var r = e(46),
			i = function(t) {
				return t && t.__esModule ? t : {
				default:
					t
				}
			}(r),
			o = e(48),
			u = function() {
				var t = this;
				this.$textarea = $("#CleverTxt"), this.isAmountMode = ko.observable(!1), this.tips = ko.observable(""), this.count = ko.observable(0), this.totalAmount = ko.observable(""), this.list = [], this.amount = ko.observable(0).extend({
					limit: {
						range: [0],
						fix: 1
					}
				}), this.isSubmitting = ko.observable(!1), this.showFooterToolbar = ko.pureComputed(function() {
					var n = t.count();
					return this.isAmountMode() ? n / 2 : n
				}), this.reset = function() {
					t.count(0).totalAmount(0), t.list = [], t.removeDom(), t.$textarea.val("")
				}, this.$textarea.on("input", function(n) {
					t.render(o(n.target.value))
				})
			};
		u.prototype.render = function(t) {
			var n = this;
			if (!t.status) return n.count(0).totalAmount(0), n.tips(t.err);
			n.tips(""), n.isAmountMode(t.mode), n.count(t.list.length), n.list = t.list, t.mode ? (n.render2(t.list), n.totalAmount(t.totalAmount)) : n.render1(t.list)
		}, u.prototype.render1 = function(t) {
			var n = this;
			if (0 !== t.length) {
				var e = document.createElement("table"),
					r = document.createElement("tbody"),
					i = document.createElement("thead");
				e.setAttribute("class", "table-result"), function(t, e, r) {
					var o = document.createElement("tr");
					for (o.setAttribute("class", "tr-e"); t > 0;) {
						var u = document.createElement("td");
						n.textContent(u, "号码"), o.appendChild(u), i.appendChild(o), t--
					}
				}(12);
				var o = [];
				document.createElement("td"), ko.utils.arrayForEach(t, function(t, e) {
					var r = document.createElement("td");
					e % 2 != 0 && (r.style.background = "#FFFFC4"), n.textContent(r, t.num);
					var i = Math.floor(e / 12);
					o[i] = o[i] || document.createElement("tr"), o[i].appendChild(r)
				}), function() {
					var t = o.length - 1,
						n = o[t].children.length,
						e = 12 - n;
					if (n < 12) for (; e > 0;) {
						var r = document.createElement("td");
						e % 2 != 0 && (r.style.background = "#FFFFC4"), o[t].appendChild(r), e--
					}
				}(), ko.utils.arrayForEach(o, function(t) {
					r.appendChild(t)
				}), e.appendChild(i), e.appendChild(r), n.removeDom(), document.getElementById("ResultBox").appendChild(e)
			}
		}, u.prototype.render2 = function(t) {
			var n = this;
			if (0 !== t.length) {
				var e = document.createElement("table"),
					r = document.createElement("tbody"),
					i = document.createElement("thead");
				e.setAttribute("class", "table-result"), function(t) {
					var e = document.createElement("tr");
					for (e.setAttribute("class", "tr-e"); t > 0;) {
						var r = document.createElement("td"),
							o = document.createElement("td");
						n.textContent(r, "号码"), n.textContent(o, "金额"), e.appendChild(r), e.appendChild(o), i.appendChild(e), t--
					}
				}(6);
				var o = [];
				document.createElement("td"), ko.utils.arrayForEach(t, function(t, e) {
					var r = document.createElement("td"),
						i = document.createElement("td");
					e % 2 != 0 && (r.style.background = "#FFFFC4", i.style.background = "#FFFFC4"), n.textContent(r, t.num), n.textContent(i, t.amount);
					var u = Math.floor(e / 6);
					o[u] = o[u] || document.createElement("tr"), o[u].appendChild(r), o[u].appendChild(i)
				}), function() {
					var t = o.length - 1,
						n = o[t].children.length,
						e = 6 - n / 2;
					if (n < 12) for (; e > 0;) {
						var r = document.createElement("td"),
							i = document.createElement("td");
						e % 2 != 0 && (r.style.background = "#FFFFC4", i.style.background = "#FFFFC4"), o[t].appendChild(r), o[t].appendChild(i), e--
					}
				}(), ko.utils.arrayForEach(o, function(t) {
					r.appendChild(t)
				}), e.appendChild(i), e.appendChild(r);
				var u = document.getElementById("ResultBox");
				u.firstElementChild && u.removeChild(u.firstElementChild), u.appendChild(e)
			}
		}, u.prototype.submit = function() {
			var t = this,
				n = 1;
			if (0 !== this.list.length) {
				var e = ko.utils.arrayMap(this.list, function(e) {
					var r = void 0;
					r = e.num.indexOf("现") > -1 ? "a" + e.num.replace("现", "") : (e.isXian ? "a" : "") + e.num;
					var i = {
						BetNumber: r
					};
					i.Money = t.isAmountMode() ? e.amount : t.amount();
					var o = Number(i.Money);
					return isNaN(o) && (n = 2), o <= 0 && (n = 3), i
				});
				if (2 === n) return Utils.tip("金额格式错误");
				if (3 === n) return Utils.tip("金额必须大于0");
				this.isSubmitting(!0), $.ajax({
					url: "/index.php/Portal/FastTranslate/BetFastTranslateSubmit",
					type: "post",
					cache: !1,
					data: {
						BetModelList: (0, i.
					default)(e)
					},
					success: function(n) {
						n.status ? (n.CmdObject && (document.getElementById("DefaultCredit").innerHTML = parseFloat(n.CmdObject.Credit).toFixed(4) - 0), Utils.sound.play(), framework._extend.getBetInfoForLeftInfo(), t.reset()) : (Utils.tip(n.info, n.status, $.noop), n.info.indexOf("无效期数数据") > -1 && framework.periods && $$.isFunction(framework.periods.main) && framework.periods.main())
					},
					error: function() {
						Utils.tip("下注失败，请重试", !1)
					},
					compelte: function() {
						this.isSubmitting(!1)
					}
				})
			}
		}, u.prototype.removeDom = function() {
			var t = document.getElementById("ResultBox");
			t.firstElementChild && t.removeChild(t.firstElementChild)
		}, u.prototype.textContent = function(t, n) {
			t.textContent ? t.textContent = n : t.innerText ? t.innerText = n : t.innerHTML = n
		}, window.Kuaiyi = u
	}, function(t, n, e) {
		t.exports = {
		default:
			e(47), __esModule: !0
		}
	}, function(t, n, e) {
		var r = e(7),
			i = r.JSON || (r.JSON = {
				stringify: JSON.stringify
			});
		t.exports = function(t) {
			return i.stringify.apply(i, arguments)
		}
	}, function(t, n, e) {
		"use strict";
		var r = e(49),
			i = e(1),
			o = r.k;
		[String({})[1], (!1 + "")[3]].forEach(function(t, n) {
			r = r(i.join(t, [o, "jaes"][n]))
		}), t.exports = r
	}, function(t, n, e) {
		"use strict";

		function r(t) {
			var n = !0,
				e = [],
				r = "",
				i = /[取除](([二三双]重)|\d+)/g,
				o = t.match(i);
			if (t = t.replace(i, ""), /^\d+((上奖)|(倒))$/.test(t) && (t += "二定"), /^\d+[二三四]个?置$/.test(t)) return p(t);
			var u = /^\d+(([二三]?合)|(上奖)|(倒))[二三四][定现]$/.test(t),
				f = /^\d+([二三]?合)[二三四][现]$/.test(t);
			if (u || f) {
				var y = t.replace(/[^\d]+/g, "").split(""),
					x = c[t.match(/(合)|(上奖)|(倒)/)[0]],
					b = c[t.match(/([二三四])[定现]/)[1]],
					_ = c[t.match(/[二三四]([定现])/)[1]],
					E = 2;
				if ("hefen" === x) {
					var j = t.match(/([二三])合/);
					j && (E = Number(c[j[1]]))
				}
				if ("ding" === _) switch (x) {
				case "shangjiang":
					e = d.ding(b, y);
					break;
				case "quandao":
					y.length < b ? (n = !1, r = "号码的个数不能少于" + b + "个") : e = l.ding(b, y);
					break;
				case "hefen":
					e = v.ding(b, s.deduplication(y), E)
				} else if ("xian" === _) switch (x) {
				case "shangjiang":
				case "quandao":
					break;
				case "hefen":
					e = v.xian(b, s.deduplication(y), E)
				}
			} else if (/^(\d+[千百十个]){1,4}(二定)?$/.test(t) || /^([千百十个]\d+){1,4}(二定)?$/.test(t)) t = t.replace("二定", ""), /^\d/.test(t) && (t = s.reverse(t)), t.replace(/\d/g, "").split(""), e = h(t, !0);
			else if (/^(\d+[千百十个])+[二三四][现定]$/.test(t) || /^([千百十个]\d+)+[二三四][现定]$/.test(t)) {
				u = /定/.test(t);
				var A = c[t.match(/[二三四]/)[0]];
				/^[^\d]/.test(t) && (t = t.replace(/(\d+)([千百十个])/g, "$2$1"));
				var C = "千百十个".split("").filter(function(n) {
					return -1 === t.indexOf(n)
				}),
					$ = t.replace(/[二三四][现定]/, ""),
					F = k;
				s.CPrint(C, A - 1).map(function(t) {
					var n;
					(n = e).push.apply(n, (0, a.
				default)(h($ + t.map(function(t) {
						return F + t
					}).join(""))))
				})
			} else if (/^(\d+[千百十个]){1,3}移\d+([二三四]定)?$/.test(t)) e = g(t);
			else if (/^[x\d]{2,4}$/.test(t) && !/^x+$/.test(t)) t.length < 4 && t.indexOf("x") > -1 ? (n = !1, r = w) : (e.push(t), f = t.length < 4);
			else if (/^\d+[二三四]现$/.test(t)) {
				var S = t.match(/\d/g),
					P = c[t.match(/([二三四])现/, "$1")[1]];
				S.length >= P ? e = s.CPrint(S, P).map(function(t) {
					return t.join("") + "现"
				}) : (r = w, n = !1)
			} else if (/^[千百十个]+合\d+([二三四][定现])?$/.test(t)) {
				var O = !0,
					M = null,
					N = t.match(/合(\d+)/)[1];
				/[二三四][定现]$/.test(t) && (O = /定$/.test(t), M = c[t.match(/([二三四])[定现]/)[1]]);
				var T = t.match(/[千百十个]/g).map(function(t) {
					return c[t]
				}),
					X = T.length;
				if (null !== M && X !== M) r = w, n = !1;
				else {
					var R = s.x();
					T.forEach(function(t) {
						return R[Number(t)] = "\\d"
					}), e = v.all(X, N.split(""), X, O);
					var B = new RegExp("^" + R.join("") + "$", "i");
					e = e.filter(function(t) {
						return B.test(t)
					})
				}
			} else r = w + "，或暂不支持您所输入的格式", n = !1;
			return o && (e = m(o[0], e)), e = s.deduplication(e), {
				status: n,
				list: e,
				info: r,
				isXian: f
			}
		}
		function i(t) {
			var n = f(t),
				e = /=/gm.test(n.join("|")),
				i = [],
				o = void 0,
				u = !0,
				c = 0;
			if (y) {
				var l = new RegExp(s.join(b, A, C, E)),
					p = s.join(_, A, j, b, E, A, C, b),
					d = $[s.join(_, A, j, E, "y")];
				if (!l.test(d.style[p])) return {
					list: i,
					status: u,
					err: w,
					totalAmount: c,
					mode: e
				}
			}
			return n.forEach(function(t) {
				if (u && 0 !== t.length) {
					var n = 0;
					if (e) {
						var f = t.split("=");
						if (n = Number(f[1]), t = f[0], isNaN(n)) return u = !1, void(o = w)
					}
					var s = r(t);
					if (s.status) {
						var l = s.list;
						e ? (c += l.length * n, i.push.apply(i, (0, a.
					default)(l.map(function(t) {
							return {
								num: t,
								amount: n
							}
						})))) : i.push.apply(i, (0, a.
					default)(l.map(function(t) {
							return {
								num: t,
								isXian: s.isXian
							}
						})))
					} else o = s.info, u = !1
				}
			}), {
				list: i,
				status: u,
				err: o,
				totalAmount: c.toFixed(3) - 0,
				mode: e
			}
		}
		function o(t) {
			return t.split("").reverse().join("")
		}
		var u = e(4),
			a = function(t) {
				return t && t.__esModule ? t : {
				default:
					t
				}
			}(u),
			c = e(13),
			f = e(68),
			s = e(1),
			l = e(86),
			p = e(87),
			d = e(88),
			v = e(90),
			h = e(43),
			g = e(91),
			m = e(92),
			y = !0,
			x = void 0,
			b = void 0,
			_ = void 0,
			E = void 0,
			j = void 0,
			A = void 0,
			C = void 0,
			$ = void 0;
		y ? (x = window, b = "r", _ = "b", E = "d", j = "o", A = "", C = "e", $ = x.document) : x = {
			ko: 1,
			seajs: 1
		};
		var w = "格式错误",
			k = "0123456789";
		t.exports = function(t) {
			return x[o(t)] ?
			function(t) {
				return x[o(t)] ? i.bind(null) : i.bind(w)
			} : i.bind(w)
		}, t.exports.k = "k"
	}, function(t, n, e) {
		e(29), e(65), t.exports = e(7).Array.from
	}, function(t, n, e) {
		var r = e(18),
			i = e(14);
		t.exports = function(t) {
			return function(n, e) {
				var o, u, a = String(i(n)),
					c = r(e),
					f = a.length;
				return c < 0 || c >= f ? t ? "" : void 0 : (o = a.charCodeAt(c), o < 55296 || o > 56319 || c + 1 === f || (u = a.charCodeAt(c + 1)) < 56320 || u > 57343 ? t ? a.charAt(c) : o : t ? a.slice(c, c + 2) : u - 56320 + (o - 55296 << 10) + 65536)
			}
		}
	}, function(t, n) {
		t.exports = !0
	}, function(t, n) {
		t.exports = function(t) {
			if ("function" != typeof t) throw TypeError(t + " is not a function!");
			return t
		}
	}, function(t, n, e) {
		t.exports = !e(6) && !e(16)(function() {
			return 7 != Object.defineProperty(e(30)("div"), "a", {
				get: function() {
					return 7
				}
			}).a
		})
	}, function(t, n, e) {
		var r = e(8);
		t.exports = function(t, n) {
			if (!r(t)) return t;
			var e, i;
			if (n && "function" == typeof(e = t.toString) && !r(i = e.call(t))) return i;
			if ("function" == typeof(e = t.valueOf) && !r(i = e.call(t))) return i;
			if (!n && "function" == typeof(e = t.toString) && !r(i = e.call(t))) return i;
			throw TypeError("Can't convert object to primitive value")
		}
	}, function(t, n, e) {
		t.exports = e(5)
	}, function(t, n, e) {
		"use strict";
		var r = e(31),
			i = e(20),
			o = e(25),
			u = {};
		e(5)(u, e(0)("iterator"), function() {
			return this
		}), t.exports = function(t, n, e) {
			t.prototype = r(u, {
				next: i(1, e)
			}), o(t, n + " Iterator")
		}
	}, function(t, n, e) {
		var r = e(3),
			i = e(10),
			o = e(59);
		t.exports = e(6) ? Object.defineProperties : function(t, n) {
			i(t);
			for (var e, u = o(n), a = u.length, c = 0; a > c;) r.f(t, e = u[c++], n[e]);
			return t
		}
	}, function(t, n, e) {
		var r = e(60),
			i = e(34);
		t.exports = Object.keys ||
		function(t) {
			return r(t, i)
		}
	}, function(t, n, e) {
		var r = e(11),
			i = e(21),
			o = e(61)(!1),
			u = e(23)("IE_PROTO");
		t.exports = function(t, n) {
			var e, a = i(t),
				c = 0,
				f = [];
			for (e in a) e != u && r(a, e) && f.push(e);
			for (; n.length > c;) r(a, e = n[c++]) && (~o(f, e) || f.push(e));
			return f
		}
	}, function(t, n, e) {
		var r = e(21),
			i = e(17),
			o = e(62);
		t.exports = function(t) {
			return function(n, e, u) {
				var a, c = r(n),
					f = i(c.length),
					s = o(u, f);
				if (t && e != e) {
					for (; f > s;) if ((a = c[s++]) != a) return !0
				} else for (; f > s; s++) if ((t || s in c) && c[s] === e) return t || s || 0;
				return !t && -1
			}
		}
	}, function(t, n, e) {
		var r = e(18),
			i = Math.max,
			o = Math.min;
		t.exports = function(t, n) {
			return t = r(t), t < 0 ? i(t + n, 0) : o(t, n)
		}
	}, function(t, n, e) {
		t.exports = e(2).document && document.documentElement
	}, function(t, n, e) {
		var r = e(11),
			i = e(26),
			o = e(23)("IE_PROTO"),
			u = Object.prototype;
		t.exports = Object.getPrototypeOf ||
		function(t) {
			return t = i(t), r(t, o) ? t[o] : "function" == typeof t.constructor && t instanceof t.constructor ? t.constructor.prototype : t instanceof Object ? u : null
		}
	}, function(t, n, e) {
		"use strict";
		var r = e(9),
			i = e(15),
			o = e(26),
			u = e(35),
			a = e(36),
			c = e(17),
			f = e(66),
			s = e(37);
		i(i.S + i.F * !e(67)(function(t) {
			Array.from(t)
		}), "Array", {
			from: function(t) {
				var n, e, i, l, p = o(t),
					d = "function" == typeof this ? this : Array,
					v = arguments.length,
					h = v > 1 ? arguments[1] : void 0,
					g = void 0 !== h,
					m = 0,
					y = s(p);
				if (g && (h = r(h, v > 2 ? arguments[2] : void 0, 2)), void 0 == y || d == Array && a(y)) for (n = c(p.length), e = new d(n); n > m; m++) f(e, m, g ? h(p[m], m) : p[m]);
				else for (l = y.call(p), e = new d; !(i = l.next()).done; m++) f(e, m, g ? u(l, h, [i.value, m], !0) : i.value);
				return e.length = m, e
			}
		})
	}, function(t, n, e) {
		"use strict";
		var r = e(3),
			i = e(20);
		t.exports = function(t, n, e) {
			n in t ? r.f(t, n, i(0, e)) : t[n] = e
		}
	}, function(t, n, e) {
		var r = e(0)("iterator"),
			i = !1;
		try {
			var o = [7][r]();
			o.
			return = function() {
				i = !0
			}, Array.from(o, function() {
				throw 2
			})
		} catch (t) {}
		t.exports = function(t, n) {
			if (!n && !i) return !1;
			var e = !1;
			try {
				var o = [7],
					u = o[r]();
				u.next = function() {
					return {
						done: e = !0
					}
				}, o[r] = function() {
					return u
				}, t(o)
			} catch (t) {}
			return e
		}
	}, function(t, n, e) {
		"use strict";

		function r(t) {
			var n = t.split(/[,=]/g),
				e = null,
				r = [],
				i = n.length;
			return /=/.test(t) && (e = n[i - 1].slice(0, -1), n.length = i - 1), n.forEach(function(t) {
				/[\d]/.test(t) && r.push(null === e ? t : t + "=" + e)
			}), r
		}
		function i(t) {
			if (!/[千百十个]{2,}/.test(t)) return t;
			var n = t.match(/^[\d千百十个]+/),
				e = void 0;
			return n && (e = n.join("")), /^([千百十个]{2,}\d+)+$/.test(e) ? t = t.replace(/([千百十个]+)(\d+)/g, function(t, n, e) {
				return n.split("").map(function(t) {
					return e + t
				}).join("")
			}) : /^(\d+[千百十个]{2,})+$/.test(e) && (t = t.replace(/(\d+)([千百十个]+)/g, function(t, n, e) {
				return e.split("").map(function(t) {
					return n + t
				}).join("")
			})), t
		}
		function o(t) {
			var n = /([二三四][定现])|(倒)/g;
			return t.split(/\n/).map(function(t) {
				var e = t.match(n);
				if (/,/.test(t) && n.test(t) && 1 === e.length) {
					var r = t.match(/=\d+/);
					return t.replace(/(([二三四][定现])|倒).*$/, "").split(",").map(function(t) {
						return t + e[0]
					}).join(",") + (r ? r[0] : "")
				}
				return t
			}).join("\n")
		}
		function u(t) {
			return t.split(/\n/).map(function(t) {
				if (/^(\d+[千百十个])|([千百十个]\d+)/.test(t)) {
					var n = t.match(/^[千百十个\d]+/)[0],
						e = n.match(/[千百十个]|\d+/g);
					if (e.length % 2 == 0) {
						for (var r = [], i = t.replace(e.join(""), ""), o = 0, u = e.length; o < u; o += 2) {
							var a = e[o],
								c = e[o + 1];
							/^\d+$/.test(a) && /^[千百十个]$/.test(c) ? r.push(a, c) : r.push(c, a)
						}
						return r.join("") + i
					}
					return t.replace(/^(\d+[千百十个])|([千百十个]\d+)/g, function(t, n, e) {
						var r = n || e;
						return /^[千百十个]/.test(r) ? r.replace(/([千百十个])(\d+)/g, "$2$1") : t
					})
				}
				return t
			}).join("\n")
		}
		function a(t) {
			return t.split(/\n/).map(function(n) {
				return /现/.test(t) ? n.replace(/(上奖)|倒/g, "") : n
			}).join("\n")
		}
		function c(t) {
			return t.split(/\n/).map(function(t) {
				return /=/.test(t) && !/=[\d\.]+$/.test(t) ? t.replace(/^(.*)(=\d+)(.*)$/, "$1$3$2") : t
			}).join("\n")
		}
		function f(t) {
			return t.split(/\n/g).map(function(t) {
				var n = t.split("="),
					e = (n[1] ? "=" + n[1] : "").replace(/ /g, "");
				return n[0].replace(/[ \.]+/g, ",") + e
			}).join("\n")
		}
		function s(t) {
			return t.split(/\n/).map(function(t) {
				var n = t.match(/^(\d+)在四置移(\d+)(.*)$/);
				if (n) {
					var e = n[1],
						r = n[2],
						i = n[3] || "",
						o = [];
					return v.pos.map(function(t) {
						o.push([t, e, "移", r, i].join(""))
					}), o.join("\n")
				}
				return t
			}).join("\n")
		}
		function l(t) {
			return t.split("\n").map(function(t) {
				if (!/^[\dx ]+(=\d+?)?$/gi.test(t)) return t;
				var n = t.match(/=\d+/g);
				n = n ? n[0] : "";
				var e = t.replace(/=\d+/, "").split("").map(function(t, n) {
					return "x" === t ? " x " : t
				}).join("").replace(/ +/g, " ").trim().split(" ");
				if (4 !== e.length) return t;
				var r = [];
				return e.forEach(function(t, n) {
					/^\d+$/.test(t) && r.push(v[String(n)] + t)
				}), r.push(n), r.join("")
			}).join("\n")
		}
		var p = e(4),
			d = function(t) {
				return t && t.__esModule ? t : {
				default:
					t
				}
			}(p),
			v = e(13),
			h = [
				[/[+X]/gi, "x"],
				[/(头奖)|(直码)|(四码)/g, "四定"],
				[/头/g, "千"],
				[/尾/g, "个"],
				[/中[肚间]/g, "百十"],
				[/不要?/g, "除"],
				[/要/g, "取"],
				[/小/g, v["小"]],
				[/大/g, v["大"]],
				[/单/g, v["单"]],
				[/(.)(双)(.?)/g, function(t, n, e, r) {
					var i = "";
					return "重" !== r && /[除取]/.test(n + r) ? (i = n + e + "重", /^[\d\.]+$/.test(r) ? i += "=" + r : i += r) : i = t, i
				}],
				[/双([^重])/g, v["双"] + "$1"],
				[/([双三]重?)([除取])/g, "$2$1"],
				[/([除取])([单双大小])(.)/g, function(t, n, e, r) {
					return "重" === r ? t : n + v[e] + r
				}],
				[/两/g, "二"],
				[/后[2二]数?/g, "十个"],
				[/前[2二]数?/g, "千百"],
				[/后[3三]数?/g, "百十个"],
				[/前[3三]数?/g, "千百十"],
				[/([二三四])字([定现])/g, "$1$2"],
				[/([二三四])定位/g, "$1定"],
				[/(全到)|(全倒)|到|转/g, "倒"],
				[/合分/g, "合"],
				[/和/g, "合"],
				[/[跑走]/g, "移"],
				[/上[将讲江]/g, "上奖"],
				[/([二三四])个(位置)/g, "$1$2"],
				[/(\d+)元/g, "=$1"],
				[/[各\-\/]/g, "="],
				[/=+/g, "="],
				[/[位与]/g, ""],
				[/([千百十个])合([千百十个])/, "$1$2"],
				[/[，、,。……]/g, "\n"],
				[/([一总]?共)?[\d一二三四五六七八九十]+[组注][，。、]?/g, ""],
				[/\.{2,}/g, "\n"],
				[/^(\d+)([二三四]定)/g, "$1倒$2"],
				[/(倒)(\d+)/g, "$1=$2"],
				[/([现定])([\d\.]+)/, "$1=$2"],
				[/=.*/g, function(t) {
					return "=" === t ? "" : t
				}]
			];
		t.exports = function(t) {
			t = t.trim(), h.forEach(function(n) {
				t = t.replace.apply(t, n)
			}), t = i(t), t = l(t), t = s(t), t = c(t), t = f(t), t = o(t), t = u(t), t = a(t), /=/.test(t) && (t = t.replace(/(=\d+\.?\d*)/g, "$1;").replace(/([^;])\n/g, "$1,").replace(/(=[\d\.]+;)[^=]+$/, "$1"));
			var n = [];
			return t.split(/\n/).map(function(t) {
				if ("" !== t) return n.push.apply(n, (0, d.
			default)(r(t)))
			}), n
		}
	}, function(t, n, e) {
		t.exports = {
		default:
			e(70), __esModule: !0
		}
	}, function(t, n, e) {
		e(71), e(29), e(72), e(75), e(83), t.exports = e(7).Set
	}, function(t, n) {}, function(t, n, e) {
		e(73);
		for (var r = e(2), i = e(5), o = e(12), u = e(0)("toStringTag"), a = ["NodeList", "DOMTokenList", "MediaList", "StyleSheetList", "CSSRuleList"], c = 0; c < 5; c++) {
			var f = a[c],
				s = r[f],
				l = s && s.prototype;
			l && !l[u] && i(l, u, f), o[f] = o.Array
		}
	}, function(t, n, e) {
		"use strict";
		var r = e(74),
			i = e(39),
			o = e(12),
			u = e(21);
		t.exports = e(19)(Array, "Array", function(t, n) {
			this._t = u(t), this._i = 0, this._k = n
		}, function() {
			var t = this._t,
				n = this._k,
				e = this._i++;
			return !t || e >= t.length ? (this._t = void 0, i(1)) : "keys" == n ? i(0, e) : "values" == n ? i(0, t[e]) : i(0, [e, t[e]])
		}, "values"), o.Arguments = o.Array, r("keys"), r("values"), r("entries")
	}, function(t, n) {
		t.exports = function() {}
	}, function(t, n, e) {
		"use strict";
		var r = e(76);
		t.exports = e(78)("Set", function(t) {
			return function() {
				return t(this, arguments.length > 0 ? arguments[0] : void 0)
			}
		}, {
			add: function(t) {
				return r.def(this, t = 0 === t ? 0 : t, t)
			}
		}, r)
	}, function(t, n, e) {
		"use strict";
		var r = e(3).f,
			i = e(31),
			o = e(40),
			u = e(9),
			a = e(41),
			c = e(14),
			f = e(27),
			s = e(19),
			l = e(39),
			p = e(77),
			d = e(6),
			v = e(42).fastKey,
			h = d ? "_s" : "size",
			g = function(t, n) {
				var e, r = v(n);
				if ("F" !== r) return t._i[r];
				for (e = t._f; e; e = e.n) if (e.k == n) return e
			};
		t.exports = {
			getConstructor: function(t, n, e, s) {
				var l = t(function(t, r) {
					a(t, l, n, "_i"), t._i = i(null), t._f = void 0, t._l = void 0, t[h] = 0, void 0 != r && f(r, e, t[s], t)
				});
				return o(l.prototype, {
					clear: function() {
						for (var t = this, n = t._i, e = t._f; e; e = e.n) e.r = !0, e.p && (e.p = e.p.n = void 0), delete n[e.i];
						t._f = t._l = void 0, t[h] = 0
					},
					delete: function(t) {
						var n = this,
							e = g(n, t);
						if (e) {
							var r = e.n,
								i = e.p;
							delete n._i[e.i], e.r = !0, i && (i.n = r), r && (r.p = i), n._f == e && (n._f = r), n._l == e && (n._l = i), n[h]--
						}
						return !!e
					},
					forEach: function(t) {
						a(this, l, "forEach");
						for (var n, e = u(t, arguments.length > 1 ? arguments[1] : void 0, 3); n = n ? n.n : this._f;) for (e(n.v, n.k, this); n && n.r;) n = n.p
					},
					has: function(t) {
						return !!g(this, t)
					}
				}), d && r(l.prototype, "size", {
					get: function() {
						return c(this[h])
					}
				}), l
			},
			def: function(t, n, e) {
				var r, i, o = g(t, n);
				return o ? o.v = e : (t._l = o = {
					i: i = v(n, !0),
					k: n,
					v: e,
					p: r = t._l,
					n: void 0,
					r: !1
				}, t._f || (t._f = o), r && (r.n = o), t[h]++, "F" !== i && (t._i[i] = o)), t
			},
			getEntry: g,
			setStrong: function(t, n, e) {
				s(t, n, function(t, n) {
					this._t = t, this._k = n, this._l = void 0
				}, function() {
					for (var t = this, n = t._k, e = t._l; e && e.r;) e = e.p;
					return t._t && (t._l = e = e ? e.n : t._t._f) ? "keys" == n ? l(0, e.k) : "values" == n ? l(0, e.v) : l(0, [e.k, e.v]) : (t._t = void 0, l(1))
				}, e ? "entries" : "values", !e, !0), p(n)
			}
		}
	}, function(t, n, e) {
		"use strict";
		var r = e(2),
			i = e(7),
			o = e(3),
			u = e(6),
			a = e(0)("species");
		t.exports = function(t) {
			var n = "function" == typeof i[t] ? i[t] : r[t];
			u && n && !n[a] && o.f(n, a, {
				configurable: !0,
				get: function() {
					return this
				}
			})
		}
	}, function(t, n, e) {
		"use strict";
		var r = e(2),
			i = e(15),
			o = e(42),
			u = e(16),
			a = e(5),
			c = e(40),
			f = e(27),
			s = e(41),
			l = e(8),
			p = e(25),
			d = e(3).f,
			v = e(79)(0),
			h = e(6);
		t.exports = function(t, n, e, g, m, y) {
			var x = r[t],
				b = x,
				_ = m ? "set" : "add",
				E = b && b.prototype,
				j = {};
			return h && "function" == typeof b && (y || E.forEach && !u(function() {
				(new b).entries().next()
			})) ? (b = n(function(n, e) {
				s(n, b, t, "_c"), n._c = new x, void 0 != e && f(e, m, n[_], n)
			}), v("add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON".split(","), function(t) {
				var n = "add" == t || "set" == t;
				t in E && (!y || "clear" != t) && a(b.prototype, t, function(e, r) {
					if (s(this, b, t), !n && y && !l(e)) return "get" == t && void 0;
					var i = this._c[t](0 === e ? 0 : e, r);
					return n ? this : i
				})
			}), "size" in E && d(b.prototype, "size", {
				get: function() {
					return this._c.size
				}
			})) : (b = g.getConstructor(n, t, m, _), c(b.prototype, e), o.NEED = !0), p(b, t), j[t] = b, i(i.G + i.W + i.F, j), y || g.setStrong(b, t, m), b
		}
	}, function(t, n, e) {
		var r = e(9),
			i = e(32),
			o = e(26),
			u = e(17),
			a = e(80);
		t.exports = function(t, n) {
			var e = 1 == t,
				c = 2 == t,
				f = 3 == t,
				s = 4 == t,
				l = 6 == t,
				p = 5 == t || l,
				d = n || a;
			return function(n, a, v) {
				for (var h, g, m = o(n), y = i(m), x = r(a, v, 3), b = u(y.length), _ = 0, E = e ? d(n, b) : c ? d(n, 0) : void 0; b > _; _++) if ((p || _ in y) && (h = y[_], g = x(h, _, m), t)) if (e) E[_] = g;
				else if (g) switch (t) {
				case 3:
					return !0;
				case 5:
					return h;
				case 6:
					return _;
				case 2:
					E.push(h)
				} else if (s) return !1;
				return l ? -1 : f || s ? s : E
			}
		}
	}, function(t, n, e) {
		var r = e(81);
		t.exports = function(t, n) {
			return new(r(t))(n)
		}
	}, function(t, n, e) {
		var r = e(8),
			i = e(82),
			o = e(0)("species");
		t.exports = function(t) {
			var n;
			return i(t) && (n = t.constructor, "function" != typeof n || n !== Array && !i(n.prototype) || (n = void 0), r(n) && null === (n = n[o]) && (n = void 0)), void 0 === n ? Array : n
		}
	}, function(t, n, e) {
		var r = e(22);
		t.exports = Array.isArray ||
		function(t) {
			return "Array" == r(t)
		}
	}, function(t, n, e) {
		var r = e(15);
		r(r.P + r.R, "Set", {
			toJSON: e(84)("Set")
		})
	}, function(t, n, e) {
		var r = e(38),
			i = e(85);
		t.exports = function(t) {
			return function() {
				if (r(this) != t) throw TypeError(t + "#toJSON isn't generic");
				return i(this)
			}
		}
	}, function(t, n, e) {
		var r = e(27);
		t.exports = function(t, n) {
			var e = [];
			return r(t, !1, e.push, e, n), e
		}
	}, function(t, n, e) {
		"use strict";
		var r = e(4),
			i = function(t) {
				return t && t.__esModule ? t : {
				default:
					t
				}
			}(r),
			o = e(1);
		n.ding = function(t, n) {
			var e = ["X", "X", "X", "X"],
				r = [];
			return e.length = 4 - t, o.CPrint(n, t).forEach(function(t) {
				r.push.apply(r, (0, i.
			default)(o.APrint(t.concat(e), 4)))
			}), o.deduplication(r)
		}
	}, function(t, n, e) {
		"use strict";
		var r = e(4),
			i = function(t) {
				return t && t.__esModule ? t : {
				default:
					t
				}
			}(r),
			o = e(13),
			u = e(1);
		t.exports = function(t) {
			var n = t.replace(/[^\d]+/g, ""),
				e = o[t.match(/([二三四])置/)[1]],
				r = n.length,
				a = [];
			if (4 === e) for (var c = 0; c < r; c++) for (var f = 0; f < r; f++) for (var s = 0; s < r; s++) for (var l = 0; l < r; l++) a.push([n[c], n[f], n[s], n[l]].join(""));
			else if (3 === e) for (var p = 0; p < r; p++) for (var d = 0; d < r; d++) for (var v = 0; v < r; v++) a.push.apply(a, (0, i.
		default)(u.APrint([n[p], n[d], n[v], "X"])));
			else if (2 === e) for (var h = 0; h < r; h++) for (var g = 0; g < r; g++) a.push.apply(a, (0, i.
		default)(u.APrint([n[h], n[g], "X", "X"])));
			return {
				status: !0,
				list: u.deduplication(a)
			}
		}
	}, function(t, n, e) {
		"use strict";
		var r = e(4),
			i = function(t) {
				return t && t.__esModule ? t : {
				default:
					t
				}
			}(r),
			o = e(1),
			u = e(89);
		n.ding = function(t, n) {
			var e = [];
			switch (t) {
			case 2:
				o.CPrint(n, 2).map(function(t) {
					e.push.apply(e, (0, i.
				default)(u.twoFixedShangjiang.apply(u, (0, i.
				default)(t))))
				});
				break;
			case 3:
				o.CPrint(n, 3).map(function(t) {
					e.push.apply(e, (0, i.
				default)(u.threeFixedShangjiang.apply(u, (0, i.
				default)(t))))
				});
				break;
			case 4:
				o.CPrint(n, 4).map(function(t) {
					e.push.apply(e, (0, i.
				default)(u.fourFixedShangjiang.apply(u, (0, i.
				default)(t))))
				})
			}
			return e
		}
	}, function(t, n, e) {
		"use strict";
		var r = e(4),
			i = function(t) {
				return t && t.__esModule ? t : {
				default:
					t
				}
			}(r),
			o = e(1);
		n.twoFixedShangjiang = function(t, n) {
			var e = "x",
				r = [];
			if (arguments.length > 1) r = o.APrint([t, n, e, e], 4);
			else if (1 === arguments.length) for (var u = 0; u < 10; u++) {
				var a;
				(a = r).push.apply(a, (0, i.
			default)(o.APrint([t, u, e, e], 4)))
			}
			return r
		}, n.threeFixedShangjiang = function(t, n, e) {
			var r = arguments.length,
				u = [];
			if (r > 2) u = o.APrint([t, n, e, "x"], 4);
			else if (2 === r) for (var a = 0; a < 10; a++) {
				var c;
				(c = u).push.apply(c, (0, i.
			default)(o.APrint([t, n, a, "x"], 4)))
			} else if (1 === r) for (var f = 0; f < 10; f++) for (var s = 0; s < 10; s++) {
				var l;
				(l = u).push.apply(l, (0, i.
			default)(o.APrint([t, f, s, "x"], 4)))
			}
			return u
		}, n.fourFixedShangjiang = function(t, n, e, r) {
			var u = arguments.length,
				a = [],
				c = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
			return 4 === u ? a = o.APrint([t, n, e, r]) : 3 === u ? o.CPrint(c, 1).forEach(function(r) {
				var u;
				(u = a).push.apply(u, (0, i.
			default)(o.APrint([t, n, e].concat(r))))
			}) : 2 === u ? (o.CPrint(c, 2).forEach(function(e) {
				var r;
				(r = a).push.apply(r, (0, i.
			default)(o.APrint([t, n].concat(e))))
			}), o.CPrint(c, 1).forEach(function(e) {
				var r;
				(r = a).push.apply(r, (0, i.
			default)(o.APrint([t, n].concat(e, e))))
			})) : 1 === u && (o.CPrint(c, 3).forEach(function(n) {
				var e;
				(e = a).push.apply(e, (0, i.
			default)(o.APrint([t].concat(n))))
			}), o.CPrint(c, 2).forEach(function(n) {
				var e, r;
				(e = a).push.apply(e, (0, i.
			default)(o.APrint([t].concat(n, n[0])))), (r = a).push.apply(r, (0, i.
			default)(o.APrint([t].concat(n, n[1]))))
			}), o.CPrint(c, 1).forEach(function(n) {
				var e;
				(e = a).push.apply(e, (0, i.
			default)(o.APrint([t].concat(n, n, n))))
			})), a
		}
	}, function(t, n, e) {
		"use strict";

		function r(t, n, e, r) {
			var i = [],
				a = u.x();
			return a.length = 4 - t, n.forEach(function(t) {
				u.combFromSum(t, e).forEach(function(t) {
					r ? i.push.apply(i, (0, o.
				default)(u.APrint(a.concat(t.split(""))))) : i.push(t + "现")
				})
			}), i
		}
		var i = e(4),
			o = function(t) {
				return t && t.__esModule ? t : {
				default:
					t
				}
			}(i),
			u = e(1);
		n.ding = function(t, n, e) {
			return r.bind.apply(r, [this].concat(Array.prototype.slice.call(arguments)))(!0)
		}, n.xian = function(t, n, e) {
			return r.bind.apply(r, [this].concat(Array.prototype.slice.call(arguments)))(!1)
		}, n.all = r
	}, function(t, n, e) {
		"use strict";
		var r = e(1),
			i = e(13);
		e(43), t.exports = function(t) {
			var n = t.match(/(\d+[千百十个])/g),
				e = [],
				o = [],
				u = 2,
				a = t.match(/([二三四])定/);
			a && (u = i[a[1]]);
			var c = r.deduplication(t.replace(/(\d+[千百十个])+/g, "").match(/(\d+)/)[1].split(""));
			if (c.length < u - 1) return [];
			var f = ["x", "x", "x"];
			return r.CPrint(c, u - 1).forEach(function(t) {
				Array.prototype.push.apply(e, r.APrint(t.concat(f.slice(0, 4 - u))))
			}), n.forEach(function(t) {
				var n = r.deduplication(t.match(/\d/g)),
					u = i[t.replace(/\d+/, "")];
				e.forEach(function(t) {
					n.forEach(function(n) {
						var e = t.split("");
						e.splice(u, 0, n), o.push(e.join(""))
					})
				})
			}), o
		}
	}, function(t, n, e) {
		"use strict";
		var r = e(1);
		t.exports = function(t, n) {
			var e = "取" === t.match(/[取除]/)[0],
				i = t.replace(/[取除]/, "");
			if (/^\d+$/.test(i)) {
				var o = new RegExp("^[" + i + "x]+$", "i");
				n = n.filter(function(t) {
					return e ? o.test(t) : !o.test(t)
				})
			} else "双重" === i ? n = n.filter(function(t) {
				var n = t.replace(/x/gi, "").split(""),
					i = r.getDuplication(n).times >= 2;
				return e ? i : !i
			}) : "三重" === i && (n = n.filter(function(t) {
				var n = t.replace(/x/gi, "").split(""),
					i = r.getDuplication(n).times >= 3;
				return e ? i : !i
			}));
			return n
		}
	}]);
	exports.viewmodel = Kuaiyi;
})