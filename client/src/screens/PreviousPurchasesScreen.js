import React, { useEffect, useState } from 'react';

function PreviousPurchasesScreen({ token }) {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    fetch('/purchases', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setPurchases);
  }, [token]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Previous Purchases</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {purchases.map(p => (
          <div key={p.id} className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-200 rounded-lg mb-2" />
            <div className="font-semibold">{p.title}</div>
            <div className="text-green-700 font-bold">${p.price}</div>
            <div className="text-sm text-gray-500">Purchased on {new Date(p.timestamp).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PreviousPurchasesScreen;
