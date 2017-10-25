import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'
import { Show } from '/doprouter/react'

import styles from '/const/styles'
import { currencies } from '/const/currencies'
import { BTC } from '/api/Assets'
import { round } from '/api/numbers'
import state from '/store/state'
import { fetchSummaryAssetIfReady } from '/store/actions'
import { convertBalance, getAsset } from '/store/getters'
import { getDay, getMonthTextShort } from '/api/time'
import { openUrl } from '/api/window'

import IconReceive from 'react-icons/lib/md/call-received'
import IconSend from 'react-icons/lib/md/send'
import Div from '/components/styled/Div'
import Button from '/components/styled/Button'
import CenterElement from '/components/styled/CenterElement'

import { generateQRCode } from '/api/qr'
import { printTemplate } from '/api/window'

import { selectContentElement, copyContentSelected } from '/api/window'
import { Address as template } from '/const/paperwallets'

import { deleteAsset } from '/store/actions'

import QRCode from '/components/styled/QRCode'
import Address from '/components/styled/Address'
import Opacity from '/components/styled/Opacity'

import IconCopy from 'react-icons/lib/md/content-copy'
import IconPrint from 'react-icons/lib/fa/print'
import IconEmail from 'react-icons/lib/md/email'
import IconLink from 'react-icons/lib/md/insert-link'

export default class SummaryBTC extends Component {
    componentWillMount() {
        let unobserveData
        let asset_id = state.location.path[1]
        let asset = getAsset(asset_id)

        state.view = { fetchingMoreTxs: false }

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
        this.observer.observe(state.view, 'fetchingMoreTxs')

        this.refaddress = this.refaddress.bind(this)
        this.onCopy = this.onCopy.bind(this)
        this.onPrint = this.onPrint.bind(this)

        this.fetchData()
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        this.fetchData()
        return false
    }

    refaddress(e) {
        if (e) this.addressElement = e.base
    }

    onCopy(e) {
        selectContentElement(this.addressElement)
        copyContentSelected()
    }

    onPrint(e) {
        const asset_id = state.location.path[1]
        const asset = getAsset(asset_id)
        const address = asset.address
        const data = { address: address, address_qr: generateQRCode(address) }
        printTemplate(template, data)
    }

    fetchData() {
        const asset_id = state.location.path[1]
        fetchSummaryAssetIfReady(asset_id)
    }

    fetchMoreTransactions() {
        const asset_id = state.location.path[1]
        const asset = getAsset(asset_id)
        state.view.fetchingMoreTxs = true
        BTC.fetchTxs(asset.address, asset.summary.txs.length).then(txs => {
            asset.summary.totalTransactions = txs.totalTxs
            asset.summary.txs = asset.summary.txs.concat(txs.txs)
            state.view.fetchingMoreTxs = false
        })
    }

