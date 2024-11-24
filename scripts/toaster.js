// Link to the toastr CSS
const linkToastrCSS = document.createElement("link");
linkToastrCSS.rel = "stylesheet";
linkToastrCSS.href = "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css";
document.head.appendChild(linkToastrCSS);

// Link to the jQuery library
const scriptJQuery = document.createElement("script");
scriptJQuery.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js";
scriptJQuery.async = true;
document.head.appendChild(scriptJQuery);

scriptJQuery.onload = () => {
  // Link to the toastr JS
  const scriptToastrJS = document.createElement("script");
  scriptToastrJS.src = " https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js";
  scriptToastrJS.async = true;
  document.head.appendChild(scriptToastrJS);

  // Initialize the toastr
  scriptToastrJS.onload = () => {
    toastr.options = {
      closeButton: false,
      debug: false,
      newestOnTop: true,
      progressBar: true,
      positionClass: "toast-bottom-right",
      preventDuplicates: true,
      tapToDismiss: false,
      onclick: null,
      showDuration: "300",
      hideDuration: "1000",
      timeOut: "5000",
      extendedTimeOut: "0",
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut",
    };
  };
};
