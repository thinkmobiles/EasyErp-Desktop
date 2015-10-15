var async = require('async');

var createMapper = function (element, parentKey, currentKey, currentPropertyName, properties) {
    var keys;
    var mapValue;

    if (parentKey != null) {
        currentPropertyName = currentPropertyName ? currentPropertyName + '.' + parentKey : parentKey;
    }

    if (!(element instanceof Object)) {
        mapValue = currentPropertyName ? currentPropertyName + '.' + currentKey : currentKey;
        properties.push({map: mapValue, property: mapValue});
        return;
    }
    keys = Object.keys(element);

    if (keys.length === 0) {
        mapValue = currentPropertyName ? currentPropertyName + '.' + currentKey : currentKey;
        properties.push({map: mapValue, property: mapValue});
        return;
    }

    keys.forEach(function (key) {
        var innerElement = element[key];
        createMapper(innerElement, currentKey, key, currentPropertyName, properties);
    });
};

var getValue = function (name, obj) {
    var array = name.split('.');
    var value = obj;

    for (var i = 0, l = array.length; i < l; i++) {
        value = value[array[i]];
        if (!value) {
            return value
        }
    }

    return value;
};

var createMap = function (element) {
    if (!(element instanceof Object)) {
        throw new TypeError();
    }
    var properties = [];
    createMapper(element, null, null, null, properties);
    return properties;
};

var mapObject = function (map, element) {
    var mappedObject = {};
    var propertyMap;
    var val;
    for (var i = map.length - 1; i >= 0; i--) {
        propertyMap = map[i];
        val = getValue(propertyMap.property, element);
        if (!val) {
            val = "";
        }
        mappedObject[propertyMap.map] = val;
    }
    return mappedObject;
};

var convertToSimpleObjects = function (map, array) {
    var result;
    var mappedElement;
    if (!(array instanceof Array)) {
        throw new TypeError();
    }
    if (!(map instanceof Array)) {
        map = createMap(array[0]);
    }
    result = [];

    for (var i = 0, len = array.length; i < len; i++) {
        mappedElement = mapObject(map, array[i]);
        result.push(mappedElement);
    }
    return result;

};
/**
 *
 * @param {Object[]} elements - objects to unfold
 * * @param {Object[]} [propertyMapArray=undefined] - Array of {map:newObjectPropertyName, property:currentObjectPropertyName}
 * values that you want to have in unfolded object.
 * If null, property names will be created using first object properties, joined by dot, e.g 'property.second.third'
 *
 * @param {Function} callback - Callback that will be executed after unfolding objects.
 */
exports.convertToLinearObjects = function (elements, propertyMapArray, callback) {
    async.series(
        {
            one: function (callback) {
                var res = convertToSimpleObjects(propertyMapArray, elements);
                callback(null, res)
            }
        }, function (err, results) {
            callback(null, results.one);
        }
    );
};