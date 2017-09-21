import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'

import styles from '/const/styles'
import { currencies } from '/const/currencies'
import { BTC } from '/api/Assets'
import state from '/store/state'
import { fetchSummaryAssetIfReady } from '/store/actions'
import { convertBalance, getAsset } from '/store/getters'
import { getDay, getMonthTextShort } from '/api/time'

import IconReceive from 'react-icons/lib/md/call-received'
import IconSend from 'react-icons/lib/md/send'
import Div from '/components/styled/Div'
import Button from '/components/styled/Button'

export default class SummaryBTC extends Component {
    componentWillMount() {
        let unobserveData
        let asset_id = state.location.path[1]
        let asset = getAsset(asset_id)

        this.observer = createObserver(mutations => {
            if (mutations[0].prop === 'pathname') {
                asset_id = state.location.path[1]
                asset = getAsset(asset_id)
                unobserveData()
                unobserveData = this.observer.observe(asset, 'summary')
            }
            this.forceUpdate()
        })
        unobserveData = this.observer.observe(asset, 'summary')
        this.observer.observe(state.location, 'pathname')
        this.observer.observe(state, 'currency')
        this.observer.observe(state.prices, BTC.symbol)

        this.fetchData()
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        this.fetchData()
        return false
    }

    fetchData() {
        const asset_id = state.location.path[1]
        fetchSummaryAssetIfReady(asset_id)
    }

    render() {
        const asset_id = state.location.path[1]
        const asset = getAsset(asset_id)
        return React.createElement(SummaryBTCTemplate, {
            balance_asset: asset.balance,
            balance_currency: currencies[state.currency].format(
                convertBalance(BTC.symbol, asset.balance),
                0
            ),
            symbol: currencies[state.currency].symbol,
            totalTransactions: asset.summary.totalTxs || 0,
            totalReceived: asset.summary.totalReceived || 0,
            totalSent: asset.summary.totalSent || 0,
            txs: asset.summary.txs || []
        })
    }
}

function SummaryBTCTemplate({
    balance_asset,
    balance_currency,
    symbol,
    totalTransactions,
    totalReceived,
    totalSent,
    txs
}) {
    return (
        <div>
            <Header>
                <HeaderValues>
                    <HeaderBalance>
                        <span>{balance_asset}</span>
                        <HeaderBalanceSymbol> BTC</HeaderBalanceSymbol>
                    </HeaderBalance>
                    <HeaderBalanceCurrency>
                        <span>{balance_currency}</span>
                        <HeaderBalanceSymbol> {symbol}</HeaderBalanceSymbol>
                    </HeaderBalanceCurrency>
                </HeaderValues>

                <List>
                    <ListItem>
                        <ListItemLabel>Transactions</ListItemLabel>
                        <ListItemValue>{totalTransactions}</ListItemValue>
                    </ListItem>
                    <ListItem>
                        <ListItemLabel>Total Received</ListItemLabel>
                        <ListItemValue>{totalReceived}</ListItemValue>
                    </ListItem>
                    <ListItem>
                        <ListItemLabel>Total Sent</ListItemLabel>
                        <ListItemValue>{totalSent}</ListItemValue>
                    </ListItem>
                </List>
            </Header>
            <Transactions>
                {txs.map(tx => {
                    let month = getMonthTextShort(tx.time)
                    let day = getDay(tx.time)
                    let received = Number(tx.value.toString()) > 0
                    let icon = received ? (
                        <IconReceive size={23} color={BTC.color} />
                    ) : (
                        <IconSend size={23} color={BTC.color} />
                    )
                    let value = received
                        ? `+ ${tx.value.toString()}`
                        : `- ${tx.value.toString().substr(1)}`
                    return (
                        <Transaction>
                            <TransactionInner onClick={e => {}}>
                                <TransactionDate>
                                    <div>{month}</div>
                                    {day}
                                </TransactionDate>
                                <TransactionIco>
                                    <IconReceive size={23} color={BTC.color} />
                                </TransactionIco>
                                <TransactionLabel>
                                    {received ? 'Received' : 'Sent'}
                                </TransactionLabel>
                                <TransactionAmount>
                                    {value} {BTC.symbol}
                                </TransactionAmount>
                            </TransactionInner>
                            {/* <TransactionDetail>
                                <div>
                                    <TransactionDetailItem>
                                        <TransactionDetailItemLabel>
                                            Date
                                        </TransactionDetailItemLabel>
                                        <TransactionDetailItemValue>
                                            7/13/2017 3:44 PM
                                        </TransactionDetailItemValue>
                                    </TransactionDetailItem>
                                    <TransactionDetailItem>
                                        <TransactionDetailItemLabel>
                                            Now
                                        </TransactionDetailItemLabel>
                                        <TransactionDetailItemValue>
                                            $23.13
                                        </TransactionDetailItemValue>
                                    </TransactionDetailItem>
                                    <TransactionDetailItem>
                                        <TransactionDetailItemLabel>
                                            Transaction ID
                                        </TransactionDetailItemLabel>
                                        <TransactionDetailItemValue>
                                            <a
                                                href="https://live.blockcypher.com/btc/tx/71d5d58ad403e928c1b7ec1a47d3355dae0d54770d7bdb18c43b8634cb84fb5d/"
                                                target="_blank"
                                            >
                                                71d5d58ad403e928c1b7ec1a47d3355dae0d54770d7bdb18c43b8634cb84fb5d
                                            </a>
                                        </TransactionDetailItemValue>
                                    </TransactionDetailItem>
                                </div>
                            </TransactionDetail> */}
                        </Transaction>
                    )
                })}
            </Transactions>
            <Div clear="both" />
        </div>
    )
}

