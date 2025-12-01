module.exports.serverConfig = {
    defaultPort: 4040,
    defaultHost: 'http://127.0.0.1'
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
    connectionString: 'postgresql://lsm-admin:DTQuLfHyknxapEW1QByNag@lms-project-2473.7s5.aws-ap-south-1.cockroachlabs.cloud:26257/playlistconverter_db?sslmode=verify-full',
    dbName: 'playlistconverter_db'
  }
  
  