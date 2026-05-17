import cors from 'cors'

const allowedOrigins = [
  'https://naukrisetu.vercel.app',
  'http://localhost:5173',
  'http://localhost:4173',
]

export default cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
})
