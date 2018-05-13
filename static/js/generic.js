$(function () {

  /* Functions */

  var loadForm = function () {
    var btn = $(this);
    $.ajax({
      url: btn.attr("data-url"),
      type: 'get',
      dataType: 'json',
      beforeSend: function () {
        $("#modal-generic").modal("show");
      },
      success: function (data) {
        $("#modal-generic .modal-content").html(data.html_form);
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
          $("#generic-table tbody").html(data.html_generic_list);
          $("#modal-generic").modal("hide");
        }
        else {
          $("#modal-generic .modal-content").html(data.html_form);
        }
      }
    });
    return false;
  };


  /* Binding */

  // Create generic
  $(".js-create-generic").click(loadForm);
  $("#modal-generic").on("submit", ".js-generic-create-form", saveForm);

  // Update generic
  $("#generic-table").on("click", ".js-update-generic", loadForm);
  $("#modal-generic").on("submit", ".js-generic-update-form", saveForm);

  // Delete generic
  $("#generic-table").on("click", ".js-delete-generic", loadForm);
  $("#modal-generic").on("submit", ".js-generic-delete-form", saveForm);

});
