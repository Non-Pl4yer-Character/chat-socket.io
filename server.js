const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)

// 监听80端口
server.listen(80)
console.log('server running on port 80');

// 渲染页面
app.use('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
})

const users = []
const connections = []

// 连接服务器事件
io.sockets.on('connection', function (socket) {

    connections.push(socket)
    console.log('%s', connections.length);

    // 退出连接事件
    socket.on('disconnect', function (data) {
        users.splice(users.indexOf(data), 1)
        connections.splice(connections.indexOf(data), 1)
        console.log('%s', connections.length);
        getUser()
    })

    // 新用户登陆事件
    let username = null
    socket.on('add user', function (data, callback) {
        if (users.indexOf(data) != -1) {
            callback(false)
        } else {
            callback(true)
            users.push(data)
            username = data
        }

        getUser()
    })

    // 获得发送的信息
    socket.on('send', function (data) {
        // 将信息发给每个客户端
        io.sockets.emit('give msg', { msg: data, username: username })
    })

    function getUser() {
        io.sockets.emit('get user', users)
    }
})