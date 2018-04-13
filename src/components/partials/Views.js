import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'

import styles from '/const/styles'
import { routes, Router, Route } from '/store/router'
import { TYPE_ERC20 } from '/const/'

import { Coins } from '/api/coins'

import state from '/store/state'
import {
    getAsset,
    isAssetRegisteredById,
    getParamsFromLocation
} from '/store/getters'

// Styled
import { RightContainer, RightContainerMiddle } from '/components/styled/Right'
import Message from '/components/styled/Message'

// Views
import Dashboard from '/components/views/Dashboard'
import Settings from '/components/views/Settings'
import Add from '/components/views/Add'
import Create from '/components/views/Create'
import ImportBTC from '/components/views/ImportBTC'
import ImportETH from '/components/views/ImportETH'
import ImportERC20 from '/components/views/ImportERC20'
import ViewBTC from '/components/views/BTC/'
import ViewETH from '/components/views/ETH/'
import ViewERC20 from '/components/views/ERC20/'
import CustomERC20 from '/components/views/Custom/ERC20'

export default class Content extends Component {
    componentWillMount() {
        this.observer = createObserver(mutations => this.forceUpdate())
        this.observer.observe(state, 'totalAssets')
        this.observer.observe(state.location, 'pathname')
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    render() {
        let { asset_id, symbol } = getParamsFromLocation()
        if (asset_id && !symbol) symbol = getAsset(asset_id).symbol
        return React.createElement(ContentTemplate, {
            totalAssets: state.totalAssets,
            isRegistered: isAssetRegisteredById(asset_id),
            symbol: symbol
        })
    }
}

function ContentTemplate({ totalAssets, isRegistered, symbol }) {
    const token_exists = Coins.hasOwnProperty(symbol)
    return (
        <Container>
            <RightContainer>
                <Router>
                    <Route is={routes.home} if={totalAssets === 0}>
                        <RightContainerMiddle>
                            <Message>
                                Add or Import assets to start working
                            </Message>
                        </RightContainerMiddle>
                    </Route>
                    <Route is={routes.home}>
                        <Dashboard />
                    </Route>
                    <Route is={routes.settings}>
                        <Settings />
                    </Route>
                    <Route is={routes.add}>
                        <Add />
                    </Route>
                    <Route is={routes.custom}>
                        <CustomERC20 />
                    </Route>
                    <Route is={routes.create} if={token_exists}>
                        <Create />
                    </Route>
                    <Route is={routes.import} if={symbol === 'BTC'}>
                        <ImportBTC />
                    </Route>
                    <Route is={routes.import} if={symbol === 'ETH'}>
                        <ImportETH />
                    </Route>
                    <Route
                        is={routes.import}
                        if={token_exists && Coins[symbol].type === TYPE_ERC20}
                    >
                        <ImportERC20 />
                    </Route>
                    <Route path-0="asset" if={isRegistered && symbol === 'BTC'}>
                        <ViewBTC />
                    </Route>
                    <Route path-0="asset" if={isRegistered && symbol === 'ETH'}>
                        <ViewETH />
                    </Route>
                    <Route path-0="asset" if={isRegistered}>
                        <ViewERC20 />
                    </Route>
                    <Route>
                        <RightContainerMiddle>
                            <Message>Not found</Message>
                        </RightContainerMiddle>
                    </Route>
                </Router>
            </RightContainer>
        </Container>
    )
}

const Container = styled.div`
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
