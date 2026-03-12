"use client";
import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";

const DEFAULT_CATS = [
  { _id:"1", name:"Bollywood", slug:"bollywood", count: 474, color:"#e50914" },
  { _id:"2", name:"Hollywood", slug:"hollywood", count: 362, color:"#1a4a8a" },
  { _id:"3", name:"South Hindi Dubbed", slug:"south-hindi", count: 225, color:"#7b2d8b" },
  { _id:"4", name:"Dual Audio", slug:"dual-audio", count: 112, color:"#1a6b3a" },
  { _id:"5", name:"Web Series", slug:"web-series", count: 74, color:"#8a4a1a" },
];

export default function AdminCategoriesPage() {
  const [cats, setCats] = useState(DEFAULT_CATS);
  const [editing, setEditing] = useState<string|null>(null);
  const [newCat, setNewCat] = useState({ name:"", slug:"", color:"#e50914" });
  const [showForm, setShowForm] = useState(false);
  const [editForm, setEditForm] = useState({ name:"", color:"" });

  const handleAdd = () => {
    if (!newCat.name) { toast.error("Name required"); return; }
    setCats(prev => [...prev, { _id: Date.now().toString(), ...newCat, count: 0 }]);
    setNewCat({ name:"", slug:"", color:"#e50914" });
    setShowForm(false);
    toast.success("Category added");
  };

  const handleEdit = (id: string) => {
    setCats(prev => prev.map(c => c._id === id ? {...c, ...editForm} : c));
    setEditing(null);
    toast.success("Category updated");
  };

  const handleDelete = (id: string) => {
    setCats(prev => prev.filter(c => c._id !== id));
    toast.success("Category deleted");
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-white uppercase tracking-widest">Categories</h1>
          <p className="text-[#555] text-sm mt-0.5">{cats.length} categories</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-red flex items-center gap-2 text-white font-bold px-4 py-2.5 rounded-sm text-sm">
          <FiPlus size={14}/> Add Category
        </button>
      </div>

      {showForm && (
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm p-5 mb-5">
          <h3 className="text-white font-semibold mb-4">New Category</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-[#666] text-xs uppercase tracking-wider font-semibold mb-1.5 block">Name</label>
              <input value={newCat.name} onChange={e => setNewCat(p => ({...p, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g,"-")}))}
                placeholder="Category name"
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#e50914] text-white text-sm px-4 py-2.5 rounded-sm outline-none transition-colors" />
            </div>
            <div>
              <label className="text-[#666] text-xs uppercase tracking-wider font-semibold mb-1.5 block">Slug</label>
              <input value={newCat.slug} onChange={e => setNewCat(p => ({...p, slug: e.target.value}))}
                placeholder="category-slug"
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#e50914] text-white text-sm px-4 py-2.5 rounded-sm outline-none transition-colors" />
            </div>
            <div>
              <label className="text-[#666] text-xs uppercase tracking-wider font-semibold mb-1.5 block">Accent Color</label>
              <div className="flex gap-2">
                <input type="color" value={newCat.color} onChange={e => setNewCat(p => ({...p, color: e.target.value}))}
                  className="w-10 h-10 rounded-sm border border-[#2a2a2a] bg-[#0a0a0a] cursor-pointer" />
                <input value={newCat.color} onChange={e => setNewCat(p => ({...p, color: e.target.value}))}
                  className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#e50914] text-white text-sm px-3 py-2.5 rounded-sm outline-none transition-colors" />
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleAdd} className="btn-red text-white font-bold px-5 py-2 rounded-sm text-sm">Add Category</button>
            <button onClick={() => setShowForm(false)} className="bg-[#1a1a1a] border border-[#333] text-[#ccc] font-bold px-5 py-2 rounded-sm text-sm hover:border-[#444] transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cats.map(cat => (
          <div key={cat._id} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm overflow-hidden">
            <div className="h-1.5" style={{ backgroundColor: cat.color }}/>
            <div className="p-5">
              {editing === cat._id ? (
                <div className="space-y-3">
                  <input defaultValue={cat.name} onChange={e => setEditForm(p => ({...p, name: e.target.value}))}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#e50914] text-white text-sm px-3 py-2 rounded-sm outline-none transition-colors" />
                  <div className="flex gap-2 items-center">
                    <input type="color" defaultValue={cat.color} onChange={e => setEditForm(p => ({...p, color: e.target.value}))}
                      className="w-9 h-9 rounded-sm border border-[#2a2a2a] bg-[#0a0a0a] cursor-pointer" />
                    <span className="text-[#666] text-xs">Accent color</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(cat._id)}
                      className="flex items-center gap-1 bg-green-900/30 hover:bg-green-900/60 text-green-400 text-xs font-bold px-3 py-1.5 rounded-sm transition-colors">
                      <FiCheck size={12}/> Save
                    </button>
                    <button onClick={() => setEditing(null)}
                      className="flex items-center gap-1 bg-[#1a1a1a] text-[#888] text-xs font-bold px-3 py-1.5 rounded-sm hover:border-[#444] transition-colors">
                      <FiX size={12}/> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-display font-bold uppercase tracking-wide">{cat.name}</h3>
                    <div className="flex gap-1.5">
                      <button onClick={() => { setEditing(cat._id); setEditForm({name:cat.name,color:cat.color}); }}
                        className="w-7 h-7 bg-[#1a4a8a]/30 hover:bg-[#1a4a8a]/60 text-blue-400 rounded-sm flex items-center justify-center transition-colors">
                        <FiEdit2 size={12}/>
                      </button>
                      <button onClick={() => handleDelete(cat._id)}
                        className="w-7 h-7 bg-[#e50914]/20 hover:bg-[#e50914]/40 text-[#e50914] rounded-sm flex items-center justify-center transition-colors">
                        <FiTrash2 size={12}/>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#555] text-xs font-mono">/{cat.slug}</span>
                    <span className="ml-auto bg-[#1a1a1a] text-[#888] text-xs px-2 py-0.5 rounded-sm">{cat.count} movies</span>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
