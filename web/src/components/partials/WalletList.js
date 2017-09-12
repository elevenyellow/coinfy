import React, { Component } from 'react'
import { createObserver } from 'dop'
import styled from 'styled-components'
import styles from '/const/styles'

import { BTC } from '/const/cryptos'
import state from '/store/state'
import { getWalletsAsArray } from '/store/getters'

import WalletListItem from '/components/partials/WalletListItem'

export default class WalletList extends Component {
    componentWillMount() {
        this.observer = createObserver(mutations => this.forceUpdate())
        this.observer.observe(state, 'wallets')
        this.observer.observe(state.wallets[BTC.symbol])
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    render() {
        return React.createElement(WalletListTemplate, {
            wallets: getWalletsAsArray()
        })
    }
}

function WalletListTemplate({ wallets }) {
    return (
        <div>
            {wallets.map(wallet => <WalletListItem wallet={wallet} />)}
        </div>
    )
}
