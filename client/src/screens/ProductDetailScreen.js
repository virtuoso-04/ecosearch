import React, { useEffect, useState } from 'react';

function ProductDetailScreen({ productId }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`/products/${productId}`)
      .then(res => res.json())
      .then(setProduct);
  }, [productId]);

  if (!product) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-8 mt-8">
      <div className="w-full h-64 bg-gray-200 rounded-lg mb-4" />
      <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
      <div className="text-green-700 font-bold text-xl mb-2">${product.price}</div>
      <div className="mb-2">Category: <span className="font-semibold">{product.category}</span></div>
      <div className="mb-4">{product.description}</div>
    </div>
  );
}

export default ProductDetailScreen;
