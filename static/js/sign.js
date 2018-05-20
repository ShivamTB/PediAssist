$(function () {

  /* Functions */

  var loadForm = function () {
    var btn = $(this);
    $.ajax({
      url: btn.attr("data-url"),
      type: 'get',
      dataType: 'json',
      beforeSend: function () {
        $("#modal-sign").modal("show");
      },
      success: function (data) {
        $("#modal-sign .modal-content").html(data.html_form);
      }
    });
  };

  var saveForm = function () {
    var form = $(this);
    $.ajax({
      url: form.attr("action"),
      data: form.serialize(),
      type: form.attr("method"),
      dataType: 'json',
      success: function (data) {
        if (data.form_is_valid) {
          $("#sign-table tbody").html(data.html_sign_list);
          $("#modal-sign").modal("hide");
        }
        else {
          $("#modal-sign .modal-content").html(data.html_form);
        }
      }
    });
    return false;
  };


  /* Binding */

  // Create sign
  $(".js-create-sign").click(loadForm);
  $("#modal-sign").on("submit", ".js-sign-create-form", saveForm);

  // Update sign
  $("#sign-table").on("click", ".js-update-sign", loadForm);
  $("#modal-sign").on("submit", ".js-sign-update-form", saveForm);

  // Delete sign
  $("#sign-table").on("click", ".js-delete-sign", loadForm);
  $("#modal-sign").on("submit", ".js-sign-delete-form", saveForm);
});
