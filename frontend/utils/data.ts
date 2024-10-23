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
    },

    async getDatasets(organization: string, groups: string[], tags: string[]) {
        try {
            const params = new URLSearchParams();
            if (organization) {
              params.append('organization', organization);
            }
            if (groups && groups.length > 0) {
              groups.forEach(group => params.append('groups', group));
            }
            if (tags && tags.length > 0) {
              tags.forEach(tag => params.append('tags', tag));
            }
            console.log (`Param: ${params.toString()}`);
            const response = await axios.get(`https://ottl.vercel.app/api/get/dataset?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching datasets:', error);
        }
    }
};
