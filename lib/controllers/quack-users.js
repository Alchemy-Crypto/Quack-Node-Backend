const { Router } = require('express');
const UserService = require('../services/UserService');

module.exports = Router()
    //sendCoins - POST - require sender slack id, receiver slack id and amount(obj in body), returns a success message or bool
    .post('/send-quacks', (req, res, next) => {
        try {

            const transaction = UserService.sendQuacks(req.body);
            res.send(transaction);

        } catch (error) {
            next(error)
        }
    })
    // checkBalance - GET - require sender slack id, return an int or an obj such as {id: 234234, balance: 444}
    
    // viewTransactions - GET require slackId and number of transactions, return an array of some sort

    // burnCoins - POST - require slackID and number of coins, return a bool or success message

    //mintCoins - POST - require a slack id and number of coins to mint, return success message and/or users balance/total supply

    //withdrawCoins - POST - require a slack id, an ethereum address and an amount, returns success message and new balance

    