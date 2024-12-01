'use client';

import React, { useState, useEffect } from 'react';
import axios from '@/utils/axiosClient';
import { CategoryButton } from './CategoryButton';
import { FormComponent } from './Form';
import { AnimalCard } from './card';

interface Category {
  _id: string;
  name: string;
}

interface Animal {
  _id: string;
  name: string;
  image: string;
  category: Category;
}

const AssetsGallery: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<'animal' | 'category' | null>(null);

  /**
   * Fetches categories from the API.
   */
  const fetchCategories = async () => {
    try {
      console.log('API GET /api/categories');
      const response = await axios.get('/api/categories');
      setCategories(response.data);
      console.log('Categories fetched:', response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch categories.');
    }
  };

  /**
   * Fetches animals from the API, optionally filtered by category.
   * @param {string} categoryId - The ID of the category to filter by.
   */
  const fetchAnimals = async (categoryId?: string) => {
    try {
      const endpoint = categoryId
        ? `/api/animals/category/${categoryId}`
        : '/api/animals';
      console.log(`API GET ${endpoint}`);
      const response = await axios.get(endpoint);
      setAnimals(response.data);
      console.log('Animals fetched:', response.data);
    } catch (err) {
      console.error('Error fetching animals:', err);
      setError('Failed to fetch animals.');
    }
  };

  // Initial data fetching
  useEffect(() => {
    const now = Date.now();
    console.log(now);
    const fetchData = async () => {
      setLoading(true);
      console.log('Fetching initial data...');
      await Promise.all([fetchCategories(), fetchAnimals()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  /**
   * Handles adding a new category.
   * @param {string} name - The name of the new category.
   */
  const handleAddCategory = async (name: string) => {
    try {
      console.log('API POST /api/category', { name });
      await axios.post('/api/category', { name });
      console.log('Category added successfully.');
      await fetchCategories();
      setError(null);
    } catch (err) {
      console.error('Error adding category:', err);
      setError('Failed to add category.');
    }
  };

  /**
   * Handles category selection and fetches animals for the selected category.
   * @param {Category} category - The selected category.
   */
  const handleCategoryClick = async (category: Category) => {
    console.log('Category selected:', category);
    setSelectedCategoryId(category._id);
    await fetchAnimals(category._id);
  };

  /**
   * Handles adding a new animal to the selected category.
   * @param {string} name - The name of the animal.
   * @param {File} image - The image of the animal.
   */
  const handleAddAnimal = async (name: string, image?: File) => {
    if (!selectedCategoryId) {
      console.warn('No category selected. Cannot add animal.');
      setError('Please select a category before adding an animal.');
      return;
    }

    try {
      const apiEndpoint = `/api/animal/category/${selectedCategoryId}`;
      console.log('API POST', apiEndpoint, { name, image });

      const formData = new FormData();
      formData.append('name', name);
      if (image) {
        formData.append('image', image);
      }

      const response = await axios.post(apiEndpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Animal added successfully:', response.data);
      setError(null);
      setShowForm(null);
      await fetchAnimals(selectedCategoryId);

      return;
    } catch (err: undefined | unknown | any) {
      console.error('Error adding animal:', err);
      setError(err.response?.data?.message || 'Failed to add animal.');
      return;
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <main className="flex flex-col items-center px-20 pt-24 pb-96 bg-black max-md:px-5 max-md:py-24">
        {/* Category Buttons */}
        <div className="flex flex-wrap gap-6 items-start text-red-600">
          {categories.map((category) => (
            <CategoryButton
              key={category._id}
              name={category.name}
              isActive={selectedCategoryId === category._id}
              onClick={() => handleCategoryClick(category)}
            />
          ))}
          <CategoryButton name="Add Category" onClick={() => setShowForm('category')}
            styleVariant="alternative" // Different style
          />
        </div>

        {/* Add Animal Button */}
        {selectedCategoryId && (
          <div>
            <p className="text-white">
              Selected Category: {categories.find((c) => c._id === selectedCategoryId)?.name}
            </p>
            <CategoryButton name="Add Animal" onClick={() => setShowForm('animal')}
              styleVariant="alternative" // Different style

            />
          </div>
        )}

        {/* Render Form */}
        {showForm && (
          <FormComponent
            type={showForm}
            onClose={() => setShowForm(null)}
            onSubmit={showForm === 'animal' ? handleAddAnimal : handleAddCategory}
          />
        )}

        {/* Animal Cards */}
        <div className="animal-cards-container">
          {animals.length ? (
            animals.map((animal) => (
              <AnimalCard
                key={animal._id}
                name={animal.name}
                imageUrl={animal.image
                  ? `${axios.defaults.baseURL}${animal.image.replace(/^\/+/, '')}`
                  : '/fallback.jpg'}
              />
            ))
          ) : (
            <p className="no-animals">No animals found.</p>
          )}
        </div>

      </main>
    </>
  );
};

export default AssetsGallery;
