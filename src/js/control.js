import Kline from './kline'
import {KlineTrade} from './kline_trade'
import {ChartManager} from './chart_manager'
import {ChartSettings} from './chart_settings'
import {DefaultTemplate, Template} from './templates'
import {MEvent} from './mevent'
import axios from 'axios';


export class Control {

    static refreshCounter = 0;
    static refreshHandler = null;

    // static refreshFunction() {
    //     Control.refreshCounter++;
    //     let lang = ChartManager.instance.getLanguage();
    //     if (Control.refreshCounter > 3600) {
    //         let num = Number(Control.refreshCounter / 3600);
    //         if (lang === "en-us") {
    //             $("#chart_updated_time_text").html(num.toFixed(0) + "h");
    //         } else if (lang === "zh-tw") {
    //             $("#chart_updated_time_text").html(num.toFixed(0) + "小時");
    //         } else {
    //             $("#chart_updated_time_text").html(num.toFixed(0) + "小时");
    //         }
    //     } else if (Control.refreshCounter > 60 && Control.refreshCounter <= 3600) {
    //         let num = Number(Control.refreshCounter / 60);
    //         if (lang === "en-us") {
    //             $("#chart_updated_time_text").html(num.toFixed(0) + "m");
    //         } else if (lang === "zh-tw") {
    //             $("#chart_updated_time_text").html(num.toFixed(0) + "分鐘");
    //         } else {
    //             $("#chart_updated_time_text").html(num.toFixed(0) + "分钟");
    //         }
    //     } else if (Control.refreshCounter <= 60) {
    //         if (lang === "en-us") {
    //             $("#chart_updated_time_text").html(Control.refreshCounter + "s");
    //         } else {
    //             $("#chart_updated_time_text").html(Control.refreshCounter + "秒");
    //         }
    //     }
    // }

    // static clearRefreshCounter() {
    //     window.clearInterval(Control.refreshHandler);
    //     Control.refreshCounter = 0;
    //     let lang = ChartManager.instance.getLanguage();
    //     if (lang === "en-us") {
    //         $("#chart_updated_time_text").html(Control.refreshCounter + "s");
    //     } else {
    //         $("#chart_updated_time_text").html(Control.refreshCounter + "秒");
    //     }
    //     Control.refreshHandler = setInterval(Control.refreshFunction, Kline.instance.intervalTime);
    // }

    static requestData(showLoading) {
        // Control.AbortRequest();
        window.clearTimeout(Kline.instance.timer);
        if (Kline.instance.paused) {
            return;
        }
        if (showLoading === true && Kline._handlers.request && Kline._handlers.request.beforeSend) {
            Kline._handlers.request.beforeSend();
        }
        if (Kline.instance.type === "stomp" && Kline.instance.stompClient) {
            Control.requestOverStomp();
        } else {
            Control.requestOverHttp();
        }
    }

    static parseRequestParam(str) {
        return JSON.parse('{"' + decodeURI(str.replace(/&/g, "\",\"").replace(/=/g, "\":\"")) + '"}')
    }

    static requestOverStomp() {
        if (!Kline.instance.socketConnected) {
            if (Kline.instance.debug) {
                console.log("DEBUG: socket is not coonnected")
            }
            return;
        }
        if (Kline.instance.stompClient && Kline.instance.stompClient.ws.readyState === 1) {
            Kline.instance.stompClient.send(Kline.instance.sendPath, {}, JSON.stringify(Control.parseRequestParam(Kline.instance.requestParam)));
            return;
        }
        if (Kline.instance.debug) {
            console.log("DEBUG: stomp client is not ready yet ...");
        }
        Kline.instance.timer = setTimeout(function () {
            Control.requestData(true);
        }, 1000);
    }

    static requestOverHttp(append) {
        if (Kline.instance.G_HTTP_REQUEST) {
            return;
        }

        if (Kline.instance.debug) {
            console.log("DEBUG: " + Kline.instance.requestParam);
        }

        Kline.instance.G_HTTP_REQUEST = axios.get(Kline.instance.url, {params: Kline.instance.requestParam})
            .then(res => {
                Control.requestSuccessHandler(res.data, append);
            })
            .catch(() => {
                Kline.instance.timer = setTimeout(function () {
                    Control.requestData(true);
                }, Kline.instance.intervalTime);
            })
            .finally(() => {
                Kline.instance.G_HTTP_REQUEST = null;
            });

        /* Kline.instance.G_HTTP_REQUEST = $.ajax({
            type: "GET",
            url: Kline.instance.url,
            dataType: 'json',
            data: Kline.instance.requestParam,
            timeout: 30000,
            created: Date.now(),
            beforeSend: function () {
                this.range = Kline.instance.range;
                this.symbol = Kline.instance.symbol;
            },
            success: function (res) {
                if (Kline.instance.G_HTTP_REQUEST) {
                    Control.requestSuccessHandler(res);
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                if (Kline.instance.debug) {
                    console.log(xhr);
                }
                if (xhr.status === 200 && xhr.readyState === 4) {
                    return;
                }
                Kline.instance.timer = setTimeout(function () {
                    Control.requestData(true);
                }, Kline.instance.intervalTime);
            },
            complete: function () {
                Kline.instance.G_HTTP_REQUEST = null;
            }
        }); */
    }

