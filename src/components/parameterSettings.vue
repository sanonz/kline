<style lang="scss">
    .chart_wrapper
        #chart_parameter_settings
            border-radius: 4px
            z-index: 500
            h2
                padding: 8px 12px
                margin: 0
            table
                border-collapse: collapse
                width: 100%
            tr
                line-height: 32px
            th
                text-align: right
                font-weight: normal
                padding: 0 4px 0 16px
            input
                width: 2em
                margin: 0 2px 0 2px
            .chart_str_default
                width: 58px
                margin-right: 24px
    
        &.dark
            #chart_parameter_settings
                color: #ccc

        &.light
            #chart_parameter_settings
                color: #393c40
</style>

<template>
    <model
        ref="model"
        :open="open"
        title="指标参数设置"
        @close="onClose"
    >
        <div id="chart_parameter_settings">
            <table>
                <tbody>
                <tr
                    v-for="(l, i) in list"
                    :key="i"
                >
                    <template v-for="(v, k) in l">
                        <th>{{k}}</th>
                        <td>
                            <input
                                v-for="(u, j) in v"
                                :key="j"
                                v-model.number="list[i][k][j]"
                                type="text"
                                @change="onChange(k)"
                                :name="k"
                            />
                        </td>
                        <td>
                            <button
                                class="chart_str_default"
                                @click="onReset(i, k)"
                            >默认值</button>
                        </td>
                    </template>
                </tr>
                </tbody>
            </table>
        </div>
    </model>
</template>

<script>
    import Kline from '../js/kline';

    import Model from './Model';

    export default {
        props: ['open'],
        components: {
            Model,
        },
        data: function() {
            return {
                isMounted: false,

                list: [],
            };
        },
        mounted: function() {
            this.isMounted = true;

            Kline.on('ready', this.onReady);
            // Kline.on('resize', this.onResize);
        },
        beforeDestroy: function() {
            this.isMounted = false;
        },
        methods: {
            onReady() {
                const config = Kline.ChartSettings.get();
                const indics = config.indics;
                const list = [];
                let i = 0, c = 0;
                for(let k in indics) {
                    if (!list[i]) {
                        list[i] = {};
                    }

                    list[i][k] = indics[k];
                    ++c;

                    if (c === 2) {
                        ++i;
                        c = 0;
                    }
                }

                this.list = list;
            },
            onChange(key) {
                for(let i = 0, len = this.list.length; i < len; i++) {
                    let row = this.list[i][key];
                    if (row) {
                        this.list[i][key] = Kline.Control.setIndicatorParamByName(key, row);
                        break;
                    }
                }
            },
            onReset(i, key) {
                this.list[i][key] = Kline.Control.getIndicatorParamDefaultByName(key);
            },
            onClose() {
                this.$emit('setState', 'parameterShown', false);
            },
            onResize(width, height) {
                // let chartWidth = Kline.instance.showTrade ? (width - Kline.instance.tradeWidth) : width;

                // this.$el.style.left = ((chartWidth - 620) >> 1) + 'px';
                // this.$el.style.top = ((height - 482) >> 1) + 'px';
            }
        },
    };
</script>

