const { spawn } = require('child_process');
const path = require('path');

console.log('========================================');
console.log('  Running All Tests for CredResolve');
console.log('========================================\n');

const tests = [
    {
        name: 'Logic Tests',
        file: path.join(__dirname, 'test_logic.js'),
        description: 'Testing balance calculation and debt simplification logic'
    },
    {
        name: 'API Verification (Basic)',
        file: path.join(__dirname, 'verify_api.js'),
        description: 'Testing API endpoints: Users, Groups, Expenses, and Balances'
    },
    {
        name: 'API Verification (Advanced)',
        file: path.join(__dirname, 'verify.js'),
        description: 'Testing API with multiple split types (EQUAL, EXACT, PERCENTAGE)'
    }
];

let currentTestIndex = 0;
const results = [];

function runTest(test) {
    return new Promise((resolve) => {
        console.log(`\n[${currentTestIndex + 1}/${tests.length}] Running: ${test.name}`);
        console.log(`Description: ${test.description}`);
        console.log('─'.repeat(50));

        const startTime = Date.now();
        const testProcess = spawn('node', [test.file], {
            stdio: 'inherit',
            shell: true
        });

        testProcess.on('close', (code) => {
            const duration = ((Date.now() - startTime) / 1000).toFixed(2);
            const success = code === 0;
            
            results.push({
                name: test.name,
                success,
                duration,
                exitCode: code
            });

            if (success) {
                console.log(`\n✓ ${test.name} completed successfully (${duration}s)`);
            } else {
                console.log(`\n✗ ${test.name} failed with exit code ${code} (${duration}s)`);
            }

            resolve();
        });

        testProcess.on('error', (error) => {
            console.error(`\n✗ Error running ${test.name}:`, error.message);
            results.push({
                name: test.name,
                success: false,
                duration: '0.00',
                exitCode: -1,
                error: error.message
            });
            resolve();
        });
    });
}

async function runAllTests() {
    console.log('Note: Make sure your API server is running on http://localhost:3000');
    console.log('      API tests will fail if the server is not running.\n');

    for (const test of tests) {
        await runTest(test);
        currentTestIndex++;
    }

    // Print Summary
    console.log('\n' + '='.repeat(50));
    console.log('  TEST SUMMARY');
    console.log('='.repeat(50));
    
    const passed = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    results.forEach(result => {
        const status = result.success ? '✓ PASS' : '✗ FAIL';
        console.log(`${status} - ${result.name} (${result.duration}s)`);
    });

    console.log('\n' + '─'.repeat(50));
    console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
    console.log('='.repeat(50));

    if (failed > 0) {
        console.log('\n⚠ Some tests failed. Please check the output above.');
        process.exit(1);
    } else {
        console.log('\n✓ All tests passed!');
        process.exit(0);
    }
}

runAllTests();

