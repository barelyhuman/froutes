module.exports = (url) => {
    const tokens = url.split('/').filter((item) => item);
    return tokens;
};
