const Mock = require('mockjs')

// login.err_code 100为无误 101 账号不存在 102 密码错误 103 服务器错误
// register.err_code  100为无误 101为 账号已被注册 102 服务器错误
// register.err_code 100 为无误 101为服务器错误
const mockData = {
  // 登陆请求
  login: Mock.mock({
    'status': true,
    'err_code|100-102': 100
  }),
  // 注册请求
  register: Mock.mock({
    'status': true,
    'err_code|100-101': 100
  }),
  // 添加配置接口
  addConfig: Mock.mock({
    'status': true,
    'err_code|100-101': 100
  }),
  config: Mock.mock({
    'status': true,
    'data': {
      'focus_mins': 25,
      'relax_mins': 5,
      'relax_long_mins': 20,
      'relax_long_count': 4,
      'use_notification': true,
      'auto_focus': false,
      'auto_relax': false
    },
    'err_code|100-101': 100
  }),
  // 清单数据
  // list已经按照start_time排序
  list: Mock.mock({
    'status': true,
    'have_todaylists': true,
    'list|10': [
      {
        'list_id|+1': 1,
        'title': '这是一个任务清单',
        'start_time|1': ['2018-3-17', '2018-3-12', '2018-2-12', '2017-11-8', '2016-10-8'],
        'end_time|1': ['2018-3-17', '2018-3-12', '2018-2-12', '2017-11-8', '2016-10-8'],
        'start_date': '',
        'end_date': '',
        'summary': '',
        'label|1': ['工作', '学习', '生活'],
        'tmt_counts|4-5': 4,
        'complete': false,
        'complete_counts': 3
      }
    ],
    'err_code': 100
  }),
  // 删除清单请求
  delList: Mock.mock({
    'status': true,
    'err_code': 101
  }),
  // 搜索清单请求 接收时间参数
  searchList: Mock.mock({
    'status': true,
    'list|5': [
      {
        'list_id|+1': 1,
        'title': '这是一个任务清单',
        'start_time|1': ['2018-3-17', '2018-3-12', '2017-11-8'] ,
        'summary': '',
        'label|1': ['工作', '学习', '生活'],
        'tmt_counts|4-5': 4
      }
    ],
    // 101服务器内部错误
    'err_code': 101
  }),
  // 增加清单请求
  addList: Mock.mock({
    'status': true,
    // 101服务器内部错误
    'err_code': 101
  }),
  // 增加完成请求
  addCompleteList: Mock.mock({
    'status': true,
    // 101服务器内部错误
    'err_code': 101
  }),
  // 初始时间请求
  initialTime: Mock.mock({
    'status': true,
    'data': {
      'workMin': 25,
      'relaxMin': 5
    }
  }),
  // 获取一条成功的番茄记录
  // addTimeDone: Mock.mock({
  //   'status': true,
  //   // 101服务器内部错误
  //   'err_code': 101
  // }),
  // 获取一条放弃的番茄记录
  addTimeQuit: Mock.mock({
    'status': true,
    // 101服务器内部错误
    'err_code': 101
  }),
  // 获取一条成功的番茄记录
  addPromo: Mock.mock({
    'status': true,
    // 101服务器内部错误
    'err_code': 101
  }),
  // 添加今日统计分钟数
  addCountMins: Mock.mock({
    'status': true,
    // 101服务器内部错误
    'err_code': 101
  }),
  // 返回今日统计分钟数
  countMins: Mock.mock({
    'status': true,
    "count_mins": 40,
    "err_code": 1
  }),
  // 返回折线图数据--每天的番茄数
  countLineChart: Mock.mock({
    'status': true,
    'data': {
      'xdata': ['3-12', '3-13', '3-14', '3-15', '3-16', '3-17', '3-18'],
      'ydata': [5, 20, 36, 0, 10, 20, 0],
      'allMins': 110
    },
    'err_code': 101
  }),
  // 返回饼图数据--以标签为主的时间数
  countPieChart: Mock.mock({
    'status': true,
    'data': {
      'legend': ['工作', '学习', '生活', '运动', '其他'],
      'data': [
        {value: 11, name: '工作'},
        {value: 14, name: '学习'},
        {value: 1, name: '生活'},
        {value: 70, name: '运动'},
        {value: 18, name: '其他'}
      ]
    },
    'err_code': 101
  }),
  // 返回柱状图数据
  countBarchart: Mock.mock({
    'status': true,
    'data': {
      'xdata': ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      'ydata': [1, 2, 1.1, 2, 5, 2, 1],
      'bestday': ['周四'],
      'bestdate': [9]
    },
    'err_code': 101
  }),
  // 已完成的番茄数据
  completedPromo: Mock.mock({
    'status': true,
    'data|3-10': [
      {
        'date|1': ['2018-3-17', '2018-3-12', '2017-11-8'],
        'allmins': '110',
        'promoList|1-3': [{
          'list_id|+1': 1,
          'title': '完成一个任务',
          'label|1': ['工作', '学习', '生活', '运动'],
          'start_date': '9:10',
          'end_date': '10:10',
          'summary|1': ['很开心', '']
        }]
      }
    ],
    'err_code': 101
  }),
  // // 接收到添加的番茄数据--主要是添加总结
  // addPromo: Mock.mock({
  //   'status': true,
  //   'err_code': 101
  // }),
  delPromo: Mock.mock({
    'status': true,
    'err_code': 101
  }),
  confirmPass: Mock.mock({
    'status': true,
    'err_code': 101
  }),
  changePass: Mock.mock({
    'status': true,
    'err_code': 101
  }),
  completeList: Mock.mock({
    'status': true,
    'data|3-10': [
      {
        'list_id|+1': 1,
        'title': '完成一个任务',
        'label|1': ['工作', '学习', '生活', '运动'],
        'summary|1': ['很开心', ''],
        'start_time|1': ['2018-3-17', '2018-3-12', '2018-2-12', '2017-11-8', '2016-10-8'],
        'end_time|1': ['2018-3-17', '2018-3-12', '2018-2-12', '2017-11-8', '2016-10-8'],
        'plane_start_time|1':  ['2018-3-17', '2018-3-12', '2018-2-12', '2017-11-8', '2016-10-8'],
        'plane_end_time|1':  ['2018-3-17', '2018-3-12', '2018-2-12', '2017-11-8', '2016-10-8'],
        'tmt_counts|1': [4,5,1,2,7],
        'complete': true,
        'complete_counts|1': [4,5,1,2,7],
        'plan_days': 1,
        'real_days': 12
        // 'status|1': [0,1,2]
      }
    ],
    'err_code': 101
  }),
  delCompleteList: Mock.mock({
    'status': true,
    'err_code': 101
  }),
  changeCompleteList: Mock.mock({
    'status': true,
    'err_code': 101
  }),
  countData: Mock.mock({
    'status': true,
    'data': {
      "historyCountMins": 100,
      "historyCountPromos": 11,
      "historyCountList": 10
    },
    'err_code': 1
  }),
  userStatus: Mock.mock({
    'status': true,
    'is_first_in': false,
    'is_show': true,
    'data': {
      'date': '2018-04-11',
      'count_promo': 1,
      'count_list': 1,
      'count_mins': 20,
      'count_label': [
        {value: 10, name: '工作'},
        {value: 14, name: '学习'}
      ],
      'promo_list|3': [
        {
          'title': "完成了一个任务",
          'start_time': '9:00',
          'end_time': '10:00'
        }
      ]
    },
    'err_code': 1
  })
}
module.exports = mockData