import React, { Component } from 'react'
import styled from 'styled-components'
import styles from '/const/styles'
import Popups from '/components/partials/Popups'
import Notifications from '/components/partials/Notifications'
import Header from '/components/partials/Header'
import SideMenu from '/components/partials/SideMenu'
import Right from '/components/partials/Right'
import Footer from '/components/partials/Footer'

export default function App() {
    return (
        <Background>
            <Notifications />
            <SideMenu />
            <Header />
            <Content>
                <Right />
            </Content>
            <Footer />
            <Popups />
        </Background>
    )
}

const Background = styled.div`
    height: 100%;
    background: linear-gradient(to bottom, #007196 150px, #d7dbd5 150px);
`

const Content = styled.div`
    height: calc(100% - ${styles.headerHeight} - ${styles.paddingOut});
    margin: 0 ${styles.paddingOut};
    position: relative;
    background: white;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.06), 0 2px 5px 0 rgba(0, 0, 0, 0.2);
    border-radius: 3px;

    ${styles.media.second} {
        margin: 0 ${styles.paddingOutMobile};
        height: calc(
            100% - ${styles.headerHeight} - ${styles.paddingOutMobile}
        );
    }
`
