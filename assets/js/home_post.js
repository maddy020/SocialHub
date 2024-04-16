{
  let e = function () {
      let t = $("#new-post-form");
      t.submit(function (e) {
        e.preventDefault(),
          $.ajax({
            type: "post",
            url: "/posts/create",
            data: t.serialize(),
            success: function (e) {
              var t = s(e.data.post);
              $("#posts-list-container>ul").prepend(t),
                o($(" .delete-post-button"), t),
                new PostComments(e.data.post._id),
                new ToggleLike($(" .likes", t)),
                new Noty({
                  theme: "relax",
                  text: "Post Published!",
                  type: "success",
                  layout: "topRight",
                  timeout: 1500,
                }).show();
            },
            error: function (e) {
              console.log(e.responseText);
            },
          });
      });
    },
    s = function (e) {
      return $(`<li id="post-${e._id}" class="list">
  <div class="content">
    <div class="post-content">${e.content}</div>

    <div class="like">
      <small>By~ ${e.user.name}</small>
       <small>
        <a
          href="/likes/toggle?id=${e._id}&type=Post"
          class="likes"
          data-likes="${e.likes.length}"
        >
          ${e.likes.length} Like
        </a>
      </small>
      <small
        ><a href="/posts/destroy/${e._id}" class="delete-post-button"
          >X</a
        ></small
      >
     
    </div>
  </div>
  <div class="comments">
   
    <form
      action="comments/create"
      method="POST"
      id="post-${e._id}-comment-form"
    >
      <input
        class="text"
        type="text"
        name="content"
        placeholder="Type comment here..."
        required
      />
      <input type="hidden" name="post" value="${e._id}" />
      <input type="submit" value="Add Comment" class="comment-submit" />
    </form>
    
    <div id="post-comments-list">
     
      <ul id="post-comments-${e._id}">
       
      </ul>
    </div>
  </div>
</li>

`);
    },
    o = function (t) {
      $(t).click(function (e) {
        e.preventDefault(),
          $.ajax({
            type: "get",
            url: $(t).prop("href"),
            success: function (e) {
              $("#post-" + e.data.post_id).remove(),
                new Noty({
                  theme: "relax",
                  text: "Post Deleted!",
                  type: "error",
                  layout: "topRight",
                  timeout: 1500,
                }).show();
            },
            error: function (e) {
              console.log("Error while deleting", e.responseText);
            },
          });
      });
    },
    t = function () {
      $(".list").each(function () {
        var e = $(this),
          t = $(" .delete-post-button", e),
          t = (o(t), e.prop("id").split("-")[1]);
        new PostComments(t),
          new ToggleLike($(" .likes", e)),
          new ToggleLike($(" .comment-likes", e));
      });
    };
  e(), t();
}
