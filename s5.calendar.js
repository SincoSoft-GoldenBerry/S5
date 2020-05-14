(function(s5) {
    var Meses = {
        'Enero': 0, 'Febrero': 1, 'Marzo': 2, 'Abril': 3, 'Mayo': 4, 'Junio': 5, 'Julio': 6, 'Agosto': 7, 'Septiembre': 8, 'Octubre': 9, 'Noviembre': 10, 'Diciembre': 11,
        0: 'Enero', 1: 'Febrero', 2: 'Marzo', 3: 'Abril', 4: 'Mayo', 5: 'Junio', 6: 'Julio', 7: 'Agosto', 8: 'Septiembre', 9: 'Octubre', 10: 'Noviembre', 11: 'Diciembre'
    };

    var DiasDeLaSemana = { 'Domingo': 0, 'Lunes': 1, 'Martes': 2, 'Miercoles': 3, 'Jueves': 4, 'Viernes': 5, 'Sabado': 6 };

    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    };

    Date.prototype.formatoFecha = function () {
        return this.toLocaleString('es-co', { hour12: true }).replace(/\sm/, 'm').replace(/:\d{2}\s/, ' ');
    };

    Date.prototype.nombreMes = function () {
        return Meses[this.getMonth()];
    };

    Date.prototype.ticks = function () {
        return ((this.getTime() * 10000) + 621355968000000000);
    };

    var Habiles = function () {
        var jornadaSemana = [];
        var calendario = [];

        var buscarJornadaDiaria = function (DiaSemana) {
            return jornadaSemana.find(function (dia) {
                return dia.indice == DiaSemana;
            });
        };

        //////////// DIAS HORAS Y MINUTOS
        var dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
        var horas = ['12:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
        var minutos = Array.apply(null, { length: 30 }).map(Number.call, Number);

        var jornadas = function (dias, mascara) {
            var arraybinarios = []
            var i = 0;
    
            var arrbin = function (arrayInformacion, jornada) {
                if (i < arrayInformacion.length) {
                    arraybinarios.push({ 
                        indice: i, 
                        Nombre: arrayInformacion[i], 
                        Valor: Math.pow(2, i), 
                        Habil: !!(jornada & Math.pow(2, i)) 
                    });
                    i = ++i;
                    arrbin(arrayInformacion, jornada);
                }
            }
            arrbin(dias, mascara);
    
            return arraybinarios;
        };

        ///////////  JORNADAS POR DEFECTO
        var diasHabiles = jornadas(dias, 31)
        var horasHabiles = jornadas(horas, 253696)
        var jornadaminutos = { primeraMediaHora: 1073741823, segundaMediaHora: 1073741823 };
        var minutosHabiles = jornadas(minutos, jornadaminutos.primeraMediaHora)
                                .concat(jornadas(minutos, jornadaminutos.segundaMediaHora))
                                .map(function (e, i) { 
                                    e.indice = i; 
                                    return e;
                                });


        ///////////  A CADA DIA LE ASIGNO LA JORNADA
        diasHabiles.map(function (dia) {
            dia.horas = horasHabiles;
            jornadaSemana.push(dia)
        });

        var llenarCalenario = function (diaSeleccionado, noValidarHora, maximo) {
            var inicial = new Date(diaSeleccionado.getTime());
    
            var jornadaDia = buscarJornadaDiaria((inicial.getDay() || 6) - 1);
    
            var habilesvalidas = jornadaDia.horas.filter(function (hora) {
                return !!(jornadaDia.Habil && !_Fecha.esFestivo(inicial) && hora.Habil) && (noValidarHora || hora.indice > diaSeleccionado.getHours());
            });
    
            var nuevoArray = JSON.parse(JSON.stringify(habilesvalidas.slice(0, maximo)))
    
            nuevoArray.map(function (el) {
                el.dia = inicial;
                return el;
            });
    
            calendario = calendario.concat(nuevoArray);
        };

        var cantidadInicial = 0;

        var sumarHoras = function (diaInicio, cant, noValidarHora) {

            if (!noValidarHora) {
                cantidadInicial = cant;
                calendario.length = [];
            }

            llenarCalenario(diaInicio, noValidarHora, cant);

            if (cantidadInicial > calendario.length) {
                sumarHoras(diaInicio.addDays(1), cantidadInicial - calendario.length, true, cant);
            }

            return calendario
        }

        var diferenciaMinutos = function (diaInicio, diaFin, recursion, noValidarHora) {

            if (!recursion) {
                calendario.length = [];
            }

            var minutosInicio = 60 - diaInicio.getMinutes();
            var minutosFin = diaFin.getMinutes();

            var jornadaDia = buscarJornadaDiaria((diaInicio.getDay() || 6) - 1);

            var horaInicio = diaInicio.getHours();

            var habilesvalidas = jornadaDia.horas.filter(function (hora) {
                return !!(jornadaDia.Habil && !_Fecha.esFestivo(diaInicio) && hora.Habil) && (noValidarHora || hora.indice > horaInicio);
            });

            var nuevoArray = JSON.parse(JSON.stringify(habilesvalidas));

            nuevoArray.map(function (el) {
                el.dia = new Date(diaInicio);
                el.dia.setHours(el.indice);
                return el;
            });

            calendario = calendario.concat(nuevoArray);

            if (diaInicio.addDays(1).getTime() < diaFin.getTime()) {
                diferenciaMinutos(diaInicio.addDays(1), diaFin, true);
            }

            var mismoDia = function(dia, fin){
                return dia.getFullYear() == fin.getFullYear() && dia.getMonth() == fin.getMonth() && dia.getDate() == fin.getDate();
            }

            var MaximoHora = function(dia, fin) { 
                return (!mismoDia(dia, fin)) || (mismoDia(dia, fin) && dia.getHours() < fin.getHours());
            }

            var resultado = calendario.filter(function(e){ return MaximoHora(e.dia, diaFin) });

            return { cantidad: minutosInicio + minutosFin + (resultado.length*60) , detalle: resultado };
        };

        return {
            sumarHoras: sumarHoras,
            diferenciaMinutos: diferenciaMinutos,
        };
    };

    var Fecha = function () {
        var Siguiente_DiaSemana = function (weekDay, realDate, daysToAdd, backward) {
            var date = new Date(realDate.getTime()),
                dayAddition = (backward ? -1 : 1);
    
            if (daysToAdd) {
                date.setDate(date.getDate() + daysToAdd);
            }
    
            while (date.getDay() !== weekDay) {
                date.setDate(date.getDate() + dayAddition);
            }
    
            return date;
        };
    
        var Anterior_DiaSemana = function (weekDay, date, daysToAdd) {
            return Siguiente_DiaSemana(weekDay, date, daysToAdd, true);
        };
    
        var toOADate = function (date) {
            var timezoneOffset = date.getTimezoneOffset() / (60 * 24);
            var msDateObj = (date.getTime() / 86400000) + (25569 - timezoneOffset);
            return msDateObj;
        }
    
        var fromOADate = function (oadate) {
            var date = new Date(((oadate - 25569) * 86400000));
            var tz = date.getTimezoneOffset();
            return new Date(((oadate - 25569 + (tz / (60 * 24))) * 86400000));
        }

        return {
            DiasDeLaSemana: DiasDeLaSemana,
            Meses: Meses,
            Siguiente_DiaSemana: Siguiente_DiaSemana,
            Anterior_DiaSemana: Anterior_DiaSemana,
            toOADate: toOADate,
            fromOADate: fromOADate
        };
    };

    var fnFestivos = function () {

        function Festivos(year) {
            this.year = year || new Date().getFullYear();
            this.parsers = {};
            this.fechas = [];
            this.calcularPascua();
            this.FechaFija();
            this.CambianAlLunes();
            this.SegunPascua();
            this.ordenarFestivos();
        }
    
        Festivos.prototype.agregarFecha = function (date, data) {
            this.fechas.push({ date: date, name: data });
        };
    
        Festivos.prototype.addParser = function (name, parser) {
            this.parsers[name] = parser;
        };
    
        Festivos.prototype.getFestivos = function (parserName) {
            var parser;
    
            if (parserName && this.parsers.hasOwnProperty(parserName)) {
                parser = this.parsers[parserName];
            } else {
                parser = function (date) {
                    return date;
                };
            }

            this.ordenarFestivos();
    
            return this.fechas.map(function (date) {
                return parser(date.date, date.name);
            });
        };
    
        Festivos.prototype.FechaFija = function () {
            var proto = this;
            [
                { month: Fecha.Meses.Enero, day: 1, description: "Año Nuevo" },
                { month: Fecha.Meses.Mayo, day: 1, description: "Día del Trabajo" },
                { month: Fecha.Meses.Julio, day: 20, description: "Grito de Independencia" },
                { month: Fecha.Meses.Agosto, day: 7, description: "Batalla de Boyacá" },
                { month: Fecha.Meses.Diciembre, day: 8, description: "Día de la Inmaculada Concepción" },
                { month: Fecha.Meses.Diciembre, day: 25, description: "Navidad" }
            ].forEach(function (data) {
                var date = new Date(proto.year, data.month, data.day);
                proto.agregarFecha(date, data.description);
            });
        };
    
        Festivos.prototype.CambianAlLunes = function () {
            var proto = this;
            [
                { month: Fecha.Meses.Enero, day: 6, description: "Reyes Magos" },
                { month: Fecha.Meses.Marzo, day: 19, description: "San José" },
                { month: Fecha.Meses.Junio, day: 29, description: "San Pedro y San Pablo" },
                { month: Fecha.Meses.Agosto, day: 15, description: "Asunción de la Virgen" },
                { month: Fecha.Meses.Octubre, day: 12, description: "Día de la Raza" },
                { month: Fecha.Meses.Noviembre, day: 1, description: "Todos los Santos" },
                { month: Fecha.Meses.Noviembre, day: 11, description: "Independencia de Cartagena" }
            ].forEach(function (data) {
                var date = Fecha.Siguiente_DiaSemana(Fecha.DiasDeLaSemana.Lunes, new Date(proto.year, data.month, data.day));
                proto.agregarFecha(date, data.description);
            });
        };
    
        Festivos.prototype.SegunPascua = function () {
            var proto = this;
            /* proto.agregarFecha(proto.Fecha.Anterior_DiaSemana(Fecha.DiasDeLaSemana.Domingo,proto.pascua,-1), "Domingo de Ramos");*/
            proto.agregarFecha(Fecha.Anterior_DiaSemana(Fecha.DiasDeLaSemana.Jueves, proto.pascua), "Jueves Santo");
            proto.agregarFecha(Fecha.Anterior_DiaSemana(Fecha.DiasDeLaSemana.Viernes, proto.pascua), "Viernes Santo");
            proto.agregarFecha(Fecha.Siguiente_DiaSemana(Fecha.DiasDeLaSemana.Lunes, proto.pascua, 42), "Ascensión de Jesús");
            proto.agregarFecha(Fecha.Siguiente_DiaSemana(Fecha.DiasDeLaSemana.Lunes, proto.pascua, 63), "Corpus Christi");
            proto.agregarFecha(Fecha.Siguiente_DiaSemana(Fecha.DiasDeLaSemana.Lunes, proto.pascua, 70), "Sagrado Corazón");
        }
    
        Festivos.prototype.calcularPascua = function () {
            var a, b, c, d, e;
            var year = this.year, m = 24, n = 5;
    
            switch (true) {
                case (year >= 1583 && year <= 1699):
                    m = 22;
                    n = 2;
                    break;
                case (year >= 1700 && year <= 1799):
                    m = 23;
                    n = 3;
                    break;
                case (year >= 1800 && year <= 1899):
                    m = 23;
                    n = 4;
                    break;
                case (year >= 1900 && year <= 2099):
                    m = 24;
                    n = 5;
                    break;
                case (year >= 2100 && year <= 2199):
                    m = 24;
                    n = 6;
                    break;
                case (year >= 2200 && year <= 2299):
                    m = 25;
                    n = 0;
                    break;
            }
    
            a = year % 19;
            b = year % 4;
            c = year % 7;
            d = ((a * 19) + m) % 30;
            e = ((2 * b) + (4 * c) + (6 * d) + n) % 7;
    
            var day = d + e;
    
            if (day < 10)
                return (this.pascua = new Date(year, Fecha.Meses.Marzo, day + 22));
            else {
    
                if (day == 26)
                    day = 19;
                else if (day == 25 && d == 28 && e == 6 && a > 10)
                    day = 18;
                else
                    day -= 9;
    
                return (this.pascua = new Date(year, Fecha.Meses.Abril, day));
            }
        };

        Festivos.prototype.ordenarFestivos = function() {
            this.fechas = this.fechas.sort(function(a, b){
                return a.date - b.date;
            });
        };
    
        var esFestivo = function (fechaBuscar) {
            var fecha = new Date(fechaBuscar);
            var fest = new Festivos(fecha.getFullYear());
            fecha.setHours(0, 0, 0, 0);
            return fest.fechas.some(function (el) {
                el.date.setHours(0, 0, 0, 0);
                return el.date.getTime() == fecha.getTime();
            });
        }
    
        return {
            FestivosAno: function(year){ return new Festivos(year); },
            esFestivo: esFestivo,
            toOADate: Fecha.toOADate,
            fromOADate: Fecha.fromOADate
        };
    };

    var funcionesFecha = {};

    Fecha = Fecha();
    var _Festivos = fnFestivos();

    funcionesFecha.Habiles = Habiles();
    funcionesFecha.FestivosAno = _Festivos.FestivosAno;
    funcionesFecha.esFestivo = _Festivos.esFestivo;
    funcionesFecha.toOADate = _Festivos.toOADate;
    funcionesFecha.fromOADate = _Festivos.fromOADate;

    s5.utilities = s5.utilities || {};
    s5.utilities.calendar = funcionesFecha;
})(window.Sinco);