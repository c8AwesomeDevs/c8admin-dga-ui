<!-- components/LoadingOverlay.vue -->
<template>
    <v-overlay v-model="visible" persistent content-class="centered-dialog">
      <v-container fill-height>
        <v-layout column justify-center align-center>
          <v-progress-circular
            indeterminate
            :size="size"
            :width="width"
            :color="color"
          />
        </v-layout>
      </v-container>
    </v-overlay>
  </template>
  
  <script>
  export default {
    name: "LoadingOverlay",
    props: {
      visible: {
        type: Boolean,
        required: true,
      },
      size: {
        type: Number,
        default: 70,
      },
      width: {
        type: Number,
        default: 7,
      },
      color: {
        type: String,
        default: "green",
      },
    },
  };
  </script>
  
  <style scoped>
  .centered-dialog {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  </style>
  