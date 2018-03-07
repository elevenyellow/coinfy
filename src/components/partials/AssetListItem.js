import React, { Component } from 'react'
import { createObserver } from 'dop'
import styled from 'styled-components'
import { Coins } from '/api/coins'
import { round } from '/api/numbers'
import styles from '/const/styles'
import routes from '/router/routes'
import { Fiats } from '/api/fiats'
import state from '/store/state'
import { setHref } from '/store/actions'
import {
    convertBalance,
    formatCurrency,
    getAssetId,
    getLabelOrAddress
} from '/store/getters'
import AssetItem from '/components/styled/AssetItem'

export default class Asset extends Component {
    componentWillMount() {
        this.observe(this.props.asset)
        // binding
        this.onClick = this.onClick.bind(this)
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate(nextProps) {
        if (this.props.asset !== nextProps.asset) {
            this.observer.destroy()
            this.observe(nextProps.asset)
            return true
        }
        return false
    }

    observe(asset) {
        this.observer = createObserver(mutations => this.forceUpdate())
        this.observer.observe(state.location, 'pathname')
        this.observer.observe(state.prices)
        this.observer.observe(state.assets)
        this.observer.observe(asset, 'label')
        this.observer.observe(asset, 'balance')
    }

    onClick() {
        setHref(routes.asset({ asset_id: getAssetId(this.props.asset) }))
    }

    render() {
        const asset = this.props.asset
        const Coin = Coins[asset.symbol]
        // console.log( 'Render', convertBalance(asset.symbol, asset.balance) )
        return React.createElement(AssetTemplate, {
            asset: this.props.asset,
            location: state.location,
            balance_currency: formatCurrency(
                convertBalance(asset.symbol, asset.balance)
            ),
            logo: Coin.logo,
            balance_asset: Coin.format(asset.balance, 5),
            onClick: this.onClick
        })
    }
}

function AssetTemplate({
    asset,
    location,
    balance_currency,
    balance_asset,
    logo,
    onClick
}) {
    return (
        <AssetStyled
            onClick={onClick}
            selected={
                state.location.path[1] ===
                getAssetId({ symbol: asset.symbol, address: asset.address })
            }
        >
            <AssetItem
                logo={logo}
                label={getLabelOrAddress(asset)}
                balance={
                    <span>
                        <strong>{balance_currency}</strong> ≈ {balance_asset}
                    </span>
                }
            />
        </AssetStyled>
    )
}

const AssetStyled = styled.div`
    color: ${styles.color.front3};
    border-bottom: 1px solid ${styles.color.background4};
    cursor: pointer;
    & > div:hover {
        border-left-color: ${styles.color.background2};
    }
    & > div {
        padding: 15px 15px;
        border-left: 5px solid transparent;
    }

    ${props => {
        if (props.selected) {
            return `
        cursor: inherit;
        background: ${styles.color.background1};
        & > div {
            border-left-color: ${styles.color.background2};
        }
        `
        }
    }};
`
