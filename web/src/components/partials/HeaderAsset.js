import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'
import { Router, Route, Show } from '/doprouter/react'

import { getAsset, convertBalance } from '/store/getters'
import {
    setHref,
    saveAssetsLocalStorage,
    setAssetLabel,
    setAssetsExported
} from '/store/actions'

import Assets from '/api/Assets'

import { currencies } from '/const/currencies'
import routes from '/const/routes'
import styles from '/const/styles'
import state from '/store/state'

import Div from '/components/styled/Div'
import H1Input from '/components/styled/H1Input'
import H1 from '/components/styled/H1'
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
                unobserveLabel = this.observer.observe(
                    this.state.asset,
                    'label'
                )
                unobserveBalance = this.observer.observe(
                    this.state.asset,
                    'balance'
                )
            }
            this.forceUpdate()
        })
        this.observer.observe(state.location, 'pathname')
        if (this.state.asset !== undefined) {
            unobserveLabel = this.observer.observe(this.state.asset, 'label')
            unobserveBalance = this.observer.observe(
                this.state.asset,
                'balance'
            )
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
            balance_asset: this.state.asset.balance,
            balance_currency: currencies[state.currency].format(
                convertBalance(
                    this.state.asset.symbol,
                    this.state.asset.balance
                ),
                0
            ),
            onChangeLabel: this.onChangeLabel,
            onBlur: this.onBlur
        })
    }
}

function HeaderAssetTemplate({
    address,
    label,
    symbol,
    balance_asset,
    balance_currency,
    onChangeLabel,
    onBlur
}) {
    return (
        <RightHeader>
            <Icon>
                <img
                    src={`/static/image/${symbol}.svg`}
                />
            </Icon>
            <Left>
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
            </Left>
            <Right>
                <H1b>{balance_currency}</H1b>
                <H2>{balance_asset} {symbol}</H2>
            </Right>
            <Div clear="both" />
        </RightHeader>
    )
}

const Icon = styled.div`
    width: 30px;
    float: left;
    padding-top: 11px;
    padding-right: 10px;
    & > img {
        width: 30px;
        height: 30px;
    }
    ${styles.media.first} {
        padding-top: 7px;
        padding-right: 5px;
        & > img {
            width: 25px;
            height: 25px;
        }
    }
    ${styles.media.second} {
        display:none
    }  
`
const Left = styled.div`
    width: 75%;
    float: left;
    ${styles.media.fourth} {
        width: 100%;
    }        
`

const Right = styled.div`
    text-align: right;
    padding-top: 10px;
    float: right;
    ${styles.media.fourth} {
        display: none;
    } 
`

const H1b = styled.div`
color: ${styles.color.black};
font-size: 23px;
font-weight: 900;
margin: 0;
line-height: 35px; 

${styles.media.first} {
    font-size: 19px;
    line-height: 23px; 
} 
`