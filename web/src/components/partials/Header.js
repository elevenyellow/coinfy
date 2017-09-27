import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'
import styles from '/const/styles'
import routes from '/const/routes'

import { currencies } from '/const/currencies'
import { Assets } from '/api/Assets'
import { setHref, changeCurrency } from '/store/actions'
import state from '/store/state'

import Div from '/components/styled/Div'
import {
    DropDown,
    DropDownItem,
    DropDownMenu,
    DropDownArrow
} from '/components/styled/Dropdown'

export default class Header extends Component {
    componentWillMount() {
        this.observer = createObserver(mutations => this.forceUpdate())
        this.observer.observe(state, 'currencyMenuOpen')
        this.observer.observe(state, 'currency')
        this.observer.observe(state.prices)

        this.currenciesList = [
            {
                symbol: currencies.USD.symbol,
                label: `${currencies.USD.ascii} ${currencies.USD.symbol}`
            },
            {
                symbol: currencies.EUR.symbol,
                label: `${currencies.EUR.ascii} ${currencies.EUR.symbol}`
            },
            {
                symbol: currencies.GBP.symbol,
                label: `${currencies.GBP.ascii} ${currencies.GBP.symbol}`
            },
            {
                symbol: currencies.JPY.symbol,
                label: `${currencies.JPY.ascii} ${currencies.JPY.symbol}`
            },
            {
                symbol: currencies.INR.symbol,
                label: `${currencies.INR.ascii} ${currencies.INR.symbol}`
            },
            {
                symbol: currencies.CNY.symbol,
                label: `${currencies.CNY.ascii} ${currencies.CNY.symbol}`
            },
            {
                symbol: currencies.CAD.symbol,
                label: `${currencies.CAD.ascii} ${currencies.CAD.symbol}`
            },
            {
                symbol: currencies.AUD.symbol,
                label: `${currencies.AUD.ascii} ${currencies.AUD.symbol}`
            },
            {
                symbol: currencies.SGD.symbol,
                label: `${currencies.SGD.ascii} ${currencies.SGD.symbol}`
            }
        ]
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    onMenuOpen(e) {
        state.currencyMenuOpen = true
    }

    onMenuClose(e) {
        state.currencyMenuOpen = false
    }

    onChangeCurrency(symbol) {
        changeCurrency(symbol)
    }

    render() {
        return React.createElement(HeaderTemplate, {
            menuOpen: state.currencyMenuOpen,
            onMenuOpen: this.onMenuOpen,
            onMenuClose: this.onMenuClose,
            onChangeCurrency: this.onChangeCurrency,
            currency: state.currency,
            currenciesList: this.currenciesList,
            cryptoPrices: state.prices
        })
    }
}

function HeaderTemplate({
    menuOpen,
    onMenuOpen,
    onMenuClose,
    onChangeCurrency,
    currency,
    currenciesList,
    cryptoPrices
}) {
    return (
        <HeaderDiv>
            <HeaderContent>
                <HeaderLeft
                    onClick={e => {
                        setHref(routes.home())
                    }}
                >
                    <img src="/static/image/logo.svg" width="80" />
                </HeaderLeft>
                <HeaderCenter>
                    {Object.keys(cryptoPrices).map(symbol => {
                        if ( typeof cryptoPrices[symbol] == 'number' && cryptoPrices[symbol]>0 )
                            return(
                            <HeaderCrypto>
                                {symbol} ≈ <strong>{currencies[currency].format(cryptoPrices[symbol], Assets[symbol].price_decimals)}</strong>
                            </HeaderCrypto>
                            )
                    })}
                </HeaderCenter>
                <HeaderRight>
                    <DropDown
                        onOpen={onMenuOpen}
                        onClose={onMenuClose}
                        open={menuOpen}
                    >
                        <Div>
                            <HeaderCurrencySelected>
                                {currency}
                            </HeaderCurrencySelected>
                            <DropDownArrow />
                        </Div>
                        <DropDownMenu right="0" top="25px">
                            {currenciesList.map(item => {
                                return (
                                    <DropDownItem
                                        disabled={currency === item.symbol}
                                        onClick={e =>
                                            onChangeCurrency(item.symbol)}
                                    >
                                        {item.label}
                                    </DropDownItem>
                                )
                            })}
                        </DropDownMenu>
                    </DropDown>
                </HeaderRight>
            </HeaderContent>
        </HeaderDiv>
    )
}

const HeaderDiv = styled.div`
    height: ${styles.headerHeight};
    padding: 0 ${styles.paddingOut};
`
const HeaderContent = styled.div`padding-top: 25px;`
const HeaderLeft = styled.div`
    width: ${styles.leftColumn};
    float: left;
    text-align: center;
    cursor: pointer;
    &:hover {
        opacity: .7
    }
`
const HeaderCenter = styled.div`
    width: calc(100% - ${styles.leftColumn} - 100px);
    float: left;
    text-align: center;
    min-height: 1px;
`
const HeaderRight = styled.div`
    width: 100px;
    float: Left;
    text-align: right;
    position: relative;
`

const HeaderCrypto = styled.span`
    font-size: 15px;
    letter-spacing: .2px;
    color: ${styles.color.front1};
    padding-right: 25px;
    font-weight: 300;
`

const HeaderCurrencySelected = styled.span`
    font-size: 15px;
    color: ${styles.color.front1};
    font-weight: bold;
    padding-right: 4px;
`
