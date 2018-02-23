const express = require('express');
const RedWire = require('redwire');
const morgan = require('morgan');
const enmap = require('enmap');
const moment = require('moment');
const bodyParse = require('body-parser');

const config = require('./config.json');

const proxy = new RedWire({
    http: {
        port: config.ports.proxy
    }
});
const app = express();
app.locals.configs = new enmap();

app.locals.newCfg = (name) => {
    //Add the new config
    app.locals.configs.set(name, { fish: { gold: 1, silver: 20 }, pass: 'Default', date: moment().format('YYYY-MM-DD') });
    //Then delete it after 5 minutes
    setTimeout(() => {
        app.locals.configs.delete(name);
    }, 5 * 60000);
};

proxy.http('hpmobile.jp', config.host);

app.use(morgan('dev'));
app.use(bodyParse.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

app.use((req, res, next) => {
    let hascfg = req.app.locals.configs.has(req.ip);
    if(!hascfg) req.app.locals.newCfg(req.ip);
    console.log(req.ip)
    req.cfg = req.app.locals.configs.get(req.ip);
    next();
});

let neko = require('./neko.js');
app.use('/app/nekoatsume', neko);

app.get('/', (req, res) => {
    res.render('config', { config: req.cfg });
});

app.post('/update', (req, res) => {
    console.log(req.body);
    let gold = req.body.gold;
    let silver = req.body.silver;
    let date = req.body.date;
    let pass = req.body.pass;
    if(!gold || !silver || !date || !pass) return res.send(`Missing one or more fields! Try again!`);
    app.locals.configs.set(req.ip, { fish: { gold: gold, silver: silver }, pass: pass, date: date });
    res.send(`All done, now open the app!`);
});

let port = process.env.PORT || config.ports.web;

app.listen(port, () => {
    console.log(`[INFO] Server ready and listening on port ${port}!`);
});


//http://hpmobile.jp/app/nekoatsume/neko_daily_en.php