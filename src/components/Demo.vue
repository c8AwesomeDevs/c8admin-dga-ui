<template>
    <v-row justify="center">
        <v-dialog v-model="showDemo" max-width="1200" persistent>
            <v-card>
                <v-img height="100" src="@/assets/login-bg.jpg"></v-img>
                <v-divider></v-divider>
                <v-form pt="12">
                    <v-container>
                        <v-row>
                            <v-col col="12" md="6" class="">
                                <v-card-title>
                                    <span class="text-h5 font-weight-bold">
                                        C<span class="custom-number">8</span> Vortex
                                    </span>
                                </v-card-title>
                                <v-card-subtitle class="mt-1">
                                    <span class="demo-header font-weight-black">
                                        The #1 <br>Transmission <br>Distribution asset
                                    </span>
                                </v-card-subtitle>
                                <div class="demo-content">
                                    <p class="font-weight-bold">Discover why C8 Vortex is the top transmission and
                                        distribution asset monitoring tool.</p>
                                </div>
                                <div class="demo">
                                    <span class="check-item">
                                        <v-icon color="green" class="mr-3">
                                            mdi-check-circle
                                        </v-icon>
                                        Monitor and analyze critical equipment in real time.
                                    </span><br>

                                    <span class="check-item">
                                        <v-icon color="green" class="mr-3">
                                            mdi-check-circle
                                        </v-icon>
                                        Maintain high efficiency, increase productivity, and reduce breakdowns.
                                    </span><br>

                                    <span class="check-item">
                                        <v-icon color="green" class="mr-3">
                                            mdi-check-circle
                                        </v-icon>
                                        Includes a monitoring module for dissolved gas analysis, along with Duval's
                                        diagnostic suite.
                                    </span><br>
                                </div>


                            </v-col>
                            <v-divider vertical></v-divider>
                            <v-col col="12" md="6">
                                <v-list-item-content class="custom-content text-center">
                                    <v-card-actions>
                                    <v-card-title>Registration for Demo Account</v-card-title>
                                        <v-spacer></v-spacer>
                                        <v-btn  @click="closeDemo()" text><v-icon>mdi-close</v-icon></v-btn>
                                    </v-card-actions>
                                    <v-row dense>
                                        <v-col cols="12" sm="6"><v-text-field v-model="user.name"
                                                color="red darken-2" label="*Full Name" dense
                                                outlined></v-text-field></v-col>
                                        <v-col cols="12" sm="6"><v-text-field v-model="user.email" color="red darken-2"
                                                label="*Work Email" dense outlined></v-text-field></v-col>
                                        <v-col cols="12" sm="6"><v-text-field v-model="company.company_name"
                                                color="red darken-2" label="*Company name" dense
                                                outlined></v-text-field></v-col>
                                        <v-col cols="12" sm="6">
                                            <v-select dense color="red darken-2" v-model="company.country"
                                                :items="countryOptions" item-value="name" item-text="name" label="*Country"
                                                outlined clearable >
                                                <template v-slot:selection="{ item }">
                                                    {{ item.name }} ({{ item.code }})
                                                </template>
                                            </v-select>
                                        </v-col>
                                        <v-col cols="12" sm="12">
                                            <v-combobox color="red darken-2" v-model="company.industry" :items="industries"
                                                label="*Industry" Clearable dense outlined></v-combobox>
                                        </v-col>
                                        <v-col cols="12" sm="6" class="mb-5">
                                            <VuePhoneNumberInput v-model="user.phone_number" color="red" />
                                        </v-col>
                                        <v-col cols="12" sm="6">
                                            <v-combobox color="red darken-2" :items="hear_aboutus"
                                                label="How did you hear about us?" v-model="company.hear_aboutus" Clearable
                                                dense outlined></v-combobox>
                                        </v-col>



                                    </v-row>
                                    <v-btn block
                                        :class="['red darken-4 white--text', { 'grey lighten-1': loading, 'red darken-4': !loading }]"
                                        :disabled="loading" @click="bookDemo()">
                                        {{ loading ? "Loading..." : "Register" }}
                                    </v-btn>


                                </v-list-item-content>
                            </v-col>

                        </v-row>
                    </v-container>
                </v-form>

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
                    <span class="check">
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
    </v-row>
</template>
<style scoped>
.check{
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
.custom-number {
    color: red;
    /* Change the color to your desired value */
}

.demo-header {
    font-family: "proxima-nova", "Helvetica Neue", Helvetica, arial, sans-serif;
    font-size: 30px;
    text-align: left;
}

.demo-content {
    text-align: left;
    margin-left: 16px;
    font-size: 19px;
    font-weight: light-bold;
}

.demo {
    text-align: left;
    margin-left: 16px;
    font-size: 16px;
}

.check-item {
    display: flex;
    align-items: center;
}
</style>
<script>
import countryDataList from 'country-list';
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
export default {
    components: {
        VuePhoneNumberInput,
    },
    props: ['showDemo', 'loading', 'user', 'company'],
    data() {
        return {
            //   show: false,
            dialogMessage:'',
            validation_dialog: false,
            countryOptions: countryDataList.getData(),
            hear_aboutus: [
                'LinkedIn',
                'Advertisement',
                'Search Engine',
                'Social Media',
                'Webinar',
                'Referred by a Colleague',
                'Email',
                'Others',
            ],
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

 
    methods: {
       closeDemo() {
            this.$emit('close')
            this.company.company_name = '';
            this.company.country = null;
            this.company.hear_aboutus = null;
            this.company.industry = null;
            this.user.name = '';
            this.user.email = '';
            this.user.phone_number = null;
        },
        async bookDemo() {
                if (!this.user.name) {
                    this.validation_dialog = true;
                    this.dialogMessage = 'Please enter your full name.';
                    return;
                }
                if (!this.user.email) {
                    this.validation_dialog = true;
                    this.dialogMessage = 'Please enter your work email address.';
                    return;
                }
                if (!this.company.company_name) {
                    this.validation_dialog = true;
                    this.dialogMessage = 'Please enter your company name.';
                    return;
                }
                if (!this.company.country) {
                    this.validation_dialog = true;
                    this.dialogMessage = 'Please select country.';
                    return;
                }
                if (!this.company.industry) {
                    this.validation_dialog = true;
                    this.dialogMessage = 'Please select Industry.';
                    return;
                }
                this.$emit('bookDemo',{
                    company_name: this.company.company_name,
                    country: this.company.country,
                    hear_aboutus: this.company.hear_aboutus,
                    industry: this.company.industry,
                    name: this.user.name,
                    email: this.user.email,
                    phone_number: this.user.phone_number,
                });
        },

    }
}
</script>