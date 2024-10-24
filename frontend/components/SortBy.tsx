import React, { Dispatch, useState } from 'react';
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from '@/components/ui/select';
import 'tailwindcss/tailwind.css';
import { State } from './App';

interface SortByProps {
  state: State;
  dispatch: Dispatch<{ type: string; payload: unknown }>;
}

const SortBy: React.FC<SortByProps> = ({ state, dispatch }) => {

  const handleSortChange = (value: string) => {
    dispatch({ type: 'sortBy', payload: value });
  };

  return (
    <div className="w-full flex flex-col items-start p-2 max-w-xs mx-auto mt-4">
      <label className="text-md font-medium text-gray-700 mb-1">Sort By:</label>
      <Select value={state.sortBy} onValueChange={handleSortChange}>
        <SelectTrigger className="w-full px-6 py-4 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg">
          <SelectItem value="relevance" className="px-4 py-2 hover:bg-gray-100">Relevance</SelectItem>
          <SelectItem value="name-asc" className="px-4 py-2 hover:bg-gray-100">Name Ascending</SelectItem>
          <SelectItem value="name-desc" className="px-4 py-2 hover:bg-gray-100">Name Descending</SelectItem>
          {/* <SelectItem value="last-modified" className="px-4 py-2 hover:bg-gray-100">Last Modified</SelectItem> */}
          {/* <SelectItem value="popularity" className="px-4 py-2 hover:bg-gray-100">Popularity</SelectItem> */}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortBy;
