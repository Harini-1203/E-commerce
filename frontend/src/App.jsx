import React, { useEffect, useState } from 'react'
import { getProducts, getCart, addToCart, removeFromCart, doCheckout,save } from './lib/api'
import { FaShoppingCart } from "react-icons/fa";


function Header({ cartTotal, onToggleCart }) {
  return (
    <header className=" bg-[var(--green)] flex items-center justify-between p-4 shadow mb-8">
      <h1 className="text-xl font-semibold">Nexora Shopping</h1>
      <div className="flex items-center gap-4">
        <button onClick={onToggleCart} className="flex items-center gap-2 px-3 py-2  bg-[var(--color)] text-white rounded">
          <FaShoppingCart /> Cart
        </button>
      </div>
    </header>
  )
}

function ProductCard({ p, onAdd }) {
  return (
    <div className="bg-white p-4 flex flex-col shadow ">
      <div className="h-40 bg-gray-100 rounded mb-3 flex items-center justify-center">
        {p.image ? <img src={p.image} alt={p.name} className="h-48 w-96 object-cover" /> : <div className="text-gray-400">No image</div>}
      </div>
      <h3 className="font-medium mt-2">{p.name}</h3>
      <div className="mt-auto flex items-center justify-between">
        <div className="text-lg font-bold">₹{(p.price)}</div>
        <button onClick={() => onAdd(p._id)} className="px-7 py-1  bg-[var(--color)] text-white rounded">Add</button>
      </div>
    </div>
  )
}

function CartSidebar({ items, onRemove, onInc, onDec, onCheckout, open, onClose }) {
  const total = items.reduce((s, it) => s + it.product.price * it.qty, 0)
  return (
    <aside className={`${open ? 'translate-x-0' : 'translate-x-full'} fixed right-0 top-0 h-full w-full md:w-96 bg-[var(--green)] shadow-lg transform transition-transform `}>
      <div className="p-4 flex items-center justify-between border-b ">
        <h2 className="text-lg font-semibold">Your Cart</h2>
        <button onClick={onClose} className="text-gray-600">Close</button>
      </div>
      <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-350px)]">
        {items.length === 0 && <div className="text-gray-500">Cart is empty</div>}
        {items.map(it => (
          <div key={it._id} className="flex items-center gap-3">
            <div className="flex-1">
              <div className="font-medium">{it.product.name}</div>
              <div className="text-sm text-gray-500">₹{(it.product.price)}</div>
              <div className="mt-2 flex items-center gap-2">
                <button onClick={() => onDec(it)} className="px-2 py-1 text-white bg-[var(--color)] rounded">-</button>
                <div>{it.qty}</div>
                <button onClick={() => onInc(it)} className="px-2 py-1 text-white bg-[var(--color)] rounded">+</button>
                <button onClick={() => onRemove(it._id)} className="ml-4 text-red-700 font-semibold">Remove</button>
              </div>
            </div>
            <div className="font-semibold">₹{((it.product.price * it.qty))}</div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <div className="flex items-center justify-between mb-3">
          <div className="font-bold">Total</div>
          <div className="font-bold">₹{(total)}</div>
        </div>
        <CheckoutForm onCheckout={onCheckout} disabled={items.length===0} items={items} />
      </div>
    </aside>
  )
}

function CheckoutForm({ onCheckout, disabled, items }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState('')

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    await onCheckout(items.map(it => ({ productId: it.product._id, qty: it.qty })), name, email)
    setLoading(false)
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input value={name} onChange={e=>setName(e.target.value)} className="w-full border px-2 py-1 rounded" placeholder="Name" required />
      <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full border px-2 py-1 rounded" placeholder="Email" type="email" required />
      <textarea value={address} onChange={e=>setAddress(e.target.value)} className="w-full border px-2 py-1 rounded" placeholder="Address" required />
      <button disabled={disabled||loading} className="w-full px-3 py-2 bg-[var(--color)] text-white rounded">{loading? 'Processing...' : 'Checkout'}</button>
    </form>
  )
}

export default function App() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState({ items: [], total: 0 })
  const [cartOpen, setCartOpen] = useState(false)
  const [receipt, setReceipt] = useState(null)

  useEffect(() => { fetchProducts(); fetchCart() }, [])

  async function fetchProducts() {
    await saveProducts()
    const res = await getProducts()
    setProducts(res)
  }

  async function saveProducts() {
    const res = await save()
  }

  async function fetchCart() {
    const res = await getCart()
    setCart(res)
  }

  async function handleAdd(productId) {
    await addToCart(productId, 1)
    await fetchCart()
    setCartOpen(true)
  }

  async function handleRemove(cartItemId) {
    await removeFromCart(cartItemId)
    await fetchCart()
  }

  async function handleInc(item) {
    await addToCart(item.product._id, 1)
    await fetchCart()
  }

  async function handleDec(item) {
    if (item.qty <= 1) {
      await handleRemove(item._id)
    } else {
      // remove then re-add with qty-1
      await removeFromCart(item._id)
      await addToCart(item.product._id, item.qty - 1)
      await fetchCart()
    }
  }

  async function handleCheckout(cartItems, name, email) {
    const res = await doCheckout(cartItems, name, email)
    setReceipt(res.receipt)
    await fetchCart()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartTotal={cart.total} onToggleCart={() => setCartOpen(v => !v)} />
      <main className="p-4">
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {
            products.map(p => (
            <ProductCard key={p._id} p={p} onAdd={handleAdd} />
          ))}
        </section>
      </main>


      <CartSidebar items={cart.items} onRemove={handleRemove} onInc={handleInc} onDec={handleDec} onCheckout={handleCheckout} open={cartOpen} onClose={()=>setCartOpen(false)} />

      {receipt && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-96">
            <h3 className="text-lg font-semibold mb-2">Receipt</h3>
            <div>Total: ${(receipt.total/100).toFixed(2)}</div>
            <div className="text-sm text-gray-600">When: {new Date(receipt.timestamp).toLocaleString()}</div>
            {receipt.name && <div>Name: {receipt.name}</div>}
            {receipt.email && <div>Email: {receipt.email}</div>}
            <div className="mt-4 flex justify-end">
              <button onClick={()=>setReceipt(null)} className="px-3 py-2 bg-indigo-600 text-white rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
