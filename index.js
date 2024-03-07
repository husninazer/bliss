


//const response = await openai.createImageEdit(
//  fs.createReadStream("sunlit_lounge.png"),
//  fs.createReadStream("mask.png"),
//  "dall-e-2",
//  "Some clouds inside",
//  1,
//  "1024x1024"
//);
//image_url = response.data.data[0].url;


const OpenAI = require("openai");
require('dotenv').config()
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require('fs')
const _jimp = require('./jimp')
const { v4: uuidv4 } = require('uuid');



const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});

// Set up the server
const app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ 
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
 }));
 app.use(cors());

let fileupload = require("express-fileupload");
app.use(fileupload());

// Set up the DALL-E endpoint
app.post("/image", async (req, res) => {
  // Get the prompt from the request

  let prompT = "cleaned place with clean and neat waste bins with different colours of high quality each one for different materials like plastic, organic, and other wastes. This picture looks like a clean neighbourhood. "
  
  // let prompT = "Make the city futuristic with less carbon, sustainability and better place for health and fitness for citizens"
  //let prompT = "futuristic city"

  // Generate image from prompt
  // const response = await openai.images.generate({
  //   prompt: prompt,
  //   n: 1,
  //   size: "1024x1024",
  // });

  // const response = await openai.images.createVariation(
  //     fs.createReadStream("/Users/husni/Downloads/garbages.png"),
  //    // fs.createReadStream("mask.png"),
  //     //"dall-e-2",
  //     "Make the garbages look clean in the waste bin",
  //     1,
  //     "1024x1024"
  //   );

    // const response = await openai.images.createVariation({ 
    //   model: "dall-e-2", 
    //   image: fs.createReadStream("/Users/husni/Downloads/garbages.png") ,
    //   n: 1,
    //   size: "1024x1024" 
    // })

    //const response = await openai.images.generate({ model: "dall-e-2", prompt: "An oasis in the desert with large metal spheres and blue water futuristic city theme" });

   // return console.log(req.files)
    const { image } = req.files;

    // If no image submitted, exit
    if (!image) return res.sendStatus(400);

    // Move the uploaded image to our upload folder
    let upload_image = './upload/' + uuidv4() + ".png"
    image.mv(upload_image, async function(err) {
      let mask = await _jimp.mask(upload_image)

     // return console.log(upload_image, mask)

      const response = await openai.images.edit(
        {
          image: fs.createReadStream(upload_image), //fs.createReadStream("/Users/husni/Downloads/construction.png") ,
          mask: fs.createReadStream(mask), //fs.createReadStream("/Users/husni/Downloads/mask.png"),
          prompt : prompT
        }
        // 1,
        // "1024x1024"
      );
  
    console.log(response.data)
    // Send back image url
    res.send(response.data[0].url);


    });


   

    
});

// Start the server
const port = 8080;

app.listen(port, () => {
 console.log(`Server listening on port ${port}`);
});




