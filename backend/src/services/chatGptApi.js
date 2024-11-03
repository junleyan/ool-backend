import OpenAI from "openai";

export const getXYAxis = async (csv) => {
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful assistant that responds with JSON data only." },
                { role: "user", content: `Extract the x and y axes for graphing from the provided CSV data and respond only with JSON in this format: {"x": "string", "y": ["string"], "graphable": true}. Here is the data: ${csv}` }
            ],
            temperature: 1,
            max_tokens: 2048,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
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
