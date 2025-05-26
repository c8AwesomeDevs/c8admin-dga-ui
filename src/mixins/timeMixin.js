export const timeMixin = {
    created() {
        // console.log('time mixin has been loaded')
    },
    data() {
        return {

        }
    },
    methods : {
        getMsByTime(timerange) {
            let ms = 3600000;
            if(timerange == '30m') {
                return ms / 2;
            }
            else if(timerange == '1h') {
                return ms;
            }
            else if(timerange == '8h') {
                return ms * 8;
            }
            else if(timerange == '1d') {
                return ms * 24;
            }
            else if(timerange == '7d') {
                return (ms * 24) * 7;
            }
            else if(timerange == '1mo') {
                return (ms * 24) * 30;
            }
            else if(timerange == '3mo') {
                return (ms * 24) * 90;
            }
        },
        formatDate(date) {
            var date = new Date(date);
            var month = parseInt(date.getMonth()) + 1;
            var year = date.getFullYear();
            var month = month <= 9 ? '0' + month : month;
            var day = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate();
            var hours = date.getHours() <= 9 ? '0' + date.getHours() : date.getHours();
            var minutes = date.getMinutes() <= 9 ? '0' + date.getMinutes() : date.getMinutes();
            var seconds = date.getSeconds() <= 9 ? '0' + date.getSeconds() : date.getSeconds();
    
            return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
        },
        getTimeRange(start, end) {
            var startdate = new Date(start);
            var enddate = new Date(end);

            var seconds = Math.floor((enddate.getTime() - startdate.getTime()) / 1000);
            var mins = Math.floor(seconds/60);
            var hours = Math.floor(mins/60);
            var days = Math.floor(hours/24);
            var months = Math.floor(days/30);
            var years = Math.floor(days/365);

            if(years > 0) {
                return years + 'y';
            }
            if(months > 0) {
                return months + 'mo';
            }
            if(days > 0) {
                return days + 'd';
            }
            if(hours > 0) {
                return hours + 'h';
            }
            if(mins > 0) {
                return mins + 'm';
            }
        }
    }
}