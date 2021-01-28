function jq_ui_alert(div_id, theMESSAGE) {
    var theICON = '<span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 0 0;"></span>';
    $("#" + div_id).html('<P>' + theICON + theMESSAGE + '</P>');
    $("#" + div_id).dialog({
        modal: true,
        buttons: {
            Ok: function () {
                $(this).dialog("close");
            }
        }
    });
}

$(document).ready(function() {
    $("#get_psurl").button({
        icons: {
            primary: "ui-icon-gear",
            secondary: "ui-icon-triangle-1-s"
        }
    });

    const apigw_endpt = "https://mk4tkjgt8k.execute-api.ca-central-1.amazonaws.com/api";
    
	$("#get_psurl").click(function() {
        jq_ui_alert('dialog-message', "File Selected");

        var name = document.getElementById('fileInput');
        // jq_ui_alert('dialog-message', 'Selected file: ' + name.files.item(0).name);
        // jq_ui_alert('dialog-message', 'Selected file: ' + name.files.item(0).size);
        // jq_ui_alert('dialog-message', 'Selected file: ' + name.files.item(0).type);

        var nameOfFile = name.files.item(0).name;

        if (nameOfFile.length > 0) {
            $("#selectedFile").html(nameOfFile);
            $.ajax({
                // The URL for the request
                url: apigw_endpt + "/generate_presigned_url",
                // The data to send (will be converted to a query string)
                data: {
                    file_name: nameOfFile, sid: Math.random()
                },
                // Whether this is a POST or GET request
                type: "GET",
                // The type of data we expect back
                dataType : "json",
                // Code to run if the request succeeds;
                // the response is passed to the function
                success: function( json ) {
                    $("#psurl_result").html(json.fields);
                    console.log("Input File: " + nameOfFile);
                    console.log("Status Return: " + json.status );
                    console.log("PreSign Return: " + json.fields);
                },
                // Code to run if the request fails; the raw request and
                // status codes are passed to the function
                error: function( xhr, status, errorThrown ) {
                    jq_ui_alert( 'dialog-message', "Sorry, there was an AJAX problem with ..." );
                    console.log( "Error: " + errorThrown );
                    console.log( "Status: " + status );
                    console.dir( xhr );
                },
                // Code to run regardless of success or failure
                complete: function( xhr, status ) {
                    //jq_ui_alert( 'dialog-message', "The request is complete!" );
                }
            });
        } else {
            jq_ui_alert('dialog-message', "No File Selected");
        }
    });
});