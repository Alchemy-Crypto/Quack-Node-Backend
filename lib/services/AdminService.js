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


module.exports = class AdminService {
    static async getAccountList() {
        const accountList = await contract.methods.getAccountList().call();
        return accountList;
    }
    static async getTotalSupply() {

        const response  = await contract.methods.getTotalSupply().call().then((result) => {return result});
        
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
        console.log('AdminService line 33', response);
        const { members } = await response.json();
        console.log('AdminService line 35: members array', members);
        //get total supply
        const totalSupply = await this.getTotalSupply();

        //calculate quack per member
        const quackPerMember = Math.floor(totalSupply/members.length);
        console.error('AdminService line 41: quackPerMember', quackPerMember);
        //iterate through account list and call distributeCoin method for each slack id
        const verificationArray = [];
        members.forEach( async (member) => {
            const memberVerification = await contract.methods.distributeQuacks(member, quackPerMember).send({from: custodialAddress}).on('receipt', receipt => receipt);
            console.log('inside forEach', memberVerification);
            verificationArray.push(memberVerification);
        });
        // const verificationArray = await Promise.all(members.map( async (member) => {
        //     const memberVerification = await contract.methods.distributeQuacks(member, quackPerMember).send({from: custodialAddress}).on('receipt', receipt => receipt);
        //     console.log('inside promiseAll', memberVerification);
        //     return memberVerification;
        // }));
        console.error('AdminService line 48: verificationArray', verificationArray);
        return verificationArray;
    }

}