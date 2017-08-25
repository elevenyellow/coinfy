import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'
import { Router, Route } from '/doprouter/react'

import { isAddress } from '/api/bitcoin'

import { state } from '/store/state'
import styles from '/const/styles'
import routes from '/const/routes'

// styled
import { RightContainer } from '/components/styled/Right'
// views
import AddWallet from '/components/views/AddWallet'
import Message from '/components/views/Message'
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
        return (
            <RightContainer>
                <Router source={state.location}>
                    <Route pathname="/">
                        <Message>
                            Add or Import a wallet to start working
                        </Message>
                    </Route>
                    <Route pathname={new RegExp(routes.addwallet())}>
                        <AddWallet />
                    </Route>
                    <Route path-0="BTC" if={isAddress(state.location.path[1])}>
                        <WalletBTC />
                    </Route>
                    <Route>
                        <Message>Not found</Message>
                    </Route>
                </Router>
            </RightContainer>
        )
    }
}
