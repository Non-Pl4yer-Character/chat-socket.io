$(function () {

    const $loginRoom = $('#loginRoom')
    const $loginForm = $('#loginForm')
    const $username = $('#username')
    const $chatRoom = $('#chatRoom')
    const $users = $('#users')
    const $chat = $('#chat-list')
    const $msg = $('#msg')
    const $chatForm = $('#chatForm')
    const $tips = $('#tips')
    const socket = io.connect()

    // 登陆
    $loginForm.submit(function (e) {
        e.preventDefault()

        const user = $username.val().trim()

        socket.emit('add user', user, function (bool) {
            if (bool) {
                $loginRoom.hide()
                $chatRoom.show()
            } else {
                $tips.html('用户名已被占用').show()
            }
        })

        // 获取在线用户并发送给每个用户
        socket.on('get user', function (user) {
            const html = []
            user.forEach(function (val) {
                html.push(`<li class="list-group-item"><strong>${val}</strong>在线</li>`)
            })
            $users.html(html.join(''))
        })
    })

    // 发送聊天信息
    $chatForm.submit(function (e) {
        e.preventDefault()
        const data = $msg.val()

        socket.emit('send', data)
        $msg.val('')
    })

    // 获取聊天信息并发送每个用户
    socket.on('give msg', function (data) {
        $chat.append(`<tr class="list"><td><strong>${data.username}: </strong>${data.msg}</td></tr>`)
    })
})