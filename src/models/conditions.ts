export interface Condition {
    diagnostic_code: string;
    condition_code: string;
    condition_name: string;
}
  
  // Parse conditions CSV into an array of Condition objects
export const parseConditions = (data: string): Condition[] => {
    const rows = data.split('\n').slice(1); // Skip header
    return rows.map(row => {
        const [diagnostic_code, condition_code, condition_name] = row.split(',');
        return { diagnostic_code, condition_code, condition_name };
    });
};
