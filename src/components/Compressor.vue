<template>
  <div style="min-height: 100%" class="margin-top-m">
    <div class="card flex flex-justify-space-between flex-align-center margin-bottom-l">
      <h4 class="margin-remove">
        Bucket: {{settings.bucketName}}<br/>
        MaxDim: {{settings.imgMaxDimension}}<br/>
        Quality: {{settings.compressionQuality}}
      </h4>
      <div>
        <Button btnType="danger" @click="$emit('change-settings')">
          Change
        </Button>
      </div>
    </div>
    <h1 class="margin-vertical-remove">Bucket Images <img v-if="loadingBucketImages" style="height: 40px; vertical-align: middle" src="../assets/loading.gif"/></h1>
    <h4 class="margin-top-s margin-bottom-s">Drag and drop single/multiple image(s) in container below to upload it into your bucket.</h4>
    <label class="margin-bottom-m" style="display: block; cursor: pointer">
      <input 
        type="checkbox" 
        v-bind:checked="autoStartUploadChecked" 
        @input="autoStartUpload"
      >
      <h4 style="display: inline; margin-left: 5px">Start uploading automatically?</h4>
    </label>
    <form 
      ref="form"
      @dragover="drag"
      @dragenter="drag"
      @drag="drag"
      @dragleave = "drop"
      @dragend = "drop"
      @drop = "drop"
      class="img-uploader-container"
    >
      <div class="img-cards-grid">
        <SmartImageCard
          v-bind:key="item.key"
          v-for="item in files"
          :imageObj = "item"
          :autoUpload = "autoStartUploadChecked"
          @onDelete = "onDelete"
          @onUpload = "onUpload"
        />
      </div>
      <div class="drag-promoter flex flex-justify-center flex-align-center">
        <span>drag and drop single/multiple image(s)</span>
      </div>
    </form>
  </div>

</template>

<script>
  import Button from './common/Button';
  import SmartImageCard from './common/SmartImageCard';
  import firebase from 'firebase/app';
  import 'firebase/database';
  import 'firebase/storage';

  export default {
    name: "Compressor",
    props: {
      settings: {
        type: Object
      }
    },
    data(){
      return{
        orig: null,
        blob: null,
        toastImg: null,
        img: "",
        isDragging: false,
        autoStartUploadChecked: true,
        files: [],
        loadingBucketImages: true
      }
    },
    components: {
      Button,
      SmartImageCard
    },
    created: async function(){
      var imagesInBucket = (await window.db.ref(`buckets/${window.bucketName}`).once('value')).val();
      this.loadingBucketImages = false;
      if(imagesInBucket){
        var arr = Array(Object.keys(imagesInBucket).length);
        var i = 0;
        for(var img in imagesInBucket){
          var imgObj = imagesInBucket[img];
          arr[i] = {
            key: img,
            name: imgObj.name,
            type: imgObj.type,
            file: null,
            dbObj: imgObj
          }
          i++;
        }
        this.files = arr;
      }
    },
    methods: {
      autoStartUpload: function(){
        this.autoStartUploadChecked = !this.autoStartUploadChecked
      },
      drag: function(event){
        event.preventDefault();
        event.stopPropagation();
        if(this.isDragging) return;
        this.isDragging = true;
        // console.log('dragged in');
        this.$refs.form.classList.add('is-drag')
      },
      drop: function(event){
        event.preventDefault();
        event.stopPropagation();
        if(!this.isDragging) return;
        this.isDragging = false;
        this.$refs.form.classList.remove('is-drag');

        if(event.type === 'dragleave'){
          // console.log('dropped outside');
        }
        else{
          var droppedFiles = event.dataTransfer.files;
          Array.from(droppedFiles).forEach((f)=>{
            this.files.push({
              key: firebase.database().ref().push().key,
              name: f.name,
              type: f.type,
              file: f,
              dbObj: {}
            })
          })
          // console.log('dropped inside');
        }
      },
      onDelete: function(key){
        this.files = this.files.filter(f => {
          window.db.ref(`buckets/${window.bucketName}/${key}`).set(null)
          return f.key !== key;
        });
      },
      onUpload: function(key, downloadURL, name, compressionPercentage){
        this.files = this.files.map((f,index) => {
          if(f.key === key){
            var dbObj = {
              downloadURL,
              name,
              compressionPercentage,
              key
            };
            f.dbObj = dbObj;
            window.db.ref(`buckets/${window.bucketName}/${key}`).set(dbObj);

          }
          
          return f;
        });
      }
    }
  };
</script>


<style>  
  .img-uploader-container{
    border-radius: 12px;
    padding: 20px;
    background: #e0e0e0;
    min-height: 200px;
    border: 2px dashed #888;
    margin-bottom: 200px;
  }

  .img-uploader-container.is-drag{
    background: #aaa;
  }

  .drag-promoter{
    height: 200px;
  }

  .img-cards-grid{
    padding-top: 20px;
    padding-left: 20px;
    margin-top: -20px;
    margin-left: -20px;
  }
</style>
