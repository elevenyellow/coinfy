import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'
import { Router, Route } from '/doprouter/react'

import { isAddress } from '/api/bitcoin'

import { state, isWalletRegistered } from '/store/state'
import { BTC } from '/const/crypto'
import styles from '/const/styles'
import routes from '/const/routes'

// styled
import { RightContainer, RightContentMiddle } from '/components/styled/Right'
import Message from '/components/styled/Message'
// views
import AddWallet from '/components/views/AddWallet'
import WalletBTC from '/components/views/WalletBTC'

export default class Right extends Component {
    componentWillMount() {
        const observer = createObserver(mutations => this.forceUpdate())
        observer.observe(state.location.path, 'length')
        observer.observe(state.location.path, '0')
    }

    shouldComponentUpdate() {
        return false
    }

    render() {
        const symbol = state.location.path[0]
        const address = state.location.path[1]
        const isRegistered = isWalletRegistered(symbol, address)
        return (
            <RightContainer>
                <Router source={state.location}>
                    <Route pathname="/">
                        <RightContentMiddle>
                            <Message>Add or Import a wallet to start working</Message>
                        </RightContentMiddle>
                    </Route>
                    <Route pathname={new RegExp(routes.addwallet())}>
                        <AddWallet />
                    </Route>
                    <Route path-0={BTC.symbol} if={isRegistered && isAddress(state.location.path[1])}>
                        <WalletBTC />
                    </Route>
                    <Route>
                        <RightContentMiddle><Message>Not found</Message></RightContentMiddle>
                    </Route>
                </Router>
            </RightContainer>
        )
    }
}
