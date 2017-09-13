import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver, collect } from 'dop'
import { Show } from '/doprouter/react'

import { generateQRCode } from '/api/qr'
import { generateRandomWallet } from '/api/assets/BTC'

import { BTC } from '/api/assets'
import routes from '/const/routes'
import state from '/store/state'
import styles from '/const/styles'

import Div from '/components/styled/Div'
import Button from '/components/styled/Button'
import QRCode from '/components/styled/QRCode'
import Address from '/components/styled/Address'
import Help from '/components/styled/Help'
import Input from '/components/styled/Input'
import Password from '/components/styled/Password'
import { Label, SubLabel } from '/components/styled/Label'

import { setHref, createWallet, setPrivateKey } from '/store/actions'

const minpassword = 8
export default class CreateBitcoin extends Component {
    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.view, 'address')
        this.observer.observe(state.view, 'password')
        this.observer.observe(state.view, 'repassword')

        // Initial state
        state.view = {
            address: '',
            password: '',
            repassword: ''
        }

        // binding
        this.onGenerateWallet = this.onGenerateWallet.bind(this)
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

    // Local actions
    onGenerateWallet(e) {
        const wallet = generateRandomWallet()
        state.view.address = wallet.address
        state.view.private_key = wallet.private_key
    }
    onChangePassword(e) {
        state.view.password = e.target.value
    }
    onChangeRepassword(e) {
        state.view.repassword = e.target.value
    }
    onSubmit(e) {
        e.preventDefault()
        if (this.isFormValid) {
            const collector = collect()
            const address = state.view.address
            createWallet(BTC.symbol, address)
            setPrivateKey(
                BTC.symbol,
                address,
                state.view.private_key,
                state.view.password
            )
            setHref(routes.wallet(BTC.symbol, address))
            collector.emit()
        }
    }

    // Getters
    get isFormValid() {
        return (
            state.view.password.length >= minpassword &&
            state.view.password === state.view.repassword
        )
    }
    get isAddressDefined() {
        return state.view.address !== ''
    }
    get isInvalidRepassword() {
        return (
            state.view.password.length > 0 &&
            state.view.repassword.length > 0 &&
            state.view.password.length === state.view.repassword.length &&
            state.view.password !== state.view.repassword
        )
    }

    render() {
        return React.createElement(CreateBitcoinTemplate, {
            qrcodebase64: this.isAddressDefined
                ? generateQRCode(state.view.address)
                : '',
            isAddressDefined: this.isAddressDefined,
            isInvalidRepassword: this.isInvalidRepassword,
            isFormValid: this.isFormValid,
            address: state.view.address,
            password: state.view.password,
            repassword: state.view.repassword,
            onGenerateWallet: this.onGenerateWallet,
            onChangePassword: this.onChangePassword,
            onChangeRepassword: this.onChangeRepassword,
            onSubmit: this.onSubmit,
            minpassword: minpassword
        })
    }
}

function CreateBitcoinTemplate({
    qrcodebase64,
    isAddressDefined,
    isInvalidRepassword,
    isFormValid,
    address,
    password,
    repassword,
    onGenerateWallet,
    onChangePassword,
    onChangeRepassword,
    onSubmit
}) {
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
                    <Address>
                        {address}
                    </Address>
                </CenterElement>
            </Div>
            <Div padding-bottom="50px">
                <CenterElement>
                    <Button onClick={onGenerateWallet} width="100%">
                        Generate address
                    </Button>
                </CenterElement>
            </Div>

            <Show if={isAddressDefined}>
                <form>
                    <Div height="65px">
                        <Div float="left" width="40%">
                            <Label>Password</Label>
                            <Help>
                                Make sure that you remember this. This password
                                can't be restored because we don't store it. For
                                security reasons you will be asked often for
                                this password to operate with this wallet.
                            </Help>
                            <SubLabel>
                                This password encrypts your private key.
                            </SubLabel>
                        </Div>
                        <Div float="left" width="60%">
                            <Password
                                minlength={minpassword}
                                value={password}
                                onChange={onChangePassword}
                                width="100%"
                                type="password"
                            />
                        </Div>
                    </Div>
                    <Div height="55px">
                        <Div float="left" width="40%">
                            <Label>Repeat Password</Label>
                        </Div>
                        <Div float="left" width="60%">
                            <Input
                                minlength={minpassword}
                                error={
                                    isInvalidRepassword
                                        ? 'Passwords do not match'
                                        : null
                                }
                                invalid={isInvalidRepassword}
                                value={repassword}
                                onChange={onChangeRepassword}
                                width="100%"
                                type="password"
                            />
                        </Div>
                    </Div>
                    <Div float="right">
                        <Button
                            width="100px"
                            disabled={!isFormValid}
                            onClick={onSubmit}
                        >
                            Create
                        </Button>
                    </Div>
                    <Div clear="both" />
                </form>
            </Show>
        </div>
    )
}

const CenterElement = styled.div`
    margin: 0 auto;
    width: 360px;
`
