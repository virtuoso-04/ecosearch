import React, { useEffect, useState } from 'react';

function MyListingsScreen({ user }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/products')
      .then(res => res.json())
      .then(data => setProducts(data.filter(p => p.ownerId === user.id)));
  }, [user]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Listings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-200 rounded-lg mb-2" />
            <div className="font-semibold">{product.title}</div>
            <div className="text-green-700 font-bold">${product.price}</div>
            <div className="flex gap-2 mt-2">
              <button className="bg-blue-500 text-white px-3 py-1 rounded shadow">Edit</button>
              <button className="bg-red-500 text-white px-3 py-1 rounded shadow">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyListingsScreen;
