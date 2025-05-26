<template>
    <div class="text-center">
        <v-dialog persistent v-model="event_dialog" width="500">
            <v-card>
                <v-card-actions>
                    <v-card-title>
                        <v-icon v-if="details.severity === 'healthy'" color="green" left> mdi-check-circle-outline </v-icon>
                        <v-icon v-if="details.severity === 'critical'" color="red" left> mdi-car-tire-alert</v-icon>
                        <v-icon v-if="details.severity === 'normal'" color="orange" left> mdi-car-tire-alert</v-icon>
                    </v-card-title>
                    <v-spacer></v-spacer>
                    <v-btn @click="closePopup()" text><v-icon>mdi-close</v-icon></v-btn>
                </v-card-actions>

                <v-card-text>
                    <v-row>
                        <v-col cols="12">
                            <v-card outlined>
                                <v-simple-table dense>
                                    <template>
                                        <thead>
                                            <tr>
                                                <th class="text-center" style="font-size: 15px;">
                                                    <!-- Adjust font size as needed -->
                                                    Severity
                                                </th>

                                                <th class="text-center" style="font-size: 15px;">
                                                    <!-- Adjust font size as needed -->
                                                    Value
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td class="text-center" style="font-size: 20px; font-weight: bold;">
                                                    <!-- Adjust font size as needed -->
                                                    {{ details.severity }}
                                                </td>

                                                <td class="text-center" style="font-size: 20px; font-weight: bold;">
                                                    <!-- Adjust font size as needed -->
                                                    {{ details.value }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>
                            </v-card>
                        </v-col>

                    </v-row>

                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    props: ['event_dialog', 'details'],
    data() {
        return {

        }
    },
    methods: {

        closePopup() {
            this.$emit('close');
        },
    }
}
</script>