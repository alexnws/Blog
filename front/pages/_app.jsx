import { AppContextProvider } from "../src/components/AppContext.jsx"
import "../styles/globals.css"
const MyApp = ({ Component, pageProps, ...otherProps }) => {
  return (
    <AppContextProvider pageComponent={Component} router={otherProps.router}>
      <Component {...pageProps} {...otherProps} />
    </AppContextProvider>
  )
}

export default MyApp
