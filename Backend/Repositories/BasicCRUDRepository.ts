import {IBasicCRUD} from "./IBasicCRUD";
import {Document, Model, Promise} from "mongoose";
import {toPlainObject} from "../HelperMethods/Helpper";

export abstract class BasicCRUDRepository<TModel extends Document> implements IBasicCRUD<TModel> {

    abstract getModel(): Model<TModel>;

    async findAll(): Promise<TModel[]> {
        const datas = this.getModel().find();
        return (await datas).map(data => toPlainObject(data) as TModel);
    }

    async create(data: Document & TModel): Promise<TModel> {
        return toPlainObject(await data.save()) as TModel;
    }

    async findById(id: string): Promise<TModel | null> {
        const document = await this.getModel().findById(id);
        return document ? toPlainObject(document) as TModel : null;
    }

    async update(id: string, data: Partial<TModel>): Promise<TModel | null> {
        const updatedDocument = await this.getModel().findByIdAndUpdate(id, data, {new: true});
        return updatedDocument ? toPlainObject(updatedDocument) as TModel : null;
    }

    async deleteById(id: string): Promise<TModel | null> {
        const deletedDocument = await this.getModel().findByIdAndDelete(id);
        return deletedDocument ? toPlainObject(deletedDocument) as TModel : null;
    }

}