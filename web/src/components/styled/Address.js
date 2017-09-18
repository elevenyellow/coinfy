import React from 'react'
import styled from 'styled-components'
import styles from '/const/styles'

export default function(props) {
    return (
        <Address
            {...props}
            onClick={e => {
                const node = e.target
                if (document.selection) {
                    const range = document.body.createTextRange()
                    range.moveToElementText(node)
                    range.select()
                } else if (window.getSelection) {
                    const range = document.createRange()
                    range.selectNodeContents(node)
                    window.getSelection().removeAllRanges()
                    window.getSelection().addRange(range)
                }
                if (typeof props.onClick == 'function') props.onClick(e)
            }}
        >
            <span>
                {props.children}
            </span>
        </Address>
    )
}

const Address = styled.div`
    border-radius: 4px;
    background: #fff;
    padding: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;
    text-align: center;

    & span {
        display: inline-block;
        font-family: monospace;
        font-size: 16px;
        color: ${props=>props.color||styles.color.front5};
    }
`
//border: 1px solid ${styles.color.background4};
