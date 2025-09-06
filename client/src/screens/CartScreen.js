import React, { useState } from 'react';

function CartScreen({ cart, onRemove }) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cart.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-200 rounded-lg mb-2" />
            <div className="font-semibold">{item.title}</div>
            <div className="text-green-700 font-bold">${item.price}</div>
            <button onClick={() => onRemove(item.id)} className="bg-red-500 text-white px-3 py-1 rounded shadow mt-2">Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CartScreen;
