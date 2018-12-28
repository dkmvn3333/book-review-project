function Category(){
    function bindEvent(){
        $(".book_delete").click(function(e){
            var book_id = $(this).attr("book_id");
            var base_url = location.protocol+"//"+ document.domain +":"+location.port;
            alert(book_id);
            $(this).closest('tr').remove();
            $.ajax({
                url: base_url+ "/admin/books/delete",
                type: "DELETE",
                data: {book_id :book_id},
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