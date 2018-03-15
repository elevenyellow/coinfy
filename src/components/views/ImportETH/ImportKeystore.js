import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver, collect } from 'dop'

import { readFile } from '/api/browser'
import { decryptAES128CTR } from '/api/crypto'
import { keysToLowerCase } from '/api/objects'

import { setPrivateKey, setHref, createAsset } from '/store/actions'
import state from '/store/state'
import { isAssetRegistered, getAssetId } from '/store/getters'

import {
    isAddress,
    formatAddress,
    getAddressFromPrivateKey
} from '/api/coins/ETH'
import { Coins } from '/api/coins'

import styles from '/const/styles'
import routes from '/router/routes'

import Input from '/components/styled/Input'
import InputFile from '/components/styled/InputFile'
import Button from '/components/styled/Button'
import { Label, SubLabel } from '/components/styled/Label'
import {
    FormField,
    FormFieldLeft,
    FormFieldRight,
    FormFieldButtons
} from '/components/styled/Form'
import { log } from 'util'

export default class ImportKeystore extends Component {
    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.view)

        const collector = collect()
        state.view.keystore_selected = false
        state.view.keystore_password = ''
        state.view.keystore_password_error = ''
        state.view.keystore_invalid_error = ''
        collector.destroy()

        const symbol = state.location.path[state.location.path.length - 1]
        this.Coin = Coins.hasOwnProperty(symbol) ? Coins[symbol] : Coins.ETH

        this.onChangeFile = this.onChangeFile.bind(this)
        this.onChangePassword = this.onChangePassword.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    onChangeFile(e) {
        // e.preventDefault()
        const file = e.target.files[0]
        if (file) {
            // console.log( file.name );
            readFile(file, dataString => {
                const collector = collect()
                state.view.keystore_password_error = ''
                state.view.keystore_selected = true
                try {
                    const keystore = keysToLowerCase(dataString)
                    const address = formatAddress(keystore.address)
                    if (
                        keystore.version === 3 &&
                        isAddress(address) &&
                        typeof keystore.crypto == 'object'
                    ) {
                        if (
                            isAssetRegistered(
                                getAssetId({
                                    symbol: this.Coin.symbol,
                                    address: address
                                })
                            )
                        ) {
                            state.view.keystore_invalid_error =
                                'You already have this asset'
                        } else {
                            this.keystore = keystore
                            state.view.address = address
                            state.view.keystore_invalid_error = ''
                        }
                    } else {
                        state.view.keystore_invalid_error =
                            'Invalid Keystore file'
                    }
                } catch (e) {
                    console.error(e)
                    state.view.keystore_invalid_error = 'Invalid Keystore file'
                }
                collector.emit()
            })
        }
    }

    onChangePassword(e) {
        state.view.keystore_password = e.target.value
        state.view.keystore_password_error = ''
    }

    onSubmit(e) {
        e.preventDefault()
        // console.log( this.keystore );
        if (this.keystore) {
            const collector = collect()
            const address = state.view.address
            const password = state.view.keystore_password
            const private_key_encrypted =
                this.keystore.Crypto || this.keystore.crypto

            try {
                const private_key = this.Coin.decryptPrivateKey(
                    address,
                    private_key_encrypted,
                    password
                )
                if (private_key) {
                    const asset = createAsset(
                        this.Coin.type,
                        this.Coin.symbol,
                        address
                    )
                    setPrivateKey(
                        getAssetId({ symbol: this.Coin.symbol, address }),
                        private_key,
                        password
                    )
                    setHref(routes.asset({ asset_id: getAssetId(asset) }))
                } else {
                    state.view.keystore_password_error = 'Invalid password'
                }
                collector.emit()
            } catch (e) {
                state.view.keystore_invalid_error = 'Invalid Keystore file'
                collector.emit()
                console.error(e)
                return false
            }
        }
    }

    get isValidForm() {
        return (
            state.view.keystore_invalid_error === '' &&
            state.view.keystore_password_error === '' &&
            state.view.keystore_selected &&
            state.view.keystore_password.length > 0
        )
    }

    render() {
        return React.createElement(ImportKeystoreTemplate, {
            keystore_invalid_error: state.view.keystore_invalid_error,
            keystore_password: state.view.keystore_password,
            keystore_password_error: state.view.keystore_password_error,
            isValidForm: this.isValidForm,
            onChangeFile: this.onChangeFile,
            onChangePassword: this.onChangePassword,
            onSubmit: this.onSubmit
        })
    }
}

function ImportKeystoreTemplate({
    keystore_invalid_error,
    keystore_password,
    keystore_password_error,
    isValidForm,
    onChangeFile,
    onChangePassword,
    onSubmit
}) {
    return (
        <div>
            <FormField>
                <FormFieldLeft>
                    <Label>Select file</Label>
                    <SubLabel>Pick your Keystore file.</SubLabel>
                </FormFieldLeft>
                <FormFieldRight>
                    {/* <button onClick={onChangeFile}>Open</button>
                    <MessageKeystoreFile invalid={keystore_invalid_error}>{keystore_message}</MessageKeystoreFile> */}
                    <InputFile
                        width="100%"
                        onChange={onChangeFile}
                        error={keystore_invalid_error}
                        invalid={keystore_invalid_error}
                    />
                </FormFieldRight>
            </FormField>

            <FormField>
                <FormFieldLeft>
                    <Label>Password</Label>
                    <SubLabel>
                        The password you used to encrypt this private key.
                    </SubLabel>
                </FormFieldLeft>
                <FormFieldRight>
                    <Input
                        error={keystore_password_error}
                        invalid={keystore_password_error}
                        value={keystore_password}
                        onChange={onChangePassword}
                        width="100%"
                        type="password"
                    />
                </FormFieldRight>
            </FormField>

            <FormField>
                <FormFieldButtons>
                    <Button
                        width="100%"
                        disabled={!isValidForm}
                        onClick={onSubmit}
                    >
                        Import
                    </Button>
                </FormFieldButtons>
            </FormField>
        </div>
    )
}

const MessageKeystoreFile = styled.div`
    font-size: 11px;
    font-weight: bold;
    color: ${props =>
        props.invalid ? styles.color.red3 : styles.color.front6};
`
