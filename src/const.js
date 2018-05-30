const port=1933

const API_URL = {
    user:{
        register:'/user/register',
        login:'/user/login',
        logout:'/user/logout'
    },
    product:{
        add: '/product/add',
        del:'/product/delete',
        update:'/product/update',
        get:'/product/get',
        getPics:'/product/getpics',
    },
    picture:{
        add:'/picture/add',
        del:'/picture/del',
        get:'/picture/get',
        getThumbnail:'/picture/thumbnail'
    }
}
const TABLE_NAME = {
    admin:'admin',
    user:'user',
    product:'product'
}
module.exports = {
    API_URL,
    TABLE_NAME,
    port
}