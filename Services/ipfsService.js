import { create } from 'ipfs-core';
import toBuffer from 'it-to-buffer';

// const IPFSnode = await create();

const uploadToIPFS = async (PATH, FILE) => {
  try {
    const { cid } = await IPFSnode.add({
      path: PATH,
      content: FILE,
    });
    return [true, cid.toString()];
  } catch (error) {
    console.log(error);
    return false;
  }
};

const downloadFromIPFS = async (cid) => {
  const fileContent = await toBuffer(IPFSnode.cat(cid));
  return fileContent;
};

export { uploadToIPFS, downloadFromIPFS };
