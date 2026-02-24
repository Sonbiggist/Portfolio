import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Trash2, Image as ImageIcon, Video, Folder, User } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<any>({});
  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchData();
  }, [token, navigate]);

  const fetchData = async () => {
    const [profRes, catRes, itemRes] = await Promise.all([
      fetch('/api/profile'),
      fetch('/api/categories'),
      fetch('/api/portfolio')
    ]);
    setProfile(await profRes.json());
    setCategories(await catRes.json());
    setItems(await itemRes.json());
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  // Profile Handlers
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    alert('Profile updated');
    fetchData();
  };

  // Category Handlers
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const type = (form.elements.namedItem('type') as HTMLSelectElement).value;
    
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, type })
    });
    form.reset();
    fetchData();
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Are you sure? This will delete all items in this category.')) return;
    await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchData();
  };

  // Portfolio Item Handlers
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    (e.target as HTMLFormElement).reset();
    fetchData();
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm('Delete this item?')) return;
    await fetch(`/api/portfolio/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchData();
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex font-sans text-neutral-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col">
        <div className="p-6 border-b border-neutral-100">
          <h1 className="text-xl font-bold tracking-tight">Admin Panel</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'profile' ? 'bg-black text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}
          >
            <User className="w-5 h-5" /> Profile
          </button>
          <button 
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'categories' ? 'bg-black text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}
          >
            <Folder className="w-5 h-5" /> Categories
          </button>
          <button 
            onClick={() => setActiveTab('portfolio')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'portfolio' ? 'bg-black text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}
          >
            <ImageIcon className="w-5 h-5" /> Portfolio Items
          </button>
        </nav>
        <div className="p-4 border-t border-neutral-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-8">
              <h2 className="text-2xl font-bold mb-8">Edit Profile</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Name</label>
                    <input type="text" name="name" defaultValue={profile.name} className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Title</label>
                    <input type="text" name="title" defaultValue={profile.title} className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">About</label>
                  <textarea name="about" defaultValue={profile.about} rows={4} className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Experience</label>
                  <textarea name="experience" defaultValue={profile.experience} rows={4} className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Avatar (Optional)</label>
                  <input type="file" name="avatar" accept="image/*" className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl" />
                  <input type="hidden" name="avatar_url" value={profile.avatar_url || ''} />
                  {profile.avatar_url && <img src={profile.avatar_url} alt="Avatar" className="mt-4 w-20 h-20 rounded-full object-cover" />}
                </div>
                <button type="submit" className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-neutral-800">Save Changes</button>
              </form>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="space-y-8">
              <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-8">
                <h2 className="text-2xl font-bold mb-8">Add Category</h2>
                <form onSubmit={handleAddCategory} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Category Name</label>
                    <input type="text" name="name" required className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl" placeholder="e.g. Wedding Videos" />
                  </div>
                  <div className="w-48">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Type</label>
                    <select name="type" className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  <button type="submit" className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-neutral-800 flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Add
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="p-4 font-medium text-neutral-500">Name</th>
                      <th className="p-4 font-medium text-neutral-500">Type</th>
                      <th className="p-4 font-medium text-neutral-500 w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {categories.map(cat => (
                      <tr key={cat.id} className="hover:bg-neutral-50">
                        <td className="p-4 font-medium">{cat.name}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${cat.type === 'video' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            {cat.type === 'video' ? <Video className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
                            {cat.type}
                          </span>
                        </td>
                        <td className="p-4">
                          <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Portfolio Tab */}
          {activeTab === 'portfolio' && (
            <div className="space-y-8">
              <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-8">
                <h2 className="text-2xl font-bold mb-8">Add Portfolio Item</h2>
                <form onSubmit={handleAddItem} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Title</label>
                      <input type="text" name="title" required className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Category</label>
                      <select name="category_id" required className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name} ({cat.type})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
                    <textarea name="description" rows={3} className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Media File (Image/Video)</label>
                    <input type="file" name="media" required accept="image/*,video/*" className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl" />
                  </div>
                  <button type="submit" className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-neutral-800 flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Upload Item
                  </button>
                </form>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {items.map(item => (
                  <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden group">
                    <div className="aspect-video bg-neutral-100 relative">
                      {item.category_type === 'image' ? (
                        <img src={item.media_url} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <video src={item.media_url} className="w-full h-full object-cover" muted />
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button onClick={() => handleDeleteItem(item.id)} className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">{item.category_name}</div>
                      <h3 className="font-bold text-neutral-900 truncate">{item.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
