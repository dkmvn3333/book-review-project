    "use strict";

    //General function for all pages

    //Modernizr touch detect
    Modernizr.load({
            test: Modernizr.touch,
            yep :['css/touch.css?v=1'],
            nope: [] 
    });

	//1. Scroll to top arrow
	// Scroll to top
        var $block =$('<div/>',{'class':'top-scroll'}).append('<a href="#"/>').hide().appendTo('body').click(function () {
            $('body,html').animate({scrollTop: 0}, 800);
            return false;
        });
                  
        //initialization
        var $window = $(window);

        if ($window.scrollTop() > 35) {showElem();} 
        else {hideElem();}

        //handlers    
        $window.scroll(function () {    
            if ($(this).scrollTop() > 35) {showElem();} 
            else {hideElem();}
        });

        //functions
        function hideElem(){
            $block.fadeOut();
        }   
        function showElem(){
            $block.fadeIn();
        }

    //2. Mobile menu
    //Init mobile menu
    $('#navigation').mobileMenu({
        triggerMenu:'#navigation-toggle',
        subMenuTrigger: ".sub-nav-toggle",
        animationSpeed:500  
    });

    //3. Search bar dropdown
    //search bar
    $("#search-sort").selectbox({
            onChange: function (val, inst) {

                $(inst.input[0]).children().each(function(item){
                    $(this).removeAttr('selected');
                })
                $(inst.input[0]).find('[value="'+val+'"]').attr('selected','selected');
            }

        });

    //4. Login window pop up
    //Login pop up
    $('.login-window').click(function (e){
        e.preventDefault();
        $('.overlay').removeClass('close').addClass('open');
    });

    $('.overlay-close').click(function (e) {
        e.preventDefault;
        $('.overlay').removeClass('open').addClass('close');

        setTimeout(function(){
            $('.overlay').removeClass('close');}, 500);
    });



