import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getCurrentUserOrThrow } from "./users";
import { paginationOptsValidator } from "convex/server";



export const addThreadMessage = mutation({
    args: {
        content: v.string(),
        mediaFiles: v.optional(v.array(v.string())),
        websiteUrl: v.optional(v.string()),
        threadId: v.optional(v.id("messages")),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        return await ctx.db.insert("messages", {
            ...args,
            userId: user._id,
            commentCount: 0,
            likeCount: 0,
            retweetCount: 0,
        })

        if (args.threadId) {

        }
    }
})


export const getThreads = query({
    args: {
        paginationOpts: paginationOptsValidator,
        userId: v.optional(v.id("users")),
    },
    handler: async (ctx, args) => {
        let threads;

        if (args.userId) {
            threads = await ctx.db.query("messages").filter((q) => q.eq(q.field("userId"), args.userId)).order("desc").paginate(args.paginationOpts)
        } else {
            threads = await ctx.db.query("messages").filter((q) => q.eq(q.field("threadId"), undefined)).order("desc").paginate(args.paginationOpts)
        }

        const messagesWithCreator = await Promise.all(threads.page.map(async (thread) => {
            const creator = await getMessageCreator(ctx, thread.userId)
            const mediaFiles = await getMediaUrls(ctx, thread.mediaFiles ?? [])
            return {
                ...thread,
                creator,
                mediaFiles
            }
        }))



        return {
            ...threads,
            page: messagesWithCreator
        };

    }
})


export const getThreadById = query({
    args: {
        messageId: v.id("messages"),
    },
    handler: async (ctx, args) => {
        const thread = await ctx.db.get(args.messageId)
        if (!thread) return null;

        const creator = await getMessageCreator(ctx, thread.userId);
        const mediaUrl = await getMediaUrls(ctx, thread.mediaFiles ?? [])

        return {
            ...thread,
            creator,
            mediaFiles: mediaUrl
        }
    }
})

const getMediaUrls = async (ctx: QueryCtx, mediaFiles: string[]) => {

    if (!mediaFiles || mediaFiles.length === 0) {
        return []
    }
    // if (mediaFiles.some((file) => file.startsWith("http"))) {
    //     return mediaFiles
    // }



    return await Promise.all(mediaFiles.map(async (file) => {
        let url;
        if (file.startsWith("http")) {
            url = file
        } else {
            url = await ctx.storage.getUrl(file as Id<"_storage">)
        }

        return url
    }))
}

export const likeCountMutation = mutation({
    args: {
        threadId: v.id("messages"),
    },
    handler: async (ctx, args) => {


        const message = await ctx.db.get(args.threadId)

        const newLikeCount = await ctx.db.patch(args.threadId, {
            likeCount: (message?.likeCount || 0) + 1
        })
        return newLikeCount

    }

})

const getMessageCreator = async (ctx: QueryCtx, userId: Id<"users">) => {

    const user = await ctx.db.get(userId)

    if (!user?.imageUrl || user.imageUrl.startsWith("http")) {
        return user;
    }

    const imageUrlDB = await ctx.storage.getUrl(user.imageUrl as Id<"_storage">)
    return {
        ...user, imageUrl: imageUrlDB
    }
}


export const generateUploadUrl = mutation({
    args: {
    },
    handler: async (ctx, args) => {
        await getCurrentUserOrThrow(ctx)
        return await ctx.storage.generateUploadUrl();
    }
})