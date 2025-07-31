import './index.css';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch("https://one23-backend.onrender.com/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  const addToCart = (product, quantity) => {
    if (product.stock < quantity) return;
    setCart((prev) => [...prev, { ...product, quantity }]);
  };

  return (
    <div className="app-container">
      {/* 🧴 Header-Bereich */}
      <div className="app-header">
        <div className="shop-logo">🧴 Mein Kosmetik-Shop</div>
        <nav className="nav-links">
          <a href="#">Produkte</a>
          <a href="#">Anmelden</a>
          <a href="#">🛒 Warenkorb ({cart.length})</a>
        </nav>
      </div>

      {/* 🛍️ Produktliste */}
      {products.map((product) => (
        <div
          key={product.id}
          className={`product-card ${product.stock === 0 ? 'out-of-stock' : ''}`}
        >
          <img src={`/images/${product.image_path}`} alt={product.name} />
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p><strong>{product.price.toFixed(2)} €</strong></p>
          <p><em>Lager: {product.stock} Stück</em></p>

          {product.stock > 0 && (
            <>
              <select
                defaultValue="1"
                onChange={(e) => product.quantity = parseInt(e.target.value)}
              >
                {[...Array(product.stock)].map((_, i) => (
                  <option key={i + 1}>{i + 1}</option>
                ))}
              </select>
              <button onClick={() => addToCart(product, product.quantity || 1)}>
                In den Warenkorb 🛒
              </button>
            </>
          )}
          {product.stock === 0 && <p className="gray-text">Ausverkauft</p>}
        </div>
      ))}
    </div>
  );
}
function Home({ products, addToCart }) {
  return (
    <>
      {products.map(product => (
        <div key={product.id}>...Produktkarte...</div>
      ))}
    </>
  );
}

function WarenkorbPage({ cart }) {
  return (
    <div>
      <h2>🛒 Dein Warenkorb</h2>
      {cart.map((item, i) => (
        <p key={i}>{item.name} x {item.quantity}</p>
      ))}
    </div>
  );
}
export default App;