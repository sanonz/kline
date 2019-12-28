<style lang="scss">
    .chart_wrapper
        #chart_toolbar
            border-bottom: 1px solid
            *font-weight: bold
            height: 29px
            position: absolute
            z-index: 3
    
        #chart_toolbar_periods_horz
            display: inline-block
            float: left
            position: relative
            z-index: 100
        #chart_toolbar_periods_vert
            float: left

        .chart_toolbar_label
            cursor: default
            display: inline-block
            float: left
            padding: 7px 4px
        .chart_toolbar_button
            border: 1px solid
            cursor: pointer
            float: left
            margin: 3px 2px
            padding: 3px 10px
            position: relative
            z-index: 100
        .chart_toolbar_tabgroup
            float: left
            li
                display: inline-block
                padding: 4px 0
                margin: 3px 0
                a
                    cursor: pointer
                    padding: 4px 4px
                    &:hover
                        text-decoration: none
    
        &.dark
            #chart_toolbar
                border-bottom-color: #404040
                .chart_BoxSize
                    background: url("../img/size_d.png") no-repeat
            .chart_dropdown_t
                background-image: url("../img/dropdown_w.png")
                background-position: right 9px
                border-color: #0a0a0a
                color: #e5e5e5
            .chart_dropdown-hover
                &.chart_dropdown_t
                    background-color: #0a0a0a
                    background-image: url("../img/dropup_w.png")
                    background-position: right 8px
                    border-color: #606060
                    color: #fff
            .chart_dropdown_data
                background-color: rgba(10, 10, 10, 0.8)
                border-color: #606060
                td
                    border-bottom-color: #404040
                    color: #e5e5e5
                li
                    a
                        color: #1987da
                        &:hover
                            background-color: #383838
                        &.selected
                            color: #ffac00
            .chart_toolbar_label
                border-color: #232323
                color: #e5e5e5
            .chart_toolbar_button
                border-color: #404040
                color: #e5e5e5
                &:hover
                    background-color: #383838
                    border-color: #606060
                    color: #fff
                &.selected
                    background-color: #383838
                    border-color: #606060
                    color: #ffac00
                    &:hover
                        background-color: #474747
                        border-color: #808080
                        color: #ffac00
            .chart_toolbar_tabgroup
                li
                    a
                        color: #1987da
                        &:hover
                            background-color: #383838
                        &.selected
                            color: #ffac00
            a
                &.chart_icon
                    border-color: #aaa
                    &:hover
                        border-color: #1987da
                    &.selected
                        border-color: #ffac00
            #chart_updated_time
                color: #e5e5e5

        &.light
            #chart_toolbar
                border-bottom-color: #afb1b3
                .chart_BoxSize
                    background: url("../img/size_l.png") no-repeat
            .chart_dropdown_t
                background-image: url("../img/dropdown_b.png")
                background-position: right 10px
                border-color: #fff
                color: #393c40
            .chart_dropdown-hover
                &.chart_dropdown_t
                    background-color: #fff
                    background-image: url("../img/dropup_b.png")
                    background-position: right 9px
                    border-color: #4c4f53
                    color: #393c40
            .chart_dropdown_data
                background-color: #fff
                border-color: #4c4f53
                td
                    border-bottom-color: #e4e5e6
                    color: #393c40
                li
                    a
                        color: #1478c8
                a
                    &:hover
                        background-color: #f4f4f4
                    &.selected
                        color: #f27935
            .chart_toolbar_label
                border-color: #fff
                color: #393c40
            .chart_toolbar_button
                border-color: #ccc
                color: #393c40
                &:hover
                    background-color: #f4f4f4
                    color: #393c40
                &.selected
                    background-color: #f4f4f4
                    border-color: #f27935
                    color: #f27935
            .chart_toolbar_tabgroup
                li
                    a
                        color: #1478c8
                        &:hover
                            background-color: #f4f4f4
                        &.selected
                            color: #f27935
            a
                &.chart_icon
                    border-color: #aaa
                    &.selected
                        border-color: #f27935
            #chart_updated_time
                color: #393c40
