export const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: 'Computer Science', description: 'Programming, Algorithms, AI, and Software Engineering' },
  { id: 'cat-2', name: 'Fiction', description: 'Literary fiction, novels, and narrative stories' },
  { id: 'cat-3', name: 'Science & Nature', description: 'Physics, Astronomy, Biology, and Natural sciences' },
  { id: 'cat-4', name: 'History & Civilization', description: 'World history, ancient civilizations, and biographies' },
  { id: 'cat-5', name: 'Business & Economics', description: 'Management, Entrepreneurship, and Financial systems' },
  { id: 'cat-6', name: 'Self-Help & Psychology', description: 'Personal growth, behavioral psychology, and wellness' },
]

export const INITIAL_BOOKS = [
  {
    id: 'b-1',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    publisher: 'Prentice Hall',
    category: 'Computer Science',
    publishedYear: 2008,
    totalCopies: 8,
    availableCopies: 5,
    coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=600&q=80',
    description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code.'
  },
  {
    id: 'b-2',
    title: 'The Pragmatic Programmer: Your Journey To Mastery',
    author: 'David Thomas, Andrew Hunt',
    isbn: '978-0135957059',
    publisher: 'Addison-Wesley',
    category: 'Computer Science',
    publishedYear: 2019,
    totalCopies: 6,
    availableCopies: 4,
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    description: 'The Pragmatic Programmer is one of those rare tech books you\'ll read, re-read, and read again over the years. Whether you\'re new to the field or an experienced practitioner, you\'ll come away each time with new insights.'
  },
  {
    id: 'b-3',
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
    isbn: '978-0201633610',
    publisher: 'Addison-Wesley',
    category: 'Computer Science',
    publishedYear: 1994,
    totalCopies: 5,
    availableCopies: 2,
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    description: 'Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions to commonly occurring design problems.'
  },
  {
    id: 'b-4',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0446310786',
    publisher: 'J.B. Lippincott & Co.',
    category: 'Fiction',
    publishedYear: 1960,
    totalCopies: 10,
    availableCopies: 7,
    coverImage: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80',
    description: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it, exploring compassion and moral courage.'
  },
  {
    id: 'b-5',
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    isbn: '978-0553380163',
    publisher: 'Bantam Books',
    category: 'Science & Nature',
    publishedYear: 1988,
    totalCopies: 7,
    availableCopies: 4,
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    description: 'A landmark volume in science writing by one of the great minds of our time, exploring profound questions about the universe, black holes, and the nature of time.'
  },
  {
    id: 'b-6',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    isbn: '978-0062316097',
    publisher: 'Harper',
    category: 'History & Civilization',
    publishedYear: 2014,
    totalCopies: 9,
    availableCopies: 6,
    coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80',
    description: 'From a renowned historian comes a groundbreaking narrative of humanity\'s creation and evolution that explores the ways in which biology and history have defined us.'
  },
  {
    id: 'b-7',
    title: 'Atomic Habits: An Easy & Proven Way to Build Good Habits',
    author: 'James Clear',
    isbn: '978-0735211292',
    publisher: 'Avery',
    category: 'Self-Help & Psychology',
    publishedYear: 2018,
    totalCopies: 12,
    availableCopies: 8,
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
    description: 'No matter your goals, Atomic Habits offers a proven framework for improving every day with actionable insights from biology, psychology, and neuroscience.'
  },
  {
    id: 'b-8',
    title: 'Zero to One: Notes on Startups, or How to Build the Future',
    author: 'Peter Thiel, Blake Masters',
    isbn: '978-0804139298',
    publisher: 'Crown Business',
    category: 'Business & Economics',
    publishedYear: 2014,
    totalCopies: 5,
    availableCopies: 3,
    coverImage: 'https://images.unsplash.com/photo-1507842229451-7f01be7fe802?auto=format&fit=crop&w=600&q=80',
    description: 'The great secret of our time is that there are still uncharted frontiers to explore and new inventions to create.'
  }
]

