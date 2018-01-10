import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver, collect } from 'dop'

import { setHref, createAsset } from '/store/actions'
import state from '/store/state'

import { isAddress, addHexPrefix } from '/api/Coins/ETH'
import { isAssetRegistered } from '/store/getters'
import { Coins, ETH, getCoinId } from '/api/Coins'

import styles from '/const/styles'
import routes from '/const/routes'

import Select from '/components/styled/Select'
import Button from '/components/styled/Button'
import { Label, SubLabel } from '/components/styled/Label'
import {
    FormField,
    FormFieldLeft,
    FormFieldRight,
    FormFieldButtons
} from '/components/styled/Form'

export default class ImportEthereum extends Component {
    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.view)

        const collector = collect()
        state.view.ethereum_asset_id = ''
        state.view.is_valid_input = false
        collector.destroy()

        this.Coin = Coins[state.location.path[state.location.path.length - 1]]
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    onChange(e) {
        const collector = collect()
        const asset_id = e.target.value
        state.view.ethereum_asset_id = asset_id
        state.view.is_valid_input = false
        if (
            state.assets.hasOwnProperty(asset_id) &&
            !isAssetRegistered(
                getCoinId({
                    symbol: this.Coin.symbol,
                    address: state.assets[asset_id].address
                })
            )
        ) {
            state.view.is_valid_input = true
        }

        collector.emit()
    }

    onSubmit(e) {
        e.preventDefault()
        const collector = collect()
        const address = state.view.address
        const asset = createAsset(this.Coin.type, this.Coin.symbol, address)
        setHref(routes.asset(getCoinId(asset)))
        // setHref(routes.home())
        collector.emit()
    }

    render() {
        const ethereum_wallets = Object.keys(state.assets)
            .filter(asset_id => state.assets[asset_id].symbol === ETH.symbol)
            .map(asset_id => {
                const asset = state.assets[asset_id]
                return {
                    value: asset_id,
                    label:
                        asset.label === ''
                            ? asset.address
                            : `${asset.label} (${asset.address})`
                }
            })

        return React.createElement(ImportEthereumTemplate, {
            ethereum_wallets: ethereum_wallets,
            ethereum_asset_id: state.view.ethereum_asset_id,
            isValidForm: state.view.is_valid_input,
            onChange: this.onChange,
            onSubmit: this.onSubmit
        })
    }
}

function ImportEthereumTemplate({
    ethereum_wallets,
    ethereum_asset_id,
    isValidForm,
    onChange,
    onSubmit
}) {
    return (
        <div>
            <FormField>
                <FormFieldLeft>
                    <Label>Ethereum wallet</Label>
                    <SubLabel>Select one of your ethereum wallet.</SubLabel>
                </FormFieldLeft>
                <FormFieldRight>
                    <Select
                        width="100%"
                        onChange={onChange}
                        invalid={ethereum_asset_id !== '' && !isValidForm}
                        error="You already have this asset"
                    >
                        <option />
                        {ethereum_wallets.map(wallet => (
                            <option
                                value={wallet.value}
                                selected={ethereum_asset_id === wallet.value}
                            >
                                {wallet.label}
                            </option>
                        ))}
                    </Select>
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
