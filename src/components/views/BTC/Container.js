import React, { Component } from 'react'
import { createObserver } from 'dop'
import styled from 'styled-components'

import styles from '/const/styles'
import { BTC } from '/api/coins'

import { routes, Router, Route, Show } from '/store/router'
import state from '/store/state'
import { setHref, fetchTxs } from '/store/actions'
import {
    isAssetWithPrivateKeyOrSeed,
    isAssetWithSeed,
    getParamsFromLocation,
    getRouteFromLocation,
    getAsset
} from '/store/getters'

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
import SummaryDefault from '/components/views/BTC/Summary'
import SendDefault from '/components/views/BTC/Send'
import AddressesDefault from '/components/views/BTC/Addresses'
import ExportDefault from '/components/views/BTC/Export'
import SettingsDefault from '/components/views/BTC/Settings'

export default class Container extends Component {
    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.location, 'pathname')
        this.fetchSummary()
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        this.fetchSummary()
        return false
    }

    fetchSummary() {
        const { asset_id } = getParamsFromLocation()
        const asset = getAsset(asset_id)
        if (this.asset_id !== asset_id && !asset.summary.fetching) {
            this.asset_id = asset_id
            fetchTxs(asset_id)
        }
    }

    onClick(route) {
        setHref(route(getParamsFromLocation()))
    }

    render() {
        const { asset_id } = getParamsFromLocation()
        return React.createElement(ContainerTemplate, {
            components: this.props,
            location: state.location,
            route: getRouteFromLocation(),
            hasPrivateKey: isAssetWithPrivateKeyOrSeed(asset_id),
            hasSeed: isAssetWithSeed(asset_id),
            onClick: this.onClick
        })
    }
}

function ContainerTemplate({
    components,
    location,
    route,
    hasPrivateKey,
    hasSeed,
    onClick
}) {
    const Summary = components.Summary || SummaryDefault
    const Send = components.Send || SendDefault
    const Addresses = components.Addresses || AddressesDefault
    const Export = components.Export || ExportDefault
    const Settings = components.Settings || SettingsDefault

    const tooltipPrivatekey = hasPrivateKey ? null : (
        <HideMobile>
            <Help position="center" width={175}>
                No Private Key or Recovery Phrase
            </Help>
        </HideMobile>
    )
    const tooltipSeed = hasSeed ? null : (
        <HideMobile>
            <Help position="center" width={175}>
                Only for assets created with Recovery Phrase
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
                            selected={route === routes.asset}
                            onClick={e => onClick(routes.asset)}
                        >
                            <MenuContentItemText>Summary</MenuContentItemText>
                        </MenuContentItem>

                        <MenuContentItem
                            disabled={!hasPrivateKey}
                            selected={route === routes.assetSend}
                            onClick={e => {
                                if (hasPrivateKey) onClick(routes.assetSend)
                            }}
                        >
                            <MenuContentItemText>
                                Send{tooltipPrivatekey}
                            </MenuContentItemText>
                        </MenuContentItem>

                        {/* <MenuContentItem
                            disabled={!hasSeed}
                            selected={route === routes.assetAddresses}
                            onClick={e => {
                                if (hasSeed) onClick(routes.assetAddresses)
                            }}
                        >
                            <MenuContentItemText>
                                Addresses{tooltipSeed}
                            </MenuContentItemText>
                        </MenuContentItem> */}

                        <MenuContentItem
                            disabled={!hasPrivateKey}
                            selected={route === routes.assetExport}
                            onClick={e => {
                                if (hasPrivateKey) onClick(routes.assetExport)
                            }}
                        >
                            <MenuContentItemText>
                                Export{tooltipPrivatekey}
                            </MenuContentItemText>
                        </MenuContentItem>

                        {/* <MenuContentItem
                            disabled={!hasPrivateKey}
                            selected={route === routes.assetChangepassword}
                            onClick={e => {
                                if (hasPrivateKey)
                                    onClick(routes.assetChangepassword)
                            }}
                        >
                            <MenuContentItemText>
                                Change password{tooltipPrivatekey}
                            </MenuContentItemText>
                        </MenuContentItem> */}

                        {/* <MenuContentItem
                            selected={route === routes.assetDelete}
                            onClick={e => onClick(routes.assetDelete)}
                        >
                            <MenuContentItemText>Delete</MenuContentItemText>
                        </MenuContentItem> */}
                    </Menu>
                </Div>

                <Router>
                    <Route is={routes.asset}>
                        <Summary />
                    </Route>

                    <Route is={routes.assetSend}>
                        <Send />
                    </Route>

                    <Route is={routes.assetAddresses} if={hasSeed}>
                        <Addresses />
                    </Route>

                    {/* <Route is={routes.assetChangepassword} if={hasPrivateKey}>
                        <ChangePassword />
                    </Route> */}

                    <Route is={routes.assetExport} if={hasPrivateKey}>
                        <Export />
                    </Route>

                    <Route is={routes.assetSettings}>
                        <Settings />
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
