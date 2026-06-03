/**
 * Vercel Serverless Function — wraps the Express app without calling app.listen().
 * Vercel handles the HTTP server layer; we just export the Express handler.
 */
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import webpush from 'web-push'
import habitsRouter       from '../server/src/routes/habits'
import checkinsRouter     from '../server/src/routes/checkins'
import progressRouter     from '../server/src/routes/progress'
import notificationsRouter from '../server/src/routes/notifications'
import { errorHandler }   from '../server/src/middleware/errorHandler'

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || '*' }))
app.use(express.json())

/* VAPID — only initialise if keys are present */
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL || 'mailto:dev@habityn.app',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY,
  )
}

/* MongoDB — connect once per cold start, reuse on warm invocations */
let dbReady = false
async function connectDB() {
  if (dbReady && mongoose.connection.readyState === 1) return
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is required in production. Set it in Vercel Environment Variables.')
  await mongoose.connect(uri)
  dbReady = true
}

app.use(async (_req, _res, next) => {
  try {
    await connectDB()
    next()
  } catch (err) {
    next(err)
  }
})

app.use('/api/habits',         habitsRouter)
app.use('/api/checkins',       checkinsRouter)
app.use('/api/progress',       progressRouter)
app.use('/api/notifications',  notificationsRouter)
app.use(errorHandler)

export default app
