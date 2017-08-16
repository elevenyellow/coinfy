import React, { Component } from 'react'
import styled from 'styled-components'
import { set, createObserver } from 'dop'
import { Route as Show } from '/doprouter/react'

import { generateQRCode } from '/../util/qr'
import { generateRandomWallet } from '/../util/bitcoin'

import state from '/stores/state'
import styles from '/styles'

import Div from '/components/styled/Div'
import Button from '/components/styled/Button'
import ButtonBig from '/components/styled/ButtonBig'
import QRCode from '/components/styled/QRCode'
import Address from '/components/styled/Address'
import Tooltip from '/components/styled/Tooltip'



export default class CreateBitcoin extends Component {

    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate());
        this.observer.observe(state.view, 'address');
        this.observer.observe(state.view, 'password');
        this.observer.observe(state.view, 'repassword');

        // Initial state
        set(state,'view', {
            address: '',
            password: '',
            repassword: ''
        })

        // binding
        this.onGenerateWallet = this.onGenerateWallet.bind(this)
        this.onChangePassword = this.onChangePassword.bind(this)
        this.onChangeRepassword = this.onChangeRepassword.bind(this)
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }


    // Local actions
    onGenerateWallet(e) {
        const wallet = generateRandomWallet()
        set(state.view, 'address', wallet.address)
        set(state.view, 'private_key', wallet.private_key)
    }
    onChangePassword(e) {
        set(state.view, 'password', e.target.value)
    }
    onChangeRepassword(e) {
        set(state.view, 'repassword', e.target.value)
    }


    // Getters
    isFormValid() {
        return (state.view.password.length>=4 && state.view.password===state.view.repassword)
    }


    render() {
        const isAddressDefined = state.view.address !== ''
        const invalidRepassword = (
            state.view.password.length>0 &&
            state.view.repassword.length>0 &&
            state.view.password.length===state.view.repassword.length &&
            state.view.password!==state.view.repassword
        )
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
                        <Button onClick={this.onGenerateWallet} width="100%">Generate address</Button>
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
                                <Input type="password" width="100%" value={state.view.password} onChange={this.onChangePassword} />
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
                                <Input type="password" width="100%" error={invalidRepassword} value={state.view.repassword} onChange={this.onChangeRepassword} />
                                <Show if={invalidRepassword}>
                                    <InputError>Passwords do not match</InputError> 
                                </Show>
                            </Div>
                        </Div>
                        <Div float="right" >
                            <ButtonBig width="100px" disabled={!this.isFormValid()}>Create</ButtonBig>
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
border: 1px solid ${props=>props.error ? `${styles.color.error} !important` : styles.color.background4};
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
    box-shadow: none !important;
    border-color: ${styles.color.background3};
}
`
const InputError = styled.div`
font-size: 10px;
text-align: left;
color: ${styles.color.error};
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