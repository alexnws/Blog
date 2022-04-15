import { useRouter } from "next/router"
import PostProfile from "../../src/components/PostProfile"

const Post = () => {
  const {
    query: { postId },
  } = useRouter()

  return <PostProfile postId={postId} />
}

Post.private = true
export default Post
