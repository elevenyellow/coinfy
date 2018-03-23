import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver, collect } from 'dop'

import styles from '/const/styles'
import { routes, Router, Route, Show } from '/store/router'
import { minpassword } from '/const/'
import { Words as template } from '/const/paperwallets'

import { getRandomMnemonic } from '/api/bip39'
import { shuffle } from '/api/arrays'
import { generateQRCode } from '/api/qr'
import { Coins } from '/api/coins'
import { isAddress } from '/api/coins/ETH'
import { printTemplate } from '/api/browser'

import state from '/store/state'
import { createAsset, setSeed, setHref, addNotification } from '/store/actions'
import { getAssetId } from '/store/getters'

import IconPrint from 'react-icons/lib/fa/print'

import { Wizard, WizardItem } from '/components/styled/Wizard'

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

export default class NewAsset extends Component {
    componentWillMount() {
        state.view = {
            step: 0,
            password: '',
            repassword: '',
            words_shuffle_clicked: [],
            word_wrong_selected: false
        }

        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.view)
        this.observer.observe(state.view.words_shuffle_clicked, 'length')

        this.words = getRandomMnemonic().split(' ')
        this.words_shuffle = []
        this.Coin =
            Coins[
                decodeURIComponent(
                    state.location.path[state.location.path.length - 1]
                )
            ]

        // binding
        this.onChangePassword = this.onChangePassword.bind(this)
        this.onChangeRepassword = this.onChangeRepassword.bind(this)
        this.onVerifyWord = this.onVerifyWord.bind(this)
        this.onNext = this.onNext.bind(this)
        this.onBack = this.onBack.bind(this)
        this.onPrint = this.onPrint.bind(this)
        this.onClear = this.onClear.bind(this)
        this.onCreate = this.onCreate.bind(this)
    }
    shouldComponentUpdate() {
        return false
    }

    onNext(e) {
        const collector = collect()
        state.view.step += 1
        if (state.view.step === 2) {
            this.words_shuffle = shuffle(this.words.slice(0))
            state.view.words_shuffle_clicked.length = 0
            state.view.word_wrong_selected = false
        }
        collector.emit()
    }
    onBack(e) {
        state.view.step -= 1
    }
    onChangePassword(e) {
        state.view.password = e.target.value
    }
    onChangeRepassword(e) {
        state.view.repassword = e.target.value
    }
    onVerifyWord(word, index) {
        const collector = collect()
        const words_shuffle_clicked = state.view.words_shuffle_clicked
        words_shuffle_clicked.push(index)
        state.view.word_wrong_selected =
            this.words[words_shuffle_clicked.length - 1] !== word
        collector.emit()
    }
    onPrint() {
        printTemplate(template(this.words.join(' ')))
    }
    onClear() {
        const collector = collect()
        state.view.words_shuffle_clicked.length = 0
        state.view.word_wrong_selected = false
        collector.emit()
    }
    onCreate() {
        const collector = collect()
        const symbol = this.Coin.symbol
        const words = this.words.join(' ')
        const wallet = this.Coin.getWalletFromSeed({ seed: words })
        const address = wallet.address
        const asset = createAsset(this.Coin.type, symbol, address)
        const asset_id = getAssetId({ symbol, address })
        setSeed(asset_id, words, state.view.password)
        setHref(routes.asset({ asset_id: asset_id }))
        addNotification(`New "${symbol}" asset has been created`)
        collector.emit()
    }

    // Getters
    get isPasswordFormValid() {
        return (
            state.view.password.length >= minpassword &&
            state.view.password === state.view.repassword
        )
    }
    get isRepasswordInvalid() {
        return (
            state.view.password.length > 0 &&
            state.view.repassword.length > 0 &&
            state.view.password.length === state.view.repassword.length &&
            state.view.password !== state.view.repassword
        )
    }

    render() {
        return React.createElement(NewAssetTemplate, {
            Coin: this.Coin,
            step: state.view.step,
            password: state.view.password,
            repassword: state.view.repassword,
            words: this.words,
            words_shuffle: this.words_shuffle,
            words_shuffle_clicked: state.view.words_shuffle_clicked,
            word_wrong_selected: state.view.word_wrong_selected,
            isPasswordFormValid: this.isPasswordFormValid,
            isRepasswordInvalid: this.isRepasswordInvalid,
            onChangePassword: this.onChangePassword,
            onChangeRepassword: this.onChangeRepassword,
            onVerifyWord: this.onVerifyWord,
            onNext: this.onNext,
            onBack: this.onBack,
            onPrint: this.onPrint,
            onClear: this.onClear,
            onCreate: this.onCreate
        })
    }
}

