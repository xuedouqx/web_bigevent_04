$(function() {
    var form = layui.form;
    var layer = layui.layer;
    initCate();

    // function initCate() {
    //     $.ajax({
    //         method: 'get',
    //         url: '/my/article/cates',
    //         success: function(res) {
    //             layer.msg(res.message)
    //             if (res.status !== 0) {
    //                 return layer.msg(res.message);
    //             }
    //             var htmlStr = template("tpl-cate", res)
    //             $('[name=cate_id]').html(htmlStr);
    //             form.render();
    //         }
    //     })
    // }


    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    // 一定要记得调用 form.render() 方法
                form.render()
            }
        })
    }


    // 2.初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
        // 选择图片
        // $("#btnChooseImage").on("click", function() {
        //     $("#coverfile").click();
        // })

    $("#btnChooseImage").on("click", function() {
        $("#coverfile").click();
    })

    // 设置图片 
    $("#coverfile").change(function(e) {
            var file = e.target.files[0]
            if (file == undefined) {
                ruturn;
            }
            var newImgURL = URL.createObjectURL(file)
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', newImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
        })
        // 设置状态
    var state = '已发布';
    $("#btnSave2").on('click', function() {
        state = '草稿';

    })

    //添加文章
    // $("#form-pub").on('click', function(e) {
    //     e.preventDefault();
    //     var fd = new FormData($(this)[0]);
    //     fd.append("state", state);
    //     $image
    //         .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
    //             width: 400,
    //             height: 280
    //         })
    //         .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
    //             // 得到文件对象后，进行后续的操作
    //             fd.append("cover_img", blob);
    //             // fd.forEach(function(value, key) {
    //             //     // console.log(key, value);
    //             // })
    //             publishArticle(fd)
    //         })
    // })
    // 为表单绑定 submit 提交事件
    $('#form-pub').on('submit', function(e) {
            // 1. 阻止表单的默认提交行为
            e.preventDefault()
            console.log($(this)[0]);
            // 2. 基于 form 表单，快速创建一个 FormData 对象
            var fd = new FormData($(this)[0])
            console.log(fd);
            // 3. 将文章的发布状态，存到 fd 中
            fd.append('state', state)
                // 4. 将封面裁剪过后的图片，输出为一个文件对象
            $image
                .cropper('getCroppedCanvas', {
                    // 创建一个 Canvas 画布
                    width: 400,
                    height: 280
                })
                .toBlob(function(blob) {
                    // 将 Canvas 画布上的内容，转化为文件对象
                    // 得到文件对象后，进行后续的操作
                    // 5. 将文件对象，存储到 fd 中
                    fd.append('cover_img', blob)
                        // 6. 发起 ajax 数据请求
                    publishArticle(fd)
                })
        })
        // 发布文章
    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: "/my/article/add",
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功')
                location.href = '/article/art_list.html'
            }
        })
    }
})