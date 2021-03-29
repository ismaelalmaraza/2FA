const express = require('express');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const commons = require('./commons');
const router = express.Router();

router.post('/tfa/setup', (req, res) => {
    console.log(`DEBUG: Received TFA setup request`);
    console.log(req.body.email)
    const secret = speakeasy.generateSecret({
        length: 10,
        name: req.body.email,
        issuer: 'Oficina Virtual SBC'
    });
    var url = speakeasy.otpauthURL({
        secret: secret.base32,
        label: req.body.email,
        issuer: 'Oficina Virtual SBC',
        encoding: 'base32'
    });
    QRCode.toDataURL(url, (err, dataURL) => {
        commons.userObject.tfa = {
            secret: '',
            tempSecret:  secret.base32,
            dataURL,
            tfaURL: url
        };
        return res.json({
            message: 'TFA Auth needs to be verified',
            tempSecret:  secret.base32,
            dataURL,
            tfaURL: secret.otpauth_url
        });
    });
});

router.get('/tfa/setup', (req, res) => {
    console.log(`DEBUG: Received FETCH TFA request`);

    res.json(commons.userObject.tfa ? commons.userObject.tfa : null);
});

router.delete('/tfa/setup', (req, res) => {
    console.log(`DEBUG: Received DELETE TFA request`);

    delete commons.userObject.tfa;
    res.send({
        "status": 200,
        "message": "success"
    });
});

router.post('/tfa/token', (req, res) => {
    console.log("DEBUG Get token")
    const myToken = speakeasy.totp({
        secret: req.body.secret.trim(),
        encoding: 'base32',
    });
    res.json({token:myToken})
})

router.post('/tfa/verify', (req, res) => {
    console.log(`DEBUG: Received TFA Verify request`);

    let isVerified = speakeasy.totp.verify({
        secret: req.body.secret,
        encoding: 'base32',
        token: req.body.token
    });

    if (isVerified) {
        console.log(`DEBUG: TFA is verified to be enabled`);

        commons.userObject.tfa.secret = commons.userObject.tfa.tempSecret;
        return res.send({
            "status": 200,
            "message": "Two-factor Auth is enabled successfully"
        });
    }

    console.log(`ERROR: TFA is verified to be wrong`);

    return res.send({
        "status": 403,
        "message": "Invalid Auth Code, verification failed. Please verify the system Date and Time"
    });
});

module.exports = router;