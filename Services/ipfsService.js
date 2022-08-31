import * as fs from 'fs';
import { create } from 'ipfs-core';

const uploadToIPFS = async (PATH) => {
  try {
    const IPFSnode = await create();
    const { cid } = await IPFSnode.add({
      path: PATH,
      content: fs.readFileSync(PATH)
    });
    return cid.toString();
  } catch (error) {
    console.log(error);
    return false;
  }
}

export { uploadToIPFS };

