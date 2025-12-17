const isNullOrEmpty = (value) => {
	if (value == null) return true;
	if (typeof value === 'string') return value.trim() === '';
	if (Array.isArray(value)) return value.length === 0;
	if (typeof value === 'object') return Object.keys(value).length === 0;
	return false;
};


const checkRequire = (fieldName, obj, errorObj) => {
	if (isNullOrEmpty(obj[fieldName])) errorObj[fieldName] = `${fieldName} is require`;
};


module.exports = { isNullOrEmpty, checkRequire };
