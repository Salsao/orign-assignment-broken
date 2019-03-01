import { convert, filter, validate, apiCheck } from "./vinService"
import { vinCheckResponseFixture, vinResultEntryFixture } from "../test/fixtures"
import { INVALID_VIN_MESSAGE } from "../../constants"

describe("Vin Service", () => {
    describe.skip("Response converter", () => {
        it("gives empty result when no data is given", () => expect(convert(null)).toEqual(null))
        it("gives empty result when invalid data is given", () => expect(convert({} as any)).toEqual(null))
        it("gives empty result when response contains no data", () =>
            expect(convert(vinCheckResponseFixture({ Results: [] }))).toEqual(null))

        const entry = (Variable: string, Value: string) => vinResultEntryFixture({ Variable, Value })

        it("takes make from Results array", () =>
            expect(convert(vinCheckResponseFixture({ Results: [entry("Make", "HONDA")] })).make).toEqual("HONDA"))

        it("takes year from Results array", () =>
            expect(convert(vinCheckResponseFixture({ Results: [entry("Model Year", "2007")] })).year).toEqual(2007))

        it("takes type from Results array", () =>
            expect(
                convert(vinCheckResponseFixture({ Results: [entry("Vehicle Type", "PASSENGER CAR")] })).vehicleType
            ).toEqual("PASSENGER CAR"))

        it("takes trim from Results array", () =>
            expect(convert(vinCheckResponseFixture({ Results: [entry("Trim", "FN2")] })).trim).toEqual("FN2"))

        it("takes all values from Results", () =>
            expect(
                convert(
                    vinCheckResponseFixture({
                        Results: [
                            entry("Make", "MAZDA"),
                            entry("Model Year", "2010"),
                            entry("Model", "rx8"),
                            entry("Vehicle Type", "CAR"),
                            entry("Trim", "RX8")
                        ]
                    })
                )
            ).toEqual({
                make: "MAZDA",
                year: 2010,
                model: "rx8",
                vehicleType: "CAR",
                trim: "RX8"
            }))
    })

    describe("Vin string filter", () => {
        it("uppercases given string", () => expect(filter("abc")).toEqual("ABC"))
        it("disallows IOQ", () => expect(filter("IOQabc")).toEqual("ABC"))
        it("disallows ioq", () => expect(filter("ioqabc")).toEqual("ABC"))
        it("trims to first 17 chars", () => expect(filter("SHHFN23607U002758abc")).toEqual("SHHFN23607U002758"))
    })

    describe("Vin validate", () => {
        it("exactly 17 chars", () => expect(validate("exact17characters")).toEqual(""))
        it("less than 17 chars", () => expect(validate("lessthan17")).toEqual(`${INVALID_VIN_MESSAGE}`))
        it("more than 17 chars", () => expect(validate("morethan17characters")).toEqual(`${INVALID_VIN_MESSAGE}`))
        it("empty", () => expect(validate("")).toEqual(`${INVALID_VIN_MESSAGE}`))
    })

    describe("Vin apiCheck", () => {
        it("return parsed result", async () => {
            const vin = "4T1SV22E4KU162526"
            const result = await apiCheck(vin)
            expect(result).toEqual({
                make: "TOYOTA",
                model: "Camry",
                trim: null,
                vehicleType: "PASSENGER CAR",
                year: "1989"
            })
        })
    })
})
