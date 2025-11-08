import express from 'express'
import { getProducts, saveProducts } from '../controllers/productsController.js'
const router = express.Router()
router.get('/', getProducts)
router.post('/save', saveProducts)
export default router
