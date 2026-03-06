// --- Handle incoming heading from the other micro:bit ---
radio.onReceivedNumber(function (receivedHeading) {
    // already smoothed by the other device
    otherHeading = receivedHeading
    // Calculate angle difference
    delta = signedDelta(myHeading, otherHeading)
    difference = Math.abs(delta)
    // Check for opposite direction (≈180º)
    if (difference > 180 - TOLERANCE && difference < 180 + TOLERANCE) {
        // facing each other
        basic.showIcon(IconNames.Happy)
    } else {
        // not facing each other
        basic.showIcon(IconNames.Asleep)
    }
})
// --- Smooth an angle along shortest path ---
function smoothHeading (current: number, target: number, factor: number) {
    d = (target - current + 540) % 360 - 180
    return (current + d * factor + 360) % 360
}
// --- Compute shortest signed angle difference (-180 to +180) ---
function signedDelta (a: number, b: number) {
    return (a - b + 540) % 360 - 180
}
let raw = 0
let d = 0
let difference = 0
let delta = 0
let otherHeading = 0
let myHeading = 0
let TOLERANCE = 0
let GROUP = 1
// +/- around 180° for "facing each other"
TOLERANCE = 40
// smoothing factor
let SMOOTH = 0.2
input.calibrateCompass()
radio.setGroup(GROUP)
basic.pause(200)
myHeading = input.compassHeading()
// --- Main loop: smooth our own heading and send it ---
basic.forever(function () {
    raw = input.compassHeading()
    myHeading = smoothHeading(myHeading, raw, SMOOTH)
    radio.sendNumber(myHeading)
    basic.pause(100)
})
