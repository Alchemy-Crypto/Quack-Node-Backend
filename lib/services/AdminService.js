require('dotenv').config();
const fetch = require('node-fetch');
const abi = require('../utils/QuackContract.json').abi;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(process.env.ALCHEMY_API_ADDRESS);
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
        console.log('adminService line 19 made it into function')
        const response  = await contract.methods.getTotalSupply().call().then(result => result);
        console.log('adminService line 21 response:', response)

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
        //get total supply
        const totalSupply = await this.getTotalSupply();

        //calculate quack per member
        const quackPerMember = Math.floor(totalSupply/members.length);
        //iterate through account list and call distributeCoin method for each slack id
        const verificationArray = [];
        members.forEach( async (member) => {
            const memberVerification = await contract.methods.distributeQuacks(member, quackPerMember).send({from:`${custodialAddress}`}).on('receipt', receipt => receipt);
            
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
    static async checkContract(){
        console.log(contract);
        return contract
    }

}