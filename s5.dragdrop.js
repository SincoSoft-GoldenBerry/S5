(function (Sinco) {

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
            _element.style.position = 'absolute';
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

    Sinco.utilities = Sinco.utilities || {};
    Sinco.utilities.dragDrop = dragDrop;
})(Sinco);