import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver, collect } from 'dop'
import { Show } from '/doprouter/react'

import { generateQRCode } from '/api/qr'
import {
    isAddress,
    isPublicKey,
    isPrivateKey,
    isPrivateKeyBip,
    getAddressFromPublicKey,
    getAddressFromPrivateKey
} from '/api/Assets/BTC'
import { encryptAES128CTR } from '/api/security'

import { BTC, getAssetId } from '/api/Assets'
import routes from '/const/routes'
import state from '/store/state'
import { isAssetRegistered } from '/store/getters'

import styles from '/const/styles'

import Div from '/components/styled/Div'
import Button from '/components/styled/Button'
import QRCode from '/components/styled/QRCode'
import Address from '/components/styled/Address'
import Help from '/components/styled/Help'
import Input from '/components/styled/Input'
import Select from '/components/styled/Select'
import Password from '/components/styled/Password'
import { Label, SubLabel } from '/components/styled/Label'
import CenterElement from '/components/styled/CenterElement'
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

import {
    setHref,
    createAsset,
    setPrivateKey,
    setPublicKey
} from '/store/actions'

const minpassword = 8
const types_import = {
    address: 0,
    public_key: 1,
    private_key: 2,
    private_key_bip: 3,
}

export default class ImportBitcoin extends Component {
    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.view)

        // Initial state
        state.view = {
            type_import: types_import.address,
            input: '',
            address: '',
            private_key: '',
            password: '',
            repassword: ''
        }

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
        state.view.type_import = Number(e.target.value)
        state.view.address = ''
        state.view.input = ''
        state.view.password = ''
        state.view.repassword = ''
        collector.emit()
    }
    onChangeInput(e) {
        const collector = collect()
        const value = e.target.value.trim()
        state.view.input = value

        if (
            state.view.type_import === types_import.address &&
            isAddress(value)
        ) {
            state.view.address = value
            state.view.private_key = ''
        } else if (
            state.view.type_import === types_import.public_key &&
            isPublicKey(value)
        ) {
            try {
                const address = getAddressFromPublicKey(value)
                state.view.address = address
                state.view.private_key = ''
            } catch (e) {
                console.error(e)
            }
        } else if (
            state.view.type_import === types_import.private_key &&
            isPrivateKey(value)
        ) {
            try {
                const address = getAddressFromPrivateKey(value)
                state.view.address = address
                state.view.private_key = value
            } catch (e) {
                //console.log( e );
            }
        } else if (
            state.view.type_import === types_import.private_key_bip &&
            isPrivateKeyBip(value)
        ) {
            console.log( 'yes!' );
            
        }
        else {
            state.view.address = ''
            state.view.private_key = ''
        }
        collector.emit()
    }
    onChangePassword(e) {
        state.view.password = e.target.value
    }
    onChangeRepassword(e) {
        state.view.repassword = e.target.value
    }
    onSubmit(e) {
        e.preventDefault()
        // if (this.isFormValid) {
        const collector = collect()
        const address = state.view.address
        const asset = createAsset(BTC.type, BTC.symbol, address)
        // if (state.view.type_import === types_import.public_key)
        // setPublicKey(getAssetId({symbol:BTC.symbol, address}), state.view.private_key)
        if (state.view.type_import === types_import.private_key)
            setPrivateKey(
                getAssetId({ symbol: BTC.symbol, address }),
                state.view.private_key,
                state.view.password
            )

        setHref(routes.asset(getAssetId(asset)))
        collector.emit()
        // }
    }

    // Getters
    get isFormValid() {
        let isRegistered = isAssetRegistered(
            getAssetId({ symbol: BTC.symbol, address: state.view.address })
        )
        return (
            state.view.address.length > 0 &&
            !isRegistered &&
            (state.view.private_key === '' ||
                (state.view.password.length >= minpassword &&
                    state.view.password === state.view.repassword))
        )
    }
    get isValidInput() {
        return state.view.input.length > 0 && state.view.address.length > 0
    }
    get isErrorInput() {
        return state.view.input.length > 0 && state.view.address.length === 0
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
        // console.log( this.isValidInput, state.view.address );
        return React.createElement(ImportBitcoinTemplate, {
            qrcodebase64: this.isValidInput
                ? generateQRCode(state.view.address)
                : '',
            isValidInput: this.isValidInput,
            isInvalidRepassword: this.isInvalidRepassword,
            isErrorInput: this.isErrorInput,
            isRegistered: isAssetRegistered(
                getAssetId({ symbol: BTC.symbol, address: state.view.address })
            ),
            isFormValid: this.isFormValid,
            type_import: state.view.type_import,
            address: state.view.address,
            input: state.view.input,
            password: state.view.password,
            repassword: state.view.repassword,
            onChangeTypeImport: this.onChangeTypeImport,
            onChangeInput: this.onChangeInput,
            onChangePassword: this.onChangePassword,
            onChangeRepassword: this.onChangeRepassword,
            onSubmit: this.onSubmit,
            minpassword: minpassword
        })
    }
}

