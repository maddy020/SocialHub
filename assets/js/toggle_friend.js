{
  let o = $("#friend");
  //console.log(o),
  // console.log(o.attr("href")),
  o.click(function (e) {
    //console.log("inside"),
    e.preventDefault(),
      // console.log("done"),
      $.ajax({
        url: o.attr("href"),
        type: "get",
        success: function (e) {
          //console.log(e.deleted),
          e.deleted ? o.html("Add Friend") : o.html("Remove Friend");
        },
        error: function (e) {
          console.log(e.responseText);
        },
      });
  });
}
