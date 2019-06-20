<template>
  <div class="input-group">
    <label>{{ label }}</label>
    <input
      v-bind:type = "inputType"
      @change="change"
      v-bind:placeholder="placeholder"
      v-bind:value="value"
      @keyup.enter="$emit('enter')"
    />
    <p v-if="error" class="error">{{error}}</p>
  </div>
</template>

<script>
  export default {
    name: 'InputGroup',
    props: {
      label: String,
      placeholder: String,
      error: {
        type: String,
        default: ''
      },
      inputType: {
        type: String,
        default: 'text'
      },
      value: String
    },
    data(){
      return {
      }
    },
    watch:{
      error: function(val){
        this.error = val;
      }
    },
    methods:{
      change: function(event){
        this.$emit('input', event.target.value);
        // this.dispatchEvent(new CustomEvent('input', event.target.value));
      }
    }
  }
</script>

<style scoped>
  .input-group{
    margin-bottom: 20px;
    width: 100%;
  }
  .input-group > label{
    display: block;
    text-align: left;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: bold;
    color: #333
  }
  .input-group > input{
    width: 100%;
    padding: 0;
    margin: 10px 0;
    display: block;
    height: 40px;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding-left: 12px;
    box-sizing: border-box;
    font-size: 14px;
  }
  .input-group > input::-webkit-input-placeholder{
    color: #aaa
  }
  .input-group > .error{
    display: block;
    text-align: left;
    color: red;
    font-size: 14px;
    margin: 0;
  }
</style>