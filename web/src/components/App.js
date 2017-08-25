import React, { Component } from 'react'
import styled from 'styled-components'
import styles from '/const/styles'
import Header from '/components/partials/Header'
import Left from '/components/partials/Left'
import Right from '/components/partials/Right'
import Footer from '/components/partials/Footer'


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