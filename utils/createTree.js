const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const fs = require("fs");

// (1)
const { addresses } = require("./addresses");

// (2)
const tree = StandardMerkleTree.of(addresses, ["address", "uint256"]);

// (3)
console.log('Merkle Root:', tree.root);

// (4)
fs.writeFileSync("./utils/tree.json", JSON.stringify(tree.dump()));
