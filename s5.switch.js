/// <reference path="s5.js" />
/// <reference path="s5.icons.js" />

(function (Sinco) {

    var _switch = function(element, options) {
        var _input,
            _isChecked,
            _isDisabled,
            _parent;

        var _options = {
            textOn: 'Si',
            textOff: 'No',
            size: 'normal',
            onColor: 'primary', //primary,info,success,warning,default
            offColor: 'default', //primary,info,success,warning,default
            onchange: function () { },
            isChecked: function () { }
        };

        if (element)
            _input = typeof (element) === 'string' ? Sinco.get(element) : Sinco.extend(element);

        if (!_input || _input.type !== 'checkbox')
            throw new SincoInitializationError('¡Switch requiere un input type checkbox para funcionar!');

        _isChecked = _input.checked;
        _isDisabled = _input.disabled;
        _parent = Sinco.extend(_input.parentNode);
        _options = Sinco.extend(_options, options || {});
        _options.isChecked = function () { return _isChecked; };

        var agregarEstilos = function() {
            if (!Sinco.get('s5-switch-styles')){
                var estilos = Sinco.createElem('style', { 'type': 'text/css', 'id': 's5-switch-styles' });
                estilos.innerHTML = ' \
                    .s5-switch { \
                        position: relative; \
                        border: 1px solid #e6e6e6; \
                        display: flex; \
                        flex-flow: row nowrap; \
                        border-radius: 5px; \
                        overflow: hidden; \
                        cursor: pointer; \
                        font-family: "Helvetica Neue",Helvetica,Arial,sans-serif; \
                        font-size: 14px; \
                    } \
                    \
                    .s5-switch.disabled { \
                        opacity: .7; \
                        cursor: default !important; \
                    } \
                    \
                        .s5-switch.small { \
                            width: 40px; \
                            height: 15px; \
                        } \
                        \
                        .s5-switch.normal { \
                            width: 60px; \
                            height: 25px; \
                        } \
                        \
                        .s5-switch.large { \
                            width: 80px; \
                            height: 35px; \
                        } \
                        \
                    .s5-switch-hide { \
                        display: none !important; \
                    } \
                    \
                    .s5-switch-inner-container { \
                        position: relative; \
                        display: flex; \
                        flex-flow: row nowrap; \
                        -webkit-transition: margin-left 0.5s; \
                        -o-transition: margin-left 0.5s; \
                        transition: margin-left 0.5s; \
                    } \
                    \
                        .s5-switch.small .s5-switch-inner-container { \
                            font-size: .7em; \
                        } \
                        \
                        .s5-switch.normal .s5-switch-inner-container { \
                            height: 25px; \
                            width: 90px; \
                        } \
                        \
                        .s5-switch.large .s5-switch-inner-container { \
                            font-size: 1.3em; \
                        } \
                        \
                        .s5-switch.small .s5-switch-inner-container { \
                            height: 13px; \
                            width: 60px; \
                        } \
                        \
                        .s5-switch.large .s5-switch-inner-container { \
                            height: 34px; \
                            width: 120px; \
                        } \
                        \
                        .s5-switch-inner-container.s5-switch-on { \
                            margin-left: 0; \
                        } \
                        \
                        .s5-switch.small .s5-switch-inner-container.s5-switch-off { \
                            margin-left: -20px; \
                        } \
                        \
                        .s5-switch.normal .s5-switch-inner-container.s5-switch-off { \
                            margin-left: -30px; \
                        } \
                        \
                        .s5-switch.large .s5-switch-inner-container.s5-switch-off { \
                            margin-left: -40px; \
                        } \
                        \
                        .s5-switch-inner-container .s5-switch-on-off.primary { \
                            background-color: #337ab7; \
                            color: #f1f1f1; \
                        } \
                        \
                        .s5-switch-inner-container .s5-switch-on-off.default { \
                            background-color: #eeeeee; \
                            color: #4a4a4a; \
                        } \
                        \
                        .s5-switch-inner-container .s5-switch-on-off.info { \
                            background-color: #5bc0de; \
                            color: #f1f1f1; \
                        } \
                        \
                        .s5-switch-inner-container .s5-switch-on-off.success { \
                            background-color: #5cb85c; \
                            color: #f1f1f1; \
                        } \
                        \
                        .s5-switch-inner-container .s5-switch-on-off.warning { \
                            background-color: #f0ad4e; \
                            color: #ffffff; \
                        } \
                        \
                    .s5-switch-on-off, \
                    .s5-switch-middle { \
                        flex: 1 1 auto; \
                        display: flex; \
                        align-items: center; \
                        justify-content: center; \
                        /*padding: 5px;*/ \
                    } \
                    \
                    .s5-switch.small .s5-switch-on-off, \
                    .s5-switch.small .s5-switch-middle { \
                        width: 20px; \
                        min-width: 20px; \
                        padding: 2px; \
                    } \
                    \
                    .s5-switch.normal .s5-switch-on-off, \
                    .s5-switch.normal .s5-switch-middle { \
                        width: 30px; \
                        min-width: 30px; \
                    } \
                    \
                    .s5-switch.large .s5-switch-on-off, \
                    .s5-switch.large .s5-switch-middle { \
                        width: 40px; \
                        min-width: 40px; \
                    } \
                    \
                    .s5-switch-middle { \
                        background-color: #dadada; \
                    } \
                ';
                document.head.appendChild(estilos);
            }
        }

        var crearElementos = function(){

            var cambiarOnOff = function(){
                if (_isChecked){
                    innerContainer.classList.add('s5-switch-on');
                    innerContainer.classList.remove('s5-switch-off');
                }
                else{
                    innerContainer.classList.add('s5-switch-off');
                    innerContainer.classList.remove('s5-switch-on');
                }
            }

            var cambiarDisabled = function(){
                if (_isDisabled)
                    contenedor.classList.add('disabled');
                else
                    contenedor.classList.remove('disabled');
            }

            _input.classList.add('s5-switch-hide');

            var contenedor = Sinco.createElem('aside', { 'class': 's5-switch' });
            cambiarDisabled();
            contenedor.classList.add(_options.size);

            Sinco.watch(_input, 'disabled', function(prop, oldValue, newValue){
                _isDisabled = newValue;
                cambiarDisabled();
            });

            Sinco.watch(_input, 'checked', function(prop, oldValue, newValue){
                _isChecked = newValue;
                cambiarOnOff();
            });

            var on = Sinco.createElem('div', { 'class': 's5-switch-on-off' });
            on.classList.add(_options.onColor);
            on.insert(document.createTextNode(_options.textOn));

            var middle = Sinco.createElem('div', { 'class': 's5-switch-middle' });

            var off = Sinco.createElem('div', { 'class': 's5-switch-on-off' });
            off.classList.add(_options.offColor);
            off.insert(document.createTextNode(_options.textOff));

            var innerContainer = Sinco.createElem('div', { 'class': 's5-switch-inner-container' });

            contenedor.insert(innerContainer.insert([
                on,
                middle,
                off
            ]));

            cambiarOnOff();

            _parent.insert(contenedor);

            contenedor.addEvent('click', function(){
                if (!_isDisabled){
                    _isChecked = !_isChecked;
                    cambiarOnOff();
                    _input.checked = _isChecked;
                    _options.onchange();
                }
            });
        }

        agregarEstilos();
        crearElementos();

        _input.isChecked = function(){
            return _isChecked;
        }

        return _input;
    }

    window.Sinco.utilities = window.Sinco.utilities || {};
    window.Sinco.utilities.switch = _switch;

})(Sinco);