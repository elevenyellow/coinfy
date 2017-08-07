import React, { Component } from 'react'
import styled from 'styled-components'
import styles from '/styles'

import Div from '/components/styled/Div'
import H1 from '/components/styled/H1'
import H2 from '/components/styled/H2'


export default function Right() {
    return (
        <RightDiv>
                <RightHeader>
                    <RightHeaderInner>
                        <Div float="left">
                            <H1>Add wallet</H1>
                            <H2>Create bitcoin wallet</H2>
                        </Div>
                        <Div clear="both" />
                    </RightHeaderInner>
                </RightHeader>
                <RightContent>
                    <RightContentMenu>

                        <RightContentMenuItem>
                            <RightContentMenuItemIcon><img src="image/bitcoin.svg" width="20" height="20" /></RightContentMenuItemIcon>
                            <RightContentMenuItemText>Import wallet</RightContentMenuItemText>
                        </RightContentMenuItem>

                        <RightContentMenuItem selected={true}>
                            <RightContentMenuItemIcon><img src="image/bitcoin.svg" width="20" height="20" /></RightContentMenuItemIcon>
                            <RightContentMenuItemText>Create new wallet</RightContentMenuItemText>
                        </RightContentMenuItem>

                        <RightContentMenuItem>
                            <RightContentMenuItemIcon><img src="image/bitcoin.svg" width="20" height="20" /></RightContentMenuItemIcon>
                            <RightContentMenuItemText>Import Ethereum</RightContentMenuItemText>
                        </RightContentMenuItem>

                    </RightContentMenu>
                    <RightContentContent>
                        <RightContentInner>
                            
                        </RightContentInner>
                    </RightContentContent>
                </RightContent>
        </RightDiv>
    )
}








const RightDiv = styled.div`
height: 100%;
width: calc(100% - ${styles.leftColumn} - ${styles.columnSeparation});
background: white;
float: right;
border-radius: 5px;
box-shadow: 0 0 3px 2px rgba(205,213,218,.4);
border: 1px solid rgba(205,213,218,.7);
`

const RightHeader = styled.div`
height: 108px;
border-bottom: 1px solid ${styles.color.background4}
`
const RightHeaderInner = styled.div`
padding: 20px 35px;
`

const RightContent = styled.div`
height: calc(100% - 108px);
`

const RightContentMenu = styled.div`
float: left;
width: 200px;
height: 100%;
border-right: 1px solid ${styles.color.background4};
overflow-y: auto;

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


const RightContentMenuItem = styled.div`
clear:both;
width: calc(100% - 40px);
padding-bottom: 15px;
padding-right: 15px;
padding-left: 20px;
padding-top: 15px;
border-left: 5px solid transparent;
cursor: pointer;
&:hover {
    border-left-color: ${styles.color.background2};
}

${props=>{
    if (props.selected) {
        return `
        cursor: inherit;
        background: ${styles.color.background1};
        border-left-color: ${styles.color.background2};
        box-shadow: 0 1px 2px -1px rgba(0,0,0,.4) inset;
        `
    }
}}
`
const RightContentMenuItemIcon = styled.div`
float:left;
margin-right: 10px;
`
const RightContentMenuItemText = styled.div`
color: ${styles.color.front3};
font-weight: bold;
font-size: 13px;
line-height: 20px;
`


const RightContentContent = styled.div`
overflow-y: auto;
height: 100%;
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

const RightContentInner = styled.div`
padding: 20px;
`
