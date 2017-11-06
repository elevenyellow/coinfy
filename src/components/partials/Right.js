import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'
import { Router, Route } from '/doprouter/react'


import state from '/store/state'
import { isAssetRegistered } from '/store/getters'
import { BTC } from '/api/Assets'
import styles from '/const/styles'
import routes from '/const/routes'

// Styled
import { RightContainer, RightContainerMiddle } from '/components/styled/Right'
import Message from '/components/styled/Message'

// Views
import Dashboard from '/components/views/Dashboard'
import AddAsset from '/components/views/AddAsset'
import Create from '/components/views/CreateBTC'
import Import from '/components/views/ImportBTC'
import ViewBTC from '/components/views/BTC/'

export default class Right extends Component {
    componentWillMount() {
        this.observer = createObserver(mutations => this.forceUpdate())
        this.observer.observe(state, 'totalAssets')
        this.observer.observe(state.location.path, 'length')
        this.observer.observe(state.location.path, '0')
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    render() {
        return React.createElement(RightTemplate, {
            location: state.location,
            totalAssets: state.totalAssets,
            isRegistered: isAssetRegistered(state.location.path[1])
        })            
    }
}


function RightTemplate({
    location,
    totalAssets,
    isRegistered,
}) {
    return (
        <RightContainer>
            <Router source={location}>
                <Route pathname="/" if={totalAssets===0}>
                    <RightContainerMiddle>
                        <Message>Add or Import assets to start working</Message>
                    </RightContainerMiddle>
                </Route>
                <Route pathname="/">
                    <Dashboard />
                </Route>
                <Route pathname={routes.add()}>
                    <AddAsset />
                </Route>
                <Route pathname={routes.createbtc()}>
                    <Create />
                </Route>
                <Route pathname={routes.importbtc()}>
                    <Import />
                </Route>
                <Route path-0="asset" if={isRegistered}>
                    <ViewBTC />
                </Route>
                <Route>
                    <RightContainerMiddle>
                        <Message>Not found</Message>
                    </RightContainerMiddle>
                </Route>

            </Router>
        </RightContainer>
    )
}

