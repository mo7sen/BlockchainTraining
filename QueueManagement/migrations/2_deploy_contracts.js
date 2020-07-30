const Queue = artifacts.require("Queue");

module.exports = function (deployer) {
  deployer.deploy(Queue);
};
