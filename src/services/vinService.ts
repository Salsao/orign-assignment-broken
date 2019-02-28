// import { get } from "../utils/https"

const invalidChars = new RegExp(/[IOQ]/, "g")

export const filter = (vin: string) =>
    vin
        .toUpperCase()
        .replace(invalidChars, "")
        .slice(0, 17)

export const validate = (_vin: string): string => null

export const convert = (_res: VinCheckResponse): CarInfo => null

export const apiCheck = async (_vin: string): Promise<CarInfo> => null
