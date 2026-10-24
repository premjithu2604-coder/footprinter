import { expect, test } from "bun:test"
import { convertCircuitJsonToPcbSvg } from "circuit-to-svg"
import { fp } from "../src/footprinter"

test("lcc68", () => {
  const soup = fp.string("lcc68_w24.2_h24.2_p1.27mm").circuitJson()
  const svgContent = convertCircuitJsonToPcbSvg(soup)

  const pads = soup.filter((element) => element.type === "pcb_smtpad")
  expect(pads).toHaveLength(68)

  expect(svgContent).toMatchSvgSnapshot(import.meta.path, "lcc68")
})

test("lcc rejects a zero pitch instead of emitting invalid coordinates", () => {
  expect(() => fp.string("lcc_p0mm").circuitJson()).toThrow(
    "Quad footprint pitch must be greater than zero",
  )
})

test("lcc with a positive pitch emits finite pad coordinates", () => {
  const pads = fp
    .string("lcc_p0.5mm")
    .circuitJson()
    .filter((element) => element.type === "pcb_smtpad")

  expect(pads.length).toBeGreaterThan(0)
  for (const pad of pads) {
    expect(Number.isFinite(pad.x)).toBe(true)
    expect(Number.isFinite(pad.y)).toBe(true)
  }
})
