import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import AppContext from "./AppContext"
import api from "../components/utils/api"
import CommentModif from "../../src/components/CommentModif"

const newDate = (date) => {
  return (date = new Date(date).toLocaleDateString())
}

const CommentProfile = ({ commentId }) => {
  const { session, router } = useContext(AppContext)
  const [comment, setComment] = useState(null)
  const [apiError, setApiError] = useState(null)
  const [Modified, setModified] = useState(false)

  const sessionId = JSON.parse(session).payload.user.id
  const userRoleId = JSON.parse(session).payload.user.roleId

  const delComment = async () => {
    await api.delete(`/comments/${commentId}`)
    router.back()
  }

  useEffect(() => {
    if (commentId && !isNaN(commentId)) {
      api
        .get(`/comments/${commentId}`)
        .then((response) => setComment(response.data))
        .catch((error) =>
          setApiError(
            error.response ? error.response.data.error : error.message
          )
        )
    }
  }, [commentId])

  if (apiError) {
    return <div className="">{apiError}</div>
  }

  if (!comment) {
    return null
  }

  if (isNaN(commentId) && commentId !== undefined) {
    return <div className="">comment id must be a number!!</div>
  }

  return (
    <div>
      {!Modified ? (
        <>
          <div className="flex flex-col border border-black">
            <div className="text-center text-2xl font-bold">
              {comment ? (
                <Link href={`/users/${encodeURIComponent(comment.id)}`}>
                  <a className="">{comment.author}</a>
                </Link>
              ) : (
                <div className="">Deleted user</div>
              )}{" "}
              commented on{" "}
              <p className="">{newDate(comment.publicationDate)}</p>
            </div>
            <p className="text-center text-2xl font-bold">{comment.content}</p>

            <button
              className="text-center text-2xl font-bold"
              onClick={() => {
                setModified(true)
              }}
            >
              {" "}
              Modifier{" "}
            </button>
          </div>
        </>
      ) : (
        <CommentModif commentId={commentId} />
      )}

      {!Modified ? (
        comment.id == sessionId ||
        comment.post_id == sessionId ||
        userRoleId == 3 ? (
          <div className="space-x-4">
            {comment.user_id == sessionId ? (
              <button
                className="mt-5 py-5 px-5 bg-black text-white font-bold "
                onClick={() => setModified(true)}
              >
                Modify comment
              </button>
            ) : null}
            <button
              className="mt-5 py-5 px-5 bg-black text-white font-bold"
              onClick={delComment}
            >
              Delete comment
            </button>
          </div>
        ) : null
      ) : (
        <div className="">
          <button className="" onClick={() => setModified(false)}></button>
        </div>
      )}
    </div>
  )
}

export default CommentProfile
