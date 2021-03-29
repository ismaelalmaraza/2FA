const express = require('express');
const speakeasy = require('speakeasy');
const commons = require('./commons');

const router = express.Router();

router.post('/login', (req, res) => {
    if (!req.headers['x-tfa']) {
        console.log(`WARNING: Login was partial without TFA header`);

        return res.send({
            "status": 206,
            "message": "Please enter the Auth Code"
        });
    }
    console.log(req.body)
    let isVerified = speakeasy.totp.verify({
        secret: req.body.secret,
        encoding: 'base32',
        token: req.headers['x-tfa']
    });

    if (isVerified) {
        console.log(`DEBUG: Login with TFA is verified to be successful`);
        return res.send({
            "status": 200,
            "message": "success"
        });
    } else {
        console.log(`ERROR: Invalid AUTH code`);

        return res.send({
            "status": 206,
            "message": "Invalid Auth Code"
        });
    }
});
module.exports = router;