{
  //method to submit the form data using ajax.
  let createPost = function () {
    let newPostForm = $("#new-post-form");
    newPostForm.submit(function (e) {
      e.preventDefault();
      $.ajax({
        type: "post",
        url: "/posts/create",
        data: newPostForm.serialize(),
        success: function (data) {
          let newPost = newPostDOM(data.data);
          //console.log(data.data);
          $("#posts-list-container>ul").prepend(newPost);
          deletePost($(" .delete-post-button"), newPost);
          new PostComments(data.data.post._id);
          new Noty({
            theme: "relax",
            text: "Post Published!",
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
  };

  //method to create post using DOM
  //data.data=post
  let newPostDOM = function (post) {
    return $(`<li id="post-${post.post._id}" class="list">
  <div class="content">
    <div class="post-content">${post.post.content}</div>

    <div class="like">
      <small>By~ ${post.user.name}</small>
     
      <small
        ><a href="/posts/destroy/${post.post._id}" class="delete-post-button"
          >X</a
        ></small
      >
     
    </div>
  </div>
  <div class="comments">
   
    <form
      action="comments/create"
      method="POST"
      id="post-${post.post._id}-comment-form"
    >
      <input
        class="text"
        type="text"
        name="content"
        placeholder="Type comment here..."
        required
      />
      <input type="hidden" name="post" value="${post.post._id}" />
      <input type="submit" value="Add Comment" class="comment-submit" />
    </form>
    
    <div id="post-comments-list">
     
      <ul id="post-comments-${post.post._id}">
       
      </ul>
    </div>
  </div>
</li>

`);
  };
  //delete post from DOM

  let deletePost = function (deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();
      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          $(`#post-${data.data.post_id}`).remove();
          new Noty({
            theme: "relax",
            text: "Post Deleted!",
            type: "error",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (err) {
          console.log("Error while deleting", err.responseText);
        },
      });
    });
  };
  let convertPostsToAjax = function () {
    $(".list").each(function () {
      let self = $(this);
      let deleteButton = $(" .delete-post-button", self);
      //let likeButton = $('.likes',self);
      //console.log(likeButton);
      deletePost(deleteButton);
      //likePost(likeButton);

      // get the post's id by splitting the id attribute
      let postId = self.prop("id").split("-")[1];
      //console.log(postId);
      const onj = new PostComments(postId);
      //console.log(onj);
    });
  };
  createPost();
  convertPostsToAjax();
}
