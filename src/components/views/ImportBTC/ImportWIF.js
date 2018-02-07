import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver, collect } from 'dop'

import { isPrivateKey, getAddressFromPrivateKey } from '/api/Coins/BTC'
import { BTC } from '/api/Coins'

import styles from '/const/styles'
import routes from '/const/routes'
import { minpassword } from '/const/'

import { setHref, createAsset, setPrivateKey } from '/store/actions'
import state from '/store/state'
import { isAssetRegistered, getCoinId } from '/store/getters'

import Input from '/components/styled/Input'
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

export default class ImportWIF extends Component {
    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.view)
        const collector = collect()
        state.view.is_valid_input = false
        state.view.wif_input = ''
        state.view.wif_input_error = ''
        state.view.wif_password = ''
        state.view.wif_repassword = ''
        collector.destroy()
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

    onChangeInput(e) {
        const collector = collect()
        const value = e.target.value.trim()
        state.view.wif_input = value

        if (isPrivateKey(value)) {
            try {
                const address = getAddressFromPrivateKey(value)
                state.view.address = address

                if (
                    isAssetRegistered(
                        getCoinId({ symbol: BTC.symbol, address: address })
                    )
                ) {
                    state.view.wif_input_error = 'You already have this asset'
                    state.view.is_valid_input = false
                } else {
                    state.view.wif_input_error = ''
                    state.view.is_valid_input = true
                }
            } catch (e) {
                state.view.address = ''
                state.view.is_valid_input = false
                state.view.wif_input_error = 'Invalid private key'
                console.error(e)
            }
        } else {
            state.view.address = ''
            state.view.wif_input_error = 'Invalid private key'
            state.view.is_valid_input = false
        }

        collector.emit()
    }

    onChangePassword(e) {
        state.view.wif_password = e.target.value
    }
    onChangeRepassword(e) {
        state.view.wif_repassword = e.target.value
    }

    onSubmit(e) {
        e.preventDefault()
        const collector = collect()
        const address = state.view.address
        const asset = createAsset(BTC.type, BTC.symbol, address)
        const asset_id = getCoinId({ symbol: BTC.symbol, address })
        setPrivateKey(asset_id, state.view.wif_input, state.view.wif_password)
        setHref(routes.asset(asset_id))
        collector.emit()
    }

    get isInvalidRepassword() {
        return (
            state.view.wif_password.length > 0 &&
            state.view.wif_repassword.length > 0 &&
            state.view.wif_password.length ===
                state.view.wif_repassword.length &&
            state.view.wif_password !== state.view.wif_repassword
        )
    }

    get isValidForm() {
        return (
            state.view.is_valid_input &&
            state.view.wif_password.length >= minpassword &&
            state.view.wif_password === state.view.wif_repassword
        )
    }

    render() {
        return React.createElement(ImportWIFTemplate, {
            wif_input: state.view.wif_input,
            wif_input_error: state.view.wif_input_error,
            wif_password: state.view.wif_password,
            wif_repassword: state.view.wif_repassword,
            isValidForm: this.isValidForm,
            isInvalidRepassword: this.isInvalidRepassword,
            onChangeInput: this.onChangeInput,
            onChangePassword: this.onChangePassword,
            onChangeRepassword: this.onChangeRepassword,
            onSubmit: this.onSubmit
        })
    }
}

function ImportWIFTemplate({
    wif_input,
    wif_input_error,
    wif_password,
    wif_repassword,
    isValidForm,
    isInvalidRepassword,
    onChangeInput,
    onChangePassword,
    onChangeRepassword,
    onSubmit
}) {
    return (
        <div>
            <FormField>
                <FormFieldLeft>
                    <Label>Private key WIF</Label>
                    <SubLabel>
                        Type or paste your private key in WIF format.
                    </SubLabel>
                </FormFieldLeft>
                <FormFieldRight>
                    <Input
                        width="100%"
                        value={wif_input}
                        onChange={onChangeInput}
                        error={wif_input_error}
                        invalid={wif_input_error && wif_input.length > 0}
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
                        value={wif_password}
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
                        value={wif_repassword}
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
