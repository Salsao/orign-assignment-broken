// import { get } from "../utils/https"
import { VIN_LENGTH, INVALID_VIN_MESSAGE } from "../../constants"

const invalidChars = new RegExp(/[IOQ]/, "g")

export const filter = (vin: string) =>
    vin
        .toUpperCase()
        .replace(invalidChars, "")
        .slice(0, VIN_LENGTH)

export const validate = (_vin: string): string => (_vin.length === VIN_LENGTH ? "" : INVALID_VIN_MESSAGE)

export const convert = (_res: VinCheckResponse): CarInfo => null

export const apiCheck = async (_vin: string): Promise<CarInfo> => null
