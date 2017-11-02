"use strict";

const express = require('express');
const router = express.Router();
const tokenVerification = require('../../middlewares/tokenverification');
const fs = require('fs');
// Define "root" directory.
const path = require('path');
const appDir = path.dirname(require.main.filename);
// Define path to storage consists of gospel quotes.
const storageFilePath = appDir + '/../gospel/storage.json';

router.use('/api', tokenVerification);

router.post('/api', function(req, res) {
    var text = req.body.text;
    var name = '';
    const regExp = /<@[0-9A-Z]+(\|.+)?>/i;
    if (regExp.test(text)) {
        name = regExp.exec(text)[0] + "\n";
        name += "\n";
    }
    fs.readFile(storageFilePath, 'utf8', function(err, data) {
        if (err) {
            res.error('Some error appeared.');
            console.log(err);
        }
        let dataJSON = JSON.parse(data);
        let num = Math.floor(Math.random() * dataJSON.length);
        const response = {
            response_type: "in_channel",
            text: name + '*' + dataJSON[num].type + '* _' + dataJSON[num].title + ' ' + dataJSON[num].link + '_',
            link_names: true,
            attachments: [
                {
                    text: dataJSON[num].content
                }
            ]
        };
        res.json(response);
    });
});

module.exports = router;