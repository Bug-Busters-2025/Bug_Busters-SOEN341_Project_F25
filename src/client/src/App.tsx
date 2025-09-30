import { RouterProvider } from 'react-router/dom';
import router from './routing/reactRouter.ts';

export default function App() {

  return (
    // future clerk provider implementation
    <>
      <RouterProvider router={router}/>
    </>
  )
}
