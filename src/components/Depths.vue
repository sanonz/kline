<style lang="scss">
    .chart_wrapper
        .trade_container
            .hidden
                visibility: hidden
            .chart-orderbook
                .orderbook-board
                    display: flex
                    flex: 1
            #orderbook
                display: flex
                flex-direction: column
                flex: 2
                padding: 0 10px 6px;
                border-bottom: 1px solid #222
                .table
                    .row
                        padding: 0
                        margin: 0
                        height: 13px
                        line-height: 13px
                        font-family: Consolas, monospace
                        line-height: 13px
                    .em
                        color: #666
            #orderbook #asks,
            #orderbook #gasks,
            #orderbook #bids,
            #orderbook #gbids
                overflow: hidden
            #asks,
            #bids
                display: flex
                flex: 1
            #gasks,
            #gbids
                width: 90px
                display: flex
                flex-direction: column
            #gasks
                justify-content: flex-end
            #gbids
                justify-content: flex-start
            #gasks .amount,
            #gbids .amount
                float: right
            #gasks .price,
            #gbids .price
                float: left
                text-align: right
            .price
                margin-right: 10px
                h
                    visibility: hidden
            .price em,
            .amount em
                color: #666
                font-style: normal
            #price
                text-align: center
                font-size: 16px
                font-weight: bold
                height: 25px
                line-height: 25px
        &.dark
            #orderbook
                div
                    &.table
                        div
                            &.add
                                display: none
                                background-color: rgba(238, 238, 238, 0.2)
        &.light
            #orderbook
                border-bottom-color: #afb1b3

    .chart_wrapper.dark #orderbook div.table div.remove em,
    .chart_wrapper.dark #orderbook div.table div.remove span
        color: #444
    .chart_wrapper.light #orderbook div.table div.remove em,
    .chart_wrapper.light #orderbook div.table div.remove span
        color: #ddd
</style>

