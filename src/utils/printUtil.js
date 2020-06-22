import domImage from '@/utils/domImage'
import uuid from 'uuid/v1'
import printJs from 'print-js'

export default {
  getDomImg(cid) {
    domImage.convertToImage(
      document.getElementById(cid)
    ).then((res) => {
      const div = document.createElement('div')
      const id = uuid()
      div.setAttribute('class', 'img-wrap')
      div.innerHTML = `<img id="${id}" src="${res}" alt="">`
      document.body.appendChild(div)
    }).catch(() => {
    })
  },
  print(cid) {
    document.getElementsByTagName('html')[0].classList.add('printing')
    domImage.convertToImage(
      document.getElementById(cid)
    ).then((res) => {
      document.getElementsByTagName('html')[0].classList.remove('printing')
      const div = document.createElement('div')
      const id = uuid()
      div.setAttribute('class', 'print-img-wrap')
      div.innerHTML = `<img id="${id}" src="${res}" alt="">`
      document.body.appendChild(div)
      this.$nextTick(() => {
        printJs({
          printable: id,
          type: 'html',
          targetStyles: ['*'],
          scanStyles: false
        })
        div.remove()
      })
    }).catch(() => {
      document.getElementsByTagName('html')[0].classList.remove('printing')
    })
  }
}
