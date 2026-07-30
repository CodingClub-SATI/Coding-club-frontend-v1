# This file documents every API endpoint that actually exists in this
# backend right now, and only that – if it's not implemented, it's not in
# here (see API_GUIDE.md for anything still planned/pending).

# Admin auth (applies to every route marked "Admin"):
#   1. POST /api/auth/login with { username, password }. On success the
#      server sets an HttpOnly `admin_token` cookie (a signed JWT – see
#      controllers/authController.js). There is no token in the response
#      body ({ success: true } only) – the cookie itself is the credential.
#   2. Send that cookie on every subsequent admin request:
#        curl -c cookies.txt -X POST http://.../api/auth/login \
#          -H "Content-Type: application/json" \
#          -d '{"username":"admin","password":"..."}'
#        curl -b cookies.txt http://.../api/some-admin-route
#      In a browser this is automatic as long as requests are made with
#      credentials: 'include' (fetch) / withCredentials: true (axios) and
#      the backend's CORS config allows the calling origin (see
#      FRONTEND_URLS below) – being httpOnly, the cookie is never
#      readable or attachable by frontend JS directly.
#   3. POST /api/auth/logout clears the cookie.
#
#   Two different failure modes exist, on purpose:
#     - "Soft" gate (e.g. GET /api/events?includeArchived=true): a missing
#       or invalid session is never rejected, the extra behavior is just
#       not granted and the request falls back to the public response.
#       Used wherever the base route is otherwise public.
#     - "Hard" gate (e.g. all of /api/contacts, all writes): a missing or
#       invalid session gets a flat 401. Used wherever there is no safe
#       public fallback response (an inbox, a write/delete).

# Deployment:
#   - Set FRONTEND_URLS (comma-separated, e.g. your deployed Vercel URL) –
#     without it, CORS only allows localhost and the deployed frontend's
#     requests will be blocked by the browser. Since admin auth now rides
#     on a cookie rather than a header, this CORS allowlist is also your
#     CSRF boundary – keep it to real frontend origins, never a wildcard.
#   - Set JWT_SECRET to a real random value (not the .env.dev placeholder)
#     – this signs the admin_token cookie. Login fails outright if it's
#     unset, rather than falling back to a guessable default.
#   - Set ADMIN_PASSWORD – used once, to seed the initial admin account
#     on first boot if the Admin collection is still empty (see index.js).

# ============================ SYSTEM ============================

GET /ping: #public
Output:
Success: "pong" + http code 200

# ============================ AUTH ==============================

POST /api/auth/login: #public
Input: { username, password }
Output:
Success: { success: true } + http code 200 (Sets HttpOnly admin_token cookie)
Failed: { message: "Invalid credentials" } + http code 401

POST /api/auth/logout: [Admin]
Output:
Success: { success: true } + http code 200 (Clears admin_token cookie)

GET /api/auth/verify: [Admin]
Output:
Success: { valid: true } + http code 200
Failed: { message: "Unauthorized" } + http code 401

POST /api/auth/password/otp: [Admin]
Output:
Success: { success: true, message: "OTP Sent" } + http code 200

PUT /api/auth/password: [Admin]
Input: { currentPassword, newPassword, otp }
Output:
Success: { success: true, message: "Password updated successfully." } + http code 200
Failed [Invalid OTP]: http code 400
Failed [Incorrect current password]: http code 401

# ============================= EVENTS =============================
# `type` and `status` are enums now (were unconstrained strings):
#   type     one of: Workshop | Hackathon | Competition | Seminar
#   status   one of: upcoming | completed

POST /api/events: [Admin]
Input:
-H "Content-Type: application/json" \
-b cookies.txt \
     -d '{
title:{ type:String, required:true },
type:{ type:String, required:true, enum: Workshop|Hackathon|Competition|Seminar },
status:{ type:String, required:true, enum: upcoming|completed },
featured:{ type:Boolean, default:false },
archived:{ type:Boolean, default:false },
date:{ type:String }, # display text, e.g. "Aug 10, 2026"
time:{ type:String }, # display text, e.g. "10:00 AM"
reportingTime:{ type:String },
venue:{ type:String },
description:{ type:String },
logoUrl:{ type:String },
bannerUrl:{ type:String },
tags:[String],
registrationLink:{ type:String },
viewCount:{ type:Number, default:0 },
registerClickCount:{ type:Number, default:0 }
     }'
Output:
Success: saved event (incl. server-generated id) + http code 201

GET /api/events:
Input: none required. Optional query param ?includeArchived=true
Behavior:
- Default (no param, or any non-admin request): only events where
  archived is not true are returned.
- ?includeArchived=true only has effect when the request also
  carries a valid admin token.
Output:
event Object array or Pagination Envelope { data, page, pageSize, total, totalPages }

PUT /api/events/$id: [Admin]
Input: -b cookies.txt -d '{ same fields as POST, all optional }'
Output:
Success: updated event object + http code 200

DELETE /api/events/$id: [Admin]
Output:
Success: removed event object + http code 200

# ============================ PROJECTS ============================

GET /api/projects: #public
Output:
project Object array or Pagination Envelope { data, page, totalPages }

POST /api/projects: [Admin]
Input: -d '{ title, team, members, description, github, category (all required), tech, stars, forks, demo, achieved (optional) }'
Output:
Success: created project (id auto-generated) + http code 201

PUT /api/projects/$id: [Admin]
Output:
Success: updated project + http code 200

