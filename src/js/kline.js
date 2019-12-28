import {MEvent} from './mevent'
import {Control} from './control'
import {KlineTrade} from './kline_trade'
import {ChartManager} from './chart_manager'
import {ChartSettings} from './chart_settings'


export default class Kline {

    static Control = Control;
    static ChartSettings = ChartSettings;

    static created = false;
    static instance = null;
    static _handlers = {};

    constructor(option) {
        this.chartMgr = null;
        this.G_HTTP_REQUEST = null;
        this.timer = null;
        this.buttonDown = false;
        this.init = false;
        this.requestParam = "";
        this.width = 1200;
        this.height = 650;
        this.symbol = "";
        this.symbolName = "";
        this.range = null;
        this.url = "";
        this.limit = 1000;
        this.type = "poll";
        this.subscribePath = "";
        this.sendPath = "";
        this.stompClient = null;
        this.intervalTime = 5000;
        this.debug = true;
        this.language = "zh-cn";
        this.theme = "dark";
        this.ranges = ["1w", "1d", "1h", "30m", "15m", "5m", "1m", "line"];
        this.showTrade = true;
        this.tradeWidth = 250;
        this.socketConnected = false;
        this.enableSockjs = true;
        this.reverseColor = false;
        this.isSized = false;
        this.paused = false;
        this.subscribed = null;
        this.disableFirebase = false;

        this.periodMap = {
            "01w": 7 * 86400 * 1000,
            "03d": 3 * 86400 * 1000,
            "01d": 86400 * 1000,
            "12h": 12 * 3600 * 1000,
            "06h": 6 * 3600 * 1000,
            "04h": 4 * 3600 * 1000,
            "02h": 2 * 3600 * 1000,
            "01h": 3600 * 1000,
            "30m": 30 * 60 * 1000,
            "15m": 15 * 60 * 1000,
            "05m": 5 * 60 * 1000,
            "03m": 3 * 60 * 1000,
            "01m": 60 * 1000,
            "line": 60 * 1000
        };

        this.tagMapPeriod = {
            "1w": "01w",
            "3d": "03d",
            "1d": "01d",
            "12h": "12h",
            "6h": "06h",
            "4h": "04h",
            "2h": "02h",
            "1h": "01h",
            "30m": "30m",
            "15m": "15m",
            "5m": "05m",
            "3m": "03m",
            "1m": "01m",
            "line": "line"
        };

        Object.assign(this, option);

        if (!Kline.created) {
            Kline.instance = this;
            Kline.created = true;

            for(let k in Kline._handlers) {
                let handlers = Kline._handlers[k];
                let method = 'on' + k.charAt(0).toUpperCase() + k.substr(1);
                if (typeof Kline.instance[method] === 'function') {
                    for(let i = 0, len = handlers.length; i < len; i++) {
                        Kline.instance[method](handlers[i]);
                    }
                    delete Kline._handlers[k];
                }
            }
        }

        return Kline.instance;
    }


    /*********************************************
     * Methods
     *********************************************/

    draw() {
        Kline.trade = new KlineTrade();
        Kline.chartMgr = new ChartManager();

        // setInterval(Control.refreshFunction, this.intervalTime);
        if (this.type === "stomp") {
            Control.socketConnect();
        }

        ChartManager.instance.bindCanvas("main", this.mainCanvas);
        ChartManager.instance.bindCanvas("overlay", this.overlayCanvas);
        Control.refreshTemplate();
        Control.onSize(this.width, this.height);
        Control.loadConfig();

        this.setTheme(this.theme);
        this.setLanguage(this.language);

        if (Kline.instance._onReadyEvt) {
            Kline.instance._onReadyEvt.raise(Kline.instance);
        }
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        Control.onSize(this.width, this.height);
    }

    setSymbol(symbol, symbolName) {
        this.symbol = symbol;
        this.symbolName = symbolName;
        Control.switchSymbol(symbol);
        this.onSymbolChange(symbol, symbolName);
    }

