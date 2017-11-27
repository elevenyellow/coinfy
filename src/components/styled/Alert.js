import React from 'react'
import styled from 'styled-components'
import styles from '/const/styles'
import IconInfo from 'react-icons/lib/ti/info-large'

export default function Alert({ children }) {
    return (
        <AlertStyled>
            <div className="icon">
                <IconInfo size={20} color="#d7b584" />
            </div>
            <div className="text">{children}</div>
        </AlertStyled>
    )
}

const AlertStyled = styled.div`
    & > div {
    }
    & .icon {
        width: 20px;
        /* margin-right: 8px; */
        padding: 2px;
        border-radius: 50%;
        /* box-shadow: 0px 1px 0.1px rgba(0, 0, 0, 0.3); */
        float: left;
    }
    & .text {
        color: #d7b584;
        font-weight: bold;
        font-size: 11px;
        letter-spacing: 0.3px;
        padding-top: 7px;
        padding-left: 10px;
    }
`
