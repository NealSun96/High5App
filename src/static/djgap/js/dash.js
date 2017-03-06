var baseUrl = getUrl();
var params = getAuthAndID();
var auth = atob(params[0]);
var teacher = auth.split(":")[0];
var id = params[1];
var new_course = id == "new_course";
var ap_tier = "manager";
var kt_tier = "manager";


$(document).ready(function(){
    // disable zooming in and zoomign out
    $(document).keydown(function(event) {
    if (event.ctrlKey==true && (event.which == '61' || event.which == '107' || event.which == '173' || event.which == '109'  || event.which == '187'  || event.which == '189'  ) ) {
        event.preventDefault();
     }
        // 107 Num Key  +
        // 109 Num Key  -
        // 173 Min Key  hyphen/underscor Hey
        // 61 Plus key  +/= key
    });

    $(window).bind('mousewheel DOMMouseScroll', function (event) {
       if (event.ctrlKey == true) {
       event.preventDefault();
       }
    });

    if (!new_course) {
        refresh();
    }
    
    $("#refresh").click(function(){setTimeout(function(){window.location.href = document.URL;});});
    
    $("#logout").click(function(){
       $("#logout").animate(function() {
           $("#logout").css("background-color:#4ECDC4;");
       });
       setTimeout(function(){window.location.href = baseUrl + "/courses/"+btoa(auth)});
    }); 

    
    if (new_course) {
        $("#1 span").text("NEW COURSE");
        $("#2").addClass("blocked");
        $("#3").addClass("blocked");
        $("#4").addClass("blocked");
        $("#5").addClass("blocked");
    } else {
        $(".menuItem").click(function(){
            if (!$(".menuItem").hasClass('.error')){
                $(".menuItem").removeClass("menuItemActive");
                $(".data").removeClass("active");
                var id = $(this).attr('id');
                $("#data"+id).addClass("active");
                $(this).addClass("menuItemActive");
            }
        });

    }
    
    $('.startTime').each(function() {
        
        $(this).timepicker({
            timeFormat: 'HH:mm:ss',});
    });
    
    $('.startDate').each(function() {
        $(this).datepicker(
        { dateFormat: 'yy-mm-dd' });
    });
    
    $("#courseSave").click(function(){
        editCourse();
    });
    
    $("#planSave").click(function(){
        editPlan();
    });
    
    $("#testUpload").click(function(){
        editTest();
    });
    
    $("#enroll").click(function(){
        enroll();
        refresh();
    });
    
    $('#errorItem').click(function(){
        $('#errorItem').fadeOut(100);
    });
    
    // tier listners
    $('#data2 select').on('change', function() {
        ap_tier = this.value;
        refresh();
    });

    $('#data3 select').on('change', function() {
        kt_tier = this.value
        refresh();
    });
    
    
});

function enroll() {
    return false;
}

function editCourse() {
    var endPoint;
    if (new_course) endPoint = baseUrl + "/api/v1/course/add_course/";
    else endPoint = baseUrl + "/api/v1/course/edit_course/" + id + "/";
    var start_time = $('.startDate').val() + "T"+$('.startTime').val()+"+08:00";
    var data = {
            "course_name": $(".courseName").val(),
            "start_time": start_time,
            "teacher": $(".courseIns").val(),
            "done": $('#courseDone').prop('checked')
        }
    $.ajax({
        type: "POST",
        url: endPoint,
        data: JSON.stringify(data),
        dataType: "json",
        success: function(data){
            if (teacher != data.teacher) {
                $("#logout").click();
            }
            else if (id != data.id) {
                setTimeout(function(){window.location.href = baseUrl + "/dashboard/"+btoa(auth)+"/"+data.id;});
            }
            else refresh();

        },
        error: function(data){
            error(data.responseText);
        },
        beforeSend: function(xhr){
            xhr.setRequestHeader("Authorization", "Apikey " + auth);
            xhr.setRequestHeader("Content-Type", "application/json");
        },
        complete: function(){
        }
    })
}

function editPlan() {
    var endPoint = baseUrl + "/api/v1/course/edit_assignments/"
    + id + "/action_plan/" + ap_tier + "/";
    var points = [];
    $("#data2 li input").each(function() { if ($(this).val() != "") {points.push($(this).val())} });
    var data = {
            "action_points": points
        }
    $.ajax({
        type: "POST",
        url: endPoint,
        data: JSON.stringify(data),
        dataType: "json",
        success: function(data){
            refresh();
        },
        error: function(data){
            error(data.responseText);
        },
        beforeSend: function(xhr){
            xhr.setRequestHeader("Authorization", "Apikey " + auth);
            xhr.setRequestHeader("Content-Type", "application/json");
        },
        complete: function(){
        }
    })
}

