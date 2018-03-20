import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'
import { Router, Route } from '/router/components'

import styles from '/const/styles'
import routes from '/router/routes'
import { TYPE_ERC20 } from '/const/'

import { Coins } from '/api/coins'

import state from '/store/state'
import { getAsset, isAssetRegistered } from '/store/getters'

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
        const location_path = state.location.path
        const asset = getAsset(location_path[1])
        const symbol = asset !== undefined ? asset.symbol : false
        return React.createElement(ContentTemplate, {
            location: state.location,
            totalAssets: state.totalAssets,
            isRegistered: isAssetRegistered(location_path[1]),
            symbol: symbol,
            symbol_add: decodeURIComponent(
                location_path[location_path.length - 1]
            )
        })
    }
}

function ContentTemplate({
    location,
    totalAssets,
    isRegistered,
    symbol,
    symbol_add
}) {
    // console.log(new RegExp(routes.import({ symbol: symbol_add })))
    // console.log(Coins.hasOwnProperty(symbol_add))
    // console.log(Coins[symbol_add].type)
    return (
        <Container>
            <RightContainer>
                <Router source={location}>
                    <Route pathname="/" if={totalAssets === 0}>
                        <RightContainerMiddle>
                            <Message>
                                Add or Import assets to start working
                            </Message>
                        </RightContainerMiddle>
                    </Route>
                    <Route pathname="/">
                        <Dashboard />
                    </Route>
                    <Route pathname={routes.settings()}>
                        <Settings />
                    </Route>
                    <Route pathname={routes.add()}>
                        <Add />
                    </Route>
                    <Route pathname={routes.custom({ type: TYPE_ERC20 })}>
                        <CustomERC20 />
                    </Route>
                    <Route
                        pathname={
                            new RegExp(routes.create({ symbol: symbol_add }))
                        }
                    >
                        <Create />
                    </Route>
                    <Route pathname={routes.import({ symbol: 'BTC' })}>
                        <ImportBTC />
                    </Route>
                    <Route pathname={routes.import({ symbol: 'ETH' })}>
                        <ImportETH />
                    </Route>
                    <Route
                        pathname={
                            new RegExp(routes.import({ symbol: symbol_add }))
                        }
                        if={
                            Coins.hasOwnProperty(symbol_add) &&
                            Coins[symbol_add].type === TYPE_ERC20
                        }
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
