/**
 * @license S5.js v1.0
 * (c) 2015-2016 Sincosoft, Inc. http://sinco.com.co
 * 
 * Creation date: 21/07/2015
 * Last change: 16/05/2016
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
        Array.prototype.find = function(predicate) {
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
}

//Opciones de String
{
    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function (str) {
            return this.indexOf(str) === 0;
        };
    }

    if (!String.prototype.endsWith) {
        String.prototype.endsWith = function(searchString, position) {
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

    String.concat = function () {
        return Array.prototype.slice.call(arguments).join('');
    };

    String.toAESEncrypt = String.prototype.toAESEncrypt = function () {
        if (typeof CryptoJS === 'undefined') {
            throw new SincoInitializationError('¡Falta la referencia de AES.js!');
        }
        var key = CryptoJS.enc.Utf8.parse(String.concat(String.fromCharCode(53), String.fromCharCode(49), String.fromCharCode(110),
                                          String.fromCharCode(99), String.fromCharCode(48), String.fromCharCode(115), String.fromCharCode(111),
                                          String.fromCharCode(102), String.fromCharCode(116), String.fromCharCode(95), String.fromCharCode(53),
                                          String.fromCharCode(46), String.fromCharCode(65), String.fromCharCode(46), String.fromCharCode(53),
                                          String.fromCharCode(46))); //Mismo KEY usado en C#
        var iv = CryptoJS.enc.Utf8.parse(String.concat(String.fromCharCode(95), String.fromCharCode(84), String.fromCharCode(49),
                                         String.fromCharCode(99), String.fromCharCode(115), String.fromCharCode(124), String.fromCharCode(70),
                                         String.fromCharCode(111), String.fromCharCode(110), String.fromCharCode(42), String.fromCharCode(53),
                                         String.fromCharCode(111), String.fromCharCode(95), String.fromCharCode(83), String.fromCharCode(52),
                                         String.fromCharCode(53))); //Mismo IV usado en C#

        var text = (typeof (this) == 'function') ? arguments[0] : this;

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
        if (id.lastIndexOf('.') > -1) {

            if (document.querySelectorAll) {
                return Sinco.map(document.querySelectorAll(id), function (elem) {
                    elem = Sinco.extend(elem);
                    elem.listeners = elem.listeners || {};
                    return elem;
                });
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
        opt = opt || this;
        for (var n in opt) {
            el[n] = opt[n];
        }

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
            if (this.childNodes[opc]){
                this.insertBefore(e, this.childNodes[opc]);
            }
            else{
                this.appendChild(e);
            }
        }
        else {
            this.insertBefore(e, this.firstChild);
        }

        if (this.listeners['insert']) {
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

    var Request = function (method, url, functions, data, contentType, includeAccept) {
        includeAccept = typeof includeAccept == 'boolean' ? includeAccept : true;
        functions = functions || {};
        functions.Ok = functions.Ok || function () { };
        functions.BadRequest = functions.BadRequest || function () { };
        functions.Unauthorized = functions.Unauthorized || function () { };
        functions.NotFound = functions.NotFound || function () { };
        functions.InternalServerError = functions.InternalServerError || function () { };
        functions.GatewayTimeout = functions.GatewayTimeout || function () { };

        var types = { JSON: 'application/json; charset=utf-8', XML: 'application/xml; charset=utf-8', TEXT: 'text/plain; charset=utf-8', DEFAULT: 'application/x-www-form-urlencoded' };

        contentType = contentType || 'json';

        var http = new XMLHttpRequest();
        http.open(method, url, true);
        if (includeAccept === true) {
            http.setRequestHeader('Accept', 'application/json, text/javascript');
        }

        http.setRequestHeader('Content-type', types.hasOwnProperty(contentType.toUpperCase()) ? types[contentType.toUpperCase()] : contentType);

        http.onreadystatechange = function () {
            if (http.readyState == 4) {
                switch (http.status) {
                    case 200:
                        switch (contentType.toUpperCase()) {
                            case 'TEXT':
                                functions.Ok(http.responseText);
                                break;
                            case 'JSON':
                                functions.Ok(JSON.tryParse(http.responseText));
                                break;
                            case 'DEFAULT':
                                functions.Ok(JSON.tryParse(http.responseText));
                                break;
                            case 'XML':
                                functions.Ok(parseXml(http.responseText));
                                break;
                        }
                        break;                        
                    case 201:
                        switch (contentType.toUpperCase()) {
                            case 'TEXT':
                                functions.Created(http.responseText);
                                break;
                            case 'JSON':
                                functions.Created(JSON.tryParse(http.responseText));
                                break;
                            case 'DEFAULT':
                                functions.Created(JSON.tryParse(http.responseText));
                                break;
                            case 'XML':
                                functions.Created(parseXml(http.responseText));
                                break;
                        }
                        break;
                    case 204:
                        functions.NoContent(http.responseText);
                        break;
                    case 302:
                        functions.Moved(http.responseText);
                        break;
                    case 400:
                        functions.BadRequest(http.responseText);
                        break;
                    case 401:
                        functions.Unauthorized(http.responseText);
                        break;
                    case 404:
                        functions.NotFound(http.responseText);
                        break;
                    case 408:
                        alert('No se puede establecer comunicación con el servidor');
                        break;
                    case 409:
                        alert('Se cerrará esta sesión porque el usuario ha ingresado en otro dispositivo');
                        window.location.href = 'login.aspx';
                        break;
                    case 412:
                        console.log('Posiblemente la sesión no se comparte entre el marco y el módulo');
                        alert('No existe Sesión');
                        window.location.href = 'login.aspx';
                        break;
                    case 500:
                    case 0:
                        functions.InternalServerError(http.responseText);
                        break;
                    case 504:
                        functions.GatewayTimeout(http.responseText);
                        break;
                }
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

    var initialize = function (plugins) {
        var url = window.location.href.split('/');
        url.pop();
        var src = Sinco.map(document.getElementsByTagName('script'), function (s) { return s; }).pop().src.replaceAll(url.join('/'), '').split('/');
        src.shift();
        src.pop();
        src = src.join('/');

        var modulos, version;

        var getVersion = function () {
            var splitted=document.querySelector('script[src*="s5.js"]').src.split('=');
            if(splitted.length>1){
                version = splitted.pop();
            }
        }

        var addOnModule = function () {
            plugins = null;
            if (modulos && modulos.dependencies){
                modulos.dependencies.forEach(function (dependency) {
                    if (pending.indexOf(dependency) == -1) {
                        require.loadScript(src + '/' + dependency + '.js', function () {
                            //pending.splice(pending.indexOf(dependency), 1);
                        });

                        pending.push(dependency);
                    }
                });
            }
        }

        if (plugins) {
            var sum = 0;
            getVersion();
            plugins.forEach(function (script) {
                var _url = 's5.' + script + '.js' + (version ? '?v=' + version : '');

                if (Sinco.script.locationHost != Sinco.script.host){
                    _url = Sinco.script.originalUrl + _url;
                }
                else{
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

        return {
            require: require,
            define: define
        }
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


    return {
        extend: extend,
        get: get,
        on: on,
        off: off,
        dispatch: dispatch,
        createElem: createElem,
        attribute: attribute,
        insert: insert,
        'delete': _delete,
        styles: styles,
        addEvent: addEvent,
        removeEvent: removeEvent,
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
        watch: watch
    };
})(window);