    static requestSuccessHandler(res, append) {
        if (Kline.instance.debug) {
            console.log(res);
        }
        let lines = [];
        if (res.code === 1) {
            if (res.data.kline) {
                lines = res.data.kline.map(v => ([typeof v.time_open === 'string' ? new Date(v.time_open).getTime() : v.time_open, v.quote.USD.open, v.quote.USD.high, v.quote.USD.low, v.quote.USD.close, v.quote.USD.volume].map((o, i) => i === 0 ? o : +(o / res.data.rate).toFixed(2))));
            } else {
                lines = res.data.lines;
            }
        }
        if (Kline._handlers.request && Kline._handlers.request.success) {
            Kline._handlers.request.success();
        }
        // let chart = ChartManager.instance.getChart();
        // chart.setTitle();
        // Kline.instance.data = res.data;

        let updateDataRes = Kline.instance.chartMgr.updateData("frame0.k0", lines, append);
        Kline.instance.requestParam = Control.setHttpRequestParam(Kline.instance.symbol, Kline.instance.range, null, Kline.instance.chartMgr.getDataSource("frame0.k0").getLastDate());

        let intervalTime = Kline.instance.intervalTime < Kline.instance.range ? Kline.instance.intervalTime : Kline.instance.range;

        if (!updateDataRes) {
            if (Kline.instance.type === 'poll') {
                Kline.instance.timer = setTimeout(Control.requestData, intervalTime);
            }
            return;
        }
        // if (Kline.instance.data.trades && Kline.instance.data.trades.length > 0) {
        //     KlineTrade.instance.pushTrades(Kline.instance.data.trades);
        //     KlineTrade.instance.klineTradeInit = true;
        // }
        // if (Kline.instance.data.depths) {
        //     KlineTrade.instance.updateDepth(Kline.instance.data.depths);
        // }
        // Control.clearRefreshCounter();

        /* if (Kline.instance.type === 'poll') {
            window.clearTimeout(Kline.instance.timer);
            Kline.instance.timer = setTimeout(Control.TwoSecondThread, intervalTime);
        } */

        ChartManager.instance.redraw('All', false);
    }

    static AbortRequest() {
        if (Kline.instance.type !== "stomp" || !Kline.instance.stompClient) {
            if (Kline.instance.G_HTTP_REQUEST && Kline.instance.G_HTTP_REQUEST.readyState !== 4) {
                Kline.instance.G_HTTP_REQUEST.abort();
            }
        }
    }

    static TwoSecondThread() {
        let f = Kline.instance.chartMgr.getDataSource("frame0.k0").getLastDate();

        if (f === -1) {
            Kline.instance.requestParam = Control.setHttpRequestParam(Kline.instance.symbol, Kline.instance.range, Kline.instance.limit, null);
        } else {
            Kline.instance.requestParam = Control.setHttpRequestParam(Kline.instance.symbol, Kline.instance.range, null, f.toString());
        }

        Kline.instance.requestParam.size = 50;
        Kline.instance.requestParam.endTime = ~~(Date.now() / 1000);
        Control.requestData();
    }

    static loadConfig() {
        let tmp = ChartSettings.get();
        ChartManager.instance.setChartStyle('frame0.k0', tmp.charts.chartStyle);
        let symbol = tmp.charts.symbol;
        if (!Kline.instance.init) {
            symbol = Kline.instance.symbol;
            Kline.instance.init = true;
        }
        Kline.instance.symbol = symbol;
        Control.switchSymbolSelected(symbol);
        let period = tmp.charts.period;
        Control.switchPeriod(period);

        if (tmp.charts.indicsStatus === 'close') {
            Control.switchIndic('off');
        } else if (tmp.charts.indicsStatus === 'open') {
            Control.switchIndic('on');
        }

        ChartManager.instance.getChart().setMainIndicator(tmp.charts.mIndic);
        ChartManager.instance.setThemeName('frame0', tmp.theme);
        Control.switchTools('off');
        if (tmp.theme === 'Dark') {
            Control.switchTheme('dark');
        } else if (tmp.theme === 'Light') {
            Control.switchTheme('light');
        }
        Control.chartSwitchLanguage(tmp.language || "zh-cn");
    }


