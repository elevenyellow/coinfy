import React, { Component } from 'react'
import { createObserver } from 'dop'
import { Router, Route, Show } from '/doprouter/react'

import { setHref } from '/actions'

import { BTC } from '/const/crypto'
import { location, routes } from '/stores/router'
import {
    state,
    isWalletRegistered,
    isWalletWithPrivateKey
} from '/stores/state'

import styles from '/styles'

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
    RightContentInner
} from '/components/styled/Right'

import HeaderWallet from '/components/partials/HeaderWallet'

export default class WalletBTC extends Component {
    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(location, 'pathname')
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    render() {
        const address = location.path[1]
        const isRegistered = isWalletRegistered(BTC.symbol, address)
        const hasPrivateKey = isWalletWithPrivateKey(BTC.symbol, address)
        return React.createElement(WalletBTCTemplate, {
            pathname: location.pathname,
            isRegistered: isRegistered,
            hasPrivateKey: hasPrivateKey
        })
    }
}

function WalletBTCTemplate({ pathname, isRegistered, hasPrivateKey }) {
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
                    <RightContentMenuItem>
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

                    <RightContentMenuItem selected={true}>
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
                            <RightContentMenuItem>
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

                    <RightContentMenuItem>
                        <RightContentMenuItemIcon>
                            <IconDelete size={23} color={styles.color.front2} />
                        </RightContentMenuItemIcon>
                        <RightContentMenuItemText>
                            Delete
                        </RightContentMenuItemText>
                    </RightContentMenuItem>
                </RightContentMenu>
                <RightContentContent>
                    <RightContentInner>
                        {/* <Router source={location}>
                            <Route pathname={routes.createbtc()}>
                                <CreateBitcoin />
                            </Route> 
                            <Route pathname={routes.importbtc()}>
                                <ImportBitcoin />
                            </Route>
                        </Router> */}
                    </RightContentInner>
                </RightContentContent>
            </RightContent>
        </div>
    )
}
