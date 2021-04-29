require('dotenv').config();
const abi = require('../utils/QuackContract.json').abi;
const Eth = require('web3-eth');
const AdminService = require('./AdminService');
const contractAddress = process.env.CONTRACT_ADDRESS;
const custodialAddress = process.env.CUSTODIAL_ACCOUNT_ADDRESS;
Eth.defaultAccount = custodialAddress;
Eth.wallet.add(process.env.META_PRIVATE_KEY)
const eth = new Eth(process.env.INFURA_API_ADDRESS);
const contract = new eth.Contract(abi, contractAddress, {
    from: custodialAddress,
});



module.exports = class UserService {
    static async sendQuacks({senderId, receiverId, amount}){
        const response = await contract.methods.sendQuack(senderId, receiverId, amount).sendTransaction().on('receipt', (receipt) => {return receipt});
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
        const response = await contract.methods.burnQuacks(slackId, amount).sendTransaction().on('receipt', (receipt) => {return receipt});
        const removed = await this.removeIfZeroBalance(slackId);
        return { 
            response,
            removed 
        };
    }
    static async mintQuacks({ slackId, amount }) {
        const response = await contract.methods.mintQuacks(slackId, amount).sendTransaction().on('receipt', (receipt) => {return receipt});

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
            const response = await contract.methods.removeUser(index).sendTransaction().on('receipt', receipt => receipt);
            console.log('response line 66',response)
            return response;
        }
        return false;
    }
    // static async withdrawQuacks(slackId, amount) {

    // }
}

