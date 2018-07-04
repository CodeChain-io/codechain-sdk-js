const SDK = require(".");
const { H256, privateKeyToAddress, H160, Parcel, U256,
    AssetScheme, PubkeyAssetAgent, MemoryKeyStore } = SDK;

const sdk = new SDK("http://localhost:8080");

const keyStore = new MemoryKeyStore();
const assetAgent = new PubkeyAssetAgent({ keyStore });

// sendTransaction() is a function to make transaction to be processed.
async function sendTransaction(tx) {
    const parcelSignerSecret = new H256("ede1d4ccb4ec9a8bbbae9a13db3f4a7b56ea04189be86ac3a6a439d9a0a1addd");
    const parcelSignerAddress = new H160(privateKeyToAddress("ede1d4ccb4ec9a8bbbae9a13db3f4a7b56ea04189be86ac3a6a439d9a0a1addd"));
    const parcelSignerNonce = await sdk.getNonce(parcelSignerAddress);
    const parcel = Parcel.transactions(parcelSignerNonce, new U256(10), 17, tx);
    const signedParcel = parcel.sign(parcelSignerSecret);
    return await sdk.sendSignedParcel(signedParcel);
}

(async () => {
    const aliceAddress = await assetAgent.createAddress();
    const bobAddress = await assetAgent.createAddress();

    const goldAssetScheme = new AssetScheme({
        metadata: JSON.stringify({
            name: "Gold",
            imageUrl: "https://gold.image/",
        }),
        amount: 10000,
        registrar: null,
    });

    const mintTx = goldAssetScheme.mint(aliceAddress);

    await sendTransaction(mintTx);

    const firstGold = await sdk.getAsset(mintTx.hash(), 0);

    const transferTx = await firstGold.transfer(assetAgent, [{
        address: bobAddress,
        amount: 3000
    }, {
        address: aliceAddress,
        amount: 7000
    }]);

    await sendTransaction(transferTx);

    // Unspent Bob's 3000 golds
    console.log(await sdk.getAsset(transferTx.hash(), 0));
    // Unspent Alice's 7000 golds
    console.log(await sdk.getAsset(transferTx.hash(), 1));
})();
