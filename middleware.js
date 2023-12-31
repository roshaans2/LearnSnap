const { LearnSnapSchema } = require("./schema")
const LearnSnap = require("./models/LearnSnap")

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash("error","You must be signed in")
        return res.redirect("/login")
    }
    next()
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateSnap = (req, res, next) => {

    const { error } = LearnSnapSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next()
    }
}

module.exports.isAuthor = async(req,res,next) => {
    const {id} = req.params
    const snap = await LearnSnap.findById(id)
    if(!snap.author.equals(req.user.id)){
        req.flash("error","You do not have permission to do that")
        return res.redirect("/snaps")
    }
    next()
}