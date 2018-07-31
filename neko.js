const router = require('express').Router();

router.post('/neko_daily_en.php', (req, res) => {
    //1,Password,Silver,Gold,YYYY-MM-DD,
    let gold = res.locals.cfg.fish.gold;
    let silver = res.locals.cfg.fish.silver;
    let date = res.locals.cfg.date;
    let pass = res.locals.cfg.pass;
    res.send(`1,${pass},${silver},${gold},${date},`);
    //res.send('1,Daisy,1000,100,2018-02-24,');
});

router.post('/neko_aikotoba_en.php', (req, res) => {
    //2,YYYY-MM-DD,Silver,Gold,
    let passAtt = req.query.aiko;
    let gold = res.locals.cfg.fish.gold;
    let silver = res.locals.cfg.fish.silver;
    let date = res.locals.cfg.date;
    let pass = res.locals.cfg.pass;
    res.send(`2,${date},${silver},${gold},`);
    //res.send('2,2018-02-25,1000,100,'); 
});

module.exports = router;