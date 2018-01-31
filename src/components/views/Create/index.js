import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver, collect } from 'dop'
import { Router, Route, Show } from '/doprouter/react'

import styles from '/const/styles'
import routes from '/const/routes'

import { generateQRCode } from '/api/qr'
import { Coins } from '/api/Coins'
import { isAddress } from '/api/Coins/ETH'

import state from '/store/state'
import { setHref } from '/store/actions'

import IconHeader from '/components/styled/IconHeader'
import H1 from '/components/styled/H1'
import H2 from '/components/styled/H2'
import { Wizard, WizardItem } from '/components/styled/Wizard'
import {
    RightContainerPadding,
    RightHeader,
    RightContent
} from '/components/styled/Right'
import Div from '/components/styled/Div'

export default class AddAsset extends Component {
    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.view)

        this.Coin = Coins[state.location.path[state.location.path.length - 1]]

        // binding
        this.onSelectOption = this.onSelectOption.bind(this)
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    // Actions
    onSelectOption(route) {
        setHref(route)
    }

    render() {
        return React.createElement(ImportTemplate, {
            Coin: this.Coin,
            onSelectOption: this.onSelectOption
        })
    }
}

function ImportTemplate({ Coin, onSelectOption }) {
    return (
        <RightContainerPadding>
            <RightHeader>
                <IconHeader>
                    <img src={`/static/image/coins/${Coin.symbol}.svg`} />
                </IconHeader>
                <Div float="left">
                    <H1>{Coin.name}</H1>
                    <H2>Create {Coin.symbol} asset</H2>
                </Div>
                <Div clear="both" />
            </RightHeader>
            <RightContent>
                <Wizard>
                    <WizardItem label="Select type" status="3">
                        ✓
                    </WizardItem>
                    <WizardItem label="Select type" status="2">
                        2
                    </WizardItem>
                    <WizardItem label="Configure" status="1">
                        3
                    </WizardItem>
                    <WizardItem label="Finish" status="1">
                        4
                    </WizardItem>
                </Wizard>
            </RightContent>
        </RightContainerPadding>
    )
}
