import React from 'react'
import styled from 'styled-components'
import styles from '/const/styles'

export function Wizard(props) {
    return (
        <WizardStyled {...props}>
            <div className="wizardBackground" />
            <div className="wizardItems">
                <div>{props.children}</div>
            </div>
        </WizardStyled>
    )
}

export function WizardItem(props) {
    let label
    if (typeof props.label == 'string')
        label = <div className="wizardLabel">{props.label}</div>

    return (
        <WizardItemStyled {...props}>
            <div className="wizardNumber">{props.children}</div>
            {label}
        </WizardItemStyled>
    )
}

const marginRight = 50
const widthItem = 76

const WizardStyled = styled.div`
    box-sizing: content-box;
    position: relative;
    height: 76px;

    & .wizardBackground {
        box-sizing: content-box;
        position: absolute;
        background-color: ${styles.color.grey2};
        height: 16px;
        width: 100%;
        top: 32px;
        border-radius: 20px;
    }
    & .wizardItems {
        box-sizing: content-box;
        position: absolute;
        width: 100%;
    }
    & .wizardItems > div {
        box-sizing: content-box;
        width: ${props => {
            const totalItems = props.children[1].children[0].children.length
            return widthItem * totalItems + marginRight * (totalItems - 1)
        }}px;
        margin: 0 auto;
    }
    & .wizardItems > div > div {
        box-sizing: content-box;
        float: left;
        margin-right: ${marginRight}px;
    }
    & .wizardItems > div > div:last-child {
        box-sizing: content-box;
        margin-right: 0;
    }
`

const WizardItemStyled = styled.div`
    box-sizing: content-box;
    width: ${widthItem}px;
    & .wizardNumber {
        box-sizing: content-box;
        background-color: ${props => {
            switch (String(props.status)) {
                case '1':
                    return styles.color.grey3
                    break
                case '2':
                    return styles.color.background3
                    break
                case '3':
                    return styles.color.front3
                    break
            }
        }};
        transition: 0.75s ease background-color;
        border-radius: 50%;
        text-align: center;
        color: white;
        font-weight: bold;

        width: 60px;
        height: 60px;
        border: 8px solid ${styles.color.grey2};
        font-size: 30px;
        line-height: 62px;
    }
    & .wizardLabel {
        box-sizing: content-box;
        width: 100%;
        padding-top: 5px;
        text-align: center;
        font-size: 13px;
        font-weight: bold;
        letter-spacing: 0.2px;
        color: ${props => {
            switch (String(props.status)) {
                case '1':
                    return styles.color.grey3
                    break
                case '2':
                    return styles.color.background3
                    break
                case '3':
                    return styles.color.front3
                    break
            }
        }};
    }
`
