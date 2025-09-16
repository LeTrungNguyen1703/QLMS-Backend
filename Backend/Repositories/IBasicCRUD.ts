import {Document} from "mongoose";

export interface IBasicCRUD<model> {

    findAll(): Promise<model[]>;

    create(data: Document & model): Promise<model>

    update(id: string, data: Partial<model>): Promise<model | null>

    findById(id: string): Promise<model | null>

    deleteById(id: string): Promise<model | null>
}