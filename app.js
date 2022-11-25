// Multisig Asset Transaction from Account 1 to Account 3

// Step1: Create Asset by Account 1
// Step2: Make OptIn Account (Asset receivable account ) for particular asset to Account 2 and Account 3
// Step3: Make OptIn Account (Asset receivable account ) for particular asset to MultiSig Account
// Step4: Transfer Asset from Account 1 to MultiSig Account
// Step5: Transfer Asset from MultiSig Account to Account 3


const algosdk = require('algosdk');
require("dotenv").config();
const { createAsset, MakeOptInAccount, MakeOptInMultisigAccount, TransferAssetToMultisig, TransferAsset} = require("./MultisigAsset")


const token = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const server = process.env.HOST;
const port = process.env.PORT;


let account1_mnemonic = process.env.ACCOUNT_MNEMONIC_1;
let account2_mnemonic = process.env.ACCOUNT_MNEMONIC_2;
let account3_mnemonic = process.env.ACCOUNT_MNEMONIC_3;

var Account1 = algosdk.mnemonicToSecretKey(account1_mnemonic);
var Account2 = algosdk.mnemonicToSecretKey(account2_mnemonic);
var Account3 = algosdk.mnemonicToSecretKey(account3_mnemonic);

console.log("Account 1 => ",Account1.addr);
console.log("Account 2 => ",Account2.addr);
console.log("Account 3 => ",Account3.addr);

// Instantiate the algod wrapper
let algodclient = new algosdk.Algodv2(token, server, port);

 // Setup the parameters for the multisig account
 const mparams = {
    version: 1,
    threshold: 2,
    addrs: [
        Account1.addr,
        Account2.addr,
        Account3.addr,
    ],
};

let multsigaddr = algosdk.multisigAddress(mparams);



const keypress = async () => {
    process.stdin.setRawMode(true)
    return new Promise(resolve => process.stdin.once('data', () => {
        process.stdin.setRawMode(false)
        resolve()
    }))
}



(async () => {

    console.log("Multisig Address: " + multsigaddr);
    console.log("Add funds to account using the TestNet Dispenser: ");
    console.log("https://dispenser.testnet.aws.algodev.network?account=" + multsigaddr);
    console.log("Once funded, press any key to continue");
    await keypress();

    //Create Asset by Account 1
    let assetID = await createAsset(algodclient, Account1);

    // Make OptIn Account for particular asset to Account 2 and Account 3
    await MakeOptInAccount(algodclient, assetID, Account2);
    await MakeOptInAccount(algodclient, assetID, Account3);

    // Make OptIn Account for particular asset to MultiSig Account
    await MakeOptInMultisigAccount(algodclient, assetID, multsigaddr, Account1, Account2, mparams);

    // Transfer Asset from Account 1 to MultiSig Account
    await TransferAssetToMultisig(algodclient, assetID, multsigaddr, Account1, 10);
    
    // Transfer Asset from MultiSig Account to Account 3
    await TransferAsset(algodclient, assetID, multsigaddr, Account1,Account2,Account3, 10 , mparams);
   

})().catch(e => {
    console.log(e);
    console.trace();
});

