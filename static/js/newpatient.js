//On Page Load :
jQuery(document).ready(function () {

	// When Add new Patient Button is clicked.
	$("body").on("click","button.button.new-patient",function () {
		var btn = $(this);
		$.ajax({
			url: btn.attr("data-url"),
			url: '/patient/create/',
			type: 'get',
			dataType: 'json',
			success: function (data) {
				jQuery(".welcome-container").addClass("hidden");
				jQuery(".new-patient-registration-container").removeClass("hidden");
				$(".new-patient-registration-container").html(data.html_form);
			}
		});
	});

	// Save New Patient Form
	jQuery(".new-patient-registration-container").on("click", "button.submit-new-patient", function (e) {
		e.preventDefault();
		saveForm(true);
	});

	// Click Birth History
	jQuery(".new-patient-registration-container").on("click", ".birth-history", function (e) {
		e.preventDefault();
		saveForm(false);
	});

	jQuery(".new-patient-history-container").on("click", ".save-history", function(e) {
		e.preventDefault();
		submitHistory();
	});
});

function saveForm(showPatientFlag) {
	var form = $("form.js-patient-create-form");
	$.ajax({
		url: form.attr("action"),
		data: form.serialize(),
		type: form.attr("method"),
		dataType: 'json',
		success: function (data) {
			//Call when Save Patient Form is successful.
			console.log(data);
			if (data.form_is_valid) {
				toastNotify(1,"Form Saved Successfully.");
				jQuery("html,body").animate({ "scrollTop": 0 }, 200);
				// If Form Data is Valid, Add Patient to Patient Listing in the sidebar.
				jQuery(".wrapper.left.sidebar").html(data.html_patient_list);
				if(showPatientFlag) {
					fetchPatientInfo(data.pk);
				} else {
					jQuery("html,body").animate({ "scrollTop": 0 }, 200);
					jQuery(".new-patient-history-container").removeClass("hidden");
					jQuery(".new-patient-registration-container").addClass("hidden");
					jQuery(".new-patient-history-container").html(data.html_form);
					loadBirthHistory();
				}
			} else {
				toastNotify(3, "Form doesn't appear to be valid.")
			}
			//   if (data.form_is_valid) {
			//     $("#patient-table tbody").html(data.html_patient_list);
			//     $("#modal-patient").modal("hide");
			//   }
			//   else {
			//     $("#modal-patient .modal-content").html(data.html_form);
			//   }
		}
	});
	return false;
};

function loadBirthHistory() {
	// var form = $("form.js-patient-create-form");
	$.ajax({
		url:  "/patient/history/create/",
		type: "GET",
		dataType: 'json',
		success: function (data) {
			console.log(data);
			jQuery(".new-patient-history-container").removeClass("hidden").html(data.html_form);
			jQuery(".new-patient-registeration-container").addClass("hidden").html(data.html_form);
		}
	});
}

function submitHistory() {
	var form = jQuery(".js-history-create-form");
	jQuery.ajax({
		url:form.attr("action"),
		data:form.serialize(),
		type: form.attr("method"),
		datType:"json",
		success:function(data) {
			console.log(data);
		}
	})
}

// $("#modal-patient").on("submit", ".js-patient-create-form", function () {
// 	var form = $(this);
// 	$.ajax({
// 		url: form.attr("action"),
// 		data: form.serialize(),
// 		type: form.attr("method"),
// 		dataType: 'json',
// 		success: function (data) {
// 			if (data.form_is_valid) {
// 				alert("Patient created!");
// 				$(".wrapper.left.sidebar").html(data.html_patient_list);  // <-- Replace the table body
// 				$("#modal-patient").modal("hide");  // <-- Close the modal  // <-- This is just a placeholder for now for testing
// 			}
// 			else {
// 				$("#modal-patient .modal-content").html(data.html_form);
// 			}
// 		}
// 	});
// 	return false;
// });

// $(function () {

// 	/* Functions */

