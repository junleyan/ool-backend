import { Chat, CSV, GraphSetting } from "@/app/page";
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
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/get/filters`);
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

            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/get/dataset?${queryParams.toString()}`);
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
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/get/csv?${queryParams.toString()}`);
            return response.data.data as CSV;
        } catch (error) {
            console.error('Error fetching datasets:', error);
            throw error;
        }
    },

    async getXYAxis(info: string, csv: string): Promise<GraphSetting> {
        try {
            const queryParams = new URLSearchParams();
            if (csv) {
                queryParams.append('info', info);
                queryParams.append('csv', csv);
            }
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/get/xy?${queryParams.toString()}`);
            return response.data.data as GraphSetting;
        } catch (error) {
            console.error('Error fetching X and Y axis:', error);
            throw error;
        }
    },

    async getChatResponse(name: string, chat: Chat[]): Promise<string> {
        try {
            const queryParams = new URLSearchParams();
            if (name && chat) {
                queryParams.append('name', name);
                queryParams.append('chat', JSON.stringify(chat));
            }
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/get/chat?${queryParams.toString()}`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching chat response:', error);
            return "failed";
        }
    },

    async getChatQuestions(name: string): Promise<string[]> {
        try {
            const queryParams = new URLSearchParams();
            if (name) {
                queryParams.append('name', name);
            }
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/get/question_suggestions?${queryParams.toString()}`);
            return response.data.data.questions;
        } catch (error) {
            console.error('Error fetching chat questions:', error);
            return [];
        }
    },

    async getPersona(persona: string, name: string): Promise<string> {
        try {
            const queryParams = new URLSearchParams();
            if (persona && name) {
                queryParams.append('persona', persona);
                queryParams.append('name', name);
            }
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/get/persona?${queryParams.toString()}`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching persona:', error);
            return 'A Hawaii resident';
        }
    },

    async getAISuggestions(persona: string): Promise<string[]> {
        try {
            const queryParams = new URLSearchParams();
            if (persona) {
                queryParams.append('persona', persona);
            }
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/get/dataset_suggestions?${queryParams.toString()}`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching persona:', error);
            return [];
        }
    }
};
