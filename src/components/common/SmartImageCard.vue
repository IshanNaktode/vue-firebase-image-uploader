<template>
  <div class="image-card">
    <h5>{{ imageObj.name }} <img v-if="uploading" style="height: 30px; vertical-align: middle" src="../../assets/loading.gif"/></h5>
    <div ref="img" class="img-viewer"></div>
    <div v-bind:class="{'img-preview': true, 'show': preview}">
      <img ref="imgPreview" class="img-viewer-orig"/>
      <img class="close-img" @click="preview=false" src="../../assets/close.svg"/>
    </div>
    <div v-if="uploading" class="upload-bar-container">
      <div 
        class="upload-bar"
        v-bind:style="{ transform: 'scale3d(' + progress/100 + ',1,1)'}"
      ></div>
    </div>
    <div class="opts">
      <div @click="preview=true" >
        <img src="../../assets/maximize.png"/>
      </div>
      <div>
        <img src="../../assets/decrease.svg"/>
        {{ compressionPercentage }}
      </div>
      <div @click="deleteImg">
        <img v-if="autoUpload || uploadStarted || uploading || imageObj.dbObj.downloadURL" src="../../assets/rubbish-bin.png"/>
        <img v-if="!autoUpload && !imageObj.dbObj.downloadURL && !uploading && !uploadStarted" src="../../assets/upload.svg"/>
      </div>
    </div>
    <!-- <img ref="img"/> -->
  </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';
import compressImage from '../../util/compressImage';
import dataUrlToBlob from '../../util/dataUrlToBlob';

export default {
  name: "SmartImageCard",
  props: {
    imageObj: Object,
    autoUpload: Boolean
  },
  data(){
    return{
      progress: 20,
      preview: false,
      uploadTask: null,
      uploading: false,
      compressionPercentage: '...',
      compressedFile: null,
      uploadStarted: false
    }
  },
  mounted: async function(){
    if(this.imageObj.dbObj.downloadURL){
      this.compressionPercentage = this.imageObj.dbObj.compressionPercentage;
      this.$refs.img.style.backgroundImage = "url(" + this.imageObj.dbObj.downloadURL +")";
      this.uploading = false;
      this.$refs.imgPreview.src = this.imageObj.dbObj.downloadURL;
      return;
    }
    // else compress and upload
    const file = this.imageObj.file;
    const imgName = this.imageObj.name;
    const key = this.imageObj.key;

    try {
      var compressedSrc = await compressImage(file, window.imgMaxDimension || 1000, window.imgMaxDimension || 1000, window.compressionQuality || 0.5);
      var contentType = 'image/jpeg';
      var blob = dataUrlToBlob(compressedSrc);
      var compressedFile = blob;
      this.compressedFile = compressedFile;

      this.compressionPercentage = parseInt(((file.size - compressedFile.size)/file.size)*100) + "%";

      var orig_img_64 = compressedSrc;
      var img = this.$refs.img;
      var imgPreview = this.$refs.imgPreview;
      img.style.backgroundImage = "url(" + orig_img_64 +")";
      imgPreview.src = orig_img_64;

      if(this.autoUpload){
        this.upload(compressedFile, key, imgName);
        return;
      }else{
        this.uploading=false;
      }
    } catch (error) {
      window.console.log(error);
    }
  },
  methods: {
    deleteImg: function(){
      if(!this.autoUpload && !this.imageObj.dbObj.downloadURL && !this.uploading && !this.uploadStarted){
        // start upload
        this.upload(this.compressedFile, this.imageObj.key, this.imageObj.name);
      }
      else{
        // already uploaded
        if(this.uploadTask){
          var confirm = window.confirm('The file is uploading. Are you sure you want to abort?');
          // cancel and delete
          if(confirm){
            this.uploadTask.cancel();
            this.uploading = false;
          }
        }else{
          var confirm = window.confirm('Are you sure you want to delete the image?');
        }
        if(confirm)
          this.$emit('onDelete', this.imageObj.key);
      }
    },
    upload: function(compressedFile, key, imgName){
      this.uploading=true;
      var uploadTask = firebase.storage().ref().child(
        `images/${window.bucketName}/${key}-${imgName}`
      ).put(compressedFile);

      this.uploadTask = uploadTask;

      uploadTask.on('state_changed', (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.progress = 20 + progress*0.8;
        // console.log('Upload is ' + progress + '% done');
      }, (error) => {
        switch(error.code){
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;

          case 'storage/canceled':
            // User canceled the upload
            break;

          case 'storage/unknown':
            window.alert(`Unknown error occurred: ${error.serverResponse}`);
            break;
        }
      }, () => {
        setTimeout(()=>this.uploading = false, 500);
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL)=>{
          this.uploadTask = null;
          // console.log('File available at', downloadURL);
          this.$emit('onUpload', key, downloadURL, imgName, this.compressionPercentage);
        });
      });
    },
    startUpload: function(){
      this.uploadStarted = true;
      this.uploading = true;
      this.upload(this.compressedFile, this.imageObj.key, this.imageObj.name);
    }
  }
}
</script>

