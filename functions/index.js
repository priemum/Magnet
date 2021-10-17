// © 2021 by Philip
// This project is licenced under the MIT liscense, and is open source.

require('fs')
    .readdirSync(__dirname)
    .filter(file => file !== 'index.js')
    .forEach(filename => {
        const moduleName = filename.split('.')[0];
        exports[moduleName] = require(`${__dirname}/${filename}`);
    });