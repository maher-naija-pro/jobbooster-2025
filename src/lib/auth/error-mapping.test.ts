// Simple test utility for error mapping
// This can be run manually to verify error mapping works correctly

function mapAuthErrorToMessage(errorMessage: string): string {
    const errorMap: Record<string, string> = {
        'Invalid login credentials': 'The email or password you entered is incorrect. Please check your credentials and try again.',
        'Email not confirmed': 'Please check your email and click the confirmation link before signing in.',
        'Too many requests': 'Too many login attempts. Please wait a few minutes before trying again.',
        'User not found': 'No account found with this email address. Please check your email or create a new account.',
        'Invalid email': 'Please enter a valid email address.',
        'Password should be at least 6 characters': 'Password must be at least 6 characters long.',
        'Signup is disabled': 'Account creation is currently disabled. Please contact support.',
        'Email address not authorized': 'This email address is not authorized to access the system.',
        'Account is disabled': 'Your account has been disabled. Please contact support for assistance.',
    }

    // Check for exact matches first
    if (errorMap[errorMessage]) {
        return errorMap[errorMessage]
    }

    // Check for partial matches for more specific error handling
    if (errorMessage.includes('Invalid login credentials')) {
        return 'The email or password you entered is incorrect. Please check your credentials and try again.'
    }

    if (errorMessage.includes('not found') || errorMessage.includes('does not exist')) {
        return 'No account found with this email address. Please check your email or create a new account.'
    }

    if (errorMessage.includes('rate limit') || errorMessage.includes('too many')) {
        return 'Too many login attempts. Please wait a few minutes before trying again.'
    }

    // Default fallback for unknown errors
    return 'Login failed. Please check your credentials and try again.'
}

// Test cases
const testCases = [
    {
        input: 'Invalid login credentials',
        expected: 'The email or password you entered is incorrect. Please check your credentials and try again.',
        description: 'Exact match for invalid credentials'
    },
    {
        input: 'User not found',
        expected: 'No account found with this email address. Please check your email or create a new account.',
        description: 'Exact match for user not found'
    },
    {
        input: 'Email not confirmed',
        expected: 'Please check your email and click the confirmation link before signing in.',
        description: 'Exact match for unconfirmed email'
    },
    {
        input: 'Too many requests',
        expected: 'Too many login attempts. Please wait a few minutes before trying again.',
        description: 'Exact match for rate limiting'
    },
    {
        input: 'Some random error message',
        expected: 'Login failed. Please check your credentials and try again.',
        description: 'Fallback for unknown error'
    }
]

// Run tests
console.log('Testing error mapping...')
let passed = 0
let failed = 0

testCases.forEach((testCase, index) => {
    const result = mapAuthErrorToMessage(testCase.input)
    const success = result === testCase.expected

    console.log(`Test ${index + 1}: ${testCase.description}`)
    console.log(`  Input: "${testCase.input}"`)
    console.log(`  Expected: "${testCase.expected}"`)
    console.log(`  Got: "${result}"`)
    console.log(`  Result: ${success ? 'PASS' : 'FAIL'}`)
    console.log('')

    if (success) {
        passed++
    } else {
        failed++
    }
})

console.log(`\nTest Results: ${passed} passed, ${failed} failed`)

export { mapAuthErrorToMessage }
