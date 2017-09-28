import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'

import styles from '/const/styles'

import state from '/store/state'

import Circle from '/components/styled/Circle'


export default class Dashboard extends Component {
    componentWillMount() {
        // this.observer = createObserver(mutations => this.forceUpdate())
        // this.observer.observe(state.location.path, 'length')
        // this.observer.observe(state.location.path, '0')
    }
    componentWillUnmount() {
        // this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    render() {
        return React.createElement(DashboardTemplate, {

        })
    }
}


function DashboardTemplate({

}) {

    return (
        <Container>
            <div>
                <Left></Left>
                <Right>
                    <Category>
                        <HeaderAsset>
                            <HeaderLeft>
                                <HeaderLeftPercentage>
                                    <Circle size={50} strokeWidth="2.5" segments={[{percentage:90, color:'#fdb033'}]}>
                                        <CircleText>
                                            <text x="50%" y="50%" class="chart-number">90%</text>
                                        </CircleText>
                                    </Circle>
                                </HeaderLeftPercentage>
                                <HeaderLeftText>
                                    <HeaderLeftTitle>Bitcoin</HeaderLeftTitle>
                                    <HeaderLeftSubtitle>4 assets</HeaderLeftSubtitle>
                                </HeaderLeftText>
                            </HeaderLeft>
                            <HeaderRight>
                                <HeaderRightTitle>$30,131</HeaderRightTitle>
                                <HeaderRightSubtitle>10.313 BTC</HeaderRightSubtitle>
                            </HeaderRight>
                        </HeaderAsset>
                        <Assets>
                            <Asset>
                                <AssetIcon><img src="/static/image/BTC.svg" width="20" height="20" /></AssetIcon>
                                <AssetText>
                                    <AssetLeft>
                                        <AssetTitle>My wallet 1</AssetTitle>
                                        <AssetSubtitle>1FA4aEo21ZxTXs1YEFhKD5gpPzNSQ45hQg</AssetSubtitle>
                                    </AssetLeft>
                                    <AssetRight>
                                        <AssetTitle>$20,312</AssetTitle>
                                        <AssetSubtitle>5.013 BTC</AssetSubtitle>
                                    </AssetRight>
                                    <AssetPercentage>
                                        <AssetPercentageLeft width="50%" color="#feb034" />
                                        <AssetPercentageRight color="#feb034">35%</AssetPercentageRight>
                                    </AssetPercentage>
                                </AssetText>
                            </Asset>
                            <Asset>
                                <AssetIcon><img src="/static/image/BTC.svg" width="20" height="20" /></AssetIcon>
                                <AssetText>
                                    <AssetLeft>
                                        <AssetTitle>My wallet 1</AssetTitle>
                                        <AssetSubtitle>1FA4aEo21ZxTXs1YEFhKD5gpPzNSQ45hQg</AssetSubtitle>
                                    </AssetLeft>
                                    <AssetRight>
                                        <AssetTitle>$20,312</AssetTitle>
                                        <AssetSubtitle>5.013 BTC</AssetSubtitle>
                                    </AssetRight>
                                    <AssetPercentage>
                                        <AssetPercentageLeft width="100%" color="#feb034" />
                                        <AssetPercentageRight color="#feb034">100%</AssetPercentageRight>
                                    </AssetPercentage>
                                </AssetText>
                            </Asset>
                        </Assets>
                    </Category>
                    <Category>
                        <HeaderAsset>
                            <HeaderLeft>
                                <HeaderLeftPercentage>
                                    <Circle size={50} strokeWidth="2.5" segments={[{percentage:10, color:'#7683c9'}]}>
                                        <CircleText>
                                            <text x="50%" y="50%" class="chart-number">10%</text>
                                        </CircleText>
                                    </Circle>
                                </HeaderLeftPercentage>
                                <HeaderLeftText>
                                    <HeaderLeftTitle>Ethereum</HeaderLeftTitle>
                                    <HeaderLeftSubtitle>1 assets</HeaderLeftSubtitle>
                                </HeaderLeftText>
                            </HeaderLeft>
                            <HeaderRight>
                                <HeaderRightTitle>$30,131</HeaderRightTitle>
                                <HeaderRightSubtitle>10.313 ETH</HeaderRightSubtitle>
                            </HeaderRight>
                        </HeaderAsset>
                        <Assets>
                            <Asset>
                                <AssetIcon><img src="/static/image/BTC.svg" width="20" height="20" /></AssetIcon>
                                <AssetText>
                                    <AssetLeft>
                                        <AssetTitle>My wallet 1</AssetTitle>
                                        <AssetSubtitle>1FA4aEo21ZxTXs1YEFhKD5gpPzNSQ45hQg</AssetSubtitle>
                                    </AssetLeft>
                                    <AssetRight>
                                        <AssetTitle>$20,312</AssetTitle>
                                        <AssetSubtitle>5.013 BTC</AssetSubtitle>
                                    </AssetRight>
                                    <AssetPercentage>
                                        <AssetPercentageLeft width="10%" color="#7683c9" />
                                        <AssetPercentageRight color="#7683c9">10%</AssetPercentageRight>
                                    </AssetPercentage>
                                </AssetText>
                            </Asset>
                        </Assets>
                    </Category>
                </Right>
            </div>
        </Container>
    )
}


