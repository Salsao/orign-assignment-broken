import { get } from "../utils/https"
import { VIN_LENGTH, INVALID_VIN_MESSAGE } from "../../constants"

const invalidChars = new RegExp(/[IOQ]/, "g")

const API_VIN = "https://vpic.nhtsa.dot.gov/api"

const rename = (name: string) => {
    switch (name) {
        case "Make":
            return "make"
        case "Model Year":
            return "year"
        case "Model":
            return "model"
        case "Vehicle Type":
            return "vehicleType"
        case "Trim":
            return "trim"
        default:
            return ""
    }
}

export const filter = (vin: string) =>
    vin
        .toUpperCase()
        .replace(invalidChars, "")
        .slice(0, VIN_LENGTH)

export const validate = (_vin: string): string => (_vin.length === VIN_LENGTH ? "" : INVALID_VIN_MESSAGE)

export const convert = (_res: VinCheckResponse): CarInfo => {
    if (!_res || !_res.Results) return

    return Object.assign(
        {},
        ..._res.Results.filter(result => result.Variable.match(/^(Make|Model Year|Model|Vehicle Type|Trim)$/)).map(
            item => ({ [rename(item["Variable"])]: item["Value"] })
        )
    )
}

export const apiCheck = async (_vin: string): Promise<CarInfo> =>
    new Promise<CarInfo>((resolve, reject) => {
        get(`${API_VIN}/vehicles/decodevin/${_vin}?format=json`)
            .then((res: VinCheckResponse) => {
                resolve(convert(res))
            })
            .catch(error => {
                reject(new Error(error))
            })
    })
