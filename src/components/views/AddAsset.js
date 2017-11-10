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
import {
    RightContainerPadding,
    RightHeader,
    RightContent,
} from '/components/styled/Right'



export default class AddAsset extends Component {
    componentWillMount() {
        this.observer = createObserver(mutations => this.forceUpdate())
        this.observer.observe(state.location.path, 'length')
        this.observer.observe(state.location.path, '1')
    }

    componentWillUnmount() {
        this.observer.destroy()
    }

    shouldComponentUpdate() {
        return false
    }

    onClick(route) {
        setHref(route)
    }

    render() {
        return React.createElement(AddAssetTemplate, {
            location: state.location,
            onClick: this.onClick
        })
    }
}

function AddAssetTemplate({
    location,
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
                <Items>
                    <Item onClick={e => onClick(routes.createbtc())}>
                        <ItemIco>
                            <img src="/static/image/BTC.svg" width="20" height="20" />
                        </ItemIco>
                        <ItemText>
                            <ItemTitle>Bitcoin</ItemTitle>
                            <ItemSubtitle>Create a new wallet</ItemSubtitle>
                        </ItemText>
                    </Item>
                    <Item onClick={e => onClick(routes.importbtc())}>
                        <ItemIco>
                            <img src="/static/image/BTC.svg" width="20" height="20" />
                        </ItemIco>
                        <ItemText>
                            <ItemTitle>Bitcoin</ItemTitle>
                            <ItemSubtitle>Import wallet</ItemSubtitle>
                        </ItemText>
                    </Item>
                    <Item onClick={e => onClick(routes.createeth())}>
                        <ItemIco>
                            <img src="/static/image/ETH.svg" width="20" height="20" />
                        </ItemIco>
                        <ItemText>
                            <ItemTitle>Ethereum</ItemTitle>
                            <ItemSubtitle>Create a new wallet</ItemSubtitle>
                        </ItemText>
                    </Item>
                    <Item onClick={e => onClick(routes.importeth())}>
                        <ItemIco>
                            <img src="/static/image/ETH.svg" width="20" height="20" />
                        </ItemIco>
                        <ItemText>
                            <ItemTitle>Ethereum</ItemTitle>
                            <ItemSubtitle>Import wallet</ItemSubtitle>
                        </ItemText>
                    </Item>
                </Items>
            </RightContent>
        </RightContainerPadding>
    )
}


const Items = styled.div`
`
const Item = styled.div`
height: 34px;
width: calc(50% - 60px);
float: left;
margin-bottom: 20px;
margin-right: 20px;
padding: 20px;
background-color:${styles.color.background1};
border-radius: 5px;
cursor: pointer;
color: ${styles.color.black};
&:hover {
    color: white;
    background-color:${styles.color.background3};
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
