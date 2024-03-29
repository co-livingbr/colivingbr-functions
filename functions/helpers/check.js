/**
 * Check if a value is an object.
 * @param {*} value
 * @returns {Boolean}
 */
const isObject = value => value !== null && typeof value === 'object';

exports.isObject = isObject;

/**
 * Check if value is empty.
 * @param {*} value
 * @returns {Boolean}
 */
const isEmpty = value => {
	const isEmpty = value === null || value === undefined || (typeof value === 'string' && !value.trim());
	return isEmpty;
};

exports.isEmpty = isEmpty;

/**
 * Check if all properties exists in an object.
 * @param {Object} object
 * @param {...String} properties
 * @returns {Boolean}
 */
const checkProperties = (object, ...properties) => {
	const isValid = isObject(object) && properties.every(property => !isEmpty(object[property]));
	return isValid;
};

exports.checkProperties = checkProperties;
