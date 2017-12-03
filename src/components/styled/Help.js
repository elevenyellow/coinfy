import React from 'react'
import styled from 'styled-components'
import styles from '/const/styles'

export default function(props) {
    let width = props.width || 200
    let sizeicon = 20
    let position = props.position
    let left, top
    if (position === 'left') {
        left = `${-width + 8}px`
        top = '-2px'
    } else if (position === 'right') {
        left = '16px'
        top = '-2px'
    } else {
        const halfwidth = -width / 2 + sizeicon / 2
        left = `${halfwidth}px`
        top = '16px'
    }
    return (
        <Help
            width={width + 'px'}
            left={left}
            top={top}
            position={props.position}
        >
            <span>?</span>
            <div>{props.children}</div>
        </Help>
    )
}

const Help = styled.div`
    display: inline-block;
    position: relative;
    width: 16px;
    height: 16px;
    font-size: 11px;
    cursor: help;
    top: -2px;

    & span {
        display: inline-block;
        position: absolute;
        line-height: 16px;
        background: ${styles.color.background5};
        color: #fff;
        text-align: center;
        border-radius: 50%;
        font-weight: bold;
        width: 16px;
        height: 16px;
        z-index: 2;
        border: 3px solid white;
    }
    &:hover span {
        background-color: ${styles.color.front3};
    }

    & div {
        width: ${props => props.width};
        left: ${props => props.left};
        top: ${props => props.top};

        z-index: 1;
        box-sizing: border-box;
        display: none;
        background: ${styles.color.front3};
        color: white;
        position: absolute;
        border-radius: 3px;
        text-align: ${props =>
            props.position == 'center' ? 'center' : 'left'};
        padding: 5px 10px;
        font-weight: normal;
        letter-spacing: 0.3px;
        line-height: 16px;
    }
    &:hover div {
        display: block;
    }
`

// & div:before {
//     content: '?';
//     background: ${styles.color.front3};
//     position: absolute;
//     left: -16px;
//     border-radius: 50%;
//     font-weight: bold;
//     border: 3px solid white;
//     width: 16px;
//     text-align: center;
//     top: 0px;
//     }
