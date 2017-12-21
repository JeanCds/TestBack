$('#Action1BtnHtml').on('click', function (){
  $.ajax({
    type: 'POST',
    url: '/api/Job/JobArchiveCheck',
    data: { FileName: "TCK01_010_998_InsertTracking.zip" },
    error: function(xhr, ajaxOptions, thrownError) { console.log("failure"); },
    success: function(response){
        console.log(response);
        $("#MessageHtml").html("Action Ok");
    }
  });
});

$('#Action2BtnHtml').on('click', function (){
  $.ajax({
    type: 'POST',
    url: '/api/Job/JobInfo',
    data: { FileName: "TCK01_010_998_InsertTracking.zip" },
    error: function(xhr, ajaxOptions, thrownError) { console.log("failure"); },
    success: function(response){
        console.log(response);
        $("#MessageHtml").html("Action Ok");
    }
  });
});

$('#Action3BtnHtml').on('click', function (){
  $.ajax({
    type: 'POST',
    url: '/api/Test/SoketIoTest',
    data: { Message: "Mon message..." },
    error: function(xhr, ajaxOptions, thrownError) { console.log("failure"); },
    success: function(response){
        console.log(response);
        $("#MessageHtml").html("Action Ok");
    }
  });
});

$('#Action4BtnHtml').on('click', function (){
  $.ajax({
    type: 'POST',
    url: '/api/Test/XmlToJs',
    data: { Sequenceur: "TCK01_010_998_InsertTracking" },
    error: function(xhr, ajaxOptions, thrownError) { console.log("failure"); },
    success: function(response){
        console.log(response);
        $("#MessageHtml").html("Action Ok");
    }
  });
});

$('#Action5BtnHtml').on('click', function (){
  $.ajax({
    type: 'POST',
    url: '/api/User/Connect',
    data: { Login: 'User1', Password: 'Pass1' },
    error: function(xhr, ajaxOptions, thrownError) { console.log("failure"); },
    success: function(response){
        console.log(response);
        $("#MessageHtml").html("Action Ok");
    }
  });
});

$('.upload-btn').on('click', function (){
    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
});

$('#upload-input').on('change', function(){

  $('#MessageHtml').html("Upload...");
  var files = $(this).get(0).files;

  if (files.length > 0){
    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    var formData = new FormData();

    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      // add the files to formData object for the data payload
      formData.append('uploads[]', file, file.name);
    }

    $.ajax({
      url: '/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){
          console.log('upload successful!\n');
          console.log(data);
          $('#MessageHtml').html("File Ok");
      },
      xhr: function() {
        // create an XMLHttpRequest
        var xhr = new XMLHttpRequest();

        // listen to the 'progress' event
        xhr.upload.addEventListener('progress', function(evt) {

          if (evt.lengthComputable) {
            // calculate the percentage of upload completed
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);

            // update the Bootstrap progress bar with the new percentage
            $('.progress-bar').text(percentComplete + '%');
            $('.progress-bar').width(percentComplete + '%');

            // once the upload reaches 100%, set the progress bar text to done
            if (percentComplete === 100) {
              $('.progress-bar').html('Done');
            }

          }

        }, false);

        return xhr;
      }
    });

  }
});
