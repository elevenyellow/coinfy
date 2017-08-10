import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'
import styles from '/styles'
import Route from '/components/reusable/Route'
import AddWallet from '/components/views/AddWallet'
import Message from '/components/views/Message'
import { RightContainer } from '/components/styled/Right'
import { location } from '/stores/router'

// window.dop=dop
// window._location=location
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
        return <RightTemplate location={location} />
    }

}


function RightTemplate({ location }) {

    return (
        <RightContainer>
            <Route pathname={/^\/addwallet/} source={location}>
                <AddWallet />
            </Route>
            <Route pathname="/" source={location}>
                <Message>Add or Import a wallet to start working</Message>
            </Route>
            {/* <Route pathname="/" source={location}>
                <Message>Not found</Message>
            </Route> */}
        </RightContainer>
    )
}

