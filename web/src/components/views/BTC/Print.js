import React, { Component } from 'react'
import { createObserver, collect } from 'dop'
import styled from 'styled-components'

import { generateQRCode } from '/api/qr'
import { BTC } from '/api/Assets'
import { getAllFormats } from '/api/Assets/BTC'
import { printTemplate } from '/api/window'
import { encryptBIP38 } from '/api/security'

import state from '/store/state'
import { getAsset } from '/store/getters'

import routes from '/const/routes'
import styles from '/const/styles'

import Div from '/components/styled/Div'
import Button from '/components/styled/Button'
import Input from '/components/styled/Input'
import Checkbox from '/components/styled/Checkbox'
import CenterElement from '/components/styled/CenterElement'
import {
    FormField
} from '/components/styled/Form'

import { BTC as template } from '/const/paperwallets'

export default class PrintBTC extends Component {
    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.view)

        // Initial state
        state.view = {
            encrypted: true,
            password: '',
            invalidPassword: false
        }

        // binding
        this.onChangeEncryption = this.onChangeEncryption.bind(this)
        this.onChangePassword = this.onChangePassword.bind(this)
        this.onPrint = this.onPrint.bind(this)
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    onChangeEncryption(e) {
        state.view.encrypted = !state.view.encrypted
    }
    onChangePassword(e) {
        const collector = collect()
        state.view.password = e.target.value
        state.view.invalidPassword = false
        collector.emit()
    }
    onPrint(e) {
        e.preventDefault()
        const asset_id = state.location.path[1]
        const asset = getAsset(asset_id)
        const address = asset.address
        const password = state.view.password
        const private_key_encrypted = asset.private_key
        const private_key = BTC.unlock(
            address,
            private_key_encrypted,
            password
        )
        if (private_key) {
            const isEncrypted = state.view.encrypted
            const formats = getAllFormats(private_key)
            let private_key1 = private_key
            let private_key2 = formats.compressed ? formats.private_key : formats.private_key_comp
            if ( isEncrypted ) {
                private_key1 = encryptBIP38(private_key1, password)
                private_key2 = encryptBIP38(private_key2, password)
            }
            const qrs = [
                {
                    img: generateQRCode(address),
                    hash: address,
                    title: 'Address',
                    description: 'You can share this address to receive funds.'
                },
                {
                    img: generateQRCode(
                        private_key1,
                        undefined,
                        isEncrypted?'black':styles.color.red3
                    ),
                    hash: private_key1,
                    red: !isEncrypted,
                    title: 'Private Key',
                    description:
                        'This CAN NOT BE SHARED. If you share this you will lose your funds. ' + (isEncrypted?'Encrypted (BIP38)':'Unencrypted (WIF)')
                },
                {
                    title: `Address ${formats.compressed
                        ? 'uncompressed'
                        : 'compressed'}`,
                    hash: formats.compressed
                        ? formats.address
                        : formats.address_comp
                },
                {
                    title: `Private Key ${formats.compressed?'uncompressed':'compressed'} ${isEncrypted?'(BIP38)':'(WIF)'}. DO NOT SHARE THIS OR YOU WILL LOSE YOUR FUNDS`,
                    hash: private_key2,
                    red: !isEncrypted
                },
                {
                    title: `Public Key`,
                    hash: formats.public_key
                },
                {
                    title: `Public Key compressed`,
                    hash: formats.public_key_comp
                }
            ]
            // data.address_qr = generateQRCode(data.address)
            // data.address_comp_qr = generateQRCode(data.address_comp)
            // data.private_key_qr = generateQRCode(data.private_key, undefined, styles.color.red3)
            // data.private_key_comp_qr = generateQRCode(data.private_key_comp, undefined, styles.color.red3)

            printTemplate(template(qrs))
        } else state.view.invalidPassword = true
    }
    render() {
        return React.createElement(PrintBTCTemplate, {
            encrypted: state.view.encrypted,
            password: state.view.password,
            invalidPassword: state.view.invalidPassword,
            onChangeEncryption: this.onChangeEncryption,
            onChangePassword: this.onChangePassword,
            onPrint: this.onPrint
        })
    }
}

function PrintBTCTemplate({
    encrypted,
    password,
    invalidPassword,
    onChangeEncryption,
    onChangePassword,
    onPrint
}) {
    return (
        <Div padding-top="30px">
            <CenterElement>
                <form>
                    <FormField>
                        <Checkbox checked={encrypted} onChange={onChangeEncryption} label="Encrypted (BIP38)" />
                    </FormField>
                    <FormField>
                        <Input
                            width="100%"
                            value={password}
                            placeholder="Password of this Wallet"
                            onChange={onChangePassword}
                            style={{ textAlign: 'center' }}
                            type="password"
                            error={'Invalid password'}
                            invalid={invalidPassword}
                        />
                    </FormField>
                    <FormField>
                        <Button onClick={onPrint} width="100%">
                            UNLOCK AND PRINT
                        </Button>
                    </FormField>
                </form>
            </CenterElement>
        </Div>
    )
}
