import styled from 'styled-components'
import styles from '/const/styles'

export default styled.h1`
    color: ${styles.color.black};
    font-size: 35px;
    font-weight: 900;
    margin: 0;
    line-height: 35px;
    ${styles.media.second} {
        font-size: 27px;
        line-height: 27px;
    }
`
