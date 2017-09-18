import React, { Component } from 'react'
import { createObserver } from 'dop'
import { Router, Route, Show } from '/doprouter/react'

import { getAsset } from '/store/getters'
import { setHref, saveAssetsLocalStorage, setAssetLabel } from '/store/actions'

import { generateQRCode } from '/api/qr'

import routes from '/const/routes'
import styles from '/const/styles'
import state from '/store/state'

import Div from '/components/styled/Div'
import H1Input from '/components/styled/H1Input'
import H2 from '/components/styled/H2'
import Opacity from '/components/styled/Opacity'
import { RightHeader, RightHeaderInner } from '/components/styled/Right'

export default class HeaderAsset extends Component {
    componentWillMount() {
        let unobserveLabel
        let unobserveBalance
        this.asset_id = state.location.path[1]
        this.asset = getAsset(this.asset_id)
        // this.qr = generateQRCode(this.address, 140, styles.color.front3)
        this.observer = createObserver(mutations => {
            if (mutations[0].prop === 'pathname') {
                this.asset_id = state.location.path[1]
                this.asset = getAsset(this.asset_id)
                // this.qr = generateQRCode(this.address, 140, styles.color.front3)
                if (unobserveLabel) {
                    unobserveLabel()
                    unobserveBalance()
                }
                unobserveLabel = this.observer.observe(this.asset, 'label')
                unobserveBalance = this.observer.observe(this.asset, 'balance')
            }
            this.forceUpdate()
        })
        this.observer.observe(state.location, 'pathname')
        if (this.asset !== undefined) {
            unobserveLabel = this.observer.observe(this.asset, 'label')
            unobserveBalance = this.observer.observe(this.asset, 'balance')
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
        if (this.asset !== undefined)
            setAssetLabel(this.asset_id, e.target.value.trim())
    }

    onBlur(e) {
        saveAssetsLocalStorage()
        setAssetsExported(false)
    }

    render() {
        return React.createElement(HeaderAssetTemplate, {
            address: this.asset.address,
            label: this.asset ? this.asset.label : '',
            symbol: this.asset.symbol,
            onChangeLabel: this.onChangeLabel,
            onBlur: this.onBlur,
            // qr: this.qr
        })
    }
}

function HeaderAssetTemplate({ address, label, onChangeLabel, onBlur, qr }) {
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
                <Div width="calc(100% - 40px)" float="left">
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
