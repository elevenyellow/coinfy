import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'
import styles from '/const/styles'
import routes from '/const/routes'

import IconMenu from 'react-icons/lib/md/menu'
import IconMore from 'react-icons/lib/md/more-vert'

import { currencies } from '/const/currencies'
import { Assets } from '/api/Assets'
import {
    setHref,
    exportAssets,
    importAssetsFromFile,
    closeSession
} from '/store/actions'
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
        this.observer.observe(state, 'menuOpen')
        this.observer.observe(state.prices)

        // this.currenciesList = [
        //     {
        //         symbol: currencies.USD.symbol,
        //         label: `${currencies.USD.ascii} ${currencies.USD.symbol}`
        //     },
        //     {
        //         symbol: currencies.EUR.symbol,
        //         label: `${currencies.EUR.ascii} ${currencies.EUR.symbol}`
        //     },
        //     {
        //         symbol: currencies.GBP.symbol,
        //         label: `${currencies.GBP.ascii} ${currencies.GBP.symbol}`
        //     },
        //     {
        //         symbol: currencies.JPY.symbol,
        //         label: `${currencies.JPY.ascii} ${currencies.JPY.symbol}`
        //     },
        //     {
        //         symbol: currencies.INR.symbol,
        //         label: `${currencies.INR.ascii} ${currencies.INR.symbol}`
        //     },
        //     {
        //         symbol: currencies.CNY.symbol,
        //         label: `${currencies.CNY.ascii} ${currencies.CNY.symbol}`
        //     },
        //     {
        //         symbol: currencies.CAD.symbol,
        //         label: `${currencies.CAD.ascii} ${currencies.CAD.symbol}`
        //     },
        //     {
        //         symbol: currencies.AUD.symbol,
        //         label: `${currencies.AUD.ascii} ${currencies.AUD.symbol}`
        //     },
        //     {
        //         symbol: currencies.SGD.symbol,
        //         label: `${currencies.SGD.ascii} ${currencies.SGD.symbol}`
        //     }
        // ]
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    // onMenuOpen(e) {
    //     state.currencyMenuOpen = true
    // }

    // onMenuClose(e) {
    //     state.currencyMenuOpen = false
    // }

    // onChangeCurrency(symbol) {
    //     changeCurrency(symbol)
    // }


    onExport(e) {
        exportAssets()
    }
    onImport(e) {
        importAssetsFromFile()
    }
    onClose(e) {
        closeSession()
    }

    onMenuOpen(e) {
        state.menuOpen = true
    }

    onMenuClose(e) {
        state.menuOpen = false
    }

    render() {
        return React.createElement(HeaderTemplate, {
            menuOpen: state.menuOpen,
            onMenuOpen: this.onMenuOpen,
            onMenuClose: this.onMenuClose,
            onChangeCurrency: this.onChangeCurrency,
            onClose: this.onClose,
            onExport: this.onExport,
            onImport: this.onImport,
            onMenuClose: this.onMenuClose,
            currency: state.currency,
            currenciesList: this.currenciesList,
            cryptoPrices: state.prices,
            totalAssets: state.totalAssets
        })
    }
}

function HeaderTemplate({
    menuOpen,
    onMenuOpen,
    onMenuClose,
    onExport,
    onImport,
    onChangeCurrency,
    onClose,  
    currency,
    currenciesList,
    cryptoPrices,
    totalAssets
    
}) {
    return (
        <HeaderDiv>
            <HeaderContent>
                <HeaderLeft>
                    <div>
                        <IconMenu size={30} color="white" />
                    </div>
                </HeaderLeft>
                <HeaderCenter onClick={e => {
                        setHref(routes.home())
                    }}>
                    <img src="/static/image/logo.svg" width="80" />
                    
                    {/* {Object.keys(cryptoPrices).map(symbol => {
                        if ( typeof cryptoPrices[symbol] == 'number' && cryptoPrices[symbol]>0 )
                            return(
                            <HeaderCrypto>
                                {symbol} ≈ <strong>{currencies[currency].format(cryptoPrices[symbol], Assets[symbol].price_decimals)}</strong>
                            </HeaderCrypto>
                            )
                    })} */}
                </HeaderCenter>
                <HeaderRight>
                    <DropDown
                        onOpen={onMenuOpen}
                        onClose={onMenuClose}
                        open={menuOpen}
                    >
                        <IconMore size={30} color="white" />
                        <DropDownMenu right="0">
                            <DropDownItem onClick={onImport}>
                                Import backup
                            </DropDownItem>
                            <DropDownItem
                                onClick={onExport}
                                disabled={totalAssets === 0}
                            >
                                Export backup
                            </DropDownItem>
                            <DropDownItem
                                onClick={onClose}
                                disabled={totalAssets === 0}
                            >
                                Close session
                            </DropDownItem>
                        </DropDownMenu>
                    </DropDown>
                    {/* <DropDown
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
                    </DropDown> */}
                </HeaderRight>
            </HeaderContent>
        </HeaderDiv>
    )
}

const HeaderDiv = styled.div`
    height: ${styles.headerHeight};
    margin: 0 ${styles.paddingOut};
    ${styles.media.first} {
        margin: 0 ${styles.paddingOutMobile};
    }
`
const HeaderContent = styled.div`
padding-top: 25px;
`
const HeaderLeft = styled.div`
    float: left;
    text-align: center;
    cursor: pointer;
    width: 30px;
    min-height: 1px;
    & > div {
        display:none;
    }
    ${styles.media.second} {
        & > div {
            display:block;
        }
    }
`
const HeaderCenter = styled.div`
    width: calc(100% - 60px);
    float: left;
    text-align: center;
    cursor: pointer;
    padding-top:3px;
    &:hover {
        opacity: .7
    }
`
const HeaderRight = styled.div`
    width: 30px;
    float: right;
    text-align: right;
    cursor: pointer;
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
