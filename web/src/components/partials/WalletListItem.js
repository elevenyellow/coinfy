import React, { Component } from 'react'
import { createObserver } from 'dop'
import styled from 'styled-components'
import styles from '/const/styles'
import routes from '/const/routes'
import { state } from '/store/state'
import { setHref } from '/store/actions'

export default class Wallet extends Component {
    componentWillMount() {
        const wallet = this.props.wallet
        this.observer = createObserver(mutations => this.forceUpdate())
        this.observer.observe(state.location, 'pathname')
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
        return React.createElement(WalletTemplate, {
            wallet: this.props.wallet,
            location: state.location,
            onClick: this.onClick
        })
    }
}

function WalletTemplate({ wallet, location, onClick }) {
    return (
        <WalletStyled
            onClick={onClick}
            selected={
                state.location.path[0] === wallet.symbol &&
                state.location.path[1] === wallet.address
            }
        >
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
                    <strong>$2351.32</strong> ≈ 0.93123 BTC
                </WalletBalance>
            </WalletInfo>
        </WalletStyled>
    )
}

const WalletStyled = styled.div`
    padding: 15px 15px;
    border-bottom: 1px solid ${styles.color.background4};
    color: ${styles.color.front3};
    border-left: 5px solid transparent;
    cursor: pointer;
    &:hover {
        border-left-color: ${styles.color.background2};
    }
    ${props => {
        if (props.selected) {
            return `
        cursor: inherit;
        border-left-color: ${styles.color.background2};
        background: ${styles.color.background1}
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
    font-size: 12px;
    color: ${styles.color.front2};
    padding-top: 2px;
    font-weight: 100;
    letter-spacing: 0.5px;
`