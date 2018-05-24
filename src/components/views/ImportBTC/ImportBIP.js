import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver, collect } from 'dop'

import { setHref, createAsset, setPrivateKey } from '/store/actions'
import state from '/store/state'
import { isAssetRegistered, getAssetId, getParamsFromLocation } from '/store/getters'

import { decryptBIP38 } from '/api/crypto'
import { Coins } from '/api/coins'

import styles from '/const/styles'
import { routes, Show } from '/store/router'

import Div from '/components/styled/Div'
import Input from '/components/styled/Input'
import Select from '/components/styled/Select'
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
        const { symbol } = getParamsFromLocation()
        this.Coin = Coins[symbol]

        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.view)
        const collector = collect()
        state.view.type_segwit = false
        state.view.is_valid_input = false
        state.view.bip_input = ''
        state.view.bip_input_error = ''
        state.view.bip_password = ''
        state.view.bip_password_error = ''
        state.view.bip_loading = false
        collector.destroy()

        this.onChangeType = this.onChangeType.bind(this)
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

    onChangeType(e) {
        state.view.type_segwit = e.target.value === 'true'
    }

    onChangeInput(e) {
        const collector = collect()
        const value = e.target.value.trim()
        state.view.bip_input = value

        if (this.Coin.isPrivateKeyBip(value)) {
            state.view.bip_input_error = ''
            state.view.is_valid_input = true
        } else {
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
                const private_key = this.Coin.decryptBIP38(
                    state.view.bip_input,
                    password
                )
                const address = state.view.type_segwit
                    ? this.Coin.getSegwitAddressFromPrivateKey(private_key)
                    : this.Coin.getAddressFromPrivateKey(private_key)

                // console.log( address );
                if (isAssetRegistered(this.Coin.symbol, address)) {
                    state.view.bip_input_error = 'You already have this asset'
                    state.view.is_valid_input = false
                } else {
                    const asset = createAsset(this.Coin.type, this.Coin.symbol, address)
                    const asset_id = getAssetId(asset)
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
            type_segwit: state.view.type_segwit,
            bip_input: state.view.bip_input,
            bip_input_error: state.view.bip_input_error,
            bip_password: state.view.bip_password,
            bip_password_error: state.view.bip_password_error,
            bip_loading: state.view.bip_loading,
            isValidForm: this.isValidForm,
            onChangeType: this.onChangeType,
            onChangeInput: this.onChangeInput,
            onChangePassword: this.onChangePassword,
            onSubmit: this.onSubmit
        })
    }
}

function ImportBIPTemplate({
    type_segwit,
    bip_input,
    bip_input_error,
    bip_password,
    bip_password_error,
    bip_loading,
    isValidForm,
    onChangeType,
    onChangeInput,
    onChangePassword,
    onSubmit
}) {
    return (
        <div>
            <FormField>
                <FormFieldLeft>
                    <Label>Type</Label>
                    <SubLabel>Regular or Segwit.</SubLabel>
                </FormFieldLeft>
                <FormFieldRight>
                    <Select width="100%" onChange={onChangeType}>
                        <option value="false" selected={!type_segwit}>
                            Regular (Legacy)
                        </option>
                        <option value="true" selected={type_segwit}>
                            Segwit
                        </option>
                    </Select>
                </FormFieldRight>
            </FormField>

            <FormField>
                <FormFieldLeft>
                    <Label>Private key BIP38</Label>
                    <SubLabel>
                        Type or paste your private key in BIP38 format.
                    </SubLabel>
                </FormFieldLeft>
                <FormFieldRight>
                    <Input
                        type="text"
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
