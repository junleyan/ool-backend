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

export const getFilters = async () => {
    try {
        const [FIRST_RESPONSE, SECOND_RESPONSE] = await Promise.all([
            axios.get(`${API_URL}/action/package_search?rows=999`),
            axios.get(`${API_URL}/action/package_search?rows=999&start=1000`)
        ]);

        const DATA = [...FIRST_RESPONSE.data.result.results, ...SECOND_RESPONSE.data.result.results];
        const SUCCESS = FIRST_RESPONSE.data.success && SECOND_RESPONSE.data.success;

        if (SUCCESS) {
            const ORGANIZATION_MAP = {};
            const GROUP_MAP = {};
            const TAG_MAP = {};
            const LICENSE_MAP = {};
            const FORMAT_MAP = {};

            DATA.forEach(({ organization, groups, tags, license_id, license_title, resources }) => {
                if (organization) {
                    const ORG_KEY = organization.name;
                    if (ORGANIZATION_MAP[ORG_KEY]) {
                        ORGANIZATION_MAP[ORG_KEY].count += 1;
                    } else {
                        ORGANIZATION_MAP[ORG_KEY] = {
                            label: organization.title,
                            value: organization.name,
                            count: 1
                        };
                    }
                }

                if (groups && Array.isArray(groups)) {
                    groups.forEach(group => {
                        const GROUP_KEY = group.name;
                        if (GROUP_MAP[GROUP_KEY]) {
                            GROUP_MAP[GROUP_KEY].count += 1;
                        } else {
                            GROUP_MAP[GROUP_KEY] = {
                                label: group.display_name,
                                image_display_url: group.image_display_url,
                                value: group.name,
                                count: 1
                            };
                        }
                    });
                }

                if (tags && Array.isArray(tags)) {
                    tags.forEach(tag => {
                        const TAG_KEY = tag.name;
                        if (TAG_MAP[TAG_KEY]) {
                            TAG_MAP[TAG_KEY].count += 1;
                        } else {
                            TAG_MAP[TAG_KEY] = {
                                label: tag.display_name,
                                value: tag.name,
                                count: 1
                            };
                        }
                    });
                }

                if (license_id && license_title) {
                    if (LICENSE_MAP[license_id]) {
                        LICENSE_MAP[license_id].count += 1;
                    } else {
                        LICENSE_MAP[license_id] = {
                            label: license_title,
                            value: license_id,
                            count: 1
                        };
                    }
                }

                if (resources && Array.isArray(resources)) {
                    resources.forEach(resource => {
                        const FORMAT_KEY = resource.format;
                        if (FORMAT_KEY) {
                            if (FORMAT_MAP[FORMAT_KEY]) {
                                FORMAT_MAP[FORMAT_KEY].count += 1;
                            } else {
                                FORMAT_MAP[FORMAT_KEY] = {
                                    label: FORMAT_KEY,
                                    value: FORMAT_KEY,
                                    count: 1
                                };
                            }
                        }
                    });
                }
            });

            const ORGANIZATIONS = Object.values(ORGANIZATION_MAP).sort((a, b) => b.count - a.count);
            const GROUPS = Object.values(GROUP_MAP).sort((a, b) => b.count - a.count);
            const TAGS = Object.values(TAG_MAP).sort((a, b) => b.count - a.count);
            const LICENSES = Object.values(LICENSE_MAP).sort((a, b) => b.count - a.count);
            const FORMATS = Object.values(FORMAT_MAP).sort((a, b) => b.count - a.count);

            return {
                organizations: ORGANIZATIONS,
                groups: GROUPS,
                tags: TAGS,
                licenses: LICENSES,
                formats: FORMATS
            };
        } else {
            throw new Error('Failed to fetch dataset list from Hawaii Open Data');
        }
    } catch (error) {
        throw new Error('Error fetching dataset list from Hawaii Open Data: ' + error.message);
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
