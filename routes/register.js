const express = require('express');
const commons = require('./commons');
const router = express.Router();

router.post('/register', (req, res) => {
    console.log(`DEBUG: Received request to register user`);
    console.log(req.body);
    const result = req.body;

    if ((!result.uname && !result.upass) || (result.uname.trim() == "" || result.upass.trim() == "")) {
        console.log("error")
        return res.send({
            "status": 400,
            "message": "Username/ password is required"
        });
    }

    commons.userObject.uname = result.uname;
    commons.userObject.upass = result.upass;
    delete commons.userObject.tfa;

    return res.send({
        "status": 200,
        "message": "User is successfully registered"
    });
});

module.exports = router;