<template>
  <v-dialog v-model="show" max-width="450" min-width="400" persistent>
    <template>
        <v-card>
          <div>
            <span>
              <v-icon color="orange" class="icon ml-3 mt-3"> mdi-alert-circle-outline </v-icon>
              <span class="demo-check">
                {{ dialogMessage }}
              </span>
            </span>
          </div>
          <v-card-actions class="justify-end">
            <v-btn dark small color="red" text @click="close">OK</v-btn>
          </v-card-actions>
        </v-card>
      </template>
  </v-dialog>
</template>

<style scope>
.demo-check {
  font-size: 13px;
  white-space: pre;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 1em;
  margin-right: 1em;
}
</style>


<script>
export default {
  name: "AlertDialog",
  props: ["show", "dialogMessage"],
  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>
