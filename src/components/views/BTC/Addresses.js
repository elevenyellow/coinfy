import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver, collect } from 'dop'

import { Coins } from '/api/coins'
import { bigNumber } from '/api/numbers'

import { routes } from '/store/router'
import styles from '/const/styles'

import state from '/store/state'
import {
    getParamsFromLocation,
    getAsset,
    getAssetId,
    getSeed
} from '/store/getters'
import { changeAddress } from '/store/actions'

import Div from '/components/styled/Div'
import ButtonBig from '/components/styled/ButtonBig'
import RadioButton from '/components/styled/RadioButton'
import Input from '/components/styled/Input'
// import CenterElement from '/components/styled/CenterElement'

export default class Addresses extends Component {
    componentWillMount() {
        const { asset_id } = getParamsFromLocation()
        this.asset_id = asset_id
        this.asset = getAsset(asset_id)
        this.Coin = Coins[this.asset.symbol]

        // Initial state
        const addresses = this.asset.addresses
        state.view = {
            password: '',
            invalid_password: false,
            addresses: addresses.map(addr => ({
                address: addr,
                balance: 0,
                loading: true
            }))
        }

        this.observer = createObserver(m => this.forceUpdate())
        addresses.forEach((e, index) => {
            this.observer.observe(state.view.addresses[index])
        })
        this.observer.observe(state.view)
        this.observer.observe(state.view.addresses)
        this.observer.observe(this.asset, 'address')
        this.fetchBalances()

        // binding
        this.onChangeAddress = this.onChangeAddress.bind(this)
        this.onChangePassword = this.onChangePassword.bind(this)
        this.onAddAddress = this.onAddAddress.bind(this)
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    fetchBalances(index = 0) {
        const addresses = state.view.addresses
        const address = addresses[index]
        address.loading = true
        this.Coin.fetchBalance(address.address).then(balance => {
            // setTimeout(e => {
            const collector = collect()
            address.loading = false
            address.balance = balance
            collector.emit()
            if (index + 1 < addresses.length) {
                this.fetchBalances(index + 1)
            }
            // }, 2000)
        })
    }

    onChangeAddress(address) {
        if (this.asset.address !== address) {
            changeAddress(getAssetId(this.asset), address)
        }
    }

    onChangePassword(e) {
        const collector = collect()
        state.view.password = e.target.value
        state.view.invalid_password = false
        collector.emit()
    }

    onAddAddress() {
        const seed = getSeed(this.asset_id, state.view.password)
        if (seed) {
            console.log('new addr')
        } else {
            state.view.invalid_password = true
        }
    }

    render() {
        const addresses = state.view.addresses
        const total = addresses.reduce(
            (t, addr) => t.add(addr.balance),
            bigNumber(0)
        )
        return React.createElement(AddressesTemplate, {
            address_current: this.asset.address,
            addresses: addresses,
            symbol: this.asset.symbol,
            total: total,
            password: state.view.password,
            invalid_password: state.view.invalid_password,
            onChangeAddress: this.onChangeAddress,
            onChangePassword: this.onChangePassword,
            onAddAddress: this.onAddAddress
        })
    }
}

function AddressesTemplate({
    address_current,
    addresses,
    symbol,
    total,
    password,
    invalid_password,
    onChangeAddress,
    onChangePassword,
    onAddAddress
}) {
    const loading_ico = (
        <img src="/static/image/loading.gif" width="22" height="22" />
    )
    return (
        <Div>
            <Transactions>
                {addresses.map(addr => {
                    return (
                        <Transaction
                            selected={address_current === addr.address}
                        >
                            <TransactionInner>
                                <TransactionItemRadio>
                                    <RadioButton
                                        onClick={e =>
                                            onChangeAddress(addr.address)
                                        }
                                        checked={
                                            address_current === addr.address
                                        }
                                    />
                                </TransactionItemRadio>
                                <TransactionItemLeft>
                                    {addr.address}
                                </TransactionItemLeft>
                                <TransactionItemRight>
                                    {addr.loading
                                        ? loading_ico
                                        : `${addr.balance} ${symbol}`}
                                </TransactionItemRight>
                            </TransactionInner>
                        </Transaction>
                    )
                })}
            </Transactions>
            <Total>
                {total} {symbol}
            </Total>
            <Div padding-top="30px">
                <Input
                    type="password"
                    placeholder="Password of this asset"
                    value={password}
                    invalid={invalid_password}
                    error="Invalid password"
                    width="100%"
                    text-align="center"
                    onChange={onChangePassword}
                />
            </Div>
            <Div padding-top="10px">
                <ButtonBig
                    onClick={onAddAddress}
                    loading={false}
                    loadingIco="/static/image/loading.gif"
                    disabled={
                        password.length === 0 ||
                        invalid_password ||
                        addresses.some(addr => addr.loading)
                    }
                >
                    Add Another Address
                </ButtonBig>
            </Div>
        </Div>
    )
}

export const Transactions = styled.div`
    clear: both;
`

export const Transaction = styled.div`
    clear: both;
    color: ${props => (props.selected ? 'black' : styles.color.front3)};
    border-radius: 5px;
    margin-bottom: 10px;
    background-color: ${props =>
        props.selected ? styles.color.background1 : 'transparent'};
`

export const TransactionInner = styled.div`
    min-height: 46px;
    padding: 0 12px 0 12px;
`

export const TransactionItemRadio = styled.div`
    float: left;
    margin-right: 10px;
    padding-left: 5px;
    padding-top: 13px;
`
export const TransactionItemLeft = styled.div`
    float: left;
    font-weight: bold;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 85%;
    padding-top: 12px;
    cursor: text;
    user-select: text;
    ${styles.media.fourth} {
        float: none;
        padding-top: 4px;
        font-size: 14px;
    }
`
export const TransactionItemRight = styled.div`
    float: right;
    font-weight: bold;
    padding-top: 12px;

    ${styles.media.fourth} {
        float: none;
        padding-top: 0;
        font-size: 12px;
        margin-left: 35px;
    }
`

export const Total = styled.div`
    border-top: 2px solid #f3f6f8;
    color: #007196;
    font-weight: 900;
    text-align: right;
    padding: 12px;
    font-size: 16px;
`