function editTest() {
    var endPoint = baseUrl + "/api/v1/course/edit_assignments/"
    + id + "/knowledge_test/" + kt_tier + "/";
    var questions = [];

    for (var i = 0; i < 10; i++) {
        var qbody = $("#q" + (i+1) + " .question").val();

        if (qbody == "") continue;

        var qscore = $("#q" + (i+1) + " .score").val();
        var qkeys = [];
        var qrightanswer = "";
        for (var j = 0; j < 4; j++) {
            qkeys.push($("#q" + (i+1) + " .opt" + (j+1)).val());
            if ($("#q" + (i+1) + " .option" + (j+1)).prop('checked')) {
                qrightanswer = $("#q" + (i+1) + " .opt" + (j+1)).val();
            }
        }
        questions.push({
            "question_body": qbody,
            "score": qscore,
            "answer_keys": qkeys,
            "right_answer": qrightanswer,
        })
    }
    var data = {
            "questions": questions
        }
    $.ajax({
        type: "POST",
        url: endPoint,
        data: JSON.stringify(data),
        dataType: "json",
        success: function(data){
            refresh();
        },
        error: function(data){
            error(data.responseText);
        },
        beforeSend: function(xhr){
            xhr.setRequestHeader("Authorization", "Apikey " + auth);
            xhr.setRequestHeader("Content-Type", "application/json");
        },
        complete: function(){
        }
    })
}


function refresh() {
    populateCourse();
    populateActionPlan();
    populateKnowledgeTest();
}

function error(message) {
    $('#errorItem span').text(message);
    $('#errorItem').fadeIn(500);
}

function populateCourse() {
    if (!new_course) {
        var endPoint = baseUrl + "/api/v1/course/"
        $.ajax({
            type: "GET",
            url: endPoint,
            data: {},
            success: function(data){
                for (var i = 0; i < data.objects.length; i++) {
                    if (data.objects[i].id == id) {
                        $(".courseName").val(data.objects[i].course_name);
                        var time = data.objects[i].start_time
                        $(".startTime").val(time.split("T")[1]);
                        $(".startDate").val(time.split("T")[0]);
                        $(".courseIns").val(teacher);
                        $("#courseDone").prop('checked', data.objects[i].done);

                        $(".inpTitle").val(data.objects[i].course_name)
                        $(".inpTitle").attr('size', $(".inpTitle").val().length);

                        break;
                    }
                }
            },
            error: function(data){
                error("无法找到课程，请返回后刷新重试");
            },
            beforeSend: function(xhr){
                xhr.setRequestHeader("Authorization", "Apikey " + auth);
                xhr.setRequestHeader("Content-Type", "application/json");
            },
            complete: function(){
            }
        })
    }
}

function populateActionPlan() {
    if (!new_course) {
        var endPoint = baseUrl + "/api/v1/course/get_assignments/"
        + id + "/action_plan/" + ap_tier;
        $.ajax({
            type: "GET",
            url: endPoint,
            data: {},
            success: function(data){
                var i = 0;
                var points = data.objects[0].action_points;
                for (; points != null && i < points.length; i++) {
                    $("#act" + (i+1)).val(points[i]);
                }
                for (; i < 10; i++) {
                    $("#act" + (i+1)).val("");
                }
            },
            error: function(data){
                error(data.responseText);
            },
            beforeSend: function(xhr){
                xhr.setRequestHeader("Authorization", "Apikey " + auth);
                xhr.setRequestHeader("Content-Type", "application/json");
            },
            complete: function(){
            }
        })
    }
}

