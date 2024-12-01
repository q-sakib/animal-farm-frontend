
import * as React from 'react';
import { CategoryProps } from '@/types';
// 'use client';
export const CategoryButton: React.FC<CategoryProps> = ({
  name,
  isActive = false,
  onClick,
  styleVariant = 'default', // Default style
}) => {
  return (
    <>
      <button
        type="button"
        onClick={() => {
          console.log(`Button clicked: ${name}`); // Debugging log for button click
          if (onClick) {
            onClick(); // Execute the passed onClick handler
          } else {
            console.error('No onClick handler provided'); // Log if no handler is set
          }
        }}


        className={`category-button px-5 py-2.5 text-lg font-medium uppercase border-2 border-red-600 text-red-600 rounded-lg transition-all duration-300 ease-in-out         ${styleVariant === 'default'
          ? `border-none bg-red-600 text-white  ${isActive ? 'active bg-green-600 border-green-600 text-white' : 'hover:border-green-600 hover:text-green-600'
          }`
          : `alternate-button border border-white text-white bg-transparent ${isActive ? 'active bg-black text-white' : 'hover:bg-gray-700'
          }`
          }`}

      >
        {name}
      </button>
    </>
  );
};


// className={`category-button ${isActive ? 'active' : ''}`}