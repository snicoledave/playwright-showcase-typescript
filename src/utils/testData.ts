/**
 * Comprehensive OrangeHRM Test Data
 * 
 * Complete test data management for OrangeHRM demo site.
 * Contains credentials, employee data, leave data, and other test scenarios
 * for comprehensive OrangeHRM testing.
 */

// ===== INTERFACES =====

export interface LoginCredentials {
  username: string;
  password: string;
  description: string;
}

export interface TestUser {
  credentials: LoginCredentials;
  expectedResult: 'success' | 'failure';
  errorMessage?: string;
}

export interface EmployeeData {
  firstName: string;
  lastName: string;
  middleName?: string;
  employeeId: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  dateOfBirth?: string;
  maritalStatus?: string;
  gender?: string;
  nationality?: string;
}

export interface LeaveData {
  leaveType: string;
  fromDate: string;
  toDate: string;
  partialDays?: 'All Days' | 'Start Day Only' | 'End Day Only' | 'Start and End Day';
  duration?: string;
  comment?: string;
}

export interface JobData {
  jobTitle: string;
  jobDescription?: string;
  jobSpecification?: string;
  note?: string;
}

export interface DepartmentData {
  name: string;
  description?: string;
}

export interface LocationData {
  name: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
  phone?: string;
  fax?: string;
  address?: string;
  notes?: string;
}

// ===== LOGIN CREDENTIALS =====

/**
 * Valid credentials for OrangeHRM demo
 * These are the standard demo credentials provided by OrangeHRM
 */
export const VALID_CREDENTIALS: LoginCredentials = {
  username: 'Admin',
  password: 'admin123',
  description: 'Valid admin credentials'
};

/**
 * Invalid credentials for testing error scenarios
 */
export const INVALID_CREDENTIALS: LoginCredentials[] = [
  {
    username: 'invalid_user',
    password: 'invalid_pass',
    description: 'Invalid username and password'
  },
  {
    username: 'Admin',
    password: 'wrong_password',
    description: 'Valid username with wrong password'
  },
  {
    username: 'wrong_user',
    password: 'admin123',
    description: 'Wrong username with valid password'
  },
  {
    username: 'admin',
    password: 'admin123',
    description: 'Case sensitive username test'
  },
  {
    username: 'Admin',
    password: 'Admin123',
    description: 'Case sensitive password test'
  }
];

/**
 * Empty field test scenarios
 */
export const EMPTY_FIELD_SCENARIOS: LoginCredentials[] = [
  {
    username: '',
    password: 'admin123',
    description: 'Empty username field'
  },
  {
    username: 'Admin',
    password: '',
    description: 'Empty password field'
  },
  {
    username: '',
    password: '',
    description: 'Both fields empty'
  }
];

/**
 * Special character test scenarios
 */
export const SPECIAL_CHARACTER_SCENARIOS: LoginCredentials[] = [
  {
    username: 'Admin@#$',
    password: 'admin123',
    description: 'Username with special characters'
  },
  {
    username: 'Admin',
    password: 'admin@#$',
    description: 'Password with special characters'
  },
  {
    username: '<script>alert("xss")</script>',
    password: 'admin123',
    description: 'XSS attempt in username'
  },
  {
    username: 'Admin',
    password: '<script>alert("xss")</script>',
    description: 'XSS attempt in password'
  }
];

/**
 * Test users with expected results
 */
export const TEST_USERS: TestUser[] = [
  {
    credentials: VALID_CREDENTIALS,
    expectedResult: 'success'
  },
  {
    credentials: INVALID_CREDENTIALS[0],
    expectedResult: 'failure',
    errorMessage: 'Invalid credentials'
  },
  {
    credentials: EMPTY_FIELD_SCENARIOS[0],
    expectedResult: 'failure',
    errorMessage: 'Required'
  },
  {
    credentials: EMPTY_FIELD_SCENARIOS[1],
    expectedResult: 'failure',
    errorMessage: 'Required'
  }
];

// ===== EMPLOYEE TEST DATA =====

/**
 * Sample employee data for testing
 */
export const SAMPLE_EMPLOYEES: EmployeeData[] = [
  {
    firstName: 'John',
    lastName: 'Doe',
    middleName: 'Michael',
    employeeId: 'EMP001',
    email: 'john.doe@company.com',
    phone: '555-123-4567',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    dateOfBirth: '1990-01-15',
    maritalStatus: 'Single',
    gender: 'Male',
    nationality: 'American'
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    middleName: 'Elizabeth',
    employeeId: 'EMP002',
    email: 'jane.smith@company.com',
    phone: '555-987-6543',
    address: '456 Oak Avenue',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90210',
    dateOfBirth: '1985-05-20',
    maritalStatus: 'Married',
    gender: 'Female',
    nationality: 'American'
  },
  {
    firstName: 'Robert',
    lastName: 'Johnson',
    employeeId: 'EMP003',
    email: 'robert.johnson@company.com',
    phone: '555-456-7890',
    dateOfBirth: '1988-12-10',
    maritalStatus: 'Single',
    gender: 'Male',
    nationality: 'American'
  }
];

