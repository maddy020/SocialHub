class PostComments {
  constructor(e) {
    (this.postId = e),
      (this.postContainer = $("#post-" + e)),
      (this.newCommentForm = $(`#post-${e}-comment-form`)),
      this.createComment(e);
    let t = this;
    $(" .delete-comment-button", this.postContainer).each(function () {
      t.deleteComment($(this));
    });
  }
  createComment(t) {
    let o = this;
    this.newCommentForm.submit(function (e) {
      e.preventDefault(),
        $.ajax({
          url: "/comments/create",
          type: "POST",
          data: $(this).serialize(),
          success: function (e) {
            (e = o.newCommentDom(e.data.comment)),
              $("#post-comments-" + t).prepend(e),
              o.deleteComment($(" .delete-comment-button", e)),
              new ToggleLike($(" .comment-likes", e)),
              new Noty({
                theme: "relax",
                text: "Comment Posted!",
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
  }
  newCommentDom(e) {
    return $(`
   <li id="comment-${e._id}">
  <div class="content">
    <div class="comment-content">
      ${e.content}
      <br />
      <small style="font-style: italic">By~${e.user.name}</small>
    </div>

    <div class="like">
       <small>
        <a
          href="/likes/toggle?id=${e._id}&type=Comment"
          class="comment-likes"
          data-likes="${e.likes.length}"
        >
          ${e.likes.length} Like
        </a></small
      >
      <small
        ><a
          href="/comments/destroy/${e._id}"
          class="delete-comment-button"
          >X</a
        ></small
      >
    </div>
  </div>
</li>


    `);
  }
  deleteComment(t) {
    $(t).click(function (e) {
      e.preventDefault(),
        $.ajax({
          type: "GET",
          url: $(t).prop("href"),
          success: function (e) {
            $("#comment-" + e.data.comment_id).remove(),
              new Noty({
                theme: "relax",
                text: "Comment Deleted!",
                type: "error",
                layout: "topRight",
                timeout: 1500,
              }).show();
          },
          error: function (e) {
            console.log(e.responseText);
          },
        });
    });
  }
}
