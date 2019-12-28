<style lang="scss">
    .chart_wrapper
        #chart_loading
            border: 1px solid
            border-radius: 4px
            font-size: 18px
            font-weight: bold
            line-height: 48px
            overflow: hidden
            position: absolute
            text-align: center
            width: 200px
            z-index: 200
    
        &.dark
            #chart_loading
                border-color: #aaa
                background-color: rgba(0, 0, 0, 0.6)
                color: #ccc

        &.light
            #chart_loading
                border-color: #afb1b3
                background-color: rgba(244, 244, 244, 0.8)
                color: #393c40
</style>

<template>
    <!-- Loading -->
    <div id="chart_loading" class="chart_str_loading">正在读取数据...</div>
</template>

<script>
    import Kline from '../js/kline';

    export default {
        data: function() {
            return {
                isMounted: false,
            };
        },
        mounted: function() {
            this.isMounted = true;

            Kline.on('resize', this.onResize);
        },
        beforeDestroy: function() {
            this.isMounted = false;
        },
        watch: {
            //
        },
        methods: {
            onResize(width, height) {
                let chartWidth = Kline.instance.showTrade ? (width - Kline.instance.tradeWidth) : width;

                this.$el.style.left = ((chartWidth - this.$el.offsetWidth) >> 1) + 'px';
                this.$el.style.top = ((height - this.$el.offsetHeight) >> 2) + 'px';
            }
        },
    };
</script>

