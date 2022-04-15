import React from "react"
import { useContext, useState, useEffect } from "react"
import AppContext from "../components/AppContext"
import api from "../components/utils/api"
import Link from "next/link"
import PostModif from "./PostModif"
import CommentsList from "./CommentsList"
import Navbar from "./Navbar.jsx"

const newDate = (date) => {
  return (date = new Date(date).toLocaleDateString())
}

const PostProfile = ({ postId }) => {
  const [apiError, setApiError] = useState(null)
  const [Modified, setModified] = useState(false)
  const { session, router } = useContext(AppContext)
  const [post, setPost] = useState(null)

  const sessionId = JSON.parse(session).payload.user.id
  const userRoleId = JSON.parse(session).payload.user.roleId

  const delPost = async () => {
    await api.delete(`/posts/${postId}`)
    router.back()
  }

  useEffect(() => {
    if (!isNaN(postId) && postId) {
      api
        .get(`/posts/${postId}`)
        .then((out) => setPost(out.data))
        .catch((error) =>
          setApiError(error.out ? error.out.data.error : error.message)
        )
    }
  }, [postId])

  if (apiError) {
    return (
      <div className="w-full mb-7 py-2 bg-red-200 flex items-center justify-center text-red-600 text-center font-bold text-2xl rounded">
        {apiError}
      </div>
    )
  }

  if (isNaN(postId) && postId !== undefined) {
    return (
      <div className="w-full mb-7 py-2 bg-red-200 flex items-center justify-center text-red-600 text-center font-bold text-2xl rounded">
        postId must be a number!!
      </div>
    )
  }

  if (!post) {
    return <div></div>
  }

  return (
    <>
      <Navbar />
      <div>
        {!Modified ? (
          <div className="border border-black">
            <p className="text-4xl font-bold">{post.title}</p>
            <p className="mb-3">
              by{" "}
              {post.displayName ? (
                <Link href={`/users/${encodeURIComponent(post.user_id)}`}>
                  <a className="font-bold underline hover:text-blue-500">
                    {post.displayName}
                  </a>
                </Link>
              ) : (
                <span className="font-bold underline">Deleted user</span>
              )}{" "}
              on <span>{newDate(post.publicationDate)}</span>
            </p>
            <p className="text-justify w-full">{post.content}</p>
          </div>
        ) : (
          <PostModif postId={postId} />
        )}

        {!Modified ? (
          (post.user_id == sessionId || userRoleId == 3) && userRoleId != 1 ? (
            <div className="w-max mb-10 mx-auto space-x-4">
              {post.user_id == sessionId ? (
                <button
                  className="px-6 py-2 mt-4 text-white bg-black"
                  onClick={() => setModified(true)}
                >
                  Modify post
                </button>
              ) : null}
              <button
                className="px-6 py-2 mt-4 text-white bg-black"
                onClick={delPost}
              >
                Delete post
              </button>
            </div>
          ) : null
        ) : (
          <div className="w-max mb-10 mx-auto">
            <button
              className="px-6 py-2 mt-4 text-white bg-black"
              onClick={() => setModified(false)}
            >
              Don't change
            </button>
          </div>
        )}

        <CommentsList postId={postId} postUserId={post.user_id} />
      </div>
    </>
  )
}

export default PostProfile
