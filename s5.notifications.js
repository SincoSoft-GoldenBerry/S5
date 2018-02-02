/// <reference path="s5.js" />
/// <reference path="s5.icons.js" />

(function(Sinco){
    var arreglo = new Array();

    var exec = function () {
        var actual = arreglo[0];
        if (!!actual && !actual.ejecutando) {
            actual.ejecutando = true;

            (actual.onInit || function (){ })(actual._original);

            actual._timeOut = setTimeout(function () {
                actual.remover();
                arreglo.splice(arreglo.indexOf(actual), 1);
                if (arreglo.length > 0 && arreglo[0].loader){
                    arreglo[0].loader.classList.add('s5-notification-hide');
                }
                else{
                    delete window['running'];
                }
                exec();
            }, actual.duracion);
        }
    }

    var quitar = function () {
        if (typeof this.objeto.duracion === 'number') {
            if (this.objeto.ejecutando) {
                clearTimeout(this.objeto._timeOut);
                clearInterval(this.objeto._interval);
            }
            this.objeto.remover();
            arreglo.splice(arreglo.indexOf(this.objeto), 1);
            if (arreglo.length > 0 && arreglo[0].loader){
                arreglo[0].loader.classList.add('s5-notification-hide');
            }
            else{
                delete window['running'];
            }
            exec();
        }
        else
            this.objeto.remover();
    }

    var agregarEstilos = function(target){
        if (!Sinco.get('s5-notification-styles')){
            var estilos = Sinco.createElem('style', { 'type': 'text/css', 'id': 's5-notification-styles' });
            estilos.innerHTML = ' \
                .s5-notification-container { \
                    position: absolute; \
                    overflow: hidden; \
                    display: flex; \
                    flex-flow: column nowrap; \
                } \
                \
                    .s5-notification-container.top-right { \
                        top: 5px; \
                        right: 5px; \
                        -ms-flex-align: end; \
                        align-items: flex-end; \
                    } \
                    \
                    .s5-notification-container.top-left { \
                        top: 5px; \
                        left: 5px; \
                        -ms-flex-align: start; \
                        align-items: flex-start; \
                    } \
                    \
                    .s5-notification-container.bottom-right { \
                        right: 5px; \
                        bottom: 5px; \
                        -ms-flex-align: end; \
                        align-items: flex-end; \
                    } \
                    \
                    .s5-notification-container.bottom-left { \
                        bottom: 5px; \
                        left: 5px; \
                        -ms-flex-align: start; \
                        align-items: flex-start; \
                    } \
                    \
                    .s5-notification-container.top-center { \
                        top: 5px; \
                        left: 0; \
                        right: 0; \
                        margin: 0 auto; \
                    } \
                    \
                    .s5-notification-container.bottom-center { \
                        bottom: 5px; \
                        left: 0; \
                        right: 0; \
                        margin: 0 auto; \
                    } \
                \
                .s5-notification-container .s5-notification { \
                    margin: 5px; \
                    color: #484747; \
                    display: -ms-flexbox; \
                    display: flex; \
                    position: relative; \
                } \
                \
                    .s5-notification-container.top-right .s5-notification, \
                    .s5-notification-container.bottom-right .s5-notification { \
                        -ms-flex-pack: end; \
                        justify-content: flex-end; \
                    } \
                    \
                    .s5-notification-container.top-left .s5-notification, \
                    .s5-notification-container.bottom-left .s5-notification { \
                        -ms-flex-pack: start; \
                        justify-content: flex-start; \
                    } \
                    \
                    .s5-notification-container.top-center .s5-notification, \
                    .s5-notification-container.bottom-center .s5-notification { \
                        -ms-flex-pack: center; \
                        justify-content: center; \
                        margin: 0 auto; \
                    } \
                    \
                    .s5-notification-container .s5-notification > div { \
                        background-color: white; \
                        border: none; \
                        -moz-border-radius: 3px; \
                        -webkit-border-radius: 3px; \
                        border-radius: 3px; \
                        display: -ms-flexbox; \
                        display: flex; \
                        -ms-flex-flow: column nowrap; \
                        -webkit-flex-flow: column nowrap; \
                        flex-flow: row nowrap; \
                        -ms-flex-pack: justify; \
                        justify-content: space-between; \
                        color: #FFFFFF; \
                        opacity: .9; \
                        position: relative; \
                        cursor: pointer; \
                        -moz-box-shadow: 0 0 12px #999999; \
                        -webkit-box-shadow: 0 0 12px #999999; \
                        box-shadow: 0 0 12px #999999; \
                        opacity: 0.8; \
                        -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=80); \
                        filter: alpha(opacity=80); \
                    } \
                    \
                        .s5-notification-container .s5-notification > div:hover { \
                            -moz-box-shadow: 0 0 12px #000000; \
                            -webkit-box-shadow: 0 0 12px #000000; \
                            box-shadow: 0 0 12px #000000; \
                            opacity: 1; \
                            -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100); \
                            filter: alpha(opacity=100); \
                        } \
                    \
                    .s5-notification-container .s5-notification.error > div { \
                        background-color: #e23e3e; \
                    } \
                    \
                    .s5-notification-container .s5-notification.warning > div { \
                        background-color: #ffaf34; \
                    } \
                    \
                    .s5-notification-container .s5-notification.success > div { \
                        background-color: #70bb46; \
                    } \
                    \
                    .s5-notification-container .s5-notification.info > div { \
                        background-color: #67a7cc; \
                    } \
                \
                .s5-notification-container .s5-notification .s5-notification-close { \
                    position: absolute; \
                    cursor: pointer; \
                    right: 5px; \
                    top: 5px; \
                    height: 12px; \
                    width: 12px; \
                    display: flex; \
                    align-items: center; \
                    justify-content: center; \
                    transform: rotate(45deg); \
                } \
                \
                .s5-notification-container .s5-notification .s5-notification-text { \
                    display: -ms-flexbox; \
                    display: flex; \
                    -ms-flex-direction: row; \
                    flex-flow: row; \
                    -ms-flex-align: center; \
                    align-items: center; \
                } \
                \
                .s5-notification-container .s5-notification .s5-notification-title { \
                    display: -ms-flexbox; \
                    display: flex; \
                    -ms-flex-direction: row; \
                    flex-flow: row; \
                    -ms-flex-align: center; \
                    align-items: center; \
                    font-weight: bold; \
                    font-size: 1.1em; \
                    margin-bottom: 5px; \
                } \
                \
                .s5-notification-container .s5-notification .s5-notification-central { \
                    display: -ms-flexbox; \
                    display: flex; \
                    -ms-flex-flow: column nowrap; \
                    -webkit-flex-flow: column nowrap; \
                    flex-flow: column nowrap; \
                    -ms-flex-pack: end; \
                    -webkit-justify-content: flex-end; \
                    justify-content: flex-end; \
                    padding: 20px 25px 20px 0; \
                } \
                \
                    .s5-notification-container .s5-notification .s5-notification-central.no-icon { \
                        padding: 20px 25px; \
                    } \
                \
                .s5-notification-container .s5-notification .s5-notification-icon { \
                    display: flex; \
                    align-items: center; \
                    justify-content: center; \
                    width: 50px; \
                } \
                \
                .s5-notification-container .s5-notification .s5-notification-loader { \
                    position: absolute; \
                    height: 5px; \
                    bottom: 0; \
                    width: 100%; \
                    -moz-border-radius: 3px; \
                    -webkit-border-radius: 3px; \
                    border-radius: 3px; \
                } \
                \
                    .s5-notification-container .s5-notification .s5-notification-loader.s5-notification-hide { \
                        width: 0%; \
                    } \
                    \
                    .s5-notification-container .s5-notification.error > div .s5-notification-loader { \
                        background-color: #c30000; \
                    } \
                    \
                    .s5-notification-container .s5-notification.warning > div .s5-notification-loader { \
                        background-color: #d27115; \
                    } \
                    \
                    .s5-notification-container .s5-notification.success > div .s5-notification-loader { \
                        background-color: #5c9040; \
                    } \
                    \
                    .s5-notification-container .s5-notification.info > div .s5-notification-loader { \
                        background-color: #23719e; \
                    } \
            ';
            document.head.appendChild(estilos);
        }
        if (Sinco.get('s5-notification-container')){
            contenedorNotificaciones = Sinco.get('s5-notification-container');
        }
        else{
            contenedorNotificaciones = Sinco.createElem('section', { id: 's5-notification-container', class: 's5-notification-container' });
            target.appendChild(contenedorNotificaciones);
        }
        contenedorNotificaciones.indices = contenedorNotificaciones.indices || 16777271;
    }

    var contenedorNotificaciones;

    var notificar = function (opciones) {
        var config = {
            type: 'info',
            message: '!!Info',
            timeOut: null,
            title: '',
            onInit: null,
            onSuccess: null,
            showIcon: true,
            showLoader: false,
            width: 300,
            queue: true,
            position: 'top-right',
            target: document.body
        }

        Sinco.extend(config, opciones);

        agregarEstilos(config.target);

        if ((window['s5-not-w'] || 0) - 10 < config.width){
            window['s5-not-w'] = config.width + 10;
        }

        var id = 'notificacion-' + (new Date().getTime());

        var objeto = {
            id: id,
            ejecutando: false,
            duracion: config.timeOut,
            indice: arreglo.length,
            onInit: config.onInit,
            onSuccess: config.onSuccess,
            showLoader: config.showLoader,
            loader: null,
            queue: config.queue,
            _original: config,
            remover: function () {
                var elem = document.getElementById(this.id);

                if (!!elem) {
                    var _heightMax = this.height;
                    var contador = 5;
                    var indice = this.indice;
                    (this.onSuccess || function (){ })(this._original);
                    var inte = setInterval(function () {
                        if (config.position == 'top-right' || config.position == 'top-left' || config.position == 'top-center')
                            elem.style.marginTop = contador + 'px';
                        else
                            elem.style.marginBottom = contador + 'px';

                        if (contador <= _heightMax) {
                            clearInterval(inte);
                            try{
                                elem.parentNode.removeChild(elem);
                            }
                            catch (e) { }
                            return;
                        }
                        contador--;
                    }, 10);
                }
            }
        }

        var notificacion = Sinco.createElem('div', { id: id, class: 's5-notification' });
        notificacion.classList.add(config.type);
        notificacion.styles('max-width', config.width + 'px');

        var contenedor = Sinco.createElem('div');

        var contenedorCerrar = Sinco.createElem('div', { class: 's5-notification-close' });
        contenedorCerrar.insert(Sinco.iconos.Plus(12, '#FFFFFF'));
        contenedorCerrar.objeto = objeto;
        contenedorCerrar.indice = arreglo.length;
        contenedorCerrar.addEvent('click', quitar);
        contenedorCerrar.styles('visibility', 'hidden');
        contenedor.insert(contenedorCerrar);

        if (!!config.showIcon){
            var contenedorIcono = Sinco.createElem('div', { class: 's5-notification-icon' });
            switch(config.type){
                case 'info':
                    contenedorIcono.insert(Sinco.iconos.Info(25, '#23719e'));
                    break;
                case 'error':
                    contenedorIcono.insert(Sinco.iconos.Warning(25, '#c30000'));
                    break;
                case 'warning':
                    contenedorIcono.insert(Sinco.iconos.Advertisement(25, '#d27115'));
                    break;
                case 'success':
                    contenedorIcono.insert(Sinco.iconos.Ok(22, '#5c9040'));
                    break;
            }
            contenedor.insert(contenedorIcono);
        }

        var contenedorCentral = Sinco.createElem('div', { class: 's5-notification-central' });
        if (!config.showIcon){
            contenedorCentral.classList.add('no-icon');
        }
        contenedor.insert(contenedorCentral);

        var contenedorTitulo = Sinco.createElem('div', { class: 's5-notification-title' });
        if (typeof config.title === 'string')
            contenedorTitulo.innerHTML = config.title;
        else
            contenedorTitulo.insert(config.title);
        if (config.title !== '')
            contenedorCentral.insert(contenedorTitulo);

        var contenedorTexto = Sinco.createElem('div', { class: 's5-notification-text' });
        if (typeof config.message === 'string')
            contenedorTexto.innerHTML = config.message;
        else
            contenedorTexto.insert(config.message);
        contenedorCentral.insert(contenedorTexto);

        notificacion.insert(contenedor);
        contenedorNotificaciones.insert(notificacion);
        contenedorNotificaciones.className = 's5-notification-container';
        contenedorNotificaciones.classList.add(config.position);
        contenedorNotificaciones.styles('margin-top', 'inherit');

        var _height = -notificacion.offsetHeight;
        objeto.height = _height;
        if (config.position == 'top-right' || config.position == 'top-left' || config.position == 'top-center') {
            notificacion.style.marginTop = _height + 'px';
            notificacion.style.zIndex = contenedorNotificaciones.indices--;
        }
        else
            notificacion.style.marginBottom = _height + 'px';

        var loader;

        if (typeof objeto.duracion === 'number') {
            if (!!config.showLoader) {
                loader = Sinco.createElem('aside', { 'class': 's5-notification-loader' });
                loader.styles('transition', 'width ' + objeto.duracion + 'ms');
                contenedor.insert(loader);
                objeto.loader = loader;
            }
        }

        var inte = setInterval(function () {
            if (config.position == 'top-right' || config.position == 'top-left' || config.position == 'top-center')
                notificacion.style.marginTop = _height + 'px';
            else
                notificacion.style.marginBottom = _height + 'px';

            if (_height === 5) {
                contenedorCerrar.style.visibility = 'visible';
                contenedorNotificaciones.dispatch('view-end');
                if (loader){
                    if (!!objeto.queue && !window['running']){
                        window['running'] = true;
                        loader.classList.add('s5-notification-hide');
                    }
                    else if (!objeto.queue){
                        loader.classList.add('s5-notification-hide');
                    }
                }
                contenedorNotificaciones.styles('max-width', window['s5-not-w'] + 'px');
                clearInterval(inte);
                return;
            }
            _height++;
        }, 10);

        if (typeof objeto.duracion === 'number') {

            if (!!objeto.queue){
                arreglo.push(objeto);

                if (arreglo.length === 1) {
                    contenedorNotificaciones.styles('max-width', window['s5-not-w'] + 'px');
                    exec();
                }
            }
            else{
                (objeto.onInit || function (){ })(objeto._original);
                objeto._timeOut = setTimeout(function () {
                    objeto.remover();
                }, objeto.duracion);
            }
        }
        else{
            (objeto.onInit || function (){ })(objeto._original);
        }

        return objeto;
    }

    Sinco.utilities = Sinco.utilities || {};
    Sinco.utilities.notify = notificar;
})(Sinco);