function init_MoviePage () {
    "use strict";

	//1. Rating scrore init
    //Rating star
    $('.score').raty({
        // readOnly: true,
        width:130, 
        score: 5,
        // showHalf: true,
        // click   : alert(score),
        path: '/static_public/assets/images/rate/',
        starOff : 'star-off.svg',
        starOn  : 'star-on.svg' ,
        hints       : ['bad', 'poor', 'regular', 'good', 'gorgeous']

    });

    $('.score_index').raty({
        // readOnly: true,
        width:130, 
        score: 5,
        // showHalf: true,
        // click   : alert(score),
        path: '/static_public/assets/images/rate/',
        starOff : 'star-off.svg',
        starOn  : 'star-on.svg' ,
        hints       : ['bad', 'poor', 'regular', 'good', 'gorgeous']

    });

    // $('.score').raty({
    //     onClick: function(score) {
    //         alert('score: ' + score)
    //     },
    // });
    // After rate callback

    $(".score_index > img").click(function(e){
        var score = $(this).attr("alt");   
        var book_id = e.target.parentNode.id;
        var base_url = location.protocol+"//"+ document.domain +":"+location.port;
            alert(score + " " + score);
            $.ajax({
                url: base_url+ "/admin/books/rate",
                type: "PUT",
                data: {score :score, book_id:book_id},
                dataType:"json",
                success: function(res){
                    if(res && res.status_code ==200){
                        // setTimeout(function(){
                        $("#rate"+book_id).text(res.score.toFixed(2));   
                        $("#number_rate"+book_id).text(res.number_rate+1);  
                        // }, 3000);
                    }
                }    
            })
        //save to database                                              star
    });
    
    $('.score_index').click(function () {       
        $(this).children().hide();
        $(this).html('<span class="rates__done">Thanks for your vote!<span>');
        // var book_id = $(this).attr("book_id");  
        // alert(book_id);  
    });

    $(".score > img").click(function(e){
        var score = $(this).attr("alt");
        var rate = $("#rate").val(score);
        alert(rate);
        var book_id = e.target.parentNode.id;
        var base_url = location.protocol+"//"+ document.domain +":"+location.port;
            alert(score + " " + score);
            $.ajax({
                url: base_url+ "/admin/books/rate",
                type: "PUT",
                data: {score :score, book_id:book_id},
                dataType:"json",
                success: function(res){
                    if(res && res.status_code ==200){
                        // setTimeout(function(){
                        $("#rate"+book_id).text(res.score.toFixed(2));   
                        $("#number_rate"+book_id).text(res.number_rate+1);  
                        // }, 3000);
                    }
                }    
            })
        //save to database                                              star
    });
    
    $('.score').click(function () {       
        $(this).children().hide();
        $(this).html('<span class="rates__done">Thanks for your vote!<span>');
        // var book_id = $(this).attr("book_id");  
        // alert(book_id);  
    });

    $("#read-more-btn").click(function(){
        var page = $("#page").val();
        var base_url = location.protocol+"//"+ document.domain +":"+location.port;
        $.ajax({
            url: base_url+ "/read-more",
            type: "PUT",
            data: {page:page},
            success: function(response){
                $(".page-read-more").replaceWith(response);
                $("#page").val(page-(-1));
            }
        })
    })

    //6. Reply comment form
    			// button more comments
                $('#hide-comments').hide();

                $('.comment-more').click(function (e) {
                        e.preventDefault();
                        $('#hide-comments').slideDown(400);
                        $(this).hide();
                })

                  //reply comment function
                  $('.comment__reply').click( function (e) {
                        e.preventDefault();
                        var parent_id = $(this).attr("parent_id");
                        console.log(parent_id);
                        
                        $('.comment').find('.comment-form').remove();
                        $(this).parent().append("<form id='comment-form' class='comment-form' >\
                            <textarea class='comment-form__text comment-content' placeholder='Add you comment here'></textarea>\
                            <label class='comment-form__info'>250 characters left</label>\
                            <button type='button' user_id='1' parent_id='"+parent_id+"' class='btn btn-md btn--danger comment-form__btn btn-reply' >reply</button>\
                        </form>");
                  });


// $('.btn-comment').on('click', commentFunction);

// $('.comment').on('click', '.btn-reply', commentFunction);

// function commentFunction(){
//         var content = $(this).parent().find(".comment-content").val().trim();
//         if(content==""){
//             return;
//         }
//         var user_id = $("#user_id").val();
//         var book_review_id = $("#book_review_id").val();
//         var parent_id = $(this).attr("parent_id");  
//         var base_url = location.protocol+"//"+ document.domain +":"+location.port;
//         $.ajax({
//             url: base_url+ "/comment",
//             type: "PUT",
//             data: {content:content,user_id: user_id, parent_id:parent_id,book_review_id: book_review_id },
//             success: function(response){
//                 $(".comment-content").val("");
//                 $(".comment-sets").html(response);
//             }
//         })
// }
                  
    //2. Swiper slider
    //Media slider
                //init employee sliders
                // var mySwiper = new Swiper('.swiper-container',{
                //     slidesPerView:4,
                //   });

                // $('.swiper-slide-active').css({'marginLeft':'-1px'});

                // //Media switch
                // $('.list--photo').click(function (e){
                //     e.preventDefault();

                //     var mediaFilter = $(this).attr('data-filter');

                //     $('.swiper-slide').hide();
                //     $('.' + mediaFilter).show();

                //     $('.swiper-wrapper').css('transform','translate3d(0px, 0px, 0px)')
                //     mySwiper.params.slideClass = mediaFilter;
         
                //     mySwiper.reInit();
                //     $('.swiper-slide-active').css({'marginLeft':'-1px'});
                // })

                // $('.list--video').click(function (e){
                //     e.preventDefault();

                //     var mediaFilter = $(this).attr('data-filter');
                //     $('.swiper-slide').hide();
                //     $('.' + mediaFilter).show();

                //     $('.swiper-wrapper').css('transform','translate3d(0px, 0px, 0px)')
                //     mySwiper.params.slideClass = mediaFilter;

                //     mySwiper.reInit();
                //     $('.swiper-slide-active').css({'marginLeft':'-1px'});
                // });

                    //media swipe visible slide
                    //Onload detect

                //     if ($(window).width() >760 & $(window).width() <  992  ){
                //          mySwiper.params.slidesPerView=2;
                //          mySwiper.resizeFix();         
                //     }

                //     else
                //     if ($(window).width() < 767 & $(window).width() > 481){
                //          mySwiper.params.slidesPerView=3;
                //          mySwiper.resizeFix();    
                    
                //     } else

                //      if ($(window).width() < 480 & $(window).width() > 361){
                //          mySwiper.params.slidesPerView=2;
                //          mySwiper.resizeFix();    
                //     } else
                //     if ($(window).width() < 360){
                //          mySwiper.params.slidesPerView=1;
                //          mySwiper.resizeFix();    
                //     }

                //     else{
                //         mySwiper.params.slidesPerView=4;
                //         mySwiper.resizeFix();
                //     }

                //      if ($('.swiper-container').width() > 900 ){
                //         mySwiper.params.slidesPerView=5;
                //         mySwiper.resizeFix();
                //      }

                //   //Resize detect
                // $(window).resize(function(){

                //      if ($(window).width() >760 & $(window).width() <  992  ){
                //          mySwiper.params.slidesPerView=2;
                //          mySwiper.reInit();         
                //     }

                //     else
                //     if ($(window).width() < 767 & $(window).width() > 481){
                //          mySwiper.params.slidesPerView=3;
                //           mySwiper.reInit();    
                    
                //     } else
                //      if ($(window).width() < 480 & $(window).width() > 361){
                //          mySwiper.params.slidesPerView=2;
                //          mySwiper.reInit();   
                //     } else 
                //     if ($(window).width() < 360){
                //          mySwiper.params.slidesPerView=1;
                //          mySwiper.reInit();   
                //     }

                //     else{
                //         mySwiper.params.slidesPerView=4;
                //         mySwiper.reInit();
                //     }


                //  });

    //3. Slider item pop up
   				//boolian var
                var toggle = true;

                //pop up video media element
                $('.media-video .movie__media-item').magnificPopup({
                    //disableOn: 700,
                    type: 'iframe',
                    mainClass: 'mfp-fade',
                    removalDelay: 160,
                    preloader: false,

                    fixedContentPos: false,

                    gallery: {
                        enabled: true,
                        preload: [0,1] // Will preload 0 - before current, and 1 after the current image
                    },

                    disableOn:function () {
                        return toggle;
                    }
                });

                //pop up photo media element
                $('.media-photo .movie__media-item').magnificPopup({
                    type: 'image',
                    closeOnContentClick: true,
                    mainClass: 'mfp-fade',
                    image: {
                        verticalFit: true
                    },

                    gallery: {
                        enabled: true,
                        navigateByImgClick: true,
                        preload: [0,1] // Will preload 0 - before current, and 1 after the current image
                    },

                    disableOn:function () {
                        return toggle;
                    }
                    
                });

                //detect if was move after click
                $('.movie__media .swiper-slide').on('mousedown', function(e){
                    toggle = true;
                    $(this).on('mousemove', function testMove(){
                          toggle = false;
                    });
                });

    //4. Dropdown init 
				//select
                $("#select-sort").selectbox({
                    onChange: function (val, inst) {

                        $(inst.input[0]).children().each(function(item){
                            $(this).removeAttr('selected');
                        })
                        $(inst.input[0]).find('[value="'+val+'"]').attr('selected','selected');
                    }

                });

    
    //5. Datepicker init
                // $( ".datepicker__input" ).datepicker({
                //   showOtherMonths: true,
                //   selectOtherMonths: true,
                //   showAnim:"fade"
                // });

                // $(document).click(function(e) { 
                //     var ele = $(e.target); 
                //     if (!ele.hasClass("datepicker__input") && !ele.hasClass("ui-datepicker") && !ele.hasClass("ui-icon") && !$(ele).parent().parents(".ui-datepicker").length){
                //        $(".datepicker__input").datepicker("hide");
                //      }
                // });

    

    //7. Timetable active element
    			$('.time-select__item').click(function (){
                    $('.time-select__item').removeClass('active');
                    $(this).addClass('active');
                });

    //8. Toggle between cinemas timetable and map with location
    			//change map - ticket list
                $('#map-switch').click(function(ev){
                    ev.preventDefault();

                    $('.time-select').slideToggle(500);
                    $('.map').slideToggle(500);

                    $('.show-map').toggle();
                    $('.show-time').toggle();
                    $(this).blur();
                });

                $(window).load(function () {
                    $('.map').addClass('hide-map');
                })

    //10. Scroll down navigation function
    //scroll down
    $('.comment-link').click(function (ev) {
        ev.preventDefault();
        $('html, body').stop().animate({'scrollTop': $('.comment-wrapper').offset().top-90}, 900, 'swing');
    });
}

