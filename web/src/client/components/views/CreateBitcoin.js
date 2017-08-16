import React, { Component } from 'react'
import styled from 'styled-components'
import { set, createObserver } from 'dop'
import { Route as Show } from '/doprouter/react'

import { setInitialViewState, generateBitcoinWallet } from '/actions'
import state from '/stores/state'
import styles from '/styles'
import Div from '/components/styled/Div'
import Button from '/components/styled/Button'
import ButtonBig from '/components/styled/ButtonBig'
import QRCode from '/components/styled/QRCode'
import Address from '/components/styled/Address'
import Tooltip from '/components/styled/Tooltip'
import { generateQRCode } from '/../util/qr'


export default class CreateBitcoin extends Component {

    componentWillMount() {
        this.observer = createObserver(mutations => this.forceUpdate());
        this.observer.observe(state.view, 'address');
        set(state,'view', {
            address: ''
        })
    }

    componentWillUnmount() {
        this.observer.destroy()
    }

    shouldComponentUpdate() {
        return false
    }

    render() {
        const isAddressDefined = state.view.address !== ''
        let qrcodebase64 = ''
        if (isAddressDefined)
            qrcodebase64 = generateQRCode(state.view.address)

        return (
            <div>
                <Div padding-bottom="15px">
                    <QRCode>
                        <Show if={isAddressDefined}>
                            <img width="150" src={qrcodebase64} />
                        </Show>
                    </QRCode>
                </Div>
                <Div padding-bottom="10px">
                    <CenterElement>
                        <Address>{state.view.address}</Address>
                    </CenterElement>
                </Div>
                <Div padding-bottom="50px">
                    <CenterElement>
                        <Button onClick={generateBitcoinWallet} width="100%">Generate address</Button>
                    </CenterElement>
                </Div>

                <Show if={isAddressDefined}>
                    <div>
                        <Div height="65px">
                            <Div float="left" width="40%">
                                <Label>Password</Label><Tooltip>Make sure that you remember this. This password can't be restored because we don't store it. You will be asked often for this password to operate with this wallet.</Tooltip>
                                <SubLabel>This password encrypts your private key.</SubLabel>
                            </Div>
                            <Div float="left" width="60%">
                                <Input type="password" width="100%" />
                                <div>
                                    <PasswordIndicator />
                                    <PasswordIndicator />
                                    <PasswordIndicator />
                                    <PasswordIndicator />
                                </div>
                                {/* <PasswordLabel>Very weak</PasswordLabel> */}
                            </Div>
                        </Div>
                        <Div height="55px">
                            <Div float="left" width="40%"><Label>Repeat Password</Label></Div>
                            <Div float="left" width="60%">
                                <Input type="password" width="100%" />
                                {/* <InputError>Invalid password</InputError> */}
                            </Div>
                        </Div>
                        <Div float="right" >
                            <ButtonBig width="100px">Create</ButtonBig>
                        </Div>
                        <Div clear="both" />
                    </div>
                </Show>
            </div>
        )
    }
}



const CenterElement = styled.div`
margin: 0 auto;
width: 360px;
`



const Label = styled.label`
font-weight: 600;
margin-bottom: 0px;
line-height: 1.9em;
color: ${styles.color.front3};
font-size: 13px;
`

const SubLabel = styled.div`
color: ${styles.color.front2};
font-size: 11px;
line-height: 8px;
`

const Input = styled.input`
${props=>{
    if (props.width) return 'width:'+props.width+';'
}}
border: 1px solid ${styles.color.background4};
background: #FFF;
padding: 10px;
font-weight: 500;
outline: none;
font-family: monospace;
font-size: 14px;
color:${styles.color.front6};
box-shadow:0 1px 1px 0 rgba(0,0,0,0.05) inset;
box-sizing: border-box;

&:focus {
    box-shadow: none!important;
    border-color: ${styles.color.background3};
}
`
const InputError = styled.div`
font-size: 10px;
text-align: left;
color: #c30;
`

const PasswordIndicator = styled.div`
float:left;
width:calc(25% - 2px);
height:3px;
background-color:${props=>props.color||'#EEE'};
margin-top:2px;
border-right: 2px solid white;
:last-child {
    border-right: 0;
    width:25%;
}
`

const PasswordLabel = styled.div`
text-align: right;
color:${props=>props.color||styles.color.front2};
font-size: 11px;
`