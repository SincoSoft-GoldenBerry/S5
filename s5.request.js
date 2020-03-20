((w, s5) => {

    if (!s5.hr) {
        Object.defineProperty(s5, 'hr', { 
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
        const hrs = [];
        this.addRequest = hr => hrs.push(hr);
        this.abort = () => hrs.forEach(hr => hr.abort());
    };

    Object.defineProperties(s5.hr, {
        'setHeader': configurePropS5Web(s5.Request.setHeader),
        'AbortController': configurePropS5Web(AbortController)
    })

    const _req = async (method, url, { controller, data, contentType, includeAccept }) => new Promise((resolve, reject) => {
        const nextFn = (fn, code) => async (data, headers) => fn({ data, status: code, responseHeaders: headers, url });
        
        const fns = {};
        const appendFn = (obj, fn) => rc => fns[rc] = nextFn(fn, obj[rc]);

        Object.keys(RequestStatusCodes.error).forEach(appendFn(RequestStatusCodes.error, reject));
        Object.keys(RequestStatusCodes.correcto).forEach(appendFn(RequestStatusCodes.correcto, resolve));

        controller.addRequest(s5.Request(method, url, fns, data, contentType, includeAccept));
    });

    const verbs = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

    verbs.forEach(verb => Object.defineProperty(s5.hr, verb.toLowerCase(), 
        configurePropS5Web(
            async (url, config = { controller: new AbortController(), data: null, contentType: 'json', includeAccept: true }) => await _req(verb, url, config)
        )
    ));

})(window, Sinco);