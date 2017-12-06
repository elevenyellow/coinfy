// import React, { Component } from 'react'
// import styled from 'styled-components'
// import { createObserver } from 'dop'
// import { Show } from '/doprouter/react'

// import styles from '/const/styles'
// import { Fiats } from '/api/Fiats'
// import { round } from '/api/numbers'
// import state from '/store/state'
// import { fetchSummaryAsset, fetchSummaryAssetIfReady } from '/store/actions'
// import { convertBalance, getAsset } from '/store/getters'

// import { ETH } from '/api/Coins'
// import { getDay, getMonthTextShort } from '/api/time'
// import { openUrl } from '/api/browser'
// import { generateQRCode } from '/api/qr'
// import { printTemplate } from '/api/browser'

// import IconReceive from 'react-icons/lib/md/call-received'
// import IconSend from 'react-icons/lib/md/send'
// import Div from '/components/styled/Div'
// import Button from '/components/styled/Button'
// import Message from '/components/styled/Message'
// import CenterElement from '/components/styled/CenterElement'
// import QRCode from '/components/styled/QRCode'
// import Address from '/components/styled/Address'
// import Opacity from '/components/styled/Opacity'
// import { CircleButtons, CircleButton } from '/components/styled/CircleButton'
// import {
//     Transactions,
//     Transaction,
//     TransactionAmount,
//     TransactionData,
//     TransactionDate,
//     TransactionIco,
//     TransactionInner,
//     TransactionLabel
// } from '/components/styled/Transactions'

// import { selectContentElement, copyContentSelected } from '/api/browser'
// import { PrivateKey as template } from '/const/paperwallets'

// import IconCopy from 'react-icons/lib/md/content-copy'
// import IconPrint from 'react-icons/lib/fa/print'
// import IconEmail from 'react-icons/lib/md/email'
// import IconLink from 'react-icons/lib/md/insert-link'

// export default class SummaryETH extends Component {
//     componentWillMount() {
//         let unobserveSummary
//         let unobserveFetching
//         let asset_id = state.location.path[1]
//         let asset = getAsset(asset_id)

//         state.view = { fetchingTxs: false }

//         this.observer = createObserver(mutations => {
//             if (mutations[0].prop === 'pathname') {
//                 asset_id = state.location.path[1]
//                 asset = getAsset(asset_id)
//                 unobserveSummary()
//                 unobserveFetching()
//                 unobserveSummary = this.observer.observe(asset, 'summary')
//                 unobserveFetching = this.observer.observe(
//                     asset.state,
//                     'fetching_summary'
//                 )
//             }
//             this.forceUpdate()
//         })
//         unobserveSummary = this.observer.observe(asset, 'summary')
//         unobserveFetching = this.observer.observe(
//             asset.state,
//             'fetching_summary'
//         )
//         this.observer.observe(state.location, 'pathname')
//         this.observer.observe(state, 'currency')
//         this.observer.observe(state.prices, ETH.symbol)
//         this.observer.observe(state.view, 'fetchingTxs')

//         this.refaddress = this.refaddress.bind(this)
//         this.onCopy = this.onCopy.bind(this)
//         this.onPrint = this.onPrint.bind(this)
//         this.rescanOrLoad = this.rescanOrLoad.bind(this)

//         this.fetchData()
//     }
//     componentWillUnmount() {
//         this.observer.destroy()
//     }
//     shouldComponentUpdate() {
//         this.fetchData()
//         return false
//     }

//     refaddress(e) {
//         if (e) this.addressElement = e.base
//     }

//     onCopy(e) {
//         selectContentElement(this.addressElement)
//         copyContentSelected()
//     }

//     onPrint(e) {
//         const asset_id = state.location.path[1]
//         const asset = getAsset(asset_id)
//         const address = asset.address
//         printTemplate(
//             template([
//                 {
//                     title: 'Address',
//                     img: generateQRCode(address),
//                     hash: address,
//                     description: 'Share this address to receive funds.'
//                 }
//             ])
//         )
//     }

//     fetchData() {
//         const asset_id = state.location.path[1]
//         fetchSummaryAssetIfReady(asset_id)
//     }

//     forceFetch() {
//         const asset_id = state.location.path[1]
//         fetchSummaryAsset(asset_id)
//     }

//     rescanOrLoad() {
//         const asset_id = state.location.path[1]
//         const asset = getAsset(asset_id)

//         const totalTransactions = asset.summary.totalTxs || 0
//         const txs = asset.summary.txs || []

//         if (totalTransactions === txs.length) {
//             this.forceFetch()
//         } else {
//             state.view.fetchingTxs = true
//             ETH.fetchTxs(asset.address, asset.summary.txs.length).then(txs => {
//                 asset.summary.totalTransactions = txs.totalTxs
//                 asset.summary.txs = asset.summary.txs.concat(txs.txs)
//                 state.view.fetchingTxs = false
//             })
//         }
//     }

