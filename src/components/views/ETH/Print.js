import React, { Component } from 'react'
import { createObserver, collect } from 'dop'
import styled from 'styled-components'
import { Show } from '/doprouter/react'

// import { createWorker } from '/api/workers'
import { generateQRCode } from '/api/qr'
import { ETH } from '/api/Assets'
import { getAllFormats } from '/api/Assets/ETH'
import { printTemplate, downloadFile } from '/api/browser'

import state from '/store/state'
import { getAsset } from '/store/getters'

import routes from '/const/routes'
import styles from '/const/styles'

import Div from '/components/styled/Div'
import Button from '/components/styled/Button'
import Input from '/components/styled/Input'
import Select from '/components/styled/Select'
import CenterElement from '/components/styled/CenterElement'
import {
    FormField,
    FormFieldLeft,
    FormFieldRight,
    FormFieldButtons
} from '/components/styled/Form'
import { Label, SubLabel } from '/components/styled/Label'

import { PrivateKey as template } from '/const/paperwallets'

export default class PrintETH extends Component {
    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.view)

        // Initial state
        state.view = {
            loading: false,
            isPaperwallet: true,
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
        state.view.isPaperwallet = e.target.value === 'true'
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
        if (state.view.isPaperwallet) {
        // const private_key_encrypted = asset.private_key
        // const private_key = ETH.decrypt(address, private_key_encrypted, password)
        // if (private_key) {
        //         // We need to do this trick in order to show the loading-button icon
        //         const isEncrypted = state.view.isPaperwallet
        //         const formats = getAllFormats(private_key)
        //         let private_key1 = private_key
        //         let private_key2 = formats.compressed
        //             ? formats.private_key
        //             : formats.private_key_comp
        //         if (isEncrypted) {
        //             private_key1 = encryptBIP38(private_key1, password)
        //             private_key2 = encryptBIP38(private_key2, password)
        //         }
        //         const qrs = [
        //             {
        //                 img: generateQRCode(address),
        //                 hash: address,
        //                 title: 'Address',
        //                 description:
        //                     'You can share this address to receive funds.'
        //             },
        //             {
        //                 img: generateQRCode(
        //                     private_key1,
        //                     undefined,
        //                     isEncrypted ? 'black' : styles.color.red3
        //                 ),
        //                 hash: private_key1,
        //                 red: !isEncrypted,
        //                 title: 'Private Key',
        //                 description:
        //                     'This CAN NOT BE SHARED. If you share this you will lose your funds. ' +
        //                     (isEncrypted
        //                         ? 'Encrypted (BIP38)'
        //                         : 'UnisPaperwallet (WIF)')
        //             },
        //             {
        //                 title: `Address ${formats.compressed
        //                     ? 'uncompressed'
        //                     : 'compressed'}`,
        //                 hash: formats.compressed
        //                     ? formats.address
        //                     : formats.address_comp
        //             },
        //             {
        //                 title: `Private Key (${isEncrypted
        //                     ? 'Encrypted BIP38'
        //                     : 'UnisPaperwallet WIF'} ${formats.compressed
        //                     ? 'uncompressed'
        //                     : 'compressed'}). DO NOT SHARE THIS OR YOU WILL LOSE YOUR FUNDS`,
        //                 hash: private_key2,
        //                 red: !isEncrypted
        //             },
        //             {
        //                 title: `Public Key`,
        //                 hash: formats.public_key
        //             },
        //             {
        //                 title: `Public Key compressed`,
        //                 hash: formats.public_key_comp
        //             }
        //         ]
        //         // data.address_qr = generateQRCode(data.address)
        //         // data.address_comp_qr = generateQRCode(data.address_comp)
        //         // data.private_key_qr = generateQRCode(data.private_key, undefined, styles.color.red3)
        //         // data.private_key_comp_qr = generateQRCode(data.private_key_comp, undefined, styles.color.red3)
        //         printTemplate(template(qrs))
        // } else {
        //     state.view.invalidPassword = true
        // }
        }
        else {
            const fileString = JSON.stringify({
                "version": 3,
                "id": address,
                "address": address,
                "Crypto": asset.private_key 
            })
            const name = 
                'UTC--' +
                new Date().toJSON().replace(/:/g, '-') +
                '--' +
                address
            
            downloadFile(fileString, name)
        }
    }
    render() {
        return React.createElement(PrintETHTemplate, {
            isPaperwallet: state.view.isPaperwallet,
            password: state.view.password,
            invalidPassword: state.view.invalidPassword,
            onChangeEncryption: this.onChangeEncryption,
            onChangePassword: this.onChangePassword,
            onPrint: this.onPrint
        })
    }
}

function PrintETHTemplate({
    isPaperwallet,
    password,
    invalidPassword,
    onChangeEncryption,
    onChangePassword,
    onPrint
}) {
    return (
        <Div>
            <form>
                <FormField>
                    <FormFieldLeft>
                        <Label>Format</Label>
                        <SubLabel>
                            {!isPaperwallet
                                ? 'You have to remember your current password in order to import this wallet in the future.'
                                : 'You will print your private key without any encryption.'}
                        </SubLabel>
                    </FormFieldLeft>
                    <FormFieldRight>
                        <Select width="100%" onChange={onChangeEncryption}>
                            <option value="true" selected={isPaperwallet}>
                                Paper Walet
                            </option>
                            <option value="false" selected={!isPaperwallet}>
                                Keystore file (UTC / JSON)
                            </option>
                        </Select>
                    </FormFieldRight>

                </FormField>

                <Show if={isPaperwallet}>
                    <FormField>
                        <FormFieldLeft>
                            <Label>Password</Label>
                            <SubLabel>Password of this wallet.</SubLabel>
                        </FormFieldLeft>
                        <FormFieldRight>
                            <Input
                                width="100%"
                                value={password}
                                onChange={onChangePassword}
                                type="password"
                                error={'Invalid password'}
                                invalid={invalidPassword}
                            />
                        </FormFieldRight>
                    </FormField>
                </Show>


                <FormField>
                    <FormFieldButtons>
                        <Button
                            onClick={onPrint}
                        >
                            {isPaperwallet?'Unlock and Print':'Download'}
                        </Button>
                    </FormFieldButtons>
                </FormField>
            </form>
        </Div>
    )
}
