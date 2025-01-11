const { Wallet, utils } = require("ethers");
const bip39 = require("bip39");
const hdkey = require("ethereumjs-wallet").hdkey;

// Mnemonic
const mnemonic = "test test test test test test test test test test test junk";

// Derive seed from mnemonic
(async () => {
  const seed = await bip39.mnemonicToSeed(mnemonic);

  // Create an HD wallet
  const hdWallet = hdkey.fromMasterSeed(seed);

  // Derivation path for Ethereum (BIP-44)
  const derivationPath = "m/44'/60'/0'/0/0"; // Change the index (last `0`) for different accounts

  // Derive the first account
  const walletNode = hdWallet.derivePath(derivationPath);
  const wallet = walletNode.getWallet();

  const privateKey = wallet.getPrivateKey().toString("hex");
  const address = `0x${wallet.getAddress().toString("hex")}`;

  console.log("Private Key:", privateKey);
  console.log("Address:", address);
})();
