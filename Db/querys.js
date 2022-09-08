import { client } from './connectDatabase.js';

export const saveFile = async (tokenId, caseId) => {
  const response = await client.query(
    `INSERT INTO Documents(token_id) values(${tokenId})`
  );
  const document = await getFile(tokenId);
  return document.rows[0];
};

export const getFile = async (tokenId) => {
  const response = await client.query(
    `SELECT * FROM documents WHERE token_id=${tokenId}`
  );
  return response;
};

export const getUser = async (address) => {
  const user = await client.query(
    `SELECT * FROM users WHERE address='${address}'`
  );
  return user;
};

export const getUserPublicKey = async (publicKey) => {
  const user = await client.query(
    `SELECT * FROM users WHERE public_key='${publicKey}'`
  );
  return user;
};

export const saveUser = async (address, publicKey) => {
  const user = await getUser(address, publicKey);
  if (user.rows.length) {
    return user.rows[0];
  } else {
    const res = await client.query(
      `INSERT INTO users(name,public_key,address) values('alberto','${publicKey}','${address}')`
    );
    const newUser = await getUser(address, publicKey);
    return newUser.rows[0];
  }
};

export const saveSecret = async (user_id, document_id, privateKey) => {
  const response = await client.query(
    `INSERT INTO secrets(user_id,document,private_key) values(${user_id},${document_id},'${privateKey}')`
  );
  return response;
};

export const createBriefCase = (
  type,
  place,
  crime,
  crimeDate,
  placeCrime,
  nameLawyer,
  nameDefendant,
  defendantLawyer,
  plaintiffLawyer
) => {
  client.query(
    `INSET INTO Briefcase values(0,${type},${place},${crime},${crimeDate},${placeCrime},${nameLawyer},${nameDefendant},${defendantLawyer},${plaintiffLawyer})`,
    (err, res) => {
      console.log(err, res);
    }
  );
};

export const saveDocumentInBriefcase = async (case_id, document_id) => {
  const response = await client.query(
    `INSERT INTO briefcasedocuments(case_id,document_id) values(${case_id},${document_id}) `
  );
};

export const getSecrets = async (user_id, document_id) => {
  console.log(user_id, document_id);
  const response = await client.query(
    `SELECT * FROM secrets WHERE user_id=${user_id} AND document=${document_id}`
  );
  return response;
};

export const saveSecrets = async (keys, privatekeys, documentId) => {
  const userIds = await Promise.all(
    keys.map(async (key) => {
      const userId = await getUserPublicKey(key);
      return userId;
    })
  );
  for (let i = 0; i < keys.length; i++) {
    await saveSecret(userIds[i].rows[0].user_id, documentId, privatekeys[i]);
  }
};
