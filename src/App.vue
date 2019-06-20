<template>
  <div id="app" 
    @dragleave = "preventDrop"
    @dragend = "preventDrop"
    @drop = "preventDrop"
  >
    <Welcome 
      v-if="!detailsSubmitted"
      @success="onProceed"
    />

    <Compressor 
      v-if="detailsSubmitted"
      v-bind:settings="settings"
      @change-settings="changeSettings"
    />
  </div>
</template>

<script>
import Welcome from './components/Welcome.vue'
import Compressor from './components/Compressor.vue'
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';

var firebaseConfig = {
  apiKey: "AIzaSyAoCR7ubqPJxy3HQRSbyfKLkKCkBqafvPo",
  authDomain: "todo-afb4a.firebaseapp.com",
  databaseURL: "https://todo-afb4a.firebaseio.com",
  projectId: "todo-afb4a",
  storageBucket: "todo-afb4a.appspot.com",
  messagingSenderId: "831538578893",
  appId: "1:831538578893:web:38eb48082d5a2e4b"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
window.db = firebase.database();

export default {
  name: 'app',
  components: {
    Compressor,
    Welcome
  },
  mounted(){
    window.addEventListener("dragover",function(e){
      e.preventDefault();
    },false);
    window.addEventListener("drop",function(e){
      e.preventDefault();
    },false);
  },
  created(){
    if(localStorage.getItem('bucketName')){
      this.settings ={
        bucketName: localStorage.getItem('bucketName'),
        imgMaxDimension: localStorage.getItem('imgMaxDimension'),
        compressionQuality: localStorage.getItem('compressionQuality')
      };
      this.loadWindowVarsWithSetting();
    }
  },
  data(){
    return {
      detailsSubmitted: localStorage.getItem('bucketName'),
      settings: {}
    }
  },
  methods: {
    preventDrop: function(event){
      event.preventDefault();
      event.stopPropagation();
    },
    onProceed: function(data){
      this.detailsSubmitted = true;
      this.settings = data;
      this.loadWindowVarsWithSetting();
    },
    changeSettings: function(){
      var confirm = window.confirm('Are you sure you want to change your settings? Please note your bucket name before proceeding.');
      if(confirm){
        this.detailsSubmitted = false;
        this.settings = {};
        localStorage.removeItem('bucketName');
        localStorage.removeItem('imgMaxDimension');
        localStorage.removeItem('compressionQuality');
      }
    },
    loadWindowVarsWithSetting: function(){
      window.bucketName = this.settings.bucketName;
      window.imgMaxDimension = this.settings.imgMaxDimension;
      window.compressionQuality = this.settings.compressionQuality;
    }
  }
}
</script>

<style>
*{
  box-sizing: border-box;
}
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.5;
  width: 100%;
  max-width: 1200px;
  margin: auto;
  padding: 0 20px;
}
.screen{
  min-height: 100vh;
  width: 100%;
}

body, html{
  background: #f4f4f4;
  min-height: 100%;
  margin:0;
}

.card{
  box-shadow: 0 2px 5px rgba(0,0,0,0.25);
  padding: 24px;
  border-radius: 12px;
  background: white;
}
/* Layout */
.flex{
  display: flex;
}
.flex-column{
  flex-direction: column
}
.flex-row{
  flex-direction: row
}

.flex-justify-space-between{
  justify-content: space-between
}
.flex-justify-center{
  justify-content: center;
}
.flex-justify-end{
  justify-content: flex-end;
}
.flex-justify-start{
  justify-content: flex-start;
}
.flex-justify-space-around{
  justify-content: space-around;
}

.flex-align-center{
  align-items: center;
}
.flex-align-start{
  align-items: flex-start;
}
.flex-align-end{
  align-items: flex-end;
}
.flex-align-stretch{
  align-items: stretch;
}
@media screen and (min-width: 768px){
  .flex\@s{
    display: flex;
  }
  .flex-column\@s{
    flex-direction: column
  }
  .flex-row\@s{
    flex-direction: row
  }

  .flex-justify-space-between\@s{
    justify-content: space-between
  }
  .flex-justify-center\@s{
    justify-content: center;
  }
  .flex-justify-end\@s{
    justify-content: flex-end;
  }
  .flex-justify-start\@s{
    justify-content: flex-start;
  }
  .flex-justify-space-around\@s{
    justify-content: space-around;
  }
  
  .flex-align-center\@s{
    align-items: center;
  }
  .flex-align-start\@s{
    align-items: flex-start;
  }
  .flex-align-end\@s{
    align-items: flex-end;
  }
  .flex-align-stretch\@s{
    align-items: stretch;
  }
}

/* Margins */

.margin-remove{
  margin: 0;
}
.margin-vertical-remove{
  margin-top: 0;
  margin-bottom: 0;
}
.margin-horizontal-remove{
  margin-left: 0;
  margin-right: 0;
}

.margin-s{
  margin: 12px;
}
.margin-m{
  margin: 24px;
}
.margin-l{
  margin: 48px;
}

.margin-right-s{
  margin-right: 12px;
}
.margin-left-s{
  margin-left: 12px;
}
.margin-top-s{
  margin-top: 12px;
}
.margin-bottom-s{
  margin-bottom: 12px;
}

.margin-right-m{
  margin-right: 24px;
}
.margin-left-m{
  margin-left: 24px;
}
.margin-top-m{
  margin-top: 24px;
}
.margin-bottom-m{
  margin-bottom: 24px;
}

.margin-right-l{
  margin-right: 48px;
}
.margin-left-l{
  margin-left: 48px;
}
.margin-top-l{
  margin-top: 48px;
}
.margin-bottom-l{
  margin-bottom: 48px;
}

@media screen and (min-width: 768px){
  .margin-s\@s{
    margin: 12px;
  }
  .margin-m\@s\@s{
    margin: 24px;
  }
  .margin-l\@s{
    margin: 48px;
  }
  
  .margin-right-s\@s{
    margin-right: 12px;
  }
  .margin-left-s\@s{
    margin-left: 12px;
  }
  .margin-top-s\@s{
    margin-top: 12px;
  }
  .margin-bottom-s\@s{
    margin-bottom: 12px;
  }
  
  .margin-right-m\@s{
    margin-right: 24px;
  }
  .margin-left-m\@s{
    margin-left: 24px;
  }
  .margin-top-m\@s{
    margin-top: 24px;
  }
  .margin-bottom-m\@s{
    margin-bottom: 24px;
  }
  
  .margin-right-l\@s{
    margin-right: 48px;
  }
  .margin-left-l\@s{
    margin-left: 48px;
  }
  .margin-top-l\@s{
    margin-top: 48px;
  }
  .margin-bottom-l\@s{
    margin-bottom: 48px;
  }
}
</style>
