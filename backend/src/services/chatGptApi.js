import axios from "axios";
import OpenAI from "openai";
import { API_URL } from "./hawaiiDataApi.js";
import { getRawCSV } from "../utils/getRawCSV.js";
import { getDataset } from "../utils/getDataset.js";

export const getXYAxis = async (csv, info) => {
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    "role": "system",
                    "content": [
                        {
                            "type": "text",
                            "text": "Provided are dataset description and sample data, Ignore the values of the X and Y axis when writing the title and subtitle. X and Y axis should never have non-numeric character as value; with an exception to bar chart where only the X axis can have non-numeric character as value."
                        }
                    ]
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "DBEDT Hawaii Annual Electricity Cost And Consumption 2006-2010\nDBEDT Hawaii Annual Electricity Cost And Consumption 2006-2010\n[{\n \"X v_alues\": \"2006\",\n\"City &amp; County of Honolulu\": \"7700604915\",\n\"Maui County\": \"1266466780\",\n\"Hawaii country\": \"1148760827\",\n\"Kauai County\": \"452079711\",\n\"State Cost\": \"2190152387\",\n\"Location 1 (address)\": \"\",\n\"Location 1 (city)\": \"\",\n\"Location 1 (state)\": \"\",\n\"Location 1 (zip)\": \"\"\n},\n{\n\"X Values\": \"2007\",\n\"City &amp; County of Honolulu\": \"7675354990\",\n\"Maui County\": \"1280102549\",\n\"Hawaii County\": \"1162683764\",\n\"Kauai County\": \"466895789\",\n\"State Cost\": \"2253431463\",\n\"Location 1 (address)\": \"\",\n\"Location 1 (city)\": \"\",\n\"Location 1 (state)\": \"\",\n\"Location 1 (zip)\": \"\"\n},\n{\n\"X Values\": \"2008\",\n\"City &amp; County of Honolulu\": \"7555961805\",\n\"Maui County\": \"1239228345\",\n\"Hawaii County\": \"1141029607\",\n\"Kauai County\": \"453790517\",\n\"State Cost\": \"3033950142\",\n\"Location 1 (address)\": \"\",\n\"Location 1 (city)\": \"\",\n\"Location 1 (state)\": \"\",\n\"Location 1 (zip)\": \"\"\n}]"
                        }
                    ]
                },
                {
                    "role": "assistant",
                    "content": [
                        {
                            "type": "text",
                            "text": "{\n  \"title\": \"Annual Electricity Cost and Consumption in Hawaii\",\n  \"subtitle\": \"Trends in Electricity Expenses Across Different Counties (2006-2010)\",\n  \"x\": \"X v_alues\",\n  \"y\": [\n    \"City &amp; County of Honolulu\",\n    \"Maui County\",\n    \"Hawaii country\",\n    \"Kauai County\",\n    \"State Cost\"\n  ],\n  \"graphable\": true,\n  \"is_bar\": true,\n  \"barX\": \"X v_alues\",\n  \"barY\": [\"City &amp; County of Honolulu\", \"Maui County\", \"Hawaii country\", \"Kauai County\", \"State Cost\"]\n}"
                        }
                    ]
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "WTI Barrel of Oil Future Prices\nDaily WTI Contract 1 Future Prices\n[{\n \"DateOfPrice\": \"01/03/2006 12:00:00 AM\",\n\"Fuel\": \"WTI Future Contract 1\",\n\"Price\": \"63.14\",\n\"PhysicalUnit\": \"$/BBL\"\n},\n{\n\"DateOfPrice\": \"01/04/2006 12:00:00 AM\",\n\"Fuel\": \"WTI Future Contract 1\",\n\"Price\": \"63.42\",\n\"PhysicalUnit\": \"$/BBL\"\n},\n{\n\"DateOfPrice\": \"01/05/2006 12:00:00 AM\",\n\"Fuel\": \"WTI Future Contract 1\",\n\"Price\": \"62.79\",\n\"PhysicalUnit\": \"$/BBL\"\n}]"
                        }
                    ]
                },
                {
                    "role": "assistant",
                    "content": [
                        {
                            "type": "text",
                            "text": "{\"title\":\"Daily Future Prices of WTI Barrel of Oil\",\"subtitle\":\"Price Trends of WTI Future Contract 1\",\"x\":\"\",\"y\":[],\"graphable\":false,\"is_bar\":true,\"barX\": \"DateOfPrice\",\n  \"barY\": [\"Price\"]}"
                        }
                    ]
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Electricity Prices: U.S. vs Hawaii (Source: EIA)\nElectricity Prices: U.S. vs Hawaii (Source: EIA)\n[{\n \"Date\": \"March 2015\",\n\"U.S.\": \"10.30\",\n\"Hawaii\": \"27.23\"\n},\n{\n\"Date\": \"June 2015\",\n\"U.S.\": \"10.64\",\n\"Hawaii\": \"26.46\"\n},\n{\n\"Date\": \"Sept 2015\",\n\"U.S.\": \"10.81\",\n\"Hawaii\": \"25.67\"\n}]"
                        }
                    ]
                },
                {
                    "role": "assistant",
                    "content": [
                        {
                            "type": "text",
                            "text": "{\"title\":\"Electricity Prices Comparison: U.S. vs Hawaii\",\"subtitle\":\"Analyzing Electricity Costs Between U.S. and Hawaii\",\"x\":\"\",\"y\":[],\"graphable\":false,\"is_bar\":true,\"barX\": \"Date\",\n  \"barY\": [\"U.S.\", \"Hawaii\"]}"
                        }
                    ]
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "DBEDT Pie Chart Of Electric Hybrid Fossil Cars\nDBEDT Pie Chart Of Electric Hybrid Fossil Cars\n[{\n \"X Values\": \"Electric\",\n\"Series1\": \"0.1%\"\n},\n{\n\"X Values\": \"Hybrid\",\n\"Series1\": \"1.0%\"\n},\n{\n\"X Values\": \"Fossil fuel\",\n\"Series1\": \"99.0%\"\n}]"
                        }
                    ]
                },
                {
                    "role": "assistant",
                    "content": [
                        {
                            "type": "text",
                            "text": "{\"title\":\"Distribution of Car Types: Electric, Hybrid, and Fossil Fuel\",\"subtitle\":\"Proportions of Different Types of Cars\",\"x\":\"\",\"y\":[],\"graphable\":false,\"is_bar\":false,\"barX\":\"\",\"barY\":[]}"
                        }
                    ]
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Kauai County Births, Deaths, Marriages, Civil Unions 2012\nBirths, Deaths, marriages and civil unions in Kauai County\n[{\n \"Month of Occurrence\": \"January\",\n\"Birth\": \"73\",\n\"Deaths\": \"45\",\n\"Marriages\": \"148\",\n\"Civil Unions\": \"11\"\n},\n{\n\"Month of Occurrence\": \"February\",\n\"Birth\": \"53\",\n\"Deaths\": \"35\",\n\"Marriages\": \"190\",\n\"Civil Unions\": \"7\"\n},\n{\n\"Month of Occurrence\": \"March\",\n\"Birth\": \"73\",\n\"Deaths\": \"33\",\n\"Marriages\": \"223\",\n\"Civil Unions\": \"11\"\n}]"
                        }
                    ]
                },
                {
                    "role": "assistant",
                    "content": [
                        {
                            "type": "text",
                            "text": "{\"title\":\"Monthly Statistics of Births, Deaths, Marriages, and Civil Unions in Kauai County\",\"subtitle\":\"Data Overview for 2012\",\"x\":\"\",\"y\":[],\"graphable\":false,\"is_bar\":true,\"barX\":\"Month of Occurrence\",\"barY\":[\"Birth\",\"Deaths\",\"Marriages\",\"Civil Unions\"]}"
                        }
                    ]
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": `${info}\n${csv}`
                        }
                    ]
                }
            ],
            temperature: 1,
            max_tokens: 2048,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            response_format: {
                "type": "json_schema",
                "json_schema": {
                    "name": "csv_graph_axes",
                    "strict": true,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "title": {
                                "type": "string",
                                "description": "Title of the graph"
                            },
                            "subtitle": {
                                "type": "string",
                                "description": "Subtitle of the graph"
                            },
                            "x": {
                                "type": "string",
                                "description": "The key represented on the x-axis."
                            },
                            "y": {
                                "type": "array",
                                "description": "The key(s) represented on the y-axes.",
                                "items": {
                                    "type": "string"
                                }
                            },
                            "graphable": {
                                "type": "boolean",
                                "description": "Indicates whether the given CSV can be represented in a line chart."
                            },
                            "is_bar": {
                                "type": "boolean",
                                "description": "Indicates whether this given CSV can be graphed on a bar chart."
                            },
                            "barX": {
                                "type": "string",
                                "description": "The x value for bar representation."
                            },
                            "barY": {
                                "type": "array",
                                "description": "The y value(s) for bar representation.",
                                "items": {
                                    "type": "string"
                                }
                            }
                        },
                        "required": [
                            "title",
                            "subtitle",
                            "x",
                            "y",
                            "graphable",
                            "is_bar",
                            "barX",
                            "barY"
                        ],
                        "additionalProperties": false
                    }
                }
            },
        });

        let responseText = response.choices[0].message.content.trim();

        if (responseText.startsWith("```json")) {
            responseText = responseText.replace(/^```json\s+/, "").replace(/```$/, "").trim();
        }

        let jsonResponse;
        try {
            jsonResponse = JSON.parse(responseText);
        } catch (parseError) {
            throw new Error('Error parsing OpenAI response as JSON: ' + parseError.message + ' Response was: ' + responseText);
        }
        return jsonResponse;
    } catch (error) {
        throw new Error('Error fetching XY Axis from OpenAI: ' + error.message);
    }
};

