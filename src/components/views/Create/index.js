import React, { Component } from 'react'
import styled from 'styled-components'

import { Coins } from '/api/Coins'

import state from '/store/state'
import { getReusableSeeds } from '/store/getters'

import {
    RightContainerPadding,
    RightHeader,
    RightContent
} from '/components/styled/Right'
import H1 from '/components/styled/H1'
import H2 from '/components/styled/H2'
import Div from '/components/styled/Div'
import IconHeader from '/components/styled/IconHeader'
import NewAsset from '/components/views/Create/new'
import ReuseAsset from '/components/views/Create/reuse'

export default class AddAsset extends Component {
    componentWillMount() {
        // this.observer = createObserver(m => this.forceUpdate())
        // this.observer.observe(state.view)
        this.Coin = Coins[state.location.path[state.location.path.length - 1]]
        this.reusable_seeds = getReusableSeeds(this.Coin.symbol)
    }
    componentWillUnmount() {
        // this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    render() {
        return React.createElement(AddAssetTemplate, {
            Coin: this.Coin,
            canReuseSeeds: this.reusable_seeds.length > 0
        })
    }
}

function AddAssetTemplate({ canReuseSeeds, Coin }) {
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
                {canReuseSeeds ? <ReuseAsset /> : <NewAsset />}
            </RightContent>
        </RightContainerPadding>
    )
}
