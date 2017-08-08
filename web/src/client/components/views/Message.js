import React, { Component } from 'react'
import styled from 'styled-components'


export default function Message({ children }) {
    return (
        <div>
            <MessageContainer>
                <MessageText>{children}</MessageText>
            </MessageContainer>
        </div>
    )
}


const MessageContainer = styled.div`
display:table;
width: 100%;
height:100%;
`
const MessageText = styled.div`
display:table-cell;
height: 100%;
text-align: center;
font-size: 30px;
font-weight: bold;
color: lightgrey;
vertical-align: middle;
`