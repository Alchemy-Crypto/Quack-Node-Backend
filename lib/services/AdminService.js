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

    static async initialDistribution(res) {
        
        const response = await fetch(`https://slack.com/api/conversations.members?channel=${process.env.SLACK_CHANNEL}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${process.env.SLACK_API_TOKEN}`, 
            }
        })
        const { members } = await response.json();

        const totalSupply = await this.getTotalSupply();
        
        const quackPerMember = Math.floor(totalSupply/members.length);
        
        console.log(`Initial distribution for ${quackPerMember} to ${members.length} members initiated.`)

        res.send(`Initial distribution for ${quackPerMember} to ${members.length} members initiated.`)
        
        const verificationArray = await Promise.allSettled(members.map((member) => {
            return contract.methods.distributeQuacks(member, quackPerMember).send({
                from: custodialAddress,
                gas: 200000,
            });
        }));

        console.log(`${verificationArray.length} distribution transactions completed`);
        const results = verificationArray.reduce((acc, item) => {
            if(item.status === 'fulfilled'){
                acc.fulfilled = acc.fulfilled + 1;
            } else {
                acc.rejected = acc.rejected + 1;
            }
            return acc
        },{
            fulfilled: 0,
            rejected: 0
        })

        console.log(`Distribution results: ${results.fulfilled} fulfilled and ${results.rejected} rejected.`);

        return 
    }

    static async checkContract(){
        return contract
    }

}