import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver, collect } from 'dop'

import { routes } from '/store/router'
import styles from '/const/styles'

import state from '/store/state'
// import { assetDelete, addNotification, setHref } from '/store/actions'
// import { getParamsFromLocation } from '/store/getters'

import Div from '/components/styled/Div'
import ButtonBig from '/components/styled/ButtonBig'
import RadioButton from '/components/styled/RadioButton'
// import CenterElement from '/components/styled/CenterElement'

export default class Addresses extends Component {
    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.view)

        // Initial state
        state.view = {}

        // binding
        // this.onChangeEncryption = this.onChangeEncryption.bind(this)
    }

    render() {
        return React.createElement(AddressesTemplate, {})
    }
}

function AddressesTemplate({}) {
    return (
        <Div>
            <Transactions>
                {[1, 2, 3].map(tx => {
                    return (
                        <Transaction selected={tx === 2}>
                            <TransactionInner onClick={e => {}}>
                                <TransactionItemRadio>
                                    <RadioButton checked={tx === 2} />
                                </TransactionItemRadio>
                                <TransactionItemLeft>
                                    1EnzoCZwyi9c4FNZAupF5ea9wC8uQUf75T
                                </TransactionItemLeft>
                                <TransactionItemRight>
                                    5.131131 BTC
                                </TransactionItemRight>
                            </TransactionInner>
                        </Transaction>
                    )
                })}
            </Transactions>
            <Total>10.231 BTC</Total>
        </Div>
    )
}

export const Transactions = styled.div`
    clear: both;
`

export const Transaction = styled.div`
    clear: both;
    cursor: pointer;
    color: ${props => (props.selected ? 'black' : styles.color.front3)};
    border-radius: 5px;
    margin-bottom: 10px;
    background-color: ${props =>
        props.selected ? styles.color.background1 : 'transparent'};
    &:hover {
        background-color: ${styles.color.background1};
    }
`

export const TransactionInner = styled.div`
    height: 32px;
    padding: 12px 12px 0 12px;
`

export const TransactionItemRadio = styled.div`
    float: left;
    margin-right: 10px;
    padding-left: 5px;
    padding-top: 1px;
`
export const TransactionItemLeft = styled.div`
    float: left;
    font-weight: bold;
`
export const TransactionItemRight = styled.div`
    float: right;
    font-weight: bold;
`

export const Total = styled.div`
    border-top: 2px solid #f3f6f8;
    color: #007196;
    font-weight: 900;
    text-align: right;
    padding: 12px;
    font-size: 16px;
`
