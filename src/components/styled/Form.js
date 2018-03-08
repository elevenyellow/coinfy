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
        clear: both;
    }
`

export const FormFieldLeft = styled.div`
    float: left;
    width: calc(40% - 10px);
    padding-right: 10px;
    ${styles.media.fourth} {
        float: none;
        width: 100%;
        padding-right: 0;
        padding-bottom: 5px;
    }
`

export const FormFieldRight = styled.div`
    float: left;
    width: ${props => props.width || '60%'};
    position: relative;
    ${styles.media.fourth} {
        float: none;
        width: 100%;
    }
`

export const FormFieldButtons = styled.div`
    float: right;
    width: ${props => props.width || 'auto'};
`

export const FormFieldButtonLeft = styled.div`
    float: left;
    width: ${props => props.width || 'auto'};
`

export const FormFieldButtonRight = styled.div`
    float: right;
    width: ${props => props.width || 'auto'};
`
