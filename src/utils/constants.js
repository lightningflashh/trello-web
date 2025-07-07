let apiRoot = ''
if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8017'
} else {
  apiRoot = 'https://trello-api-qbc8.onrender.com'
}
export const API_ROOT = apiRoot