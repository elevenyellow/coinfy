import React, { Component } from 'react'
import { createObserver } from 'dop'
import styled from 'styled-components'
import { Show } from '/doprouter/react'

import routes from '/const/routes'
import styles from '/const/styles'

import { state, getTotalWallets } from '/store/state'
import { setHref, exportWallets, importWalletsFromFile, closeSession } from '/store/actions'


import IconMore from 'react-icons/lib/md/more-vert'
import {
    DropDown,
    DropDownItem,
    DropDownMenu,
    DropDownArrow
} from '/components/styled/Dropdown'
import ButtonBig from '/components/styled/ButtonBig'

import WalletList from '/components/partials/WalletList'

export default class Left extends Component {
    componentWillMount() {
        this.observer = createObserver(mutations => this.forceUpdate())
        this.observer.observe(state, 'menuOpen')
        this.observer.observe(state, 'totalWallets')

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
        exportWallets()
    }        
    onImport(e) {
        importWalletsFromFile()
    }  
    onClose(e) {
        closeSession()
    }  

    onMenuOpen(e) {
        if (!state.menuOpen) {
            event.stopPropagation()
            const callback = function(e) {
                // if (e.target.children.length===0) { // means is <DropDownItem> and now <DropDownMenu>
                    state.menuOpen = false
                    document.removeEventListener('click', callback)
                // }
            }
            document.addEventListener('click', callback)
            state.menuOpen = true
        }
    }

    render() {
        return React.createElement(LeftTemplate, {
            menuOpen: state.menuOpen,
            onMenuOpen: this.onMenuOpen,
            onExport: this.onExport,
            onImport: this.onImport,
            onClose: this.onClose,
            totalWallets: state.totalWallets
        })
    }
}

function LeftTemplate({
    menuOpen,
    onMenuOpen,
    onExport,
    onImport,
    onClose,
    totalWallets
}) {
    return (
        <LeftDiv>
            <ColumnLeftChart onClick={e => setHref(routes.home())}>
                <ColumnLeftChartBalance>
                    <ColumnLeftChartLabel>Total balance</ColumnLeftChartLabel>
                    <ColumnLeftChartNumber>
                        <AmountSuper>$</AmountSuper>
                        <Amount>22,521</Amount>
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
                            stroke="#FFB119"
                            strokeWidth="1.3"
                        />
                    </svg>
                </ColumnLeftChartChart>
            </ColumnLeftChart>
            <ColumnLeftHeader>
                <ColumnLeftHeaderLeft>
                    <DropDown onClick={onMenuOpen}>
                        <IconMore size={35} color={styles.color.front2} />
                        <DropDownMenu visible={menuOpen} left="7px">
                            <DropDownItem onClick={onImport}>Import</DropDownItem>
                            <DropDownItem onClick={onExport} disabled={totalWallets===0}>Export</DropDownItem>
                            <DropDownItem onClick={onClose} disabled={totalWallets===0}>Close session</DropDownItem>
                        </DropDownMenu>
                    </DropDown>
                </ColumnLeftHeaderLeft>
                <ColumnLeftHeaderRight />
            </ColumnLeftHeader>
            <ColumnLeftContent>
                <WalletList />
            </ColumnLeftContent>
            <ColumnLeftFooter>
                <ButtonBig
                    onClick={e => {
                        setHref(routes.addwallet())
                    }}
                >
                    Add wallet
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
    box-shadow: 0 0 3px 2px rgba(205, 213, 218, .4);
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
    &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    &::-webkit-scrollbar-thumb {
        background: ${styles.color.background4};
        cursor: grab;
    }
    &::-webkit-scrollbar-track {
        background: transparent;
    }
`

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
