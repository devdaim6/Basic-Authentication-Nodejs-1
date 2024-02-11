const User = require("./../user/model");
const generateImage = async (prompt,count) => {
  const apiUrl = "https://api.openai.com/v1/images/generations";
  const apiKey = "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";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  const data = {
    prompt: prompt,
    model: "dall-e-3", // or 'dall-e-3'
    n: 1, // Number of images to generate (1 to 10 for dall-e-2, only 1 for dall-e-3)
    quality: "hd", // or 'hd' (only for dall-e-3)
    response_format: "url", // or 'b64_json'
    size: "1024x1024", // Image size based on model
    style: "vivid", // or 'natural' (only for dall-e-3)
    user: "anonymous", // Optional user identifier
  };

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  });
  const response = await res.json();
  return response;
};

 

module.exports = { generateImage };
