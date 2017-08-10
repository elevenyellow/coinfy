import React, { Component } from 'react'

export default function Route(props) {
    const { source, children } = props;

    if (props.hasOwnProperty('if'))
        if (!props.if) return

    if (props.hasOwnProperty('source')) {
        let prop
        for (prop in props) {
            if (prop!=='children' && prop!=='source' && prop!=='if') {
                if (!source.hasOwnProperty(prop)) {
                    // try neested
                }
                else {
                    
                    if (props[prop] instanceof RegExp) {
                        if (!props[prop].test(source[prop]))
                            return       
                    }
                    else if (props[prop] !== source[prop])
                        return
                }
            }
        }
    }
 
    return children
}
