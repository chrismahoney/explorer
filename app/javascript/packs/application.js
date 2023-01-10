// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
import '../stylesheets/application'

require.context('cryptocurrency-icons/svg', true);
require("@rails/ujs").start()
require("@rails/activestorage").start()
require("channels")
require("jquery")
require("popper.js")
require("bootstrap")
require('daterangepicker')

import barWidgetRenderer from 'vega-widgets/src/components/widgets/barWidgetRenderer'
import pieWidgetRenderer from 'vega-widgets/src/components/widgets/pieWidgetRenderer'
import timeChartRenderer from "@bitquery/ide-charts/src/reactComponents/timeChartRenderer";
import tableWidgetRenderer from "table-widget/src/components/tableWidgetRenderer";
import tradingViewrenderer from "@bitquery/ide-tradingview/src/tradingViewRenderer";
import { createChart } from 'lightweight-charts';
import { micromark } from 'micromark';
import ClipboardJS from 'clipboard'
import moment from 'moment'
import vis from 'vis'
import numeral from 'numeral'
import * as SockJS from 'sockjs-client';
import Stomp from "stompjs"
import Web3 from 'web3';


	const chainName = {
		1: 'Ethereum',
		10: 'Optimism',
		25: 'Cronos',
		56: 'BNB Chain',
		137: 'Poligon'
	}
	
	const rpcURL = {
		1: ['https://eth.llamarpc.com'],
		10: ['https://mainnet.optimism.io'],
		25: ['https://evm.cronos.org'],
		56: ['https://rpc.ankr.com/bsc'],
		137: ['https://polygon.llamarpc.com']
	}
	
	const saveChainID = (chainID) => localStorage.setItem('chainID', chainID)
	
	const getChainID = () => +localStorage.getItem('chainID')
	
	const walletConnected = () => localStorage.getItem('connected') === 'true'
	
	const changeChain = async (web3, chainID) => {
		try {
			await ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: web3.utils.toHex(chainID) }],
			});
		} catch (switchError) {
			try {
				await ethereum.request({
					method: 'wallet_addEthereumChain',
					params: [
						{
							chainId: web3.utils.toHex(chainID),
							chainName: chainName[chainID],
							rpcUrls: rpcURL[chainID],
						},
					],
				});
			} catch (addError) {
				// handle "add" error
			}
		}
	}
	const web3 = new Web3(ethereum)

    window.onload = walletSetup
    function walletSetup() {
    const checkConnection = () => {
		if (!walletConnected()) {
			document.querySelector('#connected').classList.add('d-none')
			localStorage.setItem('connected', 'false')
		} else {
			localStorage.setItem('connected', 'true')
			document.querySelector('#wallet-connection-text').textContent = 'Disconnect'
		}
	}

    checkConnection()

	 let chainId
     ethereum.request({ method: 'eth_chainId' }).then(ci => chainId = ci)
    
	const chainsSelector = document.querySelector('#chains')
    console.log(chainsSelector)

	for (const chainID in chainName) {
		const option = document.createElement('option')
		option.setAttribute('value', chainID)
		if (+chainID === getChainID()) option.setAttribute('selected', true)
		option.textContent = chainName[chainID]
		chainsSelector.appendChild(option)
	}

	chainsSelector.onchange = ({ target: { value } }) => {
		chainId = value
		changeChain(web3, chainId)
	}

	const address = document.querySelector('#address')
	const walletConnection = document.querySelector('#wallet-connection')

	let account

	const connectOrDisconnectWallet = async () => {
		if (walletConnected()) {
			document.querySelector('#connected').classList.add('d-none')
			localStorage.setItem('connected', 'false')
			document.querySelector('#wallet-connection-text').textContent = 'Connect'
		} else {
			ethereum.request({ method: 'eth_requestAccounts' }).then(acc => {
                account = acc
                address.textContent = account[0]
            })
			document.querySelector('#connected').classList.remove('d-none')
			localStorage.setItem('connected', 'true')
			document.querySelector('#wallet-connection-text').textContent = 'Disconnect'
		}
	}

	walletConnection.addEventListener('click', connectOrDisconnectWallet)

	ethereum.request({ method: 'eth_accounts' }).then(acc => {
        account = acc
        if (!account.length) {
            document.querySelector('#connected').classList.add('d-none')
        } else {
            address.textContent = account[0]
        }
    })

	ethereum.on('accountsChanged', (accounts) => {
		if (!accounts.length) {
			document.querySelector('#connected').classList.add('d-none')
			document.querySelector('#wallet-connection-text').textContent = 'Connect'
			localStorage.setItem('connected', 'false')
		} else {
			document.querySelector('#wallet-connection-text').textContent = 'Disconnect'
		}
	});

	ethereum.on('chainChanged', async (chainID) => {
		const options = document.querySelectorAll('#chains>option')
		options.forEach(option => {
			option.removeAttribute('selected')
			if (+option.value === web3.utils.hexToNumber(chainID)) option.setAttribute('selected', true)
		})
		saveChainID(web3.utils.hexToNumber(chainID))
	})}


