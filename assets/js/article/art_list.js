$(function() {

    // 定义时间过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 1.定会一查询查询参数
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //	文章分类的 Id
        state: '', //	文章的状态，可选值有：已发布、草稿
    };
    initTable();
    initCate();

    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                // layui.layer.msg(res.message)
                var str = template('tpl-table', res);
                // console.log(res);
                $('tbody').html(str);
                renderPage(res.total);
            }
        })
    }
    // 3.初始化分类
    var form = layui.form;
    // 封装
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                // 校验
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 赋值
                var htmlStr = template('tpl-cate', res);
                $("[name=cate_id]").html(htmlStr);
                form.render();
            }
        })
    }
    // 4. 筛选功能
    $('#form-search').on('submit', function(e) {

            e.preventDefault();
            alert(1)
                // huoqu 
            var state = $('[name=state]').val();
            var cate_id = $('[name=cate_id]').val();
            // 赋值
            q.state = state;
            q.cate_id = cate_id;
            // 初始化列表
            initTable();
        })
        // 5.分页
    var laypage = layui.laypage;

    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号,
            limit: q.pagesize,
            curr: q.pagenum,
            count: total, //数据总数，从服务端得到

            // 分页模块设置
            layout: ['count', 'limit', 'prev', 'page', 'next'],
            limits: [2, 3, 5, 4, 3],
            //回调函数
            jump: function(obj, first) {
                // console.log(obj.curr);
                // console.log(obj.limit);
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initTable();
                }

            }
        });

    }

    // 删除,通过代理的形式为删除按钮绑定事件处理函数

    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
            // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('res.message')
                    }

                    layer.msg("文章删除成功");
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;
                    initTable();
                }
            })
            layer.close(index)
        })

    })
})