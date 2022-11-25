const algosdk = require('algosdk');
require("dotenv").config();


// Create Asset 
const createAsset = async (algodclient,account) => {
    console.log("Create Asset => ", account.addr);

    let params = await algodclient.getTransactionParams().do();

    let note = undefined; 
    let addr = account.addr;
    let defaultFrozen = false;
    let decimals = 0;
    let totalIssuance = 1000;
    let unitName = "BLOCK";   
    let assetName = "blockchain";
    let assetURL = "https://www.algorand.com/";
    let assetMetadataHash = "16efaa3924a6fd9d3a4824799a4ac65d";
    let manager = account.addr;
    let reserve = account.addr;
    let freeze = account.addr;
    let clawback = account.addr;

    let txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
        addr, 
        note,
        totalIssuance, 
        decimals, 
        defaultFrozen, 
        manager, 
        reserve, 
        freeze,
        clawback, 
        unitName, 
        assetName, 
        assetURL, 
        assetMetadataHash, 
        params);
    
    let rawSignedTxn = txn.signTxn(account.sk)
    let tx = (await algodclient.sendRawTransaction(rawSignedTxn).do());

    let assetID = null;
    const ptx = await algosdk.waitForConfirmation(algodclient, tx.txId, 4);
    assetID = ptx["asset-index"];
    console.log("Transaction " + tx.txId + " confirmed in round " + ptx["confirmed-round"]);
       
    await printCreatedAsset(algodclient, account.addr, assetID);
    await printAssetHolding(algodclient, account.addr, assetID);

    return assetID;
}

// Make the account is optin for particular asset 
const MakeOptInAccount = async(algodclient,assetID,account) =>{
    console.log("Make Optin Acount => "+account.addr+ " Assset ID => "+ assetID)
   
    let params = await algodclient.getTransactionParams().do();
    let note=  undefined;

    let sender = account.addr;
    let recipient = sender;
    let revocationTarget = undefined;
    let closeRemainderTo = undefined;
    let amount = 0;

    let opttxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
        sender, 
        recipient, 
        closeRemainderTo, 
        revocationTarget,
        amount, 
        note, 
        assetID, 
        params);

    rawSignedTxn = opttxn.signTxn(account.sk);
    let opttx = (await algodclient.sendRawTransaction(rawSignedTxn).do());
    confirmedTxn = await algosdk.waitForConfirmation(algodclient, opttx.txId, 4);
    console.log("Transaction " + opttx.txId + " confirmed in round " + confirmedTxn["confirmed-round"]);

    await printAssetHolding(algodclient, account.addr, assetID);
}

// Make multisig account is optin for particular asset 
const MakeOptInMultisigAccount = async(algodclient,assetID,multsigaddr,account1,account2, mparams) =>{
    console.log("Make Optin Multisig Account => "+multsigaddr+ " Assset ID => "+ assetID)
   
    let params = await algodclient.getTransactionParams().do();
    let note=  undefined;

    let sender = multsigaddr;
    let recipient = sender;
    let revocationTarget = undefined;
    let closeRemainderTo = undefined;
    let amount = 0;
    
    let opttxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
        sender, 
        recipient, 
        closeRemainderTo, 
        revocationTarget,
        amount, 
        note, 
        assetID, 
        params);

    // sign with first account
    let rawSignedTxn = algosdk.signMultisigTransaction(opttxn, mparams, account1.sk).blob;
    //sign with second account
    let twosigs = algosdk.appendSignMultisigTransaction(rawSignedTxn, mparams, account2.sk).blob;

    let opttx = (await algodclient.sendRawTransaction(twosigs).do());
    confirmedTxn = await algosdk.waitForConfirmation(algodclient, opttx.txId, 4);
    console.log("Transaction " + opttx.txId + " confirmed in round " + confirmedTxn["confirmed-round"]);

    await printAssetHolding(algodclient, multsigaddr, assetID);
}

// Transfer asset to multisig account 
const TransferAssetToMultisig = async (algodclient, assetID, multsigaddr, account1, amountVal) => {

    console.log("Transfer Asset from "+account1.addr+" => "+ multsigaddr)
    params = await algodclient.getTransactionParams().do();
   
    let sender = account1.addr;
    let recipient = multsigaddr;
    let revocationTarget = undefined;
    let closeRemainderTo = undefined;
    let amount = amountVal;

    let note = undefined;

    let xtxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
        sender, 
        recipient, 
        closeRemainderTo, 
        revocationTarget,
        amount,  
        note, 
        assetID, 
        params);


    let rawSignedTxn = xtxn.signTxn(account1.sk)
    let xtx = (await algodclient.sendRawTransaction(rawSignedTxn).do());
    let confirmedTxn = await algosdk.waitForConfirmation(algodclient, xtx.txId, 4);
    console.log("Transaction " + xtx.txId + " confirmed in round " + confirmedTxn["confirmed-round"]);
    await printAssetHolding(algodclient, multsigaddr, assetID);
}

// Transfer asset from multisig to receiver account 
const TransferAsset = async (algodclient, assetID, multsigaddr, account1, account2, account3, amountVal, mparams) => {

    console.log("Transfer Asset from "+multsigaddr+" => "+ account3.addr)
    params = await algodclient.getTransactionParams().do();
   
    sender = multsigaddr;
    recipient = account3.addr;
    revocationTarget = undefined;
    closeRemainderTo = undefined;
    amount = amountVal;

    let note = undefined;

    let xtxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
        sender, 
        recipient, 
        closeRemainderTo, 
        revocationTarget,
        amount,  
        note, 
        assetID, 
        params);

    // sign with first account
    let rawSignedTxn = algosdk.signMultisigTransaction(xtxn, mparams, account1.sk).blob;
    //sign with second account
    let twosigs = algosdk.appendSignMultisigTransaction(rawSignedTxn, mparams, account2.sk).blob;

    let xtx = (await algodclient.sendRawTransaction(twosigs).do());
    confirmedTxn = await algosdk.waitForConfirmation(algodclient, xtx.txId, 4);
    console.log("Transaction " + xtx.txId + " confirmed in round " + confirmedTxn["confirmed-round"]);
    await printAssetHolding(algodclient, account3.addr, assetID);
    console.log("Transaction Completed Successfully")
}




// Function used to print created asset for account and assetid
const printCreatedAsset = async function (algodclient, account, assetid) {
    let accountInfo = await algodclient.accountInformation(account).do();
    for (idx = 0; idx < accountInfo['created-assets'].length; idx++) {
        let scrutinizedAsset = accountInfo['created-assets'][idx];
        if (scrutinizedAsset['index'] == assetid) {
            console.log("AssetID = " + scrutinizedAsset['index']);
            let myparms = JSON.stringify(scrutinizedAsset['params'], undefined, 2);
            console.log("parms = " + myparms);
            break;
        }
    }
};
// Function used to print asset holding for account and assetid
const printAssetHolding = async function (algodclient, account, assetid) {
    let accountInfo = await algodclient.accountInformation(account).do();
    for (idx = 0; idx < accountInfo['assets'].length; idx++) {
        let scrutinizedAsset = accountInfo['assets'][idx];
        if (scrutinizedAsset['asset-id'] == assetid) {
            let myassetholding = JSON.stringify(scrutinizedAsset, undefined, 2);
            console.log("assetholdinginfo = " + myassetholding);
            break;
        }
    }
};



module.exports = {
    createAsset,
    MakeOptInAccount,
    MakeOptInMultisigAccount,
    TransferAssetToMultisig,
    TransferAsset
}

