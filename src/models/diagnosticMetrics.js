"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDiagnosticMetrics = void 0;
const parseCSV = (csv) => {
    const rows = csv.split('\n');
    return rows.map(row => {
        const fields = row.split(',');
        return {
            code: fields[1],
            unit: fields[5],
            standard_lower: fields[9],
            standard_higher: fields[10],
            everlab_lower: fields[11],
            everlab_higher: fields[12].slice(0, fields[12].length - 2),
        };
    });
};
const parseDiagnosticMetrics = (csvData) => {
    return parseCSV(csvData);
};
exports.parseDiagnosticMetrics = parseDiagnosticMetrics;
