var https = require('https'),

    express = require('express'),

    { createProxyMiddleware } = require('http-proxy-middleware'),

    http = require('http'),

    util = require('util'),

    fs   = require('fs'),

    path = require('path'),

    colors = require('colors'),

    httpProxy = require('../../lib/http-proxy'),

    fixturesDir = path.join(__dirname, '..', '..', 'test', 'fixtures'),

    httpsOpts = {

      key: fs.readFileSync(path.join(fixturesDir, 'cert.pem'), 'utf8'),

      cert: fs.readFileSync(path.join(fixturesDir, 'cert.crt'), 'utf8')

    };

 

//

// Create the target HTTPS server

//

https.createServer(httpsOpts, function (req, res) {

  res.writeHead(200, { 'Content-Type': 'text/plain' });

  res.write('hello https\n');

  res.end();

}).listen(9010);

 

 

const app = express();

app.use('/', createProxyMiddleware('',

{

target: 'https://localhost:9010',

ssl: httpsOpts,

changeOrigin: true,    // for vhosted sites, changes host header to match to target's host

secure: false,

logLevel: 'debug'

}

)

);

 

var httpsServer = https.createServer(httpsOpts, app)

httpsServer.listen(8010);

 

// https://localhost:8010/ -> https://test:8045

 

 

console.log('https proxy server'.blue + ' started '.green.bold + 'on port '.blue + '8010'.yellow);

console.log('https server '.blue + 'started '.green.bold + 'on port '.blue + '9010 '.yellow);
