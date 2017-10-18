import React, { Component } from 'react'
import { createObserver } from 'dop'
import { Router, Route, Show } from '/doprouter/react'

import { setHref } from '/store/actions'

import { BTC } from '/api/Assets'
import routes from '/const/routes'
import state from '/store/state'
import { isAssetWithPrivateKey } from '/store/getters'

import styles from '/const/styles'

import IconDashboard from 'react-icons/lib/md/dashboard'
import IconReceive from 'react-icons/lib/md/call-received'
import IconSend from 'react-icons/lib/md/send'
import IconPrint from 'react-icons/lib/fa/print'
import IconKey from 'react-icons/lib/go/key'
import IconDelete from 'react-icons/lib/md/delete'
import Help from '/components/styled/Help'
import Message from '/components/styled/Message'


import HeaderAsset from '/components/partials/HeaderAsset'
import SummaryBTC from '/components/views/SummaryBTC'
import ReceiveBTC from '/components/views/ReceiveBTC'
import DeleteAsset from '/components/views/DeleteAsset'
import ChangePasswordBTC from '/components/views/ChangePasswordBTC'
import SetPrivateKeyBTC from '/components/views/SetPrivateKeyBTC'
import PrintBTC from '/components/views/PrintBTC'

export default class AssetBTC extends Component {
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
        return React.createElement(AssetBTCTemplate, {
            location: state.location,
            hasPrivateKey: hasPrivateKey,
            routes_summaryAsset: routes.summaryAsset(asset_id),
            routes_receiveAsset: routes.receiveAsset(asset_id),
            routes_sendAsset: routes.sendAsset(asset_id),
            routes_printAsset: routes.printAsset(asset_id),
            routes_setPrivateKeyAsset: routes.setPrivateKeyAsset(asset_id),
            routes_changePasswordAsset: routes.changePasswordAsset(asset_id),
            routes_deleteAsset: routes.deleteAsset(asset_id),
            onClick: this.onClick
        })
    }
}

function AssetBTCTemplate({
    location,
    isRegistered,
    hasPrivateKey,
    onClick,
    routes_summaryAsset,
    routes_receiveAsset,
    routes_sendAsset,
    routes_printAsset,
    routes_setPrivateKeyAsset,
    routes_changePasswordAsset,
    routes_deleteAsset
}) {
    const tooltipPrivatekey = hasPrivateKey
        ? null
        : <Help position="center" width={175}>
              Set your private key first
          </Help>
    return (
        <div>
            <HeaderAsset />
            <RightContent>


                <Router source={location}>

                    <Route pathname={routes_summaryAsset}>
                        <RightContentInner>
                            <SummaryBTC />
                        </RightContentInner>
                    </Route>

                    <Route pathname={routes_receiveAsset}>
                        <RightContainerMiddle>
                            <ReceiveBTC />
                        </RightContainerMiddle>
                    </Route>

                    <Route pathname={routes_printAsset}>
                        <RightContainerMiddle>
                            <PrintBTC />
                        </RightContainerMiddle>
                    </Route>

                    <Route pathname={routes_deleteAsset}>
                        <RightContainerMiddle>
                            <DeleteAsset />
                        </RightContainerMiddle>
                    </Route>

                    <Route pathname={routes_changePasswordAsset}>
                        <RightContainerMiddle>
                            <ChangePasswordBTC />
                        </RightContainerMiddle>
                    </Route>

                    <Route pathname={routes_setPrivateKeyAsset}>
                        <RightContainerMiddle>
                            <SetPrivateKeyBTC />
                        </RightContainerMiddle>
                    </Route>

                    <Route>
                        <RightContainerMiddle>
                            <Message>In development</Message>
                        </RightContainerMiddle>
                    </Route>
                </Router>

            </RightContent>
        </div>
    )
}



