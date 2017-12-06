import styled from 'styled-components'
import styles from '/const/styles'

export default styled.h2`
    color: ${styles.color.grey1};
    margin: 0;
    font-size: ${props => props.size || '15px'};
    font-weight: 300;
    letter-spacing: 0.5px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`
