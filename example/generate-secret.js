const slip39 = require('../src/slip39');
const assert = require('assert');
// threshold (N) number of group shares required to reconstruct the master secret.
const threshold = 2;
const masterSecret = process.env.MASTER_SECRET.slip39EncodeHex();
const passphrase = process.env.PASSPHRASE;

/**
 * 3 groups shares.
 * = three for User
 * Two of these group shares are required to reconstruct the master secret.
 */
const groups = [
  // User group shares. 1 is enough to reconstruct a group share,
  // therefore she needs at least two group shares to be reconstructed,
  [1, 1],
  [1, 1],
  [1, 1],
];


const slip = slip39.fromArray(masterSecret, {
  passphrase: passphrase,
  threshold: threshold,
  groups: groups
});

// One of User's share
const share1 = slip.fromPath('r/0').mnemonics;
const share2 = slip.fromPath('r/1').mnemonics;
const share3 = slip.fromPath('r/2').mnemonics;

const allShares = share1.concat(share2).concat(share3);
const enoughShares1 = share1.concat(share2);
const enoughShares2 = share2.concat(share3);
const enoughShares3 = share1.concat(share3);

console.log('Shares used for restoring the master secret:');
allShares.forEach((s) => console.log(s + '\n'));

const recoveredSecret1 = slip39.recoverSecret(enoughShares1, passphrase);
const recoveredSecret2 = slip39.recoverSecret(enoughShares2, passphrase);
const recoveredSecret3 = slip39.recoverSecret(enoughShares3, passphrase);
console.log('Master secret: ' + masterSecret.slip39DecodeHex());

assert(masterSecret.slip39DecodeHex() === recoveredSecret1.slip39DecodeHex());
assert(masterSecret.slip39DecodeHex() === recoveredSecret2.slip39DecodeHex());
assert(masterSecret.slip39DecodeHex() === recoveredSecret3.slip39DecodeHex());
