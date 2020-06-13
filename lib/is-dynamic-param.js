const paramRegexExt = /^\[(\w+)\].js$/;
const paramRegex = /^\[(\w+)\]$/;

module.exports = (pathParam) => {
    if (paramRegex.test(pathParam) || paramRegexExt.test(pathParam)) {
        return true;
    }
    return false;
};
