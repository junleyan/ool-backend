import { HttpStatusCode } from "axios";
import { sendJsonResponse } from "../utils/jsonResponse.js";
import { getFilteredDataset, getGroupList, getOrganizationList, getTagList } from "../services/hawaiiDataApi.js";

export const handleGetFilteredDataset = async (req, res) => {
    const { organization, groups, tags, formats, licenses } = req.query;
    try {
        sendJsonResponse(res,
                         HttpStatusCode.Ok,
                         '',
                         await getFilteredDataset(organization, 
                                                  groups ? groups.split(',') : null,
                                                  tags ? tags.split(',') : null, 
                                                  formats ? formats.split(',') : null,
                                                  licenses ? licenses.split(',') : null)
                        );
    } catch (error) {
        sendJsonResponse(res, HttpStatusCode.BadRequest, 'Error fetching filtered dataset');
    }
};

export const handleGetOrganizationList = async (req, res) => {
    try {
        sendJsonResponse(res, HttpStatusCode.Ok, '', await getOrganizationList());
    } catch (error) {
        sendJsonResponse(res, HttpStatusCode.BadRequest, 'Error fetching organization list');
    }
};

export const handleGetGroupList = async (req, res) => {
    try {
        sendJsonResponse(res, HttpStatusCode.Ok, '', await getGroupList());
    } catch (error) {
        sendJsonResponse(res, HttpStatusCode.BadRequest, 'Error fetching group list');
    }
};

export const handleGetTagList = async (req, res) => {
    try {
        sendJsonResponse(res, HttpStatusCode.Ok, '', await getTagList());
    } catch (error) {
        sendJsonResponse(res, HttpStatusCode.BadRequest, 'Error fetching tag list');
    }
};
