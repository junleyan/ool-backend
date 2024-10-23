export const getList = (data, api_url) => {
    const ORGANIZATION_MAP = {};
    const GROUP_MAP = {};
    const TAG_MAP = {};
    const LICENSE_MAP = {};
    const FORMAT_MAP = {};

    data.forEach(({ organization, groups, tags, license_id, license_title, resources }) => {
        if (organization) {
            const ORG_KEY = organization.name;
            if (ORGANIZATION_MAP[ORG_KEY]) {
                ORGANIZATION_MAP[ORG_KEY].count += 1;
            } else {
                ORGANIZATION_MAP[ORG_KEY] = {
                    label: organization.title,
                    value: organization.name,
                    image_url: organization.image_url.length > 0 ? `${api_url}/uploads/group/${organization.image_url}` : null,
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
                        image_url: group.image_display_url,
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
};
