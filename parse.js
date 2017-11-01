"use strict";

const http = require('http');
const { JSDOM } = require('jsdom');
const async = require('async');
const fs = require('fs');

// Parse gospel quotes from website into storage file.
makeRequest()
    .then(function() {
        const storageFilePath = __dirname + '/storage.json';
        fs.writeFile(storageFilePath, JSON.stringify(storage, null, 4), function(err) {
            if (err) {
                console.log(err);
                return;
            } else {
                console.log('Storage being updated.');
                return;
            }
        })
    });
// The site is used to parse gospel quotes from.
const gospelHost = 'www.patriarchia.ru';
// This variable will consist of all data retrieved from gospel's site.
// TODO: put that into promise as resolve response.
const storage = [];
// Exact pages to parse.
// URL is like <gospelHost>/<path>/<i>, i = 0..<quantity>. Also we collect type and title of gospel book the quote took from.
const sources = [
    {
        type: 'Новый Завет',
        title: 'Евангелие от Матфея',
        path: "/bible/mf/",
        quantity: 28
    },
    {
        type: 'Новый Завет',
        title: 'Евангелие от Марка',
        path: "/bible/mk/",
        quantity: 16
    },
    {
        type: 'Новый Завет',
        title: 'Евангелие от Луки',
        path: "/bible/lk/",
        quantity: 24
    },
    {
        type: 'Ветхий Завет',
        title: 'Бытие',
        path: "/bible/gen/",
        quantity: 50
    },
    {
        type: 'Ветхий Завет',
        title: 'Исход',
        path: "/bible/ex/",
        quantity: 40
    }
];
/**
 * Makes all needed HTTP requests to the website where all gospel quotes are stored.
 * @return {Promise}
 */
function makeRequest() {
    let promisesChain = new Promise(function(resolve, reject) {
        resolve();
    });
    for (let i = 0; i < sources.length; i++) {
        for (let j = 1; j <= sources[i].quantity; j++) {
            promisesChain = promisesChain.then(function() {
                return makeSingleRequest(sources[i].path + j, sources[i].type, sources[i].title);
            });
        }
    }
    return promisesChain;
}
/**
 * Make single request to website page. Parse gospel quotes.
 * @return {Promise}
 */
function makeSingleRequest(path, type, title) {
    let options = {
        host: gospelHost,
        path: path
    };
    return new Promise(function(resolve, reject) {
        var req = http.request(options, function(response) {
            var htmlText = '';
            // Put each chunk into HTML string.
            response.on('data', function (chunk) {
                htmlText += chunk;
            });
            response.on('error', function() {
                reject();
            });
            // Parse HTML string on end.
            response.on('end', function () {
                const dom = new JSDOM(htmlText);
                const document = dom.window.document;
                // Find all rows and parse content and link.
                const trs = document.querySelectorAll('table.Bible tr.BibleStix');
                for (let i = 0; i < trs.length; i++) {
                    let tr = trs[i];
                    // Link text.
                    let linkDOM = tr.querySelector('td.BibleStixLnk');
                    let link = linkDOM.textContent;
                    // Content.
                    let contentDOM = tr.querySelector('td.BibleStixTxt');
                    let content = contentDOM.textContent;
                    if (link && content) {
                        // Put gospel quote into storage array.
                        storage.push({
                            type: type,
                            title: title,
                            link: link,
                            content: content
                        });
                    }
                    // Finally resolve promise.
                    resolve();
                }
            });
        });
        // Reject on request error.
        req.on('error', function(err) {
            reject(err);
        });
        req.end();
    });
}