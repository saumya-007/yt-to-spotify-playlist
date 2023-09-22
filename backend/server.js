const express = require('express');
const cors = require('cors');
const oauthRoutes = require('./routes/oauthRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const config = require('./config/config')

const app = express();
app.use(express.json());
app.use(cors());

app.use('/oauth',oauthRoutes);
app.use('/playlist', playlistRoutes);

const port = process.env.PORT || process.argv[2] || config.serverConfig.defaultPort
app.listen(port, (error) => error ?
    console.info('Error In Starting The Service', error) :
    console.info(`Service Started on ${config.serverConfig.defaultHost}:${port}`));

