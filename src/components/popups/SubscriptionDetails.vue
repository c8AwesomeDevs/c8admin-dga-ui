<template>
    <v-dialog v-model="dialog" width="400" @click:outside="close()">
        <v-card>
            <v-card-title color="red" class="darken-2">{{ profile.company.name ?  profile.company.name : null }}</v-card-title>
            <v-card-text>
                <h3>Hello {{ profile.name ? profile.name : null }}</h3>
                <p>Your {{ profile.subscription ? profile.subscription.subscription_type : null }} Subscription will expire on {{ profile.subscription ? profile.subscription.expiration_date : null}}</p>
                <p>Thank you.</p>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn small color="red" class="darken-2 white--text" @click="getStarted()">
                    Get-Started
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<style scoped>
    .uppercase {
        text-transform: uppercase;
    }
</style>
<script>
export default {
    name : 'SubscriptionDetails',
    props : ['dialog', 'details'],
    data() {
        return {
            profile : {
                company : {},
                subscription : {
                    subscription_type : null
                }
            }
        }
    },
    watch : {
        'details'() {
            this.profile = this.details.user;
        }
    },
    methods : {
        close() {
            this.$emit('close');
        },
        getStarted() {
            this.$router.push({name : 'Home'});
        }
    }
}
</script>