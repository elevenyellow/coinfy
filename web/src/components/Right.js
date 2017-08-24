import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'
import { Router, Route } from '/doprouter/react'

import { isAddress } from '/util/bitcoin'

import styles from '/styles'
import { location, routes } from '/stores/router'

// styled
import { RightContainer } from '/components/styled/Right'

// views
import AddWallet from '/components/views/AddWallet'
import Message from '/components/views/Message'
import WalletBTC from '/components/views/WalletBTC'

export default class Right extends Component {
    componentWillMount() {
        const observer = createObserver(mutations => this.forceUpdate())
        observer.observe(location.path, 'length')
        observer.observe(location.path, '0')
    }

    shouldComponentUpdate() {
        return false
    }

    render() {
        return (
            <RightContainer>
                <Router source={location}>
                    <Route pathname="/">
                        <Message>
                            Add or Import a wallet to start working
                        </Message>
                    </Route>
                    <Route pathname={new RegExp(routes.addwallet())}>
                        <AddWallet />
                    </Route>
                    <Route path-0="BTC" if={isAddress(location.path[1])}>
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
