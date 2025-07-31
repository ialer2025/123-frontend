import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./index.css";
import "./App.css";

import WarenkorbPage from "./pages/WarenkorbPage";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [quantityMap, setQuantityMap] = useState({});

  // Produkte vom Backend holen
  useEffect(() => {
    fetch("https://one23-backend.onrender.com/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  // Produkt zum Warenkorb hinzufügen & Backend informieren
  const addToCart = (product, quantity) => {
    if (product.stock < quantity) return;

    setCart((prev) => [...prev, { ...product, quantity }]);

    fetch(`https://one23-backend.onrender.com/add-to-cart/${product.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Fehler beim Hinzufügen zum Warenkorb");
        return res.json();
      })
      .then((data) => {
        console.log(data.message);
      })
      .catch((err) => {
        console.error("Fehler beim Warenkorb-Request:", err);
      });
  };

  // Hauptshop-Ansicht
  const ShopHome = () => (
    <div className="app-container">
      {/* 🧴 Header */}
      <div className="app-header">
        <div className="shop-logo">🧴 Mein Kosmetik-Shop</div>
        <nav className="nav-links">
          <Link to="/">Produkte</Link>
          <Link to="/login">Anmelden</Link>
          <Link to="/warenkorb">🛒 Warenkorb ({cart.length})</Link>
        </nav>
      </div>

      {/* 🛍️ Produktkarten */}
      {products.map((product) => (
        <div
          key={product.id}
          className={`product-card ${product.stock === 0 ? "out-of-stock" : ""}`}
        >
          <img src={`/images/${product.image_path}`} alt={product.name} />
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>
            <strong>{product.price.toFixed(2)} €</strong>
          </p>
          <p>
            <em>Lager: {product.stock} Stück</em>
          </p>

          {product.stock > 0 ? (
            <>
              <select
                value={quantityMap[product.id] || 1}
                onChange={(e) => {
                  const qty = parseInt(e.target.value);
                  setQuantityMap((prev) => ({ ...prev, [product.id]: qty }));
                }}
              >
                {[...Array(product.stock)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
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

  // Routing
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ShopHome />} />
        <Route path="/warenkorb" element={<WarenkorbPage cart={cart} />} />
        {/* Optional: Login oder Admin-Seite in Zukunft */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;