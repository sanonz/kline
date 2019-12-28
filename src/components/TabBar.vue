<style lang="scss">
    .chart_wrapper
        #chart_tabbar
            border-top: 1px solid
            cursor: default
            *font-weight: bold
            height: 22px
            line-height: 22px
            overflow: hidden
            position: absolute
            z-index: 1
            ul
                height: 100%
                list-style: none
                padding: 0 0 0 4px
            li
                display: inline-block
                height: 100%
                margin: 0
            a
                cursor: pointer
                display: inline-block
                height: 100%
                margin: 0
                padding: 0px 4px 0 4px
                overflow: hidden
                &:hover
                    text-decoration: none
    
        &.dark
            #chart_tabbar
                border-top-color: #404040
                a
                    color: #888
                    &:hover
                        background-color: #383838
                        color: #ccc
                    &.selected
                        color: #444
                        background-color: transparent;
                        // cursor: not-allowed;

        &.light
             #chart_tabbar
                border-top-color: #afb1b3
                a
                    color: #888
                    &:hover
                        background-color: #f4f4f4
                        color: #444
                    &.selected
                        color: #ccc
                        background-color: transparent;
                        // cursor: not-allowed;
</style>

<template>
    <div id="chart_tabbar">
        <ul>
            <li
                v-for="v in list"
                :key="v"
            >
                <a
                    :class="{selected: selections.indexOf(v) > -1}"
                    @click="onClick(v)"
                >{{v}}</a>
            </li>
        </ul>
    </div>
</template>

<script>
    import Kline from '../js/kline';
    import { IndicatorArea } from '../js/areas'

    export default {
        data: function() {
            return {
                isMounted: false,

                selections: [],

                list: IndicatorArea.tabIndics,
            };
        },
        mounted: function() {
            this.isMounted = true;

            Kline.on('ready', this.onReady);
        },
        beforeDestroy: function() {
            this.isMounted = false;
        },
        methods: {
            onReady() {
                const config = Kline.ChartSettings.get();
                this.selections = config.charts.indics;
            },
            onClick(name) {
                const config = Kline.ChartSettings.get();
                const chart = Kline.instance.chartMgr.getChart();
                const indics = config.charts.indics;
                const idx = this.selections.indexOf(name);

                if (idx > -1) {
                    indics.splice(idx, 1);
                    chart.setIndicator(idx + 1, 'NONE');
                } else {
                    indics.push(name);
                    chart.setIndicator(this.selections.length + 1, name);
                }

                Kline.ChartSettings.save();
            }
        },
    };
</script>

