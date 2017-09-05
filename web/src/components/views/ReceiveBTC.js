import React, { Component } from 'react'
import styled from 'styled-components'

import { generateQRCode } from '/api/qr'

import styles from '/const/styles'
import { BTC } from '/const/cryptos'

import { state } from '/store/state'
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
    render() {
        const address = state.location.path[1]
        return React.createElement(ReceiveBTCTemplate, {
            address: address,
            qrcodebase64: generateQRCode(address)
        })
    }
}

function ReceiveBTCTemplate({ address, qrcodebase64 }) {
    return (
        <div>
            <Div padding-bottom="15px">
                <QRCode>
                    <img width="150" src={qrcodebase64} />
                </QRCode>
            </Div>
            <Div padding-bottom="20px">
                <CenterElement>
                    <Address>
                        {address}
                    </Address>
                </CenterElement>
            </Div>
            <Div>
                <CenterElement>
                    <Icons>
                            <Icon>
                                <IconCopy
                                    size={30}
                                    color={'white'}
                                />
                                <div>Copy to Clipboard</div>
                            </Icon>

                            <Icon>
                                <IconPrint
                                    size={30}
                                    color={'white'}
                                />
                                <div>Print this Address</div>
                            </Icon>

                            <Icon>
                                <IconEmail
                                    size={30}
                                    color={'white'}
                                />
                                <div>Email this Address</div>
                            </Icon>

                            <Icon>
                                <IconLink
                                    size={30}
                                    color={'white'}
                                />
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
    height: 115px;
    & > div {
        float: left;
        margin-right: 28px;
    }
    & > div:last-child {
        margin-right: 0;
    }
`

const Icon = styled.div`
    cursor: pointer;
    width: 60px;
    height: 60px;
    border: 4px solid ${BTC.color};
    box-shadow: 0 0 0px 1px #fff inset;
    background: ${BTC.color};
    border-radius: 50%;
    text-align: center;
    line-height: 55px;
    transition: 0.5s ease all;
    & > div  {
        display: none;
        font-size: 12px;
        line-height: 15px;
        padding-top: 15px;
        color: ${styles.color.front2};
    }
    &:hover {
        transition: 0.5s ease all;
        background-color: ${styles.color.front2};
        border-color: ${styles.color.front2};
        box-shadow: 0 0 0px 100px rgba(255,255,255,0) inset;
    }
    &:active {
        transition: 0s;
        box-shadow: 0 0 0px 1px #fff inset;
        
    }
    &:hover > div  {
        display:block
    }
`
