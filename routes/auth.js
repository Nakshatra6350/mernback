const router = require("express").Router();
const User = require("../models/User");
//to encrypt our pssword we use bcrypt,salt and hash.
const bcrypt = require('bcrypt');


//register
router.post("/register", async (req,res) => {
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);
        //upper teo lines are for caluclating hash of password to keep it safe by defining number of rounds
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        const user = await newUser.save();
        console.log("Registered successfully : ", user);
        res.status(200).json(user);

    } catch(err){
        res.status(500).json(err);
    }
});

//login
router.post("/login", async (req,res) => {
    try{
        const user = await User.findOne({username:req.body.username});
        !user && res.status(400).json("Wrong Credentials");

        const validate = await bcrypt.compare(req.body.password,user.password);
        !validate && res.status(400).json("Wrong Credentials");

        //to prevent password showing in postman response we use below line and pass others to the json.,,we can see it in logs.
        const {password, ...others} = user._doc;

        console.log("LoggedIn successfully : ", user);
        res.status(200).json(others);
        
    }catch(error){
        res.status(500).json(error);
    }
});


module.exports = router;