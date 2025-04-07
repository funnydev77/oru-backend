import { TestResult } from '../utils/hl7Parser';
import { DiagnosticMetric } from '../models/diagnosticMetrics';

// Check if a test result is high-risk based on diagnostic metrics
export const isHighRisk = (testResult: TestResult, diagnosticMetric: DiagnosticMetric): boolean => {
    const resultValue = parseFloat(testResult.value);

    if (isNaN(resultValue)) return false;

    const { standard_lower, standard_higher, everlab_lower, everlab_higher } = diagnosticMetric;

    const isAboveStandardHigh = resultValue > parseFloat(standard_higher);
    const isBelowStandardLow = resultValue < parseFloat(standard_lower);

    const isAboveEverlabHigh = resultValue > parseFloat(everlab_higher);
    const isBelowEverlabLow = resultValue < parseFloat(everlab_lower);

    // High-risk if the result is outside of either the standard or everlab ranges
    return isAboveStandardHigh || isBelowStandardLow || isAboveEverlabHigh || isBelowEverlabLow;
};
