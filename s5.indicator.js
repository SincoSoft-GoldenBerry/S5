(function (Sinco) {
	'use strict';

	var config = {
		size: {
			height: 200,
			width: 200
		},
		label: '',
		labelSize: '12px',
		labelColor: '#FFFFFF'
	};

	var indicator = function (target, options) {

		if (target)
            this.element = typeof (target) === 'string' ? Sinco.get(target) : Sinco.extend(target);

        if (!target)
        	throw new SincoInitializationError('¡Indicator requiere un target para funcionar!');

        if (target.nodeName.toLowerCase() !== 'canvas')
    		throw new SincoInitializationError('¡Indicator requiere un target de tipo canvas para funcionar!');

    	this._defaults = config;
    	this.options = _indicatorExtendProps({}, options);

    	manageEvents.call(this);

	}

	var manageEvents = function () {
		var _this = this;

        this.element.addEvent .onmousemove = function (e) {
            var ctx = element.getContext('2d');
            ctx.clearRect(0, 0, _this.points.width, _this.points.width);
            _this.init({ ring: _this.options.ringColorOver, circle: _this.options.circleColorOver });
        }

        this.element.onmouseout = function (e) {
            var ctx = element.getContext('2d');
            ctx.clearRect(0, 0, _this.points.width, _this.points.width);
            _this.init();
        }
	}

	var _indicatorExtendProps = function (el, opt) {
        for (var n in opt) {
            if (el[n] !== null && typeof el[n] == 'object' && !(el[n] instanceof Array))
                _indicatorExtendProps(el[n], opt[n]);
            else
                el[n] = opt[n];
        }
        return el;
    }

    var inicializeCanvas = function (canvas) {
    	canvas
    }

    Sinco.utilities = Sinco.utilities || {};
    Sinco.utilities.Indicator = function (target, options) {
    	return new indicator(target, options);
    };
})(Sinco);