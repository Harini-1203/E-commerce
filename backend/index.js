import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import productsRouter from './routes/products.js'
import cartRouter from './routes/cart.js'
import { fileURLToPath } from 'url'
import path from 'path'


dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use('/api/products', productsRouter)
app.use('/api/cart', cartRouter)
app.use('/img', express.static(path.join(__dirname, 'img')))

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vibe-commerce'

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err)
    process.exit(1)
  })
