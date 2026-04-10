const { serveNcmApi } = require('NeteaseCloudMusicApi')

serveNcmApi({
  port: 3000,
  host: '127.0.0.1',
}).then(() => {
  console.log('NeteaseCloudMusicApi started on 127.0.0.1:3000')
}).catch(err => {
  console.error('Failed to start:', err)
  process.exit(1)
})
