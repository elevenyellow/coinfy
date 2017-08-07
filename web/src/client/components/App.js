import React, { Component } from 'react'
import styled from 'styled-components'
// import { register, createObserver } from 'dop'
// import cipher from 'browserify-cipher'
// import bignumber from 'bignumber.js'
// import bitcoin from 'bitcoinjs-lib'
// import QRCode from 'qrcode.react'

import styles from '/styles'
import Header from '/components/Header'
import Left from '/components/Left'
import Right from '/components/Right'
import Footer from '/components/Footer'


export default function App() {
    return (
        <Background>
            <Header />
            <Columns>
                <Left />
                <Right />
            </Columns>
            <Footer />
        </Background>
    )
}




const Background = styled.div`
background-color:${styles.color.background1};
height:100%;
`

const Columns = styled.div`
height: calc(100% - ${styles.headerHeight} - ${styles.paddingOut});
padding: 0 ${styles.paddingOut};
`