    static setHttpRequestParam(symbol, range, limit, since) {
        const params = {coinCode: symbol, interval: range, size: 300};

        for(let k in Kline.instance.periodMap) {
            if (Kline.instance.periodMap[k] === range) {
                for(let o in Kline.instance.tagMapPeriod) {
                    if (Kline.instance.tagMapPeriod[o] === k) {
                        params.interval = o === '1w' ? '7d' : o;
                        break;
                    }
                }
                break;
            }
        }

        if (limit !== null) {
            params.limit = limit;
        } else {
            params.since = since;
        }

        if (KlineTrade.instance.tradeDate.getTime() !== 0) {
            const row = Kline.instance.chartMgr.getDataSource('frame0.k0').getDataAt(0);
            params.endTime = ~~((row ? row.date : KlineTrade.instance.tradeDate.getTime()) / 1000);
        }

        return params;
    }

    static refreshTemplate() {
        Kline.instance.chartMgr = DefaultTemplate.loadTemplate("frame0.k0", "");
        ChartManager.instance.redraw('All', true);
    }

    static chartSwitchLanguage(lang) {
        ChartManager.instance.setLanguage(lang);
        ChartManager.instance.getChart().setTitle();
        let tmp = ChartSettings.get();
        tmp.language = lang;
        ChartSettings.save();
        if (Kline.instance._onLangEvt) {
            Kline.instance._onLangEvt.raise(lang);
        }
    }

    static onSize(w, h) {
        if (Kline.instance._onResizeEvt) {
            let width = w || window.innerWidth;
            let height = h || window.innerHeight;
            Kline.instance._onResizeEvt.raise(width, height);
        }

        ChartManager.instance.redraw('All', true);
    }

    static mouseWheel(e) {
        e.stopPropagation();
        e.preventDefault();
        const delta = (e.wheelDelta) ? e.wheelDelta / 120 : -(e.detail || 0) / 3;
        ChartManager.instance.scale(delta > 0 ? 1 : -1);
        ChartManager.instance.redraw("All", true);
    }

    static getIndicatorParamDefaultByName(name) {
        let value = ChartManager.instance.getIndicatorParameters(name);
        let rs = [];
        for(let key in value) {
            rs.push(value[key].getDefaultValue());
        }
        ChartManager.instance.setIndicatorParameters(name, rs);
        let tmp = ChartSettings.get();
        tmp.indics[name] = rs;
        ChartSettings.save();
        ChartManager.instance.redraw('All', false);

        return rs;
    }

    static setIndicatorParamByName(name, arr) {
        let mgr = ChartManager.instance;
        mgr.setIndicatorParameters(name, arr);
        let value = mgr.getIndicatorParameters(name);
        let rs = [];
        for(let i = 0, len = arr.length; i < len; i++) {
            rs.push(value[i].getValue());
        }
        let tmp = ChartSettings.get();
        tmp.indics[name] = rs;
        ChartSettings.save();
        mgr.redraw('All', false);

        return rs;
    }

    static switchTheme(name) {
        if (name === 'dark') {
            ChartManager.instance.setThemeName('frame0', 'Dark');
            let tmp = ChartSettings.get();
            tmp.theme = 'Dark';
            ChartSettings.save();
        } else if (name === 'light') {
            ChartManager.instance.setThemeName('frame0', 'Light');
            let tmp = ChartSettings.get();
            tmp.theme = 'Light';
            ChartSettings.save();
        }

        ChartManager.instance.redraw();

        if (Kline.instance._onThemeEvt) {
            Kline.instance._onThemeEvt.raise(name);
        }
    }

    static switchTools(name) {
        if (name === 'on') {
            // 
        } else if (name === 'off') {
            ChartManager.instance.setRunningMode(ChartManager.instance._beforeDrawingTool);
            ChartManager.instance.redraw("All", true);
        }
        if (Kline.instance.isSized) {
            Control.onSize();
        } else {
            Control.onSize(Kline.instance.width, Kline.instance.height);
        }
    }

    static switchChartStyle(name) {
        let tmp = ChartSettings.get();
        tmp.charts.chartStyle = name;
        ChartSettings.save();
        let mgr = ChartManager.instance;
        mgr.setChartStyle("frame0.k0", name);
        mgr.redraw();
    }

    static switchMainIndicator(name) {
        let tmp = ChartSettings.get();
        tmp.charts.mIndic = name;
        ChartSettings.save();
        let mgr = ChartManager.instance;
        if (!mgr.setMainIndicator("frame0.k0", name))
            mgr.removeMainIndicator("frame0.k0");
        mgr.redraw();
    }