global.createChart = createChart
global.widgetRenderer = {
    "vega.bar": barWidgetRenderer,
    "vega.pie": pieWidgetRenderer,
    "time.chart": timeChartRenderer,
    "table.widget": tableWidgetRenderer,
    "tradingview.widget": tradingViewrenderer
}
global.Stomp = Stomp
global.SockJS = SockJS
global.$ = $;
global.vis = vis;
global.numeral = numeral;
global.m = moment;

global.escapeHtml = function(unsafe)
{
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

$('document').ready(function () {
    new ClipboardJS('.to-clipboard');
    $('.to-clipboard').tooltip();
    $('.to-clipboard').on('click', function () {
        let it = $(this);
        $(this).attr('data-original-title', 'Copied!').tooltip('show');
        setTimeout( () => {
            $(this).attr('data-original-title', 'Copy');
        }, 200);
    });
});

const getValueFrom = (o, s) => {
    s = s.replace(/\[(\w+)\]/g, '.$1'); 
    s = s.replace(/^\./, '');           
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}
class dataSourceWidget {
	constructor(query, variables, displayed_data, url) {
		this.query = query
		this.variables = variables
		this.displayed_data = displayed_data
		this.setupData = function(json) {
			return ('data' in json) ? getValueFrom(json.data, this.displayed_data) : null
		}
		this.fetcher = function() {
			return fetch(
				url,
				{
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
                        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
					},
					body: JSON.stringify({query: this.query, variables: this.variables}),
					credentials: 'same-origin',
				},
			)
		}

	}
}
  
global.createLayout = function (dashboard_container, unit, layout_item, name_item) {
    let new_layout_element_container = document.createElement('div')
    new_layout_element_container.style.position = 'absolute'
    new_layout_element_container.style.display = 'flex'
    new_layout_element_container.style.flexDirection = 'column'
    new_layout_element_container.style.border = '1px solid rgba(0, 0, 0, 0.125)'
    new_layout_element_container.style.borderRadius = '0.25rem'
    new_layout_element_container.style.transform = `translate(${layout_item.x * unit.width + 10}px, ${layout_item.y * unit.height + 10}px)`
    new_layout_element_container.style.width = `${layout_item.w * unit.width -10}px`
    new_layout_element_container.style.height = `${layout_item.h * unit.height -10}px`
    let title_element = document.createElement('div')
    title_element.style.padding = '0.75rem 1.25rem'
    title_element.style.marginBottom = '0'
    title_element.style.backgroundColor = 'rgba(0, 0, 0, 0.03)'
    title_element.style.borderBottom = '1px solid rgba(0, 0, 0, 0.125)'
    let title = document.createTextNode(name_item)
    title_element.appendChild(title)
    new_layout_element_container.appendChild(title_element)
    let new_layout_element = document.createElement('div')
    new_layout_element.setAttribute('id', layout_item.i)
    new_layout_element.style.height = '100%'
    new_layout_element_container.appendChild(new_layout_element)
    dashboard_container.appendChild(new_layout_element_container)
}

global.createDashboard = function (dashboard_url, container_id, argsReplace) {
    const dashboard_container = document.getElementById(container_id)
    const unit = {
        height: 105,
        width: dashboard_container.clientWidth / 12
    }
    $.get(`/proxy_dbcode/${dashboard_url}`, function (data) {
        const layout = JSON.parse(data.layout)
        const height_units = Math.max(...layout.map(i => i.y + i.h))
        const container_height = height_units * unit.height
        dashboard_container.style.height = `${container_height}px`
        data.widgets.forEach(widget => {
            createLayout(dashboard_container, unit, layout.find(item => item.i===widget.query_index), widget.name || '')
            let args = JSON.parse(widget.variables)
            if (argsReplace && widget.widget_id !== 'block.content') {
                for (let arg in argsReplace) {
                    args[arg] = argsReplace[arg]
                }
            }
            args = JSON.stringify(args)
            let ds = new dataSourceWidget(
                widget.query,
                args,
                widget.displayed_data,
                '/proxy_graphql'
            )
            if (widget.widget_id === 'block.content') {
                const widgetMD = JSON.parse(widget.config).content
                const parsedMD = micromark(widgetMD)
                const container = document.getElementById(widget.query_index)
                container.style.padding = '10px'
                container.insertAdjacentHTML('afterbegin', parsedMD)
            } else {
                widgetRenderer[widget.widget_id](ds, JSON.parse(widget.config), widget.query_index)
            }
        })
    })
}