/**
 * Invalid employee data for negative testing
 */
export const INVALID_EMPLOYEE_DATA: Partial<EmployeeData>[] = [
  {
    firstName: '',
    lastName: 'Doe',
    employeeId: 'EMP004'
  },
  {
    firstName: 'John',
    lastName: '',
    employeeId: 'EMP005'
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    employeeId: ''
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    employeeId: 'EMP001', // Duplicate ID
    email: 'invalid-email'
  }
];

// ===== LEAVE TEST DATA =====

/**
 * Sample leave requests for testing
 */
export const SAMPLE_LEAVE_REQUESTS: LeaveData[] = [
  {
    leaveType: 'Annual',
    fromDate: '2024-06-01',
    toDate: '2024-06-05',
    partialDays: 'All Days',
    duration: '5.00',
    comment: 'Annual vacation leave'
  },
  {
    leaveType: 'Casual',
    fromDate: '2024-06-15',
    toDate: '2024-06-15',
    partialDays: 'All Days',
    duration: '1.00',
    comment: 'Personal work'
  },
  {
    leaveType: 'Medical',
    fromDate: '2024-07-01',
    toDate: '2024-07-03',
    partialDays: 'All Days',
    duration: '3.00',
    comment: 'Medical appointment'
  }
];

/**
 * Invalid leave data for negative testing
 */
export const INVALID_LEAVE_DATA: Partial<LeaveData>[] = [
  {
    leaveType: '',
    fromDate: '2024-06-01',
    toDate: '2024-06-05'
  },
  {
    leaveType: 'Annual',
    fromDate: '',
    toDate: '2024-06-05'
  },
  {
    leaveType: 'Annual',
    fromDate: '2024-06-05',
    toDate: '2024-06-01' // End date before start date
  },
  {
    leaveType: 'Annual',
    fromDate: '2023-01-01', // Past date
    toDate: '2023-01-02'
  }
];

// ===== JOB TITLES TEST DATA =====

/**
 * Sample job titles for testing
 */
export const SAMPLE_JOB_TITLES: JobData[] = [
  {
    jobTitle: 'Software Engineer',
    jobDescription: 'Responsible for developing and maintaining software applications',
    jobSpecification: 'Bachelor\'s degree in Computer Science or related field',
    note: 'Entry to mid-level position'
  },
  {
    jobTitle: 'HR Manager',
    jobDescription: 'Oversee human resources operations and policies',
    jobSpecification: 'Bachelor\'s degree in HR or Business Administration',
    note: 'Management level position'
  },
  {
    jobTitle: 'Marketing Specialist',
    jobDescription: 'Develop and execute marketing campaigns',
    jobSpecification: 'Bachelor\'s degree in Marketing or Communications'
  }
];

// ===== DEPARTMENT TEST DATA =====

/**
 * Sample departments for testing
 */
export const SAMPLE_DEPARTMENTS: DepartmentData[] = [
  {
    name: 'Information Technology',
    description: 'Responsible for IT infrastructure and software development'
  },
  {
    name: 'Human Resources',
    description: 'Manages employee relations and organizational development'
  },
  {
    name: 'Marketing',
    description: 'Handles marketing campaigns and brand management'
  },
  {
    name: 'Finance',
    description: 'Manages financial operations and accounting'
  }
];

// ===== LOCATION TEST DATA =====

/**
 * Sample locations for testing
 */
export const SAMPLE_LOCATIONS: LocationData[] = [
  {
    name: 'New York Office',
    city: 'New York',
    state: 'NY',
    country: 'United States',
    zipCode: '10001',
    phone: '555-123-4567',
    address: '123 Business Ave, Suite 100',
    notes: 'Main headquarters'
  },
  {
    name: 'Los Angeles Branch',
    city: 'Los Angeles',
    state: 'CA',
    country: 'United States',
    zipCode: '90210',
    phone: '555-987-6543',
    address: '456 Corporate Blvd',
    notes: 'West coast operations'
  }
];

// ===== UTILITY FUNCTIONS =====

/**
 * Get valid credentials
 */
export function getValidCredentials(): LoginCredentials {
  return { ...VALID_CREDENTIALS };
}

/**
 * Get invalid credentials
 */
export function getInvalidCredentials(): LoginCredentials {
  return { ...INVALID_CREDENTIALS[0] };
}

