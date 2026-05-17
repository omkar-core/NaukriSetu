import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(5).max(200),
  message: z.string().min(10).max(2000),
  honeypot: z.string().max(0, 'Bot detected').optional(),
})

export const subscribeSchema = z.object({
  email: z.string().email(),
  honeypot: z.string().max(0, 'Bot detected').optional(),
})

export const reportSchema = z.object({
  jobId: z.string(),
  reason: z.string().min(5).max(500),
  email: z.string().email().optional(),
})

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({ error: 'Validation failed', details: result.error.flatten().fieldErrors })
    }
    req.validated = result.data
    next()
  }
}
