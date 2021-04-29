const { Router } = require('express');
const AdminService = require('../services/AdminService');

module.exports = Router()
    .get('/distribute-quacks', async(req, res, next) => {
        try {
            const verificationArray = await AdminService.initialDistribution();
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
            const contract = await AdminService.checkContract();
            res.send(contract);
        } catch (error) {
            next(error)
        }
    })
    .get('/total-supply', async (req, res, next) => {
        try {
            const totalSupply = await AdminService.getTotalSupply();
            res.send(totalSupply);
        } catch (error) {
            next(error)
        }
    })
