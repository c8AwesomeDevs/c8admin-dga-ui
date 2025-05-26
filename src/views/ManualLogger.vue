<template>
    <div class="pa-4">
        <v-row>
            <v-col cols="12" md="4">
                <v-card>
                    <v-card-text class="indigo lighten-4">
                        Assets
                    </v-card-text>
                    <v-card-text>
                        <v-treeview
                            v-model="tree"
                            :open="initiallyOpen"
                            :items="items"
                            activatable
                            item-key="id"
                            open-on-click
                        >
                            <template v-slot:prepend="{ item }">
                                <v-icon>
                                    {{ item.icon }}
                                </v-icon>
                            </template>
                        </v-treeview>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="8">
                <div class="mb-2">
                    <v-card>
                        <v-card-text class="indigo lighten-4">
                            <v-row>
                                <v-col cols="12" sm="6">
                                    Asset Information
                                </v-col>
                                <v-col cols="12" sm="6" class="text-right">
                                    <v-btn x-small @click="showAssetDetails = !showAssetDetails">Show Full Details</v-btn>
                                </v-col>
                           </v-row>
                        </v-card-text>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12" md="4">
                                    <v-text-field label="Name" outlined dense hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-text-field label="Type" outlined dense hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-text-field label="Startup Date" outlined dense hide-details></v-text-field>
                                </v-col>
                            </v-row>
                            <div v-if="showAssetDetails">
                                <v-row>
                                    <v-col cols="12" md="4">
                                        <v-text-field label="Construction Year" outlined dense hide-details></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <v-text-field label="Age" outlined dense hide-details></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <v-text-field label="Line Capacity" outlined dense hide-details></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" sm="12">
                                        <v-textarea
                                            name="input-7-1"
                                            label="Equipment Description"
                                            value=""
                                            rows="2"
                                            outlined
                                            dense
                                            hide-details
                                            >
                                        </v-textarea>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" sm="12">
                                        <v-textarea
                                            name="input-7-1"
                                            label="Address"
                                            value=""
                                            rows="2"
                                            outlined
                                            dense
                                            hide-details
                                            >
                                        </v-textarea>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" md="4">
                                        <v-text-field label="Manufacturer" outlined dense hide-details></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <v-text-field label="Manufacturer Serial No" outlined dense hide-details></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <v-text-field label="Model No" outlined dense hide-details></v-text-field>
                                    </v-col>
                                </v-row>
                            </div>
                        </v-card-text>
                        <v-card-text class="indigo lighten-4">
                           Write Data
                        </v-card-text>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-menu
                                        ref="menu"
                                        v-model="menu"
                                        :close-on-content-click="false"
                                        :return-value.sync="date"
                                        transition="scale-transition"
                                        offset-y
                                        min-width="auto"
                                    >
                                        <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                            v-model="date"
                                            label="Date"
                                            append-icon="mdi-calendar"
                                            readonly
                                            v-bind="attrs"
                                            v-on="on"
                                            hide-details
                                            outlined
                                            dense
                                        ></v-text-field>
                                        </template>
                                        <v-date-picker
                                        v-model="date"
                                        no-title
                                        scrollable
                                        >
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            text
                                            color="primary"
                                            @click="menu = false"
                                        >
                                            Cancel
                                        </v-btn>
                                        <v-btn
                                            text
                                            color="primary"
                                            @click="$refs.menu.save(date)"
                                        >
                                            OK
                                        </v-btn>
                                        </v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field
                                        label="Label Text"
                                        value="12:30:00"
                                        type="time"
                                        hide-details
                                        dense
                                        outlined
                                        >
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field label="Acetylene (C2H2)" dense outlined hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="Ethylene (C2H4)" dense outlined hide-details></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field label="Methane (CH4)" dense outlined hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="Hydrogen (H2)" dense outlined hide-details></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field label="Oxygen (O2)" dense outlined hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="Nitrogen (N2)" dense outlined hide-details></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field label="Carbon Monoxide (CO)" dense outlined hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="Carbon Dioxide (CO2)" dense outlined hide-details></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field label="TDCG" dense outlined hide-details></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="12">
                                    <v-btn block class="indigo darken-4 white--text">Submit Data</v-btn>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    export default {
      data() {
        return {
            initiallyOpen: ['public'],
            menu: false,
            showAssetDetails : false,
            date : (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            tree: [],
            items: [
                {
                    id : 1,
                    name: 'Site 1',
                    icon : 'mdi-cube-outline',
                    children: [
                        {
                            name: 'Substation 1',
                            icon : 'mdi-cube-outline',
                            children: [
                                {
                                    id : 2,
                                    name: 'Transformer 1',
                                    icon : 'mdi-cube'
                                },
                                {
                                    id : 3,
                                    name: 'Transformer 2',
                                    icon : 'mdi-cube'
                                },
                            ],
                        }
                    ],
                },
                {
                    id : 4,
                    name: 'Site 2',
                    icon : 'mdi-cube-outline',
                    children: [
                        {
                            id : 5,
                            name: 'Substation 1',
                            icon : 'mdi-cube-outline',
                            children: [
                                {
                                    id : 6,
                                    name: 'Transformer 1',
                                    icon : 'mdi-cube-outline'
                                },
                                {
                                    id : 7,
                                    name: 'Transformer 2',
                                    icon : 'mdi-cube-outline'
                                },
                            ],
                        }
                    ],
                }
            ],
        }
      },
    }
  </script>