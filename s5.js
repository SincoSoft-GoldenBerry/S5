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
}

//Opciones de String
{
    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function (str) {
            return this.indexOf(str) === 0;
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
                      navigator.userAgent.match(/rv 11/) || navigator.userAgent.match(/Edge/));
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

            var encontrado,
                excepcionEncontrada;

            var validarClick = function (obj, target) {
                encontrado = false;
                excepcionEncontrada = false;
                if (!!target && target.nodeName.toLowerCase() !== 'html') {
                    while (target.nodeName.toLowerCase() !== 'body') {
                        if (!excepcionEncontrada) {
                            for (var i = 0; i < obj.excepciones.length; i++) {
                                if (target.classList && obj.excepciones[i].startsWith('.') && target.classList.contains( obj.excepciones[i].replace('.', '') )) {
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

        }, true);
    }

    var ce = function (n) {
        var r = document.createElementNS('http://www.w3.org/2000/svg', n);
        r.attr = function (n, v) {
            if (!!v)
                r.setAttributeNS(null, n, v);
            else
                r.getAttributeNS(null, n);
        };
        if (n == 'svg') {
            r.attr('preserveAspectRatio', 'xMinYMax meet');
            r.attr('focusable', 'false');
        }
        return r;
    }

    var iconos = {
        Triangulo: function (dim, bgColor) {
            dim = dim || 8;
            bgColor = bgColor || '#1B344C';

            var _svg = ce('svg');
            _svg.attr('width', dim);
            _svg.attr('height', dim);

            _svg.attr('viewBox', '0 0 8 8');

            var _poly = ce('polygon');
            _poly.style.fill = bgColor;
            _poly.attr('points', '0,0 8,0 4,8');
            _svg.appendChild(_poly);

            _svg = Sinco.extend(_svg);
            return _svg;
        },
        Portafolio: function (dim, bgColor) {
            dim = dim || 25;
            bgColor = bgColor || '#1B344C';

            var _svg = ce('svg');
            _svg.attr('width', dim);
            _svg.attr('height', (dim * 21) / 25);

            _svg.attr('viewBox', '0 0 25 21');

            var _path = ce('path');
            _path.attr('d', 'm22.7814,3.65982l-6.85592,0l0,-1.76754c0,-0.91591 -0.74451,-1.66042 -1.66042,-1.66042l-3.53508,0c-0.91591,0 -1.66042,0.74451 -1.66042,1.66042l0,1.76754l-6.85592,0c-0.94537,0 -1.71398,0.76861 -1.71398,1.71398l0,13.71184c0,0.94537 0.76861,1.71398 1.71398,1.71398l20.56776,0c0.94537,0 1.71398,-0.76861 1.71398,-1.71398l0,-13.71184c0,-0.94537 -0.76861,-1.71398 -1.71398,-1.71398zm-11.99786,-1.28549c0,-0.23567 0.19282,-0.4285 0.4285,-0.4285l2.57097,0c0.23567,0 0.4285,0.19282 0.4285,0.4285l0,1.28549l-3.42796,0l0,-1.28549zm11.99786,9.85539l-8.5699,0l0,1.71398l-3.42796,0l0,-1.71398l-8.5699,0l0,-6.85592l1.71398,0l0,5.14194l17.1398,0l0,-5.14194l1.71398,0l0,6.85592z');
            _path.style.strokeWidth = 0;
            _path.style.fill = bgColor;
            _svg.appendChild(_path);

            return Sinco.extend(_svg);
        },
        Empresa: function (dim, bgColor) {
            dim = dim || 64;
            bgColor = bgColor || '#1B344C';

            var _svg = ce('svg');
            _svg.attr('width', dim);
            _svg.attr('height', (dim * 57) / 64);

            _svg.attr('viewBox', '0 0 64 57');

            var _rect = ce('rect');
            _rect.attr('x', 7.958);
            _rect.attr('y', 0);
            _rect.attr('width', 19.963);
            _rect.attr('height', 48);
            _rect.style.stroke = null;
            _rect.style.strokeWidth = 0;
            _rect.style.fill = bgColor;
            _svg.appendChild(_rect);

            _rect = ce('rect');
            _rect.attr('x', 36.079);
            _rect.attr('y', 15.369);
            _rect.attr('width', 19.963);
            _rect.attr('height', 32.626);
            _rect.style.stroke = null;
            _rect.style.strokeWidth = 0;
            _rect.style.fill = bgColor;
            _svg.appendChild(_rect);

            _rect = ce('rect');
            _rect.attr('y', 53);
            _rect.attr('x', 0);
            _rect.attr('width', 64);
            _rect.attr('height', 4);
            _rect.style.stroke = null;
            _rect.style.strokeWidth = 0;
            _rect.style.fill = bgColor;
            _svg.appendChild(_rect);

            return Sinco.extend(_svg);
        },
        Sucursal: function (dim, bgColor) {
            dim = dim || 53;
            bgColor = bgColor || '#1B344C';

            var _svg = ce('svg');
            _svg.attr('width', dim);
            _svg.attr('height', (dim * 50) / 53);

            _svg.attr('viewBox', '0 0 53 50');

            var _rect = ce('rect');
            _rect.attr('x', 18.49996);
            _rect.attr('y', 2.37497);
            _rect.attr('height', 10);
            _rect.attr('width', 16);
            _rect.style.stroke = bgColor;
            _rect.style.strokeWidth = 4;
            _rect.style.strokeLinecap = 'round';
            _rect.style.strokeMiterlimit = 10;
            _rect.style.fill = bgColor;
            _svg.appendChild(_rect);

            _rect = ce('rect');
            _rect.attr('x', 20.49996);
            _rect.attr('y', 37.37497);
            _rect.attr('height', 10);
            _rect.attr('width', 12);
            _rect.style.stroke = bgColor;
            _rect.style.strokeWidth = 4;
            _rect.style.strokeLinecap = 'round';
            _rect.style.strokeMiterlimit = 10;
            _rect.style.fill = bgColor;
            _svg.appendChild(_rect);

            _rect = ce('rect');
            _rect.attr('x', 2.49996);
            _rect.attr('y', 37.37497);
            _rect.attr('height', 10);
            _rect.attr('width', 12);
            _rect.style.stroke = bgColor;
            _rect.style.strokeWidth = 4;
            _rect.style.strokeLinecap = 'round';
            _rect.style.strokeMiterlimit = 10;
            _rect.style.fill = bgColor;
            _svg.appendChild(_rect);

            _rect = ce('rect');
            _rect.attr('x', 38.49996);
            _rect.attr('y', 37.37497);
            _rect.attr('height', 10);
            _rect.attr('width', 12);
            _rect.style.stroke = bgColor;
            _rect.style.strokeWidth = 4;
            _rect.style.strokeLinecap = 'round';
            _rect.style.strokeMiterlimit = 10;
            _rect.style.fill = bgColor;
            _svg.appendChild(_rect);

            var _line = ce('line');
            _line.attr('y2', 12.37497);
            _line.attr('x2', 26.49996);
            _line.attr('y1', 37.37497);
            _line.attr('x1', 26.49996);
            _line.style.strokeWidth = 4;
            _line.style.stroke = bgColor;
            _line.style.strokeLinecap = 'round';
            _line.style.strokeMiterlimit = 10;
            _line.style.fill = 'none';
            _svg.appendChild(_line);

            var _polyline = ce('polyline');
            _polyline.attr('points', '44.49994283169508,37.37495803833008 44.49994283169508,24.374958038330078 8.499957136809826,24.374958038330078 8.499957136809826,37.37495803833008');
            _polyline.style.strokeWidth = 4;
            _polyline.style.stroke = bgColor;
            _polyline.style.strokeLinecap = 'round';
            _polyline.style.strokeMiterlimit = 10;
            _polyline.style.fill = 'none';
            _svg.appendChild(_polyline);

            return Sinco.extend(_svg);
        },
        LogoSinco: function (dim, bgColor) {
            bgColor = bgColor || { top: '#3871A7', left: '#014172', right: '#21629D', bottom: '#4F90C2' };

            var _svg = ce('svg');
            _svg.attr('width', (dim / 97) * 155);
            _svg.attr('height', dim);

            _svg.attr('viewBox', '0 0 155 97');

            var _path = ce('path');
            _path.attr('d', 'm13.56963,13.7495c-6.79091,7.34631 -12.40474,13.81108 -12.40474,14.20287c0,0.39181 22.09314,0.68567 49.16629,0.68567l49.07573,0l13.12911,-14.20287l13.12911,-14.20287l-49.8001,0l-49.8001,0l-12.4953,13.51722l0,-0.00003z');
            _path.style.strokeWidth = 0;
            _path.style.fill = bgColor.top;
            _svg.appendChild(_path);

            _path = ce('path');
            _path.attr('d', 'm114.78879,17.24615l-12.58585,13.61516l7.1531,17.23935l7.06257,17.14141l18.92405,0c10.32221,0 18.8335,-0.09796 18.8335,-0.29385c0,-0.48975 -26.1677,-60.72954 -26.52989,-61.02339c-0.18108,-0.19589 -5.88546,5.7791 -12.85748,13.32133z');
            _path.style.strokeWidth = 0;
            _path.style.fill = bgColor.right;
            _svg.appendChild(_path);

            _path = ce('path');
            _path.attr('d', 'm1.63389,32.42883c0,0.48975 22.6364,60.43568 23.27022,61.6111c0.27163,0.39181 6.3382,-5.48525 13.4913,-13.22337l12.85748,-13.90901l-8.05857,-17.5332l-8.05857,-17.43527l-16.75094,0c-9.23566,0 -16.75094,0.19589 -16.75094,0.48975l0.00003,0z');
            _path.style.strokeWidth = 0;
            _path.style.fill = bgColor.left;
            _svg.appendChild(_path);

            _path = ce('path');
            _path.attr('d', 'm41.7482,81.73613c-6.79091,7.34631 -12.40474,13.81105 -12.40474,14.20287c0,0.39181 22.09314,0.68564 49.16629,0.68564l49.07573,0l13.12911,-14.20287l13.12911,-14.20287l-49.8001,0l-49.8001,0l-12.4953,13.51722z');
            _path.style.strokeWidth = 0;
            _path.style.fill = bgColor.bottom;
            _svg.appendChild(_path);

            return Sinco.extend(_svg);
        }
    };

    var get = function (id) {
        if (id.lastIndexOf('.') > -1) {
            var classes = id.split(' ').join('').split('.').clean('');
            var elems = document.body.getElementsByTagName('*');

            return Sinco.filter(elems, function (elem) {
                return elem.classList && classes.filter(function (cl) {
                    return elem.classList.contains(cl);
                }).length == classes.length;
            })
                        .map(function (elem) {
                            return Sinco.extend(elem);
                        });
        }
        else
            return Sinco.extend(document.getElementById(id));
    };

    var extend = function (el, opt) {
        if (!el) return null;
        opt = opt || this;
        for (var n in opt)
            el[n] = opt[n];
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
        return ele;
    }

    var attribute = function (nombre, valor) {
        if (!valor)
            return this.getAttribute(nombre);
        else {
            this.setAttribute(nombre, valor);
            return this;
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
            this.insertBefore(e, this.childNodes[opc] || this.firstChild);
        }
        else {
            this.insertBefore(e, this.firstChild);
        }
        return this;
    }

    var _delete = function (ele) {
        var _this = ele || this;
        var _r = Sinco.extend(_this.cloneNode());
        if (!_this.remove)
            _this.parentElement.removeChild(_this);
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
            _this.addEventListener(type, callback, false);
        }
        else if (_this.attachEvent) {
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

    var dragDrop = function (element, container, elementAttachEvent, initCallBack) {
        /// <summary>Da la opción de mover elementos dentro de un contenedor específico</summary>
        /// <param name="element" type="String or Object">Elemento a mover</param>
        /// <param name="container" type="String or Object">Elemento contenedor</param>
        /// <param name="elementAttachEvent" type="String or Object">[Opcional] Elemento al cual se le agrega el evento del mouse</param>
        /// <param name="initCallBack" type="Function">[Opcional] Función que se ejecuta al terminar la inicialización.</param>

        if (!(this instanceof Sinco.utilities.dragDrop))
            throw new SincoInitializationError('¡DragDrop requiere ser inicializado mediante new Sinco.utilities.dragDrop()!');

        var _element = null;
        var _container = null;
        var _move = null;

        this.setDivid = function (element) {
            /// <summary>Asigna el elemento a mover</summary>
            /// <param name="divid" type="Object">Objeto o Id del objeto a mover</param>

            _element = typeof (element) === 'string' ? Sinco.get(element) : Sinco.extend(element);
        };

        this.setContainer = function (container) {
            /// <summary>Asigna el contenedor del elemento a mover</summary>
            /// <param name="container" type="Object">Objeto o Id del objeto contenedor</param>

            _container = typeof (container) === 'string' ? Sinco.get(container) : Sinco.extend(container);
        };

        this.move = _move = function (xpos, ypos) {
            /// <summary>Asigna el valor Top y Left al elemento que se está moviendo</summary>
            /// <param name="xpos" type="Number">Nuevo valor para Left</param>
            /// <param name="ypos" type="Number">Nuevo valor para Top</param>

            _element.style.left = xpos + 'px';
            _element.style.top = ypos + 'px';

            document.body.classList.add('noSelect');
        };

        this.startMoving = function (evt) {
            /// <summary>Realiza el attach al movimiento del mouse</summary>
            /// <param name="evt" type="Object">Evento del movimiento del mouse</param>

            if (!_element)
                throw new SincoInitializationError('Falta referenciar el objeto "element". Objeto que realiza el movimiento.');
            if (!_container)
                throw new SincoInitializationError('Falta referenciar el objeto "container". Objeto que contiene el elemento a mover.');

            evt = evt || window.event;

            var posX = evt.clientX,
                posY = evt.clientY,
                divTop = _element.offsetTop,
                divLeft = _element.offsetLeft,
                eWi = parseInt(_element.offsetWidth),
                eHe = parseInt(_element.offsetHeight),
                cWi = parseInt(_container.offsetWidth),
                cHe = parseInt(_container.offsetHeight);

            _container.style.cursor = 'move';

            var diffX = posX - divLeft,
                diffY = posY - divTop;

            document.onmousemove = function (evt) {
                evt = evt || window.event;
                var posX = evt.clientX,
                    posY = evt.clientY,
                    aX = posX - diffX,
                    aY = posY - diffY;

                if (aX < 0) aX = 0;
                if (aY < 0) aY = 0;
                if (aX + eWi > cWi) aX = cWi - eWi;
                if (aY + eHe > cHe) aY = cHe - eHe;
                _move(aX, aY);
            }
        };

        this.stopMoving = function () {
            /// <summary>Realiza la detención del movimiento del mouse</summary>

            _container.style.cursor = 'default';
            document.body.classList.remove('noSelect');
            document.onmousemove = function () { }
        };

        if (element)
            this.setDivid(element);
        if (container)
            this.setContainer(container);

        if (initCallBack)
            initCallBack(element, container);

        var _style = Sinco.createElem('style');
        _style.innerHTML = ' \
            .noSelect { \
                -webkit-touch-callout: none; \
                -webkit-user-select: none; \
                -khtml-user-select: none; \
                -moz-user-select: none; \
                -ms-user-select: none; \
                user-select: none; \
            }';

        Sinco.extend(document.head).insert(_style);

        if (elementAttachEvent) {
            elementAttachEvent = typeof (elementAttachEvent) === 'string' ? Sinco.get(elementAttachEvent) : Sinco.extend(elementAttachEvent);
            var _dragDrop = this;
            elementAttachEvent.addEvent('mousedown', function (event) { _dragDrop.startMoving(event); });
            elementAttachEvent.addEvent('mouseup', function (event) { _dragDrop.stopMoving(); });
        }
    }

    var autocomplete = function (input, config) {
        /// <summary>Da la opción de convertir un input type text a control autocompletar</summary>
        /// <param name="input" type="String or Object">Elemento a convertir</param>
        /// <param name="config" type="Object">Configuraciones del selector</param>

        if (!(this instanceof Sinco.utilities.autocomplete))
            throw new SincoInitializationError('¡Autocomplete requiere ser inicializado mediante new Sinco.utilities.autocomplete()!');

        //Propiedades globales
        {
            var _input = null,
                _indexSelected = -1,
                _datos = [],
                _http,
                _encontrado;

            window['autocompletes'] = (window['autocompletes'] || 16777272) - 1;

            var _config = {
                value: 'value',
                text: 'text',
                data: {
                    props: {},
                    search: ''
                },
                extended: {
                    north: {
                        title: '',
                        subtitle: ''
                    },
                    details: [],
                    border: ''
                },
                dataSource: undefined,
                icon: '',
                placeholder: undefined,
                event: 'keyup',
                service: {
                    method: 'GET',
                    url: ''
                },
                onselected: function () { }
            };

            var selected = {
                value: '',
                text: '',
                props: {}
            };
        }

        //Funciones públicas
        {
            this.getSelected = function () {
                return selected;
            }

            this.setSelectedValue = function (value) {
                _exec.call(_input);
                if (value != null && typeof value != 'undefined') {
                    var item = _datos.filter(function (o) {
                        return o[_config.value] == value;
                    });
                    if (item.length > 0) {
                        item = item.shift();
                        _selectItem(item);
                        _input.value = item[_config.text];
                        _ocultarItems();
                    }
                }
            }

            this.setParam = function () {
                if (arguments.length == 0)
                    throw new SincoInitializationError('¡Se requieren parámetros en la función "setParam"! Envíe un (objeto) con los parámetros o envíe (nombre, valor).');
                if (typeof arguments[0] == 'string' && typeof arguments[1] == 'undefined')
                    throw new SincoInitializationError('¡Se requiere el valor del parámetro! Se acepta NULL');

                if (typeof arguments[0] == 'string') {
                    _parseParam(arguments[0], arguments[1]);
                }
                else {
                    for (var i in arguments[0]) {
                        _parseParam(i, arguments[0][i]);
                    }
                }
            }

            this.setDataSource = function (dataSource) {
                _config.dataSource = dataSource;
                _datos = dataSource;
            }
        }

        //Funciones privadas
        {
            var _parseParam = function (prop, value) {
                if (_config.service.method == 'GET') {
                    _config.service._url = _config.service.url.split('[' + prop + ']').join(value);
                }
                else {
                    _config._param = _config._param || {};
                    _config._param[prop] = value;
                }
            }

            var _autocompleteExtendProps = function (el, opt) {
                for (var n in opt) {
                    if (el[n] !== null && typeof el[n] == 'object' && !(el[n] instanceof Array))
                        _autocompleteExtendProps(el[n], opt[n]);
                    else
                        el[n] = opt[n];
                }
                return el;
            }

            var _navigate = function (e) {
                e = e || window.event;
                if (e.keyCode == 27 && _input._visible) {
                    e.preventDefault();
                    _indexSelected = -1;
                    _ocultarItems();
                    if (_input.value.split(' ').join('') == '') {
                        selected = {
                            value: '',
                            text: '',
                            props: {}
                        };
                    }
                    else {
                        _input.value = selected.text;
                    }
                }
                else if ((e.keyCode == 9 || e.keyCode == 13) && _input._visible && _indexSelected >= 0) {
                    _clickItem.call(Sinco.get('.autocomplete-results-item')[_indexSelected]);
                }
                else if (e.keyCode == 38 && _input._visible) {
                    _indexSelected--;
                    if (_indexSelected < 0)
                        _indexSelected = _datos.length - 1;
                    _indexSelected >= 0 && _ubicar(_indexSelected);
                }
                else if (e.keyCode == 40) {
                    if (!_input._visible) {
                        _exec.call(_input);
                    }
                    else {
                        _indexSelected++;
                        if (_indexSelected >= _datos.length)
                            _indexSelected = 0;
                        _indexSelected >= 0 && _ubicar(_indexSelected);
                    }
                }
            }

            var _quitarClase = function () {
                var innerContainer = Sinco.get('inner-container-' + _config.id);
                if (!!innerContainer) {
                    var itemsHtml = innerContainer.childNodes;
                    return Sinco.map(itemsHtml, function (o) {
                        o.classList.remove('hover');
                        return o;
                    });
                }
                return [];
            }

            var _ubicar = function (indice) {
                if (!!_encontrado) {
                    _selectItem(_datos[indice]);
                    var itemsHtml = _quitarClase();
                    if (!!itemsHtml)
                        itemsHtml[indice].classList.add('hover');

                    var _container = Sinco.get('autocomplete-results-' + _config.id);

                    if (indice >= 0) {
                        _container.scrollTop = itemsHtml[indice].offsetTop;
                    }
                }
            }

            var _exec = function () {
                var texto = this.value;

                var funciones = {
                    Ok: _mostrarOpciones
                }

                if (texto.split(' ').join('') === '')
                    texto = '_';

                if (!!_config.dataSource) {
                    _mostrarOpciones(
                        texto == '_' ? _config.dataSource :
                        _config.dataSource.filter(function (o) {
                            return o[_config.text].toLowerCase().indexOf(texto.toLowerCase()) >= 0 || o[_config.value].toString().indexOf(texto) >= 0;
                        })
                    );
                }
                else {
                    if (!!_http)
                        _http.abort();

                    if (_config.service.method == 'GET') {
                        _config.service._url = _config.service._url || _config.service.url;
                        _http = Request(_config.service.method, _config.service._url.split('[' + _config.data.search + ']').join(texto), funciones);
                    }
                    else {
                        _config._param = _config._param || {};
                        _config._param[_config.data.search] = texto;

                        _http = Request(_config.service.method, _config.service.url, funciones, _config._param);
                    }
                }
            }

            var _selectItem = function (item) {
                if (!!item) {
                    var datoSeleccionado = {
                        value: item[_config.value],
                        text: item[_config.text],
                        props: {}
                    };

                    for (var i in _config.data.props) {
                        datoSeleccionado.props[i] = item[_config.data.props[i]];
                    }

                    _autocompleteExtendProps(selected, datoSeleccionado);
                }
            }

            var _clickItem = function () {
                _input.value = this.dataInfo[_config.text];
                _ocultarItems();
                _selectItem(this.dataInfo);
                if (!!_config.onselected) {
                    _config.onselected(selected);
                }
            }

            var _ocultarItems = function () {
                _resultsContainer.styles('display', 'none');
                _input._visible = false;
            }

            var _mostrarOpciones = function (data) {
                if (!data) {
                    data = { length: 0 };
                }
                else if (!(data instanceof Array)) {
                    if (data.hasOwnProperty('d')) {
                        data = data.d;
                    }
                    else {
                        data = { length: 0 };
                    }
                }

                _resultsContainer.styles('display', '');
                _input._visible = true;
                _resultsContainer.innerHTML = '';
                var _innerContainer = Sinco.createElem('div', { 'id': 'inner-container-' + _config.id });
                _resultsContainer.insert(_innerContainer);

                var item;

                if (data.length == 0) {
                    item = Sinco.createElem('div', { 'class': 'autocomplete-results-item' });
                    item.innerHTML = 'No se encontraron resultados';
                    _innerContainer.insert(item);
                    selected = {
                        value: '',
                        text: '',
                        props: {}
                    };
                    _encontrado = false;
                }
                else {
                    _datos = data.sort(function (a, b) {
                        if (a[_config.text] < b[_config.text]) return -1;
                        if (a[_config.text] > b[_config.text]) return 1;
                        return 0;
                    });

                    _datos.forEach(function (o) {
                        item = Sinco.createElem('div', { 'class': 'autocomplete-results-item' }).addEvent('mouseover', function () {
                            _quitarClase();
                        }).addEvent('click', _clickItem);

                        if (_config.extended.north.title !== '') {
                            item.styles('border-left', '5px solid ' + o[_config.extended.border]);

                            item.classList.add('autocomplete-results-item-layout');

                            var north = Sinco.createElem('header');

                            var title = Sinco.createElem('div');
                            title.innerHTML = o[_config.extended.north.title];
                            north.insert(title);

                            var subtitle = Sinco.createElem('aside');
                            subtitle.innerHTML = o[_config.extended.north.subtitle];
                            north.insert(subtitle);

                            item.insert(north);

                            var section = Sinco.createElem('section');
                            var detail;

                            _config.extended.details.forEach(function (itemdetail) {
                                detail = Sinco.createElem('div');
                                detail.innerHTML = o[itemdetail];
                                section.insert(detail);
                            });

                            item.insert(section);
                        }
                        else {
                            item.innerHTML = o[_config.text];
                        }
                        item.dataInfo = o;
                        _innerContainer.insert(item);
                    });

                    _encontrado = true;

                    if (_config.event == 'keydown') {
                        _navigate.call(_input);
                    }
                    _ubicar(0);
                }

                _enmarcarResultados();
            }

            var _dimensionar = function (n) {
                return (_config.dimensions.height * n) / 37;
            }

            var _enmarcarResultados = function () {
                var _results = Sinco.get('autocomplete-results-' + _config.id);
                if (_results) {
                    var top = Sinco.get('autocomplete-container-' + _config.id).offsetTop + _results.offsetTop;
                    var max = window.innerHeight; //Máximo es 300px de los resultados

                    var maxHeight = max - top;
                    if (maxHeight >= 30 && maxHeight <= 300) {
                        _results.styles('max-height', maxHeight + 'px');
                    }
                    else {
                        _results.style.maxHeight = null;
                    }
                }
            }
        }

        //Inicializaciones/validaciones
        {
            if (config)
                _autocompleteExtendProps(_config, config);

            if (input)
                _input = typeof (input) === 'string' ? Sinco.get(input) : Sinco.extend(input);

            if (!_input || _input.type !== 'text')
                throw new SincoInitializationError('¡Autocomplete requiere un input type text para funcionar!');

            if (!_config.service.url && !_config.dataSource)
                throw new SincoInitializationError('¡Autocomplete requiere una url o un datasource para ejecutar la consulta de los datos!');
        }

        //Elementos HTML
        {
            var _parent = Sinco.extend(_input.parentNode);
            var _inputIndex = Array.prototype.slice.call(_parent.childNodes).indexOf(_input);

            _config.id = _input.id || new Date().getTime();

            //Creación elementos
            var _container = Sinco.createElem('section', { 'class': 'autocomplete-container', 'id': 'autocomplete-container-' + _config.id });
            _container.idResults = 'autocomplete-results-' + _config.id;
            _container.idInput = _config.id;
            {
                _container.insert(_input);
                _parent.insert(_container, _inputIndex);

                _input.styles('flex', '1 1 auto');
                if (_config.icon !== '')
                    _input.styles('padding-left', '47px');

                var style = _input.currentStyle || window.getComputedStyle(_input);

                _config.dimensions = {
                    width: _input.offsetWidth,
                    height: _input.offsetHeight,
                    left: parseInt(style.marginLeft.split('px').join('')),
                    top: parseInt(style.marginTop.split('px').join('')),
                    right: parseInt(style.marginRight.split('px').join('')),
                    bottom: parseInt(style.marginBottom.split('px').join(''))
                };

                if (!!_config.icon) {
                    var icon = Sinco.createElem('aside', { 'class': 'autocomplete-icon', 'id': 'autocomplete-icon-' + _config.id });
                    icon.insert(iconos[_config.icon](_dimensionar(14), '#5A5A5A'));
                    _container.insert(icon);
                }

                var _searchContainer = Sinco.createElem('div', { 'class': 'autocomplete-button-search', 'id': 'autocomplete-button-search-' + _config.id }).addEvent('click', function () {
                    _exec.call({ value: _input.value });
                    _input.focus();
                    _resultsContainer.styles('display', '');
                });
                _searchContainer.insert(iconos.Triangulo(_dimensionar(6), '#5A5A5A'));
                _container.insert(_searchContainer);

                var _resultsContainer = Sinco.createElem('div', { 'class': 'autocomplete-results', 'id': 'autocomplete-results-' + _config.id, 'style': 'display: none;' });
                _container.insert(_resultsContainer);
            }

            //Estilos de autocompletar
            var _style = Sinco.createElem('style', { 'type': 'text/css' });
            {
                var _stylesArray = [];

                _stylesArray.push('#autocomplete-container-' + _config.id + ' {');
                _stylesArray.push('    position: relative;');
                _stylesArray.push('    display: flex;');
                _stylesArray.push('}');

                _stylesArray.push('#autocomplete-container-' + _config.id + ' > input {');
                _stylesArray.push('    flex: 1 1 auto;');
                /*_stylesArray.push('    padding-left: ' + (_config.dimensions.width + _config.dimensions.left) + 'px;');*/
                _stylesArray.push('}');

                _stylesArray.push('#autocomplete-button-search-' + _config.id + ' {');
                _stylesArray.push('    position: absolute;');
                _stylesArray.push('    top: ' + _config.dimensions.top + 'px;');
                _stylesArray.push('    bottom: ' + _config.dimensions.bottom + 'px;');
                _stylesArray.push('    right: ' + _config.dimensions.left + 'px;');
                _stylesArray.push('    position: absolute;');
                _stylesArray.push('    display: flex;');
                _stylesArray.push('    align-items: center;');
                _stylesArray.push('    justify-content: center;');
                _stylesArray.push('    width: ' + _dimensionar(18) + 'px;');
                _stylesArray.push('    cursor: pointer;');
                _stylesArray.push('}');

                _stylesArray.push('#autocomplete-results-' + _config.id + ' {');
                _stylesArray.push('    position: absolute;');
                _stylesArray.push('    top: ' + (_config.dimensions.height + _config.dimensions.top - 5) + 'px;');
                _stylesArray.push('    border-width: 0 1px 1px 1px;');
                _stylesArray.push('    border-style: solid;');
                _stylesArray.push('    border-color: silver;');
                if (_config.icon !== '')
                    _stylesArray.push('    left: ' + (_config.dimensions.height + 1) + 'px;');
                else
                    _stylesArray.push('    left: 0;');
                _stylesArray.push('    right: ' + _config.dimensions.right + 'px;');
                _stylesArray.push('    border-radius: 0 0 5px 5px;');
                _stylesArray.push('    background-color: #FFF;');
                _stylesArray.push('    z-index: ' + window['autocompletes'] + ';');
                _stylesArray.push('    max-height: 300px;');
                _stylesArray.push('    overflow-x: hidden;');
                _stylesArray.push('    overflow-y: auto;');

                /*if (!!_config.icon) {
                    _stylesArray.push('    left: 1px;');
                    _stylesArray.push('    width: ' + (_config.dimensions.width + _config.dimensions.height + 10) + 'px;');
                }
                else{
                    _stylesArray.push('    left: -1px;');
                    _stylesArray.push('    width: ' + (_config.dimensions.width + _config.dimensions.height + 7) + 'px;');
                }*/

                _stylesArray.push('}');

                _stylesArray.push('    #autocomplete-results-' + _config.id + ' > div > div {');
                _stylesArray.push('        padding: 2px 5px;');
                _stylesArray.push('        cursor: pointer;');
                _stylesArray.push('    }');

                if (_config.extended.north.title !== '') {
                    _stylesArray.push('    .autocomplete-results-item.autocomplete-results-item-layout {');
                    _stylesArray.push('        display: flex;');
                    _stylesArray.push('        flex-flow: column nowrap;');
                    _stylesArray.push('        border-top: 1px silver solid;');
                    _stylesArray.push('    }');

                    _stylesArray.push('    .autocomplete-results-item.autocomplete-results-item-layout > header {');
                    _stylesArray.push('        display: flex;');
                    _stylesArray.push('        flex-flow: row nowrap;');
                    _stylesArray.push('        justify-content: space-between;');
                    _stylesArray.push('        font-weight: bold;');
                    _stylesArray.push('        font-size: 14px;');
                    _stylesArray.push('    }');

                    _stylesArray.push('    .autocomplete-results-item.autocomplete-results-item-layout > header > aside {');
                    _stylesArray.push('        margin-right: 10px;');
                    _stylesArray.push('    }');

                    _stylesArray.push('    .autocomplete-results-item.autocomplete-results-item-layout > section {');
                    _stylesArray.push('        font-size: 13px;');
                    _stylesArray.push('        padding: 3px 0 2px 5px;');
                    _stylesArray.push('    }');
                }

                _stylesArray.push('        #autocomplete-results-' + _config.id + ' > div > div:hover,');
                _stylesArray.push('        #autocomplete-results-' + _config.id + ' > div > div.hover {');
                _stylesArray.push('            background-color: #1B344C;');
                _stylesArray.push('            color: #FFF;');
                _stylesArray.push('        }');

                if (!!_config.icon) {
                    _stylesArray.push('#autocomplete-icon-' + _config.id + ' {');
                    _stylesArray.push('    position: absolute;');
                    _stylesArray.push('    top: ' + (_config.dimensions.top + 1) + 'px;');
                    _stylesArray.push('    bottom: ' + (_config.dimensions.bottom + 1) + 'px;');
                    _stylesArray.push('    left: ' + (_config.dimensions.left + 1) + 'px;');
                    _stylesArray.push('    width: ' + _config.dimensions.height + 'px;');
                    _stylesArray.push('    border-right: 1px solid silver;');
                    _stylesArray.push('    display: flex;');
                    _stylesArray.push('    justify-content: center;');
                    _stylesArray.push('    align-items: center !important;');
                    _stylesArray.push('    background-color: #E6E6E6;');
                    _stylesArray.push('    cursor: pointer;');
                    _stylesArray.push('    border-radius: 5px 0 0 5px;');
                    _stylesArray.push('}');
                    _stylesArray.push('    .autocomplete-icon:hover {');
                    _stylesArray.push('        background-color: #DAD6D6 !important;');
                    _stylesArray.push('    }');
                }

                _style.innerHTML = _stylesArray.join('\n');

                Sinco.extend(document.head).insert(_style);
            }
        }

        //Eventos
        {
            _input.addEvent(_config.event, function (e) {
                e = e || window.event;
                if (e.keyCode != 13 && e.keyCode != 27 && e.keyCode != 38 && e.keyCode != 40)
                    _exec.call(this);
            });

            Array.prototype.map.call(document.querySelectorAll('input, select, button, a'), function (_) {
                Sinco.extend(_).addEvent('focus', function () {
                    Sinco.map(Sinco.get('.autocomplete-container'), function (elem) {
                        if (elem.id.indexOf(_config.id) < 0) {
                            Sinco.get(elem.idResults).styles('display', 'none');
                            Sinco.get(elem.idInput)._visible = false;
                        }
                    });
                });
            });

            if (_config.event != 'keydown') {
                _input.addEvent('keydown', function (e) {
                    _navigate(e, e.key == 'ArrowDown');
                });
            }

            Sinco.extend(window).addEvent('resize', function () {
                _enmarcarResultados();
            });
        }

        _input.placeholder = _config.placeholder || 'Seleccione una opción';
        _input._visible = false;
        _input.getSelected = this.getSelected;

        validacionesOnClick([{
            target: 'autocomplete-container-' + _config.id,
            iguales: false,
            excepciones: ['autocomplete-results-' + _config.id],
            funcion: function () {
                _input._visible = false;
                _resultsContainer.styles('display', 'none');
                _quitarClase();
                _indexSelected = -1;
                if (_input.value.split(' ').join('') == '')
                    selected = {
                        value: '',
                        text: '',
                        props: {}
                    };
            }
        }]);
    }

    autocomplete.prototype.toString = function () {
        return JSON.stringify(this.getSelected());
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
        return (callback ? mapAsync(eachParallel) : mapSync)(obj, iterator, callback);
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

    var Request = function (method, url, functions, data, contentType) {
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
        http.setRequestHeader('Accept', 'application/json, text/javascript');

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
                            case 'DEFAULT':
                                functions.Ok(JSON.tryParse(http.responseText));
                                break;
                            case 'XML':
                                functions.Ok(parseXml(http.responseText));
                                break;
                        }
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
                    params.push(String.format('{0}={1}', attr, encodeURIComponent(data[attr])));
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
        var _s = document.getElementsByTagName('script');
        _s = _s[_s.length - 1].src.split('/').pop();
        return {
            name: _s.split('.').shift(),
            url: _s
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
            Object.keys(modules)
                .map(function (name) {
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

            document.head.appendChild(script);
            script.src = src + (window['version-js'] ? '?v=' + window['version-js'] : '');
        };

        /**
         * @private
         * @name funcion
         *
         * @description Función que realiza la carga de módulos de la página.
         */
        var funcion = function () {
            var scripsArray = [];
            var scripts = document.getElementsByTagName('script');

            for (var i = 0; i < scripts.length; i++) {
                if (scripts[i].src.match(Sinco.script.name) && scripts[i].hasAttribute('data-main'))
                    scripsArray.push(scripts[i]);
            }
            scripsArray.forEach(function (script) {
                var main = script.getAttribute('data-main');

                var path = main.split('/'),
                    basename = path.pop(),
                    root = path.join('/');

                require.loadScript(main);

                require.onModule = function (module) {
                    module.dependencies.forEach(function (dependency) {
                        if (pending.indexOf(dependency) == -1) {
                            require.loadScript(root + '/' + dependency + '.js', function () {
                                pending.splice(pending.indexOf(dependency), 1);
                            });

                            pending.push(dependency);
                        }
                    });
                };
            });
        };

        extend(document, { addEvent: addEvent }).addEvent('DOMContentLoaded', funcion);

        require.modules = modules;
        exports.require = require;
        exports.define = define;
    }

    return {
        extend: extend,
        get: get,
        createElem: createElem,
        attribute: attribute,
        insert: insert,
        delete: _delete,
        styles: styles,
        addEvent: addEvent,
        removeEvent: removeEvent,
        utilities:
        {
            encrypt: encrypt,
            dragDrop: dragDrop,
            autocomplete: autocomplete,
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
        iconos: iconos
    };
})(window);