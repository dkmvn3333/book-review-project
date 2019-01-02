function Author(){
    function bindEvent(){
        $("#edit-btn").click(function(e){
            var params ={
                author_id: $("#author_id").val(),
                name: $("#name").val(),
                description: tinymce.get("description").getContent()
            };
            var base_url = location.protocol+"//"+ document.domain +":"+location.port;
            console.log(base_url);
            console.log(params.author_image);                             
            $.ajax({
                url: base_url+"/admin/authors/edit",
                type: "PUT",
                data: params,
                dataType:"json",
                success: function(res){
                    if(res && res.status_code ==200){
                        // setTimeout(function(){
                            $.notify({
                                icon: 'ti-gift',
                                 message: "<b>Sửa thành công</b>"

                             },{
                                 type: 'success',
                                 timer: 2000
                              });
                        // }, 3000);
                        // window.location.replace("/admin/categories");
                    }else if(res && res.status_code ==501){
                        $.notify({
                            icon: 'ti-gift',
                             message: "<b>Tên không được để trống</b>"

                         },{
                             type: 'danger',
                             timer: 2000
                          });
                    }else if(res && res.status_code ==500){
                        $.notify({
                            icon: 'ti-gift',
                             message: "<b>Sửa không thành công</b>"
                         },{
                             type: 'danger',
                             timer: 2000
                          });
                    }
                }    
            })
        });
        $(".author_delete").click(function(e){
            var author_id = $(this).attr("author_id");
            var base_url = location.protocol+"//"+ document.domain +":"+location.port;
             alert(author_id);
            $.ajax({
                url: base_url+ "/admin/authors/delete",
                type: "DELETE",
                data: {author_id :author_id},
                dataType:"json",
                success: function(res){
                    if(res && res.status_code ==200){
                        setTimeout(function(){
                            $.notify({
                                icon: 'ti-gift',
                                 message: "<b>Xóa thành công</b>"

                             },{
                                 type: 'success',
                                 timer: 2000
                              });
                        }, 3000);
                        location.reload();
                    }
                        
                        // window.location.replace("/admin/categories");
                    // }else if(res && res.status_code ==500){
                    //     $.notify({
                    //         icon: 'ti-gift',
                    //          message: "<b>Xóa không thành công</b>"
                    //      },{
                    //          type: 'danger',
                    //          timer: 2000
                    //       });
                    // }
                }    
            })
        })
    }
    bindEvent();
}

$(document).ready(function(){
    new Author();
})