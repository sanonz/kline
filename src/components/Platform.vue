<style lang="scss">
    .chart_wrapper
        &.light
            .platform-list
                border-right-color: #afb1b3

                li
                    &:hover
                        background-color: #d4d4d4
                    &.active
                        background-color: #e8e8e8
            .coin-list
                ul
                    color: #676767
                    li
                        &:hover
                            color: #333
        .chart-platform-hd
            padding: 0 10px
        .chart-platform-title
            float: left
            margin-right: 20px
            input
                width: 170px
                padding: 3px
        .chart-platform-loading
            padding: 20px 0
            color: #999
            font-size: 14px
            text-align: center
        .chart-platform-body
            display: flex
            height: 450px
            &.center-content
                justify-content: center
                align-items: center
        .platform-list, .coin-list
            line-height: 24px
            overflow-x: hidden
            overflow-y: auto
        .platform-list
            width: 120px
            line-height: 24px
            border-right: 1px solid #4c4c4c

            li
                padding: 0 10px
                cursor: pointer
                &:hover
                    background-color: #212121
                &.active
                    background-color: #313131
        .coin-list
            width: 100%
            text-transform: uppercase
            ul
                color: #b7b7b7
                margin-bottom: 20px
                padding-top: 4px
                padding-left: 10px
                overflow: hidden
            li
                float: left
                width: 96px
                cursor: pointer
                &:hover
                    color: #fff
            strong
                color: #ff3c3c
</style>

<template>
    <model
        ref="model"
        :open="open"
        title="平台切换"
        @close="onClose"
    >
        <div class="chart-platform-hd" slot="header">
            <div class="chart-platform-title">平台切换</div>
            <form
                class="chart-platform-search"
                @submit.prevent
            >
                <input
                    type="text"
                    placeholder="搜索币种/交易对/平台"
                    v-model.trim="keywords"
                />
            </form>
        </div>
        <div v-if="list" class="chart-platform-body" slot="body">
            <div class="platform-list">
                <ul ref="platforms">
                    <li :class="{active: active === 'all'}" @click="onClick('all')">全部</li>
                    <li
                        v-for="v in list"
                        :key="v.id"
                        :class="{active: active === v.id}"
                        @click="onClick(v)"
                    >
                        {{v.exchangeName}}
                    </li>
                </ul>
            </div>
            <div ref="coins" class="coin-list">
                <ul
                    v-for="c in children"
                    :key="c.id"
                >
                    <li
                        v-for="v in c"
                        :key="v.id"
                        @click="onSelected(v)"
                        v-html="v.baseCurrency + '/' + v.quoteCurrency"
                    />
                </ul>
            </div>
        </div>
        <div v-else class="chart-platform-body center-content">
            <div class="chart-platform-loading">数据加载中...</div>
        </div>
    </model>
</template>

