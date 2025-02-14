import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

export const doSomething = httpAction(async (ctx, request) => {
    const { data, type } = await request.json();




    // implementation will be here
    console.log("doSomething");

    switch (type) {
        case "user.created":
            await ctx.runMutation(internal.users.createUser, {
                clerkId: data.id,
                email: data.email_addresses[0].email_address,
                imageUrl: data.image_url,
                first_name: data.first_name,
                last_name: data.last_name,
                username: data.username,
                bio: data.bio,
                websiteUrl: data.websiteUrl,
                followersCount: 0,
            });
            break;
        case "user.deleted":
            console.log("user.deleted");
            break;
        case "user.updated":
            console.log("user.updated");
            break;
        case "user.password_reset":
            console.log("user.password_reset");
            break;
        default:
            console.log("default");
            break;
    }

    return new Response(null, { status: 200 });

});

http.route({
    path: "/clerk-users-webhook",
    method: "POST",
    handler: doSomething,
});
// https://exuberant-salmon-136.convex.site/clerk-users-webhook

export default http;