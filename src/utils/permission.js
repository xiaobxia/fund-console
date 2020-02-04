function checkIn(userRoles, roleList) {
  for (let i = 0; i < userRoles.length; i++) {
    const userRole = userRoles[i]
    for (let j = 0; j < userRoles.length; j++) {
      const roleItem = roleList[j]
      if (roleItem === userRole) {
        return true
      }
    }
  }
}
function checkPermission(userRoles, current) {
  // roles :{include, exclude}
  const roleMap = current.meta && current.meta.roles
  if (roleMap) {
    let permission = true
    const include = roleMap.include
    const exclude = roleMap.exclude
    // 存在于include
    if (include) {
      permission = checkIn(userRoles, include)
    }
    // 存在于exclude
    if (exclude && checkIn(userRoles, exclude)) {
      permission = false
    }
    // exclude有决定权
    return permission
  } else {
    // 没有权限要求
    return true
  }
}

function checkPermissionWithMenu(menu, current, children) {
  const menuKey = current.meta && current.meta.menu
  if (menuKey) {
    let permission = false
    if (children) {
      permission = menu.indexOf(menuKey) !== -1
    } else {
      for (let i = 0; i < menu.length; i++) {
        if (menu[i].startsWith(`${menuKey}/`)) {
          permission = true
          break
        }
      }
    }
    return permission
  } else {
    // 没有权限要求
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (checkPermission(roles, tmp)) {
      if (tmp.children && tmp.children.length > 0) {
        tmp.children = filterAsyncRouter(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

/**
 * 通过服务端下发菜单来控制权限
 * @param routes
 * @param menu
 * @returns {Array}
 */
function filterAsyncRouterWithMenu(routes, menu) {
  const res = []
  if (menu.length === 0) {
    return res
  }
  routes.forEach(route => {
    const tmp = { ...route }
    const children = tmp.children && tmp.children.length > 0
    if (checkPermissionWithMenu(menu, tmp, !children)) {
      if (children) {
        tmp.children = filterAsyncRouterWithMenu(tmp.children, menu)
      }
      res.push(tmp)
    }
  })
  return res
}

export default {
  // 适用于roles
  checkPermission,
  filterAsyncRouter,
  // 适用于菜单模式
  filterAsyncRouterWithMenu
}
