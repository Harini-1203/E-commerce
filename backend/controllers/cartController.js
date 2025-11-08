import CartItem from '../models/CartItem.js'
import Product from '../models/Products.js'

export async function getCart(req, res) {
  try {
    const items = await CartItem.find({}).populate('product')
    const total = items.reduce((sum, it) => sum + it.product.price * it.qty, 0)
    res.json({ items, total })
  } catch (err) {
    res.status(500).json({ message: 'Failed to get cart' })
  }
}

export async function addToCart(req, res) {
  try {
    const { productId, qty } = req.body
    if (!productId || !Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ message: 'productId and positive integer qty required' })
    }

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    let item = await CartItem.findOne({ product: productId })
    if (item) {
      item.qty = item.qty + qty
      await item.save()
    } else {
      item = await CartItem.create({ product: productId, qty })
    }

    const populated = await item.populate('product')
    res.status(200).json(populated)
  } catch (err) {
    res.status(500).json({ message: 'Could not add to cart' })
  }
}

export async function removeFromCart(req, res) {
  try {
    const id = req.params.id
    await CartItem.findByIdAndDelete(id)
    const items = await CartItem.find({}).populate('product')
    const total = items.reduce((sum, it) => sum + it.product.price * it.qty, 0)
    res.json({ items, total })
  } catch (err) {
    res.status(500).json({ message: 'Could not remove item' })
  }
}

export async function checkout(req, res) {
  try {
    const { cartItems, name, email } = req.body
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: 'cartItems required' })
    }

    const ids = cartItems.map((i) => i.productId)
    const products = await Product.find({ _id: { $in: ids } })
    const productMap = Object.fromEntries(products.map(p => [p._id.toString(), p]))

    const total = cartItems.reduce((sum, it) => {
      const p = productMap[it.productId]
      const price = p ? p.price : 0
      const qty = Number.isInteger(it.qty) && it.qty > 0 ? it.qty : 1
      return sum + price * qty
    }, 0)

    const receipt = {
      total,
      timestamp: new Date().toISOString(),
      name: name || '',
      email: email || ''
    }

    await CartItem.deleteMany({})
    res.json({ receipt })
  } catch (err) {
    res.status(500).json({ message: 'Checkout failed' })
  }
}