    render() {
        const asset_id = state.location.path[1]
        const asset = getAsset(asset_id)
        const address = asset.address
        return React.createElement(SummaryBTCTemplate, {
            balance_asset: asset.balance,
            balance_currency: currencies[state.currency].format(
                convertBalance(BTC.symbol, asset.balance),
                0
            ),
            symbol: currencies[state.currency].symbol,
            totalTransactions: asset.summary.totalTxs || 0,
            totalReceived: round(asset.summary.totalReceived || 0, 2),
            totalSent: round(asset.summary.totalSent || 0, 2),
            txs: asset.summary.txs || [],
            fetchingMoreTxs: state.view.fetchingMoreTxs,
            fetchMoreTransactions: this.fetchMoreTransactions,
            address: address,
            qrcodebase64: generateQRCode(address),
            refaddress: this.refaddress,
            onCopy: this.onCopy,
            onPrint: this.onPrint,
            mailTo: `mailto:?subject=My Bitcoin Address&body=My Bitcoin address is: ${address}`
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
    txs,
    fetchingMoreTxs,
    fetchMoreTransactions,
    address,
    qrcodebase64,
    refaddress,
    onCopy,
    onPrint,
    mailTo
}) {
    return (
        <div>
            <div>
                <Div padding-bottom="15px">
                    <QRCode>
                        <img width="150" src={qrcodebase64} />
                    </QRCode>
                </Div>
                <Div padding-bottom="20px">
                    <CenterElement>
                        <Address ref={refaddress}>{address}</Address>
                    </CenterElement>
                </Div>
                <Div>
                    <CenterElement>
                        <Icons>
                            <Icon onClick={onCopy}>
                                <IconCopy size={25} color={'white'} />
                                <div class="hideOnActive">
                                    Copy to Clipboard
                                </div>
                                <div class="showOnActive">Copied!</div>
                            </Icon>

                            <Icon onClick={onPrint}>
                                <IconPrint size={25} color={'white'} />
                                <div>Print this Address</div>
                            </Icon>

                            <Icon href={mailTo}>
                                <IconEmail size={25} color={'white'} />
                                <div>Email this Address</div>
                            </Icon>

                            <Icon
                                target="_blank"
                                href={`https://blockchain.info/address/${address}`}
                            >
                                <IconLink size={25} color={'white'} />
                                <div>View on Blockchain</div>
                            </Icon>
                        </Icons>
                    </CenterElement>
                </Div>
            </div>

            {/* 
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
            </Header> */}
            <Transactions>
                {txs.map(tx => {
                    let month = getMonthTextShort(tx.time)
                    let day = getDay(tx.time)
                    let received = Number(tx.value.toString()) > 0
                    let icon = received ? (
                        <IconReceive size={23} color="white" />
                    ) : (
                        <IconSend size={23} color="white" />
                    )
                    let value = received
                        ? `+ ${tx.value.toString()}`
                        : `- ${tx.value.toString().substr(1)}`
                    return (
                        <Transaction>
                            <TransactionInner
                                onClick={e =>
                                    openUrl(
                                        `https://blockchain.info/tx/${tx.txid}`
                                    )}
                            >
                                <TransactionDate>
                                    <div>{month}</div>
                                    {day}
                                </TransactionDate>
                                <TransactionIco color={BTC.color}>{icon}</TransactionIco>
                                <TransactionData>
                                    <TransactionLabel>
                                        {received ? 'Received' : 'Sent'}
                                    </TransactionLabel>
                                    <TransactionAmount>
                                        {value} {BTC.symbol}
                                    </TransactionAmount>
                                </TransactionData>
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
            <Show if={totalTransactions > txs.length}>
                <Div text-align="center" padding-top="20px">
                    <Button
                        loading={fetchingMoreTxs}
                        onClick={fetchMoreTransactions}
                        loadingIco="/static/image/loading.gif"
                    >
                        Load more
                    </Button>
                </Div>
            </Show>
        </div>
    )
}


const Icons = styled.div`
    height: 100px;
    & > * {
        float: left;
        margin-right: 42px;
    }
    & > *:last-child {
        margin-right: 0;
    }
    ${styles.media.fourth} {
        width: 222px;
        margin: 0 auto;
        & > * {
            margin-right: 10px;
        }
    }
`

const Icon = styled.a`
    cursor: pointer;
    display: block;
    width: 50px;
    height: 50px;
    border: 4px solid ${BTC.color};
    box-shadow: 0 0 0px 1px #fff inset;
    background: ${BTC.color};
    border-radius: 50%;
    text-align: center;
    line-height: 45px;
    transition: 0.5s ease all;
    position: relative;
    text-decoration: none;
    ${styles.media.fourth} {
        width: 40px;
        height: 40px;
        line-height: 35px;
        & > svg {
            width: 18px;
            height: 18px;
        }
    }
    & > div {
        width: 100%;
        display: none;
        font-size: 11px;
        line-height: 15px;
        padding-top: 15px;
        color: ${styles.color.front2};
    }
    &:hover {
        transition: 0.5s ease all;
        background-color: ${styles.color.front2};
        border-color: ${styles.color.front2};
        box-shadow: 0 0 0px 100px rgba(255, 255, 255, 0) inset;
    }
    &:active {
        transition: 0s;
        box-shadow: 0 0 0px 1px #fff inset;
    }
    &:hover > div {
        display: block;
    }

    & .hideOnActive {
        opacity: 1;
    }
    &:active .hideOnActive {
        opacity: 0;
        transition: 5s ease all;
    }

    & .showOnActive {
        padding-top: 5px;
        opacity: 0;
        display: none;
        color: #44bb11;
        font-size: 13px;
        transition: 3s ease all;
    }
    &:active .showOnActive {
        display: block;
        transition: unset;
        opacity: 1;
    }
`

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

// const HeaderValues = styled.div`float: left;`
// const HeaderBalance = styled.div`
//     font-size: 40px;
//     font-weight: 900;
//     text-align: left;
//     color: ${BTC.color};
// `
// const HeaderBalanceCurrency = styled.div`
//     text-align: left;
//     font-size: 20px;
//     font-weight: 900;
//     color: ${styles.color.front3};
// `

// const HeaderBalanceSymbol = styled.span`
//     font-size: 20px;
//     font-weight: 100;
// `

const Transactions = styled.div`
    clear: both;
`

const Transaction = styled.div`
    clear: both;
    color: ${styles.color.front3};
    border-radius: 5px;
    margin-bottom: 10px;
    &:hover {
        background-color: ${styles.color.background1};
    }
`

const TransactionInner = styled.div`
    height: 45px;
    cursor: pointer;
`

const TransactionDate = styled.div`
    float: left;
    font-weight: bold;
    font-size: 16px;
    text-align: center;
    padding: 5px 20px 5px 15px;
    line-height: 16px;
    & > div {
        font-weight: 100;
        font-size: 10px;
        text-transform: uppercase;
    }
`

const TransactionIco = styled.div`
    float: left;
    width: 27px;
    height: 27px;
    border-radius: 50%;
    margin-top: 9px;
    margin-right: 15px;
    background:${props=>props.color};
    & > svg {
        width: 16px;
        height: 16px;
        margin-top: 2px;
        margin-left: 5px;
    }
`
const TransactionData = styled.div`
float: left;
width: calc(100% - 100px);
`
const TransactionLabel = styled.div`
    float: left;
    line-height: 45px;
    font-weight: bold;
    color: ${styles.color.black};
    font-size: 16px;
    ${styles.media.fourth} {
        float: none;
        line-height: normal;
        padding-top: 6px;
        font-size: 14px;
    }        
`

const TransactionAmount = styled.div`
    float: right;
    line-height: 45px;
    font-weight: bold;
    padding-right: 14px;
    ${styles.media.fourth} {
        float: none;
        font-size: 10px;
        line-height: normal;
    }
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
