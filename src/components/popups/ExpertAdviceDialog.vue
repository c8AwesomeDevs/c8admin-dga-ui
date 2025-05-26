<template>
    <v-card>
        <!-- POPUP DIALOG -->
        <v-dialog persistent v-model="show" max-width="700px">
            <v-card>
                <v-card-actions>
                    <v-card-title>Expert Advice</v-card-title>
                    <v-spacer></v-spacer>
                    <v-btn @click="closePopup()" text><v-icon>mdi-close</v-icon></v-btn>
                </v-card-actions>
                <v-card-text>
                    <v-container>
                        <v-card outlined class="mb-4">
                            <!-- <v-card-title>Expert Advice</v-card-title> -->
                            <template>
                                <v-simple-table>
                                    <template v-slot:default>
                                        <thead>
                                            <tr>
                                                <th class="text-left">
                                                    Category
                                                </th>
                                                <th class="text-left">
                                                    Type
                                                </th>
                                                <th class="text-left">
                                                    Fault
                                                </th>
                                                <th class="text-left">
                                                    Examples
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            <tr v-for="(fault, index) in getFaultDescriptions(details)"
                                                :key="index">
                                                <td>{{ fault.category }}</td>
                                                <td>{{ fault.type }}</td>
                                                <td>{{ fault.fault }}</td>
                                                <td style="text-align: justify;">{{ fault.examples }}</td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>
                            </template>

                        </v-card>
                        <v-card outlined class="mb-4">
                            <v-card-text>
                                <p><strong>Possible Insulation Status:</strong> {{ details?.possible_insulation_status
                                || "N/A"
                            }}</p>
                            <p><strong>Dangerous Zone State:</strong> {{ details?.dangerous_zone_state || "N/A" }}
                            </p>
                            </v-card-text>
                          
                        </v-card>
                        <v-card outlined>
                            <v-card-text>
                                <p><strong>Recommend Operating Procedures/ Diagnostic:</strong> {{
                                details?.additional_tests ||
                                "None" }}</p>

                            <p><strong>Sampling Interval:</strong></p>
                            <ul>
                                <li>Exercise Extreme Caution</li>
                                <li>Analyze individual gases to find cause</li>
                                <li>Plant outage</li>
                                <li>Call manufacturer and other consultants for advice</li>
                            </ul>

                            <p class="mt-4"><strong>Recommended Diagnostics:</strong> {{ details?.recommended_actions || "N/A" }}
                            </p>
                            </v-card-text>
                           
                        </v-card>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>

    </v-card>
</template>

<script>
export default {
    name: "ExpertAdviceDialog",
    props: ["show", "details"],
    data() {
        return {
            faultDescriptions: {
                PD: {
                    description: "Partial discharges",
                    examples: "Discharges in gas-filled cavities resulting from incomplete impregnation, high humidity in paper, oil supersaturation or cavitation, and leading to X-wax formation."
                },
                D1: {
                    description: "Discharges of low energy",
                    examples: "Sparking or arcing between bad connections of different or floating potential, from shielding rings, toroids, adjacent disks or conductors of winding, broken brazing or closed loops in the core..."
                },
                D2: {
                    description: "Discharges of high energy",
                    examples: "Flashover, tracking, or arcing of high local energy or with power follow-through. Short circuits between low voltage and ground, connectors, windings, bushings, and tank."
                },
                T1: {
                    description: "Thermal fault < 300 °C",
                    examples: "Overloading of the transformer in emergency situations. Blocked item restricting oil flow in windings."
                },
                T2: {
                    description: "Thermal fault 300 °C < T < 700 °C",
                    examples: "Defective contacts between bolted connections, gliding contacts, contacts within selector switch."
                },
                T3: {
                    description: "Thermal fault > 700 °C",
                    examples: "Large circulating currents in tank and core. Minor circulation currents in tank walls created by a high uncompensated magnetic field."
                }
            },

        };
    },
    methods: {
        closePopup() {
            this.$emit('close');
        },
        getFaultDescriptions(row) {
    if (!row) return []; // Prevent errors if `row` is undefined

    let faults = [];

    // Function to check and return fault details
    const getFaultDetail = (faultType, category) => {
        if (!faultType || faultType === "Normal") {
            return {
                category,
                type: faultType || "N/A",
                fault: "No issues detected",
                examples: "-"
            };
        }

        if (this.faultDescriptions[faultType]) {
            return {
                category,
                type: faultType,
                fault: this.faultDescriptions[faultType].description,
                examples: this.faultDescriptions[faultType].examples
            };
        }

        return {
            category,
            type: faultType,
            fault: "No available fault",
            examples: "-"
        };
    };

    // Add primary and secondary faults
    faults.push(getFaultDetail(row.primary_fault, "Primary Fault"));
    faults.push(getFaultDetail(row.secondary_fault, "Secondary Fault"));

    console.log("Faults Data:", faults); // Debugging log to check output
    return faults;
}



    },

};
</script>
