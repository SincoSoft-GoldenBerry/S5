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
        CaraFeliz: function (dim, bgColor) {
            dim = dim || 32;
            bgColor = bgColor || '#1B344C';

            var _svg = ce('svg');
            _svg.attr('width', dim);
            _svg.attr('height', dim);

            _svg.attr('viewBox', '0 0 32 32');

            var _g = ce('g');
            _g.attr('fill', 'none');
            _g.attr('fill-rule', 'evenodd');
            _g.attr('stroke', 'none');
            _g.attr('stroke-width', 2);

            var _gS = ce('g');
            _gS.attr('fill', bgColor);

            _g.appendChild(_gS);

            var _path = ce('path');
            _path.attr('d', 'M16.5,29 C23.4035597,29 29,23.4035597 29,16.5 C29,9.59644029 23.4035597,4 16.5,4 C9.59644029,4 4,9.59644029 4,16.5 C4,23.4035597 9.59644029,29 16.5,29 L16.5,29 Z M16.5,28 C22.8512749,28 28,22.8512749 28,16.5 C28,10.1487251 22.8512749,5 16.5,5 C10.1487251,5 5,10.1487251 5,16.5 C5,22.8512749 10.1487251,28 16.5,28 L16.5,28 Z M12,14 C12.5522848,14 13,13.5522848 13,13 C13,12.4477152 12.5522848,12 12,12 C11.4477152,12 11,12.4477152 11,13 C11,13.5522848 11.4477152,14 12,14 L12,14 Z M21,14 C21.5522848,14 22,13.5522848 22,13 C22,12.4477152 21.5522848,12 21,12 C20.4477152,12 20,12.4477152 20,13 C20,13.5522848 20.4477152,14 21,14 L21,14 Z M16.4813232,22 C13,22 11,20 11,20 L11,21 C11,21 13,23 16.4813232,23 C19.9626465,23 22,21 22,21 L22,20 C22,20 19.9626465,22 16.4813232,22 L16.4813232,22 Z');
            _gS.appendChild(_path);

            _svg.appendChild(_g);

            return Sinco.extend(_svg);
        },
        HelpDesk: function (dim, bgColor) {
            bgColor = bgColor || '#1B344C';

            var _svg = ce('svg');
            _svg.attr('width', (dim / 400) * 500);
            _svg.attr('height', dim);

            _svg.attr('viewBox', '0 0 500 400');

            var _path = ce('path');
            _path.attr('d', 'm401.90349,118.30178c-4.24518,0 -8.37449,0.38003 -12.47237,0.92799c-3.58037,-65.89903 -58.13338,-118.22977 -124.9162,-118.22977c-54.51078,0 -96.04444,39.69045 -113.19407,88.35539c-9.15322,-2.40099 -23.57387,-8.53161 -33.47537,-8.53161c-62.31571,-0.00098 -112.84547,50.51797 -112.84547,112.85627c0,62.31571 50.52975,112.81404 112.84547,112.81404c19.07632,0 51.07771,0 87.03951,0c1.28446,3.68643 3.60197,6.88971 6.6776,9.20624c-8.53161,9.1434 -13.14602,20.54048 -13.14602,33.18077c0,13.2727 4.96204,25.25899 14.40004,34.69796c9.41737,9.41737 21.45767,14.40986 34.84526,14.40986c13.34635,0 25.40629,-4.97186 34.89731,-14.34701c9.51263,-9.41737 14.53654,-21.44588 14.53654,-34.76081c0,-13.1038 -4.97284,-24.87993 -14.26256,-34.21285c2.455,-2.19084 4.30803,-4.99347 5.40394,-8.17416c50.85578,0 96.57079,0 113.6674,0c51.94089,0 94.07553,-42.13464 94.07553,-94.10695c-0.00098,-51.95071 -42.13563,-94.08535 -94.07651,-94.08535zm-133.17481,251.3928c-5.82424,5.75157 -12.85142,8.65829 -21.06683,8.65829c-8.20657,0 -15.20037,-2.9077 -20.97256,-8.65829c-5.75157,-5.77219 -8.64749,-12.70314 -8.64749,-20.81446c0,-8.11033 2.85369,-15.00004 8.56303,-20.73c5.38332,-5.37252 11.87139,-8.11131 19.39252,-8.40591c0.4527,-0.0216 0.87398,-0.1473 1.33748,-0.1473c0.47332,0 0.90639,0.12668 1.35909,0.1473c7.72048,0.2946 14.39906,3.0334 19.9503,8.40591c5.86646,5.72997 8.81639,12.61869 8.81639,20.73c0,8.11131 -2.9077,15.04226 -8.73194,20.81446zm10.61738,-110.09587c-2.51785,3.68643 -4.62423,8.63767 -6.33095,14.81051c-1.70671,6.15124 -2.81343,14.72508 -3.25533,25.70187l-21.11986,0l-2.60132,0l-22.67927,0l-0.16792,-7.71164c0,-15.31526 2.78102,-29.19877 8.37449,-41.73301c5.61409,-12.49299 14.66321,-24.2053 27.23968,-35.16147c12.10216,-10.61738 19.41314,-17.948 21.92019,-21.93099c2.49722,-3.98103 3.76008,-8.65829 3.76008,-14.02982c0,-7.31098 -3.055,-13.48285 -9.16402,-18.55979c-6.09822,-5.07792 -14.3038,-7.64781 -24.57453,-7.64781c-10.4907,0 -19.11854,3.11687 -25.84917,9.2907c-6.74143,6.19347 -10.16467,14.17712 -10.26975,23.93132l-44.86264,0c-0.24255,-21.95161 7.30018,-40.15297 22.59384,-54.47837c15.29464,-14.34701 35.44625,-21.55194 60.45188,-21.55194c16.09497,0 29.79975,2.97055 41.09176,8.91164c11.29201,5.9411 20.35095,14.49333 27.14442,25.70187c6.78365,11.18694 10.1853,22.94245 10.1853,35.26556c0,6.7208 -1.08511,13.33653 -3.26515,19.84621c-2.17022,6.5303 -5.60329,13.18727 -10.25993,20.03475c-2.7388,4.00263 -9.3123,10.72245 -19.71855,20.20267c-9.91132,9.01672 -16.13621,15.37811 -18.64326,19.10774z');
            _path.style.strokeWidth = 0;
            _path.style.fill = bgColor;
            _svg.appendChild(_path);

            return Sinco.extend(_svg);
        },
        Herramientas: function (dim, bgColor) {
            dim = dim || 100;
            bgColor = bgColor || '#1B344C';

            var _svg = ce('svg');
            _svg.attr('width', dim);
            _svg.attr('height', dim);

            _svg.attr('viewBox', '0 0 100 100');

            var _path = ce('path');
            _path.attr('d', 'M65.1,47h2c0.1,0,0.2,0.2,0.3,0.2c3,1.2,6.1,1.8,9.2,1.8c5.9,0,11.5-2.3,15.8-6.6C99,35.8,101,25.8,97.6,17 c-0.3-0.7-0.9-1.3-1.7-1.4c-0.8-0.2-1.6,0.1-2.1,0.6L82.9,27.1c-2.3,2.3-6.4,2.4-8.8,0c-1.2-1.2-1.8-2.7-1.8-4.4 c0-1.7,0.7-3.2,1.8-4.4L85,7.4c0.6-0.6,0.8-1.4,0.6-2.1c-0.2-0.8-0.7-1.4-1.4-1.7c-8.7-3.4-18.8-1.4-25.4,5.3 c-6.2,6.2-8.1,14.9-5.3,23.5l-5,5c0,0,0,0.1,0,0.1L45.9,40L65.1,47z');
            _path.style.strokeWidth = 0;
            _path.style.fill = bgColor;
            _svg.appendChild(_path);

            _path = ce('path');
            _path.attr('d', 'M39.1,46.5L18.6,67.2L5.4,80.4c-0.2,0.2-0.5,0.5-0.8,1l-0.1,0.1l0,0c-1.3,1.8-3.3,5.4-2,9.6 c0,0.1,0.1,0.1,0.1,0.2c1.1,4.6,4.8,8,9.3,8c0.8,0,1.5-0.1,2.2-0.3c3.9-0.5,6.6-3.1,6.7-3.2l24.8-24.8c0.1-0.1,0-0.2,0.1-0.2l1-1 C46.8,69.7,39.6,47.6,39.1,46.5z');
            _path.style.strokeWidth = 0;
            _path.style.fill = bgColor;
            _svg.appendChild(_path);

            _path = ce('path');
            _path.attr('d', 'M95.5,81.5c-0.7-1-1.4-1.7-1.5-1.8L63.8,49.5l0,0c-0.3-0.2-0.6-0.4-0.9-0.6L45.3,43L27.7,25.4l1.2-10.8l-9-5.3 l-8.7-5.5c-0.9-0.5-1.7-0.4-2.5,0.3l-5.9,6c-0.7,0.7-0.8,1.9-0.2,2.9l9.1,14.4l0.2,0.2c0.6,0.3,1.1,0.3,1.7,0.3l10.4,0.6 c1.7,1.6,14.2,13.8,17.6,17.2l5.6,16.4l0.6,1.9c0,0,0,0,0,0l0,0.1l0.1,0.1c0.1,0.2,0.2,0.5,0.4,0.6l30.2,30.2 c0.4,0.4,3.5,3.2,7.5,3.8c0.2,0,0.4,0.1,0.6,0.1c0.3,0,0.5,0.1,0.7,0.1c0.1,0,0.1,0,0.2,0c0.2,0,0.5,0.1,0.7,0.1 c5.7,0,10.3-4.6,10.3-10.3C98.7,86,97.5,83.4,95.5,81.5z M90,92.3c-0.4,0.4-1.1,0.4-1.4,0L54.7,58c-0.4-0.4-0.4-1.1,0-1.5 c0.2-0.2,0.5-0.3,0.7-0.3c0.3,0,0.5,0.1,0.7,0.3L90,90.8C90.4,91.2,90.4,91.9,90,92.3z');
            _path.style.strokeWidth = 0;
            _path.style.fill = bgColor;
            _svg.appendChild(_path);

            return Sinco.extend(_svg);
        },
        CaraFelizRellena: function (dim, bgColor) {
            dim = dim || 105;
            bgColor = bgColor || '#1B344C';

            var _svg = ce('svg');
            _svg.attr('width', dim);
            _svg.attr('height', dim);

            _svg.attr('viewBox', '0 0 105 105');

            var _g = ce('g');
            _g.attr('fill', 'none');
            _g.attr('fill-rule', 'evenodd');
            _g.attr('stroke', 'none');
            _g.attr('stroke-width', 2);

            var _gS = ce('g');
            _gS.attr('fill', bgColor);

            _g.appendChild(_gS);

            var _path = ce('path');
            _path.attr('d', 'M52,94 C75.1959606,94 94,75.1959606 94,52 C94,28.8040394 75.1959606,10 52,10 C28.8040394,10 10,28.8040394 10,52 C10,75.1959606 28.8040394,94 52,94 Z M52,83 C67.4639738,83 79,72.0832618 79,58 C79,56.5 67.4639738,61.4228513 52,61.4228513 C36.5360262,61.4228513 25,56.5 25,58 C25,72.0832618 36.5360262,83 52,83 Z M40.5,49 C42.9852815,49 45,46.7614239 45,44 C45,41.2385761 42.9852815,39 40.5,39 C38.0147185,39 36,41.2385761 36,44 C36,46.7614239 38.0147185,49 40.5,49 Z M63.5,49 C65.9852815,49 68,46.7614239 68,44 C68,41.2385761 65.9852815,39 63.5,39 C61.0147185,39 59,41.2385761 59,44 C59,46.7614239 61.0147185,49 63.5,49 Z M63.5,49');
            _gS.appendChild(_path);

            _svg.appendChild(_g);

            return Sinco.extend(_svg);
        },
        Power: function (dim, bgColor) {
            dim = dim || 20;

            var _svg = ce('svg');
            _svg.attr('width', dim);
            _svg.attr('height', dim);

            _svg.attr('viewBox', '0 0 20 20');

            var _g = ce('g');

            var _path = ce('path');
            _path.attr('d', 'm13.86851,2.64686c-0.67385,-0.32642 -1.48545,-0.04614 -1.8139,0.62906c-0.32707,0.67519 -0.04478,1.48681 0.62907,1.81388c2.11384,1.02876 3.57283,3.19283 3.57147,5.70094c-0.00678,3.49749 -2.83655,6.32727 -6.33337,6.33336c-3.49751,-0.00678 -6.32727,-2.83653 -6.33407,-6.33336c-0.00135,-2.50946 1.45832,-4.67555 3.57419,-5.70227c0.67521,-0.3271 0.95548,-1.13872 0.62907,-1.8139c-0.32708,-0.67385 -1.13734,-0.95616 -1.81253,-0.62907c-3.02114,1.46238 -5.10444,4.56222 -5.1058,8.14524c0.00136,4.99721 4.05057,9.04709 9.04914,9.04844c4.99788,-0.00135 9.04778,-4.05123 9.04846,-9.04844c-0.00136,-3.58165 -2.08194,-6.67946 -5.10173,-8.14388zm-3.94673,6.67334c0.74918,0 1.35652,-0.60667 1.35652,-1.3572l0,-6.33405c0,-0.74985 -0.60734,-1.35652 -1.35652,-1.35652c-0.75053,0 -1.35721,0.60734 -1.35721,1.35652l0,6.33338c0,0.75053 0.60668,1.35787 1.35721,1.35787z');

            _path.style.strokeWidth = 0;
            _path.style.fill = bgColor || '#1B344C';

            _g.appendChild(_path);

            _svg.appendChild(_g);

            return Sinco.extend(_svg);
        },
        Lista: function (dim, bgColor) {
            dim = dim || 22;
            bgColor = bgColor || '#1B344C';

            var _svg = ce('svg');
            _svg.attr('width', dim);
            _svg.attr('height', dim);

            _svg.attr('viewBox', '0 0 22 22');

            var _g = ce('g');

            var _path = ce('path');
            _path.attr('d', 'm21.70011,11.93391l-1.38935,-1.38499c-0.17957,-0.1821 -0.47243,-0.18392 -0.65197,0l-2.92867,2.92688l-3.35051,3.35749l-2.59481,-2.59743c-0.18216,-0.18304 -0.47502,-0.18304 -0.65545,0l-1.38675,1.38588c-0.18216,0.18303 -0.18216,0.47589 0,0.65718l2.92252,2.92516l0.5012,0.49857l0.88383,0.8873c0.18302,0.18302 0.4794,0.18302 0.65719,0l1.38413,-1.38589l6.60688,-6.61298c0.18479,-0.1804 0.18479,-0.47327 0.00177,-0.65716zm-14.84459,1.80161l1.38587,-1.38934c1.18454,-1.18192 3.24506,-1.18367 4.4287,0.00172l0.706,0.70601l3.17273,-3.02276l0,-8.9254l-16.06572,0l0,19.63587l8.9254,0l-2.55298,-2.56954c-1.22113,-1.22548 -1.22113,-3.21453 0,-4.43657zm-1.01718,-10.84468l8.92539,0l0,1.78508l-8.92539,0l0,-1.78508zm0,3.57016l8.92539,0l0,1.78508l-8.92539,0l0,-1.78508zm-1.78508,5.35524l-1.78508,0l0,-1.78508l1.78508,0l0,1.78508zm0,-3.57015l-1.78508,0l0,-1.78508l1.78508,0l0,1.78508zm0,-3.57016l-1.78508,0l0,-1.78508l1.78508,0l0,1.78508zm1.78508,5.35524l1.78508,0l0,1.78508l-1.78508,0l0,-1.78508z');
            _path.style.strokeWidth = 0;
            _path.style.fill = bgColor;
            _g.appendChild(_path);

            _svg.appendChild(_g);

            return Sinco.extend(_svg);
        },
        Sobre: function (dim, bgColor) {
            dim = dim || 30;
            bgColor = bgColor || '#1B344C';

            var _svg = ce('svg');
            _svg.attr('width', dim);
            _svg.attr('height', (dim * 22) / 30);

            _svg.attr('viewBox', '0 0 30 22');

            var _path = ce('path');
            _path.attr('d', 'm29.17418,19.57375l-8.20766,-8.89987l8.21511,-8.22906c0.1699,-0.17018 0.46054,-0.04986 0.46054,0.1905l0,16.75566c0,0.2455 -0.30147,0.36339 -0.46799,0.18277zm-12.53579,-4.56416c-0.4711,0.47192 -1.11062,0.73721 -1.77751,0.73721l-0.02127,0c-0.67854,0 -1.32944,-0.26922 -1.80975,-0.74873l-2.43301,-2.42881l-8.34843,8.49855c-0.1676,0.17058 -0.04674,0.45877 0.1924,0.45877l25.35027,0c0.23508,0 0.35756,-0.27979 0.19823,-0.45254l-8.35764,-9.06274l-2.99327,2.99829zm-1.79865,-1.15086l0.00054,0c0.1802,0 0.34957,-0.07032 0.47693,-0.19782l12.42671,-12.44798c0.16964,-0.17004 0.04932,-0.46026 -0.19091,-0.46026l-25.46828,0c-0.24036,0 -0.36068,0.29076 -0.1905,0.46053l12.46939,12.44853c0.12709,0.12722 0.29618,0.197 0.47612,0.197zm-14.34866,-10.72806l0,16.37222c0,0.24144 0.29293,0.36122 0.46216,0.189l8.30751,-8.45682l-8.30927,-8.29531c-0.17004,-0.16964 -0.4604,-0.04918 -0.4604,0.19091z');
            _path.style.strokeWidth = 0;
            _path.style.fill = bgColor;
            _svg.appendChild(_path);

            return Sinco.extend(_svg);
        },
        Info: function (dim, bgColor) {
            dim = dim || 110;
            bgColor = bgColor || '#1B344C';

            var _svg = ce('svg');
            _svg.attr('width', dim);
            _svg.attr('height', dim);

            _svg.attr('viewBox', '0 0 110 110');

            var _path = ce('path');
            _path.attr('d', 'm1.25009,54.90011c0,-29.6 24.1,-53.6 53.6,-53.6c29.6,0 53.6,24 53.6,53.6c0,29.6 -23.9,53.6 -53.6,53.6c-29.5,0 -53.6,-24 -53.6,-53.6l0,0l0,0zm37.8,-9.3l0,7.8l6.7,0l0,29.6l-6.7,0l0,7.8l31.5,0l0,-7.8l-6.6,0l0,-29.6l6.6,0l0,-7.8l-31.5,0l0,0l0,0zm4.6,-15.2c0,6.2 5.1,11.3 11.3,11.3c6.2,0 11.3,-5 11.3,-11.3c0,-6.2 -5.1,-11.3 -11.3,-11.3c-6.3,0 -11.3,5.1 -11.3,11.3l0,0l0,0z');
            _path.style.strokeWidth = 0;
            _path.style.fill = bgColor;
            _svg.appendChild(_path);

            _svg = Sinco.extend(_svg);
            return _svg;
        },
        Lab: function (dim, bgColor) {
            dim = dim || 400;
            bgColor = bgColor || '#1B344C';

            var _svg = ce('svg');
            _svg.attr('width', dim);
            _svg.attr('height', dim);

            _svg.attr('viewBox', '0 0 400 400');

            var _path = ce('path');
            _path.attr('d', 'm389.902,376.10179l-117.9,-199.2l0,-149.9c0,-7.7 -6.5,-14 -14.5,-14c-8,0 -14.5,6.2 -14.5,14l0,153.6c0,1.8 0.6,3.6 1.3,5.3c-7.6,-11.1 -20.6,-18.4 -35.4,-18.4c-23.5,0 -42.5,18.3 -42.5,41c0,16.8 10.5,31.5 25.4,37.5l-72,0l35,-58.5c1.2,-2.1 2.1,-4.5 2.1,-6.9l0,-30.4c4,3.2 10,5.1 16.1,5.1c15.3,0 27.5,-11.9 27.5,-26.6c0,-14.7 -12.2,-26.6 -27.5,-26.6c-6.1,0 -12.1,1.9 -16.1,5.1l0,-80.2c0,-7.7 -6.5,-14 -14.5,-14c-8,0 -14.5,6.2 -14.5,14l0,149.9l-117.8,199.2c-2.5,4.3 -2.6,9.6 0,13.9c2.6,4.3 7.2,7 12.4,7l177.5,0l177.5,0c5.1,0 9.8,-2.6 12.4,-7c2.6,-4.2 2.5,-9.6 0,-13.9zm-163.7,-130.1c14.9,-6 25.4,-20.8 25.4,-37.5c0,-5.7 -1.2,-11.2 -3.4,-16.1l31,53.6l-53,0z');
            _path.style.strokeWidth = 0;
            _path.style.fill = bgColor;
            _svg.appendChild(_path);

            _path = ce('path');
            _path.attr('d', 'm209.102,77.60179c12,0 21.7,-9.4 21.7,-20.9c0,-11.6 -9.7,-20.9 -21.7,-20.9c-12,0 -21.7,9.4 -21.7,20.9c-0.1,11.5 9.7,20.9 21.7,20.9z');
            _path.style.strokeWidth = 0;
            _path.style.fill = bgColor;
            _svg.appendChild(_path);

            var _line = ce('line');
            _line.attr('y2', 21.50194);
            _line.attr('x2', 290.61155);
            _line.attr('y1', 21.50194);
            _line.attr('x1', 109.5021);
            _line.style.strokeWidth = 40;
            _line.style.stroke = bgColor;
            _line.style.strokeLinecap = 'round';
            _line.style.strokeMiterlimit = 10;
            _line.style.fill = 'none';
            _svg.appendChild(_line);

            _svg = Sinco.extend(_svg);
            return _svg;
        },
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
        ConfigApp: function (dim, bgColor) {

            dim = dim || 400;
            bgColor = bgColor || '#1B344C';

            var _svg = ce('svg');
            _svg.attr('width', (dim / 400) * 455);
            _svg.attr('height', dim);

            _svg.attr('viewBox', '0 0 455 400');

            var _path = ce('path');
            _path.attr('d', 'm30.1875,87.5625l0,281.87501l394.62502,0l0,-281.87501l-394.62502,0zm28.02007,-84.5625l338.58488,0c30.99357,0 56.20757,25.31379 56.20757,56.54018l0,281.54466c0,31.2543 -25.16496,56.54018 -56.20757,56.54018l-338.58488,0c-30.99357,0 -56.20757,-25.31379 -56.20757,-56.54018l0,-281.54466c0,-31.2543 25.16496,-56.54018 56.20757,-56.54018zm338.41745,28.1875l0,28.1875l28.1875,0l0,-28.1875l-28.1875,0zm-56.375,0l0,28.1875l28.1875,0l0,-28.1875l-28.1875,0zm-56.375,0l0,28.1875l28.1875,0l0,-28.1875l-28.1875,0zm0,0');
            _path.style.strokeWidth = 0;
            _path.style.fill = bgColor;
            _svg.appendChild(_path);

            _path = ce('path');
            _path.attr('d', 'm326.54674,245.47194l-8.37083,-8.99089c0.00917,-0.07888 0.00734,-0.15593 -0.00183,-0.27334c0.17978,-2.00511 0.29902,-4.02489 0.37791,-6.04651c0.01835,-0.58337 -0.0055,-1.2071 0.0055,-1.79047c0.01651,-1.55015 -0.0055,-3.04894 -0.07521,-4.54589c-0.02935,-0.65492 -0.06421,-1.26397 -0.1064,-1.91522c-0.03486,-0.9998 -0.08622,-1.98676 -0.16144,-3.03059l8.39467,-8.92851c4.00471,-4.26521 11.27484,-9.92832 9.04959,-15.31991l-9.19085,-22.30202c-2.22525,-5.3971 -11.3629,-4.26521 -17.20578,-4.46884l-12.2563,-0.44211c-0.92642,-1.10804 -1.92439,-2.16104 -2.88383,-3.23056c-0.03669,-0.04036 -0.08072,-0.10273 -0.12658,-0.1596c-0.34122,-0.35773 -0.62923,-0.74664 -0.97412,-1.09887c-0.51916,-0.56503 -1.11721,-1.10437 -1.65288,-1.65472c-0.77599,-0.7815 -1.54832,-1.57584 -2.34449,-2.33165c-1.30616,-1.25663 -2.68387,-2.44172 -4.0414,-3.61764c-0.05504,-0.05687 -0.14309,-0.10457 -0.19079,-0.14309c-0.07338,-0.07155 -0.13942,-0.15226 -0.2128,-0.22564l-0.39625,-12.27831c-0.17978,-5.81353 0.96311,-14.96769 -4.3973,-17.19844l-22.30936,-9.28441c-5.36775,-2.23442 -11.06938,5.03937 -15.32175,9.0074l-8.98355,8.38734c-2.01428,-0.2018 -4.01389,-0.30636 -6.01533,-0.38341c-0.55952,-0.02201 -1.12271,-0.01101 -1.72076,-0.00734c-1.28965,-0.01101 -2.59031,-0.04953 -3.91666,0.00183c-1.6749,0.0532 -3.3498,0.15777 -5.01919,0.30269c-0.21464,0.01101 -0.42927,0.01101 -0.59805,0.02568c-0.11924,0.02385 -0.20913,0.0055 -0.33021,0.02935l-8.93585,-8.41302c-4.25788,-3.9827 -9.92832,-11.27484 -15.31991,-9.05326l-22.30202,9.19085c-5.3971,2.22341 -4.25604,11.38308 -4.47068,17.20945l-0.43478,12.27464c-0.13392,0.1009 -0.26784,0.24032 -0.39258,0.36323c-1.46577,1.22178 -2.90401,2.48391 -4.3019,3.79742c-0.51549,0.50632 -1.01264,1.01631 -1.51713,1.52814c-0.99246,0.96678 -1.9886,1.96475 -2.9407,2.99024c-0.48798,0.53201 -0.93743,1.07135 -1.41257,1.61436c-0.64574,0.70078 -1.27681,1.39239 -1.89504,2.13169l-12.28565,0.37607c-5.81353,0.18162 -14.96769,-0.96128 -17.19844,4.40097l-9.28808,22.30753c-2.23259,5.36958 5.0302,11.05103 8.99823,15.3034l8.38917,8.98538c-0.13575,1.39055 -0.19629,2.77376 -0.27334,4.18083c0.00183,0.13025 -0.02201,0.26784 -0.01835,0.39809c-0.11374,2.38485 -0.17061,4.76603 -0.08806,7.13988c0.03852,1.042 0.11557,2.06565 0.18162,3.10581c0.06054,0.8402 0.07888,1.69508 0.15777,2.53345c-0.0055,0.09173 0.00183,0.17611 0.00917,0.23849l-8.40568,8.9597c-3.98454,4.25054 -11.28218,9.90447 -9.0606,15.29423l9.19085,22.30202c2.22525,5.40077 11.39041,4.27622 17.21679,4.48902l12.26731,0.41643c0.08255,0.12108 0.18162,0.19262 0.26967,0.31737c1.24379,1.49328 2.54996,2.95171 3.91116,4.41931c0.4788,0.51549 0.98513,0.95761 1.47127,1.46393c0.9998,1.01448 2.00694,2.01795 3.04894,2.99574c0.51183,0.44395 1.053,0.90808 1.57033,1.38688c0.72463,0.64024 1.42908,1.29332 2.15554,1.87669l0.37424,12.28382c0.18345,5.81353 -0.95394,14.9897 4.41014,17.22229l22.30753,9.28624c5.37142,2.23626 11.0492,-5.03204 15.30157,-9.00006l8.99272,-8.36899c0.09906,0.00183 0.19446,-0.01101 0.29352,-0.00917c1.15757,0.12842 2.30597,0.17244 3.45436,0.23115c0.34489,0.02935 0.67877,0.03119 1.00531,0.06604c0.53934,0.01651 1.05667,0.0587 1.57767,0.07705c0.61639,0.01284 1.23095,-0.0055 1.84734,-0.00367c1.49879,0.03486 2.99941,0.00367 4.48535,-0.06421c0.64758,-0.02201 1.30983,-0.07155 1.95007,-0.10824c1.01081,-0.04403 1.98493,-0.09356 2.97923,-0.15226l8.95053,8.38367c4.26338,4.00471 9.90447,11.28401 15.29423,9.05876l22.30386,-9.19085c5.39894,-2.22708 4.28356,-11.37207 4.48902,-17.21679l0.42194,-12.24713c1.05117,-0.87689 2.06381,-1.79047 3.0416,-2.68204c0.13759,-0.1596 0.29535,-0.27151 0.44578,-0.39809c0.34122,-0.32287 0.70628,-0.59438 0.9998,-0.90441c0.59438,-0.5265 1.1062,-1.10804 1.64738,-1.63271c0.77416,-0.78333 1.59602,-1.56666 2.38302,-2.38669c1.14289,-1.22728 2.29313,-2.51143 3.40483,-3.84878c0.12658,-0.11924 0.22564,-0.22014 0.33388,-0.37607c0.09356,-0.08255 0.15043,-0.13759 0.20363,-0.2018l12.27464,-0.39442c5.81353,-0.18162 14.9897,0.95577 17.22229,-4.4083l9.28624,-22.30753c2.24359,-5.36591 -5.0357,-11.06571 -9.00189,-15.31808zm-53.25555,-17.93775c0,27.10108 -21.97181,49.07289 -49.07289,49.07289s-49.07289,-21.97181 -49.07289,-49.07289s21.97181,-49.07289 49.07289,-49.07289s49.07289,21.97181 49.07289,49.07289z');
            _path.style.strokeWidth = 0;
            _path.style.fill = bgColor;
            _svg.appendChild(_path);

            return Sinco.extend(_svg);
        },
        Config: function (dim, bgColor) {

            dim = dim || 128;
            bgColor = bgColor || '#1B344C';

            var _svg = ce('svg');
            _svg.attr('width', dim);
            _svg.attr('height', dim);

            _svg.attr('viewBox', '0 0 128 128');

            var _path = ce('path');
            _path.attr('d', 'M119.78,73.778l-4.563-4.901c0.005-0.043,0.004-0.085-0.001-0.149c0.098-1.093,0.163-2.194,0.206-3.296  c0.01-0.318-0.003-0.658,0.003-0.976c0.009-0.845-0.003-1.662-0.041-2.478c-0.016-0.357-0.035-0.689-0.058-1.044  c-0.019-0.545-0.047-1.083-0.088-1.652l4.576-4.867c2.183-2.325,6.146-5.412,4.933-8.351l-5.01-12.157  c-1.213-2.942-6.194-2.325-9.379-2.436l-6.681-0.241c-0.505-0.604-1.049-1.178-1.572-1.761c-0.02-0.022-0.044-0.056-0.069-0.087  c-0.186-0.195-0.343-0.407-0.531-0.599c-0.283-0.308-0.609-0.602-0.901-0.902c-0.423-0.426-0.844-0.859-1.278-1.271  c-0.712-0.685-1.463-1.331-2.203-1.972c-0.03-0.031-0.078-0.057-0.104-0.078c-0.04-0.039-0.076-0.083-0.116-0.123l-0.216-6.693  c-0.098-3.169,0.525-8.159-2.397-9.375L82.129,3.308c-2.926-1.218-6.034,2.747-8.352,4.91L68.88,12.79  c-1.098-0.11-2.188-0.167-3.279-0.209c-0.305-0.012-0.612-0.006-0.938-0.004c-0.703-0.006-1.412-0.027-2.135,0.001  c-0.913,0.029-1.826,0.086-2.736,0.165c-0.117,0.006-0.234,0.006-0.326,0.014c-0.065,0.013-0.114,0.003-0.18,0.016l-4.871-4.586  c-2.321-2.171-5.412-6.146-8.351-4.935L33.907,8.262c-2.942,1.212-2.32,6.205-2.437,9.381l-0.237,6.691  c-0.073,0.055-0.146,0.131-0.214,0.198c-0.799,0.666-1.583,1.354-2.345,2.07c-0.281,0.276-0.552,0.554-0.827,0.833  c-0.541,0.527-1.084,1.071-1.603,1.63c-0.266,0.29-0.511,0.584-0.77,0.88c-0.352,0.382-0.696,0.759-1.033,1.162l-6.697,0.205  c-3.169,0.099-8.159-0.524-9.375,2.399l-5.063,12.16c-1.217,2.927,2.742,6.024,4.905,8.342l4.573,4.898  c-0.074,0.758-0.107,1.512-0.149,2.279c0.001,0.071-0.012,0.146-0.01,0.217c-0.062,1.3-0.093,2.598-0.048,3.892  c0.021,0.568,0.063,1.126,0.099,1.693c0.033,0.458,0.043,0.924,0.086,1.381c-0.003,0.05,0.001,0.096,0.005,0.13l-4.582,4.884  c-2.172,2.317-6.15,5.399-4.939,8.337l5.01,12.157c1.213,2.944,6.209,2.331,9.385,2.447l6.687,0.227  c0.045,0.066,0.099,0.105,0.147,0.173c0.678,0.814,1.39,1.609,2.132,2.409c0.261,0.281,0.537,0.522,0.802,0.798  c0.545,0.553,1.094,1.1,1.662,1.633c0.279,0.242,0.574,0.495,0.856,0.756c0.395,0.349,0.779,0.705,1.175,1.023l0.204,6.696  c0.1,3.169-0.52,8.171,2.404,9.388l12.16,5.062c2.928,1.219,6.023-2.743,8.341-4.906l4.902-4.562  c0.054,0.001,0.106-0.006,0.16-0.005c0.631,0.07,1.257,0.094,1.883,0.126c0.188,0.016,0.37,0.017,0.548,0.036  c0.294,0.009,0.576,0.032,0.86,0.042c0.336,0.007,0.671-0.003,1.007-0.002c0.817,0.019,1.635,0.002,2.445-0.035  c0.353-0.012,0.714-0.039,1.063-0.059c0.551-0.024,1.082-0.051,1.624-0.083l4.879,4.57c2.324,2.183,5.399,6.151,8.337,4.938  l12.158-5.01c2.943-1.214,2.335-6.199,2.447-9.385l0.23-6.676c0.573-0.478,1.125-0.976,1.658-1.462  c0.075-0.087,0.161-0.148,0.243-0.217c0.186-0.176,0.385-0.324,0.545-0.493c0.324-0.287,0.603-0.604,0.898-0.89  c0.422-0.427,0.87-0.854,1.299-1.301c0.623-0.669,1.25-1.369,1.856-2.098c0.069-0.065,0.123-0.12,0.182-0.205  c0.051-0.045,0.082-0.075,0.111-0.11l6.691-0.215c3.169-0.099,8.171,0.521,9.388-2.403l5.062-12.16  C125.91,79.203,121.942,76.096,119.78,73.778z M90.75,64c0,14.773-11.977,26.75-26.75,26.75S37.25,78.773,37.25,64  S49.227,37.25,64,37.25S90.75,49.227,90.75,64z');
            _path.style.strokeWidth = 0;
            _path.style.fill = bgColor;
            _svg.appendChild(_path);

            return Sinco.extend(_svg);
        },
        Gestion: function (dim, bgColor) {

            dim = dim || 380;
            bgColor = bgColor || '#1B344C';

            var _svg = ce('svg');
            _svg.attr('width', (dim / 380) * 455);
            _svg.attr('height', dim);

            _svg.attr('viewBox', '0 0 455 400');

            var _path = ce('path');
            _path.attr('d', 'm438.54328,221.93631l-4.85317,-5.21267c0.00532,-0.04573 0.00425,-0.09041 -0.00106,-0.15848c0.10423,-1.16251 0.17337,-2.33352 0.2191,-3.5056c0.01064,-0.33822 -0.00319,-0.69984 0.00319,-1.03807c0.00957,-0.89874 -0.00319,-1.76769 -0.04361,-2.63558c-0.01702,-0.3797 -0.03723,-0.73282 -0.06169,-1.11039c-0.02021,-0.57966 -0.04999,-1.15187 -0.0936,-1.75706l4.867,-5.17651c2.32182,-2.47285 6.53684,-5.75616 5.2467,-8.88206l-5.3286,-12.9301c-1.29014,-3.12909 -6.58789,-2.47285 -9.97544,-2.59091l-7.10586,-0.25633c-0.53711,-0.64241 -1.11571,-1.25291 -1.67197,-1.87299c-0.02127,-0.0234 -0.0468,-0.05956 -0.07339,-0.09253c-0.19783,-0.2074 -0.36481,-0.43288 -0.56477,-0.63709c-0.301,-0.32759 -0.64773,-0.64028 -0.9583,-0.95936c-0.4499,-0.45309 -0.89767,-0.91363 -1.35927,-1.35183c-0.75728,-0.72856 -1.55604,-1.41564 -2.34309,-2.0974c-0.03191,-0.03297 -0.08296,-0.06062 -0.11061,-0.08296c-0.04254,-0.04148 -0.08083,-0.08828 -0.12338,-0.13082l-0.22974,-7.11863c-0.10423,-3.37053 0.55839,-8.67785 -2.54943,-9.97118l-12.93435,-5.38284c-3.11207,-1.29546 -6.41772,2.92169 -8.88313,5.22224l-5.20841,4.86275c-1.16782,-0.117 -2.32714,-0.17762 -3.48752,-0.22229c-0.3244,-0.01276 -0.65092,-0.00638 -0.99765,-0.00425c-0.74771,-0.00638 -1.50179,-0.02872 -2.27077,0.00106c-0.97106,0.03084 -1.94212,0.09147 -2.90999,0.17549c-0.12444,0.00638 -0.24888,0.00638 -0.34673,0.01489c-0.06913,0.01383 -0.12125,0.00319 -0.19145,0.01702l-5.18076,-4.87764c-2.4686,-2.30906 -5.75616,-6.53684 -8.88206,-5.24883l-12.9301,5.3286c-3.12909,1.28907 -2.46754,6.59959 -2.59198,9.97756l-0.25207,7.1165c-0.07764,0.0585 -0.15528,0.13933 -0.22761,0.21059c-0.84981,0.70835 -1.68367,1.4401 -2.49412,2.20164c-0.29887,0.29355 -0.5871,0.58923 -0.87959,0.88597c-0.5754,0.56051 -1.15293,1.13911 -1.70494,1.73366c-0.28292,0.30844 -0.5435,0.62114 -0.81897,0.93596c-0.37438,0.40629 -0.74026,0.80727 -1.09869,1.23589l-7.12288,0.21804c-3.37053,0.1053 -8.67785,-0.55732 -9.97118,2.55156l-5.38497,12.93329c-1.29439,3.11314 2.91637,6.40708 5.21692,8.87249l4.86381,5.20948c-0.07871,0.8062 -0.1138,1.60815 -0.15848,2.42393c0.00106,0.07552 -0.01276,0.15528 -0.01064,0.2308c-0.06594,1.38267 -0.09891,2.76321 -0.05105,4.1395c0.02234,0.60412 0.06701,1.19761 0.1053,1.80066c0.0351,0.48713 0.04573,0.98276 0.09147,1.46882c-0.00319,0.05318 0.00106,0.1021 0.00532,0.13827l-4.87338,5.19459c-2.31012,2.46434 -6.5411,5.74234 -5.25308,8.86717l5.3286,12.9301c1.29014,3.13122 6.60385,2.47923 9.98182,2.60261l7.11224,0.24144c0.04786,0.0702 0.1053,0.11168 0.15635,0.184c0.72112,0.86576 1.47839,1.71132 2.26758,2.56219c0.2776,0.29887 0.57115,0.5552 0.853,0.84875c0.57966,0.58817 1.16357,1.16995 1.76769,1.73685c0.29674,0.25739 0.6105,0.52648 0.91044,0.80408c0.42012,0.37119 0.82854,0.74983 1.24972,1.08806l0.21697,7.12182c0.10636,3.37053 -0.55307,8.69062 2.55688,9.98501l12.93329,5.38391c3.1142,1.29652 6.40602,-2.91743 8.87143,-5.21799l5.21373,-4.85211c0.05743,0.00106 0.11274,-0.00638 0.17017,-0.00532c0.67113,0.07445 1.33694,0.09998 2.00275,0.13401c0.19996,0.01702 0.39353,0.01808 0.58285,0.03829c0.3127,0.00957 0.61263,0.03403 0.91469,0.04467c0.35737,0.00745 0.71367,-0.00319 1.07104,-0.00213c0.86896,0.02021 1.73897,0.00213 2.60048,-0.03723c0.37545,-0.01276 0.75941,-0.04148 1.1306,-0.06275c0.58604,-0.02553 1.15081,-0.05424 1.72727,-0.08828l5.18927,4.86062c2.47179,2.32182 5.74234,6.54216 8.86717,5.25202l12.93116,-5.3286c3.13015,-1.2912 2.48349,-6.59321 2.60261,-9.98182l0.24463,-7.10054c0.60944,-0.5084 1.19654,-1.03807 1.76344,-1.55497c0.07977,-0.09253 0.17124,-0.15741 0.25845,-0.2308c0.19783,-0.18719 0.40948,-0.3446 0.57966,-0.52435c0.3446,-0.30525 0.64135,-0.64241 0.95511,-0.9466c0.44884,-0.45415 0.92533,-0.90831 1.38161,-1.38373c0.66262,-0.71154 1.32949,-1.45606 1.97403,-2.23142c0.07339,-0.06913 0.13082,-0.12763 0.19357,-0.21804c0.05424,-0.04786 0.08721,-0.07977 0.11806,-0.117l7.1165,-0.22867c3.37053,-0.1053 8.69062,0.55413 9.98501,-2.55581l5.38391,-12.93329c1.30077,-3.11101 -2.91956,-6.41559 -5.21905,-8.881zm-30.8761,-10.39981c0,15.71246 -12.73865,28.4511 -28.4511,28.4511s-28.4511,-12.73865 -28.4511,-28.4511s12.73865,-28.4511 28.4511,-28.4511s28.4511,12.73865 28.4511,28.4511z');
            _path.style.strokeWidth = 0;
            _path.style.fill = bgColor;
            _svg.appendChild(_path);

            _path = ce('path');
            _path.attr('d', 'm307.53686,131.42701c0,0 14.14844,-58.49357 0,-78.30806c-14.16511,-19.81449 -19.81449,-33.01304 -50.96107,-42.462s-19.79782,-7.56584 -42.44533,-6.59927c-22.64751,0.9499 -41.52877,13.19855 -41.52877,19.79782c0,0 -14.14844,0.9499 -19.79782,6.61594c-5.66604,5.66604 -15.09834,32.06314 -15.09834,38.67908s4.71615,50.96107 9.4323,60.39336l-5.61605,1.88313c-4.71615,54.71065 18.86459,61.32659 18.86459,61.32659c8.4824,50.96107 16.98147,29.26345 16.98147,42.462s-8.49907,8.49907 -8.49907,8.49907s-7.53251,20.74772 -26.3971,28.29689c-18.86459,7.53251 -123.58642,48.09471 -132.10215,56.59378c-8.51573,8.51573 -7.54917,48.12804 -7.54917,48.12804l449.06731,0c0,0 0.98323,-39.61231 -7.53251,-48.12804c-8.5324,-8.51573 -113.25422,-49.06127 -132.11881,-56.59378c-18.86459,-7.54917 -26.3971,-28.29689 -26.3971,-28.29689s-8.49907,4.69948 -8.49907,-8.49907s8.49907,8.49907 16.99813,-42.462c0,0 23.56408,-6.61594 18.86459,-61.32659l-5.66604,0z');
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
        Estrella: function (dim, bgColor) {
            dim = dim || 22;
            bgColor = bgColor || '#1B344C';

            var _svg = ce('svg');
            _svg.attr('width', dim);
            _svg.attr('height', dim);

            _svg.attr('viewBox', '0 0 22 22');

            var _g = ce('g');

            var _path = ce('path');
            _path.attr('d', 'm7.64533,7.2622c0,0 -4.06984875,0.45078 -6.784800000000001,0.7521524999999999c-0.24470874999999997,0.0296175 -0.46107875000000004,0.1931875 -0.5422175,0.44176000000000004s0,0.50744375 0.18030374999999998,0.67101375c2.01689125,1.84045125 5.0473775,4.59661125 5.0473775,4.59661125c-0.0025712499999999998,0 -0.83199875,4.00932125 -1.38323625,6.6843425000000005c-0.046365,0.2421375 0.04120875,0.49842374999999994 0.25243625000000003,0.651695c0.209935,0.1532575 0.48039750000000003,0.1558425 0.6929037499999999,0.03606625c2.37494125,-1.3497412500000001 5.93219,-3.37951625 5.93219,-3.37951625s3.5585412499999998,2.029775 5.92961875,3.38080875c0.21637,0.11848375 0.4868325,0.1159125 0.6967675,-0.037345c0.21121375,-0.1532575 0.29880125,-0.4095575 0.25114375,-0.6504025c-0.5512374999999999,-2.67631375 -1.3793725,-6.68562125 -1.3793725,-6.68562125s3.03048625,-2.75616 5.04739125,-4.5927475c0.18030374999999998,-0.16872625 0.26016374999999997,-0.42759749999999996 0.18030374999999998,-0.6748775s-0.29621625,-0.41085 -0.540925,-0.43918875c-2.71495125,-0.3039575 -6.7860925000000005,-0.75472375 -6.7860925000000005,-0.75472375s-1.68718,-3.73241 -2.811545,-6.22067875c-0.10561375,-0.22280499999999998 -0.32714,-0.3786475 -0.58729,-0.3786475s-0.48296875,0.15712125 -0.58342625,0.3786475c-1.12564375,2.48826875 -2.811545,6.22067875 -2.811545,6.22067875z');

            _path.style.strokeWidth = 0;
            _path.style.fill = bgColor;
            _g.appendChild(_path);

            _svg.appendChild(_g);

            return Sinco.extend(_svg);
        },
        Reloj: function (dim, bgColor) {
            dim = dim || 22;
            bgColor = bgColor || '#1B344C';

            var _svg = ce('svg');
            _svg.attr('width', dim);
            _svg.attr('height', dim);

            _svg.attr('viewBox', '0 0 22 22');

            var _g = ce('g');

            var _ellipse = ce('ellipse');
            _ellipse.attr('cx', 11);
            _ellipse.attr('cy', 11);
            _ellipse.attr('rx', 9.6);
            _ellipse.attr('ry', 9.6);
            _ellipse.style.strokeWidth = 3;
            _ellipse.style.stroke = bgColor;
            _ellipse.style.fill = 'none';
            _g.appendChild(_ellipse);

            var _line = ce('line');
            _line.attr('y2', 12.28122);
            _line.attr('x2', 14.72029);
            _line.attr('y1', 12.28122);
            _line.attr('x1', 9.78128);
            _line.style.strokeWidth = 2;
            _line.style.stroke = bgColor;
            _line.style.fill = 'none';
            _g.appendChild(_line);

            _line = ce('line');
            _line.attr('y2', 5.02709);
            _line.attr('x2', 10.03128);
            _line.attr('y1', 12.40622);
            _line.attr('x1', 10.03128);
            _line.style.strokeWidth = 2;
            _line.style.stroke = bgColor;
            _line.style.fill = 'none';
            _g.appendChild(_line);

            _svg.appendChild(_g);

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
        Tabular: function (dim, bgColor) {
            dim = dim || 12;
            bgColor = bgColor || '#1B344C';

            var _svg = ce('svg');
            _svg.attr('width', dim);
            _svg.attr('height', dim);

            _svg.attr('viewBox', '0 0 12 12');

            var _rect = ce('rect');
            _rect.attr('x', 1.187179);
            _rect.attr('y', 0.632527);
            _rect.attr('width', 9.687129);
            _rect.attr('height', 1.210891);
            _rect.style.stroke = bgColor;
            _rect.style.fill = bgColor;
            _svg.appendChild(_rect);

            var _polygon = ce('polygon');
            _polygon.attr('points', '1.6246795654296875,7.780692100524902 2.403452157974243,8.559464931488037 5.479990005493164,5.48320198059082 5.479990005493164,11.360623359680176 6.581507205963135,11.360623359680176 6.581507205963135,5.48320198059082 9.658044815063477,8.559464931488037 10.436817169189453,7.780692100524902 6.03074836730957,3.3746235370635986');
            _polygon.style.stroke = bgColor;
            _polygon.style.fill = bgColor;
            _svg.appendChild(_polygon);

            return Sinco.extend(_svg);
        },
        Duplicar: function (dim, bgColor) {
            dim = dim || 12;
            bgColor = bgColor || '#1B344C';

            var _svg = ce('svg');
            _svg.attr('width', dim);
            _svg.attr('height', dim);

            _svg.attr('viewBox', '0 0 12 12');

            var _rect = ce('rect');
            _rect.attr('x', 3.718739);
            _rect.attr('y', 0.843755);
            _rect.attr('width', 7.375009);
            _rect.attr('height', 7.375009);
            _rect.style.fill = 'none';
            _rect.style.strokeWidth = 1.5;
            _rect.style.stroke = bgColor;
            _svg.appendChild(_rect);

            var _line = ce('line');
            _line.attr('y2', 2.593748);
            _line.attr('x2', 10.46986);
            _line.attr('y1', 2.593748);
            _line.attr('x1', 4.218739);
            _line.style.strokeWidth = 2;
            _line.style.stroke = bgColor;
            _line.style.fill = 'none';
            _svg.appendChild(_line);

            _line = ce('line');
            _line.attr('y2', 4.343752);
            _line.attr('x2', 0.197736);
            _line.attr('y1', 4.343752);
            _line.attr('x1', 3.031245);
            _line.style.strokeWidth = 1.5;
            _line.style.stroke = bgColor;
            _line.style.fill = 'none';
            _svg.appendChild(_line);

            _line = ce('line');
            _line.attr('y2', 11.344012);
            _line.attr('x2', 0.90625);
            _line.attr('y1', 4.09375);
            _line.attr('x1', 0.90625);
            _line.style.strokeWidth = 1.5;
            _line.style.stroke = bgColor;
            _line.style.fill = 'none';
            _svg.appendChild(_line);

            _line = ce('line');
            _line.attr('y2', 11.031251);
            _line.attr('x2', 8.721859);
            _line.attr('y1', 11.031251);
            _line.attr('x1', 0.281255);
            _line.style.strokeWidth = 1.5;
            _line.style.stroke = bgColor;
            _line.style.fill = 'none';
            _svg.appendChild(_line);

            _line = ce('line');
            _line.attr('y2', 10.849914);
            _line.attr('x2', 8.031217);
            _line.attr('y1', 8.718706);
            _line.attr('x1', 8.031217);
            _line.style.strokeWidth = 1.5;
            _line.style.stroke = bgColor;
            _line.style.fill = 'none';
            _svg.appendChild(_line);

            return Sinco.extend(_svg);
        },
        Recargar: function (dim, bgColor) {
            dim = dim || 12;

            var _svg = ce('svg');
            _svg.attr('width', dim);
            _svg.attr('height', dim);

            _svg.attr('viewBox', '0 0 12 12');

            var _g = ce('g');

            var _path = ce('path');
            _path.attr('d', 'm10.669776,6.125075c-0.468017,0 -0.689931,0.329798 -0.767867,0.678026c-0.280657,1.253158 -1.471616,3.161307 -3.839333,3.161307c-2.120464,0 -3.839334,-1.719254 -3.839334,-3.839333s1.71887,-3.839334 3.839334,-3.839334c0.86001,0 1.648993,0.289102 2.288243,0.767867l-0.75251,0c-0.423863,0 -0.767866,0.344004 -0.767866,0.767866s0.344002,0.767867 0.767866,0.767867l2.3036,0c0.423862,0 0.767867,-0.344005 0.767867,-0.767867l0,-2.3036c0,-0.423862 -0.344006,-0.767867 -0.767867,-0.767867s-0.767868,0.344005 -0.767868,0.767867l0,0.198878c-0.870376,-0.608918 -1.928496,-0.966744 -3.071465,-0.966744c-2.968573,0 -5.375067,2.406494 -5.375067,5.375067s2.406494,5.375065 5.375067,5.375065c3.831272,0 5.375067,-3.647366 5.375067,-4.559207c0,-0.557855 -0.407739,-0.815857 -0.767867,-0.815857z');

            _path.style.strokeWidth = 0;
            _path.style.fill = bgColor || '#1B344C';

            _g.appendChild(_path);

            _svg.appendChild(_g);

            return Sinco.extend(_svg);
        },
        Dividir: function (dim, bgColor) {
            dim = dim || 16;
            bgColor = bgColor || '#1B344C';

            var _svg = ce('svg');
            _svg.attr('width', dim);
            _svg.attr('height', (dim * 12) / 16);

            _svg.attr('viewBox', '0 0 16 12');

            var _g = ce('g');

            var _path = ce('path');
            _path.attr('d', 'm15.8077,5.81104l-2.24259,-2.24263c-0.06055,-0.0606 -0.14273,-0.09462 -0.22839,-0.09462c-0.08566,0 -0.16783,0.03402 -0.22839,0.09462l-0.60911,0.60911c-0.0606,0.06055 -0.09462,0.14273 -0.09462,0.22839c0,0.08566 0.03402,0.16783 0.09462,0.22839l0.65145,0.6514l-2.26292,0l0,-4.11298c0,-0.17839 -0.14462,-0.32301 -0.32301,-0.32301l-0.86136,0c-0.17839,0 -0.32301,0.14462 -0.32301,0.32301l0,9.73334c0,0.17839 0.14462,0.32301 0.32301,0.32301l0.86136,0c0.17839,0 0.32301,-0.14462 0.32301,-0.32301l0,-4.11298l2.26292,0l-0.65145,0.65145c-0.0606,0.06055 -0.09462,0.14273 -0.09462,0.22839c0,0.08566 0.03402,0.16784 0.09462,0.22839l0.60911,0.60911c0.06055,0.0606 0.14273,0.09462 0.22839,0.09462c0.08566,0 0.16784,-0.03402 0.22839,-0.09462l2.24259,-2.24259c0.12614,-0.12615 0.12614,-0.33068 0,-0.45678z');
            _path.style.strokeWidth = 0;
            _path.style.fill = bgColor;
            _g.appendChild(_path);

            _path = ce('path');
            _path.attr('d', 'm6.36562,0.84975l-0.86136,0c-0.17839,0 -0.32301,0.14462 -0.32301,0.32301l0,4.11298l-2.26292,0l0.65144,-0.6514c0.12615,-0.12615 0.12615,-0.33063 0,-0.45678l-0.60907,-0.60911c-0.0606,-0.06055 -0.14277,-0.09462 -0.22843,-0.09462c-0.08566,0 -0.16784,0.03402 -0.22839,0.09462l-2.24259,2.24259c-0.0606,0.06055 -0.09462,0.14273 -0.09462,0.22839c0,0.08566 0.03402,0.16784 0.09462,0.22839l2.24263,2.24259c0.0606,0.0606 0.14273,0.09462 0.22839,0.09462c0.08566,0 0.16784,-0.03402 0.22843,-0.09462l0.60907,-0.60911c0.12615,-0.12615 0.1261,-0.33068 0,-0.45678l-0.65144,-0.65145l2.26292,0l0,4.11298c0,0.17839 0.14462,0.32301 0.32301,0.32301l0.86136,0c0.17839,0 0.32301,-0.14462 0.32301,-0.32301l0,-9.73334c-0.00004,-0.17834 -0.14467,-0.32297 -0.32305,-0.32297z');
            _path.style.strokeWidth = 0;
            _path.style.fill = bgColor;
            _g.appendChild(_path);

            _svg.appendChild(_g);

            return Sinco.extend(_svg);
        },
        Ayuda: function (dim, bgColor) {
            dim = dim || 22;
            bgColor = bgColor || '#1B344C';


            var _svg = ce('svg');
            _svg.attr('width', dim);
            _svg.attr('height', dim);

            _svg.attr('viewBox', '0 0 22 22');

            var _g = ce('g');

            var _path = ce('path');
            _path.attr('d', 'm11.019635,0.157157c-5.998475999999999,0 -10.860707,4.862473 -10.860707,10.860707c0,5.99852 4.8622309999999995,10.860696 10.860707,10.860696c5.998223,0 10.860707,-4.862176 10.860707,-10.860696c0,-5.998233999999999 -4.862484,-10.860707 -10.860707,-10.860707zm0.9922989999999999,17.116044000000002l-2.022801,0l0,-1.939828l2.022801,0l0,1.939828zm0,-4.011051l0,0.6410910000000001l-2.022801,0l0,-0.789899c0,-2.383656 2.7126219999999996,-2.761913 2.7126219999999996,-4.456067000000001c0,-0.772508-0.6906789999999999,-1.3642420000000002 -1.594912,-1.3642420000000002c-0.93698,0 -1.758801,0.690393 -1.758801,0.690393l-1.151612,-1.4310120000000002c0,0 1.13509,-1.1838419999999998 3.091418,-1.1838419999999998c1.85834,0 3.5837779999999997,1.1507980000000002 3.5837779999999997,3.0909009999999997c0.00088,2.7140299999999997 -2.859692,3.026991 -2.859692,4.802676999999999z');

            _path.style.strokeWidth = 0;
            _path.style.fill = bgColor;
            _g.appendChild(_path);

            _svg.appendChild(_g);

            return Sinco.extend(_svg);
        },
        Pregunta: function (dim, bgColor) {
            dim = dim || 22;
            bgColor = bgColor || '#1B344C';

            var _svg = ce('svg');
            _svg.attr('width', dim);
            _svg.attr('height', dim);

            _svg.attr('viewBox', '0 0 22 22');

            var _path = ce('path');
            _path.attr('d', 'm18.85227,0.375l-15.45454,0c-1.60099,0 -2.89773,1.29673 -2.89773,2.89773l0,15.45454c0,1.60099 1.29673,2.89773 2.89773,2.89773l15.45454,0c1.60099,0 2.89773,-1.29673 2.89773,-2.89773l0,-15.45454c0,-1.60099 -1.29673,-2.89773 -2.89773,-2.89773zm0.96591,18.35227c0,0.53366 -0.43225,0.96591 -0.96591,0.96591l-15.45454,0c-0.53366,0 -0.96591,-0.43225 -0.96591,-0.96591l0,-15.45454c0,-0.53366 0.43224,-0.96591 0.96591,-0.96591l15.45454,0c0.53366,0 0.96591,0.43224 0.96591,0.96591l0,15.45454z');
            _path.style.strokeWidth = 0;
            _path.style.fill = bgColor;
            _svg.appendChild(_path);

            _path = ce('path');
            _path.attr('d', 'm12.53291,17.47614c-0.41582,0.30384 -0.98986,0.45583 -1.71248,0.45583c-0.74257,0 -1.32658,-0.15199 -1.75238,-0.45583c-0.42566,-0.30398 -0.63352,-0.73577 -0.63352,-1.29565c0,-0.55974 0.19797,-0.99167 0.60394,-1.29551c0.40585,-0.30398 0.99983,-0.45597 1.78195,-0.45597c0.75237,0 1.33638,0.15199 1.73225,0.46388c0.40602,0.30398 0.60396,0.73577 0.60396,1.29565c0,0.55182 -0.20791,0.98361 -0.62374,1.28759l0,0z');
            _path.style.strokeWidth = 0;
            _path.style.fill = bgColor;
            _svg.appendChild(_path);

            _path = ce('path');
            _path.attr('d', 'm16.21565,9.40672c-0.4258,0.53581 -1.10886,1.04765 -2.03939,1.52751c-0.79192,0.41584 -1.28703,0.71982 -1.48496,0.91168c-0.19794,0.192 -0.29699,0.41595 -0.29699,0.67978l0,0.46389l-3.47467,0l0,-0.7837c0,-0.5999 0.14843,-1.10366 0.45539,-1.51153c0.29699,-0.40787 0.83165,-0.80773 1.6038,-1.19962c0.61376,-0.3119 1.04936,-0.59182 1.3166,-0.83976c0.26724,-0.24789 0.40585,-0.5358 0.40585,-0.8557c0,-0.25592 -0.13861,-0.45587 -0.42562,-0.6078c-0.28719,-0.15198 -0.66329,-0.22394 -1.11866,-0.22394c-1.13844,0 -2.46502,0.32789 -3.98955,0.97571l-1.57404,-2.48724c1.8809,-0.86372 3.83117,-1.29561 5.88036,-1.29561c1.6829,0 2.99967,0.29592 3.95978,0.89573c0.96028,0.59978 1.43543,1.40754 1.43543,2.43924c-0.0098,0.73575 -0.22769,1.37556 -0.65331,1.91141l0,-0.00003l0,-0.00001z');
            _path.style.strokeWidth = 0;
            _path.style.fill = bgColor;
            _svg.appendChild(_path);

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
                            elem = Sinco.extend(elem);
                            elem.listeners = {};
                            return elem;
                        });
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
        for (var n in opt)
            el[n] = opt[n];

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
            this.insertBefore(e, this.childNodes[opc] || this.firstChild);
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

    ////Objeto DragDrop

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

    ////Objeto AutoCompletar

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

    ////Objeto Tour

    var tour = function () {
        var _steps = [];
        var _index = 0;
        var _container = {
            blockDiv: null,
            element: null,
            top: null,
            bottom: null,
            left: null,
            right: null,
            content: {
                element: null,
                title: {
                    element: null,
                    icon: null,
                    text: null
                },
                body: null,
                buttonNext: null,
                buttonPrev: null,
                buttonFinish: null,
                buttonExit: null
            },
            recuadro: null
        }

        var _tourExtendProps = function (el, opt) {
            for (var n in opt) {
                if (el[n] !== null && typeof el[n] == 'object' && !(el[n] instanceof Array))
                    _tourExtendProps(el[n], opt[n]);
                else
                    el[n] = opt[n];
            }
            return el;
        }

        var getTemplate = function () {
            return {
                target: '',
                observerTarget: {
                    element: null,
                    event: ''
                },
                content: {
                    width: 0,
                    title: '',
                    body: '',
                    position: {
                        top: 0,
                        left: 0
                    }
                },
                onShow: function (obj) { },
                prevStep: null,
                padding: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                }
            }
        }

        var addStep = function (obj) {
            var _obj = getTemplate();
            _tourExtendProps(_obj, obj);

            if (!obj) {
                new SincoInitializationError('¡El paso no puede ser null o undefined!');
            }
            else {
                _obj.index = _steps.length;
                _obj.fromObserver = _steps[_steps.length - 1] && !!_steps[_steps.length - 1].observerTarget.element;
                _steps.push(_obj);
            }
        }

        if (arguments.length > 0) {
            var _args = Array.prototype.slice.call(arguments);
            _args.forEach(function (a) {
                if (a instanceof Array) {
                    a.forEach(function (b) {
                        addStep(b);
                    });
                }
                else {
                    addStep(a);
                }
            });
        }

        var init = function (_this) {
            var body = Sinco.extend(document.body);
            var head = Sinco.extend(document.head);

            _container.blockDiv = Sinco.createElem('div', { 'id': 'tour-background-block' });
            _container.top = Sinco.createElem('div', { 'class': 'tour-background' });
            _container.bottom = Sinco.createElem('div', { 'class': 'tour-background' });
            _container.left = Sinco.createElem('div', { 'class': 'tour-background' });
            _container.right = Sinco.createElem('div', { 'class': 'tour-background' });
            _container.content.element = Sinco.createElem('section', { 'id': 'tour-content' });
            _container.content.title.icon = Sinco.createElem('div', { 'id': 'tour-content-header-icon' });
            _container.content.title.text = Sinco.createElem('section', { 'id': 'tour-content-header-text' });
            _container.content.title.element = Sinco.createElem('header', { 'id': 'tour-content-header' }).insert([
                _container.content.title.icon,
                _container.content.title.text
            ]);
            _container.content.body = Sinco.createElem('header', { 'id': 'tour-content-body' });
            _container.content.buttonNext = Sinco.createElem('button', { 'class': 'tour-content-button next', 'type': 'button' });
            _container.content.buttonNext.addEvent('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                nextStep(++_index);
            });

            _container.content.buttonPrev = Sinco.createElem('button', { 'class': 'tour-content-button', 'type': 'button' });
            _container.content.buttonPrev.innerHTML = 'Anterior';
            _container.content.buttonPrev.addEvent('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                if (_steps[_index].prevStep !== null) {
                    for (var i = _steps[_index].prevStep - 1; i < _steps.length; i++) {
                        _steps[i].hasNext = false;
                    }
                    _index = _steps[_index].prevStep;
                }
                else {
                    _index--;
                    _steps[_index].hasNext = false;
                }

                nextStep(_index);
            });

            _container.content.buttonExit = Sinco.createElem('button', { 'class': 'tour-content-button next', 'type': 'button' });
            _container.content.buttonExit.innerHTML = 'Salir';
            _container.content.buttonExit.addEvent('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                finalizar(_this);
            });

            _container.content.buttonFinish = Sinco.createElem('button', { 'class': 'tour-content-button left', 'type': 'button' });
            _container.content.buttonFinish.innerHTML = 'Terminar guía';
            _container.content.buttonFinish.addEvent('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                _index = _steps.length - 1;
                nextStep(_index);
            });

            _container.recuadro = {
                top: Sinco.createElem('aside', { 'class': 'tour-frame top' }),
                left: Sinco.createElem('aside', { 'class': 'tour-frame left' }),
                right: Sinco.createElem('aside', { 'class': 'tour-frame right' }),
                bottom: Sinco.createElem('aside', { 'class': 'tour-frame bottom' })
            };

            body.insert([
                _container.top,
                _container.bottom,
                _container.left,
                _container.right,
                _container.recuadro.top,
                _container.recuadro.right,
                _container.recuadro.left,
                _container.recuadro.bottom,
                _container.blockDiv
            ]);

            _container.content.element.insert([
                _container.content.title.element,
                _container.content.body,
                Sinco.createElem('footer').insert([
                    _container.content.buttonFinish,
                    _container.content.buttonPrev,
                    _container.content.buttonNext,
                    _container.content.buttonExit
                ])
            ]);

            body.insert(_container.content.element);

            if (!Sinco.get('tour-styles')) {

                var estilos = Sinco.createElem('style', { 'type': 'text/css', 'id': 'tour-styles' });
                var estArr = [];

                estArr.push('#tour-content {');
                estArr.push('   position: absolute;');
                estArr.push('   z-index: 99;');
                estArr.push('   background-color: #FFF;');
                estArr.push('   padding: 12px;');
                estArr.push('   min-width: 320px;');
                estArr.push('   display: flex;');
                estArr.push('   flex-flow: column;');
                estArr.push('   font-size: 20px;');
                estArr.push('   border: 1px solid rgba(68, 68, 68, 0.6);');
                estArr.push('   font-family: Roboto;');
                estArr.push('   color: #1B344C;');
                estArr.push('   -webkit-box-shadow: 0px 0px 15px 0px rgba(50, 50, 50, 0.7);');
                estArr.push('   -moz-box-shadow:    0px 0px 15px 0px rgba(50, 50, 50, 0.7);');
                estArr.push('   box-shadow:         0px 0px 15px 0px rgba(50, 50, 50, 0.7);');
                estArr.push('}');

                estArr.push('#tour-background-block {');
                estArr.push('   position: absolute;');
                estArr.push('   top: 0;');
                estArr.push('   bottom: 0;');
                estArr.push('   left: 0;');
                estArr.push('   right: 0;');
                estArr.push('   z-index: 90;');
                estArr.push('   background-color: rgba(255, 255, 255, 0.01);');
                estArr.push('}');

                estArr.push('#tour-content-header-icon {');
                estArr.push('   margin-right: 5px;');
                estArr.push('   display: flex;');
                estArr.push('   align-items: center;');
                estArr.push('}');

                estArr.push('#tour-content-header {');
                estArr.push('   border-bottom: 1px solid silver;');
                estArr.push('   padding: 7px;');
                estArr.push('   color: rgba(0, 0, 0, 0.87);');
                estArr.push('   border-radius: 2px;');
                estArr.push('   font-weight: bold;');
                estArr.push('   display: flex;');
                estArr.push('   align-items: center;');
                estArr.push('}');

                estArr.push('#tour-content-body {');
                estArr.push('   padding: 22px 8px;');
                estArr.push('   font-size: 0.7em;');
                estArr.push('}');

                estArr.push('.tour-content-button {');
                estArr.push('   border: none;');
                estArr.push('   background-color: #1B344C;');
                estArr.push('   color: #FFF;');
                estArr.push('   padding: 0 8px;');
                estArr.push('   cursor: pointer;');
                estArr.push('   font: 14px "Roboto","Arial",sans-serif;');
                estArr.push('   border-radius: 2px;');
                estArr.push('   margin-left: 5px;');
                estArr.push('   height: 32px;');
                estArr.push('   transition: all 150ms cubic-bezier(0.4,0,0.2,1);');
                estArr.push('   -webkit-tap-highlight-color: rgba(0,0,0,0);');
                estArr.push('   -webkit-user-select: none;');
                estArr.push('   text-transform: uppercase;');
                estArr.push('}');

                estArr.push('.tour-content-button:not(.next) {');
                estArr.push('   background-color: transparent;');
                estArr.push('   color: #1B344C;');
                estArr.push('}');

                estArr.push('.tour-content-button.left {');
                estArr.push('   float: left;');
                estArr.push('   margin-left: 0 !important;');
                estArr.push('}');

                estArr.push('.tour-content-button.next:hover {');
                estArr.push('   background-color: #3E5368;');
                estArr.push('}');

                estArr.push('.tour-content-button.next:disabled {');
                estArr.push('   background-color: white;');
                estArr.push('   border: 1px solid #dedede;');
                estArr.push('   color: #A7A7A7;');
                estArr.push('   cursor: no-drop;');
                estArr.push('}');

                estArr.push('.tour-content-button:not(.next):hover {');
                estArr.push('   background-color: rgba(153,153,153,0.2);');
                estArr.push('}');

                estArr.push('#tour-container {');
                estArr.push('   position: absolute;');
                estArr.push('   top: 0;');
                estArr.push('   left: 0;');
                estArr.push('   right: 0;');
                estArr.push('   bottom: 0;');
                estArr.push('   z-index: 99;');
                estArr.push('}');

                estArr.push('#tour-content.mobile {');
                estArr.push('   top: inherit !important;');
                estArr.push('   width: inherit !important;');
                estArr.push('   left: 5px !important;');
                estArr.push('   right: 5px !important;');
                estArr.push('   bottom: 80px !important;');
                estArr.push('}');

                estArr.push('.tour-background {');
                estArr.push('   z-index: 98;');
                estArr.push('   position: absolute;');
                estArr.push('   background-color: rgba(68, 68, 68, 0.8);');
                estArr.push('}');
                estArr.push('.tour-frame {');
                estArr.push('   position: absolute;');
                estArr.push('   border: 1px solid #378fa9;');
                estArr.push('   z-index: 99;');
                estArr.push('}');
                estArr.push('.tour-frame.top, .tour-frame.bottom {');
                estArr.push('   height: 0;');
                estArr.push('}');
                estArr.push('.tour-frame.left, .tour-frame.right {');
                estArr.push('   width: 0;');
                estArr.push('}');

                estArr.push('.tour-frame.top {');
                estArr.push('   -webkit-box-shadow: 0px -3px 10px 0px #378fa9;');
                estArr.push('   -moz-box-shadow:    0px -3px 10px 0px #378fa9;');
                estArr.push('   box-shadow:         0px -3px 10px 0px #378fa9;');
                estArr.push('}');
                estArr.push('.tour-frame.bottom {');
                estArr.push('   -webkit-box-shadow: 0px 3px 10px 0px #378fa9;');
                estArr.push('   -moz-box-shadow:    0px 3px 10px 0px #378fa9;');
                estArr.push('   box-shadow:         0px 3px 10px 0px #378fa9;');
                estArr.push('}');
                estArr.push('.tour-frame.left {');
                estArr.push('   -webkit-box-shadow: -3px 0px 10px 0px #378fa9;');
                estArr.push('   -moz-box-shadow:    -3px 0px 10px 0px #378fa9;');
                estArr.push('   box-shadow:         -3px 0px 10px 0px #378fa9;');
                estArr.push('}');
                estArr.push('.tour-frame.right {');
                estArr.push('   -webkit-box-shadow: 3px 0px 10px 0px #378fa9;');
                estArr.push('   -moz-box-shadow:    3px 0px 10px 0px #378fa9;');
                estArr.push('   box-shadow:         3px 0px 10px 0px #378fa9;');
                estArr.push('}');

                estArr.push('#tour-content.modal {');
                estArr.push('   top: 100px;');
                estArr.push('}');
                estArr.push('#tour-content > footer {');
                estArr.push('   text-align: right;');
                estArr.push('   padding: 5px;');
                estArr.push('}');

                estilos.innerHTML = estArr.join('');
                head.insert(estilos);
            }
        }

        var finalizar = function (_this) {
            _index = 0;
            _container.blockDiv.delete();
            _container.top.delete();
            _container.bottom.delete();
            _container.left.delete();
            _container.right.delete();
            _container.content.element.delete();
            _container.recuadro.top.delete();
            _container.recuadro.bottom.delete();
            _container.recuadro.left.delete();
            _container.recuadro.right.delete();

            if (_this.onFinish) {
                _this.onFinish();
            }
        }

        var nextStep = function (i) {
            var step = _steps[i];
            if (step) {
                mostrarPaso(step);
            }
            if (i == _steps.length - 1) {
                _container.content.buttonExit.removeAttribute('style');
                _container.content.buttonPrev.removeAttribute('style');
                _container.content.buttonNext.styles('display', 'none');
                _container.content.buttonFinish.styles('display', 'none');
            }
            else {
                _container.content.buttonExit.styles('display', 'none');
                _container.content.buttonNext.removeAttribute('style');
                _container.content.buttonFinish.removeAttribute('style');
            }
        }

        var mostrarPaso = function (step) {
            if (!step.target || ( typeof step.target == 'string' && step.target.split(' ').join('') === '' )) {
                mostrarDialogo(step);
            }
            else {
                mostrarFondo(step);

                var callBack = function () {
                    mostrarFondo(step);
                }

                Sinco.extend(window).removeEvent('resize', callBack);
                Sinco.extend(window).addEvent('resize', callBack);
            }

            _container.content.title.text.innerHTML = step.content.title;
            _container.content.title.icon.innerHTML = '';
            _container.content.body.innerHTML = '';

            if (step.observerTarget.element) {
                _container.content.title.icon.insert(Sinco.iconos.Lab(22, '#000'));
            }
            else {
                _container.content.title.icon.insert(Sinco.iconos.Info(22, '#000'));
            }

            if (typeof step.content.body == 'string') {
                _container.content.body.innerHTML = step.content.body;
            }
            else if (typeof step.content.body == 'function') {
                _container.content.body.insert(step.content.body());
            }

            if (step.index == 0) {
                _container.content.buttonNext.innerHTML = 'Empezar';

                _container.content.buttonNext.removeAttribute('disabled');
                _container.content.buttonPrev.styles('display', 'none');
                _container.content.buttonFinish.styles('display', 'none');
            }
            else if (_steps.length > _index + 1) {
                _container.content.buttonNext.innerHTML = 'Siguiente';

                _container.content.buttonNext.removeAttribute('disabled');
                _container.content.buttonPrev.removeAttribute('style');
                _container.content.buttonFinish.removeAttribute('style');
            }
            else {
                _container.content.buttonNext.attribute('disabled', 'disabled');
                _container.content.buttonFinish.removeAttribute('style');
            }

            _container.content.element.styles('width', step.content.width);

            if (step.onShow) {
                step.onShow({
                    step: step,
                    container: _container
                });
            }

            if (step.observerTarget.element) {
                _container.blockDiv.styles('display', 'none');

                if (typeof step.observerTarget.event == 'string' && step.observerTarget.event !== '') {
                    step.observerTarget.element.on(step.observerTarget.event, function (elem, values) {
                        elem.off(step.observerTarget.event);
                        step.hasNext = true;
                        nextStep(++_index);
                    });
                }
                else if (typeof step.observerTarget.event == 'object') {
                    step.observerTarget.element.on(step.observerTarget.event.name, function (elem, values) {
                        if (!step.hasNext) {
                            var _callee = arguments.callee;
                            setTimeout(function () {
                                if (!step.hasNext) {
                                    if (step.observerTarget.event.validator(elem, values)) {
                                        elem.off(step.observerTarget.event.name);
                                        step.hasNext = true;
                                        nextStep(++_index);
                                    }
                                    else {
                                        _callee(elem, values);
                                    }
                                }
                            }, 1);
                        }
                    });
                }
                _container.content.buttonNext.attribute('disabled', 'disabled');
            }
            else {
                _container.blockDiv.removeAttribute('style');
            }
            if (_steps[_index - 1]) {
                _steps[_index - 1].hasNext = true;
            }
        }

        var mostrarDialogo = function (step) {
            _container.content.element.classList.add('modal');
            _container.content.element.classList.remove('mobile');
            _container.content.element.removeAttribute('style');
            _container.content.element.styles('margin-left', 'calc(50% - ' + ((parseInt( step.content.width.replaceAll('px', '').replaceAll('%', '') ) / 2) + 12) + 'px)');
            _container.top.removeAttribute('style');
            _container.bottom.removeAttribute('style');
            _container.left.removeAttribute('style');
            _container.right.removeAttribute('style');
            _container.recuadro.top.removeAttribute('style');
            _container.recuadro.bottom.removeAttribute('style');
            _container.recuadro.left.removeAttribute('style');
            _container.recuadro.right.removeAttribute('style');

            _container.top.styles('top', '0');
            _container.top.styles('left', '0');
            _container.top.styles('right', '0');
            _container.top.styles('bottom', '0');
        }

        var mostrarFondo = function (step) {
            _container.content.element.removeAttribute('style');
            _container.content.element.classList.remove('modal');

            var target = typeof step.target != 'string' ? step.target.getBoundingClientRect() : step.target.split(',').reduce(function (total, actual, i) {
                var el = Sinco.get(actual.split(' ').join(''));
                if (el && el.getBoundingClientRect) {
                    el = el.getBoundingClientRect();

                    if (el.height != 0 && el.width != 0) {
                        if (total.top == 0 && total.left == 0 && total.height == 0 && total.width == 0) {
                            total.top = el.top;
                            total.left = el.left;
                            total.height = el.height;
                            total.width = el.width;
                        }

                        if (total.top > el.top) {
                            total.top = el.top;
                        }
                        else {
                            total.max.top = el.top;
                        }

                        if (total.left > el.left) {
                            total.left = el.left;
                        }
                        else {
                            total.max.left = el.left;
                        }

                        if (total.max.left <= el.left) {
                            total.width = (total.max.left - total.left) + el.width;
                        }

                        if (total.max.top <= el.top) {
                            total.height = (total.max.top - total.top) + el.height;
                        }
                    }
                }
                return total;
            },
            {
                top: 0,
                left: 0,
                width: 0,
                height: 0,
                max: {
                    top: 0,
                    left: 0
                }
            });

            var valorWidthIzq,
                valorWidthSuperior;

            //Sombra izquierda
            {
                _container.left.styles('top', '0');
                _container.left.styles('left', '0');
                _container.left.styles('bottom', '0');
                valorWidthIzq = Math.round(target.left >= step.padding.left ? target.left - step.padding.left : 0);
                _container.left.styles('width', valorWidthIzq + 'px');
            }

            //Sombra superior
            {
                _container.top.styles('top', '0');

                _container.top.styles('height', Math.round(target.top >= step.padding.top ? target.top - step.padding.top : 0) + 'px');
                valorWidthSuperior = Math.round(target.width + step.padding.left + step.padding.right);
                _container.top.styles('width', valorWidthSuperior + 'px');
                _container.top.styles('left', valorWidthIzq + 'px');
            }

            //Sombra inferior
            {
                _container.bottom.styles('bottom', '0');

                _container.bottom.styles('top', Math.round(target.top + target.height + step.padding.bottom) + 'px');
                _container.bottom.styles('width', valorWidthSuperior + 'px');
                _container.bottom.styles('left', valorWidthIzq + 'px');
            }

            //Sombra derecha
            {
                _container.right.styles('top', '0');
                _container.right.styles('right', '0');
                _container.right.styles('bottom', '0');

                _container.right.styles('left', (valorWidthSuperior + valorWidthIzq) + 'px');
            }

            {
                _container.recuadro.top.styles('top', Math.round(target.top >= step.padding.top ? target.top - step.padding.top : 0) + 'px');
                _container.recuadro.top.styles('left', Math.round(target.left - step.padding.left - 2) + 'px');
                _container.recuadro.top.styles('width', Math.round(target.width + step.padding.left + step.padding.right + 2) + 'px');
            }

            {
                _container.recuadro.bottom.styles('top', Math.round(target.top + target.height + step.padding.bottom) + 'px');
                _container.recuadro.bottom.styles('left', Math.round(target.left - step.padding.left - 2) + 'px');
                _container.recuadro.bottom.styles('width', Math.round(target.width + step.padding.left + step.padding.right + 2) + 'px');
            }

            {
                _container.recuadro.left.styles('left', Math.round(target.left - step.padding.left - 2) + 'px');
                _container.recuadro.left.styles('height', Math.round(target.height + step.padding.bottom + step.padding.top) + 'px');
                _container.recuadro.left.styles('top', Math.round(target.top >= step.padding.top ? target.top - step.padding.top : 0) + 'px');
            }

            {
                _container.recuadro.right.styles('left', Math.round(target.left + target.width + step.padding.right) + 'px');
                _container.recuadro.right.styles('height', Math.round(target.height + step.padding.bottom + step.padding.top) + 'px');
                _container.recuadro.right.styles('top', Math.round(target.top >= step.padding.top ? target.top - step.padding.top : 0) + 'px');
            }

            _container.content.element.styles('top', (target.top + step.content.position.top) + 'px');
            _container.content.element.styles('left', (target.left + step.content.position.left) + 'px');

            if (window.matchMedia('(max-width: 578px)').matches) {
                _container.content.element.classList.add('mobile');
            }
            else {
                _container.content.element.classList.remove('mobile');
            }
        }

        this.addStep = addStep;

        this.setTargetToStep = function (target, index) {
            if (_steps[index]) {
                _steps[index].target = target;
            }
        }

        this.launch = function () {
            init(this);

            if (!!_steps.length) {
                nextStep(_index);
            }
        }
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
        on: on,
        off: off,
        dispatch: dispatch,
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
            Tour: tour,
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