    setTheme(style) {
        this.theme = style;
        Control.switchTheme(style);
    }

    setLanguage(lang) {
        this.language = lang;
        Control.chartSwitchLanguage(lang);
    }

    setShowTrade(isShow) {
        this.showTrade = isShow;
        if (Kline.instance._onShowTradeEvt) {
            Kline.instance._onShowTradeEvt.raise(this.showTrade);
        }
        Control.onSize(this.width, this.height);
    }

    toggleTrade() {
        if (!this.showTrade) {
            this.showTrade = true;
        } else {
            this.showTrade = false;
        }
        if (Kline.instance._onShowTradeEvt) {
            Kline.instance._onShowTradeEvt.raise(this.showTrade);
        }
        Control.onSize(this.width, this.height);
    }

    setIntervalTime(intervalTime) {
        this.intervalTime = intervalTime;
        if (this.debug) {
            console.log('DEBUG: interval time changed to ' + intervalTime);
        }
    }

    pause() {
        if (this.debug) {
            console.log('DEBUG: kline paused');
        }
        this.paused = true;
    }

    resend() {
        if (this.debug) {
            console.log('DEBUG: kline continue');
        }
        this.paused = false;
        Control.requestData(true);
    }

    connect() {
        if (this.type !== 'stomp') {
            if (this.debug) {
                console.log('DEBUG: this is for stomp type');
            }
            return;
        }
        Control.socketConnect();
    }

    disconnect() {
        if (this.type !== 'stomp') {
            if (this.debug) {
                console.log('DEBUG: this is for stomp type');
            }
            return;
        }
        if (this.stompClient) {
            this.stompClient.disconnect();
            this.socketConnected = false;
        }
        if (this.debug) {
            console.log('DEBUG: socket disconnected');
        }
    }


    /*********************************************
     * Events
     *********************************************/

    static on(name, handler) {
        if (!Kline.instance) {
            if (!this._handlers[name]) {
                this._handlers[name] = [];
            }

            if (this._handlers[name].indexOf(handler) === -1) {
                this._handlers[name].push(handler);
            }
        } else {
            const method = 'on' + name.charAt(0).toUpperCase() + name.substr(1);
            if (typeof Kline.instance[method] === 'function') {
                Kline.instance[method](handler);
            }
        }
    }

    onReady(handler) {
        if (!this._onReadyEvt) {
            this._onReadyEvt = new MEvent();
        }

        this._onReadyEvt.addHandler(null, handler);
    }

    onRequest(options) {
        Kline._handlers.request = options;
    }

    onResize(handler) {
        if (!this._onResizeEvt) {
            this._onResizeEvt = new MEvent();
        }

        this._onResizeEvt.addHandler(null, handler);
    }

    onLangChange(lang) {
        if (!this._onLangEvt) {
            this._onLangEvt = new MEvent();
        }

        this._onLangEvt.addHandler(null, handler);
    }

    onSymbolChange(symbol, symbolName) {
        if (this.debug) {
            console.log("DEBUG: symbol changed to " + symbol + " " + symbolName);
        }
    }

    onThemeChange(handler) {
        if (!this._onThemeEvt) {
            this._onThemeEvt = new MEvent();
        }

        this._onThemeEvt.addHandler(null, handler);
    }

    onShowTradeChange(handler) {
        if (!this._onShowTradeEvt) {
            this._onShowTradeEvt = new MEvent();
        }

        this._onShowTradeEvt.addHandler(null, handler);
    }

    onToolPanelChange(handler) {
        if (!this._onToolPanelEvt) {
            this._onToolPanelEvt = new MEvent();
        }

        this._onToolPanelEvt.addHandler(null, handler);
    }

    onRangeChange(range) {
        if (this.debug) {
            console.log("DEBUG: range changed to " + range);
        }
    }

    destroy() {
        window.clearTimeout(Kline.instance.timer);
        Kline.instance = null;
        Kline.created = false;
    }

}
