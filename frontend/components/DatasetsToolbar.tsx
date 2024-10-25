import React, { Dispatch, useEffect, useState } from 'react';
import { State } from './App';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from '@/components/ui/select';
import { Checkbox } from './ui/checkbox';

interface DatasetsToolbarProps {
    state: State;
    dispatch: Dispatch<{ type: string; payload: unknown }>;
}

const DatasetsToolbar: React.FC<DatasetsToolbarProps> = ({ state, dispatch }) => {
    const [searchQuery, setSearchQuery] = useState(state.searchQuery || '');

    const handleSortChange = (value: string) => {
        dispatch({ type: 'sortBy', payload: value });
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleShowBadge = (key: string) => {
        dispatch({ type: key, payload: !state[key]});
    }

    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            dispatch({ type: 'searchQuery', payload: searchQuery });
        }, 750);

        return () => clearTimeout(debounceTimeout);
    }, [searchQuery, dispatch]);

    return (
        <div className="relative w-full max-w-4xl mx-auto flex items-center space-x-4">
            <div className="relative flex-grow w-1/3">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-4 w-full text-muted-foreground" />
                </span>
                <Input 
                    autoFocus 
                    type="text" 
                    placeholder="Search" 
                    className="pl-9 w-full" 
                    value={searchQuery} 
                    onChange={handleSearchChange} 
                />
            </div>
            <div className="w-1/5">
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
            <div className="flex items-center space-x-2">
                <Checkbox id="terms" checked={state.showTags} onClick={() => handleShowBadge('showTags')} />
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Show Tags
                </label>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox id="terms" checked={state.showFormats} onClick={() => handleShowBadge('showFormats')}/>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Show Formats
                </label>
            </div>
        </div>
    );
};

export default DatasetsToolbar;
