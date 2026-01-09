import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

const gemini = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export const extractSkillsFromText = async (text: string) => {
    try {
        const prompt = `
Given the following resume text, extract:
- The applicant's full name (string), email (string), and phone number (string).
- All professional and technical skills as an array of strings.

Format your response strictly as the following JSON object:
{
  "name": "applicant's name or null",
  "email": "applicant's email or null",
  "phone": "applicant's phone or null",
  "skills": [array of skill names as strings]
}

If any of name, email, or phone is not found, set its value to null.
Do not include any text, explanation, or markdown. Return ONLY the JSON object.

Resume:
${text}
        `.trim();

        const result = await gemini.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        let responseText = result.text || '';

        responseText = responseText.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();

        let skills;
        try {
            skills = JSON.parse(responseText);
            if (!Array.isArray(skills)) {
                skills = [skills];
            }
        } catch (e: any) {
            throw new Error("Failed to parse skills JSON: " + e.message + " | Response: " + responseText);
        }

        return skills[0] || skills;
    } catch (error) {
        throw error;
    }
}

// export const extractProjectsFromText = async (text: string) => {
//     try {
//         const prompt = `
//         Extract all projects from the resume text below.
//         Return only a JSON array of project names, project descriptions, and project technologies used, nothing else. Do NOT include any explanation or markdown formatting.
//         Resume:
//         ${text}
//         `.trim();
//         const result = await gemini.models.generateContent({
//             model: "gemini-2.5-flash",
//             contents: prompt,
//         });
//         let responseText = result.text || '';

//         responseText = responseText.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();

//         let projects;
//         try {
//             projects = JSON.parse(responseText);
//             if (!Array.isArray(projects)) {
//                 projects = [projects];
//             }
//         } catch (e: any) {
//             throw new Error("Failed to parse projects JSON: " + e.message + " | Response: " + responseText);
//         }

//         return projects;
//     }catch(error){
//         throw error;
//     }
// }
