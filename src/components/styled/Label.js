import styled from 'styled-components'
import styles from '/const/styles'

export const Label = styled.label`
    font-weight: 600;
    margin-bottom: 0px;
    line-height: 20px;
    color: ${styles.color.front3};
    font-size: ${props => props.size || '15px'};
`

export const SubLabel = styled.div`
    color: ${styles.color.front2};
    font-size: 12px;
    line-height: 15px;
`