function init_MoviePageFull () {
    "use strict";

            //init employee sliders
                var mySwiper = new Swiper('.swiper-container',{
                    slidesPerView:5,
                  });

                $('.swiper-slide-active').css({'marginLeft':'-1px'});

                //Media switch
                $('.list--photo').click(function (e){
                    e.preventDefault();

                    var mediaFilter = $(this).attr('data-filter');

                    $('.swiper-slide').hide();
                    $('.' + mediaFilter).show();

                    $('.swiper-wrapper').css('transform','translate3d(0px, 0px, 0px)')
                    mySwiper.params.slideClass = mediaFilter;
         
                    mySwiper.reInit();
                    $('.swiper-slide-active').css({'marginLeft':'-1px'});
                })

                $('.list--video').click(function (e){
                    e.preventDefault();

                    var mediaFilter = $(this).attr('data-filter');
                    $('.swiper-slide').hide();
                    $('.' + mediaFilter).show();

                    $('.swiper-wrapper').css('transform','translate3d(0px, 0px, 0px)')
                    mySwiper.params.slideClass = mediaFilter;

                    mySwiper.reInit();
                    $('.swiper-slide-active').css({'marginLeft':'-1px'});
                });
                    //media swipe visible slide
                    //Onload detect

                    if ($(window).width() >768 & $(window).width() <  992  ){
                         mySwiper.params.slidesPerView=3;
                         mySwiper.resizeFix();         
                    }

                    else
                    if ($(window).width() < 767 & $(window).width() > 481){
                         mySwiper.params.slidesPerView=3;
                         mySwiper.resizeFix();    
                    
                    } else
                     if ($(window).width() < 480 & $(window).width() > 361){
                         mySwiper.params.slidesPerView=2;
                         mySwiper.resizeFix();    
                    } else
                    if ($(window).width() < 360){
                         mySwiper.params.slidesPerView=1;
                         mySwiper.resizeFix();    
                    }

                    else{
                        mySwiper.params.slidesPerView=5;
                        mySwiper.resizeFix();
                    }

                     if ($('.swiper-container').width() > 900 ){
                        mySwiper.params.slidesPerView=5;
                        mySwiper.resizeFix();
                     }

                  //Resize detect
                $(window).resize(function(){
                  if ($(window).width() > 993 & $('.swiper-container').width() > 900 ){
                        mySwiper.params.slidesPerView=5;
                        mySwiper.reInit(); 
                     }

                     if ($(window).width() >768 & $(window).width() <  992  ){
                         mySwiper.params.slidesPerView=3;
                         mySwiper.reInit();         
                    }

                    else
                    if ($(window).width() < 767 & $(window).width() > 481){
                         mySwiper.params.slidesPerView=3;
                          mySwiper.reInit();    
                    
                    } else
                     if ($(window).width() < 480 & $(window).width() > 361){
                         mySwiper.params.slidesPerView=2;
                         mySwiper.reInit();   
                    } else 
                    if ($(window).width() < 360){
                         mySwiper.params.slidesPerView=1;
                         mySwiper.reInit();   
                    }

                    else{
                        mySwiper.params.slidesPerView=5;
                        mySwiper.reInit();
                    }


                 });
}