<template>
    <div id="orderbook" class="chart-orderbook">
        <div class="orderbook-board">
                <div id="asks">
                <div class="table">
                    <div
                        class="row"
                        v-for="(v, i) in asks"
                        :key="i"
                    >
                        <span v-if="!v.price[3]" class="price">{{v.price[0]}}{{v.price[1]}}<em>{{v.price[2]}}</em></span>
                        <span v-else class="price">
                            <span class="hidden">{{v.price[0]}}</span>{{v.price[1]}}<em>{{v.price[2]}}</em>
                        </span>
                        <span class="amount">{{v.amount[0]}}<em>{{v.amount[1]}}</em></span>
                    </div>
                </div>
            </div>
            <div id="gasks">
                <div class="table">
                    <div
                        class="row"
                        v-for="(v, i) in gasks"
                        :key="i"
                    >
                        <span v-if="!v.price2" class="price">{{v.price}}</span>
                        <span v-else class="price">
                            <span class="hidden">{{v.price}}.</span>{{v.price2}}
                        </span>
                        <span class="amount">{{v.amount}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div id="price" class="green"></div>
        <div class="orderbook-board">
            <div id="bids">
                <div class="table">
                    <div
                        class="row"
                        v-for="(v, i) in bids"
                        :key="i"
                    >
                        <span v-if="!v.price[3]" class="price">{{v.price[0]}}{{v.price[1]}}<em>{{v.price[2]}}</em></span>
                        <span v-else class="price">
                            <span class="hidden">{{v.price[0]}}</span>{{v.price[1]}}<em>{{v.price[2]}}</em>
                        </span>
                        <span class="amount">{{v.amount[0]}}<em>{{v.amount[1]}}</em></span>
                    </div>
                </div>
            </div>
            <div id="gbids">
                <div class="table">
                    <div
                        class="row"
                        v-for="(v, i) in gbids"
                        :key="i"
                    >
                        <span v-if="!v.price2" class="price">{{v.price}}</span>
                        <span v-else class="price"><span class="hidden">{{v.price}}.</span>{{v.price2}}</span>
                        <span class="amount">{{v.amount}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    import Kline from '../js/kline';

    export default {
        props: {
            priceDecimalDigits: {
                type: Number,
                default: 6,
            },
            amountDecimalDigits: {
                type: Number,
                default: 4,
            },
        },
        data: function() {
            return {
                isMounted: false,
                fetching: false,

                asks: [],
                bids: [],
                gasks: [],
                gbids: [],

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
        watch: {
            //
        },
        methods: {
            fetchData() {
                if (this.fetching) {
                    return;
                }

                this.fetching = true;
                return axios.get('./examples/depths.json')
                    .then(response => {
                        if (response.data.code === 1) {
                            this.parser(response.data.data.depths);
                        }
                    })
                    .finally(() => {
                        this.fetching = false;
                    });
            },
            parser(depths) {
                this.lastInt = 0;

                depths.asks.splice(0, depths.asks.length - 16);
                depths.bids.splice(16, depths.asks.length - 1);

                this.asks = depths.asks.map(this.formatPrice);
                this.bids = depths.bids.map(this.formatPrice);
                this.gasks = this.parseG(this.parseGasks(depths.asks));
                this.gbids = this.parseG(this.parseGbids(depths.bids));
            },
            formatPrice(row) {
                const data = {};
                let arr = String(row[0]).split('.');
                data.price = this.parsePrice(arr, this.lastInt);
                this.lastInt = arr[0];

                arr = String(row[1]).split('.');
                data.amount = this.parseAmount(arr);

                return data;
            },
            parsePrice(arr, lastInt) {
                let price1 = arr[0];
                let hidden = 0;
                if (lastInt === price1) {
                    hidden = 1;
                }
                price1 += '.';

                let price11 = '';
                let price2 = '';
                if (arr.length === 1) {
                    price11 += '0';
                    price2 = this.fillZeros(this.priceDecimalDigits - 1);
                } else {
                    price11 += arr[1];
                    price2 = this.fillZeros(this.priceDecimalDigits - arr[1].length);
                }

                return [price1, price11, price2, hidden];
            },
            parseAmount(arr) {
                let amount1 = arr[0];
                let amount2 = '';
                let zerosLen = this.amountDecimalDigits - amount1.length + 1;
                if (zerosLen > 0) {
                    amount2 = '.';
                    if (arr.length === 1) {
                        amount2 += this.fillZeros(zerosLen);
                    } else if (zerosLen > arr[1].length) {
                        amount2 += arr[1] + this.fillZeros(zerosLen - arr[1].length);
                    } else if (zerosLen === arr[1].length) {
                        amount2 += arr[1];
                    } else {
                        amount2 += arr[1].substring(0, zerosLen);
                    }
                }

                return [amount1, amount2];
            },
            fillZeros(i) {
                let zeros = '';
                while (i > 0) {
                    i--;
                    zeros += '0';
                }

                return zeros;
            },
            getBlock(b, scale) {
                if (b > scale || b <= 0) {
                    return scale;
                } else {
                    scale = scale / 10;
                    return this.getBlock(b, scale);
                }
            },
            parseG(array) {
                this.lastInt = 0;
                return array.map(row => {
                    const data = {amount: row[1]};
                    const arr = row[0].split('.');

                    if (arr.length === 1 || arr[0] !== this.lastInt) {
                        data.price = row[0];
                        this.lastInt = arr[0];
                    } else {
                        data.price = arr[0];
                        data.price2 = arr[1];
                    }

                    return data;
                });
            },
            parseGasks(array) {
                if (array.length < 2) {
                    return [];
                }

                let low = array[array.length - 1][0]; //最低价
                let high = array[0][0]; //最高价
                let r = high - low;
                let block = this.getBlock(r, 100);
                let n = Math.abs(Number(Math.log(block) / Math.log(10))).toFixed(0); //精确小数位数
                if (r / block < 2) {
                    block = block / 2;
                    n++;
                }
                if (block >= 1) (n = 0);
                low = parseInt(low / block) * block;
                high = parseInt(high / block) * block;
                let gasks = [];
                let amount = 0;
                for (let i = array.length - 1; i >= 0; i--) {
                    if (array[i][0] > low) {
                        let amountInt = parseInt(amount, 10);
                        if (amountInt > 0) {
                            gasks.unshift([Number(low).toFixed(n), amountInt]);
                        }
                        if (low >= high) {
                            break;
                        }
                        low += block;
                    }
                    amount += array[i][1];
                }

                return gasks;
            },
            parseGbids(array) {
                if (array.length < 2) {
                    return [];
                }
                let low = array[array.length - 1][0];
                let high = array[0][0];
                let r = high - low;
                let block = this.getBlock(r, 100);
                let n = Math.abs(Number(Math.log(block) / Math.log(10))).toFixed(0); //精确小数位数
                if (r / block < 2) {
                    block = block / 2;
                    n++;
                }
                if (block >= 1) (n = 0);
                low = parseInt(low / block) * block;
                high = parseInt(high / block) * block;

                let gbids = [];
                let amount = 0;
                for (let i = 0; i < array.length; i++) {
                    if (array[i][0] < high) {
                        let amountInt = parseInt(amount, 10);
                        if (amountInt > 0) {
                            gbids.push([Number(high).toFixed(n), amountInt]);
                        }
                        if (high <= low) {
                            break;
                        }
                        high -= block;
                    }
                    amount += array[i][1];
                }

                return gbids;
            },
        },
    };
</script>

