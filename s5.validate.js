;(function(defaults, Sinco, window, undefined) {

	const type = { 
		input: ['color', 'date', 'datetime', 'datetime-local', 'email', 'file', 'hidden', 'month', 'number', 'password', 'range', 'search', 'tel', 'text', 'time', 'url', 'week'], 
		others: ['select', 'textarea'],
		checks: ['radio', 'checkbox']
	};

	const extend = {};

	const isPlainObject = function (o) {
	  return !!o 
	  	&& typeof o === 'object'
	  	&& Object.prototype.toString.call(o) === '[object Object]';
	}

	const isFunction = function (functionToCheck) {
	 var getType = {};
	 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
	}

	const validarCampo = function(event, options) {
		var estado = {
			pattern : true,
			conditional : true,
			required : true
		};
		var campo = Sinco.extend(this);
		var valorCampo = campo.value || '';
		var validacionCampo = campo.attribute('validate');
		var validacion = validacionCampo !== undefined ? extend[validacionCampo] : {};
		var prepareCampo = campo.attribute('prepare') || validacion.prepare;
		var patronCampo = (campo.attribute('pattern') || (validacion.pattern instanceof RegExp ? validacion.pattern : /(?:)/));
		var ignorarCampo = campo.attribute('data-ignore-case') || campo.attribute('ignoreCase') || validacion.ignoreCase;
		var mascaraCampo = campo.attribute('mask') || validacion.mask;
		var condicionalCampo = campo.attribute('conditional') || validacion.conditional;
		var requeridoCampo = campo.attribute('required');
		var descritoPorCampo = campo.attribute('describedby') || validacion.describedby;
		var descripcionCampo = campo.attribute('description') || validacion.description;
		var trimCampo = campo.attribute('trim');
		var reTrue = /^(true|)$/i;
		var reFalse = /^false$/i;
		var nombre = 'validate';

		descripcionCampo = isPlainObject(descripcionCampo) ? descripcionCampo : (options.description[descripcionCampo] || {});

		requeridoCampo = requeridoCampo != '' ? (requeridoCampo || !!validacion.required) : true;

		trimCampo = trimCampo != '' ? (trimCampo || !!validacion.trim) : true;

		if(reTrue.test(trimCampo)) {
			valorCampo = valorCampo.trim();
		}

		if(isFunction(prepareCampo)) {
			valorCampo = String(prepareCampo.call(campo, valorCampo));
		} 
		else {
			if(isFunction(options.prepare[prepareCampo])) {
				valorCampo = String(options.prepare[prepareCampo].call(campo, valorCampo));
			}
		}

		if(!(patronCampo instanceof RegExp)) {

			ignorarCampo = !reFalse.test(ignorarCampo);

			patronCampo = ignorarCampo ? RegExp(patronCampo, 'i') : RegExp(patronCampo);
		}

		if(condicionalCampo != undefined) {

			if(isFunction(condicionalCampo)) {

				estado.conditional = !!condicionalCampo.call(campo, valorCampo, options);
			} 
			else {

				var conditionals = condicionalCampo.split(/[\s\t]+/);

				// Each conditional
				for(var counter = 0, len = conditionals.length; counter < len; counter++) {

					if(options.conditional.hasOwnProperty(conditionals[counter]) && !options.conditional[conditionals[counter]].call(campo, valorCampo, options)) {

						estado.conditional = false;
					}
				}
			}
		}

		requeridoCampo = reTrue.test(requeridoCampo);

		// Is required?
		if(requeridoCampo) {
			if (
				!campo.type || 
				campo.type == '' || 
				type.others.filter(function(t){ return campo.type == t; }).length > 0 || 
				type.input.filter(function(t){ return campo.type == t; }).length > 0
			) {
				if(!valorCampo.length > 0) {
					estado.required = false;
				}
			}
			else if(type.checks.filter(function(t){ return campo.type == t; }).length > 0){
				if (campo.attribute('name')){
					if (document.querySelectorAll('[name="' + campo.attribute('name') + '"]:checked').length == 0){
						estado.required = false;
					}
				}
				else{
					estado.required = campo.checked;
				}
			}
		}

		if(type.input.filter(function(t){ return campo.type == t; }).length > 0) {
			if(patronCampo.test(valorCampo)) {

				if(event.type != 'keyup' && mascaraCampo !== undefined) {

					var matches = valorCampo.match(patronCampo);

					for(var i = 0, len = matches.length; i < len; i++) {
						mascaraCampo = mascaraCampo.replace(RegExp('\\$\\{' + i + '(?::`([^`]*)`)?\\}', 'g'), (matches[i] !== undefined ? matches[i] : '$1'));
					}

					mascaraCampo = mascaraCampo.replace(/\$\{\d+(?::`([^`]*)`)?\}/g, '$1');

					if(patronCampo.test(mascaraCampo)) {
						campo.value = mascaraCampo;
					}
				}
			} 
			else {
				if(requeridoCampo) {
					estado.pattern = false;
				} 
				else {
					if(valorCampo.length > 0) {
						estado.pattern = false;
					}
				}
			}
		}

		var descritoPor = Sinco.get(descritoPorCampo);
		var log = descripcionCampo.valid;

		if(descritoPor && event.type != 'keyup') {

			if(!estado.required) {
				log = descripcionCampo.required;
			} else if(!estado.pattern) {
				log = descripcionCampo.pattern;
			} else if(!estado.conditional) {
				log = descripcionCampo.conditional;
			}

			descritoPor.innerHTML = log || '';
		}

		if(typeof(validacion.each) == 'function') {
			validacion.each.call(campo, event, estado, options);
		}

		// Call the eachField callback
		options.eachField.call(campo, event, estado, options);

		// If the field is valid
		if(estado.required && estado.pattern && estado.conditional) {

			// If WAI-ARIA is enabled
			if(!!options.waiAria) {

				campo.attribute('aria-invalid', false);
			}

			if(typeof(validacion.valid) == 'function') {

				validacion.valid.call(campo, event, estado, options);
			}

			// Call the eachValidField callback
			options.eachValidField.call(campo, event, estado, options);
		} 
		else {

			// If WAI-ARIA is enabled
			if(!!options.waiAria) {

				campo.attribute('aria-invalid', true);
			}

			if(typeof(validation.invalid) == 'function') {

				validation.invalid.call(campo, event, estado, options);
			}

			// Call the eachInvalidField callback
			options.eachInvalidField.call(campo, event, estado, options);
		}

		// Returns the field status
		return estado;
	}

	const validateExtend = function (options) {
		return Sinco.extend(extend, options);
	}

	const validateExtend = function (options) {
		return Sinco.extend(defaults, options);
	}

	const validate = function(options) {
		var _defaults = Sinco.extend({}, options);

		options = Sinco.extend(_defaults, defaults);
		return validateDestroy.call(Sinco.extend(this)).forEach(function(){
			var form = Sinco.extend(this);

			if (form.tagName == 'form'){
				form[nombre] = { options : options };

				var campos = [].slice.call( form.querySelectorAll('input:not([type])') );
				var namespace = options.namespace;

				type.input.forEach(function(i){
					campos = campos.concat([].slice.call( form.querySelectorAll('input[type=' + i + ']') ));
				});
				type.others.forEach(function(i){
					campos = campos.concat([].slice.call( form.querySelectorAll(i) ));
				});
				type.checks.forEach(function(i){
					campos = campos.concat([].slice.call( form.querySelectorAll('input[type=' + i + ']') ));
				});

				if (form.id){
					type.input.forEach(function(i){
						campos = campos.concat([].slice.call( form.querySelectorAll('input[type=' + i + '][form="' + form.id + '"]') ));
					});
					type.others.forEach(function(i){
						campos = campos.concat([].slice.call( form.querySelectorAll(i + '[form="' + form.id + '"]') ));
					});
					type.checks.forEach(function(i){
						campos = campos.concat([].slice.call( form.querySelectorAll('input[type=' + i + '][form="' + form.id + '"]') ));
					});
				}

				//campos = campos.filter(options.filter); FALTA POR REVISAR

				var f;

				if (!!options.onKeyup) {

					campos.filter(function(c){ return type.input.contains(c.type); }).forEach(function(i) {
						f = function(event) {
							validarCampo.call(this, event, options);
						};
						i = Sinco.extend(i);
						i.f = f;
						i.n = 'keyup';

						i.addEvent('keyup', f);
					});

				}

				if (!!options.onBlur) {

					campos.forEach(function(i) {
						f = function(event) {
							validarCampo.call(this, event, options);
						};
						i = Sinco.extend(i);
						i.f = f;
						i.n = 'blur';

						i.addEvent('blur', f);
					});

				}

				if (!!options.onChange) {

					campos.forEach(function(i) {
						f = function(event) {
							validarCampo.call(this, event, options);
						};
						i = Sinco.extend(i);
						i.f = f;
						i.n = 'change';

						i.addEvent('change', f);
					});
					
				}

				if (!!options.onSubmit) {

					form.addEvent('submit', function(event) {
						var formValid = true;

						campos.forEach(function(c) {
							var status = validateField.call(c, event, options);

							if(!status.pattern || !status.conditional || !status.required) {
								formValid = false;
							}
						});

						if(formValid) {

							if(!options.sendForm) {
								event.preventDefault();
							}

							if(typeof(options.valid) == 'function') {
								options.valid.call(form, event, options);
							}
						} 
						else {
							event.preventDefault();
            				event.stopImmediatePropagation();

							if(typeof(options.invalid) == 'function') {
								options.invalid.call(form, event, options);
							}
						}
					});
					
				}
			}
		});
	};

	const validateDestroy = function() {

		var form = Sinco.extend(this);
		var dataValidate = form[nombre];

		if (form.tagName == 'form' && isPlainObject(dataValidate) && typeof(dataValidate.options.nameSpace) == 'string'){
			delete form[nombre];
		 	var campos = [].slice.call( form.querySelectorAll('input:not([type])') );

			type.input.forEach(function(i){
				campos = campos.concat([].slice.call( form.querySelectorAll('input[type=' + i + ']') ));
			});
			type.others.forEach(function(i){
				campos = campos.concat([].slice.call( form.querySelectorAll(i) ));
			});
			type.checks.forEach(function(i){
				campos = campos.concat([].slice.call( form.querySelectorAll('input[type=' + i + ']') ));
			});

			if (form.id){
				type.input.forEach(function(i){
					campos = campos.concat([].slice.call( form.querySelectorAll('input[type=' + i + '][form="' + form.id + '"]') ));
				});
				type.others.forEach(function(i){
					campos = campos.concat([].slice.call( form.querySelectorAll(i + '[form="' + form.id + '"]') ));
				});
				type.checks.forEach(function(i){
					campos = campos.concat([].slice.call( form.querySelectorAll('input[type=' + i + '][form="' + form.id + '"]') ));
				});
			}

			campos.forEach(function(c){
				c.removeEvent(c.n, c.f);
			});
		}

		return form;
	};

	Sinco.utilities = Sinco.utilities || {};    
    Sinco.utilities.validateExtend = validateExtend;
    Sinco.utilities.validateSetup = validateExtend;
    Sinco.utilities.validate = validate;
    Sinco.utilities.validateDestroy = validateDestroy;
})({

	// Send form if is valid?
	sendForm : true,

	// Use WAI-ARIA properties
	waiAria : true,

	// Validate on submit?
	onSubmit : true,

	// Validate on onKeyup?
	onKeyup : false,

	// Validate on onBlur?
	onBlur : false,

	// Validate on onChange?
	onChange : false,

	// Default namespace
	nameSpace : 'validate',

	// Conditional functions
	conditional : {},

	// Prepare functions
	prepare : {},

	// Fields descriptions
	description : {},

	// Callback
	eachField : $.noop,

	// Callback
	eachInvalidField : $.noop,

	// Callback
	eachValidField : $.noop,

	// Callback
	invalid : $.noop,

	// Callback
	valid : $.noop,

	// A fielter to the fields
	filter : '*'
}, Sinco, window);