import express from 'express'
import { getCart, addToCart, removeFromCart, checkout } from '../controllers/cartController.js'
const router = express.Router()
router.get('/', getCart)
router.post('/', addToCart)
router.delete('/:id', removeFromCart)
router.post('/checkout', checkout)
export default router
