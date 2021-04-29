const { Router } = require('express');
const AdminService = require('../services/AdminService');

module.exports = Router()
    .get('/distribute-quacks', async(req, res, next) => {
        try {
            const verificationArray = await AdminService.initialDistribution();
            console.log('controller line 8', verificationArray);
            res.send(verificationArray);
        } catch (error) {
            next(error)
        }
    })
    .get('/account-list', async(req, res, next) => {
        try {
            const accountList = await AdminService.getAccountList();
            res.send(accountList);
        } catch (error) {
            next(error)
        }
    })
    .get('/backend-test', async(req, res, next) => {
        try {
            await AdminService.checkContract();
            res.send(contract);
        } catch (error) {
            next(error)
        }
    })
