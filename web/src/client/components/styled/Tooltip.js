import React from 'react'
import styled from 'styled-components'
import styles from '/styles'


export default function(props) {
    return <Tooltip>?<div>{props.children}</div></Tooltip>
}


const Tooltip = styled.div`
display: inline-block;
position: relative;
background: ${styles.color.background5};
color: #fff;
cursor: help !important;
font-size: 11px;
text-align: center;
border-radius: 50%;
font-weight: bold;
width: 16px;
height: 15px;
margin-left: 5px;


& div {
display: none;
background: ${styles.color.front3};
color: white;
position: absolute;
top: -3px;
left: 13px;
border-radius: 3px;
width: 300px;
text-align: left;
padding: 5px 10px;
font-weight: normal;
letter-spacing: 0.3px;
line-height: 16px;
}
& div:before {
content: '?';
background: ${styles.color.front3};
position: absolute;
left: -16px;
border-radius: 50%;
font-weight: bold;
border: 3px solid white;
width: 16px;
text-align: center;
top: 0px;
}
&:hover {
    background-color: ${styles.color.front3};
}
&:hover div {
    display: block;
}
`