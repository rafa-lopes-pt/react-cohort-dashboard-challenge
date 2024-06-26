import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { dbClient } from "../../..";
import { DB_COLLECTIONS } from "../../../database/collections.enum";
import { POSTS_FILTERS_SCHEMA } from "../posts/postsFilters.schema";
import { JwtPayload } from "jsonwebtoken";
import { POST_SCHEMA } from "../../../database/models/post.schema";
import { COMMENTS_FILTERS_SCHEMA } from "./commentsFilters.schema";

export default async function getCommentsListMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const filters = req.body.data as COMMENTS_FILTERS_SCHEMA;
	//NOTE: This is not the same as GetUserPostsMiddleware! Here we retrieve only the first 50 posts
	// On the GetUserPostsMiddleware we only get the :user posts
	try {
		const data = [];
		let i = 0;
		const collection = dbClient.find(DB_COLLECTIONS.COMMENTS, filters);
		/*IMPROVE: RETURN FIRST 50 POSTS MAX
			Include start index on req.params to continue retrieving new posts
			mongodb supports indexed search i think
		*/
		do {
			if (await collection.hasNext()) data.push(await collection.next());
			else break;

			i++;
		} while (i < 5);

		res.status(200).json({ data });
	} catch (error) {
		res.status(500).json({
			message: "Internal server error while retrieving posts",
			error,
		});
	}
}
