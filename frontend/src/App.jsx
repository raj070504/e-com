
import { Outlet } from 'react-router'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast';


function App() {


  return (
    <>
     <Navbar/>
     <main className='min-h-screen max-w-screen-2xl mx-auto px-4 py-6 font-primary' >
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
     <Outlet></Outlet>
     </main>
     <Footer/>
    </>
  )
}

export default App
