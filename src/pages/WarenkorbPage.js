// src/pages/WarenkorbPage.js
import React from 'react';

function WarenkorbPage({ cart }) {
  return (
    <div className="warenkorb-page">
      <h2>🛒 Dein Warenkorb</h2>
      {cart.length === 0 ? (
        <p>Dein Warenkorb ist leer.</p>
      ) : (
        cart.map((item, i) => (
          <p key={i}>{item.name} x {item.quantity}</p>
        ))
      )}
    </div>
  );
}

export default WarenkorbPage;