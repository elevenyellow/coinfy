import React, { Component } from 'react'
import styled from 'styled-components'
import styles from '/const/styles'
import Popups from '/components/partials/Popups'
import Notifications from '/components/partials/Notifications'
import Header from '/components/partials/Header'
import Left from '/components/partials/Left'
import Right from '/components/partials/Right'
import Footer from '/components/partials/Footer'


export default function App() {
    return (
        <Background>
            <Notifications />
            <Header />
            <Columns>
                <Left />
                <Right />
            </Columns>
            <Footer />
            <Popups />
        </Background>
    )
}




const Background = styled.div`
height:100%;
background: linear-gradient(to bottom, #007196 20%,#d7dbd5 20%);
`

const Columns = styled.div`
height: calc(100% - ${styles.headerHeight} - ${styles.paddingOut});
margin: 0 ${styles.paddingOut};
position: relative;
background: white;
box-shadow: 0 1px 1px 0 rgba(0,0,0,0.06), 0 2px 5px 0 rgba(0,0,0,0.2);
border-radius: 3px;
`