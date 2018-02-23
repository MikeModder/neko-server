const express = require('express');
const RedWire = require('redwire');
const morgan = require('morgan');
const enmap = require('enmap');

const proxy = new RedWire({
    http: {
        port: 8092
    }
});
const app = express();
app.locals.configs = new enmap();

//redbird.register('http://hpmobile.jp/', 'http://192.168.0.9:8080/');
proxy.http('hpmobile.jp', 'localhost:8080');

app.use(morgan('dev'));

let neko = require('./neko.js');
app.use('/app/nekoatsume', neko);

app.get('/', (req, res) => {
    res.send('Control panel will be here!');
});

app.listen(8080, () => {
    console.log(`[INFO] Server ready and listening on port 8080!`);
});
//http://hpmobile.jp/app/nekoatsume/neko_daily_en.php