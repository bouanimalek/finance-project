import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import authors from "./authors";
import books from "./books";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.route("/authors", authors);
app.route("/books", books);

app
  .get("/hello", (c) => {
    return c.json({
      message: "Hello Next.js!",
    });
  })
  .get(
    "hello/:testId",
    zValidator(
      "param",
      z.object({
        testId: z.string(),
      })
    ),
    clerkMiddleware(),
    (c) => {
      const { testId } = c.req.valid("param");
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({
          message: "You are not logged in.",
        });
      }
      return c.json({
        message: "You are logged in!",
        userId: auth.userId,
        testId,
      });
    }
  );

export const GET = handle(app);
export const POST = handle(app);
