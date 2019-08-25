const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/', verify,(req, res) => {
    res.json({
        posts:{
            title: 'A importent post',
            description: 'a random post that you shouldnt access'
        },
        userInfo:{
            info: req.user
        }
    })
})

module.exports = router;