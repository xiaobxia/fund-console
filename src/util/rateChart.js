/**
 * Created by xiaobxia on 2018/6/28.
 */
const codeMap = {
  'chuangye': {
    code: 'sz399006',
    name: '创业',
    threshold: 0.94,
    wave: 0.9277112676056345,
    rate: 0.9621341463414633,
    average: 3,
    mix: true,
    up: 136.55,
    upDay: 117,
    down: -165.46,
    downDay: 148,
    incomeHighRate: true,
    noLong: true
  },
  'yiyao': {
    code: 'sh000037',
    name: '医药',
    attach: 'chuangye',
    threshold: 0.94,
    rate: 0.9339416058394158,
    wave: 0.9391726618705037,
    average: 2.5,
    up: 160.94,
    upDay: 121,
    down: -184.03,
    downDay: 144,
    incomeHighRate: true,
    noLong: true
  },
  'jisuanji': {
    code: 'sz399363',
    name: '计算机',
    attach: 'chuangye',
    threshold: 1.04,
    rate: 1.0100719424460431,
    wave: 1.06308,
    average: 3,
    up: 167.10,
    upDay: 119,
    down: -196.42,
    downDay: 146,
    incomeHighRate: true,
    noLong: true
  },
  'dianzi': {
    code: 'sz399811',
    name: '电子',
    attach: 'chuangye',
    threshold: 0.9,
    rate: 0.8832450331125826,
    wave: 0.9248263888888891,
    average: 3,
    up: 132.40,
    upDay: 115,
    down: -176.17,
    downDay: 150,
    noLong: true
  },
  'wulin': {
    code: 'sh000016',
    name: '50',
    threshold: 0.73,
    rate: 0.7160122699386505,
    wave: 0.7482424242424242,
    average: 2,
    mix: true,
    up: 115.65,
    upDay: 135,
    down: -133.44,
    downDay: 130,
    stable: true
  },
  'yinhang': {
    code: 'sz399986',
    name: '银行',
    attach: 'wulin',
    threshold: 0.7,
    rate: 0.6845000000000002,
    wave: 0.7059375,
    average: 2,
    up: 115.91,
    upDay: 129,
    down: -127.37,
    downDay: 136,
    stable: true
  },
  'shipin': {
    code: 'sz399396',
    name: '食品',
    attach: 'wulin',
    threshold: 0.85,
    rate: 0.7876623376623377,
    wave: 0.9127884615384618,
    average: 3,
    up: 144.33,
    upDay: 124,
    down: -165.08,
    downDay: 141
  },
  'jungong': {
    code: 'sz399959',
    name: '军工',
    attach: 'chuangye',
    threshold: 0.93,
    wave: 0.9716906474820142,
    rate: 0.8817687074829932,
    average: 2,
    up: 138.31,
    upDay: 129,
    down: -165.67,
    downDay: 136
  },
  'xinxi': {
    code: 'sh000993',
    name: '信息',
    attach: 'chuangye',
    threshold: 1.03,
    rate: 1.0703999999999998,
    wave: 0.9838741721854306,
    average: 3,
    up: 144.75,
    upDay: 117,
    down: -180.78,
    downDay: 148,
    incomeHighRate: true,
    noLong: true
  },
  'jijian': {
    code: 'sz399995',
    name: '基建',
    threshold: 0.62,
    rate: 0.619496855345912,
    wave: 0.628292682926829,
    average: 3,
    up: 84.87,
    upDay: 111,
    down: -114.35,
    downDay: 154,
    incomeHighRate: true,
    noLong: true
  },
  'huanbao': {
    code: 'sh000827',
    name: '环保',
    threshold: 0.67,
    rate: 0.6970833333333336,
    wave: 0.6393312101910825,
    average: 3,
    up: 83.86,
    upDay: 120,
    down: -122.27,
    downDay: 145,
    noLong: true
  },
  'qiche': {
    code: 'sz399432',
    name: '汽车',
    threshold: 0.61,
    rate: 0.5677702702702703,
    wave: 0.6542647058823531,
    average: 3,
    up: 78.74,
    upDay: 125,
    down: -114.06,
    downDay: 140
  },
  'yiqian': {
    code: 'sh000852',
    name: '1000',
    threshold: 0.81,
    rate: 0.8312195121951221,
    wave: 0.7816081871345026,
    average: 3
  },
  'chuanmei': {
    code: 'sz399971',
    name: '传媒',
    attach: 'chuangye',
    threshold: 0.86,
    rate: 0.8374025974025976,
    wave: 0.8754518072289161,
    average: 3,
    up: 119.45,
    upDay: 123,
    down: -154.27,
    downDay: 142
  },
  'zhengquan': {
    code: 'sz399437',
    name: '证券',
    threshold: 0.83,
    rate: 0.8198026315789474,
    wave: 0.8370723684210525,
    average: 4,
    up: 125.78,
    upDay: 124,
    down: -154.60,
    downDay: 141
  },
  'youse': {
    code: 'sh000823',
    name: '有色',
    threshold: 0.92,
    wave: 0.8558865248226952,
    rate: 0.9762650602409638,
    average: 3,
    up: 124.79,
    upDay: 129,
    down: -158.25,
    downDay: 136
  },
  'dichan': {
    code: 'sz399393',
    name: '地产',
    attach: 'wulin',
    threshold: 0.94,
    rate: 0.9072847682119207,
    wave: 0.9646258503401361,
    average: 4,
    up: 152.86,
    upDay: 123,
    down: -175.12,
    downDay: 142,
    incomeHighRate: true
  },
  'yiliao': {
    code: 'sz399989',
    name: '医疗',
    attach: 'chuangye',
    threshold: 0.97,
    wave: 1.0519615384615388,
    rate: 0.8889999999999998,
    average: 2,
    up: 188.00,
    upDay: 126,
    down: -198.96,
    downDay: 139,
    incomeHighRate: true,
    stable: true
  },
  'shengwu': {
    code: 'sz399441',
    name: '生物',
    attach: 'chuangye',
    threshold: 0.89,
    rate: 0.8235460992907802,
    wave: 0.9630645161290321,
    average: 2,
    up: 156.94,
    upDay: 130,
    down: -179.35,
    downDay: 135,
    stable: true
  },
  'wubai': {
    code: 'sh000905',
    name: '500',
    threshold: 0.75,
    wave: 0.6947452229299363,
    rate: 0.7977976190476194,
    average: 3,
    mix: true,
    up: 104.21,
    upDay: 125,
    down: -136.18,
    downDay: 140
  },
  'gangtie': {
    code: 'sz399440',
    name: '钢铁',
    threshold: 0.84,
    wave: 0.8545666666666663,
    rate: 0.8308843537414968,
    average: 3,
    up: 135.67,
    upDay: 135,
    down: -163.66,
    downDay: 130,
    stable: true
  },
  'meitan': {
    code: 'sz399998',
    name: '煤炭',
    threshold: 0.82,
    wave: 0.8193571428571426,
    rate: 0.8109589041095889,
    average: 4,
    up: 142.32,
    upDay: 130,
    down: -170.53,
    downDay: 135
  },
  'baoxian': {
    code: 'sz399809',
    name: '保险',
    attach: 'wulin',
    threshold: 1,
    wave: 1.022290322580645,
    rate: 0.9797972972972975,
    average: 2,
    up: 134.12,
    upDay: 124,
    down: -162.67,
    downDay: 141
  },
  'sanbai': {
    code: 'sh000300',
    name: '300',
    threshold: 0.68,
    rate: 0.6461783439490445,
    wave: 0.7182926829268294,
    average: 2,
    mix: true,
    up: 106.64,
    upDay: 128,
    down: -130.22,
    downDay: 137
  }
}

const RateChart = {
  codeMap,
  formatData: function (list) {
    let listTemp = []
    for (let i = 0; i < list.length; i++) {
      listTemp.push({
        date: '' + list[i].date,
        ...list[i].kline
      })
    }
    return {list: listTemp}
  }
}

export default RateChart
