import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'
import { Router, Route } from '/doprouter/react'

import { isAddress } from '/api/Assets/BTC'

import state from '/store/state'
import { isAssetRegistered } from '/store/getters'
import { BTC } from '/api/Assets'
import styles from '/const/styles'
import routes from '/const/routes'

// styled
import { RightContainer, RightContentMiddle } from '/components/styled/Right'
import Message from '/components/styled/Message'
// views
import Dashboard from '/components/views/Dashboard'
import AddAsset from '/components/views/AddAsset'
import AssetBTC from '/components/views/AssetBTC'

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
                    <RightContentMiddle>
                        <Message>Add or Import assets to start working</Message>
                    </RightContentMiddle>
                </Route>
                <Route pathname="/">
                    <Dashboard />
                </Route>
                <Route pathname={new RegExp(routes.add())}>
                    <AddAsset />
                </Route>
                <Route path-0="asset" if={isRegistered}>
                    <AssetBTC />
                </Route>
                <Route>
                    <RightContentMiddle><Message>Not found</Message></RightContentMiddle>
                </Route>

            </Router>
        </RightContainer>
    )
}