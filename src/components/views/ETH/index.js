import React, { Component } from 'react'
import { createObserver } from 'dop'
import styled from 'styled-components'

import { setHref } from '/store/actions'
import styles from '/const/styles'

import { ETH } from '/api/coins'
import { routes, Router, Route, Show } from '/store/router'
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
import Summary from '/components/views/ETH/Summary'
import Send from '/components/views/ETH/Send'
import ExportETH from '/components/views/ETH/Export'
import ChangePassword from '/components/views/ETH/ChangePassword'
import Delete from '/components/views/ETH/Delete'

export default class ViewETH extends Component {
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
        return React.createElement(ViewETHTemplate, {
            location: state.location,
            hasPrivateKey: hasPrivateKey,
            routes_summaryAsset: routes.asset({ asset_id: asset_id }),
            routes_sendAsset: routes.assetSend({ asset_id: asset_id }),
            routes_assetExport: routes.assetExport({ asset_id: asset_id }),
            routes_assetChangepassword: routes.assetChangepassword({
                asset_id: asset_id
            }),
            routes_assetDelete: routes.assetDelete({ asset_id: asset_id }),
            onClick: this.onClick
        })
    }
}

function ViewETHTemplate({
    location,
    isRegistered,
    hasPrivateKey,
    onClick,
    routes_summaryAsset,
    routes_sendAsset,
    routes_assetExport,
    routes_assetChangepassword,
    routes_assetDelete
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
                                location.pathname === routes_assetExport ||
                                location.path.length === 2
                            }
                            onClick={e => {
                                if (hasPrivateKey) onClick(routes_assetExport)
                            }}
                        >
                            <MenuContentItemText>
                                Export{tooltipPrivatekey}
                            </MenuContentItemText>
                        </MenuContentItem>

                        <MenuContentItem
                            disabled={!hasPrivateKey}
                            selected={
                                location.pathname === routes_assetChangepassword
                            }
                            onClick={e => {
                                if (hasPrivateKey)
                                    onClick(routes_assetChangepassword)
                            }}
                        >
                            <MenuContentItemText>
                                Change password{tooltipPrivatekey}
                            </MenuContentItemText>
                        </MenuContentItem>

                        <MenuContentItem
                            selected={location.pathname === routes_assetDelete}
                            onClick={e => onClick(routes_assetDelete)}
                        >
                            <MenuContentItemText>Delete</MenuContentItemText>
                        </MenuContentItem>
                    </Menu>
                </Div>

                <Router location={location}>
                    <Route pathname={routes_summaryAsset}>
                        <Summary />
                    </Route>

                    <Route pathname={new RegExp(routes_sendAsset)}>
                        <Send />
                    </Route>

                    <Route if={hasPrivateKey} pathname={routes_assetExport}>
                        <ExportETH />
                    </Route>

                    <Route
                        if={hasPrivateKey}
                        pathname={routes_assetChangepassword}
                    >
                        <ChangePassword />
                    </Route>

                    <Route pathname={routes_assetDelete}>
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
