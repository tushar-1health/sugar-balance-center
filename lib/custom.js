function store(data) {
    jQuery.each(data, function (k, v) {
        window.localStorage.setItem(k, v);
    });
}

function get(data) {
    return window.localStorage.getItem(data);
}

function unset(data) {
    jQuery.each(data, function (k, v) {
        window.localStorage.removeItem(v);
    });
}

function checkLogin() {
    if (get('id') != null) {
        return true;
    } else {
        return false;
    }
}

function getTimeDiff(startTime, curtime) {

    var date1 = new Date(startTime); // 9:00 AM
    var date2 = new Date(curtime);
    var diff = date1 - date2;
    return Math.floor(diff / 1000 / 60);
}
function getBeforeTime(startTime, minutes) {
    var d = new Date(startTime);
    return d.setMinutes(d.getMinutes() - 10);
}

function getDayAfter(startTime, noofDay) {
    var strtDt = new Date(startTime);
    return strtDt.setDate(strtDt.getDate() + noofDay);
}
var x2js = new X2JS();
function convertXml2JSon(val) {
    return JSON.stringify(val);
}

function convertJSon2XML(val) {
    return x2js.json2xml_str(val);
}
function addOther(name, field, val) {
    if (jQuery('#' + name + '-1').length == 0) {
        if (val == 0) {
            var htmlStr = '';
            htmlStr = "<div id='" + name + "-1'><label class='item item-input item-floating-label'><input type='text' name='new-" + name + "' ng-model='records." + name + "' placeholder='Please Enter " + field + "' required /></label></div>";
            $("[name='" + name + "']").parent().parent().append(htmlStr);//.append('<button type="button" class="button button-small addbtn" onclick="removeOther(\'' + name + '-' + 1 + '\',this)" id="rem-' + name + '-1" >Remove</button>');
        } else {
            jQuery('#' + name + '-1').remove();
            jQuery('#rem-' + name + '-1').remove();
        }
    } else {
        jQuery('#' + name + '-1').remove();
        jQuery('#rem-' + name + '-1').remove();
    }

}
function removeOther(ele) {
    console.log(ele);
    $("#rem-" + ele).remove();
    $('#' + ele).remove();
}
function addNew(name) {
    var num = $("[name='" + name + "[]']").length;
    toClone = $("[name='" + name + "[]']:first").parent().clone().prop('id', name + '-' + num);
    $("[name='" + name + "[]']").parent().parent().append(toClone).append('<button type="button" class="button button-small addbtn" onclick="removeElement(\'' + name + '-' + num + '\',this)" id="rem-' + name + '-' + num + '" >Remove</button>');
}
function removeElement(ele) {
    console.log(ele);
    $("#rem-" + ele).remove();
    $('#' + ele).remove();
}

function toggleclass(b) {
    $('.timesheet li').removeClass('active');
    $(b).toggleClass('active');

}

function classtoggle(b) {
    console.log()
    // $('.joinfooter .tab-item').removeClass('active');
    $(b).toggleClass('active');

}

//Ajax Calls 
function callAjax(aType, aUrl, aData, callback) {
    var res = '';
    $.ajax({
        type: aType,
        url: aUrl,
        data: aData,
        cache: false,
        contentType: false,
        processData: false,
        success: callback,
        error: function (e) {
            res = e.responseText;
        }
    });
    return res;
}

//Ajax Calls 
function ajaxCall(aType, aUrl, aData) {
    $.ajax({
        type: aType,
        url: aUrl,
        data: aData,
        cache: false,
        success: function (data) {
            return data;
            //console.log(response);
        },
        error: function (e) {
            return e.responseText;
        }
    });
}

function checkIsMealEmpty(meal) {
    console.log(meal.length);
    var isEmptyObj;
    for (var i = 0; i < meal.length; i++) {
        console.log((meal[i]['time']));
        if (meal[i]['time'] != '' && meal[i]['details'] != '') {
            isEmptyObj = 'not empty';
            break;
        }
        if (isEmptyObj) {
            break;
        }
    }
    return isEmptyObj;
}

