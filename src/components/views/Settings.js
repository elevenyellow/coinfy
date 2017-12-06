import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'
import { Router, Route } from '/doprouter/react'
import styles from '/const/styles'

import state from '/store/state'

import Div from '/components/styled/Div'
import H1 from '/components/styled/H1'
import Section from '/components/styled/Section'
import {
    RightContainerPadding,
    RightHeader,
    RightContent
} from '/components/styled/Right'

import Select from '/components/styled/Select'
import { Label, SubLabel } from '/components/styled/Label'
import CenterElement from '/components/styled/CenterElement'
import {
    FormField,
    FormFieldLeft,
    FormFieldRight,
    FormFieldButtons
} from '/components/styled/Form'

export default class Settings extends Component {
    componentWillMount() {
        // this.observer = createObserver(mutations => this.forceUpdate())
        // this.observer.observe(state.location.path, 'length')
        // this.observer.observe(state.location.path, '1')
    }

    componentWillUnmount() {
        // this.observer.destroy()
    }

    shouldComponentUpdate() {
        return false
    }

    render() {
        return React.createElement(SettingsTemplate, {})
    }
}

function SettingsTemplate({}) {
    return (
        <RightContainerPadding>
            <RightHeader>
                <Div float="left">
                    <H1>Settings</H1>
                </Div>
                <Div clear="both" />
            </RightHeader>
            <RightContent>
                <Div>
                    <Div>
                        <Section>Currencies</Section>
                    </Div>
                </Div>
                <Div>
                    <Div>
                        <Section>Session</Section>
                    </Div>
                    <FormField>
                        <FormFieldLeft>
                            <Label>Network</Label>
                            <SubLabel>
                                Being on testnet you will use Coinfy within the
                                test networks.
                            </SubLabel>
                        </FormFieldLeft>
                        <FormFieldRight>
                            <Select width="100%">
                                <option value={1} selected={true}>
                                    Mainnet
                                </option>
                                <option value={2} selected={false}>
                                    Testnet
                                </option>
                            </Select>
                        </FormFieldRight>
                    </FormField>
                </Div>
            </RightContent>
        </RightContainerPadding>
    )
}
