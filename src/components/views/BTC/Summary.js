import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'
import { Show } from '/router/components'

import styles from '/const/styles'
import { Fiats } from '/api/fiats'
import { PrivateKey as template } from '/const/paperwallets'

import { Coins } from '/api/coins'
import { round } from '/api/numbers'
import { getDay, getMonthTextShort } from '/api/time'
import { openUrl } from '/api/browser'
import { generateQRCode } from '/api/qr'
import { printTemplate } from '/api/browser'
import { selectContentElement, copyContentSelected } from '/api/browser'

import state from '/store/state'
import { fetchSummaryAsset, fetchSummaryAssetIfReady } from '/store/actions'
import { convertBalance, getAsset, formatCurrency } from '/store/getters'

import IconCopy from 'react-icons/lib/md/content-copy'
import IconPrint from 'react-icons/lib/fa/print'
import IconEmail from 'react-icons/lib/md/email'
import IconLink from 'react-icons/lib/md/insert-link'
import IconReceive from 'react-icons/lib/md/call-received'
import IconSend from 'react-icons/lib/md/send'
import Div from '/components/styled/Div'
import Button from '/components/styled/Button'
import Message from '/components/styled/Message'
import CenterElement from '/components/styled/CenterElement'
import { CircleButtons, CircleButton } from '/components/styled/CircleButton'
import QRCode from '/components/styled/QRCode'
import Address from '/components/styled/Address'
import Opacity from '/components/styled/Opacity'
import {
    Transactions,
    Transaction,
    TransactionAmount,
    TransactionData,
    TransactionDate,
    TransactionIco,
    TransactionInner,
    TransactionLabel
} from '/components/styled/Transactions'

export default class Summary extends Component {
    componentWillMount() {
        this.observerPath = createObserver(mutations => {
            this.observer.destroy()
            this.observeAll()
            this.forceUpdate()
        })
        this.observerPath.observe(state.location, 'pathname')

        this.refAddress = this.refAddress.bind(this)
        this.rescanOrLoad = this.rescanOrLoad.bind(this)
        this.onCopy = this.onCopy.bind(this)
        this.onPrint = this.onPrint.bind(this)

        this.observeAll()
        this.fetchData()
    }
    componentWillUnmount() {
        this.observerPath.destroy()
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        this.fetchData()
        return false
    }

    observeAll() {
        state.view = { fetchingTxs: false }
        const asset_id = state.location.path[1]
        const asset = getAsset(asset_id)
        this.Coin = Coins[asset.symbol] // Storing Coin api (Coin.BTC, Coin.ETH, ...)
        this.observer = createObserver(mutations => this.forceUpdate())
        this.observer.observe(asset, 'summary')
        this.observer.observe(asset.state, 'fetching_summary')
        this.observer.observe(state, 'currency')
        this.observer.observe(state.prices, asset.symbol)
        this.observer.observe(state.view, 'fetchingTxs')
    }

    refAddress(e) {
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
        printTemplate(
            template([
                {
                    title: 'Address',
                    img: generateQRCode(address),
                    hash: address,
                    description: 'Share this address to receive funds.'
                }
            ])
        )
    }

    fetchData() {
        const asset_id = state.location.path[1]
        fetchSummaryAssetIfReady(asset_id)
    }

    forceFetch() {
        const asset_id = state.location.path[1]
        fetchSummaryAsset(asset_id)
    }

    rescanOrLoad() {
        const asset_id = state.location.path[1]
        const asset = getAsset(asset_id)

        const totalTransactions = asset.summary.totalTxs || 0
        const txs = asset.summary.txs || []

        if (totalTransactions === txs.length) {
            this.forceFetch()
        } else {
            state.view.fetchingTxs = true
            this.Coin.fetchTxs(asset.address, asset.summary.txs.length).then(
                txs => {
                    asset.summary.totalTransactions = txs.totalTxs
                    asset.summary.txs = asset.summary.txs.concat(txs.txs)
                    state.view.fetchingTxs = false
                }
            )
        }
    }

