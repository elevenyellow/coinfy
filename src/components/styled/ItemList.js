import styled from 'styled-components'
import styles from '/const/styles'

export const ItemsList = styled.div`
    clear: both;
`

export const ItemList = styled.div`
    clear: both;
    color: ${props => (props.selected ? 'black' : styles.color.front3)};
    border-radius: 5px;
    margin-bottom: 10px;
    background-color: ${props =>
        props.selected ? styles.color.background1 : 'transparent'};
`

export const ItemListInner = styled.div`
    min-height: 46px;
    padding: 0 12px 0 12px;
`

export const ItemListItemRadio = styled.div`
    float: left;
    margin-right: 10px;
    padding-left: 5px;
    padding-top: 13px;
`
export const ItemListItemLeft = styled.div`
    float: left;
    font-weight: bold;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 85%;
    padding-top: 12px;
    cursor: text;
    user-select: text;
    ${styles.media.fourth} {
        float: none;
        padding-top: 4px;
        font-size: 14px;
    }
`
export const ItemListItemRight = styled.div`
    float: right;
    font-weight: bold;
    padding-top: 12px;

    ${styles.media.fourth} {
        float: none;
        padding-top: 0;
        font-size: 12px;
        margin-left: 35px;
    }
`
