import React, { Component } from 'react'
import { createObserver } from 'dop'
import styled from 'styled-components'
import { assets } from '/api/assets'
import styles from '/const/styles'
import routes from '/const/routes'
import { currencies } from '/const/currencies'
import state from '/store/state'
import { setHref } from '/store/actions'
import { convertBalance } from '/store/getters'

export default class Wallet extends Component {
    componentWillMount() {
        const wallet = this.props.wallet
        this.observer = createObserver(mutations => this.forceUpdate())
        this.observer.observe(state, 'wallets')
        this.observer.observe(state.location, 'pathname')
        this.observer.observe(state.prices)
        this.observer.observe(wallet.wallet, 'label')
        this.observer.observe(wallet.wallet, 'balance')
        this.observer.observe(state.wallets[wallet.symbol])

        // binding
        this.onClick = this.onClick.bind(this)
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    onClick() {
        setHref(
            routes.wallet(this.props.wallet.symbol, this.props.wallet.address)
        )
    }

    render() {
        const wallet = this.props.wallet
        // console.log( 'Render', convertBalance(wallet.symbol, wallet.wallet.balance) )
        return React.createElement(WalletTemplate, {
            wallet: this.props.wallet,
            location: state.location,
            balance_currency: currencies[state.currency].format(convertBalance(wallet.symbol, wallet.wallet.balance)),
            balance_asset: assets[wallet.symbol].format(wallet.wallet.balance),
            onClick: this.onClick,
        })
    }
}

function WalletTemplate({ wallet, location, balance_currency, balance_asset, onClick  }) {
    return (
        <WalletStyled
            onClick={onClick}
            selected={
                state.location.path[0] === wallet.symbol &&
                state.location.path[1] === wallet.address
            }
        >
            <div>
                <WalletIcon>
                    <img src="/static/image/BTC.svg" width="22" height="22" />
                </WalletIcon>
                <WalletInfo>
                    <WalletLabel>
                        {wallet.wallet.label.length > 0
                            ? wallet.wallet.label
                            : wallet.address}
                    </WalletLabel>
                    <WalletBalance>
                        <strong>{balance_currency}</strong> ≈ {balance_asset}
                    </WalletBalance>
                </WalletInfo>
            </div>
        </WalletStyled>
    )
}

const WalletStyled = styled.div`
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
const WalletIcon = styled.div`
    float: left;
    padding-top: 3px;
`
const WalletInfo = styled.div`margin-left: 33px;`
const WalletLabel = styled.div`
    text-overflow: ellipsis;
    overflow: hidden;
    font-weight: bold;
    font-size: 16px;
    color: inherit;
    line-height: 20px;
`
const WalletBalance = styled.div`
    text-overflow: ellipsis;
    font-size: 12px;
    color: ${styles.color.front2};
    padding-top: 2px;
    font-weight: 100;
    letter-spacing: 0.5px;
`
