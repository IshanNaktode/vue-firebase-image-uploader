
function compressImage(file, max_height, max_width, quality) {
  var p = new Promise((resolve, reject) => {
    try{
      var reader = new FileReader();
      reader.readAsArrayBuffer(file);
      
      reader.onload = function (event) {
        // blob stuff
        var blob = new Blob([event.target.result]); // create blob...
        window.URL = window.URL || window.webkitURL;
        var blobURL = window.URL.createObjectURL(blob); // and get it's URL
        
        // helper Image object
        var image = new Image();
        image.src = blobURL;
        //preview.appendChild(image); // preview commented out, I am using the canvas instead
        image.onload = () => {
          // have to wait till it's loaded
          var resized = compress(image,max_height,max_width, quality); // send it to canvas
          resolve(resized)
        }
      };
    }catch(e){
      reject(e);
    }
  });

  return p;
}

function compress(img, max_height, max_width, quality) {
  
  var canvas = document.createElement('canvas');

  var width = img.width;
  var height = img.height;

  // calculate the width and height, constraining the proportions
  if (width > height) {
    if (width > max_width) {
      //height *= max_width / width;
      height = Math.round(height *= max_width / width);
      width = max_width;
    }
  } else {
    if (height > max_height) {
      //width *= max_height / height;
      width = Math.round(width *= max_height / height);
      height = max_height;
    }
  }
  
  // resize the canvas and draw the image data into it
  canvas.width = width;
  canvas.height = height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, height);
  
  return canvas.toDataURL("image/jpeg",quality); // get the data from canvas as 70% JPG (can be also PNG, etc.)

}

export default compressImage;