    render() {
        const asset_id = state.location.path[1]
        const asset = getAsset(asset_id)
        const address = asset.address
        return React.createElement(SummaryTemplate, {
            balance_asset: asset.balance,
            balance_currency: formatCurrency(
                convertBalance(asset.symbol, asset.balance)
            ),
            symbol: asset.symbol,
            totalTransactions: asset.summary.totalTxs || 0,
            totalReceived: round(asset.summary.totalReceived || 0, 2),
            totalSent: round(asset.summary.totalSent || 0, 2),
            txs: asset.summary.txs || [],
            fetchingSummary: asset.state.fetching_summary,
            fetchingTxs: state.view.fetchingTxs,
            rescanOrLoad: this.rescanOrLoad,
            address: address,
            qrcodebase64: generateQRCode(address),
            refAddress: this.refAddress,
            colorAsset: this.Coin.color,
            urlInfo: this.Coin.urlInfo(address),
            urlInfoTx: this.Coin.urlInfoTx,
            onCopy: this.onCopy,
            onPrint: this.onPrint,
            mailTo: `mailto:?subject=My ${this.Coin.name} Address&body=My ${
                this.Coin.name
            } address is: ${address}`
        })
    }
}

function SummaryTemplate({
    balance_asset,
    balance_currency,
    symbol,
    totalTransactions,
    totalReceived,
    totalSent,
    txs,
    fetchingSummary,
    fetchingTxs,
    rescanOrLoad,
    address,
    qrcodebase64,
    refAddress,
    colorAsset,
    urlInfo,
    urlInfoTx,
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
                    <Address ref={refAddress}>{address}</Address>
                </Div>
                <Div>
                    <CenterElement>
                        <CircleButtons>
                            <CircleButton color={colorAsset} onClick={onCopy}>
                                <IconCopy size={25} color={'white'} />
                                <div class="hideOnActive">
                                    Copy to Clipboard
                                </div>
                                <div class="showOnActive">Copied!</div>
                            </CircleButton>

                            <CircleButton color={colorAsset} onClick={onPrint}>
                                <IconPrint size={25} color={'white'} />
                                <div>Print this Address</div>
                            </CircleButton>

                            <CircleButton color={colorAsset} href={mailTo}>
                                <IconEmail size={25} color={'white'} />
                                <div>Email this Address</div>
                            </CircleButton>

                            <CircleButton
                                target="_blank"
                                color={colorAsset}
                                href={urlInfo}
                            >
                                <IconLink size={25} color={'white'} />
                                <div>View on Blockchain</div>
                            </CircleButton>
                        </CircleButtons>
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
            <Show
                if={totalTransactions === 0 && !fetchingTxs && !fetchingSummary}
            >
                <Div padding-top="50px" padding-bottom="50px">
                    <Message>No transactions found for this address</Message>
                </Div>
            </Show>
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
                                onClick={e => openUrl(urlInfoTx(tx.txid))}
                            >
                                <TransactionDate>
                                    <div>{month}</div>
                                    {day}
                                </TransactionDate>
                                <TransactionIco color={colorAsset}>
                                    {icon}
                                </TransactionIco>
                                <TransactionData>
                                    <TransactionLabel>
                                        {received ? 'Received' : 'Sent'}
                                    </TransactionLabel>
                                    <TransactionAmount>
                                        {value} {symbol}
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
            {/* <Show if={totalTransactions === txs.length || totalTransactions > txs.length}> */}
            <Div clear="both" padding-top="20px">
                <Button
                    loading={fetchingTxs || fetchingSummary}
                    onClick={rescanOrLoad}
                    loadingIco="/static/image/loading.gif"
                    margin="0 auto"
                >
                    {totalTransactions === txs.length
                        ? 'Rescan all transactions'
                        : 'Load more'}
                </Button>
            </Div>
            {/* </Show> */}
        </div>
    )
}

// const Header = styled.div``

// const List = styled.div`
//     width: 165px;
//     float: right;
//     color: ${styles.color.front2};
//     padding-top: 10px;
// `

// const ListItem = styled.div`
//     font-size: 12px;
//     line-height: 22px;
//     clear: both;
// `

// const ListItemLabel = styled.div`float: left;`

// const ListItemValue = styled.div`
//     font-weight: bold;
//     float: right;
// `

// const HeaderValues = styled.div`float: left;`
// const HeaderBalance = styled.div`
//     font-size: 40px;
//     font-weight: 900;
//     text-align: left;
//     color: ${colorAsset};
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
