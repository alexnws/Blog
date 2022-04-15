import Navbar from "../src/components/Navbar.jsx"
import CreatePost from "../src/components/CreatePost"
import PostList from "../src/components/PostList.jsx"

export default function Home() {
  return (
    <>
      <Navbar />
      <CreatePost />
      <PostList />
    </>
  )
}
