import React from 'react'
import styled from 'styled-components'
import styles from '/const/styles'

export const Transactions = styled.div`
clear: both;
`

export const Transaction = styled.div`
clear: both;
color: ${styles.color.front3};
border-radius: 5px;
margin-bottom: 10px;
&:hover {
    background-color: ${styles.color.background1};
}
`

export const TransactionInner = styled.div`
height: 45px;
cursor: pointer;
`

export const TransactionDate = styled.div`
float: left;
font-weight: bold;
font-size: 16px;
text-align: center;
padding: 7px 20px 0 15px;
line-height: 16px;
& > div {
    font-weight: 100;
    font-size: 10px;
    line-height: 14px;
    text-transform: uppercase;
}
`

export const TransactionIco = styled.div`
float: left;
width: 27px;
height: 27px;
border-radius: 50%;
margin-top: 9px;
margin-right: 15px;
background:${props=>props.color};
line-height: 16px;
text-align: center;

& > svg {
    vertical-align: top !important;
    width: 16px;
    height: 16px;
    padding-top: 6px;
}
`
export const TransactionData = styled.div`
float: left;
width: calc(100% - 100px);
`
export const TransactionLabel = styled.div`
float: left;
line-height: 43px;
font-weight: bold;
color: ${styles.color.black};
font-size: 16px;
${styles.media.fourth} {
    float: none;
    line-height: normal;
    padding-top: 7px;
    font-size: 14px;
}        
`

export const TransactionAmount = styled.div`
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

export const TransactionDetail = styled.div`
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

export const TransactionDetailItem = styled.div`
padding-top: 15px;
display: inline-block;
width: 33%;
&:nth-child(-n + 3) {
    padding-top: 0;
}
`

export const TransactionDetailItemLabel = styled.div`color: ${styles.color.front2};`

export const TransactionDetailItemValue = styled.div``
