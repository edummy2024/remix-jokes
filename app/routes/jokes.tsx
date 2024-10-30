import { json, Link, Outlet, useLoaderData } from "@remix-run/react";
import { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import stylesUrl from "~/styles/jokes.css?url";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl }
];

export async function loader({ request }: LoaderFunctionArgs) {
  const jokesListItem = await db.joke.findMany({
    select: { id: true, name: true },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  const user = await getUser(request);
  return json({ jokesListItem, user });
}

export default function JokesRoute() {
  const { jokesListItem, user } = useLoaderData<typeof loader>();

  return (
    <div className="jokes-layout">
      <header className="jokes-header">
        <div className="container">
          <h1 className="home-link">
            <Link
              to="/"
              title="Remix Jokes"
              aria-label="Remix Jokes"
            >
              <span className="logo">🤪</span>
              <span className="logo-medium">J🤪KES</span>
            </Link>
          </h1>
           {user ? (
            <div className="user-info">
              <span>{`Hi ${user.username}`}</span>
              <form action="/logout" method="post">
                <button type="submit" className="button">
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>
      <main className="jokes-main">
        <div className="container">
          <div className="jokes-list">
            <Link to=".">Get a random joke</Link>
            <p>Here are a few more jokes to check out:</p>
            <ul>
              {
                jokesListItem.length > 0 ?
                  jokesListItem.map((joke) => (
                    <li key={joke.id}>
                      <Link to={`${joke.id}`}>{joke.name}</Link>
                    </li>
                  ))
                  :
                  <li>
                    <i>No Data</i>
                  </li>
              }
            </ul>
            <Link to="new" className="button">
              Add your own
            </Link>
          </div>
          <div className="jokes-outlet">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
