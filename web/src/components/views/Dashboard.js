import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'

import styles from '/const/styles'
import { currencies } from '/const/currencies'
import routes from '/const/routes'

import { round } from '/api/numbers'
import { Assets } from '/api/Assets'
import sortBy from '/api/sortBy'

import state from '/store/state'
import { convertBalance } from '/store/getters'
import { setHref } from '/store/actions'

import Circle from '/components/styled/Circle'

// development mode
// window.state = state

export default class Dashboard extends Component {
    componentWillMount() {
        this.observer = createObserver(mutations => this.forceUpdate())
        this.observer.observe(state, 'balance')
    }
    componentWillUnmount() {
        // this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    onClick(asset_id) {
        setHref(routes.asset(asset_id))
    }

    render() {
        const byCategory = true // false means by total balance
        const dataUnformated = {}
        for (let id in state.assets) {
            let asset = state.assets[id]
            if (dataUnformated[asset.symbol] === undefined)
                dataUnformated[asset.symbol] = {
                    label: Assets[asset.symbol].name,
                    color: Assets[asset.symbol].color,
                    balance_asset_number: 0,
                    balance_currency_number: 0,
                    assets: []
                }

            let assetUnformated = dataUnformated[asset.symbol]
            assetUnformated.balance_asset_number += asset.balance
            assetUnformated.balance_currency_number += convertBalance(
                asset.symbol,
                asset.balance
            )
            assetUnformated.assets.push({
                label: asset.label || asset.address,
                address: asset.address,
                balance_asset: asset.balance + ' ' + asset.symbol,
                balance_currency_number: convertBalance(asset.symbol, asset.balance),
                percentage: 0,
                id: id,
                icon: `/static/image/${asset.symbol}.svg`
            })
        }

        // Ordering
        let data = Object.keys(dataUnformated).map(symbol => {
            let category = dataUnformated[symbol]
            category.balance_asset =
                category.balance_asset_number + ' ' + symbol
            category.balance_currency = currencies[state.currency].format(
                category.balance_currency_number,
                0
            )
            category.percentage = round(
                category.balance_currency_number * 100 / state.balance
            )

            category.assets = category.assets.map(asset => {
                asset.balance_currency = currencies[state.currency].format(
                    asset.balance_currency_number,
                    0
                )
                asset.percentage = round(
                    asset.balance_currency_number *
                        100 /
                        (byCategory
                            ? category.balance_currency_number
                            : state.balance)
                )
                return asset
            })

            category.assets = sortBy(category.assets, '-balance_currency_number')

            return category
        })

        data = sortBy(data, '-balance_currency_number')

        return React.createElement(DashboardTemplate, {
            data: data,
            onClick: this.onClick
        })
    }
}

function DashboardTemplate({ data, onClick }) {
    return (
        <Container>
            <div>
                <Left />
                <Right>
                    {data.map(category => {
                        return (
                            <Category>
                                <HeaderAsset>
                                    <HeaderLeft>
                                        <HeaderLeftPercentage>
                                            <Circle
                                                size={50}
                                                strokeWidth="2.5"
                                                segments={[
                                                    {
                                                        percentage:
                                                            category.percentage,
                                                        color: category.color
                                                    }
                                                ]}
                                            >
                                                <CircleText>
                                                    <text
                                                        x="50%"
                                                        y="50%"
                                                        class="chart-number"
                                                    >
                                                        {category.percentage}%
                                                    </text>
                                                </CircleText>
                                            </Circle>
                                        </HeaderLeftPercentage>
                                        <HeaderLeftText>
                                            <HeaderLeftTitle>
                                                {category.label}
                                            </HeaderLeftTitle>
                                            <HeaderLeftSubtitle>
                                                {category.assets.length} assets
                                            </HeaderLeftSubtitle>
                                        </HeaderLeftText>
                                    </HeaderLeft>
                                    <HeaderRight>
                                        <HeaderRightTitle>
                                            {category.balance_currency}
                                        </HeaderRightTitle>
                                        <HeaderRightSubtitle>
                                            {category.balance_asset}
                                        </HeaderRightSubtitle>
                                    </HeaderRight>
                                </HeaderAsset>
                                <AssetsList>
                                    {category.assets.map(asset => (
                                        <Asset onClick={()=>onClick(asset.id)}>
                                            <AssetIcon>
                                                <img
                                                    src={asset.icon}
                                                    width="20"
                                                    height="20"
                                                />
                                            </AssetIcon>
                                            <AssetText>
                                                <AssetLeft>
                                                    <AssetTitle>
                                                        {asset.label}
                                                    </AssetTitle>
                                                    <AssetSubtitle>
                                                        {asset.address}
                                                    </AssetSubtitle>
                                                </AssetLeft>
                                                <AssetRight>
                                                    <AssetTitle>
                                                        {asset.balance_currency}
                                                    </AssetTitle>
                                                    <AssetSubtitle>
                                                        {asset.balance_asset}
                                                    </AssetSubtitle>
                                                </AssetRight>
                                                <AssetPercentage>
                                                    <AssetPercentageLeft
                                                        width={
                                                            asset.percentage +
                                                            '%'
                                                        }
                                                        color="#feb034"
                                                    />
                                                    <AssetPercentageRight color="#feb034">
                                                        {asset.percentage + '%'}
                                                    </AssetPercentageRight>
                                                </AssetPercentage>
                                            </AssetText>
                                        </Asset>
                                    ))}
                                </AssetsList>
                            </Category>
                        )
                    })}

                    {/* <Category>
                        <HeaderAsset>
                            <HeaderLeft>
                                <HeaderLeftPercentage>
                                    <Circle size={50} strokeWidth="2.5" segments={[{percentage:10, color:'#7683c9'}]}>
                                        <CircleText>
                                            <text x="50%" y="50%" class="chart-number">10%</text>
                                        </CircleText>
                                    </Circle>
                                </HeaderLeftPercentage>
                                <HeaderLeftText>
                                    <HeaderLeftTitle>Ethereum</HeaderLeftTitle>
                                    <HeaderLeftSubtitle>1 assets</HeaderLeftSubtitle>
                                </HeaderLeftText>
                            </HeaderLeft>
                            <HeaderRight>
                                <HeaderRightTitle>$30,131</HeaderRightTitle>
                                <HeaderRightSubtitle>10.313 ETH</HeaderRightSubtitle>
                            </HeaderRight>
                        </HeaderAsset>
                        <Assets>
                            <Asset>
                                <AssetIcon><img src="/static/image/ETH.svg" width="20" height="20" /></AssetIcon>
                                <AssetText>
                                    <AssetLeft>
                                        <AssetTitle>My wallet 1</AssetTitle>
                                        <AssetSubtitle>1FA4aEo21ZxTXs1YEFhKD5gpPzNSQ45hQg</AssetSubtitle>
                                    </AssetLeft>
                                    <AssetRight>
                                        <AssetTitle>$20,312</AssetTitle>
                                        <AssetSubtitle>5.013 BTC</AssetSubtitle>
                                    </AssetRight>
                                    <AssetPercentage>
                                        <AssetPercentageLeft width="10%" color="#7683c9" />
                                        <AssetPercentageRight color="#7683c9">10%</AssetPercentageRight>
                                    </AssetPercentage>
                                </AssetText>
                            </Asset>
                        </Assets>
                    </Category> */}
                </Right>
            </div>
        </Container>
    )
}

