import { HttpStatusCode } from "axios";
import { sendJsonResponse } from "../utils/jsonResponse.js";
import { getChatResponse, getDatasetSuggestions, getPersona, getQuestionSuggestions, getXYAxis } from "../services/chatGptApi.js";

export const handleGetXYAxis = async (req, res) => {
    const { csv, info } = req.query;
    try {
        sendJsonResponse(res, HttpStatusCode.Ok, '', await getXYAxis(csv, info));
    } catch (error) {
        sendJsonResponse(res, HttpStatusCode.BadRequest, error.message);
    }
};

export const handleGetQuestionSuggestions = async (req, res) => {
    const { name } = req.query;
    try {
        sendJsonResponse(res, HttpStatusCode.Ok, '', await getQuestionSuggestions(name));
    } catch (error) {
        sendJsonResponse(res, HttpStatusCode.BadRequest, error.message);
    }
};

export const handleGetChatResponse = async (req, res) => {
    const { name, chat } = req.query;
    try {
        sendJsonResponse(res, HttpStatusCode.Ok, '', await getChatResponse(name, chat));
    } catch (error) {
        sendJsonResponse(res, HttpStatusCode.BadRequest, error.message);
    }
};

export const handleGetDatasetSuggestions = async (req, res) => {
    const { persona } = req.query;
    try {
        sendJsonResponse(res, HttpStatusCode.Ok, '', await getDatasetSuggestions(persona));
    } catch (error) {
        sendJsonResponse(res, HttpStatusCode.BadRequest, error.message);
    }
};

export const handleGetPersona = async (req, res) => {
    const { persona, name } = req.query;
    try {
        sendJsonResponse(res, HttpStatusCode.Ok, '', await getPersona(persona, name));
    } catch (error) {
        sendJsonResponse(res, HttpStatusCode.BadRequest, error.message);
    }
};
