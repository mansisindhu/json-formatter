export interface SampleJson {
  name: string;
  description: string;
  data: unknown;
}

export const sampleJsonData: SampleJson[] = [
  {
    name: "Basic Object",
    description: "Simple key-value pairs",
    data: {
      name: "John Doe",
      age: 30,
      email: "john@example.com",
      isActive: true,
      balance: 1250.75,
    },
  },
  {
    name: "Nested Object",
    description: "Deeply nested structure",
    data: {
      company: "TechCorp",
      departments: {
        engineering: {
          teams: {
            frontend: {
              lead: "Alice",
              members: ["Bob", "Charlie", "Diana"],
              projects: {
                current: "Dashboard Redesign",
                upcoming: ["Mobile App", "API v2"],
              },
            },
            backend: {
              lead: "Eve",
              members: ["Frank", "Grace"],
            },
          },
        },
        marketing: {
          budget: 50000,
          campaigns: ["Summer Sale", "Product Launch"],
        },
      },
    },
  },
  {
    name: "Array of Objects",
    description: "List of users with details",
    data: [
      {
        id: 1,
        name: "Alice Johnson",
        email: "alice@example.com",
        role: "admin",
        permissions: ["read", "write", "delete"],
        lastLogin: "2024-01-15T10:30:00Z",
      },
      {
        id: 2,
        name: "Bob Smith",
        email: "bob@example.com",
        role: "editor",
        permissions: ["read", "write"],
        lastLogin: "2024-01-14T15:45:00Z",
      },
      {
        id: 3,
        name: "Charlie Brown",
        email: "charlie@example.com",
        role: "viewer",
        permissions: ["read"],
        lastLogin: null,
      },
    ],
  },
  {
    name: "API Response",
    description: "Typical REST API response",
    data: {
      success: true,
      data: {
        users: [
          { id: 1, username: "user1", status: "active" },
          { id: 2, username: "user2", status: "inactive" },
        ],
        pagination: {
          currentPage: 1,
          totalPages: 10,
          itemsPerPage: 20,
          totalItems: 195,
        },
      },
      meta: {
        requestId: "abc-123-def-456",
        timestamp: "2024-01-15T12:00:00Z",
        version: "2.0",
      },
    },
  },
  {
    name: "E-commerce Product",
    description: "Product with variants",
    data: {
      id: "PROD-001",
      name: "Classic Cotton T-Shirt",
      description: "Comfortable 100% cotton t-shirt, perfect for everyday wear.",
      price: 29.99,
      currency: "USD",
      inStock: true,
      categories: ["Clothing", "T-Shirts", "Casual"],
      variants: [
        { size: "S", color: "White", sku: "TS-W-S", stock: 25 },
        { size: "M", color: "White", sku: "TS-W-M", stock: 42 },
        { size: "L", color: "White", sku: "TS-W-L", stock: 18 },
        { size: "S", color: "Black", sku: "TS-B-S", stock: 30 },
        { size: "M", color: "Black", sku: "TS-B-M", stock: 55 },
        { size: "L", color: "Black", sku: "TS-B-L", stock: 12 },
      ],
      images: [
        { url: "https://example.com/img/ts-white.jpg", alt: "White T-Shirt" },
        { url: "https://example.com/img/ts-black.jpg", alt: "Black T-Shirt" },
      ],
      ratings: {
        average: 4.5,
        count: 128,
        distribution: { "5": 80, "4": 30, "3": 10, "2": 5, "1": 3 },
      },
    },
  },
  {
    name: "Configuration",
    description: "App configuration file",
    data: {
      app: {
        name: "MyApp",
        version: "1.2.3",
        environment: "production",
      },
      database: {
        host: "db.example.com",
        port: 5432,
        name: "myapp_prod",
        ssl: true,
        pool: {
          min: 5,
          max: 20,
          idleTimeout: 30000,
        },
      },
      cache: {
        enabled: true,
        ttl: 3600,
        provider: "redis",
        connection: {
          host: "cache.example.com",
          port: 6379,
        },
      },
      features: {
        darkMode: true,
        notifications: true,
        analytics: false,
        betaFeatures: ["newDashboard", "advancedSearch"],
      },
      logging: {
        level: "info",
        format: "json",
        outputs: ["console", "file"],
      },
    },
  },
  {
    name: "GeoJSON",
    description: "Geographic data format",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            name: "Central Park",
            city: "New York",
            area_sqkm: 3.41,
          },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-73.9654, 40.7829],
                [-73.9496, 40.7829],
                [-73.9496, 40.7649],
                [-73.9654, 40.7649],
                [-73.9654, 40.7829],
              ],
            ],
          },
        },
        {
          type: "Feature",
          properties: {
            name: "Empire State Building",
            city: "New York",
            height_m: 443,
          },
          geometry: {
            type: "Point",
            coordinates: [-73.9857, 40.7484],
          },
        },
      ],
    },
  },
  {
    name: "Mixed Types",
    description: "All JSON data types",
    data: {
      string: "Hello, World!",
      number: 42,
      float: 3.14159,
      negative: -100,
      scientific: 1.23e10,
      boolTrue: true,
      boolFalse: false,
      nullValue: null,
      emptyString: "",
      emptyArray: [],
      emptyObject: {},
      array: [1, "two", true, null, { nested: "value" }],
      unicode: "Hello 世界 🌍 مرحبا",
      escaped: "Line 1\nLine 2\tTabbed",
      specialChars: "Quote: \" Backslash: \\ Slash: /",
    },
  },
];
