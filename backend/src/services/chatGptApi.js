import OpenAI from "openai";

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
                            "text": "Provided are dataset description and sample data, Ignore the values of the X and Y axis when writing the title and subtitle"
                        }
                    ]
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "DBEDT Hawaii Annual Electricity Cost And Consumption 2006-2010\nDBEDT Hawaii Annual Electricity Cost And Consumption 2006-2010\n[{\n \"X v_alues\": \"2006\",\n\"City &amp; County of Honolulu\": \"7700604915\",\n\"Maui County\": \"1266466780\",\n\"Hawaii country\": \"1148760827\",\n\"kauai\": \"452079711\",\n\"State Cost\": \"2190152387\",\n\"Location 1 (address)\": \"\",\n\"Location 1 (zip)\": \"\"\n},\n{\n\"X v_alues\": \"2007\",\n\"City &amp; County of Honolulu\": \"7675354990\",\n\"Maui County\": \"1280102549\",\n\"Hawaii country\": \"1162683764\",\n\"kauai\": \"466895789\",\n\"State Cost\": \"2253431463\",\n\"Location 1 (address)\": \"\",\n\"Location 1 (zip)\": \"\"\n},\n{\n\"X v_alues\": \"2008\",\n\"City &amp; County of Honolulu\": \"7555961805\",\n\"Maui County\": \"1239228345\",\n\"Hawaii country\": \"1141029607\",\n\"kauai\": \"453790517\",\n\"State Cost\": \"3033950142\",\n\"Location 1 (address)\": \"\",\n\"Location 1 (zip)\": \"\"\n}]"
                        }
                    ]
                },
                {
                    "role": "assistant",
                    "content": [
                        {
                            "type": "text",
                            "text": "{\n  \"title\": \"Annual Electricity Cost and Consumption in Hawaii\",\n  \"subtitle\": \"Trends in Electricity Expenses Across Different Counties (2006-2010)\",\n  \"x\": \"X v_alues\",\n  \"y\": [\n    \"City &amp; County of Honolulu\",\n    \"Maui County\",\n    \"Hawaii country\",\n    \"kauai\",\n    \"State Cost\"\n  ],\n  \"graphable\": true\n}"
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
                            }
                        },
                        "required": [
                            "title",
                            "subtitle",
                            "x",
                            "y",
                            "graphable"
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
