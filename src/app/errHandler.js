module.exports = (err, ctx) => {
    let status = 500
    
    // 如果是普通 Error 对象，转换成包含 message 的结构
    let errorBody = err
    if (err instanceof Error && !err.code) {
        errorBody = {
            code: '99999',
            message: err.message || '服务器内部错误',
            result: err.stack // 生产环境建议移除 stack
        }
    }

    switch (err.code) {
        case '10001': // 用户参数错误
        case '10106': // 验证码错误
        case '10107': // 验证码过期
        case '10007': // 密码不能为空
            status = 400
            break
        case '10101': // 令牌过期
        case '10102': // 令牌错误
        case '10103': // 未携带令牌
            status = 401
            break
        case '10108': // 没有权限
        case '10104': // 没有管理员权限
            status = 403
            break
        case '10002': // 用户已存在
        case '10003': // 邮箱存在
            status = 409
            break
        case '10004': // 用户不存在
        case '10009': // 密码错误
            status = 401
            break
        default:
            status = status || 500
    }
    
    ctx.status = status
    ctx.body = errorBody
}
