# ptau(powers of tau)
- snarkjs powersoftau new bn128 14 ./ptau/pot14_0000.ptau -v
- snarkjs powersoftau contribute ./ptau/pot14_0000.ptau ./ptau/pot14_0001.ptau --name="First contribution" -v
    - input key exist
- snarkjs powersoftau contribute ./ptau/pot14_0001.ptau ./ptau/pot14_0002.ptau --name="Second contribution" -v -e="some random text"
- snarkjs powersoftau export challenge ./ptau/pot14_0002.ptau ./ptau/challenge_0003
- snarkjs powersoftau challenge contribute bn128 ./ptau/challenge_0003 ./ptau/response_0003 -e="some random text"
- snarkjs powersoftau import response ./ptau/pot14_0002.ptau ./ptau/response_0003 ./ptau/pot14_0003.ptau -n="Third contribution name"
- snarkjs powersoftau verify ./ptau/pot14_0003.ptau
    ```
    [INFO]  snarkJS: Powers Of tau file OK!
    [ERROR] snarkJS: DOMException [QuotaExceededError]: The requested length exceeds 65,536 bytes
    at new DOMException (node:internal/per_context/domexception:53:5)
    at __node_internal_ (node:internal/util:695:10)
    at Crypto.getRandomValues (node:internal/crypto/random:328:11)
    at Crypto.getRandomValues (node:internal/crypto/webcrypto:999:10)
    at getRandomBytes (/usr/local/lib/node_modules/snarkjs/build/cli.cjs:285:27)
    at processSection (/usr/local/lib/node_modules/snarkjs/build/cli.cjs:1923:29)
    at async verify (/usr/local/lib/node_modules/snarkjs/build/cli.cjs:1737:19)
    at async Object.powersOfTauVerify [as action] (/usr/local/lib/node_modules/snarkjs/build/cli.cjs:13237:17)
    at async clProcessor (/usr/local/lib/node_modules/snarkjs/build/cli.cjs:481:27)
    ```
- snarkjs powersoftau beacon ./ptau/pot14_0003.ptau ./ptau/pot14_beacon.ptau 0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f 10 -n="Final Beacon"
- snarkjs powersoftau prepare phase2 ./ptau/pot14_beacon.ptau ./ptau/pot14_final.ptau -v
- snarkjs powersoftau verify ./ptau/pot14_final.ptau
    ```
    [INFO]  snarkJS: Powers Of tau file OK!
    [ERROR] snarkJS: DOMException [QuotaExceededError]: The requested length exceeds 65,536 bytes
    at new DOMException (node:internal/per_context/domexception:53:5)
    at __node_internal_ (node:internal/util:695:10)
    at Crypto.getRandomValues (node:internal/crypto/random:328:11)
    at Crypto.getRandomValues (node:internal/crypto/webcrypto:999:10)
    at getRandomBytes (/usr/local/lib/node_modules/snarkjs/build/cli.cjs:285:27)
    at processSection (/usr/local/lib/node_modules/snarkjs/build/cli.cjs:1923:29)
    at async verify (/usr/local/lib/node_modules/snarkjs/build/cli.cjs:1737:19)
    at async Object.powersOfTauVerify [as action] (/usr/local/lib/node_modules/snarkjs/build/cli.cjs:13237:17)
    at async clProcessor (/usr/local/lib/node_modules/snarkjs/build/cli.cjs:481:27)
    ```
# circuit
- circom ./circuit/circuit.circom --r1cs --wasm --sym -o ./compile
- snarkjs r1cs info ./compile/circuit.r1cs
- snarkjs r1cs print ./compile/circuit.r1cs ./compile/circuit.sym
- snarkjs r1cs export json ./compile/circuit.r1cs ./compile/circuit.r1cs.json
- node ./compile/circuit_js/generate_witness.js ./compile/circuit_js/circuit.wasm input.json ./compile/witness.wtns
- snarkjs wtns check ./compile/circuit.r1cs ./compile/witness.wtns

# setup
- snarkjs groth16 setup ./compile/circuit.r1cs ./ptau/pot14_final.ptau ./zkey/circuit_0000.zkey
- snarkjs zkey contribute ./zkey/circuit_0000.zkey ./zkey/circuit_0001.zkey --name="1st Contributor Name" -v
    - input key exist
- snarkjs zkey contribute ./zkey/circuit_0001.zkey ./zkey/circuit_0002.zkey --name="Second contribution Name" -v -e="Another random entropy"
- snarkjs zkey export bellman ./zkey/circuit_0002.zkey  ./zkey/challenge_phase2_0003
- snarkjs zkey bellman contribute bn128 ./zkey/challenge_phase2_0003 ./zkey/response_phase2_0003 -e="some random text"
- snarkjs zkey import bellman ./zkey/circuit_0002.zkey ./zkey/response_phase2_0003 ./zkey/circuit_0003.zkey -n="Third contribution name"
- snarkjs zkey verify ./compile/circuit.r1cs ./ptau/pot14_final.ptau ./zkey/circuit_0003.zkey
- snarkjs zkey beacon ./zkey/circuit_0003.zkey ./zkey/circuit_final.zkey 0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f 10 -n="Final Beacon phase2"
- snarkjs zkey verify ./compile/circuit.r1cs ./ptau/pot14_final.ptau ./zkey/circuit_final.zkey
- snarkjs zkey export verificationkey ./zkey/circuit_final.zkey verification_key.json

# proof
- snarkjs groth16 prove ./zkey/circuit_final.zkey ./compile/witness.wtns ./proof/proof.json ./proof/public.json
- snarkjs groth16 fullprove input.json ./compile/circuit_js/circuit.wasm ./zkey/circuit_final.zkey ./fullprove/proof.json ./fullprove/public.json

# verify
- snarkjs groth16 verify verification_key.json ./proof/public.json ./proof/proof.json
- snarkjs groth16 verify verification_key.json ./fullprove/public.json ./fullprove/proof.json

# smart contract
- snarkjs zkey export solidityverifier ./zkey/circuit_final.zkey ./contract/verifier.sol
- snarkjs zkey export soliditycalldata ./proof/public.json ./proof/proof.json
- snarkjs zkey export soliditycalldata ./fullprove/public.json ./fullprove/proof.json

# snarkjs.js
- npm init
- npm install snarkjs
- node snarkjs.js

# deploay
- https://remix.ethereum.org/
- Connect to REMIX & localhost
- klaytn baobab & kaikas deploy
- [0x0ADaa97f7Aac40EFB4749368361140e3a8f5AaC5](https://baobab.klaytnscope.com/account/0x0ADaa97f7Aac40EFB4749368361140e3a8f5AaC5?tabId=internalTx)

# interact
- node interact.js

# contractCode upload
- https://baobab.klaytnscope.com/account/0x0adaa97f7aac40efb4749368361140e3a8f5aac5?tabId=contractCode