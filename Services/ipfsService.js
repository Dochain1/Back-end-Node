import { fs } from 'fs';
import { create } from 'ipfs-core';

const uploadToIPFS = async () => {
  try {
    const IPFSnode = await create();
    const { cid } = await IPFSnode.add();
  } catch (error) {

  }
}

export { uploadToIPFS };

