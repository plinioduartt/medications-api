import { ObjectId } from "mongodb";

export class IsValidId {
    static isSatisfiedBy(indicationId: string) {
        return ObjectId.isValid(indicationId)
    }
}