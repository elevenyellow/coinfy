import React, { Component } from 'react'
import { createObserver } from 'dop'
import styled from 'styled-components'
import styles from '/const/styles'

import { BTC } from '/api/Assets'
import state from '/store/state'
import { getWalletsAsArray } from '/store/getters'

import WalletListItem from '/components/partials/WalletListItem'

export default class WalletList extends Component {
    componentWillMount() {
        this.observer = createObserver(mutations => this.forceUpdate())
        this.observer.observe(state, 'assets')
        this.observer.observe(state.assets[BTC.symbol])
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    render() {
        return React.createElement(WalletListTemplate, {
            assets: getWalletsAsArray()
        })
    }
}

function WalletListTemplate({ assets }) {
    return (
        <div>
            {assets.map(wallet => <WalletListItem wallet={wallet} />)}
        </div>
    )
}
