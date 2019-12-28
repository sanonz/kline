<style lang="scss">
    .chart_wrapper
        #chart_toolpanel
            border-right: 1px solid
            // display: none
            position: absolute
            width: 32px
            z-index: 2
            .chart_toolpanel_separator
                position: relative
                height: 4px
            .chart_toolpanel_button
                position: relative
                z-index: 100
                &:hover
                    .chart_toolpanel_tip
                        display: block
            .chart_toolpanel_icon
                background-origin: content-box
                background-repeat: no-repeat
                border: 1px solid
                cursor: pointer
                height: 16px
                margin: 1px 4px 1px 4px
                padding: 3px
                position: relative
                width: 16px
                z-index: 101
            .chart_toolpanel_tip
                border-radius: 4px
                border: 1px solid
                display: none
                *font-weight: bold
                position: absolute
                padding: 3px 6px 4px 6px
                margin-left: 36px
                margin-top: -25px
                white-space: nowrap
                z-index: 100

        #chart_toolpanel
            #chart_Cursor
                background-position: 0 0
            #chart_CrossCursor
                background-position: 0 -20px
            #chart_SegLine
                background-position: 0 -40px
            #chart_StraightLine
                background-position: 0 -60px
            #chart_RayLine
                background-position: 0 -100px
            #chart_ArrowLine
                background-position: 0 -80px
            #chart_HoriSegLine
                background-position: 0 -160px
            #chart_HoriStraightLine
                background-position: 0 -120px
            #chart_HoriRayLine
                background-position: 0 -140px
            #chart_VertiStraightLine
                background-position: 0 -180px
            #chart_PriceLine
                background-position: 0 -200px
            #chart_TriParallelLine
                background-position: 0 -220px
            #chart_BiParallelLine
                background-position: 0 -240px
            #chart_BiParallelRayLine
                background-position: 0 -260px
            #chart_DrawFibFans
                background-position: 0 -300px
        .chart_toolpanel_button
            #chart_DrawFibRetrace
                background-position: 0 -280px

        &.dark
            #chart_toolpanel
                background-color: #0a0a0a
                border-right-color: #404040
                .chart_toolpanel_button
                    .chart_toolpanel_icon
                        background-image: url("../img/tool_d_normal.png")
                    &.selected
                        .chart_toolpanel_icon
                            background-image: url("../img/tool_d_push.png")
            .chart_toolpanel_icon
                background-color: #0a0a0a
                border-color: #0a0a0a
            .chart_toolpanel_button
                &:hover
                    .chart_toolpanel_icon
                        background-color: #404040
                        border-color: #666
                &.selected
                    .chart_toolpanel_icon
                        background-color: #080808
                        border-color: #666
            .chart_toolpanel_tip
                background-color: #ffac00
                border-color: #ffac00
                color: #0a0a0a

        &.light
            #chart_toolpanel
                background-color: #fff
                border-right-color: #afb1b3
                .chart_toolpanel_button
                    .chart_toolpanel_icon
                        border-color: #efefef
                        background-image: url("../img/tool_l_normal.png")
                    &.selected
                        .chart_toolpanel_icon
                            background-image: url("../img/tool_l_push.png")
            .chart_toolpanel_icon
                background-color: #fff
                border-color: #fff
            .chart_toolpanel_button
                &:hover
                    .chart_toolpanel_icon
                        background-color: #eee
                        border-color: #afb1b3
                &.selected
                    .chart_toolpanel_icon
                        background-color: #f4f4f4
                        border-color: #afb1b3
            .chart_toolpanel_tip
                background-color: #f27938
                border-color: #f27938
                color: #eee
</style>

<template>
    <!-- ToolPanel -->
    <div id="chart_toolpanel">
        <div class="chart_toolpanel_separator"></div>

        <div
            v-for="v in tools"
            :key="v.key"
            :class="{chart_toolpanel_button: true, selected: active === v.key}"
            @click="onClick(v.key)"
        >
            <div class="chart_toolpanel_icon" :id="`chart_${v.key}`"></div>
            <div class="chart_toolpanel_tip">
                {{v.name}}
            </div>
        </div>
        <div style="padding-left: 3px;padding-top: 10px;">
            <button
                style="color: red;"
                id="clearCanvas"
                title="Clear All"
                @click="onClear"
            >X</button>
        </div>
    </div>
</template>

<script>
    import Kline from '../js/kline';

    export default {
        data: function() {
            return {
                isMounted: false,

                active: 'CrossCursor',

                tools: [{
                    key: 'Cursor',
                    name: '光标',
                }, {
                    key: 'CrossCursor',
                    name: '十字光标',
                }, {
                    key: 'SegLine',
                    name: '线段',
                }, {
                    key: 'StraightLine',
                    name: '直线',
                }, {
                    key: 'RayLine',
                    name: '射线',
                }, {
                    key: 'ArrowLine',
                    name: '箭头',
                }, {
                    key: 'HoriSegLine',
                    name: '水平线段',
                }, {
                    key: 'HoriStraightLine',
                    name: '水平直线',
                }, {
                    key: 'HoriRayLine',
                    name: '水平射线',
                }, {
                    key: 'VertiStraightLine',
                    name: '垂直直线',
                }, {
                    key: 'PriceLine',
                    name: '价格线',
                }, {
                    key: 'TriParallelLine',
                    name: '价格通道线',
                }, {
                    key: 'BiParallelLine',
                    name: '平行直线',
                }, {
                    key: 'BiParallelRayLine',
                    name: '平行射线',
                }, {
                    key: 'DrawFibRetrace',
                    name: '斐波纳契回调',
                }, {
                    key: 'DrawFibFans',
                    name: '斐波纳契扇形',
                }],
            };
        },
        mounted: function() {
            this.isMounted = true;

            Kline.on('toolPanelChange', this.onToolPanelChange);
        },
        beforeDestroy: function() {
            this.isMounted = false;
        },
        methods: {
            onToolPanelChange(active) {
                this.active = active;
            },
            onClick(name) {
                this.active = name;
                Kline.instance.chartMgr.setRunningModeByName(name);
            },
            onClear() {
                let pDPTool = Kline.instance.chartMgr.getDataSource("frame0.k0");
                let len = pDPTool.getToolObjectCount();
                for (let i = 0; i < len; i++) {
                    pDPTool.delToolObject();
                }
                Kline.instance.chartMgr.redraw('OverlayCanvas', false);
            }
        },
    };
</script>

