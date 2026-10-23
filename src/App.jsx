import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthProvider } from './context/AuthContext'
import { CategoryProvider } from './context/CategoryContext'
import { BookProvider } from './context/BookContext'
import { MemberProvider } from './context/MemberContext'
import { IssueReturnProvider } from './context/IssueReturnContext'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CategoryProvider>
          <BookProvider>
            <MemberProvider>
              <IssueReturnProvider>
                <AppRoutes />
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="colored"
                />
              </IssueReturnProvider>
            </MemberProvider>
          </BookProvider>
        </CategoryProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
