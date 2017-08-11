import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'
import { Show } from '/doprouter/react'
import QRious from 'qrious'
// import cipher from 'browserify-cipher'
// import bignumber from 'bignumber.js'

import { setInitialViewState, generateBitcoinWallet } from '/actions'
import state from '/stores/state'
import styles from '/styles'
import Div from '/components/styled/Div'


export default class CreateBitcoin extends Component {

    componentWillMount() {
        this.observer = createObserver(mutations => this.forceUpdate());
        this.observer.observe(state.view, 'address');
        setInitialViewState({
            address: ''
        })
    }

    componentWillUnmount() {
        this.observer.destroy()
    }

    shouldComponentUpdate() {
        return false
    }

    render() {

        let qrcodebase64 = ''
        if (state.view.address !== '') {
            const qr = new QRious({
                background: 'white',
                foreground: 'black',
                level: 'H',
                size: 300,
                value: state.view.address
            })
            qrcodebase64 = qr.toDataURL()
        }



        return (
            <div>
                <Div padding-bottom="15px">
                    <Code>
                        <Show if={qrcodebase64!==''}>
                            <img width="150" src={qrcodebase64} />
                        </Show>
                    </Code>
                </Div>
                <Div padding-bottom="10px">
                    <CenterElement>
                        <Address><span>{state.view.address}</span></Address>
                    </CenterElement>
                </Div>
                <Div padding-bottom="15px">
                    <CenterElement>
                        <Button onClick={generateBitcoinWallet} width="100%">Generate address</Button>
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
outline: none;
&:hover {
    color: ${styles.color.background3}
}
`