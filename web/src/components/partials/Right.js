import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'
import { Router, Route } from '/doprouter/react'

import { isAddress } from '/api/Assets/BTC'

import state from '/store/state'
import { isWalletRegistered } from '/store/getters'
import { BTC } from '/api/Assets'
import styles from '/const/styles'
import routes from '/const/routes'

// styled
import { RightContainer, RightContentMiddle } from '/components/styled/Right'
import Message from '/components/styled/Message'
// views
import AddAsset from '/components/views/AddAsset'
import WalletBTC from '/components/views/WalletBTC'

export default class Right extends Component {
    componentWillMount() {
        this.observer = createObserver(mutations => this.forceUpdate())
        this.observer.observe(state.location.path, 'length')
        this.observer.observe(state.location.path, '0')
    }
    componentWillUnmount() {
        this.observer.destroy()
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
                    <Route pathname="/" if={state.totalWallets===0}>
                        <RightContentMiddle>
                            <Message>Add or Import a wallet to start working</Message>
                        </RightContentMiddle>
                    </Route>
                    <Route pathname="/">
                        <RightContentMiddle>
                            <Message>Dashboard</Message>
                        </RightContentMiddle>
                    </Route>
                    <Route pathname={new RegExp(routes.addasset())}>
                        <AddAsset />
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
