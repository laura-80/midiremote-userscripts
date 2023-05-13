// LaunchPad Pro Mk3 MIDI Remote for Cubase
//  
// v1
//
// Author: Laura Burton

//-----------------------------------------------------------------------------
// 1. DRIVER SETUP - create driver object, midi ports and detection information
//-----------------------------------------------------------------------------

// get the api's entry point
const midiremote_api = require('midiremote_api_v1');

// create the device driver main object
const deviceDriver = midiremote_api.makeDeviceDriver(
  'Novation',
  'LaunchPad Pro Mk3',
  'Laura Burton'
);

// create objects representing the hardware's MIDI ports
const midiInput = deviceDriver.mPorts.makeMidiInput();
const midiOutput = deviceDriver.mPorts.makeMidiOutput();
 
// Windows

deviceDriver
.makeDetectionUnit()
.detectPortPair(midiInput, midiOutput)
.expectInputNameContains('LPProMK3 MIDI')
.expectInputNameContains('MIDIIN')
.expectOutputNameContains('LPProMK3 MIDI')
.expectOutputNameContains('MIDIOUT')
.expectSysexIdentityResponse('002029', '3701', '0000');

// Initialize

// Default colours for buttons that will be available

var defaultButtonLEDColours = [
    [ 0x90, 0x63, 0x4F ],   // Logo
    [ 0x90, 0x5B, 0x03 ],   // Left Arrow
    [ 0x90, 0x5C, 0x03 ],   // Right Arrow
    [ 0x90, 0x14, 0x7B ],   // Play
    [ 0x90, 0x0A, 0x79 ],   // Stop
    [ 0x90, 0x01, 0x79 ],   // Record Arm
    [ 0x90, 0x02, 0x0E ],   // Mute
    [ 0x90, 0x03, 0x79 ],   // Solo
    [ 0x90, 0x07, 0x94 ]    // Device
];

deviceDriver.mOnActivate = function (context) {
 
    // Reset all LEDs to Off

    for (var i = 0; i < 99; i++ ) {

        midiOutput.sendMidi(context, [0x90, 0x01 + i, 0]);

    }

    // Light up the available buttons with their default colours

    defaultButtonLEDColours.forEach(function (message) {
        midiOutput.sendMidi(context, message);
    });



//    midiOutput.sendMidi(context, [0x90, 0x66, 0]);

}