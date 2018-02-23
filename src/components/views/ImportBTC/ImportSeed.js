import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver, collect } from 'dop'
import { Show } from '/router/components'

import { setHref, createAsset, setSeed, addNotification } from '/store/actions'
import state from '/store/state'
import { isAssetRegistered, getAssetId } from '/store/getters'

import { Coins } from '/api/Coins'
import { validateSeed } from '/api/bip39'

import styles from '/const/styles'
import routes from '/router/routes'
import { minpassword, recovery_phrase_words } from '/const/'

import Input from '/components/styled/Input'
import Textarea from '/components/styled/Textarea'
import Password from '/components/styled/Password'
import Button from '/components/styled/Button'
import Help from '/components/styled/Help'
import Alert from '/components/styled/Alert'
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
        state.view.is_valid_seed = true
        state.view.seed_input = ''
        state.view.seed_input_error = ''
        state.view.seed_password = ''
        state.view.seed_repassword = ''
        collector.destroy()

        const symbol = state.location.path[state.location.path.length - 1]
        this.Coin = Coins.hasOwnProperty(symbol) ? Coins[symbol] : Coins.ETH
        this.already_blur = false

        this.onChangeInput = this.onChangeInput.bind(this)
        this.onBlurInput = this.onBlurInput.bind(this)
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

    onUpdateSeed() {
        const seed = state.view.seed_input
        if (seed.length > 0) {
            const collector = collect()
            const { address } = this.Coin.getWalletFromSeed({
                seed: seed
            })
            state.view.address = address
            state.view.is_valid_seed =
                validateSeed(seed) &&
                seed.trim().split(/\s+/g).length === recovery_phrase_words

            if (
                isAssetRegistered(
                    getAssetId({
                        symbol: this.Coin.symbol,
                        address: address
                    })
                )
            ) {
                state.view.seed_input_error = 'You already have this asset'
                state.view.is_valid_input = false
            } else {
                state.view.seed_input_error = ''
                state.view.is_valid_input = true
            }
            collector.emit()
        }
    }

    onChangeInput(e) {
        const collector = collect()
        state.view.seed_input = e.target.value.trim()
        if (this.already_blur) this.onUpdateSeed()
        collector.emit()
    }

    onBlurInput(e) {
        if (!this.already_blur && state.view.seed_input.length > 0) {
            this.already_blur = true
            this.onUpdateSeed()
        }
    }

    onChangePassword(e) {
        state.view.seed_password = e.target.value
    }
    onChangeRepassword(e) {
        state.view.seed_repassword = e.target.value
    }

    onSubmit(e) {
        e.preventDefault()
        const collector = collect()
        const address = state.view.address
        const symbol = this.Coin.symbol
        const asset = createAsset(this.Coin.type, symbol, address)
        const asset_id = getAssetId({ symbol, address })
        setSeed(asset_id, state.view.seed_input, state.view.seed_password)
        setHref(routes.asset({ asset_id: asset_id }))
        addNotification(`New "${symbol}" asset has been imported`)
        collector.emit()
    }

    get isInvalidRepassword() {
        return (
            state.view.seed_password.length > 0 &&
            state.view.seed_repassword.length > 0 &&
            state.view.seed_password.length ===
                state.view.seed_repassword.length &&
            state.view.seed_password !== state.view.seed_repassword
        )
    }

    get isValidForm() {
        return (
            state.view.is_valid_input &&
            state.view.seed_input.length > 0 &&
            state.view.seed_password.length >= minpassword &&
            state.view.seed_password === state.view.seed_repassword
        )
    }

    render() {
        return React.createElement(ImportPrivateTemplate, {
            seed_input: state.view.seed_input,
            seed_input_error: state.view.seed_input_error,
            seed_password: state.view.seed_password,
            seed_repassword: state.view.seed_repassword,
            is_valid_seed: state.view.is_valid_seed,
            isValidForm: this.isValidForm,
            isInvalidRepassword: this.isInvalidRepassword,
            onChangeInput: this.onChangeInput,
            onBlurInput: this.onBlurInput,
            onChangePassword: this.onChangePassword,
            onChangeRepassword: this.onChangeRepassword,
            onSubmit: this.onSubmit
        })
    }
}

function ImportPrivateTemplate({
    seed_input,
    seed_input_error,
    seed_password,
    seed_repassword,
    is_valid_seed,
    isValidForm,
    isInvalidRepassword,
    onChangeInput,
    onBlurInput,
    onChangePassword,
    onChangeRepassword,
    onSubmit
}) {
    return (
        <div>
            <FormField>
                <FormFieldLeft>
                    <Label>Recovery Phrase</Label>
                    <SubLabel>Type your 12 words in the exact order.</SubLabel>
                </FormFieldLeft>
                <FormFieldRight>
                    <Textarea
                        width="100%"
                        value={seed_input}
                        onChange={onChangeInput}
                        onBlur={onBlurInput}
                        error={seed_input_error}
                        invalid={seed_input_error && seed_input.length > 0}
                    />
                    <Show if={!is_valid_seed && seed_input.length > 0}>
                        {/* <Div padding-top="10px"> */}
                        <Alert>
                            You typed a non-standard or invalid Recovery Phrase.
                            But coinfy allow you to import any other format that
                            comes from other wallets. Including other languages.
                        </Alert>
                        {/* </Div> */}
                    </Show>
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
                    <SubLabel>This password encrypts your seed key.</SubLabel>
                </FormFieldLeft>
                <FormFieldRight>
                    <Password
                        minlength={minpassword}
                        value={seed_password}
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
                        value={seed_repassword}
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
