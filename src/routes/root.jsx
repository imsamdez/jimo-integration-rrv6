import { useEffect } from "react";
import {
  Form,
  Link,
  NavLink,
  Outlet,
  redirect,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { createContact, getContacts, initContacts } from "../contacts";

export async function action() {
  const contact = await createContact();
  return redirect(`contacts/${contact.id}/edit`);
}

export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  let contacts = await getContacts(q);

  if (contacts.length === 0) {
    await initContacts();
    contacts = await getContacts(q);
  }
  return { contacts, q };
}

export default function Root() {
  const { contacts, q } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);

  const handlePopstate = () => {
    alert("POPSTATE");
  };

  // For project using Hook component
  useEffect(() => {
    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  return (
    <>
      <div id="sidebar">
        <h1>
          <Link to="/">React Router Contacts</Link>
        </h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              className={searching ? "loading" : ""}
              aria-label="Aria Label Search Contacts"
              placeholder="Placeholder Search Contacts"
              type="search"
              autoComplete="off"
              name="q"
              defaultValue={q}
              onChange={(event) => {
                const isFirstSearch = q == null;
                submit(event.currentTarget.form, {
                  replace: !isFirstSearch,
                });
              }}
            />
            <div id="search-spinner" aria-hidden hidden={!searching} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>

        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id="detail"
        className={navigation.state === "loading" ? "loading" : ""}
      >
        <Outlet />
      </div>
    </>
  );
}
