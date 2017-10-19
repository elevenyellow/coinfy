import React, { Component } from 'react'
import { createObserver } from 'dop'
import { Router, Route, Show } from '/doprouter/react'

import { getAsset } from '/store/getters'
import { setHref, saveAssetsLocalStorage, setAssetLabel, setAssetsExported } from '/store/actions'

import { generateQRCode } from '/api/qr'

import routes from '/const/routes'
import styles from '/const/styles'
import state from '/store/state'

import Div from '/components/styled/Div'
import H1Input from '/components/styled/H1Input'
import H2 from '/components/styled/H2'
import Opacity from '/components/styled/Opacity'
import { RightHeader } from '/components/styled/Right'

export default class HeaderAsset extends Component {
    componentWillMount() {
        let unobserveLabel
        let unobserveBalance
        this.state = {}
        this.state.changedLabel = false
        this.state.asset_id = state.location.path[1]
        this.state.asset = getAsset(this.state.asset_id)
        // this.qr = generateQRCode(this.address, 140, styles.color.front3)
        this.observer = createObserver(mutations => {
            if (mutations[0].prop === 'pathname') {
                this.state.asset_id = state.location.path[1]
                this.state.asset = getAsset(this.state.asset_id)
                // this.qr = generateQRCode(this.address, 140, styles.color.front3)
                if (unobserveLabel) {
                    unobserveLabel()
                    unobserveBalance()
                }
                unobserveLabel = this.observer.observe(this.state.asset, 'label')
                unobserveBalance = this.observer.observe(this.state.asset, 'balance')
            }
            this.forceUpdate()
        })
        this.observer.observe(state.location, 'pathname')
        if (this.state.asset !== undefined) {
            unobserveLabel = this.observer.observe(this.state.asset, 'label')
            unobserveBalance = this.observer.observe(this.state.asset, 'balance')
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
        if (this.state.asset !== undefined) {
            this.state.changedLabel = true
            setAssetLabel(this.state.asset_id, e.target.value.trim())
        }
    }

    onBlur(e) {
        if (this.state.changedLabel) {
            this.state.changedLabel = false
            saveAssetsLocalStorage()
            setAssetsExported(false)
        }
    }

    render() {
        return React.createElement(HeaderAssetTemplate, {
            address: this.state.asset.address,
            label: this.state.asset ? this.state.asset.label : '',
            symbol: this.state.asset.symbol,
            onChangeLabel: this.onChangeLabel,
            onBlur: this.onBlur,
            // qr: this.qr
        })
    }
}

function HeaderAssetTemplate({ address, label, onChangeLabel, onBlur, qr }) {
    return (
        <RightHeader>
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
        </RightHeader>
    )
}
