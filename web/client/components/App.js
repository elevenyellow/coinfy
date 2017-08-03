import React, { Component } from 'react'
import styled from 'styled-components'


// import { register, createObserver } from 'dop'
// import cipher from 'browserify-cipher'
// import bignumber from 'bignumber.js'
// import bitcoin from 'bitcoinjs-lib'
// import QRCode from 'qrcode.react'


import IconMore from 'react-icons/lib/md/more-vert'
import IconDashboard from 'react-icons/lib/md/dashboard'
import Div from '/components/reusable/Div'



export default function App() {
    return (
        <Background>
                <Header>
                    <HeaderContent>
                        <HeaderLeft>Logo</HeaderLeft>
                        <HeaderCenter>
                            <HeaderCrypto>BTC / <strong>$2521.3</strong></HeaderCrypto>
                            <HeaderCrypto>ETH / <strong>$152.3</strong></HeaderCrypto>
                            <HeaderCrypto>LTC / <strong>$42.5</strong></HeaderCrypto>
                        </HeaderCenter>
                        <HeaderRight>
                            <DropDown>
                                <Div onClick={()=>alert(1)}>
                                <HeaderCurrencySelected>USD</HeaderCurrencySelected>
                                <Arrow />
                                </Div>
                                <DropDownMenu visible={true} right="0" top="25px">
                                    <DropDownItem>USD</DropDownItem>
                                    <DropDownItem>EUR</DropDownItem>
                                </DropDownMenu>
                            </DropDown>
                            
                        </HeaderRight>
                    </HeaderContent> 
                </Header>
                <Columns>
                    <ColumnLeft>
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
                                <WalletIcon>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 32 32"><g fill="none" fillRule="evenodd"><circle cx="16" cy="16" r="16" fill="#FFB119"></circle><path fill="#FFF" d="M21.78 15.37c.51-.61.83-1.4.83-2.26 0-2.74-1.6-4.38-4.24-4.38V5.45c0-.12-.1-.22-.22-.22h-1.27c-.11 0-.2.1-.2.21v3.3h-1.7V5.44c0-.12-.1-.22-.22-.22H13.5c-.12 0-.2.1-.21.21v3.3H9.67c-.12 0-.21.09-.21.21v1.31c0 .12.1.22.21.22h.21c.94 0 1.7.79 1.7 1.75v7c0 .92-.68 1.67-1.55 1.75a.21.21 0 0 0-.18.16l-.33 1.32c-.01.06 0 .13.04.19.04.05.1.08.17.08h3.55v3.3c0 .1.1.2.2.2h1.28c.12 0 .21-.1.21-.22v-3.28h1.7v3.3c0 .1.1.2.21.2h1.27c.12 0 .22-.1.22-.22v-3.28h.85c2.65 0 4.24-1.64 4.24-4.37 0-1.28-.68-2.39-1.68-3zm-6.8-4.01h2.54c.94 0 1.7.78 1.7 1.75 0 .96-.76 1.75-1.7 1.75h-2.55v-3.5zm3.39 8.75h-3.4v-3.5h3.4c.93 0 1.7.78 1.7 1.75 0 .96-.77 1.75-1.7 1.75z"></path></g></svg>
                                </WalletIcon>
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
                    </ColumnLeft>
                    <ColumnRight>
                            <ColumnRightHeader>
                                <ColumnRightHeaderInner>
                                    <Div float="left">
                                        <H1>Add wallet</H1>
                                        <H2>Create bitcoin wallet</H2>
                                    </Div>
                                    <Div clear="both" />
                                </ColumnRightHeaderInner>
                            </ColumnRightHeader>
                            <ColumnRightContent>
                                <ColumnRightContentMenu>

                                    <ColumnRightContentMenuItem>
                                        <ColumnRightContentMenuItemIcon><IconDashboard size={20} color={styles.color.front4} /></ColumnRightContentMenuItemIcon>
                                        <ColumnRightContentMenuItemText>Import Bitcoin</ColumnRightContentMenuItemText>
                                    </ColumnRightContentMenuItem>

                                    <ColumnRightContentMenuItem selected={true}>
                                        <ColumnRightContentMenuItemIcon><IconDashboard size={20} color={styles.color.front4} /></ColumnRightContentMenuItemIcon>
                                        <ColumnRightContentMenuItemText>Create Bitcoin</ColumnRightContentMenuItemText>
                                    </ColumnRightContentMenuItem>

                                    <ColumnRightContentMenuItem>
                                        <ColumnRightContentMenuItemIcon><IconDashboard size={20} color={styles.color.front4} /></ColumnRightContentMenuItemIcon>
                                        <ColumnRightContentMenuItemText>Import Ethereum</ColumnRightContentMenuItemText>
                                    </ColumnRightContentMenuItem>

                                </ColumnRightContentMenu>
                                <ColumnRightContentContent>
                                    <p>A</p><p>A</p><p>A</p><p>A</p><p>A</p><p>A</p><p>A</p><p>A</p><p>A</p><p>A</p><p>A</p><p>A</p><p>A</p><p>A</p><p>A</p><p>A</p><p>A</p><p>A</p><p>A</p><p>A</p><p>A</p><p>A</p><p>A</p><p>A</p><p>A</p><p>A</p><p>A</p><p>A</p><p>A</p><p>A</p><p>A</p><p>A</p><p>A</p><p>End</p>
                                </ColumnRightContentContent>
                            </ColumnRightContent>
                    </ColumnRight>
                </Columns>
                <Footer></Footer>
        </Background>
    )
}

