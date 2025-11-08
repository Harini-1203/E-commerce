import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: '' }
})

export default mongoose.model('Product', schema)
