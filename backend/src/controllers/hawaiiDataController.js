import { HttpStatusCode } from "axios";
import { sendJsonResponse } from "../utils/jsonResponse.js";
import { getFilters, getFilteredDataset, getCSV } from "../services/hawaiiDataApi.js";

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
        sendJsonResponse(res, HttpStatusCode.BadRequest, error.message);
    }
};

export const handleGetFilters = async (req, res) => {
    try {
        sendJsonResponse(res, HttpStatusCode.Ok, '', await getFilters());
    } catch (error) {
        sendJsonResponse(res, HttpStatusCode.BadRequest, error.message);
    }
};

export const handleGetCSV = async (req, res) => {
    const { name } = req.query;
    try {
        sendJsonResponse(res, HttpStatusCode.Ok, '', await getCSV(name));
    } catch (error) {
        sendJsonResponse(res, HttpStatusCode.BadRequest, error.message);
    }
};
