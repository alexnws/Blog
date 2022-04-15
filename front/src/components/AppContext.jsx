import { createContext, useCallback, useEffect, useState } from "react"
import api from "./utils/api"

const AppContext = createContext({})

export const AppContextProvider = (props) => {
  const { pageComponent: Page, router, ...otherProps } = props

  const [session, setSession] = useState()
  const [signInError, setSignInError] = useState(null)
  const [signUpError, setSignUpError] = useState(null)

  const createSession = useCallback((jwt) => {
    if (!jwt) {
      setSession(null)

      return
    }

    const [, payload] = jwt.split(".")
    const session = atob(payload)

    setSession(session)
  }, [])

  useEffect(() => {
    const jwt = localStorage.getItem("jwt")

    createSession(jwt)
  }, [createSession])

  useEffect(() => {
    if (session === null && Page.private) {
      router.push(`/signin?redirect=${encodeURIComponent(location.pathname)}`)
    }
  }, [Page.private, router, session])

  useEffect(() => {
    if (session !== null && session !== undefined && Page.noSession) {
      router.push("/")
    }
  }, [Page.noSession, Page.private, router, session])

  const signIn = useCallback(
    async (email, password) => {
      try {
        const {
          data: { auth },
        } = await api.post("/sign-in", { email, password })

        setSignInError(null)
        localStorage.setItem("jwt", auth)

        createSession(auth)

        const {
          query: { redirect },
        } = router

        if (redirect) {
          router.push(decodeURIComponent(redirect))
        }
      } catch (err) {
        setSignInError(err.response.data.error)
      }
    },
    [createSession, router]
  )

  const signUp = useCallback(
    async (displayName, email, password) => {
      try {
        await api.post("/sign-up", { displayName, email, password })
        router.push("/signin")
        setSignUpError(null)
      } catch (err) {
        setSignUpError(err.response.data.error)
      }
    },
    [router]
  )

  const signOut = () => {
    localStorage.clear()
    setSession(null)
    router.push("/signin")
  }

  if (!session && Page.private) {
    return null
  }

  return (
    <AppContext.Provider
      {...otherProps}
      value={{
        router,
        session,
        signInError,
        signUpError,
        signIn,
        signUp,
        signOut,
      }}
    />
  )
}

export default AppContext
