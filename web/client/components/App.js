import React, { Component } from 'react'
import styled from 'styled-components'
// import { register, createObserver } from 'dop'
// import cipher from 'browserify-cipher'
// import bignumber from 'bignumber.js'
// import bitcoin from 'bitcoinjs-lib'
// import QRCode from 'qrcode.react'


export default class App extends Component {

    render() {
        return (
            <Background>
                <Container>
                    <Header>Hola</Header>
                    <Columns>
                        <Left>Left</Left>
                        <Right>Right</Right>
                    </Columns>
                </Container>
            </Background>
        )
    }
}

const Background = styled.div`
background-color:#f3f6f8;
height:100%;
`

const Container = styled.div`
height: calc(100% - 50px);
padding: 0 50px 50px 50px;
`

const Header = styled.div`
height:75px;
`

const Columns = styled.div`
height: calc(100% - 75px);
`

const Left = styled.div`
height: 100%;
width: 250px;
background: white;
float: left;
border-radius: 3px;
box-shadow: 0 0 3px 2px rgba(205,213,218,.4);
`

const Right = styled.div`
height: 100%;
width: calc(100% - 250px - 15px);
background: white;
float: right;
border-radius: 3px;
box-shadow: 0 0 3px 2px rgba(205,213,218,.4);
`
