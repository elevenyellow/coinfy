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
                <WizardContainer>
                    <Wizard>
                        <WizardItem status="3">✓</WizardItem>
                        <WizardItem status="2">2</WizardItem>
                        <WizardItem status="1">3</WizardItem>
                    </Wizard>
                </WizardContainer>

                {/* <Container>
                    <Title>Create Your Password</Title>
                    <Description>
                        Coinfy will protect this asset with a password. You must
                        remember your password as there is no way it can be
                        recovered! Think of this password as a key. It protects
                        your money if someone else tries to access your computer
                        or phone.
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
                                <FormFieldButtonRight width="100%">
                                    <ButtonBig
                                        width="100%"
                                        disabled={true}
                                        onClick={e => onNext}
                                    >
                                        Next
                                    </ButtonBig>
                                </FormFieldButtonRight>
                            </FormField>
                        </form>
                    </Content>
                </Container> */}

                <Container>
                    <Title>Write Down or Print Your Recovery Phrase</Title>
                    <Description>
                        Write or print this and store it in a safe or locked
                        valult. <strong>Do not share it with anyone.</strong>
                        <br />
                        These words allows you to recover this asset in case of
                        loss or damage.{' '}
                        <strong>
                            Without it you will not be able to recover your
                            money if something goes wrong.
                        </strong>
                        This phrase is case sensitive. Make two copies and store
                        them in separate physical locations.
                    </Description>

                    <Content>
                        <form>
                            <Div>
                                <Words>
                                    cycle ladder vault piano steel put copy
                                    cancel purse scare before wood
                                </Words>
                                <Div position="relative" top="-20px">
                                    <Button margin="0 auto">Print</Button>
                                </Div>
                            </Div>

                            <FormField>
                                <FormFieldButtonLeft width="29%">
                                    <ButtonBig
                                        width="100%"
                                        disabled={false}
                                        onClick={e => onBack}
                                    >
                                        Back
                                    </ButtonBig>
                                </FormFieldButtonLeft>
                                <FormFieldButtonRight width="69%">
                                    <ButtonBig
                                        width="100%"
                                        disabled={true}
                                        onClick={e => onNext}
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

const WizardContainer = styled.div`
    ${styles.media.fourth} {
        display: none;
    }
`

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
    ${styles.media.fourth} {
        padding-top: 0;
        font-size: 20px;
    }
`

const Description = styled.div`
    padding-top: 20px;
    color: ${styles.color.front3};
    font-size: 14px;
    & strong {
        font-weight: bold;
    }
    ${styles.media.fourth} {
        font-size: 12px;
    }
`

const Content = styled.div`
    padding-top: 20px;
`

const Words = styled.div`
    font-size: 25px;
    text-align: center;
    font-weight: bold;
    border: 2px solid #eee;
    padding: 30px 20px 40px 20px;
    color: black;
    border-radius: 5px;
    user-select: text;
    cursor: auto;
    background: url('/static/image/patternbackground.png');
    box-shadow: 0 0 0px 1px rgba(255, 255, 255, 1) inset;
`
