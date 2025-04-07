export interface DiagnosticMetric {
    code: string;
    unit: string;
    standard_lower: string;
    standard_higher: string;
    everlab_lower: string;
    everlab_higher: string;
}
  
const parseCSV = (csv: string) => {
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
  
export const parseDiagnosticMetrics = (csvData: string): DiagnosticMetric[] => {
    return parseCSV(csvData);
};