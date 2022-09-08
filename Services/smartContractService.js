import Web3 from 'web3';
import doChainArtifact from './doChainToken.js';
import dotenv from 'dotenv';
dotenv.config();
const { abi, address } = doChainArtifact;
import { getFile } from '../Db/querys.js';

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    'https://goerli.infura.io/v3/670938395ae445f5b894675c2a0838e6'
  )
);

const doChainContract = new web3.eth.Contract(abi, address[5]);
const privateKey = process.env.PRIVATE_KEY;
const publicKey = '0x078fc9E8cAe1B2961E1F6e9e543D2A9C05f9B718';

export const getBalanceOf = async (address) => {
  const response = await doChainContract.methods.balanceOf(address).call();
  return response;
};

export const totalMinted = async () => {
  const response = await doChainContract.methods.tokenIdCounter().call();
  return response;
};

export const getTokenUri = async (tokenId) => {
  const response = await doChainContract.methods.tokenURI(tokenId).call({
    from: publicKey,
  });
  return response;
};

export const getBriefCase = async (address = publicKey) => {
  const total = await totalMinted();
  const briefcases = [];
  for (let i = 0; i < total; i++) {
    const ownerOf = await doChainContract.methods.ownerOf(i).call();
    if (ownerOf === address) {
      briefcases.push(i);
    }
  }
  const metadata = await Promise.all(
    briefcases.map(async (tokenId) => {
      const tokenUri = await getTokenUri(tokenId);
      const document = await getFile(tokenId);
      let type = 'No type';
      let name = 'No name';
      if (document.rows.length) {
        (type = document.rows[0].document_type), (name = document.rows[0].name);
      }
      return { tokenUri, tokenId, type, name };
    })
  );
  return metadata;
};

const getTransactionData = async (smartContractMethod, parameters, address) => {
  const tx = smartContractMethod(parameters);
  const gas = await tx.estimateGas({ from: address });
  const gasPrice = await web3.eth.getGasPrice();
  const data = tx.encodeABI();
  const nonce = await web3.eth.getTransactionCount(address);
  const signedTx = await web3.eth.accounts.signTransaction(
    {
      to: doChainContract.options.address,
      data,
      gas,
      gasPrice,
      nonce,
      chainId: 5,
    },
    privateKey
  );
  return signedTx;
};

export const setHash = async (cid) => {
  const signedTx = await getTransactionData(
    doChainContract.methods.setNewHash,
    cid,
    publicKey
  );
  await web3.eth
    .sendSignedTransaction(signedTx.rawTransaction)
    .on('transactionHash', (txHash) => {})
    .on('receipt', (res) => {
      return true;
    });
};

export const mint = async (to, hash) => {
  await setHash(hash);
  const signedTx = await getTransactionData(
    doChainContract.methods.safeMint,
    to,
    publicKey
  );
  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  return receipt;
};
