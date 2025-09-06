import React, { useState } from 'react';

function AddEditProductScreen({ onSubmit, initial }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [category, setCategory] = useState(initial?.category || '');
  const [price, setPrice] = useState(initial?.price || '');
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl || '');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title || !price) return setError('Title and price required.');
    try {
      await onSubmit({ title, description, category, price, imageUrl });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-96 mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">{initial ? 'Edit' : 'Add'} Product</h2>
      <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full mb-3 p-3 rounded-lg border" required />
      <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full mb-3 p-3 rounded-lg border" />
      <input type="text" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} className="w-full mb-3 p-3 rounded-lg border" />
      <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} className="w-full mb-3 p-3 rounded-lg border" required />
      <input type="text" placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full mb-3 p-3 rounded-lg border" />
      {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
      <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition">{initial ? 'Update' : 'Add'} Product</button>
    </form>
  );
}

export default AddEditProductScreen;
