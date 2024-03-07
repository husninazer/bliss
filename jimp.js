var Jimp = require('jimp');


const { v4: uuidv4 } = require('uuid');



//let image_1 = '/Users/husni/Downloads/construction.png'
let image_2 = './assets/masks.png' 


// @ToDo
/* 

1. Identify object in the image with object detection. Shouls take this from usecase -1 where we are targeting only garbae visual pollution
2. Mark the object and remove from image.
3. Prompt with tuned VP solutions in usecase -1
4. Check options and prompt should be corrected as well  
*/


exports.mask = function(image_1) {
    return new Promise((res, rej) => {
        Jimp.read(image_1,(err, image) => {
            Jimp.read(image_2,(err1,image1) => {
              image1.resize(image.bitmap.width,image.bitmap.height)
              image.mask(image1,0,0)

              
              let output_image = "./out/" + uuidv4() + ".png";
              image.write(output_image) //for a file output
          
          //for buffer output
              image.getBufferAsync('image/png'); //for transparent image use image/png
              res(output_image)

            })
          })
    })
}



