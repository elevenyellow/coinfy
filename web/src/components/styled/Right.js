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




// export const RightContentMenu = styled.div`
// float: left;
// width: 200px;
// height: 100%;
// border-right: 1px solid ${styles.color.background4};
// overflow-y: auto;
// `


// export const RightContentMenuItem = styled.div`
// clear:both;
// width: calc(100% - 35px);
// padding-bottom: 15px;
// padding-right: 15px;
// padding-left: 15px;
// padding-top: 15px;
// border-left: 5px solid transparent;
// cursor: pointer;
// color: ${styles.color.front3};
// &:hover {
//     border-left-color: ${styles.color.background2};
// }

// ${props=>{
//     if (props.disabled) {
//       return `
//       color: ${styles.color.disabled};
//       cursor: default;
//       border-left-color: transparent !important;
//       `
//     }
//     else if (props.selected && props.disabled!==true) {
//         return `
//         background-color: ${styles.color.background1};
//         border-left-color: ${styles.color.background2};
//         `
//     }
// }}
// `
// export const RightContentMenuItemImage = styled.div`
// float:left;
// margin-right: 10px;
// `
// export const RightContentMenuItemIcon = styled.div`
// float:left;
// margin-right: 10px;
// top: -3px;
// position: relative;
// transform: ${props=>props.transform||'auto'}
// `

// export const RightContentMenuItemText = styled.div`
// color: ${props=>props.color||'inherit'};
// font-weight: bold;
// font-size: 14px;
// line-height: 21px;
// `



