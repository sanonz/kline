<style lang="scss">
    .trade_container
        #trades
            flex: 1
            overflow-y: auto
            text-align: left
            color: #666
            padding-top: 4px
            padding-bottom: 4px
        .trades_list
            padding-left: 10px
            padding-right: 10px
            ul
                display: flex
                justify-content: space-around;
                line-height: 14px
                text-align: left
                list-style: none
                clear: both
                zoom: 1
                margin: 0
                padding: 0
                li
                    flex: 1
                    color: #999
                    font-size: 12px
                    list-style: none
                    float: left
                    *display: inline
                    margin: 0
                    padding: 0
                    font-family: Consolas, monospace
                    &.tm
                        color: #999
                        text-align: left
                    &.pr-buy
                        color: #6c6
                        text-align: center
                    &.pr-sell
                        color: #c66
                        text-align: center
                    &.vl
                        color: #ccc
                        text-align: right
                        em
                            color: #666
                            font-style: normal
        &.dark
            .trades_list
                ul
                    &.newul
                        display: none
                        background-color: rgba(238, 238, 238, 0.2)
        &.light
            #trades
                &.trades
                    table
                        color: #333
                    .v
                        color: #333
                        g
                            color: #333
            .trades_list
                ul
                    &.newul
                        display: none
                        background-color: rgba(100, 100, 100, 0.2)
                    li
                        &.tm
                            color: #333
                        &.pr-buy
                            color: #6c6
                        &.pr-sell
                            color: #c66
                        &.vl
                            color: #333
                            em
                                color: #333
</style>

<template>
    <div id="trades" class="trades">
        <div class="trades_list">
            <ul
                v-for="v in trades"
                :key="v.tid"
            >
                <li class="tm">{{v._time}}</li>
                <li :class="`pr-${v.type}`">{{v.price | priceFormat}}</li>
                <li class="vl">{{v._amount[0]}}<em v-if="v._amount[1]">.{{v._amount[1]}}</em></li>
            </ul>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    import Kline from '../js/kline';

    let td = new Date();

    export default {
        data: function() {
            return {
                isMounted: false,
                fetching: false,

                trades: [],

                symbolName: '',
            };
        },
        mounted: function() {
            this.isMounted = true;

            this.fetchData();
        },
        beforeDestroy: function() {
            this.isMounted = false;
        },
        filters: {
            priceFormat: function(price) {
                if (price > 1) {
                    price = price.toFixed(2)
                }
                if (price < 1 && price > 0.00001) {
                    price = price.toFixed(4)
                }
                if (price < 0.00001) {
                    price = price.toFixed(6)
                }

                return price;
            }
        },
        watch: {
            //
        },
        methods: {
            fetchData() {
                if (this.fetching) {
                    return;
                }

                this.fetching = true;
                return axios.get('./examples/trades.json')
                    .then(response => {
                        if (response.data.code === 1) {
                            this.trades.push(...this.parser(response.data.data.trades));
                        }
                    })
                    .finally(() => {
                        this.fetching = false;
                    });
            },
            parser(trades) {
                return trades.map(trade => {
                    trade._amount = trade.amount.toFixed(4).split('.');
                    
                    if (typeof trade.time === 'number') {
                        td.setTime(trade.time);
                        const time = [
                            td.getHours(),
                            td.getMinutes(),
                            td.getSeconds(),
                        ].map(v => this.dateFormat(v));

                        trade._time = time.join(':');
                    } else {
                        const arr = trade.time.split(' ');

                        trade._time = arr[1];
                    }

                    return trade;
                });

                return trades;
            },
            dateFormat(i) {
                return (i < 10 ? '0' : '') + i;
            },
        },
    };
</script>

