import React from "react"
import { Field, Form, Formik } from "formik"
import * as Yup from "yup"
import { useContext, useCallback, useEffect, useState } from "react"
import AppContext from "./AppContext"
import api from "./utils/api"

const displayingErrorMessagesSchema = Yup.object().shape({
  title: Yup.string()
    .max(200, "Maximum 200 characters")
    .required("The field is required"),
  content: Yup.string()
    .max(1500, "Maximum 1500 characters")
    .required("The field is required"),
})

const PostModifForm = ({ postId }) => {
  const { router } = useContext(AppContext)
  const [post, setPost] = useState("")

  const handleFormSubmit = useCallback(
    async ({ title, content }) => {
      await api.put(`/posts/${postId}`, { title, content })
      router.reload()
    },
    [postId, router]
  )

  useEffect(() => {
    if (!isNaN(postId) && postId) {
      api.get(`/posts/${postId}`).then((response) => setPost(response.data))
    }
  }, [postId])

  return (
    <div>
      <div className="px-10 pt-6">
        <h2 className="text-4xl font-bold mb-5">Modifer</h2>
        <Formik
          initialValues={{
            title: post.title,
            content: post.content,
          }}
          validationSchema={displayingErrorMessagesSchema}
          onSubmit={handleFormSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <label className="flex flex-col p-2 font-bold">Title</label>
              <Field
                className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                name="title"
                placeholder="Post Title"
              />
              {errors.title && touched.title && (
                <div className={`${errors.title ? "text-red-500" : null}`}>
                  {errors.title}
                </div>
              )}
              <label className="">Content</label>
              <Field
                className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                type="textarea"
                name="content"
                placeholder="Post Content"
                rows="7"
              />
              {errors.content && touched.content && (
                <div className={`${errors.content ? "text-red-500" : null}`}>
                  {errors.content}
                </div>
              )}
              <button
                className="px-6 py-2 mt-4 text-white bg-black"
                type="submit"
              >
                Modifier
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default PostModifForm
