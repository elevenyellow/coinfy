import React, { Component } from 'react'
import styled from 'styled-components'
import styles from '/const/styles'


export function FormField({ children }) {
    return (
        <FormFieldTemplate>
            <div>{children}</div>
            <span />
        </FormFieldTemplate>
    )
}
const FormFieldTemplate = styled.div`
margin-bottom: 30px;
& > span {
    display: block;
    clear:both;
}
`

export const FormFieldLeft = styled.div`
float: left;
width: 40%;
${styles.media.fourth} {
    float: none;
    width: 100%;
    padding-bottom: 5px;
}
`

export const FormFieldRight = styled.div`
float: left;
width: 60%;
${styles.media.fourth} {
    float: none;
    width: 100%;
}
`

export const FormFieldButtons = styled.div`
float: right;
`