<style lang="scss">
    .chart_container
        position: relative
        height: 100%
        width: 100%

    .chart_wrapper
        position: relative
        cursor: default
        font-family: arial, sans, serif
        font-size: 12px
        &.dark
            background: #0a0a0a
        &.light
            background: #fff
            ::-webkit-scrollbar-thumb
                background-color: #e0e0e0
        a
            &:hover
                text-decoration: none
            &.chart_icon
                border: 1px solid
                height: 16px
                padding: 0
                width: 16px
                box-sizing: border-box
                &:hover
                    border-width: 2px
        ul
            list-style: none
            border: 0
            margin: 0
            padding: 0
        button
            cursor: pointer
        button, input
            outline-color: #505050
        ::-webkit-scrollbar
            width: 4px
            height: 4px
        ::-webkit-scrollbar-thumb
            background-color: #4c4c4c
        // .chart_toolbar_sep
        //     float: left
        //     height: 100%
        //     width: 16px
        // .chart_toolbar_minisep
        //     float: left
        //     height: 100%
        //     width: 4px
        .chart_dropdown
            display: inline-block
            float: left
            position: relative
            z-index: 100
        .chart_dropdown_t
            background-origin: content-box
            background-repeat: no-repeat
            border: 1px solid
            border-bottom-width: 0
            margin-top: 3px
            padding-right: 10px
            z-index: 101
            position: relative
            a
                display: inline-block
                padding: 3px 12px 5px 10px
        .chart_dropdown_data
            border: 1px solid
            display: none
            position: absolute
            padding: 6px 8px 6px 8px
            margin-top: -1px
            z-index: 100
            table
                border-collapse: collapse
                font-weight: normal
                white-space: nowrap
                tr
                    &:last-child
                        td
                            border-bottom: 0
            td
                border-bottom: 1px solid
                padding: 8px 6px
                vertical-align: top
                // &.marketName_
                //     a
                //         &.dark
                //             color: #fff
                //         &.light
                //             color: #000
            li
                white-space: nowrap
                display: inline-block
            a
                text-decoration: none
                cursor: pointer
                padding: 5px 6px 5px 6px
                &.chart_icon
                    display: inline-block
                    margin: 0 6px 0 6px
        .chart_dropdown-hover
            &.chart_dropdown_data
                display: block

        #chart_toolbar_theme
            float: left
            padding: 0 8px
            a
                &.chart_icon
                    cursor: pointer
                    float: left
                    margin: 6px 4px
        #chart_select_theme
            td
                &:last-child
                    padding: 6px 6px 0 8px
            li
                padding: 0 4px 0 4px
        #chart_updated_time
            float: right
            margin: 4px 3px
            padding: 3px 10px

        input[type=text]
            width: 12em
    // .chart_container div,
    .chart_container ul,
    .chart_container form
        margin: 0
        padding: 0
    // #chart_dom_elem_cache
    //     *font-weight: bold
    //     position: absolute
    //     visibility: hidden
    //     z-index: -1

    .market_chooser
        .chart_dropdown_data
            width: 370px
            td
                border-bottom: 1px solid
                padding: 1px 6px !important
                vertical-align: top
                line-height: 24px
        li
            float: left
            width: 80px
            height: 24px
            line-height: 24px
    #chart_dropdown_symbols
        .chart_dropdown_data
            td
                padding: 8px 6px 0 6px
            li
                display: block
                height: 26px
            a
                cursor: pointer
    #chart_dropdown_themes
        .chart_dropdown_data
            td
                &:first-child
                    padding: 6px 1px 7px 6px

    .chart_wrapper a.chart_icon_theme_dark,
    .chart_wrapper .chart_dropdown_data li a.chart_icon_theme_dark:hover
        background-color: #000
    .chart_wrapper a.chart_icon_theme_light,
    .chart_wrapper .chart_dropdown_data li a.chart_icon_theme_light:hover
        background-color: #fff

    #chart_canvasGroup
        position: absolute
        z-index: 0
    #chart_mainCanvas
        overflow: hidden
        position: absolute
        z-index: 0
    #chart_overlayCanvas
        overflow: hidden
        position: absolute
        z-index: 2
    .chart_wrapper input,
    .chart_wrapper button
        border-radius: 4px
        border: 1px solid
        padding: 4px
    .chart_wrapper input[type=button],
    .chart_wrapper input[type=submit],
    .chart_wrapper button
        font-family: arial, sans, serif
        padding: 4px 8px
        cursor: pointer
    .chart_wrapper.dark input,
    .chart_wrapper.dark button
        background-color: #151515
        border-color: #333
        color: #ccc
    .chart_wrapper.light input,
    .chart_wrapper.light button
        background-color: #ddd
        border-color: #ddd
        color: #222
    .chart_BoxSize
        width: 20px
        height: 20px
    // .m_righttop
    //     position: fixed
    //     top: 0
    //     height: 41px
    //     line-height: 41px
    //     width: 230px
    //     text-align: right
    //     padding-right: 20px
    //     font-size: 16px
    //     color: #f78d15
    //     font-family: Gotham, "Helvetica Neue", Helvetica, Arial, sans-serif
    //     em
    //         width: 123px
    //         height: 28px
    //         background-position: 0 0
    //         display: block
    //         float: right
    //         margin-top: 5px
    // .dark
    //     .m_righttop
    //         em
    //             background-position: 0 0
    // .m_rightbot
    //     height: 22px
    //     line-height: 22px
    //     border-top: 1px solid #404040
    //     width: 230px
    //     text-align: right
    //     padding-right: 20px
    //     background-color: #0a0a0a
    //     border-bottom-color: #404040
    // .light
    //     .container
    //         span
    //             color: #333
    //         a
    //             text-decoration: none
    //             color: #1478c8
    //             font-family: Arial, sans, serif

    // .container
    //     .nav
    //         margin: 0
    //         list-style: none
    //         padding: 0 0 0 3px
    //         height: 41px
    //         li
    //             display: inline-block
    //             margin-right: 9px
    //     a
    //         text-decoration: none
    //         color: #6BF
    //         font-family: Arial, sans, serif
    //         &:hover
    //             text-decoration: underline
    //         &.active
    //             color: #FC9
    //     span
    //         margin-left: 3px
    //         font-family: Consolas, monospace
    //         color: #ccc