const Container = styled.div`
    height: 100%;
    overflow-y: auto;
    & > div {
        padding: ${styles.paddingContent};
    }
`
const Left = styled.div``
const Right = styled.div``

const Category = styled.div`
    clear: both;
    margin-top: 75px;
    &:first-child {
        margin-top: 0;
    }
`

const HeaderAsset = styled.div`height: 50px;`

const HeaderLeft = styled.div``
const HeaderLeftPercentage = styled.div`float: left;`
const HeaderLeftText = styled.div`
    float: left;
    padding-top: 3px;
    padding-left: 10px;
`
const HeaderLeftTitle = styled.div`
    color: ${styles.color.black};
    font-weight: 900;
    font-size: 25px;
    line-height: 25px;
`
const HeaderLeftSubtitle = styled.div`
    color: ${styles.color.grey1};
    font-size: 13px;
    font-weight: 100;
    letter-spacing: 0.5px;
`

const HeaderRight = styled.div`
    float: right;
    padding-top: 3px;
`

const HeaderRightTitle = styled.div`
    color: ${styles.color.black};
    font-weight: 900;
    font-size: 20px;
    line-height: 25px;
    text-align: right;
`

const HeaderRightSubtitle = styled.div`
    color: ${styles.color.grey1};
    font-size: 13px;
    font-weight: bold;
    text-align: right;
`

const CircleText = styled.g`
    -moz-transform: translateY(0.45em);
    -ms-transform: translateY(0.45em);
    -webkit-transform: translateY(0.45em);
    transform: translateY(0.45em);

    .chart-number {
        fill: ${styles.color.front3};
        letter-spacing: -0.02em;
        font-size: 0.7em;
        font-weight: bold;
        line-height: 1;
        text-anchor: middle;
        -moz-transform: translateY(-0.25em);
        -ms-transform: translateY(-0.25em);
        -webkit-transform: translateY(-0.25em);
        transform: translateY(-0.25em);
    }
`

const AssetsList = styled.div`clear: both;`
const Asset = styled.div`
    clear: both;
    margin-top: 25px;
    margin-left: 25px;
    height: 55px;
    cursor: pointer;
    &:hover {
        background-color: ${styles.color.background1};
        border-radius: 0.1px;
        box-shadow: 0 0 0px 10px ${styles.color.background1};
    }
`
const AssetIcon = styled.div`
    padding-top: 5px;
    padding-right: 5px;
    text-align: right;
    float: left;
`
const AssetText = styled.div`margin-left: 38px;`

const AssetLeft = styled.div`float: left;`
const AssetRight = styled.div`
    float: right;
    text-align: right;
`

const AssetTitle = styled.div`
    color: ${styles.color.front3};
    font-weight: bold;
    font-size: 16px;
`
const AssetSubtitle = styled.div`
    padding-top: 3px;
    color: ${styles.color.grey1};
    letter-spacing: 0.5px;
    font-weight: 100;
    font-size: 12px;
    clear: both;
`
const AssetPercentage = styled.div`
    padding-top: 3px;
    clear: both;
`
const AssetPercentageLeft = styled.div`
    width: calc(${props => props.width} - 30px);
    background-color: ${props => props.color};
    height: 4px;
    border-radius: 100px;
    float: left;
    margin-top: 5px;
`
const AssetPercentageRight = styled.span`
    float: left;
    font-size: 10px;
    font-weight: bold;
    color: ${props => props.color};
    margin-left: 5px;
`
