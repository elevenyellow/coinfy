import React, { Component } from 'react'
import styled from 'styled-components'
import dop,{ createObserver } from 'dop'
import styles from '/styles'
import AddWallet from '/components/views/AddWallet'
import Message from '/components/views/Message'
import { RightContainer } from '/components/styled/Right'
import { location } from '/stores/router'

window.dop=dop
window._location=location
export default class Right extends Component {

    componentWillMount() {
        const observer = createObserver(mutations => {
            console.log( mutations.map(m=>m.prop), JSON.parse(JSON.stringify(location.path)) );
            // this.forceUpdate();
        });
        // observer.observe(location);
        // observer.observe(location.path);
        observer.observe(location.query);
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

