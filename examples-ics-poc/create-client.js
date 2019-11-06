const SDK = require("..");

const sdk = new SDK({
  server: process.env.CODECHAIN_RPC_HTTP || "http://localhost:8080",
  networkId: process.env.CODECHAIN_NETWORK_ID || "tc"
});

const ACCOUNT_ADDRESS =
  process.env.ACCOUNT_ADDRESS || "tccq9h7vnl68frvqapzv3tujrxtxtwqdnxw6yamrrgd";
const ACCOUNT_PASSPHRASE = process.env.ACCOUNT_PASSPHRASE || "satoshi";

const CODECHAIN_KIND = 0;

(async () => {
  const hash = await sdk.rpc.chain.sendTransaction(
    sdk.core.createCreateClientTransaction({
      id: "ab",
      kind: CODECHAIN_KIND,
      consensusState: {
        height: 0,
        root:
          "0000000000000000000000000000000000000000000000000000000000000000",
        nextValidatorSet: [
          "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
        ]
      }
    }),
    {
      account: ACCOUNT_ADDRESS,
      passphrase: ACCOUNT_PASSPHRASE
    }
  );
  const result = await sdk.rpc.chain.containsTransaction(hash);
  console.log("result:", result);
})().catch(err => {
  console.error(`Error:`, err);
});
