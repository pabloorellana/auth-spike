'use strict';

var statusCodesHandlers = {
    500: function (params) {
        return buildError({
            'status': '500',
            'title' : params.title || 'Internal Server Error',
            'detail': params.detail || 'Something went wrong.'
        });
    },
    404: function (params) {
        return buildError({
            'status': '404',
            'title':  params.title || 'Not Found',
            'detail': params.detail || ''
        });
    },
    409: function (params) {
        return buildError({
            'status': '409',
            'title' : params.title || 'Conflict',
            'detail': params.detail || ''
        });
    }
};

function buildError (errors) {
    return {
        'errors': [errors]
    }
};

function excludeProperties (obj, params) {
    obj = JSON.parse(JSON.stringify(obj));

    for (var key in params) {
        if (params[key] === 0 && obj.hasOwnProperty(key)) {
            delete obj[key];
        }
    }

    return obj;
}

function formatErrorResponse (req, res) {

    var handler = statusCodesHandlers[res.errorInfo.status];

    if (handler) {
        return res.status(res.errorInfo.status).send(handler(res.errorInfo));
    }

    return res.status(500).send(statusCodesHandlers[500]({}));
}

module.exports = { excludeProperties, formatErrorResponse };