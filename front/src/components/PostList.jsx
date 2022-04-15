import Link from "next/link"
import { useEffect, useState } from "react"
import api from "./utils/api.js"

const formatDate = (date) => {
  return (date = new Date(date).toLocaleDateString())
}

const PostList = () => {
  const [posts, setPosts] = useState(null)
  const [apiError, setApiError] = useState(null)

  useEffect(() => {
    api
      .get("/posts")
      .then((out) => setPosts(out.data))
      .catch((error) =>
        setApiError(error.out ? error.out.data.error : error.message)
      )
  }, [])

  if (apiError) {
    return <div className="">{apiError}</div>
  }

  if (!posts) {
    return <div></div>
  }

  if (!posts.length) {
    return (
      <section>
        <p className="text-center text-2xl">No Posts</p>
      </section>
    )
  }

  return (
    <section>
      <br />
      <h1 className="text-2xl font-bold mb-6">Latest posts</h1>
      <ul className="mb-10 ">
        {posts.map((item) => (
          <li key={item.id} className="border border-black">
            <Link href={`/posts/${encodeURIComponent(item.id)}`}>
              <a className="text-4xl font-bold leading-1 ">{item.title}</a>
            </Link>
            <div className="mb-3">
              by{" "}
              {item.displayName ? (
                <Link href={`/users/${encodeURIComponent(item.user_id)}`}>
                  <a className="font-bold underline">{item.displayName}</a>
                </Link>
              ) : (
                <div className="font-bold underline">Deleted user</div>
              )}{" "}
              on <div>{formatDate(item.publicationDate)}</div>
            </div>
            <Link href={`/posts/${encodeURIComponent(item.id)}`}>
              <a>
                <p className="flex text-justify justify-between">
                  {item.content}
                </p>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default PostList
