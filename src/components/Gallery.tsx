'use client';

import React, { useState, useEffect } from 'react';
import axios from '@/utils/axiosClient';
import { isAxiosError } from 'axios';
import { CategoryButton } from './CategoryButton';
import { FormComponent } from './Form';
import { AnimalCard } from './ImageProperty';



import ErrorToast from "./ErrorToast";



interface Category {
  _id: string;
  name: string;
  errorMessage?: string | null;

  setErrorMessage: (message: string | null) => void;

}

interface Animal {
  _id: string;
  name: string;
  image: string;
  category: Category;
  errorMessage?: string | null;

  setErrorMessage: (message: string | null) => void;

}

const AssetsGallery: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<'animal' | 'category' | null>(null);

  // const [error, setError] = useState<string | null>(null);

  const handleErrorClose = () => {
    setError(null);
  };

  /**
   * Fetches categories from the API.
   */
  const fetchCategories = async () => {
    try {
      console.log('API GET /api/categories');
      const response = await axios.get('/api/categories');
      setCategories(response.data);
      console.log('Categories fetched:', response.data);
    } catch {
      // console.error('Error fetching categories:', err);
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
        : "/api/animals";
      console.log(`API GET ${endpoint}`);
      const response = await axios.get(endpoint);
      setAnimals(response.data);
      console.log("Animals fetched:", response.data);
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        // Handle specific HTTP status codes
        switch (err.response.status) {
          case 404:
            setError("No animals found for this category.");
            break;
          case 500:
            setError("Server error occurred. Please try again later.");
            break;
          default:
            setError("Failed to fetch animals. Please try again.");
        }
      } else {
        setError("An unexpected error occurred.");
      }
      // console.error("Error fetching animals:", err);
    }
  };

  // Initial data fetching
  useEffect(() => {
    // const now = Date.now();
    // console.log(now);
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
    } catch {
      // console.error('Error adding category:');
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
    } catch {
      setError('Failed to add animal.');
      return;
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <div>

      {error && <ErrorToast message={error} onClose={handleErrorClose} />}

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
        <div className="animal-gallery min-h-screen bg-black flex flex-col items-center justify-center p-4">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-6">
            {animals.length ? (
              animals.map((animal) => (
                <AnimalCard
                  key={animal._id}
                  name={animal.name}
                  imageUrl={
                    animal.image
                      ? `${axios.defaults.baseURL}${animal.image.replace(/^\/+/, "")}`
                      : "/fallback.jpg"
                  }
                />
              ))
            ) : (
              <p className="text-white text-center text-lg">No animals found.</p>
            )}
          </div>
        </div>

      </main>
      </div>

    </>
  );
};

export default AssetsGallery;