// 	var loadForm = function () {
// 		var btn = $(this);
// 		$.ajax({
// 			url: btn.attr("data-url"),
// 			type: 'get',
// 			dataType: 'json',
// 			beforeSend: function () {
// 				//   $("#modal-patient").modal("show");
// 			},
// 			success: function (data) {
// 				$(".new-patient-registration-container").html(data.html_form);
// 			}
// 		});
// 	};


// 	/* Binding */

// 	// Create patient
// 	// $(".new-patient").click(loadForm);
// 	$("#modal-patient").on("submit", ".js-patient-create-form", saveForm);

// 	// Update patient
// 	$("#patient-table").on("click", ".js-update-patient", loadForm);
// 	$("#modal-patient").on("submit", ".js-patient-update-form", saveForm);

// 	// Delete Patient
// 	$("#patient-table").on("click", ".js-delete-patient", loadForm);
// 	$("#modal-patient").on("submit", ".js-patient-delete-form", saveForm);

// });


// jQuery("body").on("click", ".birth-history", function () {
// 	var form = $("form.js-patient-create-form");
// 	$.ajax({
// 		url: form.attr("action"),
// 		data: form.serialize(),
// 		type: form.attr("method"),
// 		dataType: 'json',
// 		success: function (data) {
// 			console.log(data)
// 			if (data['form_is_valid']) {
// 				jQuery("html,body").animate({ "scrollTop": 0 }, 200);
// 				jQuery(".new-patient-history-container").removeClass("hidden");
// 				jQuery(".new-patient-registration-container").addClass("hidden");
// 			} else {
// 				console.log(2);
// 			}
// 		}
// 	});
// })
// //

function generatePatientObject() {

    var infoContainer = jQuery(".patient-info-container");
	var patientObject = {};

  	patientObject['patientInfo'] = {};

    patientObject['patientInfo']['key'] = infoContainer.attr("patient-key");
    patientObject['patientInfo']['visitDate'] = infoContainer.find(".patient-visit-date").text();
	patientObject['patientInfo']['weight'] = infoContainer.find(".patient-weight").text() || 0;
	patientObject['patientInfo']['height'] = infoContainer.find(".patient-height").text() || 0;
	patientObject['patientInfo']['height'] = infoContainer.find(".patient-head-circumference").text() || 0;
	patientObject['patientInfo']['headCircumference'] = infoContainer.find(".patient-head-circumference").text();
	patientObject['patientInfo']['bpSystolic'] = infoContainer.find(".patient-bp-systolic").text() || 0;
	patientObject['patientInfo']['bpDiastolic'] = infoContainer.find(".patient-bp-diastolic").text() || 0;


	patientObject['patientCaseInfo'] = {};
	patientObject['patientCaseInfo']['diagnosis'] = [];

	infoContainer.find(".patient-body .row-item.diagnosis input").each(function(i,el) {
		if(jQuery(el).val() != "") {
			patientObject['patientCaseInfo']['diagnosis'].push(jQuery(el).val());
		}
	});


	patientObject['patientCaseInfo']['signs'] = [];

	infoContainer.find(".patient-body .row-item.signs input").each(function(i,el) {
		if(jQuery(el).val() != "") {
			patientObject['patientCaseInfo']['signs'].push(jQuery(el).val());
		}
	});


	patientObject['patientCaseInfo']['symptoms'] = [];

	infoContainer.find(".patient-body .row-item.symptoms input").each(function(i,el) {
		if(jQuery(el).val() != "") {
			patientObject['patientCaseInfo']['symptoms'].push(jQuery(el).val());
		}
	});


	patientObject['patientCaseInfo']['treatment'] = [];

	infoContainer.find(".patient-body .row-item.treatment input").each(function(i,el) {
		if(jQuery(el).val() != "") {
			patientObject['patientCaseInfo']['treatment'].push(jQuery(el).val());
		}
	});

	patientObject['patientCaseInfo']['vaccinations'] = [];

	infoContainer.find(".patient-body .row-item.vaccinations tr .value").each(function(i,el) {
		if(jQuery(el).text() != "") {
			patientObject['patientCaseInfo']['vaccinations'].push(jQuery(el).text());
		}
	});

	return patientObject;
}
