<style lang="scss">
    .chart_wrapper
        &.light
            .chart-model
                color: #333
                background-color: #f1f1f1
                border: 1px solid #e6e7ed
            .chart-model-hd
                background-color: #e6e7ed
                border-bottom-color: #e6e7ed
            svg
                g
                    stroke: #44474D
        .chart-model
            position: absolute
            top: 50%
            left: 50%
            z-index: 98
            width: 600px
            color: #d8d8d8
            background-color: #101010
            border: 1px solid #252525
            margin-left: -300px
        .chart-model-mask
            position: absolute
            top: 0
            left: 0
            z-index: 90
            width: 100%
            height: 100%
            background-color: rgba(0, 0, 0, 0.3)
        .chart-model-hd
            position: relative
            font-size: 14px
            font-weight: bold
            line-height: 38px
            border-bottom: 1px solid #252525
            &.hd-sample
                padding: 0 10px
        .chart-model-btn-close
            position: absolute
            top: 0
            right: 0
            padding: 10px
            line-height: 1
            cursor: pointer

            &:hover
                color: #fff
                svg
                    g
                        stroke: #ff7979
            svg
                g
                    stroke: #B7B8BC
        .chart-model-body
            padding: 10px
</style>

<template>
    <div class="chart-model-box" :style="modelStyle">
        <div class="chart-model-mask"></div>
        <div ref="model" class="chart-model">
            <div :class="{'chart-model-hd': true, 'hd-sample': !$slots.header}">
                <slot v-if="$slots.header" name="header" />
                <span v-else>{{title}}</span>

                <a @click="onClose" class="chart-model-btn-close">
                    <svg width="16px" height="16px" viewBox="0 0 17 15">
                        <g transform="translate(-1412, -88)">
                            <g transform="translate(393, 77)">
                                <g transform="translate(1020, 11)">
                                    <path d="M0.441176471,0.441176471 L14.5588235,14.5588235" />
                                    <path d="M14.5588235,0.441176471 L0.441176471,14.5588235" />
                                </g>
                            </g>
                        </g>
                    </svg>
                </a>
            </div>
            <slot v-if="$slots.body" name="body" />
            <div v-else class="chart-model-body">
                <slot />
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['open', 'title'],
        data: function() {
            return {
                isMounted: false,

                modelStyle: {
                    display: 'none',
                    visibility: 'visible',
                },
            };
        },
        beforeMount: function() {
            if (this.open) {
                this.modelStyle.display = 'block';
                this.modelStyle.visibility = 'hidden';
            }
        },
        mounted: function() {
            this.isMounted = true;

            if (this.open) {
                this.setCenter();
                this.modelStyle.visibility = 'visible';
            }
        },
        beforeDestroy: function() {
            this.isMounted = false;
        },
        watch: {
            open: function(n, o) {
                if (n !== o) {
                    if (!n) {
                        this.modelStyle.display = 'none';
                        this.modelStyle.visibility = 'visible';
                    } else {
                        this.modelStyle.display = 'block';
                        this.modelStyle.visibility = 'hidden';
                        this.$nextTick(function() {
                            this.setCenter();
                            this.modelStyle.visibility = 'visible';
                        });
                    }
                }
            }
        },
        methods: {
            setCenter: function() {
                const el = this.$refs.model;
                el.style.marginTop = (-el.offsetHeight / 2) + 'px';
                el.style.marginLeft = (-el.offsetWidth / 2) + 'px';
            },
            onClose: function() {
                this.$emit('close');
            }
        },
    };
</script>

