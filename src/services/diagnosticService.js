"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processDiagnosticData = void 0;
const diagnosticMetrics_1 = require("../models/diagnosticMetrics");
const highRiskService_1 = require("./highRiskService");
const hl7Parser_1 = require("../utils/hl7Parser");
// Load diagnostic metrics from the CSV
const fs = require('fs');
const diagnosticMetricsCSV = fs.readFileSync('./data/diagnostic_metrics.csv', 'utf-8');
const diagnosticMetrics = (0, diagnosticMetrics_1.parseDiagnosticMetrics)(diagnosticMetricsCSV);
// Process and return high-risk test results
const processDiagnosticData = (oruFilePath) => {
    const { results } = (0, hl7Parser_1.parseOruFile)(oruFilePath);
    const parseData = results;
    const finalResult = [];
    for (let i = 0; i < parseData.length; i++) {
        const { patient, results } = parseData[i];
        const highRiskResults = results.filter(result => {
            const metric = diagnosticMetrics.find(metric => metric.code.includes(result.code) && metric.unit == result.unit);
            return metric ? (0, highRiskService_1.isHighRisk)(result, metric) : false;
        });
        let detailedData = [];
        if (highRiskResults.length > 0) {
            for (let i = 0; i < highRiskResults.length; i++) {
                const risk = highRiskResults[i];
                detailedData.push(risk.code + ': ' + risk.value + ' ' + risk.unit);
            }
        }
        finalResult.push({
            msg_no: patient.msg_no,
            id: patient.id,
            name: patient.name,
            dob: patient.dob,
            gender: patient.gender,
            highRisk: {
                result: highRiskResults.length > 0 ? true : false,
                detail: detailedData
            }
        });
    }
    return finalResult;
};
exports.processDiagnosticData = processDiagnosticData;
