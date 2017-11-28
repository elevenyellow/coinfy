import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver, collect } from 'dop'
import Big from 'big.js'
import { Show } from '/doprouter/react'

import { Coins } from '/api/Coins'
import { parseNumber, decimalsMax } from '/api/numbers'

import state from '/store/state'
import { fetchBalance } from '/store/actions'
import { getAsset, formatCurrency, convertBalance } from '/store/getters'

import styles from '/const/styles'
import { OK, ERROR, ALERT, NORMAL } from '/const/info'

import Div from '/components/styled/Div'
import Span from '/components/styled/Span'
import Input from '/components/styled/Input'
import InputDouble from '/components/styled/InputDouble'
import Button from '/components/styled/Button'
import ButtonBig from '/components/styled/ButtonBig'
import CenterElement from '/components/styled/CenterElement'
import Alert from '/components/styled/Alert'
import SwitchView from '/components/styled/SwitchView'

export default class Send extends Component {
    componentWillMount() {
        this.asset_id = state.location.path[1]
        this.asset = getAsset(this.asset_id)
        this.Coin = Coins[this.asset.symbol] // Storing Asset api (Asset.BTC, Asset.ETH, ...)

        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.view)

        // Initial state
        this.amount = 0
        this.fee = 0
        this.fee_recomended = 0
        state.view = {
            address_input: '',
            address_input_error: false,
            amount1_input: 0, // BTC
            amount2_input: 0, // FIAT
            fee_input: 0,
            fee_input_visible: false,
            password_input: '',
            password_input_invalid: false,
            error_when_create: false
        }

        // binding
        this.onChangeAddress = this.onChangeAddress.bind(this)
        this.onChangeAmount1 = this.onChangeAmount1.bind(this)
        this.onChangeAmount2 = this.onChangeAmount2.bind(this)
        this.onChangeMax = this.onChangeMax.bind(this)
        this.onClickFee = this.onClickFee.bind(this)
        this.onChangePassword = this.onChangePassword.bind(this)
        this.onNext = this.onNext.bind(this)

        this.fetchBalance()
        this.fetchRecomendedFee()
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    fetchBalance() {
        fetchBalance(this.asset_id)
    }

    fetchRecomendedFee() {
        this.Coin.fetchRecomendedFee(this.asset.address).then(fee => {
            state.view.fee_input = this.fee_recomended = Big(fee)
        })
    }

    onChangeAddress(e) {
        const collector = collect()
        const value = e.target.value.trim()
        state.view.address_input = value
        if (this.Coin.isAddressCheck(value)) {
            state.view.address_input_error = false
        } else {
            state.view.address_input_error = true
        }
        collector.emit()
    }

    onChangeAmount1(e) {
        const collector = collect()
        state.view.amount1_input = e.target.value
        delete state.view.amount2_input
        collector.emit()
    }
    onChangeAmount2(e) {
        const collector = collect()
        state.view.amount2_input = e.target.value
        delete state.view.amount1_input
        collector.emit()
    }

    onChangeMax(e) {
        const collector = collect()
        state.view.amount1_input = this.getMax()
        delete state.view.amount2_input
        collector.emit()
    }

    onClickFee(e) {
        e.preventDefault()
        if (!state.view.fee_input_visible) state.view.fee_input_visible = true
        else state.view.fee_input = this.fee_recomended.toString()
    }

    // createRefInputFee(e) {
    //     // console.log(e.target, e.base)
    //     // e.base.focus() // is a div not an input
    //     // console.log(document.getElementsByClassName('fee_input')[0])
    //     // document.getElementsByClassName('fee_input')[0].focus()
    // }

    onChangeFee(e) {
        state.view.fee_input = e.target.value
    }

    onChangePassword(e) {
        const collector = collect()
        state.view.password_input_invalid = false
        state.view.password_input = e.target.value.trim()
        collector.emit()
    }

    onNext(e) {
        const asset = this.asset
        const address = asset.address
        const password = state.view.password_input
        const private_key_encrypted = asset.private_key
        const private_key = this.Coin.decrypt(
            address,
            private_key_encrypted,
            password
        )
        state.view.error_when_create = false

        if (private_key) {
            const outputs = this.Coin.createSimpleTxOutputs(
                address,
                state.view.address_input,
                asset.balance,
                this.amount,
                this.fee
            )
            console.log(outputs)
            this.Coin.createTx(private_key, outputs)
                .then(tx => {
                    console.log(tx)
                })
                .catch(e => {
                    state.view.error_when_create = true
                    console.error(e)
                })
        } else {
            state.view.password_input_invalid = true
        }
    }

    getMax() {
        const max = Big(this.asset.balance).minus(this.fee)
        return max.gt(0) ? max : 0
    }

    get isEnoughBalance() {
        return this.amount.lte(this.getMax())
    }

    get isValidForm() {
        return (
            !state.view.address_input_error &&
            state.view.address_input.length > 0 &&
            state.view.password_input.length > 0 &&
            this.amount.gt(0) &&
            this.fee.gt(0) &&
            !state.view.password_input_invalid
        )
    }

