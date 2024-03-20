// import { createPublicClient, http } from 'viem'
// import { klaytnBaobab } from 'viem/chains'
const { createPublicClient, http } = require('viem');
const { klaytnBaobab } = require('viem/chains');
const snarkjs = require("snarkjs");

const client = createPublicClient({ 
  chain: klaytnBaobab, 
  transport: http("https://klaytn-baobab-rpc.allthatnode.com:8551"), 
}) 


const abi =  [
    {
        "inputs": [
            {
                "internalType": "uint256[2]",
                "name": "_pA",
                "type": "uint256[2]"
            },
            {
                "internalType": "uint256[2][2]",
                "name": "_pB",
                "type": "uint256[2][2]"
            },
            {
                "internalType": "uint256[2]",
                "name": "_pC",
                "type": "uint256[2]"
            },
            {
                "internalType": "uint256[1]",
                "name": "_pubSignals",
                "type": "uint256[1]"
            }
        ],
        "name": "verifyProof",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]


async function readFromContract() {
    //const { proof, publicSignals } = await snarkjs.groth16.fullProve({a: 10, b: 21}, "./compile/circuit_js/circuit.wasm", "./zkey/circuit_final.zkey");
    const { proof, publicSignals } = await snarkjs.groth16.prove("./zkey/circuit_final.zkey", "./compile/witness.wtns");
    const proofA = [proof.pi_a[0], proof.pi_a[1]];
    const proofB = [[proof.pi_b[0][1], proof.pi_b[0][0]], [proof.pi_b[1][1], proof.pi_b[1][0]]];
    const proofC = [proof.pi_c[0], proof.pi_c[1]];
    const verifyProof = await client.readContract({
        address: "0x0ADaa97f7Aac40EFB4749368361140e3a8f5AaC5",  // Contract Address
        abi: abi,
        functionName: 'verifyProof',
        args:[proofA, proofB, proofC, publicSignals]
    })

    console.log(`Value read from contract is: ${verifyProof}`);
}
readFromContract();