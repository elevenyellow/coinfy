import React, { Component } from 'react'
import { createObserver } from 'dop'
import styled from 'styled-components'
import { Show } from '/doprouter/react'

import routes from '/const/routes'
import styles from '/const/styles'
import { currencies } from '/const/currencies'

import { numberWithCommas, round } from '/api/numbers'
import { Assets } from '/api/Assets'

import state from '/store/state'
import { setHref, exportAssets, importAssetsFromFile, closeSession } from '/store/actions'


import IconMore from 'react-icons/lib/md/more-vert'
import {
    DropDown,
    DropDownItem,
    DropDownMenu,
    DropDownArrow
} from '/components/styled/Dropdown'
import ButtonBig from '/components/styled/ButtonBig'

import AssetList from '/components/partials/AssetList'

export default class Left extends Component {
    componentWillMount() {
        this.observer = createObserver(mutations => this.forceUpdate())
        this.observer.observe(state, 'balance')
        this.observer.observe(state, 'menuOpen')
        this.observer.observe(state, 'totalAssets')

        this.onMenuOpen = this.onMenuOpen.bind(this)
        this.onExport = this.onExport.bind(this)
        this.onImport = this.onImport.bind(this)
        this.onClose = this.onClose.bind(this)
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

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
        return React.createElement(LeftTemplate, {
            ascii: currencies[state.currency].ascii,
            balance: numberWithCommas(round(state.balance)),
            color: state.balance>0 ? Assets.BTC.color : '#DDDDDD',
            menuOpen: state.menuOpen,
            onMenuOpen: this.onMenuOpen,
            onMenuClose: this.onMenuClose,
            onExport: this.onExport,
            onImport: this.onImport,
            onClose: this.onClose,
            totalAssets: state.totalAssets
        })
    }
}

function LeftTemplate({
    ascii,
    balance,
    color,
    menuOpen,
    onMenuOpen,
    onMenuClose,
    onExport,
    onImport,
    onClose,
    totalAssets
}) {
    return (
        <LeftDiv>
            <ColumnLeftChart onClick={e => setHref(routes.home())}>
                <ColumnLeftChartBalance>
                    <ColumnLeftChartLabel>Total balance</ColumnLeftChartLabel>
                    <ColumnLeftChartNumber>
                        <AmountSuper>{ascii}</AmountSuper>
                        <Amount>{balance}</Amount>
                        {/* <AmountSuper>.52</AmountSuper>  */}
                    </ColumnLeftChartNumber>
                </ColumnLeftChartBalance>
                <ColumnLeftChartChart>
                    <svg width="100%" height="200" viewBox="0 0 28 28">
                        <circle
                            cx="14"
                            cy="15"
                            r="12.3"
                            fill="transparent"
                            stroke={color}
                            strokeWidth="1.3"
                        />
                    </svg>
                </ColumnLeftChartChart>
            </ColumnLeftChart>
            <ColumnLeftHeader>
                <ColumnLeftHeaderLeft>
                    <DropDown onOpen={onMenuOpen} onClose={onMenuClose} open={menuOpen}>
                        <IconMore size={35} color={styles.color.front2} />
                        <DropDownMenu left="7px">
                            <DropDownItem onClick={onImport}>Import backup</DropDownItem>
                            <DropDownItem onClick={onExport} disabled={totalAssets===0}>Export backup</DropDownItem>
                            <DropDownItem onClick={onClose} disabled={totalAssets===0}>Close session</DropDownItem>
                        </DropDownMenu>
                    </DropDown>
                </ColumnLeftHeaderLeft>
                <ColumnLeftHeaderRight />
            </ColumnLeftHeader>
            <ColumnLeftContent>
                <AssetList />
            </ColumnLeftContent>
            <ColumnLeftFooter>
                <ButtonBig
                    onClick={e => {
                        setHref(routes.add())
                    }}
                >
                    Add asset
                </ButtonBig>
            </ColumnLeftFooter>
        </LeftDiv>
    )
}

const LeftDiv = styled.div`
    position: relative;
    height: 100%;
    width: ${styles.leftColumn};
    background: white;
    float: left;
    border-radius: 5px;
    box-shadow: 0 0 0px 4px rgba(205,213,218,.3);
`
// border: 1px solid rgba(205,213,218,.7);

const ColumnLeftHeader = styled.div`
    position: absolute;
    top: 0;
`
const ColumnLeftHeaderLeft = styled.div`
    float: left;
    padding-left: 5px;
    padding-top: 10px;
`
const ColumnLeftHeaderRight = styled.div`float: right;`

const ColumnLeftChart = styled.div`cursor: pointer;`
const ColumnLeftChartChart = styled.div``

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

const ColumnLeftChartNumber = styled.div`line-height: 35px;`

const ColumnLeftContent = styled.div`
    border-top: 1px solid ${styles.color.background4};
    height: calc(100% - 277px);
    overflow-y: auto;
    position: absolute;
    width: 100%;
    top: 215px;
`
    // &::-webkit-scrollbar {
    //     width: 8px;
    //     height: 8px;
    // }
    // &::-webkit-scrollbar-thumb {
    //     background: ${styles.color.background4};
    //     cursor: grab;
    // }
    // &::-webkit-scrollbar-track {
    //     background: transparent;
    // }



const ColumnLeftFooter = styled.div`
    position: absolute;
    bottom: 0;
    width: calc(100% - 20px);
    padding: 10px;
`

const AmountSuper = styled.span`
    position: relative;
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
