require('dotenv').config();
const abi = require('../utils/QuackContract.json').abi;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const HDWalletProvider = require('truffle-hdwallet-provider');
const provider = new HDWalletProvider(process.env.META_PRIVATE_KEY, process.env.ALCHEMY_API_ADDRESS)
const web3 = createAlchemyWeb3(process.env.ALCHEMY_API_ADDRESS,{ writeProvider: provider});
const AdminService = require('./AdminService');
const contractAddress = process.env.CONTRACT_ADDRESS;
const custodialAddress = process.env.CUSTODIAL_ACCOUNT_ADDRESS;
const contract = new web3.eth.Contract(abi, contractAddress, {
    from: custodialAddress,
});



module.exports = class UserService {
    static async sendQuacks({senderId, receiverId, amount}, res){
        // const response = await 
        contract.methods.sendQuack(senderId, receiverId, amount).send({from:`${custodialAddress}`})
            .once('sent', (payload) => {
                res.send(payload);
            })
            .on('receipt', async () => {
                const removed = await this.removeIfZeroBalance(senderId);
                console.log('removed', removed)
            })
        return 
    }
    static async checkBalance(slackId) {
        const response = await contract.methods.checkBalance(slackId).call().then(result => result);
        return response
    }
    static async burnQuacks({ slackId, amount }) {
        const response = await contract.methods.burnQuacks(slackId, amount).send({from:`${custodialAddress}`}).on('receipt', (receipt) => {return receipt});
        const removed = await this.removeIfZeroBalance(slackId);
        return { 
            response,
            removed 
        };
    }
    static async mintQuacks({ slackId, amount }) {
        const response = await contract.methods.mintQuacks(slackId, amount).send({from:`${custodialAddress}`}).on('receipt', (receipt) => {return receipt});

        return response;
    }
    static async removeIfZeroBalance(slackId) {
        const balance = await this.checkBalance(slackId);
        if(balance <= 0) {
            const accountList = await AdminService.getAccountList();
            const index = accountList.indexOf(slackId);
            const response = await contract.methods.removeUser(index).send({from:`${custodialAddress}`}).on('receipt', receipt => receipt);
            return response;
        }
        return false;
    }
    // static async withdrawQuacks(slackId, amount) {

    // }
}

