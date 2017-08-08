import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'
import styles from '/styles'
import AddWallet from '/components/views/AddWallet'
import Message from '/components/views/Message'
import { RightContainer } from '/components/styled/Right'
import { location } from '/stores/router'

console.log( location, window.location );

export default class Right extends Component {

    componentWillMount() {
        // const observer = createObserver(mutations => {
        //     this.forceUpdate();
        // });
        // observer.observe(ui, 'url');
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return <RightTemplate url={'ui.url'} />
    }

}


function RightTemplate({ url }) {
    let view = (url.indexOf('addwallet')>-1) ? <AddWallet /> : (<Message>Add or Import wallet to start working</Message>)
    return <RightContainer>{view}</RightContainer>
}

