import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import webpush from 'web-push'
import habitsRouter from './routes/habits'
import checkinsRouter from './routes/checkins'
import progressRouter from './routes/progress'
import notificationsRouter from './routes/notifications'
import { errorHandler } from './middleware/errorHandler'
import { startReminderJob } from './jobs/reminderJob'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())

webpush.setVapidDetails(
  process.env.VAPID_EMAIL || 'mailto:dev@habityn.app',
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
)

app.use('/api/habits',        habitsRouter)
app.use('/api/checkins',      checkinsRouter)
app.use('/api/progress',      progressRouter)
app.use('/api/notifications', notificationsRouter)

app.use(errorHandler)

async function getMongoUri(): Promise<string> {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI
  // Fall back to in-memory MongoDB for local development
  const { MongoMemoryServer } = await import('mongodb-memory-server')
  const mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri()
  console.log('Using in-memory MongoDB (data resets on restart)')
  return uri
}

getMongoUri().then((uri) => mongoose.connect(uri)).then(() => {
  console.log('MongoDB connected')
  startReminderJob()
  app.listen(PORT, () => console.log(`Server running on :${PORT}`))
}).catch((err) => {
  console.error('MongoDB connection failed:', err)
  process.exit(1)
})
