import React, { Component } from 'react'
import { createObserver } from 'dop'
import { Router, Route, Show } from '/router/components'
import styled from 'styled-components'

import { setHref } from '/store/actions'
import styles from '/const/styles'

import { ETH } from '/api/coins'
import routes from '/router/routes'
import state from '/store/state'
import { isAssetWithPrivateKeyOrSeed } from '/store/getters'

import Help from '/components/styled/Help'
import Select from '/components/styled/Select'
import Div from '/components/styled/Div'
import Message from '/components/styled/Message'
import {
    RightContainerPadding,
    RightContainerMiddle2,
    RightHeader,
    RightContent
} from '/components/styled/Right'
import {
    Menu,
    MenuContentItem,
    MenuContentItemText
} from '/components/styled/Menu'

import HeaderAsset from '/components/partials/HeaderAsset'
import Summary from '/components/views/ERC20/Summary'
import Send from '/components/views/ERC20/Send'
import Export from '/components/views/ERC20/Export'
import ChangePassword from '/components/views/ERC20/ChangePassword'
import Delete from '/components/views/ERC20/Delete'

export default class ViewERC20 extends Component {
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
        const hasPrivateKey = isAssetWithPrivateKeyOrSeed(asset_id)
        return React.createElement(ViewERC20Template, {
            location: state.location,
            hasPrivateKey: hasPrivateKey,
            routes_summaryAsset: routes.summaryAsset({ asset_id: asset_id }),
            routes_sendAsset: routes.sendAsset({ asset_id: asset_id }),
            routes_exportAsset: routes.exportAsset({ asset_id: asset_id }),
            routes_changePasswordAsset: routes.changePasswordAsset({
                asset_id: asset_id
            }),
            routes_deleteAsset: routes.deleteAsset({ asset_id: asset_id }),
            onClick: this.onClick
        })
    }
}

function ViewERC20Template({
    location,
    isRegistered,
    hasPrivateKey,
    onClick,
    routes_summaryAsset,
    routes_sendAsset,
    routes_exportAsset,
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
                <Div margin-bottom={styles.paddingContent}>
                    <Menu>
                        <MenuContentItem
                            selected={
                                location.pathname === routes_summaryAsset ||
                                location.path.length === 2
                            }
                            onClick={e => onClick(routes_summaryAsset)}
                        >
                            <MenuContentItemText>Summary</MenuContentItemText>
                        </MenuContentItem>

                        <MenuContentItem
                            disabled={!hasPrivateKey}
                            selected={
                                new RegExp(routes_sendAsset).test(
                                    location.pathname
                                ) || location.path.length === 2
                            }
                            onClick={e => {
                                if (hasPrivateKey) onClick(routes_sendAsset)
                            }}
                        >
                            <MenuContentItemText>
                                Send{tooltipPrivatekey}
                            </MenuContentItemText>
                        </MenuContentItem>

                        <MenuContentItem
                            disabled={!hasPrivateKey}
                            selected={
                                location.pathname === routes_exportAsset ||
                                location.path.length === 2
                            }
                            onClick={e => {
                                if (hasPrivateKey) onClick(routes_exportAsset)
                            }}
                        >
                            <MenuContentItemText>
                                Export{tooltipPrivatekey}
                            </MenuContentItemText>
                        </MenuContentItem>

                        <MenuContentItem
                            disabled={!hasPrivateKey}
                            selected={
                                location.pathname === routes_changePasswordAsset
                            }
                            onClick={e => {
                                if (hasPrivateKey)
                                    onClick(routes_changePasswordAsset)
                            }}
                        >
                            <MenuContentItemText>
                                Change password{tooltipPrivatekey}
                            </MenuContentItemText>
                        </MenuContentItem>

                        <MenuContentItem
                            selected={location.pathname === routes_deleteAsset}
                            onClick={e => onClick(routes_deleteAsset)}
                        >
                            <MenuContentItemText>Delete</MenuContentItemText>
                        </MenuContentItem>
                    </Menu>
                </Div>

                <Router source={location}>
                    <Route pathname={routes_summaryAsset}>
                        <Summary />
                    </Route>

                    <Route pathname={new RegExp(routes_sendAsset)}>
                        <Send />
                    </Route>

                    <Route if={hasPrivateKey} pathname={routes_exportAsset}>
                        <Export />
                    </Route>

                    <Route
                        if={hasPrivateKey}
                        pathname={routes_changePasswordAsset}
                    >
                        <ChangePassword />
                    </Route>

                    <Route pathname={routes_deleteAsset}>
                        <Delete />
                    </Route>

                    <Route>
                        <RightContainerMiddle2>
                            <Message>Not found</Message>
                        </RightContainerMiddle2>
                    </Route>
                </Router>
            </RightContent>
        </RightContainerPadding>
    )
}

const HideMobile = styled.span`
    ${styles.media.second} {
        display: none;
    }
`
