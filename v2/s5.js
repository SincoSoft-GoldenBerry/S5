/**
 * @license S5.js v2.0.27
 * (c) 2015-2020 Sincosoft, Inc. http://sinco.com.co
 * 
 * Creation date: 27/02/2018
 * Last change: 21/07/2020
 *
 * by GoldenBerry
**/

((win, doc, fac) => {

    const o = Object;
    const a = Array;
    const s = String;
    const j = JSON;

    if ( !('classList' in doc.createElementNS('http://www.w3.org/2000/svg', 'g')) ){
        let d = o.getOwnPropertyDescriptor(HTMLElement.prototype, 'classList');
        o.defineProperty(SVGElement.prototype, 'classList', d);
    }

    a.prototype.clean = function (d) {
        for (let i = 0; i < this.length; i++) {
            if (this[i] == d) {
                this.splice(i, 1);
                i--;
            }
        }
        return this;
    };

    a.prototype.unique = function () {
        let u = {}, a = [];
        for (let i = 0, l = this.length; i < l; ++i) {
            if (u.hasOwnProperty(this[i])) {
                continue;
            }
            a.push(this[i]);
            u[this[i]] = 1;
        }
        return a;
    };

    a.prototype.contains = function (searchElement /*, fromIndex*/ ) {
        'use strict';
        const O = o(this);
        const len = parseInt(O.length) || 0;
        if (len === 0) {
            return false;
        }
        const n = parseInt(arguments[1]) || 0;
        let k;
        if (n >= 0) {
            k = n;
        } else {
            k = len + n;
            if (k < 0) {k = 0;}
        }
        let currentElement;
        while (k < len) {
            currentElement = O[k];
            if (searchElement === currentElement ||
                (searchElement !== searchElement && currentElement !== currentElement)) {
                return true;
            }
            k++;
        }
        return false;
    };

    const __lists = o.getOwnPropertyNames(win).filter(x => x.endsWith('List') || x.indexOf('Array') >= 0);

    const Iterator = function (a) {
        this.reset = function () {
            this.value = null;
            this.index = -1;
        }

        this.next = function () {
            if (this.index < a.length) {
                this.index++;
                this.value = a[this.index];
                return this.index < a.length;
            }
            return false;
        }

        this.reset();
    };

    __lists.forEach(n => {
        let __type = win[n];
        __type.prototype.stream = function () {
            if (this == void(0) || this === null || !(this instanceof __type))
                throw new TypeError();

            return new Iterator(this);
        };
    });

    s.prototype.replaceAll = function (rThis, rWith) {
        return this.replace(new RegExp(rThis, 'g'), rWith);
    };

    s.format = s.prototype.format = function () {
        let i = 0, l = 0;
        let str = (typeof this == 'function' && !(i++)) ? arguments[0] : this;

        while (i < arguments.length) {
            str = str.replaceAll('\\{' + l + '\\}', arguments[i]);
            i++; l++;
        }

        return str;
    };

    s.concat = function () {
        let args = a.prototype.slice.call(arguments);
        return args.shift().concat(...args);
    };

    s.toAESEncrypt = s.prototype.toAESEncrypt = function () {
        if (typeof CryptoJS === 'undefined') {
            throw new SincoInitializationError('¡Falta la referencia de AES.js!');
        }

        let text = '';
        let key = CryptoJS.enc.Utf8.parse(s.concat(s.fromCharCode(53), s.fromCharCode(49), s.fromCharCode(110),
            s.fromCharCode(99), s.fromCharCode(48), s.fromCharCode(115), s.fromCharCode(111),
            s.fromCharCode(102), s.fromCharCode(116), s.fromCharCode(95), s.fromCharCode(53),
            s.fromCharCode(46), s.fromCharCode(65), s.fromCharCode(46), s.fromCharCode(53),
            s.fromCharCode(46))); //Mismo KEY usado en C#


        let setKey = k => {
            let _k = [];
            for (let i = 0; i < k.length; i += 4) {
                if (k[i + 1]) {
                    _k.push(k[i] + k[i + 1]);
                }
            }
            k = new Uint8Array(_k);
            let r = s.fromCharCode.apply(s, k);
            key = CryptoJS.enc.Utf8.parse(r);
        }

        if (typeof (this) == 'function') {
            text = arguments[0];
            if (arguments[1]) {
                setKey(arguments[1]);
            }
        }
        else {
            text = this;
            if (arguments[0]) {
                setKey(arguments[0]);
            }
        }

        const iv = CryptoJS.enc.Utf8.parse(s.concat(s.fromCharCode(95), s.fromCharCode(84), s.fromCharCode(49),
            s.fromCharCode(99), s.fromCharCode(115), s.fromCharCode(124), s.fromCharCode(70),
            s.fromCharCode(111), s.fromCharCode(110), s.fromCharCode(42), s.fromCharCode(53),
            s.fromCharCode(111), s.fromCharCode(95), s.fromCharCode(83), s.fromCharCode(52),
            s.fromCharCode(53))); //Mismo IV usado en C#

        const valorIterar = Math.floor((Math.random() * 9) + 1);

        const iterar = (final, text, key, iv) => {
            let textoCrypto;

            textoCrypto = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), key,
                {
                    keySize: 16,
                    iv: iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                });
            if (final > 0) {
                return iterar(final - 1, textoCrypto, key, iv);
            } else {
                return textoCrypto;
            }
        }

        return iterar(valorIterar, text, key, iv).toString() + valorIterar;
    };

    j.tryParse = str => {
        try {
            return j.parse(str);
        }
        catch (e) {
            return { messageError: e.message };
        }
    };

    //Pollyfill RegisterElement
    if (!doc.registerElement) {
        (function (e, t) { "use strict"; function Ht() { var e = wt.splice(0, wt.length); Et = 0; while (e.length) e.shift().call(null, e.shift()) } function Bt(e, t) { for (var n = 0, r = e.length; n < r; n++) Jt(e[n], t) } function jt(e) { for (var t = 0, n = e.length, r; t < n; t++) r = e[t], Pt(r, A[It(r)]) } function Ft(e) { return function (t) { ut(t) && (Jt(t, e), O.length && Bt(t.querySelectorAll(O), e)) } } function It(e) { var t = ht.call(e, "is"), n = e.nodeName.toUpperCase(), r = _.call(L, t ? N + t.toUpperCase() : T + n); return t && -1 < r && !qt(n, t) ? -1 : r } function qt(e, t) { return -1 < O.indexOf(e + '[is="' + t + '"]') } function Rt(e) { var t = e.currentTarget, n = e.attrChange, r = e.attrName, i = e.target, s = e[y] || 2, o = e[w] || 3; kt && (!i || i === t) && t[h] && r !== "style" && (e.prevValue !== e.newValue || e.newValue === "" && (n === s || n === o)) && t[h](r, n === s ? null : e.prevValue, n === o ? null : e.newValue) } function Ut(e) { var t = Ft(e); return function (e) { wt.push(t, e.target), Et && clearTimeout(Et), Et = setTimeout(Ht, 1) } } function zt(e) { Ct && (Ct = !1, e.currentTarget.removeEventListener(S, zt)), O.length && Bt((e.target || n).querySelectorAll(O), e.detail === l ? l : a), st && Vt() } function Wt(e, t) { var n = this; vt.call(n, e, t), Lt.call(n, { target: n }) } function Xt(e, t) { nt(e, t), Mt ? Mt.observe(e, yt) : (Nt && (e.setAttribute = Wt, e[o] = Ot(e), e[u](x, Lt)), e[u](E, Rt)), e[m] && kt && (e.created = !0, e[m](), e.created = !1) } function Vt() { for (var e, t = 0, n = at.length; t < n; t++) e = at[t], M.contains(e) || (n--, at.splice(t--, 1), Jt(e, l)) } function $t(e) { throw new Error("A " + e + " type is already registered") } function Jt(e, t) { var n, r = It(e), i; -1 < r && (Dt(e, A[r]), r = 0, t === a && !e[a] ? (e[l] = !1, e[a] = !0, i = "connected", r = 1, st && _.call(at, e) < 0 && at.push(e)) : t === l && !e[l] && (e[a] = !1, e[l] = !0, i = "disconnected", r = 1), r && (n = e[t + f] || e[i + f]) && n.call(e)) } function Kt() { } function Qt(e, t, r) { var i = r && r[c] || "", o = t.prototype, u = tt(o), a = t.observedAttributes || j, f = { prototype: u }; ot(u, m, { value: function () { if (Q) Q = !1; else if (!this[W]) { this[W] = !0, new t(this), o[m] && o[m].call(this); var e = G[Z.get(t)]; (!V || e.create.length > 1) && Zt(this) } } }), ot(u, h, { value: function (e) { -1 < _.call(a, e) && o[h].apply(this, arguments) } }), o[d] && ot(u, p, { value: o[d] }), o[v] && ot(u, g, { value: o[v] }), i && (f[c] = i), e = e.toUpperCase(), G[e] = { constructor: t, create: i ? [i, et(e)] : [e] }, Z.set(t, e), n[s](e.toLowerCase(), f), en(e), Y[e].r() } function Gt(e) { var t = G[e.toUpperCase()]; return t && t.constructor } function Yt(e) { return typeof e == "string" ? e : e && e.is || "" } function Zt(e) { var t = e[h], n = t ? e.attributes : j, r = n.length, i; while (r--) i = n[r], t.call(e, i.name || i.nodeName, null, i.value || i.nodeValue) } function en(e) { return e = e.toUpperCase(), e in Y || (Y[e] = {}, Y[e].p = new K(function (t) { Y[e].r = t })), Y[e].p } function tn() { X && delete e.customElements, B(e, "customElements", { configurable: !0, value: new Kt }), B(e, "CustomElementRegistry", { configurable: !0, value: Kt }); for (var t = function (t) { var r = e[t]; if (r) { e[t] = function (t) { var i, s; return t || (t = this), t[W] || (Q = !0, i = G[Z.get(t.constructor)], s = V && i.create.length === 1, t = s ? Reflect.construct(r, j, i.constructor) : n.createElement.apply(n, i.create), t[W] = !0, Q = !1, s || Zt(t)), t }, e[t].prototype = r.prototype; try { r.prototype.constructor = e[t] } catch (i) { z = !0, B(r, W, { value: e[t] }) } } }, r = i.get(/^HTML[A-Z]*[a-z]/), o = r.length; o--; t(r[o])); n.createElement = function (e, t) { var n = Yt(t); return n ? gt.call(this, e, et(n)) : gt.call(this, e) }, St || (Tt = !0, n[s]("")) } var n = e.document, r = e.Object, i = function (e) { var t = /^[A-Z]+[a-z]/, n = function (e) { var t = [], n; for (n in s) e.test(n) && t.push(n); return t }, i = function (e, t) { t = t.toLowerCase(), t in
        s || (s[e] = (s[e] || []).concat(t), s[t] = s[t.toUpperCase()] = e) }, s = (r.create || r)(null), o = {}, u, a, f, l; for (a in e) for (l in e[a]) { f = e[a][l], s[l] = f; for (u = 0; u < f.length; u++) s[f[u].toLowerCase()] = s[f[u].toUpperCase()] = l } return o.get = function (r) { return typeof r == "string" ? s[r] || (t.test(r) ? [] : "") : n(r) }, o.set = function (n, r) { return t.test(n) ? i(n, r) : i(r, n), o }, o }({ collections: { HTMLAllCollection: ["all"], HTMLCollection: ["forms"], HTMLFormControlsCollection: ["elements"], HTMLOptionsCollection: ["options"] }, elements: { Element: ["element"], HTMLAnchorElement: ["a"], HTMLAppletElement: ["applet"], HTMLAreaElement: ["area"], HTMLAttachmentElement: ["attachment"], HTMLAudioElement: ["audio"], HTMLBRElement: ["br"], HTMLBaseElement: ["base"], HTMLBodyElement: ["body"], HTMLButtonElement: ["button"], HTMLCanvasElement: ["canvas"], HTMLContentElement: ["content"], HTMLDListElement: ["dl"], HTMLDataElement: ["data"], HTMLDataListElement: ["datalist"], HTMLDetailsElement: ["details"], HTMLDialogElement: ["dialog"], HTMLDirectoryElement: ["dir"], HTMLDivElement: ["div"], HTMLDocument: ["document"], HTMLElement: ["element", "abbr", "address", "article", "aside", "b", "bdi", "bdo", "cite", "code", "command", "dd", "dfn", "dt", "em", "figcaption", "figure", "footer", "header", "i", "kbd", "mark", "nav", "noscript", "rp", "rt", "ruby", "s", "samp", "section", "small", "strong", "sub", "summary", "sup", "u", "var", "wbr"], HTMLEmbedElement: ["embed"], HTMLFieldSetElement: ["fieldset"], HTMLFontElement: ["font"], HTMLFormElement: ["form"], HTMLFrameElement: ["frame"], HTMLFrameSetElement: ["frameset"], HTMLHRElement: ["hr"], HTMLHeadElement: ["head"], HTMLHeadingElement: ["h1", "h2", "h3", "h4", "h5", "h6"], HTMLHtmlElement: ["html"], HTMLIFrameElement: ["iframe"], HTMLImageElement: ["img"], HTMLInputElement: ["input"], HTMLKeygenElement: ["keygen"], HTMLLIElement: ["li"], HTMLLabelElement: ["label"], HTMLLegendElement: ["legend"], HTMLLinkElement: ["link"], HTMLMapElement: ["map"], HTMLMarqueeElement: ["marquee"], HTMLMediaElement: ["media"], HTMLMenuElement: ["menu"], HTMLMenuItemElement: ["menuitem"], HTMLMetaElement: ["meta"], HTMLMeterElement: ["meter"], HTMLModElement: ["del", "ins"], HTMLOListElement: ["ol"], HTMLObjectElement: ["object"], HTMLOptGroupElement: ["optgroup"], HTMLOptionElement: ["option"], HTMLOutputElement: ["output"], HTMLParagraphElement: ["p"], HTMLParamElement: ["param"], HTMLPictureElement: ["picture"], HTMLPreElement: ["pre"], HTMLProgressElement: ["progress"], HTMLQuoteElement: ["blockquote", "q", "quote"], HTMLScriptElement: ["script"], HTMLSelectElement: ["select"], HTMLShadowElement: ["shadow"], HTMLSlotElement: ["slot"], HTMLSourceElement: ["source"], HTMLSpanElement: ["span"], HTMLStyleElement: ["style"], HTMLTableCaptionElement: ["caption"], HTMLTableCellElement: ["td", "th"], HTMLTableColElement: ["col", "colgroup"], HTMLTableElement: ["table"], HTMLTableRowElement: ["tr"], HTMLTableSectionElement: ["thead", "tbody", "tfoot"], HTMLTemplateElement: ["template"], HTMLTextAreaElement: ["textarea"], HTMLTimeElement: ["time"], HTMLTitleElement: ["title"], HTMLTrackElement: ["track"], HTMLUListElement: ["ul"], HTMLUnknownElement: ["unknown", "vhgroupv", "vkeygen"], HTMLVideoElement: ["video"] }, nodes: { Attr: ["node"], Audio: ["audio"], CDATASection: ["node"], CharacterData: ["node"], Comment: ["#comment"], Document: ["#document"], DocumentFragment: ["#document-fragment"], DocumentType: ["node"], HTMLDocument: ["#document"], Image: ["img"], Option: ["option"], ProcessingInstruction: ["node"], ShadowRoot: ["#shadow-root"], Text: ["#text"], XMLDocument: ["xml"] } }); typeof t != "object" && (t = { type: t || "auto" }); var s = "registerElement", o = "__" + s + (e.Math.random() * 1e5 >> 0), u = "addEventListener", a = "attached", f = "Callback", l = "detached", c = "extends", h = "attributeChanged" + f, p = a + f, d = "connected" + f, v = "disconnected" + f, m = "created" + f, g = l + f, y = "ADDITION", b = "MODIFICATION", w = "REMOVAL", E 
        = "DOMAttrModified", S = "DOMContentLoaded", x = "DOMSubtreeModified", T = "<", N = "=", C = /^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/, k = ["ANNOTATION-XML", "COLOR-PROFILE", "FONT-FACE", "FONT-FACE-SRC", "FONT-FACE-URI", "FONT-FACE-FORMAT", "FONT-FACE-NAME", "MISSING-GLYPH"], L = [], A = [], O = "", M = n.documentElement, _ = L.indexOf || function (e) { for (var t = this.length; t-- && this[t] !== e;); return t }, D = r.prototype, P = D.hasOwnProperty, H = D.isPrototypeOf, B = r.defineProperty, j = [], F = r.getOwnPropertyDescriptor, I = r.getOwnPropertyNames, q = r.getPrototypeOf, R = r.setPrototypeOf, U = !!r.__proto__, z = !1, W = "__dreCEv1", X = e.customElements, V = !/^force/.test(t.type) && !!(X && X.define && X.get && X.whenDefined), $ = r.create || r, J = e.Map || function () { var t = [], n = [], r; return { get: function (e) { return n[_.call(t, e)] }, set: function (e, i) { r = _.call(t, e), r < 0 ? n[t.push(e) - 1] = i : n[r] = i } } }, K = e.Promise || function (e) { function i(e) { n = !0; while (t.length) t.shift()(e) } var t = [], n = !1, r = { "catch": function () { return r }, then: function (e) { return t.push(e), n && setTimeout(i, 1), r } }; return e(i), r }, Q = !1, G = $(null), Y = $(null), Z = new J, et = function (e) { return e.toLowerCase() }, tt = r.create || function sn(e) { return e ? (sn.prototype = e, new sn) : this }, nt = R || (U ? function (e, t) { return e.__proto__ = t, e } : I && F ? function () { function e(e, t) { for (var n, r = I(t), i = 0, s = r.length; i < s; i++) n = r[i], P.call(e, n) || B(e, n, F(t, n)) } return function (t, n) { do e(t, n); while ((n = q(n)) && !H.call(n, t)); return t } }() : function (e, t) { for (var n in t) e[n] = t[n]; return e }), rt = e.MutationObserver || e.WebKitMutationObserver, it = (e.HTMLElement || e.Element || e.Node).prototype, st = !H.call(it, M), ot = st ? function (e, t, n) { return e[t] = n.value, e } : B, ut = st ? function (e) { return e.nodeType === 1 } : function (e) { return H.call(it, e) }, at = st && [], ft = it.attachShadow, lt = it.cloneNode, ct = it.dispatchEvent, ht = it.getAttribute, pt = it.hasAttribute, dt = it.removeAttribute, vt = it.setAttribute, mt = n.createElement, gt = mt, yt = rt && { attributes: !0, characterData: !0, attributeOldValue: !0 }, bt = rt || function (e) { Nt = !1, M.removeEventListener(E, bt) }, wt, Et = 0, St = s in n && !/^force-all/.test(t.type), xt = !0, Tt = !1, Nt = !0, Ct = !0, kt = !0, Lt, At, Ot, Mt, _t, Dt, Pt; St || (R || U ? (Dt = function (e, t) { H.call(t, e) || Xt(e, t) }, Pt = Xt) : (Dt = function (e, t) { e[o] || (e[o] = r(!0), Xt(e, t)) }, Pt = Dt), st ? (Nt = !1, function () { var e = F(it, u), t = e.value, n = function (e) { var t = new CustomEvent(E, { bubbles: !0 }); t.attrName = e, t.prevValue = ht.call(this, e), t.newValue = null, t[w] = t.attrChange = 2, dt.call(this, e), ct.call(this, t) }, r = function (e, t) { var n = pt.call(this, e), r = n && ht.call(this, e), i = new CustomEvent(E, { bubbles: !0 }); vt.call(this, e, t), i.attrName = e, i.prevValue = n ? r : null, i.newValue = t, n ? i[b] = i.attrChange = 1 : i[y] = i.attrChange = 0, ct.call(this, i) }, i = function (e) { var t = e.currentTarget, n = t[o], r = e.propertyName, i; n.hasOwnProperty(r) && (n = n[r], i = new CustomEvent(E, { bubbles: !0 }), i.attrName = n.name, i.prevValue = n.value || null, i.newValue = n.value = t[r] || null, i.prevValue == null ? i[y] = i.attrChange = 0 : i[b] = i.attrChange = 1, ct.call(t, i)) }; e.value = function (e, s, u) { e === E && this[h] && this.setAttribute !== r && (this[o] = { className: { name: "class", value: this.className } }, this.setAttribute = r, this.removeAttribute = n, t.call(this, "propertychange", i)), t.call(this, e, s, u) }, B(it, u, e) }()) : rt || (M[u](E, bt), M.setAttribute(o, 1), M.removeAttribute(o), Nt && (Lt = function (e) { var t = this, n, r, i; if (t === e.target) { n = t[o], t[o] = r = Ot(t); for (i in r) { if (!(i in n)) return At(0, t, i, n[i], r[i], y); if (r[i] !== n[i]) return At(1, t, i, n[i], r[i], b) } for (i in n) if (!(i in r)) return At(2, t, i, n[i]
        , r[i], w) } }, At = function (e, t, n, r, i, s) { var o = { attrChange: e, currentTarget: t, attrName: n, prevValue: r, newValue: i }; o[s] = e, Rt(o) }, Ot = function (e) { for (var t, n, r = {}, i = e.attributes, s = 0, o = i.length; s < o; s++) t = i[s], n = t.name, n !== "setAttribute" && (r[n] = t.value); return r })), n[s] = function (t, r) { p = t.toUpperCase(), xt && (xt = !1, rt ? (Mt = function (e, t) { function n(e, t) { for (var n = 0, r = e.length; n < r; t(e[n++])); } return new rt(function (r) { for (var i, s, o, u = 0, a = r.length; u < a; u++) i = r[u], i.type === "childList" ? (n(i.addedNodes, e), n(i.removedNodes, t)) : (s = i.target, kt && s[h] && i.attributeName !== "style" && (o = ht.call(s, i.attributeName), o !== i.oldValue && s[h](i.attributeName, i.oldValue, o))) }) }(Ft(a), Ft(l)), _t = function (e) { return Mt.observe(e, { childList: !0, subtree: !0 }), e }, _t(n), ft && (it.attachShadow = function () { return _t(ft.apply(this, arguments)) })) : (wt = [], n[u]("DOMNodeInserted", Ut(a)), n[u]("DOMNodeRemoved", Ut(l))), n[u](S, zt), n[u]("readystatechange", zt), it.cloneNode = function (e) { var t = lt.call(this, !!e), n = It(t); return -1 < n && Pt(t, A[n]), e && O.length && jt(t.querySelectorAll(O)), t }); if (Tt) return Tt = !1; -2 < _.call(L, N + p) + _.call(L, T + p) && $t(t); if (!C.test(p) || -1 < _.call(k, p)) throw new Error("The type " + t + " is invalid"); var i = function () { return o ? n.createElement(f, p) : n.createElement(f) }, s = r || D, o = P.call(s, c), f = o ? r[c].toUpperCase() : p, p, d; return o && -1 < _.call(L, T + f) && $t(f), d = L.push((o ? N : T) + p) - 1, O = O.concat(O.length ? "," : "", o ? f + '[is="' + t.toLowerCase() + '"]' : f), i.prototype = A[d] = P.call(s, "prototype") ? s.prototype : tt(it), O.length && Bt(n.querySelectorAll(O), a), i }, n.createElement = gt = function (e, t) { var r = Yt(t), i = r ? mt.call(n, e, et(r)) : mt.call(n, e), s = "" + e, o = _.call(L, (r ? N : T) + (r || s).toUpperCase()), u = -1 < o; return r && (i.setAttribute("is", r = r.toLowerCase()), u && (u = qt(s.toUpperCase(), r))), kt = !n.createElement.innerHTMLHelper, u && Pt(i, A[o]), i }), Kt.prototype = { constructor: Kt, define: V ? function (e, t, n) { if (n) Qt(e, t, n); else { var r = e.toUpperCase(); G[r] = { constructor: t, create: [r] }, Z.set(t, r), X.define(e, t) } } : Qt, get: V ? function (e) { return X.get(e) || Gt(e) } : Gt, whenDefined: V ? function (e) { return K.race([X.whenDefined(e), en(e)]) } : en }; if (!X || /^force/.test(t.type)) tn(); else if (!t.noBuiltIn) try { (function (t, r, i) { r[c] = "a", t.prototype = tt(HTMLAnchorElement.prototype), t.prototype.constructor = t, e.customElements.define(i, t, r); if (ht.call(n.createElement("a", { is: i }), "is") !== i || V && ht.call(new t, "is") !== i) throw r })(function on() { return Reflect.construct(HTMLAnchorElement, [], on) }, {}, "document-register-element-a") } catch (nn) { tn() } if (!t.noBuiltIn) try { mt.call(n, "a", "a") } catch (rn) { et = function (e) { return { is: e.toLowerCase() } } } })(win);
    }

    const isFirefox =   navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    const isMobile =    navigator.isMobile || /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    const isIE =        navigator.appName == 'Microsoft Internet Exporer' ||
                        !!(navigator.userAgent.match(/Trident/) ||
                        navigator.userAgent.match(/rv 11/) ||
                        navigator.userAgent.match(/edge/i));

    const versionIE = (_ => {
        let rv = -1;
        if (isIE) {
            let ua = navigator.userAgent;
            let re = new RegExp((ua.lastIndexOf('rv:') > 0 ? 'rv:' : (ua.lastIndexOf('MSIE ') > 0 ? 'MSIE ' : 'Edge/')) + "([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null) {
                rv = parseFloat(RegExp.$1);
            }
        }
        return rv;
    })();

    /**
     * @name SincoInitializationError
     * 
     * @description Objeto que muestra una excepción al inicializar un objeto de S5/Sinco
     * @param {String} m String para mostrar como mensaje de error
     */
    const SincoInitializationError = function (m) {
        this.name = 'Sinco Initialization Error';
        this.message = m;
    }
    SincoInitializationError.prototype = Error.prototype;

    const def = (n, v, d = win, c = false) => {
        const definition = {
            enumerable: false,
            configurable: c
        };
        if (definition.configurable){
            definition.value = v;
        }
        else{
            definition.get = _ => v;
            definition.set = _ => { throw new ReferenceError(`¡El elemento "${n}" no se puede eliminar ni reasignar!`); };
        }
        o.defineProperty(d, n, definition);
    };

    const s5def = fac(win, doc, a, o, s, j, (doc.currentScript || { src:'' }).src);

    const fnSwitch = (...[selector, ...params]) => {
        if (!selector) {
            throw new ReferenceError('¡Se necesita al menos un argumento no vacío!');
        }
        if (typeof selector === 'object') {
            return win['s5'].extend(selector);
        }
        else if (/<.*>$/i.test(selector)) {
            params.unshift(selector.replace(/<|>/g, ''));

            return win['s5'].createElem.apply(win['s5'], params);
        }
        return win['s5'].get(selector);
    };

    def('s5', fnSwitch);

    o.keys(s5def).forEach(opc => def(opc, s5def[opc], win['s5'], true));

    def('Sinco', win['s5']);
    def('isIE', isIE);
    def('__lists', __lists);
    def('isMobile', isMobile); 
    def('isFirefox', isFirefox);
    def('versionIE', versionIE);
    def('SincoInitializationError', SincoInitializationError);

})(typeof window !== 'undefined' ? window : this, document, (win, doc, arr, o, s, j, scriptSrc) => {
    
    const _isElement = obj => {
        try {
            return obj instanceof HTMLElement;
        }
        catch(e){
            return (typeof obj==="object") &&
                    (obj.nodeType===1) && (typeof obj.style === "object") &&
                    (typeof obj.ownerDocument ==="object");
        }
    };

    const _get = function (id) {
        id = id.toString();
        let dis = ( this.attribute == __htmlElementsProps.attribute ? this : doc );
        if (/[$/:-?{-~!"^`\[\]#.\s]/.test(id)) {
            const ext = elements => {
                elements = _map(elements, elem => _extend(elem));
                o.keys(__htmlElementsProps).forEach(def(elements));
                return elements;
            };

            const def = r => p =>
                o.defineProperty(r, p, {
                    get: _ => function() {
                        const results = this.map(e => e[p](...arguments));
                        if (results.some(e => e.tagName !== undefined)) {
                            return ext(results);
                        }
                        return results;
                    },
                    set: _ => { throw new ReferenceError('¡El elemento no se puede eliminar ni reasignar!') },
                    enumerable: false,
                    configurable: false
                });

            let r = ext(dis.querySelectorAll(id));

            return r;
        }
        return _get.call(dis, `#${id}`).shift();
    };

    const _createElem = (type, attr) => {
        let ele = _extend(doc.createElement(type));
        attr = attr || {};
        let k = o.keys(attr).stream();
        while (k.next())
            ele.attribute(k.value, attr[k.value]);
        return ele;
    };

    const _attribute = function (name, value) {
        if ( !value ) return this.getAttribute(name);
        else {
            this.setAttribute(name, value);
            _dispatch.call(this, 'attribute', { name: name, value: value });
            return this;
        }
    };

    const _insert = function (e, opc) {
        if (arr.isArray(e)) {
            //let orig = this;
            e.forEach(el => _insert.call(this, el, opc));
        }
        else if (typeof opc === 'undefined' || (typeof opc === 'boolean' && !opc)) {
            this.appendChild(e);
        }
        else if (typeof opc === 'number') {
            if (this.childNodes[opc]) {
                this.insertBefore(e, this.childNodes[opc]);
            }
            else {
                this.appendChild(e);
            }
        }
        else {
            this.insertBefore(e, this.firstChild);
        }

        if (this.listeners && this.listeners['insert']) {
            _dispatch.call(this, 'insert');
        }
        return this;
    };

    const _insertAfter = function (e, opc) {
        if (!opc || !_isElement(opc)) {
            throw new TypeError('Debe especificar el segundo parámetro, el cual corresponde al elemento HTML que quedará previo al nuevo insertado.');
        }
        if (arr.isArray(e)) {
            e = e.reverse();
        }
        let index = arr.from(opc.parentNode.childNodes).indexOf(opc);
        return _insert.call(this, e, index+1);
    };

    const _insertTo = function (e) {
        if (typeof e === 'undefined' || !e){
            throw new TypeError('Debe especificar el elemento al que se insertará.');
        }
        e.appendChild(this);

        if (this.listeners && this.listeners['insertTo']) {
            _dispatch.call(this, 'insertTo');
        }
        return this;
    };

    const _addEvent = function (type, callback) {
        let _this = this;

        if (_this.addEventListener) {
            _this['_' + type] = callback;
            _this.addEventListener(type, callback, false);
        }
        else if (_this.attachEvent) {
            _this['_' + type] = callback;
            _this['e' + type + callback] = callback;
            _this[type + callback] = _ => _this['e' + type + callback](win.event);
            _this.attachEvent('on' + type, _this[type + callback]);
        }
        return _this;
    };

    const _removeEvent = function (type, callback) {
        if (this.detachEvent) {
            this.detachEvent('on' + type, this[type + callback]);
            this[type + callback] = null;
        }
        else
            this.removeEventListener(type, callback, false);
        return this;
    };

    const _styles = function (name, value) {
        if (!value && value !== '')
            return this.style[name];
        else {
            this.style[name] = value;
            return this;
        }
    };

    const _on = function (eventName, listener) {
        if (!this.listeners[eventName]) this.listeners[eventName] = [];
        this.listeners[eventName].push(listener);
    };

    const _off = function (eventName) {
        this.listeners[eventName] = [];
    };

    const _delete = function (ele) {
        let _this = ele || this;
        const _r = _extend(_this.cloneNode());
        if (!_this.remove) {
            if (_this.parentElement)
                _this.parentElement.removeChild(_this);
        }
        else
            _this.remove();
        return _r;
    };

    const _dispatch = function (eventName, values) {
        if (this.listeners[eventName]) {
            for (let i = 0; this.listeners[eventName] && i < this.listeners[eventName].length; i++) {
                this.listeners[eventName][i](this, values);
            }
        }
    };

    const _html = function (content) {
        if (content === null || content === undefined) {
            return this.innerHTML;
        }
        else {
            this.innerHTML = content;
            return this;
        }
    };

    const _val = function(value) {
        if (value === null || value === undefined) {
            return this.value !== undefined ? this.value : this.textContent;
        }
        else {
            if (this.value !== undefined) {
                this.value = value;
            }
            else {
                this.textContent = value;
            }
            return this;
        }
    };

    const __htmlElementsProps = {
        get: _get,
        attribute: _attribute,
        insert: _insert,
        insertTo: _insertTo,
        insertAfter: _insertAfter,
        addEvent: _addEvent,
        removeEvent: _removeEvent,
        styles: _styles,
        on: _on,
        off: _off,
        dispatch: _dispatch,
        'delete': _delete,
        html: _html,
        val: _val
    };

    const _fileToBase64 = (f, c) => {
        if (f){
            if (FileReader) {
                if (f instanceof File) {
                    let FR = new FileReader();
                    FR.name = f.name;
                    FR.size = f.size;

                    if (c) {
                        FR.onload = function (e) {
                            c({
                                'name': this.name,
                                'src': e.target.result.split(',').pop(),
                                'kilobytes': this.size
                            });
                        };
                    }
                    FR.readAsDataURL(f);
                }
                else {
                    throw new SincoInitializationError('¡El primer parámetro debe ser de tipo "File"!');
                }
            }
            else {
                throw new SincoInitializationError('¡El navegador no soporta esta funcionalidad!');
            }
        }
    };

    const _map = (obj, iterator) => arr.prototype.map.call(obj, iterator);

    const _filter = (obj, iterator) => arr.prototype.filter.call(obj, iterator);

    const _reduce = (obj, iterator, memo) => arr.prototype.reduce.call(obj, iterator, memo);

    const _validacionesOnClick = config => {
        doc.addEventListener('click', event => {
            let _target = event.target || event.srcElement;
            if (_target.nodeName.toLowerCase() !== 'body') {
                let encontrado,
                    excepcionEncontrada;

                const validarClick = (obj, target) => {
                    encontrado = false;
                    excepcionEncontrada = false;
                    if (!!target && target.nodeName.toLowerCase() !== 'html') {
                        while (target.nodeName.toLowerCase() !== 'body') {
                            if (!excepcionEncontrada) {
                                for (let i = 0; i < obj.excepciones.length; i++) {
                                    if (target.classList && obj.excepciones[i].startsWith('.') && target.classList.contains(obj.excepciones[i].replace('.', ''))) {
                                        excepcionEncontrada = true;
                                        break;
                                    }
                                    else if (target.id == obj.excepciones[i]) {
                                        excepcionEncontrada = true;
                                        break;
                                    }
                                }
                            }

                            if ((obj.target instanceof arr && obj.target.indexOf(target.id) >= 0) || target.id == obj.target) {
                                encontrado = true;
                                break;
                            }
                            target = target.parentNode;
                        }
                    }

                    if (!excepcionEncontrada) {
                        if (!obj.iguales && !encontrado) {
                            obj.funcion();
                        }
                        else if (obj.iguales && encontrado) {
                            obj.funcion();
                        }
                    }
                }

                config.forEach(obj => validarClick(obj, _target));
            }
        }, true);
    };

    const _extend = (el, opt) => {
        if (!el) return null;
        opt = opt || __htmlElementsProps;

        const extendProps = (el, opt) => {
            for (let n in opt) {
                if (el[n] !== null && typeof el[n] == 'object'
                    && !(el[n] instanceof arr)
                    && !(el[n] instanceof HTMLElement))
                    extendProps(el[n], opt[n]);
                else
                    el[n] = opt[n];
            }
            return el;
        };

        el = extendProps(el, opt);
        el.listeners = el.listeners || {};

        return el;
    };

    const _addStyles = (e, p) => {
        e = _extend(e);
        for (let key in p)
            e.styles(key, p[key]);
    };

    const _parseXml = xmlStr => {
        if (win.DOMParser) {
            return new win.DOMParser().parseFromString(xmlStr, 'text/xml');
        }
        let xmlDoc = null;
        if (typeof win.ActiveXObject != 'undefined' && !!(xmlDoc = new win.ActiveXObject('Microsoft.XMLDOM'))) {
            xmlDoc.async = 'false';
            xmlDoc.loadXML(xmlStr);
        }
        return xmlDoc;
    };

    const _encrypt = txt => {
        if (typeof txt === 'string')
            return txt.toAESEncrypt();
        else if (txt instanceof s5.constructor)
            return txt.value.toAESEncrypt();
        else
            return null;
    };

    let _QueryString = {
        toString: _ => {
            let retorno = '',
                sep = '';
            for (let name in s5.QueryString) {
                if (typeof s5.QueryString[name] !== 'function') {
                    retorno += sep + name + '=' + encodeURIComponent(s5.QueryString[name]);
                    sep = '&';
                }
            }
            return retorno;
        },
        hasProperties: _ => {
            for (let name in s5.QueryString)
                if (typeof s5.QueryString[name] !== 'function')
                    return true;
            return false;
        }
    };

    (_ => {
        const hashes = win.location.href.slice(win.location.href.indexOf('?') + 1).split('&');
        if (win.location.href.lastIndexOf(hashes[0]) != 0) {
            hashes.forEach(hash => _QueryString[hash.split('=')[0].toLowerCase()] = hash.split('=')[1].split('#').shift());
        }
    })();

    let _script = (_ => {
        const fullName = /[^\/\\]+$/.exec(scriptSrc)[0];

        const extractHostname = url => {
            let hostname;

            if (url.indexOf("://") > -1) {
                hostname = url.split('/')[2];
            }
            else {
                hostname = url.split('/')[0];
            }

            hostname = hostname.split(':')[0];
            hostname = hostname.split('?')[0];

            return hostname;
        };

        const _url = win.location.href.split('/');
        _url.pop();

        const _src = scriptSrc.replaceAll(_url.join('/'), '').split('/');
        _src.pop();
        _src.shift();

        return {
            name: fullName.split('.')[0],
            url: fullName.split('?')[0],
            host: extractHostname(scriptSrc),
            path: _src.join('/'),                
            originalUrl: scriptSrc.replace(fullName, ''),
            locationHost: extractHostname(window.location.href)
        };
    })();

    const _init = (_plugins, _fnEnd, _src) => {
        const SincoRequire = function (plugins, fn, src) {
            const modules = [],
                pending = [],
                loaded = [];

            const _define = (name, _dependencies, _module) => {
                let dependencies, module;
                if (typeof _dependencies === 'function')
                    module = _dependencies,
                    dependencies = _require.extractDependencies(module);
                else
                    dependencies = _dependencies,
                    module = _module;

                if (!dependencies || !dependencies.length) {
                    loaded.push(name);

                    modules[name] = {
                        name: name,
                        callback: module,
                        module: module(),
                        loaded: true,
                        dependencies: []
                    };
                }
                else {
                    modules[name] = {
                        name: name,
                        callback: module,
                        loaded: false,
                        dependencies: dependencies
                    };
                }

                _unroll();

                if (_require.onModule)
                _require.onModule(modules[name]);

                return modules[name];
            };

            const _require = (_dependencies, _callback) => {
                let dependencies, callback;
                if (typeof _dependencies === 'function')
                    callback = _dependencies,
                    dependencies = _require.extractDependencies(callback);
                else
                    dependencies = _dependencies,
                    callback = _callback;

                const module = {
                    callback: callback,
                    dependencies: dependencies
                };

                modules.push(module);

                if (_require.onModule)
                    _require.onModule(module);

                _unroll();

                return module;
            };

            const _unroll = _ => {
                _map(o.keys(modules), name => modules[name])
                    .concat(modules)
                    .forEach(module => {
                        if (!module.loaded && module.dependencies.every(depn => loaded.indexOf(depn) !== -1)){
                            loaded.push(module.name);
                            module.loaded = true;
                            module.module = module.callback.apply(null, module.dependencies.map(depn => modules[depn].module));

                            _unroll();
                        }
                    });
            };

            _require.extractDependencies = fn => {
                fn = fn.toString();

                fn = fn.replace(/\/\*[^(?:\*\/)]+\*\//g, '');
                fn = fn.match(/function \(([^\)]*)\)/)[1];

                return fn ? fn.split(',').map(depn => depn.trim()) : [];
            };

            _require.loadScript = (src, callback) => {
                const script = doc.createElement('script');
                script.onload = callback;
                script.onerror = function () {
                    _extend(script)['delete']();
                };

                doc.getElementsByTagName('head')[0].appendChild(script);
                script.src = src + (win['version-js'] ? '?v=' + win['version-js'] : '');
            };

            _require.modules = modules;

            if (!src) {
                const url = win.location.href.split('/');
                url.pop();
                src = _map(doc.getElementsByTagName('script'), s => s).pop().src.replaceAll(url.join('/'), '').split('/');
                src.shift();
                src.pop();
                src = src.join('/');
                if (src.startsWith('/' + win.location.host)) {
                    src = src.replace('/' + win.location.host, '');
                }
            }

            let modulos, version;

            const getVersion = _ => {
                const splitted = scriptSrc.split('=');
                if (splitted.length > 1) {
                    version = splitted.pop();
                }
            };

            const addOnModule = _ => {
                plugins = null;
                if (!!modulos && !!modulos.dependencies) {
                    modulos.dependencies.forEach(dependency => {
                        if (pending.indexOf(dependency) == -1) {
                            _require.loadScript(src + '/' + dependency + '.js');

                            pending.push(dependency);
                        }
                    });
                }
                if (!!fn && typeof fn === "function") {
                    fn();
                }
            };

            if (plugins) {
                let sum = 0;
                getVersion();
                plugins.forEach(script => {
                    let _url = 's5.' + script + '.js' + (version && !win['version-js'] ? '?v=' + version : '');

                    if (_script.locationHost != _script.host) {
                        _url = _script.originalUrl + _url;
                    }
                    else {
                        _url = _script.path + '/' + _url;
                    }

                    _require.loadScript(_url, function () {
                        sum++;
                        if (sum == plugins.length) {
                            addOnModule();
                        }
                    });
                });
            }

            _require.onModule = module => {
                modulos = module;
                if (!plugins) {
                    addOnModule();
                }
            };

            const _components = {
                'import': component => {
                    const path = 's5_components';
                    _require.loadScript(path + '/' + component + '/' + component + '.js');
                }
            };

            this.require = _require;
            this.define = _define;
            this.components = _components;
        };
        return new SincoRequire(_plugins, _fnEnd, _src);
    };

    const _interpolate = str => function interpolate(o) {
        return str.replace(/\${([^{}]*)}/g, (a, b) => {
            const r = typeof o[b] == "function" ? o[b]() : o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        });
    };

    const _model = {
        create: (clase, data) => new win[clase](data),
        define: function (nombreClase, props, functions) {
            const propiedades_Clase = o.keys(props);
            const funciones = o.keys(functions);
                
            win[nombreClase] = (new Function('parametros_NuevaInstancia', 'return (props_Clase, funcion_Constructor) => { \
                return function ' + nombreClase + ' (parametros_NuevaInstancia) { \
                    let obj = this; \
                    props_Clase.forEach(key => obj[key] = parametros_NuevaInstancia[key]); \
                    funcion_Constructor.call(this); \
                    return obj; \
                }; \
            };')())(propiedades_Clase, functions.constructor);

            funciones.forEach(key => win[nombreClase].prototype[key] = functions[key]);

            const extend = function (name, props, functions) {

                functions = functions || {};

                _extend(props, this.props);
                _extend(functions, this.functions);

                return _model.define(name, props, functions);
            }

            win[nombreClase].prototype.validate = function () { };

            return {
                extend: extend,
                props: props,
                functions: functions
            }
        }
    };

    const _watch = function (obj, prop, callback) {
        let oldValue = obj[prop]
            , newValue = oldValue
            , getter = _ => newValue
            , setter = value => {
                oldValue = newValue;
                newValue = value;
                callback.call(obj, prop, oldValue, newValue);
            };
        if (delete obj[prop]) {
            o.defineProperty(obj, prop, {
                get: getter,
                set: setter,
                enumerable: true,
                configurable: true
            });
        }
        return this;
    };

    const RequestStatusCodes = {
        '0': 'Aborted',
        '200': 'Ok',
        '201': 'Created',
        '204': 'NoContent',
        '302': 'Moved',
        '300': 'MultipleChoices',
        '303': 'SeeOther',
        '400': 'BadRequest',
        '401': 'Unauthorized',
        '403': 'Forbidden',
        '404': 'NotFound',
        '408': 'RequestTimeout',
        '409': 'Conflict',
        '412': 'PreconditionFailed',
        '500': 'InternalServerError',
        '504': 'GatewayTimeout'
    };

    const _Request = (method, url, fn, data, contentType, includeAccept, timeout) => {
        const f = _ => { };
        includeAccept = typeof includeAccept == 'boolean' ? includeAccept : true;
        fn = fn || {};

        for (let code in RequestStatusCodes) {
            switch (code) {
                case '408':
                    fn.RequestTimeout = _ => alert('No se puede establecer comunicación con el servidor');
                    break;
                case '409':
                    fn.Conflict = fn.Conflict || (_ => {
                                    alert('Se cerrará esta sesión porque el usuario ha ingresado en otro dispositivo');
                                    win.location.href = 'login.aspx';
                                });
                    break;
                case '412':
                    fn.PreconditionFailed = fn.PreconditionFailed || (_ => {
                                                console.log('Posiblemente la sesión no se comparte entre el marco y el módulo');
                                                if (!alerta) {
                                                    alerta = true;
                                                    alert('No existe Sesión');
                                                }
                                                win.location.href = 'login.aspx';
                                            });
                    break;
                default:
                    fn[RequestStatusCodes[code]] = fn[RequestStatusCodes[code]] || f;
                    break;
            }
        }

        const types = {
            JSON: 'application/json; charset=utf-8',
            XML: 'application/xml; charset=utf-8',
            TEXT: 'text/plain; charset=utf-8',
            DEFAULT: 'application/x-www-form-urlencoded'
        };

        const _exec = (prevFn, fn, text, viewContent, responseHeaders) => {
            responseHeaders = responseHeaders.split('\n')
                                        .filter(item => item.split(' ').join('') !== '' && item.split('\r').join('') !== '')
                                        .map(item => {
                                            let splitted = item.split(':');
                                            return {
                                                name: splitted[0],
                                                value: splitted[1].trim()
                                            };
                                        });
            if (viewContent) {
                switch (contentType.toUpperCase()) {
                    case 'JSON':
                    case 'DEFAULT':
                        text = j.tryParse(text);
                        break;
                    case 'XML':
                        text = _parseXml(text);
                        break;
                }
            }

            if (prevFn) {
                prevFn(contentType.toUpperCase() == 'JSON' || contentType.toUpperCase() == 'DEFAULT' ? j.tryParse(text) : (contentType.toUpperCase() == 'XML' ? _parseXml(text) : text), responseHeaders);
            }

            fn(text, responseHeaders);
        };

        contentType = contentType || 'json';

        let http = new XMLHttpRequest();
        http.open(method, url, true);

        if (includeAccept === true) {
            http.setRequestHeader('Accept', 'application/json, text/javascript');
        }

        http.setRequestHeader('Content-type', types.hasOwnProperty(contentType.toUpperCase()) ? types[contentType.toUpperCase()] : contentType);

        const headers = _Request.headersConfig
                            .filter(({ url: hurl, type }) => type(hurl)(url))
                            .reduce((ar, ac) => {
                                if (!ar.some(a => a.key.toLowerCase() === ac.key.toLowerCase())) {
                                    ar.push(ac);
                                }
                                return ar;
                            }, []);

        if (headers.length > 0) {
            headers.forEach(header => http.setRequestHeader(header.key, typeof header.value == 'function' ? header.value() : header.value));
        }

        let alerta;
        const __switch = [200, 201, 300, 404];

        http.onreadystatechange = _ => {
            if (http.readyState == 4 && http.status !== 0) {
                const statusCode = RequestStatusCodes[http.status];
                _exec(
                    _Request.responseFunctions[statusCode],
                    fn[statusCode],
                    http.responseText,
                    __switch.contains(http.status),
                    http.getAllResponseHeaders()
                );
            }
        };
        const errorXmlHttp = msj => e => {
            const statusCode = RequestStatusCodes['0'];
            _exec(
                _Request.responseFunctions[statusCode],
                fn[statusCode],
                `Mensaje: ${msj}, Error: ${JSON.stringify(e)}`,
                __switch.contains(0),
                http.getAllResponseHeaders()
            );
        };
        http.onabort = errorXmlHttp('El usuario abortó el Request');
        http.onerror = errorXmlHttp('Ocurrió un error en el Request');
        if (typeof timeout === 'object') {
            http.timeout = timeout.time;
            http.ontimeout = timeout.ontimeout;
        }
        if (data) {
            if (contentType.toUpperCase() == 'DEFAULT') {
                let params = [];
                for (let attr in data) {
                    if (data[attr] instanceof arr) {
                        if (!!data[attr].length) {
                            data[attr].forEach(d => params.push(s.format('{0}={1}', attr, encodeURIComponent(d))));
                        }
                        else {
                            params.push(s.format('{0}={1}', attr, ''));
                        }
                    }
                    else {
                        params.push(s.format('{0}={1}', attr, encodeURIComponent(data[attr])));
                    }
                }
                http.send(params.join('&'));
            }
            else if (contentType.toUpperCase() == 'TEXT') {
                http.send(data);
            }
            else {
                http.send(j.stringify(data));
            }
        }
        else
            http.send();

        return http;
    };

    o.defineProperty(_Request, 'headersConfig', {
        value: [],
        enumerable: false,
        configurable: false
    });

    o.defineProperty(_Request, 'responseFunctions', {
        value: {},
        enumerable: false,
        configurable: false
    });

    const _headerType = { 
        'startsWith': x => y => new RegExp(`(^${x})`, 'i').test(y), 
        'endsWith': x => y => new RegExp(`(${x}$)`, 'i').test(y), 
        'equals': x => y => new RegExp(`(^${x}$)`, 'i').test(y), 
        'contains': x => y => new RegExp(x, 'i').test(y), 
        'different': x => y => new RegExp(`^(?!.*?(^${x}$)).*`, 'i').test(y), 
        'notContains': x => y => new RegExp(`^(?!.*?${x}).*`, 'i').test(y)
    };

    _Request.setHeader = (url, key, value, type = 'startsWith') => {
        type = _headerType[type];

        if (_Request.headersConfig.some(hc => hc.url == url && hc.key == key)) {
            _Request.headersConfig
                .filter(hc => hc.url == url && hc.key == key)
                .forEach(hc => {
                    hc.value = value;
                    hc.type = type;
                });
        }
        else {
            _Request.headersConfig.push({ url, key, value, type });
        }
    };

    _Request.setResponseFunctions = fns => {
        for (let name in fns) _Request.responseFunctions[name] = fns[name];
    };

    const _Cookie = (key, value) => {
        const app = win['aplicacion'] || (win.location.hostname + '_' + win.location.pathname.split('/')[1] + '?').toLowerCase();

        if (!value) {
            const _readCookie = name => {
                name = name.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');

                const regex = new RegExp('(?:^|;)\\s?' + name + '=(.*?)(?:;|$)','i'),
                    match = doc.cookie.match(regex);

                return match && unescape(match[1]);
            };

            return _readCookie(app + '_' + key);
        }
        else {
            const fecha = new Date();
            fecha.setFullYear(fecha.getFullYear() + 1);
            doc.cookie = s.format('{0}_{1}={2};expires={3}', app, key, value, fecha.toGMTString());
            _Cookie[key] = value;
        }
    };

    return {
        fileToBase64: _fileToBase64,
        map: _map,
        filter: _filter,
        reduce: _reduce,
        QueryString: _QueryString,
        script: _script,
        initialize: _init,
        interpolate: _interpolate,
        model: _model,
        watch: _watch,
        Request: _Request,
        cookie: _Cookie,

        utilities: {
            onClickValidations: _validacionesOnClick,
            addStyles: _addStyles,
            parseXml: _parseXml,
            encrypt: _encrypt
        },

        get: _get,
        extend: _extend,
        createElem: _createElem,
        addEvent: _addEvent,
        removeEvent: _removeEvent,
        'delete': _delete
    };
});