</style>

<template>
    <!-- ToolBar -->
    <div id="chart_toolbar">
        <!-- <div class="chart_toolbar_minisep"></div> -->
        <!-- Periods -->
        <dropdown
            id="chart_toolbar_periods_vert"
            titleClass="chart_str_period"
            title="周期"
        >
            <table>
                <tbody>
                <tr>
                    <td>
                        <ul>
                            <li
                                v-for="v in periods"
                                :key="v.key"
                                v-show="ranges.indexOf(v.key) != -1"
                                :id="`chart_period_${v.key}_v`"
                            >
                                <a
                                    :class="{selected: periodActive === v.key}"
                                    @click.prevent="onPeriodClick(v.key)"
                                >{{v.name}}</a>
                            </li>
                        </ul>
                    </td>

                </tr>

                <tr>
                    <td>
                        <ul>
                            <li
                                v-for="v in periods2"
                                :key="v.key"
                                v-show="ranges.indexOf(v.key) != -1"
                                :id="`chart_period_${v.key}_v`"
                                style="display:none;"
                            >
                                <a
                                    :class="{selected: periodActive === v.key}"
                                    @click.prevent="onPeriodClick(v.key)"
                                >{{v.name}}</a>
                            </li>
                        </ul>
                    </td>
                </tr>
                </tbody>
            </table>
        </dropdown>

        <div id="chart_toolbar_periods_horz">
            <ul class="chart_toolbar_tabgroup" style="padding-left:5px; padding-right:11px;">
                <li
                    v-for="v in periodAll"
                    :key="v.key"
                    v-show="ranges.indexOf(v.key) != -1"
                    :id="`chart_period_${v.key}_v`"
                    style="display:none;"
                >
                    <a
                        :class="{selected: periodActive === v.key}"
                        @click.prevent="onPeriodClick(v.key)"
                    >{{v.name}}</a>
                </li>
            </ul>
        </div>
        <div
            id="chart_show_indicator"
            :class="{chart_toolbar_button: true, chart_str_indicator_cap: true, selected: tabBarShown}"
            @click="onSwitchIndicator"
        >技术指标</div>
        <div
            id="chart_show_tools"
            :class="{chart_toolbar_button: true, chart_str_tools_cap: true, selected: toolPanelShown}"
            @click="onToggleTools"
        >画线工具</div>
        <!-- <div
            :class="{chart_toolbar_button: true, chart_str_tools_cap: true}"
            @click="$emit('setState', 'platformShown', !platformShown)"
        >交易市场</div> -->
        <div id="chart_toolbar_theme">
            <div class="chart_toolbar_label chart_str_theme_cap">
                主题选择
            </div>
            <a
                v-for="v in themes"
                :key="v"
                :name="v"
                :class="{chart_icon: true, [`chart_icon_theme_${v}`]: true, selected: themeActive === v}"
                @click="onSwitchTheme(v)"
            />
        </div>

        <dropdown
            id="chart_dropdown_settings"
            titleClass="chart_str_settings"
            title="更多"
        >
            <table>
                <tbody>
                <tr id="chart_select_main_indicator">
                    <td class="chart_str_main_indicator">主指标</td>
                    <td>
                        <ul>
                            <li
                                v-for="v in indicators"
                                :key="v"
                            >
                                <a
                                    :name="v"
                                    :class="{selected: mIndicatorActive === v}"
                                    @click="onSwitchMainIndicator(v)"
                                >{{v}}</a>
                            </li>
                        </ul>
                    </td>
                </tr>

                <tr id="chart_select_chart_style">
                    <td class="chart_str_chart_style">主图样式</td>
                    <td>
                        <ul>
                            <li
                                v-for="v in chartStyles"
                                :key="v"
                            >
                                <a
                                    :name="v"
                                    :class="{selected: chartStyleActive === v}"
                                    @click="onSwitchStyle(v)"
                                >{{v}}</a>
                            </li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td>
                        <ul>
                            <li>
                                <a
                                    id="chart_btn_parameter_settings"
                                    class="chart_str_indicator_parameters"
                                    @click="onToggleToolPanel"
                                >指标参数设置</a>
                            </li>
                        </ul>
                    </td>
                </tr>
                </tbody>
            </table>
        </dropdown>


        <!-- <dropdown
            id="chart_language_setting_div"
            titleClass="chart_language_setting"
            title="语言(LANG)"
        >
            <ul>
                <li
                    v-for="v in languages"
                    :key="v.key"
                    style="height: 25px;"
                >
                    <a
                        :name="v.key"
                        :class="{selected: langActive === v.key}"
                    >{{v.name}}</a>
                </li>
            </ul>
        </dropdown> -->
        
        <div id="chart_updated_time">
            <div
                id="sizeIcon"
                class="chart_BoxSize"
                @click="onZoom"
            ></div>
        </div>
    </div>
