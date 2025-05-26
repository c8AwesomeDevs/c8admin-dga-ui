<template>
    <v-dialog v-model="dialog" width="800" :persistent="persistent">
        <v-row
            no-gutters
        >
            <v-col>
                <v-card
                    outlined
                    tile
                    class="card-demo"
                >
                    <v-card-subtitle class="text-center">
                        DEMO
                    </v-card-subtitle>
                    <v-card-text>
                        <div class="text-center price">
                            <h1>{{ subscriptions.demo.price }}</h1>
                        </div>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-list dense class="font-sm">
                        <v-list-item v-for="inclusion, idx in subscriptions.demo.inclusions" :key="idx">
                            <v-list-item-content>
                                {{ inclusion }}
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                    <v-card-actions class="pt-12">
                        <v-btn block color="orange" class="lighten-2" @click="subscribe('demo')">Subscribe</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
            <v-col>
                <v-card
                    outlined
                    tile
                    color="red"
                    class="darken-3 card-advanced"
                    dark
                >
                    <v-card-subtitle class="text-center">
                        ADVANCED
                    </v-card-subtitle>
                    <v-card-text>
                        <div class="text-center price">
                            <h1>{{ subscriptions.advanced.price }}</h1>
                        </div>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-list dense color="red" class="font-sm">
                        <v-list-item v-for="inclusion, idx in subscriptions.advanced.inclusions" :key="idx">
                            <v-list-item-content>
                                {{ inclusion }}
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                    <v-card-actions>
                        <v-btn block color="orange darken-2" rounded @click="subscribe('advanced')">Subscribe</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
            <!-- <v-col class="pt-10">
                <v-card
                    outlined
                    tile
                >
                    <v-card-subtitle class="text-center">
                        BASIC
                    </v-card-subtitle>
                    <v-card-text>
                        <div class="text-center price">
                            <h1>$500</h1>
                        </div>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-list dense class="font-sm">
                        <v-list-item v-for="inclusion, idx in subscriptions.basic.inclusions" :key="idx">
                            <v-list-item-content>
                                {{ inclusion }}
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                    <v-card-actions>
                        <v-btn block color="orange" class="lighten-2"  @click="subscribe('basic')">Subscribe</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col> -->
        </v-row>
    </v-dialog>
</template>
<style scoped>
.font-sm {
    font-size : 14px;
}
.card-demo {
  height: 530px; /* Set the desired height for the DEMO card */
}

.card-advanced {
  height: 530px; /* Set the desired height for the ADVANCED card */
}
</style>
<script>
import { subscriptionMixin } from '@/mixins/subscriptionMixin.js';
export default {
    name : 'SubscriptionsDialog',
    props : ['dialog'],
    mixins : [subscriptionMixin],
    data() {
        return {
            persistent : true
        }
    },
    created () {
        
    },
    methods : {
        close() {
            this.$emit('close');
        },
        subscribe(type) {
            this.$emit('subscribe', type, this.subscriptions[type].price_id)
        }
    }
}
</script>