</style>

<template>
    <div :class="`chart_wrapper ${themeActive}`">
        <order
            v-if="orderShown"
            :class="themeActive"
        />

        <div ref="chart" class="chart_container">
            <!-- <div id="chart_dom_elem_cache"></div> -->

            <tool-bar
                :ranges="ranges"
                :tabBarShown="tabBarShown"
                :toolPanelShown="toolPanelShown"
                :parameterShown="parameterShown"
                :platformShown="platformShown"
                :style="makeStyle(toolBarRect)"
                @zoom="onZoom"
                @setState="setState"
            />
            <tool-panel
                v-show="toolPanelShown"
                :style="makeStyle(toolPanelRect)"
            />

            <div
                id="chart_canvasGroup"
                class="temp"
                :style="makeStyle(canvasGroupRect)"
            >
                <canvas
                    ref="main"
                    id="chart_mainCanvas"
                    class="chart_canvas"
                    style="cursor: default;"
                />
                <canvas
                    ref="overlay"
                    id="chart_overlayCanvas"
                    class="chart_canvas"
                    style="cursor: default;"
                    @contextmenu.prevent.stop=""
                    @mousedown="onOverlayMouseDown"
                    @mousemove="onOverlayMouseMove"
                    @mouseup="onOverlayMouseUp"
                    @mouseleave="onOverlayMouseLeave"
                    @mousewheel="onOverlayMouseWheel"
                />
            </div>

            <tab-bar
                v-show="tabBarShown"
                :style="makeStyle(tabBarRect)"
            />

            <loading v-show="loading" />
        </div>

        <parameter-settings
            :open="parameterShown"
            @setState="setState"
        />

        <!-- <platform
            :open="platformShown"
            @setState="setState"
            @close="setState('platformShown', false)"
        /> -->
    </div>
</template>