const styles = {
    paddingOut: '50px',
    leftColumn: '240px',
    columnSeparation: '20px',
    headerHeight: '75px',
    color: {
        background1: '#f3f6f8',
        background2: '#546f9b',
        background3: '#4e92df',
        background4: '#e5e9eb',
        front1: '#8b9bae',
        front2: '#adb3bb',
        front3: '#5a6168',
        front4: '#a8b5c5',
    }
}


const Background = styled.div`
background-color:${styles.color.background1};
height:100%;
`

const Footer = styled.div`
height: ${styles.paddingOut};
padding: 0 ${styles.paddingOut};
`

const Header = styled.div`
height: ${styles.headerHeight};
padding: 0 ${styles.paddingOut};
`
const HeaderContent = styled.div`
padding-top:25px;
`
const HeaderLeft = styled.div`
width: ${styles.leftColumn};
float:left;
text-align:center;
`
const HeaderCenter = styled.div`
width: calc(100% - ${styles.leftColumn} - 100px);
float:left;
text-align: center;
`
const HeaderRight = styled.div`
width: 100px;
float: Left;
text-align: right;
position: relative;
`


const HeaderCrypto = styled.span`
font-size: 13px;
letter-spacing: .2px;
color: ${styles.color.front1};
padding-right: 25px;
font-weight:300;
`

const HeaderCurrencySelected = styled.span`
font-size: 14px;
color: ${styles.color.front1};
font-weight:bold;
padding-right:4px;
`




const Columns = styled.div`
height: calc(100% - ${styles.headerHeight} - ${styles.paddingOut});
padding: 0 ${styles.paddingOut};
`

const ColumnLeft = styled.div`
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





const ColumnRight = styled.div`
height: 100%;
width: calc(100% - ${styles.leftColumn} - ${styles.columnSeparation});
background: white;
float: right;
border-radius: 5px;
box-shadow: 0 0 3px 2px rgba(205,213,218,.4);
border: 1px solid rgba(205,213,218,.7);
`

const ColumnRightHeader = styled.div`
height: 108px;
border-bottom: 1px solid ${styles.color.background4}
`
const ColumnRightHeaderInner = styled.div`
padding: 20px 30px;
`

const ColumnRightContent = styled.div`
height: calc(100% - 108px);
`

const ColumnRightContentMenu = styled.div`
float: left;
width: 200px;
height: 100%;
border-right: 1px solid ${styles.color.background4};
overflow-y: auto;

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
const ColumnRightContentMenuItem = styled.div`
clear:both;
width: calc(100% - 40px);
padding-bottom: 15px;
padding-right: 15px;
padding-left: 20px;
padding-top: 15px;
border-left: 5px solid transparent;
cursor: pointer;
&:hover {
    border-left-color: ${styles.color.background2};
}

${props=>{
    if (props.selected) {
        return `
        cursor: inherit;
        background: ${styles.color.background1};
        border-left-color: ${styles.color.background2};
        box-shadow: 0 1px 2px -1px rgba(0,0,0,.4) inset;
        `
    }
}}
`
const ColumnRightContentMenuItemIcon = styled.div`
float:left;
`
const ColumnRightContentMenuItemText = styled.div`
color: ${styles.color.front3};
font-weight: 800;
font-size: 14px;
padding-left: 30px;
padding-top: 3px;
`


const ColumnRightContentContent = styled.div`
overflow-y: auto;
height: 100%;
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










// Reusables
const H1 = styled.h1`
color: ${styles.color.front3};
font-size: 35px;
font-weight: 900;
margin: 0;
`
const H2 = styled.h2`
color: ${styles.color.front2};
margin: 0;
font-size: 16px;
font-weight: 300;
letter-spacing: 0.5px;
`




const Button = styled.button`
border: 0;
background-color: ${styles.color.background2};
color: white;
font-weight: bold;
height: 40px;
width: 100%;
border-radius: 5px;
font-size: 15px;
letter-spacing: -0.2px;
cursor: pointer;
outline: none;
&:hover {
    background-color: ${styles.color.background3};
}
`


const Arrow = styled.span`
display: inline-block;
vertical-align: middle;
border-left: 6px solid transparent;
border-right: 6px solid transparent;
border-top: 7px solid ${styles.color.front1};
margin-top: -2px;
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

const DropDown = styled.div`
position: relative;
`

const DropDownMenu = styled.div`
position: absolute;
background: white;
box-shadow: 0 1px 5px 0 rgba(0,0,0,0.25);
border-radius: 3px;
display:${props=>props.visible?'block':'none'};
left:${props=>props.left};
right:${props=>props.right};
top:${props=>props.top};
`

const DropDownItem = styled.div`
padding: 10px 20px;
font-size: 13px;
color: ${styles.color.front2};
border-top: 1px solid ${styles.color.background4};
width: 90px;
text-align: left;
&:first-child {
    border-top: 0
}
`