function ImportBitcoinTemplate({
    qrcodebase64,
    isValidInput,
    isInvalidRepassword,
    isErrorInput,
    isRegistered,
    isFormValid,
    type_import,
    address,
    input,
    password,
    repassword,
    onChangeTypeImport,
    onChangeInput,
    onChangePassword,
    onChangeRepassword,
    onSubmit
}) {
    console.log( isErrorInput, isRegistered );
    return (
        <RightContainerPadding>
            <RightHeader>
                <Div float="left">
                    <H1>Add asset</H1>
                    <H2>Import Bitcoin Wallet</H2>
                </Div>
                <Div clear="both" />
            </RightHeader>
            <RightContent>
                <FormField>
                    <Div>
                        <QRCode>
                            <Show if={isValidInput}>
                                <img width="150" src={qrcodebase64} />
                            </Show>
                        </QRCode>
                    </Div>
                    <Div>
                        <CenterElement>
                            <Address>{address}</Address>
                        </CenterElement>
                    </Div>
                </FormField>

                <form>
                    <FormField>
                        <FormFieldLeft>
                            <Label>I have my</Label>
                            <SubLabel>
                                Select the option you prefer to import.
                            </SubLabel>
                        </FormFieldLeft>
                        <FormFieldRight>
                            <Select width="100%" onChange={onChangeTypeImport}>
                                <option
                                    value={types_import.address}
                                    selected={
                                        type_import === types_import.address
                                    }
                                >
                                    Address
                                </option>
                                <option
                                    value={types_import.public_key}
                                    selected={
                                        type_import === types_import.public_key
                                    }
                                >
                                    Public key
                                </option>
                                <option
                                    value={types_import.private_key}
                                    selected={
                                        type_import === types_import.private_key
                                    }
                                >
                                    Private key unencrypted (WIF)
                                </option>
                                <option
                                    value={types_import.private_key_bip}
                                    selected={
                                        type_import === types_import.private_key_bip
                                    }
                                >
                                    Private key encrypted (BIP38)
                                </option>
                            </Select>
                        </FormFieldRight>
                    </FormField>

                    <Show if={type_import === types_import.address}>
                        <FormField>
                            <FormFieldLeft>
                                <Label>Address</Label>
                                <SubLabel>Type or paste your address.</SubLabel>
                            </FormFieldLeft>
                            <FormFieldRight>
                                <Input
                                    width="100%"
                                    value={input}
                                    onChange={onChangeInput}
                                    error={
                                        isErrorInput
                                            ? 'Invalid address'
                                            : 'You already have this asset'
                                    }
                                    invalid={isErrorInput || isRegistered}
                                />
                            </FormFieldRight>
                        </FormField>
                    </Show>

                    <Show if={type_import === types_import.public_key}>
                        <FormField>
                            <FormFieldLeft>
                                <Label>Public key</Label>
                                <Help>
                                    Your address can be calculated through
                                    public key.
                                </Help>
                                <SubLabel>
                                    Type or paste your public key.
                                </SubLabel>
                            </FormFieldLeft>
                            <FormFieldRight>
                                <Input
                                    width="100%"
                                    value={input}
                                    onChange={onChangeInput}
                                    error={
                                        isErrorInput
                                            ? 'Invalid public key'
                                            : 'You already have this asset'
                                    }
                                    invalid={isErrorInput || isRegistered}
                                />
                            </FormFieldRight>
                        </FormField>
                    </Show>

                    <Show if={type_import === types_import.private_key}>
                        <div>
                            <FormField>
                                <FormFieldLeft>
                                    <Label>Private key</Label>
                                    <Help>
                                        We will never store your private key.
                                    </Help>
                                    <SubLabel>
                                        Type or paste your Private key in WIF
                                        format.
                                    </SubLabel>
                                </FormFieldLeft>
                                <FormFieldRight>
                                    <Input
                                        width="100%"
                                        value={input}
                                        onChange={onChangeInput}
                                        error={
                                            isErrorInput
                                                ? 'Invalid private key'
                                                : 'You already have this asset'
                                        }
                                        invalid={isErrorInput || isRegistered}
                                    />
                                </FormFieldRight>
                            </FormField>
                            <FormField>
                                <FormFieldLeft>
                                    <Label>Password</Label>
                                    <Help>
                                        Make sure that you remember this. This
                                        password can't be restored because we
                                        don't store it. For security reasons you
                                        will be asked often for this password.
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
                                        error={'Passwords do not match'}
                                        invalid={isInvalidRepassword}
                                        value={repassword}
                                        onChange={onChangeRepassword}
                                        width="100%"
                                        type="password"
                                    />
                                </FormFieldRight>
                            </FormField>
                        </div>
                    </Show>


                    <Show if={type_import === types_import.private_key_bip}>
                        <div>
                            <FormField>
                                <FormFieldLeft>
                                    <Label>Private key</Label>
                                    <Help>
                                        We will never store your private key.
                                    </Help>
                                    <SubLabel>
                                        Type or paste your Private key in BIP38
                                        format.
                                    </SubLabel>
                                </FormFieldLeft>
                                <FormFieldRight>
                                    <Input
                                        width="100%"
                                        value={input}
                                        onChange={onChangeInput}
                                        error="You already have this asset"
                                        invalid={isRegistered}
                                    />
                                </FormFieldRight>
                            </FormField>
                            
                            <FormField>
                                <FormFieldLeft>
                                    <Label>Password</Label>
                                    <SubLabel>
                                        The password that you used to encrypt the private key.
                                    </SubLabel>
                                </FormFieldLeft>
                                <FormFieldRight>
                                    <Input
                                        error={'Invalid password'}
                                        invalid={false}
                                        value={password}
                                        onChange={onChangePassword}
                                        width="100%"
                                        type="password"
                                    />
                                </FormFieldRight>
                            </FormField>
                        </div>
                    </Show>



                    <FormField>
                        <FormFieldButtons>
                            <Button
                                width="100px"
                                disabled={!isFormValid}
                                onClick={onSubmit}
                            >
                                Import
                            </Button>
                        </FormFieldButtons>
                    </FormField>

                    <Div clear="both" />
                </form>
            </RightContent>
        </RightContainerPadding>
    )
}