// <RightContentMenu>
// <RightContentMenuItem
//     selected={
//         location.pathname === routes_summaryAsset ||
//         location.path.length === 2
//     }
//     onClick={e => onClick(routes_summaryAsset)}
// >
//     <RightContentMenuItemIcon>
//         <IconDashboard
//             size={23}
//             color={styles.color.front2}
//         />
//     </RightContentMenuItemIcon>
//     <RightContentMenuItemText>
//         Summary
//     </RightContentMenuItemText>
// </RightContentMenuItem>

// <RightContentMenuItem
//     selected={
//         location.pathname === routes_receiveAsset ||
//         location.path.length === 2
//     }
//     onClick={e => onClick(routes_receiveAsset)}
// >
//     <RightContentMenuItemIcon>
//         <IconReceive
//             size={23}
//             color={styles.color.front2}
//         />
//     </RightContentMenuItemIcon>
//     <RightContentMenuItemText>
//         Receive
//     </RightContentMenuItemText>
// </RightContentMenuItem>

// <RightContentMenuItem
//     disabled={!hasPrivateKey}
//     selected={
//         location.pathname === routes_sendAsset ||
//         location.path.length === 2
//     }
//     onClick={e => {
//         if (hasPrivateKey) onClick(routes_sendAsset)
//     }}
// >
//     <RightContentMenuItemIcon transform="rotate(-45deg) translateX(3px) translateY(-1px)">
//         <IconSend
//             size={23}
//             color={
//                 hasPrivateKey
//                     ? styles.color.front2
//                     : styles.color.disabled2
//             }
//         />
//     </RightContentMenuItemIcon>
//     <RightContentMenuItemText>
//         Send{tooltipPrivatekey}
//     </RightContentMenuItemText>
// </RightContentMenuItem>

// <RightContentMenuItem
//     disabled={!hasPrivateKey}
//     selected={
//         location.pathname === routes_printAsset ||
//         location.path.length === 2
//     }
//     onClick={e => {
//         if (hasPrivateKey) onClick(routes_printAsset)
//     }}
// >
//     <RightContentMenuItemIcon>
//         <IconPrint
//             size={23}
//             color={
//                 hasPrivateKey
//                     ? styles.color.front2
//                     : styles.color.disabled2
//             }
//         />
//     </RightContentMenuItemIcon>
//     <RightContentMenuItemText>
//         Paper Wallet{tooltipPrivatekey}
//     </RightContentMenuItemText>
// </RightContentMenuItem>

// <Show if={!hasPrivateKey}>
//     <RightContentMenuItem
//         selected={
//             location.pathname === routes_setPrivateKeyAsset
//         }
//         onClick={e => onClick(routes_setPrivateKeyAsset)}
//     >
//         <RightContentMenuItemIcon>
//             <IconKey
//                 size={23}
//                 color={styles.color.front2}
//             />
//         </RightContentMenuItemIcon>
//         <RightContentMenuItemText>
//             Set private key
//         </RightContentMenuItemText>
//     </RightContentMenuItem>
// </Show>

// <Show if={hasPrivateKey}>
//     <RightContentMenuItem
//         selected={
//             location.pathname ===
//             routes_changePasswordAsset
//         }
//         onClick={e => onClick(routes_changePasswordAsset)}
//     >
//         <RightContentMenuItemIcon>
//             <IconKey
//                 size={23}
//                 color={styles.color.front2}
//             />
//         </RightContentMenuItemIcon>
//         <RightContentMenuItemText>
//             Change password
//         </RightContentMenuItemText>
//     </RightContentMenuItem>
// </Show>

// <RightContentMenuItem
//     selected={location.pathname === routes_deleteAsset}
//     onClick={e => onClick(routes_deleteAsset)}
// >
//     <RightContentMenuItemIcon>
//         <IconDelete size={23} color={styles.color.front2} />
//     </RightContentMenuItemIcon>
//     <RightContentMenuItemText>
//         Delete
//     </RightContentMenuItemText>
// </RightContentMenuItem>
// </RightContentMenu>
