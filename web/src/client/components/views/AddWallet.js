import React, { Component } from 'react'
import { createObserver } from 'dop'
import { Router, Route } from '/doprouter/react'

import { setHref } from '/actions'
import { location, routes } from '/stores/router'

import Div from '/components/styled/Div'
import H1 from '/components/styled/H1'
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

import CreateBitcoin from '/components/views/CreateBitcoin'




export default class AddWallet extends Component {

    componentWillMount() {
        this.observer = createObserver(mutations => this.forceUpdate());
        this.observer.observe(location.path, 'length');
        this.observer.observe(location.path, '1');
    }

    componentWillUnmount() {
        this.observer.destroy()
    }

    shouldComponentUpdate() {
        return false
    }


    render() {
        return (
            <div>
                <RightHeader>
                    <RightHeaderInner>
                        <Div float="left">
                            <H1>Add wallet</H1>
                            <H2>Create or Import Wallets</H2> 
                        </Div>
                        <Div clear="both" />
                    </RightHeaderInner>
                </RightHeader>
                <RightContent>
                    <RightContentMenu>

                        <RightContentMenuItem selected={location.pathname===routes.createbtc} onClick={e=>setHref(routes.createbtc)}>
                            <RightContentMenuItemIcon><img src="/static/image/bitcoin.svg" width="20" height="20" /></RightContentMenuItemIcon>
                            <RightContentMenuItemText>Create Bitcoin wallet</RightContentMenuItemText>
                        </RightContentMenuItem>

                        <RightContentMenuItem selected={location.pathname===routes.importbtc} onClick={e=>setHref(routes.importbtc)}>
                            <RightContentMenuItemIcon><img src="/static/image/bitcoin.svg" width="20" height="20" /></RightContentMenuItemIcon>
                            <RightContentMenuItemText>Import Bitcoin wallet</RightContentMenuItemText>
                        </RightContentMenuItem>

                    </RightContentMenu>
                    <RightContentContent>
                        <RightContentInner>
                            
                            <Router source={location}>
                                <Route pathname={routes.createbtc}>
                                    <CreateBitcoin />
                                </Route> 
                                <Route pathname={routes.importbtc}>
                                    <div>Import</div>
                                </Route>
                            </Router>


                        </RightContentInner>
                    </RightContentContent>
                </RightContent>
            </div>
        )
    }
}