    static switchIndic(name) {
        let tmp = ChartSettings.get();
        if (name === 'on') {
            tmp.charts.indicsStatus = 'open';
            tmp.charts.indics.forEach((name, idx) => {
                ChartManager.instance.getChart().setIndicator(idx + 1, name);
            });
        } else if (name === 'off') {
            tmp.charts.indicsStatus = 'close';
            for(let i = tmp.charts.indics.length; i > 0; i--) {
                ChartManager.instance.getChart().setIndicator(i, 'NONE');
            }
        }
        ChartSettings.save();

        if (Kline.instance.isSized) {
            Control.onSize();
        } else {
            Control.onSize(Kline.instance.width, Kline.instance.height);
        }
    }

    static switchPeriod(name) {
        ChartManager.instance.showCursor();
        Control.calcPeriodWeight(name);
        if (name === 'line') {
            ChartManager.instance.getChart().strIsLine = true;
            ChartManager.instance.setChartStyle('frame0.k0', 'Line');
            ChartManager.instance.getChart().setCurrentPeriod('line');
            let settings = ChartSettings.get();
            settings.charts.period = name;
            ChartSettings.save();
        } else {
            ChartManager.instance.getChart().strIsLine = false;
            let p = Kline.instance.tagMapPeriod[name];
            ChartManager.instance.setChartStyle('frame0.k0', ChartSettings.get().charts.chartStyle);
            ChartManager.instance.getChart().setCurrentPeriod(p);
            let settings = ChartSettings.get();
            settings.charts.period = name;
            ChartSettings.save();
        }
    }

    static reset(symbol) {
        Kline.instance.symbol = symbol;

        if (Kline.instance.showTrade) {
            KlineTrade.instance.reset(symbol);
        }
    }

    static switchSymbolSelected(symbol) {
        Control.reset(symbol);
        // $(".market_chooser ul a").removeClass("selected");
        // $(".market_chooser ul a[name='" + symbol + "']").addClass("selected");
        ChartManager.instance.getChart()._symbol = symbol;
        let settings = ChartSettings.get();
        settings.charts.symbol = symbol;
        ChartSettings.save();
    }


    static switchSymbol(symbol) {
        if (Kline.instance.type === "stomp") {
            if (Kline.instance.stompClient.ws.readyState === 1) {
                Kline.instance.subscribed.unsubscribe();
                Kline.instance.subscribed = Kline.instance.stompClient.subscribe(Kline.instance.subscribePath + '/' + symbol + '/' + Kline.instance.range, Control.subscribeCallback);
            }
        }
        Control.switchSymbolSelected(symbol);
        let settings = ChartSettings.get();
        if (settings.charts.period === "line") {
            ChartManager.instance.getChart().strIsLine = true;
            ChartManager.instance.setChartStyle('frame0.k0', 'Line');
        } else {
            ChartManager.instance.getChart().strIsLine = false;
            ChartManager.instance.setChartStyle('frame0.k0', ChartSettings.get().charts.chartStyle);
        }
        ChartManager.instance.getChart().setSymbol(symbol);
    }

    static calcPeriodWeight(period) {
        let index = period;
        if (period !== 'line')
            index = Kline.instance.periodMap[Kline.instance.tagMapPeriod[period]];
        let periodWeight = ChartSettings.get().charts.period_weight;
        for (let i in periodWeight) {
            if (periodWeight[i] > periodWeight[index]) {
                periodWeight[i] -= 1;
            }
        }
        periodWeight[index] = 8;
        ChartSettings.save();
    }

    static subscribeCallback(res) {
        Control.requestSuccessHandler(JSON.parse(res.body));
    }

    static socketConnect() {
        if (!Kline.instance.stompClient || !Kline.instance.socketConnected) {
            if (Kline.instance.enableSockjs) {
                let socket = new SockJS(Kline.instance.url);
                Kline.instance.stompClient = Stomp.over(socket);
            } else {
                Kline.instance.stompClient = Stomp.client(Kline.instance.url);
            }
            Kline.instance.socketConnected = true;
        }

        if (Kline.instance.stompClient.ws.readyState === 1) {
            console.log('DEBUG: already connected');
            return;
        }

        if (!Kline.instance.debug) {
            Kline.instance.stompClient.debug = null;
        }
        Kline.instance.stompClient.connect({}, function () {
            Kline.instance.stompClient.subscribe('/user' + Kline.instance.subscribePath, Control.subscribeCallback);
            Kline.instance.subscribed = Kline.instance.stompClient.subscribe(Kline.instance.subscribePath + '/' + Kline.instance.symbol + '/' + Kline.instance.range, Control.subscribeCallback);
            Control.requestData(true);
        }, function () {
            Kline.instance.stompClient.disconnect();
            console.log("DEBUG: reconnect in 5 seconds ...");
            setTimeout(function () {
                Control.socketConnect();
            }, 5000);
        });
    }

}
