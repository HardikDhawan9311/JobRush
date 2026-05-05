import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { router } from './routes';
import { UserProvider } from './context/UserContext';

export default function App() {
  return (
    <UserProvider>
      <Toaster position="top-center" richColors />
      <RouterProvider router={router} />
    </UserProvider>
  );
}