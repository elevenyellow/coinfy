import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'
import styles from '/styles'
import AddWallet from '/components/views/AddWallet'
import Message from '/components/views/Message'
import { RightContainer } from '/components/styled/Right'
import { location } from '/stores/router'


export default class Right extends Component {

    componentWillMount() {
        const observer = createObserver(mutations => {
            console.log( 'mutations', mutations );
            // this.forceUpdate();
        });
        observer.observe(location);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return <RightTemplate url={'ui.url'} />
    }

}


function RightTemplate({ url }) {
    let view = (url.indexOf('addwallet')>-1) ? <AddWallet /> : (<Message>Add or Import a wallet to start working</Message>)
    return <RightContainer>{view}</RightContainer>
}

