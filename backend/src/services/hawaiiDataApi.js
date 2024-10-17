import axios from 'axios'
import { TAG_LIST } from '../utils/tagList.js';

const API_URL = 'https://opendata.hawaii.gov/api/3'

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

        const RESPONSE = await axios.get(`${API_URL}/action/package_search?fq=${fqQuery}`);
        const DATA = RESPONSE.data;
        const SUCCESS = DATA.success;
        
        if (SUCCESS) {
            return {
                count: DATA.result.count,
                results: DATA.result.results
            }
        } else {
            throw new Error('Failed to fetch filtered dataset from Hawaii Open Data');
        }
    } catch (error) {
        throw new Error('Error fetching filtered dataset from Hawaii Open Data: ' + error.message);
    }
};

export const getOrganizationList = async () => {
    try {
        const RESPONSE = await axios.get(`${API_URL}/action/organization_list`);
        const DATA = RESPONSE.data;
        const SUCCESS = DATA.success;
        
        if (SUCCESS) {
            const ORGANIZATION_LIST = await Promise.all(
                DATA.result.map(async (organization) => {
                    const ORGANIZATION_RESPONSE = await axios.get(`${API_URL}/action/organization_show?id=${organization}`);
                    return ORGANIZATION_RESPONSE.data.result;
                })
            );
            return ORGANIZATION_LIST
                .filter(({ package_count }) => package_count > 0)
                .sort((organizationA, organizationB) => organizationB.package_count - organizationA.package_count)
                .map(({ display_name, name, package_count }) => ({
                    label: display_name,
                    value: name,
                    count: package_count
                }));
        } else {
            throw new Error('Failed to fetch organization list from Hawaii Open Data');
        }
    } catch {
        throw new Error('Error fetching organization list from Hawaii Open Data: ' + error.message);
    }
};

export const getGroupList = async () => {
    try {
        const RESPONSE = await axios.get(`${API_URL}/action/group_list`);
        const DATA = RESPONSE.data;
        const SUCCESS = DATA.success;
        
        if (SUCCESS) {
            const GROUP_LIST = await Promise.all(
                DATA.result.map(async (group) => {
                    const GROUP_RESPONSE = await axios.get(`${API_URL}/action/group_show?id=${group}`);
                    return GROUP_RESPONSE.data.result;
                })
            );
            return GROUP_LIST
                .filter(({ package_count }) => package_count > 0)
                .sort((groupA, groupB) => groupB.package_count - groupA.package_count)
                .map(({ display_name, name, package_count }) => ({
                    label: display_name,
                    value: name,
                    count: package_count
                }));
        } else {
            throw new Error('Failed to fetch group list from Hawaii Open Data');
        }
    } catch {
        throw new Error('Error fetching group list from Hawaii Open Data: ' + error.message);
    }
};

export const getTagList = async () => {
    try {
        return TAG_LIST;
    } catch {
        throw new Error('Error fetching tag list from Hawaii Open Data: ' + error.message);
    }
};
