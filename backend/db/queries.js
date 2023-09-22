const cockroach = require('./cockroachDbConnection');
const { cockroachCloudCluster } = require('../config/config');
const database = cockroachCloudCluster.dbName;
const TABLE_NAME_USERS = 'users'
const TABLE_NAME_USER_TOKENS = 'token_details'

// USERS
async function addUser({ email }) {
  try {
    const fields = ['email',  'created_at', 'modified_at']
    const values = [email, new Date(), new Date()];
    const query = `
                INSERT INTO
                  ${TABLE_NAME_USERS}
                      (${fields})
                VALUES 
                    (${values.map((_, index) => `$${index + 1}`)})
                RETURNING id;
                  `;
    const result = await cockroach.executeQuery({
      database,
      query,
      values,
    });

    if (!result || !result.rows || !result.rows.length) {
      return false;
    }
    return result.rows[0];
  } catch (err) {
    console.error(err);
    throw new Error('Error while adding user');
  }
}

async function getUserById({ id, fieldsToQuery }) {
  try {
    const values = [id];
    const query = `
              SELECT
                ${fieldsToQuery ? fieldsToQuery : 'id'}
              FROM
                ${TABLE_NAME_USERS}
              WHERE id = $1;
                `;
    const result = await cockroach.executeQuery({
      database,
      query,
      values,
    });

    if (!result || !result.rows || !result.rows.length) {
      return false;
    }
    return result.rows[0];
  } catch (err) {
    console.error(err);
    throw new Error('Error while getting user by id');
  }
}

async function getUserByEmail({ email, fieldsToQuery }) {
  try {
    const values = [email];
    const query = `
              SELECT
                ${fieldsToQuery ? fieldsToQuery : 'id'}
              FROM
                ${TABLE_NAME_USERS}
              WHERE email = $1;
                `;
    const result = await cockroach.executeQuery({
      database,
      query,
      values,
    });

    if (!result || !result.rows || !result.rows.length) {
      return false;
    }
    return result.rows[0];
  } catch (err) {
    console.error(err);
    throw new Error('Error while getting user by email');
  }
}


// TOKEN
async function addTokenDetails({ 
  userId,
  accessTokenGoogle,
  accessTokenSpotify,
  refreshTokenGoogle,
  refreshTokenSpotify,
  googleTokenExpiresAt,
  spotifyTokenExpiresAt,
  createdBy,
 }) {
  try {
    const fields = [
      'user_id',
      'access_token_google',
      'access_token_spotify',
      'refresh_token_google',
      'refresh_token_spotify',
      'google_token_expires_at',
      'spotify_token_expires_at',
      'created_at',
      'created_by',
      'modified_at',
      'modified_by',
    ]
    const values = [
      userId,
      accessTokenGoogle,
      accessTokenSpotify,
      refreshTokenGoogle,
      refreshTokenSpotify,
      googleTokenExpiresAt,
      spotifyTokenExpiresAt,
      new Date(),
      createdBy,
      new Date(), 
      createdBy,
    ]
    const query = `
              INSERT INTO
                ${TABLE_NAME_USER_TOKENS}
                    (${fields})
              VALUES 
                  (${values.map((_, index) => `$${index + 1}`)})
              RETURNING id;
                `;
    const result = await cockroach.executeQuery({
      database,
      query,
      values,
    });
    if (!result || !result.rows || !result.rows.length) {
      return false;
    }
    return result.rows[0];
  } catch (err) {
    console.error(err);
    throw new Error('Error while adding user');
  }
}

