(function (Sinco) {

    var propiedadesComponente = {
        id: { tipo: 'string' },
        template: { tipo: 'object' },
        styles: { tipo: 'object' },
        propiedades: { tipo: 'object' },
        funciones: { tipo: 'object' },
        data: { tipo: 'object' },
        on_create: { tipo: 'function' }
    }

    var funcionesComponente = {
        constructor: function () {

            var componente = this;
            componente.diccionarioProps = {};

            var crearTemplate = function () {

                var plantilla = Sinco.createElem('template', { 'id': 'template-' + componente.id });

                if (!plantilla.content) {
                    var docContent = plantilla.appendChild(document.createDocumentFragment());
                    plantilla.content = docContent;
                }

                Sinco.extend(plantilla.content);
                document.body.appendChild(plantilla);

                if (/\.css$/.test(componente.styles)) {
                    var estilos = Sinco.createElem('link', { href: String.format("s5_components/{0}/{1}", componente.id, componente.styles), rel: "stylesheet", as: "style" });
                } else {
                    var estilos = Sinco.createElem('styles');
                    estilos.innerHTML = componente.styles
                }

                plantilla.content.insert(estilos);


                if (!!componente.template && (componente.template instanceof HTMLElement || Array.isArray(componente.template))) {
                    plantilla.content.insert(componente.template);
                } else if (!!componente.template) {
                    var elem = document.createElement('div');
                    elem.innerHTML = componente.template;

                    [].forEach.call(elem.childNodes, function (el) {
                        plantilla.content.insert(el);
                    });
                }

                componente.plantilla = plantilla;

                return plantilla;
            }

            var registrarElemento = function () {

                var proto = Object.create(HTMLElement.prototype);


                if (componente.propiedades) {
                    componente.propiedades.forEach(function (prop) {

                        componente.diccionarioProps[prop.toLowerCase()] = prop;

                        Object.defineProperty(proto, prop, {
                            get: function () {
                                return componente.data[prop];
                            },
                            set: function (newValue) {
                                componente.data[prop] = newValue;
                            },
                            enumerable: true,
                            configurable: true
                        });
                    });
                }

                if (componente.funciones) {
                    Object.keys(componente.funciones).forEach(function (func) {
                        Object.defineProperty(proto, func, { value: componente.funciones[func] });
                    });
                }

                /*Funciones del ciclo de vida */
                proto.readAttributes = function () {
                    var elemento = this;
                    elemento.data = {};

                    componente.propiedades.forEach(function (prop) {
                        //prop = prop.toLowerCase();

                        var valor = elemento.getAttribute(prop.toLowerCase());

                        Object.defineProperty(elemento, prop, {
                            get: function () {
                                return valor;
                            },
                            set: function (newValue) {
                                valor = newValue;
                            },
                            enumerable: true,
                            configurable: true
                        });

                        elemento.data[prop] = valor;

                    });

                    Object.keys(componente.data).forEach(function (prop) {
                        elemento.data[prop] = componente.data[prop];
                    });
                };

                var renderElement = function (clone, data) {
                    [].forEach.call(clone.childNodes, function (el) {
                        var contenido = el.innerHTML;
                        el.innerHTML = Sinco.interpolate(contenido)(data);
                    });
                }

                proto.createdCallback = function () {

                    this.readAttributes();

                    var nuevaInstancia = this;

                    var clone = document.importNode(componente.plantilla.content, true);

                    //renderElement(clone, nuevaInstancia.data);

                    Object.keys(componente.funciones).forEach(function (nombreFN) {
                        window[nombreFN] = function (params) {
                            componente.funciones[nombreFN].apply(componente, params)
                        }
                    });

                    this.root = Sinco.extend(clone);

                    if (componente.on_create) {
                        Sinco.extend(this);
                        componente.on_create.call(this);
                    }

                    /*IE NO TIENE SHADOWROOT*/
                    if (this.createShadowRoot) {
                        this.createShadowRoot().appendChild(clone);
                    } else {
                        this.appendChild(clone);
                    }
                },
                    proto.attachedCallback = function () {
                        var componente = this.shadowRoot || this;

                        renderElement(componente, this.data);
                    },
                    proto.attributeChangedCallback = function (attributeName, oldValue, newValue, namespace) {
                        this.data[componente.diccionarioProps[attributeName]] = newValue;

                        var elemento = this;
                        var prop = componente.diccionarioProps[attributeName];


                        Object.defineProperty(elemento, prop, {
                            get: function () {
                                return elemento.data[prop];
                            },
                            set: function (newValue) {
                                elemento.data[prop] = newValue;
                            },
                            enumerable: true,
                            configurable: true
                        });


                        Object.keys(componente.funciones).forEach(function (func) {
                            Object.defineProperty(elemento, func, { value: componente.funciones[func] });
                        });
                    }

                proto.insertar = function (elem) {
                    //config.elemento.innerHTML = '{{ ' + config.elemento.bind + ' }}';
                    var nodo = this.shadowRoot || this;
                    Sinco.insert.call(nodo, elem);
                }


                return document.registerElement(componente.id, { prototype: proto });
            }


            crearTemplate();
            registrarElemento();

        }

    }

    var ComponenteEsquema = new Sinco.model.define('Componente', propiedadesComponente, funcionesComponente);


})(Sinco);