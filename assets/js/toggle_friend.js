{
  let friend = $("#friend");
  console.log(friend);
  console.log(friend.attr("href"));
  friend.click(function (e) {
    console.log("inside");
    e.preventDefault();
    console.log("done");
    $.ajax({
      url: friend.attr("href"),
      type: "get",
      success: function (data) {
        console.log(data.deleted);

        if (data.deleted) {
          friend.html("Add Friend");
        } else {
          friend.html("Remove Friend");
        }
      },
      error: function (error) {
        console.log(error.responseText);
      },
    });
  });
}
