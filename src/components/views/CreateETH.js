import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver, collect } from 'dop'
import { Show } from '/doprouter/react'

import { generateQRCode } from '/api/qr'
import { generateRandomWallet } from '/api/Assets/ETH'
import { minpassword } from '/api/crypto'

import { ETH, getAssetId } from '/api/Assets'
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
import CenterElement from '/components/styled/CenterElement'
import { Label, SubLabel } from '/components/styled/Label'
import {
    FormField,
    FormFieldLeft,
    FormFieldRight,
    FormFieldButtons
} from '/components/styled/Form'
import H1 from '/components/styled/H1'
import H2 from '/components/styled/H2'
import {
    RightContainerPadding,
    RightHeader,
    RightContent
} from '/components/styled/Right'

import { setHref, createAsset, setPrivateKey } from '/store/actions'

export default class CreateEthereum extends Component {
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
        this.onGenerateAsset = this.onGenerateAsset.bind(this)
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
    onGenerateAsset(e) {
        const asset = generateRandomWallet()
        state.view.address = asset.address
        state.view.private_key = asset.private_key
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
            const asset = createAsset(ETH.type, ETH.symbol, address)
            setPrivateKey(
                getAssetId({ symbol: ETH.symbol, address }),
                state.view.private_key,
                state.view.password
            )
            setHref(routes.asset(getAssetId(asset)))
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
        return React.createElement(CreateEthereumTemplate, {
            qrcodebase64: this.isAddressDefined
                ? generateQRCode(state.view.address)
                : '',
            isAddressDefined: this.isAddressDefined,
            isInvalidRepassword: this.isInvalidRepassword,
            isFormValid: this.isFormValid,
            address: state.view.address,
            password: state.view.password,
            repassword: state.view.repassword,
            onGenerateAsset: this.onGenerateAsset,
            onChangePassword: this.onChangePassword,
            onChangeRepassword: this.onChangeRepassword,
            onSubmit: this.onSubmit,
            minpassword: minpassword
        })
    }
}

function CreateEthereumTemplate({
    qrcodebase64,
    isAddressDefined,
    isInvalidRepassword,
    isFormValid,
    address,
    password,
    repassword,
    onGenerateAsset,
    onChangePassword,
    onChangeRepassword,
    onSubmit
}) {
    return (
        <RightContainerPadding>
            <RightHeader>
                <Div float="left">
                    <H1>Add asset</H1>
                    <H2>Create a new Ethereum Wallet</H2>
                </Div>
                <Div clear="both" />
            </RightHeader>
            <RightContent>
                <FormField>
                    <Div>
                        <QRCode>
                            <Show if={isAddressDefined}>
                                <img width="150" src={qrcodebase64} />
                            </Show>
                        </QRCode>
                    </Div>
                    <Div>
                        <Address>{address}</Address>
                    </Div>
                    <Div padding-bottom="20px">
                        <CenterElement>
                            <Button onClick={onGenerateAsset} width="100%">
                                Generate address
                            </Button>
                        </CenterElement>
                    </Div>
                </FormField>

                <Show if={isAddressDefined}>
                    <form>
                        <FormField>
                            <FormFieldLeft>
                                <Label>Password</Label>
                                <Help position="center">
                                    Make sure that you remember this. This
                                    password can't be restored because we don't
                                    store it. For security reasons you will be
                                    asked often for this password to operate
                                    with this asset.
                                </Help>
                                <SubLabel>
                                    This password encrypts your private key.
                                </SubLabel>
                            </FormFieldLeft>
                            <FormFieldRight>
                                <Password
                                    minlength={minpassword}
                                    value={password}
                                    onChange={onChangePassword}
                                    width="100%"
                                    type="password"
                                />
                            </FormFieldRight>
                        </FormField>
                        <FormField>
                            <FormFieldLeft>
                                <Label>Repeat Password</Label>
                            </FormFieldLeft>
                            <FormFieldRight>
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
                            </FormFieldRight>
                        </FormField>
                        <FormField>
                            <FormFieldButtons>
                                <Button
                                    width="100px"
                                    disabled={!isFormValid}
                                    onClick={onSubmit}
                                >
                                    Create
                                </Button>
                            </FormFieldButtons>
                        </FormField>
                        <Div clear="both" />
                    </form>
                </Show>
            </RightContent>
        </RightContainerPadding>
    )
}
