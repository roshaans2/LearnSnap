const express = require("express")
const mongoose = require("mongoose")
const app = express()
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError")
const Joi = require("joi")
const snaps = require("./routes/snaps")
const session = require("express-session")
const flash = require("connect-flash")


require("dotenv").config()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', ejsMate)

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname,'public')))

const sessionConfig = {
    secret: process.env.secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use((req,res,next)=>{
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use("/snaps",snaps)

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("DB Connected")
    })
    .catch(err => {
        console.log("Error")
        console.log(err)
    })

app.all("*",(req,res,next)=>{
    next(new ExpressError('Page Not Found',404))
})

app.use((err,req,res,next)=>{
    const {statusCode = 500} = err
    if(!err.message){
        err.message = "Something went wrong"
    }
    res.status(statusCode).render('error',{err})
})



app.listen(8000, () => {
    console.log("Server running at port 8000")
})