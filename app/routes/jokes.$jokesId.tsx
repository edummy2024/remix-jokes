import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import variant from "tiny-invariant";
import { db } from "~/utils/db.server";

export async function loader({ params }: LoaderFunctionArgs) {
  console.log(params.jokesId);
  variant(params.jokesId, "Id tidak boleh kosong");
  const joke = await db.joke.findUnique({
    where: {
      id: params.jokesId,
    },
    select: { name: true, content: true, id: true },
  });

  if (!joke) {
    throw new Response("Not Found.", { status: 404 });
  }

  return json({ joke });
}

export default function JokeRoute() {
  const { joke } = useLoaderData<typeof loader>();
  console.log(joke)
  return (
    <div>
      <p>Here's your {joke.name}:</p>
      <p>
        {joke.content}
      </p>
        <Link to={"."}>
        "{joke.name}" Permalink
      </Link>
    </div>
  );
}
