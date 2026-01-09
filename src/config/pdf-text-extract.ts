import { PDFParse } from "pdf-parse";
import fs from 'fs';


export const extractTextFromPDF = async (filePath: string) => {
    try {
        const pdf = new PDFParse({
            data: fs.readFileSync(filePath),
        })
        return await pdf.getText()
    }catch(error){
        throw error;
    }
}