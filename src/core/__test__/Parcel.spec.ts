import { PlatformAddress } from "codechain-primitives";

import { H256 } from "../H256";
import { U256 } from "../U256";
import { Parcel } from "../Parcel";

test("rlp", () => {
    const t = Parcel.transactions("tc");
    t.setFee(0);
    t.setNonce(0);
    expect(t.rlpBytes()).toEqual(
        Buffer.from([
            248,
            81,
            128,
            128,
            130,
            116,
            99,
            248,
            74,
            1,
            192,
            248,
            69,
            248,
            67,
            128,
            160,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            160,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            192
        ])
    );
});

test("hash", () => {
    const t = Parcel.transactions("tc");
    t.setFee(0);
    t.setNonce(0);
    expect(t.hash()).toEqual(
        new H256(
            "cc946ae0cc8226c5a8db992d840c5f6bcb22dd2ea91dea994a334b67b325b1a0"
        )
    );
});

test("sign", () => {
    const t = Parcel.transactions("tc");
    const signed = t.sign({
        secret:
            "ede1d4ccb4ec9a8bbbae9a13db3f4a7b56ea04189be86ac3a6a439d9a0a1addd",
        nonce: 0,
        fee: 0
    });
    const { r, s } = signed.signature();
    expect(r.toEncodeObject()).toEqual(
        new U256(
            "0x7226b649aa46be60221c08f7a742ecc37e5ebfb58a289f0b279b47aaee543689"
        ).toEncodeObject()
    );
    expect(s.toEncodeObject()).toEqual(
        new U256(
            "0x3a6d14104d20321b0b1b9979e92f83a3d533d5d4c025905fdabf25f018643f04"
        ).toEncodeObject()
    );
});

test("signed hash", () => {
    const t = Parcel.transactions("tc");
    const signed = t.sign({
        secret:
            "ede1d4ccb4ec9a8bbbae9a13db3f4a7b56ea04189be86ac3a6a439d9a0a1addd",
        nonce: 0,
        fee: 0
    });
    expect(signed.hash()).toEqual(
        new H256(
            "a224d92cdaf1be61917317866876c35544ff565d4d1d8946f2be4c1ef5968f81"
        )
    );
});

test("toJSON", () => {
    const p = Parcel.payment(
        "tc",
        PlatformAddress.fromAccountId(
            "0x0000000000000000000000000000000000000000"
        ),
        new U256(11)
    );
    p.setFee(33);
    p.setNonce(44);
    expect(Parcel.fromJSON(p.toJSON())).toEqual(p);
});
