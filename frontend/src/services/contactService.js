import api from './api'

export async function sendContactMessage(data) {
  return api.post('/contact', data)
}
