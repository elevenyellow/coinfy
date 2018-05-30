import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'

import {
    getAsset,
    convertBalance,
    formatCurrency,
    getParamsFromLocation,
    isAssetWithSeed
} from '/store/getters'
import {
    setHref,
    saveAssetsLocalstorage,
    setAssetLabel,
    setAssetsExported
} from '/store/actions'

import { Coins } from '/api/coins'
import { Fiats } from '/api/fiats'
import { routes } from '/store/router'
import styles from '/const/styles'
import state from '/store/state'

import Div from '/components/styled/Div'
import H1Input from '/components/styled/H1Input'
import H1 from '/components/styled/H1'
import H2 from '/components/styled/H2'
import Opacity from '/components/styled/Opacity'
import { RightHeader } from '/components/styled/Right'

import IconSettings from 'react-icons/lib/md/settings'
import IconEdit from 'react-icons/lib/md/edit'

export default class HeaderAsset extends Component {
    componentWillMount() {
        const { asset_id } = getParamsFromLocation()
        this.asset_id = asset_id
        this.changedLabel = false
        this.asset = getAsset(this.asset_id)
        this.Coin = Coins[this.asset.symbol]
        // this.qr = generateQRCode(this.address, 140, styles.color.front3)
        this.observer = createObserver(mutations => {
            if (mutations[0].prop === 'pathname') {
                const { asset_id } = getParamsFromLocation()
                this.asset_id = asset_id
                this.asset = getAsset(this.asset_id)
                // this.qr = generateQRCode(this.address, 140, styles.color.front3)
                if (this.unobserveLabel) {
                    this.unobserve()
                }
                this.observe()
            }
            this.forceUpdate()
        })
        this.observer.observe(state.location, 'pathname')
        this.observer.observe(state.prices, this.asset.symbol)

        if (this.asset !== undefined) {
            this.observe()
        }

        this.onChangeLabel = this.onChangeLabel.bind(this)
        this.onBlur = this.onBlur.bind(this)
        this.onChangeRoute = this.onChangeRoute.bind(this)
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    observe() {
        this.unobserveLabel = this.observer.observe(this.asset, 'label')
        this.unobserveBalance = this.observer.observe(this.asset, 'balance')
        this.unobserveAddress = this.observer.observe(this.asset, 'address')
    }
    unobserve() {
        this.unobserveLabel()
        this.unobserveBalance()
        this.unobserveAddress()
    }

    onChangeLabel(e) {
        if (this.asset !== undefined) {
            this.changedLabel = true
            setAssetLabel(this.asset_id, e.target.value.trim())
        }
    }

    onBlur(e) {
        if (this.changedLabel) {
            this.changedLabel = false
            saveAssetsLocalstorage()
            setAssetsExported(false)
        }
    }

    onChangeRoute(route) {
        setHref(route(getParamsFromLocation()))
    }

    render() {
        return React.createElement(HeaderAssetTemplate, {
            is_seed: isAssetWithSeed(this.asset_id),
            address: this.Coin.formatAddress(this.asset.address),
            label: this.asset ? this.asset.label : '',
            symbol: this.asset.symbol,
            logo: Coins[this.asset.symbol].logo,
            balance_asset: this.asset.balance,
            balance_currency: formatCurrency(
                convertBalance(this.asset.symbol, this.asset.balance)
            ),
            onChangeLabel: this.onChangeLabel,
            onBlur: this.onBlur,
            onChangeRoute: this.onChangeRoute
        })
    }
}

function HeaderAssetTemplate({
    is_seed,
    address,
    label,
    symbol,
    logo,
    balance_asset,
    balance_currency,
    onChangeLabel,
    onBlur,
    onChangeRoute
}) {
    return (
        <RightHeader>
            <Settings onClick={() => onChangeRoute(routes.assetSettings)}>
                <IconSettings size={18} color={styles.color.grey1} />
            </Settings>
            <Icon>
                <img src={logo} />
            </Icon>
            <Left>
                <H1Input
                    type="text"
                    value={label}
                    onChange={onChangeLabel}
                    onBlur={onBlur}
                    width="100%"
                    placeholder="Type a label..."
                />
                <Div padding-left="2px">
                    <H2>
                        {is_seed ? (
                            <Link
                                onClick={() =>
                                    onChangeRoute(routes.assetAddresses)
                                }
                            >
                                <span>{address}</span>
                                <IconEdit
                                    size={15}
                                    color={styles.color.grey1}
                                />
                            </Link>
                        ) : (
                            <strong>{address}</strong>
                        )}
                    </H2>
                </Div>
            </Left>
            <Right>
                <H1b>{balance_currency}</H1b>
                <H2>
                    {balance_asset} {symbol}
                </H2>
            </Right>
            <Div clear="both" />
        </RightHeader>
    )
}

const Settings = styled.div`
    position: absolute;
    top: 10px;
    right: 15px;
    color: styles.color.grey1;
    cursor: pointer;
    &:hover {
        opacity: 0.6;
    }
`

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
        display: none;
    }
`
const Left = styled.div`
    width: 60%;
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
        float: left;
        padding-top: 0;
        width: 100%;
        text-align: left;
        padding-left: 2px;
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
    ${styles.media.fourth} {
        display: none;
    }
`
const Link = styled.a`
    font-weight: bold;
    text-decoration: underline;
    cursor: pointer;
    &:hover {
        color: ${styles.color.background2};
        svg {
            display: inline;
        }
    }
    svg {
        display: none;
        position: relative;
        top: -2px;
    }
`
