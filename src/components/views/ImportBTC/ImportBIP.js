import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver, collect } from 'dop'
import { Show } from '/router/components'

import { setHref, createAsset, setPrivateKey } from '/store/actions'
import state from '/store/state'
import { isAssetRegistered, getAssetId } from '/store/getters'

import { isPrivateKeyBip, getAddressFromPrivateKey } from '/api/coins/BTC'
import { decryptBIP38 } from '/api/crypto'
import { BTC } from '/api/coins'

import styles from '/const/styles'
import routes from '/router/routes'

import Div from '/components/styled/Div'
import Input from '/components/styled/Input'
import Button from '/components/styled/Button'
import { Label, SubLabel } from '/components/styled/Label'
import {
    FormField,
    FormFieldLeft,
    FormFieldRight,
    FormFieldButtons
} from '/components/styled/Form'

export default class ImportBIP extends Component {
    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.view)
        const collector = collect()
        state.view.is_valid_input = false
        state.view.bip_input = ''
        state.view.bip_input_error = ''
        state.view.bip_password = ''
        state.view.bip_password_error = ''
        state.view.bip_loading = false
        collector.destroy()
        this.onChangeInput = this.onChangeInput.bind(this)
        this.onChangePassword = this.onChangePassword.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    onChangeInput(e) {
        const collector = collect()
        const value = e.target.value.trim()
        state.view.bip_input = value

        if (isPrivateKeyBip(value)) {
            state.view.bip_input_error = ''
            state.view.is_valid_input = true
        } else {
            state.view.address = ''
            state.view.bip_input_error = 'Invalid private key'
            state.view.is_valid_input = false
        }

        collector.emit()
    }

    onChangePassword(e) {
        state.view.bip_password = e.target.value
        state.view.bip_password_error = ''
    }

    onSubmit(e) {
        e.preventDefault()
        state.view.bip_loading = true
        setTimeout(e => {
            // Need this shitty hack to show loading effect
            const collector = collect()
            try {
                const password = state.view.bip_password
                const private_key = BTC.decryptBIP38(
                    state.view.bip_input,
                    password
                )
                const address = getAddressFromPrivateKey(private_key)
                const asset_id = getAssetId({
                    symbol: BTC.symbol,
                    address: address
                })
                state.view.address = address
                // console.log( address );
                if (isAssetRegistered(asset_id)) {
                    state.view.bip_input_error = 'You already have this asset'
                    state.view.is_valid_input = false
                } else {
                    const asset = createAsset(BTC.type, BTC.symbol, address)
                    setPrivateKey(asset_id, private_key, password)
                    setHref(routes.asset({ asset_id: getAssetId(asset) }))
                }
            } catch (e) {
                if (e.toString().indexOf('checksum') > -1) {
                    state.view.bip_input_error = 'Invalid private key'
                } else {
                    state.view.bip_password_error = 'Invalid password'
                }
                console.error(e)
            }
            state.view.bip_loading = false
            collector.emit()
        }, 100)
    }

    get isValidForm() {
        return state.view.is_valid_input && state.view.bip_password.length > 0
    }

    render() {
        return React.createElement(ImportBIPTemplate, {
            bip_input: state.view.bip_input,
            bip_input_error: state.view.bip_input_error,
            bip_password: state.view.bip_password,
            bip_password_error: state.view.bip_password_error,
            bip_loading: state.view.bip_loading,
            isValidForm: this.isValidForm,
            onChangeInput: this.onChangeInput,
            onChangePassword: this.onChangePassword,
            onSubmit: this.onSubmit
        })
    }
}

function ImportBIPTemplate({
    bip_input,
    bip_input_error,
    bip_password,
    bip_password_error,
    bip_loading,
    isValidForm,
    onChangeInput,
    onChangePassword,
    onSubmit
}) {
    return (
        <div>
            <FormField>
                <FormFieldLeft>
                    <Label>Private key BIP38</Label>
                    <SubLabel>
                        Type or paste your private key in BIP38 format.
                    </SubLabel>
                </FormFieldLeft>
                <FormFieldRight>
                    <Input
                        width="100%"
                        value={bip_input}
                        onChange={onChangeInput}
                        error={bip_input_error}
                        invalid={bip_input_error && bip_input.length > 0}
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
                        error={bip_password_error}
                        invalid={bip_password_error}
                        value={bip_password}
                        onChange={onChangePassword}
                        width="100%"
                        type="password"
                    />
                </FormFieldRight>
            </FormField>

            <FormField>
                <FormFieldButtons>
                    <Button
                        width="100px"
                        disabled={!isValidForm}
                        loading={bip_loading}
                        loadingIco="/static/image/loading.gif"
                        onClick={onSubmit}
                    >
                        Import
                    </Button>
                    <Show if={bip_loading}>
                        <Div font-size="10px" color={styles.color.red}>
                            Decrypting...
                        </Div>
                    </Show>
                </FormFieldButtons>
            </FormField>
        </div>
    )
}