const Container = styled.div`
& > div {
    padding: 50px 60px;
}
`
const Left = styled.div``
const Right = styled.div``

const Category = styled.div`
clear:both;
margin-top: 75px;
&:first-child {
    margin-top: 0
}
`

const HeaderAsset = styled.div`
height: 50px;
`

const HeaderLeft = styled.div``
const HeaderLeftPercentage = styled.div`
float: left
`
const HeaderLeftText = styled.div`
float: left;
padding-top: 3px;
padding-left: 10px;
`
const HeaderLeftTitle = styled.div`
color: ${styles.color.black};
font-weight: 900;
font-size: 25px;
line-height: 25px;
`
const HeaderLeftSubtitle = styled.div`
color: ${styles.color.grey1};
font-size: 13px;
font-weight: 100;
letter-spacing: .5px;
`

const HeaderRight = styled.div`
float:right;
padding-top: 3px;
`

const HeaderRightTitle = styled.div`
color: ${styles.color.black};
font-weight: 900;
font-size: 20px;
line-height: 25px;
text-align: right;
`

const HeaderRightSubtitle = styled.div`
color: ${styles.color.grey1};
font-size: 13px;
font-weight: bold;
text-align: right;
`


const CircleText = styled.g`
-moz-transform: translateY(0.45em);
-ms-transform: translateY(0.45em);
-webkit-transform: translateY(0.45em);
transform: translateY(0.45em);

.chart-number {
    fill: ${styles.color.front3};
    letter-spacing: -0.02em;
    font-size: .7em;
    font-weight: bold;
    line-height: 1;
    text-anchor: middle;
    -moz-transform: translateY(-0.25em);
    -ms-transform: translateY(-0.25em);
    -webkit-transform: translateY(-0.25em);
    transform: translateY(-0.25em);
}
`



const Assets = styled.div`
clear:both;
`
const Asset = styled.div`
clear: both;
margin-top: 25px;
height: 55px;
`
const AssetIcon = styled.div`
width:45px;
padding-top: 5px;
padding-right: 5px;
text-align: right;
float: left;
`
const AssetText = styled.div`
margin-left: 60px;
`

const AssetLeft = styled.div`
float:left
`
const AssetRight = styled.div`
float:right;
text-align:right;
`

const AssetTitle = styled.div`
color: ${styles.color.front3};
font-weight:bold;
font-size: 16px;
`
const AssetSubtitle = styled.div`
padding-top: 3px;
color: ${styles.color.grey1};
letter-spacing: .5px;
font-weight:100;
font-size: 12px;
clear:both;
`
const AssetPercentage = styled.div`
padding-top: 3px;
clear:both;
`
const AssetPercentageLeft = styled.div`
width: calc(${props=>props.width} - 30px);
background-color: ${props=>props.color};
height: 4px;
border-radius: 100px;
float: left;
margin-top: 5px;
`
const AssetPercentageRight = styled.span`
float: left;
font-size: 10px;
font-weight: bold;
color: ${props=>props.color};
margin-left: 5px;
`