const { Pool } = require('pg');

class CockraochDBUtils {
  constructor({ connectionString, database }) {
    console.log(connectionString);
    this.cockroachPool = new Pool({
      connectionString,
    });

    this.database = database;
    this.init();
  }

  async init() {
    try {
      const connection = await this.cockroachPool.connect();
      if (!connection) {
        throw new Error('Error connecting to DB :: connection not found');
      }
    } catch (err) {
      throw err;
    }
  }

  async getConnection({ database }) {
    const connection = await this.cockroachPool.connect();
    await connection.query(`USE ${database}`);
    return connection;
  }

  async executeQuery({ database, query, values }) {
    let connection;
    try {
      connection = await this.getConnection({ database });
      return await connection.query({
        text: query,
        values: values ? values : [],
      });
    } catch (e) {
      throw e;
    } finally {
      if (connection) {
        await connection.release();
      }
    }
  }
}

module.exports = CockraochDBUtils;
