const express = require("express");
const { generateImage,  } = require("./controller");
const router = express.Router();

 

router.post("/", async (req, res) => {
  try {
    const { prompt ,count} = req.body;
    if (!prompt) {
      throw Error("A Prompt is Required");
    }

    const generatedImage = await generateImage(prompt,count);
    res.status(200).json(generatedImage);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