export const INITIAL_MEMBERS = [
  {
    id: 'mem-1',
    membershipId: 'LIB-2024-001',
    fullName: 'Alexander Wright',
    email: 'alex.wright@example.com',
    mobileNumber: '+1 555-019-2834',
    address: '742 Evergreen Terrace, Springfield, IL',
    membershipDate: '2024-01-15',
    status: 'Active'
  },
  {
    id: 'mem-2',
    membershipId: 'LIB-2024-002',
    fullName: 'Sophia Martinez',
    email: 'sophia.m@example.com',
    mobileNumber: '+1 555-014-8821',
    address: '1204 Blossom Hill Rd, San Jose, CA',
    membershipDate: '2024-02-10',
    status: 'Active'
  },
  {
    id: 'mem-3',
    membershipId: 'LIB-2024-003',
    fullName: 'David Chen',
    email: 'd.chen@example.com',
    mobileNumber: '+1 555-017-3490',
    address: '88 King Street East, Toronto, ON',
    membershipDate: '2024-03-01',
    status: 'Active'
  },
  {
    id: 'mem-4',
    membershipId: 'LIB-2024-004',
    fullName: 'Emma Watson-Smith',
    email: 'emma.ws@example.com',
    mobileNumber: '+1 555-012-7643',
    address: '45 Queensgate Mews, London, UK',
    membershipDate: '2024-03-22',
    status: 'Active'
  },
  {
    id: 'mem-5',
    membershipId: 'LIB-2024-005',
    fullName: 'Lucas Oliveira',
    email: 'lucas.oliveira@example.com',
    mobileNumber: '+1 555-018-9902',
    address: '320 Ocean Drive, Miami, FL',
    membershipDate: '2024-04-05',
    status: 'Active'
  }
]

export const INITIAL_ISSUES = [
  {
    id: 'iss-1',
    bookId: 'b-1',
    bookTitle: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    memberId: 'mem-1',
    memberName: 'Alexander Wright',
    membershipId: 'LIB-2024-001',
    issueDate: '2026-10-01',
    dueDate: '2026-10-15',
    returnDate: null,
    status: 'Overdue' // past due date
  },
  {
    id: 'iss-2',
    bookId: 'b-3',
    bookTitle: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    memberId: 'mem-2',
    memberName: 'Sophia Martinez',
    membershipId: 'LIB-2024-002',
    issueDate: '2026-10-18',
    dueDate: '2026-11-01',
    returnDate: null,
    status: 'Issued'
  },
  {
    id: 'iss-3',
    bookId: 'b-5',
    bookTitle: 'A Brief History of Time',
    memberId: 'mem-3',
    memberName: 'David Chen',
    membershipId: 'LIB-2024-003',
    issueDate: '2026-09-10',
    dueDate: '2026-09-24',
    returnDate: '2026-09-22',
    status: 'Returned'
  },
  {
    id: 'iss-4',
    bookId: 'b-7',
    bookTitle: 'Atomic Habits: An Easy & Proven Way to Build Good Habits',
    memberId: 'mem-4',
    memberName: 'Emma Watson-Smith',
    membershipId: 'LIB-2024-004',
    issueDate: '2026-10-05',
    dueDate: '2026-10-19',
    returnDate: null,
    status: 'Overdue'
  }
]

export const INITIAL_FINES = [
  {
    id: 'fine-1',
    issueId: 'iss-1',
    memberId: 'mem-1',
    memberName: 'Alexander Wright',
    bookTitle: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    dueDate: '2026-10-15',
    overdueDays: 8,
    amount: 16,
    status: 'Unpaid',
    dateRecorded: '2026-10-16'
  },
  {
    id: 'fine-2',
    issueId: 'iss-4',
    memberId: 'mem-4',
    memberName: 'Emma Watson-Smith',
    bookTitle: 'Atomic Habits: An Easy & Proven Way to Build Good Habits',
    dueDate: '2026-10-19',
    overdueDays: 4,
    amount: 8,
    status: 'Unpaid',
    dateRecorded: '2026-10-20'
  },
  {
    id: 'fine-3',
    issueId: 'iss-old-1',
    memberId: 'mem-2',
    memberName: 'Sophia Martinez',
    bookTitle: 'Sapiens: A Brief History of Humankind',
    dueDate: '2026-08-10',
    overdueDays: 3,
    amount: 6,
    status: 'Paid',
    dateRecorded: '2026-08-13'
  }
]

export const INITIAL_ACTIVITIES = [
  { id: 'act-1', type: 'issue', title: 'Book Issued', desc: '"Design Patterns" issued to Sophia Martinez', time: '5 hours ago' },
  { id: 'act-2', type: 'member', title: 'New Member', desc: 'Lucas Oliveira registered as active member', time: 'Yesterday' },
  { id: 'act-3', type: 'fine', title: 'Fine Paid', desc: '$6.00 paid by Sophia Martinez', time: '2 days ago' },
  { id: 'act-4', type: 'return', title: 'Book Returned', desc: '"A Brief History of Time" returned by David Chen', time: '3 days ago' },
]