//     render() {
//         const asset_id = state.location.path[1]
//         const asset = getAsset(asset_id)
//         const address = asset.address
//         return React.createElement(SummaryETHTemplate, {
//             balance_asset: asset.balance,
//             balance_currency: formatCurrency(
//                 convertBalance(ETH.symbol, asset.balance),
//                 0
//             ),
//             symbol: Fiats[state.fiat].symbol,
//             totalTransactions: asset.summary.totalTxs || 0,
//             totalReceived: round(asset.summary.totalReceived || 0, 2),
//             totalSent: round(asset.summary.totalSent || 0, 2),
//             txs: asset.summary.txs || [],
//             fetchingSummary: asset.state.fetching_summary,
//             fetchingTxs: state.view.fetchingTxs,
//             rescanOrLoad: this.rescanOrLoad,
//             address: address,
//             qrcodebase64: generateQRCode(address),
//             refaddress: this.refaddress,
//             onCopy: this.onCopy,
//             onPrint: this.onPrint,
//             mailTo: `mailto:?subject=My Ethereum Address&body=My Ethereum address is: ${address}`
//         })
//     }
// }

// function SummaryETHTemplate({
//     balance_asset,
//     balance_currency,
//     symbol,
//     totalTransactions,
//     totalReceived,
//     totalSent,
//     txs,
//     fetchingSummary,
//     fetchingTxs,
//     rescanOrLoad,
//     address,
//     qrcodebase64,
//     refaddress,
//     onCopy,
//     onPrint,
//     mailTo
// }) {
//     return (
//         <div>
//             <div>
//                 <Div padding-bottom="15px">
//                     <QRCode>
//                         <img width="150" src={qrcodebase64} />
//                     </QRCode>
//                 </Div>
//                 <Div padding-bottom="20px">
//                     <Address ref={refaddress}>{address}</Address>
//                 </Div>
//                 <Div>
//                     <CenterElement>
//                         <CircleButtons>
//                             <CircleButton color={ETH.color} onClick={onCopy}>
//                                 <IconCopy size={25} color={'white'} />
//                                 <div class="hideOnActive">
//                                     Copy to Clipboard
//                                 </div>
//                                 <div class="showOnActive">Copied!</div>
//                             </CircleButton>

//                             <CircleButton color={ETH.color} onClick={onPrint}>
//                                 <IconPrint size={25} color={'white'} />
//                                 <div>Print this Address</div>
//                             </CircleButton>

//                             <CircleButton color={ETH.color} href={mailTo}>
//                                 <IconEmail size={25} color={'white'} />
//                                 <div>Email this Address</div>
//                             </CircleButton>

//                             <CircleButton
//                                 target="_blank"
//                                 color={ETH.color}
//                                 href={`https://etherscan.io/address/${address}`}
//                             >
//                                 <IconLink size={25} color={'white'} />
//                                 <div>View on Blockchain</div>
//                             </CircleButton>
//                         </CircleButtons>
//                     </CenterElement>
//                 </Div>
//             </div>

//             <Show
//                 if={totalTransactions === 0 && !fetchingTxs && !fetchingSummary}
//             >
//                 <Div padding-top="50px" padding-bottom="50px">
//                     <Message>No transactions found for this address</Message>
//                 </Div>
//             </Show>

//             <Transactions>
//                 {txs.map(tx => {
//                     let month = getMonthTextShort(tx.time)
//                     let day = getDay(tx.time)
//                     let received = Number(tx.value.toString()) > 0
//                     let icon = received ? (
//                         <IconReceive size={23} color="white" />
//                     ) : (
//                         <IconSend size={23} color="white" />
//                     )
//                     let value = received
//                         ? `+ ${tx.value.toString()}`
//                         : `- ${tx.value.toString().substr(1)}`
//                     return (
//                         <Transaction>
//                             <TransactionInner
//                                 onClick={e =>
//                                     openUrl(
//                                         `https://etherscan.io/tx/${tx.txid}`
//                                     )}
//                             >
//                                 <TransactionDate>
//                                     <div>{month}</div>
//                                     {day}
//                                 </TransactionDate>
//                                 <TransactionIco color={ETH.color}>
//                                     {icon}
//                                 </TransactionIco>
//                                 <TransactionData>
//                                     <TransactionLabel>
//                                         {received ? 'Received' : 'Sent'}
//                                     </TransactionLabel>
//                                     <TransactionAmount>
//                                         {value} {ETH.symbol}
//                                     </TransactionAmount>
//                                 </TransactionData>
//                             </TransactionInner>
//                         </Transaction>
//                     )
//                 })}
//             </Transactions>
//             <Div clear="both" text-align="center" padding-top="20px">
//                 <Button
//                     loading={fetchingTxs || fetchingSummary}
//                     onClick={rescanOrLoad}
//                     loadingIco="/static/image/loading.gif"
//                 >
//                     {totalTransactions === txs.length
//                         ? 'Rescan all transactions'
//                         : 'Load more'}
//                 </Button>
//             </Div>
//         </div>
//     )
// }
