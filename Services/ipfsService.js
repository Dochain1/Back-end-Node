import { create } from 'ipfs-core';

const IPFSnode = await create();

const uploadToIPFS = async (PATH, FILE) => {
  try {
    const { cid } = await IPFSnode.add({
      path: PATH,
      content: FILE
    });
    return [true, cid.toString()];
  } catch (error) {
    console.log(error);
    return false;
  }
}

export { uploadToIPFS };

