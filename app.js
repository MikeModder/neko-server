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
    req.rip = req.get('x-forwarded-for');
    let hascfg = req.app.locals.configs.has(req.rip);
    if(!hascfg) req.app.locals.newCfg(req.rip);
    res.locals.cfg = req.app.locals.configs.get(req.rip);
    next();
});

let neko = require('./neko.js');
app.use('/app/nekoatsume', neko);

app.use(express.static('static'));

app.post('/app/appadv/get_appadv_url.php', (req, res) => {
    //${config.links[0].name},${config.links[0].icon_name},${config.links[0].url},
    res.send(`3,${config.links[0].name},${config.links[0].icon_name},${config.links[0].url},${config.links[1].name},${config.links[1].icon_name},${config.links[1].url},${config.links[2].name},${config.links[2].icon_name},${config.links[2].url},`);
});

app.get('/', (req, res) => {
    res.render('config', { config: res.locals.cfg });
});

app.post('/update', (req, res) => {
    let gold = req.body.gold;
    let silver = req.body.silver;
    let date = req.body.date;
    let pass = req.body.pass;
    if(!gold || !silver || !date || !pass) return res.send(`Missing one or more fields! Try again!`);
    app.locals.configs.set(req.rip, { fish: { gold: gold, silver: silver }, pass: pass, date: date });
    res.send(`All done, now open the app!`);
});

let port = process.env.PORT || config.ports.web;

app.listen(port, () => {
    console.log(`[INFO] Server ready and listening on port ${port}! Proxy listening on port ${config.ports.proxy}`);
});


//http://hpmobile.jp/app/nekoatsume/neko_daily_en.php