var EthersWallet = artifacts.require("EthersWallet");

module.exports = function(deployer) {
  deployer.deploy(EthersWallet);
};