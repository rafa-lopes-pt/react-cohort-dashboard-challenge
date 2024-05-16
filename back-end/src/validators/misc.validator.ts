import { ValidatorCallback } from "./validator.type";

/**
 * Checks if a given input is a valid RegExp or a string
 * @returns
 */
export const validateRegExp: ValidatorCallback = (data) => {
	return data instanceof RegExp || typeof data === "string"
		? { message: "Requires a valid regular expression or string" }
		: { message: undefined };
};
