function Profile(){
        $("#update-btn").click(function(e){
            // alert(0);
            var params ={
                user_id: $("#user_id").val(),
                name: $("#name").val(),
                address: $("#address").val(),
                contact: $("#contact").val(),
                about: tinymce.get("about").getContent()
            };
            var base_url = location.protocol+"//"+ document.domain +":"+location.port;
            console.log(base_url);
            console.log(params.user_id+"."+params.name+"."+params.about+"."+".");
            $.ajax({
                url: base_url+"/admin/profile/update",
                type: "PUT",
                data: params,
                dataType:"json",
                success: function(res){
                    if(res && res.status_code ==200){
                        // setTimeout(function(){
                            $("#info_about").empty();
                            $("#info_about").html(params.about);
                            $.notify({
                                icon: 'ti-gift',
                                 message: "<b>Update thành công</b>"

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
                             message: "<b>Update không thành công</b>"
                         },{
                             type: 'danger',
                             timer: 2000
                          });
                    }
                }    
            })
        });
        
    bindEvent();
}

$(document).ready(function(){
    new Profile();
})