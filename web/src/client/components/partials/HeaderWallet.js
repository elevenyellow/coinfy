import React, { Component } from 'react'
import { createObserver } from 'dop'
import { Router, Route, Show } from '/doprouter/react'

import { setHref } from '/actions'

import { location, routes } from '/stores/router'
import state from '/stores/state'

import Div from '/components/styled/Div'
import H1Input from '/components/styled/H1Input'
import H2 from '/components/styled/H2'
import Opacity from '/components/styled/Opacity'
import { 
    RightHeader,
    RightHeaderInner,
} from '/components/styled/Right'


export default class HeaderWallet extends Component {

    componentWillMount() {
        let unobserveLabel
        let unobserveBalance
        this.symbol = location.path[0]
        this.address = location.path[1]
        this.wallet = state.wallets[this.symbol][this.address]
        this.observer = createObserver(m => {
            if (m[0].prop === 'pathname') {
                this.symbol = location.path[0]
                this.address = location.path[1]
                this.wallet = state.wallets[this.symbol][this.address]
                unobserveLabel()
                unobserveBalance()
                unobserveLabel = this.observer.observe(this.wallet, 'label')
                unobserveBalance = this.observer.observe(this.wallet, 'balance')
            }
            this.forceUpdate()
        })
        this.observer.observe(location, 'pathname')
        if (this.wallet !== undefined) {
            unobserveLabel = this.observer.observe(this.wallet, 'label')
            unobserveBalance = this.observer.observe(this.wallet, 'balance')
        }


        this.onChangeLabel = this.onChangeLabel.bind(this)
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    onChangeLabel(e) {
        if (this.wallet !== undefined)
            state.wallets[this.symbol][this.address].label = e.target.value.trim()
    }


    render() {
        return React.createElement(HeaderWalletTemplate, {
            label: this.wallet ? this.wallet.label : '',
            symbol: this.symbol,
            onChangeLabel: this.onChangeLabel
        })
    }
}




function HeaderWalletTemplate({ label, onChangeLabel }) {
    return (
        <RightHeader>
            <RightHeaderInner>
                <Div width="30px" float="left" padding-top="11px" padding-right="10px">
                    <img src="/static/image/BTC.svg" width="30" height="30" />
                </Div>
                <Div width="calc(100% - 130px)" float="left">
                    <H1Input value={label} onChange={onChangeLabel} width="100%" placeholder="Type a label..." />
                    <H2><strong>$2351.32</strong> ≈ 0.93123 BTC</H2> 
                </Div>
                <Opacity normal="1" hover=".7">
                    <Div float="right" cursor="pointer">
                        <img width="70" height="70" src="data:image/png;base64,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" />
                    </Div>
                </Opacity>
                <Div clear="both" />
            </RightHeaderInner>
        </RightHeader>
    )
}