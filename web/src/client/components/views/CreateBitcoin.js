import React, { Component } from 'react'
import styled from 'styled-components'
import { set, createObserver } from 'dop'
import { Route as Show } from '/doprouter/react'

import { generateQRCode } from '/../util/qr'
import { generateRandomWallet } from '/../util/bitcoin'
import { encryptAES128CTR, decryptAES128CTR } from '/../util/crypto'

import state from '/stores/state'
import styles from '/styles'

import Div from '/components/styled/Div'
import Button from '/components/styled/Button'
import ButtonBig from '/components/styled/ButtonBig'
import QRCode from '/components/styled/QRCode'
import Address from '/components/styled/Address'
import Tooltip from '/components/styled/Tooltip'
import Input from '/components/styled/Input'
import Password from '/components/styled/Password'


const minpassword = 8
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
        this.onCreate = this.onCreate.bind(this)
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
    onCreate(e) {
        e.preventDefault()
        if (this.isFormValid) {
            let enc = encryptAES128CTR(state.view.private_key, state.view.password)
            alert( decryptAES128CTR(enc, state.view.password) );
        }
    }

    // Getters
    get isFormValid() {
        return (state.view.password.length>=minpassword && state.view.password===state.view.repassword)
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
                    <form>
                        <Div height="65px">
                            <Div float="left" width="40%">
                                <Label>Password</Label><Tooltip>Make sure that you remember this. This password can't be restored because we don't store it. For security reasons you will be asked often for this password to operate with this wallet.</Tooltip>
                                <SubLabel>This password encrypts your private key.</SubLabel>
                            </Div>
                            <Div float="left" width="60%">
                                <Password minlength={minpassword} value={state.view.password} onChange={this.onChangePassword} width="100%" type="password" />
                            </Div>
                        </Div>
                        <Div height="55px">
                            <Div float="left" width="40%"><Label>Repeat Password</Label></Div>
                            <Div float="left" width="60%">
                                <Input minlength={minpassword} error={invalidRepassword?'Passwords do not match':null} invalid={invalidRepassword} value={state.view.repassword} onChange={this.onChangeRepassword} width="100%" type="password" />
                            </Div>
                        </Div>
                        <Div float="right" >
                            <ButtonBig width="100px" disabled={!this.isFormValid} onClick={this.onCreate}>Create</ButtonBig>
                        </Div>
                        <Div clear="both" />
                    </form>
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
font-size: 15px;
`

const SubLabel = styled.div`
color: ${styles.color.front2};
font-size: 12px;
line-height: 8px;
`




