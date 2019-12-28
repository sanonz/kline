<style lang="scss">

</style>

<template>
    
</template>

<script>
    export default {
        data: function() {
            return {
                isMounted: false,
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

