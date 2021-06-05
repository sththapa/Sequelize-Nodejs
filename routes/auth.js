const Customer = require('../models/Customer')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Joi = require('@hapi/joi')
const express = require('express')
const router = express.Router()
require('dotenv').config()
const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required()
})

router.post('/register', async function (req, res) {
    const { error } = schema.validate(req.body)
    if (error) {
        res.status(400).json(error.details[0].message)
    }
    try {
        const user = await Customer.findOne({ where: { email: req.body.email } })
        if (user) {
            res.status(400).json('Email has already been registered')
        }
        else {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(req.body.password, salt)
            const customer = await Customer.create({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            })
            res.status(201).json(customer)
        }
    }
    catch (err) {
        res.status(500).json(err)
    }
})
router.post('/login', async function (req, res) {
    const { error } = schema.validate(req.body)
    if (error) {
        res.status(400).json(error.details[0].message)
    }
    try {
        const user = await Customer.findOne({ where: { email: req.body.email } })
        if (!user) {
            res.status(400).json('This email has not been registered, please register first')
        }
        matchPassword = await bcrypt.compare(req.body.password, user.password)
        if (!matchPassword) {
            res.status(400).json('Invalid Password')
        }

        const token = jwt.sign({ id: user.id }, process.env.TOKEN_ID)
        res.header('jwt', token).json(token)
    }
    catch (err) {
        res.status(500).json(err)
    }
})
module.exports = router