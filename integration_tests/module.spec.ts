import { SDK } from "../";

const SERVER_URL = process.env.CODECHAIN_RPC_HTTP || "http://localhost:8080";
test("import", () => {
    expect(() => {
        new SDK({ server: SERVER_URL });
    }).not.toThrow();
});

test("require", () => {
    const CodeChainSdk = require("../");
    expect(() => {
        const sdk = new CodeChainSdk({ server: SERVER_URL });
    }).not.toThrow();
});
