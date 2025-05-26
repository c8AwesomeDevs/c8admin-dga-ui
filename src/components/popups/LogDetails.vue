<template>
    <v-dialog v-model="show" max-width="650" @click:outside="closePopup()">
        <template v-slot:default="dialog">
            <v-card>
                <v-card-actions>
                    <v-card-title>{{ details.path.replaceAll('\\', '\\') }}</v-card-title>
                    <v-spacer></v-spacer>
                    <v-btn @click="closePopup()" text><v-icon>mdi-close</v-icon></v-btn>
                </v-card-actions>
                <v-card-text>
                    <v-row>
                        <v-col cols="12">
                            <v-card outlined class="pa-6">
                                <v-row>
                        <v-col>
                            <v-text-field color="red" v-model="formatDateAndTime(details.timestamp).date" label="Date"
                                append-icon="mdi-calendar" readonly hide-details outlined dense></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field color="red" v-model="formatDateAndTime(details.timestamp).time" label="Time"
                                append-icon="mdi-clock-edit-outline" readonly hide-details outlined dense></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field color="red" label="Acetylene (C2H2)" v-model="details.acetylene" readonly
                                hide-details></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field color="red" label="Ethylene (C2H4)" v-model="details.ethylene" readonly
                                hide-details></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field color="red" label="Methane (CH4)" v-model="details.methane" readonly
                                hide-details></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field color="red" label="Ethane (C2H6)" v-model="details.ethane" readonly
                                hide-details></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field color="red" label="Hydrogen (H)" v-model="details.hydrogen" readonly
                                hide-details></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field color="red" label="Oxygen (H)" v-model="details.oxygen" readonly
                                hide-details></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field color="red" label="Carbon Monoxide (CO)" v-model="details.carbon_monoxide"
                                readonly hide-details></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field color="red" label="Carbon Dioxide (CO2)" hide-details
                                v-model="details.carbon_dioxide" readonly></v-text-field>
                        </v-col>
                    </v-row>

                            </v-card>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-text>
                    <v-row>
                        <v-col cols="12">
                            <v-card outlined>
                                <v-tabs color="red" centered v-model="tab">
                    <v-tab key="duvals">
                        Duvals Interpretation
                    </v-tab>
                    <v-tab key="others">
                        Other Interpretations
                    </v-tab>
                </v-tabs>
                <v-divider></v-divider>
                <v-tabs-items v-model="tab">
                    <v-tab-item key="duvals">
                        <v-simple-table dense>
                            <template v-slot:default>
                                <tbody>
                                    <tr>
                                        <td>Triangle 1</td>
                                        <td>
                                            <v-chip small class="white--text"
                                                :color="details.t1 == 'Normal' ? 'green' : 'red'">
                                                {{ getFaultDescription(0, details.t1) }}
                                            </v-chip>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Triangle 2</td>
                                        <td>
                                            <v-chip small class="white--text"
                                                :color="details.t2 == 'Normal' ? 'green' : 'red'">
                                                {{ getFaultDescription(1, details.t2) }}
                                            </v-chip>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Triangle 3 (Biotemp)</td>
                                        <td>
                                            <v-chip small class="white--text"
                                                :color="details.t3_biotemp == 'Normal' ? 'green' : 'red'">
                                                {{ getFaultDescription(2, details.t3_biotemp) }}
                                            </v-chip>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Triangle 4</td>
                                        <td>
                                            <v-chip small class="white--text"
                                                :color="details.t4 == 'Normal' ? 'green' : 'red'">
                                                {{ getFaultDescription(3, details.t4) }}
                                            </v-chip>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Triangle 5</td>
                                        <td>
                                            <v-chip small class="white--text"
                                                :color="details.t5 == 'Normal' ? 'green' : 'red'">
                                                {{ getFaultDescription(4, details.t5) }}
                                            </v-chip>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Triangle 6</td>
                                        <td>
                                            <v-chip small class="white--text"
                                                :color="details.t6 == 'Normal' ? 'green' : 'red'">
                                                {{ getFaultDescription(5, details.t6) }}
                                            </v-chip>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Triangle 7</td>
                                        <td>
                                            <v-chip small class="white--text"
                                                :color="details.t7 == 'Normal' ? 'green' : 'red'">
                                                {{ getFaultDescription(6, details.t7) }}
                                            </v-chip>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Pentagon 1</td>
                                        <td>
                                            <v-chip small class="white--text"
                                                :color="details.p1 == 'Normal' ? 'green' : 'red'">
                                                {{ getFaultDescription(7, details.p1) }}
                                            </v-chip>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Pentagon 2</td>
                                        <td>
                                            <v-chip small class="white--text"
                                                :color="details.p2 == 'Normal' ? 'green' : 'red'">
                                                {{ getFaultDescription(8, details.p2) }}
                                            </v-chip>
                                        </td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </v-tab-item>
                    <v-tab-item key="others" class="text-center">
                        <v-container>
                            <v-simple-table dense>
                                <template v-slot:default>
                                    <thead>
                                        <tr>
                                            <th class="text-left">Type</th>
                                            <th class="text-left">Interpretation</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="text-left">IEC Ratio</td>
                                            <td class="text-left">{{ details.iec_ratio }}</td>
                                        </tr>
                                        <tr>
                                            <td class="text-left">Dornenburg</td>
                                            <td class="text-left">{{ details.dornenberg }}</td>
                                        </tr>
                                        <tr>
                                            <td class="text-left">Roger's Ratio</td>
                                            <td class="text-left">{{ details.rogers_ratio }}</td>
                                        </tr>
                                        <!-- <tr>
                                            <td class="text-left">NEI Ratio</td>
                                            <td class="text-left">{{ details.nei }}</td>
                                        </tr> -->
                                        <tr>
                                            <td class="text-left">CO2/CO Ratio</td>
                                            <td class="text-left">{{ details.carbon_ratio }}</td>
                                        </tr>
                                    </tbody>
                                </template>
                            </v-simple-table>

                        </v-container>
                    </v-tab-item>
                </v-tabs-items>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </template>
    </v-dialog>
</template>
<style scoped>
.text-sm {
    font-size: 12px;
    margin-bottom: 0px;
}
</style>
<script>
import { symbolMixin } from '@/mixins/symbolMixin.js';
export default {
    name: 'LogDetails',
    props: ['show', 'details'],
    mixins: [symbolMixin],
    data() {
        return {
            tab: 'duvals'
        }
    },
    methods: {
        closePopup() {
            this.$emit('close');
        },
        getFaultDescription(idx, interpretation) {
            if (interpretation != 'Normal') {
                // console.log(idx, interpretation);
                return interpretation + ' : ' + this.symbols[idx].legends[interpretation].description;
            }
            return 'Normal';
        },
        formatDateAndTime(timestamp) {
            const dateObject = new Date(timestamp);
            const date = dateObject.toDateString(); // Get date in format like "Sat Jul 27 2023"
            const time = dateObject.toLocaleTimeString(); // Get time in format like "12:30:45 PM"
            return { date, time };
        }
    }
}
</script>