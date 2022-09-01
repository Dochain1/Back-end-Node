import * as openpgp from 'openpgp';
import { encrypt } from '@metamask/eth-sig-util';
import { bufferToHex } from 'ethereumjs-utils';
// import fs from 'fs-extra';

let publicKeysArmored = [];
let privateKeysArmored = [];
async function generateKeysPGP() {
  const { privateKey, publicKey, revocationCertificate } =
    await openpgp.generateKey({
      type: 'ecc', // Type of the key, defaults to ECC
      curve: 'curve25519', // ECC curve name, defaults to curve25519
      userIDs: [{ name: `Jon Smith`, email: `jon@example.com` }], // you can pass multiple user IDs
      passphrase: 'KEY', // protects the private key
      format: 'armored', // output key format, defaults to 'armored' (other options: 'binary' or 'object')
    });
  return { publicKey, privateKey, revocationCertificate };
}

// One time keys to encrypt a document.
const getOTKeys = async () => {
  const promises = await Promise.all(
    [1, 2, 3, 4].map(async () => {
      return await generateKeysPGP();
    })
  );
  publicKeysArmored = promises.map((e) => {
    return e.publicKey;
  });
  privateKeysArmored = promises.map((e) => {
    return e.privateKey;
  });
};

export const encryptMultipleKeysPGP = async (keys, file) => {
  await getOTKeys();
  const publicKeys = await Promise.all(
    publicKeysArmored.map((armoredKey) => openpgp.readKey({ armoredKey }))
  );
  const message = await openpgp.createMessage({
    binary: new Uint8Array(file),
  });

  const encrypted = await openpgp.encrypt({
    message,
    encryptionKeys: publicKeys,
    format: 'binary',
  });
  console.log(privateKeysArmored[0]);
  const privateKeysEncrypted = await Promise.all(
    keys.map(async (key) => {
      return await encryptDataEthereum(key, privateKeysArmored[0]);
    })
  );
  return { encrypted, privateKeysEncrypted };
};

export const decryptPGP = async (encrypted) => {
  const encryptedMessage = await openpgp.readMessage({
    binaryMessage: encrypted, // parse encrypted bytes
  });
  const privateKeyArmored = privateKeysArmored[1];
  const passphrase = `KEY`;
  const privateKey = await openpgp.decryptKey({
    privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
    passphrase,
  });
  const { data: decrypted } = await openpgp.decrypt({
    message: encryptedMessage,
    decryptionKeys: privateKey,
    format: 'binary',
  });
  //   saveFile(decrypted);
  return decrypted;
};

export const encryptDataEthereum = async (encryptionPublicKey, message) => {
  const encryptedMessage = await bufferToHex(
    Buffer.from(
      JSON.stringify(
        encrypt({
          publicKey: encryptionPublicKey,
          data: message,
          version: 'x25519-xsalsa20-poly1305',
        })
      ),
      'utf8'
    )
  );
  return encryptedMessage;
};

// Recive a uint8Array
// const saveFile = async (file) => {
//   const buf = new Buffer.from(file);
//   fs.writeFileSync('./gatitoDesencriptado.jpg', buf);
// };
