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
                                "description": "The variable represented on the x-axis."
                            },
                            "y": {
                                "type": "array",
                                "description": "The variables represented on the y-axes.",
                                "items": {
                                    "type": "string"
                                }
                            },
                            "graphable": {
                                "type": "boolean",
                                "description": "Indicates whether the given CSV can be represented in a line chart. Be strict about it"
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
