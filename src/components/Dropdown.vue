<style lang="scss">

</style>

<template>
    <div
        class="chart_dropdown"
        @mouseenter="isHover=true"
        @mouseleave="isHover=false"
    >
        <div
            :class="{chart_dropdown_t: true, 'chart_dropdown-hover': isHover}"
        >
            <a class="chart_language_setting">{{title}}</a>
        </div>
        <div :class="{chart_dropdown_data: true, 'chart_dropdown-hover': isHover}">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['title'],
        data: function() {
            return {
                isMounted: false,

                isHover: false,
            };
        },
        mounted: function() {
            this.isMounted = true;
        },
        beforeDestroy: function() {
            this.isMounted = false;
        },
        watch: {
            //
        },
        methods: {
            //
        },
    };
</script>