export const getQuestionSuggestions = async (dataset_name) => {
    try {
        let RESPONSE = await axios.get(`${API_URL}/api/3/action/package_search?fq=name:${dataset_name}`);
        const DATASET = RESPONSE.data.result.results.filter(({ name }) => name === dataset_name)[0];
        const URL = DATASET.resources.filter(({ format }) => format === 'CSV')[0].url;

        RESPONSE = await axios.get(URL, { responseType: 'stream' });
        const CSV = await getRawCSV(RESPONSE.data);
        const CONTEXT = `Title: ${DATASET.title}\nDESCRIPTION: ${DATASET.notes}\n${CSV}`;

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    "role": "system",
                    "content": [
                        {
                            "type": "text",
                            "text": "What are some question to ask about the provided dataset. Questions should be short and simple."
                        }
                    ]
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": CONTEXT
                        }
                    ]
                }
            ],
            temperature: 1,
            max_tokens: 2048,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            response_format: {
                "type": "json_schema",
                "json_schema": {
                    "name": "questions_schema",
                    "strict": true,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "questions": {
                                "type": "array",
                                "description": "An array containing a list of 3 short questions.",
                                "items": {
                                    "type": "string",
                                    "description": "A question represented as a string."
                                }
                            }
                        },
                        "required": [
                            "questions"
                        ],
                        "additionalProperties": false
                    }
                }
            },
        });

        let responseText = response.choices[0].message.content.trim();

        if (responseText.startsWith("```json")) {
            responseText = responseText.replace(/^```json\s+/, "").replace(/```$/, "").trim();
        }

        let jsonResponse;
        try {
            jsonResponse = JSON.parse(responseText);
        } catch (parseError) {
            throw new Error('Error parsing OpenAI response as JSON: ' + parseError.message + ' Response was: ' + responseText);
        }
        return jsonResponse;
    } catch (error) {
        throw new Error('Error fetching questions from OpenAI: ' + error.message);
    }
};

