import axios from "axios";
import { API_URL } from "../services/hawaiiDataApi.js";

export const getDataset = async (name) => {
    const apiUrl = `${API_URL}/api/3/action/package_search?q=name:${name}`;
    const DATA = (await axios.get(apiUrl)).data.result.results[0];
    return DATA;
}
