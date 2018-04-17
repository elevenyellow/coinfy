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
        state.view.is_valid_input = false
        state.view.private_input = ''
        state.view.private_input_error = ''
        state.view.private_password = ''
        state.view.private_repassword = ''
        collector.destroy()

        const { symbol } = getParamsFromLocation()
        this.Coin = Coins[symbol]

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
        state.view.private_input = value
        if (this.Coin.isPrivateKey(value)) {
            try {
                const address = this.Coin.getAddressFromPrivateKey(value)

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
            private_input: state.view.private_input,
            private_input_error: state.view.private_input_error,
            private_password: state.view.private_password,
            private_repassword: state.view.private_repassword,
            isValidForm: this.isValidForm,
            isInvalidRepassword: this.isInvalidRepassword,
            onChangeInput: this.onChangeInput,
            onChangePassword: this.onChangePassword,
            onChangeRepassword: this.onChangeRepassword,
            onSubmit: this.onSubmit
        })
    }
}

function ImportPrivateTemplate({
    private_input,
    private_input_error,
    private_password,
    private_repassword,
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
