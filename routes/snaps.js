const express = require("express")
const LearnSnap = require("../models/LearnSnap")
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError")
const { LearnSnapSchema } = require("../schema")
const router = express.Router()

const validateSnap = (req, res, next) => {

    const { error } = LearnSnapSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next()
    }
}


router.get("/new", (req, res) => {
    res.render("snaps/new")
})

router.get("/", catchAsync(async (req, res) => {
    const snaps = await LearnSnap.find({})
    res.render("snaps/index", { snaps })
}))

router.get("/:id",catchAsync(async (req, res) => {
    const { id } = req.params
    const snap = await LearnSnap.findById(id)
    if(!snap){
        req.flash("error","Cannot find Snap!")
        return res.redirect("/snaps")
    }
    res.render("snaps/show", { snap })
}))

router.get("/:id/edit",catchAsync(async (req, res) => {
    const { id } = req.params
    const snap = await LearnSnap.findById(id)
    res.render("snaps/edit", { snap })
}))

router.post("/",  validateSnap,catchAsync(async (req, res) => {
    const snap = LearnSnap(req.body)
    await snap.save()
    req.flash("success","Successfully added new snap")
    res.redirect("/snaps")
}))

router.put("/:id", validateSnap, catchAsync(async (req, res) => {
    const { id } = req.params
    const snap = await LearnSnap.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    req.flash("success","Successfully edited snap")
    res.redirect(`/snaps/${snap.id}`)
}))

router.delete("/:id", catchAsync(async (req, res) => {
    const { id } = req.params
    await LearnSnap.findByIdAndDelete(id)
    req.flash("success","Successfully deleted snap")
    res.redirect("/snaps")
}))



module.exports = router