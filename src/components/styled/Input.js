import React from 'react'
import styled from 'styled-components'
import styles from '/const/styles'

export default function Input(props) {
    const showerror =
        props.invalid && props.error ? (
            <InputError>{props.error}</InputError>
        ) : null
    return (
        <InputContainerStyled>
            <InputStyled type="text" {...props} />
            {showerror}
        </InputContainerStyled>
    )
}

const InputContainerStyled = styled.div`
    position: relative;
`

const InputStyled = styled.input`
    ${props => {
        if (props.width) return 'width:' + props.width + ';'
    }} border: 1px solid ${props =>
    props.invalid
        ? `${styles.color.error} !important`
        : styles.color.background4};

    background: ${props => {
        return typeof props.rightIco == 'string'
            ? `url('${props.rightIco}') no-repeat center right 15px / 18px #fff`
            : `#fff`
    }};



    padding: ${props => props.padding || '10px'};
    outline: none;
    font-family: monospace;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.05) inset;
    box-sizing: border-box;
    text-align: ${props =>
        props['text-align'] ? props['text-align'] : 'left'};

    font-weight: bold;
    font-size: 15px;
    color: ${props => props.color || '#000'};
    letter-spacing: 1px;

    animation: ${props =>
        props.invalid
            ? 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both'
            : 'unset'};

    @keyframes shake {
        10%,
        90% {
            transform: translate3d(-1px, 0, 0);
        }

        20%,
        80% {
            transform: translate3d(2px, 0, 0);
        }

        30%,
        50%,
        70% {
            transform: translate3d(-4px, 0, 0);
        }

        40%,
        60% {
            transform: translate3d(4px, 0, 0);
        }
    }

    &:focus {
        box-shadow: none !important;
        border-color: ${styles.color.background3};
    }
    ::-webkit-input-placeholder {
        /* Chrome */
        color: rgba(90, 97, 104, 0.4);
    }
    :-ms-input-placeholder {
        /* IE 10+ */
        color: rgba(90, 97, 104, 0.4);
    }
    ::-moz-placeholder {
        /* Firefox 19+ */
        color: rgba(90, 97, 104, 0.4);
        opacity: 1;
    }
    :-moz-placeholder {
        /* Firefox 4 - 18 */
        color: rgba(90, 97, 104, 0.4);
        opacity: 1;
    }
`
const InputError = styled.div`
    font-size: 10px;
    text-align: right;
    color: ${styles.color.error};
    font-weight: bold;
    letter-spacing: 0.3px;
    /* position: absolute;
    right: 0;
    bottom: -14px; */
`
