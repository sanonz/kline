import Vue from 'vue';

import Chart from './components/Chart';


new Vue({
    el: '#app',
    template: `
        <Chart
            :width="1200"
            :height="660"
            symbol="bitcoin"
            url="http://192.168.1.12:9090/api/v1/coins/KlineCoinCode"
        />
    `,
    components: { Chart }
});
