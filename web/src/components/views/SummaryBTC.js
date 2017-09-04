import React, { Component } from 'react'
import styled from 'styled-components'

import styles from '/const/styles'
import { BTC } from '/const/cryptos'
import { state } from '/store/state'

import IconReceive from 'react-icons/lib/md/call-received'
import IconSend from 'react-icons/lib/md/send'
import Div from '/components/styled/Div'
import Button from '/components/styled/Button'

export default class SummaryBTC extends Component {

    render() {
        return React.createElement(SummaryBTCTemplate, {
        })
    }
}

function SummaryBTCTemplate({  }) {
    return (
        <div>
            <Header>
                <HeaderLeft>
                    <HeaderLeftItem>
                        <HeaderLeftItemLabel>Transactions</HeaderLeftItemLabel>
                        <HeaderLeftItemValue>4</HeaderLeftItemValue>
                    </HeaderLeftItem>
                    <HeaderLeftItem>
                        <HeaderLeftItemLabel>Total Received</HeaderLeftItemLabel>
                        <HeaderLeftItemValue>1.12341511</HeaderLeftItemValue>
                    </HeaderLeftItem>
                    <HeaderLeftItem>
                        <HeaderLeftItemLabel>Total Sent</HeaderLeftItemLabel>
                        <HeaderLeftItemValue>0.13312124</HeaderLeftItemValue>
                    </HeaderLeftItem>
                </HeaderLeft>
                <HeaderRight>
                    <HeaderBalance>
                        <span>0.91342134</span>
                        <HeaderBalanceSymbol> BTC</HeaderBalanceSymbol>
                    </HeaderBalance>
                    <HeaderBalanceCurrency>
                        <span>$3413.3</span>
                        <HeaderBalanceSymbol> USD</HeaderBalanceSymbol>
                    </HeaderBalanceCurrency>
                </HeaderRight>
            </Header>
            <Transactions>

                <Transaction>
                    <TransactionDate><div>AUG</div>26</TransactionDate>
                    <TransactionIco>
                        <IconReceive
                            size={23}
                            color={BTC.color}
                        />
                    </TransactionIco>
                    <TransactionLabel>Received</TransactionLabel>
                    <TransactionAmount>+ 0.0134132</TransactionAmount>
                </Transaction>

                <Transaction>
                    <TransactionDate><div>AUG</div>24</TransactionDate>
                    <TransactionIco>
                        <IconSend
                            size={23}
                            color={BTC.color}
                        />
                    </TransactionIco>
                    <TransactionLabel>Sent</TransactionLabel>
                    <TransactionAmount>- 0.0134132</TransactionAmount>
                </Transaction>


                
                <Transaction>
                    <TransactionDate><div>AUG</div>26</TransactionDate>
                    <TransactionIco>
                        <IconReceive
                            size={23}
                            color={BTC.color}
                        />
                    </TransactionIco>
                    <TransactionLabel>Received</TransactionLabel>
                    <TransactionAmount>+ 0.0134132</TransactionAmount>
                </Transaction>

                <Transaction>
                    <TransactionDate><div>AUG</div>24</TransactionDate>
                    <TransactionIco>
                        <IconSend
                            size={23}
                            color={BTC.color}
                        />
                    </TransactionIco>
                    <TransactionLabel>Sent</TransactionLabel>
                    <TransactionAmount>- 0.0134132</TransactionAmount>
                </Transaction>
            
            </Transactions>
            <Div clear="both" />
        </div>
    )
}


const Header = styled.div`
`

const HeaderLeft = styled.div`
width: 165px;
float: right;
color: ${styles.color.front2};
padding-top: 10px;
`

const HeaderLeftItem = styled.div`
font-size: 12px;
line-height: 22px;
clear: both;
`

const HeaderLeftItemLabel = styled.div`
float: left;
`

const HeaderLeftItemValue = styled.div`
font-weight: bold;
float: right;
`



const HeaderRight = styled.div`
float:left;
`
const HeaderBalance = styled.div`
font-size: 40px;
font-weight: 900;
text-align: left;
color: ${BTC.color}
`
const HeaderBalanceCurrency = styled.div`
text-align: left;
font-size: 20px;
font-weight: 900;
color: ${styles.color.front3}
`


const HeaderBalanceSymbol = styled.span`
font-size: 20px;
font-weight: 100;
`




const Transactions = styled.div`
clear: both;
padding-top: 70px;
&>div {
    border-top: 1px solid ${styles.color.background4};
}
&>div:last-child {
    border-bottom: 1px solid ${styles.color.background4};
}
`

const Transaction = styled.div`
clear: both;
height: 50px;
color: ${styles.color.front3};
`

const TransactionDate = styled.div`
float: left;
font-weight: bold;
font-size: 18px;
width: 50px;
text-align: center;
padding: 5px 0;
&>div {
    font-weight: 100;
    font-size: 12px;
}
`

const TransactionIco = styled.div`
float: left;
padding: 13px 15px;
`

const TransactionLabel = styled.div`
float: left;
line-height: 50px;
font-weight:bold;
color: ${styles.color.black};
`

const TransactionAmount = styled.div`
float: right;
line-height: 50px;
font-weight:bold;
`