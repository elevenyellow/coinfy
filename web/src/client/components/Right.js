import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'
import { Router, Route } from '/doprouter/react'

import styles from '/styles'
import { location, routes } from '/stores/router'

// styled
import { RightContainer } from '/components/styled/Right'

// views
import AddWallet from '/components/views/AddWallet'
import Message from '/components/views/Message'


export default class Right extends Component {

    componentWillMount() {
        const observer = createObserver(mutations => this.forceUpdate());
        observer.observe(location.path, 'length');
        observer.observe(location.path, '0');
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <RightContainer>
                <Router source={location}>
                    <Route pathname={new RegExp(routes.addwallet())}>
                        <AddWallet />
                    </Route> 
                    <Route pathname="/">
                        <Message>Add or Import a wallet to start working</Message>
                    </Route>
                    <Route>
                        <Message>Not found</Message>
                    </Route> 
                </Router>
            </RightContainer>
        )
    }

}


