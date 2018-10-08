import {
    signSchnorr,
    verifySchnorr,
    recoverSchnorr,
    getPublicFromPrivate
} from "../utils";

const priv = "99053a6568a93b9f194ef983c84ddfa9eb2b37888e47433558d40b2f4770b2d8";
const msg = "00000000c0dec6a100000000c0dec6a100000000c0dec6a100000000c0dec6a1";

test("public key", () => {
    const pub = getPublicFromPrivate(priv);
    expect(pub.length).toBe(128);
});

test("sign", () => {
    const signature = signSchnorr(msg, priv);
    expect(signature).toEqual({
        r: "5fce597452942ad5ea5cc1a3a413464e5b9f6acb25f04a31195bf12c0ecd1e02",
        s: "7f7d1b9d6c0b7b7eef02545bd8e8f9217ea3c0905f9e74ef9d675792860c8bba"
    });
});

test("verify - success", () => {
    const result = verifySchnorr(
        msg,
        {
            r:
                "5fce597452942ad5ea5cc1a3a413464e5b9f6acb25f04a31195bf12c0ecd1e02",
            s:
                "7f7d1b9d6c0b7b7eef02545bd8e8f9217ea3c0905f9e74ef9d675792860c8bba"
        },
        getPublicFromPrivate(priv)
    );
    expect(result).toBe(true);
});

test("verify - fail", () => {
    const result = verifySchnorr(
        "0000000000000000000000000000000000000000000000000000000000000000",
        {
            r:
                "5fce597452942ad5ea5cc1a3a413464e5b9f6acb25f04a31195bf12c0ecd1e02",
            s:
                "7f7d1b9d6c0b7b7eef02545bd8e8f9217ea3c0905f9e74ef9d675792860c8bba"
        },
        getPublicFromPrivate(priv)
    );
    expect(result).toBe(false);
});

test("recover", () => {
    const a = recoverSchnorr(msg, {
        r: "5fce597452942ad5ea5cc1a3a413464e5b9f6acb25f04a31195bf12c0ecd1e02",
        s: "7f7d1b9d6c0b7b7eef02545bd8e8f9217ea3c0905f9e74ef9d675792860c8bba"
    });
    expect(a).toBe(getPublicFromPrivate(priv));
});
