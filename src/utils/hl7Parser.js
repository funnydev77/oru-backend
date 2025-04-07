"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOruFile = void 0;
const fs_1 = __importDefault(require("fs"));
const encodingChars = {
    fieldSeparator: '|',
    componentSeparator: '^',
    repetitionSeparator: '~',
    escapeCharacter: '\\',
    subcomponentSeparator: '&'
};
// Parse ORU file and extract test results and patient info
const parseOruFile = (filePath) => {
    const data = fs_1.default.readFileSync(filePath, 'utf-8');
    const results = [];
    // Split by MSH to handle multiple messages
    const messages = data.split('MSH|');
    messages.forEach((message) => {
        if (message.trim()) {
            let patientInfo = { msg_no: '', id: '', name: '', dob: '', gender: '' };
            let tests = [];
            const lines = message.split('\n');
            lines.forEach(line => {
                const parts = line.split('|');
                if (parts[0] === '^~\\&') {
                    patientInfo.msg_no = parts[8];
                }
                // Extract patient information from PID segment
                if (parts[0] === 'PID') {
                    patientInfo.id = parts[3].split('^')[0]; // Patient ID
                    patientInfo.name = parts[5].split('^').filter(n => n).join(' '); // Patient Name
                    patientInfo.dob = parts[7]; // Patient DOB
                    patientInfo.gender = parts[8]; // Patient Gender
                }
                // Extract test results from OBX segment
                if (parts[0] === 'OBX') {
                    const code = parts[3].split('^')[1]; // Extract diagnostic code
                    const value = parts[5]; // Extract test value
                    const unit = parts[6].split('^')[0]; // Extract test unit
                    tests.push({ code, value, unit });
                }
            });
            if (patientInfo.id && tests.length > 0) {
                results.push({
                    patient: patientInfo,
                    results: tests,
                });
            }
        }
    });
    return { results };
};
exports.parseOruFile = parseOruFile;
