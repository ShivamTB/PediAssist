//On Page Load :
jQuery(document).ready(function () {

	// When Add new Patient Button is clicked.
	$("button.button.new-patient").click(function () {
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

	jQuery(".new-patient-registration-container").on("click", ".birth-history", function (e) {
		e.preventDefault();
		saveForm(false);

		// loadBirthHistory();
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
	var form = $("form.js-patient-create-form");
	$.ajax({
		url: form.attr("action"),
		data: form.serialize(),
		type: form.attr("method"),
		dataType: 'json',
		success: function (data) {
			console.log(data)
			if (data['form_is_valid']) {
				jQuery("html,body").animate({ "scrollTop": 0 }, 200);
				jQuery(".new-patient-history-container").removeClass("hidden");
				jQuery(".new-patient-registration-container").addClass("hidden");
			} else {
				console.log(2);
			}
		}
	});
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