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

    static async checkBalance(slackId) {
        const response = await contract.methods.checkBalance(slackId).call().then(result => result);
        return response
    }

    static async sendQuacks({senderId, receiverId, amount}, res){
        contract.methods.sendQuack(senderId, receiverId, amount).send({from:`${custodialAddress}`})
            .once('sent', () => {
                res.send(`Quack transaction initiated from ${senderId} to ${receiverId} in the amount of ${amount}.`);
                console.log(`Quack transaction initiated from ${senderId} to ${receiverId} in the amount of ${amount}.`);
            })
            .on('error', (error) => {
                res.send(`There has been an error sending the transaction. Error: ${error}`);
                console.log(`There has been an error sending the transaction. Error: ${error}`);
            })
            .on('receipt', async () => {
                await this.removeIfZeroBalance(senderId);
                console.log(`Send transaction complete between ${senderId} and ${receiverId} for ${amount}.`)
            })
        return 
    }


    static async burnQuacks({ slackId, amount }, res) {
        contract.methods.burnQuacks(slackId, amount).send({from:`${custodialAddress}`})
            .once('sent', () => {
                res.send(`Quack burn transaction initiated by ${slackId} for ${amount} quacks.`);
                console.log(`Quack burn transaction initiated by ${slackId} for ${amount} quacks.`);
            })
            .on('error', (error) => {
                res.send(`There has been an error sending the transaction. Error: ${error}`);
                console.log(`There has been an error sending the transaction. Error: ${error}`);
            })
            .on('receipt', async() => {
                await this.removeIfZeroBalance(slackId);
                console.log(`Burn transaction complete by ${slackId} for ${amount}.`)
            });
        return 
    }

    static async mintQuacks({ slackId, amount }, res) {
        contract.methods.mintQuacks(slackId, amount).send({from:`${custodialAddress}`})
            .once('sent', () => {
                res.send(`Quack mint transaction initiated by ${slackId} for ${amount} quacks.`);
                console.log(`Quack mint transaction initiated by ${slackId} for ${amount} quacks.`);
            })
            .on('error', () => {
                res.send(`There has been an error sending the transaction. Error: ${error}`);
                console.log(`There has been an error sending the transaction. Error: ${error}`);
            })
            .on('receipt', () => {
                console.log(`Mint transaction complete by ${slackId} for ${amount}.`)
            });
        return;
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
}

