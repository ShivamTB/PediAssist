jQuery(document).ready(function() {

	jQuery(".sidebar").on("click", "li", function() {
	  var patientID = jQuery(this).attr("data-patient-id");
		jQuery(".patient-info-container").html("");
		jQuery(".new-patient-history-container").html("");

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
	jQuery("body").on("keyup", "#id_first_name", function() {
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

	jQuery("body").on("click","h4 span.action", function(e) {
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

	jQuery("body").on("keydown",".row-item .input-field-container input", function(e) {
		if(e.which == "13") {
			var placeholderValue = jQuery(this).parent().siblings("h4").find("span.action").attr("data-placeholder-name");
			console.log(placeholderValue);
			var newInput = jQuery("input.prototype.hidden").clone().removeClass("prototype hidden");
			newInput.attr("placeholder", placeholderValue);
			jQuery(this).parent().append(newInput);

			jQuery(this).next().focus();
		}
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
			// var response = JSON.parse(response);

			console.log(response);

			jQuery(".welcome-container").removeClass("hidden").html(response['html_patient_info']);

			jQuery(".new-patient-registration-container").addClass("hidden");
			jQuery(".patient-info-container").removeClass("hidden");

		// 	if(typeof response == 'object') {
		// 			console.log("I'm here")
		// 		if(!jQuery(".welcome-container").is(":visible")) {
		// 			jQuery(".new-patient-registration-container").addClass("hidden");
		// 			jQuery(".new-patient-history-container").addClass("hidden");
		// 			jQuery(".welcome-container").removeClass("hidden");
		// 		}
		// 		jQuery(".patient-info-container").removeClass("hidden");
		// 		var infoContainer = jQuery(".patient-info-container");
		// 		var fields = response['fields'];
		// 		infoContainer.find(".patient-name").html(fields['first_name'] + " " + fields['sur_name']);
		// 		infoContainer.find(".patient-sex").html(genderMapper[fields['sex']]);
		// 		infoContainer.find(".patient-number").html(response['pk']);
		// 		infoContainer.find(".patient-height").html(fields['last_height']);
		// 		infoContainer.find(".patient-weight").html(fields['last_weight']);
		// 		infoContainer.find(".patient-visit-date").html(fields['last-visit']);
		// 		infoContainer.find(".patient-head-circumference").html(fields['birth_headcm']);
    //
		// 		var now = new Date();
		// 		var day = ("0" + now.getDate()).slice(-2);
		// 		var month = ("0" + (now.getMonth() + 1)).slice(-2);
		// 		var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
		// 		infoContainer.find(".patient-visit-date").val( today );
    //
		// 		infoContainer.attr("patient-key",response['pk']);
		// 		if(fields['last_height'] == 0 || fields['last_weight'] == 0) {
		// 			infoContainer.find(".patient-bmi").html("N/A");
		// 		} else {
		// 			var height = parseInt(fields['last_height']);
		// 			var weight = parseInt(fields['last_weight']);
    //
		// 			if(weight > 200) {
		// 				weight = weight/1000;
		// 			}
    //
		// 			height = Math.pow(height/100,2);
		// 			infoContainer.find(".patient-bmi").html((weight / height).toFixed(2));
		// 		}
		// 		// infoContainer.find(".patient-age").html(fields['dob']);
    //
		// 		var dob = moment(fields['dob']);
		// 		var now = moment();
    //
		// 		var diff = moment.preciseDiff(dob, now, true);
    //
		// 		infoContainer.find(".patient-age").html(diff['years'] + " yrs, " + diff['months']+" m, " + diff['days']+" d" );
		// 		// .html(JSON.stringify(fields[0]['fields']));
		// 	}
    //
    //
		console.log("End");
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

jQuery("body").on("keyup",".patient-controller .input-fields .vaccination-charge", function() {
		var value = jQuery(this).val() || 0;
    var otherCharge = jQuery(".patient-controller .input-fields .consultation-charge").val() || 0;
    jQuery(".patient-controller .input-fields .total-charge").val(parseInt(value)+parseInt(otherCharge));
});

jQuery("body").on("keyup", ".patient-controller .input-fields .consultation-charge", function() {
		var value = jQuery(this).val() || 0;
    var otherCharge = jQuery(".patient-controller .input-fields .vaccination-charge").val() || 0;
    jQuery(".patient-controller .input-fields .total-charge").val(parseInt(value)+parseInt(otherCharge));
});
