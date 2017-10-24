import React from 'react'
import styled from 'styled-components'
import styles from '/const/styles'


export function RightContainer({ children }) {
    return (
        <RightContainerTemplate>
            <div>{children}</div>
        </RightContainerTemplate>
    )
}


export const RightContainerTemplate = styled.div`
height: 100%;
overflow-y: auto;
margin-left: ${styles.leftColumn};
box-shadow: inset 4px 0 4px -2px rgba(0,0,0,.1);
&::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}
&::-webkit-scrollbar-thumb {
    background: ${styles.color.background4};
    cursor: grab;
    border-radius: 3px;
}
&::-webkit-scrollbar-track {
    background: transparent;
}

& > div {
  height: 100%;
  width: 100%;
}
  
${styles.media.first} {
  margin-left: 0;
  box-shadow: none; 
}
`

export const RightContainerPadding = styled.div`
padding: ${styles.paddingContent};
${styles.media.first} {
    padding: ${styles.paddingContentMobile};
}
`

export const RightContainerMiddle = styled.div`
display:table;
width: 100%;
height:100%;
& > * {
  display:table-cell;
  height: 100%;
  vertical-align: middle;
}
`

export const RightHeader = styled.div`
margin-bottom: ${styles.paddingContent};
${styles.media.first} {
    margin-bottom: ${styles.paddingContentMobile};
}
`

export const RightContent = styled.div`
`

// export const RightContentContent = styled.div`
// `

// export const RightContentInner = styled.div`
// padding-top: 40px;
// `




export const RightContentMenu = styled.div`
width: 100%;
height: 38px;
clear: both;
margin-bottom: ${styles.paddingContent};
border-bottom: 2px solid ${styles.color.background1};
`


export const RightContentMenuItem = styled.div`
float:left;
padding: 10px 20px;
border-bottom: 2px solid transparent;
cursor: pointer;
color: ${styles.color.grey1};
&:hover {
    border-bottom-color: ${styles.color.background2};
    color: ${styles.color.background2};
}

${props=>{
    if (props.disabled) {
      return `
      color: ${styles.color.disabled} !important;
      cursor: default;
      border-bottom-color: transparent !important;
      `
    }
    else if (props.selected && props.disabled!==true) {
        return `
        border-bottom-color: ${styles.color.background2};
        color: ${styles.color.background2};
        `
    }
}}
`

export const RightContentMenuItemIcon = styled.div`
display: none;
float:left;
margin-right: 10px;
top: -2px;
position: relative;
transform: ${props=>props.transform||'auto'};
& svg {
    width: 15px;
    height: 15px;
}
`

export const RightContentMenuItemText = styled.div`
color: ${props=>props.color||'inherit'};
font-size: 13px;
font-weight: 100;
letter-spacing: 0.5px;
`



