/*jshint browser: true, devel: true, jquery: true*/


$(document).ready(function () {

    //ECB REVISED FLOW PROTOTYPE

    // Stepped nav functionality
    var stepped_nav_functionality = function(path){
        
        var active_step = 'nav-step-' + $('.step-title').attr('data-step'),
        active_number = parseInt($('.step-title').attr('data-step'));

        $('#' + active_step).addClass('active');

        sessionStorage.setItem(active_step, 'visited');

        var step_titles = ["position.html", "hours.html", "pay.html", "leave.html", "obligations.html", "ending-employment", "review.html", "finalise.html"];

        for (var step = 0; step < step_titles.length; step++) {
            var step_number = step + 1,
                step_str = 'nav-step-' + step_number;
            var state = sessionStorage.getItem(step_str);

            if (step_number < active_number) {
                $('#' + step_str).addClass('completed').attr('href', path + step_titles[step]);
            } else if ( step_number > active_number) {
                if (state == "visited" && !$('#' + step_str).hasClass('active')) {
                        $('#' + step_str).addClass('completed').attr('href', path + step_titles[step]);
                    }
            }
        }

        var completed_number;
        $('.stepped-navigation .step').each(function(index){
            var step = index + 1,
            visited_state = sessionStorage.getItem('nav-step-'+ step);
            if (visited_state == 'visited') {
               completed_number = step;
            } 
        });
        if (completed_number > active_number) {
            $('.step.active').addClass('completed');
            $('.step.completed').last().addClass('visited').removeClass('completed');
        } else {
            $('.step.active').removeClass('completed');
        }

    };

    if ($('#ecb-prototype .stepped-navigation-wrapper').length) {

        var location = window.location.href,
        path;

        if(location.includes('tasks')) {
            if (location.includes('mobile')) {
                path = '/ecb-save-tested-version/prototypes/ecb/tasks-mobile/';
            } else {
                path = '/ecb-save-tested-version/prototypes/ecb/tasks/';
            }
        } else {
            path = '/ecb-save-tested-version/prototypes/ecb/';
        }
        
        stepped_nav_functionality(path);

    }

    // Reset tool on "Create new contract"
   $('#ecb-prototype .clear-tool').on('click', function(e) {
        e.preventDefault();
        
        var location = $(this).attr('href'),
        fragment = sessionStorage.getItem('fragment'),
        current_task = sessionStorage.getItem('current_task'),
        task1 =  sessionStorage.getItem('task1'),
        task2 =sessionStorage.getItem('task2'),
        task3 = sessionStorage.getItem('task3'),
        task4 = sessionStorage.getItem('task4');
        
        sessionStorage.clear();

        if(fragment) {
            sessionStorage.setItem('fragment', fragment);
        };
        if (current_task) {
            sessionStorage.setItem('current_task', current_task);
        }
        if (task1) {
            sessionStorage.setItem('task1', task1);
        }
        if (task2) {
            sessionStorage.setItem('task2', task2);
        }
        if (task3) {
            sessionStorage.setItem('task3', task3);
        }
        if (task4) {
            sessionStorage.setItem('task4', task4);
        }
        sessionStorage.setItem('ecb-link-clicked','true');

        window.location = location;
    });

    // Sticky stepped nav behaviour
    if ($('#ecb-prototype .stepped-navigation-wrapper').length) {

        var window_width = window.innerWidth,
            sticky_position;

        if (window_width <= 768) {
            sticky_position = $('.stepped-navigation-wrapper').offset();
        } else {
            sticky_position = $('.stepped-navigation-wrapper .stepped-navigation-wrapper').offset();
        }

        $(window).scroll(function () {
            if ($(window).scrollTop() > sticky_position.top) {
                $('#page-header').addClass('fixed');
                $('.page-content').addClass('fixed');
            } else {
                $('#page-header').removeClass('fixed');
                $('.page-content').removeClass('fixed');
            }
        });
    }


    // Save text input & select answers and re-populate on page load
    $('#ecb-prototype input[type=text], #ecb-prototype select').on('change', function () {
        var input_field = $(this).attr('id'),
            input_value = $(this).val();
        sessionStorage.setItem(input_field, input_value);
    });

    var save_input_answers = function (id) {
        if (sessionStorage.getItem(id) !== null) {
            var user_input = sessionStorage.getItem(id);
            $('#' + id).val(user_input);

            if (user_input !== "") {
                $('.' + id).addClass('added').find('.component-text span').text(user_input);
            }
        }
    };

    // Save checkbox answers and re-populate on page load
    $('#ecb-prototype input[type=checkbox]').on('change', function () {
        var input_field = $(this).attr('id');
        if ($(this).is(":checked")) {
            input_value = $(this).parents('.checkboxes').find('label').text();
            sessionStorage.setItem(input_field, input_value);
        } else {
            sessionStorage.setItem(input_field, "");
        }
    });
    var save_checkbox_answers = function (id) {
        if (sessionStorage.getItem(id) !== null) {
            var user_input = sessionStorage.getItem(id);

            if (user_input !== "") {
                $('#' + id).prop('checked', true);
                $('.' + id).addClass('added');
            }
        }
    };

    // Save radio answers and re-populate on page load
    $('#ecb-prototype input[type=radio]').on('change', function () {
        var input_field = $(this).parents('.radios').attr('id'),
            input_value = $(this).attr('id'),
            field_text = $(this).attr('data-value');
        sessionStorage.setItem(input_field, input_value);
        sessionStorage.setItem(input_field + '-text', field_text);
    });
    var save_radio_answers = function (radio_group) {
        if (sessionStorage.getItem(radio_group) !== null) {
            var user_input = sessionStorage.getItem(radio_group),
                field_text = sessionStorage.getItem(radio_group + '-text');

            $('#' + user_input).prop('checked', true);
            $('.' + radio_group).addClass('added').find('.component-text span').text(field_text);
        }
    };

    // Change PAY UNITS on radio button selection (pay page)
    $('#ecb-prototype #pay-rate-units input').on('change', function () {
        $('#pay-rate-units label span').text($(this).attr('data-value'));
        
        if ($(this).attr('data-value') == 'weekly') {
            $('.pay-unit').text('per week');
            $('.pay-rate .pay-units').text('per week');
            
        } else {
            $('.pay-unit').text('per hour');
            $('.pay-rate .pay-units').text('per hour');
        }
    });
    // Change PAY UNITS on text input change (pay page)
    $('.tool-output-box-input#pay-rate').on('change', function () {
        var pay_units = sessionStorage.getItem('pay-rate-units');

        if (pay_units == 'hourly') {
            $('.pay-unit, .pay-units').text('per hour');
        } else {
            $('.pay-unit, .pay-units').text('per week');
        }
    });

    // Apply saved user answer on page load
    if ($('.position-page').length) {
        save_input_answers('position-title');
        save_input_answers('business-structure');
        save_radio_answers('employment-type');
    }

    if ($('.hours-page').length) {
        save_input_answers('hours-worked');
        save_checkbox_answers('flexible-hours');
    }

    if ($('.pay-page').length) {
        save_input_answers('pay-rate');
        save_radio_answers('pay-rate-units');
        save_radio_answers('pay-frequency');

        var pay_units = sessionStorage.getItem('pay-rate-units');
        if ((pay_units !== null) && (pay_units == 'weekly')) {
            $('.pay-unit').text('per week');
            $('.pay-rate .pay-units').text('per week');
            $('#pay-rate-units label span').text('weekly');
        }
    }

    if ($('.review-page').length) {
        if (sessionStorage.getItem('flexible-hours') == "" || sessionStorage.getItem('flexible-hours') == null) {
            $('.results-edit-answers-component.flexible-hours').addClass('d-none');
        }

        $('.results-edit-answers-component').each(function () {
            var field_type = sessionStorage.getItem($(this).attr('data-field'));
            $(this).find('.answers span').text(field_type);
        });
        if (sessionStorage.getItem('pay-rate-units') == 'weekly') {
            $('.answers .pay-units').text('per week');
        }
    }

    // Add url fragments for task tracking in Loop11    
   /*
    var set_fragment = function(task_str){
        var current_fragment = sessionStorage.getItem('fragment');
        if (!current_fragment) {
            current_fragment = "";
        }
        
        var new_fragment;
        
        if (current_fragment.includes(task_str)) {
            new_fragment = current_fragment;
                
            } else {
                new_fragment = current_fragment + task_str;
            } 
            window.location.hash = new_fragment;
            sessionStorage.setItem('fragment', new_fragment);    
    };
    */
    
    // GET current task function
    /* 
    var get_current_task = function(){
        if ($('#ecb-prototype').length) {
            var current_task;
            if (sessionStorage.getItem('task4')== 'true') {
                current_task = 'task4';

            } else if ( (sessionStorage.getItem('task3')== 'true') &! (sessionStorage.getItem('task4')== 'true') ) {
                current_task = 'task3';
            }  else if ( (sessionStorage.getItem('task2')== 'true') &! (sessionStorage.getItem('task3')== 'true') &! (sessionStorage.getItem('task4')== 'true') ) {
                current_task = 'task2';
            } else if ((sessionStorage.getItem('task1')== 'true') &! (sessionStorage.getItem('task2')== 'true') &! (sessionStorage.getItem('task3')== 'true') &! (sessionStorage.getItem('task4')== 'true')) {
                current_task = 'task1'
            }
            sessionStorage.setItem('current_task', current_task);
            console.log(current_task);
        }
    };
    */
    
    // Set task number to true in sessionStorage when a task landing page loads & set nav steps for each task.
    /*
    if (window.location.href.includes("task1-start.html")) {
        console.log('task1 start page');
        sessionStorage.setItem('task1', 'true'); 
    }

    if (window.location.href.includes("task2-start.html")) {
        console.log('task2 start page');
        sessionStorage.setItem('task2', 'true');
        sessionStorage.setItem('nav-step-1', 'visited');
        sessionStorage.setItem('nav-step-2', 'visited');
        sessionStorage.setItem('nav-step-3', 'visited');
        sessionStorage.setItem('nav-step-4', 'visited');
        sessionStorage.setItem('nav-step-5', 'visited');   
    }

    if (window.location.href.includes("task3-start.html")) {
        console.log('task3 start page');
        sessionStorage.setItem('task3', 'true'); 
        sessionStorage.setItem('nav-step-1', 'visited');
        sessionStorage.setItem('nav-step-2', 'visited');
        sessionStorage.setItem('nav-step-3', 'visited');
        sessionStorage.setItem('nav-step-4', 'visited');
        sessionStorage.setItem('nav-step-5', 'visited');   
    }

    if (window.location.href.includes("task4-start.html")) {
        console.log('task4 start page');
        sessionStorage.setItem('task4', 'true');
        sessionStorage.setItem('nav-step-1', 'visited');
        sessionStorage.setItem('nav-step-2', 'visited');
        sessionStorage.setItem('nav-step-3', 'visited');
        sessionStorage.setItem('nav-step-4', 'visited');
        sessionStorage.setItem('nav-step-5', 'visited');    
    }

    get_current_task();
    */

    // Track button clicks with URL fragments
    /*
    $('#verify-btn').on('click', function(){
        if (sessionStorage.current_task == "task1") {
            set_fragment("T1-email");
        }
    });
 
    $('#ecb-prototype .stepped-navigation .step').on('click', function(e){
       
        if ($(this).hasClass('active')) {
            e.preventDefault();
        } else {
            e.preventDefault();
            sessionStorage.setItem('ecb-link-clicked','true');
            var href = $(this).attr('href');

            if (sessionStorage.current_task == "task2") {
                set_fragment("T2-nav"); 
            } else if (sessionStorage.current_task == "task4") {
                set_fragment("T4-nav");
            } 
            
            window.location = href;
        }

    });

    $('.ecb-button-group .prev, .ecb-button-group .next').on('click', function(e){     
        e.preventDefault();
        sessionStorage.setItem('ecb-link-clicked','true'); 
        var href = $(this).attr('href');

        if (sessionStorage.current_task == "task2") {
            set_fragment("T2-bottom"); 
        } else if (sessionStorage.current_task == "task4") {
            set_fragment("T4-bottom"); 
        }
        window.location = href

    });


    $('.checklist-item-title, .checklist-toggle').on('click', function(){
        if (sessionStorage.current_task == "task3") {
            set_fragment("T3-openitem");
        }
    });

    $('.new-contract').on('click', function(e){     
        e.preventDefault();
        sessionStorage.setItem('ecb-link-clicked','true');

        if (sessionStorage.current_task == "task4") {
            set_fragment("T4-createbtn");
        }
    });

    $('.edit-btn').on('click', function(){
        e.preventDefault();
        sessionStorage.setItem('ecb-link-clicked','true');
        var href = $(this).attr('href');
        window.location = href
    });
    */

    // On page unload add page location to sessionStorage in 'prev_location' item
    /*
    $(window).on('beforeunload', function () {
        var location = window.location.pathname;
        sessionStorage.setItem('prev-location', location);     
    });  

     // Load existing URL fragments on page load.
     var existing_fragment = sessionStorage.getItem('fragment');
     if (existing_fragment) {
         window.location.hash = existing_fragment;
     };
     */
    

}); //End doc ready

// Ensure URL fragments are added to the url (this catches back button clicks that)
/*
window.onhashchange = function() {
    var existing_fragment = sessionStorage.getItem('fragment');
    if (existing_fragment) {
        window.location.hash = existing_fragment;
    };
}
*/