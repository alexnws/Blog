import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import AppContext from "../components/AppContext"
import api from "../../src/components/utils/api"
import CreateComment from "../components/CreateComment"

const formatDate = (date) => {
  return (date = new Date(date).toLocaleDateString())
}

const CommentsList = ({ postId, postUserId }) => {
  const { session } = useContext(AppContext)

  const [comments, setComments] = useState(null)
  const [apiError, setApiError] = useState(null)

  const sessionId = JSON.parse(session).payload.user.id
  const userRoleId = JSON.parse(session).payload.user.role_id

  useEffect(() => {
    if (postId) {
      api
        .get(`posts/${postId}/comments`)
        .then((response) => setComments(response.data))
        .catch((error) =>
          setApiError(
            error.response ? error.response.data.error : error.message
          )
        )
    }
  }, [postId])

  if (apiError) {
    return (
      <>
        <section className="shadow rounded-b">
          <h3 className="text-2xl font-bold">Comments</h3>
          <div className="w-full mb-7 py-2 bg-red-200 flex items-center justify-center text-red-600 text-center font-bold text-2xl rounded">
            {apiError}
          </div>
        </section>
      </>
    )
  }

  if (!comments) {
    return (
      <section className="shadow pb-10 rounded-b">
        <h3 className="text-2xl font-bold">Comments</h3>
        <p>no comments!</p>
      </section>
    )
  }

  if (!comments.length) {
    return (
      <section className="mb-10">
        <CreateComment postId={postId} />
        <div className="">
          <h3 className="">Comments</h3>
          <p className="text-2xl font-bold">No comments</p>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="mb-10">
        <CreateComment postId={postId} />
        <div>
          <h3 className="text-2xl font-bold">Comments</h3>
          <ul className="border border-black">
            {comments.map((item) => (
              <li key={item.id}>
                <p className="mb-3 font-bold">
                  {item.displayName ? (
                    <Link href={`/users/${encodeURIComponent(item.user_id)}`}>
                      <a className="font-black underline hover:text-blue-500">
                        {item.displayName}
                      </a>
                    </Link>
                  ) : (
                    <span className="underline">Deleted user</span>
                  )}{" "}
                  commented on <span>{formatDate(item.publicationDate)}</span>
                </p>
                <Link href={`/comments/${encodeURIComponent(item.id)}`}>
                  <a>
                    <p className="text-justify w-full hover:bg-gray-200">
                      {item.content}
                    </p>
                  </a>
                </Link>
                {item.user_id == sessionId ||
                postUserId == sessionId ||
                userRoleId == 3
                  ? null
                  : null}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

export default CommentsList