DELETE /api/projects/$id: [Admin]
Output:
Success: removed project + http code 200

# ============================= GALLERY =============================

GET /api/gallery: #public
Output:
album Object array or Pagination Envelope

GET /api/gallery/highlights: #public
Output:
Array of up to 12 featured photos across all albums.

POST /api/gallery: [Admin]
Input: -d '{ title (required), date, cover }' #creates an empty album
Output: created album (id auto-generated) + http code 201

PUT /api/gallery/$albumId: [Admin]
Input: -d '{ title, date, cover }' #metadata only
Output: updated album + http code 200 / 404 if not found

DELETE /api/gallery/$albumId: [Admin]
Output: removed album + http code 200 / 404 if not found

POST /api/gallery/$albumId/photos: [Admin]
Input: -d '{ photos: [ { src (required), caption, featured } ] }' #bulk add
Output: updated album + http code 201 / 404 if album not found

DELETE /api/gallery/$albumId/photos/$photoId: [Admin]
Output: { message } + http code 200 / 404 if album or photo not found

PUT /api/gallery/$albumId/photos/$photoId: [Admin]
Input: -d '{ src, caption, featured }'
Output:
Success: updated photo + http code 200
Failed [turning featured on would exceed cap of 10]: http code 409

# =============================== TEAM ===============================

GET /api/team/public: #public
Output:
{ batches: [...], leadership: { convenors: [...], coConvenors: [...], departmentLeads: [...] } }

GET /api/team/admin/batches: [Admin]
Output:
{ batches: [ { batch: "2025-26", archived: false, members: [...], memberCount: X } ] }

POST /api/team/admin/batches: [Admin]
Input: -d '{ batch (required, e.g. "2025-26") }'
Output: Success: created batch year + http code 201

PATCH /api/team/admin/batches/$batch: [Admin]
Input: -d '{ archived: true|false }'
Output: updated batch year + http code 200 / 404 if year not found

DELETE /api/team/admin/batches/$batch: [Admin]
Output: removed batch year + http code 200 / 400 if members exist

POST /api/team/admin/members: [Admin]
Input: -d '{ fullName (required), batch (required), specialization, skills, github, linkedin, instagram, x, avatarUrl }'
Output: created member (id auto-generated) + http code 201

PATCH /api/team/admin/members/$id: [Admin]
Input: partial member fields
Output: updated member + http code 200

DELETE /api/team/admin/members/$id: [Admin]
Output: { message } + http code 200

GET /api/team/admin/leadership: [Admin]
Output: { convenors: [ids], coConvenors: [ids], departmentHeads: { Dept: id } }

PUT /api/team/admin/leadership: [Admin]
Input: -d '{ convenors: [], coConvenors: [], departmentHeads: {} }'
Output: updated leadership document + http code 200

# ============================= CONTACTS =============================

POST /api/contacts: #public
Input: -d '{ name, email, requestType (enum), message (all required) }'
Output: Success: { message, id } + http code 201

GET /api/contacts: [Admin, hard-gated]
Output: contact Object array, newest first

PUT /api/contacts/$id: [Admin, hard-gated]
Input: -d '{ status: "New" | "Read" | "Archived" }'
Output: updated contact + http code 200

DELETE /api/contacts/$id: [Admin, hard-gated]
Output: removed contact + http code 200

# ============================= UPDATES =============================

GET /api/updates: #public
Output: update Object array (up to 20, newest first)

POST /api/updates: [Admin]
Input: -d '{ message (required), publishDate }'
Output: created update (id auto-generated) + http code 201

PUT /api/updates/$id: [Admin]
Input: -d '{ message, publishDate }'
Output: Success: updated update object + http code 200

DELETE /api/updates/$id: [Admin]
Output: removed update + http code 200

# ============================== STATS ==============================

GET /api/stats: #public
Output: { totalEvents, activeMembers, studentProjects, workshops }

GET /api/admin/stats: [Admin]
Output: { totalEvents, totalProjects, newContactMessages, totalMembers }

# =========================== CONTACT INFO ===========================

GET /api/contact-info: #public
Output: {
  email, phone, youtube,
  github: { url, showOnSidebar, showOnFooter },
  instagram: { url, showOnSidebar, showOnFooter },
  linkedin: { url, showOnSidebar, showOnFooter },
  x: { url, showOnSidebar, showOnFooter },
  discord: { url, showOnSidebar, showOnFooter },
  whatsapp: { url, showOnSidebar, showOnFooter }
}
Note: email, phone, and youtube are always shown as plain links (youtube in
the footer's Resources list). Each social platform's showOnSidebar /
showOnFooter flags independently control whether its icon appears on the
floating social sidebar and/or the footer's icon row. The contact page
always shows every social platform that has a URL set, regardless of flags.

PUT /api/contact-info: [Admin]
Input: partial contact info fields (same shape as above)
Output: updated contact info object + http code 200

# ============================== UPLOAD ==============================

POST /api/upload: [Admin]
Input: multipart/form-data with "image" file (Max 2MB, JPEG/PNG/WEBP/GIF)
Output:
Success: { url: "https://files.catbox.moe/..." } + http code 200
Failed: { message: "..." } + http code 400

DELETE /api/upload: [Admin]
Input: -d '{ url: "https://files.catbox.moe/..." }'
Output:
Success: { message: "Image successfully deleted from Catbox." } + http code 200