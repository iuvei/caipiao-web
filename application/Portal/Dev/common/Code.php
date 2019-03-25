<?php
final class Code {
    // 正常，请勿修改（全局逻辑相关）
    const OK                            = 0;
    // 其他错误
    const ERROR                         = 1;
    
    
    // 【1、系统、数据库】
    // 数据库插入失败
    const DB_INSERT_ERROR               = 10001;
    // 数据库更新失败
    const DB_UPDATE_ERROR               = 10002;
    // 数据库删除失败
    const DB_DELETE_ERROR               = 10003;
    // 系统异常默认值
    const SYSTEM_EXCEPTION              = 10004;
    // 数据异常
    const DATA_EXCEPTION                = 10005;
    
    // 【2、外部参数、方式、判断】
    // 参数不合法
    const PARAM_INVALID                 = 20001;
    // 提交方式不允许
    const METHOD_NOT_ALLOWED            = 20002;
    // 参数不全
    const PARAM_NOT_ENOUGH              = 20003;
    // 参数不在枚举内
    const PARAM_NOT_IN_ENUM_LIST        = 20004;
    // 含有非法字符
    const STRING_CONTAIN_INVALID_CHAR   = 20005;
    
    
    // 【3、权限、认证】
    // 需要登录
    const NEED_LOGIN                    = 30001;
    // 密码错误
    const PASSWD_WRONG                  = 30002;
    // 非法认证
    const AUTH_INVALID                  = 30003;
    // 权限不足
    const POWER_LACK                    = 30004;
    // 令牌过期
    const TOKEN_EXPIRED                 = 30005;
    // 令牌不合法
    const TOKEN_INVALID                 = 30006;
    // 用户未注册
    const NOT_REGISTERED                = 30007;
    // 邮箱已被注册
    const EMAIL_HAS_BEEN_USED           = 30008;

    
    // 【4、服务器环境】
    // 上传失败
    const UPLOAD_FAILED                 = 40001;
    // 上传文件失败
    const UPLOAD_FILE_FAILED            = 40002;
    // 没有写入权限
    const NO_WRITE_PERMISSION           = 40003;
    
    
    // 【5、业务逻辑】
    // 非法操作
    const OPERATION_INVALID             = 50001;
    // 操作不能被完成
    const OPERATION_CANNOT_DONE         = 50002;
    // 重复写
    const WRITE_DUPLICATED              = 50003;
    // 对象不存在
    const OBJECT_NOT_EXISTS             = 50004;
    // 操作达到限制
    const OPERATION_REACH_LIMIT         = 50005;
    // 操作重复
    const OPERATION_REPEATED            = 50006;
    // 操作过于频繁
    const OPERATION_FREQUENCY_LIMITED   = 50007;
    
    // 【7、输出结果】
    // Response 400
    const BAD_REQUEST                    = 70400;
    // Response 403
    const FORBIDDEN                      = 70403;
    // 找不到结果
    const NOT_FOUND                      = 70404;



}
