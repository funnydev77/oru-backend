"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseConditions = void 0;
// Parse conditions CSV into an array of Condition objects
const parseConditions = (data) => {
    const rows = data.split('\n').slice(1); // Skip header
    return rows.map(row => {
        const [diagnostic_code, condition_code, condition_name] = row.split(',');
        return { diagnostic_code, condition_code, condition_name };
    });
};
exports.parseConditions = parseConditions;
