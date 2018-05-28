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

		if(jQuery(this).hasClass("vaccination-opener")) {
			jQuery(".modal_overlay").removeClass("hidden");

			loadVaccinationsForm(jQuery(this));

			return;
		}

		var placeholderValue = jQuery(this).attr("data-placeholder-name");
		var newInput = jQuery("input.prototype.hidden").clone().removeClass("prototype hidden");
		newInput.attr("placeholder", placeholderValue);
		jQuery(this).parent().siblings(".input-field-container").append(newInput);
	});
});

function loadVaccinationsForm(element) {
    $.ajax({
      url: jQuery(element).attr("data-url"),
      type: jQuery(element).attr("method"),
			dataType: 'json',
			beforeSuccess:function() {
				console.warn(jQuery(element));
				console.warn(jQuery(element).attr("data-url"));
			},
      success: function (data) {
        $(".modal_overlay .modal_body").html(data.html_form);
      }
    });
}

jQuery(".vaccination-modal").on("click",".save-vaccination", function(e) {
	e.preventDefault();
	saveVaccination(this);
});

function saveVaccination(element) {
	var form = jQuery(element).closest("form");
	$.ajax({
		url: form.attr("action"),
		data: form.serialize(),
		type: form.attr("method"),
		dataType: 'json',
		success: function (data) {
			console.log(data);
			jQuery(".modal_overlay").trigger("click");
			jQuery(".patient-info-container .row-item.vaccinations .input-field-container").html(data['html_vaccination_list']);
		}
	});
}

function confirmVaccineDeletion(element) {
	var form = jQuery(element).closest("form");
	$.ajax({
		url: jQuery(element).attr("data-url"),
		type: jQuery(element).attr("method"),
		dataType: 'json',
		beforeSuccess:function() {
			console.warn(jQuery(element));
			console.warn(jQuery(element).attr("data-url"));
		},
		success: function (data) {
			$(".modal_overlay .modal_body").html(data.html_form);
		}
	});
}

function deleteVaccination(element) {
	var form = jQuery(element).closest("form");
	$.ajax({
		url: form.attr("action"),
		data: form.serialize(),
		type: form.attr("method"),
		dataType: 'json',
		success: function (data) {
			console.log(data);
			jQuery(".modal_overlay").trigger("click");
			jQuery(".patient-info-container .row-item.vaccinations .input-field-container").html(data['html_vaccination_list']);
		}
	});
}

  // Update Vaccination
  $("body").on("click", ".js-update-vaccination", function() {
		jQuery(".modal_overlay").removeClass("hidden");
		loadVaccinationsForm(this);
	});
  $("body").on("submit", ".js-vaccination-update-form", function(e) {
		e.preventDefault();
		saveVaccination(this);
	});

  // Delete vaccination
  $("body").on("click", ".js-delete-vaccination", function() {
		console.log("Should confirm to delete now.");
		jQuery(".modal_overlay").removeClass("hidden");
		confirmVaccineDeletion(this);
	});

	$("body").on("submit", ".js-vaccination-delete-form", function(e) {
		e.preventDefault();
		deleteVaccination(this);
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
					jQuery(".new-patient-history-container").addClass("hidden");
					jQuery(".welcome-container").removeClass("hidden");
				}
				jQuery(".patient-info-container").removeClass("hidden");
				var infoContainer = jQuery(".patient-info-container");
				var fields = response['fields'];
				infoContainer.find(".patient-name").html(fields['first_name'] + " " + fields['sur_name']);
				infoContainer.find(".patient-sex").html(genderMapper[fields['sex']]);
				infoContainer.find(".patient-number").html(response['pk']);
				infoContainer.find(".patient-height").html(fields['last_height']);
				infoContainer.find(".patient-weight").html(fields['last_weight']);
				infoContainer.find(".patient-visit-date").html(fields['last-visit']);
				infoContainer.find(".patient-head-circumference").html(fields['birth_headcm']);

				var now = new Date();
				var day = ("0" + now.getDate()).slice(-2);
				var month = ("0" + (now.getMonth() + 1)).slice(-2);
				var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
				infoContainer.find(".patient-visit-date").val( today );

				infoContainer.attr("patient-key",response['pk']);
				if(fields['last_height'] == 0 || fields['last_weight'] == 0) {
					infoContainer.find(".patient-bmi").html("N/A");
				} else {
					var height = parseInt(fields['last_height']);
					var weight = parseInt(fields['last_weight']);

					if(weight > 200) {
						weight = weight/1000;
					}

					height = Math.pow(height/100,2);
					infoContainer.find(".patient-bmi").html((weight / height).toFixed(2));
				}
				// infoContainer.find(".patient-age").html(fields['dob']);

				var dob = moment(fields['dob']);
				var now = moment();

				var diff = moment.preciseDiff(dob, now, true);

				infoContainer.find(".patient-age").html(diff['years'] + " yrs, " + diff['months']+" m, " + diff['days']+" d" );
				// .html(JSON.stringify(fields[0]['fields']));
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
		jQuery(this).closest(".post-content").siblings(".pre-content").find("span").text(valueToSave);
		jQuery(this).siblings(".cancel").trigger("click");
	} else {
		// toastNotify(3,"Please enter a value");
		return;
	}
});

jQuery(".inline-editor").on("click", ".cancel", function() {
	jQuery(this).closest(".post-content").addClass("hidden");
	jQuery(this).closest(".post-content").siblings(".pre-content").removeClass("hidden");
});

jQuery(".modal_overlay").on("click", function(e) {
  if(jQuery(e.target).is(".modal_overlay")) {
      jQuery(this).addClass("hidden");
      jQuery("body").removeClass("posf fixed");
  }
});

jQuery(".modal_overlay").on('click', ".close_modal",function(e) {
  jQuery("body").removeClass("posf fixed");
  jQuery(".modal_overlay").addClass("hidden");
});

jQuery(".patient-controller .input-fields .vaccination-charge").on("keyup", function() {
		var value = jQuery(this).val() || 0;
    var otherCharge = jQuery(".patient-controller .input-fields .consultation-charge").val() || 0;
    jQuery(".patient-controller .input-fields .total-charge").val(parseInt(value)+parseInt(otherCharge));
});

jQuery(".patient-controller .input-fields .consultation-charge").on("keyup", function() {
		var value = jQuery(this).val() || 0;
    var otherCharge = jQuery(".patient-controller .input-fields .vaccination-charge").val() || 0;
    jQuery(".patient-controller .input-fields .total-charge").val(parseInt(value)+parseInt(otherCharge));
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

jQuery(".patient-info-container").on("click",".save-form", function() {
	var stringyPatientObject = JSON.stringify(generatePatientObject());
	console.log(stringyPatientObject);

	submitPatientObject(stringyPatientObject);
});

function submitPatientObject(stringyPatientObject) {
	$.ajax({
		url:'/patient/info/update',
		type:'post',
		data: stringyPatientObject,
  	dataType:'json',
		beforeSend:function() {
			console.log("Submitting", JSON.parse(stringyPatientObject));
		}, success:function() {
			console.log("SUCCESS!");
		}
	})
}

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