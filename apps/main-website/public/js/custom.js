window.addEventListener("load", () => {
  // Add 'loaded' class to body when page is fully loaded
  document.body.classList.add("loaded");
});

$(document).ready(function () {
  // Button click event handler
  $("#haeder-menu-button").click(function (event) {
    event.stopPropagation(); // Prevent click event from bubbling up to the document
    $("#mobile-navigation").toggleClass("hidden"); // Toggle 'highlight' class on the div
  });

  // Document click event handler to remove class if clicked outside the div
  $(document).click(function (event) {
    if (!$(event.target).closest("#myDiv").length) {
      // Check if clicked outside the div
      $("#mobile-navigation").addClass("hidden"); // Remove 'highlight' class from the div
    }
  });
});

function load() {
  var loads = document.querySelectorAll(".load");

  for (var i = 0; i < loads.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = loads[i].getBoundingClientRect().top;
    var elementVisible = 30;

    if (elementTop < windowHeight - elementVisible) {
      loads[i].classList.add("active");
    } else {
      loads[i].classList.remove("active");
    }
  }
}

window.addEventListener("load", load);

function reveal() {
  var reveals = document.querySelectorAll(".reveal");

  for (var i = 0; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveals[i].getBoundingClientRect().top;
    var elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    } else {
      reveals[i].classList.remove("active");
    }
  }
}

window.addEventListener("scroll", reveal);

$(window).scroll(function () {
  if ($(window).scrollTop() > 1) {
    $("header").addClass("header-fixed");
  } else {
    $("header").removeClass("header-fixed");
  }
});

$(".nav-link").click(function () {
  $("#navbarScroll").removeClass("show");
});
