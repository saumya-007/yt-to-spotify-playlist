module.exports.serverConfig = {
  defaultPort: 4040,
  defaultHost: 'http://localhost'
}

module.exports.googleOauthOptionsConfig = {
  access_type: 'offline',
  response_type: 'code',
  prompt: 'consent',
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/youtube.readonly',
  ].join(' ')
}

module.exports.spotifyOauthOptionsConfig = {
  response_type: 'code',
  show_dialog: true,
  scope: [
    'playlist-modify-private',
    'playlist-modify-public'
  ].join(' ')
}

module.exports.cockroachCloudCluster = {
  connectionString: 'YOUR_CONNECTION_STRING',
  dbName: 'playlistconverter_db'
}

