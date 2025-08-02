import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../auth/AuthContext';

export default function AdminCategoryManager() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await API.get('api/categories/');
      setCategories(response.data);
    } catch (err) {
      setError('Failed to load categories');
      console.error(err);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    
    try {
      await API.post('api/categories/', { name: newCategory });
      setNewCategory('');
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.name?.[0] || 'Failed to add category');
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await API.delete(`api/categories/${id}/`);
      fetchCategories();
    } catch (err) {
      setError('Failed to delete category');
      console.error(err);
    }
  };

  if (user?.role !== 'admin') {
    return <div>You don't have permission to access this page.</div>;
  }

  return (
    <div className="admin-categories">
      <h2>Manage Categories</h2>
      {error && <div className="error">{error}</div>}
      
      <div className="add-category">
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
        />
        <button onClick={handleAddCategory}>Add Category</button>
      </div>
      
      <ul className="category-list">
        {categories.map(category => (
          <li key={category.id}>
            {category.name}
            <button 
              onClick={() => handleDeleteCategory(category.id)}
              className="delete-btn"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}