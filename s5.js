/**
 * @license S5.js v1.0.43
 * (c) 2015-2019 Sincosoft, Inc. http://sinco.com.co
 * 
 * Creation date: 21/07/2015
 * Last change: 02/10/2019
 *
 * by GoldenBerry
 *
 * Ojo: Si se necesita realizar cifrado de texto,
 *      se requiere el archivo aes.js
**/

//Opciones de Object
{
    if (!Object.keys) {
        Object.keys = function (obj) {
            var keys = [];

            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    keys.push(i);
                }
            }

            return keys;
        };
    }

    if (!("classList" in document.createElementNS("http://www.w3.org/2000/svg", "g"))) {
        var descr = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'classList');
        Object.defineProperty(SVGElement.prototype, 'classList', descr);
    }
}

//Opciones de Array
{
    if (!Array.isArray) {
        Array.isArray = function (obj) {
            if (typeof obj != 'undefined')
                return obj.constructor == Array;
            else
                return false;
        };
    }

    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (fun) {
            if (this === void 0 || this === null)
                throw new TypeError();

            var t = Object(this);
            var len = t.length >>> 0;
            if (typeof fun !== 'function')
                throw new TypeError();

            var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
            for (var i = 0; i < len; ++i) {
                if (i in t)
                    fun.call(thisArg, t[i], i, t);
            }
        };
    }

    Array.prototype.clean = function (deleteValue) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == deleteValue) {
                this.splice(i, 1);
                i--;
            }
        }
        return this;
    };

    if (!Array.prototype.every) {
        Array.prototype.every = function (callbackfn, thisArg) {
            'use strict';
            var T, k;

            if (this == null) {
                throw new TypeError('this is null or not defined');
            }

            var O = Object(this);

            var len = O.length >>> 0;

            if (typeof callbackfn !== 'function') {
                throw new TypeError();
            }

            if (arguments.length > 1) {
                T = thisArg;
            }

            k = 0;

            while (k < len) {
                var kValue;

                if (k in O) {
                    kValue = O[k];

                    var testResult = callbackfn.call(T, kValue, k, O);

                    if (!testResult) {
                        return false;
                    }
                }
                k++;
            }
            return true;
        };
    }

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (searchElement /*, fromIndex */) {
            "use strict";
            if (this == null) {
                throw new TypeError();
            }
            var t = Object(this);
            var len = t.length >>> 0;
            if (len === 0) {
                return -1;
            }
            var n = 0;
            if (arguments.length > 1) {
                n = Number(arguments[1]);
                if (n != n) {
                    n = 0;
                } else if (n != 0 && n != Infinity && n != -Infinity) {
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
            }
            if (n >= len) {
                return -1;
            }
            var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
            for (; k < len; k++) {
                if (k in t && t[k] === searchElement) {
                    return k;
                }
            }
            return -1;
        }
    }

    if (!Array.prototype.find) {
        Array.prototype.find = function (predicate) {
            if (this == null) {
                throw new TypeError('Array.prototype.find called on null or undefined');
            }
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }
            var list = Object(this);
            var length = list.length >>> 0;
            var thisArg = arguments[1];
            var value;

            for (var i = 0; i < length; i++) {
                value = list[i];
                if (predicate.call(thisArg, value, i, list)) {
                    return value;
                }
            }
            return undefined;
        };
    }

    if (!Array.prototype.unique) {
        Array.prototype.unique = function () {
            var u = {}, a = [];
            for (var i = 0, l = this.length; i < l; ++i) {
                if (u.hasOwnProperty(this[i])) {
                    continue;
                }
                a.push(this[i]);
                u[this[i]] = 1;
            }
            return a;
        }
    }

    if (!Array.prototype.findIndex) {
        Object.defineProperty(Array.prototype, 'findIndex', {
            value: function (predicate) {
                if (this == null) {
                    throw new TypeError('"this" is null or not defined');
                }
    
                var o = Object(this);
    
                var len = o.length >>> 0;
    
                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }
    
                var thisArg = arguments[1];
    
                var k = 0;
    
                while (k < len) {
                    var kValue = o[k];
                    if (predicate.call(thisArg, kValue, k, o)) {
                        return k;
                    }
                    k++;
                }
    
                return -1;
            }
        });
    }
    
    if (!Array.prototype.reduce) {
        Object.defineProperty(Array.prototype, 'reduce', {
            value: function (callback) {
                if (this === null) {
                    throw new TypeError('Array.prototype.reduce ' +
                      'called on null or undefined');
                }
                if (typeof callback !== 'function') {
                    throw new TypeError(callback +
                      ' is not a function');
                }
    
                var o = Object(this);
                var len = o.length >>> 0;
    
                var k = 0;
                var value;
    
                if (arguments.length >= 2) {
                    value = arguments[1];
                } else {
                    while (k < len && !(k in o)) {
                        k++;
                    }
    
                    if (k >= len) {
                        throw new TypeError('Reduce of empty array ' +
                          'with no initial value');
                    }
                    value = o[k++];
                }
    
                while (k < len) {
                    if (k in o) {
                        value = callback(value, o[k], k, o);
                    }
    
                    k++;
                }
    
                return value;
            }
        });
    }

    if (!Array.prototype.some) {
        Array.prototype.some = function(fun/*, thisArg*/) {
            'use strict';

            if (this == null) {
                throw new TypeError('Array.prototype.some called on null or undefined');
            }

            if (typeof fun !== 'function') {
                throw new TypeError();
            }

            var t = Object(this);
            var len = t.length >>> 0;

            var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
            for (var i = 0; i < len; i++) {
                if (i in t && fun.call(thisArg, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }

    Array.prototype.contains = function(searchElement /*, fromIndex*/ ) {
        'use strict';
        var O = Object(this);
        var len = parseInt(O.length) || 0;
        if (len === 0) {
            return false;
        }
        var n = parseInt(arguments[1]) || 0;
        var k;
        if (n >= 0) {
            k = n;
        } else {
            k = len + n;
            if (k < 0) { k = 0; }
        }
        var currentElement;
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
}

//Opciones de String
{
    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function (str) {
            return this.indexOf(str) === 0;
        };
    }

    if (!String.prototype.endsWith) {
        String.prototype.endsWith = function (searchString, position) {
            var subjectString = this.toString();
            if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
                position = subjectString.length;
            }
            position -= searchString.length;
            var lastIndex = subjectString.indexOf(searchString, position);
            return lastIndex !== -1 && lastIndex === position;
        };
    }

    if (!String.prototype.replaceAll) {
        String.replaceAll = String.prototype.replaceAll = function (replaceThis, replaceWith) {
            var string = this;
            var rgx = new RegExp(replaceThis, 'g');

            return string.replace(rgx, replaceWith);
        };
    }

    if (!String.prototype.format) {
        String.format = String.prototype.format = function () {
            var i = 0, l = 0;
            var string = (typeof (this) == 'function' && !(i++)) ? arguments[0] : this;

            while (i < arguments.length) {
                string = string.replaceAll('\\{' + l + '\\}', arguments[i]);
                i++; l++;
            }

            return string;
        };
    }

    if (!String.prototype.trim) {
        (function () {
            // Make sure we trim BOM and NBSP
            var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
            String.prototype.trim = function () {
                return this.replace(rtrim, '');
            };
        })();
    }

    String.concat = function () {
        return Array.prototype.slice.call(arguments).join('');
    };

    String.toAESEncrypt = String.prototype.toAESEncrypt = function () {
        if (typeof CryptoJS === 'undefined') {
            throw new SincoInitializationError('¡Falta la referencia de AES.js!');
        }

        var text = '';
        var key = CryptoJS.enc.Utf8.parse(String.concat(String.fromCharCode(53), String.fromCharCode(49), String.fromCharCode(110),
            String.fromCharCode(99), String.fromCharCode(48), String.fromCharCode(115), String.fromCharCode(111),
            String.fromCharCode(102), String.fromCharCode(116), String.fromCharCode(95), String.fromCharCode(53),
            String.fromCharCode(46), String.fromCharCode(65), String.fromCharCode(46), String.fromCharCode(53),
            String.fromCharCode(46))); //Mismo KEY usado en C#


        var setKey = function (k) {
            var _k = [];
            for (var i = 0; i < k.length; i += 4) {
                if (k[i + 1]) {
                    _k.push(k[i] + k[i + 1]);
                }
            }
            k = new Uint8Array(_k);
            var r = String.fromCharCode.apply(String, k);
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


        var iv = CryptoJS.enc.Utf8.parse(String.concat(String.fromCharCode(95), String.fromCharCode(84), String.fromCharCode(49),
            String.fromCharCode(99), String.fromCharCode(115), String.fromCharCode(124), String.fromCharCode(70),
            String.fromCharCode(111), String.fromCharCode(110), String.fromCharCode(42), String.fromCharCode(53),
            String.fromCharCode(111), String.fromCharCode(95), String.fromCharCode(83), String.fromCharCode(52),
            String.fromCharCode(53))); //Mismo IV usado en C#


        var valorIterar = Math.floor((Math.random() * 9) + 1);

        var iterar = function (final, text, key, iv) {
            var textoCrypto;

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
                return textoCrypto
            }
        }

        return iterar(valorIterar, text, key, iv).toString() + valorIterar;
    };
}

/*************************************
 * `document.currentScript` polyfill *
 *************************************/

(function () {

    // Inspect the polyfill-ability of this browser
    var needsPolyfill = !("currentScript" in document);
    var canDefineGetter = document.__defineGetter__;
    var canDefineProp = typeof Object.defineProperty === "function" &&
        (function () {
            var result;
            try {
                Object.defineProperty(document, "_xyz", {
                    value: "blah",
                    enumerable: true,
                    writable: false,
                    configurable: false
                });
                result = document._xyz === "blah";
                delete document._xyz;
            }
            catch (e) {
                result = false;
            }
            return result;
        })();

    var hasStack = (function () {
        var result = false;
        try {
            throw new Error();
        }
        catch (err) {
            result = typeof err.stack === "string" && !!err.stack;
        }
        return result;
    })();


    // This page's URL
    var pageUrl = window.location.href;

    // Live NodeList collection
    var scripts = document.getElementsByTagName("script");

    // Get script object based on the `src` URL
    function getScriptFromUrl(url) {
        if (typeof url === "string" && url) {
            for (var i = 0, len = scripts.length; i < len; i++) {
                if (scripts[i].src === url) {
                    return scripts[i];
                }
            }
        }
        //return undefined;
    }

    // If there is only a single inline script on the page, return it; otherwise `undefined`
    function getSoleInlineScript() {
        var script;
        for (var i = 0, len = scripts.length; i < len; i++) {
            if (!scripts[i].src) {
                if (script) {
                    return undefined;
                }
                script = scripts[i];
            }
        }
        return script;
    }

    // Get the currently executing script URL from an Error stack trace
    function getScriptUrlFromStack(stack, skipStackDepth) {
        var url, matches, remainingStack,
            ignoreMessage = typeof skipStackDepth === "number";
        skipStackDepth = ignoreMessage ? skipStackDepth : (typeof _currentScript.skipStackDepth === "number" ? _currentScript.skipStackDepth : 0);
        if (typeof stack === "string" && stack) {
            if (ignoreMessage) {
                matches = stack.match(/((?:http[s]?|file):\/\/[\/]?.+?\/[^:\)]*?)(?::\d+)(?::\d+)?/);
            }
            else {
                matches = stack.match(/^(?:|[^:@]*@|.+\)@(?=http[s]?|file)|.+?\s+(?: at |@)(?:[^:\(]+ )*[\(]?)((?:http[s]?|file):\/\/[\/]?.+?\/[^:\)]*?)(?::\d+)(?::\d+)?/);
                if (!(matches && matches[1])) {
                    matches = stack.match(/\)@((?:http[s]?|file):\/\/[\/]?.+?\/[^:\)]*?)(?::\d+)(?::\d+)?/);
                    if (matches && matches[1]) {
                        url = matches[1];
                    }
                }
            }

            if (matches && matches[1]) {
                if (skipStackDepth > 0) {
                    remainingStack = stack.slice(stack.indexOf(matches[0]) + matches[0].length);
                    url = getScriptUrlFromStack(remainingStack, (skipStackDepth - 1));
                }
                else {
                    url = matches[1];
                }
            }
        }
        return url;
    }

    // Get the currently executing `script` DOM element
    function _currentScript() {
        // Yes, this IS actually possible
        if (scripts.length === 0) {
            return;  //return undefined;
        }

        if (scripts.length === 1) {
            return scripts[0];
        }

        if ("readyState" in scripts[0]) {
            for (var i = scripts.length; i--;) {
                if (scripts[i].readyState === "interactive") {
                    return scripts[i];
                }
            }
        }

        if (document.readyState === "loading") {
            return scripts[scripts.length - 1];
        }

        if (hasStack) {
            try {
                throw new Error();
            }
            catch (err) {
                // NOTE: Cannot use `err.sourceURL` or `err.fileName` as they will always be THIS script
                var url = getScriptUrlFromStack(err.stack);
                var script = getScriptFromUrl(url);
                if (!script && url === pageUrl) {
                    script = getSoleInlineScript();
                }
                return script;
            }
        }

        //return undefined;
    }

    // Configuration
    _currentScript.skipStackDepth = 1;



    // Add the "private" property for testing, even if the real property can be polyfilled
    document._currentScript = _currentScript;

    // Polyfill it!
    if (needsPolyfill) {
        if (canDefineProp) {
            Object.defineProperty(document, "currentScript", {
                get: _currentScript,
                enumerable: true,
                configurable: false
            });
        }
        else if (canDefineGetter) {
            document.__defineGetter__("currentScript", _currentScript);
        }
    }

})();

