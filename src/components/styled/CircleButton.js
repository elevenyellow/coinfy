import React from 'react'
import styled from 'styled-components'
import styles from '/const/styles'

export const CircleButtons = styled.div`
height: 100px;
& > * {
    float: left;
    margin-right: 42px;
}
& > *:last-child {
    margin-right: 0;
}
${styles.media.fourth} {
    width: 222px;
    margin: 0 auto;
    & > * {
        margin-right: 10px;
    }
}
`

export const CircleButton = styled.a`
cursor: pointer;
display: block;
width: 50px;
height: 50px;
border: 4px solid ${props=>props.color};
box-shadow: 0 0 0px 1px #fff inset;
background: ${props=>props.color};
border-radius: 50%;
text-align: center;
line-height: 45px;
transition: 0.5s ease all;
position: relative;
text-decoration: none;
${styles.media.fourth} {
    width: 40px;
    height: 40px;
    line-height: 35px;
    & > svg {
        width: 18px;
        height: 18px;
    }
}
& > div {
    width: 100%;
    display: none;
    font-size: 11px;
    line-height: 15px;
    padding-top: 15px;
    color: ${styles.color.front2};
}
&:hover {
    transition: 0.5s ease all;
    background-color: ${styles.color.front2};
    border-color: ${styles.color.front2};
    box-shadow: 0 0 0px 100px rgba(255, 255, 255, 0) inset;
}
&:active {
    transition: 0s;
    box-shadow: 0 0 0px 1px #fff inset;
}
&:hover > div {
    display: block;
}

& .hideOnActive {
    opacity: 1;
}
&:active .hideOnActive {
    opacity: 0;
    transition: 5s ease all;
}

& .showOnActive {
    padding-top: 5px;
    opacity: 0;
    display: none;
    color: #44bb11;
    font-size: 13px;
    transition: 3s ease all;
}
&:active .showOnActive {
    display: block;
    transition: unset;
    opacity: 1;
}
`