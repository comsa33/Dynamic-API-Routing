
import { GoogleGenAI } from "@google/genai";
import type { ApiSpec } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const buildPrompt = (spec: ApiSpec): string => {
  const toDescription = (arr: {key: string, value: string}[]) => 
    arr.length > 0 ? arr.map(p => `- ${p.key}: ${p.value}`).join('\n') : 'None';

  const pathParams = spec.endpoint.match(/{(\w+)}/g)?.map(p => ({key: p.slice(1,-1), value: 'Path parameter'})) || [];

  return `
You are an expert Python FastAPI developer. Your task is to generate a complete, single Python file that implements a FastAPI endpoint based on the user's specifications.

**CRITICAL INSTRUCTIONS:**
1.  Use modern Python features, including type hints (e.g., from the 'typing' module).
2.  Import all necessary modules from 'fastapi', 'pydantic', 'typing', etc.
3.  The response MUST be a single, valid Python code block inside \`\`\`python ... \`\`\`. Do NOT include any explanatory text before or after the code block.
4.  If the user specifies a request or response body in JSON format, create Pydantic models for validation and serialization. Name them appropriately (e.g., 'ItemRequest', 'UserResponse').
5.  If Server-Sent Events (SSE) are requested, use 'fastapi.responses.StreamingResponse' with an 'async def' generator function that yields event data.
6.  Implement the business logic as described by the user. If the logic is simple, implement it directly. If it's complex, add comments like '# TODO: Implement complex business logic here' at the appropriate place.
7.  The final code should be clean, readable, and ready to be saved as a .py file and run.
8.  Handle path parameters correctly in the function signature.
9.  Handle query parameters by using default values in the function signature (e.g., 'q: str | None = None').
10. Handle request headers using 'fastapi.Header'.

**API SPECIFICATIONS:**
- **HTTP Method:** ${spec.method}
- **Endpoint Path:** /api/user${spec.endpoint}
- **Summary:** API for ${spec.endpoint}

**Request Details:**
- **Path Parameters:**
${toDescription(pathParams)}
- **Query Parameters:**
${toDescription(spec.queryParams)}
- **Request Headers:**
${toDescription(spec.requestHeaders)}
- **Request Body (JSON Schema/Description):**
${spec.requestBody || 'None'}

**Response Details:**
- **Response Headers:**
${toDescription(spec.responseHeaders)}
- **Response Body (JSON Schema/Description):**
${spec.responseBody || 'None'}
- **Server-Sent Events (SSE):** ${spec.isSse ? 'Yes' : 'No'}

**BUSINESS LOGIC DESCRIPTION:**
---
${spec.businessLogic}
---

Now, generate only the Python code.
`;
};

export const generateApiCode = async (spec: ApiSpec): Promise<string> => {
  const prompt = buildPrompt(spec);
  
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    let code = response.text;
    
    // Clean up the response to extract only the python code block
    const codeBlockMatch = code.match(/```python\n([\s\S]*)\n```/);
    if (codeBlockMatch && codeBlockMatch[1]) {
      return codeBlockMatch[1].trim();
    }
    
    // Fallback if the model doesn't use markdown
    return code.trim();

  } catch (error) {
    console.error('Error generating API code:', error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate code from Gemini API: ${error.message}`);
    }
    throw new Error('An unexpected error occurred while communicating with the Gemini API.');
  }
};
