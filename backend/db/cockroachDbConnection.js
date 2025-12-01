const CockraochDBUtils = require('../utils/CockraochDBUtils');
const { cockroachCloudCluster } = require('../config');

const cockroach = new CockraochDBUtils({
  connectionString: cockroachCloudCluster.connectionString,
  database: cockroachCloudCluster.dbName,
});

module.exports = cockroach;