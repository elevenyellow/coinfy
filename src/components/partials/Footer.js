import React, { Component } from 'react'
import styled from 'styled-components'
import styles from '/const/styles'
import { version, repository } from './../../../package.json'

export default function Footer() {
    return (
        <FooterDiv>
            <div>
                <a href={repository} target="_blank">
                    {' '}
                    Version: {version}
                </a>
            </div>
        </FooterDiv>
    )
}

const FooterDiv = styled.div`
    /* height: ${styles.paddingOut}; */
    padding: 0 ${styles.paddingOut};
    ${styles.media.second} {
        div {
            display: none;
        }
    }
    div {
        padding-top: 15px;
    }
    a {
        font-size: 12px;
        color: #000;
        font-weight: bold;
        letter-spacing: 0.2px;
        display: block;
        padding-left: 10px;
        opacity: 0.3;
    }
    a:hover {
        opacity: 0.5;
    }

`
