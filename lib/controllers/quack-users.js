const { Router } = require('express');
const UserService = require('../services/UserService');

module.exports = Router()
    .post('/send-quacks', async (req, res, next) => {
        try {
            await UserService.sendQuacks(req.body, res);
        } catch (error) {
            next(error)
        }
    })
    .get('/check-balance/:id', async (req, res, next) => {
        try{
            const balance = await UserService.checkBalance(req.params.id);
            res.send(balance);
        } catch(error) {
            next(error)
        }
    })
    .post('/burn-quacks', async (req, res, next) => {
        try {
            await UserService.burnQuacks(req.body, res);
        } catch (error) {
            next(error);
        }
    })
    .post('/mint-quacks', async(req, res, next) => {
        try {
            await UserService.mintQuacks(req.body, res);
        } catch (error) {
            next(error)
        }
    })


