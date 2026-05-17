import { Router } from 'express'
import { getFirestore } from '../utils/firebase.js'
import { verifyAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', verifyAuth, async (req, res) => {
  try {
    const db = getFirestore()
    const snapshot = await db.collection('bookmarks').doc(req.user.uid).collection('items').get()
    const bookmarks = snapshot.docs.map(d => d.data().jobId)
    res.json({ bookmarks })
  } catch {
    res.status(500).json({ error: 'Failed to fetch bookmarks' })
  }
})

router.post('/', verifyAuth, async (req, res) => {
  try {
    const { jobId } = req.body
    if (!jobId) return res.status(400).json({ error: 'jobId required' })
    const db = getFirestore()
    await db.collection('bookmarks').doc(req.user.uid).collection('items').doc(jobId).set({ jobId, createdAt: new Date() })
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Failed to add bookmark' })
  }
})

router.delete('/:jobId', verifyAuth, async (req, res) => {
  try {
    const db = getFirestore()
    await db.collection('bookmarks').doc(req.user.uid).collection('items').doc(req.params.jobId).delete()
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Failed to remove bookmark' })
  }
})

export default router
