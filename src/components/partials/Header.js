import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'
import styles from '/const/styles'
import routes from '/const/routes'
import { MAINNET, TESTNET } from '/const/networks'
import { Show } from '/doprouter/react'

import IconMenu from 'react-icons/lib/md/menu'
import IconMore from 'react-icons/lib/md/more-vert'
import IconHome from 'react-icons/lib/md/home'

import { Fiats } from '/api/Fiats'
import { Coins } from '/api/Coins'
import {
    setHref,
    exportAssets,
    importAssetsFromFile,
    closeSession,
    changeNetwork
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
        this.observer.observe(state, 'menuOpen')

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
    //     state.fiatMenuOpen = true
    // }

    // onMenuClose(e) {
    //     state.fiatMenuOpen = false
    // }

    // onChangeCurrency(symbol) {
    //     changeFiat(symbol)
    // }

    onChangeNetwork() {
        changeNetwork(MAINNET)
    }

    onExport() {
        exportAssets()
    }
    onImport() {
        importAssetsFromFile()
    }
    onClose() {
        closeSession()
    }

    onHome() {
        setHref(routes.home())
    }

    onSettings() {
        setHref(routes.settings())
    }

    // onAddAsset() {
    //     setHref(routes.add())
    // }

    onSideMenu() {
        // if (window.location.hash === '') {
        // window.history.pushState(null, null, '#menu')
        // }
        state.sideMenuOpen = true
    }

    onMenuOpen() {
        state.menuOpen = true
    }

    onMenuClose() {
        state.menuOpen = false
    }

    render() {
        return React.createElement(HeaderTemplate, {
            network: state.network,
            sideMenuOpen: state.sideMenuOpen,
            onSideMenu: this.onSideMenu,
            menuOpen: state.menuOpen,
            // onAddAsset: this.onAddAsset,
            onChangeNetwork: this.onChangeNetwork,
            onMenuOpen: this.onMenuOpen,
            onMenuClose: this.onMenuClose,
            onExport: this.onExport,
            onImport: this.onImport,
            onClose: this.onClose,
            onHome: this.onHome,
            onSettings: this.onSettings,
            totalAssets: state.totalAssets
        })
    }
}

function HeaderTemplate({
    network,
    sideMenuOpen,
    onSideMenu,
    menuOpen,
    // onAddAsset,
    onChangeNetwork,
    onMenuOpen,
    onMenuClose,
    onExport,
    onImport,
    onClose,
    onHome,
    onSettings,
    totalAssets
}) {
    return (
        <HeaderDiv>
            <Show if={network === TESTNET}>
                <Testnet>
                    <span>You are on Testnet mode. </span>
                    <a href="#" onClick={onChangeNetwork}>
                        Click here to change to Mainnet.
                    </a>
                </Testnet>
            </Show>
            <HeaderContent>
                <HeaderLeft onClick={onSideMenu}>
                    <div>
                        <IconMenu size={28} color="white" />
                    </div>
                </HeaderLeft>
                <HeaderCenter onClick={onHome}>
                    <div>
                        <IconHome size={15} color="white" />
                    </div>
                    <img src="/static/image/logo.svg" width="80" />

                    {/* {Object.keys(cryptoPrices).map(symbol => {
                        if ( typeof cryptoPrices[symbol] == 'number' && cryptoPrices[symbol]>0 )
                            return(
                            <HeaderCrypto>
                                {symbol} ≈ <strong>{currencies[currency].format(cryptoPrices[symbol], Coins[symbol].price_decimals)}</strong>
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
                            {/* <DropDownItem onClick={onAddAsset}>
                                Add asset
                            </DropDownItem> */}
                            <DropDownItem onClick={onImport}>
                                Import backup
                            </DropDownItem>
                            <DropDownItem
                                onClick={onExport}
                                disabled={totalAssets === 0}
                            >
                                Export backup
                            </DropDownItem>
                            <DropDownItem onClick={onSettings}>
                                Settings
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

const Testnet = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background: ${styles.infoColor.red};
    line-height: 18px;
    text-align: center;
    color: white;
    font-size: 9px;
    letter-spacing: 0.5px;
    z-index: 1;
`

const HeaderDiv = styled.div`
    height: ${styles.headerHeight};
    margin: 0 ${styles.paddingOut};
    ${styles.media.second} {
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
    width: 28px;
    height: 28px;
    margin-top: 3px;
    min-height: 1px;
    box-shadow: 0 0 0px 4px rgba(255, 255, 255, 0);
    background: rgba(255, 255, 255, 0);
    border-radius: 50%;
    transition: 0.5s ease all;

    &:hover,
    &:active {
        background: rgba(255, 255, 255, 0.2);
        box-shadow: 0 0 0px 4px rgba(255, 255, 255, 0.2);
    }

    & > div {
        display: none;
    }

    ${styles.media.first} {
        & > div {
            display: block;
        }
    }
`
const HeaderCenter = styled.div`
    width: calc(100% - 60px);
    float: left;
    text-align: center;
    cursor: pointer;
    padding-top: 3px;
    position: relative;
    & div {
        display: none;
        position: absolute;
        text-align: center;
        width: 100%;
        top: -18px;
    }
    &:hover div {
        display: block;
    }
`
const HeaderRight = styled.div`
    width: 30px;
    height: 30px;
    float: right;
    text-align: right;
    cursor: pointer;
    position: relative;
    box-shadow: 0 0 0px 4px rgba(255, 255, 255, 0);
    background: rgba(255, 255, 255, 0);
    border-radius: 50%;
    transition: 0.5s ease all;

    &:hover,
    &:active {
        background: rgba(255, 255, 255, 0.2);
        box-shadow: 0 0 0px 4px rgba(255, 255, 255, 0.2);
    }
`

// const HeaderCrypto = styled.span`
//     font-size: 15px;
//     letter-spacing: .2px;
//     color: ${styles.color.front1};
//     padding-right: 25px;
//     font-weight: 300;
// `

// const HeaderCurrencySelected = styled.span`
//     font-size: 15px;
//     color: ${styles.color.front1};
//     font-weight: bold;
//     padding-right: 4px;
// `
