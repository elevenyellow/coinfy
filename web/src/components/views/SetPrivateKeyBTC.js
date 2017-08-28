import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver, collect } from 'dop'

import { state } from '/store/state'

import routes from '/const/routes'
import { BTC } from '/const/crypto'

import { isPrivateKey, getAddressFromPrivateKey } from '/api/btc'

import { setHref, setPrivateKey } from '/store/actions'

import Div from '/components/styled/Div'
import Button from '/components/styled/Button'
import Help from '/components/styled/Help'
import Input from '/components/styled/Input'
import Password from '/components/styled/Password'
import { Label, SubLabel } from '/components/styled/Label'

const minpassword = 8

export default class SetPrivateKeyBTC extends Component {
    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.view)

        // Initial state
        state.view = {
            input: '',
            password: '',
            repassword: ''
        }

        // binding
        this.onChangeInput = this.onChangeInput.bind(this)
        this.onChangePassword = this.onChangePassword.bind(this)
        this.onChangeRepassword = this.onChangeRepassword.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }


    // Actions
    onChangeTypeImport(e) {
        const collector = collect()
        state.view.input = ''
        state.view.password = ''
        state.view.repassword = ''
        collector.emit()
    }
    onChangeInput(e) {
        const collector = collect()
        const value = e.target.value.trim()
        state.view.input = value
        collector.emit()
    }
    onChangePassword(e) {
        state.view.password = e.target.value
    }
    onChangeRepassword(e) {
        state.view.repassword = e.target.value
    }
    onSubmit(e) {
        e.preventDefault()
        const address = state.location.path[1]
        const collector = collect()
        setPrivateKey(BTC.symbol, address, state.view.input, state.view.password)
        setHref(routes.wallet(BTC.symbol, address))
        collector.emit()
    }

    // // Getters
    get isInvalidRepassword() {
        return (
            state.view.password.length > 0 &&
            state.view.repassword.length > 0 &&
            state.view.password.length === state.view.repassword.length &&
            state.view.password !== state.view.repassword
        )
    }
    get isTheRightPrivateKey() {
        const input = state.view.input
        const address = state.location.path[1]
        let isTheRightPrivateKey = false
        if (isPrivateKey(input)) {
            try {
                const newaddress = getAddressFromPrivateKey(input)
                if (newaddress === address) isTheRightPrivateKey = true
            } catch (e) {}
        }
        return isTheRightPrivateKey
    }

    render() {
        const isInvalidPrivateKey =
            !this.isTheRightPrivateKey && state.view.input.length > 0
        const isInvalidRepassword = this.isInvalidRepassword
        const isValidForm =
            state.view.input.length > 0 &&
            state.view.password.length >= minpassword &&
            state.view.password === state.view.repassword &&
            !isInvalidPrivateKey &&
            !isInvalidRepassword

        return React.createElement(SetPrivateKeyBTCTemplate, {
            input: state.view.input,
            password: state.view.password,
            repassword: state.view.repassword,
            isInvalidPrivateKey: isInvalidPrivateKey,
            isInvalidRepassword: isInvalidRepassword,
            isValidForm: isValidForm,
            onChangeInput: this.onChangeInput,
            onChangePassword: this.onChangePassword,
            onChangeRepassword: this.onChangeRepassword,
            onSubmit: this.onSubmit
        })
    }
}

function SetPrivateKeyBTCTemplate({
    input,
    password,
    repassword,
    isInvalidPrivateKey,
    isInvalidRepassword,
    isValidForm,
    onChangeInput,
    onChangePassword,
    onChangeRepassword,
    onSubmit
}) {
    return (
        <Div padding="0 50px">
            <Div height="65px">
                <Div float="left" width="40%">
                    <Label>Private key</Label>
                    <SubLabel>Type or paste your Private key.</SubLabel>
                </Div>
                <Div float="left" width="60%">
                    <Input
                        width="100%"
                        value={input}
                        onChange={onChangeInput}
                        error={'Invalid private key'}
                        invalid={isInvalidPrivateKey}
                    />
                </Div>
            </Div>
            <Div height="65px">
                <Div float="left" width="40%">
                    <Label>Password</Label>
                    <Help>
                        Make sure that you remember this. This password can't be
                        restored because we don't store it. For security reasons
                        you will be asked often for this password to operate
                        with this wallet.
                    </Help>
                    <SubLabel>
                        This password encrypts your private key.
                    </SubLabel>
                </Div>
                <Div float="left" width="60%">
                    <Password
                        minlength={minpassword}
                        value={password}
                        onChange={onChangePassword}
                        width="100%"
                        type="password"
                    />
                </Div>
            </Div>
            <Div height="60px">
                <Div float="left" width="40%">
                    <Label>Repeat Password</Label>
                </Div>
                <Div float="left" width="60%">
                    <Input
                        minlength={minpassword}
                        error={'Passwords do not match'}
                        invalid={isInvalidRepassword}
                        value={repassword}
                        onChange={onChangeRepassword}
                        width="100%"
                        type="password"
                    />
                </Div>
            </Div>
            <Div clear="both" />
            <Div float="right">
                <Button
                    width="200px"
                    disabled={!isValidForm}
                    onClick={onSubmit}
                >
                    Set private key
                </Button>
            </Div>
        </Div>
    )
}

const CenterElement = styled.div`
    margin: 0 auto;
    width: 360px;
`
