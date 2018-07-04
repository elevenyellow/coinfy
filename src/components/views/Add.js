import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'

import { TYPE_COIN, TYPE_ERC20, OK } from '/const/'
import styles from '/const/styles'

import { sortBy } from '/api/arrays'
import { Coins } from '/api/coins'
import { searchInArray } from '/api/arrays'

import state from '/store/state'
import { routes, Show } from '/store/router'
import { setHref, deleteCustomERC20, addNotification } from '/store/actions'
import { getAssetsBySymbol } from '/store/getters'

import Div from '/components/styled/Div'
import ButtonBig from '/components/styled/ButtonBig'
import H1 from '/components/styled/H1'
import H2 from '/components/styled/H2'
import InputSearch from '/components/styled/InputSearch'
import {
    RightContainerPadding,
    RightHeader,
    RightContent
} from '/components/styled/Right'

import IconDelete from 'react-icons/lib/md/delete'

export default class AddAsset extends Component {
    componentWillMount() {
        this.observer = createObserver(mutations => this.forceUpdate())
        this.observer.observe(state.location.query)
        this.onDeleteCustomErc20 = this.onDeleteCustomErc20.bind(this)
        this.loadAssetList()
    }

    componentWillUnmount() {
        this.observer.destroy()
    }

    shouldComponentUpdate() {
        return false
    }

    loadAssetList() {
        this.assetList = []
        Object.keys(Coins)
            .filter(symbol => symbol !== 'Coins')
            .forEach(symbol => {
                const Coin = Coins[symbol]
                if (Coin.networks_availables.includes(state.network)) {
                    if (Coin.type === TYPE_COIN) {
                        this.assetList.push({
                            name: Coin.name,
                            symbol: symbol,
                            type: Coin.type,
                            url_create: routes.create({ symbol: symbol }),
                            url_import: routes.import({ symbol: symbol }),
                            logo: Coin.logo,
                            labels: Coin.labels,
                            position: 0,
                            background_image:
                                '/static/image/coin_background.png',
                            background_image_opacity: 0.2
                        })
                    } else if (Coin.type === TYPE_ERC20) {
                        const deletable =
                            Coin.custom &&
                            getAssetsBySymbol(symbol).length === 0
                        this.assetList.push({
                            name: Coin.name,
                            symbol: symbol,
                            type: Coin.type,
                            url_create: routes.create({ symbol: symbol }),
                            url_import: routes.import({ symbol: symbol }),
                            logo: Coin.logo,
                            labels: Coin.labels,
                            position: 1,
                            background_image:
                                '/static/image/erc20_background.svg',
                            background_image_opacity: 0.04,
                            deletable: deletable
                        })
                    }
                }
            })

        this.assetList = sortBy(this.assetList, 'position', 'name', 'symbol')
    }

    onChangeFilter(e) {
        state.location.query.filter = e.target.value
        // state.view.filter = e.target.value
    }

    onDeleteCustomErc20(symbol) {
        deleteCustomERC20(symbol)
        addNotification(
            `You have removed the Custom ERC20 token: ${symbol}`,
            OK
        )
        this.loadAssetList()
        this.forceUpdate()
    }

    onClick(route) {
        setHref(route)
    }

    render() {
        const filter = state.location.query.filter || ''
        return React.createElement(AddAssetTemplate, {
            location: state.location,
            assetList: searchInArray(this.assetList, filter, [
                'name',
                'symbol',
                'labels'
            ]),
            filter: filter,
            onChangeFilter: this.onChangeFilter,
            onDeleteCustomErc20: this.onDeleteCustomErc20,
            onClick: this.onClick
        })
    }
}

function AddAssetTemplate({
    location,
    assetList,
    filter,
    onChangeFilter,
    onDeleteCustomErc20,
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
                        type="text"
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
                            <ItemBackground
                                opacity={asset.background_image_opacity}
                            >
                                <img src={asset.background_image} />
                            </ItemBackground>
                            <ItemOverlay
                                onClick={e => onClick(asset.url_create)}
                            />
                            <ItemContent>
                                <ItemLinks>
                                    <Show if={asset.deletable === true}>
                                        <ItemLink
                                            onClick={e =>
                                                onDeleteCustomErc20(
                                                    asset.symbol
                                                )
                                            }
                                        >
                                            <IconDelete
                                                size={18}
                                                color={styles.color.front2}
                                            />
                                        </ItemLink>
                                    </Show>
                                </ItemLinks>
                                <ItemLogo>
                                    <img src={asset.logo} />
                                </ItemLogo>
                                <ItemSymbol>{asset.symbol}</ItemSymbol>
                                <ItemName>{asset.name}</ItemName>
                                <ItemButtons>
                                    <ItemButton>Create</ItemButton>
                                    <ItemButton
                                        onClick={e => onClick(asset.url_import)}
                                    >
                                        Restore / Import
                                    </ItemButton>
                                </ItemButtons>
                            </ItemContent>
                        </Item>
                    ))}
                </Items>
                <Buttons>
                    <ButtonBig
                        onClick={e =>
                            onClick(routes.custom({ type: TYPE_ERC20 }))
                        }
                    >
                        Create custom ERC20 token
                    </ButtonBig>
                </Buttons>
            </RightContent>
        </RightContainerPadding>
    )
}

const Buttons = styled.div`
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    padding-top: 30px;
    & > * {
        max-width: 350px !important;
        position: relative;
        display: inline-block;
    }
`

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
        transform: scale(1.2);
        transition: 1.5s ease transform;
    }
    &:hover div div img {
        transform: scale(1.15);
        transition: 0.5s ease transform;
    }
`
const ItemBackground = styled.div`
    position: absolute;
    padding-top: 25px;
    margin: 0 auto;
    width: 100%;
    text-align: center;
    & > img {
        filter: grayscale(100%);
        opacity: ${props => props.opacity};
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
    cursor: pointer;
    position: absolute;
    z-index: 1;
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
const ItemLink = styled.div`
    float: right;
    padding-right: 10px;
    padding-top: 5px;
    opacity: 0.5;
    cursor: pointer;
    &:hover {
        opacity: 1;
    }
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