<style>
.image-card{
  background: white;
  border-radius: 12px;
  width: calc(33.33% - 40px);
  display: inline-block;
  margin: 20px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0,0,0,0.16)
}
.image-card > img{
  width: 100%;
  max-height: 200px;
}
.img-viewer{
  padding-bottom: 80%;
  background-size: cover;
  background-position: center;
}
.image-card > h5{
  margin:0;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 500;
  border-bottom: 1px solid #e0e0e0;
}
.del{
  border-top: 1px solid #e0e0e0;
  padding: 10px 20px;
}
.opts{
  border-top: 1px solid #e0e0e0;
  display: flex;
}

.opts > div{
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  cursor: pointer;
}
.opts > div:nth-child(2){
  border-right: 1px solid #e0e0e0;
  border-left: 1px solid #e0e0e0;
  cursor: auto;
  font-size: 16px;
}
.opts > div > img{
  height: 20px;
  opacity: 0.5;
  transition: 0.2s;
}
.opts > div:nth-child(2) > img{
  height: 14px;
  margin-right: 5px;
  opacity: 0.8;
}

.opts > div:hover > img{
  opacity: 1;
}
.opts > div:hover{
  background: #f2f2f2;
}
.upload-bar-container{
  height: 3px;
  background: #e0e0e0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.16);
  
}
.upload-bar{
  height: 6px;
  background: blue;
  width: 100%;
  transition: 0.2s transform;
  transform: scale3d(0.3,1,1);
  transform-origin: 0 50%;

}

.img-preview{
  position: fixed;
  height: 100vh;
  width: 100vw;
  background: rgba(0,0,0,0.75);
  top: 0;
  left: 0;
  padding: 100px;
  z-index: 999;
  justify-content: center;
  align-items: center;
  overflow: scroll;
  display: none;

  animation-name: fade-in;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  opacity: 0;
}
.img-preview.show{
  display: flex !important;
}

.img-preview > .close-img{
  opacity: 0.7;
  position: fixed;
  top: 32px;
  right: 32px;
  height: 36px;
  cursor: pointer;
}
.img-preview > .close-img:hover{
  opacity: 1;
}
.img-viewer-orig{
  width: 100%;
  margin: auto;
  animation-name: fade-in;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  transform: scale3d(0,0,0);
}

@keyframes fade-in {
  100% { opacity: 1; transform: scale3d(1,1,1); }
}

@media screen and (max-width:1000px){
  .image-card{
    width: calc(50% - 40px);
  }
  .img-preview{
    padding: 60px;
  }
  .img-preview > .close-img{
    top: 20px;
    right: 20px;
    height: 30px;
  }
}
@media screen and (max-width:640px){
  .image-card{
    width: calc(100% - 40px);
  }
  .img-preview{
    padding: 30px;
  }
  .img-preview > .close-img{
    top: 10px;
    right: 10px;
    height: 20px;
  }
}
</style>