function init_Rates () {
    "use strict";

	//1. Rating fucntion
				//Rating star
                $('.score').raty({
                    width:130, 
                    score: 0,
                    path: '/static_public/assets/images/rate/',
                    starOff : 'star-off.svg',
                    starOn  : 'star-on.svg' 
                });

                //After rate callback
                $('.score').click(function () {
                    $(this).children().hide();

                    $(this).html('<span class="rates__done">Thanks for your vote!<span>')
                })
}

function init_Cinema () {
    "use strict";

	//1. Swiper slider
				//init cinema sliders
                var mySwiper = new Swiper('.swiper-container',{
                    slidesPerView:8,
                    loop:true,
                  });

                $('.swiper-slide-active').css({'marginLeft':'-1px'});
                //media swipe visible slide

                //onload detect
                    if ($(window).width() >993 & $(window).width() <  1199  ){
                         mySwiper.params.slidesPerView=6;
                         mySwiper.resizeFix();         
                    }
                    else
                    if ($(window).width() >768 & $(window).width() <  992  ){
                         mySwiper.params.slidesPerView=5;
                         mySwiper.resizeFix();         
                    }

                    else
                    if ($(window).width() < 767 & $(window).width() > 481){
                         mySwiper.params.slidesPerView=4;
                         mySwiper.resizeFix();    
                    
                    } else
                     if ($(window).width() < 480){
                         mySwiper.params.slidesPerView=2;
                         mySwiper.resizeFix();    
                    }

                    else{
                        mySwiper.params.slidesPerView=8;
                        mySwiper.resizeFix();
                    }

				//resize detect                   
                $(window).resize(function(){
                    if ($(window).width() >993 & $(window).width() <  1199  ){
                         mySwiper.params.slidesPerView=6;
                         mySwiper.reInit();          
                    }
                    else
                     if ($(window).width() >768 & $(window).width() <  992  ){
                         mySwiper.params.slidesPerView=5;
                         mySwiper.reInit();         
                    }

                    else
                    if ($(window).width() < 767 & $(window).width() > 481){
                         mySwiper.params.slidesPerView=4;
                          mySwiper.reInit();    
                    
                    } else
                     if ($(window).width() < 480){
                         mySwiper.params.slidesPerView=2;
                         mySwiper.reInit();   
                    }

                    else{
                        mySwiper.params.slidesPerView=8;
                        mySwiper.reInit();
                    }
                 });

	//2. Datepicker
				//datepicker
                $( ".datepicker__input" ).datepicker({
                  showOtherMonths: true,
                  selectOtherMonths: true,
                  showAnim:"fade"
                });

                $(document).click(function(e) { 
                    var ele = $(e.target); 
                    if (!ele.hasClass("datepicker__input") && !ele.hasClass("ui-datepicker") && !ele.hasClass("ui-icon") && !$(ele).parent().parents(".ui-datepicker").length){
                       $(".datepicker__input").datepicker("hide");

                     }

                });

    //3. Comment area control
    			// button more comments
                  $('#hide-comments').hide();

                  $('.comment-more').click(function (e) {
                        e.preventDefault();
                        $('#hide-comments').slideDown(400);
                        $(this).hide();
                  })

                  //reply comment function

                  $('.comment__reply').click( function (e) {
                        e.preventDefault();

                        $('.comment').find('.comment-form').remove();


                        $(this).parent().append("<form id='comment-form' class='comment-form' method='post'>\
                            <textarea class='comment-form__text' placeholder='Add you comment here'></textarea>\
                            <label class='comment-form__info'>250 characters left</label>\
                            <button type='submit' class='btn btn-md btn--danger comment-form__btn'>add comment</button>\
                        </form>");
                  });

    //4. Init map
    				var mapOptions = {
                        scaleControl: true,
                        center: new google.maps.LatLng(51.508798, -0.131687),
                        zoom: 16,
                        navigationControl: false,
                        streetViewControl: false,
                        mapTypeControl: false,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    var map = new google.maps.Map(document.getElementById('cinema-map'),mapOptions);
                    var marker = new google.maps.Marker({
                        map: map,
                        position: map.getCenter()
                    });

                    //Custome map style
                    var map_style = [{stylers:[{saturation:-100},{gamma:3}]},{elementType:"labels.text.stroke",stylers:[{visibility:"off"}]},{featureType:"poi.business",elementType:"labels.text",stylers:[{visibility:"off"}]},{featureType:"poi.business",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"poi.place_of_worship",elementType:"labels.text",stylers:[{visibility:"off"}]},{featureType:"poi.place_of_worship",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"road",elementType:"geometry",stylers:[{visibility:"simplified"}]},{featureType:"water",stylers:[{visibility:"on"},{saturation:0},{gamma:2},{hue:"#aaaaaa"}]},{featureType:"administrative.neighborhood",elementType:"labels.text.fill",stylers:[{visibility:"off"}]},{featureType:"road.local",elementType:"labels.text",stylers:[{visibility:"off"}]},{featureType:"transit.station",elementType:"labels.icon",stylers:[{visibility:"off"}]}]

                    //Then we use this data to create the styles.
                    var styled_map = new google.maps.StyledMapType(map_style, {name: "Cusmome style"});

                    map.mapTypes.set('map_styles', styled_map);
                    map.setMapTypeId('map_styles');


                    //=====================================

                    // Maker

                    //=====================================

                    //Creates the information to go in the pop-up info box.
                    var boxTextA = document.createElement("div");
                    boxTextA.innerHTML = '<span class="pop_up_box_text">Cineworld, 63-65 Haymarket, London</span>';

                    //Sets up the configuration options of the pop-up info box.
                    var infoboxOptionsA = {
                     content: boxTextA
                     ,disableAutoPan: false
                     ,maxWidth: 0
                     ,pixelOffset: new google.maps.Size(30, -50)
                     ,zIndex: null
                     ,boxStyle: {
                     background: "#4c4145"
                     ,opacity: 1
                     ,width: "300px"
                     ,color: " #b4b1b2"
                     ,fontSize:"13px"
                     ,padding:'14px 20px 15px'
                     }
                     ,closeBoxMargin: "6px 2px 2px 2px"
                     ,infoBoxClearance: new google.maps.Size(1, 1)
                     ,closeBoxURL: "/static_public/assets/images/components/close.svg"
                     ,isHidden: false
                     ,pane: "floatPane"
                     ,enableEventPropagation: false
                    };

                    
                    //Creates the pop-up infobox for Glastonbury, adding the configuration options set above.
                    var infoboxA = new InfoBox(infoboxOptionsA);


                    //Add an 'event listener' to the Glastonbury map marker to listen out for when it is clicked.
                    google.maps.event.addListener(marker, "click", function (e) {
                     //Open the Glastonbury info box.
                     infoboxA.open(map, this);
                     //Sets the Glastonbury marker to be the center of the map.
                     map.setCenter(marker.getPosition());
                    });
}

function init_SinglePage () {
    "use strict";

	//1. Swiper slider (with arrow behaviur).
				//init images sliders
                var mySwiper = new Swiper('.swiper-container',{
                    slidesPerView:1,
                    onSlideChangeStart:function change(index){
                        var i = mySwiper.activeIndex;
                        var prev = i-1;
                        var next = i+1;

                        var prevSlide = $('.post__preview .swiper-slide').eq(prev).attr('data-text');
                             $('.arrow-left').find('.slider__info').text(prevSlide);
                        var nextSlide = $('.post__preview .swiper-slide').eq(next).attr('data-text');
                            $('.arrow-right').find('.slider__info').text(nextSlide);

                        //condition first-last slider
                        $('.arrow-left , .arrow-right').removeClass('no-hover');

                        if(i == 0){
                            $('.arrow-left').find('.slider__info').text('');
                            $('.arrow-left').addClass('no-hover');
                        }

                        if(i == last){
                            $('.arrow-right').find('.slider__info').text('');
                            $('.arrow-right').addClass('no-hover');
                        }
                    }
                  });

                //var init and put onload value
                var i = mySwiper.activeIndex;
                var last =mySwiper.slides.length - 1; 
                var prev = i-1;
                var next = i+1;

                var prevSlide = $('.post__preview .swiper-slide').eq(prev).attr('data-text');
                var nextSlide = $('.post__preview .swiper-slide').eq(next).attr('data-text');

                //put onload value for slider navigation
                $('.arrow-left').find('.slider__info').text(prevSlide);
                $('.arrow-right').find('.slider__info').text(nextSlide);

                //condition first-last slider
                if(i == 0){
                    $('.arrow-left').find('.slider__info').text('');
                }

                if(i == last){
                    $('.arrow-right').find('.slider__info').text('');
                }

                //init slider navigation arrow

                  $('.arrow-left').on('click', function(e){
                    e.preventDefault();
                    mySwiper.swipePrev();
                  })
                  $('.arrow-right').on('click', function(e){
                    e.preventDefault();
                    mySwiper.swipeNext();
                  })

	//2. Comment area control
				// button more comments
                  $('#hide-comments').hide();

                  $('.comment-more').click(function (e) {
                        e.preventDefault();
                        $('#hide-comments').slideDown(400);
                        $(this).hide();
                  })

                  //reply comment function

                  $('.comment__reply').click( function (e) {
                        e.preventDefault();

                        $('.comment').find('.comment-form').remove();


                        $(this).parent().append("<form id='comment-form' class='comment-form' method='post'>\
                            <textarea class='comment-form__text' placeholder='Add you comment here'></textarea>\
                            <label class='comment-form__info'>250 characters left</label>\
                            <button type='submit' class='btn btn-md btn--danger comment-form__btn'>add comment</button>\
                        </form>");
                  });
}

