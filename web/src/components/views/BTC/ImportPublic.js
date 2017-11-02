import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver, collect } from 'dop'

import { setHref, createAsset } from '/store/actions'
import state from '/store/state'

import { isAddressCheck, isPublicKey, getAddressFromPublicKey } from '/api/Assets/BTC'
import { isAssetRegistered } from '/store/getters'
import { BTC, getAssetId } from '/api/Assets'

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

export default class ImportPublic extends Component {
    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.view)
        const collector = collect()
        state.view.validForm = false
        state.view.public_input = ''
        state.view.public_input_error = ''
        collector.destroy()
        this.onChangeInput = this.onChangeInput.bind(this)
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
        state.view.public_input = value

        if (isPublicKey(value)) {

            try {
                const address = getAddressFromPublicKey(value)
                state.view.address = address

                if (
                    isAssetRegistered(
                        getAssetId({ symbol: BTC.symbol, address: address })
                    )
                ) {
                    state.view.public_input_error = 'You already have this asset'
                    state.view.validForm = false
                } else {
                    state.view.public_input_error = ''
                    state.view.validForm = true
                }
                
            } catch (e) {
                state.view.address = ''
                state.view.validForm = false
                state.view.public_input_error = 'Invalid public key'
            }
        } else {
            state.view.address = ''
            state.view.public_input_error = 'Invalid public key'
            state.view.validForm = false
        }

        collector.emit()
    }

    onSubmit(e) {
        e.preventDefault()
        const collector = collect()
        const address = state.view.address
        const asset = createAsset(BTC.type, BTC.symbol, address)
        setHref(routes.asset(getAssetId(asset)))
        collector.emit()
    }

    render() {
        return React.createElement(ImportPublicTemplate, {
            public_input: state.view.public_input,
            public_input_error: state.view.public_input_error,
            validForm: state.view.validForm,
            onChangeInput: this.onChangeInput,
            onSubmit: this.onSubmit
        })
    }
}

function ImportPublicTemplate({
    public_input,
    public_input_error,
    validForm,
    onChangeInput,
    onSubmit
}) {
    return (
        <div>
            <FormField>
                <FormFieldLeft>
                    <Label>Public key</Label>
                    <SubLabel>Type or paste your public key.</SubLabel>
                </FormFieldLeft>
                <FormFieldRight>
                    <Input
                        width="100%"
                        value={public_input}
                        onChange={onChangeInput}
                        error={public_input_error}
                        invalid={public_input_error && public_input.length>0}
                    />
                </FormFieldRight>
            </FormField>

            <FormField>
                <FormFieldButtons>
                    <Button
                        width="100px"
                        disabled={!validForm}
                        onClick={onSubmit}
                    >
                        Import
                    </Button>
                </FormFieldButtons>
            </FormField>
        </div>
    )
}