/**
 * Get random invalid credentials
 */
export function getRandomInvalidCredentials(): LoginCredentials {
  const randomIndex = Math.floor(Math.random() * INVALID_CREDENTIALS.length);
  return { ...INVALID_CREDENTIALS[randomIndex] };
}

/**
 * Get empty username scenario
 */
export function getEmptyUsernameScenario(): LoginCredentials {
  return { ...EMPTY_FIELD_SCENARIOS[0] };
}

/**
 * Get empty password scenario
 */
export function getEmptyPasswordScenario(): LoginCredentials {
  return { ...EMPTY_FIELD_SCENARIOS[1] };
}

/**
 * Get both fields empty scenario
 */
export function getBothFieldsEmptyScenario(): LoginCredentials {
  return { ...EMPTY_FIELD_SCENARIOS[2] };
}

/**
 * Get random employee data
 */
export function getRandomEmployeeData(): EmployeeData {
  const randomIndex = Math.floor(Math.random() * SAMPLE_EMPLOYEES.length);
  return { ...SAMPLE_EMPLOYEES[randomIndex] };
}

/**
 * Get employee data by ID
 */
export function getEmployeeById(employeeId: string): EmployeeData | undefined {
  return SAMPLE_EMPLOYEES.find(emp => emp.employeeId === employeeId);
}

/**
 * Get random leave data
 */
export function getRandomLeaveData(): LeaveData {
  const randomIndex = Math.floor(Math.random() * SAMPLE_LEAVE_REQUESTS.length);
  return { ...SAMPLE_LEAVE_REQUESTS[randomIndex] };
}

/**
 * Get leave data by type
 */
export function getLeaveDataByType(leaveType: string): LeaveData | undefined {
  return SAMPLE_LEAVE_REQUESTS.find(leave => leave.leaveType === leaveType);
}

/**
 * Get random job title data
 */
export function getRandomJobTitle(): JobData {
  const randomIndex = Math.floor(Math.random() * SAMPLE_JOB_TITLES.length);
  return { ...SAMPLE_JOB_TITLES[randomIndex] };
}

/**
 * Get random department data
 */
export function getRandomDepartment(): DepartmentData {
  const randomIndex = Math.floor(Math.random() * SAMPLE_DEPARTMENTS.length);
  return { ...SAMPLE_DEPARTMENTS[randomIndex] };
}

/**
 * Get random location data
 */
export function getRandomLocation(): LocationData {
  const randomIndex = Math.floor(Math.random() * SAMPLE_LOCATIONS.length);
  return { ...SAMPLE_LOCATIONS[randomIndex] };
}

/**
 * Get all test scenarios for login
 */
export function getAllLoginScenarios(): TestUser[] {
  return [
    ...TEST_USERS,
    ...EMPTY_FIELD_SCENARIOS.map(cred => ({
      credentials: cred,
      expectedResult: 'failure' as const,
      errorMessage: 'Required'
    })),
    ...SPECIAL_CHARACTER_SCENARIOS.map(cred => ({
      credentials: cred,
      expectedResult: 'failure' as const,
      errorMessage: 'Invalid credentials'
    }))
  ];
}

/**
 * Get test data summary
 */
export function getTestDataSummary(): {
  loginScenarios: number;
  employees: number;
  leaveRequests: number;
  jobTitles: number;
  departments: number;
  locations: number;
} {
  return {
    loginScenarios: getAllLoginScenarios().length,
    employees: SAMPLE_EMPLOYEES.length,
    leaveRequests: SAMPLE_LEAVE_REQUESTS.length,
    jobTitles: SAMPLE_JOB_TITLES.length,
    departments: SAMPLE_DEPARTMENTS.length,
    locations: SAMPLE_LOCATIONS.length
  };
}

// ===== CONSTANTS =====

/**
 * Common test constants
 */
export const TEST_CONSTANTS = {
  DEFAULT_TIMEOUT: 30000,
  SHORT_TIMEOUT: 5000,
  LONG_TIMEOUT: 60000,
  RETRY_COUNT: 3,
  WAIT_DELAY: 1000,
  
  // OrangeHRM specific
  LEAVE_TYPES: ['Annual', 'Casual', 'Medical', 'Maternity', 'Personal'],
  MARITAL_STATUS: ['Single', 'Married', 'Divorced', 'Widowed'],
  GENDER: ['Male', 'Female'],
  
  // Error messages
  ERROR_MESSAGES: {
    INVALID_CREDENTIALS: 'Invalid credentials',
    REQUIRED_FIELD: 'Required',
    INVALID_EMAIL: 'Expected format: admin@example.com',
    INVALID_DATE: 'Should be a valid date in yyyy-mm-dd format'
  }
} as const;