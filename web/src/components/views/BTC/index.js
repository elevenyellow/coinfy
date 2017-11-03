import React, { Component } from 'react'
import { createObserver } from 'dop'
import { Router, Route, Show } from '/doprouter/react'
import styled from 'styled-components'

import { setHref } from '/store/actions'
import styles from '/const/styles'

import { BTC } from '/api/Assets'
import routes from '/const/routes'
import state from '/store/state'
import { isAssetWithPrivateKey } from '/store/getters'



import Help from '/components/styled/Help'
import Div from '/components/styled/Div'
import Message from '/components/styled/Message'
import {
    RightContainerPadding,
    RightContainerMiddle2,
    RightHeader,
    RightContent,
    RightContentMenu,
    RightContentMenuItem,
    RightContentMenuItemIcon,
    RightContentMenuItemText
} from '/components/styled/Right'

import HeaderAsset from '/components/partials/HeaderAsset'
import Summary from '/components/views/BTC/Summary'
import ChangePassword from '/components/views/BTC/ChangePassword'
import PrintBTC from '/components/views/BTC/Print'
import Delete from '/components/views/BTC/Delete'

export default class ViewBTC extends Component {
    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.location, 'pathname')
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
        const asset_id = state.location.path[1]
        const hasPrivateKey = isAssetWithPrivateKey(asset_id)
        return React.createElement(ViewBTCTemplate, {
            location: state.location,
            hasPrivateKey: hasPrivateKey,
            routes_summaryAsset: routes.summaryAsset(asset_id),
            routes_sendAsset: routes.sendAsset(asset_id),
            routes_printAsset: routes.printAsset(asset_id),
            routes_changePasswordAsset: routes.changePasswordAsset(asset_id),
            routes_deleteAsset: routes.deleteAsset(asset_id),
            onClick: this.onClick
        })
    }
}

function ViewBTCTemplate({
    location,
    isRegistered,
    hasPrivateKey,
    onClick,
    routes_summaryAsset,
    routes_sendAsset,
    routes_printAsset,
    routes_changePasswordAsset,
    routes_deleteAsset
}) {
    const tooltipPrivatekey = hasPrivateKey ? null : (
        <HideMobile>
            <Help position="center" width={175}>
                This wallet does not have private key
            </Help>
        </HideMobile>
    )
    return (
        <RightContainerPadding>
            <HeaderAsset />
            <RightContent>
                <RightContentMenu>
                    <RightContentMenuItem
                        selected={
                            location.pathname === routes_summaryAsset ||
                            location.path.length === 2
                        }
                        onClick={e => onClick(routes_summaryAsset)}
                    >
                        <RightContentMenuItemText>
                            Summary
                        </RightContentMenuItemText>
                    </RightContentMenuItem>

                    <RightContentMenuItem
                        disabled={!hasPrivateKey}
                        selected={
                            location.pathname === routes_sendAsset ||
                            location.path.length === 2
                        }
                        onClick={e => {
                            if (hasPrivateKey) onClick(routes_sendAsset)
                        }}
                    >
                        <RightContentMenuItemText>
                            Send{tooltipPrivatekey}
                        </RightContentMenuItemText>
                    </RightContentMenuItem>

                    <RightContentMenuItem
                        disabled={!hasPrivateKey}
                        selected={
                            location.pathname === routes_printAsset ||
                            location.path.length === 2
                        }
                        onClick={e => {
                            if (hasPrivateKey) onClick(routes_printAsset)
                        }}
                    >
                        <RightContentMenuItemText>
                            Paper Wallet{tooltipPrivatekey}
                        </RightContentMenuItemText>
                    </RightContentMenuItem>

                    <RightContentMenuItem
                        disabled={!hasPrivateKey}
                        selected={
                            location.pathname === routes_changePasswordAsset
                        }
                        onClick={e => onClick(routes_changePasswordAsset)}
                    >
                        <RightContentMenuItemText>
                            Change password{tooltipPrivatekey}
                        </RightContentMenuItemText>
                    </RightContentMenuItem>

                    <RightContentMenuItem
                        selected={location.pathname === routes_deleteAsset}
                        onClick={e => onClick(routes_deleteAsset)}
                    >
                        <RightContentMenuItemText>
                            Delete
                        </RightContentMenuItemText>
                    </RightContentMenuItem>
                </RightContentMenu>
                

                <Router source={location}>
                    <Route pathname={routes_summaryAsset}>
                        <Summary />
                    </Route>

                    <Route pathname={routes_changePasswordAsset}>
                        <ChangePassword />
                    </Route>

                    <Route pathname={routes_printAsset}>
                        <PrintBTC />
                    </Route>

                    <Route pathname={routes_deleteAsset}>
                        <RightContainerMiddle2>
                            <Delete />
                        </RightContainerMiddle2>
                    </Route>

                    <Route>
                        <RightContainerMiddle2>
                            <Message>In development</Message>
                        </RightContainerMiddle2>
                    </Route>
                </Router>
            </RightContent>
        </RightContainerPadding>
    )
}


const HideMobile = styled.span`
${styles.media.second} {
    display: none
}
`