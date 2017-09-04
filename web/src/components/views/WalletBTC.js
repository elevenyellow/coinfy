import React, { Component } from 'react'
import { createObserver } from 'dop'
import { Router, Route, Show } from '/doprouter/react'

import { setHref } from '/store/actions'

import { BTC } from '/const/cryptos'
import routes from '/const/routes'
import { state, isWalletRegistered, isWalletWithPrivateKey } from '/store/state'

import styles from '/const/styles'

import IconDashboard from 'react-icons/lib/md/dashboard'
import IconReceive from 'react-icons/lib/md/call-received'
import IconSend from 'react-icons/lib/md/send'
import IconPrint from 'react-icons/lib/fa/print'
import IconKey from 'react-icons/lib/go/key'
import IconDelete from 'react-icons/lib/md/delete'
import Help from '/components/styled/Help'
import Message from '/components/styled/Message'
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
import SetPrivateKeyBTC from '/components/views/SetPrivateKeyBTC'
import PrintBTC from '/components/views/PrintBTC'

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
            routes_summaryWallet: routes.summaryWallet(BTC.symbol, address),
            routes_receiveWallet: routes.receiveWallet(BTC.symbol, address),
            routes_sendWallet: routes.sendWallet(BTC.symbol, address),
            routes_printWallet: routes.printWallet(BTC.symbol, address),
            routes_setPrivateKeyWallet: routes.setPrivateKeyWallet(
                BTC.symbol,
                address
            ),
            routes_changePasswordWallet: routes.changePasswordWallet(
                BTC.symbol,
                address
            ),
            routes_deleteWallet: routes.deleteWallet(BTC.symbol, address),
            onClick: this.onClick
        })
    }
}

function WalletBTCTemplate({
    location,
    isRegistered,
    hasPrivateKey,
    onClick,
    routes_summaryWallet,
    routes_receiveWallet,
    routes_sendWallet,
    routes_printWallet,
    routes_setPrivateKeyWallet,
    routes_changePasswordWallet,
    routes_deleteWallet
}) {
    const tooltipPrivatekey = hasPrivateKey
        ? null
        : <Help position="center" width={175}>
              Set your private key first
          </Help>
    return (
        <div>
            <HeaderWallet />
            <RightContent>
                <RightContentMenu>
                    <RightContentMenuItem
                        selected={
                            location.pathname === routes_summaryWallet ||
                            location.path.length === 2
                        }
                        onClick={e => onClick(routes_summaryWallet)}
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

                    <RightContentMenuItem
                        selected={
                            location.pathname === routes_receiveWallet ||
                            location.path.length === 2
                        }
                        onClick={e => onClick(routes_receiveWallet)}
                    >
                        <RightContentMenuItemIcon>
                            <IconReceive
                                size={23}
                                color={styles.color.front2}
                            />
                        </RightContentMenuItemIcon>
                        <RightContentMenuItemText>
                            Receive
                        </RightContentMenuItemText>
                    </RightContentMenuItem>

                    <RightContentMenuItem
                        disabled={!hasPrivateKey}
                        selected={
                            location.pathname === routes_sendWallet ||
                            location.path.length === 2
                        }
                        onClick={e => {
                            if (hasPrivateKey) onClick(routes_sendWallet)
                        }}
                    >
                        <RightContentMenuItemIcon transform="rotate(-45deg) translateX(3px) translateY(-1px)">
                            <IconSend
                                size={23}
                                color={
                                    hasPrivateKey
                                        ? styles.color.front2
                                        : styles.color.disabled2
                                }
                            />
                        </RightContentMenuItemIcon>
                        <RightContentMenuItemText>
                            Send{tooltipPrivatekey}
                        </RightContentMenuItemText>
                    </RightContentMenuItem>

                    <RightContentMenuItem
                        disabled={!hasPrivateKey}
                        selected={
                            location.pathname === routes_printWallet ||
                            location.path.length === 2
                        }
                        onClick={e => {
                            if (hasPrivateKey) onClick(routes_printWallet)
                        }}
                    >
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
                            Paper Wallet{tooltipPrivatekey}
                        </RightContentMenuItemText>
                    </RightContentMenuItem>

                    <Show if={!hasPrivateKey}>
                        <RightContentMenuItem
                            selected={
                                location.pathname === routes_setPrivateKeyWallet
                            }
                            onClick={e => onClick(routes_setPrivateKeyWallet)}
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

                    <Show if={hasPrivateKey}>
                        <RightContentMenuItem
                            selected={
                                location.pathname ===
                                routes_changePasswordWallet
                            }
                            onClick={e => onClick(routes_changePasswordWallet)}
                        >
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

                    <RightContentMenuItem
                        selected={location.pathname === routes_deleteWallet}
                        onClick={e => onClick(routes_deleteWallet)}
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

                        <Route pathname={routes_printWallet}>
                            <RightContentMiddle>
                                <PrintBTC />
                            </RightContentMiddle>
                        </Route>

                        <Route pathname={routes_deleteWallet}>
                            <RightContentMiddle>
                                <DeleteWallet />
                            </RightContentMiddle>
                        </Route>

                        <Route pathname={routes_setPrivateKeyWallet}>
                            <RightContentMiddle>
                                <SetPrivateKeyBTC />
                            </RightContentMiddle>
                        </Route>

                        <Route>
                            <RightContentMiddle>
                                <Message>To do</Message>
                            </RightContentMiddle>
                        </Route>
                    </Router>
                </RightContentContent>
            </RightContent>
        </div>
    )
}
