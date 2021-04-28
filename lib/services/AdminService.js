require('dotenv').config();
const abi = require('../utils/QuackContract.json').abi;
const Eth = require('web3-eth');
const contractAddress = process.env.CONTRACT_ADDRESS;
const custodialAddress = process.env.CUSTODIAL_ACCOUNT_ADDRESS;
const eth = new Eth(process.env.INFURA_API_ADDRESS);
const contract = new eth.Contract(abi, contractAddress, {
    from: custodialAddress,
});
const fetch = require('node-fetch');
const UserService = require('./UserService')


module.exports = class AdminService {
    static async getAccountList() {
        const accountList = await contract.methods.getAccountList().call();
        return accountList;
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

        //get total supply
        const totalSupply = await UserService.getTotalSupply();
        //calculate quack per member
        const quackPerMember = Math.floor(totalSupply/members.length);
        //iterate through account list and call distributeCoin method for each slack id
        const verificationArray = await Promise.all(members.map( async(member) => {
            const memberVerification = await contract.methods.distributeQuacks(member, quackPerMember).send({from: custodialAddress}).on('receipt', receipt => receipt);
            return memberVerification;
        }));
        return verificationArray;
    }

}