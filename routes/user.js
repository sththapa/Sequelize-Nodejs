const Customer = require('../models/Customer')
const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router()
//update user account here
router.put('/:id', async function (req, res) {
    if (req.body.userId === req.params.id) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password, salt)
            }
            catch (err) {
                res.status(500).json(err)
            }
        }
        try {
            const user = await Customer.findOne({ where: { id: req.params.id } })
            if (user) {
                const updatedUser = await user.update(req.body)
                res.status(200).json('Account has been updated')
            }
        }
        catch (err) {
            res.send(500).json(err)
        }
    }
    else {
        return res.status(401).json('You can only updated your account')
    }
})
//delete a user
router.delete('/:id', async function (req, res) {
    if (req.body.userId === req.params.id) {
        try {
            const user = await Customer.findOne({ where: { id: req.params.id } })
            if (user) {
                const deletedUser = await user.destroy(req.body)
                res.status(200).json('Account has been deleted')
            }
        }
        catch (err) {
            res.send(500).json(err)
        }
    }
    else {
        return res.status(401).json('You can only delete your account')
    }
})
//get all users data
router.get('/', async function (req, res) {
    try {
        const allUsers = await Customer.findAll()
        res.status(200).json(allUsers)
    }
    catch (err) {
        res.status(400).json(err)
    }


})
module.exports = router