</template>

<script>
    import Kline from '../js/kline';

    import Dropdown from './Dropdown';


    export default {
        components: {
            Dropdown,
        },
        props: ['ranges', 'tabBarShown', 'toolPanelShown', 'parameterShown', 'platformShown'],
        data: function() {
            return {
                isMounted: false,

                langActive: null,
                periodActive: null,
                mIndicatorActive: null,
                chartStyleActive: null,
                themeActive: null,

                periods: [{
                    key: '1w',
                    name: '周线',
                }, {
                    key: '3d',
                    name: '3日',
                }, {
                    key: '1d',
                    name: '日线',
                }, {
                    key: '12h',
                    name: '12小时',
                }, {
                    key: '6h',
                    name: '6小时',
                }, {
                    key: '4h',
                    name: '4小时',
                }, {
                    key: '2h',
                    name: '2小时',
                }, {
                    key: '1h',
                    name: '1小时',
                }],
                periods2: [{
                    key: '30m',
                    name: '30分钟',
                }, {
                    key: '15m',
                    name: '15分钟',
                }, {
                    key: '5m',
                    name: '5分钟',
                }, {
                    key: '3m',
                    name: '3分钟',
                }, {
                    key: '1m',
                    name: '1分钟',
                }, {
                    key: 'line',
                    name: '分时',
                }],

                indicators: [
                    'MA',
                    'EMA',
                    'BOLL',
                    'SAR',
                    'None',
                ],

                chartStyles: [
                    'CandleStick',
                    'CandleStickHLC',
                    'OHLC',
                ],

                languages: [
                    {
                        key: 'zh-cn',
                        name: '简体中文(zh-CN)',
                    },
                    {
                        key: 'en-us',
                        name: 'English(en-US)',
                    },
                    {
                        key: 'zh-tw',
                        name: '繁體中文(zh-HK)',
                    },
                ],

                themes: ['dark', 'light'],
            };
        },
        mounted: function() {
            this.isMounted = true;

            Kline.on('ready', this.onReady);
            Kline.on('resize', this.onResize);
        },
        beforeDestroy: function() {
            this.isMounted = false;
        },
        computed: {
            periodAll: function() {
                return this.periods.concat(this.periods2);
            },
        },
        methods: {
            onReady() {
                const config = Kline.ChartSettings.get();
                this.langActive = config.language;
                this.themeActive = String(config.theme).toLowerCase();
                this.periodActive = config.charts.period;
                this.mIndicatorActive = config.charts.mIndic;
                this.chartStyleActive = config.charts.chartStyle;
            },
            onZoom() {
                this.$emit('zoom');
            },
            onSwitchTLang(name) {
                if (name === 'zh-cn') {
                    Kline.Control.chartSwitchLanguage('zh-cn');
                } else if (name === 'en-us') {
                    Kline.Control.chartSwitchLanguage('en-us');
                } else if (name === 'zh-tw') {
                    Kline.Control.chartSwitchLanguage('zh-tw');
                }
            },
            onSwitchTheme(name) {
                this.themeActive = name;
                if (name === 'dark') {
                    Kline.Control.switchTheme('dark');
                } else if (name === 'light') {
                    Kline.Control.switchTheme('light');
                }
            },
            onSwitchStyle(name) {
                this.chartStyleActive = name;
                Kline.Control.switchChartStyle(name);
            },
            onSwitchMainIndicator(name) {
                this.mIndicatorActive = name;
                Kline.Control.switchMainIndicator(name);
            },
            onSwitchIndicator() {
                this.$emit('setState', 'tabBarShown', !this.tabBarShown);
                this.$nextTick(function() {
                    if (this.tabBarShown) {
                        Kline.Control.switchIndic('on');
                    } else {
                        Kline.Control.switchIndic('off');
                    }
                });
            },
            onToggleTools() {
                this.$emit('setState', 'toolPanelShown', !this.toolPanelShown);
                this.$nextTick(function() {
                    if (this.toolPanelShown) {
                        Kline.Control.switchTools('on');
                    } else {
                        Kline.Control.switchTools('off');
                    }
                });
            },
            onToggleToolPanel() {
                this.$emit('setState', 'parameterShown', !this.parameterShown);
            },
            onPeriodClick(name) {
                this.periodActive = name;
                Kline.Control.switchPeriod(name);
            },
            onResize(width, height) {
                // let chartWidth = Kline.instance.showTrade ? (width - Kline.instance.tradeWidth) : width;

                // let domElemCache = $('#chart_dom_elem_cache');
                // let rowTheme = $('#chart_select_theme')[0];
                // let rowTools = $('#chart_enable_tools')[0];
                // let rowIndic = $('#chart_enable_indicator')[0];
                // let periodsVert = $('#chart_toolbar_periods_vert');
                // let periodsHorz = $('#chart_toolbar_periods_horz')[0];
                // let showIndic = $('#chart_show_indicator')[0];
                // let showTools = $('#chart_show_tools')[0];
                // let selectTheme = $('#chart_toolbar_theme')[0];
                // let dropDownSettings = $('#chart_dropdown_settings');
                // let periodsVertNW = periodsVert[0].offsetWidth;
                // let periodsHorzNW = periodsVertNW + periodsHorz.offsetWidth;
                // let showIndicNW = periodsHorzNW + showIndic.offsetWidth + 4;
                // let showToolsNW = showIndicNW + showTools.offsetWidth + 4;
                // let selectThemeNW = showToolsNW + selectTheme.offsetWidth;
                // let dropDownSettingsW = dropDownSettings.find(".chart_dropdown_t")[0].offsetWidth + 150;
                // periodsVertNW += dropDownSettingsW;
                // periodsHorzNW += dropDownSettingsW;
                // showIndicNW += dropDownSettingsW;
                // showToolsNW += dropDownSettingsW;
                // selectThemeNW += dropDownSettingsW;
                // if (chartWidth < periodsHorzNW) {
                //     domElemCache.append(periodsHorz);
                // } else {
                //     periodsVert.after(periodsHorz);
                // }
                // if (chartWidth < showIndicNW) {
                //     domElemCache.append(showIndic);
                //     rowIndic.style.display = "";
                // } else {
                //     dropDownSettings.before(showIndic);
                //     rowIndic.style.display = "none";
                // }
                // if (chartWidth < showToolsNW) {
                //     domElemCache.append(showTools);
                //     rowTools.style.display = "";
                // } else {
                //     dropDownSettings.before(showTools);
                //     rowTools.style.display = "none";
                // }
                // if (chartWidth < selectThemeNW) {
                //     domElemCache.append(selectTheme);
                //     rowTheme.style.display = "";
                // } else {
                //     dropDownSettings.before(selectTheme);
                //     rowTheme.style.display = "none";
                // }
            }
        },
    };
</script>

