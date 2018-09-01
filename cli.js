#!/usr/bin/env node

var createMindMap = require('./app').createMindMap;

const main = function main() {
    if (process.argv.length == 4) {
        try {
            createMindMap(process.argv[2], process.argv[3])
        } catch (err) {
            console.error(err);
        }
    } else {
        console.error('two arguments are required (source json file path, target mind map file path)')
    }
}();