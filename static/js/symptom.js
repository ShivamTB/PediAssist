$(function () {

  /* Functions */

  var loadForm = function () {
    var btn = $(this);
    $.ajax({
      url: btn.attr("data-url"),
      type: 'get',
      dataType: 'json',
      beforeSend: function () {
        $("#modal-symptom").modal("show");
      },
      success: function (data) {
        $("#modal-symptom .modal-content").html(data.html_form);
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
          $("#symptom-table tbody").html(data.html_symptom_list);
          $("#modal-symptom").modal("hide");
        }
        else {
          $("#modal-symptom .modal-content").html(data.html_form);
        }
      }
    });
    return false;
  };


  /* Binding */

  // Create symptom
  $(".js-create-symptom").click(loadForm);
  $("#modal-symptom").on("submit", ".js-symptom-create-form", saveForm);

  // Update symptom
  $("#symptom-table").on("click", ".js-update-symptom", loadForm);
  $("#modal-symptom").on("submit", ".js-symptom-update-form", saveForm);

  // Delete symptom
  $("#symptom-table").on("click", ".js-delete-symptom", loadForm);
  $("#modal-symptom").on("submit", ".js-symptom-delete-form", saveForm);

});
