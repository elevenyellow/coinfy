import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'
import { Router, Route } from '/doprouter/react'
import styles from '/const/styles'

import searchInArray from '/api/searchInArray'
import state from '/store/state'
import { setHref } from '/store/actions'
import routes from '/const/routes'

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

        this.assetList = [
            {
                name: 'Bitcoin',
                title: 'Create a new wallet',
                url: routes.createbtc(),
                logo: '/static/image/coins/BTC.svg',
                labels: 'btc coin'
            },
            {
                name: 'Bitcoin',
                title: 'Import wallet',
                url: routes.importbtc(),
                logo: '/static/image/coins/BTC.svg',
                labels: 'btc coin'
            },
            {
                name: 'Ethereum',
                title: 'Create a new wallet',
                url: routes.createeth(),
                logo: '/static/image/coins/ETH.svg',
                labels: 'eth coin etereum'
            },
            {
                name: 'Ethereum',
                title: 'Import wallet',
                url: routes.importeth(),
                logo: '/static/image/coins/ETH.svg',
                labels: 'eth coin etereum'
            },
            {
                name: '0x',
                title: 'Import ZRX token',
                url: routes.importerc20('ZRX'),
                logo: '/static/image/coins/ZRX.svg',
                labels: 'zrx project eth token erc20 ecr20'
            },
            {
                name: 'Aragon',
                title: 'Import ANT token',
                url: routes.importerc20('ANT'),
                logo: '/static/image/coins/ANT.svg',
                labels: 'ant eth token erc20 ecr20'
            },
            {
                name: 'Qtum',
                title: 'Import QTUM token',
                url: routes.importerc20('QTUM'),
                logo: '/static/image/coins/QTUM.svg',
                labels: 'qtm eth token erc20 ecr20'
            },
            {
                name: 'Tron',
                title: 'Import TRX token',
                url: routes.importerc20('TRX'),
                logo: '/static/image/coins/TRX.svg',
                labels: 'tronix eth token erc20 ecr20'
            },
            {
                name: 'Binance',
                title: 'Import BNB token',
                url: routes.importerc20('BNB'),
                logo: '/static/image/coins/BNB.svg',
                labels: 'bnb qtum eth token erc20 ecr20'
            },
            {
                name: 'EOS',
                title: 'Import EOS token',
                url: routes.importerc20('EOS'),
                logo: '/static/image/coins/EOS.svg',
                labels: 'eos eth token erc20 ecr20'
            },
            {
                name: 'OmiseGO',
                title: 'Import OMG token',
                url: routes.importerc20('OMG'),
                logo: '/static/image/coins/OMG.svg',
                labels: 'omg eth token erc20 ecr20'
            }
        ]
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
                'title',
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
                        <Item onClick={e => onClick(asset.url)}>
                            <ItemIco>
                                <img src={asset.logo} width="20" height="20" />
                            </ItemIco>
                            <ItemText>
                                <ItemTitle>{asset.name}</ItemTitle>
                                <ItemSubtitle>{asset.title}</ItemSubtitle>
                            </ItemText>
                        </Item>
                    ))}
                </Items>
            </RightContent>
        </RightContainerPadding>
    )
}

const Items = styled.div``
const Item = styled.div`
    height: 34px;
    width: calc(50% - 50px);
    float: left;
    margin-bottom: 20px;
    margin-right: 20px;
    padding: 20px;
    background-color: ${styles.color.background1};
    border-radius: 5px;
    cursor: pointer;
    color: ${styles.color.black};
    &:hover {
        color: white;
        background-color: ${styles.color.background2};
    }
    &:nth-child(even) {
        margin-right: 0;
    }

    ${styles.media.third} {
        float: none;
        clear: both;
        width: calc(100% - 40px);
        margin-right: 0;
    }
`
const ItemIco = styled.div`
    padding-top: 2px;
    float: left;
`
const ItemText = styled.div`
    float: left;
    padding-left: 10px;
`
const ItemTitle = styled.div`
    color: inherit;
    letter-spacing: 0.3px;
    font-size: 20px;
    font-weight: 900;
    line-height: 20px;
`
const ItemSubtitle = styled.div`
    font-size: 14px;
`
