import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ErrorPage from "./error";
import "./index.css";
import Index from "./routes/index";

import Contact, {
  action as contactAction,
  loader as contactLoader,
} from "./routes/contact";
import { action as destroyAction } from "./routes/destroy";
import EditContact, {
  action as editAction,
  loader as editLoader,
} from "./routes/edit";
import Root, {
  action as rootAction,
  loader as rootLoader,
} from "./routes/root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Index /> },
          {
            path: "contacts/:contactId",
            element: <Contact />,
            loader: contactLoader,
            action: contactAction,
          },
          {
            path: "contacts/:contactId/edit",
            element: <EditContact />,
            loader: editLoader,
            action: editAction,
          },
          {
            path: "contacts/:contactId/destroy",
            action: destroyAction,
            errorElement: <div> Uwuoops! There was an errur.</div>,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
{
  /* <RouterProvider router={router} /> */
}
