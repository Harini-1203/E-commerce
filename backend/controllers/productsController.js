import Product from '../models/Products.js'

export async function saveProducts(req, res) {
  const base= 'http://localhost:5000'
  try {
    const items = [
      { name: 'flower keychain', price: 200, image: base+'/img/flower.png' },
      { name: 'Whale couple keychain', price: 1499, image: base+'/img/couple.png' },
      { name: 'Avocado keychain', price: 499, image: base+'/img/ac.png' },
      { name: 'Lil dino keychain', price: 799, image: base+'/img/dino.png' }
    ]
    await Product.deleteMany({})
    const docs = await Product.insertMany(items)
    res.status(201).json(docs)
  } catch (err) {
    res.status(500).json({ message: 'Failed to save products' })
  }
}

export async function getProducts(req, res) {
  try {
    const products = await Product.find({})
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch products' })
  }
}
