const SDK = require("codechain-sdk");
const { Parcel, U256, H256, H160 } = SDK;

// Create SDK object with CodeChain RPC server URL
const sdk = new SDK("http://localhost:8080");

// Parcel is only valid if the nonce matches the nonce of the parcel signer.
// The nonce of the signer is increased by 1 when this parcel is confirmed.
const parcelSignerNonce = new U256(0);
// Parcel signer pays 10 CCC as fee.
const fee = new U256(10);
// Network ID prevents replay attacks or confusion among different CodeChain networks.
const networkId = 17;
// Recipient of the payment
const receiver = new H160("744142069fe2d03d48e61734cbe564fcc94e6e31");
// Amount of the payment. The parcel signer's balance must be at least 10010.
const value = new U256(10000);
// Create the Parcel for the payment
const parcel = Parcel.payment(parcelSignerNonce, fee, networkId, receiver, value);

// Sign the parcel with the secret key of the address 0xa6594b7196808d161b6fb137e781abbc251385d9.
const parcelSignerSecret = new H256("ede1d4ccb4ec9a8bbbae9a13db3f4a7b56ea04189be86ac3a6a439d9a0a1addd");
const signedParcel = parcel.sign(parcelSignerSecret);

// Send the signed parcel to the CodeChain node. The node will propagate this
// parcel and attempt to confirm it.
sdk.sendSignedParcel(signedParcel).then((hash) => {
    // sendSignedParcel returns a promise that resolves with a parcel hash if parcel has
    // been verified and queued successfully. It doesn't mean parcel was confirmed.
    console.log(`Parcel sent:`, hash);
    return sdk.getParcel(hash);
}).then((parcel) => {
    // getParcel returns a promise that resolves with a parcel.
    // blockNumber/blockHash/parcelIndex fields in Parcel is present only for the
    // confirmed parcel
    console.log(`Parcel`, parcel);
}).catch((err) => {
    console.error(`Error:`, err);
});
