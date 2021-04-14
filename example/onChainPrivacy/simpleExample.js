const Web3 = require("web3");
const Web3Quorum = require("../../src");

const Utils = require("../helpers.js");
const { orion, besu } = require("../keys.js");

const node1 = new Web3Quorum(new Web3(besu.node1.url));
const node2 = new Web3Quorum(new Web3(besu.node2.url));

module.exports = async () => {
  const onChainPrivacyGroupCreationResult = await node1.privx.createPrivacyGroup(
    {
      participants: [orion.node1.publicKey, orion.node2.publicKey],
      enclaveKey: orion.node1.publicKey,
      privateFrom: orion.node1.publicKey,
      privateKey: besu.node1.privateKey,
    }
  );
  console.log("CREATION RESULT");
  console.log(onChainPrivacyGroupCreationResult);

  await node2.priv.getTransactionReceipt(
    onChainPrivacyGroupCreationResult.commitmentHash,
    orion.node2.publicKey
  );

  const findResult = await node2.privx.findOnChainPrivacyGroup({
    addresses: [orion.node1.publicKey, orion.node2.publicKey],
  });
  Utils.logMatchingGroup(
    findResult,
    onChainPrivacyGroupCreationResult.privacyGroupId
  );
};

if (require.main === module) {
  module.exports().catch((error) => {
    console.log(error);
    console.log(
      "\nThis example requires ONCHAIN privacy to be ENABLED. \nCheck config for ONCHAIN privacy groups."
    );
  });
}
