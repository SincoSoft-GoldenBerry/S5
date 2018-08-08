(function (Sinco) {

    var container,
        dimensions,
        elements,
        elementsCount,
        buttonsElements = [];

    var controls = {
        dotsContainer: null,
        prevContainer: null,
        nextContainer: null,
        btnPrev: null,
        btnNext: null
    };

    var index = 0,
        start = true,
        interval;

    var carousel = function (_container, timer) {
        if (typeof _container == 'string') {
            container = Sinco.get(_container);
        }
        else {
            container = Sinco.extend(_container);
        }
        timeInterval = timer || 10;
        container.classList.add('carousel-container');
        dimensions = container.getBoundingClientRect();

        registerStyles();

        registerConfigurations();
    }

    var registerStyles = function () {
        if (!Sinco.get('carousel-styles')) {
            var definitions = [];

            definitions.push('.carousel-container {');
            definitions.push('      display: -ms-flexbox;');
            definitions.push('      display: flex;');
            definitions.push('      flex-flow: row nowrap;');
            definitions.push('      -ms-flex-pack: start;');
            definitions.push('      justify-content: flex-start;');
            definitions.push('      -ms-flex-align: center;');
            definitions.push('      align-items: center;');
            definitions.push('      position: relative;');
            definitions.push('}');

            definitions.push('.carousel-dots-container {');
            definitions.push('      display: -ms-flexbox;');
            definitions.push('      display: flex;');
            definitions.push('      -ms-flex-pack: center;');
            definitions.push('      justify-content: center;');
            definitions.push('      -ms-flex-align: center;');
            definitions.push('      align-items: center;');
            definitions.push('      position: absolute;');
            definitions.push('      bottom: 0;');
            definitions.push('      left: 0;');
            definitions.push('      height: 20px;');
            definitions.push('      width: 100%;');
            definitions.push('}');

            definitions.push('.carousel-prevnext-buttons-container {');
            definitions.push('      width: 20px;');
            definitions.push('      top: 0;');
            definitions.push('      bottom: 0;');
            definitions.push('      position: absolute;');
            definitions.push('      display: -ms-flexbox;');
            definitions.push('      display: flex;');
            definitions.push('      -ms-flex-pack: center;');
            definitions.push('      justify-content: center;');
            definitions.push('      -ms-flex-align: center;');
            definitions.push('      align-items: center;');
            definitions.push('}');

            definitions.push('.carousel-prevnext-buttons-container.left {');
            definitions.push('      left: 0;');
            definitions.push('}');

            definitions.push('.carousel-prevnext-buttons-container.right {');
            definitions.push('      right: 0;');
            definitions.push('}');

            definitions.push('.carousel-button {');
            definitions.push('      padding: 0 !important;');
            definitions.push('      border: none !important;');
            definitions.push('      background-color: transparent !important;');
            definitions.push('}');

            definitions.push('.carousel-prevnext-button {');
            definitions.push('      padding: 0 4px !important;');
            definitions.push('      height: 100% !important;');
            definitions.push('}');

            definitions.push('.carousel-prevnext-button.left > svg {');
            definitions.push('      -moz-transform: rotate(180deg);');
            definitions.push('      -ms-transform: rotate(180deg);');
            definitions.push('      -o-transform: rotate(180deg);');
            definitions.push('      -webkit-transform: rotate(180deg);');
            definitions.push('      transform: rotate(180deg);');
            definitions.push('}');

            definitions.push('.carousel-element {');
            definitions.push('      overflow-y: auto;');
            definitions.push('      padding: 0 40px;');
            definitions.push('}');

            definitions.push('.carousel-invisible-element {');
            definitions.push('      display: none;');
            definitions.push('}');

            definitions.push('.carousel-button-news > svg > circle {');
            definitions.push('      fill: #68A6E0 !important;');
            definitions.push('}');

            definitions.push('.carousel-button-news.selected > svg > circle {');
            definitions.push('      fill: #1B344C !important;');
            definitions.push('      stroke: #1B344C !important;');
            definitions.push('}');

            definitions.push('.carousel-button-news {');
            definitions.push('      padding: 0 2px !important;');
            definitions.push('}');

            var style = Sinco.createElem('style', { 'id': 'carousel-styles' });
            style.innerHTML = definitions.join('\n');
            document.head.appendChild(style);
        }
    }

    var triangulo = function (dim, bgColor) {
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

        dim = dim || 8;
        bgColor = bgColor || '#1B344C';

        var _svg = ce('svg');
        _svg.attr('width', dim / 2);
        _svg.attr('height', dim);

        _svg.attr('viewBox', '0 0 4 8');

        var _poly = ce('polygon');
        _poly.style.fill = bgColor;
        _poly.attr('points', '0,0 4,4 0,8');
        _svg.appendChild(_poly);

        return Sinco.extend(_svg);
    }

    var getElements = function () {
        elements = [].map.call(container.children, function (e) { return e;});
        elementsCount = elements.length;
    }

    var createControls = function () {
        controls.dotsContainer = Sinco.createElem('div', { 'class': 'carousel-dots-container' });
        controls.prevContainer = Sinco.createElem('div', { 'class': 'carousel-prevnext-buttons-container left' });
        controls.nextContainer = Sinco.createElem('div', { 'class': 'carousel-prevnext-buttons-container right' });
        controls.btnPrev = Sinco.createElem('button', { 'class': 'carousel-button carousel-prevnext-button left', 'title': 'Anterior' }).insert(triangulo(10, '#1B344C'));
        controls.btnNext = Sinco.createElem('button', { 'class': 'carousel-button carousel-prevnext-button right', 'title': 'Siguiente' }).insert(triangulo(10, '#1B344C'));

        controls.prevContainer.insert(controls.btnPrev);
        controls.nextContainer.insert(controls.btnNext);

        container.insert([
            controls.dotsContainer,
            controls.prevContainer,
            controls.nextContainer
        ]);
    }

    var addEvents = function () {
        controls.btnPrev.addEvent('click', function () {
            index--;
            setElement();
            start = false;
            startInterval();
            start = true;
            startInterval();
        });

        controls.btnNext.addEvent('click', function () {
            index++;
            setElement();
            start = false;
            startInterval();
            start = true;
            startInterval();
        });
    }

    var setElement = function () {
        if (index < 0) {
            index = elementsCount - 1;
        }
        else if (index == elementsCount) {
            index = 0;
        }

        elements.forEach(function (e) {
            e.classList.add('carousel-invisible-element');
        });

        buttonsElements.forEach(function (e) {
            e.classList.remove('selected');
        });

        elements[index].classList.remove('carousel-invisible-element');
        buttonsElements[index].classList.add('selected');
    }

    var startInterval = function () {
        if (start) {
            interval = setInterval(function () {
                index++;
                setElement();
            }, 1000 * timeInterval);
        }
        else {
            clearInterval(interval);
        }
    }

    var registerConfigurations = function () {
        getElements();
        if (elementsCount > 1) {
            createControls();
            addEvents();
            init();
        }
    }

    var init = function () {
        elements.forEach(function (e, i) {
            e.classList.add('carousel-element');
            e.index = i;

            var boton = Sinco.createElem('button', { 'class': 'carousel-button carousel-button-news' });
            boton.index = i;
            boton.insert(Sinco.iconos.Circulo(10, '#68A6E0'));

            if (i > 0) {
                e.classList.add('carousel-invisible-element');
            }
            else {
                boton.classList.add('selected');
            }

            boton.addEvent('click', function () {
                index = this.index;
                setElement();
                start = false;
                startInterval();
                start = true;
                startInterval();
            });

            controls.dotsContainer.insert(boton);
            buttonsElements.push(boton);
        });

        startInterval();
    }

    Sinco.utilities = Sinco.utilities || {};
    Sinco.utilities.Carousel = carousel;

})(Sinco);