import React, { Component } from 'react'
import { createObserver } from 'dop'
import { Router, Route } from '/doprouter/react'

import { setHref } from '/stores/actions'
import { location, routes } from '/stores/router'

import Div from '/components/styled/Div'
import H1 from '/components/styled/H1'
import H2 from '/components/styled/H2'
import {
    RightHeader,
    RightHeaderInner,
    RightContent,
    RightContentMenu,
    RightContentMenuItem,
    RightContentMenuItemImage,
    RightContentMenuItemText,
    RightContentContent,
    RightContentInner
} from '/components/styled/Right'

import CreateBitcoin from '/components/views/CreateBitcoin'
import ImportBitcoin from '/components/views/ImportBitcoin'

export default class AddWallet extends Component {
    componentWillMount() {
        this.observer = createObserver(mutations => this.forceUpdate())
        this.observer.observe(location.path, 'length')
        this.observer.observe(location.path, '1')
    }

    componentWillUnmount() {
        this.observer.destroy()
    }

    shouldComponentUpdate() {
        return false
    }

    onClick(route) {
        setHref(route)
    }

    render() {
        return React.createElement(AddWalletTemplate, {
            location: location,
            routesCreatebtc: routes.createbtc(),
            routesImportbtc: routes.importbtc(),
            onClick: this.onClick
        })
    }
}

function AddWalletTemplate({
    location,
    routesCreatebtc,
    routesImportbtc,
    onClick
}) {
    return (
        <div>
            <RightHeader>
                <RightHeaderInner>
                    <Div float="left" padding-left="15px">
                        <H1>Add wallet</H1>
                        <H2>Create or Import Wallets</H2>
                    </Div>
                    <Div clear="both" />
                </RightHeaderInner>
            </RightHeader>
            <RightContent>
                <RightContentMenu>
                    <RightContentMenuItem
                        selected={location.pathname === routesCreatebtc}
                        onClick={e => onClick(routesCreatebtc)}
                    >
                        <RightContentMenuItemImage>
                            <img
                                src="/static/image/BTC.svg"
                                width="20"
                                height="20"
                            />
                        </RightContentMenuItemImage>
                        <RightContentMenuItemText>
                            Create Bitcoin wallet
                        </RightContentMenuItemText>
                    </RightContentMenuItem>

                    <RightContentMenuItem
                        selected={location.pathname === routesImportbtc}
                        onClick={e => onClick(routesImportbtc)}
                    >
                        <RightContentMenuItemImage>
                            <img
                                src="/static/image/BTC.svg"
                                width="20"
                                height="20"
                            />
                        </RightContentMenuItemImage>
                        <RightContentMenuItemText>
                            Import Bitcoin wallet
                        </RightContentMenuItemText>
                    </RightContentMenuItem>
                </RightContentMenu>
                <RightContentContent>
                    <RightContentInner>
                        <Router source={location}>
                            <Route pathname={routesCreatebtc}>
                                <CreateBitcoin />
                            </Route>
                            <Route pathname={routesImportbtc}>
                                <ImportBitcoin />
                            </Route>
                        </Router>
                    </RightContentInner>
                </RightContentContent>
            </RightContent>
        </div>
    )
}
