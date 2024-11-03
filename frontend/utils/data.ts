import { CSV } from "@/app/page";
import axios from "axios";

export interface SelectOption {
    label: string;
    value: string;
    count: number;
}

interface DatasetFilters {
    organizations: SelectOption[];
    groups: SelectOption[];
    tags: SelectOption[];
    licenses: SelectOption[];
    formats: SelectOption[];
}

interface DatasetResult {
    count: number;
    results: object[];
    filters: DatasetFilters;
}

export const data = {
    async getFilters(): Promise<DatasetResult> {
        try {
            const response = await axios.get('https://ottl.vercel.app/api/get/filters');
            return response.data.data as DatasetResult;
        } catch (error) {
            console.error('Error fetching filters:', error);
            throw error;
        }
    },

    async getDataset(
        organization?: string | null,
        groups?: string[],
        tags?: string[],
        formats?: string[],
        licenses?: string[]
    ): Promise<DatasetResult> {
        try {
            const queryParams = new URLSearchParams();

            if (organization) queryParams.append('organization', organization);
            if (groups && groups.length > 0) queryParams.append('groups', groups.join(','));
            if (tags && tags.length > 0) queryParams.append('tags', tags.join(','));
            if (formats && formats.length > 0) queryParams.append('formats', formats.join(','));
            if (licenses && licenses.length > 0) queryParams.append('licenses', licenses.join(','));

            const response = await axios.get(`https://ottl.vercel.app/api/get/dataset?${queryParams.toString()}`);
            return response.data.data as DatasetResult;
        } catch (error) {
            console.error('Error fetching datasets:', error);
            throw error;
        }
    },

    async getCSV(name: string): Promise<CSV> {
        try {
            const queryParams = new URLSearchParams();
            if (name) {
                queryParams.append('name', name);
            }
            const response = await axios.get(`https://ottl.vercel.app/api/get/csv?${queryParams.toString()}`);
            return response.data.data as CSV;
        } catch (error) {
            console.error('Error fetching datasets:', error);
            throw error;
        }
    }
};
