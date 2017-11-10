import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver, collect } from 'dop'

import { openFile } from '/api/browser'

import { setHref, createAsset } from '/store/actions'
import state from '/store/state'

import { isAddress, addHexPrefix } from '/api/Assets/ETH'
import { isAssetRegistered } from '/store/getters'
import { ETH, getAssetId } from '/api/Assets'

import styles from '/const/styles'
import routes from '/const/routes'

import Input from '/components/styled/Input'
import Button from '/components/styled/Button'
import { Label, SubLabel } from '/components/styled/Label'
import {
    FormField,
    FormFieldLeft,
    FormFieldRight,
    FormFieldButtons
} from '/components/styled/Form'

export default class ImportAddress extends Component {
    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.view)
        const collector = collect()
        state.view.keystore_invalid = false
        state.view.keystore_message = ''
        collector.destroy()
        this.onSelectFile = this.onSelectFile.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }


    
    onSelectFile(e) {
        e.preventDefault()
        openFile((dataString, file) => {
            const collector = collect()
            try {
                const keystore = JSON.parse(dataString)
                if (keystore.version === 3 && isAddress(keystore.address) && typeof keystore.Crypto == 'object') {
                    state.view.address = addHexPrefix(keystore.address)
                    state.view.keystore_invalid = false
                    state.view.keystore_message = file.name
                }
                else {
                    state.view.keystore_invalid = true
                    state.view.keystore_message = 'Invalid Keystore file'
                }
            } catch(e) {
                state.view.keystore_invalid = true
                state.view.keystore_message = 'Invalid Keystore file'
            }
            collector.emit()
        })
    }

    onSubmit(e) {
        e.preventDefault()
        const collector = collect()
        const address = state.view.address
        const asset = createAsset(ETH.type, ETH.symbol, address)
        setHref(routes.asset(getAssetId(asset)))
        // setHref(routes.home())
        collector.emit()
    }


    get isValidForm() {
        return state.view.isValidInput
    }
    
    render() {
        return React.createElement(ImportAddressTemplate, {
            keystore_message: state.view.keystore_message,
            keystore_invalid: state.view.keystore_invalid,
            isValidForm: this.isValidForm,
            onSelectFile: this.onSelectFile,
            onSubmit: this.onSubmit
        })
    }
}

function ImportAddressTemplate({
    keystore_message,
    keystore_invalid,
    isValidForm,
    onSelectFile,
    onSubmit
}) {
    return (
        <div>
            <FormField>
                <FormFieldLeft>
                    <Label>Select file</Label>
                    <SubLabel>Pick your Keystore file.</SubLabel>
                </FormFieldLeft>
                <FormFieldRight>
                    <button onClick={onSelectFile}>Open</button>
                    <MessageKeystoreFile invalid={keystore_invalid}>{keystore_message}</MessageKeystoreFile>
                </FormFieldRight>
            </FormField>

            <FormField>
                <FormFieldButtons>
                    <Button
                        width="100px"
                        disabled={!isValidForm}
                        onClick={onSubmit}
                    >
                        Import
                    </Button>
                </FormFieldButtons>
            </FormField>
        </div>
    )
}


const MessageKeystoreFile = styled.div`
font-size: 11px;
font-weight: bold;
color: ${props=>props.invalid ? styles.color.red3:styles.color.front6}
`