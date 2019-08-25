const router = require('express').Router();
const User = require('../models/User');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');
const postRoute = require('../routes/post');

router.post('/register', async (req, res)=>{

    //validate data before create a user
    const {error} = registerValidation(req.body);
    if (error){
        return res.status(400).send(error.details[0].message);
    }
    
    //checking if the user is already in the database
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist){
        return res.status(400).send('Email are allready exist');
    }

    //hash the passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    })
    try {
        const savedUser = await user.save();
        res.send({
            userId:user.id,
            userName:user.name,
        })
    } catch ( err ) {
        res.status(400).send(err);
    }
});


//login
router.post('/login', async (req, res)=>{
    //validate data before create a user
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
        // const user = await User.findOne({email: req.body.email});
        // if (!user) return res.status(400).send('email not found');

        // console.log('whats happend')
        //checking if the user name is already in the database
        const user = await User.findOne({name: req.body.name});
        if (!user) return res.status(400).send('user name not found');
        //checking if the user email is allready in the database
        // const userEmail = await User.findOne({email: req.body.email});
        // if(!userEmail) return res.status(400).send('email not found');
        //check is password correct?
        const validpass = await bcrypt.compare(req.body.password, user.password);
        if(!validpass) return res.status(400).send('Invlaid password')

        //create and assing a token
        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
        res.header('auth-token', token).send(token);

        // res.send('Logged in!')
});

module.exports = router;