function createElement(data) {
    var htmlStr = '';
    var options = '';
    var parts = [];
    //return data.field_types.name;
    switch (data.field_types.value) {
        case "select":
            htmlStr = "<label class='item item-input item-select'><div class='input-label'>Please select " + data.field + "</div><" + data.field_types.value;
            (data.multi_value) ? htmlStr += " name='" + data.name + "[]' multiple" : htmlStr += " name='" + data.name + "'";
            htmlStr += " ng-model='record." + data.name + "' >";
            parts = (data.field_values).split(',');
            //htmlStr += "<option value=''>Please select " + data.field + "</option>";
            for (var i = 0; i < parts.length; i++) {
                htmlStr += "<option>" + parts[i] + "</option>";
            }
            htmlStr += "</" + data.field_types.value + "></label>";
            break;

        case "textarea":
            htmlStr = "<label class='item item-input'><" + data.field_types.value + " name='" + data.name + "' ng-model='record." + data.name + "' placeholder='Please Enter " + data.field + "'  ></" + data.field_types.value + "></label>";
            break;

        case "time":
            htmlStr += "<label class='item item-input item-floating-label'><input type='time' name='" + data.name + "' ng-model='record." + data.name + "' /></label>";
            break;

        case "date":
            htmlStr += "<label class='item item-input item-stacked-label'><span class='input-label'> " + data.field + "</span><input type='date' name='" + data.name + "' ng-model='record." + data.name + "' /></label>";
            break;

        case "file":
            htmlStr = "<label class='item item-input item-floating-label'><input type='" + data.field_types.value + "' name='" + data.name + "[]' multiple ng-model='record." + data.name + "' placeholder='Please Enter " + data.field + "' /></label>";
            break;

        case "radio":
            htmlStr = "<ion-list ><div class='row'>";
            parts = (data.field_values).split(',');
            for (var i = 0; i < parts.length; i++) {
                htmlStr += "<div class='col cradio'><ion-radio ng-value='" + parts[i] + "' name='" + data.name + "' ng-model='" + data.name + "'  >" + parts[i] + "</ion-radio></div></label>";
                //htmlStr += "<label class='item item-radio'><input type='radio' name='" + data.name + "' ng-model='record." + data.name + "' placeholder='Please Enter " + data.field + "' ng-value='"+parts[i]+"' value='"+parts[i]+"' /></label>";
            }
            htmlStr += "</div></ion-list>";
            break;

        case "checkbox":
            htmlStr = "<ion-list>";
            parts = (data.field_values).split(',');
            for (var i = 0; i < parts.length; i++) {
                htmlStr += "<ion-checkbox ng-model='record." + parts[i] + "' value='" + parts[i] + "' name='" + data.name + "' >" + parts[i] + "</ion-checkbox>";
            }
            htmlStr += "</ion-list>";
            break;

        case "range":
            htmlStr += "<div class='row'><div class='col'><label class='item item-input item-floating-label'><input type='number' name='" + data.name + "[]' ng-model='record." + data.name + "' placeholder='Enter min range' /></label></div>";
            htmlStr += "<div class='col'><label class='item item-input item-floating-label'><input type='number' name='" + data.name + "[]' ng-model='record." + data.name + "' placeholder='Enter max range' /></label></div></div>";
            break;

        default:
            htmlStr = "<label class='item item-input item-floating-label'><input type='" + data.field_types.value + "'";
            (data.multi_value) ? htmlStr += " name='" + data.name + "[]' class='toClone' " : htmlStr += " name='" + data.name + "'";
            htmlStr += " ng-model='record." + data.name + "' placeholder='Please Enter " + data.field + "' /></label>";
            if (data.multi_value)
                htmlStr += "<br/><button type='button' class='button button-small button-block addbtn' data-role='none' onclick='addNew(\"" + data.name + "\")'>Add New</button><br/>";
            break;
    }
    return htmlStr;
}
function removeFile() {
    console.log('remove');
    jQuery('.img').val('');
    jQuery('#image-holder').empty();
    jQuery('#convalid').addClass('hide');
    jQuery('#coninprec').addClass('hide');
}
function removeCamFile() {
    console.log('remove');
    jQuery('#camera-status').empty();
    //$scope.image = [];
}

function selectcheckbox(ab) {
    jQuery(ab).toggleClass('cactive');
}

function sidetab(ab){
        var wh=jQuery(window).height();
        var ww=(jQuery(window).width())-45;
        var b=jQuery(ab).offset().top;
        var t=wh-(b+80);
       
        jQuery(ab).css('height',t+'px');
        jQuery(ab).css('width',ww);
         jQuery(ab).css('transform','translate3d('+(ww+5)+'px, 0px, 0px)');
}

function unjumble(key,text){
    var returntext ="";
    for(i=0;i<text.length;i++){
        returntext=returntext+String.fromCharCode(text.charCodeAt(i)-key);
    }
    return returntext;
}

function encrypt (text){
    var returntext = cryptico.encrypt(text, publicKey);
    return returntext.cipher;
}

function decrypt (text){
    var returntext = cryptico.decrypt(text, privateKey);
    return returntext.plaintext;
}
