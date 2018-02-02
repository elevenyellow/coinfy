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
import SwitchView from '/components/styled/SwitchView'

export default class AddAsset extends Component {
    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.view)

        state.view = {
            step: 1
        }

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
        return React.createElement(AddAssetTemplate, {
            Coin: this.Coin,
            onSelectOption: this.onSelectOption,
            minpassword: minpassword
        })
    }
}

function AddAssetTemplate({ Coin, onSelectOption }) {
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
                <WizardContainerMobile>
                    Step <span>2</span> of 3
                </WizardContainerMobile>

                <SwitchView active={1}>
                    <Container>
                        <Title>Create Your Password</Title>
                        <Description>
                            Coinfy will protect this asset with a password. You
                            must remember your password as there is no way it
                            can be recovered! Think of this password as a key.
                            It protects your money if someone else tries to
                            access your computer or phone.
                        </Description>

                        <Content>
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
                        </Content>
                    </Container>

                    <Container>
                        <Title>Write Down or Print Your Recovery Phrase</Title>
                        <Description>
                            Write or print this and store it in a safe or locked
                            valult.{' '}
                            <strong>
                                <span>Do not share it with anyone.</span>
                            </strong>
                            <br />
                            These words allows you to recover this asset in case
                            of loss or damage.{' '}
                            <strong>
                                <span>
                                    Without it you will not be able to recover
                                    your money if something goes wrong.
                                </span>
                            </strong>{' '}
                            Make two copies and store them in separate physical
                            locations. This phrase is case sensitive and order
                            is very important.
                        </Description>

                        <Content>
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
                        </Content>
                    </Container>

                    <Container>
                        <Title>Verify Your Recovery Phrase</Title>

                        <Content>
                            <Div>
                                <Words error={false}>
                                    cycle ladder vault piano
                                </Words>
                                {/* <Div position="relative" top="-20px">
                                    <Button
                                        margin="0 auto"
                                        red={true}
                                        disabled={true}
                                    >
                                        Clear
                                    </Button>
                                </Div> */}
                            </Div>
                            <WordsButtons>
                                <Button>cycle</Button>
                                <Button>ladder</Button>
                                <Button>vault</Button>
                                <Button>piano</Button>
                                <Button>steel</Button>
                                <Button>put</Button>
                                <Button>copy</Button>
                                <Button>verylongwordwhatever</Button>
                                <Button>purse</Button>
                                <Button>scare</Button>
                                <Button>before</Button>
                                <Button>wood</Button>
                            </WordsButtons>

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
                                        Create!
                                    </ButtonBig>
                                </FormFieldButtonRight>
                            </FormField>
                        </Content>
                    </Container>
                </SwitchView>
            </RightContent>
        </RightContainerPadding>
    )
}

const WizardContainer = styled.div`
    ${styles.media.fourth} {
        display: none;
    }
`
const WizardContainerMobile = styled.div`
    font-weight: 100;
    color: #007095;
    font-size: 12px;
    display: none;
    & > span {
        font-weight: normal;
    }
    ${styles.media.fourth} {
        display: block;
    }
`

const Container = styled.div`
    max-width: 550px;
    margin: 0 auto;
`

const Title = styled.div`
    text-align: center;
    padding-top: 20px;
    color: ${styles.color.background2};
    font-weight: 900;
    font-size: 22px;
    ${styles.media.fourth} {
        padding-top: 0;
        font-size: 20px;
        text-align: left;
        line-height: 16px;
    }
`

const Description = styled.div`
    padding-top: 20px;
    color: ${styles.color.front3};
    font-size: 14px;
    & strong {
        font-weight: bold;
    }
    & span {
        color: ${styles.color.red3};
    }
    ${styles.media.fourth} {
        font-size: 12px;
    }
`

const Content = styled.div`
    padding-top: 20px;
`

const Words = styled.div`
    font-size: 24px;
    padding: 30px 30px 30px 30px;
    text-align: center;
    font-weight: bold;
    color: ${props => (props.error ? styles.color.red3 : 'black')};
    border: 2px solid
        ${props => (props.error ? styles.color.red3 : 'transparent')};
    border-radius: 5px;
    user-select: text;
    cursor: auto;
    background: url('/static/image/patternbackground.png');
    font-family: monospace;
    ${styles.media.fourth} {
        font-size: 18px;
        padding: 15px 15px 30px 15px;
    }
`

const WordsButtons = styled.div`
    margin-top: 10px;
    margin-bottom: 15px;
    & > * {
        display: inline-block;
        width: calc(33.33% - 6.66px);
        margin-left: 5px;
        margin-right: 5px;
        margin-bottom: 10px;
        padding: 10px 0 10px;
        font-size: 13px;
    }
    & > *:nth-child(3n - 2) {
        margin-left: 0;
    }
    & > *:nth-child(3n) {
        margin-right: 0;
    }
`