export const getChatResponse = async (dataset_name, chat) => {
    try {
        let RESPONSE = await axios.get(`${API_URL}/api/3/action/package_search?fq=name:${dataset_name}`);
        const DATASET = RESPONSE.data.result.results.filter(({ name }) => name === dataset_name)[0];
        const URL = DATASET.resources.filter(({ format }) => format === 'CSV')[0].url;

        RESPONSE = await axios.get(URL, { responseType: 'stream' });
        const CSV = await getRawCSV(RESPONSE.data);
        const CONTEXT = `Title: ${DATASET.title}\nDESCRIPTION: ${DATASET.notes}\n${CSV}`;
        const CHAT = JSON.parse(chat);

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    "role": "system",
                    "content": [
                        {
                            "type": "text",
                            "text": "No bullet point. Keep response short and simple"
                        }
                    ]
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": `Remember the info in the dataset:\n${CONTEXT}`
                        }
                    ]
                },
                ...CHAT.map(msg => ({
                    "role": msg.type,
                    "content": [
                        {
                            "type": "text",
                            "text": msg.content
                        }
                    ]
                }))
            ],
            temperature: 1,
            max_tokens: 2048,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            response_format: {
                "type": "json_schema",
                "json_schema": {
                    "name": "my_schema",
                    "strict": true,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "response": {
                                "type": "string",
                                "description": "The actual response content."
                            }
                        },
                        "required": [
                            "response"
                        ],
                        "additionalProperties": false
                    }
                }
            },
        });

        let responseText = response.choices[0].message.content.trim();

        if (responseText.startsWith("```json")) {
            responseText = responseText.replace(/^```json\s+/, "").replace(/```$/, "").trim();
        }

        let jsonResponse;
        try {
            jsonResponse = JSON.parse(responseText);
        } catch (parseError) {
            throw new Error('Error parsing OpenAI response as JSON: ' + parseError.message + ' Response was: ' + responseText);
        }
        return jsonResponse.response;
    } catch (error) {
        throw new Error('Error fetching response from OpenAI: ' + error.message);
    }
};

