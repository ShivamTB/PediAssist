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