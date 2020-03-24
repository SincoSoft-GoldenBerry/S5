/**
 * @license S5.js >= v2.0.14 or S5.js >= v1.0.46
 * (c) 2015-2020 Sincosoft, Inc. http://sinco.com.co
 * 
 * Creation date: 20/03/2020
 * Last change: 24/03/2020
 *
 * by GoldenBerry
**/

((s5, o) => {

    if (!s5.hr) {
        o.defineProperty(s5, 'hr', { 
            enumerable: false,
            configurable: true,
            writable: false,
            value: {}
        });
    }

    const RequestStatusCodes = {
        error: {
            'Aborted': 0,
            'BadRequest': 400,
            'Unauthorized': 401,
            'Forbidden': 403,
            'NotFound': 404,
            'RequestTimeout': 408,
            'Conflict': 409,
            'PreconditionFailed': 412,
            'InternalServerError': 500,
            'GatewayTimeout': 504
        },
        correcto: {
            'Ok': 200,
            'Created': 201,
            'NoContent': 204,
            'Moved': 302,
            'MultipleChoices': 300,
            'SeeOther': 303
        }
    };
    
    const configurePropS5Web = value => ({
        enumerable: false,
        configurable: false,
        writable: false,
        value
    });

    function AbortController() {
        let hrs;
        const init = () => hrs = [];
        this.addRequest = hr => hrs.push(hr);
        this.abort = () => {
            hrs.forEach(hr => hr.abort());
            init();
        };
        init();
    };

    o.defineProperties(s5.hr, {
        'setHeader': configurePropS5Web(s5.Request.setHeader),
        'AbortController': configurePropS5Web(AbortController)
    });

    const _req = async (method, url, { controller = new AbortController(), data = null, contentType = 'json', includeAccept = true }) => new Promise((resolve, reject) => {
        const responseFunctions = {};
        
        const nextFn = (promiseFunction, status) => async (data, responseHeaders) => promiseFunction({ data, status, responseHeaders, url });
        
        const appendResponseFunction = (statusCodeObject, promiseFunction) => statusCodeName => responseFunctions[statusCodeName] = nextFn(promiseFunction, statusCodeObject[statusCodeName]);

        o.keys(RequestStatusCodes.error).forEach(appendResponseFunction(RequestStatusCodes.error, reject));
        o.keys(RequestStatusCodes.correcto).forEach(appendResponseFunction(RequestStatusCodes.correcto, resolve));

        controller.addRequest(s5.Request(method, url, responseFunctions, data, contentType, includeAccept));
    });

    const verbs = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

    verbs.forEach(verb => o.defineProperty(s5.hr, verb.toLowerCase(), 
        configurePropS5Web(
            async (url, config = { controller: new AbortController(), data: null, contentType: 'json', includeAccept: true }) => await _req(verb, url, config)
        )
    ));

})(Sinco, Object);