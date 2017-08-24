import React from 'react'
import styled from 'styled-components'
import styles from '/styles'
import Input from '/components/styled/Input'
import { getPasswordStrength } from '/util/crypto'

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
    const minpassword = props.minlength
    const password = props.value
    const strength = getPasswordStrength(
        password,
        minpassword,
        getMessages(minpassword)
    )
    const score = password.length === 0 ? 0 : strength.score + 1
    const color = colors[score]
    const message =
        strength.message == undefined ? 'Excelent!' : strength.message
    const label =
        password.length === 0
            ? null
            : <PasswordLabel color={color}>
                  {message}
              </PasswordLabel>
    return (
        <div>
            <Input
                {...props}
                invalid={password.length > 0 && password.length < minpassword}
            />
            <PasswordIndicator score={score} total={5} />
            {label}
        </div>
    )
}

function PasswordIndicator({ total, score }) {
    const width = 100 / total
    const indicators = []

    for (let i = 1, color; i <= total; ++i) {
        color = i <= score ? colors[score] : null
        indicators.push(<PasswordIndicatorStyled width={width} color={color} />)
    }

    return (
        <div>
            {indicators}
        </div>
    )
}

function getMessages(minpassword) {
    return {
        length: 'Invalid. At least ' + minpassword + ' characters',
        lowercase: 'Add at least one lowercase letter',
        uppercase: 'Add an optional upper case letter',
        numbers: 'Add an optional number',
        specials: 'Add an optional special character'
    }
}

const PasswordIndicatorStyled = styled.div`
    float: left;
    width: calc(${props => props.width}% - 2px);
    height: 3px;
    background-color: ${props => props.color || '#EEE'};
    margin-top: 2px;
    border-right: 2px solid white;
    :last-child {
        border-right: 0;
        width: ${props => props.width};
    }
`
const PasswordLabel = styled.div`
    text-align: right;
    color: ${props => props.color || styles.color.front2};
    font-size: 10px;
    font-weight: bold;
    letter-spacing: 0.3px;
`
