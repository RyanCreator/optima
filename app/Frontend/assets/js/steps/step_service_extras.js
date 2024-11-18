(function ($) {
    // Track the last event timestamp to prevent double-firing
    let lastEventTime = 0;

    // Helper functions
    function handlePressAndHold(element, callback) {
        let timeout;
        let interval;

        const stopRepeating = () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };

        element.on('touchend mouseup mouseleave', stopRepeating);

        timeout = setTimeout(() => {
            interval = setInterval(callback, 250);
        }, 500);
    }

    function updateQuantity($input, increment) {
        let quantity = parseInt($input.val()) || 0;
        const maxQuantity = parseInt($input.data('max-quantity')) || 0;

        if (increment) {
            if (maxQuantity !== 0 && quantity >= maxQuantity) {
                quantity = maxQuantity;
            } else {
                quantity++;
            }
        } else {
            quantity = Math.max(0, quantity - 1);
        }

        $input.val(quantity).trigger('keyup');
        return quantity;
    }

    bookneticHooks.addAction('booking_panel_loaded', function (booknetic) {
        let booking_panel_js = booknetic.panel_js;

        booking_panel_js.on('click', '.booknetic_service_extra_card', function (e) {
            // If view more button is clicked inside services card
            if ($(e.target).is(".booknetic_view_more_service_notes_button")) {
                $(this).find('.booknetic_service_card_description_wrapped, .booknetic_view_more_service_notes_button').css('display', 'none');
                $(this).find('.booknetic_service_card_description_fulltext, .booknetic_view_less_service_notes_button').css('display', 'inline');
                booknetic.handleScroll();
            } else if ($(e.target).is('.booknetic_view_less_service_notes_button')) {
                $(this).find('.booknetic_service_card_description_wrapped, .booknetic_view_more_service_notes_button').css('display', 'inline');
                $(this).find('.booknetic_service_card_description_fulltext, .booknetic_view_less_service_notes_button').css('display', 'none');
                booknetic.handleScroll();
            }
        }).on('click', '.booknetic_extra_on_off_mode', function (e) {
            if ($(e.target).is('.booknetic_service_extra_quantity_inc, .booknetic_service_extra_quantity_dec'))
                return;

            if ($(this).hasClass('booknetic_service_extra_card_selected')) {
                $(this).find('.booknetic_service_extra_quantity_dec').trigger('click');
            } else {
                $(this).find('.booknetic_service_extra_quantity_inc').trigger('click');
            }
        }).on('click', '.booknetic_service_extra_quantity_inc', function () {
            var quantity = parseInt($(this).prev().val());
            quantity = quantity > 0 ? quantity : 0;
            var max_quantity = parseInt($(this).prev().data('max-quantity'));

            if (max_quantity !== 0 && quantity >= max_quantity) {
                quantity = max_quantity;
            } else {
                quantity++;
            }

            $(this).prev().val(quantity).trigger('keyup');
        }).on('click', '.booknetic_service_extra_quantity_dec', function () {
            var quantity = parseInt($(this).next().val());
            quantity = quantity > 0 ? quantity : 0;
            var min_quantity = parseInt($(this).next().attr('data-min-quantity'));

            if (quantity > min_quantity) {
                quantity--
            }

            $(this).next().val(quantity).trigger('keyup');
        }).on('focusout', '.booknetic_service_extra_quantity_input', function () {
            // prevent from bypassing restriction on manual input field type

            const quantity = parseInt($(this).val());
            const min_possible_input = $(this).data('min-quantity');
            const max_possible_input = $(this).data('max-quantity');

            let updated_quantity = quantity;

            if (quantity > max_possible_input) {
                updated_quantity = $(this).val(max_possible_input);
                updated_quantity = max_possible_input;
            } else if (quantity < min_possible_input) {
                $(this).val(min_possible_input);
                updated_quantity = min_possible_input;
            }

            if (updated_quantity > 0) {
                $(this).closest('.booknetic_service_extra_card').addClass('booknetic_service_extra_card_selected');
            } else {
                $(this).closest('.booknetic_service_extra_card').removeClass('booknetic_service_extra_card_selected');
            }
        }).on('keyup', '.booknetic_service_extra_quantity_input', function () {
            var quantity = parseInt($(this).val());
            if (!(quantity > 0)) {
                $(this).val('0');
                $(this).closest('.booknetic_service_extra_card').removeClass('booknetic_service_extra_card_selected');
            } else {
                $(this).closest('.booknetic_service_extra_card').addClass('booknetic_service_extra_card_selected');
            }
        }).on('touchstart mousedown', '.booknetic_number_of_brought_customers_inc', function (e) {
            // Prevent double-firing by checking time between events
            const currentTime = new Date().getTime();
            if (currentTime - lastEventTime < 100) {
                return false;
            }
            lastEventTime = currentTime;

            const $input = $(this).prev();
            updateQuantity($input, true);

            handlePressAndHold($(this), () => {
                const quantity = updateQuantity($input, true);
                const maxQuantity = parseInt($input.data('max-quantity')) || 0;
                if (maxQuantity !== 0 && quantity >= maxQuantity) {
                    $(this).trigger('mouseup');
                }
            });
        }).on('touchstart mousedown', '.booknetic_number_of_brought_customers_dec', function (e) {
            // Prevent double-firing by checking time between events
            const currentTime = new Date().getTime();
            if (currentTime - lastEventTime < 100) {
                return false;
            }
            lastEventTime = currentTime;

            const $input = $(this).next();
            updateQuantity($input, false);

            handlePressAndHold($(this), () => {
                const quantity = updateQuantity($input, false);
                if (quantity <= 0) {
                    $(this).trigger('mouseup');
                }
            });
        }).on('keyup', '.booknetic_number_of_brought_customers_quantity_input', function () {
            let val = Number($(this).val());
            let max = Number($(this).data('max-quantity')) || 0;

            if (!Number.isInteger(val) || val < 0) {
                $(this).val(0);
            } else if (max !== 0 && val > max) {
                $(this).val(max);
            }
        }).on('click', ".booknetic_category_accordion" /* doit bu services stepine de aiddi... */, function (e) {
            //todo: refactor me, no jokes...
            if ($(e.target).attr('data-parent') == 1) {
                let node = $(this).closest('.booknetic_category_accordion').find('>div').not(':first-child')

                if ($(e.target).hasClass('booknetic_service_category') && node.hasClass('booknetic_category_accordion_hidden')) {
                    node.slideToggle('fast');
                    node.removeClass('booknetic_category_accordion_hidden');
                    node.slideToggle(function () {
                        booknetic.handleScroll();
                    });

                    $(this).closest('.booknetic_category_accordion').toggleClass('active');
                } else {
                    if (node.hasClass('booknetic_category_accordion_hidden')) {
                        node.css('display', 'none');
                        node.removeClass('booknetic_category_accordion_hidden');
                    }

                    $(this).closest('.booknetic_category_accordion').toggleClass('active');
                    $(this).closest('.booknetic_category_accordion').find('>div').not(':first-child').slideToggle(function () {
                        booknetic.handleScroll();
                    });
                }

            }

        })

    });

    bookneticHooks.addFilter('step_validation_service_extras', function (result, booknetic) {
        booknetic.getSelected.serviceExtras().forEach(function (extra) {
            if (extra.quantity > extra.max_quantity) {
                result = {
                    status: false,
                    errorMsg: booknetic.__('You have exceed the maximum value for extra service(s).')
                };
            }
        });

        return result
    });

    bookneticHooks.addAction('before_step_loading', function (booknetic, new_step_id, old_step_id) {
        if (new_step_id !== 'service_extras')
            return;

        booknetic.stepManager.loadStandartSteps(new_step_id, old_step_id);
    });

    bookneticHooks.addAction('loaded_step', function (booknetic, new_step_id, old_step_id, ajaxData) {
        if (new_step_id !== 'service_extras')
            return;

        let booking_panel_js = booknetic.panel_js;

        let accordion = booknetic.panel_js.find(".bkntc_service_extras_list .booknetic_category_accordion");

        if (accordion.attr('data-accordion') == 'on') {
            accordion.toggleClass('active');
            // accordion.find('>div').not(':first-child').addClass('booknetic_category_accordion_hidden');
            accordion.attr('data-accordion', 'off');
        }

        if (BookneticData['skip_extras_step_if_need'] === 'on' && ajaxData.html.indexOf('booknetic_empty_box') > -1) {
            booking_panel_js.find('.booknetic_appointment_step_element[data-step-id="service_extras"]:not(.booknetic_menu_hidden)').hide();
            booknetic.stepManager.refreshStepNumbers();
            booknetic.stepManager.goForward();
        }
    });
})(jQuery);