async function updateTokenDetails({
  id,
  userId,
  accessTokenGoogle,
  accessTokenSpotify,
  refreshTokenGoogle,
  refreshTokenSpotify,
  googleTokenExpiresAt,
  spotifyTokenExpiresAt,
  updatedBy
}) {
  try {
    const fields = ['user_id', 'modified_by', 'modified_at']
    const values = [id, userId, updatedBy, new Date()]

    if (accessTokenGoogle) {
      fields.push('access_token_google')
      values.push(accessTokenGoogle)
    }
    if (accessTokenSpotify) {
      fields.push('access_token_spotify')
      values.push(accessTokenSpotify)
    }
    if (refreshTokenGoogle) {
      fields.push('refresh_token_google')
      values.push(refreshTokenGoogle)
    }
    if (refreshTokenSpotify) {
      fields.push('refresh_token_spotify')
      values.push(refreshTokenSpotify)
    }
    if (googleTokenExpiresAt) {
      fields.push('google_token_expires_at')
      values.push(googleTokenExpiresAt)
    }
    if (spotifyTokenExpiresAt) {
      fields.push('spotify_token_expires_at')
      values.push(spotifyTokenExpiresAt)
    }


    const query = `
              UPDATE
                ${TABLE_NAME_USER_TOKENS}
              SET
                ${fields.map((field, index) => `${field} = $${index + 2}`)}
              WHERE id = $1
              RETURNING id;
                `;
    const result = await cockroach.executeQuery({
      database,
      query,
      values,
    });

    if (!result || !result.rows || !result.rows.length) {
      return false;
    }
    return result.rows[0];
  } catch (err) {
    console.error(err);
    throw new Error('Error while adding user');
  }
}

async function updateTokenDetailsByUserId({
  userId,
  accessTokenGoogle,
  accessTokenSpotify,
  refreshTokenGoogle,
  refreshTokenSpotify,
  googleTokenExpiresAt,
  spotifyTokenExpiresAt,
  sporitfyUserId,
  updatedBy
 }) {
  try {
    const fields = ['modified_by', 'modified_at']
    const values = [userId, updatedBy, new Date()]

    if (accessTokenGoogle) {
      fields.push('access_token_google')
      values.push(accessTokenGoogle)
    }
    if (accessTokenSpotify) {
      fields.push('access_token_spotify')
      values.push(accessTokenSpotify)
    }
    if (refreshTokenGoogle) {
      fields.push('refresh_token_google')
      values.push(refreshTokenGoogle)
    }
    if (refreshTokenSpotify) {
      fields.push('refresh_token_spotify')
      values.push(refreshTokenSpotify)
    }
    if (sporitfyUserId) {
      fields.push('spotify_user_id')
      values.push(sporitfyUserId)
    }
    if (googleTokenExpiresAt) {
      fields.push('google_token_expires_at')
      values.push(googleTokenExpiresAt)
    }
    if (spotifyTokenExpiresAt) {
      fields.push('spotify_token_expires_at')
      values.push(spotifyTokenExpiresAt)
    }

    const query = `
              UPDATE
                ${TABLE_NAME_USER_TOKENS}
              SET
                ${fields.map((field, index) => `${field} = $${index + 2}`)}
              WHERE user_id = $1
              RETURNING id;
                `;
    const result = await cockroach.executeQuery({
      database,
      query,
      values,
    });

    if (!result || !result.rows || !result.rows.length) {
      return false;
    }
    return result.rows[0];
  } catch (err) {
    console.error(err);
    throw new Error('Error while adding user');
  }
}

async function getTokenDetailsByUserId({ userId, fieldsToQuery }) {
  try {
    const values = [userId]
    const query = `
              SELECT 
                ${fieldsToQuery ? fieldsToQuery : '*'}
              FROM
                ${TABLE_NAME_USER_TOKENS}
              WHERE
                user_id = $1;
                `;
    const result = await cockroach.executeQuery({
      database,
      query,
      values,
    });

    if (!result || !result.rows || !result.rows.length) {
      return false;
    }
    return result.rows[0];
  } catch (err) {
    console.error(err);
    throw new Error('Error while getting token details by user id');
  }
}

module.exports = Object.freeze({
  // USERS
  addUser,
  getUserById,
  getUserByEmail,
  // TOKENS
  addTokenDetails,
  getTokenDetailsByUserId,
  updateTokenDetails,
  updateTokenDetailsByUserId,
})