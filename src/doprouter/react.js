import React from 'react'


export function Router(props) {
    let children = props.children
    const childrens = Array.isArray(children) ? children : [children]
    const source = props[sourceProperty]
    for (let index=0,total=childrens.length; index<total; ++index) {
        children = childrens[index]
        if (Check(children.props, source))
            return getChildrenOfChildren(children)
    }
}

export function Route(props) {
    const { children } = props
    const source = props[sourceProperty]
    if (Check(props, source))
        return children
}

export const Show = Route


let sourceProperty = 'source'
export function setSourceProperty(name) {
    sourceProperty = name
}

let separatorChar = '-'
export function setSeparatorChar(char) {
    separatorChar = char
}



function getChildrenOfChildren(children) {
                               // react || preact
    let child = children.props.children || children.children
    return Array.isArray(child) ? child[0] : child //[0] // We can remove [0] when preact supports array of childrens. react16 already does
}

function Check(props, source) {

    if (props.hasOwnProperty('if'))
        if (!props.if)
            return false

    let prop
    for (prop in props) {
        if (prop!=='children' && prop!==sourceProperty && prop!=='if') {

            let value = source.hasOwnProperty(prop) ? 
                source[prop]
            : 
                get(source, prop.split(separatorChar));
            
            if (props[prop] instanceof RegExp) {
                if (!props[prop].test(value))
                    return false    
            }
            else if (props[prop] !== value)
                return false
        }
    }
 
    return true
}


function get(object, path) {

    if (path.length === 0)
        return object;

    for (var index=0, total=path.length, tmpobject; index<total; index++) {

        tmpobject = object[ path[index] ]

        if (index+1<total && tmpobject!==null && typeof tmpobject=='object')
            object = tmpobject

        else if (object.hasOwnProperty(path[index]))
            return tmpobject

        else
            return undefined;

    }

    return object[ path[index] ];
};