import { GoogleGenAI } from "@google/genai";
import fs from "fs";

const ai = new GoogleGenAI({ apiKey: "APIKEY" });

const uploadedFile = await ai.files.upload({
    file: "./test.jpg", // path to image
  });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
        {
        role: "user",
        parts: [
          {
            fileData: {
              fileUri: uploadedFile.uri,
              mimeType: uploadedFile.mimeType,
            },
          },
          {
            text: "Describe this image",
          },
        ],
      },
    ],
  });
  console.log(<ReactMarkdown>
  {response}
</ReactMarkdown>);
}

main();