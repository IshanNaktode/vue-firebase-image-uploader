function fileToDataUrl(file){
  var p = new Promise((resolve, reject)=>{
    try{
      var reader = new FileReader();
      reader.readAsDataURL(file); 
      reader.onloadend = () => {
        resolve(reader.result);
      }
    }
    catch(e){
      reject(e);
    }
  });
  return p;
}

export default fileToDataUrl;