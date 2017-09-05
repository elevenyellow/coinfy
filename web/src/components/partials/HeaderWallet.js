import React, { Component } from 'react'
import { createObserver } from 'dop'
import { Router, Route, Show } from '/doprouter/react'

import { setHref, updateSession } from '/store/actions'

import { generateQRCode } from '/api/qr'

import routes from '/const/routes'
import styles from '/const/styles'
import { state } from '/store/state'

import Div from '/components/styled/Div'
import H1Input from '/components/styled/H1Input'
import H2 from '/components/styled/H2'
import Opacity from '/components/styled/Opacity'
import { RightHeader, RightHeaderInner } from '/components/styled/Right'

export default class HeaderWallet extends Component {
    componentWillMount() {
        let unobserveLabel
        let unobserveBalance
        this.symbol = state.location.path[0]
        this.address = state.location.path[1]
        this.wallet = state.wallets[this.symbol][this.address]
        // this.qr = generateQRCode(this.address, 140, styles.color.front3)
        this.observer = createObserver(m => {
            if (m[0].prop === 'pathname') {
                this.symbol = state.location.path[0]
                this.address = state.location.path[1]
                this.wallet = state.wallets[this.symbol][this.address]
                // this.qr = generateQRCode(this.address, 140, styles.color.front3)
                if (unobserveLabel) {
                    unobserveLabel()
                    unobserveBalance()
                }
                unobserveLabel = this.observer.observe(this.wallet, 'label')
                unobserveBalance = this.observer.observe(this.wallet, 'balance')
            }
            this.forceUpdate()
        })
        this.observer.observe(state.location, 'pathname')
        if (this.wallet !== undefined) {
            unobserveLabel = this.observer.observe(this.wallet, 'label')
            unobserveBalance = this.observer.observe(this.wallet, 'balance')
        }

        this.onChangeLabel = this.onChangeLabel.bind(this)
        this.onBlur = this.onBlur.bind(this)
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    onChangeLabel(e) {
        if (this.wallet !== undefined)
            state.wallets[this.symbol][
                this.address
            ].label = e.target.value.trim()
    }

    onBlur(e) {
        updateSession()
    }

    render() {
        return React.createElement(HeaderWalletTemplate, {
            address: this.address,
            label: this.wallet ? this.wallet.label : '',
            symbol: this.symbol,
            onChangeLabel: this.onChangeLabel,
            onBlur: this.onBlur,
            // qr: this.qr
        })
    }
}

function HeaderWalletTemplate({ address, label, onChangeLabel, onBlur, qr }) {
    return (
        <RightHeader>
            <RightHeaderInner>
                <Div
                    width="30px"
                    float="left"
                    padding-top="11px"
                    padding-right="10px"
                >
                    <img src="/static/image/BTC.svg" width="30" height="30" />
                </Div>
                <Div width="calc(100% - 130px)" float="left">
                    <H1Input
                        value={label}
                        onChange={onChangeLabel}
                        onBlur={onBlur}
                        width="100%"
                        placeholder="Type a label..."
                    />
                    <H2>
                        <strong>{address}</strong>
                    </H2>
                </Div>
                {/* <Opacity normal="1" hover=".7">
                    <Div float="right" cursor="pointer">
                        <img width="70" height="70" src={qr} />
                    </Div>
                </Opacity> */}
                <Div clear="both" />
            </RightHeaderInner>
        </RightHeader>
    )
}
