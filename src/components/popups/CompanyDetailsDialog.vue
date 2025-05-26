<template>
    <div>
        <v-dialog v-model="dialog" width="500" :persistent="persistent">
            <v-card>
                <v-progress-linear v-if="loading" indeterminate color="red darken-2"></v-progress-linear>
                <v-card-title>Your Profile</v-card-title>
                <v-card-subtitle>You need to update your profile before you can proceed.</v-card-subtitle>
                <v-card-text>
                    <v-text-field color="red darken-2" v-model="user.name" label="Name" dense outlined></v-text-field>
                    <v-text-field color="red darken-2" v-model="user.email"  label="Email" readonly dense outlined></v-text-field>
                    <v-text-field color="red darken-2" v-model="user.company.company_name" readonly label="Company" dense outlined></v-text-field>
                    <v-text-field color="red darken-2" v-model="user.company.domain" readonly label="Domain" dense outlined></v-text-field>
                    <v-text-field color="red darken-2" v-model="user.company.country" readonly  label="Country" dense outlined></v-text-field>
                    <!-- <v-text-field color="red darken-2" v-model="user.company.industry" readonly label="Industry" dense outlined></v-text-field> -->
                    <!-- <v-text-field v-model="user.company.state" label="Country Code" dense outlined></v-text-field> -->
                    <!-- <div class="form-group">
                        <v-select dense color="red darken-2"
                        v-model="selectedCountry"
                        :items="countryOptions"
                        item-value="name"
                        item-text="name"
                        label="Country"
                        outlined
                        clearable
                        @input="onCountrySelected"
                        >
                        <template v-slot:selection="{ item }">
                            {{ item.name }} ({{ item.code }})
                        </template>
                        </v-select>
                    </div> -->
                    <v-combobox color="red darken-2" v-model="user.company.industry" :items="industries" label="Industry" Clearable dense
                        outlined></v-combobox>
                    <!-- <v-select v-model="select" :hint="`${select.state}, ${select.abbr}`" :items="items" item-text="state"
                    item-value="abbr" label="Select" persistent-hint return-object dense outlined></v-select> -->
                </v-card-text>
                <v-card-actions>
                    <v-btn block class="red darken-4 white--text" :disabled="loading"
                        @click="updateProfile()">
                        Proceed
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="validation_dialog" max-width="350" min-width="300">
            <template>
                    <v-card>
                    <div >
                <span>
                    <v-icon color="orange" class="icon ml-3 mt-3">
                    mdi-alert-circle-outline
                    </v-icon>
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
        </v-dialog>
    </div>
</template>

<style scoped>
.demo-check{
    font-size: 13px;
    white-space: pre; 
    display: flex; 
    justify-content: center; 
    align-items: center; 
    margin-left: 1em; 
    margin-right: 1em;
}
.icon{
    font-size: 25px;
}
.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.select-wrapper {
  position: relative;
}

select {
  display: block;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  background-color: transparent;
  font-size: 1rem;
  line-height: 1.5;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.select-arrow {
  position: absolute;
  top: 50%;
  right: 1.1rem;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0.375rem 0.375rem 0 0.375rem;
  border-color: #ccc transparent transparent transparent;
  pointer-events: none;
}
</style>

<script>
import countryDataList from 'country-list';

export default
    {
        name: 'CompanyDetailsDialog',
        props: ['details', 'dialog'],
        data() {
            return {
                loading: false,
                validation_dialog: false,
                countryOptions: countryDataList.getData(),
                selectedCountry: null,
                dialogMessage: '',
                dialogTitle: '',
                user: {
                    company: {}
                },
                persistent: true,
                industries: [
                    'Transmission and distribution',
                    'Renewable power Generation',
                    'Non-Renewable Power Generation',
                    'Manufacturing',
                    'Mining',
                    'Oil and Gas',
                    'Others',
                ],
            }

        },
        // created() {
        //     const countries = countryDataList.getNames();
        //     const countryCodes = countryDataList.getCodes();

        //     for (let i = 0; i < countries.length; i++) {
        //     this.countryOptions.push({ name: countries[i], code: countryCodes[i] });
        //     }
        // },
                watch: {
            'details'() {
                this.user = this.details;
            },

        },
        methods: {
            onCountrySelected() {
                this.user.company.country = this.selectedCountry;
                console.log(this.user.company.country);
            },
            updateProfile() {
                if (!this.user.name) {
                    this.validation_dialog = true;
                    this.dialogMessage = 'Name field is required.';
                    return;
                }
                if (!this.user.email) {
                    this.validation_dialog = true;
                    this.dialogMessage = 'Email field is required.';
                    return;
                }
                if (!this.user.company.company_name) {
                    this.validation_dialog = true;
                    this.dialogTitle = 'Warning';
                    this.dialogMessage = 'Company field is required.';
                    return;
                }
                if (!this.user.company.domain) {
                    this.validation_dialog = true;
                    this.dialogMessage = 'Domain field is required.';
                    return;
                }
                if (!this.user.company.country) {
                    this.validation_dialog = true;
                    this.dialogMessage = 'Select country.';
                    return;
                }
                if (!this.user.company.industry) {
                    this.validation_dialog = true;
                    this.dialogMessage = 'Select industry.';
                    return;
                }

                this.loading = true;
                this.$emit('update', this.user)
            }
        }

    }
</script>