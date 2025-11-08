import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  qty: { type: Number, default: 1, min: 1 }
})

export default mongoose.model('CartItem', schema)
