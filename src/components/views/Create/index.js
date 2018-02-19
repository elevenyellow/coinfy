import React, { Component } from 'react'
import styled from 'styled-components'

import styles from '/const/styles'

import { Coins } from '/api/Coins'

import state from '/store/state'
import { getReusableSeeds, getLabelOrAddress } from '/store/getters'

import {
    RightContainerPadding,
    RightHeader,
    RightContent
} from '/components/styled/Right'
import H1 from '/components/styled/H1'
import H2 from '/components/styled/H2'
import Div from '/components/styled/Div'
import ButtonBig from '/components/styled/ButtonBig'
import Input from '/components/styled/Input'
import IconHeader from '/components/styled/IconHeader'
import AssetItem from '/components/styled/AssetItem'
import SelectDropdown from '/components/styled/SelectDropdown'

import NewAsset from '/components/views/Create/new'

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
                                    {reusable_seeds.map(group => (
                                        <ReusableGroup>
                                            <Assets>
                                                {group.map(asset => (
                                                    <Asset>
                                                        <AssetItem
                                                            logo={`/static/image/coins/${
                                                                asset.symbol
                                                            }.svg`}
                                                            label={getLabelOrAddress(
                                                                asset
                                                            )}
                                                            balance={Coins[
                                                                asset.symbol
                                                            ].format(
                                                                asset.balance,
                                                                5
                                                            )}
                                                        />
                                                        {/* <AssetPassword>
                                                            <Input
                                                                width="100%"
                                                                placeholder="Password of this asset"
                                                                type="password"
                                                            />
                                                        </AssetPassword> */}
                                                    </Asset>
                                                ))}
                                            </Assets>
                                            <Button>Reuse</Button>
                                        </ReusableGroup>
                                    ))}
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
                                    <br />
                                    <br />
                                    <SelectDropdown>
                                        <option selected={true}>A</option>
                                        <option>B</option>
                                    </SelectDropdown>
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
    background: ${styles.color.grey2};
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
    color: ${styles.color.grey3};
    width: 40px;
`

const Options = styled.div``
const Option1 = styled.div`
    float: left;
    width: 50%;
    padding-right: 60px;
    box-sizing: border-box;
`
const Option2 = styled.div`
    float: left;
    width: 50%;
    padding-left: 60px;
    box-sizing: border-box;
`

const OptionNumber = styled.div`
    float: left;
    font-size: 50px;
    line-height: 38px;
    padding-right: 10px;
    color: ${styles.color.grey2};
`
const OptionTitle = styled.div`
    font-size: 18px;
    font-weight: bold;
    height: 48px;
    line-height: 20px;
    color: ${styles.color.grey3};
    letter-spacing: 0.3px;
`

const OptionContent = styled.div`
    padding-top: 30px;
`

const ReusableGroup = styled.div`
    cursor: pointer;
    margin-bottom: 30px;
    &:hover > div {
        border-color: ${styles.color.background3};
    }
    &:hover > button {
        background-color: ${styles.color.background3};
    }

    &:hover > div > div {
        opacity: 0.9;
    }
`

const Assets = styled.div`
    border: 4px solid ${styles.color.background2};
    border-radius: 5px;
    padding: 20px;
`

const Asset = styled.div`
    position: relative;
    clear: both;
    margin-bottom: 15px;
    height: 40px;
    overflow: hidden;
    &:last-child {
        margin-bottom: 0;
    }
    & > * {
        position: absolute;
        height: 50px;
        top: 0;
        width: 100%;
    }
`
// const AssetPassword = styled.div``

const Button = styled.button`
    position: relative;
    top: -7px;
    border: 0;
    background-color: ${styles.color.background2};
    color: white;
    font-weight: bold;
    height: 40px;
    width: 100%;
    border-radius: 0 0 4px 4px;
    font-size: 15px;
    letter-spacing: -0.2px;
    outline: none;
    pointer-events: none;
`
