import React, { Component } from 'react'
import { createObserver } from 'dop'
import { Router, Route } from '/doprouter/react'

import { generateQRCode } from '/../util/qr'

import { setHref } from '/actions'

import { location, routes } from '/stores/router'
import state from '/stores/state'
import wallets from '/stores/wallets'

import styles from '/styles'


import IconDashboard from 'react-icons/lib/md/dashboard'
import IconReceive from 'react-icons/lib/md/send'
import Div from '/components/styled/Div'
import H1Input from '/components/styled/H1Input'
import H2 from '/components/styled/H2'
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
        // this.observer.observe(state.view, 'address');
        // this.observer.observe(state.view, 'password');
        // this.observer.observe(state.view, 'repassword');

        // Initial state
        state.view = {
            address: location.path[1],
            // wallet: wallets.BTC[location.path[1]]
        }
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }


    render() {
        return React.createElement(BTCWalletTemplate, {
            pathname: location.pathname,
            qrcodebase64: generateQRCode(state.view.address, 140, styles.color.front2)
        })
    }
}




function BTCWalletTemplate({ pathname, qrcodebase64 }) {
    return (
        <div>
            <RightHeader>
                <RightHeaderInner>
                    <Div width="30px" float="left" padding-top="10px" padding-right="10px">
                        <img src="/static/image/bitcoin.svg" width="30" height="30" />
                    </Div>
                    <Div width="calc(100% - 130px)" float="left">
                        <H1Input width="100%" placeholder="Type a label..." />
                        <H2><strong>$2351.32</strong> ≈ 0.93123 BTC</H2> 
                    </Div>
                    <Div float="right">
                        <img src={qrcodebase64} width="70" height="70" />
                    </Div>
                    <Div clear="both" />
                </RightHeaderInner>
            </RightHeader>
            <RightContent>
                <RightContentMenu>

                    <RightContentMenuItem selected={pathname===routes.createbtc()} onClick={e=>setHref(routes.createbtc())}>
                        <RightContentMenuItemIcon><IconDashboard size={23} color={styles.color.front2} /></RightContentMenuItemIcon>
                        <RightContentMenuItemText>Dashboard</RightContentMenuItemText>
                    </RightContentMenuItem>

                    <RightContentMenuItem selected={pathname===routes.importbtc()} onClick={e=>setHref(routes.importbtc())}>
                        <RightContentMenuItemIcon><IconReceive size={23} color={styles.color.front2} /></RightContentMenuItemIcon>
                        <RightContentMenuItemText>Receive</RightContentMenuItemText>
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