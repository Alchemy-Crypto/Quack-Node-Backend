const { Router } = require('express');
const UserService = require('../services/UserService');

module.exports = Router()
    //sendCoins - POST - require sender slack id, receiver slack id and amount(obj in body), returns a success message or bool
    .post('/send-quacks', async (req, res, next) => {
        try {
            const transaction = await UserService.sendQuacks(req.body);
            res.send(transaction);

        } catch (error) {
            next(error)
        }
    })
    // checkBalance - GET - require sender slack id, return an int or an obj such as {id: 234234, balance: 444}
    .get('/check-balance/:id', async (req, res, next) => {
        try{
            const balance = await UserService.checkBalance(req.params.id);
            res.send(balance);
        } catch(error) {
            next(error)
        }
    })
    // viewTransactions - GET require slackId and number of transactions, return an array of some sort
    // .get('/', async (req, res, next) => {
    //     try {

    //     } catch() {
    //         next()
    //     }
    // })
    // burnCoins - POST - require slackID and number of coins, return a bool or success message
    .post('/burn-quacks', async (req, res, next) => {
        try {
            const burnRes = await UserService.burnQuacks(req.body);
            res.send(burnRes)
        } catch (error) {
            next(error);
        }
    })
    //mintCoins - POST - require a slack id and number of coins to mint, return success message and/or users balance/total supply
    .post('/mint-quacks', async(req, res, next) => {
        try {
            const mintedRes = await UserService.mintQuacks(req.body);
            res.send(mintedRes);
        } catch (error) {
            next(error)
        }
    })
    //withdrawCoins - POST - require a slack id, an ethereum address and an amount, returns success message and new balance
    .post('/withdraw-quacks', async(req, res, next) => {
        try {
            const withdrawRes = await UserService.withdrawQuacks(req.body);
            res.send(withdrawRes);
        } catch (error) {
            next(error)
        }
    })