var __lists = Object.getOwnPropertyNames(window).filter(function (x) { return x.endsWith('List') || x.indexOf('Array') >= 0; });

__lists.forEach(function(n) {
    var __type = window[n];
    __type.prototype.stream = function () {
        if (this === void 0 || this === null || !(this instanceof __type))
            throw new TypeError();

        var Iterator = function (array) {
            this.value = null;
            this.index = -1;

            this.next = function () {
                this.index++;
                this.value = array[this.index];
                return this.index < array.length;
            }
        }

        return new Iterator(this);
    }
});

//Opciones de JSON
{
    if (typeof (JSON) !== 'undefined' && !JSON.tryParse) {
        JSON.tryParse = function (str) {
            try {
                return JSON.parse(str);
            }
            catch (e) {
                return { messageError: e.message };
            }
        };
    }
}

//Pollyfill RegisterElement
if (!document.registerElement) {
    (function (e, t) {
        "use strict"; function Ht() { var e = wt.splice(0, wt.length); Et = 0; while (e.length) e.shift().call(null, e.shift()) } function Bt(e, t) { for (var n = 0, r = e.length; n < r; n++) Jt(e[n], t) } function jt(e) { for (var t = 0, n = e.length, r; t < n; t++) r = e[t], Pt(r, A[It(r)]) } function Ft(e) { return function (t) { ut(t) && (Jt(t, e), O.length && Bt(t.querySelectorAll(O), e)) } } function It(e) { var t = ht.call(e, "is"), n = e.nodeName.toUpperCase(), r = _.call(L, t ? N + t.toUpperCase() : T + n); return t && -1 < r && !qt(n, t) ? -1 : r } function qt(e, t) { return -1 < O.indexOf(e + '[is="' + t + '"]') } function Rt(e) { var t = e.currentTarget, n = e.attrChange, r = e.attrName, i = e.target, s = e[y] || 2, o = e[w] || 3; kt && (!i || i === t) && t[h] && r !== "style" && (e.prevValue !== e.newValue || e.newValue === "" && (n === s || n === o)) && t[h](r, n === s ? null : e.prevValue, n === o ? null : e.newValue) } function Ut(e) { var t = Ft(e); return function (e) { wt.push(t, e.target), Et && clearTimeout(Et), Et = setTimeout(Ht, 1) } } function zt(e) { Ct && (Ct = !1, e.currentTarget.removeEventListener(S, zt)), O.length && Bt((e.target || n).querySelectorAll(O), e.detail === l ? l : a), st && Vt() } function Wt(e, t) { var n = this; vt.call(n, e, t), Lt.call(n, { target: n }) } function Xt(e, t) { nt(e, t), Mt ? Mt.observe(e, yt) : (Nt && (e.setAttribute = Wt, e[o] = Ot(e), e[u](x, Lt)), e[u](E, Rt)), e[m] && kt && (e.created = !0, e[m](), e.created = !1) } function Vt() { for (var e, t = 0, n = at.length; t < n; t++) e = at[t], M.contains(e) || (n-- , at.splice(t--, 1), Jt(e, l)) } function $t(e) { throw new Error("A " + e + " type is already registered") } function Jt(e, t) { var n, r = It(e), i; -1 < r && (Dt(e, A[r]), r = 0, t === a && !e[a] ? (e[l] = !1, e[a] = !0, i = "connected", r = 1, st && _.call(at, e) < 0 && at.push(e)) : t === l && !e[l] && (e[a] = !1, e[l] = !0, i = "disconnected", r = 1), r && (n = e[t + f] || e[i + f]) && n.call(e)) } function Kt() { } function Qt(e, t, r) { var i = r && r[c] || "", o = t.prototype, u = tt(o), a = t.observedAttributes || j, f = { prototype: u }; ot(u, m, { value: function () { if (Q) Q = !1; else if (!this[W]) { this[W] = !0, new t(this), o[m] && o[m].call(this); var e = G[Z.get(t)]; (!V || e.create.length > 1) && Zt(this) } } }), ot(u, h, { value: function (e) { -1 < _.call(a, e) && o[h].apply(this, arguments) } }), o[d] && ot(u, p, { value: o[d] }), o[v] && ot(u, g, { value: o[v] }), i && (f[c] = i), e = e.toUpperCase(), G[e] = { constructor: t, create: i ? [i, et(e)] : [e] }, Z.set(t, e), n[s](e.toLowerCase(), f), en(e), Y[e].r() } function Gt(e) { var t = G[e.toUpperCase()]; return t && t.constructor } function Yt(e) { return typeof e == "string" ? e : e && e.is || "" } function Zt(e) { var t = e[h], n = t ? e.attributes : j, r = n.length, i; while (r--) i = n[r], t.call(e, i.name || i.nodeName, null, i.value || i.nodeValue) } function en(e) { return e = e.toUpperCase(), e in Y || (Y[e] = {}, Y[e].p = new K(function (t) { Y[e].r = t })), Y[e].p } function tn() { X && delete e.customElements, B(e, "customElements", { configurable: !0, value: new Kt }), B(e, "CustomElementRegistry", { configurable: !0, value: Kt }); for (var t = function (t) { var r = e[t]; if (r) { e[t] = function (t) { var i, s; return t || (t = this), t[W] || (Q = !0, i = G[Z.get(t.constructor)], s = V && i.create.length === 1, t = s ? Reflect.construct(r, j, i.constructor) : n.createElement.apply(n, i.create), t[W] = !0, Q = !1, s || Zt(t)), t }, e[t].prototype = r.prototype; try { r.prototype.constructor = e[t] } catch (i) { z = !0, B(r, W, { value: e[t] }) } } }, r = i.get(/^HTML[A-Z]*[a-z]/), o = r.length; o--; t(r[o])); n.createElement = function (e, t) { var n = Yt(t); return n ? gt.call(this, e, et(n)) : gt.call(this, e) }, St || (Tt = !0, n[s]("")) } var n = e.document, r = e.Object, i = function (e) {            var t = /^[A-Z]+[a-z]/, n = function (e) { var t = [], n; for (n in s) e.test(n) && t.push(n); return t }, i = function (e, t) {
                t = t.toLowerCase(), t in
                    s || (s[e] = (s[e] || []).concat(t), s[t] = s[t.toUpperCase()] = e)
            }, s = (r.create || r)(null), o = {}, u, a, f, l; for (a in e) for (l in e[a]) { f = e[a][l], s[l] = f; for (u = 0; u < f.length; u++) s[f[u].toLowerCase()] = s[f[u].toUpperCase()] = l } return o.get = function (r) { return typeof r == "string" ? s[r] || (t.test(r) ? [] : "") : n(r) }, o.set = function (n, r) { return t.test(n) ? i(n, r) : i(r, n), o }, o
        }({ collections: { HTMLAllCollection: ["all"], HTMLCollection: ["forms"], HTMLFormControlsCollection: ["elements"], HTMLOptionsCollection: ["options"] }, elements: { Element: ["element"], HTMLAnchorElement: ["a"], HTMLAppletElement: ["applet"], HTMLAreaElement: ["area"], HTMLAttachmentElement: ["attachment"], HTMLAudioElement: ["audio"], HTMLBRElement: ["br"], HTMLBaseElement: ["base"], HTMLBodyElement: ["body"], HTMLButtonElement: ["button"], HTMLCanvasElement: ["canvas"], HTMLContentElement: ["content"], HTMLDListElement: ["dl"], HTMLDataElement: ["data"], HTMLDataListElement: ["datalist"], HTMLDetailsElement: ["details"], HTMLDialogElement: ["dialog"], HTMLDirectoryElement: ["dir"], HTMLDivElement: ["div"], HTMLDocument: ["document"], HTMLElement: ["element", "abbr", "address", "article", "aside", "b", "bdi", "bdo", "cite", "code", "command", "dd", "dfn", "dt", "em", "figcaption", "figure", "footer", "header", "i", "kbd", "mark", "nav", "noscript", "rp", "rt", "ruby", "s", "samp", "section", "small", "strong", "sub", "summary", "sup", "u", "var", "wbr"], HTMLEmbedElement: ["embed"], HTMLFieldSetElement: ["fieldset"], HTMLFontElement: ["font"], HTMLFormElement: ["form"], HTMLFrameElement: ["frame"], HTMLFrameSetElement: ["frameset"], HTMLHRElement: ["hr"], HTMLHeadElement: ["head"], HTMLHeadingElement: ["h1", "h2", "h3", "h4", "h5", "h6"], HTMLHtmlElement: ["html"], HTMLIFrameElement: ["iframe"], HTMLImageElement: ["img"], HTMLInputElement: ["input"], HTMLKeygenElement: ["keygen"], HTMLLIElement: ["li"], HTMLLabelElement: ["label"], HTMLLegendElement: ["legend"], HTMLLinkElement: ["link"], HTMLMapElement: ["map"], HTMLMarqueeElement: ["marquee"], HTMLMediaElement: ["media"], HTMLMenuElement: ["menu"], HTMLMenuItemElement: ["menuitem"], HTMLMetaElement: ["meta"], HTMLMeterElement: ["meter"], HTMLModElement: ["del", "ins"], HTMLOListElement: ["ol"], HTMLObjectElement: ["object"], HTMLOptGroupElement: ["optgroup"], HTMLOptionElement: ["option"], HTMLOutputElement: ["output"], HTMLParagraphElement: ["p"], HTMLParamElement: ["param"], HTMLPictureElement: ["picture"], HTMLPreElement: ["pre"], HTMLProgressElement: ["progress"], HTMLQuoteElement: ["blockquote", "q", "quote"], HTMLScriptElement: ["script"], HTMLSelectElement: ["select"], HTMLShadowElement: ["shadow"], HTMLSlotElement: ["slot"], HTMLSourceElement: ["source"], HTMLSpanElement: ["span"], HTMLStyleElement: ["style"], HTMLTableCaptionElement: ["caption"], HTMLTableCellElement: ["td", "th"], HTMLTableColElement: ["col", "colgroup"], HTMLTableElement: ["table"], HTMLTableRowElement: ["tr"], HTMLTableSectionElement: ["thead", "tbody", "tfoot"], HTMLTemplateElement: ["template"], HTMLTextAreaElement: ["textarea"], HTMLTimeElement: ["time"], HTMLTitleElement: ["title"], HTMLTrackElement: ["track"], HTMLUListElement: ["ul"], HTMLUnknownElement: ["unknown", "vhgroupv", "vkeygen"], HTMLVideoElement: ["video"] }, nodes: { Attr: ["node"], Audio: ["audio"], CDATASection: ["node"], CharacterData: ["node"], Comment: ["#comment"], Document: ["#document"], DocumentFragment: ["#document-fragment"], DocumentType: ["node"], HTMLDocument: ["#document"], Image: ["img"], Option: ["option"], ProcessingInstruction: ["node"], ShadowRoot: ["#shadow-root"], Text: ["#text"], XMLDocument: ["xml"] } }); typeof t != "object" && (t = { type: t || "auto" }); var s = "registerElement", o = "__" + s + (e.Math.random() * 1e5 >> 0), u = "addEventListener", a = "attached", f = "Callback", l = "detached", c = "extends", h = "attributeChanged" + f, p = a + f, d = "connected" + f, v = "disconnected" + f, m = "created" + f, g = l + f, y = "ADDITION", b = "MODIFICATION", w = "REMOVAL", E            = "DOMAttrModified", S = "DOMContentLoaded", x = "DOMSubtreeModified", T = "<", N = "=", C = /^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/, k = ["ANNOTATION-XML", "COLOR-PROFILE", "FONT-FACE", "FONT-FACE-SRC", "FONT-FACE-URI", "FONT-FACE-FORMAT", "FONT-FACE-NAME", "MISSING-GLYPH"], L = [], A = [], O = "", M = n.documentElement, _ = L.indexOf || function (e) { for (var t = this.length; t-- && this[t] !== e;); return t }, D = r.prototype, P = D.hasOwnProperty, H = D.isPrototypeOf, B = r.defineProperty, j = [], F = r.getOwnPropertyDescriptor, I = r.getOwnPropertyNames, q = r.getPrototypeOf, R = r.setPrototypeOf, U = !!r.__proto__, z = !1, W = "__dreCEv1", X = e.customElements, V = !/^force/.test(t.type) && !!(X && X.define && X.get && X.whenDefined), $ = r.create || r, J = e.Map || function () { var t = [], n = [], r; return { get: function (e) { return n[_.call(t, e)] }, set: function (e, i) { r = _.call(t, e), r < 0 ? n[t.push(e) - 1] = i : n[r] = i } } }, K = e.Promise || function (e) { function i(e) { n = !0; while (t.length) t.shift()(e) } var t = [], n = !1, r = { "catch": function () { return r }, then: function (e) { return t.push(e), n && setTimeout(i, 1), r } }; return e(i), r }, Q = !1, G = $(null), Y = $(null), Z = new J, et = function (e) { return e.toLowerCase() }, tt = r.create || function sn(e) { return e ? (sn.prototype = e, new sn) : this }, nt = R || (U ? function (e, t) { return e.__proto__ = t, e } : I && F ? function () { function e(e, t) { for (var n, r = I(t), i = 0, s = r.length; i < s; i++) n = r[i], P.call(e, n) || B(e, n, F(t, n)) } return function (t, n) { do e(t, n); while ((n = q(n)) && !H.call(n, t)); return t } }() : function (e, t) { for (var n in t) e[n] = t[n]; return e }), rt = e.MutationObserver || e.WebKitMutationObserver, it = (e.HTMLElement || e.Element || e.Node).prototype, st = !H.call(it, M), ot = st ? function (e, t, n) { return e[t] = n.value, e } : B, ut = st ? function (e) { return e.nodeType === 1 } : function (e) { return H.call(it, e) }, at = st && [], ft = it.attachShadow, lt = it.cloneNode, ct = it.dispatchEvent, ht = it.getAttribute, pt = it.hasAttribute, dt = it.removeAttribute, vt = it.setAttribute, mt = n.createElement, gt = mt, yt = rt && { attributes: !0, characterData: !0, attributeOldValue: !0 }, bt = rt || function (e) { Nt = !1, M.removeEventListener(E, bt) }, wt, Et = 0, St = s in n && !/^force-all/.test(t.type), xt = !0, Tt = !1, Nt = !0, Ct = !0, kt = !0, Lt, At, Ot, Mt, _t, Dt, Pt; St || (R || U ? (Dt = function (e, t) { H.call(t, e) || Xt(e, t) }, Pt = Xt) : (Dt = function (e, t) { e[o] || (e[o] = r(!0), Xt(e, t)) }, Pt = Dt), st ? (Nt = !1, function () { var e = F(it, u), t = e.value, n = function (e) { var t = new CustomEvent(E, { bubbles: !0 }); t.attrName = e, t.prevValue = ht.call(this, e), t.newValue = null, t[w] = t.attrChange = 2, dt.call(this, e), ct.call(this, t) }, r = function (e, t) { var n = pt.call(this, e), r = n && ht.call(this, e), i = new CustomEvent(E, { bubbles: !0 }); vt.call(this, e, t), i.attrName = e, i.prevValue = n ? r : null, i.newValue = t, n ? i[b] = i.attrChange = 1 : i[y] = i.attrChange = 0, ct.call(this, i) }, i = function (e) { var t = e.currentTarget, n = t[o], r = e.propertyName, i; n.hasOwnProperty(r) && (n = n[r], i = new CustomEvent(E, { bubbles: !0 }), i.attrName = n.name, i.prevValue = n.value || null, i.newValue = n.value = t[r] || null, i.prevValue == null ? i[y] = i.attrChange = 0 : i[b] = i.attrChange = 1, ct.call(t, i)) }; e.value = function (e, s, u) { e === E && this[h] && this.setAttribute !== r && (this[o] = { className: { name: "class", value: this.className } }, this.setAttribute = r, this.removeAttribute = n, t.call(this, "propertychange", i)), t.call(this, e, s, u) }, B(it, u, e) }()) : rt || (M[u](E, bt), M.setAttribute(o, 1), M.removeAttribute(o), Nt && (Lt = function (e) {                var t = this, n, r, i; if (t === e.target) {
                    n = t[o], t[o] = r = Ot(t); for (i in r) { if (!(i in n)) return At(0, t, i, n[i], r[i], y); if (r[i] !== n[i]) return At(1, t, i, n[i], r[i], b) } for (i in n) if (!(i in r)) return At(2, t, i, n[i]
                        , r[i], w)
                }
            }, At = function (e, t, n, r, i, s) { var o = { attrChange: e, currentTarget: t, attrName: n, prevValue: r, newValue: i }; o[s] = e, Rt(o) }, Ot = function (e) { for (var t, n, r = {}, i = e.attributes, s = 0, o = i.length; s < o; s++) t = i[s], n = t.name, n !== "setAttribute" && (r[n] = t.value); return r })), n[s] = function (t, r) { p = t.toUpperCase(), xt && (xt = !1, rt ? (Mt = function (e, t) { function n(e, t) { for (var n = 0, r = e.length; n < r; t(e[n++])); } return new rt(function (r) { for (var i, s, o, u = 0, a = r.length; u < a; u++) i = r[u], i.type === "childList" ? (n(i.addedNodes, e), n(i.removedNodes, t)) : (s = i.target, kt && s[h] && i.attributeName !== "style" && (o = ht.call(s, i.attributeName), o !== i.oldValue && s[h](i.attributeName, i.oldValue, o))) }) }(Ft(a), Ft(l)), _t = function (e) { return Mt.observe(e, { childList: !0, subtree: !0 }), e }, _t(n), ft && (it.attachShadow = function () { return _t(ft.apply(this, arguments)) })) : (wt = [], n[u]("DOMNodeInserted", Ut(a)), n[u]("DOMNodeRemoved", Ut(l))), n[u](S, zt), n[u]("readystatechange", zt), it.cloneNode = function (e) { var t = lt.call(this, !!e), n = It(t); return -1 < n && Pt(t, A[n]), e && O.length && jt(t.querySelectorAll(O)), t }); if (Tt) return Tt = !1; -2 < _.call(L, N + p) + _.call(L, T + p) && $t(t); if (!C.test(p) || -1 < _.call(k, p)) throw new Error("The type " + t + " is invalid"); var i = function () { return o ? n.createElement(f, p) : n.createElement(f) }, s = r || D, o = P.call(s, c), f = o ? r[c].toUpperCase() : p, p, d; return o && -1 < _.call(L, T + f) && $t(f), d = L.push((o ? N : T) + p) - 1, O = O.concat(O.length ? "," : "", o ? f + '[is="' + t.toLowerCase() + '"]' : f), i.prototype = A[d] = P.call(s, "prototype") ? s.prototype : tt(it), O.length && Bt(n.querySelectorAll(O), a), i }, n.createElement = gt = function (e, t) { var r = Yt(t), i = r ? mt.call(n, e, et(r)) : mt.call(n, e), s = "" + e, o = _.call(L, (r ? N : T) + (r || s).toUpperCase()), u = -1 < o; return r && (i.setAttribute("is", r = r.toLowerCase()), u && (u = qt(s.toUpperCase(), r))), kt = !n.createElement.innerHTMLHelper, u && Pt(i, A[o]), i }), Kt.prototype = { constructor: Kt, define: V ? function (e, t, n) { if (n) Qt(e, t, n); else { var r = e.toUpperCase(); G[r] = { constructor: t, create: [r] }, Z.set(t, r), X.define(e, t) } } : Qt, get: V ? function (e) { return X.get(e) || Gt(e) } : Gt, whenDefined: V ? function (e) { return K.race([X.whenDefined(e), en(e)]) } : en }; if (!X || /^force/.test(t.type)) tn(); else if (!t.noBuiltIn) try { (function (t, r, i) { r[c] = "a", t.prototype = tt(HTMLAnchorElement.prototype), t.prototype.constructor = t, e.customElements.define(i, t, r); if (ht.call(n.createElement("a", { is: i }), "is") !== i || V && ht.call(new t, "is") !== i) throw r })(function on() { return Reflect.construct(HTMLAnchorElement, [], on) }, {}, "document-register-element-a") } catch (nn) { tn() } if (!t.noBuiltIn) try { mt.call(n, "a", "a") } catch (rn) { et = function (e) { return { is: e.toLowerCase() } } }
    })(window);
}

