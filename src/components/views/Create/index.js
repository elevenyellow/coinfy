import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver, collect } from 'dop'
import { Router, Route, Show } from '/doprouter/react'

import styles from '/const/styles'
import routes from '/const/routes'
import { minpassword } from '/api/crypto'

import { generateQRCode } from '/api/qr'
import { Coins } from '/api/Coins'
import { isAddress } from '/api/Coins/ETH'

import state from '/store/state'
import { setHref } from '/store/actions'

import IconHeader from '/components/styled/IconHeader'
import H1 from '/components/styled/H1'
import H2 from '/components/styled/H2'
import { Wizard, WizardItem } from '/components/styled/Wizard'
import {
    RightContainerPadding,
    RightHeader,
    RightContent
} from '/components/styled/Right'
import Div from '/components/styled/Div'
import {
    FormField,
    FormFieldButtonLeft,
    FormFieldButtonRight
} from '/components/styled/Form'
import Input from '/components/styled/Input'
import Password from '/components/styled/Password'
import ButtonBig from '/components/styled/ButtonBig'
import Button from '/components/styled/Button'

export default class AddAsset extends Component {
    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.view)

        this.Coin = Coins[state.location.path[state.location.path.length - 1]]

        // binding
        this.onSelectOption = this.onSelectOption.bind(this)
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    // Actions
    onSelectOption(route) {
        setHref(route)
    }

    render() {
        return React.createElement(ImportTemplate, {
            Coin: this.Coin,
            onSelectOption: this.onSelectOption,
            minpassword: minpassword
        })
    }
}

function ImportTemplate({ Coin, onSelectOption }) {
    return (
        <RightContainerPadding>
            <RightHeader>
                <IconHeader>
                    <img src={`/static/image/coins/${Coin.symbol}.svg`} />
                </IconHeader>
                <Div float="left">
                    <H1>{Coin.name}</H1>
                    <H2>Create {Coin.symbol} asset</H2>
                </Div>
                <Div clear="both" />
            </RightHeader>
            <RightContent>
                <Wizard>
                    <WizardItem status="2">✓</WizardItem>
                    <WizardItem status="1">2</WizardItem>
                    <WizardItem status="1">3</WizardItem>
                </Wizard>
                <Container>
                    <Title>Create Your Password</Title>
                    <Description>
                        Coinfy will protect this asset with a password. You must
                        remember your password as there is no way it can be
                        recovered! Think of this password as a key. It protects
                        your money if someone else tries to access your
                        computer.
                    </Description>

                    <Content>
                        <form>
                            <FormField>
                                <Password
                                    placeholder="Password"
                                    minlength={minpassword}
                                    value={''}
                                    onChange={e => onChangePassword}
                                    width="100%"
                                    type="password"
                                />
                            </FormField>
                            <FormField>
                                <Input
                                    placeholder="Repeat Password"
                                    minlength={minpassword}
                                    error={
                                        'isInvalidRepassword' === ''
                                            ? 'Passwords do not match'
                                            : null
                                    }
                                    invalid={'isInvalidRepassword' === ''}
                                    value={''}
                                    onChange={e => onChangeRepassword}
                                    width="100%"
                                    type="password"
                                />
                            </FormField>
                            <FormField>
                                {/* <FormFieldButtonLeft width="49%">
                                    <ButtonBig
                                        width="100%"
                                        disabled={false}
                                        onClick={e => onSubmit}
                                    >
                                        Next
                                    </ButtonBig>
                                </FormFieldButtonLeft> */}
                                <FormFieldButtonRight width="100%">
                                    <ButtonBig
                                        width="100%"
                                        disabled={true}
                                        onClick={e => onSubmit}
                                    >
                                        Next
                                    </ButtonBig>
                                </FormFieldButtonRight>
                            </FormField>
                        </form>
                    </Content>
                </Container>
            </RightContent>
        </RightContainerPadding>
    )
}

const Container = styled.div`
    max-width: 550px;
    margin: 0 auto;
`

const Title = styled.div`
    text-align: center;
    padding-top: 20px;
    color: ${styles.color.grey3};
    font-weight: bold;
    font-size: 22px;
`

const Description = styled.div`
    padding-top: 20px;
    color: ${styles.color.front3};
    font-weight: bold;
    font-size: 14px;
`

const Content = styled.div`
    padding-top: 20px;
`
