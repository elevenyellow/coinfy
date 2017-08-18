import React, { Component } from 'react'
import styled from 'styled-components'
import { set, createObserver, collect } from 'dop'
import { Route as Show } from '/doprouter/react'

import { generateQRCode } from '/../util/qr'
import { isAddress, isPrivateKey, getAddressFromPrivateKey } from '/../util/bitcoin'
import { encryptAES128CTR, decryptAES128CTR } from '/../util/crypto'

import state from '/stores/state'
import styles from '/styles'

import Div from '/components/styled/Div'
import Button from '/components/styled/Button'
import QRCode from '/components/styled/QRCode'
import Address from '/components/styled/Address'
import Tooltip from '/components/styled/Tooltip'
import Input from '/components/styled/Input'
import Password from '/components/styled/Password'
import { Label, SubLabel } from '/components/styled/Label'

import { addWalletBtc } from '/actions'


const minpassword = 8
export default class CreateBitcoin extends Component {


    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate());
        this.observer.observe(state.view)


        // Initial state
        set(state,'view', {
            input: '',
            address: '',
            private_key: '',
            password: '',
            repassword: ''
        })

        // binding
        this.onChangeInput = this.onChangeInput.bind(this)
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }


    // Actions 
    onChangeInput(e) {
        const collector = collect()
        const value = e.target.value.trim()
        set(state.view, 'input', value)

        if (isAddress(value)) {
            set(state.view, 'address', value)
            set(state.view, 'private_key', '')
        }
        else if (isPrivateKey(value)) {
            try {
                const address = getAddressFromPrivateKey(value)
                set(state.view, 'address', address)
                set(state.view, 'private_key', value)
            } catch(e) {
                console.log( e );
            }
        }
        else {
            set(state.view, 'address', '')
            set(state.view, 'private_key', '')
        }
        collector.emit()
    }




    render() {

        const isValidInput = (state.view.input.length>0 && state.view.address.length>0)
        const isErrorInput = (state.view.input.length>0 && state.view.address.length===0)
        let qrcodebase64 = ''
        if (isValidInput)
            qrcodebase64 = generateQRCode(state.view.address)

        return (
            <div>
                <Div padding-bottom="15px">
                    <QRCode>
                        <Show if={isValidInput}>
                            <img width="150" src={qrcodebase64} />
                        </Show>
                    </QRCode>
                </Div>
                <Div padding-bottom="50px">
                    <CenterElement>
                        <Address>{state.view.address}</Address>
                    </CenterElement>
                </Div>


                <form>
                    <Div height="65px">
                        <Div float="left" width="40%">
                            <Label>Address or Private key</Label><Tooltip>Your address can be calculated through private key.</Tooltip>
                            <SubLabel>Type or paste your address or Private key.</SubLabel>
                        </Div>
                        <Div float="left" width="60%">
                            <Input width="100%" value={state.view.input} onChange={this.onChangeInput} error={isErrorInput?'Invalid address or private key':null} invalid={isErrorInput} />
                        </Div>
                    </Div>
                    {/* <Div height="65px">
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
                            <Input minlength={minpassword} invalid={invalidRepassword} value={state.view.repassword} onChange={this.onChangeRepassword} width="100%" type="password" />
                        </Div>
                    </Div> */}
                    <Div float="right" >
                        <Button width="100px">Import</Button>
                    </Div>
                    <Div clear="both" />
                </form>

            </div>
        )
    }
}




const CenterElement = styled.div`
margin: 0 auto;
width: 360px;
`