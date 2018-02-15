import React, { Component } from 'react'
import styled from 'styled-components'

import { Coins } from '/api/Coins'

import state from '/store/state'

export default class ReuseAsset extends Component {
    componentWillMount() {
        // this.observer = createObserver(m => this.forceUpdate())
        // this.observer.observe(state.view)
        this.Coin = Coins[state.location.path[state.location.path.length - 1]]
    }
    componentWillUnmount() {
        // this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    render() {
        return React.createElement(ReuseAssetTemplate, {
            Coin: this.Coin
        })
    }
}

function ReuseAssetTemplate({ Coin }) {
    return (
        <Options>
            <Option1>
                <Title>
                    I want to reuse the same Recovery Phrase that I am using
                    for:
                </Title>
            </Option1>
            <Option2>
                <Title>Create a new Recovery Phrase for this asset.</Title>
            </Option2>
        </Options>
    )
}

const Options = styled.div``
const Option1 = styled.div`
    float: left;
    width: 50%;
    padding: 0 20px;
    box-sizing: border-box;
`
const Option2 = styled.div`
    float: left;
    width: 50%;
    padding: 0 20px;
    box-sizing: border-box;
`

const Title = styled.div`
    font-size: 18px;
    font-weight: bold;
`
