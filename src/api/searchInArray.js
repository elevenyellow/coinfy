export default function searchInArray(
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
