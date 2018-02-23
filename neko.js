const router = require('express').Router();

router.post('/neko_daily_en.php', (req, res) => {
    //1,Password,Silver,Gold,YYYY-MM-DD,
    res.send('1,Daisy,1000,100,2018-02-24,');
});

router.post('/neko_aikotoba_en.php', (req, res) => {
    //2,YYYY-MM-DD,Silver,Gold,
    console.log(req.query);
    let pass = req.query.aiko;
    if(!pass === 'Daisy') return res.send('0');
    res.send('2,2018-02-25,1000,100,'); 
});

module.exports = router;