<script>
    import Kline from '../js/kline';

    import ToolBar from './ToolBar';
    import ToolPanel from './ToolPanel';
    import TabBar from './TabBar';
    import Order from './Order';
    import parameterSettings from './parameterSettings';
    import Loading from './Loading';
    // import Platform from './Platform';

    const htmlStyle = {
        width: '100%',
        height: '100%',
        overflow: 'hidden'
    };
    const bodyStyle =  {
        position: 'fixed',
        left: '0',
        right: '0',
        top: '0',
        bottom: '0',
        width: '100%',
        height: '100%',
        zIndex: '10000'
    };
    // const fscEvents = [
    //     'fullscreenchange',
    //     'webkitfullscreenchange',
    //     'mozfullscreenchange',
    //     'MSFullscreenChange',
    // ];

    export default {
        components: {
            ToolBar,
            ToolPanel,
            TabBar,
            Order,
            parameterSettings,
            Loading,
            // Platform,
        },
        props: {
            width: {
                type: Number,
                required: false,
                default: 0,
            },
            height: {
                type: Number,
                required: false,
                default: 0,
            },
            url: {
                type: String,
                required: false,
                default: 'examples/lines.json',
            },
            symbol: {
                type: String,
                required: true,
            },
            orderShown: {
                type: Boolean,
                required: false,
                default: true,
            },
            theme: {
                type: String,
                required: false,
                default: 'dark',
            },
            language: {
                type: String,
                required: false,
                default: 'zh-cn',
            },
            ranges: {
                type: Array,
                required: false,
                default: function() {
                    return ["1w", "1d", "1h", "30m", "15m", "5m", "1m", "line"];
                },
            },
        },
        data: function() {
            return {
                isMounted: false,

                themeActive: null,

                loading: false,
                tabBarShown: true,
                toolPanelShown: false,
                parameterShown: false,
                platformShown: false,

                tabBarRect: {x: 0, y: 0, w: 0, h: 0},
                toolBarRect: {x: 0, y: 0, w: 0, h: 0},
                toolPanelRect: {x: 0, y: 0, w: 0, h: 0},
                canvasGroupRect: {x: 0, y: 0, w: 0, h: 0},
            };
        },
        created: function() {
            window.addEventListener('resize', this.onSize);
            document.addEventListener('keyup', this.onKeyUp);
            // fscEvents.forEach(k => document.addEventListener(k, this.onFullScreenChange));
        },
        mounted: function() {
            this.isMounted = true;
            this.themeActive = this.theme;

            const kline = new Kline({
                mainCanvas: this.$refs.main,
                overlayCanvas: this.$refs.overlay,

                width: this.width,
                height: this.height,
                theme: this.theme, // light/dark
                language: this.language, // zh-cn/en-us/zh-tw
                ranges: this.ranges,
                symbol: this.symbol,
                symbolName: "BTC/USD",
                type: "poll", // poll/socket
                url: this.url,
                // type: "stomp",
                // url: 'https://www.bcoin.sg/v1/socket',
                limit: 1000,
                intervalTime: 5000,
                debug: false,
                showTrade: this.orderShown,
            });

            kline.onRequest({beforeSend: this.onRequestbeforeSend, success: this.onRequestSuccess});
            kline.onResize(this.onResize);
            kline.onThemeChange(this.onThemeChange);
            kline.onShowTradeChange(this.onShowTrade);
            kline.draw();
            // kline.pause();

            if (process.env.NODE_ENV !== 'production') {
                window.kline = kline;
            }
        },
        beforeDestroy: function() {
            this.isMounted = false;
            window.removeEventListener('resize', this.onSize);
            document.removeEventListener('keyup', this.onKeyUp);
            // fscEvents.forEach(k => document.removeEventListener(k, this.onFullScreenChange));

            if (Kline.instance) {
                Kline.instance.destroy();
            }
        },
        methods: {
            setState(key, value) {
                this[key] = value;
            },
            getCurrentFullScreenElement() {
                return document.webkitCurrentFullScreenElement ||
                    document.webkitFullscreenElement ||
                    document.mozFullScreenElement ||
                    document.msFullscreenElement;
            },
            onZoom() {
                this.polyfill();

                if (this.$el.requestFullscreen) {
                    if (this.getCurrentFullScreenElement() === this.$el) {
                        document.exitFullscreen();
                    } else {
                        this.$el.requestFullscreen();
                    }
                } else {
                    let k;
                    Kline.instance.isSized = !Kline.instance.isSized;
                    if (Kline.instance.isSized) {
                        for(k in bodyStyle) {
                            this.$el.style[k] = bodyStyle[k];
                        }

                        Kline.Control.onSize();

                        for(k in htmlStyle) {
                            document.body.style[k] = htmlStyle[k];
                            document.documentElement.style[k] = htmlStyle[k];
                        }
                    } else {
                        for(k in bodyStyle) {
                            this.$el.style[k] = '';
                        }
                        for(k in htmlStyle) {
                            document.body.style[k] = '';
                            document.documentElement.style[k] = '';
                        }

                        Kline.Control.onSize(Kline.instance.width, Kline.instance.height);
                        this.$el.style.height = Kline.instance.height + 'px';
                    }
                }
            },
            onKeyUp(e) {
                if (e.keyCode === 46) {
                    const mgr = Kline.instance.chartMgr;
                    mgr.deleteToolObject();
                    mgr.redraw('OverlayCanvas', false);
                }
            },
            onOverlayMouseDown(e) {
                const mgr = Kline.instance.chartMgr;
                if (e.which !== 1) {
                    mgr.deleteToolObject();
                    mgr.redraw('OverlayCanvas', false);
                    return;
                }
                Kline.instance.buttonDown = true;
                let r = e.target.getBoundingClientRect();
                let x = e.clientX - r.left;
                let y = e.clientY - r.top;
                mgr.onMouseDown("frame0", x, y);
            },
            onOverlayMouseMove(e) {
                e.preventDefault();
                let r = e.target.getBoundingClientRect();
                let x = e.clientX - r.left;
                let y = e.clientY - r.top;
                const mgr = Kline.instance.chartMgr;
                if (Kline.instance.buttonDown === true) {
                    mgr.onMouseMove("frame0", x, y, true);
                    mgr.redraw("All", false);
                } else {
                    mgr.onMouseMove("frame0", x, y, false);
                    mgr.redraw("OverlayCanvas");
                }
            },
            onOverlayMouseUp(e) {
                if (e.which !== 1) {
                    return;
                }
                Kline.instance.buttonDown = false;
                let r = e.target.getBoundingClientRect();
                let x = e.clientX - r.left;
                let y = e.clientY - r.top;
                const mgr = Kline.instance.chartMgr;
                mgr.onMouseUp("frame0", x, y);
                mgr.redraw("All");
            },
            onOverlayMouseLeave(e) {
                let r = e.target.getBoundingClientRect();
                let x = e.clientX - r.left;
                let y = e.clientY - r.top;
                const mgr = Kline.instance.chartMgr;
                mgr.onMouseLeave("frame0", x, y, false);
                mgr.redraw("OverlayCanvas");
            },
            onOverlayMouseWheel(e) {
                if (Kline.instance.chartMgr._captureMouseWheelDirectly) {
                    Kline.Control.mouseWheel(e);
                }
            },
            makeStyle(rect) {
                return {
                    left: rect.x + 'px',
                    top: rect.y + 'px',
                    width: rect.w + 'px',
                    height: rect.h + 'px',
                }
            },
            onRequestbeforeSend() {
                this.loading = true;
            },
            onRequestSuccess() {
                this.loading = false;
            },
            onThemeChange: function(theme) {
                this.themeActive = theme;
            },
            onShowTrade(show) {
                this.orderShown = show;
            },
            onSize() {
                let width, height;
                if (this.getCurrentFullScreenElement()) {
                    width = window.innerWidth;
                    height = window.innerHeight;
                } else {
                    width = this.width || window.innerWidth;
                    height = this.height || window.innerHeight;
                }

                Kline.instance.resize(width, height);
            },
            onResize(width, height) {
                this.$el.style.width = width + 'px';
                this.$el.style.height = height + 'px';

                let tabBarShown = this.tabBarShown;
                let toolPanelShown = this.toolPanelShown;
                let chartWidth = Kline.instance.showTrade ? (width - Kline.instance.tradeWidth) : width;

                this.$refs.chart.style.width = chartWidth + 'px';

                this.toolBarRect.x = 0;
                this.toolBarRect.y = 0;
                this.toolBarRect.w = chartWidth;
                this.toolBarRect.h = 29;

                this.toolPanelRect.x = 0;
                this.toolPanelRect.y = this.toolBarRect.h + 1;
                this.toolPanelRect.w = toolPanelShown ? 32 : 0;
                this.toolPanelRect.h = height - this.toolPanelRect.y;

                this.tabBarRect.w = toolPanelShown ? chartWidth - (this.toolPanelRect.w + 1) : chartWidth;
                this.tabBarRect.h = tabBarShown ? 23 : 0;
                this.tabBarRect.x = chartWidth - this.tabBarRect.w;
                this.tabBarRect.y = height - (this.tabBarRect.h + 1);

                this.canvasGroupRect.x = this.tabBarRect.x;
                this.canvasGroupRect.y = this.toolPanelRect.y;
                this.canvasGroupRect.w = this.tabBarRect.w;
                this.canvasGroupRect.h = this.tabBarRect.y - this.toolPanelRect.y;

                this.$refs.main.width = this.canvasGroupRect.w;
                this.$refs.main.height = this.canvasGroupRect.h;
                this.$refs.overlay.width = this.canvasGroupRect.w;
                this.$refs.overlay.height = this.canvasGroupRect.h;
            },
            polyfill() {
                if (!this.$el.requestFullscreen) {
                    this.$el.requestFullscreen  = this.$el.requestFullscreen ||
                        this.$el.webkitRequestFullscreen ||
                        this.$el.msRequestFullscreen;
                }
                if (!document.exitFullscreen) {
                    document.exitFullscreen = document.exitFullscreen ||
                        document.webkitExitFullscreen ||
                        document.mozCancelFullScreen ||
                        document.msExitFullscreen;
                }
            },
        },
    };
</script>
