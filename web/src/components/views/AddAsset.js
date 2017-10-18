import React, { Component } from 'react'
import { createObserver } from 'dop'
import { Router, Route } from '/doprouter/react'

import state from '/store/state'
import { setHref } from '/store/actions'
import routes from '/const/routes'

import Div from '/components/styled/Div'
import H1 from '/components/styled/H1'
import H2 from '/components/styled/H2'
import {
    RightContainerPadding,
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

import CreateBTC from '/components/views/CreateBTC'
import ImportBTC from '/components/views/ImportBTC'

export default class AddAsset extends Component {
    componentWillMount() {
        this.observer = createObserver(mutations => this.forceUpdate())
        this.observer.observe(state.location.path, 'length')
        this.observer.observe(state.location.path, '1')
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
        return React.createElement(AddAssetTemplate, {
            location: state.location,
            routesCreatebtc: routes.createbtc(),
            routesImportbtc: routes.importbtc(),
            onClick: this.onClick
        })
    }
}

function AddAssetTemplate({
    location,
    routesCreatebtc,
    routesImportbtc,
    onClick
}) {
    return (
        <RightContainerPadding>
            <RightHeader>
                <RightHeaderInner>
                    <Div float="left">
                        <H1>Add asset</H1>
                        <H2>Create or Import assets</H2>
                    </Div>
                    <Div clear="both" />
                </RightHeaderInner>
            </RightHeader>
            <RightContent>
                {/* <RightContentMenu>
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
                            Create Bitcoin Wallet
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
                            Import Bitcoin Wallet
                        </RightContentMenuItemText>
                    </RightContentMenuItem>
                </RightContentMenu> */}
                <RightContentContent>
                    <RightContentInner>
                        <Router source={location}>
                            <Route pathname={routesCreatebtc}>
                                <CreateBTC />
                            </Route>
                            <Route pathname={routesImportbtc}>
                                <ImportBTC />
                            </Route>
                        </Router>
                    </RightContentInner>
                </RightContentContent>
            </RightContent>
        </RightContainerPadding>
    )
}
