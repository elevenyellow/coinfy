import React, { Component } from 'react'
import styled from 'styled-components'
import styles from '/styles'
import IconMore from 'react-icons/lib/md/more-vert'
import { DropDown, DropDownItem, DropDownMenu, DropDownArrow } from '/components/styled/Dropdown'
import Button from '/components/styled/Button'



export default function Left() {
    return (
        <LeftDiv>
            <ColumnLeftChart>
                <ColumnLeftChartBalance>
                    <ColumnLeftChartLabel>Total balance</ColumnLeftChartLabel>
                    <ColumnLeftChartNumber>
                        <AmountSuper>$</AmountSuper>
                        <Amount>22,521</Amount>
                        {/* <AmountSuper>.52</AmountSuper>  */}
                    </ColumnLeftChartNumber>
                </ColumnLeftChartBalance>
                <ColumnLeftChartChart>
                    <svg width="100%" height="200" viewBox="0 0 28 28">
                        <circle cx="14" cy="15" r="12.3" fill="transparent" stroke="#FFB119" strokeWidth="1.3"></circle>
                    </svg>
                </ColumnLeftChartChart>
            </ColumnLeftChart>
            <ColumnLeftHeader>
                <ColumnLeftHeaderLeft>
                    <DropDown>
                        <IconMore size={35} color={styles.color.front2} /> 
                        <DropDownMenu visible={false} left="7px">
                            <DropDownItem>Import</DropDownItem>
                            <DropDownItem>Export / Save</DropDownItem>
                        </DropDownMenu>
                    </DropDown>
                </ColumnLeftHeaderLeft>
                <ColumnLeftHeaderRight></ColumnLeftHeaderRight>
            </ColumnLeftHeader>
            <ColumnLeftContent>
                {[0,0,0,0,0,0,0].map((e,index)=>(
                <Wallet selected={index===1} key={index}>
                    <WalletIcon><img src="/static/image/bitcoin.svg" width="22" height="22" /></WalletIcon>
                    <WalletInfo>
                        <WalletLabel>Coinbase {index+1}</WalletLabel>
                        <WalletBalance><strong>$2351.32</strong> / 0.93123 BTC</WalletBalance>
                    </WalletInfo>
                </Wallet>
                ))}
            </ColumnLeftContent>
            <ColumnLeftFooter>
                <Button>Add wallet</Button>
            </ColumnLeftFooter>
        </LeftDiv>
    )
}




const LeftDiv = styled.div`
position: relative;
height: 100%;
width: ${styles.leftColumn};
background: white;
float: left;
border-radius: 5px;
box-shadow: 0 0 3px 2px rgba(205,213,218,.4);
border: 1px solid rgba(205,213,218,.7);
`




const ColumnLeftHeader = styled.div`
position:absolute;
top:0;
`
const ColumnLeftHeaderLeft = styled.div`
cursor: pointer;
float:left;
padding-left: 5px;
padding-top: 10px;
`
const ColumnLeftHeaderRight = styled.div`
float:right;
`

const ColumnLeftChart = styled.div`
`
const ColumnLeftChartChart = styled.div`
`

const ColumnLeftChartBalance = styled.div`
position: absolute;
text-align: center;
width: 100%;
padding-top: 80px;
`

const ColumnLeftChartLabel = styled.div`
font-size: 12px;
color: ${styles.color.front2};
`

const ColumnLeftChartNumber = styled.div`
line-height: 35px;
`



const ColumnLeftContent = styled.div`
border-top:1px solid ${styles.color.background4};
height: calc(100% - 277px);
overflow-y: auto;
position: absolute;
width: 100%;
top: 215px;
&::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
&::-webkit-scrollbar-thumb {
  background: ${styles.color.background4};
  cursor: grab;
}
&::-webkit-scrollbar-track {
  background: transparent;
}
`

const ColumnLeftFooter = styled.div`
position: absolute;
bottom: 0;
width: calc(100% - 20px);
padding: 10px;
`




const Wallet = styled.div`
padding: 15px 15px;
border-bottom:1px solid ${styles.color.background4};
color: ${styles.color.front3};
border-left: 5px solid transparent;
cursor: pointer;
&:hover {
    border-left-color: ${styles.color.background2};
}
${props=>{
    if (props.selected) {
        return `
        cursor: inherit;
        border-left-color: ${styles.color.background2};
        border-bottom: 0;
        box-shadow: 0 1px 2px -1px rgba(0,0,0,.4) inset;
        background: ${styles.color.background1}
        `
    }
}};
`
const WalletIcon = styled.div`
float:left;
padding-top:3px;
`
const WalletInfo = styled.div`
margin-left: 33px;
`
const WalletLabel = styled.div`
font-weight: bold;
font-size: 16px;
color: inherit;
line-height: 20px;
`
const WalletBalance = styled.div`
font-size: 12px;
color: ${styles.color.front2};
padding-top: 2px;
font-weight: 100;
letter-spacing: 0.5px;
`



const AmountSuper = styled.span`
position:relative;
top: -10px;
font-size: 20px;
font-weight: bold;
color: ${styles.color.front3};
`
const Amount = styled.span`
font-size: 36px;
font-weight: bold;
color: ${styles.color.front3};
`