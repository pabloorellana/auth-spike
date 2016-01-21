exports.excludeProperties = function (obj, params) {
    obj = JSON.parse(JSON.stringify(obj));

    for (var key in params) {
        if (params[key] === 0 && obj.hasOwnProperty(key)) {
            delete obj[key];
        }
    }

    return obj;
}