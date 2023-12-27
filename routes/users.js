const express = require("express")
const router = express.Router()
const User = require("../models/user")
const catchAsync = require("../utils/catchAsync")
const passport = require("passport")
const { storeReturnTo } = require('../middleware');

router.get("/",(req,res)=>{
    res.redirect("/register")
})

router.get("/register",(req,res)=>{
    res.render("users/register")
})

router.post("/register",catchAsync(async(req,res,next)=>{
    try{
        const {email,username,password} = req.body
        const user = User({email,username})
        const registeredUser = await User.register(user,password)
        req.login(registeredUser,err=>{
            if(err) return next(err)
            req.flash("success","Welcome to LearnSnap")
            res.redirect("/snaps")
        })
    }
    catch(e){
        req.flash("error",e.message)
        res.redirect("/register")
    }
}))

router.get("/login",(req,res)=>{
    res.render("users/login")
})

router.post("/login", storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),catchAsync(async(req,res)=>{
    req.flash("success","Welcome Back")
    const redirectUrl = res.locals.returnTo || '/snaps';
    res.redirect(redirectUrl)
}))

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/snaps');
    });
});


module.exports = router