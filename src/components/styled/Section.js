import React, { Component } from 'react'
import styled from 'styled-components'
import styles from '/const/styles'

export default function Section(props) {
    return <SectionStyled {...props}>{props.children}</SectionStyled>
}

const SectionStyled = styled.div`
    margin: 30px 0 15px 0;
    border-bottom: 1px dotted #e1e1e1;
    padding-bottom: 5px;
    color: #e1e1e1;
    font-size: 20px;
    font-weight: bold;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`
