<style lang="scss">
    .trade_container
        width: 250px
        height: 100%
        float: right
        z-index: 99999
        font-size: 12px
        overflow: hidden
        &.dark
            color: #f1f1f1
        &.light
            color: #000
            .m_guadan
                border-left: 1px solid #afb1b3
        .green
            color: #0F0
        .red
            color: #F00
        .m_guadan
            display: flex
            flex-direction: column
            height: 100%
            border-left: 1px solid #404040
            overflow: hidden
            a
                font-weight: bold
                text-decoration: none
        .symbol-title
            font-size: 14px
            font-weight: bold
            text-align: center
            height: 16px
            line-height: 16px
            font-family: Arial, sans, serif
            padding: 5px
            .dark
                color: #6BF
            .infoDepth
                margin-left: 8px
                color: #f78d15
            a
                &:hover
                    text-decoration: underline
</style>

<template>
    <div class="trade_container">
        <div class="m_guadan">
            <div class="symbol-title">
                <a class="dark">{{symbolName}}</a>
            </div>
            <depths />
            <trades />
        </div>
    </div>
</template>

<script>
    import Kline from '../js/kline';

    import Trades from './Trades';
    import Depths from './Depths';

    export default {
        components: {
            Trades,
            Depths,
        },
        data: function() {
            return {
                isMounted: false,

                symbolName: '',
            };
        },
        mounted: function() {
            this.isMounted = true;

            Kline.on('ready', this.onReady);
        },
        beforeDestroy: function() {
            this.isMounted = false;
        },
        watch: {
            //
        },
        methods: {
            onReady() {
                this.symbolName = Kline.instance.symbolName;
            },
        },
    };
</script>

