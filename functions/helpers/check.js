/**
 * Check if value is empty.
 * @param {*} value
 * @returns {Boolean}
 */
const isEmpty = value => (
	value === null ||
	value === undefined ||
	(typeof value === 'string' && !!value.trim())
);

exports.isEmpty = isEmpty;

/**
 * Check if all properties exists in an object.
 * @param {Object} object
 * @param {...String} properties
 * @returns {Boolean}
 */
const checkProperties = (object, ...properties) => properties.every(property => !isEmpty(object[property]));

exports.checkProperties = checkProperties;