<script>
    import axios from 'axios';

    import Model from './Model';


    export default {
        props: ['open'],
        components: {
            Model,
        },
        data: function() {
            return {
                isMounted: false,
                fetching: false,
                isChanged: false,
                isPlatform: false,

                list: null,
                active: 'all',
                keywords: '',

                modelStyle: {
                    display: 'none',
                    visibility: 'visible',
                }
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
                this.$refs.model.setCenter();
                this.fetchData();
            }
        },
        beforeDestroy: function() {
            this.isMounted = false;
        },
        computed: {
            children: function() {
                let result = [];

                if (!this.isPlatform && !!this.keywords) {
                    const list = [[], [], [], []];

                    if (this.list) {
                        if (this.active === 'all') {
                            this.list.forEach(v => this.highlight(this.keywords, v.data, list));
                        } else {
                            this.highlight(this.keywords, this.findById(this.active).data, list)
                        }
                    }

                    result = [list[0].concat(list[1]).concat(list[2]).concat(list[3])];

                    if (this.isChanged && !result[0].length) {
                        // find by platform when the children is empty
                        const keywords = this.keywords.toLowerCase();
                        for(let i = 0, len = this.list.length; i < len; i++) {
                            let v = this.list[i];
                            let active = null;
                            if (String(v.exchangeName).toLowerCase() == keywords) {
                                active = v.id;
                            } else if (String(v.exchangeName).toLowerCase().indexOf(keywords) > -1) {
                                active = v.id;
                            }

                            if (active) {
                                this.active = active;
                                result = this.findById(this.active).data;
                                if ('scrollIntoViewIfNeeded' in Element.prototype) {
                                    this.$nextTick(function() {
                                        let i = 0;
                                        let node = null;
                                        const el = this.$refs.platforms;
                                        while(node = el.children[i++]) {
                                            if (node.className.indexOf('active') > -1) {
                                                node.scrollIntoViewIfNeeded();
                                                break;
                                            }
                                        }
                                    });
                                }

                                break;
                            }
                        }

                        this.isPlatform = true;
                    }
                } else {
                    result = this.active === 'all' ? this.repeat() : this.findById(this.active).data;
                }

                this.isChanged = false;

                return result;
            }
        },
        watch: {
            open: function(n, o) {
                if (!this.list && !!n && n !== o) {
                    this.fetchData();
                }
            },
            keywords: function(n, o) {
                this.isChanged = true;
                this.isPlatform = false;
            },
        },
        methods: {
            onClick(v) {
                this.active = v === 'all' ? 'all' : v.id;
                this.$nextTick(function() {
                    this.$refs.coins.scrollTo(0, 0);
                });
            },
            onSelected(v) {
                console.log({...v});
            },
            repeat() {
                return this.list.reduce((acc, cur) => acc.concat(cur.data), []);
            },
            findById(id) {
                return this.list.find(c => c.id === id);
            },
            strip(value) {
                return value.replace(/<[^>]*>/g, '');
            },
            strong(str) {
                return `<strong>${str}</strong>`;
            },
            fetchData() {
                if (this.fetching) {
                    return;
                }

                this.fetching = true;

                return axios.get('./examples/listExchangePairInfo.json')
                    .then(response => {
                        const list = response.data.data;

                        // find first
                        // if (list[0]) {
                        //     this.active = list[0].id;
                        // }

                        this.list = list;
                    })
                    .finally(() => {
                        this.fetching = false;
                    });
            },
            onClose() {
                this.$emit('close');
            },
            highlight(keywords, data, list) {
                const words = keywords.toLowerCase().split('');
                const reg = new RegExp('^' + keywords, 'i');
                const reg2 = new RegExp(words.join('\\\w*'), 'i');

                data.forEach(r => {
                    r.forEach(c => {
                        let i = 0;
                        let o = {...c};
                        o.baseCurrency = this.strip(o.baseCurrency).toLowerCase();
                        o.quoteCurrency = this.strip(o.quoteCurrency).toLowerCase();

                        if (o.baseCurrency == keywords || o.quoteCurrency == keywords) {
                            // level 1: btc = btc
                            if (o.baseCurrency == keywords) {
                                o.baseCurrency = this.strong(o.baseCurrency);
                            }
                            if (o.quoteCurrency == keywords) {
                                o.quoteCurrency = this.strong(o.quoteCurrency);
                            }
                            list[0].push(o);
                        } else if (reg.test(o.baseCurrency) || reg.test(o.quoteCurrency)) {
                            // level 2: btc = btco
                            if (reg.test(o.baseCurrency)) {
                                o.baseCurrency = this.strong(keywords) + o.baseCurrency.substr(keywords.length);
                            }
                            if (reg.test(o.quoteCurrency)) {
                                o.quoteCurrency = this.strong(keywords) + o.quoteCurrency.substr(keywords.length);
                            }
                            list[1].push(o);
                        } else if (o.baseCurrency.indexOf(keywords) > -1 || o.quoteCurrency.indexOf(keywords) > -1) {
                            // level 3: btc = ubtc
                            if (o.baseCurrency.indexOf(keywords) > -1) {
                                o.baseCurrency = o.baseCurrency.replace(keywords, str => this.strong(str));
                            }
                            if (o.quoteCurrency.indexOf(keywords) > -1) {
                                o.quoteCurrency = o.quoteCurrency.replace(keywords, str => this.strong(str));
                            }
                            list[2].push(o);
                        } else if (reg2.test(o.baseCurrency) || reg2.test(o.quoteCurrency)) {
                            // level 4: btc = butoc
                            const fn = o => {
                                words.forEach(w => o = o.replace(w, str => `<>${str}</>`));

                                return o.replace(/<(\/?)>/g, '<$1strong>');
                            };
                            if (reg2.test(o.baseCurrency)) {
                                o.baseCurrency = o.baseCurrency.replace(reg2, fn);
                            }
                            if (reg2.test(o.quoteCurrency)) {
                                o.quoteCurrency = o.quoteCurrency.replace(reg2, fn);
                            }
                            list[3].push(o);
                        }
                    });
                });
            },
        },
    };
</script>

