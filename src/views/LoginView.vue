<template>
    <v-card
        class="mx-auto mt-15"
        max-width="480"
    >
        <v-img class="login-logo" :class="rotate ? 'rotate' : ''"
        src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
        height="200px"
        ></v-img>

        <v-card-title>
            C8 VORTEX
        </v-card-title>

        <v-card-subtitle>
            
        </v-card-subtitle>

        <v-card-text>
            <v-btn @click="signInWithGoogle()">Sign-In With Google</v-btn>
        </v-card-text>
    </v-card>
</template>
<style scoped>
    .login-logo {
        transition: 0.5s ease-in-out;
    }
    .login-logo.rotate {
        transform : rotate(360deg);
    }
</style>
<script>
    export default {
        name : 'Login',
        components : {
        },
        created() {
            window.gapi.client
                .init({
                    clientId:'993267277168-t4ot4v30dh7cfsrob9c41f07ifcare7m.apps.googleusercontent.com',
                    scope: "email",
                    plugin_name:'Calibr8 Web Apps'
                })
        },
        mounted(){
            setTimeout(res => {
                this.rotate = true;
            }, 500);

            console.log("Test")
        },
        data () {
            return {
                rotate : false
            }
        },
        methods : {
            async signInWithGoogle(){
            const googleUser = await this.$gAuth.signIn();
            let Profile = googleUser.getBasicProfile();
            // console.log("googleUser", googleUser.getBasicProfile());
            console.log(Profile);
        },
        }
    }
</script>

<style>
.g-signin-button {
  /* This is where you control how the button looks. Be creative! */
  display: inline-block;
  padding: 4px 8px;
  border-radius: 3px;
  background-color: #3c82f7;
  color: #fff;
  box-shadow: 0 3px 0 #0f69ff;
}
</style> 