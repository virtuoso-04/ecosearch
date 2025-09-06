import React, { useEffect, useState } from 'react';

function ProductFeedScreen() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/products')
      .then(res => res.json())
      .then(setProducts);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Marketplace</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-200 rounded-lg mb-2" />
            <div className="font-semibold">{product.title}</div>
            <div className="text-green-700 font-bold">${product.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductFeedScreen;
