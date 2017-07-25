import React, { Component } from 'react'
import styled from 'styled-components'
// import { register, createObserver } from 'dop'
// import cipher from 'browserify-cipher'
// import bignumber from 'bignumber.js'
// import bitcoin from 'bitcoinjs-lib'
// import QRCode from 'qrcode.react'


export default function App() {
    return (
        <Background>
            <Container>
                <Header>
                    <HeaderContent>
                        <HeaderLeft>Logo</HeaderLeft>
                        <HeaderCenter>
                            <HeaderCrypto>BTC / <strong>$2521.3</strong></HeaderCrypto>
                            <HeaderCrypto>ETH / <strong>$152.3</strong></HeaderCrypto>
                            <HeaderCrypto>LTC / <strong>$42.5</strong></HeaderCrypto>
                        </HeaderCenter>
                        <HeaderRight onClick={()=>alert(1)}>
                            <HeaderCurrencySelected>USD</HeaderCurrencySelected>
                            <Arrow />
                        </HeaderRight>
                    </HeaderContent> 
                </Header>
                <Columns>
                    <ColumnLeft>ColumnLeft</ColumnLeft>
                    <ColumnRight>ColumnRight</ColumnRight>
                </Columns>
            </Container>
        </Background>
    )
}

const styles = {
    paddingOut: '50px',
    leftColumn: '250px',
    columnSeparation: '15px'
}


const Background = styled.div`
background-color:#f3f6f8;
height:100%;
`

const Container = styled.div`
height: calc(100% - ${styles.paddingOut});
padding: 0 ${styles.paddingOut} ${styles.paddingOut} ${styles.paddingOut};
`

const Header = styled.div`
height:75px;
`
const HeaderContent = styled.div`
padding-top:25px;
`
const HeaderLeft = styled.div`
width: ${styles.leftColumn};
float:left;
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
cursor:pointer;
`


const HeaderCrypto = styled.span`
font-size: 13px;
letter-spacing: .2px;
color: #8b9bae;
padding-right: 25px;
font-weight:300;
`

const HeaderCurrencySelected = styled.span`
font-size: 14px;
color: #8b9bae;
font-weight:bold;
padding-right:4px;
`

const Arrow = styled.span`
display: inline-block;
vertical-align: middle;
border-left: 6px solid transparent;
border-right: 6px solid transparent;
border-top: 7px solid #8b9bae;
margin-top: -2px;
`


const Columns = styled.div`
height: calc(100% - ${styles.columnSeparation} - ${styles.paddingOut});
`

const ColumnLeft = styled.div`
height: 100%;
width: ${styles.leftColumn};
background: white;
float: left;
border-radius: 3px;
box-shadow: 0 0 3px 2px rgba(205,213,218,.4);
border: 1px solid rgba(205,213,218,.7);
`

const ColumnRight = styled.div`
height: 100%;
width: calc(100% - ${styles.leftColumn} - ${styles.columnSeparation});
background: white;
float: right;
border-radius: 3px;
box-shadow: 0 0 3px 2px rgba(205,213,218,.4);
border: 1px solid rgba(205,213,218,.7);
`
