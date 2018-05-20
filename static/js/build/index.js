jQuery(document).ready(function() {

	jQuery(".sidebar").on("click", "li", function() {
	  var patientID = jQuery(this).attr("data-patient-id");

	  fetchPatientInfo(patientID);
	});

	jQuery("form").on("submit", function(e) {
		e.preventDefault();
		var patientNumber = jQuery("#id_pat_number").val();
		var firstName = jQuery("#id_first_name").val();
		var surName = jQuery("#id_sur_name").val();

		if(patientNumber) {
			console.log("Perform Search with patient Number");
			fetchPatientInfo(patientNumber);
		}
	});

	//Full names :
	jQuery("#id_first_name").on("keyup", function() {
	  var value = jQuery(this).val();
	  jQuery(".patient-card").each(function(i,el){
		var name = jQuery(el).find(".patient-name").text();
	    if(name.toLowerCase().indexOf(value.toLowerCase()) != -1) {
	      jQuery(el).parent().removeClass("hidden");
	    } else {
		  jQuery(el).parent().addClass("hidden");
	    }
	  });
	});

	jQuery("#id_father_name").on("keyup", function() {
	  var value = jQuery(this).val();
	  jQuery(".patient-card").each(function(i,el){
		var name = jQuery(el).find(".father-name").text();
	    if(name.toLowerCase().indexOf(value.toLowerCase()) != -1) {
	      jQuery(el).parent().removeClass("hidden");
	    } else {
		  jQuery(el).parent().addClass("hidden");
	    }
	  });
	});

	jQuery("#id_mother_name").on("keyup", function() {
	  var value = jQuery(this).val();
	  jQuery(".patient-card").each(function(i,el){
		var name = jQuery(el).find(".mothers-name").text();
	    if(name.toLowerCase().indexOf(value.toLowerCase()) != -1) {
	      jQuery(el).parent().removeClass("hidden");
	    } else {
		  jQuery(el).parent().addClass("hidden");
	    }
	  });
	});

	// var dateValue = jQuery("#id_dob").val();
	// jQuery("#id_dob").on("change", function() {
	// 	console.log(jQuery(this).val());
	// 	var listOfPatients = jQuery(".patient-listing").find("li");
	// 	var dateValue = jQuery(this).val();
	// 	$.each(listOfPatients, function(i,el) {
	// 				if(jQuery(el).attr("data-patient-dob") && (dateValue == jQuery(el).attr("data-patient-dob"))) {
	// 					jQuery(el).removeClass("hidden");
	// 				} else {
	// 					jQuery(el).addClass("hidden");
	// 				}
	// 	});
	// });

	jQuery(".patient-info-container").on("click","h4 span.action", function(e) {
		e.preventDefault();

		var placeholderValue = jQuery(this).attr("data-placeholder-name");
		var newInput = jQuery("input.prototype.hidden").clone().removeClass("prototype hidden");
		newInput.attr("placeholder", placeholderValue);
		jQuery(this).parent().siblings(".input-field-container").append(newInput);
	});
});

var genderMapper = {
	'M':'<i class="icon-male"></i>',
	'F':'<i class="icon-female"></i>',
}

function fetchPatientInfo(patientID) {
	$.ajax({
		type:'GET',
		dataType:'json',
		url:"/patient/"+patientID+"/fetch/",
		beforeSend:function() {
			console.log("Fetching Info of Patient#"+patientID);
		}, success:function(response) {
			var response = JSON.parse(response);

			console.log(response);

			if(typeof response == 'object') {

				if(!jQuery(".welcome-container").is(":visible")) {
					jQuery(".new-patient-registration-container").addClass("hidden");
					jQuery(".welcome-container").removeClass("hidden");
				}
				jQuery(".patient-info-container").removeClass("hidden");
				var infoContainer = jQuery(".patient-info-container");
				var response = response['fields'];
				infoContainer.find(".patient-name").html(response['first_name'] + " " + response['sur_name']);
				infoContainer.find(".patient-sex").html(genderMapper[response['sex']]);
				infoContainer.find(".patient-number").html(response['pat_number']);
				infoContainer.find(".patient-height").html(response['last_height']);
				infoContainer.find(".patient-weight").html(response['last_weight']);
				infoContainer.find(".patient-visit-date").html(response['last-visit']);
				infoContainer.find(".patient-head-circumference").html(response['birth_headcm']);


				if(response['last_height'] == 0 || response['last_weight'] == 0) {
					infoContainer.find(".patient-bmi").html("N/A");
				} else {
					var height = parseInt(response['last_height']);
					var weight = parseInt(response['last_weight']);

					if(weight > 200) {
						weight = weight/1000;
					}

					height = Math.pow(height/100,2);
					infoContainer.find(".patient-bmi").html((weight / height).toFixed(2));
				}
				// infoContainer.find(".patient-age").html(response['dob']);

				var dob = moment(response['dob']);
				var now = moment();

				var diff = moment.preciseDiff(dob, now, true);

				infoContainer.find(".patient-age").html(diff['years'] + " yrs, " + diff['months']+" m, " + diff['days']+" d" );
				// .html(JSON.stringify(response[0]['fields']));
			}


		}
	})
}

jQuery(".inline-editor").on("click", ".edit-toggle", function(){
	jQuery(this).siblings(".pre-content").addClass("hidden");
	jQuery(this).siblings(".post-content").removeClass("hidden");

	jQuery(this).siblings(".post-content").find("input").focus();
});

jQuery(".inline-editor").on("click", ".submit", function() {
	var valueToSave = jQuery(this).closest(".action-icons").siblings("input").val();
	if(valueToSave.length) {
		console.log("Submitting "+valueToSave);
	} else {
		// toastNotify(3,"Please enter a value");
		return;
	}
});


jQuery(".inline-editor").on("click", ".cancel", function() {
	jQuery(this).closest(".post-content").addClass("hidden");
	jQuery(this).closest(".post-content").siblings(".pre-content").removeClass("hidden");
});

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

	jQuery(".new-patient-registration-container").on("click", ".birth-history", function (e) {
		e.preventDefault();
		loadBirthHistory();
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
		url: "/patient/history/create/",
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
// Toast Notification.
var flagMapper = {
	1:"success",
	2:"warning",
	3:"error"
};

function toastNotify(messageFlag, messageContent) {
	var messageType = flagMapper[messageFlag];
	var toastNotif = jQuery(".toast-notification-container");

	toastNotif.addClass(messageType).find(".notification-icon").addClass(messageType);
	toastNotif.addClass("show");
	toastNotif.find(".notification-message p").text(messageContent);

	setTimeout(closeToastNotification,3000);
}

function closeToastNotification() {
	var toastNotif = jQuery(".toast-notification-container");
	toastNotif.removeClass("show");
	setTimeout(function(){
		toastNotif.removeClass("success error warning")
	},400);
}