import { reducer, initialState, setVin, checkVin, checkVinSuccess, checkVinFail } from "."
import { VIN_LENGTH } from "../../constants"

describe("counter state", () => {
    describe("reducer", () => {
        it("gives same state when unknown action is given", () =>
            expect(reducer(initialState, { type: "fake" })).toEqual(initialState))

        describe("setVin", () => {
            it("returns ok", () => {
                const vin = "4T1SV22E4KU162526"
                const action = { type: setVin, payload: vin }
                expect(reducer(initialState, action)).toEqual({
                    vin,
                    vinCheckResult: initialState.vinCheckResult,
                    vinValidationError: null
                })
            })
        })

        describe("checkVin", () => {
            it("returns validation error", () => {
                const vin = "iafi4hfai8r"
                const state = { ...initialState, vin }
                const action = { type: checkVin }
                const vinValidationError = `${VIN_LENGTH} chars expected`
                expect(reducer(state, action)).toEqual({ ...state, vinValidationError })
            })
        })

        describe("checkVinSuccess", () => {
            it("return vinCheckResult as vinApiResult", () => {
                const vinApiResult: CarInfo = { make: null, model: null, year: null, trim: null, vehicleType: null }
                const action = { type: checkVinSuccess, payload: vinApiResult }
                expect(reducer(initialState, action)).toEqual({ ...initialState, vinCheckResult: vinApiResult })
            })
        })

        describe("checkVinFail", () => {
            it("return vinCheckResult as NotLoaded", () => {
                const action = { type: checkVinFail, payload: new Error("error") }
                expect(reducer(initialState, action)).toEqual({ ...initialState, vinCheckResult: "NotLoaded" })
            })
        })
    })
})
