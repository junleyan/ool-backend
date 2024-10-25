import React, { Dispatch } from 'react';
import { State } from './App';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from '@/components/ui/select';

interface DatasetsToolbarProps {
    state: State;
    dispatch: Dispatch<{ type: string; payload: unknown }>;
}

const DatasetsToolbar: React.FC<DatasetsToolbarProps> = ({ state, dispatch }) => {
    const handleSortChange = (value: string) => {
        dispatch({ type: 'sortBy', payload: value });
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: 'searchQuery', payload: event.target.value });
    }

    return (
        <div className="relative w-full max-w-xl mx-auto flex items-center space-x-4">
            <div className="relative flex-grow">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-4 w-full text-muted-foreground" />
                </span>
                <Input 
                    autoFocus 
                    type="text" 
                    placeholder="Search" 
                    className="pl-9 w-full" 
                    onChange={handleSearchChange} 
                />            </div>
            <div className="w-2/6">
                <Select value={state.sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-full px-4 py-2 rounded-md">
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent className="rounded-md shadow-lg">
                        <SelectItem value="relevance" className="px-4 py-2">Relevance</SelectItem>
                        <SelectItem value="name-asc" className="px-4 py-2">Name Ascending</SelectItem>
                        <SelectItem value="name-desc" className="px-4 py-2">Name Descending</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default DatasetsToolbar;