    render() {
        let amount1, amount2
        const symbol = this.asset.symbol
        const price = state.prices[symbol]

        if (state.view.amount1_input !== undefined) {
            amount1 = state.view.amount1_input
            amount2 = decimalsMax(
                Big(state.prices[symbol]).times(parseNumber(amount1)),
                2
            )
        } else {
            amount2 = state.view.amount2_input
            amount1 = decimalsMax(
                Big(parseNumber(amount2)).div(state.prices[symbol]),
                10
            )
        }

        this.amount = Big(parseNumber(amount1))
        this.fee = Big(parseNumber(state.view.fee_input))
        const isEnoughBalance = this.isEnoughBalance

        return React.createElement(SendTemplate, {
            color: this.Coin.color,
            address_input: state.view.address_input,
            address_input_error: state.view.address_input_error,
            amount1_input: amount1,
            amount2_input: amount2,
            symbol_crypto: symbol,
            symbol_currency: state.currency,
            fee_input: state.view.fee_input,
            fee_input_visible: state.view.fee_input_visible,
            fee_fiat: formatCurrency(
                convertBalance(this.asset.symbol, this.fee),
                2
            ),
            fee_recomended: this.fee_recomended,
            fee_recomended_fiat: formatCurrency(
                convertBalance(this.asset.symbol, this.fee_recomended),
                2
            ),
            password_input: state.view.password_input,
            password_input_invalid: state.view.password_input_invalid,
            isEnoughBalance: isEnoughBalance,
            isValidForm: this.isValidForm && this.isEnoughBalance,
            isFeeLowerThanRecomended: this.fee.lt(this.fee_recomended),
            error_when_create: state.view.error_when_create,
            onChangeAddress: this.onChangeAddress,
            onChangeAmount1: this.onChangeAmount1,
            onChangeAmount2: this.onChangeAmount2,
            onChangeMax: this.onChangeMax,
            onClickFee: this.onClickFee,
            onChangeFee: this.onChangeFee,
            onChangePassword: this.onChangePassword,
            onNext: this.onNext
        })
    }
}

function SendTemplate({
    color,
    address_input,
    address_input_error,
    amount1_input,
    amount2_input,
    symbol_crypto,
    symbol_currency,
    fee_fiat,
    fee_input,
    fee_input_visible,
    fee_recomended,
    fee_recomended_fiat,
    password_input,
    password_input_invalid,
    isEnoughBalance,
    isValidForm,
    isFeeLowerThanRecomended,
    error_when_create,
    onChangeAddress,
    onChangeAmount1,
    onChangeAmount2,
    onChangeMax,
    onClickFee,
    onChangeFee,
    onChangePassword,
    onNext
}) {
    return (
        <CenterElement width="500px" media={styles.media.third}>
            <SwitchView>
                <Div width="50%" float="left">
                    <Div>
                        <Input
                            value={address_input}
                            error="Invalid address"
                            invalid={address_input_error}
                            onChange={onChangeAddress}
                            placeholder="Address"
                            width="100%"
                            text-align="center"
                        />
                    </Div>
                    <Div padding-top="10px">
                        <Div float="left">
                            <Button
                                line-height="54px"
                                width="72px"
                                font-size="15px"
                                border-radius="10px 0 0 10px"
                                border-right="1px solid transparent"
                                onClick={onChangeMax}
                            >
                                Max
                            </Button>
                        </Div>
                        <Div float="left" width="calc(100% - 72px)">
                            <InputDouble
                                invalid={!isEnoughBalance}
                                error="Not enough funds"
                                value1={amount1_input}
                                value2={amount2_input}
                                color1={color}
                                color2="#000"
                                label1={symbol_crypto}
                                label2={symbol_currency}
                                onChange1={onChangeAmount1}
                                onChange2={onChangeAmount2}
                            />
                        </Div>
                    </Div>
                    <Div clear="both" />

                    <Show if={fee_input_visible}>
                        <Div
                            text-align="center"
                            padding-top="10px"
                            position="relative"
                        >
                            <DivOverInput>{fee_fiat}</DivOverInput>
                            <Input
                                value={fee_input}
                                error="Very low fee"
                                color={color}
                                invalid={false}
                                onChange={onChangeFee}
                                placeholder="Network fee"
                                width="100%"
                                text-align="center"
                            />
                        </Div>
                    </Show>

                    <Div text-align="center" padding="10px 0">
                        <TextFee href="#" onClick={onClickFee}>
                            <span>Recommended Network Fee </span>
                            <Span color={color} font-weight="bold">
                                {fee_recomended}{' '}
                            </Span>
                            <Span color="#000" font-weight="bold">
                                {fee_recomended_fiat}
                            </Span>
                        </TextFee>
                    </Div>

                    <Div padding-top="10px">
                        <Input
                            invalid={password_input_invalid}
                            error="Invalid password"
                            placeholder="Password"
                            type="password"
                            width="100%"
                            text-align="center"
                            value={password_input}
                            onChange={onChangePassword}
                        />
                    </Div>

                    <Div padding-top="10px">
                        <ButtonBig
                            onClick={onNext}
                            disabled={!isValidForm}
                            font-size="14px"
                            width="100%"
                        >
                            Next
                        </ButtonBig>
                    </Div>

                    <Show if={isFeeLowerThanRecomended}>
                        <Div padding-top="10px">
                            <Alert>
                                If you don’t apply enough funds for the network
                                fee, is probably that your transaction would
                                never be confirmed.
                            </Alert>
                        </Div>
                    </Show>

                    <Show if={error_when_create}>
                        <Div padding-top="10px">
                            <Alert color={ERROR}>
                                Something wrong ocurred when creating your
                                transaction. Please, try again later.
                            </Alert>
                        </Div>
                    </Show>
                </Div>
                <Div width="50%" float="left" height="100px" />
            </SwitchView>
        </CenterElement>
    )
}

const TextFee = styled.a`
    font-size: 12px;
    color: ${styles.color.grey1};
    &:hover {
        color: #000;
    }
`

const DivOverInput = styled.div`
    position: absolute;
    line-height: 34px;
    font-weight: bold;
    font-size: 12px;
    right: 10px;
    top: 13px;
    color: #000;
    pointer-events: none;
`
