import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver, collect } from 'dop'

import { setHref, createAsset, setPrivateKey } from '/store/actions'
import state from '/store/state'
import {
    isAssetRegistered,
    getAssetId,
    getParamsFromLocation
} from '/store/getters'

import { Coins } from '/api/coins'

import styles from '/const/styles'
import { routes } from '/store/router'
import { minpassword } from '/const/'

import Input from '/components/styled/Input'
import Select from '/components/styled/Select'
import Password from '/components/styled/Password'
import Button from '/components/styled/Button'
import Help from '/components/styled/Help'
import { Label, SubLabel } from '/components/styled/Label'
import {
    FormField,
    FormFieldLeft,
    FormFieldRight,
    FormFieldButtons
} from '/components/styled/Form'

export default class ImportPrivate extends Component {
    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.view)

        const collector = collect()
        state.view.type_segwit = false
        state.view.is_valid_input = false
        state.view.private_input = ''
        state.view.private_input_error = ''
        state.view.private_password = ''
        state.view.private_repassword = ''
        collector.destroy()

        const { symbol } = getParamsFromLocation()
        this.Coin = Coins[symbol]

        this.onChangeType = this.onChangeType.bind(this)
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

    calculateAddress() {
        const collector = collect()
        const private_key = state.view.private_input
        if (private_key.length > 0 && this.Coin.isPrivateKey(private_key)) {
            try {
                const address = state.view.type_segwit
                    ? this.Coin.getSegwitAddressFromPrivateKey(private_key)
                    : this.Coin.getAddressFromPrivateKey(private_key)

                if (isAssetRegistered(this.Coin.symbol, address)) {
                    state.view.private_input_error =
                        'You already have this asset'
                    state.view.is_valid_input = false
                } else {
                    state.view.address = address
                    state.view.private_input_error = ''
                    state.view.is_valid_input = true
                }
            } catch (e) {
                state.view.is_valid_input = false
                state.view.private_input_error = 'Invalid private key'
                console.error(e)
            }
        } else {
            state.view.private_input_error = 'Invalid private key'
            state.view.is_valid_input = false
        }
        collector.emit()
    }

    onChangeType(e) {
        state.view.type_segwit = e.target.value === 'true'
        this.calculateAddress()
    }

    onChangeInput(e) {
        state.view.private_input = e.target.value.trim()
        this.calculateAddress()
    }

    onChangePassword(e) {
        state.view.private_password = e.target.value
    }
    onChangeRepassword(e) {
        state.view.private_repassword = e.target.value
    }

    onSubmit(e) {
        e.preventDefault()
        const collector = collect()
        const address = state.view.address
        const asset = createAsset(this.Coin.type, this.Coin.symbol, address)
        const asset_id = getAssetId(asset)
        setPrivateKey(
            asset_id,
            state.view.private_input,
            state.view.private_password
        )
        setHref(routes.asset({ asset_id }))
        collector.emit()
    }

    get isInvalidRepassword() {
        return (
            state.view.private_password.length > 0 &&
            state.view.private_repassword.length > 0 &&
            state.view.private_password.length ===
                state.view.private_repassword.length &&
            state.view.private_password !== state.view.private_repassword
        )
    }

    get isValidForm() {
        return (
            state.view.is_valid_input &&
            state.view.private_password.length >= minpassword &&
            state.view.private_password === state.view.private_repassword
        )
    }

    render() {
        return React.createElement(ImportPrivateTemplate, {
            type_segwit: state.view.type_segwit,
            private_input: state.view.private_input,
            private_input_error: state.view.private_input_error,
            private_password: state.view.private_password,
            private_repassword: state.view.private_repassword,
            isValidForm: this.isValidForm,
            isInvalidRepassword: this.isInvalidRepassword,
            onChangeType: this.onChangeType,
            onChangeInput: this.onChangeInput,
            onChangePassword: this.onChangePassword,
            onChangeRepassword: this.onChangeRepassword,
            onSubmit: this.onSubmit
        })
    }
}

function ImportPrivateTemplate({
    type_segwit,
    private_input,
    private_input_error,
    private_password,
    private_repassword,
    isValidForm,
    isInvalidRepassword,
    onChangeType,
    onChangeInput,
    onChangePassword,
    onChangeRepassword,
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
                    <Label>Private key</Label>
                    <SubLabel>Type or paste your private key.</SubLabel>
                </FormFieldLeft>
                <FormFieldRight>
                    <Input
                        width="100%"
                        value={private_input}
                        onChange={onChangeInput}
                        error={private_input_error}
                        invalid={
                            private_input_error && private_input.length > 0
                        }
                    />
                </FormFieldRight>
            </FormField>

            <FormField>
                <FormFieldLeft>
                    <Label>Password</Label>
                    <Help>
                        Make sure that you remember this. This password can't be
                        restored because we don't store it. For security reasons
                        you will be asked often for this password.
                    </Help>
                    <SubLabel>
                        This password encrypts your private key.
                    </SubLabel>
                </FormFieldLeft>
                <FormFieldRight>
                    <Password
                        minlength={minpassword}
                        value={private_password}
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
                        value={private_repassword}
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
