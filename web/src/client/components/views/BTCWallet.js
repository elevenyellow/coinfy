import React, { Component } from 'react'
import { createObserver } from 'dop'
import { Router, Route, Show } from '/doprouter/react'

import { setHref } from '/actions'

import { location, routes } from '/stores/router'
import state from '/stores/state'

import styles from '/styles'


import IconDashboard from 'react-icons/lib/md/dashboard'
import IconReceive from 'react-icons/lib/md/send'
import IconPrint from 'react-icons/lib/fa/print'
import IconKey from 'react-icons/lib/go/key'
import IconDelete from 'react-icons/lib/md/delete'
import Div from '/components/styled/Div'
import H1Input from '/components/styled/H1Input'
import H2 from '/components/styled/H2'
import Help from '/components/styled/Help'
import Opacity from '/components/styled/Opacity'
import { 
    RightHeader,
    RightHeaderInner,
    RightContent,
    RightContentMenu,
    RightContentMenuItem,
    RightContentMenuItemIcon,
    RightContentMenuItemText,
    RightContentContent,
    RightContentInner
} from '/components/styled/Right'


export default class BTCWallet extends Component {

    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate());
        this.observer.observe(location, 'pathname');

        // Initial state
        state.view = {
            address: location.path[1],
        }
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }


    render() {
        const address = location.path[1]
        const isRegistered = state.wallets.BTC.hasOwnProperty(address)
        const hasPrivateKey = isRegistered && state.wallets.BTC[address].hasOwnProperty('private_key')
        return React.createElement(BTCWalletTemplate, {
            pathname: location.pathname,
            isRegistered: isRegistered,
            hasPrivateKey: hasPrivateKey
        })
    }
}




function BTCWalletTemplate({ pathname, hasPrivateKey }) {
    const tooltipPrivatekey = hasPrivateKey ? null : <Help position="center" width={150}>You must set your private key first in order to use this area.</Help>
    return (
        <div>
            <RightHeader>
                <RightHeaderInner>
                    <Div width="30px" float="left" padding-top="11px" padding-right="10px">
                        <img src="/static/image/BTC.svg" width="30" height="30" />
                    </Div>
                    <Div width="calc(100% - 130px)" float="left">
                        <H1Input width="100%" placeholder="Type a label..." />
                        <H2><strong>$2351.32</strong> ≈ 0.93123 BTC</H2> 
                    </Div>
                    <Opacity normal="1" hover=".7">
                        <Div float="right" cursor="pointer">
                            <img width="70" height="70" src="data:image/png;base64,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" />
                        </Div>
                    </Opacity>
                    <Div clear="both" />
                </RightHeaderInner>
            </RightHeader>
            <RightContent>
                <RightContentMenu>

                    <RightContentMenuItem>
                        <RightContentMenuItemIcon><IconDashboard size={23} color={styles.color.front2} /></RightContentMenuItemIcon>
                        <RightContentMenuItemText>Summary</RightContentMenuItemText>
                    </RightContentMenuItem>

                    <RightContentMenuItem selected={true}>
                        <RightContentMenuItemIcon transform="rotate(130deg) translateX(3px) translateY(-1px)"><IconReceive size={23} color={styles.color.front2} /></RightContentMenuItemIcon>
                        <RightContentMenuItemText>Receive</RightContentMenuItemText>
                    </RightContentMenuItem>

                    <RightContentMenuItem disabled={!hasPrivateKey}>
                        <RightContentMenuItemIcon transform="rotate(-45deg) translateX(3px) translateY(-1px)"><IconReceive size={23} color={hasPrivateKey?styles.color.front2:styles.color.disabled2} /></RightContentMenuItemIcon>
                        <RightContentMenuItemText>Send</RightContentMenuItemText>
                    </RightContentMenuItem>

                    <RightContentMenuItem disabled={!hasPrivateKey}>
                        <RightContentMenuItemIcon><IconPrint size={23} color={hasPrivateKey?styles.color.front2:styles.color.disabled2} /></RightContentMenuItemIcon>
                        <RightContentMenuItemText>Print</RightContentMenuItemText>
                    </RightContentMenuItem>

                    <Router>
                        <Show if={hasPrivateKey}>
                            <RightContentMenuItem>
                                <RightContentMenuItemIcon><IconKey size={23} color={styles.color.front2} /></RightContentMenuItemIcon>
                                <RightContentMenuItemText>Change password</RightContentMenuItemText>
                            </RightContentMenuItem>
                        </Show>
                        <Show>
                            <RightContentMenuItem>
                                <RightContentMenuItemIcon><IconKey size={23} color={styles.color.front2} /></RightContentMenuItemIcon>
                                <RightContentMenuItemText>Set private key</RightContentMenuItemText>
                            </RightContentMenuItem>
                        </Show>
                    </Router>

                    <RightContentMenuItem>
                        <RightContentMenuItemIcon><IconDelete size={23} color={styles.color.front2} /></RightContentMenuItemIcon>
                        <RightContentMenuItemText>Delete</RightContentMenuItemText>
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