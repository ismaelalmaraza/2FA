const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const login = require('./routes/login');
const register = require('./routes/register');
const tfa = require('./routes/tfa');
var fs = require('fs');
var https = require('https');
var http = require('http');
var privateKey  = fs.readFileSync('privkey.key', 'utf8');
var certificate = fs.readFileSync('5f8ed9eda39f87bb.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};


app.use(bodyParser.json());
app.use(cors());

app.use(login);
app.use(register);
app.use(tfa);

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(6500);