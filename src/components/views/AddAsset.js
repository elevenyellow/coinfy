import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'
import { Router, Route } from '/doprouter/react'
import styles from '/const/styles'

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
                logo: '/static/image/BTC.svg',
                labels: 'btc coin'
            },
            {
                name: 'Bitcoin',
                title: 'Import wallet',
                url: routes.importbtc(),
                logo: '/static/image/BTC.svg',
                labels: 'btc coin'
            },
            {
                name: 'Ethereum',
                title: 'Create a new wallet',
                url: routes.createeth(),
                logo: '/static/image/ETH.svg',
                labels: 'eth coin etereum'
            },
            {
                name: 'Ethereum',
                title: 'Import wallet',
                url: routes.importeth(),
                logo: '/static/image/ETH.svg',
                labels: 'eth coin etereum'
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
        const filter = state.view.filter.trim().toLowerCase()
        const assetList =
            filter.length < 2
                ? this.assetList
                : this.assetList.filter(
                      asset =>
                          asset.labels.toLowerCase().indexOf(filter) > -1 ||
                          asset.name.toLowerCase().indexOf(filter) > -1 ||
                          asset.title.toLowerCase().indexOf(filter) > -1
                  )

        return React.createElement(AddAssetTemplate, {
            location: state.location,
            assetList: assetList,
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

/* <RightContentMenu>
                    <RightContentMenuItem
                        selected={location.pathname === routesCreatebtc}
                        onClick={e => onClick(routesCreatebtc)}
                    >
                        <RightContentMenuItemImage>
                            <img
                                src="/static/image/BTC.svg"
                                width="20"
                                height="20"
                            />
                        </RightContentMenuItemImage>
                        <RightContentMenuItemText>
                            Create Bitcoin Wallet
                        </RightContentMenuItemText>
                    </RightContentMenuItem>

                    <RightContentMenuItem
                        selected={location.pathname === routesImportbtc}
                        onClick={e => onClick(routesImportbtc)}
                    >
                        <RightContentMenuItemImage>
                            <img
                                src="/static/image/BTC.svg"
                                width="20"
                                height="20"
                            />
                        </RightContentMenuItemImage>
                        <RightContentMenuItemText>
                            Import Bitcoin Wallet
                        </RightContentMenuItemText>
                    </RightContentMenuItem>
                </RightContentMenu> */
