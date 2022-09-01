import * as fs from 'fs';
import { create } from 'ipfs-core';
import toBuffer from 'it-to-buffer';

const uploadToIPFS = async (PATH, FILE) => {
  try {
    const IPFSnode = await create();
    const { cid } = await IPFSnode.add({
      content: FILE,
    });
    return cid.toString();
  } catch (error) {
    console.log(error);
    return false;
  }
};

const downloadFromIPFS = async (cid) => {
  const IPFSnode = await create();
  const fileContent = await toBuffer(IPFSnode.get(cid));
  return fileContent;
};

export { uploadToIPFS, downloadFromIPFS };
