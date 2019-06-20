<template>
  <section class="welcome-screen screen">
    <div class="welcome-card card">
      <h1>Welcome!</h1>
      <h4>Configure your image upload settings before you proceed</h4>
      <InputGroup
        label = "Bucket Name"
        placeholder = "Enter a bucket name and remember it"
        v-bind:error="bucketNameError"
        @input="bucketChange"
        v-bind:value="bucketName"
        @enter="onSubmit"
      />
      <InputGroup
        label = "Image Max Dimension (default: 600)"
        placeholder = "Eg. 1920, 1600..."
        v-bind:error="imgMaxDimensionError"
        inputType="number"
        @input="imgMaxDimensionChange"
        v-bind:value="imgMaxDimension"
        @enter="onSubmit"
      />
      <InputGroup
        label = "Compression Quality (0.0 to 1.0)"
        placeholder = "Eg. 0.75"
        v-bind:error="compressionQualityError"
        inputType="number"
        @input="compressionQualityChange"
        v-bind:value="compressionQuality"
        @enter="onSubmit"
      />
      <label class="rem-check">
        <input type="checkbox" v-bind:checked="rememberBucketNameChecked" @input="rememberBucketName">
        Remember my settings
      </label>
      <Button 
        btnType="emphasis"
        @click="onSubmit"
      >
        Proceed
      </Button>
    </div>
  </section>
</template>

<script>
import Button from './common/Button.vue';
import InputGroup from './common/InputGroup.vue';

export default {
  name: 'Welcome',
  props: {
    
  },
  components:{
    Button,
    InputGroup
  },
  data(){
    return {
      bucketName: '',
      imgMaxDimension: '',
      bucketNameError: '',
      imgMaxDimensionError: '',
      rememberBucketNameChecked: false,
      compressionQualityError: '',
      compressionQuality: ''
    }
  },
  methods: {
    bucketChange: function(val){
      this.bucketName = val;
      this.bucketNameError = '';
    },
    imgMaxDimensionChange: function(val){
      this.imgMaxDimension = val;
      this.imgMaxDimensionError = '';
    },
    compressionQualityChange: function(val){
      this.compressionQuality = val;
      this.compressionQualityError = '';
    },
    onSubmit: function(){
      var flag = true;

      if(this.imgMaxDimension < 200){
        this.imgMaxDimensionError = 'Minimum value 200 is required';
        flag = false;
      }
      
      if(!this.bucketName){
        this.bucketNameError = "Bucket name is required";
        flag = false;
      }
      if(!this.compressionQuality || this.compressionQuality > 1.0){
        this.compressionQualityError = "Compression quality is required and must be between 0 and 1";
        flag = false;
      }

      if(flag){
        if(this.rememberBucketNameChecked){
          localStorage.setItem('bucketName', this.bucketName);
          localStorage.setItem('imgMaxDimension', this.imgMaxDimension);
          localStorage.setItem('compressionQuality', this.compressionQuality);
        }
        else{
          localStorage.removeItem('bucketName');
          localStorage.removeItem('imgMaxDimension');
          localStorage.removeItem('compressionQuality');
        }
        this.$emit('success', {
          bucketName: this.bucketName,
          imgMaxDimension: parseInt(this.imgMaxDimension) || 600,
          compressionQuality: parseFloat(this.compressionQuality) || 0.75
        });
        // console.log('success');
      }
    },
    rememberBucketName: function(){
      this.rememberBucketNameChecked = !this.rememberBucketNameChecked;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .welcome-screen{
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 100px 0
  }

  .welcome-card{
    width: calc(100vw - 40px);
    max-width: 400px;
  }

  .welcome-card > .button{
    width: 100%;
    margin-top: 32px;
  }

  h1{
    font-size: 32px;
    color: #333;
    margin: 0;
  }
  h4{
    font-size: 16px;
    color: #666;
    margin-bottom: 32px;
    margin-top: 8px;
    font-weight: 500;
    padding: 0 20px;
  }

  h1,h4{
    text-align: center
  }

  .rem-check{
    color: #333;
    font-size: 14px;
    cursor: pointer;
  }
</style>