const Header = styled.div``

const List = styled.div`
    width: 165px;
    float: right;
    color: ${styles.color.front2};
    padding-top: 10px;
`

const ListItem = styled.div`
    font-size: 12px;
    line-height: 22px;
    clear: both;
`

const ListItemLabel = styled.div`float: left;`

const ListItemValue = styled.div`
    font-weight: bold;
    float: right;
`

const HeaderValues = styled.div`float: left;`
const HeaderBalance = styled.div`
    font-size: 40px;
    font-weight: 900;
    text-align: left;
    color: ${BTC.color};
`
const HeaderBalanceCurrency = styled.div`
    text-align: left;
    font-size: 20px;
    font-weight: 900;
    color: ${styles.color.front3};
`

const HeaderBalanceSymbol = styled.span`
    font-size: 20px;
    font-weight: 100;
`

const Transactions = styled.div`
    clear: both;
    padding-top: 70px;
    & > div {
        border-top: 1px solid ${styles.color.background4};
    }
    & > div:last-child {
        border-bottom: 1px solid ${styles.color.background4};
    }
`

const Transaction = styled.div`
    clear: both;
    color: ${styles.color.front3};
`

const TransactionInner = styled.div`
    height: 50px;
    cursor: pointer;
`

const TransactionDate = styled.div`
    float: left;
    font-weight: bold;
    font-size: 18px;
    width: 50px;
    text-align: center;
    padding: 5px 0;
    & > div {
        font-weight: 100;
        font-size: 12px;
        text-transform: uppercase;
    }
`

const TransactionIco = styled.div`
    float: left;
    padding: 13px 17px 13px 10px;
`

const TransactionLabel = styled.div`
    float: left;
    line-height: 50px;
    font-weight: bold;
    color: ${styles.color.black};
`

const TransactionAmount = styled.div`
    float: right;
    line-height: 50px;
    font-weight: bold;
`

const TransactionDetail = styled.div`
    clear: both;
    font-size: 11px;
    overflow: hidden;
    height: ${props => (props.visible ? '45px' : 0)};
    -webkit-transition: 0.25s ease all;
    transition: 0.25s ease all;
    & > div {
        padding: 0 0 15px 102px;
    }
`

const TransactionDetailItem = styled.div`
    padding-top: 15px;
    display: inline-block;
    width: 33%;
    &:nth-child(-n + 3) {
        padding-top: 0;
    }
`

const TransactionDetailItemLabel = styled.div`color: ${styles.color.front2};`

const TransactionDetailItemValue = styled.div``
