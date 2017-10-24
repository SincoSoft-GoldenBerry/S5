(function (Sinco) {

    var autocomplete = function (input, config) {
        /// <summary>Da la opción de convertir un input type text a control autocompletar</summary>
        /// <param name="input" type="String or Object">Elemento a convertir</param>
        /// <param name="config" type="Object">Configuraciones del selector</param>

        if (!(this instanceof Sinco.utilities.autocomplete))
            throw new SincoInitializationError('¡Autocomplete requiere ser inicializado mediante new Sinco.utilities.autocomplete()!');

        if (!Sinco.iconos)
            throw new SincoInitializationError('¡Autocomplete requiere el objeto Sinco.iconos!');

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
                viewalldata: false,
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
                orderby: undefined,
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

            this.setSelectedValue = function (value, itemDatos) {
                if (value != null && typeof value != 'undefined') {
                    var item = (itemDatos || _datos).filter(function (o) {
                        return o[_config.value] == value;
                    });
                    if (item.length > 0) {
                        item = item.shift();
                    }
                    else {
                        item = _datos[0];
                    }
                    _selectItem(item);
                    _input.value = item[_config.text];
                    _exec.call(_input);
                    _ocultarItems();
                }
                else {
                    _exec.call(_input);
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
                _ordenarDatos(dataSource);
                _config.dataSource = _datos;
                if (_datos && !_datos.length) {
                    selected = {
                        value: '',
                        text: '',
                        props: {}
                    };
                    _input.value = '';
                }
            }

            this.setServiceUrl = function (url) {
                _config.service._url = url;
                _config.service.url = url;
            }

            this.restart = function () {
                selected = {
                    value: '',
                    text: '',
                    props: {}
                };
                _input.value = '';
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
                    _clickItem.call(Sinco.get('.autocomplete-results-item-' + _config.id)[_indexSelected]);
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
                    _indexSelected = indice;
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
                        _http = Sinco.Request(_config.service.method, _config.service._url.split('[' + _config.data.search + ']').join(texto), funciones);
                    }
                    else {
                        _config._param = _config._param || {};
                        _config._param[_config.data.search] = texto;

                        _http = Sinco.Request(_config.service.method, _config.service.url, funciones, _config._param);
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
                    if (!!_config.viewalldata){
                        for (var i in item) {
                            datoSeleccionado.props[i] = item[i];
                        }
                    }
                    else{
                        for (var i in _config.data.props) {
                            datoSeleccionado.props[i] = item[_config.data.props[i]];
                        }
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

            var _ordenarDatos = function (data) {
                var by = _config.orderby || _config.text;
                _datos = data.sort(function (a, b) {
                    if (a[by].toLowerCase() < b[by].toLowerCase()) return -1;
                    if (a[by].toLowerCase() > b[by].toLowerCase()) return 1;
                    return 0;
                });
            }

            var _mostrarOpciones = function (data) {
                if (!data) {
                    data = { length: 0 };
                }
                else if (!(Array.isArray(data))) {
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
                    item = Sinco.createElem('div', { 'class': 'autocomplete-results-item-' + _config.id });
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
                    _ordenarDatos(data);

                    _datos.forEach(function (o) {
                        item = Sinco.createElem('div', { 'class': 'autocomplete-results-item-' + _config.id }).addEvent('mouseover', function () {
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

                _input.styles('-ms-flex', '1 1 auto');
                _input.styles('flex', '1 1 auto');
                if (_config.icon !== '')
                    _input.styles('padding-left', '47px');

                var style = _input.currentStyle || window.getComputedStyle(_input);

                _config.dimensions = {
                    width: _input.offsetWidth,
                    height: _input.offsetHeight,
                    left: parseInt(style.marginLeft == 'auto' ? '0' : style.marginLeft.split('px').join('')),
                    top: parseInt(style.marginTop == 'auto' ? '0' : style.marginTop.split('px').join('')),
                    right: parseInt(style.marginRight == 'auto' ? '0' : style.marginRight.split('px').join('')),
                    bottom: parseInt(style.marginBottom == 'auto' ? '0' : style.marginBottom.split('px').join(''))
                };

                if (!!_config.icon) {
                    var icon = Sinco.createElem('aside', { 'class': 'autocomplete-icon', 'id': 'autocomplete-icon-' + _config.id });
                    icon.insert(Sinco.iconos[_config.icon](_dimensionar(14), '#5A5A5A'));
                    _container.insert(icon);
                }
				
				var _resultsContainer = Sinco.createElem('div', { 'class': 'autocomplete-results', 'id': 'autocomplete-results-' + _config.id, 'style': 'display: none;' });

                var _searchContainer = Sinco.createElem('div', { 'class': 'autocomplete-button-search', 'id': 'autocomplete-button-search-' + _config.id }).addEvent('click', function () {
                    _exec.call({ value: '_'/*_input.value*/ });
                    _input.focus();
					setTimeout(function(){
						_resultsContainer.styles('display', '');
					}, 1);
                });
                _searchContainer.insert(Sinco.iconos.Triangulo(_dimensionar(6), '#5A5A5A'));
                _container.insert(_searchContainer);
                _container.insert(_resultsContainer);
            }

            //Estilos de autocompletar
            var _style = Sinco.createElem('style', { 'type': 'text/css' });
            {
                var _stylesArray = [];

                _stylesArray.push('#autocomplete-container-' + _config.id + ' {');
                _stylesArray.push('    position: relative;');
                _stylesArray.push('    display: -ms-flexbox;');
                _stylesArray.push('    display: flex;');
                _stylesArray.push('}');

                _stylesArray.push('#autocomplete-container-' + _config.id + ' > input {');
                _stylesArray.push('    -ms-flex: 1 1 auto;');
                _stylesArray.push('    flex: 1 1 auto;');
                /*_stylesArray.push('    padding-left: ' + (_config.dimensions.width + _config.dimensions.left) + 'px;');*/
                _stylesArray.push('}');

                _stylesArray.push('#autocomplete-button-search-' + _config.id + ' {');
                _stylesArray.push('    position: absolute;');
                _stylesArray.push('    top: ' + _config.dimensions.top + 'px;');
                _stylesArray.push('    bottom: ' + _config.dimensions.bottom + 'px;');
                _stylesArray.push('    right: ' + _config.dimensions.left + 'px;');
                _stylesArray.push('    position: absolute;');
                _stylesArray.push('    display: -ms-flexbox;');
                _stylesArray.push('    display: flex;');
                _stylesArray.push('    -ms-flex-align: center;');
                _stylesArray.push('    align-items: center;');
                _stylesArray.push('    -ms-flex-pack: center;');
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
                _stylesArray.push('    font-size: .75rem;');

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
                    _stylesArray.push('    .autocomplete-results-item-' + _config.id + '.autocomplete-results-item-layout {');
                    _stylesArray.push('        display: -ms-flexbox;');
                    _stylesArray.push('        display: flex;');
                    _stylesArray.push('        -ms-flex-flow: column nowrap;');
                    _stylesArray.push('        -webkit-flex-flow: column nowrap;');
                    _stylesArray.push('        flex-flow: column nowrap;');
                    _stylesArray.push('        border-top: 1px silver solid;');
                    _stylesArray.push('        font-size: .75rem;');
                    _stylesArray.push('    }');

                    _stylesArray.push('    .autocomplete-results-item-' + _config.id + '.autocomplete-results-item-layout > header {');
                    _stylesArray.push('        display: -ms-flexbox;');
                    _stylesArray.push('        display: flex;');
                    _stylesArray.push('        -ms-flex-flow: row nowrap;');
                    _stylesArray.push('        -webkit-flex-flow: row nowrap;');
                    _stylesArray.push('        flex-flow: row nowrap;');
                    _stylesArray.push('        -ms-flex-pack: justify;');
                    _stylesArray.push('        justify-content: space-between;');
                    _stylesArray.push('        font-weight: bold;');
                    _stylesArray.push('        font-size: .75rem;');
                    _stylesArray.push('    }');

                    _stylesArray.push('    .autocomplete-results-item-' + _config.id + '.autocomplete-results-item-layout > header > aside {');
                    _stylesArray.push('        margin-right: 10px;');
                    _stylesArray.push('    }');

                    _stylesArray.push('    .autocomplete-results-item-' + _config.id + '.autocomplete-results-item-layout > section {');
                    _stylesArray.push('        font-size: .75rem;');
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
                    _stylesArray.push('    display: -ms-flexbox;');
                    _stylesArray.push('    display: flex;');
                    _stylesArray.push('    -ms-flex-pack: center;');
                    _stylesArray.push('    justify-content: center;');
                    _stylesArray.push('    -ms-flex-align: center !important;');
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
            var onempty = function() {
                selected = {
                    value: '',
                    text: '',
                    props: {}
                };
                if (!!_config.onselected) {
                    _config.onselected(selected);
                }
            }

            _input.addEvent(_config.event, function (e) {
                e = e || window.event;
                if (e.keyCode != 13 && e.keyCode != 27 && e.keyCode != 38 && e.keyCode != 40){
                    _exec.call(this);
                }
                else if (e.keyCode == 13 && _input.value.split(' ').join('') == ''){
                    onempty();
                }
            });

            _input.addEvent('blur', function(e) {
                if (_input.value.split(' ').join('') == '') {
                    onempty();
                }
            });

            Array.prototype.map.call(document.querySelectorAll('input, select, button, a'), function (_) {
                Sinco.extend(_).addEvent('focus', function () {
                    Sinco.map(Sinco.get('.autocomplete-container'), function (elem) {
                        if (!elem.id.endsWith(_config.id)) {
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

        Sinco.utilities.onClickValidations([{
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

    Sinco.utilities = Sinco.utilities || {};
    Sinco.utilities.autocomplete = autocomplete;
})(Sinco);