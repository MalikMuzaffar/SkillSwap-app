import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import LoaderComp from '../loader';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/category');
      setCategories(data?.categories || []);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Name is required');

    try {
      if (editMode) {
        await axios.patch(`/category/update-category/${editingId}`, { name });
        toast.success('Category updated');
      } else {
        await axios.post('/category/add-category', { name });
        toast.success('Category added');
      }
      setName('');
      setEditMode(false);
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleEdit = (cat) => {
    setEditMode(true);
    setEditingId(cat._id);
    setName(cat.name);
  };

if(categories.length==0){
    return <LoaderComp/>
}

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10 font-font1 text-textColor">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Manage Categories</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-6 flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            placeholder="Enter category name"
            className="w-full sm:w-auto flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition flex items-center gap-2"
          >
            <PlusCircle size={18} />
            {editMode ? 'Update' : 'Add'}
          </button>
        </form>

        {/* Category Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border border-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-2 px-4 border-b">#</th>
                <th className="py-2 px-4 border-b">Category Name</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((cat, index) => (
                  <tr key={cat._id} className="hover:bg-gray-50 transition">
                    <td className="py-2 px-4 border-b">{index + 1}</td>
                    <td className="py-2 px-4 border-b capitalize">{cat.name}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-4 px-4 text-center" colSpan="3">No categories found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