function NewAssetTemplate({
    Coin,
    step,
    password,
    repassword,
    words,
    words_shuffle,
    words_shuffle_clicked,
    word_wrong_selected,
    isPasswordFormValid,
    isRepasswordInvalid,
    onChangePassword,
    onChangeRepassword,
    onVerifyWord,
    onNext,
    onBack,
    onPrint,
    onClear,
    onCreate
}) {
    return (
        <div>
            <WizardContainer>
                <Wizard>
                    {[0, 1, 2].map(item => {
                        return item < step ? (
                            <WizardItem status="3">✓</WizardItem>
                        ) : (
                            <WizardItem status={item > step ? 1 : 2}>
                                {item + 1}
                            </WizardItem>
                        )
                    })}
                </Wizard>
            </WizardContainer>
            <WizardContainerMobile>
                Step <span>{step + 1}</span> of 3
            </WizardContainerMobile>

            <Container>
                <SwitchView active={step}>
                    <ContainerView>
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
                                    value={password}
                                    onChange={onChangePassword}
                                    width="100%"
                                    type="password"
                                />
                            </FormField>
                            <FormField>
                                <Input
                                    placeholder="Repeat Password"
                                    minlength={minpassword}
                                    error={
                                        isRepasswordInvalid
                                            ? 'Passwords do not match'
                                            : null
                                    }
                                    invalid={isRepasswordInvalid}
                                    value={repassword}
                                    onChange={onChangeRepassword}
                                    width="100%"
                                    type="password"
                                />
                            </FormField>
                            <FormField>
                                <FormFieldButtonRight width="100%">
                                    <ButtonBig
                                        width="100%"
                                        disabled={!isPasswordFormValid}
                                        onClick={onNext}
                                    >
                                        Next
                                    </ButtonBig>
                                </FormFieldButtonRight>
                            </FormField>
                        </Content>
                    </ContainerView>

                    <ContainerView>
                        <Title>Write Down or Print Your Recovery Phrase</Title>
                        <Description>
                            Write or print this and store it in a safe or locked
                            valult.{' '}
                            <strong>
                                <span>Do not share it with anyone.</span>
                            </strong>
                            <br />
                            These words allow you to recover this asset in case
                            of loss or damage.{' '}
                            <strong>
                                <span>
                                    Without it you will not be able to recover
                                    your money if something goes wrong.
                                </span>
                            </strong>{' '}
                            Make two copies and store them in separates physical
                            locations. This phrase is case sensitive and the
                            order is very important.
                        </Description>

                        <Content>
                            <Div>
                                <Words>{words.join(' ')}</Words>
                                <Div position="relative" top="-20px">
                                    <Button margin="0 auto" onClick={onPrint}>
                                        <IconPrint size={20} color="#617991" />{' '}
                                    </Button>
                                </Div>
                            </Div>

                            <FormField>
                                <FormFieldButtonLeft width="29%">
                                    <ButtonBig width="100%" onClick={onBack}>
                                        Back
                                    </ButtonBig>
                                </FormFieldButtonLeft>
                                <FormFieldButtonRight width="69%">
                                    <ButtonBig width="100%" onClick={onNext}>
                                        Next
                                    </ButtonBig>
                                </FormFieldButtonRight>
                            </FormField>
                        </Content>
                    </ContainerView>

                    <ContainerView>
                        <Title>Verify Your Recovery Phrase</Title>

                        <Content>
                            <Div>
                                <Words error={word_wrong_selected}>
                                    {words_shuffle_clicked.length > 0
                                        ? words_shuffle_clicked
                                              .map(
                                                  index => words_shuffle[index]
                                              )
                                              .join(' ')
                                        : '\u00A0'}
                                </Words>
                                {/* <Show if={word_wrong_selected}> */}
                                <Div
                                    position="relative"
                                    top="-20px"
                                    height="20px"
                                >
                                    <Button
                                        onClick={onClear}
                                        margin="0 auto"
                                        disabled={!word_wrong_selected}
                                        red={true}
                                    >
                                        Clear
                                    </Button>
                                </Div>
                                {/* </Show> */}
                            </Div>
                            <WordsButtons>
                                {words_shuffle.map((word, index) => (
                                    <Button
                                        disabled={
                                            word_wrong_selected ||
                                            words_shuffle_clicked.indexOf(
                                                index
                                            ) > -1
                                        }
                                        onClick={e => onVerifyWord(word, index)}
                                    >
                                        {word}
                                    </Button>
                                ))}
                            </WordsButtons>

                            <FormField>
                                <FormFieldButtonLeft width="29%">
                                    <ButtonBig
                                        width="100%"
                                        disabled={false}
                                        onClick={onBack}
                                    >
                                        Back
                                    </ButtonBig>
                                </FormFieldButtonLeft>
                                <FormFieldButtonRight width="69%">
                                    <ButtonBig
                                        width="100%"
                                        disabled={
                                            words.length >
                                            words_shuffle_clicked.length
                                        }
                                        onClick={onCreate}
                                    >
                                        Create!
                                    </ButtonBig>
                                </FormFieldButtonRight>
                            </FormField>
                        </Content>
                    </ContainerView>
                </SwitchView>
            </Container>
        </div>
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

const ContainerView = styled.div``

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
    padding: 30px 30px 40px 30px;
    text-align: center;
    font-weight: bold;
    color: ${props => (props.error ? styles.color.red3 : 'black')};
    border: 2px solid
        ${props => (props.error ? styles.color.red3 : 'transparent')};
    border-radius: 5px;
    user-select: text;
    cursor: auto;
    background: url('/static/image/pattern_background.png');
    font-family: monospace;
    animation: ${props =>
        props.error
            ? 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both'
            : 'unset'};
    ${styles.media.fourth} {
        font-size: 16px;
        padding: 15px 15px 25px 15px;
    }

    @keyframes shake {
        10%,
        90% {
            transform: translate3d(-1px, 0, 0);
        }

        20%,
        80% {
            transform: translate3d(2px, 0, 0);
        }

        30%,
        50%,
        70% {
            transform: translate3d(-4px, 0, 0);
        }

        40%,
        60% {
            transform: translate3d(4px, 0, 0);
        }
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
