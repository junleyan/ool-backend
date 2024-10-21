import axios from "axios";

export const data = {
    async getFilters() {
        try {
            const response = await axios.get('https://ottl.vercel.app/api/get/filters');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching filters:', error);
        }
    },
    
    async getOrganizationOptions() {
        try {
            const response = await axios.get('https://ottl.vercel.app/api/get/organizations');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching organizations:', error);
        }
    },

    async getGroupOptions() {
        try {
            const response = await axios.get('https://ottl.vercel.app/api/get/groups');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    },

    async getTagOptions() {
        try {
            const response = await axios.get('https://ottl.vercel.app/api/get/tags');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    }
};
