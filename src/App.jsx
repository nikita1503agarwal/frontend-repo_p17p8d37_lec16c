import { useEffect, useMemo, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Currency({ value }) {
  return <span>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)}</span>
}

function Navbar({ cartCount }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#" className="font-black tracking-tight text-2xl"><span className="text-black">SEYA</span></a>
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <a href="#shop" className="hover:text-blue-600">Boutique</a>
          <a href="#lookbook" className="hover:text-blue-600">Lookbook</a>
          <a href="#about" className="hover:text-blue-600">À propos</a>
          <a href="#blog" className="hover:text-blue-600">Actu</a>
          <a href="#contact" className="hover:text-blue-600">Contact</a>
        </nav>
        <div className="flex items-center gap-4">
          <button className="relative">
            <span className="i">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] rounded-full px-1.5 py-0.5">{cartCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="bg-neutral-100">
      <div className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">SEYA — Streetwear Gen-Alpha</h1>
          <p className="mt-6 text-neutral-600 text-lg">Palette noir/crème/bleu, silhouettes nettes, attitude confiante. Découvre la nouvelle drop.</p>
          <div className="mt-8 flex gap-3">
            <a href="#shop" className="bg-black text-white px-5 py-3 rounded-full">Shop Now</a>
            <a href="#lookbook" className="px-5 py-3 rounded-full border border-black">Lookbook</a>
          </div>
        </div>
        <div className="aspect-[4/3] bg-gradient-to-br from-neutral-200 to-neutral-50 rounded-2xl flex items-center justify-center text-8xl">🧥</div>
      </div>
    </section>
  )
}

function ProductCard({ p, onAdd }) {
  const image = p.images?.[0] || 'https://images.unsplash.com/photo-1520975922203-b8ad5b1cfdf4'
  return (
    <div className="group border border-neutral-200 rounded-xl overflow-hidden">
      <div className="aspect-square bg-neutral-100 overflow-hidden">
        <img src={`${image}&auto=format&fit=crop&w=800&q=60`} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{p.title}</h3>
          <span className="text-sm text-neutral-600"><Currency value={p.price} /></span>
        </div>
        <p className="text-xs text-neutral-500 mt-1">{p.category}</p>
        <button onClick={() => onAdd(p)} className="mt-4 w-full bg-black text-white py-2 rounded-md">Ajouter au panier</button>
      </div>
    </div>
  )
}

function Shop({ onAdd }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch(`${API}/api/products`)
        if (!r.ok) throw new Error('fetch products')
        const data = await r.json()
        if (data.length === 0) {
          await fetch(`${API}/api/seed`, { method: 'POST' })
          const r2 = await fetch(`${API}/api/products`)
          setItems(await r2.json())
        } else {
          setItems(data)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <section id="shop" className="max-w-6xl mx-auto px-4 py-16">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Boutique</h2>
      </div>
      {loading ? (
        <div className="text-neutral-500">Chargement…</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((p) => (
            <ProductCard key={p.id} p={p} onAdd={onAdd} />
          ))}
        </div>
      )}
    </section>
  )
}

function Blog() {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    fetch(`${API}/api/blog`).then(r => r.json()).then(setPosts).catch(() => setPosts([]))
  }, [])
  return (
    <section id="blog" className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold tracking-tight mb-6">Actu</h2>
      {posts.length === 0 ? (
        <p className="text-neutral-500">Bientôt des news…</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map(p => (
            <article key={p.id} className="border rounded-xl p-4">
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-sm text-neutral-600 mt-2 line-clamp-3">{p.content}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function About() {
  return (
    <section id="about" className="bg-neutral-50">
      <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div className="aspect-[4/3] bg-neutral-200 rounded-xl" />
        <div>
          <h2 className="text-3xl font-bold tracking-tight">À propos</h2>
          <p className="mt-4 text-neutral-600">SEYA est une marque streetwear pensée pour la Gen-Alpha : moderne, premium, minimal. Nous soignons les coupes, les matières et les détails.</p>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [state, setState] = useState('idle')
  async function onSubmit(e) {
    e.preventDefault()
    setState('loading')
    const form = new FormData(e.currentTarget)
    const payload = Object.fromEntries(form.entries())
    try {
      const r = await fetch(`${API}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!r.ok) throw new Error('fail')
      setState('success')
      e.currentTarget.reset()
    } catch {
      setState('error')
    }
  }
  return (
    <section id="contact" className="max-w-3xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold tracking-tight mb-6">Contact</h2>
      <form onSubmit={onSubmit} className="grid gap-4">
        <input required name="name" placeholder="Nom" className="border rounded-md px-3 py-2" />
        <input required name="email" type="email" placeholder="Email" className="border rounded-md px-3 py-2" />
        <input required name="subject" placeholder="Sujet" className="border rounded-md px-3 py-2" />
        <textarea required name="message" rows="4" placeholder="Message" className="border rounded-md px-3 py-2" />
        <button disabled={state==='loading'} className="bg-black text-white py-2 rounded-md">{state==='loading' ? 'Envoi…' : 'Envoyer'}</button>
        {state==='success' && <p className="text-green-600 text-sm">Message envoyé. Merci !</p>}
        {state==='error' && <p className="text-red-600 text-sm">Une erreur est survenue.</p>}
      </form>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-neutral-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-neutral-600 flex flex-col md:flex-row gap-2 md:gap-6 items-center md:items-start justify-between">
        <div className="font-black tracking-tight text-xl">SEYA</div>
        <div className="flex gap-4">
          <a href="#" className="hover:underline">CGV/CGU</a>
          <a href="#" className="hover:underline">Retours</a>
          <a href="#" className="hover:underline">Mentions légales</a>
        </div>
        <p className="text-xs">© {new Date().getFullYear()} SEYA. Tous droits réservés.</p>
      </div>
    </footer>
  )
}

export default function App() {
  const [cart, setCart] = useState([])
  const total = useMemo(() => cart.reduce((s, i) => s + i.price, 0), [cart])

  function addToCart(p) {
    setCart((c) => [...c, { id: p.id, title: p.title, price: p.price, image: p.images?.[0] }])
  }

  async function checkout() {
    if (cart.length === 0) return
    try {
      const payload = {
        items: cart.map(i => ({ product_id: i.id, title: i.title, quantity: 1, unit_price: i.price, image: i.image })),
        success_url: window.location.href,
        cancel_url: window.location.href
      }
      const r = await fetch(`${API}/api/checkout`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await r.json()
      if (data.url) window.location = data.url
      else alert(data.detail || 'Stripe non configuré dans la démo')
    } catch (e) {
      alert('Paiement indisponible sur cette démo')
    }
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Navbar cartCount={cart.length} />
      <Hero />
      <Shop onAdd={addToCart} />
      <About />
      <Blog />
      <Contact />

      {cart.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-4">
          <div>{cart.length} article(s) — <Currency value={total} /></div>
          <button onClick={checkout} className="bg-white text-black px-3 py-1 rounded-full">Payer</button>
        </div>
      )}

      <Footer />
    </div>
  )
}
