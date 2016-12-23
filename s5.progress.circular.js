(function (Sinco) {
    var name = 'circularProgress',
        defaults = {
            percentage: 100,
            circleColor: '#F2AC29',
            circleColorOver: '#F2AC29',
            circleBorder: '#FFF',
            ringStyle: 'percentage',
            ringColor: '#F2762E',
            ringColorOver: '#F90',
            ringBackground: '#CCC',
            labelColor: '#FFF',
            labelSize: 55,
            displayValue: true,
            displayUnit: '%',
            drawShadow: false,
            dimension: 50,
            label: '',
            size: 'medium'
        },
        SIZE = {
            'medium': 0.7,
            'small': 0.4,
            'big': 0.85
        },
        radConst = Math.PI / 180,
        fullCircle = 2 * Math.PI;

    var circularProgress = function (options, target) {
        this.element = Sinco.createElem('canvas');
        var _new = {};
        Sinco.extend(_new, defaults);
        Sinco.extend(_new, options);
        this.options = _new;
        this._defaults = defaults;
        this._name = name;

        this.element.attribute('width', _new.dimension);
        this.element.attribute('height', _new.dimension);

        this.init();

        var _this = this,
            element = this.element;

        element.onmousemove = function (e) {
            var ctx = element.getContext('2d');
            ctx.clearRect(0, 0, _this.points.width, _this.points.width);
            _this.init({ ring: _this.options.ringColorOver, circle: _this.options.circleColorOver });
        }

        element.onmouseout = function (e) {
            var ctx = element.getContext('2d');
            ctx.clearRect(0, 0, _this.points.width, _this.points.width);
            _this.init();
        }

        if (target){
            if (typeof target == 'string'){
                Sinco.get(target).insert(this.element);
            }
            else{
                Sinco.extend(target).insert(this.element);
            }
        }

        return this.element;
    }

    circularProgress.prototype = {
        init: function (color){
            if(this.checkCanvas()) {
                this.context = this.element.getContext('2d');
                this.percentage = this.options.percentage * 3.6;
                this.points = this.getPoints();
                Sinco.utilities.addStyles(this.element, {'width': this.points.width + 'px', 'height': this.points.width + 'px'});
                this.linesAndRadiuses = this.getLinesAndRadiuses();
                if(this.options.percentage > 0) {
                    this.drawPercentage((color || { ring: null }).ring);
                }
                if(this.options.ringStyle === 'full' && this.percentage !== 360) {
                    this.drawExtraPercentage();
                }
                this.drawInternalCircle((color || { circle: null }).circle);
                if(this.options.drawShadow) {
                    this.drawShadow();
                }
                if(this.options.image) {
                    this.drawImage();
                } else {
                    this.drawText();
                }
            }
        },
        checkCanvas: function () {
            return !!(this.element.getContext && this.element.getContext('2d'));
        },
        drawInternalCircle: function (color) {
            this.context.beginPath();
            this.context.moveTo(this.points.x, this.points.x);
            this.context.arc(this.points.x, this.points.x, this.linesAndRadiuses.internalRadius, 0, fullCircle, false);
            this.context.fillStyle = color || this.options.circleColor;
            this.context.lineWidth = this.linesAndRadiuses.internalLine;
            this.context.closePath();
            this.context.strokeStyle = this.options.circleBorder;
            this.context.stroke();
            this.context.fill();
        },
        drawPercentage: function (color) {
            var _this = this;
            this.context.beginPath();
            this.context.moveTo(this.points.x, this.points.x);
            this.context.arc(this.points.x, this.points.x, this.linesAndRadiuses.externalRadius, this.points.angle.start, this.points.angle.end, false);
            this.context.closePath();
            this.context.fillStyle = color || this.options.ringColor;
            this.context.fill();
        },
        drawExtraPercentage: function () {
            this.context.beginPath();
            this.context.moveTo(this.points.x, this.points.x);
            this.context.arc(this.points.x, this.points.x, this.linesAndRadiuses.externalRadius, this.points.angle.start, this.points.angle.end, true);
            this.context.closePath();
            this.context.fillStyle = this.options.ringBackground;
            this.context.fill();
        },
        drawShadow: function () {
            this.context.beginPath();
            this.context.arc(this.points.x, this.points.x, this.linesAndRadiuses.shadowRadius, 0, fullCircle, false);
            this.context.shadowColor = '#cbcbcb';
            this.context.lineWidth = this.linesAndRadiuses.shadowLine;
            this.context.strokeStyle = 'rgba(255,255,255, 0.3)';
            this.context.stroke();
        },
        drawImage: function () {
            var max = (this.linesAndRadiuses.internalRadius-this.linesAndRadiuses.internalLine) * Math.sqrt(2),
                img = new Image(),
                iw,
                ih,
                ratio,
                _this = this;
            img.src = this.options.image;
            img.onload = function() {
                ratio = img.height/img.width;
                if (img.width > max && ratio <= 1) {
                    iw = max;
                    ih = Math.round(iw*ratio);
                } else if (img.height > max) {
                    ih = max;
                    iw = Math.round(ih / ratio);
                } else {
                    iw = ih = max;
                }
                _this.context.drawImage(img, (_this.points.width-iw)/2, (_this.points.width-ih)/2, iw, ih);
            };
        },
        drawText: function () {
            var fontPx,
                y;
            this.context.textAlign = 'center';
            this.context.fillStyle = this.options.labelColor;
            this.context.textBaseline = 'middle';
            y = this.options.dimension / 2;

            if(this.options.displayValue) {
                if (this.options.label && this.options.label.length > 0) {
                    fontPx = (55 * this.options.dimension) / 200;
                    fontPx = (this.options.labelSize / 55) * fontPx;
                    fontPx = (SIZE[this.options.size] * fontPx) / 0.7;

                    this.context.font = 'bold ' + fontPx + 'px helvetica';
                    this.context.fillText(this.options.label, this.points.x, y - (fontPx / 2));

                    this.context.font = 'bold ' + fontPx + 'px helvetica';
                    this.context.fillText(this.options.percentage + this.options.displayUnit, this.points.x, y + (fontPx / 2));
                } 
                else {
                    fontPx = (50 * this.options.dimension) / 200;
                    fontPx = (SIZE[this.options.size] * fontPx) / 0.7;

                    this.context.font = 'bold ' + fontPx + 'px helvetica';
                    this.context.fillText(this.options.percentage + this.options.displayUnit, this.points.x, y);
                }
            } 
            else if (this.options.label && this.options.label.length > 0) {
                fontPx = (50 * this.options.dimension) / 200;
                fontPx = (SIZE[this.options.size] * fontPx) / 0.7;

                this.context.font = 'bold ' + fontPx + 'px helvetica';
                this.context.fillText(this.options.label, this.points.x, y);
            }
        },
        getPoints: function () {
            return {
                width: this.element.width,
                x: this.element.width / 2,
                angle: {
                    start: (this.percentage === 360) ? 0 : 270 * radConst,
                    end: (this.percentage === 360) ? fullCircle : (this.percentage - 90) * radConst
                }
            };
        },
        getLinesAndRadiuses: function () {
            var shadowLine = this.points.width / 30,
                shadowRadius = this.points.x - shadowLine / 2,
                externalRadius = shadowRadius,
                internalLine = this.points.width / 35,
                internalRadius = externalRadius * SIZE[this.options.size];
            return {
                shadowLine: shadowLine,
                shadowRadius: shadowRadius,
                externalRadius: externalRadius,
                internalLine: internalLine,
                internalRadius: internalRadius
            };
        }
    };

    Sinco.utilities.circularProgress = circularProgress;
})(Sinco);