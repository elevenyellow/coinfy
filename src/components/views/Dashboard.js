import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'
import CountUp from 'react-countup'

import styles from '/const/styles'
import { Fiats } from '/api/fiats'
import routes from '/router/routes'

import { round, bigNumber } from '/api/numbers'
import { Coins } from '/api/coins'
import { sortBy } from '/api/arrays'

import state from '/store/state'
import { convertBalance, formatCurrency, getPrice } from '/store/getters'
import { setHref } from '/store/actions'

import { RightContainerPadding } from '/components/styled/Right'

import Circle from '/components/styled/Circle'

// development mode
// window.state = state

export default class Dashboard extends Component {
    componentWillMount() {
        this.observer = createObserver(mutations => this.forceUpdate())
        this.observer.observe(state, 'balance')
        this.observer.observe(state.prices)
        this.balance_start = state.balance
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    onClick(asset_id) {
        setHref(routes.asset({ asset_id: asset_id }))
    }

    render() {
        const byCategory = true // false means by total balance
        const dataUnformated = {}
        for (let id in state.assets) {
            let asset = state.assets[id]
            let Coin = Coins[asset.symbol]
            if (dataUnformated[asset.symbol] === undefined)
                dataUnformated[asset.symbol] = {
                    symbol: asset.symbol,
                    label: Coin.name,
                    color: Coin.color,
                    balance_asset_big: bigNumber(0),
                    balance_asset_number: 0,
                    balance_currency_number: 0,
                    assets: []
                }

            let assetUnformated = dataUnformated[asset.symbol]
            let balance = asset.balance || 0
            assetUnformated.balance_asset_number += balance
            assetUnformated.balance_asset_big = assetUnformated.balance_asset_big.plus(
                balance
            )
            assetUnformated.balance_currency_number += convertBalance(
                asset.symbol,
                balance
            )

            assetUnformated.assets.push({
                label: asset.label || asset.address,
                address: asset.address,
                balance_asset: balance + ' ' + asset.symbol,
                balance_currency_number: convertBalance(asset.symbol, balance),
                percentage: 0,
                id: id,
                logo: Coin.logo
            })
        }

        // Ordering
        let data = Object.keys(dataUnformated).map(symbol => {
            let category = dataUnformated[symbol]

            category.balance_asset =
                category.balance_asset_big.toString() + ' ' + symbol

            category.balance_currency = formatCurrency(
                category.balance_currency_number
            )

            category.percentage = round(
                category.balance_currency_number * 100 / state.balance || 0
            )

            category.assets = category.assets.map(asset => {
                asset.balance_currency = formatCurrency(
                    asset.balance_currency_number
                )
                asset.percentage = round(
                    asset.balance_currency_number *
                        100 /
                        (byCategory
                            ? category.balance_currency_number
                            : state.balance) || 0
                )
                return asset
            })

            category.assets = sortBy(
                category.assets,
                '-balance_currency_number'
            )

            return category
        })

        data = sortBy(data, '-balance_currency_number')

        const balance_start = this.balance_start
        this.balance_start = state.balance

        return React.createElement(DashboardTemplate, {
            data: data,
            onClick: this.onClick,
            ascii: Fiats[state.fiat].ascii,
            balance_start: balance_start,
            balance_end: state.balance,
            currency: state.fiat
        })
    }
}

function DashboardTemplate({
    data,
    onClick,
    ascii,
    balance_start,
    balance_end,
    cryptoPrices,
    currency
}) {
    return (
        <RightContainerPadding>
            <Left>
                <Chart>
                    <ChartBalance>
                        <ChartLabel>Total balance</ChartLabel>
                        <ChartNumber>
                            <AmountSuper>{ascii}</AmountSuper>
                            <Amount>
                                <CountUp
                                    start={balance_start}
                                    end={balance_end}
                                    duration={5}
                                    useEasing={true}
                                    useGrouping={true}
                                    separator=","
                                />
                            </Amount>
                            {/* <AmountSuper>.52</AmountSuper>  */}
                        </ChartNumber>
                    </ChartBalance>
                    <ChartChart>
                        <Circle
                            size={200}
                            strokeWidth="1.5"
                            segments={
                                /* [{percentage:70,color:'red'},{percentage:30,color:'blue'}] */
                                data.map(category => ({
                                    percentage: category.percentage,
                                    color: category.color
                                }))
                            }
                        />
                    </ChartChart>
                </Chart>
                <CurrenciesStyled>
                    {data.map(coin => (
                        <Currency>
                            <CurrencyIco>
                                <img
                                    src={Coins[coin.symbol].logo}
                                    width="25"
                                    height="25"
                                />
                            </CurrencyIco>
                            <CurrencyText>
                                <CurrencyLabel>
                                    {Coins[coin.symbol].name}
                                </CurrencyLabel>
                                <CurrencyValue>
                                    {coin.symbol} ≈{' '}
                                    <span>
                                        {Fiats[currency].format(
                                            getPrice(coin.symbol),
                                            Coins[coin.symbol].price_decimals
                                        )}
                                    </span>
                                </CurrencyValue>
                            </CurrencyText>
                        </Currency>
                    ))}
                </CurrenciesStyled>
            </Left>
            <Right>
                <div>
                    {data.map(category => {
                        return (
                            <Category>
                                <HeaderAsset>
                                    <HeaderLeft>
                                        <HeaderLeftPercentage>
                                            <Circle
                                                size={43}
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
                                                {category.assets.length === 1
                                                    ? `${
                                                          category.assets.length
                                                      } asset`
                                                    : `${
                                                          category.assets.length
                                                      } assets`}
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
                                        <Asset
                                            onClick={() => onClick(asset.id)}
                                        >
                                            <AssetIcon>
                                                <img
                                                    src={asset.logo}
                                                    width="20"
                                                    height="20"
                                                />
                                            </AssetIcon>
                                            <AssetText>
                                                <AssetLeft>
                                                    <AssetLabel>
                                                        {asset.label}
                                                    </AssetLabel>
                                                    <AssetAddress>
                                                        {asset.address}
                                                    </AssetAddress>
                                                </AssetLeft>
                                                <AssetRight>
                                                    <AssetBalanceCurrency>
                                                        {asset.balance_currency}
                                                    </AssetBalanceCurrency>
                                                    <AssetBalance>
                                                        {asset.balance_asset}
                                                    </AssetBalance>
                                                </AssetRight>
                                                <AssetPercentage>
                                                    <AssetPercentageLeft
                                                        percentage={
                                                            asset.percentage
                                                        }
                                                        color={category.color}
                                                    />
                                                    <AssetPercentageRight
                                                        color={category.color}
                                                    >
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
                </div>
            </Right>
        </RightContainerPadding>
    )
}

const Left = styled.div`
    float: left;
    width: 200px;
    position: relative;
    ${styles.media.fourth} {
        width: 100%;
        float: none;
        height: 150px;
    }
`
const Right = styled.div`
    float: left;
    width: calc(100% - 230px);
    padding-left: 30px;
    padding-top: 5px;
    ${styles.media.fourth} {
        width: 100%;
        float: none;
        padding-left: 0;
        clear: both;
    }
`

const Chart = styled.div`
    width: 200px;
    ${styles.media.fourth} {
        margin: 0 auto;
    }
`
const ChartChart = styled.div``

const ChartBalance = styled.div`
    position: absolute;
    text-align: center;
    width: 200px;
    padding-top: 75px;
`

const ChartLabel = styled.div`
    font-size: 12px;
    color: ${styles.color.front2};
`

const ChartNumber = styled.div`
    line-height: 35px;
`

const AmountSuper = styled.span`
    position: relative;
    top: -10px;
    font-size: 20px;
    font-weight: bold;
    color: ${styles.color.black};
`
const Amount = styled.span`
    font-size: 36px;
    font-weight: bold;
    color: ${styles.color.black};
`

const Category = styled.div`
    clear: both;
    margin-top: 75px;
    &:first-child {
        margin-top: 0;
    }
`

const HeaderAsset = styled.div`
    min-height: 50px;
    ${styles.media.fourth} {
        display: none;
    }
`

const HeaderLeft = styled.div``
const HeaderLeftPercentage = styled.div`
    float: left;
    ${styles.media.third} {
        & > svg {
            width: 30px;
            height: 30px;
        }
    }
`
const HeaderLeftText = styled.div`
    float: left;
    padding-top: 3px;
    padding-left: 18px;
    ${styles.media.third} {
        padding-left: 10px;
        padding-top: 0;
    }
`
const HeaderLeftTitle = styled.div`
    color: ${styles.color.black};
    font-weight: 900;
    font-size: 25px;
    line-height: 25px;
    ${styles.media.third} {
        font-size: 22px;
        line-height: 22px;
    }
`
const HeaderLeftSubtitle = styled.div`
    color: ${styles.color.grey1};
    font-size: 13px;
    font-weight: 100;
    letter-spacing: 0.5px;
    ${styles.media.third} {
        display: none;
    }
`

const HeaderRight = styled.div`
    float: right;
    padding-top: 3px;
    ${styles.media.third} {
        float: none;
        clear: both;
        top: -15px;
        position: relative;
    }
`

const HeaderRightTitle = styled.div`
    color: ${styles.color.black};
    font-weight: 900;
    font-size: 20px;
    line-height: 25px;
    text-align: right;
    ${styles.media.third} {
        padding-left: 40px;
        text-align: left;
        font-size: 15px;
        line-height: 22px;
    }
`

const HeaderRightSubtitle = styled.div`
    color: ${styles.color.grey1};
    font-size: 13px;
    font-weight: bold;
    text-align: right;
    ${styles.media.third} {
        padding-left: 40px;
        text-align: left;
    }
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

const AssetsList = styled.div`
    clear: both;
`
const Asset = styled.div`
    clear: both;
    margin-top: 25px;
    margin-bottom: 35px;
    margin-left: 23px;
    height: 55px;
    cursor: pointer;
    border-radius: 1px;
    &:hover {
        background-color: ${styles.color.background1};
        box-shadow: 0 0 0px 15px ${styles.color.background1};
    }
    ${styles.media.third} {
        height: 120px;
        margin-left: 10px;
    }
    ${styles.media.fourth} {
        height: auto;
        margin-left: 0;
        margin-top: 80px;
    }
`
const AssetIcon = styled.div`
    padding-top: 5px;
    padding-right: 5px;
    text-align: right;
    float: left;
`
const AssetText = styled.div`
    margin-left: 38px;
    ${styles.media.third} {
        margin-left: 31px;
    }
`

const AssetLeft = styled.div`
    float: left;
    width: 60%;
    ${styles.media.third} {
        width: 100%;
    }
`
const AssetRight = styled.div`
    float: right;
    text-align: right;
    ${styles.media.third} {
        clear: both;
        text-align: left;
        float: none;
    }
    ${styles.media.fourth} {
        clear: none;
    }
`

const AssetLabel = styled.div`
    color: ${styles.color.front3};
    font-weight: bold;
    font-size: 16px;
    text-overflow: ellipsis;
    overflow: hidden;
`
const AssetBalanceCurrency = styled.div`
    color: ${styles.color.front3};
    font-weight: bold;
    font-size: 16px;
    ${styles.media.third} {
        color: #aaaaaa;
        line-height: 20px;
        letter-spacing: 0.5px;
        font-weight: bold;
        font-size: 12px;
        color: ${styles.color.grey1};
    }
`
const AssetAddress = styled.div`
    padding-top: 3px;
    color: ${styles.color.grey1};
    letter-spacing: 0.5px;
    font-weight: 100;
    font-size: 12px;
    clear: both;
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 20px;
    ${styles.media.third} {
        padding-top: 0;
    }
    ${styles.media.fourth} {
        display: none;
    }
`
const AssetBalance = styled.div`
    padding-top: 3px;
    color: ${styles.color.grey1};
    letter-spacing: 0.5px;
    font-weight: 100;
    font-size: 12px;
    clear: both;
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 20px;
    ${styles.media.third} {
        padding-top: 0;
    }
`

const AssetPercentage = styled.div`
    padding-top: 3px;
    clear: both;
    ${styles.media.third} {
        padding-top: 0;
    }
`
const AssetPercentageLeft = styled.div`
    width: calc(${props => props.percentage + '%'} - 30px);
    background-color: ${props => props.color};
    height: 4px;
    border-radius: 100px;
    float: left;
    margin-top: 5px;
    margin-right: ${props => (props.percentage > 0 ? '5px' : 0)};
`
const AssetPercentageRight = styled.span`
    float: left;
    font-size: 10px;
    font-weight: bold;
    color: ${props => props.color};
`

const CurrenciesStyled = styled.div`
    width: 200px;
    margin: 0 auto;
    ${styles.media.fourth} {
        display: none;
    }
`
const Currency = styled.div`
    clear: both;
    padding-top: 30px;
    padding-left: 35px;
    height: 42px;
    ${styles.media.third} {
        padding-top: 20px;
    }
`
const CurrencyIco = styled.div`
    float: left;
    padding-top: 5px;
    padding-right: 10px;
`
const CurrencyText = styled.div`
    float: left;
`
const CurrencyLabel = styled.div`
    font-weight: 900;
    color: ${styles.color.black};
    font-size: 18px;
    width: 130px;
`
const CurrencyValue = styled.div`
    color: ${styles.color.front3};
    font-size: 13px;
    font-weight: 200;
    & span {
        font-weight: bold;
    }
`
