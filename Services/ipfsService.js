import { create } from 'ipfs-core';
import toBuffer from 'it-to-buffer';

let IPFSnode;
(async () => {
  IPFSnode = await create();
  const bufferedContents = await toBuffer(
    IPFSnode.cat('QmQEPVzhzkTuJbdekfrHnhq2i2UaYN739iDSbPZqMTQtNw')
  );

  console.log(bufferedContents);
})();

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
  try {
    const fileContent = await toBuffer(IPFSnode.cat(cid));
    return fileContent;
  } catch (error) {
    console.log('Error: ', error);
    return 'An error was ocurred :(';
  }
};

export { uploadToIPFS, downloadFromIPFS };
