import {Document} from "mongoose";

/**
 * Chuyển đổi Mongoose Document thành plain JavaScript object
 */
export const toPlainObject = (doc: Document | null): any => {
    if (!doc) return null;
    return doc.toObject ? doc.toObject() : doc;
};
