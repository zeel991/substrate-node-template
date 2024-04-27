"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var api_1 = require("@polkadot/api");
// Utility function to wait
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var provider, api, keyring, alice, bob;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    provider = new api_1.WsProvider('ws://127.0.0.1:9944');
                    return [4 /*yield*/, api_1.ApiPromise.create({ provider: provider })];
                case 1:
                    api = _a.sent();
                    console.log('Connected to Substrate node');
                    keyring = new api_1.Keyring({ type: 'sr25519' });
                    alice = keyring.addFromUri('//Alice');
                    bob = keyring.addFromUri('//Bob');
                    console.log("Alice address: ".concat(alice.address));
                    console.log("Bob address: ".concat(bob.address));
                    // Authorize an account
                    console.log('Authorizing Bob...');
                    return [4 /*yield*/, api.tx.myPallet.authorizeAccount(bob.address).signAndSend(alice, function (result) {
                            if (result.status.isFinalized) {
                                console.log("Authorization of Bob finalized in block ".concat(result.status.asFinalized));
                            }
                        })];
                case 2:
                    _a.sent();
                    // Give time for the transaction to be finalized
                    return [4 /*yield*/, sleep(5000)];
                case 3:
                    // Give time for the transaction to be finalized
                    _a.sent();
                    // Register a statement
                    console.log('Registering a statement for Alice...');
                    return [4 /*yield*/, api.tx.myPallet.registerStatement(alice.address).signAndSend(bob, function (result) {
                            if (result.status.isFinalized) {
                                console.log("Statement registration finalized in block ".concat(result.status.asFinalized));
                            }
                        })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, sleep(5000)];
                case 5:
                    _a.sent();
                    // Consume a statement
                    console.log('Consuming Alice\'s statement...');
                    return [4 /*yield*/, api.tx.myPallet.consumeStatement(alice.address, alice.address, bob.address).signAndSend(alice, function (result) {
                            if (result.status.isFinalized) {
                                console.log("Statement consumed in block ".concat(result.status.asFinalized));
                            }
                        })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, sleep(5000)];
                case 7:
                    _a.sent();
                    // Close the connection
                    return [4 /*yield*/, api.disconnect()];
                case 8:
                    // Close the connection
                    _a.sent();
                    console.log('Disconnected from Substrate node');
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(function (error) {
    console.error('Error:', error);
});
