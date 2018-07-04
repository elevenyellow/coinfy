import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'
import { Show } from '/store/router'

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
import {
    convertBalance,
    getAsset,
    formatCurrency,
    getParamsFromLocation,
    getAddresses
} from '/store/getters'

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
    }
    componentWillUnmount() {
        this.observerPath.destroy()
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    // getInfoAsset() {
    //     const { asset_id } = getParamsFromLocation()
    //     this.asset_id = asset_id
    //     this.asset = getAsset(this.asset_id)
    //     this.Coin = Coins[this.asset.symbol] // Storing Coin api (Coin.BTC, Coin.ETH, ...)
    // }

    observeAll() {
        const { asset_id } = getParamsFromLocation()
        if (asset_id !== this.asset_id) {
            // console.log('fetch summary!!!')
            this.asset_id = asset_id
            this.asset = getAsset(this.asset_id)
            this.Coin = Coins[this.asset.symbol] // Storing Coin api (Coin.BTC, Coin.ETH, ...)
            this.observer = createObserver(mutations => {
                // console.log(this.asset.summary, mutations)
                this.forceUpdate()
            })
            this.observer.observe(this.asset.summary)
        }
    }

    refAddress(e) {
        if (e) this.addressElement = e.base
    }

    onCopy(e) {
        selectContentElement(this.addressElement)
        copyContentSelected()
    }

    onPrint(e) {
        const address = this.Coin.formatAddress(this.asset.address)
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

    rescanOrLoad() {
        const { asset_id } = getParamsFromLocation()
        const totalTxs = this.asset.summary.totalTxs || 0
        const txs = this.asset.summary.txs || []
        const index =
            totalTxs === txs.length ? 0 : this.asset.summary.txs.length
        const slice = this.asset.summary.txs.length - index

        this.asset.summary.fetching = true
        this.Coin.fetchTxs(getAddresses(asset_id), index).then(txs => {
            this.asset.summary.totalTxs = txs.totalTxs
            this.asset.summary.txs = this.asset.summary.txs
                .slice(slice)
                .concat(txs.txs)
            this.asset.summary.fetching = false
        })
    }

    render() {
        const address = this.Coin.formatAddress(this.asset.address)
        return React.createElement(SummaryTemplate, {
            symbol: this.asset.symbol,
            totalTxs: this.asset.summary.totalTxs || 0,
            txs: this.asset.summary.txs || [],
            fetchingSummary: this.asset.summary.fetching,
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
    symbol,
    totalTxs,
    txs,
    fetchingSummary,
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
                        <ListItemValue>{totalTxs}</ListItemValue>
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
            <Show if={totalTxs === 0 && !fetchingSummary}>
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
                    let value = received ? (
                        <ValuePositive>+ {tx.value}</ValuePositive>
                    ) : (
                        <ValueNegative>- {tx.value.substr(1)}</ValueNegative>
                    )
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
            {/* <Show if={totalTxs === txs.length || totalTxs > txs.length}> */}
            <Div clear="both" padding-top="20px">
                <Button
                    loading={fetchingSummary}
                    onClick={rescanOrLoad}
                    loadingIco="/static/image/loading.gif"
                    margin="0 auto"
                >
                    {totalTxs === txs.length
                        ? 'Rescan all transactions'
                        : 'Load more'}
                </Button>
            </Div>
            {/* </Show> */}
        </div>
    )
}

const ValuePositive = styled.span`
    color: #6bba39;
`
const ValueNegative = styled.span`
    color: #e34444;
`

// const ValueNegative = styled.div``

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
