import api from './api'

export async function subscribe(email) {
  return api.post('/subscribe', { email })
}
