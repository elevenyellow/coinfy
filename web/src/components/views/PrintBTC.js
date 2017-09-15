import React, { Component } from 'react'
import { createObserver, collect } from 'dop'
import styled from 'styled-components'

import { generateQRCode } from '/api/qr'
import { BTC } from '/api/Assets'
import { getAllFormats } from '/api/Assets/BTC'
import { printTemplate } from '/api/print'

import state from '/store/state'
import { unlockBTCAsset } from '/store/getters'

import routes from '/const/routes'
import styles from '/const/styles'

import Div from '/components/styled/Div'
import Button from '/components/styled/Button'
import Input from '/components/styled/Input'

import { BTC as template } from '/const/paperwallets'

export default class PrintBTC extends Component {
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
        const private_key = unlockBTCAsset(address, state.view.password)
        if ( private_key ) {
            const data = getAllFormats(private_key)
            data.address_qr = generateQRCode(data.address)
            data.address_comp_qr = generateQRCode(data.address_comp)
            data.private_key_qr = generateQRCode(data.private_key, undefined, styles.color.red3)
            data.private_key_comp_qr = generateQRCode(data.private_key_comp, undefined, styles.color.red3)
            printTemplate(template, data)
        }
        else
            state.view.invalidPassword = true
    }
    render() {
        return React.createElement(PrintBTCTemplate, {
            password: state.view.password,
            invalidPassword: state.view.invalidPassword,
            onChangePassword: this.onChangePassword,
            onPrint: this.onPrint
        })
    }
}

function PrintBTCTemplate({ password, invalidPassword, onChangePassword, onPrint }) {
    return (
        <div>
            <CenterElement>
                <form>
                    <Div height="55px">
                        <Input
                            width="100%"
                            value={password}
                            placeholder="Password of this asset"
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