import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver, collect } from 'dop'

import { state } from '/store/state'

import Div from '/components/styled/Div'
import Button from '/components/styled/Button'
import Help from '/components/styled/Help'
import Input from '/components/styled/Input'
import Password from '/components/styled/Password'
import { Label, SubLabel } from '/components/styled/Label'

const minpassword = 8

export default class SetPrivateKey extends Component {

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

        if (isPrivateKey(value)) {
            try {
                const address = getAddressFromPrivateKey(value)
                console.log( address );
            } catch (e) {
                //console.log( e );
            }
        } 
        
        else {
            state.view.private_key = ''
        }
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
        if (this.isFormValid) {
            const collector = collect()
            const address = state.view.address
            setPrivateKey(
                BTC.symbol,
                address,
                state.view.private_key,
                state.view.password
            )
            setHref(routes.wallet(BTC.symbol, address))
            collector.emit()
        }
    }

    // // Getters
    // get isFormValid() {
    //     return (
    //         (state.view.private_key === '' ||
    //             (state.view.password.length >= minpassword &&
    //                 state.view.password === state.view.repassword))
    //     )
    // }
    get isInvalidRepassword() {
        return (
            state.view.password.length > 0 &&
            state.view.repassword.length > 0 &&
            state.view.password.length === state.view.repassword.length &&
            state.view.password !== state.view.repassword
        )
    }



    render() {
        return React.createElement(SetPrivateKeyTemplate, {
            input: state.view.input,
            password: state.view.password,
            repassword: state.view.repassword,
            isInvalidRepassword: this.isInvalidRepassword,
            onChangeInput: this.onChangeInput,
            onChangePassword: this.onChangePassword,
            onChangeRepassword: this.onChangePassword,
            onSubmit: this.onSubmit,
        })
    }
}

function SetPrivateKeyTemplate({ 
    input,
    password,
    repassword,
    isInvalidRepassword,
    onChangeInput,
    onChangePassword,
    onChangeRepassword,
    onSubmit,
 }) {
    return (
        <div>
            <Div height="65px">
                <Div float="left" width="40%">
                    <Label>Private key</Label>
                    <SubLabel>
                        Type or paste your Private key.
                    </SubLabel>
                </Div>
                <Div float="left" width="60%">
                    <Input
                        width="100%"
                        value={input}
                        onChange={onChangeInput}
                    />
                </Div>
            </Div>
            <Div height="65px">
                <Div float="left" width="40%">
                    <Label>Password</Label>
                    <Help>
                        Make sure that you remember this. This
                        password can't be restored because we don't
                        store it. For security reasons you will be
                        asked often for this password to operate
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
            <Div height="55px">
                <Div float="left" width="40%">
                    <Label>Repeat Password</Label>
                </Div>
                <Div float="left" width="60%">
                    <Input
                        minlength={minpassword}
                        error={
                            isInvalidRepassword
                                ? 'Passwords do not match'
                                : null
                        }
                        invalid={isInvalidRepassword}
                        value={repassword}
                        onChange={onChangeRepassword}
                        width="100%"
                        type="password"
                    />
                </Div>
            </Div>
        </div>
    )
}


const CenterElement = styled.div`
margin: 0 auto;
width: 360px;
`