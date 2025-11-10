import { useEffect, useMemo, useState } from 'react'
import Spline from '@splinetool/react-spline'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Navbar({ cartCount, onToggleTheme }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur bg-black/30 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-rose-500 to-orange-400" />
          <span className="font-semibold tracking-wide">POD Art Shop</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm opacity-90">
          <a href="#catalog" className="hover:opacity-100">Shop</a>
          <a href="#gallery" className="hover:opacity-100">Gallery</a>
          <a href="#about" className="hover:opacity-100">About</a>
        </nav>
        <div className="flex items-center gap-4 text-sm">
          <button onClick={onToggleTheme} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20">Theme</button>
          <a href="#cart" className="relative px-3 py-1 rounded bg-white/10 hover:bg-white/20">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 text-[10px] leading-none bg-rose-500 text-white rounded-full px-1.5 py-1">{cartCount}</span>
            )}
          </a>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative h-[80vh] w-full overflow-hidden" aria-label="Interactive Cover">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/cEecEwR6Ehj4iT8T/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 h-full flex items-center">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="text-white/90 max-w-xl">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight drop-shadow">Modern Art. On Demand.</h1>
            <p className="mt-4 text-base sm:text-lg text-white/80">Gallery-grade designs printed on premium apparel and wall art. Interactive visuals meet minimalist commerce.</p>
            <a href="#catalog" className="inline-block mt-6 px-6 py-3 rounded bg-gradient-to-r from-rose-500 to-orange-400 text-white font-medium shadow hover:opacity-95">Shop Collection</a>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductCard({ item, onAdd }) {
  const image = item.images?.[0]
  return (
    <div className="group rounded-xl border border-white/10 bg-white/5 backdrop-blur p-4 hover:shadow-xl hover:shadow-rose-500/10 transition relative">
      {image && (
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-black/30">
          <img src={image} alt={item.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition" />
        </div>
      )}
      <div className="pt-4">
        <h3 className="font-semibold text-white/90 line-clamp-1">{item.title}</h3>
        <p className="text-white/60 text-sm line-clamp-2 min-h-[2.75rem]">{item.description || '—'}</p>
        <div className="flex items-center justify-between pt-3">
          <span className="text-white font-medium">${(item.price || 0).toFixed(2)}</span>
          <button onClick={() => onAdd(item)} className="px-3 py-1.5 rounded bg-rose-500/90 hover:bg-rose-500 text-white text-sm">Add to Cart</button>
        </div>
      </div>
    </div>
  )
}

function Catalog({ items, onAdd, onFilter }) {
  const categories = useMemo(() => {
    const set = new Set()
    items.forEach(i => (i.categories || []).forEach(c => set.add(c)))
    return ['All', ...Array.from(set)]
  }, [items])

  return (
    <section id="catalog" className="relative py-16 bg-gradient-to-b from-black via-[#0b0b0b] to-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Featured Products</h2>
            <p className="text-white/60">Synced automatically from your Printify store</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <button key={c} onClick={() => onFilter(c)} className="px-3 py-1.5 rounded bg-white/10 text-white/80 hover:bg-white/20 text-sm">{c}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map(item => (
            <ProductCard key={item.id} item={item} onAdd={onAdd} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CartDrawer({ open, items, onClose }) {
  const total = items.reduce((s, it) => s + (it.price || 0) * it.quantity, 0)
  return (
    <div className={`fixed inset-0 z-[60] transition ${open ? '' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-black/60 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div className={`absolute right-0 top-0 h-full w-full sm:w-[420px] bg-[#0f0f0f] border-l border-white/10 text-white transform transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <h3 className="font-semibold">Your Cart</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white">Close</button>
        </div>
        <div className="p-6 space-y-4 max-h-[calc(100%-160px)] overflow-y-auto">
          {items.length === 0 && <p className="text-white/60">Cart is empty</p>}
          {items.map((it, idx) => (
            <div key={idx} className="flex gap-3">
              {it.images?.[0] && <img src={it.images[0]} alt="" className="w-16 h-16 rounded object-cover" />}
              <div className="flex-1">
                <p className="font-medium">{it.title}</p>
                <p className="text-sm text-white/60">Qty {it.quantity}</p>
              </div>
              <div className="font-medium">${((it.price||0)*it.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div className="p-6 border-t border-white/10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/60">Subtotal</span>
            <span className="font-semibold">${total.toFixed(2)}</span>
          </div>
          <button className="w-full py-3 rounded bg-gradient-to-r from-rose-500 to-orange-400 font-medium">Checkout</button>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [dark, setDark] = useState(true)
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState([])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  useEffect(() => {
    const load = async () => {
      try {
        // Ensure backend has data; try to sync first (safe if already synced)
        await fetch(`${BACKEND_URL}/api/printify/sync`, { method: 'POST' })
        const res = await fetch(`${BACKEND_URL}/api/catalog`)
        const data = await res.json()
        setProducts(data)
        setFiltered(data)
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [])

  const onAdd = (item) => {
    setCartOpen(true)
    setCart(prev => {
      const found = prev.find(p => p.id === item.id)
      if (found) return prev.map(p => p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p)
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const onFilter = (category) => {
    if (category === 'All') return setFiltered(products)
    setFiltered(products.filter(i => (i.categories||[]).includes(category)))
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar cartCount={cart.reduce((s,i)=>s+i.quantity,0)} onToggleTheme={() => setDark(v=>!v)} />
      <main className="pt-16">
        <Hero />
        <Catalog items={filtered} onAdd={onAdd} onFilter={onFilter} />
        <section id="gallery" className="py-16 bg-black">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Original Artworks</h2>
            <p className="text-white/60 max-w-2xl">Showcase your illustrations and concepts in a minimalist grid. This can be curated manually or pulled from a CMS later.</p>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900" />
              ))}
            </div>
          </div>
        </section>
        <section id="about" className="py-16 bg-[#0b0b0b]">
          <div className="max-w-3xl mx-auto px-6 text-white/80">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">About the Studio</h2>
            <p>We merge digital art and ethical print production. Each piece is printed on demand to reduce waste and keep the focus on craft.</p>
          </div>
        </section>
      </main>
      <CartDrawer open={cartOpen} items={cart} onClose={() => setCartOpen(false)} />
    </div>
  )
}
