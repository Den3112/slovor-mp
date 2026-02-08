const fs = require('fs');

try {
    const content = fs.readFileSync('lint_report_new.json', 'utf8');
    // The file might contain some non-JSON output at the beginning (lines 1-4 in view_file output).
    // We need to find the start of the JSON array.
    const jsonStartIndex = content.indexOf('[');
    if (jsonStartIndex === -1) {
        throw new Error('No JSON array found in lint_report.json');
    }

    const jsonContent = content.substring(jsonStartIndex);
    const results = JSON.parse(jsonContent);

    const warningsByRule = {};
    let totalWarnings = 0;

    results.forEach(result => {
        result.messages.forEach(msg => {
            // We only care about warnings (severity 1) or errors (severity 2) if we want to fix everything.
            // The user said "204 warnings", so likely severity 1.
            const ruleId = msg.ruleId;
            if (!warningsByRule[ruleId]) {
                warningsByRule[ruleId] = { count: 0, files: [] };
            }
            warningsByRule[ruleId].count++;
            if (!warningsByRule[ruleId].files.includes(result.filePath)) {
                warningsByRule[ruleId].files.push(result.filePath);
            }
            totalWarnings++;
        });
    });

    console.log(`Total Messages: ${totalWarnings}`);
    console.log('--- Warnings by Rule ---');
    Object.keys(warningsByRule).sort((a, b) => warningsByRule[b].count - warningsByRule[a].count).forEach(rule => {
        console.log(`${rule}: ${warningsByRule[rule].count}`);
        // Limit file listing to 3 to avoid spamming
        console.log(`  Files (${warningsByRule[rule].files.length}): ${warningsByRule[rule].files.slice(0, 3).map(f => f.split('/').pop()).join(', ')}${warningsByRule[rule].files.length > 3 ? '...' : ''}`);
    });

} catch (err) {
    console.error('Error analyzing lint report:', err);
}
