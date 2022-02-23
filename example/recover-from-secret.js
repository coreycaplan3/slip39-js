const slip39 = require('../src/slip39');
const passphrase = process.env.PASSPHRASE;

if (!process.env.SHARE_1) {
  throw new Error('SHARE_1 env variable is missing');
}

if (!process.env.SHARE_2) {
  throw new Error('SHARE_2 env variable is missing');
}

const share1 = [process.env.SHARE_1];
const share2 = [process.env.SHARE_2];

const enoughShares = share1.concat(share2);

const recoveredSecret = slip39.recoverSecret(enoughShares, passphrase);
console.log('Recovered secret:\n', recoveredSecret.slip39DecodeHex());
