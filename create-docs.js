const fs = require('fs').promises;
const marked = require('marked');

async function main() {
    try {
        const fileMarkdownString = await fs.readFile('README.md');
        const htmlString = marked(fileMarkdownString.toString());
        const template = `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link
                    rel="stylesheet"
                    href="https://unpkg.com/sakura.css/css/sakura.css"
                    type="text/css"
                />
                <title>Route | API's made easy</title>
            </head>
        
            <body>
              ${htmlString}
            </body>
        </html>    
        `;

        await fs.writeFile('docs/index.html', template);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

main();
