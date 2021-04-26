require('dotenv').config();
const abi = require('./someFile') // json file in the build folder after truffle compile
const Eth = require('web3-eth');
const contractAddress = '';
const custodialAddress = '';
const eth = new Eth(process.env.INFURA_API_ADDRESS);
const contract = new eth.Contract(abi, contractAddress, {
    from: custodialAddress,
});


module.exports = class UserService {
    static async sendQuacks({senderId, receiverId, amount}){
        const response = await contract.methods.sendQuacks(senderId, receiverId, amount);
        // munge reponse data here
        return mungedResponse;
    }

}