import React, { Component } from 'react'
import styled from 'styled-components'
import styles from '/styles'

export default function Footer() {
    return (
        <FooterDiv>
        </FooterDiv>
    )
}



const FooterDiv = styled.div`
height: ${styles.paddingOut};
padding: 0 ${styles.paddingOut};
`