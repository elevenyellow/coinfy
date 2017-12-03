import styled from 'styled-components'
import styles from '/const/styles'

export default styled.div`
    margin: 0 auto;
    width: ${props => props.width || '360px'};
    ${props => props.media || styles.media.fourth} {
        width: auto;
    }
`
