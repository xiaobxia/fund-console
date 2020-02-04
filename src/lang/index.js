import Vue from 'vue'
import VueI18n from 'vue-i18n'
import storageUtil from '@/utils/storageUtil'
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import zhLocale from './zh'

Vue.use(VueI18n)

const messages = {
  zh: {
    ...zhLocale,
    ...elementZhLocale
  }
}

const i18n = new VueI18n({
  locale: storageUtil.getData('appConfig', 'language') || 'zh',
  messages
})

export default i18n
