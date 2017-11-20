import React from 'react';
import styled from 'styled-components';
import styles from '/const/styles';

export default function(props) {
    return (
        <Alert {...props}>!</Alert>
    );
}

const Alert = styled.div`
    left: ${props=>props.left||0};
    top: ${props=>props.top||0};
    display: inline-block;
    position: absolute;
    line-height: 16px;
    background: #f80f24;
    color: #fff;
    text-align: center;
    border-radius: 50%;
    font-weight: bold;
    width: 16px;
    height: 16px;
    z-index: 2;
    border: 1px solid white;
    font-size: 11px;
`;

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
