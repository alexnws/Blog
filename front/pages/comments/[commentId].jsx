import { useRouter } from "next/router"
import CommentProfile from "../../src/components/CommentProfile"

const Comment = () => {
  const {
    query: { commentId },
  } = useRouter()

  return <CommentProfile commentId={commentId} />
}

Comment.private = true

export default Comment
