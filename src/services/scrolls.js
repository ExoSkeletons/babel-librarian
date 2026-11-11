import { llm } from "../config/library";

const scrolls_endpoint = 'https://k26u1oz0t3.execute-api.us-east-1.amazonaws.com/prod/scrolls'

const scrollsPrompt = llm.systemPrompt

export async function ask(query) {
    const response = await fetch(scrolls_endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify({
            query,
            system: scrollsPrompt ?? "",
        }),
    });

    if (!response.ok)
        throw new Error(`Lambda API request failed: ${response.status} ${response.statusText}`);

    const body = await response.json();

    return body.response;
}