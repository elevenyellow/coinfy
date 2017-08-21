import React, { Component } from 'react'
import styled from 'styled-components'
import { set, createObserver, collect } from 'dop'
import { Route as Show } from '/doprouter/react'

import { generateQRCode } from '/../util/qr'
import { isAddress, isPublicKey, isPrivateKey, getAddressFromPublicKey, getAddressFromPrivateKey } from '/../util/bitcoin'
import { encryptAES128CTR } from '/../util/crypto'

import { routes } from '/stores/router'
import state from '/stores/state'
import styles from '/styles'

import Div from '/components/styled/Div'
import Button from '/components/styled/Button'
import QRCode from '/components/styled/QRCode'
import Address from '/components/styled/Address'
import Tooltip from '/components/styled/Tooltip'
import Input from '/components/styled/Input'
import Select from '/components/styled/Select'
import Password from '/components/styled/Password'
import { Label, SubLabel } from '/components/styled/Label'

import { setHref, BTCcreate, BTCsetPrivateKey, BTCsetPublicKey } from '/actions'


const minpassword = 8
const types_import = {
    address: 0,
    public_key: 1,
    private_key: 2
}


export default class ImportBitcoin extends Component {


    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate());
        this.observer.observe(state.view)


        // Initial state
        set(state,'view', {
            type_import: types_import.address,
            input: '',
            address: '',
            private_key: '',
            password: '',
            repassword: ''
        })

        // binding
        this.onChangeTypeImport = this.onChangeTypeImport.bind(this)
        this.onChangeInput = this.onChangeInput.bind(this)
        this.onChangePassword = this.onChangePassword.bind(this)
        this.onChangeRepassword = this.onChangeRepassword.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }


    // Actions 
    onChangeTypeImport(e) {
        const collector = collect()
        set(state.view, 'type_import', Number(e.target.value))
        set(state.view, 'address', '')
        set(state.view, 'input', '')
        set(state.view, 'password', '')
        set(state.view, 'repassword', '')
        collector.emit()
    }


    onChangeInput(e) {
        const collector = collect()
        const value = e.target.value.trim()
        set(state.view, 'input', value)

        if (state.view.type_import===types_import.address && isAddress(value)) {
            set(state.view, 'address', value)
            set(state.view, 'private_key', '')
        }
        else if (state.view.type_import===types_import.public_key && isPublicKey(value)) {
            try {
                const address = getAddressFromPublicKey(value)
                set(state.view, 'address', address)
                set(state.view, 'private_key', '')
            } catch(e) {
                console.log( e );
            }
        }
        else if (state.view.type_import===types_import.private_key && isPrivateKey(value)) {
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
    onChangePassword(e) {
        set(state.view, 'password', e.target.value)
    }
    onChangeRepassword(e) {
        set(state.view, 'repassword', e.target.value)
    }

    onSubmit(e) {
        e.preventDefault()
        if (this.isFormValid) {
            const collector = collect()
            const address = state.view.address
            BTCcreate(address)
            if (state.view.type_import===types_import.public_key)
                BTCsetPublicKey(address, state.view.private_key)

            else if (state.view.type_import===types_import.private_key)
                BTCsetPrivateKey(address, state.view.private_key, state.view.password)
        
            setHref(routes.wallet('BTC', address))
            collector.emit()
        }
    }

    // Getters
    get isFormValid() {
        return (
            state.view.address.length>0 &&
            (state.view.private_key === '' || (
                state.view.password.length>=minpassword &&
                state.view.password===state.view.repassword
            ))
        )
    }

    render() {

        const isValidInput = (state.view.input.length>0 && state.view.address.length>0)
        const isErrorInput = (state.view.input.length>0 && state.view.address.length===0)
        const invalidRepassword = (
            state.view.password.length>0 &&
            state.view.repassword.length>0 &&
            state.view.password.length===state.view.repassword.length &&
            state.view.password!==state.view.repassword
        )

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
                            <Label>I have my</Label>
                            <SubLabel>Select the option you prefer to import.</SubLabel>
                        </Div>
                        <Div float="left" width="60%">
                            <Select width="100%" onChange={this.onChangeTypeImport}>
                                <option value={types_import.address} selected={state.view.type_import===types_import.address}>Address</option>
                                <option value={types_import.public_key} selected={state.view.type_import===types_import.public_key}>Public key</option>
                                <option value={types_import.private_key} selected={state.view.type_import===types_import.private_key}>Private key</option>
                            </Select>
                        </Div>
                    </Div>


                    <Show if={state.view.type_import===types_import.address}>
                        <Div height="65px">
                            <Div float="left" width="40%">
                                <Label>Address</Label>
                                <SubLabel>Type or paste your address.</SubLabel>
                            </Div>
                            <Div float="left" width="60%">
                                <Input width="100%" value={state.view.input} onChange={this.onChangeInput} error={isErrorInput?'Invalid address':null} invalid={isErrorInput} />
                            </Div>
                        </Div>
                    </Show>


                    <Show if={state.view.type_import===types_import.public_key}>
                        <Div height="65px">
                            <Div float="left" width="40%">
                                <Label>Public key</Label><Tooltip>Your address can be calculated through public key.</Tooltip>
                                <SubLabel>Type or paste your public key.</SubLabel>
                            </Div>
                            <Div float="left" width="60%">
                                <Input width="100%" value={state.view.input} onChange={this.onChangeInput} error={isErrorInput?'Invalid public key':null} invalid={isErrorInput} />
                            </Div>
                        </Div>
                    </Show>


                    <Show if={state.view.type_import===types_import.private_key}>
                        <div>
                        <Div height="65px">
                            <Div float="left" width="40%">
                                <Label>Private key</Label><Tooltip>Your address can be calculated through private key.</Tooltip>
                                <SubLabel>Type or paste your Private key.</SubLabel>
                            </Div>
                            <Div float="left" width="60%">
                                <Input width="100%" value={state.view.input} onChange={this.onChangeInput} error={isErrorInput?'Invalid private key':null} invalid={isErrorInput} />
                            </Div>
                        </Div>
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
                        </div>
                    </Show>

                    <Div float="right" >
                        <Button width="100px" disabled={!this.isFormValid} onClick={this.onSubmit}>Import</Button>
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