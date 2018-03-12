import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver, collect } from 'dop'

import styles from '/const/styles'

import { getRandomArbitrary } from '/api/numbers'
import { isAddress } from '/api/coins/ETH'
import {
    getNameContract,
    getSymbolContract,
    getDecimalsContract
} from '/api/coins/ERC20'

import state from '/store/state'

import H1 from '/components/styled/H1'
import H2 from '/components/styled/H2'
import {
    RightContainerPadding,
    RightHeader,
    RightContent
} from '/components/styled/Right'
import Div from '/components/styled/Div'
import Input from '/components/styled/Input'
import Help from '/components/styled/Help'
import Button from '/components/styled/Button'
import { Label, SubLabel } from '/components/styled/Label'
import IconHeader from '/components/styled/IconHeader'
import {
    FormField,
    FormFieldLeft,
    FormFieldRight,
    FormFieldButtons
} from '/components/styled/Form'

export default class ImportBitcoin extends Component {
    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.view)

        // Initial state
        state.view = {
            contract_address: '',
            symbol: '',
            name: '',
            coin_decimals: 18,
            color: (
                '#' +
                getRandomArbitrary(30, 255).toString(16) +
                getRandomArbitrary(30, 255).toString(16) +
                getRandomArbitrary(30, 255).toString(16)
            ).toUpperCase(),

            contract_address_error: '',
            symbol_error: '',
            name_error: '',
            coin_decimals_error: '',
            color_error: ''
        }

        // binding
        this.onChangeAddress = this.onChangeAddress.bind(this)
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    onChangeAddress(e) {
        const contract_address = e.target.value.trim()
        if (state.view.contract_address !== contract_address) {
            const collector = collect()
            state.view.contract_address = contract_address
            if (isAddress(contract_address)) {
                state.view.contract_address_error = ''
                getNameContract(contract_address).then(result => {
                    console.log(result)
                })
                getSymbolContract(contract_address).then(result => {
                    console.log(result)
                })
                getDecimalsContract(contract_address).then(result => {
                    console.log(result)
                })
            } else {
                state.view.contract_address_error = 'Invalid address'
            }
            collector.emit()
        }
    }

    render() {
        return React.createElement(ImportTemplate, {
            contract_address: state.view.contract_address,
            symbol: state.view.symbol,
            name: state.view.name,
            coin_decimals: state.view.coin_decimals,
            color: state.view.color,

            contract_address_error: state.view.contract_address_error,
            symbol_error: state.view.symbol_error,
            name_error: state.view.name_error,
            coin_decimals_error: state.view.coin_decimals_error,
            color_error: state.view.color_error,

            onChangeAddress: this.onChangeAddress
        })
    }
}

function ImportTemplate({
    contract_address,
    symbol,
    name,
    coin_decimals,
    color,

    contract_address_error,
    symbol_error,
    name_error,
    coin_decimals_error,
    color_error,

    onChangeAddress
}) {
    return (
        <RightContainerPadding>
            <RightHeader>
                <IconHeader>
                    <img />
                </IconHeader>
                <Div float="left">
                    <H1>ERC20</H1>
                    <H2>Create custom ERC20 token</H2>
                </Div>
                <Div clear="both" />
            </RightHeader>
            <RightContent>
                <Div>
                    <form>
                        <FormField>
                            <FormFieldLeft>
                                <Label>Contract Address</Label>
                                {/* <SubLabel>
                                    Select the option you prefer to import.
                                </SubLabel> */}
                            </FormFieldLeft>
                            <FormFieldRight>
                                <Input
                                    value={contract_address}
                                    width="100%"
                                    error={contract_address_error}
                                    invalid={contract_address_error}
                                    onChange={onChangeAddress}
                                />
                            </FormFieldRight>
                        </FormField>

                        <FormField>
                            <FormFieldLeft>
                                <Label>Symbol</Label>
                                <Help>
                                    Three or more letters that represent this
                                    asset. The symbol of Bitcoin is BTC.
                                </Help>
                                <SubLabel>Letters and Numbers only.</SubLabel>
                            </FormFieldLeft>
                            <FormFieldRight>
                                <Input
                                    maxLength="5"
                                    value={symbol}
                                    width="100%"
                                    error={'address_input_error'}
                                    invalid={false}
                                />
                            </FormFieldRight>
                        </FormField>

                        <FormField>
                            <FormFieldLeft>
                                <Label>Name / Title</Label>
                            </FormFieldLeft>
                            <FormFieldRight>
                                <Input
                                    value={name}
                                    width="100%"
                                    error={'address_input_error'}
                                    invalid={false}
                                />
                            </FormFieldRight>
                        </FormField>

                        <FormField>
                            <FormFieldLeft>
                                <Label>Decimals</Label>
                            </FormFieldLeft>
                            <FormFieldRight>
                                <Input
                                    min="1"
                                    max="99"
                                    value={coin_decimals}
                                    type="number"
                                    width="100%"
                                    error={'address_input_error'}
                                    invalid={false}
                                />
                            </FormFieldRight>
                        </FormField>

                        <FormField>
                            <FormFieldLeft>
                                <Label>Color</Label>
                            </FormFieldLeft>
                            <FormFieldRight>
                                <Input
                                    value={color}
                                    width="100%"
                                    error={'address_input_error'}
                                    invalid={false}
                                />
                                <Color color={color} />
                            </FormFieldRight>
                        </FormField>

                        <FormField>
                            <FormFieldButtons>
                                <Button
                                    width="100px"
                                    disabled={false}
                                    onClick={e => {}}
                                >
                                    Create
                                </Button>
                            </FormFieldButtons>
                        </FormField>
                    </form>
                </Div>
            </RightContent>
        </RightContainerPadding>
    )
}

const Color = styled.div`
    position: absolute;
    right: 0;
    width: 35px;
    height: 35px;
    background: ${props => props.color};
    top: 0;
    border: 2px solid ${styles.color.background5};
`