//Creación del objeto Sinco
var Sinco = (function (exports) {

    //Propiedades de ventana
    exports['isIE'] = navigator.appName == 'Microsoft Internet Exporer' ||
        !!(navigator.userAgent.match(/Trident/) ||
            navigator.userAgent.match(/rv 11/));

    exports['isFirefox'] = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

    exports['versionIE'] = (function () {
        var rv = -1;
        if (exports['isIE']) {
            var ua = navigator.userAgent;
            var re = new RegExp((ua.lastIndexOf('rv:') > 0 ? 'rv:' : (ua.lastIndexOf('MSIE ') > 0 ? 'MSIE ' : 'Edge/')) + "([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null) {
                rv = parseFloat(RegExp.$1);
            }
        }
        return rv;
    })();
    exports['isMobile'] = navigator.isMobile ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

    /**
     * @name SincoInitializationError
     *
     * @description Objeto que controla las excepciones de inicialización de objetos
     * @param {string} m String para mostrar como error.
     */
    function SincoInitializationError(m) {
        this.name = 'Sinco Initialization Error';
        this.message = m;
    }
    SincoInitializationError.prototype = Error.prototype;
    window['SincoInitializationError'] = SincoInitializationError;

    var fileToBase64 = function (file, callback) {
        if (file) {
            if (FileReader) {
                if (file instanceof File) {
                    var FR = new FileReader();
                    FR.name = file.name;
                    FR.size = file.size;
                    FR.onload = function (e) {
                        var archivo = {
                            'name': this.name,
                            'src': e.target.result.split(',').pop(),
                            'kilobytes': this.size
                        };
                        if (callback) {
                            callback(archivo);
                        }
                    }
                    FR.readAsDataURL(file);
                }
                else {
                    throw new SincoInitializationError('¡El primer parámetro debe ser de tipo "File"!');
                }
            }
            else {
                throw new SincoInitializationError('¡El navegador no soporta esta funcionalidad!');
            }
        }
    }

    var fallback = function (name, fallback) {
        var nativeFn = Array.prototype[name];
        return function (obj, iterator, memo) {
            var fn = obj ? obj[name] : 0;
            return fn && fn === nativeFn ?
                fn.call(obj, iterator, memo) :
                fallback(obj, iterator, memo);
        };
    };

    var eachSync = fallback('forEach', function (obj, iterator) {
        var isObj = obj instanceof Object;
        var arr = isObj ? Object.keys(obj) : (obj || []);
        for (var i = 0, len = arr.length; i < len; i++) {
            var k = isObj ? arr[i] : i;
            iterator(obj[k], k, obj);
        }
    });

    var eachParallel = function (obj, iterator, callback) {
        var len = obj.length || Object.keys(obj).length;
        if (!len) {
            return callback();
        }
        var completed = 0;
        eachSync(obj, function () {
            var cb = function (err) {
                if (err) {
                    callback(err);
                    callback = function () { };
                }
                else {
                    if (++completed === len) {
                        callback();
                    }
                }
            };
            var args = Array.prototype.slice.call(arguments);
            if (iterator.length) {
                args = args.slice(0, iterator.length - 1);
                args[iterator.length - 1] = cb;
            }
            else {
                args.push(cb);
            }
            iterator.apply(this, args);
        });
    };

    var eachSeries = function (obj, iterator, callback) {
        var keys_list = Object.keys(obj);
        if (!keys_list.length) {
            return callback();
        }
        var completed = 0;
        var iterate = function () {
            var k = keys_list[completed];
            var args = [obj[k], k, obj].slice(0, iterator.length - 1);
            args[iterator.length - 1] = function (err) {
                if (err) {
                    callback(err);
                    callback = function () { };
                }
                else {
                    if (++completed === keys_list.length) {
                        callback();
                    }
                    else {
                        iterate();
                    }
                }
            };
            iterator.apply(this, args);
        };
        iterate();
    };

    var mapSync = fallback('map', function (obj, iterator) {
        var results = [];
        eachSync(obj, function (v, k, obj) {
            results[results.length] = iterator(v, k, obj);
        });
        return results;
    });

    var mapAsync = function (eachfn) {
        return function (obj, iterator, callback) {
            var results = [];
            eachfn(obj, function (value, i, obj, callback) {
                var cb = function (err, v) {
                    results[results.length] = v;
                    callback(err);
                };
                var args = [value, i, obj];
                if (iterator.length) {
                    args = args.slice(0, iterator.length - 1);
                    args[iterator.length - 1] = cb;
                }
                else {
                    args.push(cb);
                }
                iterator.apply(this, args);
            }, function (err) {
                callback(err, results);
            });
        };
    };

    var filterSync = fallback('filter', function (obj, iterator, callback) {
        var results = [];
        eachSync(obj, function (v, k, obj) {
            if (iterator(v, k, obj)) {
                results[results.length] = v;
            }
        });
        return results;
    });

    var filterParallel = function (obj, iterator, callback) {
        var results = [];
        eachParallel(obj, function (value, k, obj, callback) {
            var cb = function (err, a) {
                if (a) {
                    results[results.length] = value;
                }
                callback(err);
            };
            var args = [value, k, obj];
            if (iterator.length) {
                args = args.slice(0, iterator.length - 1);
                args[iterator.length - 1] = cb;
            }
            else {
                args.push(cb);
            }
            iterator.apply(this, args);
        }, function (err) {
            callback(err, results);
        });
    };

    var reduceSync = fallback('reduce', function (obj, iterator, memo) {
        eachSync(obj, function (v, i, obj) {
            memo = iterator(memo, v, i, obj);
        });
        return memo;
    });

    var reduceSeries = function (obj, iterator, memo, callback) {
        eachSeries(obj, function (value, i, obj, callback) {
            var cb = function (err, v) {
                memo = v;
                callback(err);
            };
            var args = [memo, value, i, obj];
            if (iterator.length) {
                args = args.slice(0, iterator.length - 1);
                args[iterator.length - 1] = cb;
            }
            else {
                args.push(cb);
            }
            iterator.apply(this, args);
        }, function (err) {
            callback(err, memo);
        });
    };

    ////Métodos para Sinco

    var validacionesOnClick = function (configuracion) {

        document.addEventListener('click', function (event) {
            var target = event.target || event.srcElement;
            if (target.nodeName.toLowerCase() !== 'body') {
                var encontrado,
                    excepcionEncontrada;

                var validarClick = function (obj, target) {
                    encontrado = false;
                    excepcionEncontrada = false;
                    if (!!target && target.nodeName.toLowerCase() !== 'html') {
                        while (target.nodeName.toLowerCase() !== 'body') {
                            if (!excepcionEncontrada) {
                                for (var i = 0; i < obj.excepciones.length; i++) {
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

                            if ((obj.target instanceof Array && obj.target.indexOf(target.id) >= 0) || target.id == obj.target) {
                                encontrado = true;
                                break;
                            }
                            target = target.parentNode;
                        }
                    }

                    if (!obj.iguales && !encontrado && !excepcionEncontrada) {
                        obj.funcion();
                    }
                    else if (obj.iguales && encontrado && !excepcionEncontrada) {
                        obj.funcion();
                    }
                }

                configuracion.forEach(function (obj) {
                    (function (target) {
                        validarClick(obj, target);
                    }(target));
                });
            }

        }, true);
    }

    var get = function (id) {
        id = id.toString();
        if (/[$/:-?{-~!"^`\[\]#.\s]/.test(id)) {

            if (document.querySelectorAll) {
                var r = Sinco.map(document.querySelectorAll(id), function (elem) {
                    elem = Sinco.extend(elem);
                    elem.listeners = elem.listeners || {};
                    return elem;
                });

                var def = function(p){
                    Object.defineProperty(r, p, {
                        get: function() {
                            return function() {
                                var args = Array.prototype.slice.call(arguments);
                                this.forEach(function(e){
                                    e[p].apply(e, args);
                                });
                            }
                        },
                        set: function() { throw new ReferenceError('¡El elemento no se puede eliminar ni reasignar!'); },
                        enumerable: false,
                        configurable: false
                    });
                }

                Object.keys(__htmlElementsProps).forEach(def);
    
                return r;
            }
            else {
                var classes = id.split(' ').join('').split('.').clean('');
                var elems = document.body.getElementsByTagName('*');

                var filtrado = Sinco.filter(elems, function (elem) {
                    return elem.classList && classes.filter(function (cl) {
                        return elem.classList.contains(cl);
                    }).length == classes.length;
                }).unique();

                return filtrado.map(function (elem) {
                    elem = Sinco.extend(elem);
                    elem.listeners = elem.listeners || {};
                    return elem;
                });
            }
        }
        else {
            var el = Sinco.extend(document.getElementById(id));
            if (el)
                el.listeners = el.listeners || {};
            return el;
        }
    };

    var extend = function (el, opt) {
        if (!el) return null;
        opt = opt || __htmlElementsProps;

        var extendProps = function (el, opt) {
            for (var n in opt) {
                if (el[n] !== null && typeof el[n] == 'object' && !(el[n] instanceof Array) && !(el[n] instanceof HTMLElement))
                    extendProps(el[n], opt[n]);
                else
                    el[n] = opt[n];
            }
            return el;
        }

        el = extendProps(el, opt);
        el.listeners = el.listeners || {};
        return el;
    }

    var createElem = function (type, attr) {
        var ele = Sinco.extend(document.createElement(type));
        attr = attr || {};
        var k = Object.keys(attr);
        var l = k.length;
        var i = 0;
        var prop;
        while (i < l) {
            prop = k[i];
            ele.attribute(prop, attr[prop]);
            i++;
        }
        ele.listeners = {};
        return ele;
    }

    var attribute = function (nombre, valor) {
        if (!valor)
            return this.getAttribute(nombre);
        else {
            this.setAttribute(nombre, valor);
            dispatch.call(this, 'attribute', { name: nombre, value: valor });
            return this;
        }
    }

    var on = function (eventName, listener) {
        if (!this.listeners[eventName]) this.listeners[eventName] = [];
        this.listeners[eventName].push(listener);
    }

    var off = function (eventName) {
        this.listeners[eventName] = [];
    }

    var dispatch = function (eventName, values) {
        if (this.listeners[eventName]) {
            for (var i = 0; this.listeners[eventName] && i < this.listeners[eventName].length; i++) {
                this.listeners[eventName][i](this, values);
            }
        }
    }

    var insert = function (e, opc) {
        if (Array.isArray(e)) {
            var orig = this;
            e.forEach(function (el) { orig.appendChild(el); });
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
            dispatch.call(this, 'insert');
        }
        return this;
    }

    var _delete = function (ele) {
        var _this = ele || this;
        var _r = Sinco.extend(_this.cloneNode());
        if (!_this.remove) {
            if (_this.parentElement)
                _this.parentElement.removeChild(_this);
        }
        else
            _this.remove();
        return _r;
    }

    var styles = function (n, v) {
        if (!v && v !== '')
            return this.style[n];
        else {
            this.style[n] = v;
            return this;
        }
    }

    var addEvent = function (type, callback) {
        var _this = this;

        if (_this.addEventListener) {
            _this['_' + type] = callback;
            _this.addEventListener(type, callback, false);
        }
        else if (_this.attachEvent) {
            _this['_' + type] = callback;
            _this['e' + type + callback] = callback;
            _this[type + callback] = function () {
                _this['e' + type + callback](window.event);
            }
            _this.attachEvent('on' + type, _this[type + callback]);
        }
        return _this;
    }

    var removeEvent = function (type, callback) {
        if (this.detachEvent) {
            this.detachEvent('on' + type, this[type + callback]);
            this[type + callback] = null;
        }
        else
            this.removeEventListener(type, callback, false);
        return this;
    }

    var __htmlElementsProps = {
        get: get,
        attribute: attribute,
        insert: insert,
        addEvent: addEvent,
        removeEvent: removeEvent,
        styles: styles,
        on: on,
        off: off,
        dispatch: dispatch,
        'delete': _delete
    };

    var encrypt = function (txt) {
        if (typeof txt === 'String')
            return txt.toAESEncrypt();
        else if (txt instanceof Sinco.constructor)
            return txt.value.toAESEncrypt();
        else
            return null;
    }

    var addStyles = function (e, p) {
        if (e instanceof Sinco.constructor) {
            for (var key in p)
                e.styles(key, p[key]);
        }
        else {
            for (var key in p)
                e.style[key] = p[key];
        }
    }

    var parseXml = function (xmlStr) {
        if (window.DOMParser) {
            return new window.DOMParser().parseFromString(xmlStr, 'text/xml');
        }
        var xmlDoc = null;
        if (typeof window.ActiveXObject != 'undefined' && !!(xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM'))) {
            xmlDoc.async = 'false';
            xmlDoc.loadXML(xmlStr);
        }
        return xmlDoc;
    }

    var map = function (obj, iterator, callback) {
        if (Array.prototype.map && obj && obj.length) {
            return Array.prototype.map.call(obj, iterator);
        }
        else {
            return (callback ? mapAsync(eachParallel) : mapSync)(obj, iterator, callback);
        }
    }

    var filter = function (obj, iterator, callback) {
        return (callback ? filterParallel : filterSync)(obj, iterator, callback);
    }

    var reduce = function (obj, iterator, memo, callback) {
        return (callback ? reduceSeries : reduceSync)(obj, iterator, memo, callback);
    }

    var parallel = function (fns, callback) {
        var results = new fns.constructor();
        eachParallel(fns, function (fn, k, cb) {
            fn(function (err) {
                var v = Array.prototype.slice.call(arguments, 1);
                results[k] = v.length <= 1 ? v[0] : v;
                cb(err);
            });
        }, function (err) {
            (callback || function () { })(err, results);
        });
    }

    var series = function (fns, callback) {
        var results = new fns.constructor();
        eachSeries(fns, function (fn, k, cb) {
            fn(function (err, result) {
                var v = Array.prototype.slice.call(arguments, 1);
                results[k] = v.length <= 1 ? v[0] : v;
                cb(err);
            });
        }, function (err) {
            (callback || function () { })(err, results);
        });
    }

    var RequestStatusCodes = {
        '0': 'InternalServerError',
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

    var Request = function (method, url, fn, data, contentType, includeAccept) {
        var f = function () { };
        var alerta;

        includeAccept = typeof includeAccept == 'boolean' ? includeAccept : true;
        fn = fn || {};

        for (var code in RequestStatusCodes) {
            switch (code) {
                case '408':
                    fn.RequestTimeout = function () { alert('No se puede establecer comunicación con el servidor'); };
                    break;
                case '409':
                    fn.Conflict = fn.Conflict || function () {
                                    alert('Se cerrará esta sesión porque el usuario ha ingresado en otro dispositivo');
                                    window.location.href = 'login.aspx';
                                };
                    break;
                case '412':
                    fn.PreconditionFailed = fn.PreconditionFailed || function () {
                                                console.log('Posiblemente la sesión no se comparte entre el marco y el módulo');
                                                if (!alerta) {
                                                    alerta = true;
                                                    alert('No existe Sesión');
                                                }
                                                window.location.href = 'login.aspx';
                                            };
                    break;
                default:
                    fn[RequestStatusCodes[code]] = fn[RequestStatusCodes[code]] || f;
                    break;
            }
        }

        var types = {
            JSON: 'application/json; charset=utf-8',
            XML: 'application/xml; charset=utf-8',
            TEXT: 'text/plain; charset=utf-8',
            DEFAULT: 'application/x-www-form-urlencoded'
        };

        var _exec = function (prevFn, fn, text, viewContent, responseHeaders) {
            if (viewContent) {

                responseHeaders = responseHeaders.split('\n').filter(function (item) { return item.split(' ').join('') !== '' && item.split('\r').join('') !== ''; }).map(function (item) {
                    var splitted = item.split(':');
                    return {
                        name: splitted[0],
                        value: splitted[1].trim()
                    };
                });

                switch (contentType.toUpperCase()) {
                    case 'JSON':
                    case 'DEFAULT':
                        text = JSON.tryParse(text);
                        break;
                    case 'XML':
                        text = parseXml(text);
                        break;
                }
            }

            if (prevFn) {
                prevFn(contentType.toUpperCase() == 'JSON' || contentType.toUpperCase() == 'DEFAULT' ? JSON.tryParse(text) : (contentType.toUpperCase() == 'XML' ? parseXml(text) : text), responseHeaders);
            }

            fn(text, responseHeaders);
        };

        contentType = contentType || 'json';

        var http = new XMLHttpRequest();
        http.open(method, url, true);
        if (includeAccept === true) {
            http.setRequestHeader('Accept', 'application/json, text/javascript');
        }

        http.setRequestHeader('Content-type', types.hasOwnProperty(contentType.toUpperCase()) ? types[contentType.toUpperCase()] : contentType);
        
        var headers = Request.headersConfig.filter(function (header) {
            return url.toLowerCase().startsWith(header.url.toLowerCase());
        }).reduce(function (acum, act) {
            if (!acum.some(function (a) {
                return a.type.toLowerCase() === act.type.toLowerCase();
            })) {
                acum.push(act);
            }
            return acum;
        }, []);

        if (headers.length > 0) {
            headers.forEach(function (header) {
                http.setRequestHeader(header.type, typeof header.value == 'function' ? header.value() : header.value);
            });
        }

        var __switch = [200, 201, 300];
        http.onreadystatechange = function () {
            if (http.readyState == 4) {
                _exec(Request.responseFunctions[RequestStatusCodes[http.status]], fn[RequestStatusCodes[http.status]], http.responseText, __switch.contains(http.status), http.getAllResponseHeaders());
            }
        };
        if (data) {
            if (contentType.toUpperCase() == 'DEFAULT') {
                var params = [];
                for (var attr in data) {
                    if (data[attr] instanceof Array) {
                        if (!!data[attr].length) {
                            data[attr].forEach(function (d) {
                                params.push(String.format('{0}={1}', attr, encodeURIComponent(d)));
                            });
                        }
                        else {
                            params.push(String.format('{0}={1}', attr, ''));
                        }
                    }
                    else {
                        params.push(String.format('{0}={1}', attr, encodeURIComponent(data[attr])));
                    }
                }
                http.send(params.join('&'));
            }
            else if (contentType.toUpperCase() == 'TEXT') {
                http.send(data);
            }
            else {
                http.send(JSON.stringify(data));
            }
        }
        else
            http.send();

        return http;
    }
    Object.defineProperty(Request, 'headersConfig', {
        value: [],
        enumerable: false,
        configurable: false
    });
    Object.defineProperty(Request, 'responseFunctions', {
        value: {},
        enumerable: false,
        configurable: false
    });
    Request.setHeader = function (url, type, value) {
        if (Request.headersConfig.some(function (hc) { return hc.url == url && hc.type == type; })) {
            Request.headersConfig
                .filter(function (hc) { return hc.url == url && hc.type == type; })
                .forEach(function(hc) {
                    hc.type = type;
                    hc.value = value;
                });
        }
        else {
            Request.headersConfig.push({ url: url, type: type, value: value });
        }
    };
    Request.setResponseFunctions = function (fns) {
        for (var name in fns) {
            Request.responseFunctions[name] = fns[name];
        }
    };

    var script = function () {

        var extractHostname = function (url) {
            var hostname;

            if (url.indexOf("://") > -1) {
                hostname = url.split('/')[2];
            }
            else {
                hostname = url.split('/')[0];
            }

            hostname = hostname.split(':')[0];
            hostname = hostname.split('?')[0];

            return hostname;
        }

        var _url = window.location.href.split('/');
        _url.pop();

        var _s = document.getElementsByTagName('script');
        var _src = _s[_s.length - 1].src;

        var _domain = extractHostname(_src);
        var _urlOriginal = _src;

        _src = _src.replaceAll(_url.join('/'), '').split('/');
        _s = _src.pop();
        _src.shift();
        return {
            name: _s.split('.').shift(),
            url: _s,
            path: _src.join('/'),
            originalUrl: _urlOriginal.split(_s).join(''),
            host: _domain,
            locationHost: extractHostname(window.location.href)
        };
    }

    var QueryString = {
        toString: function () {
            var retorno = '',
                sep = '';
            for (var name in Sinco.QueryString) {
                if (typeof Sinco.QueryString[name] !== 'function') {
                    retorno += sep + name + '=' + Sinco.QueryString[name];
                    sep = '&';
                }
            }
            return retorno;
        },
        hasProperties: function () {
            for (var name in Sinco.QueryString)
                if (typeof Sinco.QueryString[name] !== 'function')
                    return true;
            return false;
        }
    };

    var hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    if (window.location.href.lastIndexOf(hashes[0]) != 0) {
        hashes.forEach(function (hash) {
            hash = hash.split('=');
            QueryString[hash[0].toLowerCase()] = hash[1].split('#').shift();
        });
    }

    var initialize = function (_plugins, _fn, _src) {
        var SincoRequire = function (plugins, fn, src) {

            //Funcionalidades Require
            {

                var modules = [],
                    pending = [],
                    loaded = [];

                /**
                 * @name Define
                 *
                 * @description Función que realiza la creación de un módulo importando funcionalidades
                 *              definidas en otros recursos
                 * @param {String} name String con el nombre que identificará el módulo.
                 * @param {*} _dependencies Objeto de tipo Función o Arreglo. Al ser arreglo, son los
                 *                           módulos que éste necesitará.
                 * @param {Function} _module Función que se ejecutará al momento de cargar las dependencias.
                 */
                var define = function (name, _dependencies, _module) {
                    var dependencies, module;
                    if (typeof _dependencies === 'function')
                        module = _dependencies,
                            dependencies = require.extractDependencies(module);
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

                    unroll();

                    if (require.onModule)
                        require.onModule(modules[name]);

                    return modules[name];
                };

                /**
                 * @name Require
                 *
                 * @description Función que realiza el importando de funcionalidades
                 *              definidas en otros recursos para su utilización.
                 * @param {*} _dependencies Objeto de tipo Función o Arreglo. Al ser arreglo, son los
                 *                           módulos que éste necesitará.
                 * @param {Function} _callback Función que se ejecutará al momento de cargar las dependencias.
                 */
                var require = function (_dependencies, _callback) {
                    var dependencies, callback;
                    if (typeof _dependencies === 'function')
                        callback = _dependencies,
                            dependencies = require.extractDependencies(callback);
                    else
                        dependencies = _dependencies,
                            callback = _callback;

                    var module = {
                        callback: callback,
                        dependencies: dependencies
                    };

                    modules.push(module);

                    if (require.onModule)
                        require.onModule(module);

                    unroll();

                    return module;
                };

                /**
                 * @private
                 * @name Unroll
                 *
                 * @description Función que realiza la carga de submódulos en los módulos.
                 */
                var unroll = function () {
                    Sinco.map(Object.keys(modules), function (name) {
                        return modules[name];
                    })
                        .concat(modules)
                        .forEach(function (module) {
                            if (!module.loaded && module.dependencies.every(function (depn) {
                                return loaded.indexOf(depn) !== -1;
                            })) {

                                loaded.push(module.name);
                                module.loaded = true;
                                module.module = module.callback.apply(null, module.dependencies
                                    .map(function (depn) {
                                        return modules[depn].module;
                                    }));

                                unroll();
                            }
                        });
                };

                /**
                 * @name extractDependencies
                 *
                 * @description Función que realiza la extracción de las dependencias que
                 *              requiere el módulo actual
                 * @param {Function} fn Función de la cual se tomará su nombre para agregar
                 *                   la dependencia.
                 */
                require.extractDependencies = function (fn) {
                    fn = fn.toString();

                    fn = fn.replace(/\/\*[^(?:\*\/)]+\*\//g, '');
                    fn = fn.match(/function \(([^\)]*)\)/)[1];

                    return fn ? fn.split(',').map(function (dependency) {
                        return dependency.trim();
                    }) : [];
                };

                /**
                 * @name loadScript
                 *
                 * @description Función que realiza la carga del script correspondiente al
                 *              módulo referenciado.
                 * @param {String} src String correspondiente a la ruta del archivo que contiene
                 *                 la definición del modulo requerido.
                 * @param {Function} callback Función que se ejecuta al cargar el archivo.
                 */
                require.loadScript = function (src, callback) {
                    var script = document.createElement('script');
                    script.onload = callback;
                    script.onerror = function () {
                        Sinco.extend(script)['delete']();
                    }

                    document.getElementsByTagName('head')[0].appendChild(script);
                    script.src = src + (window['version-js'] ? '?v=' + window['version-js'] : '');
                };

                require.modules = modules;
            }

            if (!src) {
                var url = window.location.href.split('/');
                url.pop();
                src = Sinco.map(document.getElementsByTagName('script'), function (s) { return s; }).pop().src.replaceAll(url.join('/'), '').split('/');
                src.shift();
                src.pop();
                src = src.join('/');
                if (src.startsWith('/' + window.location.host)) {
                    src = src.replace('/' + window.location.host, '');
                }
            }

            var modulos, version;

            var getVersion = function () {
                var splitted = document.currentScript.src.split('=');
                if (splitted.length > 1) {
                    version = splitted.pop();
                }
            };

            var addOnModule = function () {
                plugins = null;
                if (!!modulos && !!modulos.dependencies) {
                    modulos.dependencies.forEach(function (dependency) {
                        if (pending.indexOf(dependency) == -1) {
                            require.loadScript(src + '/' + dependency + '.js', function () {
                                //pending.splice(pending.indexOf(dependency), 1);
                            });

                            pending.push(dependency);
                        }
                    });
                }
                if (!!fn && typeof fn === "function") {
                    fn();
                }
            };

            if (plugins) {
                var sum = 0;
                getVersion();
                plugins.forEach(function (script) {
                    var _url = 's5.' + script + '.js' + (version && !window['version-js'] ? '?v=' + version : '');

                    if (Sinco.script.locationHost != Sinco.script.host) {
                        _url = Sinco.script.originalUrl + _url;
                    }
                    else {
                        _url = Sinco.script.path + '/' + _url;
                    }

                    require.loadScript(_url, function () {
                        sum++;
                        if (sum == plugins.length) {
                            addOnModule();
                        }
                    });
                });
            }

            require.onModule = function (module) {
                modulos = module;
                if (!plugins) {
                    addOnModule();
                }
            };

            var components = {
                'import': function (component) {
                    var path = 's5_components';
                    require.loadScript(path + '/' + component + '/' + component + '.js');
                }
            };

            this.require = require;
            this.define = define;
            this.components = components;
        }

        return new SincoRequire(_plugins, _fn, _src);
    }

    var watch = function (obj, prop, callback) {
        var oldValue = obj[prop]
          , newValue = oldValue
          , getter = function () { return newValue; }
          , setter = function (value) {
              oldValue = newValue;
              newValue = value;
              callback.call(obj, prop, oldValue, newValue);
          };
        if (delete obj[prop]) {
            if (Object.defineProperty) {
                Object.defineProperty(obj, prop, {
                    get: getter,
                    set: setter,
                    enumerable: true,
                    configurable: true
                });
            } else if (Object.prototype.__defineGetter__ && Object.prototype.__defineSetter__) {
                Object.prototype.__defineGetter__(obj, prop, getter);
                Object.prototype.__defineSetter__(obj, prop, setter);
            }
        }
        return this;
    };

    var model = {
        define: function (nombreClase, props, functions) {
            var propiedades_Clase = Object.keys(props);
            var funciones = Object.keys(functions);
                
            window[nombreClase] = (new Function('parametros_NuevaInstancia', 'return function (props_Clase, funcion_Constructor) { return function ' + nombreClase + ' (parametros_NuevaInstancia){ \
                var obj = this; \
                props_Clase.forEach(function (key){ \
				    obj[key] = parametros_NuevaInstancia[key]; \
				    }); \
                funcion_Constructor.call(this, parametros_NuevaInstancia); \
			    return obj; \
		    }; };')())(propiedades_Clase, functions.constructor);


            funciones.forEach(function (key) {
                window[nombreClase].prototype[key] = functions[key];
            });

            var extend = function (name, props, functions) {

                var ext = function (el, opt) {
                    for (var n in opt)
                        el[n] = opt[n];
                    return el;
                };

                functions = functions || {};

                ext(props, this.props);
                ext(functions, this.functions);


                return model.define(name, props, functions);
            }


            window[nombreClase].prototype.validate = function () {

            }

            return {
                extend: extend,
                props: props,
                functions: functions
            }

        },

        create: function (clase, data) {
            return new window[clase](data);
        }
    }

    var interpolate = function (str) {
        return function interpolate(o) {
            return str.replace(/{{([^{}]*)}}/g, function (a, b) {
                var r = typeof o[b] == "function" ? o[b]() : o[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            });
        }
    }

    return {
        extend: extend,
        get: get,
        createElem: createElem,
        'delete': _delete,
        utilities:
        {
            encrypt: encrypt,
            addStyles: addStyles,
            parseXml: parseXml,
            onClickValidations: validacionesOnClick
        },
        map: map,
        filter: filter,
        reduce: reduce,
        parallel: parallel,
        series: series,
        Request: Request,
        QueryString: QueryString,
        script: script(),
        initialize: initialize,
        fileToBase64: fileToBase64,
        watch: watch,
        model: model,
        interpolate: interpolate,
        addEvent: addEvent,
        removeEvent: removeEvent
    };
})(window);

window['Sinco'] = Sinco;