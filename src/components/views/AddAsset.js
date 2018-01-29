import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver, collect } from 'dop'
import { Router, Route, Show } from '/doprouter/react'

import { generateQRCode } from '/api/qr'
import { Coins } from '/api/Coins'
import { isAddress } from '/api/Coins/ETH'
import routes from '/const/routes'
import state from '/store/state'

import styles from '/const/styles'

import IconHeader from '/components/styled/IconHeader'
import H1 from '/components/styled/H1'
import H2 from '/components/styled/H2'
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

        console.log(this.Coin)

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
    onSelectOption(e) {}

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
                    <H2>{Coin.symbol}</H2>
                </Div>
                <Div clear="both" />
            </RightHeader>
            <RightContent />
        </RightContainerPadding>
    )
}
