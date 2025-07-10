<template>
  <div>
    <loading-overlay :visible="page_load" />
    <v-row dense>
      <v-col cols="12" sm="6" md="2" class="pr-0 pb-0">
        <v-card class="column-header" dense block dark color="red darken-4">
          <v-btn icon small @click="goBack()" class="mr-2">
            <v-icon medium>mdi-arrow-left</v-icon>
          </v-btn>
          Assets Hierarchy</v-card>


        <v-divider></v-divider>
      
        <v-treeview class="pointer" v-if="items.length > 0" open-all :active.sync="active" v-model="tree" :items="items"
          activatable hoverable item-key="id" @update:active="getDetails" dense disabled>
          <template v-slot:prepend="{ item }">
            <v-icon class="pointer"> mdi-cube </v-icon>
          </template>
          <template v-slot:label="{ item }">
            <v-tooltip right open-delay="500">
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">{{ item.name }}</span>
              </template>
              <span>{{ item.name }}</span>
            </v-tooltip>
          </template>
        </v-treeview>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col cols="12" sm="6" md="10" class="pl-1 pb-0">
        <!-- <v-progress-linear v-if="loading || loadingattributevalues" indeterminate color="#60ab91"></v-progress-linear> -->
        <div style="position: relative; min-height: 100vh; z-index: 0;">
          <div
            v-if="loading || loadingattributevalues"
            style="
              position: absolute;
              top: 0; left: 0; right: 0; bottom: 0;
              background-color: rgba(33, 33, 33, 0.2);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 10;
            "
          >
            <v-progress-circular
              indeterminate
              :size="70"
              :width="7"
              color="green"
            />
          </div>

          <!-- tabs -->
          <v-tabs color="#60ab91" v-model="tab" :value="tab" left>
            <v-tabs-slider color=""></v-tabs-slider>

            <v-tab key="general" v-if="items.length > 0 && elements !== 2 && active.length > 0"> {{ elements == "1" ?
              "Substation Details" : "Site Details" }}</v-tab>
            <v-tab key="Status" v-if="elements == 1 && active.length > 0"> Transformer Status </v-tab>
            <v-tab key="attributes" v-if="elements == 2 && active.length > 0"> Transformer Details </v-tab>
            <!-- <v-tab key="adh" v-if="transformer_details.length > 0">ADH Configurations</v-tab> -->
            <v-tab key="data" v-if="transformer_details.length > 0 && active.length > 0">Manual Data Entry </v-tab>
            <v-tab key="analysis" v-if="attribute_values.length > 0 && active.length > 0">DGA Analysis </v-tab>
            <v-tab key="h2scan" v-if="attribute_values.length > 0 && active.length > 0">H2 Scan</v-tab>
          </v-tabs>



          <v-divider></v-divider>

          <v-tabs-items style="background: transparent" v-model="tab">

            <!-- View Assigned Users dialog -->
            <v-dialog v-model="view_user_dialog" persistent max-width="70%">
              <v-card>
                <v-card-actions>
                  <v-card-title>View Assigned Users for {{ element.name }}</v-card-title>
                  <v-spacer></v-spacer>
                  <v-btn @click="view_user_dialog = false" text><v-icon>mdi-close</v-icon></v-btn>
                </v-card-actions>

                <v-card-text>
                  <v-data-table :headers="user_headers" :items="usersByElement" :search="search" item-key="name"
                    class="elevation-1">
                    <template v-slot:item="{ item }">
                      <tr>
                        <td>
                          <v-avatar size="30" color="red">
                            <span style="color: white;">{{ getInitials(item.name) }}</span>
                          </v-avatar>
                        </td>
                        <td class="font-sm">{{ item.name }}</td>
                        <td class="font-sm">{{ item.email }}</td>
                        <td class="font-sm">{{ item.account_type }}</td>
                        <td class="font-sm">{{ item.created_at }}</td>
                        <td class="font-sm">{{ item.role.name }}</td>
                        <!--td class="font-sm">
                          <v-btn :disabled="item.user_role == 'Manager'" @click="" icon depressed>
                            <v-icon small> mdi-eye </v-icon>
                          </v-btn>
                        </td-->
                      </tr>
                    </template>
                  </v-data-table>


                </v-card-text>
              </v-card>
            </v-dialog>

            <!-- details tab content -->
            <v-tab-item v-if="items.length > 0 && elements !== 2 && active.length > 0" key="general"> 
              <v-container>
                <div class="pt-3">
                  <v-card>
                    <v-toolbar dense dark color="red darken-3">
                      <v-toolbar-title class="font text-uppercase font-weight-medium">
                        {{ elements == "1" ? "Substation Element" : "Site Element" }}
                      </v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-btn v-if="checkDetailPermission" small color="info" @click="openViewUsers">
                        <v-icon>mdi-account</v-icon>
                        View assigned users
                      </v-btn>

                    </v-toolbar>
                    <v-form>
                      <v-container>
                        <div class="my-2">
                          <v-text-field label="Name" :disabled="loading" outlined dense hide-details
                            v-model="element.name" color="red" readonly></v-text-field>
                        </div>
                        <div class="my-2">
                          <v-textarea label="Description" :disabled="loading" outlined dense hide-details
                            v-model="element.description" color="red" rows="2" readonly></v-textarea>
                        </div>
                        <div class="my-2">
                          <v-text-field label="Path" :disabled="loading" outlined dense hide-details
                            v-model="element.path" color="red" readonly></v-text-field>
                        </div>
                      </v-container>
                    </v-form>
                  </v-card>
                </div>
              </v-container>
              <v-divider></v-divider>
            </v-tab-item>
          
            <!-- Select transformer >> Click Attributes tab -->
            <v-tab-item v-if="elements == 2 && active.length > 0" key="attributes">
              <v-container>
                <div class="pt-3">
                  <v-card>
                    <v-toolbar dense dark color="red darken-3">
                      <v-toolbar-title class="font text-uppercase font-weight-medium"> Transformer Element
                      </v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-btn small
                        color="info" @click="openViewUsers">
                        <v-icon>mdi-account</v-icon>
                        View assigned users
                      </v-btn>
                    </v-toolbar>
                    <v-form>
                      <v-container>
                        <div class="my-2">
                          <v-text-field label="Name" outlined dense hide-details v-model="element.name" color="red"
                            readonly></v-text-field>
                        </div>
                        <div class="my-2">
                          <v-textarea label="Description" outlined dense hide-details v-model="element.description"
                            color="red" rows="2" readonly></v-textarea>
                        </div>
                        <div class="my-2">
                          <v-text-field label="Path" outlined dense hide-details v-model="element.path" color="red"
                            readonly></v-text-field>
                        </div>
                      </v-container>
                    </v-form>
                  </v-card>
                </div>
              </v-container>
              <v-divider></v-divider>
      
              <v-container class="mb-5 mt-1" style="position: relative; bottom: 15px"
                v-if="transformer_details.length > 0">
                <v-card>
                  <v-toolbar dense dark color="red darken-3">
                    <v-toolbar-title class="font text-uppercase font-weight-medium"> Transformer Details
                    </v-toolbar-title>
                  </v-toolbar>
                  <v-form class="pt-2">
                    <v-container>
                      <v-row>
                        <v-col cols="12" md="4">
                          <v-text-field color="red" readonly v-model="transformer_details[0].manufacturer"
                            label="Manufacturer" outlined dense hide-details></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field color="red" readonly v-model="transformer_details[0].Insulation_type"
                            label="Insulation Type" outlined dense hide-details></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field color="red" readonly v-model="transformer_details[0].oil_type" label="Oil Type"
                            outlined dense hide-details></v-text-field>
                        </v-col>

                      </v-row>
                      <v-row>
                        <v-col cols="12" md="4">
                          <v-text-field color="red" v-model="transformer_details[0].startup_date"
                            label="Commisioning Date" readonly hide-details outlined dense></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field color="red" readonly v-model="transformer_details[0].construction_year"
                            label="Construction Year" outlined dense hide-details></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field color="red" readonly v-model="transformer_details[0].age_band"
                            label="Age | Age Band" outlined dense hide-details></v-text-field>
                        </v-col>

                      </v-row>
                      <v-row>
                        <v-col cols="12" md="4">
                          <v-text-field color="red" readonly v-model="transformer_details[0].line_capacity"
                            label="Line Capacity" outlined dense hide-details></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field color="red" readonly v-model="transformer_details[0].winding_voltage"
                            label="Winding Voltage" outlined dense hide-details></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field color="red" readonly v-model="transformer_details[0].volt_capacity"
                            label="Voltage Capacity" outlined dense hide-details></v-text-field>
                        </v-col>

                      </v-row>
                      <v-row>
                        <v-col cols="12" sm="6">
                          <v-textarea color="red" readonly v-model="transformer_details[0].address" label="Address"
                            value="" rows="1" outlined dense hide-details> </v-textarea>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field color="red" readonly v-model="transformer_details[0].country_manufacturer"
                            label="Country Manufacturer" outlined dense hide-details></v-text-field>
                        </v-col>

                      </v-row>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field color="red" readonly v-model="transformer_details[0].serial_no" label="Serial No."
                            outlined dense hide-details></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field color="red" readonly v-model="transformer_details[0].model_no" label="Model No."
                            outlined dense hide-details></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" sm="12">
                          <v-textarea color="red" readonly v-model="transformer_details[0].asset_desc" name="input-7-1"
                            label="Asset Description" value="" rows="3" outlined dense hide-details>
                          </v-textarea>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-form>
                </v-card>
              </v-container>
              
            </v-tab-item>
            <v-tab-item v-if="transformer_details.length > 0 && active.length > 0" key="data">
              <v-container>
              

                
              </v-container>
            </v-tab-item>
            <!-- Select transformer >> Click Quick Analysis tab -->
            <v-tab-item v-if="attribute_values.length > 0 && active.length > 0" key="analysis">
              <div class="pa-2">

                <v-row dense>
                  <v-col class="mt-1" cols="12" md="3">
                    <v-text-field color="red" readonly v-model="transformer_details[0].oil_type" :disabled="loading || loadingattributevalues || getDetailsLoading" label="Transformer Oil Type"
                    outlined dense hide-details></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="7">
                    <DateRangePickers storageID="dgaAnalysisPicker" @filter="filter"
                      :loadingattributevalues="loadingattributevalues" :getDetailsLoading="getDetailsLoading" />
                  </v-col>
                  <v-col class="mt-0" cols="12" sm="2">
                    <v-row dense>
                      <v-col  cols="12" sm="7">
                      </v-col>
                      <v-col class="mr-1" cols="12" sm="5">
                        <v-menu offset-y>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn v-bind="attrs" v-on="on" :disabled="loading || loadingattributevalues || getDetailsLoading || generateCSVloading">
                              <span v-if="!generateCSVloading">Export</span>
                              <span v-if="generateCSVloading">Exporting...</span>
                              <v-icon v-if="!generateCSVloading" class="">mdi-folder-arrow-down-outline</v-icon>
                            </v-btn>
                          </template>
                          <v-list>
                            <v-list-item @click="generateCSV()">
                              <v-list-item-title>CSV</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="generatePDF()">
                              <v-list-item-title>PDF</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col>
                    <ExpertAdvice :historical_data="data" />
                  </v-col>
                </v-row>
              </div>
            </v-tab-item>
            <!-- Select transformer >> Click H2 Scan tab  -->
            <v-tab-item v-if="attribute_values.length > 0 && active.length > 0" key="h2scan">
              <H2ScanPage :elementID="element.id" />
            </v-tab-item>
          </v-tabs-items>
          <v-snackbar v-model="success_dialog" light>
          <v-icon color="green">mdi-check</v-icon>
            {{ successMessage }}
          </v-snackbar>
        </div>
      </v-col>
    </v-row>
    <v-dialog v-model="gassesData_dialog" persistent max-width="800">
      <v-card>
        <v-card-actions>
          <v-card-title>Gasses Data</v-card-title>
          <v-spacer></v-spacer>
          <v-btn @click="gassesData_dialog = false" text><v-icon>mdi-close</v-icon></v-btn>
        </v-card-actions>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-card outlined class="pa-6">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field color="red" v-model="attribute_value.date" label="Date" append-icon="mdi-calendar"
                      readonly hide-details outlined dense @click="datepicker = true"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field color="red" label="Time" v-model="attribute_value.time" @click="timepicker = true"
                      append-icon="mdi-clock-edit-outline" readonly hide-details dense outlined>
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field color="red" label="Acetylene (C₂H₂) (ppm)" dense outlined hide-details
                      v-model="attribute_value.acetylene" type="number"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field color="red" label="Ethylene (C₂H₄) (ppm)" dense outlined hide-details
                      v-model="attribute_value.ethylene" type="number"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field color="red" label="Methane (CH₄) (ppm)" dense outlined hide-details
                      v-model="attribute_value.methane" type="number"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field color="red" label="Ethane (C₂H₆) (ppm)" dense outlined hide-details
                      v-model="attribute_value.ethane" type="number"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field color="red" label="Hydrogen (H₂) (ppm)" dense outlined hide-details
                      v-model="attribute_value.hydrogen" type="number"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field color="red" label="Oxygen (O₂) (ppm)" dense outlined hide-details
                      v-model="attribute_value.oxygen" type="number"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field color="red" label="Carbon Monoxide (CO) (ppm)" dense outlined hide-details
                      v-model="attribute_value.carbon_monoxide" type="number"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field color="red" label="Carbon Dioxide (CO₂) (ppm)" dense outlined hide-details
                      v-model="attribute_value.carbon_dioxide" type="number"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="12">
                    <v-text-field color="red" label="2 FAL" dense outlined hide-details
                      v-model="attribute_value.two_fal" type="number"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="12">
                    <v-btn block color="#60ab91" class="white--text" :disabled="save_loading" @click="writeData()">{{
                      save_loading ? "Saving..." : "Save Data" }}</v-btn>
                    <!-- <v-btn block class="red darken-4 white--text" :disabled="loading" @click="pay()"> Pay for Usage billing </v-btn> -->
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="element_dialog" max-width="340" persistent>
      <v-card>
        <v-toolbar v-if="elements == 0" class="red darken-3" dense dark> Substation Details </v-toolbar>
        <v-toolbar v-if="elements == 1" class="red darken-3" dense dark> Transformer Details </v-toolbar>
        <v-divider></v-divider>
        <v-progress-linear v-if="save_loading" indeterminate color="#60ab91"></v-progress-linear>
        <v-card-text>
          <div class="my-2">
            <v-text-field color="red" label="Name" hide-details v-model="new_element.name"></v-text-field>
          </div>
          <div class="my-2">
            <v-textarea color="red" no-resize label="Description" hide-details rows="3"
              v-model="new_element.description"></v-textarea>
          </div>
          <div class="my-2">
            <v-checkbox v-if="elements == 1" disabled color="red" label="Create DGA Attribute Templates"
              v-model="new_element.template_created"></v-checkbox>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn :disabled="save_loading" dark small color="red" text @click="element_dialog = false">
            <v-icon>mdi-arrow-left</v-icon> Cancel </v-btn>
          <v-spacer></v-spacer>
          <v-btn :disabled="save_loading" small color="#60ab91" dark text @click="saveElement()">
            <v-icon>mdi-content-save</v-icon> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent v-model="updateElementModal" max-width="450">
      <v-card>
        <v-card-actions>
          <v-card-title>Update Element</v-card-title>
          <v-spacer></v-spacer>
          <v-btn @click="updateElementModal = false" text><v-icon>mdi-close</v-icon></v-btn>
        </v-card-actions>

        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-card outlined class="pa-6">
                <div class="my-2">
                  <v-text-field label="Name" outlined dense hide-details v-model="element.name"
                    color="red"></v-text-field>
                </div>
                <div class="my-2">
                  <v-textarea label="Description" outlined dense hide-details v-model="element.description" color="red"
                    rows="2"></v-textarea>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :disabled="update_loading" @click="updateElement" text>{{ update_loading ? "Updating..." : "Update"
            }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="rootElement_dialog" max-width="340" persistent>
      <v-card>
        <v-toolbar class="red darken-3" dense dark> Site Details </v-toolbar>
        <v-divider></v-divider>
        <v-progress-linear v-if="save_loading" indeterminate color="#60ab91"></v-progress-linear>
        <v-card-text>
          <div class="my-2">
            <v-text-field color="red" label="Name" hide-details v-model="new_element.name"></v-text-field>
          </div>
          <div class="my-2">
            <v-textarea color="red" no-resize label="Description" hide-details rows="3"
              v-model="new_element.description"></v-textarea>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn dark :disabled="save_loading" small color="red" text @click="rootElement_dialog = false">
            <v-icon>mdi-arrow-left</v-icon> Cancel </v-btn>
          <v-spacer></v-spacer>
          <v-btn small color="#60ab91" dark :disabled="save_loading" text @click="saveSiteElement()">
            <v-icon>mdi-content-save</v-icon> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="transformer_dialog" persistent max-width="970">
      <v-card>
        <v-card-actions>
          <v-card-title>Tranformer Details</v-card-title>
          <v-spacer></v-spacer>
          <v-btn @click="transformer_dialog = false" text><v-icon>mdi-close</v-icon></v-btn>
        </v-card-actions>

        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-card outlined class="pa-6">
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field color="red" v-model="transformer.manufacturer" label="Manufacturer" outlined dense
                      hide-details></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field color="red" v-model="transformer.insulation_type" label="Insulation Type" outlined
                      dense hide-details></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <!-- <v-text-field color="red" v-model="transformer.type" label="Oil Type" outlined dense hide-details></v-text-field> -->
                    <v-select clearable color="red" v-model="transformer.oil_type" dense hide-details outlined
                      label="Select Oil Type"
                      :items="['Mineral Oil', 'LTC', 'BioTemp', 'FR3', 'Midel', 'LTF FR3']"></v-select>
                  </v-col>

                </v-row>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field color="red" v-model="date" label="Commisioning Date" append-icon="mdi-calendar"
                      hide-details readonly outlined dense @click="startdatepicker = true"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-select v-model="selectedConstructionYear" :items="yearsList" item-value="text" item-text="text"
                      outlined dense hide-details color="red" label="Construction Year"
                      @input="onConstructionYearSelected">
                    </v-select>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field color="red" readonly v-model="computedAge" label="Age | Age Band" outlined dense
                      hide-details></v-text-field>
                  </v-col>

                </v-row>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field color="red" v-model="transformer.line_capacity" label="Line Capacity" outlined dense
                      hide-details></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field color="red" v-model="transformer.winding_voltage" label="Winding Voltage" outlined
                      dense hide-details></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field color="red" v-model="transformer.volt_capacity" label="Voltage Capacity" outlined
                      dense hide-details></v-text-field>
                  </v-col>

                </v-row>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-textarea color="red" v-model="transformer.address" label="Address" value="" rows="1" outlined
                      dense hide-details> </v-textarea>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select dense color="red darken-2" v-model="selectedCountry" :items="countryOptions"
                      item-value="name" item-text="name" label="Country Manufacturer" outlined clearable
                      @input="onCountrySelected" hide-details>
                      <template v-slot:selection="{ item }"> {{ item.name }} ({{ item.code }}) </template>
                    </v-select>
                  </v-col>

                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field color="red" v-model="transformer.serial_no" label="Serial No." outlined dense
                      hide-details></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field color="red" v-model="transformer.model_no" label="Model No." outlined dense
                      hide-details></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="12">
                    <v-textarea color="red" v-model="transformer.asset_desc" name="input-7-1" label="Asset Description"
                      value="" rows="3" outlined dense hide-details> </v-textarea>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col v-if="transformer_dialog_mode === 'add'" cols="12" md="12">
                    <v-btn block color="#60ab91" class="white--text" :disabled="save_loading" @click="saveDetails()"> {{
                      save_loading ? "Saving..." : "Save Details" }} </v-btn>
                  </v-col>
                  <v-col v-if="transformer_dialog_mode === 'upd'" cols="12" md="12">
                    <v-btn block color="#60ab91" class="white--text" :disabled="save_loading"
                      @click="updateTransformerDetails()">
                      {{ save_loading ? "Updating..." : "Update Details" }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- <v-dialog v-model="validation_dialog" max-width="450" min-width="400">
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
            <v-btn dark small color="red" text @click="validation_dialog = false">OK</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog> -->

    <v-dialog v-model="validation_dialog_adh" max-width="450" min-width="400">
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
            <v-btn dark small color="red" text @click="validation_dialog_adh = false">Cancel </v-btn>
            <v-spacer></v-spacer>
            <v-btn dark small color="#60ab91" text @click="goToADG()">Generate</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <!-- <v-dialog v-model="success_dialog" max-width="450" min-width="400">
      <template>
        <v-card>
          <div>
            <span>
              <v-icon color="green" class="icon ml-3 mt-3">mdi-check-circle-outline</v-icon>
              <span class="demo-check">
                {{ dialogMessage }}
              </span>
            </span>
          </div>
          <v-card-actions class="justify-end">
            <v-btn dark small color="red" text @click="success_dialog = false">OK</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog> -->

    <v-dialog v-model="confirm_dialog" max-width="300">
      <v-card>
        <v-card-title> </v-card-title>
        <v-card-text>
          Are you sure you want to delete {{ element.path }}?
          <br />
          <div>Note : This action cannot be undone.</div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text @click="confirm_dialog = false"> No </v-btn>

          <v-btn color="red" text @click="removeChildProcess()"> Yes </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <log-details :details="attribute_value_details" :show="showLogPopup" @close="hideLogPopup"></log-details>
    <date-picker :dialog="datepicker" :date="attribute_value.date" @setDate="getDate"
      @close="closeDatePicker"></date-picker>
    <date-picker :dialog="startdatepicker" :date="transformer.startup_date" @setDate="startDate"
      @close="closeDatePicker"></date-picker>
    <time-picker :dialog="timepicker" @setTime="setTime" :time="attribute_value.time" @close="closeTimePicker"
      :current_time="time"></time-picker>
    <!-- <ADHConfig :stream_id="stream_id"></ADHConfig> -->
    <v-snackbar v-model="success_dialog" light>
      <v-icon color="green">mdi-check</v-icon>
      {{ successMessage }}
    </v-snackbar>
  </div>
        
</template>
<style scoped>
.demo-check {
  font-size: 13px;
  white-space: pre;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 1em;
  margin-right: 1em;
}

.icon {
  font-size: 25px;
}

.full-height {
  height: calc(100vh - 53px);
}

.column-header {
  padding: 10px;
  text-align: center;
  border-radius: 0;
}

.border {
  border: 1px solid gray;
}

.scrollbar {
  /* height: 250px; */
  overflow-y: scroll;
  /* Add the ability to scroll */
}

/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar {
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

.tabscrollbar {
  background-color: transparent;
  height: 800px;
  overflow-y: scroll;
  /* Add the ability to scroll */
}

.transparent {
  background-color: transparent;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.tabscrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.tabscrollbar {
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

.pointer {
  cursor: pointer;
}

.shrink-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
}
</style>
<script>
import Chart from "@/components/Chart.vue";
import GassesData from "@/components/tables/GassesData.vue";
import LogDetails from "@/components/popups/LogDetails.vue";
import DatePicker from "@/components/pickers/DatePicker.vue";
import countryDataList from "country-list";
import TimePicker from "@/components/pickers/TimePicker.vue";
import axios from "axios";
import { assetMixin } from "@/mixins/AssetsLimitations.js";
import { transformerMixin } from "@/mixins/TransformerMixin.js";
import DuvalsArea from "@/components/home/DuvalsArea.vue";
import SummaryInterpretations from "@/components/home/SummaryInterpretations.vue";
import OtherInterpretations from "@/components/home/OtherInterpretations.vue";
import MultiLineGraph from "@/components/charts/CJSLineGraph.vue";
import PieChartAKAGuage from "@/components/charts/CJSGauge.vue";
import { symbolMixin } from "@/mixins/symbolMixin.js";
import DateRangePickers from "@/components/home/DateRangePickers.vue";
import Papa from "papaparse";
import H2ScanPage from "@/components/H2Scan/H2ScanPage.vue";
import { refreshGoogleToken } from '@/utils/authUtils';
import { msalInstance } from "vue-msal-browser"
import { jwtDecode } from 'jwt-decode'; // Ensure jwt-decode is installed
import ExpertAdvice from "@/components/home/ExpertAdvice.vue";
import { initializeUsers, startTokenRefreshChecker } from "@/utils/authUtils";
import LoadingOverlay from "@/components/LoadingOverlay.vue";

export default {
  beforeRouteEnter(to, from, next) {
    document.title = `C8 Vortex - ${to.meta.title || ""}`;
    next();
  },
  beforeRouteUpdate(to, from, next) {
    document.title = `C8 Vortex - ${to.meta.title || ""}`;
    next();
  },
  name: "Assets",
  components: {
    Chart,
    DatePicker,
    GassesData,
    ExpertAdvice,
    LogDetails,
    TimePicker,
    DuvalsArea,
    SummaryInterpretations,
    OtherInterpretations,
    MultiLineGraph,
    PieChartAKAGuage,
    DateRangePickers,
    H2ScanPage,
    LoadingOverlay,
  },
  mixins: [assetMixin, transformerMixin, symbolMixin],
  data() {
    return {
      successMessage: "",
      branch_name: "",

      user_full_role: "",
      user_role: "",
      user_level: "",
      page_load: true,

      search: "",
      view_user_dialog: false,
      user_headers: [
        {
          text: "Image",
          align: "Name",
          sortable: false,
        },
        {
          text: "Name",
          align: "start",
          sortable: true,
        },
        {
          text: "Email",
          align: "start",
          sortable: true,
        },
        {
          text: "Account Type",
          align: "start",
          sortable: true,
        },
        {
          text: "Created At",
          align: "start",
          sortable: true,
        },
        {
          text: "User Role",
          align: "start",
          sortable: true,
        },
        // {
        //   text:"Actions",
        //   align:"start",
        //   sortable: false,
        // },
      ],

      usersByElement: [],
      loading: false,
      loadingattributevalues: false,
      save_loading: false,
      validation_dialog: false,
      validation_dialog_adh: false,
      success_dialog: false,
      dialogMessage: "",
      dialogTitle: "",
      initiallyOpen: [],
      tree: [],
      treeViewisReady: false,
      active: [],
      tab: "general",
      element_dialog: false,
      element: {},
      yearsList: [],
      new_element: {},
      items: [],
      attributes: [],
      showAssetDetails: true,
      confirm_dialog: false,
      attribute_value: {},
      transformer_details: [],
      attribute_values: [],
      transformer: {},
      elements: [],
      attribute_value_details: {},
      startdatepicker: false,
      datepicker: false,
      timepicker: false,
      showLogPopup: false,
      transformers: [],
      transformer_dialog: false,
      transformer_dialog_mode: "add",
      rootElement_dialog: false,
      date: null,
      time: null,
      checkBox: true,
      getDetailsLoading: false,
      generateCSVloading: false,
      // asset: null,
      // assets: [],
      countryOptions: countryDataList.getData(),
      selectedCountry: null,
      selectedConstructionYear: null,
      flipper: false,
      analysisTab: "duvalsInt",
      data: [],
      current: [],
      svgs: [],
      symbol: {},
      datetime1: null,
      datetime2: null,
      goTo: false,
      account_level: "",
      updateElementModal: false,
      gassesData_dialog: false,
      update_loading: false,
      adh_config: [],
      // adh_loading: false,
      // ADH_dialog: false,
      stream_id: "",
      page_load: true,
      branchId: null,
    };
  },
  mounted() {
    this.branchId = this.$route.query.branch_id;
    this.initializeAssets();
  },

  beforeDestroy() {
    clearInterval(this.tokenRefreshInterval); // Clear interval when component is destroyed
  },


  computed: {
    /*
    //buildParentLookup is completely inneficient, will change this once we're doing backend or when the database is updated
    usersList() {
      const parentLookup = this.buildParentLookup(this.items);
      console.log("Parent Lookup: ", parentLookup);
      return this.getUsers(this.element, this.test_users, parentLookup); 
    },
    */

    computedAge() {
      this.startUp = this.date ? new Date(this.date) : new Date();
      this.currentDate = new Date();

      // Calculate the year difference
      this.age = this.currentDate.getFullYear() - this.startUp.getFullYear();

      // Calculate the months difference
      this.months = this.currentDate.getMonth() - this.startUp.getMonth();

      const commissioningDay = this.startUp.getDate();
      const currentDay = this.currentDate.getDate();

      // Adjust the age if the current date is before the commissioning date in the current year
      if (this.months < 0 || (this.months === 0 && currentDay < commissioningDay)) {
        this.age--;
        this.months = (12 + this.months) % 12;
      }

      // If the commissioning year is less than 1 year ago, calculate the total days difference
      if (this.age === 0) {
        const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in a day
        const daysDifference = Math.round(Math.abs((this.currentDate - this.startUp) / oneDay));
        return `${this.age} year(s) | Age Band: 0-17 | ${daysDifference} day(s)`;
      }

      // Determine age band
      this.ageBand = "";
      if (this.age >= 0 && this.age < 18) {
        this.ageBand = "0-17";
      } else if (this.age >= 18 && this.age < 25) {
        this.ageBand = "18-24";
      } else if (this.age >= 25 && this.age < 35) {
        this.ageBand = "25-34";
      } else if (this.age >= 35 && this.age < 50) {
        this.ageBand = "35-49";
      } else {
        this.ageBand = "50+";
      }

      return `${this.age} year(s) | Age Band: ${this.ageBand}`;



    },
    reversedYearsList() {
      // this.yearsList = Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, i) => 1900 + i)
      //   .slice()
      //   .reverse();

      let years = Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, i) => 1900 + i)
        .slice()
        .reverse();

      this.yearsList = years.map((q) => {
        return { text: q, value: q };
      });
      // return this.yearsList;
    },

  },
  created() {
  },
  watch: {

    computedAge() {
      this.transformer.age_band = this.computedAge;
    },
    element() {
      this.getAttributeValues(this.element.id);
      this.loadingattributevalues = false;
    },
  },

  methods: {
    goBack() {
      this.$router.back();
    },

    getInitials(name) {
      if (!name || typeof name !== "string") {
        return "N/A"; // Handle cases where name is undefined/null
      }

      return name
        .split(" ") // Split by space
        .map(word => word[0]) // Get first letter of each word
        .join("") // Join letters together
        .toUpperCase(); // Convert to uppercase
    },

    getUsersByElement(element) {
      //reset users
      this.usersByElement = [];

      axios({
        url: process.env.VUE_APP_BASEURL + "/users/" + element + "/by-elements",
        method: "GET",
        headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token },
      }).then((res) => {
        // console.log("Users from element ", element, ": ", res);

        this.usersByElement = this.modifyUserData(res.data);

      }).catch((err) => {
        this.loading = false;
      });
    },

    modifyUserData(users) {
      return users.map((u) => {
        const firstName = u.name.split(" ")[0];
        const lastName = u.name.split(" ")[1];

        u.created_at = new Date(u.created_at).toLocaleDateString();
        u.firstName = firstName;
        u.lastName = lastName;

        if (u.role) {
          u.role_name = u.role.name;
        }
        else {
          u.role_name = "No Role";
        }

        return u;
      });
    },

    buildParentLookup(elements, parent = null, lookup = {}) {
      elements.forEach(element => {
        if (parent) {
          lookup[element.id] = parent; // Store parent reference
        }
        if (element.children) {
          this.buildParentLookup(element.children, element, lookup);
        }
      });
      return lookup;
    },
    openViewUsers() {
      // console.log(this.element);
      this.getUsersByElement(this.element.id);
      this.view_user_dialog = true;
    },

    getUsers() {
      axios({
        url: process.env.VUE_APP_BASEURL + '/users',
        method: "GET",
        headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token },
      }).then((res) => {
        this.users = res.data.users.map((u) => {
          const firstName = u.name.split(" ")[0];
          const lastName = u.name.split(" ")[1];
        });
      });
    },

    async initializeAssets() {
      if (!this.branchId) {
        this.dialogMessage = "Missing branch ID";
        this.validation_dialog = true;
        return;
      }

      try {
        const token = JSON.parse(localStorage.getItem("user"))?.token;

        const branch = await axios({
          url: `${process.env.VUE_APP_BASEURL}/branch/${this.branchId}`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const response = await axios({
          url: `${process.env.VUE_APP_BASEURL}/hierarchy/qwe`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          params: { branch_id: this.branchId },
        });

        this.branch_name = branch.data.branch_name;
        this.$store.commit("setTitle", this.branch_name);

        this.items = response.data;
        this.treeViewisReady = true;

        // Parse role
        const roleName = JSON.parse(localStorage.getItem("user")).user.role?.name || "";
        const splitRole = roleName.split(" ");
        this.user_level = splitRole[0];
        this.user_role = splitRole[1];
        this.page_load = false;

      } catch (err) {
        console.error(err);
        this.validation_dialog = true;
        this.dialogMessage = "Failed to load asset data.";
      }
    },

    async handleMicrosoftToken(storage, tokenExp) {
      if (this.isTokenValid(tokenExp.tokenExpiry)) {
        await this.makeAuthenticatedRequest(storage.token);
      } else {
        await this.refreshTokenAndMakeRequest('microsoft');
      }
    },

    async handleGoogleToken(storage, tokenExp) {
      if (this.isTokenValid(tokenExp.tokenExpiry)) {
        await this.makeAuthenticatedRequest(storage.token);
      } else {
        await this.refreshTokenAndMakeRequest('google');
      }
    },

    isTokenValid(expiry) {
      return new Date(expiry) > new Date();
    },

    async makeAuthenticatedRequest(token) {
      if(token != null){
        //API calls
        await this.getBranch();
        await this.getHierarchy(token);
        
        //Getting user roles
        this.user_full_role = JSON.parse(localStorage.getItem("user")).user.role.name;
        const split_role = this.user_full_role.split(" ")
        this.user_level = split_role[0];
        this.user_role = split_role[1];
        this.page_load = false;
      } else {
        // this.showUnauthorizedDialog();
      }
    },

    async getBranch() {
      try {
        const branch = await axios({
          url: process.env.VUE_APP_BASEURL + "/branch/" + this.branchId,
          method: "GET",
          headers: {
            Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
          },
        });

        this.branch_name = branch.data.branch_name;     
        this.$store.commit("setTitle", this.branch_name);

      } catch (err) {
        console.log(err);
      }
    },

    async getHierarchy(token) {
      try {
        const response = await axios({
          url: process.env.VUE_APP_BASEURL + "/hierarchy/qwe",
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            branch_id: this.branchId,
          },
        });

        this.items = response.data;
        this.treeViewisReady = true;
        this.page_load = false;

      } catch (err) {
        console.log(err);
      }
    },

    async refreshTokenAndMakeRequest(accountType, userId) {
      try {
        if (accountType === 'google') {
          await this.refreshGoogleToken();
        } else if (accountType === 'microsoft') {
          await this.refreshMicrosoftToken();
        }
        const storage = JSON.parse(localStorage.getItem("user"));
        if (storage && storage.token) {
          await this.makeAuthenticatedRequest(storage.token, userId);
        } else {
          // this.showUnauthorizedDialog();
        }
      } catch (error) {
        console.error('Error refreshing tokens:', error);
        // this.showUnauthorizedDialog();
      }
    },

    async refreshGoogleToken() {
      const google_refresh_token = JSON.parse(localStorage.getItem("google_refresh_token"));
      const { id_token } = await refreshGoogleToken(google_refresh_token);
      let user = JSON.parse(localStorage.getItem("user"));
      user.token = id_token;
      localStorage.setItem("user", JSON.stringify(user));

      const decodedToken = jwtDecode(id_token);
      const tokenExpiry = new Date(decodedToken.exp * 1000).toISOString();
      localStorage.setItem("token_expiry", JSON.stringify({ tokenExpiry }));
    },

    async refreshMicrosoftToken() {
      try {
        const account = msalInstance.getAllAccounts()[0];
        const response = await msalInstance.acquireTokenSilent({
          scopes: ["user.read", "offline_access"],
          account: account
        });
        const tokenExpiry = response.expiresOn.toISOString();
        let user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          user.token = response.accessToken;
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("token_expiry", JSON.stringify({ tokenExpiry }));
        }
      } catch (error) {
        console.error('Error acquiring tokens:', error);
        await msalInstance.loginRedirect({ scopes: ["user.read", "offline_access"] });
      }
    },

    showUnauthorizedDialog() {
      this.validation_dialog = true;
      this.dialogMessage = 'Unauthorized';
    },
    showSuccessDialog() {
      this.success_dialog = true;
      this.dialogMessage = 'ADH config generated successfully!';
    },

    startTokenRefreshChecker() {
      this.tokenRefreshInterval = setInterval(() => {
        const storage = JSON.parse(localStorage.getItem("user"));
        const tokenExp = JSON.parse(localStorage.getItem("token_expiry"));
        if (storage && storage.user && tokenExp) {
          if (!this.isTokenValid(tokenExp.tokenExpiry)) {
            this.refreshTokenAndMakeRequest(storage.user.account_type);
          }
        }
      }, this.refreshInterval);
    },
    showgassesdata_dialog() {
      if (this.adh_config.length == 0) {
        this.validation_dialog_adh = true;
        this.dialogMessage = "Please generate ADH configurations first."
        return;
      } else {
        this.gassesData_dialog = true;
      }

    },
    onCountrySelected() {
      this.transformer.country_manufacturer = this.selectedCountry;
    },
    onConstructionYearSelected() {
      this.transformer.construction_year = this.selectedConstructionYear;
    },
    getDetails(value) {
      // console.log(value)
      if (value.length == 0) {
        this.element = {};
        this.attributes = [];
        // this.transformer_details = {};
        return;
      }
      
      this.getDetailsLoading = true;
      this.loading = true;
      axios({
        url: process.env.VUE_APP_BASEURL + "/elements/" + value[0],
        method: "GET",
        headers: {
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
        },
      })
        .then((response) => {
          this.element = response.data.details;
          this.transformers = response.data.transformers;
          // console.log(this.transformers)
          // console.log(this.element);

          // Filter the transformers based on element_id
          this.transformers = this.transformers.filter(transformer => parseInt(transformer.parent_id, 10) === this.element.id);
          // console.log(this.transformers);
          this.elements = response.data.details.path.split("\\").length - 1;

          // console.log(this.elements);
          this.attributes = response.data.attributes;
          this.attribute_values = response.data.attribute_values;
          this.attribute_value_length = this.attribute_values.length;
          this.attribute_value = {};
          this.adh_config = response.data.adh_config;

          // console.log(this.adh_config)

          this.transformer_details = response.data.transformer_details;

          const elements = this.element.path.split('\\');
          // Iterate over the elements and extract the first two characters after each backslash
          const capitalizedElements = elements.map(element => {
            if (element.length > 2) {
              return element.substring(0, 3).toUpperCase(); // Capitalize the first two characters
            }
            return element.toUpperCase(); // If the element has less than two characters, capitalize all of them
          });

          // let store = JSON.parse(localStorage.getItem("user")).user.company.company_name;

          // const capitalizedPath = capitalizedElements.join('\\'); // Join the elements back with backslashes
          // this.stream_id = capitalizedPath.replace(/\\/g, '');
          // console.log(this.stream_id);

          // Retrieve the company name from localStorage
          let store = JSON.parse(localStorage.getItem("user"));
          let companyName = store.user.company.company_name.toUpperCase();

          // Join the elements back with backslashes
          const capitalizedPath = capitalizedElements.join('\\');

          // Concatenate the company name with the capitalizedPath
          const concatenatedPath = `${companyName}${capitalizedPath}`;

          // Replace the title with the path
          const titlePath = `${this.branch_name}\\${this.element.path}`;
          this.$store.commit("setTitle", titlePath);  

          // Replace backslashes and assign to stream_id
          this.stream_id = concatenatedPath.replace(/\\/g, '');

          // Output the result
          // console.log(this.stream_id);
          this.tab = 2;
          this.getDetailsLoading = false;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.getDetailsLoading = false;
          this.loading = false;
        });
      this.getAttributeValues(this.element.id);
      this.loadingattributevalues = false;
    },
    addRootElement() {
      // this.count = elements;
      // console.log(this.demoElemLimit(this.items));
      //   if (element_count == 3) {
      //     this.validation_dialog = true;
      //     this.dialogMessage = "Only 1 asset is allowed in demo version.";
      //   } else {
      //     this.new_element = {
      //       id: null,
      //       company_id: JSON.parse(window.localStorage.getItem("user"))
      //         .company_id,
      //     };
      //     this.rootElement_dialog = true;
      //   }

      this.new_element = {
        id: null,
        company_id: JSON.parse(window.localStorage.getItem("user")).company_id,
        branch_id: this.branchId,
        query_id: this.branchId,
      };
      this.rootElement_dialog = true;
    },
    addSubstation() {
      if (this.element.id == undefined) {
        this.validation_dialog = true;
        this.dialogMessage = "Please select site.";
        return;
      }
      this.new_element = {
        parent_id: this.element.id,
        company_id: JSON.parse(window.localStorage.getItem("user")).company_id,
        query_id: this.branchId,
      };
      this.element_dialog = true;
    },
    addTransformer() {
      if (this.element.id == undefined) {
        this.validation_dialog = true;
        this.dialogMessage = "Please select substation.";
        return;
      }
      this.new_element = {
        parent_id: this.element.id,
        template_created: true,
        company_id: JSON.parse(window.localStorage.getItem("user")).company_id,
        query_id: this.branchId,
      };
      this.element_dialog = true;
    },
    removeChild() {
      this.confirm_dialog = true;
    },
    removeChildProcess() {
      startTokenRefreshChecker();
      axios({
        url: process.env.VUE_APP_BASEURL + "/elements/" + this.element.id,
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
        },
      })
        .then((res) => {
          this.items = res.data;
          this.transformers = {};
          this.confirm_dialog = false;
        })
        .catch((err) => { });
    },
    toggleUpdateModal() {
      if (this.element.id == undefined) {
        this.validation_dialog = true;
        this.dialogMessage = "Please select element to update.";
        return;
      }
      this.updateElementModal = true;
    },
    updateElement() {
      startTokenRefreshChecker();
      this.update_loading = true;
      axios({
        url: process.env.VUE_APP_BASEURL + "/elements/" + this.element.id,
        method: "PUT",
        data: this.element,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
        },
      })
        .then((res) => {
          this.update_loading = false;
          this.updateElementModal = false;
          // this.dialogMessage = "Element details successfully updated!"
          // this.successMessage = "sub suc";
          if (this.elements === 1) {
            this.successMessage = "Substation Successfully Updated";
          } else if (this.elements === 2) {
            this.successMessage = "Transformer Successfully Updated";
          } else if (this.elements === 0) {
            this.successMessage = "Site Successfully Updated";
          }

          this.success_dialog = true;

        })
        .catch((res) => {
          this.update_loading = false;
          this.updateElementModal = false;
        });
    },

    saveElement() {
      if (!this.new_element.name) {
        this.validation_dialog = true;
        this.dialogMessage = "Element name field is required.";
        return;
      }

      if (this.elements == 1 && !this.new_element.template_created) {
        this.validation_dialog = true;
        this.dialogMessage = "Check Create DGA Attribute.";
        return;
      }

      this.save_loading = true;
      startTokenRefreshChecker();

      axios({
        url: process.env.VUE_APP_BASEURL + "/elements/" + (this.element.id ? this.element.id : 0),
        method: "POST",
        data: this.new_element,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
        },
      })
        .then((res) => {
          this.items = res.data;
          this.element_dialog = false;
          this.save_loading = false;

          this.success_dialog = true;
          this.successMessage = this.elements === 1 ? "Transformer added successfully." : "Substation added successfully.";
        })
        .catch((err) => {
          this.validation_dialog = true;
          this.dialogMessage = err.response?.data || "Something went wrong.";
          this.save_loading = false;
        });
    },

    saveSiteElement() {
      if (!this.new_element.name) {
        this.validation_dialog = true;
        this.dialogMessage = "Element name field is required.";
        return;
      }

      this.save_loading = true;
      startTokenRefreshChecker();

      axios({
        url: process.env.VUE_APP_BASEURL + "/elements/0",
        method: "POST",
        data: this.new_element,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
        },
      })
        .then((res) => {
          this.items = res.data;
          this.rootElement_dialog = false;
          this.save_loading = false;

          this.success_dialog = true;
          this.successMessage = "Site added successfully.";
        })
        .catch((err) => {
          this.validation_dialog = true;
          this.dialogMessage = err.response?.data || "Something went wrong.";
          this.save_loading = false;
        });
    },

    createAttributes(id) {
      this.loading = true;
      startTokenRefreshChecker();
      axios({
        url: process.env.VUE_APP_BASEURL + "/elements/" + id + "/attributes",
        method: "POST",
        data: { element_id: id },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
        },
      })
        .then((res) => {
          this.loading = false;
          this.attributes = res.data;
          // console.log(this.attributes);
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    getDate(date) {
      this.attribute_value.date = date;
      this.datepicker = false;
    },
    setTime(time) {
      this.attribute_value.time = time;
      this.timepicker = false;
    },
    startDate(date) {
      this.date = date;
      this.transformer.startup_date = this.date;
      this.startdatepicker = false;
    },
    closeTimePicker() {
      this.timepicker = false;
    },
    closeDatePicker() {
      this.datepicker = false;
      this.startdatepicker = false;
    },
    writeData() {
      if (this.demoDatapointLimit(this.attribute_values, this.attribute_value) === true) {
        this.save_loading = true;
        this.attribute_value.company_id = this.element.company_id;
        this.attribute_value.asset_id = this.stream_id;
        this.attribute_value.data_source = 'Manual Logged';
        startTokenRefreshChecker();
        axios({
          url: process.env.VUE_APP_BASEURL + "/elements/" + this.element.id + "/attribute-values",
          method: "POST",
          data: this.attribute_value,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
          },
        })
          .then((res) => {
            this.save_loading = false;
            this.gassesData_dialog = false;
            this.attribute_values = res.data.attribute_values;
            this.attribute_value = {};
            // console.log(this.attribute_values);
            // this.flipper = !this.flipper;
            this.getAttributeValues(this.element.id);
            this.loadingattributevalues = false;
            this.success_dialog = true;
            this.successMessage = "Gas data added successfully.";
          })
          .catch((err) => {
            // console.log(err.response);
            if (err.response.status == 400) {
              this.validation_dialog = true;
              this.dialogMessage = err.response.data.error;
              this.attribute_value = {};
            } else {
              alert("Something went wrong. Please Try again.");
            }
            this.gassesData_dialog = false;
            this.save_loading = false;
          });
      } else {
        this.validation_dialog = true;
        this.dialogMessage = this.demoDatapointLimit(this.attribute_values, this.attribute_value);
      }
    },
    saveDetails() {
      if (this.validateTransformerDetails(this.transformer) === true) {
        this.save_loading = true;
        this.transformer.company_id = this.element.company_id;
        this.transformer.stream_id = this.stream_id;
        startTokenRefreshChecker();
        axios({
          url: process.env.VUE_APP_BASEURL + "/elements/" + this.element.id + "/transformers",
          method: "POST",
          data: this.transformer,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
          },
        })
          .then((response) => {
            this.selectedCountry = null;
            this.date = null;
            this.transformer_dialog = false; // close dialog
            this.transformer_details = [response.data];
            this.transformer = {}; // clear input fields?
            this.save_loading = false; // stop loading
            this.success_dialog = true;
            this.successMessage = "Transformer added Successfully"
          })
          .catch((err) => {
            alert(err.response);
            this.save_loading = false; // stop loading
          });
      } else {
        this.validation_dialog = true;
        this.dialogMessage = this.validateTransformerDetails(this.transformer);
      }
    },
    editTransformerDetails(mode) {
      // put prev values to proper place for editing
      switch (mode) {
        case "add":
          // if(this.adh_config.length == 1){
          //   this.validation_dialog = true;
          //   this.dialogMessage = "Please create ADH Configurations first."
          //   return;
          // }
          // this.transformer = {};
          this.date = null;
          this.selectedCountry = null;
          this.selectedConstructionYear = null;
          break;
        case "upd":
          this.transformer = this.transformer_details[0];
          this.date = this.transformer_details[0].startup_date;
          this.selectedCountry = this.transformer_details[0].country_manufacturer;
          this.selectedConstructionYear = { text: parseInt(this.transformer_details[0].construction_year), value: parseInt(this.transformer_details[0].construction_year) };
          break;
        default:
          break;
      }

      // show edit dialog
      this.transformer_dialog_mode = mode;
      this.transformer_dialog = true;
    },
    updateTransformerDetails() {
      if (this.validateTransformerDetails(this.transformer) === true) {
        this.save_loading = true;
        startTokenRefreshChecker();
        axios({
          url: process.env.VUE_APP_BASEURL + "/elements/" + this.element.id + "/transformers",
          method: "PUT",
          data: this.transformer,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
          },
        })
          .then((response) => {
            this.selectedCountry = null;
            this.date = null;
            this.selectedConstructionYear = null;
            this.transformer_dialog = false; // close dialog
            this.transformer_details = [this.transformer];
            this.transformer = {}; // clear input fields?
            this.save_loading = false; // stop loading
            this.transformer_dialog_mode = "add"; // return to add mode
            this.success_dialog = true;
            this.dialogMessage = "Transformer updated successfully!"
          })
          .catch((err) => {
            alert(err.response);
          });
      } else {
        this.validation_dialog = true;
        this.dialogMessage = this.validateTransformerDetails(this.transformer);
      }
    },

    showLogDetails(item) {
      item.path = this.element.path; //Adding Element Path in the parameters
      // console.log(item.path);
      this.attribute_value_details = item;
      // console.log(this.attribute_value_details);
      this.showLogPopup = true;
    },
    hideLogPopup() {
      this.showLogPopup = false;
    },
    goToTransformer(t) {
      this.active = [t.id];

      if (!t.latest_value) {
        this.validation_dialog = true;
        this.dialogMessage = "No Data";
        return;
      }
      
      //this.tree = t.id;
      //this.tree = [t.id];=
      this.getDetails([t.id]);
    },

    getAttributeValues(elementID) {
      this.loadingattributevalues = true;
      if (elementID !== null && this.datetime1 !== null && this.datetime2 !== null) {
        startTokenRefreshChecker();
        axios({
          url: process.env.VUE_APP_BASEURL + "/elements/" + elementID + "/attribute-values",
          method: "GET",
          params: {
            start: this.datetime1,
            end: this.datetime2,
          },
          headers: {
            Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
          },
        })
          .then((res) => {
            // console.log(res.data)
            this.data = res.data.values.map((d) => {
              const parts = d.path.split("\\");
              const site = parts[0];
              const substation = parts[1];
              const transformer = parts[2];
              let obj = {
                StartTime: this.datetime1,
                EndTime: this.datetime2,
                timestamp: d.timestamp,
                site: site,
                substation: substation,
                transformer: transformer,
                oil_type: this.transformer_details[0].oil_type,
                c2h2: d.acetylene,
                c2h4: d.ethylene,
                ch4: d.methane,
                c2h6: d.ethane,
                c2h2_roc: d.acetylene_roc,
                c2h4_roc: d.ethylene_roc,
                ch4_roc: d.methane_roc,
                c2h6_roc: d.ethane_roc,
                h2_roc: d.hydrogen_roc,
                co: d.carbon_monoxide,
                co2: d.carbon_dioxide,
                h2: d.hydrogen,
                n2: d.nitrogen,
                t1: d.t1,
                t2: d.t2,
                t3: d.t3_biotemp,
                t4: d.t4,
                t5: d.t5,
                t6: d.t6,
                t7: d.t7,
                p1: d.p1,
                p2: d.p2,
                cigre_p1: d.cigre_p1,
                uni_penta: d.uni_penta,
                data_source: d.data_source,
                primary_fault: d.primary_fault,
                secondary_fault: d.scondary_fault,
                possible_insulation_status: d.possible_insulation_status,
                absolute_gas_limit: d.absolute_gas_limit,
                roc_gas_limit: d.roc_gas_limit,
                dangerous_zone_state: d.dangerous_zone_state,
                additional_tests: d.additional_tests,
                recommended_actions: d.recommended_actions,
                nei: d.nei,
                iec_ratio: d.iec_ratio,
                dornenberg_ratio: d.dornenberg,
                rogers_ratio: d.rogers_ratio,
                carbon_ratio: d.carbon_ratio,
                element_id: d.element_id,
              };
              return obj;
            });
            // console.log(this.current.acetylene_roc);
            this.current = res.data.current ? res.data.current : {};

            // this.current.interpretation = res.data.current[this.getSymbolById(this.symbol.id)];

            //Calculate current percentage of gases for pentagon
            var currentGasTotal = this.current.acetylene + this.current.ethylene + this.current.methane + this.current.ethane + this.current.hydrogen;

            var currentC2H2 = (this.current.acetylene / currentGasTotal) * 100;
            var currentC2H4 = (this.current.ethylene / currentGasTotal) * 100;
            var currentCH4 = (this.current.methane / currentGasTotal) * 100;
            var currentC2H6 = (this.current.ethane / currentGasTotal) * 100;
            var currentH2 = (this.current.hydrogen / currentGasTotal) * 100;
            this.current.c2h2_pc_pen = currentC2H2.toFixed(2);
            this.current.c2h4_pc_pen = currentC2H4.toFixed(2);
            this.current.ch4_pc_pen = currentCH4.toFixed(2);
            this.current.c2h6_pc_pen = currentC2H6.toFixed(2);
            this.current.h2_pc_pen = currentH2.toFixed(2);
            //Calculate current percentage of gases for triangle
            var currentGasTotal = this.current.acetylene + this.current.ethylene + this.current.methane;
            var currentC2H2 = (this.current.acetylene / currentGasTotal) * 100;
            var currentC2H4 = (this.current.ethylene / currentGasTotal) * 100;
            var currentCH4 = (this.current.methane / currentGasTotal) * 100;
            this.current.c2h2_pc_tri_1 = currentC2H2.toFixed(2);
            this.current.c2h4_pc_tri_1 = currentC2H4.toFixed(2);
            this.current.ch4_pc_tri_1 = currentCH4.toFixed(2);
            //Calculate current percentage of gases for triangle
            var currentGasTotal = this.current.methane + this.current.ethane + this.current.hydrogen;
            var currentCH4 = (this.current.methane / currentGasTotal) * 100;
            var currentC2H6 = (this.current.ethane / currentGasTotal) * 100;
            var currentH2 = (this.current.hydrogen / currentGasTotal) * 100;
            this.current.ch4_pc_tri_2 = currentCH4.toFixed(2);
            this.current.c2h6_pc_tri_2 = currentC2H6.toFixed(2);
            this.current.h2_pc_tri_2 = currentH2.toFixed(2);
            //Calculate current percentage of gases for triangle
            var currentGasTotal = this.current.ethylene + this.current.ethane + this.current.methane;
            var currentC2H4 = (this.current.ethylene / currentGasTotal) * 100;
            var currentC2H6 = (this.current.ethane / currentGasTotal) * 100;
            var currentCH4 = (this.current.methane / currentGasTotal) * 100;
            this.current.c2h4_pc_tri_3 = currentC2H4.toFixed(2);
            this.current.c2h6_pc_tri_3 = currentC2H6.toFixed(2);
            this.current.ch4_pc_tri_3 = currentCH4.toFixed(2);

            this.svgs = res.data.svgs;
            // console.log(this.current);
            this.loadingattributevalues = false;
          })
          .catch((err) => {
            console.log(err);
            this.loadingattributevalues = false;
          });
      } else {
        return;
      }
    },
    filter(dt1, dt2) {
      // console.log(dt1, dt2);
      this.datetime1 = dt1;
      this.datetime2 = dt2;

      this.getAttributeValues(this.element.id);
    },
    generatePDF() {
      this.validation_dialog = true;
      this.dialogMessage = "Under development.";
      return;
      this.loading = true;
      setTimeout(() => {
        window.print();
        this.loading = false;
      }, 1000);
    },
    //test
    generateCSV() {
      // Set the loading flag to true
      this.generateCSVloading = true;

      // Show a loading indicator for 1 second
      setTimeout(() => {
        // Create a copy of the original data with formatted timestamp
        const dataWithFormattedTimestamp = this.data.map((item) => {
          // Clone each object in the array to avoid modifying the original objects
          const clonedItem = Object.assign({}, item);

          // Format the timestamp property to a human-readable date format
          clonedItem.timestamp = new Date(item.timestamp).toLocaleString();

          // Delete the timestamp property from the cloned object
          // delete clonedItem.timestamp;
          // Delete the element property, if desired
          delete clonedItem.element;

          return clonedItem;
        });

        // Generate CSV from the modified data array
        const csv = Papa.unparse(dataWithFormattedTimestamp);

        //creating and downloading the CSV
        const csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const csvURL = window.URL.createObjectURL(csvData);
        const link = document.createElement("a");
        link.href = csvURL;
        link.setAttribute("download", "exported_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Set the loading flag to false
        this.generateCSVloading = false;
      }, 1000);
    },
    goToADG() {
      this.$router.push({ name: 'CDS Configurations' })
    },
  },
};
</script>
