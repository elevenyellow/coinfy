import React, { Component } from 'react'
import styled from 'styled-components'
import styles from '/const/styles'
import routes from '/const/routes'

import { setHref } from '/store/actions'

import Div from '/components/styled/Div'
import {
    DropDown,
    DropDownItem,
    DropDownMenu,
    DropDownArrow
} from '/components/styled/Dropdown'

export default function Header() {
    return (
        <HeaderDiv>
            <HeaderContent>
                <HeaderLeft
                    onClick={e => {
                        setHref(routes.home())
                    }}
                >
                    Logo
                </HeaderLeft>
                <HeaderCenter>
                    <HeaderCrypto>
                        BTC / <strong>$4200.3</strong>
                    </HeaderCrypto>
                    <HeaderCrypto>
                        BCH / <strong>$601.5</strong>
                    </HeaderCrypto>
                </HeaderCenter>
                <HeaderRight>
                    <DropDown>
                        <Div onClick={() => alert(1)}>
                            <HeaderCurrencySelected>USD</HeaderCurrencySelected>
                            <DropDownArrow />
                        </Div>
                        <DropDownMenu visible={false} right="0" top="25px">
                            <DropDownItem>USD</DropDownItem>
                            <DropDownItem>EUR</DropDownItem>
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
`
const HeaderCenter = styled.div`
    width: calc(100% - ${styles.leftColumn} - 100px);
    float: left;
    text-align: center;
`
const HeaderRight = styled.div`
    width: 100px;
    float: Left;
    text-align: right;
    position: relative;
`

const HeaderCrypto = styled.span`
    font-size: 13px;
    letter-spacing: .2px;
    color: ${styles.color.front1};
    padding-right: 25px;
    font-weight: 300;
`

const HeaderCurrencySelected = styled.span`
    font-size: 14px;
    color: ${styles.color.front1};
    font-weight: bold;
    padding-right: 4px;
`
