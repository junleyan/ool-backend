import { HttpStatusCode } from "axios";
import { sendJsonResponse } from "../utils/jsonResponse.js";
import { getXYAxis } from "../services/chatGptApi.js";

export const handleGetXYAxis = async (req, res) => {
    const { csv, info } = req.query;
    try {
        sendJsonResponse(res, HttpStatusCode.Ok, '', await getXYAxis(csv, info));
    } catch (error) {
        sendJsonResponse(res, HttpStatusCode.BadRequest, error.message);
    }
};
