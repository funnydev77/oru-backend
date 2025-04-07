import fs from 'fs';

export interface TestResult {
  code: string;
  value: string;
  unit: string;
}

export interface PatientInfo {
  msg_no: string;
  id: string;
  name: string;
  dob: string;
  gender: string;
}

export interface Result {
  patient: PatientInfo;
  results: TestResult[];
}

const encodingChars = {
  fieldSeparator: '|',
  componentSeparator: '^',
  repetitionSeparator: '~',
  escapeCharacter: '\\',
  subcomponentSeparator: '&'
};

// Parse ORU file and extract test results and patient info
export const parseOruFile = (filePath: string): { results: Result[] } => {
  const data = fs.readFileSync(filePath, 'utf-8');
  const results: Result[] = [];

  // Split by MSH to handle multiple messages
  const messages = data.split('MSH|');

  messages.forEach((message) => {
    if (message.trim()) {
      let patientInfo: PatientInfo = { msg_no: '', id: '', name: '', dob: '', gender: '' };
      let tests: TestResult[] = [];

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
            const value = parts[5];  // Extract test value
            const unit = parts[6].split('^')[0];   // Extract test unit
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
