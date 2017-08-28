import React, { Component } from 'react'
import { createObserver, collect } from 'dop'
import styled from 'styled-components'

import { state, unlockBTCWallet } from '/store/state'

import { getAllFormats } from '/api/btc'

import routes from '/const/routes'
import { BTC } from '/const/crypto'

import Div from '/components/styled/Div'
import Button from '/components/styled/Button'
import Input from '/components/styled/Input'

export default class DeleteWallet extends Component {
    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.view)

        // Initial state
        state.view = {
            password: '',
            invalidPassword: false
        }

        // binding
        this.onChangePassword = this.onChangePassword.bind(this)
        this.onPrint = this.onPrint.bind(this)
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    onChangePassword(e) {
        const collector = collect()
        state.view.password = e.target.value
        state.view.invalidPassword = false
        collector.emit()
    }
    onPrint(e) {
        e.preventDefault()
        const address = state.location.path[1]
        const private_key = unlockBTCWallet(address, state.view.password)
        if ( private_key ) {
            console.log(  'PRINT!!', getAllFormats(private_key) )
        }
        else
            state.view.invalidPassword = true
    }
    render() {
        return React.createElement(DeleteWalletTemplate, {
            password: state.view.password,
            invalidPassword: state.view.invalidPassword,
            onChangePassword: this.onChangePassword,
            onPrint: this.onPrint
        })
    }
}

function DeleteWalletTemplate({ password, invalidPassword, onChangePassword, onPrint }) {
    return (
        <div>
            <CenterElement>
                <form>
                    <Div height="55px">
                        <Input
                            width="100%"
                            value={password}
                            placeholder="Password of this wallet"
                            onChange={onChangePassword}
                            style={{textAlign:'center'}}
                            type="password"
                            error={'Invalid password'}
                            invalid={invalidPassword}
                        />
                    </Div>
                    <Div>
                        <Button onClick={onPrint} width="100%">UNLOCK AND PRINT</Button>
                    </Div>
                </form>
            </CenterElement>
        </div>
    )
}


const CenterElement = styled.div`
margin: 0 auto;
width: 360px;
`