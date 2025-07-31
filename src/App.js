import React, { useState, useEffect } from "react";
import './index.css';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [quantityMap, setQuantityMap] = useState({});
  const doSomething = () => {
    console.log("Produkte-Button wurde gedrückt");
    // Oder: Navigation, Modal öffnen, Seite wechseln, etc.
  };

  useEffect(() => {
    fetch("https://one23-backend.onrender.com/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  const addToCart = (product, quantity) => {
    if (product.stock < quantity) return;

    setCart((prev) => [...prev, { ...product, quantity }]);

    fetch(`https://one23-backend.onrender.com/add-to-cart/${product.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity })
    })
      .then(res => {
        if (!res.ok) throw new Error("Fehler beim Hinzufügen zum Warenkorb");
        return res.json();
      })
      .then(data => {
        console.log(data.message); // Feedback anzeigen, wenn du magst
      })
      .catch(err => {
        console.error("Fehler beim Warenkorb-Request:", err);
      });
  };

  return (
    <div className="app-container">
      {/* 🧴 Header-Bereich */}
      <div className="app-header">
        <div className="shop-logo">🧴 Mein Kosmetik-Shop</div>
        <nav className="nav-links">
          <button onClick={() => doSomething()}>Produkte</button>
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

          {product.stock > 0 ? (
            <>
              <select
                value={quantityMap[product.id] || 1}
                onChange={(e) => {
                  const qty = parseInt(e.target.value);
                  setQuantityMap(prev => ({ ...prev, [product.id]: qty }));
                }}
              >
                {[...Array(product.stock)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              <button onClick={() => addToCart(product, quantityMap[product.id] || 1)}>
                In den Warenkorb 🛒
              </button>
            </>
          ) : (
            <p className="gray-text">Ausverkauft</p>
          )}
        </div>
      ))}
    </div>
  );
}

// Zusätzliche Komponenten (werden aktuell nicht verwendet, aber sind korrekt)
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