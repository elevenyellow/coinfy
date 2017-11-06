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



export const RightHeader = styled.div`
margin-bottom: ${styles.paddingContent};
${styles.media.first} {
    margin-bottom: ${styles.paddingContentMobile};
}
`

export const RightContent = styled.div`
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
export const RightContainerMiddle2 = styled.div`
padding-top: 100px;
${styles.media.second} {
    padding: 0;
}
`

// export const RightContentContent = styled.div`
// `

// export const RightContentInner = styled.div`
// padding-top: 40px;
// `