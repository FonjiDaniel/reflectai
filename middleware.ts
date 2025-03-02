import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/login(.*)", "/signup(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
    const { userId } = await auth();

    if (userId) {
      console.log("Syncing user:", userId);

      try {
      
        const clerk = await clerkClient()
        const clerkUser = await clerk.users.getUser(userId);
        console.log(clerkUser);

      
        const name =
          clerkUser.username ||
          `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() ||
          "Unknown";

        const email = clerkUser.emailAddresses[0]?.emailAddress;


    
          const response = await fetch("http://localhost:5000/api/v1/auth", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              email,
              clerkId: userId,
            }),
          });

          const data = await response.json();

          if (data.success) {

            console.log("User synced successfully:", data.data.user);
          } else {
            console.error("User sync failed:", data);
          }
        
      } catch (err) {
        console.error("Failed to sync user:", err);
      }
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
