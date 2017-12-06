import React, { Component } from 'react'
import styled from 'styled-components'
import styles from '/const/styles'
import H2 from '/components/styled/H2'

export default function Section(props) {
    return (
        <SectionStyled {...props}>
            <H2 size="20px" {...props}>
                {props.children}
            </H2>
        </SectionStyled>
    )
}

const SectionStyled = styled.div`
    margin: 30px 0 10px 0;
`
