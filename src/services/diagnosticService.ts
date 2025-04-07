import { parseDiagnosticMetrics } from '../models/diagnosticMetrics';
import { isHighRisk } from './highRiskService';
import { parseOruFile } from '../utils/hl7Parser';

// Load diagnostic metrics from the CSV
const fs = require('fs');
const diagnosticMetricsCSV = fs.readFileSync('./data/diagnostic_metrics.csv', 'utf-8');
const diagnosticMetrics = parseDiagnosticMetrics(diagnosticMetricsCSV);

// Process and return high-risk test results
export const processDiagnosticData = (oruFilePath: string) => {
    const { results } = parseOruFile(oruFilePath);
    const parseData = results;

    const finalResult: any = [];

    for (let i = 0; i < parseData.length; i++) {
        const { patient, results } = parseData[i];

        const highRiskResults = results.filter(result => {
            const metric = diagnosticMetrics.find(metric => metric.code.includes(result.code) && metric.unit == result.unit);
            return metric ? isHighRisk(result, metric) : false;
        });

        let detailedData: any = [];
        if (highRiskResults.length > 0) {
            for (let i = 0; i < highRiskResults.length; i++) {
                const risk = highRiskResults[i];
                detailedData.push(
                    risk.code + ': ' + risk.value + ' ' + risk.unit
                );
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
