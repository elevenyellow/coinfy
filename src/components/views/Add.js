import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'
import { Router, Route } from '/doprouter/react'

import routes from '/const/routes'
import { TYPE_COIN, TYPE_ERC20 } from '/const/'
import styles from '/const/styles'

import sortBy from '/api/sortBy'
import { Coins } from '/api/Coins'
import searchInArray from '/api/searchInArray'

import state from '/store/state'
import { setHref } from '/store/actions'

import Div from '/components/styled/Div'
import H1 from '/components/styled/H1'
import H2 from '/components/styled/H2'
import InputSearch from '/components/styled/InputSearch'
import {
    RightContainerPadding,
    RightHeader,
    RightContent
} from '/components/styled/Right'

export default class AddAsset extends Component {
    componentWillMount() {
        this.observer = createObserver(mutations => this.forceUpdate())
        this.observer.observe(state.location.path, 'length')
        this.observer.observe(state.location.path, '1')
        this.observer.observe(state.view, 'filter')

        // Initial state
        state.view = {
            filter: ''
        }

        this.assetList = []
        Object.keys(Coins)
            .filter(symbol => symbol !== 'Coins')
            .forEach(symbol => {
                const coin = Coins[symbol]
                if (coin.type === TYPE_COIN) {
                    this.assetList.push({
                        name: coin.name,
                        symbol: symbol,
                        type: coin.type,
                        url: routes.addAsset(symbol),
                        logo: `/static/image/coins/${symbol}.svg`,
                        labels: coin.labels,
                        position: 0
                    })
                } else if (coin.type === TYPE_ERC20) {
                    this.assetList.push({
                        name: coin.name,
                        symbol: symbol,
                        type: coin.type,
                        url: routes.addAsset(symbol),
                        logo: `/static/image/coins/${symbol}.svg`,
                        labels: coin.labels,
                        position: 1
                    })
                }
            })

        this.assetList = sortBy(this.assetList, 'position', 'name', 'symbol')
    }

    componentWillUnmount() {
        this.observer.destroy()
    }

    shouldComponentUpdate() {
        return false
    }

    onChangeFilter(e) {
        state.view.filter = e.target.value
    }

    onClick(route) {
        setHref(route)
    }

    render() {
        return React.createElement(AddAssetTemplate, {
            location: state.location,
            assetList: searchInArray(this.assetList, state.view.filter, [
                'name',
                'symbol',
                'labels'
            ]),
            filter: state.view.filter,
            onChangeFilter: this.onChangeFilter,
            onClick: this.onClick
        })
    }
}

function AddAssetTemplate({
    location,
    assetList,
    filter,
    onChangeFilter,
    onClick
}) {
    return (
        <RightContainerPadding>
            <RightHeader>
                <Div float="left">
                    <H1>Add asset</H1>
                    <H2>Create or Import assets</H2>
                </Div>
                <Div clear="both" />
            </RightHeader>
            <RightContent>
                <Div padding-bottom="20px">
                    <InputSearch
                        // ref={e => {
                        //     if (e && e.base && e.base.getElementsByTagName)
                        //         setTimeout(a => {
                        //             e.base
                        //                 .getElementsByTagName('input')[0]
                        //                 .focus()
                        //         }, 10)
                        // }}
                        value={filter}
                        onChange={onChangeFilter}
                        onClear={e => onChangeFilter({ target: { value: '' } })}
                        placeholder="Filter"
                        invalid={assetList.length === 0}
                        width="100%"
                    />
                </Div>
                <Items>
                    {assetList.map(asset => (
                        <Item>
                            <ItemBackground>
                                <img
                                    src={`/static/image/${
                                        asset.type
                                    }_background.svg`}
                                />
                            </ItemBackground>
                            <ItemOverlay />
                            <ItemContent>
                                <ItemLinks />
                                <ItemLogo>
                                    <img src={asset.logo} />
                                </ItemLogo>
                                <ItemSymbol>{asset.symbol}</ItemSymbol>
                                <ItemName>{asset.name}</ItemName>
                                <ItemButtons>
                                    <ItemButton>Create</ItemButton>
                                    <ItemButton>Restore / Import</ItemButton>
                                </ItemButtons>
                            </ItemContent>
                        </Item>
                    ))}
                </Items>
            </RightContent>
        </RightContainerPadding>
    )
}

const Items = styled.div`
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
`

const Item = styled.div`
    position: relative;
    display: inline-block;
    width: 220px;
    height: 310px;
    margin: 15px;
    background: white;
    border-radius: 25px;
    box-shadow: 0 0 14px 3px rgba(0, 0, 0, 0.03);
    ${styles.media.fifth} {
        margin: 15px 0;
        width: 100%;
    }
    &:hover div img {
        transform: scale(1.15);
        transition: 1s ease transform;
    }
    &:hover div div img {
        transform: scale(1.1);
        transition: 0.5s ease transform;
    }
`
const ItemBackground = styled.div`
    position: absolute;
    opacity: 0.04;
    padding-top: 25px;
    margin: 0 auto;
    width: 100%;
    text-align: center;
    & > img {
        transition: 0.5s ease transform;
        width: 150px;
        height: 150px;
    }
`
const ItemContent = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
`
const ItemOverlay = styled.div`
    position: absolute;
    z-index: 1;
    opacity: 0;
    cursor: pointer;
    top: 25px;
    width: 100%;
    height: calc(100% - 74px);
    &:hover + div button:first-child {
        border-color: ${styles.color.background4};
        background-color: white;
    }
`

const ItemLinks = styled.div`
    height: 25px;
`
const ItemLogo = styled.div`
    width: 70px;
    height: 70px;
    margin: 30px auto 20px auto;
    & > img {
        transition: 0.5s ease transform;
        width: 100%;
        height: 100%;
    }
`
const ItemSymbol = styled.div`
    text-align: center;
    font-weight: 100;
    font-size: 13px;
    letter-spacing: 1px;
`
const ItemName = styled.div`
    text-align: center;
    font-weight: 900;
    font-size: 23px;
    line-height: 25px;
    color: ${styles.color.front3};
`
const ItemButtons = styled.div`
    position: absolute;
    width: 100%;
    bottom: 0;
    padding: 10px;
    box-sizing: border-box;
`

const ItemButton = styled.button`
    width: 100%;
    border: 0;
    background: ${styles.color.background1};
    color: ${styles.color.front3};
    border-radius: 25px;
    padding: 7px;
    font-weight: bold;
    color: #596167;
    font-family: Roboto;
    font-size: 12px;
    margin-top: 5px;
    cursor: pointer;
    box-sizing: border-box;
    border: 2px solid transparent;
    &:first-child {
        background-color: ${styles.color.background4};
    }
    &:hover {
        border-color: ${styles.color.background4};
        background-color: white;
    }
`
