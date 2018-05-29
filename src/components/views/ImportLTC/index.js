import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver, collect } from 'dop'

import { generateQRCode } from '/api/qr'
import { logo } from '/api/coins/LTC'
import { routes, Router, Route, Show } from '/store/router'
import state from '/store/state'

import styles from '/const/styles'

import H1 from '/components/styled/H1'
import H2 from '/components/styled/H2'
import {
    RightContainerPadding,
    RightHeader,
    RightContent
} from '/components/styled/Right'
import Div from '/components/styled/Div'
import QRCode from '/components/styled/QRCode'
import Address from '/components/styled/Address'
import Select from '/components/styled/Select'
import { Label, SubLabel } from '/components/styled/Label'
import CenterElement from '/components/styled/CenterElement'
import IconHeader from '/components/styled/IconHeader'
import {
    FormField,
    FormFieldLeft,
    FormFieldRight,
    FormFieldButtons
} from '/components/styled/Form'
import ImportSeed from '/components/views/ImportBTC/ImportSeed'
import ImportAddress from '/components/views/ImportBTC/ImportAddress'
import ImportPrivate from '/components/views/ImportBTC/ImportPrivate'
import ImportBIP from '/components/views/ImportBTC/ImportBIP'

const TYPES_IMPORT = {
    seed: 'seed',
    address: 'address',
    private: 'private',
    bip38: 'bip38'
}

export default class ImportLitecoin extends Component {
    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.view)

        // Initial state
        state.view = {
            type_import: TYPES_IMPORT.seed
        }

        // binding
        this.onChangeTypeImport = this.onChangeTypeImport.bind(this)
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
        state.view.type_import = e.target.value
        collector.emit()
    }

    render() {
        return React.createElement(ImportTemplate, {
            type_import: state.view.type_import,
            onChangeTypeImport: this.onChangeTypeImport
        })
    }
}

function ImportTemplate({ type_import, onChangeTypeImport }) {
    return (
        <RightContainerPadding>
            <RightHeader>
                <IconHeader>
                    <img src={logo} />
                </IconHeader>
                <Div float="left">
                    <H1>Litecoin</H1>
                    <H2>Import wallet</H2>
                </Div>
                <Div clear="both" />
            </RightHeader>
            <RightContent>
                <Div>
                    <form>
                        <FormField>
                            <FormFieldLeft>
                                <Label>I have my</Label>
                                <SubLabel>
                                    Select the option you prefer to import.
                                </SubLabel>
                            </FormFieldLeft>
                            <FormFieldRight>
                                <Select
                                    width="100%"
                                    onChange={onChangeTypeImport}
                                >
                                    <option
                                        value={TYPES_IMPORT.seed}
                                        selected={
                                            type_import === TYPES_IMPORT.seed
                                        }
                                    >
                                        Recovery Phrase (12 words)
                                    </option>
                                    <option
                                        value={TYPES_IMPORT.address}
                                        selected={
                                            type_import === TYPES_IMPORT.address
                                        }
                                    >
                                        Address
                                    </option>

                                    <option
                                        value={TYPES_IMPORT.private}
                                        selected={
                                            type_import === TYPES_IMPORT.private
                                        }
                                    >
                                        Private key unencrypted (WIF)
                                    </option>
                                    <option
                                        value={TYPES_IMPORT.bip38}
                                        selected={
                                            type_import === TYPES_IMPORT.bip38
                                        }
                                    >
                                        Private key encrypted (BIP38)
                                    </option>
                                </Select>
                            </FormFieldRight>
                        </FormField>

                        <Router>
                            <Route if={type_import === TYPES_IMPORT.seed}>
                                <ImportSeed />
                            </Route>
                            <Route if={type_import === TYPES_IMPORT.address}>
                                <ImportAddress />
                            </Route>
                            <Route if={type_import === TYPES_IMPORT.private}>
                                <ImportPrivate />
                            </Route>
                            <Route if={type_import === TYPES_IMPORT.bip38}>
                                <ImportBIP />
                            </Route>
                        </Router>

                        <Div clear="both" />
                    </form>
                </Div>
            </RightContent>
        </RightContainerPadding>
    )
}
