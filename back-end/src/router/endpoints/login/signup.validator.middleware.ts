import { NextFunction, Request, Response } from "express";
import { LOGIN_PARAMS } from "./login.params";
import { ValidatorCallback } from "../../validators/validator.type";
import { validateString } from "../../validators/form.validator";
import { validateParams } from "../../validators/validate.params.middleware";

export default function validateLoginParamsMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const requiredFields: {
		param: keyof LOGIN_PARAMS;
		validator: ValidatorCallback;
	}[] = [
		{ param: "email", validator: validateString },
		{
			param: "password",
			validator: validateString,
		},
	];

	validateParams(requiredFields, req, res, next);
}