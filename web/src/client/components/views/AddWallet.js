import React, { Component } from 'react'
import ui from '/stores/ui'

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


export default function AddWallet() {
    return (
        <div>
            <RightHeader>
                <RightHeaderInner>
                    <Div float="left">
                        <H1>Add wallet</H1>
                        <H2>Create bitcoin wallet</H2>
                    </Div>
                    <Div clear="both" />
                </RightHeaderInner>
            </RightHeader>
            <RightContent>
                <RightContentMenu>

                    <RightContentMenuItem>
                        <RightContentMenuItemIcon><img src="/static/image/bitcoin.svg" width="20" height="20" /></RightContentMenuItemIcon>
                        <RightContentMenuItemText>Import wallet</RightContentMenuItemText>
                    </RightContentMenuItem>

                    <RightContentMenuItem selected={true}>
                        <RightContentMenuItemIcon><img src="/static/image/bitcoin.svg" width="20" height="20" /></RightContentMenuItemIcon>
                        <RightContentMenuItemText>Create new wallet</RightContentMenuItemText>
                    </RightContentMenuItem>

                    <RightContentMenuItem>
                        <RightContentMenuItemIcon><img src="/static/image/bitcoin.svg" width="20" height="20" /></RightContentMenuItemIcon>
                        <RightContentMenuItemText>Import Ethereum</RightContentMenuItemText>
                    </RightContentMenuItem>

                </RightContentMenu>
                <RightContentContent>
                    <RightContentInner>
                        
                    </RightContentInner>
                </RightContentContent>
            </RightContent>
        </div>
    )
}






