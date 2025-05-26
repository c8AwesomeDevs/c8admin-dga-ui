<template>
    <v-dialog 
        v-model="dialog" 
        persistent
        max-width="460"
        @click:outside="close()">
        <v-time-picker
            v-model="time"
            color="red darken-3"
            header-color="red darken-3"
            ampm-in-title
            format="ampm"
            landscape
            scrollable
            >
            <v-spacer></v-spacer>
            <v-btn
                small
                dark
                color="red darken-3"
                @click="setTime()"
            >
                Confirm
            </v-btn>
        </v-time-picker>
    </v-dialog>
</template>
<script>
export default {
    name : 'TimePicker',
    props : ['dialog', 'current_time'],
   
    data() {
        return {
            time : null,
        }
    },

    watch : {
        'current_time' () {
            this.time = this.current_time;
        }
    },
    mounted(){
        // Create a new Date object for the current date and time
        let currentDate = new Date();

        // Get the current hour, minute, and second
        let currentHour = currentDate.getHours();
        let currentMinute = currentDate.getMinutes();
        let currentSecond = currentDate.getSeconds();

        // Format the current time
        this.time = `${currentHour}:${currentMinute}:${currentSecond}`;

        // console.log("Current time:", this.time);

    },
    methods : {
        setTimeNow() {
            var date = new Date(); 
            var hour = date.getHours() <= 9 ? '0' + date.getHours() : date.getHours();
            var mins = date.getMinutes() <= 9 ? '0' + date.getMinutes() : date.getMinutes();
            var time = hour + ':' + mins;
            
            this.$emit('setTime', time);
        },
        setTime() {
            this.$emit('setTime', this.time);
        },
        close() {
            this.$emit('close');
        }
    }
}

</script>