import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver, collect } from 'dop'

import state from '/store/state'

import H1 from '/components/styled/H1'
import H2 from '/components/styled/H2'
import {
    RightContainerPadding,
    RightHeader,
    RightContent
} from '/components/styled/Right'
import Div from '/components/styled/Div'
import Input from '/components/styled/Input'
import Help from '/components/styled/Help'
import { Label, SubLabel } from '/components/styled/Label'
import IconHeader from '/components/styled/IconHeader'
import {
    FormField,
    FormFieldLeft,
    FormFieldRight,
    FormFieldButtons
} from '/components/styled/Form'

export default class ImportBitcoin extends Component {
    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.view)

        // Initial state
        state.view = {}

        // binding
        // this.onChangeTypeImport = this.onChangeTypeImport.bind(this)
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    render() {
        return React.createElement(ImportTemplate, {})
    }
}

function ImportTemplate({}) {
    return (
        <RightContainerPadding>
            <RightHeader>
                <IconHeader>
                    <img />
                </IconHeader>
                <Div float="left">
                    <H1>ERC20</H1>
                    <H2>Create custom ERC20 token</H2>
                </Div>
                <Div clear="both" />
            </RightHeader>
            <RightContent>
                <Div>
                    <form>
                        <FormField>
                            <FormFieldLeft>
                                <Label>Contract Address</Label>
                                {/* <SubLabel>
                                    Select the option you prefer to import.
                                </SubLabel> */}
                            </FormFieldLeft>
                            <FormFieldRight>
                                <Input
                                    width="100%"
                                    error={'address_input_error'}
                                    invalid={false}
                                />
                            </FormFieldRight>
                        </FormField>
                        <FormField>
                            <FormFieldLeft>
                                <Label>Symbol</Label>
                                <Help>
                                    Three or more letters that represent this
                                    asset. The symbol of Bitcoin is BTC.
                                </Help>
                                <SubLabel>Letters and Numbers only.</SubLabel>
                            </FormFieldLeft>
                            <FormFieldRight>
                                <Input
                                    width="60px"
                                    error={'address_input_error'}
                                    invalid={false}
                                />
                            </FormFieldRight>
                        </FormField>
                        <FormField>
                            <FormFieldLeft>
                                <Label>Name / Title</Label>
                            </FormFieldLeft>
                            <FormFieldRight>
                                <Input
                                    width="100%"
                                    error={'address_input_error'}
                                    invalid={false}
                                />
                            </FormFieldRight>
                        </FormField>
                    </form>
                </Div>
            </RightContent>
        </RightContainerPadding>
    )
}
