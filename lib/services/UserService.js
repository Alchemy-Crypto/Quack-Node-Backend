require('dotenv').config();
const abi = require('../utils/QuackContract.json').abi;
const Eth = require('web3-eth');
const AdminService = require('./AdminService');
const contractAddress = process.env.CONTRACT_ADDRESS;
const custodialAddress = process.env.CUSTODIAL_ACCOUNT_ADDRESS;
const eth = new Eth('HTTP://127.0.0.1:7545');
const contract = new eth.Contract(abi, contractAddress, {
    from: custodialAddress,
});



module.exports = class UserService {
    static async sendQuacks({senderId, receiverId, amount}){
        const response = await contract.methods.sendQuack(senderId, receiverId, amount).send({ from: custodialAddress }).on('receipt', (receipt) => {return receipt});
        const removed = await this.removeIfZeroBalance(senderId);
        console.log('line 18', removed)
        return { 
            response,
            removed 
        };;
    }

    static async checkBalance(slackId) {
        const response = await contract.methods.checkBalance(slackId).call().then(result => result);
        
        return response

    }

    static async burnQuacks({ slackId, amount }) {
        const response = await contract.methods.burnQuacks(slackId, amount).send({ from: custodialAddress }).on('receipt', (receipt) => {return receipt});
        const removed = await this.removeIfZeroBalance(slackId);
        return { 
            response,
            removed 
        };
    }

    static async mintQuacks({ slackId, amount }) {
        const response = await contract.methods.mintQuacks(slackId, amount).send({ from: custodialAddress }).on('receipt', (receipt) => {return receipt});

        return response;
    }
    
    static async getTotalSupply() {

        const response  = await contract.methods.getTotalSupply().call().then((result) => {return result});
        
        return response;
    }
    static async removeIfZeroBalance(slackId) {
        const balance = await this.checkBalance(slackId);
        if(balance <= 0) {
            console.log('line 60', "balance is zero or less", balance)
            const accountList = await AdminService.getAccountList();
            console.log("accountList", accountList);
            const index = accountList.indexOf(slackId);
            console.log("index", index);
            const response = await contract.methods.removeUser(index).send({from: custodialAddress }).on('receipt', receipt => receipt);
            console.log('response line 66',response)
            return response;
        }
        return false;
    }
    // static async withdrawQuacks(slackId, amount) {

    // }
}

