var SDK = require("codechain-sdk");

const SERVER_URL = process.env.CODECHAIN_RPC_HTTP || "http://localhost:8080";
const sdk = new SDK({ server: SERVER_URL });

const ACCOUNT_PASSPHRASE = process.env.PASSPHRASE || "satoshi";

var secret = "ede1d4ccb4ec9a8bbbae9a13db3f4a7b56ea04189be86ac3a6a439d9a0a1addd";
sdk.rpc.account.importRaw(secret, ACCOUNT_PASSPHRASE).then(function (account) {
    console.log(account); // tccqzn9jjm3j6qg69smd7cn0eup4w7z2yu9my9a2k78
}).catch(e => {
    if (e.message !== "Already Exists") {
        console.error(e);
    }
});
