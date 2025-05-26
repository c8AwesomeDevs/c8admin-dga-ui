<template>
  <v-dialog v-model="dialog" width="300" @click:outside="closeDialog()">
    <div class="dialog-body">
      <v-alert dark color="red darken-4" class="mb-2">{{ title }} Ranges</v-alert>

      <v-alert dark color="green">
        <div>Normal</div>
        <div>
          <h4>{{ data.normal ? data.normal.min : 0 }} - {{ data.normal ? data.normal.max : 0 }}</h4>
        </div>
      </v-alert>
      <v-alert dark color="yellow darken-1">
        <div>Level 1 Warning</div>
        <div>
          <h4>{{ data.medium ? data.medium.min : 0 }} - {{ data.medium ? data.medium.max : 0 }}</h4>
        </div>
      </v-alert>
      <v-alert dark v-if="data.critical && data.critical.max" color="orange ">
        <div>Level 2 Warning</div>
        <div>
          <h4>{{ data.critical ? data.critical.min : 0 }} - {{ data.critical ? data.critical.max : 0 }}</h4>
        </div>
      </v-alert>
      <v-alert color="red" dark class="mb-0">
        <div>Pre-Failure</div>
        <div>
          <h4>{{ data.failure ? data.failure.min : 0 }} - {{ data.failure ? data.failure.max : 0 }}</h4>
        </div>
      </v-alert>
    </div>
  </v-dialog>
</template>
<style scoped>
.dialog-body {
  background: #e3e3e3;
  padding: 10px;
}
</style>
<script>
export default {
  name: "GasLimitDetails",
  props: ["title", "dialog", "data", "details"],
  methods: {
    closeDialog() {
      this.$emit("close");
    },
  },
};
</script>
