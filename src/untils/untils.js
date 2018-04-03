var Week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
function formatWeek () {
  var now = new Date()
  var week = Week[now.getDay()]
  var month = now.getMonth() + 1
  var day = now.getDate()
  day < 10 && (day = '0' + day)
  return month + '-' + day + '(' + week + ')'
}

export {
  formatWeek
}
