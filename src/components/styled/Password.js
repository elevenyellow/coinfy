import React from 'react'
import styled from 'styled-components'
import styles from '/const/styles'
import Input from '/components/styled/Input'
import { getPasswordStrength } from '/api/crypto'

const colors = {
    1: styles.color.error,
    2: '#ffac01',
    3: '#cccf0c',
    4: '#89a24c',
    5: '#28bc05'
}

const strenghs = {
    1: '',
    2: 'Weak. ',
    3: 'Medium. ',
    4: 'Medium. ',
    5: 'Excelent!'
}

export default function Password(props) {
    const min_password = props.minlength
    const password = props.value || ''
    const strength = getPasswordStrength(
        password,
        min_password,
        getMessages(min_password)
    )
    const score = password.length === 0 ? 0 : strength.score + 1
    const color = colors[score]
    const message =
        strength.message == undefined ? 'Excelent!' : strength.message
    const label =
        password.length === 0 ? null : (
            <PasswordLabel color={color}>{message}</PasswordLabel>
        )
    return (
        <PasswordStyled>
            <Input
                {...props}
                invalid={password.length > 0 && password.length < min_password}
            />
            <PasswordIndicator score={score} total={5} />
            {label}
        </PasswordStyled>
    )
}

function PasswordIndicator({ total, score }) {
    // const width = 100 / total
    const indicators = []

    for (let i = 1, color; i <= total; ++i) {
        color = i <= score ? colors[score] : null
        indicators.push(<PasswordIndicatorStyled color={color} />)
    }

    return <div>{indicators}</div>
}

function getMessages(min_password) {
    return {
        length: 'Invalid. At least ' + min_password + ' characters',
        lowercase: 'Add an optional lowercase letter',
        uppercase: 'Add an optional upper case letter',
        numbers: 'Add an optional number',
        specials: 'Add an optional special character'
    }
}

const PasswordStyled = styled.div`
    position: relative;
`

const PasswordIndicatorStyled = styled.div`
    float: left;
    width: calc(20% - 2px);
    height: 3px;
    background-color: ${props => props.color || '#EEE'};
    margin: 1px 2px 1px 0;
    :first-child {
        margin-left: 0;
        width: calc(20% - 1px);
    }
    :last-child {
        margin-right: 0;
        width: calc(20% - 1px);
    }
`
const PasswordLabel = styled.div`
    text-align: right;
    color: ${props => props.color || styles.color.front2};
    font-size: 10px;
    font-weight: bold;
    letter-spacing: 0.3px;
    position: absolute;
    right: 0;
    bottom: -18px;
`
