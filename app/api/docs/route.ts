import { NextResponse } from 'next/server';

/**
 * GET /api/docs
 * Returns OpenAPI 3.0 documentation for the Contest Tracker API
 */
export async function GET(): Promise<NextResponse> {
  const docs = {
    openapi: '3.0.0',
    info: {
      title: 'Contest Tracker API',
      description: 'Aggregates programming contests from multiple platforms (Codeforces, LeetCode, CodeChef, AtCoder, etc.)',
      version: '1.0.0',
      contact: {
        name: 'API Support',
        url: 'https://github.com/rajeshuchil/ContestHub'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: '/api',
        description: 'API Server'
      }
    ],
    tags: [
      {
        name: 'contests',
        description: 'Contest data operations'
      },
      {
        name: 'health',
        description: 'Health check and monitoring'
      },
      {
        name: 'webhooks',
        description: 'Webhook management'
      },
      {
        name: 'history',
        description: 'Historical data and analytics'
      },
      {
        name: 'export',
        description: 'Data export functionality'
      }
    ],
    paths: {
      '/contests': {
        get: {
          tags: ['contests'],
          summary: 'Get contests',
          description: 'Fetches and returns paginated, filtered, and sorted contest data from multiple platforms',
          operationId: 'getContests',
          parameters: [
            {
              name: 'platform',
              in: 'query',
              description: 'Filter by single platform name (case-insensitive)',
              required: false,
              schema: {
                type: 'string',
                example: 'Codeforces'
              }
            },
            {
              name: 'platforms',
              in: 'query',
              description: 'Filter by multiple platforms (comma-separated)',
              required: false,
              schema: {
                type: 'string',
                example: 'codeforces,leetcode,codechef'
              }
            },
            {
              name: 'status',
              in: 'query',
              description: 'Filter by contest status',
              required: false,
              schema: {
                type: 'string',
                enum: ['upcoming', 'ongoing', 'ended'],
                example: 'upcoming'
              }
            },
            {
              name: 'startDate',
              in: 'query',
              description: 'Filter contests starting from this date (ISO 8601)',
              required: false,
              schema: {
                type: 'string',
                format: 'date-time',
                example: '2026-01-27'
              }
            },
            {
              name: 'endDate',
              in: 'query',
              description: 'Filter contests ending before this date (ISO 8601)',
              required: false,
              schema: {
                type: 'string',
                format: 'date-time',
                example: '2026-02-10'
              }
            },
            {
              name: 'search',
              in: 'query',
              description: 'Search in contest name and platform',
              required: false,
              schema: {
                type: 'string',
                example: 'round'
              }
            },
            {
              name: 'sortBy',
              in: 'query',
              description: 'Sort field',
              required: false,
              schema: {
                type: 'string',
                enum: ['startTime', 'duration', 'platform', 'name'],
                default: 'startTime'
              }
            },
            {
              name: 'order',
              in: 'query',
              description: 'Sort order',
              required: false,
              schema: {
                type: 'string',
                enum: ['asc', 'desc'],
                default: 'asc'
              }
            },
            {
              name: 'page',
              in: 'query',
              description: 'Page number (1-based)',
              required: false,
              schema: {
                type: 'integer',
                minimum: 1,
                default: 1
              }
            },
            {
              name: 'limit',
              in: 'query',
              description: 'Items per page',
              required: false,
              schema: {
                type: 'integer',
                minimum: 1,
                maximum: 100,
                default: 10
              }
            }
          ],
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Contest'
                        }
                      },
                      meta: {
                        $ref: '#/components/schemas/Meta'
                      }
                    }
                  },
                  example: {
                    data: [
                      {
                        id: 'codeforces-1234',
                        platform: 'Codeforces',
                        name: 'Educational Round #123',
                        startTime: '2026-01-27T14:35:00.000Z',
                        duration: 7200,
                        url: 'https://codeforces.com/contest/1234',
                        status: 'upcoming'
                      }
                    ],
                    meta: {
                      total: 42,
                      page: 1,
                      limit: 10,
                      totalPages: 5,
                      filters: {
                        platform: null,
                        status: 'upcoming',
                        dateRange: { start: null, end: null },
                        search: null
                      },
                      sorting: { sortBy: 'startTime', order: 'asc' },
                      stats: {
                        total: 42,
                        byPlatform: { Codeforces: 15, LeetCode: 12 },
                        byStatus: { upcoming: 35, ongoing: 2, ended: 5 }
                      },
                      performance: {
                        responseTime: '45ms',
                        fetchTime: '12ms',
                        cached: true
                      },
                      requestId: 'req_1234567890_abc123'
                    }
                  }
                }
              }
            },
            '400': {
              description: 'Validation error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      },
      '/contests/ical': {
        get: {
          tags: ['export'],
          summary: 'Export contests as iCalendar',
          description: 'Returns contests in iCalendar (.ics) format for calendar integration',
          operationId: 'exportIcal',
          parameters: [
            {
              name: 'platform',
              in: 'query',
              description: 'Filter by platform',
              required: false,
              schema: {
                type: 'string'
              }
            },
            {
              name: 'status',
              in: 'query',
              description: 'Filter by status (upcoming or ongoing)',
              required: false,
              schema: {
                type: 'string',
                enum: ['upcoming', 'ongoing']
              }
            },
            {
              name: 'limit',
              in: 'query',
              description: 'Max contests to include',
              required: false,
              schema: {
                type: 'integer',
                maximum: 200,
                default: 50
              }
            }
          ],
          responses: {
            '200': {
              description: 'iCalendar file',
              content: {
                'text/calendar': {
                  schema: {
                    type: 'string',
                    example: 'BEGIN:VCALENDAR\nVERSION:2.0\n...'
                  }
                }
              }
            }
          }
        }
      },
      '/webhooks': {
        get: {
          tags: ['webhooks'],
          summary: 'List webhooks',
          description: 'Get all registered webhooks',
          operationId: 'listWebhooks',
          responses: {
            '200': {
              description: 'List of webhooks',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      webhooks: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Webhook'
                        }
                      },
                      total: { type: 'integer' }
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['webhooks'],
          summary: 'Register webhook',
          description: 'Create a new webhook subscription',
          operationId: 'createWebhook',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['url'],
                  properties: {
                    url: {
                      type: 'string',
                      format: 'uri',
                      description: 'Webhook URL'
                    },
                    events: {
                      type: 'array',
                      items: { type: 'string', enum: ['contest.new'] },
                      default: ['contest.new']
                    },
                    platforms: {
                      type: 'array',
                      items: { type: 'string' },
                      description: 'Filter by platforms (empty = all)'
                    },
                    status: {
                      type: 'array',
                      items: { type: 'string', enum: ['upcoming', 'ongoing', 'ended'] },
                      description: 'Filter by status (empty = all)'
                    },
                    secret: {
                      type: 'string',
                      description: 'Optional secret for verification'
                    }
                  }
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Webhook created',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Webhook'
                  }
                }
              }
            }
          }
        },
        delete: {
          tags: ['webhooks'],
          summary: 'Delete webhook',
          description: 'Remove a webhook subscription',
          operationId: 'deleteWebhook',
          parameters: [
            {
              name: 'id',
              in: 'query',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            '200': {
              description: 'Webhook deleted'
            }
          }
        }
      },
      '/history': {
        get: {
          tags: ['history'],
          summary: 'Get contest history',
          description: 'Access historical contest data and analytics',
          operationId: 'getHistory',
          parameters: [
            {
              name: 'action',
              in: 'query',
              required: true,
              schema: {
                type: 'string',
                enum: ['list', 'snapshot', 'analytics']
              }
            },
            {
              name: 'snapshotId',
              in: 'query',
              description: 'Required for action=snapshot',
              schema: { type: 'string' }
            },
            {
              name: 'startDate',
              in: 'query',
              description: 'Required for action=analytics',
              schema: { type: 'string', format: 'date-time' }
            },
            {
              name: 'endDate',
              in: 'query',
              description: 'Required for action=analytics',
              schema: { type: 'string', format: 'date-time' }
            }
          ],
          responses: {
            '200': {
              description: 'History data'
            }
          }
        }
      },
      '/health': {
        get: {
          tags: ['health'],
          summary: 'Health check',
          description: 'Check API health and platform availability',
          operationId: 'healthCheck',
          responses: {
            '200': {
              description: 'API is healthy',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Health'
                  }
                }
              }
            },
            '503': {
              description: 'API is unhealthy or degraded',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Health'
                  }
                }
              }
            }
          }
        }
      }
    },
    components: {
      schemas: {
        Contest: {
          type: 'object',
          required: ['id', 'platform', 'name', 'startTime', 'duration', 'url', 'status'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique contest identifier',
              example: 'codeforces-1234'
            },
            platform: {
              type: 'string',
              description: 'Platform name',
              example: 'Codeforces'
            },
            name: {
              type: 'string',
              description: 'Contest name',
              example: 'Educational Round #123'
            },
            startTime: {
              type: 'string',
              format: 'date-time',
              description: 'Contest start time (ISO 8601)',
              example: '2026-01-27T14:35:00.000Z'
            },
            duration: {
              type: 'integer',
              description: 'Contest duration in seconds',
              example: 7200
            },
            url: {
              type: 'string',
              format: 'uri',
              description: 'Direct link to contest',
              example: 'https://codeforces.com/contest/1234'
            },
            status: {
              type: 'string',
              enum: ['upcoming', 'ongoing', 'ended'],
              description: 'Contest status',
              example: 'upcoming'
            }
          }
        },
        Meta: {
          type: 'object',
          properties: {
            total: {
              type: 'integer',
              description: 'Total number of contests (after filters)'
            },
            page: {
              type: 'integer',
              description: 'Current page number'
            },
            limit: {
              type: 'integer',
              description: 'Items per page'
            },
            totalPages: {
              type: 'integer',
              description: 'Total number of pages'
            },
            filters: {
              type: 'object',
              description: 'Applied filters'
            },
            sorting: {
              type: 'object',
              description: 'Applied sorting'
            },
            stats: {
              type: 'object',
              description: 'Contest statistics'
            },
            performance: {
              type: 'object',
              description: 'Performance metrics'
            },
            requestId: {
              type: 'string',
              description: 'Unique request identifier'
            }
          }
        },
        Health: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['healthy', 'degraded', 'unhealthy'],
              description: 'Overall API health status'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Health check timestamp'
            },
            responseTime: {
              type: 'string',
              description: 'Health check response time'
            },
            platforms: {
              type: 'object',
              description: 'Individual platform health status'
            },
            summary: {
              type: 'object',
              properties: {
                total: { type: 'integer' },
                healthy: { type: 'integer' },
                unhealthy: { type: 'integer' }
              }
            },
            api: {
              type: 'object',
              properties: {
                version: { type: 'string' },
                environment: { type: 'string' }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error type',
              example: 'Validation Error'
            },
            message: {
              type: 'string',
              description: 'Error message',
              example: 'Invalid status parameter'
            },
            details: {
              type: 'object',
              description: 'Additional error details'
            },
            requestId: {
              type: 'string',
              description: 'Request identifier for debugging'
            }
          }
        },
        Webhook: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Webhook ID' },
            url: { type: 'string', format: 'uri' },
            events: { type: 'array', items: { type: 'string' } },
            platforms: { type: 'array', items: { type: 'string' } },
            status: { type: 'array', items: { type: 'string' } },
            active: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            lastTriggered: { type: 'string', format: 'date-time', nullable: true },
            triggerCount: { type: 'integer' },
            failureCount: { type: 'integer' }
          }
        }
      }
    }
  };

  return NextResponse.json(docs, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600',
    }
  });
}
