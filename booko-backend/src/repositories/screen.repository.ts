import { ScreenModel } from "../models/screen.model";

export const screenRepository = {
    findByTheaterId: (theaterId: string) => ScreenModel.find({ theaterId }),
    findById: (id: string) => ScreenModel.findById(id),
    create: (data: any) => ScreenModel.create(data),
    updateById: (id: string, data: any) => ScreenModel.findByIdAndUpdate(id, data, { new: true }),
    deleteById: (id: string) => ScreenModel.findByIdAndDelete(id),
};
