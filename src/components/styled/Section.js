import React, { Component } from 'react'
import styled from 'styled-components'
import styles from '/const/styles'

export default function Section(props) {
    return <SectionStyled {...props}>{props.children}</SectionStyled>
}

const SectionStyled = styled.div`
    margin: 30px 0 10px 0;
    color: #e1e1e1;
    font-size: 20px;
    font-weight: bold;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`
