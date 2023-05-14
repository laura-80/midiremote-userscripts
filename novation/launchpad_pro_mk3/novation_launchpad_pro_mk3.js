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

// Settings

// Default colours for buttons that will be available

var defaultButtonLEDColours = [
    [ 0x90, 0x63, 0x29 ],   // Logo
    [ 0x90, 0x5B, 0x03 ],   // Left Arrow
    [ 0x90, 0x5C, 0x03 ],   // Right Arrow
    [ 0x90, 0x14, 0x7B ],   // Play
    [ 0x90, 0x0A, 0x79 ],   // Stop
    [ 0x90, 0x01, 0x79 ],   // Record Arm
    [ 0x90, 0x02, 0x0E ],   // Mute
    [ 0x90, 0x03, 0x79 ],   // Solo
    [ 0x90, 0x07, 0x94 ]    // Device
];

// Sysex Commands

var sysexMessage = [];
sysexMessage['DawMode_Enable'] = [0xF0, 0x00, 0x20, 0x29, 0x02, 0x0E, 0x10, 0x01, 0xF7];
sysexMessage['DawMode_Disable'] = [0xF0, 0x00, 0x20, 0x29, 0x02, 0x0E, 0x10, 0x00, 0xF7];
sysexMessage['NoteMode'] = [0xF0, 0x00, 0x20, 0x29, 0x02, 0x0E, 0x00, 0x04, 0x00, 0x00, 0xF7];
sysexMessage['ChordMode'] = [0xF0, 0x00, 0x20, 0x29, 0x02, 0x0E, 0x00, 0x02, 0x00, 0x00, 0xF7];

deviceDriver.mOnActivate = function (context) {

    midiOutput.sendMidi(context, sysexMessage['DawMode_Enable']);
    initializeLEDs(context);
}

deviceDriver.mOnDeactivate = function (context) {
    midiOutput.sendMidi(context, sysexMessage['DawMode_Disable']);
}

// --------------
// SURFACE LAYOUT
// --------------

var buttonsLeft = [];
var buttonsRight = [];
var buttonsRowSelect = [];
var buttonsRowAction = [];

var buttonsInBank = 8;

// Row Action

for (var i = 0; i < buttonsInBank; ++i )
{
    var button = deviceDriver.mSurface.makeButton(i * 2, 8, 2, 2);

    button.mSurfaceValue.mMidiBinding
        .setInputPort(midiInput).setOutputPort(midiOutput)
        .bindToControlChange(0, 1 + i);

    buttonsRowAction.push(button);
}

// ------------
// HOST MAPPING
// ------------

// TODO:    - Have Cubase switch to Session page when session button is pressed
//          - Don't map / unmap the buttons we've assigned in Session mode when switching to other modes

var page = deviceDriver.mMapping.makePage('Session');

page.makeValueBinding(buttonsRowAction[0].mSurfaceValue, page.mHostAccess.mTransport.mValue.mRecord).setTypeToggle();

// -----
// SETUP
// -----

function initializeLEDs(context) {

    // Reset all LEDs to Off
    
    for (var i = 0; i < 99; i++ ) {
        midiOutput.sendMidi(context, [0x90, 0x01 + i, 0]);
    }

    // Light up the available buttons with their default colours

    midiOutput.sendMidi(context, [0x90, 0x0B, 0x21]);

    defaultButtonLEDColours.forEach(function (message) {
        midiOutput.sendMidi(context, message);
    });
};