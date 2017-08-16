import React from 'react'
import styled from 'styled-components'
import styles from '/styles'


export default function({ children }) {
    return <Address><span>{children}</span></Address>
}


const Address = styled.div`
border: 1px solid ${styles.color.background4};
border-radius: 4px;
background: #FFF;
padding: 10px;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
font-weight: 500;
text-align:center;

& span {
    display: inline-block;
    font-family: monospace;
    font-size: 16px;
    color:${styles.color.front5};
}
`
