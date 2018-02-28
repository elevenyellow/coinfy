export function highest(array) {
    return array.reduce((highest, fee) => (fee > highest ? fee : highest))
}
export function lowest(array) {
    return array.reduce((lowest, fee) => (fee < lowest ? fee : lowest))
}
export function median(array) {
    return array.reduce((sum, current) => sum + current) / array.length
}
export function sum(array) {
    return array.length > 0
        ? array
              .filter(n => typeof n == 'number' && !isNaN(n))
              .reduce((x, y) => x + y)
        : 0
}

export function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
}

// https://github.com/Josenzo/sortBy
export const sortBy = (Array.prototype.sortBy = (function() {
    // Utility to get deep properties by the path given
    var get = function(obj, path) {
        try {
            for (var i = 0; i < path.length - 1; i++) obj = obj[path[i]]

            return obj[path[i]]
        } catch (e) {
            return obj
        }
    }

    return function() {
        var property,
            one,
            two,
            diff,
            i = 1,
            total = arguments.length,
            array = arguments[0],
            properties = [],
            tproperties = total - 1

        if (array.length > 0) {
            // If is called as method of the array itself
            if (this instanceof Array) {
                array = this
                tproperties = total
                i = 0
            }

            // Storing the properties needed for the search
            for (; i < total; i++) {
                property = {}
                property.asc = 1
                property.path = arguments[i].split('.')
                property.isdeep = property.path.length > 1
                property.name = property.path[0]

                // Reverse
                if (
                    property.name.charAt(0) == '-' &&
                    !array[0].hasOwnProperty(property.name)
                ) {
                    property.asc = -1
                    property.name = property.path[0] = property.name.slice(1)
                }

                properties.push(property)
            }

            array.sort(function check(a, b, j) {
                // We check if the number is passed as parameter, if not we define it as 0 because is the first property to check
                if (typeof j != 'number') j = 0
                else if (j > tproperties - 1)
                    // If j is greater than the total of arguments mean that we checked all the properties and all of them give us 0
                    return 0

                property = properties[j]

                // If the property is deep
                if (property.isdeep) {
                    one = get(a, property.path)
                    two = get(b, property.path)
                } else {
                    one = a[property.name]
                    two = b[property.name]
                }

                // The check
                if (one === two) diff = 0
                else if (typeof one == 'string')
                    diff = (one > two ? 1 : -1) * property.asc
                else if (
                    typeof one == 'number' ||
                    typeof one == 'boolean' ||
                    one instanceof Date
                )
                    diff = (one - two) * property.asc
                else return 1

                // If diff is 0 we should recall the check function to check the other properties
                return diff || check(a, b, j + 1)
            })
        }

        return array
    }
})())

export default sortBy
/*

// Example of use:

var data = [
    {id:4, name:"Josema", age:34, work: {isworking:true} }, 
    {id:5, name:"Enzo", age:29, work: {isworking:true} }, 
    {id:2, name:"Josema", age:29, work: {isworking:false} }, 
    {id:1, name:"Enzo", age:29, work: {isworking:false} }, 
    {id:3, name:"Enzo", age:34, work: {isworking:false} }
];

// console.log( data.sortBy('name', 'work.isworking', '-age', 'id') );
// or this way if you dont want to create a new array
console.log( sortBy(data.slice(0), 'name', 'work.isworking', '-age', 'id') );

*/

export function searchInArray(
    list,
    sentence_original,
    props_list,
    min_letters = 2
) {
    const sentence = sentence_original.trim().toLowerCase()
    const words = sentence.split(' ').filter(e => e.length > 1)
    return sentence.length < min_letters
        ? list
        : list.filter(item => {
              const props =
                  props_list === undefined ? Object.keys(item) : props_list
              for (let i = 0; i < words.length; ++i) {
                  let notFounds = 0
                  props.forEach(prop => {
                      if (
                          !item.hasOwnProperty(prop) ||
                          item[prop].toLowerCase().indexOf(words[i]) === -1
                      )
                          notFounds += 1
                  })
                  if (notFounds === props.length) return false
              }

              return true
          })
}
