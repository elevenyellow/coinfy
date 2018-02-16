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
import ButtonBig from '/components/styled/ButtonBig'

export default class AddAsset extends Component {
    componentWillMount() {
        // this.observer = createObserver(m => this.forceUpdate())
        // this.observer.observe(state.view)
        this.Coin = Coins[state.location.path[state.location.path.length - 1]]
        this.reusable_seeds = getReusableSeeds(this.Coin.symbol)
        console.log(this.reusable_seeds, this.Coin.symbol)
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
            reusable_seeds: this.reusable_seeds
        })
    }
}

function AddAssetTemplate({ Coin, reusable_seeds }) {
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
                {reusable_seeds.length > 0 ? (
                    <div>
                        <Separator>
                            <Line />
                            <Or>OR</Or>
                        </Separator>

                        <Options>
                            <Option1>
                                <div>
                                    <OptionNumber>01</OptionNumber>
                                    <OptionTitle>
                                        Reuse the same Recovery Phrase that I am
                                        using for
                                    </OptionTitle>
                                </div>
                                <OptionContent>
                                    <ButtonBig>Reuse</ButtonBig>
                                </OptionContent>
                            </Option1>
                            <Option2>
                                <div>
                                    <OptionNumber>02</OptionNumber>
                                    <OptionTitle>
                                        Create a new Recovery Phrase for this
                                        asset
                                    </OptionTitle>
                                </div>
                                <OptionContent>
                                    <ButtonBig>New</ButtonBig>
                                </OptionContent>
                            </Option2>
                        </Options>
                    </div>
                ) : (
                    <NewAsset />
                )}
            </RightContent>
        </RightContainerPadding>
    )
}

const Separator = styled.div`
    position: absolute;
    height: calc(100% - 180px);
    width: calc(100% - 80px);
    pointer-events: none;
`
const Line = styled.div`
    width: 4px;
    height: 100%;
    margin: 0 auto;
    background: #f5f6f4;
`
const Or = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    background: white;
    font-size: 30px;
    font-weight: 100;
    color: #d7dbd5;
    width: 40px;
`

const Options = styled.div``
const Option1 = styled.div`
    float: left;
    width: 50%;
    padding: 0 40px 0 40px;
    box-sizing: border-box;
`
const Option2 = styled.div`
    float: left;
    width: 50%;
    padding: 0 40px 0 40px;
    box-sizing: border-box;
`

const OptionNumber = styled.div`
    float: left;
    font-weight: bold;
    font-size: 50px;
    line-height: 38px;
    padding-right: 10px;
    color: #d7dbd5;
`
const OptionTitle = styled.div`
    font-size: 18px;
    font-weight: bold;
    height: 48px;
    line-height: 20px;
    color: #596167;
`

const OptionContent = styled.div`
    padding-top: 30px;
`
