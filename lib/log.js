module.exports = (text) => {
    process.stdout.write(text);
    return (nextText) => nextLine(nextText);
};

const nextLine = (nextText) => {
    process.stdout.cursorTo(0);
    process.stdout.clearLine();
    process.stdout.write(nextText);
    return (_nextText) => nextLine(_nextText);
};