function populateKnowledgeTest() {
    if (!new_course) {
        var endPoint = baseUrl + "/api/v1/course/get_assignments/"
        + id + "/knowledge_test/" + kt_tier;
        $.ajax({
            type: "GET",
            url: endPoint,
            data: {},
            success: function(data){
                var i = 0;
                var questions = data.objects[0].questions
                for (; questions != null && i < questions.length; i++) {
                    var question = questions[i];
                    $("#q" + (i+1) + " .question").val(question.question);
                    for (var j = 0; j < question.answer_keys.length; j++) {
                        var answer_key = question.answer_keys[j]
                        $("#q" + (i+1) + " .opt" + (j+1)).val(answer_key);
                        if (answer_key == question.right_answer) {
                            $("#q" + (i+1) + " .option" + (j+1)).prop('checked', true);
                        }
                        else {
                            $("#q" + (i+1) + " .option" + (j+1)).prop('checked', false);
                        }
                    }
                    $("#q" + (i+1) + " .score").val(question.score);
                }
                for ( ;i < 10; i++) {
                    $("#q" + (i+1) + " .question").val("");
                    for (var j = 0; j < 4; j++) {
                        $("#q" + (i+1) + " .opt" + (j+1)).val("");
                        $("#q" + (i+1) + " .option" + (j+1)).prop('checked', false);
                    }
                    $("#q" + (i+1) + " .score").val("");
                }
            },
            error: function(data){
                error(data.responseText);
            },
            beforeSend: function(xhr){
                xhr.setRequestHeader("Authorization", "Apikey " + auth);
                xhr.setRequestHeader("Content-Type", "application/json");
            },
            complete: function(){
            }
        })
    }
}

function exampleListToElement() {
    // list of sutend name I want to add to a predefined <ol> within dashboard.html
    var dummyStudents = ["Niesha Newbill","Analisa Hugo","Oralee Massingale","Setsuko Kotter","Patrica Sansone","Alice Leyba","Erica Donlan","Idell Callaway","Shoshana Killinger","TashaKaylor","Luella Pearson","Ricki Siegel","Heidy Jarrard","Irena Range","Brigette Perrin","Lawrence Caskey","Roberto Mcdaniel","Vaughn Tessier","ChinaColwell","Meda Rainville","Kellye Dollar","Wilfred Derosier","Robyn Uyehara","Niesha Newbill","Analisa Hugo","Oralee Massingale","Setsuko Kotter","Patrica Sansone","Alice Leyba","Erica Donlan","Idell Callaway","Shoshana Killinger","TashaKaylor","Luella Pearson","Ricki Siegel","Heidy Jarrard","Irena Range","Brigette Perrin","Lawrence Caskey","Roberto Mcdaniel","Vaughn Tessier","ChinaColwell","Meda Rainville","Kellye Dollar","Wilfred Derosier","Robyn Uyehara","Niesha Newbill","Analisa Hugo","Oralee Massingale","Setsuko Kotter","Patrica Sansone","Alice Leyba","Erica Donlan","Idell Callaway","Shoshana Killinger","TashaKaylor","Luella Pearson","Ricki Siegel","Heidy Jarrard","Irena Range","Brigette Perrin","Lawrence Caskey","Roberto Mcdaniel","Vaughn Tessier","ChinaColwell","Meda Rainville","Kellye Dollar","Wilfred Derosier","Robyn Uyehara","Niesha Newbill","Analisa Hugo","Oralee Massingale","Setsuko Kotter","Patrica Sansone","Alice Leyba","Erica Donlan","Idell Callaway","Shoshana Killinger","TashaKaylor","Luella Pearson","Ricki Siegel","Heidy Jarrard","Irena Range","Brigette Perrin","Lawrence Caskey","Roberto Mcdaniel","Vaughn Tessier","ChinaColwell","Meda Rainville","Kellye Dollar","Wilfred Derosier","Robyn Uyehara","Niesha Newbill","Analisa Hugo","Oralee Massingale","Setsuko Kotter","Patrica Sansone","Alice Leyba","Erica Donlan","Idell Callaway","Shoshana Killinger","TashaKaylor","Luella Pearson","Ricki Siegel","Heidy Jarrard","Irena Range","Brigette Perrin","Lawrence Caskey","Roberto Mcdaniel","Vaughn Tessier","ChinaColwell","Meda Rainville","Kellye Dollar"];
    

    // first loop through the list
    for (var i = 0; i < dummyStudents.length; i++){
        // construct html tag for the current student with class='student'
        var tag = "<li class='student'>" + dummyStudents[i] + "</li>"
        // apend it to the the sturent list using its iD
        $("#studentList").append(tag);
        // append will add tag to the end of the student list
        // $("#studentList").html(tag) will replace the entire list with tag
    }
    
}

function getUrl() {
    return location.protocol + "//" + location.hostname + (location.port && ":" + location.port);
}

function getAuthAndID() {
    var params = document.URL.split("/");
    return [params[params.length - 2], params[params.length - 1]];
}