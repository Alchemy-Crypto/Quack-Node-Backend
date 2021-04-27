require('dotenv').config();
const abi = require('../utils/QuackContract.json').abi;
const Eth = require('web3-eth');
const contractAddress = '0x4D7Ea803d47EC1ab15F6faF2AD4A5054dbd0D181';
const custodialAddress = '0x2779818Dd5b3b79acDEb2961b6b2372E65bc0e18';
const eth = new Eth('HTTP://127.0.0.1:7545');
const contract = new eth.Contract(abi, contractAddress, {
    from: custodialAddress,
});


module.exports = class UserService {
    static async sendQuacks({senderId, receiverId, amount}){
        const response = await contract.methods.sendQuack(senderId, receiverId, amount).send({ from: custodialAddress }).on('receipt', (receipt) => {return receipt});
        // munge response data here

        console.log('YOOOOOOOOOOOO', response);
        return response;
    }

    static async checkBalance({slackId}) {
        const response = await contract.methods.checkBalance(slackId).call().then((result) => {return result});
        
        // munge response data here

        console.log('YOOOOOOOOOOOO', response);
        return response

    }

    static async burnQuacks(slackId, amount) {
        const response = await contract.methods.burnQuacks(slackId, amount).send({ from: custodialAddress }).on('receipt', (receipt) => {return receipt});

         // munge response data here


        console.log('YOOOOOOOOOOOO', response);
        return response;
    }

    static async mintQuacks(slackId, amount) {
        const response = await contract.methods.mintQuacks(slackId, amount).send({ from: custodialAddress }).on('receipt', (receipt) => {return receipt});

         // munge response data here

         console.log('YOOOOOOOOOOOO', response);
         return response;
    }
    
    static async getTotalSupply() {
        console.log(contract);

        const response  = await contract.methods.getTotalSupply().call().then((result) => {return result});
        
         // munge response data here

         console.log('YOOOOOOOOOOOO', response);
         return response;
    }

    // static async withdrawQuacks(slackId, amount) {

    // }
}