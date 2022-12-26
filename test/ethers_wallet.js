const EthersWallet = artifacts.require("EthersWallet");
const { assert } = require('chai');
const truffleAssert = require('truffle-assertions');
  /*
    [*] El owner del contrato debe ser la account 0
    [*] El balance inicial del contrato debe ser 0
    [*] No debo poder realizar el withdraw del contrato sin ser owner
    [*] Debo poder depositar ethers al contrato
    [*] Siendo owner quiero retirar todo el balance y no tengo nada, debe presentarse un error "No tienes nada para retirar"
    [*] Siendo owner quiero retirar todo el balance, siendo el balance actual 1, por lo que el nuevo balance debe ser 0
    [*] Siendo owner quiero retirar 0 
    [*] Siendo owner quiero retirar mas de lo que tengo
    [*] Siendo owner quiero enviar 0 
    [*] Siendo owner quiero enviar mas de lo que tengo
    [*] Siendo owner envio 1 ether a otro address, teniendo 1 ether de balance
  */
contract("EthersWallet", (accounts) => {
  const ownerAddress = accounts[0];
  const otherAddress = accounts[1];
  it(`El owner debe ser ${ownerAddress}`, async () => {
    let EthersWalletInstance = await EthersWallet.deployed();
    let owner = await EthersWalletInstance.getOwner();
    assert.equal(owner,ownerAddress)
  });
  it(`El balance inicial del contrato debe ser 0`, async () => {
    let EthersWalletInstance = await EthersWallet.deployed();
    let balance = await EthersWalletInstance.getBalance();
    assert.equal(balance,0)
  });
  it(`No debe poder realizar withdraw si no es owner`, async () => {
    let EthersWalletInstance = await EthersWallet.deployed();
    await truffleAssert.reverts(EthersWalletInstance.withdrawAll.call({from: otherAddress}),'Ownable: caller is not the owner')
  });
  it(`Siendo owner quiero retirar todo el balance y no tengo nada, debe presentarse un error "No tienes nada para retirar"`, async () => {
    let EthersWalletInstance = await EthersWallet.deployed();
    await truffleAssert.reverts(EthersWalletInstance.withdrawAll(),'No tienes nada para retirar')
  });
  it(`Se deposita al contrato 1 ether, por lo que el nuevo balance debe ser 1 ether`, async () => {
    let EthersWalletInstance = await EthersWallet.deployed();
    let one_eth = web3.utils.toWei("1", 'ether')
    await web3.eth.sendTransaction({from: otherAddress, to: EthersWalletInstance.address, value: one_eth});
    let balance_wei = await web3.eth.getBalance(EthersWalletInstance.address);
    let balance_ether = web3.utils.fromWei(balance_wei, "ether");
    assert.equal(balance_ether,1)
  });
  it(`Siendo owner quiero retirar todo, siendo el balance 1 ether, por lo que debe quedar el balance en 0 ether`, async () => {
    let EthersWalletInstance = await EthersWallet.deployed();
    await EthersWalletInstance.withdrawAll()
    let balance_wei = await web3.eth.getBalance(EthersWalletInstance.address);
    let balance_ether =  web3.utils.fromWei(balance_wei, "ether");
    assert.equal(balance_ether,0)
  });
  it(`Siendo owner quiero retirar más balance del que tengo, debe presentarse un error "No tienes esa cantidad para retirar"`, async () => {
    let EthersWalletInstance = await EthersWallet.deployed();
    let one_eth = web3.utils.toWei("1", 'ether')
    let two_eth = web3.utils.toWei("2", 'ether')
    await web3.eth.sendTransaction({from: otherAddress, to: EthersWalletInstance.address, value: one_eth});
    await truffleAssert.reverts(EthersWalletInstance.withdrawBalance(two_eth),'No tienes esa cantidad para retirar')
  });
  it(`Siendo owner quiero enviar 0 ether a una address, debe presentarse un error "Debes especificar un valor mayor a 0 para enviar"`, async () => {
    /*Se realiza la prueba solo sobre WithdrawTo, debido a que withdrawBalance especifica que debe ser mayor a 0 ether*/
    let EthersWalletInstance = await EthersWallet.deployed();
    await truffleAssert.reverts(EthersWalletInstance.withdrawTo(otherAddress,0),'Debes especificar un valor mayor a 0 para enviar')
  });
  it(`Siendo owner quiero enviar 1 ether a una address, teniendo actualmente 1 ether de balance"`, async () => {
    /*Se realiza la prueba solo sobre WithdrawAll, debido a que los demas withdraw tambien poseen onlyOwner*/
    let EthersWalletInstance = await EthersWallet.deployed();
    let one_eth = web3.utils.toWei("1", 'ether')
    await EthersWalletInstance.withdrawTo(otherAddress,one_eth)
  });
  it(`Siendo owner quiero enviar 1 ether a una address, teniendo actualmente 0 ether de balance, debe presentarse un error "No tienes esa cantidad de ethers para enviar"`, async () => {
    /*Se realiza la prueba solo sobre WithdrawAll, debido a que los demas withdraw tambien poseen onlyOwner*/
    let EthersWalletInstance = await EthersWallet.deployed();
    let one_eth = web3.utils.toWei("1", 'ether')
    await truffleAssert.reverts(EthersWalletInstance.withdrawTo(otherAddress,one_eth),'No tienes esa cantidad de ethers para enviar')
  });
  it(`Siendo owner quiero enviar 1 ether a una address, teniendo actualmente 1 ether de balance`, async () => {
    let EthersWalletInstance = await EthersWallet.deployed();
    let one_eth = web3.utils.toWei("1", 'ether')
    await web3.eth.sendTransaction({from: otherAddress, to: EthersWalletInstance.address, value: one_eth});
    await EthersWalletInstance.withdrawTo(otherAddress,one_eth)
  });
  

}); 
