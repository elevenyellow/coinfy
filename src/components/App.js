import React, { Component } from 'react'
import styled from 'styled-components'
import styles from '/const/styles'
import Popups from '/components/partials/Popups'
import Notifications from '/components/partials/Notifications'
import Header from '/components/partials/Header'
import SideMenu from '/components/partials/SideMenu'
import Views from '/components/partials/Views'
import Footer from '/components/partials/Footer'

function show() {
    let scanner = new Instascan.Scanner({
        video: document.getElementById('cam')
    })
    scanner.addListener('scan', function(content) {
        console.log(content)
    })
    Instascan.Camera.getCameras()
        .then(function(cameras) {
            if (cameras.length > 0) {
                scanner.start(cameras[0])
            } else {
                console.error('No cameras found.')
            }
        })
        .catch(function(e) {
            console.error(e)
        })
}

export default function App() {
    return (
        <Background>
            <Notifications />
            <SideMenu />
            <Header />
            <Views />
            <Footer />
            <Popups />
        </Background>
    )
}

const Background = styled.div`
    height: 100%;
    background: linear-gradient(to bottom, #007196 150px, #d7dbd5 150px);
`
