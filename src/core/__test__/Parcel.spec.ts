import { PlatformAddress } from "codechain-primitives";
import { Pay } from "../transaction/Pay";

import { H256 } from "../H256";
import { fromJSONToTransaction } from "../transaction/json";
import { U256 } from "../U256";
import { U64 } from "../U64";

test("rlp", () => {
    const t = new Pay(
        PlatformAddress.fromAccountId(
            "0x0000000000000000000000000000000000000000",
            { networkId: "tc" }
        ),
        new U64(11),
        "tc"
    );
    t.setFee(0);
    t.setSeq(0);
    t.setExpiration(0);
    expect(t.rlpBytes()).toEqual(
        Buffer.from([
            223,
            128,
            128,
            130,
            116,
            99,
            193,
            128,
            215,
            2,
            148,
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
            11
        ])
    );
});

test("hash", () => {
    const t = new Pay(
        PlatformAddress.fromAccountId(
            "0x0000000000000000000000000000000000000000",
            { networkId: "tc" }
        ),
        new U64(11),
        "tc"
    );
    t.setFee(0);
    t.setSeq(0);
    expect(t.hash()).toEqual(
        new H256(
            "c136ff50721fad93a5e625a9d42f0cd5929b05152e1390192ebe6ea2298f1289"
        )
    );
});

test("sign", () => {
    const pay = new Pay(
        PlatformAddress.fromAccountId(
            "0x0000000000000000000000000000000000000000",
            { networkId: "tc" }
        ),
        new U64(11),
        "tc"
    );
    const signed = pay.sign({
        secret:
            "ede1d4ccb4ec9a8bbbae9a13db3f4a7b56ea04189be86ac3a6a439d9a0a1addd",
        seq: 0,
        fee: 0
    });
    const { v, r, s } = signed.signature();
    expect(v).toBe(1);
    expect(r.toEncodeObject()).toEqual(
        new U256(
            "0xd4edd82b359aa257f771b3251ff91ba83f7e563c86b14f5ace7ac019e741a841"
        ).toEncodeObject()
    );
    expect(s.toEncodeObject()).toEqual(
        new U256(
            "0x46ff72a000f503e880fc71785673e2f5428e6616a5b7af9d5471156009b0d50a"
        ).toEncodeObject()
    );
});

test("signed hash", () => {
    const pay = new Pay(
        PlatformAddress.fromAccountId(
            "0x0000000000000000000000000000000000000000",
            { networkId: "tc" }
        ),
        new U64(11),
        "tc"
    );
    const signed = pay.sign({
        secret:
            "ede1d4ccb4ec9a8bbbae9a13db3f4a7b56ea04189be86ac3a6a439d9a0a1addd",
        seq: 0,
        fee: 0
    });
    expect(signed.hash()).toEqual(
        new H256(
            "5a86f4527eaf838aa9ad04392b4b13f756c32b3d0a28b07bed9ad3374e6598f3"
        )
    );
});

test("toJSON", () => {
    const p = new Pay(
        PlatformAddress.fromAccountId(
            "0x0000000000000000000000000000000000000000",
            { networkId: "tc" }
        ),
        new U64(11),
        "tc"
    );
    p.setFee(33);
    p.setSeq(44);
    p.setExpiration(55);
    expect(fromJSONToTransaction(p.toJSON())).toEqual(p);
});
