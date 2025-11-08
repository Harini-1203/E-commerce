const API = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

async function request(path, opts = {}) {
  const res = await fetch(API + path, { headers: { 'Content-Type': 'application/json' }, ...opts })
  if (!res.ok) {
    const body = await res.json().catch(()=>({}));
    throw new Error(body.message || 'Request failed')
  }
  return res.json()
}

export async function getProducts() {
  return request('/api/products')
}

export async function getCart() {
  return request('/api/cart')
}

export async function addToCart(productId, qty = 1) {
  return request('/api/cart', { method: 'POST', body: JSON.stringify({ productId, qty }) })
}

export async function removeFromCart(cartItemId) {
  return request('/api/cart/' + cartItemId, { method: 'DELETE' })
}

export async function doCheckout(cartItems, name, email) {
  return request('/api/cart/checkout', { method: 'POST', body: JSON.stringify({ cartItems, name, email }) })
}

export async function save() {
  return request('/api/products/save', { method: 'POST', body: JSON.stringify({}) })
}

export default { getProducts, getCart, addToCart, removeFromCart, doCheckout,save }
