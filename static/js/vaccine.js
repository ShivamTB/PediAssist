$(function () {

  /* Functions */

  var loadForm = function () {
    var btn = $(this);
    $.ajax({
      url: btn.attr("data-url"),
      type: 'get',
      dataType: 'json',
      beforeSend: function () {
        $("#modal-vaccine").modal("show");
      },
      success: function (data) {
        $("#modal-vaccine .modal-content").html(data.html_form);
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
          $("#vaccine-table tbody").html(data.html_vaccine_list);
          $("#modal-vaccine").modal("hide");
        }
        else {
          $("#modal-vaccine .modal-content").html(data.html_form);
        }
      }
    });
    return false;
  };


  /* Binding */

  // Create vaccine
  $(".js-create-vaccine").click(loadForm);
  $("#modal-vaccine").on("submit", ".js-vaccine-create-form", saveForm);

  // Update vaccine
  $("#vaccine-table").on("click", ".js-update-vaccine", loadForm);
  $("#modal-vaccine").on("submit", ".js-vaccine-update-form", saveForm);

  // Delete vaccine
  $("#vaccine-table").on("click", ".js-delete-vaccine", loadForm);
  $("#modal-vaccine").on("submit", ".js-vaccine-delete-form", saveForm);

});
