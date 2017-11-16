import React, { Component } from 'react'
import { createObserver, collect } from 'dop'
import styled from 'styled-components'
import { Show } from '/doprouter/react'

// import { createWorker } from '/api/workers'
import { generateQRCode } from '/api/qr'
import { ETH } from '/api/Assets'
import { getPublicFromPrivateKey } from '/api/Assets/ETH'
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

export default class ExportETH extends Component {
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
        this.onExport = this.onExport.bind(this)
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
    onExport(e) {
        e.preventDefault()
        const asset_id = state.location.path[1]
        const asset = getAsset(asset_id)
        const address = asset.address
        const password = state.view.password
        if (state.view.isPaperwallet) {
            const private_key_encrypted = asset.private_key
            const private_key = ETH.decrypt(
                address,
                private_key_encrypted,
                password
            )
            if (private_key) {
                const public_key = getPublicFromPrivateKey(private_key)
                const qrs = [
                    {
                        img: generateQRCode(address),
                        hash: address,
                        title: 'Address',
                        description:
                            'You can share this address to receive funds.'
                    },
                    {
                        img: generateQRCode(
                            private_key,
                            undefined,
                            styles.color.red3
                        ),
                        hash: private_key,
                        red: true,
                        title: 'Private Key',
                        description:
                            'This CAN NOT BE SHARED. If you share this you will lose your funds.'
                    },
                    {
                        title: `Public Key`,
                        hash: public_key
                    }
                ]
                printTemplate(template(qrs))
            } else {
                state.view.invalidPassword = true
            }
        } else {
            const fileString = JSON.stringify({
                version: 3,
                id: address,
                address: address,
                Crypto: asset.private_key
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
        return React.createElement(ExportETHTemplate, {
            isPaperwallet: state.view.isPaperwallet,
            password: state.view.password,
            invalidPassword: state.view.invalidPassword,
            onChangeEncryption: this.onChangeEncryption,
            onChangePassword: this.onChangePassword,
            onExport: this.onExport
        })
    }
}

function ExportETHTemplate({
    isPaperwallet,
    password,
    invalidPassword,
    onChangeEncryption,
    onChangePassword,
    onExport
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
                        <Button onClick={onExport}>
                            {isPaperwallet ? 'Unlock and Print' : 'Download'}
                        </Button>
                    </FormFieldButtons>
                </FormField>
            </form>
        </Div>
    )
}
