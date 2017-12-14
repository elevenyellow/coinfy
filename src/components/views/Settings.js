import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'
import { Router, Route } from '/doprouter/react'
import styles from '/const/styles'
import { MAINNET, TESTNET } from '/const/networks'
import { Fiats } from '/api/Fiats'

import state from '/store/state'
import { changeFiat, changeNetwork, closeSession } from '/store/actions'

import Div from '/components/styled/Div'
import H1 from '/components/styled/H1'
import Section from '/components/styled/Section'
import {
    RightContainerPadding,
    RightHeader,
    RightContent
} from '/components/styled/Right'

import Select from '/components/styled/Select'
import { Label, SubLabel } from '/components/styled/Label'
import CenterElement from '/components/styled/CenterElement'
import Button from '/components/styled/Button'
import {
    FormField,
    FormFieldLeft,
    FormFieldRight,
    FormFieldButtons
} from '/components/styled/Form'

export default class Settings extends Component {
    componentWillMount() {
        // this.observer = createObserver(mutations => this.forceUpdate())
        // this.observer.observe(state.location.path, 'length')
        // this.observer.observe(state.location.path, '1')

        this.fiatsList = [
            {
                symbol: Fiats.USD.symbol,
                label: `${Fiats.USD.ascii} ${Fiats.USD.name} (${
                    Fiats.USD.symbol
                })`
            },
            {
                symbol: Fiats.EUR.symbol,
                label: `${Fiats.EUR.ascii} ${Fiats.EUR.name} (${
                    Fiats.EUR.symbol
                })`
            },
            {
                symbol: Fiats.GBP.symbol,
                label: `${Fiats.GBP.ascii} ${Fiats.GBP.name} (${
                    Fiats.GBP.symbol
                })`
            },
            {
                symbol: Fiats.JPY.symbol,
                label: `${Fiats.JPY.ascii} ${Fiats.JPY.name} (${
                    Fiats.JPY.symbol
                })`
            },
            {
                symbol: Fiats.INR.symbol,
                label: `${Fiats.INR.ascii} ${Fiats.INR.name} (${
                    Fiats.INR.symbol
                })`
            },
            {
                symbol: Fiats.CNY.symbol,
                label: `${Fiats.CNY.ascii} ${Fiats.CNY.name} (${
                    Fiats.CNY.symbol
                })`
            },
            {
                symbol: Fiats.CAD.symbol,
                label: `${Fiats.CAD.ascii} ${Fiats.CAD.name} (${
                    Fiats.CAD.symbol
                })`
            },
            {
                symbol: Fiats.AUD.symbol,
                label: `${Fiats.AUD.ascii} ${Fiats.AUD.name} (${
                    Fiats.AUD.symbol
                })`
            },
            {
                symbol: Fiats.SGD.symbol,
                label: `${Fiats.SGD.ascii} ${Fiats.SGD.name} (${
                    Fiats.SGD.symbol
                })`
            }
        ]
    }

    componentWillUnmount() {
        // this.observer.destroy()
    }

    shouldComponentUpdate() {
        return false
    }

    onChangeFiat(e) {
        changeFiat(e.target.value)
    }

    onChangeNetwork(e) {
        changeNetwork(e.target.value)
    }

    onClose() {
        closeSession()
    }

    render() {
        return React.createElement(SettingsTemplate, {
            fiat: state.fiat,
            fiatsList: this.fiatsList,
            network: state.network,
            onChangeFiat: this.onChangeFiat,
            onChangeNetwork: this.onChangeNetwork,
            onClose: this.onClose
        })
    }
}

function SettingsTemplate({
    fiat,
    fiatsList,
    network,
    onChangeFiat,
    onChangeNetwork,
    onClose
}) {
    return (
        <RightContainerPadding>
            <RightHeader>
                <Div float="left">
                    <H1>Settings</H1>
                </Div>
                <Div clear="both" />
            </RightHeader>
            <RightContent>
                <Div>
                    <Div>
                        <Section>Currencies</Section>
                    </Div>
                    <FormField>
                        <FormFieldLeft>
                            <Label>Fiat currency</Label>
                            {/* <SubLabel>
                                Being on testnet you will use Coinfy within the
                                test networks.
                            </SubLabel> */}
                        </FormFieldLeft>
                        <FormFieldRight>
                            <Select width="100%" onChange={onChangeFiat}>
                                {fiatsList.map(fiatItem => (
                                    <option
                                        value={fiatItem.symbol}
                                        selected={fiat === fiatItem.symbol}
                                    >
                                        {fiatItem.label}
                                    </option>
                                ))}
                            </Select>
                        </FormFieldRight>
                    </FormField>
                </Div>
                <Div>
                    <Div>
                        <Section>Session</Section>
                    </Div>
                    <FormField>
                        <FormFieldLeft>
                            <Label>Network</Label>
                            <SubLabel>
                                Being on testnet you will use Coinfy within the
                                test networks.
                            </SubLabel>
                        </FormFieldLeft>
                        <FormFieldRight>
                            <Select width="100%" onChange={onChangeNetwork}>
                                <option
                                    value={MAINNET}
                                    selected={network === MAINNET}
                                >
                                    Mainnet
                                </option>
                                <option
                                    value={TESTNET}
                                    selected={network === TESTNET}
                                >
                                    Testnet
                                </option>
                            </Select>
                        </FormFieldRight>
                    </FormField>
                    <FormField>
                        <Button width="100%" onClick={onClose}>
                            Close / Remove{' '}
                            {network === MAINNET ? 'mainnet' : 'testnet'}{' '}
                            session
                        </Button>
                    </FormField>
                </Div>
            </RightContent>
        </RightContainerPadding>
    )
}
