src =
{
    page: null,

    global:
    {
        is_mobile: window.innerWidth < 768,
    },

    events:
    {
        doc_click: function (e) {},
        doc_onchange: function (e) {},
        on_resize: function ()
        {
            $.cookie('client_size', window.innerWidth + 'x' + window.innerHeight, { expires: 7, path: '/'  });
        },
    },

    ajax: function (request, onComplete, onError, onBefore)
    {

        request = request || {};

        request['service'] = src_config.service;

        if (!request['service'])
        {
            return;
        }

        request['url'] = src_config.service;

        onComplete = src.utils.isFunction(onComplete) ? onComplete : function () {
        };
        onError    = src.utils.isFunction(onError) ? onError : function () {
        };
        onBefore   = src.utils.isFunction(onBefore) ? onBefore : function () {
        };

        if (request['ssl'] == true)
        {
            request['service'] = request['service'].replace(/http/, 'https');
        }

        $.ajax({
            url        : request['service'],
            type       : request['m'] ? request['m'] : 'POST',
            data       : request['d'] ? request['d'] : {},
            dataType   : request.dt ? request.dt : 'json',
            beforeSend : onBefore,
            cache      : false,
            crossDomain: true,
            success    : function (data, textStatus) {
                data = data || {};
                try { onComplete(data, textStatus);  } catch (e) { }
            },
            error      : function (jqXHR, textStatus, errorThrown) {
                try { onError(textStatus); } catch (e) { }
            }
        });
    },

    utils:
    {
        explode: function (delimiter, string) {
            var emptyArray = {0: ''};
            if (arguments.length != 2
                || typeof arguments[0] == 'undefined'
                || typeof arguments[1] == 'undefined') {
                return null;
            }
            if (delimiter === ''
                || delimiter === false
                || delimiter === null) {
                return false;
            }
            if (typeof delimiter == 'function'
                || typeof delimiter == 'object'
                || typeof string == 'function'
                || typeof string == 'object') {
                return emptyArray;
            }
            if (delimiter === true) {
                delimiter = '1';
            }
            return string.toString().split(delimiter.toString());
        },
        isFunction: function (obj) {
            return Object.prototype.toString.call(obj) === '[object Function]';
        },
        getRandom: function (min, max) {
            return Math.round(Math.random() * (max - min) + min);
        },
        getRandomFloat: function (min, max) {
            return (Math.random() * (min - max) + max).toFixed(1)
        },
        makeString: function (len, space_using) {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789";
            for (var i = 0; i < len; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            if (space_using == false) {
                text.replace(/\s+/ig, '');
            }

            return text;
        },
        svgToInline: function (imgs, onComplete) {

            var count = imgs.length;
            var loaded = 0;

            imgs.each(function () {

                var $img = $(this);
                var imgID = $img.attr('id');
                var imgClass = $img.attr('class');
                var imgURL = $img.attr('src');
                var imgTitle = $img.attr('title');

                $.get(imgURL, function (data) {

                    var $svg = $(data).find('svg');
                    if (typeof imgID !== 'undefined') {
                        $svg = $svg.attr('id', imgID);
                    }
                    if (typeof imgClass !== 'undefined') {
                        $svg = $svg.attr('class', imgClass + ' replaced-svg');
                    }
                    if (typeof imgTitle !== 'undefined') {
                        $svg = $svg.attr('title', imgTitle);
                    }
                    $svg = $svg.removeAttr('xmlns:a');
                    if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
                        $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
                    }
                    $img.replaceWith($svg);
                    $svg.css('opacity', 1);
                    loaded++;
                    if (loaded == count) {
                        try {
                            onComplete();
                        } catch (e) {
                        }
                    }
                }, 'xml');
            });
        },
        updateThimbWrapHeight: function (wrap) {
            wrap.mCustomScrollbar("destroy");
            wrap.mCustomScrollbar({theme: "minimal-dark"});
            wrap.mCustomScrollbar("update");
        },
        removeHover: function () {
            try {
                for (var si in document.styleSheets) {
                    var styleSheet = document.styleSheets[si];
                    if (!styleSheet.rules)
                        continue;
                    for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
                        if (!styleSheet.rules[ri].selectorText) continue;
                        if (styleSheet.rules[ri].selectorText.match(':hover')) {
                            styleSheet.deleteRule(ri);
                        }
                    }
                }
            } catch (ex) {
                src.l("removeHover Ex: " + ex);
            }
        },
        getTpl: function (name) {
            var tpl_source = $('#tpls');
            return tpl_source.find('[data-id="' + name + '"]').html();
        },
        formShowError: function (form, errors)
        {
            if (!form)
            {
                return;
            }

            src.log('formShowError -> ', errors);

            form.find('.input_error').removeAttr('title').tooltip('hide').tooltip('dispose');
            form.find('input, textarea').removeClass('input_error');
            form.find('[data-input]').removeClass('input_error');

            // [ {input_name: "error string"}, {}, .... ]

            errors.forEach(function (error)
            {
                var input_name = Object.keys(error)[0];
                form.find('[data-input="' +  input_name  + '"]')
                    .addClass('input_error')
                    .attr('title', error[input_name] );
            });

            form.find('.input_error').tooltip({ container: 'body', html: true}).tooltip('show');

        },
        scrollTo: function (element) {
            $('html, body').animate({
                scrollTop: element.offset().top
            }, 1500);
        },
        hashClear: function () {
            try {
                history.pushState("", document.title, window.location.pathname + window.location.search);
            } catch (e) {
            }

        },
        preload: function (src_list)
        {
            if (document.images && src_list)
            {

                src_list.forEach(function (src)
                {
                    var img = new Image();
                    img.src = src;
                });
            }
        },
        hyphenate: function (e_class)
        {
            Hyphenator.config({
                classname        : e_class ? e_class : 'hyp',
                displaytogglebox : false,
                minwordlength    : 4,
                defaultlanguage  : src_config.lkey
            });
            Hyphenator.run();
        },
        geSlideDataIndex: function (swipe)
        {
            if (!swipe)
            {
                return 1;
            }

            var activeIndex = swipe.activeIndex;
            var slidesLen = swipe.slides.length;
            if (swipe.params.loop)
            {
                switch (swipe.activeIndex)
                {
                    case 0:
                        activeIndex = slidesLen - 3;
                        break;
                    case slidesLen - 1:
                        activeIndex = 0;
                        break;
                    default:
                        --activeIndex;
                }
            }
            return activeIndex;
        },
        nl2br: function( str )
        {
            return str.replace(/([^>])\n/g, '$1<br/>');
        },
        trim: function (str)
        {
            if (!str)
            {
                return '';
            }

            var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
            return str.replace(rtrim, '');
        }
    },

    com:
    {
        Slick: function (selector, options)
        {
            var slider = selector;
            options = options || {};
            if (slider.length == 0)
            {
                return;
            }

            let opt =
            {
                dots: false,
                autoplay: false,
                infinite: true,
                speed: 300,
                draggable: false,
                slidesToShow: 4,
                slidesToScroll: 1,
                prevArrow: selector.parent().find('.cs-slick-prev'),
                nextArrow: selector.parent().find('.cs-slick-next'),
                responsive: [
                    {
                        breakpoint: 0,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3,
                            infinite: true,
                            dots: true
                        }
                    }
                ]
            };

            opt = $.extend(true, opt, options);

            selector.slick(opt);

        },
        Swiper: function(selector, options)
        {
            var slider = selector;

            options = options || {};

            if (slider.length == 0)
            {
                return
            }

            let opt = {
                effect: 'fade',
                spaceBetween: 10,
                loop: true,
                autoplay: {
                    delay: 3000
                },
                speed: 1000,
                navigation: {
                    nextEl: slider.parent().find('.swiper-button-next'),
                    prevEl: slider.parent().find('.swiper-button-prev')
                },
                pagination: {
                    el: slider.parent().find('.swiper-pagination'),
                    clickable: true,
                    type: 'bullets',
                    paginationHide: false,
                    hideOnClick: false,
                }
            };

            if (!src.global.is_mobile)
            {
                opt['noSwiping'] = false;
                opt['simulateTouch'] = false;
            }

            if (options.counter)
            {
                opt['on'] =
                {
                    init: function ()
                    {
                        var el = options.counter_el ? options.counter_el : this.$el.parent();
                        var total = el.find('.counter-wp').find('#total');
                        total.text( this.slides.length - this.loopedSlides * 2 );
                    },
                    slideChange: function (e)
                    {
                        var swipe = this;
                        var el = options.counter_el ? options.counter_el : swipe.$el.parent();
                        var current = el.find('.counter-wp').find('#current');
                        var total = el.find('.counter-wp').find('#total');
                        current.text( src.utils.geSlideDataIndex(swipe) + 1 );

                        //var tl = new TimelineMax();
                        //tl.to(current, 0.3, {opacity: 0, top: 0, ease: Power1.easeOut, onComplete:  function ()
                        //{
                        //    current.text( src.utils.geSlideDataIndex(swipe) + 1 );
                        //    tl.to(current, 0.2, {opacity: 1, top: 0, ease: Power1.easeOut}, 0.2);
                        //}});
                    }
                }
            }

            opt = $.extend({}, opt, options);

            var swiper_slider = new Swiper(slider, opt);

            if (options.add_on)
            {
                if ( options.add_on.event.indexOf(',') != -1 )
                {
                    options.add_on.event = options.add_on.event.split(',');
                    options.add_on.event.forEach(function (e)
                    {
                        src.log('Swiper -> on: ', e);
                        swiper_slider.on(e, options.add_on.handler)
                    });

                } else
                {
                    swiper_slider.on(options.add_on.event, options.add_on.handler)
                }

            }

            return swiper_slider;
        },
        FancyBox: function (selector, opts)
        {
            opts = opts || {};

            /*
             //"zoom",
             //"share",
             //"slideShow",
             //"fullScreen",
             //"download",
             //"thumbs",

            */
            var buttons = ["close"];
            var clickContent = opts.clickContent ? opts.clickContent : false;

            if (clickContent)
            {
                buttons = ["zoom", "close"];
            }

            
            $(selector).fancybox({
                loop: false,
                infobar: false,
                //buttons : false,
                animationEffect: "fade",
                clickContent: clickContent,
                buttons: buttons,
                afterLoad : function( instance, current )
                {
                    var fill_counter = function (instance)
                    {
                        if (!instance)
                        {
                            return;
                        }

                        var fancybox_bottom = $('.fancybox-bottom, .fancybox-bottom-xs');

                        fancybox_bottom.find('.total').text( instance.$refs.infobar.find('[data-fancybox-index]').text() );
                        fancybox_bottom.find('.length').text( instance.$refs.infobar.find('[data-fancybox-count]').text() );
                    };

                    if ( instance.group.length > 1 && current.$content )
                    {
                        current.$content.append(
                            '<div class="fancybox-bottom d-flex justify-content-between align-items-center">' +
                            '<div class="fancybox-title av_rg"></div>' +
                            '<div class="fancybox-nav d-flex align-items-center">'+
                            '<a class="fancybox-button fancybox-button--arrow_left" href="javascript:;">' +
                            '<div class="svg-absolute arrow-btn btn-prev"> <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 60 29.4" enable-background="new 0 0 60 29.4" xml:space="preserve"> <path id="target" fill="#FFFFFF" d="M33.1,10.9C33,11,32.9,11,32.8,11c0,0-0.1,0-0.1,0c0,0,0,0,0,0c-0.7,0.4-1.7,0.4-2.4-0.2H23V0 l-9.7,6.2c-0.1,1-1.1,1.9-2.1,1.8c0,0-0.1,0-0.1,0c0,0-0.1,0-0.1,0c-0.2,0.2-0.6,0.4-0.8,0.6C10,8.8,9.8,9,9.6,9.1 C9.2,9.3,8.8,9.4,8.3,9.4L0,14.7l23,14.7V18.5h8.8c0.1-0.1,0.3-0.1,0.4-0.2c0.5-0.1,1,0,1.5,0.1c0,0,0,0,0,0c-0.1,0-0.1,0,0.1,0 c0.1,0,0.2,0,0.2,0c0,0,0,0,0,0c0,0,0,0,0,0c0.2,0,0.3-0.1,0.5-0.1c0.5-0.2,1.1-0.1,1.5,0.2h24v-7.6H33.1z M8.7,13.1 c0,0-0.1,0.1-0.1,0.1c-1,0.4-2.1,0.8-3.2,1.1c-0.1-0.2-0.2-0.5-0.2-0.7c0-0.1,0-0.1,0-0.2c0,0,0.1-0.1,0.1-0.1 c0.5-0.2,1-0.5,1.5-0.4l0-0.1c0.6-0.2,1.1-0.4,1.7-0.7c0,0.3,0.1,0.5,0.1,0.8C8.7,13,8.7,13.1,8.7,13.1z M13,11.8 c-0.3,0.2-0.5,0.5-0.8,0.7c-0.4-0.2-0.7-0.3-1.1-0.5c-0.1-0.1-0.3-0.1-0.4-0.3c-0.1-0.2-0.1-0.4,0-0.5c0.1-0.2,0.2-0.3,0.4-0.4 l0.1,0c-0.1,0-0.1-0.1,0-0.2c0.1,0,0.1-0.1,0.2,0c0.6,0,1.1,0.3,1.5,0.7c0.1,0.1,0.2,0.2,0.1,0.3C13.1,11.7,13,11.7,13,11.8z M19.9,20.1c0,0.1-0.1,0.2-0.2,0.2c-0.3,0.2-0.5,0.5-0.8,0.7c-0.1,0.1-0.3,0.2-0.4,0.1c-0.1,0-0.1-0.1-0.1-0.2 c-0.1-0.5-0.3-1-0.4-1.5l-0.1,0.1c0.4-0.4,0.9-0.8,1.4-0.9c0.1,0,0.2,0,0.3,0c0,0,0,0,0,0.1c0.1,0.3,0.2,0.7,0.3,1 C20,19.9,20,20,19.9,20.1z M20,9.9c-0.1,0,0-3.3,0-3.5c0-0.1,0-0.2,0.1-0.3c0.1-0.2,0.4-0.1,0.6-0.1c0,0,0.1,0,0.1,0 c0,0,0,0.1,0,0.2c-0.2,1.4,0.1,2.8,0.3,4.2C20.7,10.2,20.3,10,20,9.9z M42.5,13.4c-1.7,0-3.5,0.5-5.2,0.3c0.2-0.3,0.3-0.6,0.3-0.9 c0-0.5,4-0.6,4.6-0.7c0.1,0,0.3,0,0.4,0.1c0,0,0,0.1,0,0.1C42.5,12.7,42.5,13.1,42.5,13.4z M50.6,13.2c-0.1-0.3-0.1-0.5-0.1-0.8 l0.1,0c0.5-0.2,1.1-0.2,1.7-0.2c0,0.3,0.1,0.5,0.1,0.8C51.9,13.1,51.2,13.1,50.6,13.2z"></path> <path id="focus" fill="#FFFFFF" d="M97.1,10.9C97,11,96.9,11,96.8,11c0,0-0.1,0-0.1,0c0,0,0,0,0,0c-0.7,0.4-1.7,0.4-2.4-0.2H87V0 l-9.7,6.2c-0.1,1-1.1,1.9-2.1,1.8c0,0-0.1,0-0.1,0c0,0-0.1,0-0.1,0c-0.2,0.2-0.6,0.4-0.8,0.6C74,8.8,73.8,9,73.6,9.1 c-0.4,0.2-0.8,0.3-1.2,0.3L64,14.7l23,14.7V18.5h8.8c0.1-0.1,0.3-0.1,0.4-0.2c0.5-0.1,1,0,1.5,0.1c0,0,0,0,0,0c-0.1,0-0.1,0,0.1,0 c0.1,0,0.2,0,0.2,0c0,0,0,0,0,0c0,0,0,0,0,0c0.2,0,0.3-0.1,0.5-0.1c0.5-0.2,1.1-0.1,1.5,0.2h24v-7.6H97.1z M72.7,13.1 c0,0-0.1,0.1-0.1,0.1c-1,0.4-2.1,0.8-3.2,1.1c-0.1-0.2-0.2-0.5-0.2-0.7c0-0.1,0-0.1,0-0.2c0,0,0.1-0.1,0.1-0.1 c0.5-0.2,1-0.5,1.5-0.4l0-0.1c0.6-0.2,1.1-0.4,1.7-0.7c0,0.3,0.1,0.5,0.1,0.8C72.7,13,72.7,13.1,72.7,13.1z M77,11.8 c-0.3,0.2-0.5,0.5-0.8,0.7c-0.4-0.2-0.7-0.3-1.1-0.5c-0.1-0.1-0.3-0.1-0.4-0.3c-0.1-0.2-0.1-0.4,0-0.5c0.1-0.2,0.2-0.3,0.4-0.4 l0.1,0c-0.1,0-0.1-0.1,0-0.2c0.1,0,0.1-0.1,0.2,0c0.6,0,1.1,0.3,1.5,0.7c0.1,0.1,0.2,0.2,0.1,0.3C77.1,11.7,77,11.7,77,11.8z M83.9,20.1c0,0.1-0.1,0.2-0.2,0.2c-0.3,0.2-0.5,0.5-0.8,0.7c-0.1,0.1-0.3,0.2-0.4,0.1c-0.1,0-0.1-0.1-0.1-0.2 c-0.1-0.5-0.3-1-0.4-1.5l-0.1,0.1c0.4-0.4,0.9-0.8,1.4-0.9c0.1,0,0.2,0,0.3,0c0,0,0,0,0,0.1c0.1,0.3,0.2,0.7,0.3,1 C84,19.9,84,20,83.9,20.1z M84,9.9c-0.1,0,0-3.3,0-3.5c0-0.1,0-0.2,0.1-0.3c0.1-0.2,0.4-0.1,0.6-0.1c0,0,0.1,0,0.1,0 c0,0,0,0.1,0,0.2c-0.2,1.4,0.1,2.8,0.3,4.2C84.7,10.2,84.3,10,84,9.9z M106.5,13.4c-1.7,0-3.5,0.5-5.2,0.3c0.2-0.3,0.3-0.6,0.3-0.9 c0-0.5,4-0.6,4.6-0.7c0.1,0,0.3,0,0.4,0.1c0,0,0,0.1,0,0.1C106.5,12.7,106.5,13.1,106.5,13.4z M114.6,13.2c-0.1-0.3-0.1-0.5-0.1-0.8 l0.1,0c0.5-0.2,1.1-0.2,1.7-0.2c0,0.3,0.1,0.5,0.1,0.8C115.9,13.1,115.2,13.1,114.6,13.2z"></path> </svg> </div>' +
                            "</a>" +
                            '<i class="fancybox-counter"><i class="total">1</i> / <i class="length">10</i></i>' +
                            '<a class="fancybox-button fancybox-button--arrow_right" href="javascript:;">' +
                            '<div class="svg-absolute arrow-btn btn-next"> <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 60 29.4" enable-background="new 0 0 60 29.4" xml:space="preserve"> <path id="target" fill="#FFFFFF" d="M0,10.9v7.6h24c0.5-0.2,1-0.3,1.5-0.2c0.2,0,0.3,0.1,0.5,0.1l0,0l0,0c0,0,0.1,0,0.2,0 c0.1,0,0.1,0,0.1,0l0,0c0.5-0.2,0.9-0.3,1.5-0.1c0.1,0,0.3,0.1,0.4,0.2H37v10.9l23-14.7l-8.3-5.3c-0.4,0-0.8-0.1-1.2-0.3 c-0.2-0.1-0.4-0.3-0.6-0.4c-0.2-0.2-0.6-0.4-0.8-0.6H49h-0.1c-1,0.1-2-0.8-2.1-1.8L37.1,0v10.9h-7.3c-0.7,0.5-1.7,0.6-2.4,0.2l0,0 c0,0,0,0-0.1,0S27.1,11,27,11L0,10.9L0,10.9z M51.3,13c0-0.3,0.1-0.5,0.1-0.8c0.5,0.3,1.1,0.5,1.7,0.7V13c0.5-0.1,1.1,0.1,1.5,0.4 l0.1,0.1c0,0,0,0.1,0,0.2c0,0.3-0.1,0.5-0.2,0.7c-1.1-0.3-2.2-0.7-3.2-1.1c0,0-0.1,0-0.1-0.1C51.3,13.1,51.3,13,51.3,13z M47,11.6 c0-0.1,0.1-0.2,0.1-0.3c0.4-0.4,1-0.6,1.5-0.7c0.1,0,0.2,0,0.2,0c0.1,0,0,0.2,0,0.2h0.1c0.1,0.1,0.3,0.2,0.4,0.4 c0.1,0.2,0.1,0.4,0,0.5s-0.2,0.2-0.4,0.3c-0.4,0.2-0.7,0.3-1.1,0.5c-0.3-0.2-0.5-0.5-0.8-0.7C47,11.7,47,11.7,47,11.6z M40.1,19.7 c0.1-0.3,0.1-0.7,0.3-1v-0.1c0.1-0.1,0.2-0.1,0.3,0c0.6,0.2,1.1,0.5,1.4,0.9L42,19.4c-0.1,0.5-0.3,1-0.4,1.5c0,0.1,0,0.1-0.1,0.2 s-0.3,0-0.4-0.1c-0.3-0.2-0.5-0.5-0.8-0.7c-0.1-0.1-0.1-0.1-0.2-0.2C40.1,20,40.1,19.9,40.1,19.7z M39,10.3c0.3-1.4,0.5-2.8,0.3-4.2 c0-0.1,0-0.1,0-0.2h0.1C39.6,5.8,39.9,5.8,40,6c0.1,0.1,0.1,0.2,0.1,0.3c0,0.2,0.1,3.5,0,3.5C39.7,10,39.3,10.2,39,10.3z M17.5,12.3 v-0.1c0.1-0.1,0.2-0.1,0.4-0.1c0.5,0.1,4.6,0.2,4.6,0.7c0,0.3,0.1,0.6,0.3,0.9c-1.7,0.2-3.5-0.3-5.2-0.3 C17.6,13.1,17.5,12.7,17.5,12.3z M7.6,13.1c0-0.3,0.1-0.5,0.1-0.8c0.6-0.1,1.2,0,1.7,0.2h0.1c0,0.3,0,0.5-0.1,0.8 C8.8,13.1,8.2,13.1,7.6,13.1z"></path> <path id="focus" fill="#FFFFFF" d="M-63.7,10.9v7.6h24c0.5-0.2,1-0.3,1.5-0.2c0.2,0,0.3,0.1,0.5,0.1l0,0l0,0c0,0,0.1,0,0.2,0 s0.1,0,0.1,0l0,0c0.5-0.2,0.9-0.3,1.5-0.1c0.1,0,0.3,0.1,0.4,0.2h8.8v10.9l23-14.7L-12,9.4c-0.4,0-0.8-0.1-1.2-0.3 c-0.3-0.1-0.5-0.3-0.7-0.4c-0.2-0.2-0.6-0.4-0.8-0.6h-0.1h-0.1c-1,0.1-2-0.8-2.1-1.8L-26.7,0v10.9H-34c-0.7,0.5-1.7,0.6-2.4,0.2l0,0 c0,0,0,0-0.1,0s-0.2-0.1-0.3-0.1L-63.7,10.9L-63.7,10.9z M-12.4,13c0-0.3,0.1-0.5,0.1-0.8c0.5,0.3,1.1,0.5,1.7,0.7V13 c0.5-0.1,1.1,0.1,1.5,0.4l0.1,0.1c0,0,0,0.1,0,0.2c0,0.3-0.1,0.5-0.2,0.7c-1.1-0.3-2.2-0.7-3.2-1.1c0,0-0.1,0-0.1-0.1 C-12.4,13.1-12.4,13-12.4,13z M-16.8,11.6c0-0.1,0.1-0.2,0.1-0.3c0.4-0.4,1-0.6,1.5-0.7c0.1,0,0.2,0,0.2,0c0.1,0,0,0.2,0,0.2h0.1 c0.1,0.1,0.3,0.2,0.4,0.4c0.1,0.2,0.1,0.4,0,0.5s-0.2,0.2-0.4,0.3c-0.4,0.2-0.7,0.3-1.1,0.5c-0.3-0.2-0.5-0.5-0.8-0.7 C-16.7,11.7-16.8,11.7-16.8,11.6z M-23.6,19.7c0.1-0.3,0.1-0.7,0.3-1v-0.1c0.1-0.1,0.2-0.1,0.3,0c0.6,0.2,1.1,0.5,1.4,0.9h-0.1 c-0.1,0.5-0.3,1-0.4,1.5c0,0.1,0,0.1-0.1,0.2s-0.3,0-0.4-0.1c-0.3-0.2-0.5-0.5-0.8-0.7c-0.1-0.1-0.1-0.1-0.2-0.2 C-23.7,20-23.7,19.9-23.6,19.7z M-24.8,10.3c0.3-1.4,0.5-2.8,0.3-4.2c0-0.1,0-0.1,0-0.2h0.1c0.2-0.1,0.5-0.1,0.6,0.1 c0.1,0.1,0.1,0.2,0.1,0.3c0,0.2,0.1,3.5,0,3.5C-24,10-24.4,10.2-24.8,10.3z M-46.2,12.3v-0.1c0.1-0.1,0.2-0.1,0.4-0.1 c0.5,0.1,4.6,0.2,4.6,0.7c0,0.3,0.1,0.6,0.3,0.9c-1.7,0.2-3.5-0.3-5.2-0.3C-46.2,13.1-46.2,12.7-46.2,12.3z M-56.2,13.1 c0-0.3,0.1-0.5,0.1-0.8c0.6-0.1,1.2,0,1.7,0.2h0.1c0,0.3,0,0.5-0.1,0.8C-54.9,13.1-55.6,13.1-56.2,13.1z"></path> </svg> </div>' +
                            "</a>" +
                            '</div>' +
                            '</div>'
                        );

                        fill_counter(instance);

                        current.$content.find('.fancybox-button--arrow_left').click(function ()
                        {
                            instance.previous();
                            fill_counter(instance);
                        });

                        current.$content.find('.fancybox-button--arrow_right').click(function ()
                        {
                            instance.next();
                            fill_counter(instance);
                        });

                        $('.fancybox-bottom').find('.fancybox-title').text( instance.current.opts.caption );

                        $('.fbox-xs-navigate').find('.btn-prev').off('click').on('click', function () {
                            instance.previous();
                            fill_counter(instance);
                        });

                        $('.fbox-xs-navigate').find('.btn-next').off('click').on('click', function () {
                            instance.next();
                            fill_counter(instance);
                        });

                        if (src.global.is_mobile)
                        {
                            //src.body.addClass('fancybox-navigate');
                        }


                    }
                }
            });
        },
        Map: function ()
        {
            var $this = this,
                map;

            $this.drawMap = function (container, params)
            {
                container.empty();
                switch (params.service)
                {
                    case "google":
                    {
                        drawGoogle(container, params.opts);
                        break;
                    }
                    case "bing":
                    {
                        drawBing(container, params.opts);
                        break;
                    }
                    case "yandex":
                    {
                        drawYandex(container, params.opts);
                        break;
                    }
                }
            };

            function drawGoogle(container, params)
            {
                if (container.length == 0)
                {
                    return;
                }

                var myLatlng = new google.maps.LatLng(params.coord[0], params.coord[1]);
                var myOptions = {
                    zoom: params.zoom || 15,
                    center: myLatlng,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                map = new google.maps.Map(container.get(0), myOptions);
                var marker = new google.maps.Marker({
                    position: myLatlng,
                    title: params.title
                });
                marker.setMap(map);
            }

            function drawBing(container, params)
            {
                var mapOptions = {
                    credentials: "As-rJwEa98fsNL0Biz-Rg9wSord1YdyIF_duAZXiouL8nivqNZgZq-E6CXXk7oIg",
                    mapTypeId: Microsoft.Maps.MapTypeId.road,
                    center: new Microsoft.Maps.Location(params.coord[0], params.coord[1]),
                    zoom: 15
                };
                map = new Microsoft.Maps.Map(container.get(0), mapOptions);
            }

            function drawYandex(container, params)
            {
                ymaps.ready(function ()
                {

                    var center = params.coord;

                    if (params.markers)
                    {
                        center = params.center;
                    }

                    map = new ymaps.Map(container.get(0), {
                        load: 'package.full',
                        lang: src_config.lkey,
                        center: [ center[0], center[1] ],
                        zoom: params.zoom ? params.zoom : 15
                    });

                    map.behaviors.disable('scrollZoom');

                    var placemark_opts = params.placemark ? params.placemark : {};

                    if (params.markers)
                    {
                        params.markers.forEach(function (coord)
                        {
                            var myPlacemark = new ymaps.Placemark([ coord[0], coord[1] ],
                            {
                                hintContent: params.hint ? params.hint : src_config.site_name,
                                balloonContent: ''
                            }, placemark_opts);
                            map.geoObjects.add(myPlacemark);
                        });

                    } else
                    {
                        var myPlacemark = new ymaps.Placemark([ center[0], center[1] ],
                            {
                                hintContent: params.hint ? params.hint : src_config.site_name,
                                balloonContent: ''
                            }, placemark_opts);
                        map.geoObjects.add(myPlacemark);
                    }
                });
            }
        },
        Storage:
        {
            setVal: function(key, val)
            {
                try
                {
                    val = typeof val == 'object' ? JSON.stringify(val) : val;
                    return localStorage.setItem(key, val);
                } catch (e) {}
            },
            getVal: function (key)
            {
                try
                {
                    return localStorage.getItem(key);
                } catch (e) {
                    return null;
                }
            }
        },
        Tooltip: function ()
        {
            return new Vue({
                delimiters: ['<%', '%>'],
                data:
                {
                    current_toast_target : undefined,
                },
                mounted: function ()
                {
                    let self = this;
                    src.log('Tooltip -> mounted');
                    self.process();
                },
                methods:
                {
                    show: function (target, title, hideAfter)
                    {
                        let self = this;

                        src.log('Tooltip -> show: ', target);

                        if (self.current_toast_target != null)
                        {
                            target.tooltip('hide');
                        }

                        self.current_toast_target = target;

                        target.tooltip('dispose');

                        target.tooltip({
                            container: 'body',
                            html: true,
                            trigger: 'manual',
                            title: function() { return title; }
                        }).tooltip('show');

                        if (hideAfter != 0)
                        {
                            setTimeout(function () { target.tooltip('hide'); }, hideAfter);
                        }

                    },
                    hide: function ()
                    {
                        let self = this;

                        if (self.current_toast_target != null)
                        {
                            self.current_toast_target.tooltip('hide');
                        }
                    },
                    process: function ()
                    {
                        let self = this;

                        $('.twtip').tooltip({ placement:'top', html: true});
                        $('.twtip-right').tooltip({ placement:'right', html: true});
                    }
                }
            });
        },
        VComponents: function ()
        {
            // directives
            Vue.directive('click-outside', {
                bind: function (el, binding, vNode) {
                    // Provided expression must evaluate to a function.
                    if (typeof binding.value !== 'function') {
                        const compName = vNode.context.name;
                        var warn = `[Vue-click-outside:] provided expression '${binding.expression}' is not a function, but has to be`;
                        if (compName)
                        {
                            warn += `Found in component '${compName}'`
                        }

                        console.warn(warn)
                    }
                    // Define Handler and cache it on the element
                    const bubble = binding.modifiers.bubble;
                    const handler = function (e) {
                        if (bubble || (!el.contains(e.target) && el !== e.target)) {
                            binding.value(e)
                        }
                    }
                    el.__vueClickOutside__ = handler;

                    // add Event Listeners
                    document.addEventListener('click', handler)
                },
                unbind: function (el, binding) {
                    // Remove Event Listeners
                    document.removeEventListener('click', el.__vueClickOutside__);
                    el.__vueClickOutside__ = null;

                }
            });

            // input
            Vue.component('text-input',
                {
                    delimiters: ['<%', '%>'],
                    props:
                        {
                            placeholder  : { default: 'PLACEHOLDER' },
                            type         : { default: 'text' },
                            input_class  : { default: '' },
                            name         : { default: '' },
                            wp_class     : { default: '' },
                            label        : { default: 'Label *' },
                            value        : { default: '' },
                            list         : { default: undefined },
                            add_class    : { default: '' },
                            custom_class : { default: '' },
                            show_list    : { default: false },
                            onlyfromlist : { default: false },
                            id           : { default: undefined },
                            autocomplete : { default: 'off' },
                            number_format: { default: false},
                            input_placeholder : { default: ''},
                            storage_write: { default: false},
                            modal_input: { default: false},
                        },
                    data: function ()
                    {
                        return {
                            uid: 0,
                            is_error: false,
                            error_text: '',
                            watch_input: null,
                        }
                    },
                    watch:
                        {
                            value: function (val)
                            {
                                let self = this;
                                self.wp_class = 'filled';
                            }
                        },
                    methods:
                        {
                            on_blur: function ()
                            {
                                let self = this;

                                setTimeout(function ()
                                {

                                    let val = src.utils.trim(self.value);

                                    if (self.number_format !== false)
                                    {
                                        val = self.value = $( 'input[name="' + self.name + '"]' ).val();
                                    }

                                    self.wp_class = (val === '') ? '' : 'filled';
                                    self.add_class = '';

                                }, 150);
                            },
                            on_focus: function ()
                            {
                                let self = this;

                                self.add_class = 'focused';
                                self.wp_class = 'filled';
                            },
                            on_input: function ($event)
                            {
                                let self = this;
                                self.value = $event.target.value;
                            },
                            on_keypress: function ($event)
                            {
                                let self = this;

                                setTimeout( () => {
                                    self.value = $event.target.value;

                                    if (self.watch_input)
                                    {
                                        self.watch_input(self.value);
                                    }

                                }, 0);

                                self.value = $event.target.value;

                                if (self.onlyfromlist)
                                {
                                    $event.preventDefault();
                                }
                            },
                            fill_from_list: function (val, id)
                            {
                                let self = this;

                                self.value = val + '';
                                self.id = id;
                                self.show_list = false;
                                self.add_class = '';


                            },
                            click_outside: function ()
                            {
                                let self = this;

                                self.show_list = false;
                            },
                            error: function (text)
                            {
                                let self = this;

                                src.log('input -> error');

                                self.is_error = true;

                                self.error_text = text;
                            },
                            number_format_is_complete: function ()
                            {
                                let self = this;

                                if (self.number_format !== false)
                                {
                                    return $( 'input[name="' + self.name + '"]' ).inputmask('isComplete');

                                } else
                                {
                                    return self.value != '';
                                }
                            },
                            input_from_modal: function ()
                            {
                                let self = this;

                                src.modals.show('modal_input', {input: self});
                            },
                            process: function ()
                            {
                                let self = this;
                                if (self.number_format !== false)
                                {
                                    $( 'input[name="' + self.name + '"]' ).inputmask(self.number_format, {clearMaskOnLostFocus: false});
                                    self.wp_class = 'filled';
                                }
                            },
                            set_error: function () {

                            }
                        },
                    mounted: function ()
                    {
                        let self = this;

                        self.process();

                        src.log('text-input -> mounted');
                    },
                    template: `
                    <div class="custom-input"  :class="[wp_class, custom_class, {number_format: number_format !== false}, {has_input_placeholder: input_placeholder != ''}, { is_error : is_error }]">
                        
                        <input v-if="type != 'textarea'" ref="input" v-on:keypress="on_keypress" v-on:focus="on_focus" v-on:blur="on_blur" v-on:input="on_input" v-bind:value="value" :autocomplete="autocomplete" v-bind:name="name" v-bind:id="id" v-bind:type="type" v-bind:placeholder="input_placeholder" :class="input_class">
                        <textarea v-if="type == 'textarea'" ref="input" v-on:keypress="on_keypress" v-on:focus="on_focus" v-on:blur="on_blur" v-on:input="on_input" v-bind:value="value" :autocomplete="autocomplete" v-bind:name="name" v-bind:type="type" v-bind:placeholder="input_placeholder" :class="input_class"></textarea>
                        
                        <div class="border-1"></div>
                        <div class="border-2"></div>
                        <div class="placeholder"><% placeholder %></div>
                        <div class="error_tooltip"><% error_text %></div>
                        
                        <div v-if="modal_input" @click="input_from_modal" title="ввести текст" class="svg-absolute modal-input twtip"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 19 19" enable-background="new 0 0 19 19" xml:space="preserve"> <g> <path fill="#FFFFFF" d="M16,0c1.6,0,3,1.3,3,3c0,0.7-0.2,1.3-0.6,1.8l-1.2,1.2l-4.2-4.2l1.2-1.2C14.7,0.2,15.4,0,16,0L16,0z M1.2,13.7L0,19l5.3-1.2l11-11l-4.2-4.2L1.2,13.7z M13.3,6.7L5,15.1l-1-1l8.3-8.3L13.3,6.7z M13.3,6.7"/> </g> </svg></div>
                    </div>          
                    `
                });

            Vue.component('file-upload',
                {
                    delimiters: ['<%', '%>'],
                    props:
                        {
                            name :  { default: 'upload_file' },
                            label : { default: src_config.lex.no_file_selected ? src_config.lex.no_file_selected : 'файл не выбран' },
                            accept_mime: { default: 'image/jpeg,image/png,image/gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel' },
                        },
                    mounted: function ()
                    {
                        var self = this;

                        src.log('file-upload -> mounted');

                        self.process();
                    },
                    data: function ()
                    {
                        return {
                            uid: 0,
                            files: [],
                            uploaded_max: 5,
                            progress: false,
                            uploaded_count: 0,
                            upload_data: {},
                            upload_progress: 0,
                            uploaded_files: [],
                            uploaded_files_detail: [],
                        }
                    },
                    methods:
                        {
                            is_progress: function ()
                            {
                                var self = this;

                                return self.progress;
                            },

                            get_uploaded_count: function ()
                            {
                                var self = this;

                                return self.uploaded_count;
                            },

                            get_uploaded_join_names: function ()
                            {
                                var self = this;

                                var names = [];

                                self.uploaded_files.forEach(function (file)
                                {
                                    names.push(file.name);
                                });

                                return names.join(',');
                            },

                            start_upload: function ()
                            {

                            },

                            select_file: function ()
                            {
                                var self = this;

                                if (!self.progress && self.uploaded_count <= self.uploaded_max)
                                {
                                    $( self.$refs.input_file ).click();

                                } else
                                {
                                    src.log('file-upload -> max uploaded');
                                }
                            },

                            on_select_file: function (e)
                            {
                                var self = this;

                                if (e.target.files[0])
                                {
                                    src.log('upload -> ', e.target.files[0].name);

                                    setTimeout(function ()
                                    {

                                        if (self.form_data)
                                        {
                                            self.form_data.submit();
                                        }

                                    }, 100);

                                } else
                                {
                                    src.log('upload -> file not select');
                                }
                            },

                            remove_uploaded_file: function (file)
                            {
                                var self = this;

                                file = file || {};

                                src.log('file-upload -> remove_uploaded_file', file);

                                var name = file.name;

                                if (name)
                                {
                                    var index = null;

                                    self.uploaded_files.forEach(function (f, i)
                                    {
                                        if (f.name == name)
                                        {
                                            index = i;
                                        }
                                    });

                                    if (index != null)
                                    {
                                        self.uploaded_files.splice(index, 1);

                                        src.ajax( {d: {a: 'remove_file', name: name} } );
                                    }
                                }

                            },

                            reset: function ()
                            {
                                var self = this;

                                src.log('file-upload -> reset');

                                if (self.form_data)
                                {
                                    self.form_data = null;
                                }

                                self.process();

                                self.upload_progress = 0;
                                self.progress = false;
                            },

                            process: function ()
                            {
                                var self = this;

                                self.input_file = $( self.$refs.input_file );

                                self.input_file.fileupload({
                                    url       :  src_config.service + '?a=send_file',
                                    dataType  :  'json',
                                    singleFileUploads : false,
                                    sequentialUploads : true,
                                    replaceFileInput: true,
                                    autoUpload : false,
                                    add:  function (e, data)
                                    {
                                        self.progress = true;
                                        self.upload_data = data;
                                        self.label = 'загрузить еще';

                                        self.form_data = data;

                                        src.log('file-upload -> add,', data);

                                    },
                                    done: function (e, data)
                                    {
                                        var file_upload_result = data.result['upload_file'][0];

                                        if (file_upload_result.error)
                                        {
                                            src.log('file-upload -> error: ', file_upload_result.error);

                                            src.tooltip.show( $(self.$refs.file_upload), 'Произошла ошибка при загрузке файла', 3500 );

                                            self.reset();

                                            return;
                                        }

                                        self.uploaded_files.push(file_upload_result);
                                        self.uploaded_count += 1;

                                        src.log('file-upload -> add data', file_upload_result);

                                        if (self.on_process_complete != null)
                                        {
                                            try
                                            {
                                                self.on_process_complete(file_upload_result);

                                            } catch (e) {}
                                        }

                                        self.reset();
                                    },
                                    progressall: function (e, data)
                                    {
                                        self.upload_progress = parseInt(data.loaded / data.total * 100, 10);

                                        src.log('file-upload -> progress ', self.upload_progress);
                                    },
                                    error: function (e)
                                    {
                                        src.log('file-upload -> error ', e);

                                        alert('Ошибка при загрузке файла');

                                        self.reset();
                                    }
                                });
                            }
                        },
                    template: `
                            <div class="upload-wp" :class="{ 'upload-progress' : progress }" ref="file_upload">
                                <div class="svg-absolute loading d-flex"> 
                                    <svg class="circle-loader progress" width="40" height="40" version="1.1" xmlns="http://www.w3.org/2000/svg"> <circle cx="20" cy="20" r="15"> </svg> 
                                </div>
                                <div class="header d-flex align-items-center justify-content-between"> 
                                    <span>${src_config.lex.attach_file}</span>
                                    <div class="d-flex uploaded-icons">
                                        <div v-for="file in uploaded_files" class="svg-absolute uploaded-icon">
                                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 44 44"> <path d="m22,0c-12.2,0-22,9.8-22,22s9.8,22 22,22 22-9.8 22-22-9.8-22-22-22zm12.7,15.1l0,0-16,16.6c-0.2,0.2-0.4,0.3-0.7,0.3-0.3,0-0.6-0.1-0.7-0.3l-7.8-8.4-.2-.2c-0.2-0.2-0.3-0.5-0.3-0.7s0.1-0.5 0.3-0.7l1.4-1.4c0.4-0.4 1-0.4 1.4,0l.1,.1 5.5,5.9c0.2,0.2 0.5,0.2 0.7,0l13.4-13.9h0.1c0.4-0.4 1-0.4 1.4,0l1.4,1.4c0.4,0.3 0.4,0.9 0,1.3z"/> </svg>
                                          
                                            <div class="thumb-img">
                                                <div class="focus-zone"></div>
                                                <img :src="file.thumb_img">
                                                <div class="upload-remove" @click="remove_uploaded_file(file)">Убрать</div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                                <div class="upload-content d-flex justify-content-between align-items-center" @click="select_file">
                                    <span class=""><% label %></span>
                                    <div class="svg-absolute attach-icon">
                                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 23 21" enable-background="new 0 0 23 21" xml:space="preserve"> <g> <g id="Clip"> <g> <path fill="#FFFFFF" d="M21.3,1.8l-0.1-0.1c-2.4-2.3-6.2-2.3-8.6,0.1L1.7,12.7C0.9,13.5,0,15,0,16.3c0,1.3,0.5,2.4,1.4,3.3 C2.3,20.5,3.4,21,4.7,21h0C6,21,7.1,20.5,8,19.6l9.4-9.4c0.6-0.6,1-1.5,1-2.5c0-0.8-0.4-1.6-1-2.2c-0.6-0.6-1.5-1-2.3-1 c-0.9,0-1.7,0.3-2.3,1l-7.2,7.2c-0.2,0.2-0.3,0.4-0.3,0.7c0,0.5,0.4,1,1,1c0.3,0,0.5-0.1,0.7-0.3l0,0L14.1,7 c0.3-0.3,0.6-0.4,1-0.4c0.3,0,0.7,0.1,0.9,0.4c0.2,0.2,0.4,0.6,0.4,0.9c0,0.4-0.1,0.7-0.4,1l-9.4,9.4c-0.5,0.5-1.2,0.8-1.9,0.8h0 c-0.7,0-1.4-0.3-1.9-0.8C2.3,17.7,2,17.1,2,16.3c0-0.6,0.5-1.6,1.1-2.3L14,3.2c1.6-1.6,4.2-1.6,5.8,0l0.1,0.1 c1.5,1.6,1.5,4.2-0.1,5.8l-9,9c-0.2,0.2-0.3,0.4-0.3,0.7c0,0.5,0.4,1,1,1c0.3,0,0.5-0.1,0.7-0.3l0,0l9-9 C23.6,8,23.6,4.2,21.3,1.8z"/> </g> </g> </g> </svg>
                                    </div>
                                    <div class="progress-bar"></div>
                                    <input @change="on_select_file($event)" ref="input_file" type="file" :name="name" class="input-hidden" :accept="accept_mime">
                                </div>
                            </div>
                          `
                });

            Vue.component('input-captcha',
                {
                    delimiters: ['<%', '%>'],
                    props:
                        {
                            name : { default: '' },
                            label : { default: '' },
                        },
                    mounted: function ()
                    {
                        let self = this;
                        src.log('input-captcha -> mounted');
                        self.process();
                    },
                    data: function ()
                    {
                        return {
                            uid: 0,
                            captcha_sid: '',
                            captcha_url: src_config.service + '?a=captcha',
                            captcha_request: '',
                        }
                    },
                    watch:
                        {
                            captcha_sid: function (new_id)
                            {
                                let self = this;
                                self.captcha_request = self.captcha_url + '&sid=' + self.captcha_sid;
                            }
                        },
                    methods:
                        {
                            replace: function ()
                            {
                                let self = this;
                                self.captcha_sid = src.utils.makeString(10, false);
                            },
                            process: function ()
                            {
                                let self = this;
                                self.captcha_sid = src.utils.makeString(10, false);
                            }
                        },
                    template: `
                            <div class="input-captcha-wp" @click="replace" :style="{ 'background-image': 'url(' + captcha_request + ')' }"></div>
                          `
                });

            Vue.component('loading-box',
                {
                    delimiters: ['<%', '%>'],
                    template: `
                            <div class="loading-box">
                                <div class="svg-absolute loading d-flex"> <svg class="circle-loader progress" width="40" height="40" version="1.1" xmlns="http://www.w3.org/2000/svg"> <circle cx="20" cy="20" r="15"> </svg> </div>
                            </div>
                          `
                });

        },
        Modals: function (opt)
        {
            opt = opt || {};
            opt.processors = opt.processors || {};

            return new Vue({
                delimiters: ['<%', '%>'],
                el: '#modals-wp',
                template: '#modals-tpl',
                data:
                {
                    processors          : opt.processors,
                    current_modal       : '',
                    current_modal_jq    : null,
                    last_modal          : '',
                    effect              : 'md-effect-1',
                    hash                : location.hash.replace('#', ''),
                    allow_overlay_click : true,

                    current_toast_target : undefined,

                    modals: ['modal_alert',
                             'modal_task_add',
                             'modal_login'],

                    modal_alert:
                    {
                        text: ''
                    },

                    modal_login:
                    {
                        sending: false,

                        send: function ()
                        {
                            let data =
                            {
                                a: 'login',

                                user: src.modals.$refs.lg_user.value,
                                pwd: src.modals.$refs.lg_pwd.value,
                            };

                            src.modals.modal_login.sending = true;

                            src.ajax({ d: data }, function (d, t)
                            {
                                if ( d.ok == 1 )
                                {
                                    location.reload();

                                } else
                                {
                                    src.modals.toast( $('.login-send'), 'Неверный логин или пароль', 2500 );
                                }

                                src.modals.modal_login.sending = false;
                            });
                        }
                    },

                    modal_task_add:
                    {
                        id: null,
                        status: 1,
                        sending: false,

                        data: null,

                        show: function(v)
                        {
                            let self = v.modal_task_add;

                            src.log('show modal_task_add!', self.data);

                            if (self.data)
                            {
                                self.id = self.data.id;
                                src.modals.$refs.tk_name.value = self.data.name;
                                src.modals.$refs.tk_email.value = self.data.email;
                                src.modals.$refs.tk_description.value = self.data.description;
                                src.modals.$refs.tk_comment.value = self.data.comment;
                                self.status = self.data.status;

                            } else
                            {
                                self.status = 1;
                            }
                        },

                        hide: function(v)
                        {
                            let self = v.modal_task_add;

                            self.id = null;
                            self.data = null;
                        },

                        send: function ()
                        {
                            let data =
                            {
                                a: 'task_add',
                                id: src.modals.modal_task_add.id,
                                name: src.modals.$refs.tk_name.value,
                                email: src.modals.$refs.tk_email.value,
                                description: src.modals.$refs.tk_description.value,
                                comment: src.modals.$refs.tk_comment.value,
                                status: src.modals.modal_task_add.status
                            };

                            src.modals.modal_task_add.sending = true;

                            src.ajax({ d: data }, function (d, t)
                            {
                                src.modals.modal_task_add.sending = false;

                                if ( d.ok == 1 )
                                {
                                    src.modals.show('modal_alert', {text: 'Задача успешно сохранена'});

                                    src.datatable.grid_update();

                                } else
                                {
                                    src.utils.formShowError( $('.modal_task_add'), d.e );
                                }
                            });
                        }
                    },
                },
                computed:
                {
                    reserve_selected_rest_name: function ()
                    {
                        let self = this;
                        return self.modal_reserve.get_selected_rest_title(self);
                    },
                    reviews_selected_rest_name: function ()
                    {
                        let self = this;
                        return self.modal_reviews.get_selected_rest_title(self);
                    }
                },
                mounted: function ()
                {
                    let self = this;

                    src.log('Modals -> mounted');

                    self.process();
                },
                watch:
                {
                    'modal_reserve.select_date': function ()
                    {
                        var self = this;

                        self.modal_reserve.date = moment( self.modal_reserve.picker.getDate() ).format('DD MMM', src_config.lkey).replace('.', '');

                        let day = moment( self.modal_reserve.picker.getDate() ).day();

                        if (day == 6 || day == 0)
                        {
                            self.modal_reserve.time_range = self.modal_reserve.time_range_weekends;

                        } else
                        {
                            self.modal_reserve.time_range = self.modal_reserve.time_range_weekdays;
                        }

                        self.modal_reserve.time_name = src_config.lex.select;
                        self.modal_reserve.time_is_select = false;
                    },
                    'modal_reserve.rest_id': function (id)
                    {
                        var self = this;

                        let day = moment( self.modal_reserve.picker.getDate() ).day();

                        if (day == 6 || day == 0)
                        {
                            self.modal_reserve.time_range = self.modal_reserve.time_range_weekends;

                        } else
                        {
                            self.modal_reserve.time_range = self.modal_reserve.time_range_weekdays;
                        }

                        self.modal_reserve.time_name = src_config.lex.select;
                        self.modal_reserve.time_is_select = false;
                    },

                    'modal_reviews.select_date': function ()
                    {
                        var self = this;
                        self.modal_reviews.date = moment( self.modal_reviews.picker.getDate() ).format('DD MMM', src_config.lkey).replace('.', '');
                    },

                    'modal_route.current_route_type': function ()
                    {
                        var self = this;

                        self.modal_route.on_route_type_select();
                    },
                    'modal_reviews.char': function (new_val)
                    {
                        new_val == 'good' ?  $('.other-reviews-method-wp').slideDown(400) : $('.other-reviews-method-wp').slideUp(400);
                        new_val == 'good' ?  $('.waiter-name-wp').slideUp(400) : $('.waiter-name-wp').slideDown(400);
                    },

                    current_modal: function ()
                    {
                        var self = this;

                    }
                },
                methods:
                {
                    toast: function (target, title, hideAfter)
                    {
                        var self = this;

                        if (self.current_toast_target != null)
                        {
                            target.tooltip('hide');
                        }

                        self.current_toast_target = target;

                        target.tooltip('dispose');

                        target.tooltip({
                            container: 'body',
                            html: true,
                            trigger: 'manual',
                            title: function() { return title; }
                        }).tooltip('show');

                        if (hideAfter != 0)
                            setTimeout(function () { target.tooltip('hide'); }, hideAfter);
                    },
                    toast_hide: function ()
                    {
                        var self = this;

                        if (self.current_toast_target != null)
                        {
                            self.current_toast_target.tooltip('hide');
                        }
                    },
                    show: function (modal_id, opt)
                    {
                        var self = this;

                        opt = opt || {};

                        if (self.current_modal != modal_id)
                        {
                            if (opt.overlay_click != undefined)
                            {
                                self.allow_overlay_click = opt.overlay_click;
                            }
                            // setup
                            self.setup(modal_id, opt);

                            self.current_modal = modal_id;

                            // on show
                            if (self[ self.current_modal ])
                            {
                                if ('show' in self[ self.current_modal ] )
                                {
                                    self[ self.current_modal ].show(self);
                                }
                            }

                            self.current_modal_jq = $('#' + self.current_modal);

                            $(window).on("resize", function () { self.center_position(); }).trigger("resize");

                            self.last_modal = self.current_modal;
                        }
                    },
                    hide: function ()
                    {
                        var self = this;

                        if (self.current_modal != '')
                        {
                            // on hide
                            if (self[ self.current_modal ])
                            {
                                if ('hide' in self[ self.current_modal ] )
                                {
                                    self[ self.current_modal ].hide(self);
                                }
                            }

                            self.last_modal = self.current_modal = '';
                        }
                    },
                    setup: function (modal_id, opt)
                    {
                        var self = this;

                        opt = opt || {};

                        switch (modal_id)
                        {
                            case 'modal_alert':
                            {
                                if (opt.text)
                                {
                                    self.modal_alert.text = opt.text;
                                }

                                break;
                            }
                            case 'modal_task_add':
                            {
                                if (opt)
                                {
                                    self.modal_task_add.data = opt;
                                }

                                break;
                            }
                        }
                    },
                    overlay_click: function ()
                    {
                        var self = this;

                        if (self.allow_overlay_click)
                        {
                            self.hide();
                        }
                    },
                    center_position: function ()
                    {
                        var self = this;

                        var top = ( window.innerHeight - self.current_modal_jq.height() ) / 2;
                        self.current_modal_jq.css('top', top + 'px');
                    },
                    process: function ()
                    {
                        let self = this;



                        self.modals.forEach(function (modal)
                        {
                            if ( self[modal] && self[modal].process )
                            {
                                self[modal].process( self );
                            }
                        })
                    }
                }
            });
        },
        DataTable: function ()
        {
            return new Vue({
                delimiters: ['<%', '%>'],
                el: '#grid-wp',
                template: '#grid-tpl',
                data:
                {
                    tasks_list: src_config.task_list,
                    task_column: src_config.task_column,
                    datatable: null
                },
                computed:
                {
                    authorized: function()
                    {
                        return src_config.authorized;
                    },

                    tasks_list_count: function ()
                    {
                        let self = this;
                        return self.tasks_list.length;
                    },
                },
                mounted: function ()
                {
                    let self = this;

                    src.log('DataTable -> mounted');

                    self.process();
                },
                watch:
                {

                },
                methods:
                {
                    task_remove: function(id)
                    {
                        let self = this;
                        src.log('task_remove click', id);

                        let data =
                        {
                            a: 'task_remove',
                            id: id,
                        };

                        src.ajax({ d: data }, function (d, t)
                        {
                            if ( d.ok == 1 )
                            {
                                src.modals.show('modal_alert', {text: `Задача (${id}) удалена`});

                                self.grid_update();
                            }
                        });
                    },

                    task_update: function(id)
                    {
                        let self = this;
                        src.log('task_update click', id);

                        let data = self.tasks_list.filter( task => task.id == id )[0];

                        src.log('task_update click', data);

                        if (data)
                        {
                            src.modals.show('modal_task_add', data);
                        }
                    },

                    grid_update: function()
                    {
                        let self = this;
                        setTimeout(() => {location.reload();}, 500);
                    },

                    admin_updated: function(id)
                    {
                        return src_config.task_updated.includes(id)
                    },

                    date_format: function(ts)
                    {
                        let date = new Date(ts*1000);
                        return date.getDate() + '.' + date.getMonth()+1 + '.' + date.getFullYear();
                    },

                    process: function ()
                    {
                        let self = this;

                        self.datatable = $('.bj-table').DataTable({
                            pageLength: 3,
                            language: {url: "//cdn.datatables.net/plug-ins/1.10.20/i18n/Russian.json"}
                        });
                    }
                }
            });
        }
    },

    process_page: function ()
    {

        // Vue components
        src.com.VComponents();

        // modals
        src.modals = src.com.Modals();

        ///////////////////////////////////////////////
        switch (src.page)
        {
            case "index":
            {

                src.datatable = src.com.DataTable();

                $('.logout').on('click', function ()
                {
                    src.ajax({ d: {a : 'logout'} }, function (d, t) {
                        location.reload();
                    });
                });

                break;
            }
        }
        ///////////////////////////////////////////////


        // fbox
        // src.com.FancyBox('.fbox');
        // src.com.FancyBox('.fbox-zoom', {clickContent: true});


        // tooltip
        src.tooltip = src.com.Tooltip();
        src.tooltip.process();
    },

    scenes:
    {
        page_animation:
        {
            animate: function (page, opts)
            {
                var animations = src.scenes.page_animation;

                opts.delay = opts.delay || 0.8;

                if (animations[page])
                {
                    animations[page](opts);
                }
            },
        }
    },

    process_page_load: function ()
    {
        $('body').addClass('loaded');

        switch (src.page) {
            case "???":
            {

                break;
            }
        }
    },

    init: function ()
    {
        src.log = console.log;
        console.log = function(msg) { src.log.apply(this, arguments); };

        src.html = $('html');
        src.body = $('body');
        src.page = src.body.attr('id');

        let ua = detect.parse(navigator.userAgent);
        src.html.addClass(ua.browser.family.toLowerCase());

        $.cookie('ua', ua, { expires: 7, path: '/'  });
        $.cookie('client_size', window.innerWidth + 'x' + window.innerHeight, { expires: 7, path: '/'  });

        /*
         *
         * */
        src.process_page();
    }
};

$(document).ready(function () { src.init(); }).bind('click', src.events.doc_click);
$(window).on('load', function () { src.process_page_load(); })
         .on('resize', function () { src.events.on_resize() });







