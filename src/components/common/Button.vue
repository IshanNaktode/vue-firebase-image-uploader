<template>
  <button 
    v-bind:class="btnClass"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script>
  export default {
    name: "Button",
    data(){
      return{
        btnClass: {
          'button': true,
          ['button-type-' + this.btnType]: this.btnType.length > 0
        }
      }
    },
    props:{
      btnType: {
        type: String,
        default: ''
      } 
    }
  }
</script>

<style scoped>
  .button{
  background: rgba(29, 99, 238, 0.1);
  color: rgb(29, 99, 238);
  height: 40px;
  padding: 0 32px;
  font-size: 16px;
  font-family: inherit;
  border-radius: 4px;
  border: 1px solid rgba(29, 99, 238, 0.15);
  cursor: pointer;
}
.button > img{
  margin-left: 12px;
  height: 0.75em;
}

.button-type-emphasis{
  background: rgb(29, 99, 238);
  color: white;
}

.button-type-emphasis-danger{
  background: rgba(255,0,0,1);
  border-color: rgba(255,0,0,0);
  color: white;
}

.button-type-emphasis-success{
  background: rgba(0,200,0,1);
  border-color: rgba(0,0,0,0);
  color: white;
}

.button-type-emphasis-warning{
  background: rgba(255,160,0, 1);
  border-color: rgba(0,0,0,0);
  color: white;
}

.button-type-danger{
  background: rgba(255,0,0,0.1);
  border-color: rgba(255,0,0,0.2);
  color: red;
}

.button-type-danger-nude{
  background: transparent;
  border-color: transparent;
  color: red;
  padding-left: 1em;
  padding-right: 1em;
}

.button-type-link-nude{
  background: transparent;
  border-color: transparent;
  color: rgb(29, 99, 238);
  padding-left: 1em;
  padding-right: 1em;
}

.button-type-danger-border{
  background: transparent;
  border-color: red;
  color: red;
  padding-left: 1em;
  padding-right: 1em;
}

.button-type-link-border{
  background: transparent;
  border-color: rgb(29, 99, 238);
  color: rgb(29, 99, 238);
  padding-left: 1em;
  padding-right: 1em;
}


.button-type-success{
  background: rgba(0,200,0,);
  border-color: rgba(0,0,0,0);
  color: rgb(0,200,0);
}

.button-type-warning{
  background: rgba(255,130,0, 0.1);
  border-color:rgba(255,130,0, 0.2);
  color: rgb(255,130,0);
}

.button-type-default{
  background: rgba(0,0,0,0.05);
  border-color: rgba(0,0,0,0.1);
  color: #333;
}

.button-type-link{
  background-color: transparent;
  border-color: rgba(29, 99, 238, 0.45);
  border-width: 1px;
}
</style>
