import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver, collect } from 'dop'

import { setHref, createAsset } from '/store/actions'
import state from '/store/state'
import { isAssetRegistered, getAssetId } from '/store/getters'

import { Coins } from '/api/coins'

import styles from '/const/styles'
import routes from '/router/routes'

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
        state.view.is_valid_input = false
        state.view.address_input = ''
        state.view.address_input_error = ''
        collector.destroy()

        const symbol = state.location.path[state.location.path.length - 1]
        this.Coin = Coins[symbol]

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
        let value = e.target.value.trim()
        state.view.address_input = value
        // value = value.toLowerCase()

        if (this.Coin.isAddressCheck(value)) {
            state.view.address = this.Coin.formatAddress(value)

            if (
                isAssetRegistered(
                    getAssetId({ symbol: this.Coin.symbol, address: value })
                )
            ) {
                state.view.address_input_error = 'You already have this asset'
                state.view.is_valid_input = false
            } else {
                state.view.address_input_error = ''
                state.view.is_valid_input = true
            }
        } else {
            state.view.address = ''
            state.view.address_input_error = 'Invalid address'
            state.view.is_valid_input = false
        }

        collector.emit()
    }

    onSubmit(e) {
        e.preventDefault()
        const collector = collect()
        const address = state.view.address
        const asset = createAsset(this.Coin.type, this.Coin.symbol, address)
        setHref(routes.asset({ asset_id: getAssetId(asset) }))
        // setHref(routes.home())
        collector.emit()
    }

    render() {
        return React.createElement(ImportAddressTemplate, {
            address_input: state.view.address_input,
            address_input_error: state.view.address_input_error,
            isValidForm: state.view.is_valid_input,
            onChangeInput: this.onChangeInput,
            onSubmit: this.onSubmit
        })
    }
}

function ImportAddressTemplate({
    address_input,
    address_input_error,
    isValidForm,
    onChangeInput,
    onSubmit
}) {
    return (
        <div>
            <FormField>
                <FormFieldLeft>
                    <Label>Address</Label>
                    <SubLabel>Type or paste your address.</SubLabel>
                </FormFieldLeft>
                <FormFieldRight>
                    <Input
                        width="100%"
                        value={address_input}
                        onChange={onChangeInput}
                        error={address_input_error}
                        invalid={
                            address_input_error && address_input.length > 0
                        }
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
