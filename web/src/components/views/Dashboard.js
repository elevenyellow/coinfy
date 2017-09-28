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

const HeaderAsset = styled.div`
clear:both;
`

const HeaderLeft = styled.div``
const HeaderLeftPercentage = styled.div`
float: left
`
const HeaderLeftText = styled.div`
float: left;
padding-top: 3px;
padding-left: 15px;
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