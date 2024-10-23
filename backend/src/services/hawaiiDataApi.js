import axios from 'axios'
import { getList } from '../utils/getList.js';
import { error } from 'console';

const API_URL = 'https://opendata.hawaii.gov';

export const getFilteredDataset = async (organization, groups, tags, formats, licenses) => {
    try {
        let fqQuery = organization && `organization:"${organization}"`;

        if (groups) {
            const GROUPS_QUERY = groups.map(group => `groups:"${group}"`).join('+AND+');
            fqQuery += `+AND+${GROUPS_QUERY}`;
        }
        if (tags) {
            const TAGS_QUERY = tags.map(tag => `tags:"${tag}"`).join('+AND+');
            fqQuery += `+AND+${TAGS_QUERY}`;
        }
        if (formats) {
            const FORMATS_QUERY = formats.map(format => `res_format:"${format}"`).join('+AND+');
            fqQuery += `+AND+${FORMATS_QUERY}`;
        }
        if (licenses) {
            const LICENSES_QUERY = licenses.map(license => `license_id:"${license}"`).join('+AND+');
            fqQuery += `+AND+${LICENSES_QUERY}`;
        }

        const RESPONSE = await axios.get(`${API_URL}/api/3/action/package_search?fq=${fqQuery}&rows=999`);
        const DATA = RESPONSE.data.result.results;
        const SUCCESS = RESPONSE.data.success;
        
        if (SUCCESS) {
            return {
                count: RESPONSE.data.result.count,
                results: DATA,
                filters: getList(DATA, API_URL)
            }
        } else {
            throw new Error('Failed to fetch filtered dataset from Hawaii Open Data' + error.message);
        }
    } catch (error) {
        throw new Error('Error fetching filtered dataset from Hawaii Open Data: ' + error.message);
    }
};

export const getFilters = async () => {
    try {
        const [FIRST_RESPONSE, SECOND_RESPONSE] = await Promise.all([
            axios.get(`${API_URL}/api/3/action/package_search?rows=999`),
            axios.get(`${API_URL}/api/3/action/package_search?rows=999&start=1000`)
        ]);

        const DATA = [...FIRST_RESPONSE.data.result.results, ...SECOND_RESPONSE.data.result.results];
        const SUCCESS = FIRST_RESPONSE.data.success && SECOND_RESPONSE.data.success;

        if (SUCCESS) {
            return getList(DATA, API_URL);
        } else {
            throw new Error('Failed to fetch dataset list from Hawaii Open Data' + error.message);
        }
    } catch (error) {
        throw new Error('Error fetching dataset list from Hawaii Open Data: ' + error.message);
    }
};
