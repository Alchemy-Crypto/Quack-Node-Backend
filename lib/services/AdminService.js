require('dotenv').config();
const fetch = require('node-fetch');
const fakeArray = require('../utils/fakeArray');
const abi = require('../utils/QuackContract.json').abi;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const HDWalletProvider = require('truffle-hdwallet-provider');
const provider = new HDWalletProvider(process.env.META_PRIVATE_KEY, process.env.ALCHEMY_API_ADDRESS)
const web3 = createAlchemyWeb3(process.env.ALCHEMY_API_ADDRESS,{ writeProvider: provider});
const contractAddress = process.env.CONTRACT_ADDRESS;
const custodialAddress = process.env.CUSTODIAL_ACCOUNT_ADDRESS;
const contract = new web3.eth.Contract(abi, contractAddress, {
    from: custodialAddress,
});


module.exports = class AdminService {
    static async getAccountList() {
        const accountList = await contract.methods.getAccountList().call();
        return accountList;
    }
    static async getTotalSupply() {
        const response  = await contract.methods.getTotalSupply().call().then(result => result);
        return response;
    }
    static async initialDistribution() {
        //get slack ids from slack
        const response = await fetch(`https://slack.com/api/conversations.members?channel=${process.env.SLACK_CHANNEL}`, {
            method: "GET",
            // "Content-Type": "application/x-www-form-urlencoded",
            headers: {
                Authorization: `Bearer ${process.env.SLACK_API_TOKEN}`, 
            }
        })
        const { members } = await response.json();
        // const members = fakeArray;

        //get total supply
        const totalSupply = await this.getTotalSupply();

        //calculate quack per member
        const quackPerMember = Math.floor(totalSupply/members.length);
        //iterate through account list and call distributeCoin method for each slack id
        const verificationArray = await Promise.allSettled(members.map((member) => {
            return contract.methods.distributeQuacks(member, quackPerMember).send({
                from: custodialAddress,
                gas: 200000,
            });
        }));
        return verificationArray;
    }
    static async checkContract(){
        console.log(contract);
        return contract
    }

}