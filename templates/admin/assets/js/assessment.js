function Assessment(){
    function bindEvent(){
        $('.checkbox_btn').change(function () {
            var assessment_id = $(this).attr("assessment_id");
            var value_status = $("#checkbox"+assessment_id).val();
            if (value_status==0) {
                $("#checkbox"+assessment_id).val(1);
            }else  $("#checkbox"+assessment_id).val(0);
            
            var base_url = location.protocol+"//"+ document.domain +":"+location.port;
            alert(assessment_id + " " + $("#checkbox"+assessment_id).val());
            $.ajax({
                url: base_url+ "/admin/assessments/change_status",
                type: "PUT",
                data: {assessment_id :assessment_id, value_status:value_status},
                dataType:"json",
                success: function(res){
                    if(res && res.status_code ==200){
                        // setTimeout(function(){
                            $.notify({
                                icon: 'ti-gift',
                                 message: "<b>Kích hoạt bài viết thành công</b>"

                             },{
                                 type: 'success',
                                 timer: 2000
                              });
                        // }, 3000);
                    }
                }    
            })
        });
        
    }
    bindEvent();
}
$(document).ready(function(){
    new Assessment();
})