global.reportRange = function (selector, from, till, i18n) {
    var properties = {
        start: undefined,
        end: undefined,
        i18n: i18n,
        ranges: {},
        cbs: []
    };

    this.cancel = false;
    this.click = false;
    let his = this;

    if (i18n.locale == 'ru') {
        moment.locale('ru');
    } else if ((i18n.locale == 'zh')) {
        moment.locale('zh-cn');
    } else {
        moment.locale('en');
    }

    if (from == null && till == null) {
        $(selector).find('span').html(i18n.all_time);
    }

    if (from != null) {
        properties.start = moment(from);
    }
    if (till != null) {
        properties.end = moment(till);
    }

    function set_reportrange(start, end) {
        $(selector).find('span').html(start.format(i18n.format) + ' - ' + end.format(i18n.format));
    }

    // properties.ranges[i18n.all_time] = [null, null];
    properties.ranges[i18n.today] = [moment(), moment()];
    properties.ranges[i18n.yesterday] = [moment().subtract(1, 'days'), moment().subtract(1, 'days')];
    properties.ranges[i18n.last7] = [moment().subtract(6, 'days'), moment()];
    properties.ranges[i18n.last30] = [moment().subtract(29, 'days'), moment()];
    properties.ranges[i18n.this_month] = [moment().startOf('month'), moment().endOf('month')];
    properties.ranges[i18n.last_month] = [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')];

    $(selector).daterangepicker({
        showDropdowns: true,
        minYear: 2000,
        maxYear: parseInt(moment().format('YYYY'), 10),
        startDate: properties.start,
        endDate: properties.end,
        maxDate: moment(),
        opens: 'left',
        linkedCalendars: false,
        locale: {
            cancelLabel: i18n.clear,
            applyLabel: i18n.apply,
            customRangeLabel: i18n.custom_range
        },
        ranges: properties.ranges
    }, set_reportrange);

    $(selector).on('cancel.daterangepicker', function (ev, picker) {
        $(selector).find('span').html(i18n.all_time);
        $('.daterangepicker .ranges li').addClass('active');
    });

    $(selector).on('show.daterangepicker', function (ev, picker) {
        if ($(selector).find('span').html() == i18n.all_time) {
            picker.container.find('.ranges li').removeClass('active');
            picker.container.find('.ranges li').first().addClass('active');
        }
    });

    if (from != null && till != null) {
        set_reportrange(properties.start, properties.end);
    }

    function changeUrl(from, till) {
        $('a[data-changeurl="true"]').each(function () {
            let href = $(this).prop('href').split('?');
            let up = href[1] ? $.urlParams(href[1].split('&')) : {};
            if (from && till) {
                up['from'] = from;
                up['till'] = till;
            } else {
                delete up.from;
                delete up.till;
            }
            $(this).prop('href', (href[0] + ($.param(up) ? '?' + $.param(up) : '')));
        });
    }

    $(window).on("popstate", function (e) {
        var up = $.urlParams(window.location.search.substr(1).split('&'));
        if (up.from && up.till) {
            $(selector).data('daterangepicker').setStartDate(moment(up.from));
            $(selector).data('daterangepicker').setEndDate(moment(up.till));
            set_reportrange(moment(up.from), moment(up.till));
            $.each(properties.cbs, function () {
                this(moment(up.from).format('YYYY-MM-DD'), moment(up.till).format('YYYY-MM-DD'), undefined);
            });
            changeUrl(up.from, up.till);
        } else {
            $(selector).find('span').html(i18n.all_time);
            $.each(properties.cbs, function () {
                this(null, null, 'clear');
                changeUrl(null, null);
            });
        }
    });

    properties.change = function (cb) {
        properties.cbs.push(cb);

        $($(selector).data().daterangepicker.container.find('.ranges li')[1]).on('click', function (ev) {
            if (his.click == false) {
                his.click = true;
                $(this).click();
                his.click = false;
            }
        });
        $(selector).on('apply.daterangepicker', function (ev, picker) {
            if (!picker.startDate._isValid && !picker.endDate._isValid && his.cancel == false) {
                his.cancel = true;
                setTimeout(function () {
                    picker.startDate = moment();
                    picker.endDate = moment();
                }, 500);
                $(selector).trigger('cancel.daterangepicker', ev, picker);
            } else if (his.cancel === true) {
                his.cancel = false;
            } else {
                var start = picker.startDate.format('YYYY-MM-DD'),
                    end = picker.endDate.format('YYYY-MM-DDT23:59:59'),
                    endToParam = picker.endDate.format('YYYY-MM-DD'),
                    clear_date = undefined;
                cb(start, end, clear_date);
                $(selector).find('span').html(picker.startDate.format(i18n.format) + ' - ' + picker.endDate.format(i18n.format));
                let url = location.origin + location.pathname;
                if (location.href != url + '?' + $.param(_.merge($.urlParams, {from: start, till: endToParam}))) {
                    history.pushState({
                        data: {},
                        url: url
                    }, document.title, url + '?' + $.param(_.merge($.urlParams, {from: start, till: endToParam})));
                    changeUrl(start, endToParam);
                }
            }

        });
        $(selector).on('cancel.daterangepicker', function (ev, picker) {
            var start = null,
                end = null,
                clear_date = 'clear';
            cb(start, end, clear_date);
            let url = location.origin + location.pathname;
            let params = $.urlParams;
            delete params.from;
            delete params.till;
            if (location.href != url + ($.param(params) ? '?' + $.param(params) : '')) {
                history.pushState({
                    data: {},
                    url: url
                }, document.title, url + ($.param(params) ? '?' + $.param(params) : ''));
                changeUrl(start, end);
            }
        });

    };

    return properties
};

global.search = function (selector) {
    let form = $(selector);
    let is_find = true;

    form.find('input[name="query"]').keyup(function () {
        let it = $(this);
        let f = it.parents('form').first();
        // form.find('input').not(this).val($(this).val());
        if (it.val() == '') {
            is_find = false;
            f.find('button').addClass('disabled');
        } else {
            is_find = true;
            f.find('button').removeClass('disabled');
        }
    });

    form.find('input[name="query"]').change(function () {
        $(this).keyup();
    });
    form.find('input[name="query"]').keyup();

    form.submit(function () {
        let it = $(this);
        let net = it.find('input[type="hidden"][name="network"]');
        let btn = it.find('button').first();

        if (!net[0] && btn.data('network') != '') {
            append_network(btn.data('network'));
        }
        return is_find;
    });

    form.find('.search-form-type').click(function () {
        let it = $(this);
        append_network(it.data('network'));
        it.parents('form').first().submit();
        return false;
    });

    function append_network(network) {
        $('<input />').attr('type', 'hidden').attr('name', 'network').attr('value', network).appendTo(selector);
    };
};

(function ($) {
    $.urlParams = function (paramsArray = window.location.search.substr(1).split('&')) {
        var params = {};

        for (var i = 0; i < paramsArray.length; ++i) {
            var param = paramsArray[i]
                .split('=', 2);

            if (param.length !== 2)
                continue;

            params[param[0]] = decodeURIComponent(param[1].replace(/\+/g, " "));
        }

        return params;
    };
    $.urlParamsToArray = (function (obj) {
        var p = [];
        $.each(obj, function (k, v) {
            p.push({name: k, value: v})
        });
        return p;
    })($.urlParams);
})($);

function compactDataArray(arr) {
    var data = [];
    $.each(arr, function () {
        this.value != '' ? data.push(this) : '';
    });
    return data;
};


global.dateRangeReportFormat = function (from, till, network) {
    if (networksLimitedDates(network)) {
        return '%Y-%m-%d';
    } else if (from) {
        var tillp = till ? Date.parse(till) : Date.now();
        if ((tillp - Date.parse(from)) / (24 * 3600 * 1000) > 100) {
            return '%Y-%m';
        } else {
            return '%Y-%m-%d';
        }
    } else {
        return '%Y-%m';
    }
};

global.networksLimitedDates = function (network) {
    return ['celo_alfajores', 'celo_baklava', 'celo_rc1', 'medalla', 'eth2', 'ethpow'].indexOf(network) >= 0;
};

global.queryWithTimeRange = function (rr, query, from, till, params) {

    function draw(start, end) {
        var dateFormat = dateRangeReportFormat(start, end, (params && params.network));
        var data = Object.assign({}, params, {
            from: start,
            till: end && !end.includes('T') ? end + 'T23:59:59' : end,
            dateFormat: dateFormat,
            offset: 0,
            limit: 10
        });
        query.request(data);
    }

    draw(from, till);
    rr.change(draw);

};

