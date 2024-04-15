class PostComments {
  constructor(postId) {
    this.postId = postId;
    this.postContainer = $(`#post-${postId}`);
    this.newCommentForm = $(`#post-${postId}-comment-form`);
    this.createComment(postId);

    let self = this;
    // call for all the existing comments
    //But when this keyword is used inside $(), then it becomes a jQuery object,
    //and now we can use all properties of jQuery on this method.
    $(" .delete-comment-button", this.postContainer).each(function () {
      self.deleteComment($(this));
    });
  }
  createComment(postId) {
    let pself = this;
    this.newCommentForm.submit(function (e) {
      e.preventDefault();

      let self = this;
      $.ajax({
        url: "/comments/create",
        type: "POST",
        data: $(self).serialize(),
        success: function (data) {
          let newComment = pself.newCommentDom(data.data.comment);
          //console.log(data.data.user);
          $(`#post-comments-${postId}`).prepend(newComment);
          pself.deleteComment($(" .delete-comment-button", newComment));
          new ToggleLike($(" .comment-likes", newComment));
          new Noty({
            theme: "relax",
            text: "Comment Posted!",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (err) {
          console.log(err.responseText);
        },
      });
    });
  }
  //data.data=comment
  newCommentDom(comment) {
    // I've added a class 'delete-comment-button' to the delete comment link and also id to the comment's li
    return $(`
   <li id="comment-${comment._id}">
  <div class="content">
    <div class="comment-content">
      ${comment.content}
      <br />
      <small style="font-style: italic">By~${comment.user.name}</small>
    </div>

    <div class="like">
       <small>
        <a
          href="/likes/toggle?id=${comment._id}&type=Comment"
          class="comment-likes"
          data-likes="${comment.likes.length}"
        >
          ${comment.likes.length} Like
        </a></small
      >
      <small
        ><a
          href="/comments/destroy/${comment._id}"
          class="delete-comment-button"
          >X</a
        ></small
      >
    </div>
  </div>
</li>


    `);
  }
  deleteComment(deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();

      $.ajax({
        type: "GET",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          $(`#comment-${data.data.comment_id}`).remove();
          new Noty({
            theme: "relax",
            text: "Comment Deleted!",
            type: "error",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  }
}
