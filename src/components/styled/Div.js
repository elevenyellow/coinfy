import React from 'react'
import styled from 'styled-components'

export default class Div extends React.Component {
    render() {
        const props = this.props
        const medias = {}

        let css = ''
        let mediaIndex
        let mediaNumber
        let mediaProperty
        Object.keys(props) /*.sort()*/
            .forEach(property => {
                if (property in document.body.style)
                    css += `${property}: ${props[property]};\n`
                else if (
                    (mediaIndex = property.indexOf('_')) &&
                    mediaIndex > -1
                ) {
                    mediaProperty = property.substr(0, mediaIndex)
                    mediaNumber = Number(property.substr(mediaIndex + 1))
                    if (mediaProperty in document.body.style) {
                        if (medias[mediaNumber] === undefined)
                            medias[mediaNumber] = ''
                        medias[mediaNumber] += `${mediaProperty}: ${
                            props[property]
                        };\n`
                    }
                }
            })

        // Adding medias
        Object.keys(medias).forEach(mediaNumber => {
            if (basic.media[mediaNumber] !== undefined) {
                css += `
        @media ${basic.media[mediaNumber]} {
          ${medias[mediaNumber]}
        }`
            }
        })

        return (
            <DivStyled css={css} {...props}>
                {props.children}
            </DivStyled>
        )
    }
}

const DivStyled = styled.div`
    box-sizing: content-box;
    ${props => props.css} ${props => props.extendTheme};
`
