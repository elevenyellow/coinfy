import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'
import { Router, Route } from '/doprouter/react'
import Div from '/components/styled/Div'
import styles from '/styles'
// import QRCode from 'qrcode.react'
// import cipher from 'browserify-cipher'
// import bignumber from 'bignumber.js'
// import bitcoin from 'bitcoinjs-lib'

export default class CreateBitcoin extends Component {

    shouldComponentUpdate() {
        return false
    }

    render() {
        return (
            <div>
                <Div padding-bottom="15px">
                    <Code></Code>
                </Div>
                <Div padding-bottom="10px">
                    <CenterElement>
                        <Address><span>1FL5PyZRtHm4q2atdNb4DozRyshqsFgnXh</span></Address>
                    </CenterElement>
                </Div>
                <Div padding-bottom="15px">
                    <CenterElement>
                        <Button width="100%">Generate address</Button>
                    </CenterElement>
                </Div>
            </div>
        )
    }
}


const Code = styled.div`
margin: 0 auto;
width: 150px;
height: 150px;
background-color: #EEE;
`
const CenterElement = styled.div`
margin: 0 auto;
width: 360px;
`

const Address = styled.div`
border: 1px solid ${styles.color.background4};
border-radius: 4px;
background: #FFF;
padding: 10px;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
font-weight: 500;
text-align:center;

& span {
    display: inline-block;
    font-family: monospace;
    font-size: 16px;
    color:${styles.color.front5};
}
`

const Button = styled.button`
color: ${styles.color.front5};
background-image: linear-gradient(#fff,${styles.color.background1});
border: 1px solid ${styles.color.background5};
padding: 8px 20px 8px;
font-weight: bold;
font-size: 12px;
display: inline-block;
line-height: 20px;
cursor: pointer;
border-radius: 4px;
width: ${props=>props.width};

&:hover {
    color: ${styles.color.background3}
}
`