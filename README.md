# Algorand-Multisig-Asset
**Multisig Asset Transaction in Algorand Blockchain**
### Transaction flow

1. **Step1**: Create Asset by Account 1
2. **Step2**: Make OptIn Account (Asset receivable account ) for particular asset to Account 2 and Account 3
3. **Step3**: Make OptIn Account (Asset receivable account ) for particular asset to MultiSig Account
4. **Step4**: Transfer Asset from Account 1 to MultiSig Account
5. **Step5**: Transfer Asset from MultiSig Account to Account 3


### Prerequistics

1. Create 3 Testnet Accounts in Algosigner wallet [Wallet link](https://chrome.google.com/webstore/detail/algosigner/kmmolakhbgdlpkjkcjkebenjheonagdm)
2. Store your Accounts mnemonics in secure way
3. Add some test algo tokens to each account in algorand faucet [fauct link](https://bank.testnet.algorand.network/)
4. Node and npm installation 

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
source ~/.bashrc
nvm install lts/gallium
node --version
npm --version
```



### Clone the project 

```
git clone https://github.com/newlinedeveloper/Algorand-Multisig-Asset.git

cd Algorand-Multisig-Asset
```

### Install Node modules packages

```
npm install 
```

### create .env file from copy of env.example file and add your Algorand Test Accounts Mnemonic

```
HOST=https://testnet-api.algonode.cloud
PORT=443
ACCOUNT_MNEMONIC_1=
ACCOUNT_MNEMONIC_2=
ACCOUNT_MNEMONIC_3=

```


### To start the application 

```
npm run dev
```


