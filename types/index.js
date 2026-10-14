/**
 * @title Shared data types (JSDoc typedefs)
 * @notice Every shape that crosses the Express ↔ Next boundary is declared once
 * @notice here and referenced with `import('@/types').Name` in JSDoc tags.
 * @dev The frontend is plain JavaScript, so typedefs (not a `.ts` file) are the
 * @dev single source of truth for editor hints and documentation.
 */

/**
 * @typedef {object} Admin
 * @property {string} id Admin row id (admins table namespace).
 * @property {string} email Admin email, used as the login identifier.
 * @property {string} name Display name shown in the top bar.
 */

/**
 * @typedef {object} LoginResponse
 * @property {'ok'} status Backend envelope status.
 * @property {Admin} admin Public admin shape (never contains the password hash).
 * @property {string} token Signed JWT — `{ sub, role, kind: 'admin'|'user' }`.
 */

/**
 * @typedef {object} AiModel
 * @property {string} id Registry row id.
 * @property {string} modelId Provider-facing model id (e.g. `openai:gpt-4o-mini`).
 * @property {string} name Display name for the model selector.
 * @property {number} inputPrice USD per 1M input tokens.
 * @property {number} outputPrice USD per 1M output tokens.
 * @property {number|null} cacheReadPrice USD per 1M cached-read tokens.
 * @property {boolean} isActive False hides the model from the public selector.
 * @property {string} createdAt ISO timestamp.
 * @property {string} updatedAt ISO timestamp.
 */

/**
 * @typedef {'PENIPUAN' | 'BARANG_PALSU' | 'BARANG_TIDAK_SESUAI' | 'HARGA_MENYESATKAN' | 'KONTEN_TIDAK_PANTAS' | 'SPAM' | 'LAINNYA'} ReportCategory
 */

/**
 * @typedef {'NONE' | 'WARNING' | 'DELETE_PRODUCT' | 'BAN_USER'} ReportAction
 */

/**
 * @typedef {object} Report
 * @property {string} id Report row id.
 * @property {string} reportNo Human-readable number (`RPT-YYYYMMDD-XXXX`).
 * @property {string} reporterId User id of the reporter.
 * @property {string|null} reportedUserId Accused user id, when the report targets a user.
 * @property {string|null} reportedProductId Accused product id, when it targets a listing.
 * @property {ReportCategory} category Report category.
 * @property {string} description Reporter's narrative.
 * @property {string[]} evidenceUrls Up to 8 validated evidence URLs.
 * @property {'PENDING' | 'IN_REVIEW' | 'RESOLVED' | 'REJECTED'} status Workflow state.
 * @property {ReportAction} action Enforcement applied during review.
 * @property {string|null} actionNote Moderator note.
 * @property {string|null} reviewedBy Reviewer id (null for dashboard-only admins).
 * @property {string|null} reviewedAt ISO timestamp of the decision.
 * @property {string} createdAt ISO timestamp.
 * @property {string} updatedAt ISO timestamp.
 */

/**
 * @typedef {object} Verification
 * @property {string} id Verification row id.
 * @property {string} userId Applicant user id.
 * @property {string} namaLengkap Full name printed on the student card.
 * @property {string} nim Student registration number.
 * @property {string} universitas University name.
 * @property {string} programStudi Study program.
 * @property {string} ktmImageUrl Student card scan URL (http/https only).
 * @property {'PENDING' | 'APPROVED' | 'REJECTED'} status Review state.
 * @property {'NONE' | 'APPROVE' | 'REJECT'} action Decision recorded by the admin.
 * @property {string|null} actionNote Moderator note.
 * @property {string|null} rejectionReason Required reason when rejected.
 * @property {string|null} reviewedBy Reviewer id (null for dashboard-only admins).
 * @property {string|null} reviewedAt ISO timestamp of the decision.
 * @property {string} createdAt ISO timestamp.
 * @property {string} updatedAt ISO timestamp.
 * @property {{ username: string, email: string }} [user] Joined applicant identity for admins.
 */

/**
 * @typedef {'AKUN' | 'PRODUK' | 'CHAT' | 'VERIFIKASI' | 'LAPORAN' | 'LAINNYA'} TicketCategory
 */

/**
 * @typedef {object} SupportTicket
 * @property {string} id Ticket row id.
 * @property {string} ticketNo Human-readable number (`KSP-YYYYMMDD-XXXX`).
 * @property {string} userId Owner user id.
 * @property {TicketCategory} category Ticket category.
 * @property {string} subject Short subject line.
 * @property {string} description Opening message body.
 * @property {'ACTIVE' | 'CLOSED'} status Ticket lifecycle state.
 * @property {string|null} lastMessageAt ISO timestamp of the latest message.
 * @property {string} createdAt ISO timestamp.
 * @property {string} updatedAt ISO timestamp.
 */

/**
 * @typedef {object} SupportMessage
 * @property {string} id Message row id.
 * @property {string} ticketId Parent ticket id.
 * @property {string|null} senderId User id (null when a dashboard-only admin replied).
 * @property {'BUYER' | 'SELLER' | 'ADMIN' | 'SUPER_ADMIN'} senderRole Role snapshot at send time.
 * @property {string|null} senderName Name snapshot, filled for dashboard admins.
 * @property {string} text Message body.
 * @property {string|null} imageUrl Optional attachment URL.
 * @property {boolean} isInternal True for admin-only notes.
 * @property {string} createdAt ISO timestamp.
 */

/**
 * @typedef {SupportTicket & { messages: SupportMessage[] }} SupportTicketDetail
 */

/**
 * @typedef {object} DashboardStats
 * @property {number} pendingReports Reports waiting for a moderator (`status=PENDING`).
 * @property {number} pendingVerifications Student cards waiting for review (`status=PENDING`).
 * @property {number} openTickets Support tickets still `ACTIVE`.
 * @property {number} activeModels Models exposed in the public selector.
 */

/**
 * @typedef {object} ApiErrorPayload
 * @property {'error'} status Backend envelope status.
 * @property {string} code SCREAMING_SNAKE error code (e.g. `INVALID_CREDENTIALS`).
 * @property {string} message Human-readable message from the backend error catalog.
 * @property {unknown} [details] Optional machine-readable detail.
 */

/**
 * @typedef {object} ToolUsage
 * @property {string} tool Tool name, e.g. `search_products`.
 * @property {number} count Invocations inside the selected window.
 * @property {number} percent Share of all invocations in the window (1 decimal).
 * @property {number} successRate Share of calls that did not fail (1 decimal).
 * @property {number|null} avgLatencyMs Mean wall time in milliseconds.
 */

/**
 * @typedef {object} ToolStats
 * @property {number} total Invocations inside the selected window.
 * @property {number} succeeded Calls with status SUCCESS.
 * @property {number} failed Calls with status FAILED.
 * @property {number} timeout Calls with status TIMEOUT.
 * @property {number} successRate `succeeded / total` in percent (1 decimal).
 * @property {number|null} avgLatencyMs Mean latency across all calls.
 * @property {string|null} peakWindow Busiest 3-hour window, e.g. `19:00 - 22:00 WIB`.
 * @property {ToolUsage[]} tools Ranked tool list (top 20 by usage).
 */

export {};
