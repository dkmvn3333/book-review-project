function Category(){
    function bindEvent(){
        $("#edit-btn").click(function(e){
            var params ={
                category_id: $("#category_id").val(),
                name: $("#name").val(),
                category_image_tmp: $("#category_image_tmp").val(),
                discription: tinymce.get("discription").getContent()
            };
            var base_url = location.protocol+"//"+ document.domain +":"+location.port;
            console.log(base_url);
            console.log(params.category_image);
            $.ajax({
                url: base_url+"/admin/categories/edit",
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
        $(".category_delete").click(function(e){
            var category_id = $(this).attr("category_id");
            var base_url = location.protocol+"//"+ document.domain +":"+location.port;
             alert(category_id);
            $.ajax({
                url: base_url+ "/admin/categories/delete",
                type: "DELETE",
                data: {category_id :category_id},
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
    new Category();
})