export const getDatasetSuggestions = async (persona) => {
    try {
        const apiUrl = `${API_URL}/api/3/action/package_search?rows=999`;
        const [FIRST_RESPONSE, SECOND_RESPONSE] = await Promise.all([
            axios.get(apiUrl),
            axios.get(apiUrl + '&start=1000')
        ]);
        let DATA = [...FIRST_RESPONSE.data.result.results, ...SECOND_RESPONSE.data.result.results];
        const SUCCESS = FIRST_RESPONSE.data.success && SECOND_RESPONSE.data.success;

        if (SUCCESS) {
            DATA = DATA.map(({ name, title }) => ({ name, title }));
            const openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY,
            });
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        "role": "system",
                        "content": [
                            {
                                "type": "text",
                                "text": `Based on the person's description provided by the user and provided list of dataset title: return a list of dataset that the person might like to look at\nDatasets:\n${JSON.stringify(DATA)}`
                            }
                        ]
                    },
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": "A person who loves going to the farmers market"
                            }
                        ]
                    },
                    {
                        "role": "assistant",
                        "content": [
                            {
                                "type": "text",
                                "text": "{\n  \"names\": [\"hawaii-farmer-s-markets\", \"snap-dollars-spent-at-farmers-markets\"]\n}"
                            }
                        ]
                    },
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": persona
                            }
                        ]
                    }
                ],
                temperature: 1,
                max_tokens: 2048,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
                response_format: {
                    "type": "json_schema",
                    "json_schema": {
                        "name": "market_schema",
                        "strict": true,
                        "schema": {
                            "type": "object",
                            "properties": {
                                "names": {
                                    "type": "array",
                                    "description": "A list of dataset names.",
                                    "items": {
                                        "type": "string"
                                    }
                                }
                            },
                            "required": [
                                "names"
                            ],
                            "additionalProperties": false
                        }
                    }
                },
            });
            let responseText = response.choices[0].message.content.trim();

            if (responseText.startsWith("```json")) {
                responseText = responseText.replace(/^```json\s+/, "").replace(/```$/, "").trim();
            }

            let jsonResponse;
            try {
                jsonResponse = JSON.parse(responseText);
            } catch (parseError) {
                throw new Error('Error parsing OpenAI response as JSON: ' + parseError.message + ' Response was: ' + responseText);
            }
            return jsonResponse.names;
        } else {
            throw new Error('Failed to fetch dataset from Hawaii Open Data');
        }
    } catch (error) {
        throw new Error('Error fetching response from OpenAI: ' + error.message);
    }
};

export const getPersona = async (persona, name) => {
    try {
        const DATASET = await getDataset(name);
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    "role": "system",
                    "content": [
                        {
                            "type": "text",
                            "text": "The user will provide a persona description of an user that is using a dataset viewer app. Based on what dataset the user is viewing, return an updated version of the persona description. The updated version of the persona description should contain some characteristics of the previous persona. Make sure the persona description is short, does not contain time,  and must be under 30 words."
                        }
                    ]
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": `Current persona: ${persona}\nDataset: ${DATASET.title}\n${DATASET.notes}`
                        }
                    ]
                }
            ],
            temperature: 1,
            max_tokens: 2048,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            response_format: {
                "type": "json_schema",
                "json_schema": {
                    "name": "persona_schema",
                    "strict": true,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "persona": {
                                "type": "string",
                                "description": "A description of the persona."
                            }
                        },
                        "required": [
                            "persona"
                        ],
                        "additionalProperties": false
                    }
                }
            },
        });

        let responseText = response.choices[0].message.content.trim();

        if (responseText.startsWith("```json")) {
            responseText = responseText.replace(/^```json\s+/, "").replace(/```$/, "").trim();
        }

        let jsonResponse;
        try {
            jsonResponse = JSON.parse(responseText);
        } catch (parseError) {
            throw new Error('Error parsing OpenAI response as JSON: ' + parseError.message + ' Response was: ' + responseText);
        }
        return jsonResponse.persona;
    } catch (error) {
        throw new Error('Error fetching response from OpenAI: ' + error.message);
    }
};
