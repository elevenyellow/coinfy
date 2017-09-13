import React, { Component } from 'react'
import styled from 'styled-components'

import { generateQRCode } from '/api/qr'
import { printTemplate } from '/api/print'

import styles from '/const/styles'
import { BTC } from '/api/assets'
import { Address as template } from '/const/paperwallets'

import state from '/store/state'
import { deleteWallet } from '/store/actions'

import Div from '/components/styled/Div'
import QRCode from '/components/styled/QRCode'
import Address from '/components/styled/Address'
import Opacity from '/components/styled/Opacity'

import IconCopy from 'react-icons/lib/md/content-copy'
import IconPrint from 'react-icons/lib/fa/print'
import IconEmail from 'react-icons/lib/md/email'
import IconLink from 'react-icons/lib/md/insert-link'

export default class ReceiveBTC extends Component {
    constructor(props) {
        super(props)

        this.refaddress = this.refaddress.bind(this)
        this.onCopy = this.onCopy.bind(this)
        this.onPrint = this.onPrint.bind(this)
    }

    refaddress(e) {
        if (e) this.addressElement = e.base
    }

    onCopy(e) {
        const node = this.addressElement
        const range = document.createRange()
        range.selectNodeContents(node)
        window.getSelection().removeAllRanges()
        window.getSelection().addRange(range)
        document.execCommand('copy')
    }

    onPrint(e) {
        const address = state.location.path[1]
        const data = { address: address, address_qr: generateQRCode(address) }
        printTemplate(template, data)
    }

    // onEmail(e) {
    //     const address = state.location.path[1]
    //     const a = document.createElement('a')
    //     a.href = `mailto:?subject=My Bitcoin Address&body=My Bitcoin address is: ${address}`
    //     a.click()
    // }
    // onView(e) {
    //     const address = state.location.path[1]
    //     const a = document.createElement('a')
    //     a.href = infoAddressBTC(address)
    //     a.target = '_blank'
    //     console.log( a, a.href );
    //     a.click()
    // }
        

    render() {
        const address = state.location.path[1]
        return React.createElement(ReceiveBTCTemplate, {
            address: address,
            qrcodebase64: generateQRCode(address),
            refaddress: this.refaddress,
            onCopy: this.onCopy,
            onPrint: this.onPrint,
            mailTo: `mailto:?subject=My Bitcoin Address&body=My Bitcoin address is: ${address}`
        })
    }
}

function ReceiveBTCTemplate({ address, qrcodebase64, refaddress, onCopy, onPrint, mailTo }) {
    return (
        <div>
            <Div padding-bottom="15px">
                <QRCode>
                    <img width="150" src={qrcodebase64} />
                </QRCode>
            </Div>
            <Div padding-bottom="20px">
                <CenterElement>
                    <Address ref={refaddress}>
                        {address}
                    </Address>
                </CenterElement>
            </Div>
            <Div>
                <CenterElement>
                    <Icons>
                        <Icon onClick={onCopy}>
                            <IconCopy size={25} color={'white'} />
                            <div class="hideOnActive">Copy to Clipboard</div>
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

                        <Icon target="_blank" href={`https://live.blockcypher.com/btc/address/${address}/`}>
                            <IconLink size={25} color={'white'} />
                            <div>View on Blockchain</div>
                        </Icon>
                    </Icons>
                </CenterElement>
            </Div>
        </div>
    )
}

const CenterElement = styled.div`
    margin: 0 auto;
    width: 360px;
`

const Icons = styled.div`
    height: 100px;
    & > * {
        float: left;
        margin-right: 42px;
    }
    & > *:last-child {
        margin-right: 0;
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
