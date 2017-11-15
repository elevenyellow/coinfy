import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver, collect } from 'dop'

import { readFile } from '/api/browser'
import { decryptAES128CTR } from '/api/crypto'

import { setPrivateKey, setHref, createAsset } from '/store/actions'
import state from '/store/state'

import { isAddress, addHexPrefix, getAddressFromPrivateKey } from '/api/Assets/ETH'
import { isAssetRegistered } from '/store/getters'
import { ETH, getAssetId } from '/api/Assets'

import styles from '/const/styles'
import routes from '/const/routes'

import Input from '/components/styled/Input'
import Button from '/components/styled/Button'
import { Label, SubLabel } from '/components/styled/Label'
import {
    FormField,
    FormFieldLeft,
    FormFieldRight,
    FormFieldButtons
} from '/components/styled/Form'

export default class ImportAddress extends Component {
    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.view)
        const collector = collect()
        state.view.keystore_selected = false
        state.view.keystore_password = ''
        state.view.keystore_password_error = ''
        state.view.keystore_invalid_error = ''
        collector.destroy()
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
        readFile(file, dataString => {
            const collector = collect()
            state.view.keystore_password_error = ''
            state.view.keystore_selected = true
            try {
                const keystore = JSON.parse(dataString)
                const address = addHexPrefix(keystore.address)
                if (
                    keystore.version === 3 &&
                    isAddress(address) &&
                    typeof keystore.Crypto == 'object'
                ) {
                    if (isAssetRegistered(getAssetId({symbol:ETH.symbol, address:address}))) {
                        state.view.keystore_invalid_error = 'You already have this asset'
                    } else {
                        this.state.keystore = keystore
                        state.view.address = address
                        state.view.keystore_invalid_error = ''
                    }
                } else {
                    state.view.keystore_invalid_error = 'Invalid Keystore file'
                }
            } catch (e) {
                console.log( e )
                state.view.keystore_invalid_error = 'Invalid Keystore file'
            }
            collector.emit()
        })
    }

    onChangePassword(e) {
        state.view.keystore_password = e.target.value
        state.view.keystore_password_error = ''
    }

    onSubmit(e) {
        e.preventDefault()
        console.log( this.state.keystore );
        if (this.state.keystore) {
            const collector = collect()
            const address = state.view.address
            const password = state.view.keystore_password
            const private_key = ETH.decrypt(address, this.state.keystore.Crypto, password)

            if (private_key) {
                const asset = createAsset(ETH.type, ETH.symbol, address)
                setPrivateKey(
                    getAssetId({ symbol: ETH.symbol, address }),
                    private_key,
                    password
                )
                setHref(routes.asset(getAssetId(asset)))
            }
            else {
                state.view.keystore_password_error = 'Invalid password'
            }
            collector.emit()
        }
    }

    get isValidForm() {
        return (
            state.view.keystore_invalid_error==='' &&
            state.view.keystore_selected &&
            state.view.keystore_password.length > 0
        )
    }

    render() {
        return React.createElement(ImportAddressTemplate, {
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

function ImportAddressTemplate({
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
                    <Input
                        type="file"
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