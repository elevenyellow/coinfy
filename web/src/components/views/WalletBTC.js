import React, { Component } from 'react'
import { createObserver } from 'dop'
import { Router, Route, Show } from '/doprouter/react'

import { setHref } from '/store/actions'

import { BTC } from '/const/crypto'
import routes from '/const/routes'
import { state, isWalletRegistered, isWalletWithPrivateKey } from '/store/state'

import styles from '/const/styles'

import IconDashboard from 'react-icons/lib/md/dashboard'
import IconReceive from 'react-icons/lib/md/send'
import IconPrint from 'react-icons/lib/fa/print'
import IconKey from 'react-icons/lib/go/key'
import IconDelete from 'react-icons/lib/md/delete'
import Help from '/components/styled/Help'
import {
    RightContent,
    RightContentMenu,
    RightContentMenuItem,
    RightContentMenuItemIcon,
    RightContentMenuItemText,
    RightContentContent,
    RightContentInner,
    RightContentMiddle
} from '/components/styled/Right'

import HeaderWallet from '/components/partials/HeaderWallet'
import DeleteWallet from '/components/views/DeleteWallet'
import SetPrivateKey from '/components/views/SetPrivateKey'

export default class WalletBTC extends Component {
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
        const address = state.location.path[1]
        const hasPrivateKey = isWalletWithPrivateKey(BTC.symbol, address)
        return React.createElement(WalletBTCTemplate, {
            location: state.location,
            hasPrivateKey: hasPrivateKey,
            routesSummaryWallet: routes.summaryWallet(BTC.symbol, address),
            routesSetPrivateKeyWallet: routes.setPrivateKeyWallet(BTC.symbol, address),
            routesDeleteWallet: routes.deleteWallet(BTC.symbol, address),
            onClick: this.onClick
        })
    }
}

function WalletBTCTemplate({
    location,
    isRegistered,
    hasPrivateKey,
    onClick,
    routesSummaryWallet,
    routesSetPrivateKeyWallet,
    routesDeleteWallet,
}) {
    const tooltipPrivatekey = hasPrivateKey
        ? null
        : <Help position="center" width={175}>
              You must set your private key
          </Help>
    return (
        <div>
            <HeaderWallet />
            <RightContent>
                <RightContentMenu>
                    <RightContentMenuItem
                        selected={location.pathname === routesSummaryWallet || location.path.length===2}
                        onClick={e => onClick(routesSummaryWallet)}
                    >
                        <RightContentMenuItemIcon>
                            <IconDashboard
                                size={23}
                                color={styles.color.front2}
                            />
                        </RightContentMenuItemIcon>
                        <RightContentMenuItemText>
                            Summary
                        </RightContentMenuItemText>
                    </RightContentMenuItem>

                    <RightContentMenuItem>
                        <RightContentMenuItemIcon transform="rotate(130deg) translateX(3px) translateY(-1px)">
                            <IconReceive
                                size={23}
                                color={styles.color.front2}
                            />
                        </RightContentMenuItemIcon>
                        <RightContentMenuItemText>
                            Receive
                        </RightContentMenuItemText>
                    </RightContentMenuItem>

                    <RightContentMenuItem disabled={!hasPrivateKey}>
                        <RightContentMenuItemIcon transform="rotate(-45deg) translateX(3px) translateY(-1px)">
                            <IconReceive
                                size={23}
                                color={
                                    hasPrivateKey
                                        ? styles.color.front2
                                        : styles.color.disabled2
                                }
                            />
                        </RightContentMenuItemIcon>
                        <RightContentMenuItemText>
                            Send {tooltipPrivatekey}
                        </RightContentMenuItemText>
                    </RightContentMenuItem>

                    <RightContentMenuItem disabled={!hasPrivateKey}>
                        <RightContentMenuItemIcon>
                            <IconPrint
                                size={23}
                                color={
                                    hasPrivateKey
                                        ? styles.color.front2
                                        : styles.color.disabled2
                                }
                            />
                        </RightContentMenuItemIcon>
                        <RightContentMenuItemText>
                            Print {tooltipPrivatekey}
                        </RightContentMenuItemText>
                    </RightContentMenuItem>

                    <Router>
                        <Show if={hasPrivateKey}>
                            <RightContentMenuItem>
                                <RightContentMenuItemIcon>
                                    <IconKey
                                        size={23}
                                        color={styles.color.front2}
                                    />
                                </RightContentMenuItemIcon>
                                <RightContentMenuItemText>
                                    Change password
                                </RightContentMenuItemText>
                            </RightContentMenuItem>
                        </Show>
                        <Show>
                            <RightContentMenuItem
                                selected={location.pathname === routesSetPrivateKeyWallet}
                                onClick={e => onClick(routesSetPrivateKeyWallet)}
                            >
                                <RightContentMenuItemIcon>
                                    <IconKey
                                        size={23}
                                        color={styles.color.front2}
                                    />
                                </RightContentMenuItemIcon>
                                <RightContentMenuItemText>
                                    Set private key
                                </RightContentMenuItemText>
                            </RightContentMenuItem>
                        </Show>
                    </Router>

                    <RightContentMenuItem
                        selected={location.pathname === routesDeleteWallet}
                        onClick={e => onClick(routesDeleteWallet)}
                    >
                        <RightContentMenuItemIcon>
                            <IconDelete size={23} color={styles.color.front2} />
                        </RightContentMenuItemIcon>
                        <RightContentMenuItemText>
                            Delete
                        </RightContentMenuItemText>
                    </RightContentMenuItem>
                </RightContentMenu>
                <RightContentContent>
                    
                        <Router source={location}>

                            <Route pathname={routesDeleteWallet}>
                                <RightContentMiddle>
                                    <DeleteWallet />
                                </RightContentMiddle>
                            </Route>
                            <Route pathname={routesSetPrivateKeyWallet}>
                                <RightContentInner>
                                    <SetPrivateKey />
                                </RightContentInner>
                            </Route>
                            <Route>
                                <RightContentInner>
                                    <div>Summary</div>
                                </RightContentInner>
                            </Route> 
                        </Router>
                </RightContentContent>
            </RightContent>
        </div>
    )
}
