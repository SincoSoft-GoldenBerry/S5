(function (Sinco) {

    var tour = function () {
        var finalizable = true;
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
            recuadro: null,
            progressbar: null,
            progressbartext: null
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
                throw new SincoInitializationError('¡El paso no puede ser null o undefined!');
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
                else if (a instanceof Object && a.content) {
                    addStep(a);
                }
                else if (typeof a == 'boolean') {
                    finalizable = a;
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
            _container.content.body = Sinco.createElem('section', { 'id': 'tour-content-body' });
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

            _container.progressbar = Sinco.createElem('div', { 'class': 'tour-progressbar' });
            _container.progressbartext = Sinco.createElem('div', { 'class': 'tour-progressbar-text' });

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

            if (finalizable === true) {
                _container.content.element.insert([
                    _container.content.title.element,
                    Sinco.createElem('aside', { 'class': 'tour-progressbar-container' }).insert(_container.progressbar),
                    _container.progressbartext,
                    _container.content.body,
                    Sinco.createElem('footer').insert([
                        _container.content.buttonFinish,
                        _container.content.buttonPrev,
                        _container.content.buttonNext,
                        _container.content.buttonExit
                    ])
                ]);
            }
            else {
                _container.content.element.insert([
                    _container.content.title.element,
                    Sinco.createElem('aside', { 'class': 'tour-progressbar-container' }).insert(_container.progressbar),
                    _container.progressbartext,
                    _container.content.body,
                    Sinco.createElem('footer').insert([
                        _container.content.buttonPrev,
                        _container.content.buttonNext,
                        _container.content.buttonExit
                    ])
                ]);
            }

            body.insert(_container.content.element);

            if (!Sinco.get('tour-styles')) {

                var estilos = Sinco.createElem('style', { 'type': 'text/css', 'id': 'tour-styles' });
                var estArr = [];

                estArr.push('.tour-progressbar-container {');
                estArr.push('   padding: 0 8px;');
                estArr.push('   position: relative;');
                estArr.push('   height: 4px;');
                estArr.push('   background-color: #D8D8D8;');
                estArr.push('   border-radius: 2px;');
                estArr.push('   border: 1px solid #C3C2C2;');
                estArr.push('}');

                estArr.push('.tour-progressbar {');
                estArr.push('   position: absolute;');
                estArr.push('   left: 0;');
                estArr.push('   bottom: 0;');
                estArr.push('   top: 0;');
                estArr.push('   background-color: #1B344C;');
                estArr.push('   border-radius: 5px;');
                estArr.push('   border: 1px solid #1B344C;');
                estArr.push('}');

                estArr.push('.tour-progressbar-text {');
                estArr.push('   font-size: 0.5em;');
                estArr.push('   text-align: right;');
                estArr.push('   font-family: Verdana;');
                estArr.push('   font-weight: bold;');
                estArr.push('}');

                estArr.push('#tour-content {');
                estArr.push('   position: absolute;');
                estArr.push('   z-index: 16777271;');
                estArr.push('   background-color: #FFF;');
                estArr.push('   padding: 12px;');
                estArr.push('   min-width: 320px;');
                estArr.push('   display: -ms-flexbox;');
                estArr.push('   display: flex;');
                estArr.push('   -ms-flex-flow: column;');
                estArr.push('   -webkit-flex-flow: column;');
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
                estArr.push('   z-index: 16777260;');
                estArr.push('   background-color: rgba(255, 255, 255, 0.01);');
                estArr.push('}');

                estArr.push('#tour-content-header-icon {');
                estArr.push('   margin-right: 5px;');
                estArr.push('   display: -ms-flexbox;');
                estArr.push('   display: flex;');
                estArr.push('    -ms-flex-align: center;');
                estArr.push('   align-items: center;');
                estArr.push('}');

                estArr.push('#tour-content-header {');
                estArr.push('   padding: 7px;');
                estArr.push('   color: rgba(0, 0, 0, 0.87);');
                estArr.push('   border-radius: 2px;');
                estArr.push('   font-weight: bold;');
                estArr.push('   display: -ms-flexbox;');
                estArr.push('   display: flex;');
                estArr.push('    -ms-flex-align: center;');
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
                estArr.push('   z-index: 16777271;');
                estArr.push('}');

                estArr.push('#tour-content.mobile {');
                estArr.push('   top: inherit !important;');
                estArr.push('   width: inherit !important;');
                estArr.push('   left: 5px !important;');
                estArr.push('   right: 5px !important;');
                estArr.push('   bottom: 80px !important;');
                estArr.push('}');

                estArr.push('.tour-background {');
                estArr.push('   z-index: 16777270;');
                estArr.push('   position: fixed;');
                estArr.push('   background-color: rgba(68, 68, 68, 0.8);');
                estArr.push('}');
                estArr.push('.tour-frame {');
                estArr.push('   position: absolute;');
                estArr.push('   border: 1px solid #378fa9;');
                estArr.push('   z-index: 16777271;');
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

                estArr.push('#tour-content.modal-tour {');
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
                if (step.target && typeof step.target === 'function') {
                    step.target = step.target();
                }
                mostrarPaso();
                _container.progressbar.styles('width', (((i + 1) / _steps.length) * 100) + '%');
                _container.progressbartext.innerHTML = (i + 1) + ' de ' + _steps.length;
            }
        }

        var mostrarPaso = function () {
            var callBack = function () {
                var step = _steps[_index];

                if (!step.target || (typeof step.target == 'string' && step.target.split(' ').join('') === '')) {
                    mostrarDialogo(step);
                }
                else {
                    mostrarFondo(step);
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
                                        else if (!elem.stop) {
                                            _callee(elem, values);
                                        }
                                        else if (elem.stop) {
                                            elem.stop = false;
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

                if (_index == _steps.length - 1) {
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

                if (_steps.length == 1) {
                    _container.content.buttonPrev.styles('display', 'none');
                }
            }

            callBack();

            Sinco.removeEvent.call(window, 'resize', callBack);
            Sinco.addEvent.call(window, 'resize', callBack);
        }

        var mostrarDialogo = function (step) {
            _container.content.element.classList.add('modal-tour');
            _container.content.element.classList.remove('mobile');
            _container.content.element.removeAttribute('style');
            _container.content.element.styles('margin-left', 'calc(50% - ' + ((parseInt(step.content.width.replaceAll('px', '').replaceAll('%', '')) / 2) + 12) + 'px)');
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
            _container.content.element.classList.remove('modal-tour');

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

    window.Sinco.utilities = window.Sinco.utilities || {};
    window.Sinco.utilities.Tour = tour;
})(Sinco);