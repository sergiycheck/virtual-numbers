export function askNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications.");
    return Promise.reject("not supported");
  } else {
    return Notification.requestPermission();
  }
}
