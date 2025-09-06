import React, { useEffect, useState } from 'react';

function DashboardScreen({ token }) {
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    fetch('/user/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setName(data.name || '');
        setAvatarUrl(data.avatarUrl || '');
      });
  }, [token]);

  const handleSave = async () => {
    await fetch('/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name, avatarUrl })
    });
    setEdit(false);
  };

  if (!profile) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow p-8 mt-8">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 bg-gray-200 rounded-full mb-4" style={{ backgroundImage: `url(${profile.avatarUrl})`, backgroundSize: 'cover' }} />
        {edit ? (
          <>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="mb-2 p-2 rounded border w-full" />
            <input type="text" value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} className="mb-2 p-2 rounded border w-full" />
            <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded shadow">Save</button>
          </>
        ) : (
          <>
            <div className="text-xl font-bold mb-2">{profile.name}</div>
            <div className="mb-2">{profile.email}</div>
            <button onClick={() => setEdit(true)} className="bg-blue-600 text-white px-4 py-2 rounded shadow">Edit</button>
          </>
        )}
      </div>
    </div>
  );
}

export default DashboardScreen;
