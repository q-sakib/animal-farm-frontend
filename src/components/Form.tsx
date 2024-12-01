'use client';

import React, { useState } from 'react';

type FormComponentProps = {
  type: 'animal' | 'category';
  onClose: () => void;
  onSubmit: (name: string, image?: File | undefined) => Promise<void>;
};

export const FormComponent: React.FC<FormComponentProps> = ({ type, onClose, onSubmit }) => {
  const [name, setName] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [nameError, setNameError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    let isValid = true;

    if (!name.trim()) {
      setNameError('Name is required.');
      isValid = false;
    } else if (name.length < 3) {
      setNameError('Name must be at least 3 characters.');
      isValid = false;
    } else {
      setNameError(null);
    }

    if (type === 'animal' && !image) {
      setImageError('Please upload an image.');
      isValid = false;
    } else {
      setImageError(null);
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(name, image || undefined);
      setSuccessMessage(`${type === 'animal' ? 'Animal' : 'Category'} added successfully!`);
      onClose();
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setImageError('Image size must be less than 5MB.');
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setImageError(null);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          &#x2715; {/* Unicode for 'X' */}
        </button>

        <h3 className="text-lg font-semibold text-center mb-4">
          {type === 'animal' ? 'Add Animal' : 'Add Category'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder={`${type} Name`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-black"
            />
            {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
          </div>

          {/* Upload Button Embedded in Input Field for Animal */}
          {type === 'animal' && (
            <div className="relative w-full">
              <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700">
                Upload Image
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none file:bg-gray-100 file:text-gray-700 file:mr-4 file:px-3 file:py-1 file:rounded-md file:cursor-pointer hover:file:bg-gray-200"
              />
              {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-40 h-48 object-cover rounded-md border mt-3 mx-auto"
                />
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:outline-none"
          >
            {loading ? 'Submitting...' : `Create ${type === 'animal' ? 'Animal' : 'Category'}`}
          </button>
        </form>

        {/* Error and Success Messages */}
        {errorMessage && <p className="text-red-500 text-center text-sm mt-2">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 text-center text-sm mt-2">{successMessage}</p>}
      </div>
    </div>
  );
};