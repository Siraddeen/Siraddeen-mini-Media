import React, { useState, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";

const Post = ({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);

  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const author = post?.author || null;

  const isAuthor = useMemo(
    () => user?._id && author?._id && user._id === author._id,
    [user, author]
  );

  const [liked, setLiked] = useState(
    post?.likes?.includes(user?._id) || false
  );
  const [postLike, setPostLike] = useState(post?.likes?.length || 0);
  const [comment, setComment] = useState(post?.comments || []);

  const likeOrDislikeHandler = async () => {
    if (!user) return toast.error("Login required");

    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setLiked(!liked);
        setPostLike((prev) => (liked ? prev - 1 : prev + 1));

        const updated = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );

        dispatch(setPosts(updated));
      }
    } catch (err) {
      toast.error("Failed to update like");
    }
  };

  const commentHandler = async () => {
    if (!text.trim()) return;

    try {
      const res = await axios.post(
        `/api/v1/post/${post._id}/comment`,
        { text },
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedComments = [...comment, res.data.comment];
        setComment(updatedComments);

        dispatch(
          setPosts(
            posts.map((p) =>
              p._id === post._id
                ? { ...p, comments: updatedComments }
                : p
            )
          )
        );
        setText("");
      }
    } catch {
      toast.error("Failed to comment");
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `/api/v1/post/delete/${post._id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setPosts(posts.filter((p) => p._id !== post._id)));
        toast.success("Post deleted");
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={author?.profilePicture || ""} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div className="flex items-center gap-2">
            <h1 className="font-medium">
              {author?.username || "Deleted User"}
            </h1>
            {isAuthor && <Badge variant="secondary">Author</Badge>}
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>

          <DialogContent className="flex flex-col items-center">
            {isAuthor && (
              <Button onClick={deletePostHandler} variant="ghost">
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <img
        src={post?.image}
        alt="post"
        className="rounded-sm my-2 w-full aspect-square object-cover"
      />

      <div className="flex gap-3 my-2">
        {liked ? (
          <FaHeart
            onClick={likeOrDislikeHandler}
            className="cursor-pointer text-red-600"
          />
        ) : (
          <FaRegHeart
            onClick={likeOrDislikeHandler}
            className="cursor-pointer"
          />
        )}

        <MessageCircle
          onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }}
          className="cursor-pointer"
        />

        <Bookmark className="ml-auto cursor-pointer" />
      </div>

      <span className="font-medium">{postLike} likes</span>

      <p>
        <span className="font-medium mr-2">
          {author?.username || "Deleted User"}
        </span>
        {post?.caption}
      </p>

      {comment.length > 0 && (
        <span
          onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }}
          className="text-sm text-gray-400 cursor-pointer"
        >
          View all {comment.length} comments
        </span>
      )}

      <CommentDialog open={open} setOpen={setOpen} />

      <div className="flex items-center gap-2 mt-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className="outline-none text-sm w-full"
        />
        {text && (
          <span
            onClick={commentHandler}
            className="text-[#3BADF8] cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;


// import React, { useState } from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
// import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
// import { Button } from "./ui/button";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import CommentDialog from "./CommentDialog";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import { toast } from "sonner";
// import { setPosts, setSelectedPost } from "@/redux/postSlice";
// import { Badge } from "./ui/badge";

// const Post = ({ post }) => {
//   const [text, setText] = useState("");
//   const [open, setOpen] = useState(false);
//   const { user } = useSelector((store) => store.auth);
//   const { posts } = useSelector((store) => store.post);
//   const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
//   const [postLike, setPostLike] = useState(post.likes.length);
//   const [comment, setComment] = useState(post.comments);
//   const dispatch = useDispatch();

//   const changeEventHandler = (e) => {
//     const inputText = e.target.value;
//     if (inputText.trim()) {
//       setText(inputText);
//     } else {
//       setText("");
//     }
//   };

//   const likeOrDislikeHandler = async () => {
//     try {
//       const action = liked ? "dislike" : "like";
//       const res = await axios.get(
//         `https://siraddeen-mini-media.onrender.com/api/v1/post/${post._id}/${action}`,
//         { withCredentials: true }
//       );
//       console.log(res.data);
//       if (res.data.success) {
//         const updatedLikes = liked ? postLike - 1 : postLike + 1;
//         setPostLike(updatedLikes);
//         setLiked(!liked);

//         // apne post ko update krunga
//         const updatedPostData = posts.map((p) =>
//           p._id === post._id
//             ? {
//                 ...p,
//                 likes: liked
//                   ? p.likes.filter((id) => id !== user._id)
//                   : [...p.likes, user._id],
//               }
//             : p
//         );
//         dispatch(setPosts(updatedPostData));
//         toast.success(res.data.message);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const commentHandler = async () => {
//     try {
//       const res = await axios.post(
//         `https://siraddeen-mini-media.onrender.com/api/v1/post/${post._id}/comment`,
//         { text },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//           withCredentials: true,
//         }
//       );
//       console.log(res.data);
//       if (res.data.success) {
//         const updatedCommentData = [...comment, res.data.comment];
//         setComment(updatedCommentData);

//         const updatedPostData = posts.map((p) =>
//           p._id === post._id ? { ...p, comments: updatedCommentData } : p
//         );

//         dispatch(setPosts(updatedPostData));
//         toast.success(res.data.message);
//         setText("");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const deletePostHandler = async () => {
//     try {
//       const res = await axios.delete(
//         `https://siraddeen-mini-media.onrender.com/api/v1/post/delete/${post?._id}`,
//         { withCredentials: true }
//       );
//       if (res.data.success) {
//         const updatedPostData = posts.filter(
//           (postItem) => postItem?._id !== post?._id
//         );
//         dispatch(setPosts(updatedPostData));
//         toast.success(res.data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.response.data.messsage);
//     }
//   };

//   const bookmarkHandler = async () => {
//     try {
//       const res = await axios.get(
//         `https://siraddeen-mini-media.onrender.com/api/v1/post/${post?._id}/bookmark`,
//         { withCredentials: true }
//       );
//       if (res.data.success) {
//         toast.success(res.data.message);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   return (
//     <div className="my-8 w-full max-w-sm mx-auto">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <Avatar>
//             <AvatarImage src={post.author?.profilePicture} alt="post_image" />
//             <AvatarFallback>CN</AvatarFallback>
//           </Avatar>
//           <div className="flex items-center gap-3">
//             <h1>{post.author?.username}</h1>
//             {user?._id === post.author._id && (
//               <Badge variant="secondary">Author</Badge>
//             )}
//           </div>
//         </div>
//         <Dialog>
//           <DialogTrigger asChild>
//             <MoreHorizontal className="cursor-pointer" />
//           </DialogTrigger>
//           <DialogContent className="flex flex-col items-center text-sm text-center">
//             {post?.author?._id !== user?._id && (
//               <Button
//                 variant="ghost"
//                 className="cursor-pointer w-fit text-[#ED4956] font-bold"
//               >
//                 Unfollow
//               </Button>
//             )}

//             <Button variant="ghost" className="cursor-pointer w-fit">
//               Add to favorites
//             </Button>
//             {user && user?._id === post?.author._id && (
//               <Button
//                 onClick={deletePostHandler}
//                 variant="ghost"
//                 className="cursor-pointer w-fit"
//               >
//                 Delete
//               </Button>
//             )}
//           </DialogContent>
//         </Dialog>
//       </div>
//       <img
//         className="rounded-sm my-2 w-full aspect-square object-cover"
//         src={post.image}
//         alt="post_img"
//       />

//       <div className="flex items-center justify-between my-2">
//         <div className="flex items-center gap-3">
//           {liked ? (
//             <FaHeart
//               onClick={likeOrDislikeHandler}
//               size={"24"}
//               className="cursor-pointer text-red-600"
//             />
//           ) : (
//             <FaRegHeart
//               onClick={likeOrDislikeHandler}
//               size={"22px"}
//               className="cursor-pointer hover:text-gray-600"
//             />
//           )}

//           <MessageCircle
//             onClick={() => {
//               dispatch(setSelectedPost(post));
//               setOpen(true);
//             }}
//             className="cursor-pointer hover:text-gray-600"
//           />
//           {/* <Send className='cursor-pointer hover:text-gray-600' /> */}
//         </div>
//         <Bookmark
//           onClick={bookmarkHandler}
//           className="cursor-pointer hover:text-gray-600"
//         />
//       </div>
//       <span className="font-medium block mb-2">{postLike} likes</span>
//       <p>
//         <span className="font-medium mr-2">{post.author?.username}</span>
//         {post.caption}
//       </p>
//       {comment.length > 0 && (
//         <span
//           onClick={() => {
//             dispatch(setSelectedPost(post));
//             setOpen(true);
//           }}
//           className="cursor-pointer text-sm text-gray-400"
//         >
//           View all {comment.length} comments
//         </span>
//       )}
//       <CommentDialog open={open} setOpen={setOpen} />
//       <div className="flex items-center justify-between">
//         <input
//           type="text"
//           placeholder="Add a comment..."
//           value={text}
//           onChange={changeEventHandler}
//           className="outline-none text-sm w-full"
//         />
//         {text && (
//           <span
//             onClick={commentHandler}
//             className="text-[#3BADF8] cursor-pointer"
//           >
//             Post
//           </span>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Post;
