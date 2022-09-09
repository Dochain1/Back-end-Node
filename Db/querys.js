import { client } from './connectDatabase.js';

export const getDocument = async (tokenId) => {
  const response = await client.query(
    `SELECT * FROM documents WHERE token_id=${tokenId}`
  );
  return response;
};

export const saveDocument = async (tokenId, type, name) => {
  await client.query(
    `INSERT INTO Documents(token_id,document_type,name) values(${tokenId},'${type}','${name}')`
  );
  const document = await getDocument(tokenId);
  return document.rows[0];
};

export const getUser = async (address) => {
  const user = await client.query(
    `SELECT * FROM users WHERE address='${address}'`
  );
  return user;
};

export const getAllUsers = async (address) => {
  const users = await Promise.all(
    address.map(async (ads) => {
      const user = await getUser(ads);
      if (user.rows.length) return user.rows[0];
      else return { public_key: 'undefined' };
    })
  );
  return users;
};

export const saveUser = async (publicKey, address, email) => {
  const user = await getUser(publicKey);
  if (user.rows.length) {
    return user.rows[0];
  } else {
    await client.query(
      `INSERT INTO users(public_key,address) values('${publicKey}','${address}')`
    );
    const newUser = await getUser(publicKey);
    return newUser.rows[0];
  }
};

export const saveSecret = async (user_key, document_id, privateKey) => {
  const response = await client.query(
    `INSERT INTO secrets(user_key,document,private_key) values('${user_key}',${document_id},'${privateKey}')`
  );
  return response;
};

export const saveSecrets = async (keys, privatekeys, documentId) => {
  for (let i = 0; i < keys.length; i++) {
    await saveSecret(keys[i], documentId, privatekeys[i]);
  }
};

export const getSecrets = async (user_id, document_id) => {
  const response = await client.query(
    `SELECT * FROM secrets WHERE user_key='${user_id}' AND document=${document_id}`
  );
  return response;
};

export const saveDocumentInBriefcase = async (case_id, document_id) => {
  const response = await client.query(
    `INSERT INTO briefcasedocuments(case_id,document_id) values(${case_id},${document_id}) `
  );
  return response;
};

export const saveUsersInBriefcase = async (users, case_id) => {
  for (const user of users) {
    client.query(
      `INSERT INTO briefcaseusers(user_id,case_id) values('${user.public_key}',${case_id})`
    );
  }
};
export const getBriefcasesByUser = async (user) => {
  const response = await client.query(
    `SELECT * FROM briefcaseUsers WHERE user_id='${user}'`
  );
  return response;
};

export const getDocumentsFromCase = async (caseId) => {
  const response = await client.query(
    `SELECT * FROM briefcasedocuments WHERE case_id=${caseId}`
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
