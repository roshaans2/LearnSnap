const express = require("express")
const LearnSnap = require("../models/LearnSnap")
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError")
const router = express.Router()

const {validateSnap,isLoggedIn,isAuthor} = require("../middleware")
const User = require("../models/user")

router.get("/new",isLoggedIn, (req, res) => {
    res.render("snaps/new")
})

router.get("/",isLoggedIn,catchAsync(async (req, res) => {
    const user = await User.findById(req.user.id).populate('snaps')
    const snaps = user.snaps
    res.render("snaps/index", { snaps })
}))

router.get("/:id",isLoggedIn,isAuthor,catchAsync(async (req, res) => {
    const { id } = req.params
    const snap = await LearnSnap.findById(id)
    if(!snap){
        req.flash("error","Cannot find Snap!")
        return res.redirect("/snaps")
    }
    res.render("snaps/show", { snap })
}))

router.get("/:id/edit",isLoggedIn,isAuthor,catchAsync(async (req, res) => {
    const { id } = req.params
    const snap = await LearnSnap.findById(id)
    res.render("snaps/edit", { snap })
}))

router.post("/",isLoggedIn,validateSnap,catchAsync(async (req, res) => {
    const id = req.user.id
    const user = await User.findById(id)
    const snap = LearnSnap(req.body)
    snap.author = id
    user.snaps.push(snap)
    await snap.save()
    await user.save()
    req.flash("success","Successfully added new snap")
    res.redirect("/snaps")
}))

router.put("/:id", isLoggedIn,isAuthor,validateSnap, catchAsync(async (req, res) => {
    const { id } = req.params
    const snap = await LearnSnap.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    req.flash("success","Successfully edited snap")
    res.redirect(`/snaps/${snap.id}`)
}))

router.delete("/:id",isLoggedIn,isAuthor,catchAsync(async (req, res) => {
    const { id } = req.params
    const user = await User.findByIdAndUpdate(req.user.id,{$pull:{snaps:id}})
    await LearnSnap.findByIdAndDelete(id)
    req.flash("success","Successfully deleted snap")
    res.redirect("/snaps")
}))



module.exports = router