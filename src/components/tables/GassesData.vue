<template>
  <v-card>
    <v-toolbar dark dense color="red">
         <v-toolbar-title class="font text-uppercase font-weight-medium">
           Gasses Data
         </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn v-if="hasPermission('Transformer', ['Administrator', 'Manager', 'Logger'])" small @click="gassesDatadialog()" outlined>
            <v-icon>mdi-plus</v-icon>
            Add Data
          </v-btn>
        </v-toolbar>
        <v-data-table
      :headers="headers"
      :items="data"
      item-key="name"
      class="elevation-1"
    >
      <template v-slot:item="{item}">
        <tr @click="viewAllDetails(item)">
          <td>
            <span class="font-sm">{{ dateFormat(item.timestamp) }}</span>
          </td>
          <td class="font-sm">
            {{ item.acetylene }}
          </td>
          <td class="font-sm">
            {{ item.acetylene_roc }}
          </td>
          <td class="font-sm">
            {{ item.ethylene }}
          </td>
          <td class="font-sm">
            {{ item.ethylene_roc }}
          </td>
          <td class="font-sm">
            {{ item.methane }}
          </td>
          <td class="font-sm">
            {{ item.methane_roc }}
          </td>
          <td class="font-sm">
            {{ item.ethane }}
          </td>
          <td class="font-sm">
            {{ item.ethane_roc }}
          </td>
          <td class="font-sm">
            {{ item.hydrogen }}
          </td>
          <td class="font-sm">
            {{ item.hydrogen_roc }}
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>

</template>
<style scoped>
    .font-sm {
        font-size : 12px !important;
    }
</style>
<script>
    export default {
        name : 'GassesData',
        props : { 
          data: Array,
          hasPermission: Function
        },
        
        data () {
            return {
                headers : [
                    {
                        text: 'Timestamp',
                        align: 'start',
                        sortable: true,
                        value: 'timestamp',
                    },
                    {
                        text: 'Acetylene',
                        align: 'start',
                        sortable: false,
                        value: 'acetylene',
                    },
                    {
                        text: '(C2H2-ROC)',
                        align: 'start',
                        sortable: false,
                        value: 'acetylene_roc',
                    },
                    {
                        text: 'Ethylene',
                        align: 'start',
                        sortable: false,
                        value: 'ethylene',
                    },
                    {
                        text: '(C2H4-ROC)',
                        align: 'start',
                        sortable: false,
                        value: 'ethylene_roc',
                    },
                    {
                        text: 'Methane',
                        align: 'start',
                        sortable: false,
                        value: 'methane',
                    },
                    {
                        text: '(CH2-ROC)',
                        align: 'start',
                        sortable: false,
                        value: 'methane_roc',
                    },
                    {
                        text: 'Ethane',
                        align: 'start',
                        sortable: false,
                        value: 'ethane',
                    },
                    {
                        text: '(C2H6-ROC)',
                        align: 'start',
                        sortable: false,
                        value: 'ethane_roc',
                    },
                    {
                        text: 'Hydrogen',
                        align: 'start',
                        sortable: false,
                        value: 'hydrogen',
                    },
                    {
                        text: '(H-ROC)',
                        align: 'start',
                        sortable: false,
                        value: 'hydrogen_roc',
                    }
                ]
            }
        },
        methods : {
            dateFormat(date) {
                let d = new Date(date);
                return d.toLocaleString();
            },
            viewAllDetails(item) {
              // console.log(item)
                this.$emit('showDetails', item);
            },
            gassesDatadialog(){
              this.$emit('show');
            }

        }
    }
</script>