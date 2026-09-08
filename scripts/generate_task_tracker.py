"""
Medivo Health Intelligence Platform — Comprehensive Master Task Tracker Generator
Generates a multi-sheet, beautifully styled Excel workbook with conditional formatting,
summary statistics, and categorized task tracking.
"""

import os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def create_task_tracker():
    wb = openpyxl.Workbook()
    
    # -------------------------------------------------------------------------
    # Color Palette & Styles (Medivo Clinical Blue Theme)
    # -------------------------------------------------------------------------
    PRIMARY_BLUE = "1F7FC4"
    DARK_BLUE = "0F3E62"
    LIGHT_BLUE = "EAF4FB"
    ACCENT_EMERALD = "10B981"
    ACCENT_AMBER = "F59E0B"
    ACCENT_ROSE = "EF4444"
    ACCENT_PURPLE = "8B5CF6"
    GRAY_HEADER = "1E293B"
    GRAY_LIGHT = "F8FAFC"
    BORDER_COLOR = "CBD5E1"
    
    font_family = "Segoe UI"
    
    # Fonts
    title_font = Font(name=font_family, size=16, bold=True, color="FFFFFF")
    subtitle_font = Font(name=font_family, size=11, italic=True, color="E2E8F0")
    header_font = Font(name=font_family, size=11, bold=True, color="FFFFFF")
    kpi_title_font = Font(name=font_family, size=10, bold=True, color="64748B")
    kpi_value_font = Font(name=font_family, size=20, bold=True, color="1E293B")
    section_font = Font(name=font_family, size=13, bold=True, color=DARK_BLUE)
    data_font = Font(name=font_family, size=10)
    data_bold_font = Font(name=font_family, size=10, bold=True)
    code_font = Font(name="Consolas", size=9, color="334155")
    
    # Fills
    title_fill = PatternFill(start_color=PRIMARY_BLUE, end_color=PRIMARY_BLUE, fill_type="solid")
    header_fill = PatternFill(start_color=GRAY_HEADER, end_color=GRAY_HEADER, fill_type="solid")
    sub_header_fill = PatternFill(start_color=DARK_BLUE, end_color=DARK_BLUE, fill_type="solid")
    zebra_fill = PatternFill(start_color=GRAY_LIGHT, end_color=GRAY_LIGHT, fill_type="solid")
    kpi_fill = PatternFill(start_color="F1F5F9", end_color="F1F5F9", fill_type="solid")
    
    # Priority Fills
    p0_fill = PatternFill(start_color="FEE2E2", end_color="FEE2E2", fill_type="solid") # Red
    p0_font = Font(name=font_family, size=10, bold=True, color="991B1B")
    p1_fill = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid") # Amber
    p1_font = Font(name=font_family, size=10, bold=True, color="92400E")
    p2_fill = PatternFill(start_color="E0F2FE", end_color="E0F2FE", fill_type="solid") # Blue
    p2_font = Font(name=font_family, size=10, bold=True, color="075985")
    p3_fill = PatternFill(start_color="F1F5F9", end_color="F1F5F9", fill_type="solid") # Gray
    p3_font = Font(name=font_family, size=10, bold=True, color="475569")
    
    # Status Fills
    status_done_fill = PatternFill(start_color="DCFCE7", end_color="DCFCE7", fill_type="solid") # Green
    status_done_font = Font(name=font_family, size=10, bold=True, color="166534")
    status_progress_fill = PatternFill(start_color="E0E7FF", end_color="E0E7FF", fill_type="solid") # Indigo
    status_progress_font = Font(name=font_family, size=10, bold=True, color="3730A3")
    status_pending_fill = PatternFill(start_color="FEF9C3", end_color="FEF9C3", fill_type="solid") # Yellow
    status_pending_font = Font(name=font_family, size=10, bold=True, color="854D0E")
    status_blocked_fill = PatternFill(start_color="FFE4E6", end_color="FFE4E6", fill_type="solid") # Rose
    status_blocked_font = Font(name=font_family, size=10, bold=True, color="9F1239")
    
    # Category Fills
    cat_broken_fill = PatternFill(start_color="FEE2E2", end_color="FEE2E2", fill_type="solid")
    cat_hardcoded_fill = PatternFill(start_color="FFEDD5", end_color="FFEDD5", fill_type="solid")
    cat_decision_fill = PatternFill(start_color="F3E8FF", end_color="F3E8FF", fill_type="solid")
    cat_feature_fill = PatternFill(start_color="DCFCE7", end_color="DCFCE7", fill_type="solid")
    cat_enhancement_fill = PatternFill(start_color="E0F2FE", end_color="E0F2FE", fill_type="solid")
    cat_security_fill = PatternFill(start_color="CCFBF1", end_color="CCFBF1", fill_type="solid")
    cat_infra_fill = PatternFill(start_color="F1F5F9", end_color="F1F5F9", fill_type="solid")

    thin_border_side = Side(border_style="thin", color=BORDER_COLOR)
    card_border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)
    thick_bottom = Border(bottom=Side(border_style="medium", color=PRIMARY_BLUE))

    # -------------------------------------------------------------------------
    # Comprehensive Task Database (65+ Structured Engineering Tasks)
    # -------------------------------------------------------------------------
    tasks = [
        # INFRASTRUCTURE, DOCKER & CLOUD
        {
            "id": "MED-INF-001",
            "domain": "DevOps & Cloud",
            "title": "DuckDNS Universal Multi-Subdomain & Wildcard SSL Routing",
            "category": "Infrastructure & DevOps",
            "priority": "P0 - Critical",
            "status": "Completed",
            "current_state": "Traefik router rules configured with Host rules for db, app, api, doctor, admin, main across medivo.duckdns.org and sslip.io.",
            "required_action": "Maintain production compose sync and verified Let's Encrypt automated renewal via Coolify.",
            "files": "docker-compose.production.yml, docker-compose.management.yml, docker-compose.frontends.yml, docker-compose.bff.yml",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "DevOps Pod",
            "effort": "Medium (3-5d)"
        },
        {
            "id": "MED-INF-002",
            "domain": "DevOps & Cloud",
            "title": "Universal 'www.' Alias Support Across Traefik Routers",
            "category": "Infrastructure & DevOps",
            "priority": "P1 - High",
            "status": "Completed",
            "current_state": "All 4 compose files updated with www.db, www.app, www.main, www.api, www.doctor, www.admin rules.",
            "required_action": "Redeploy containers in Coolify to apply Traefik rules.",
            "files": "docker-compose.*.yml",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "DevOps Pod",
            "effort": "Small (1-2d)"
        },
        {
            "id": "MED-INF-003",
            "domain": "DevOps & Cloud",
            "title": "Customer App Expo Web Standalone Build Optimization",
            "category": "Broken / Bugfix",
            "priority": "P0 - Critical",
            "status": "Completed",
            "current_state": "Resolved missing @medivo/theme module mapping in Metro and added dual-port listen (8081 & 80) in Nginx to prevent 502 Bad Gateway.",
            "required_action": "Trigger clean build in Coolify to verify Expo static assets export seamlessly.",
            "files": "apps/customer-app/Dockerfile, apps/customer-app/metro.config.js, apps/customer-app/nginx.conf",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "DevOps / Frontend",
            "effort": "Medium (3-5d)"
        },
        {
            "id": "MED-INF-004",
            "domain": "DevOps & Cloud",
            "title": "OCI Oracle Cloud Resource Limits & OOM Protection Tuning",
            "category": "Infrastructure & DevOps",
            "priority": "P1 - High",
            "status": "Completed",
            "current_state": "Container memory limits capped to match OCI 4 OCPU / 24 GB RAM specification.",
            "required_action": "Implement Prometheus / Grafana node metrics monitoring for container memory utilization.",
            "files": "docker-compose.production.yml, docs/deployment/COOLIFY_OCI_DEPLOYMENT.md",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "DevOps Pod",
            "effort": "Medium (3-5d)"
        },
        {
            "id": "MED-INF-005",
            "domain": "DevOps & Cloud",
            "title": "Production Secret Management vs Default Passwords Cleanup",
            "category": "Hardcoded / Mock Cleanup",
            "priority": "P0 - Critical",
            "status": "Pending",
            "current_state": "Fallback passwords present in compose defaults: 'medivo_secure_password_change_in_prod', 'MedivoAdmin@2026!'.",
            "required_action": "Enforce strict runtime environment variable injection in Coolify; fail startup if default secrets are detected in production.",
            "files": "docker-compose.production.yml, .env.production.example",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "Security & Infra",
            "effort": "Small (1-2d)"
        },
        {
            "id": "MED-INF-006",
            "domain": "DevOps & Cloud",
            "title": "Automated PostgreSQL Database Seed & Migration Runner",
            "category": "Pending Implementation",
            "priority": "P1 - High",
            "status": "In Progress",
            "current_state": "schema.sql mounted in postgres docker-entrypoint-initdb.d, but incremental migration CLI is not automated for live updates.",
            "required_action": "Create a unified migration/seeding script using Prisma/node-pg that executes 001_initial_schemas.sql and 002_domain_indexes.sql automatically.",
            "files": "services/api/src/infrastructure/db/migrations/*, package.json",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "Backend Team",
            "effort": "Medium (3-5d)"
        },
        {
            "id": "MED-INF-007",
            "domain": "DevOps & Cloud",
            "title": "CloudFront CDN / S3 Storage Integration for AI Scan Images",
            "category": "Priority Decision Required",
            "priority": "P1 - High",
            "status": "Pending",
            "current_state": "Local MinIO S3 container currently used for storing facial scan image blobs.",
            "required_action": "Decide whether to keep MinIO for self-hosted data sovereignty (HIPAA compliant) or switch to AWS S3 + CloudFront CDN signed URLs.",
            "files": "services/ai/src/config/env.ts, apps/customer-bff/src/config/env.ts",
            "milestone": "v1.1 (Enhancement)",
            "assignee": "Product & Infra Lead",
            "effort": "Medium (3-5d)"
        },
        {
            "id": "MED-INF-008",
            "domain": "DevOps & Cloud",
            "title": "Continuous Integration (CI) GitHub Actions Pipeline",
            "category": "Pending Implementation",
            "priority": "P2 - Medium",
            "status": "Pending",
            "current_state": "Local builds and linting configured, but automated PR validation workflow is missing.",
            "required_action": "Create .github/workflows/ci.yml running turbo build, test, and type-check on all pull requests.",
            "files": ".github/workflows/ci.yml, turbo.json",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "DevOps Pod",
            "effort": "Small (1-2d)"
        },

        # AI & MACHINE LEARNING DOMAIN
        {
            "id": "MED-AI-001",
            "domain": "AI Engine",
            "title": "Sub-Dermal Computer Vision Neural Telemetry Engine",
            "category": "Existing Feature Enhancement",
            "priority": "P1 - High",
            "status": "Completed",
            "current_state": "SubDermalTelemetryEngine analyzes base64 image frames, extracting Hydration (0-100), Texture, Wrinkles, Pigmentation, Dark Circles, and Acne metrics.",
            "required_action": "Fine-tune 128 facial landmark contour detection with ONNX runtime models for sub-3-second mobile execution.",
            "files": "services/ai/src/domain/SubDermalTelemetryEngine.ts, services/ai/src/services/TelemetryService.ts",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "AI / ML Pod",
            "effort": "Medium (3-5d)"
        },
        {
            "id": "MED-AI-002",
            "domain": "AI Engine",
            "title": "Perfect Corp & Shen.AI Provider API Key Integration & Fallback Cleanup",
            "category": "Hardcoded / Mock Cleanup",
            "priority": "P1 - High",
            "status": "In Progress",
            "current_state": "Both PerfectCorpAdapter and ShenAIAdapter fall back to hardcoded mock telemetry if API keys are missing.",
            "required_action": "Procure production API credentials for Perfect Corp and Shen.AI, inject via Coolify environment variables, and log warning if mock fallback is triggered in prod.",
            "files": "services/ai/src/providers/PerfectCorpAdapter.ts, services/ai/src/providers/ShenAIAdapter.ts",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "AI Pod / Product Lead",
            "effort": "Medium (3-5d)"
        },
        {
            "id": "MED-AI-003",
            "domain": "AI Engine",
            "title": "AI Coach Conversational Streaming Response via LLM Gateway",
            "category": "Pending Implementation",
            "priority": "P1 - High",
            "status": "In Progress",
            "current_state": "AI Coach currently returns static responses for common skincare queries ('What routine fits combination skin?').",
            "required_action": "Connect OpenAI GPT-4o / Anthropic Claude / Medivo Local LLM endpoint with SSE (Server-Sent Events) streaming in Customer BFF.",
            "files": "apps/customer-bff/src/controllers/coach.controller.ts, apps/customer-app/src/screens/AICoachScreen.tsx",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "AI Pod / Backend",
            "effort": "Medium (3-5d)"
        },
        {
            "id": "MED-AI-004",
            "domain": "AI Engine",
            "title": "Human-in-the-Loop Triage for High-Risk AI Classifications (Rule A-3)",
            "category": "Security & Compliance",
            "priority": "P0 - Critical",
            "status": "Pending",
            "current_state": "Rule A-3 mandates high-risk skin lesions (potential melanoma/carcinoma) be flagged and blocked from immediate patient display until doctor review.",
            "required_action": "Implement severity threshold trigger in SkinAnalysisRepository that marks report status as 'PENDING_DOCTOR_REVIEW' and dispatches urgent triage task.",
            "files": "services/ai/src/repositories/SkinAnalysisRepository.ts, services/appointments/src/services/*",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "AI Pod & Medical Advisor",
            "effort": "Large (1-2w)"
        },
        {
            "id": "MED-AI-005",
            "domain": "AI Engine",
            "title": "Heart Rate Variability (HRV) & Vital Signs Camera Photoplethysmography (PPG)",
            "category": "New Feature Request",
            "priority": "P2 - Medium",
            "status": "Pending",
            "current_state": "Roadmap v2.0 feature to detect pulse rate, HRV, and respiration rate via mobile camera optical absorption.",
            "required_action": "Prototype Shen.AI rPPG SDK integration in mobile camera scan workflow.",
            "files": "apps/customer-app/src/screens/CameraScanScreen.tsx, services/ai/src/providers/ShenAIAdapter.ts",
            "milestone": "v2.0 (Expansion)",
            "assignee": "AI / ML Pod",
            "effort": "X-Large (2w+)"
        },
        {
            "id": "MED-AI-006",
            "domain": "AI Engine",
            "title": "AI Formulation Recommendation Engine",
            "category": "Existing Feature Enhancement",
            "priority": "P1 - High",
            "status": "In Progress",
            "current_state": "Simple score threshold algorithm maps skin scores to hardcoded active formulations (e.g. Niacinamide, Barrier Hydramist).",
            "required_action": "Build dynamic ingredient compatibility matrix (avoiding Vitamin C + Retinol conflicts) matching user health profile allergies.",
            "files": "services/commerce/src/services/*, apps/marketing-web/app/components/SkinScoreSimulator.tsx",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "AI Pod / Commerce",
            "effort": "Medium (3-5d)"
        },

        # CUSTOMER WEB & MOBILE APPLICATION (CUSTOMER-APP)
        {
            "id": "MED-APP-001",
            "domain": "Customer Portal",
            "title": "Direct Subdomain Navigation from Marketing Web to app.medivo.duckdns.org",
            "category": "Existing Feature Enhancement",
            "priority": "P1 - High",
            "status": "Completed",
            "current_state": "Updated Navbar, Footer, and Landing Hero buttons to use dynamic domain helper getAppUrl() pointing to app.medivo.duckdns.org.",
            "required_action": "Verify cross-domain session persistence and seamless redirection.",
            "files": "apps/marketing-web/app/utils/domainHelper.ts, apps/marketing-web/app/components/*",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "Frontend Team",
            "effort": "Small (1-2d)"
        },
        {
            "id": "MED-APP-002",
            "domain": "Customer Portal",
            "title": "Camera WebRTC & Mobile Native Lens Scan Integration",
            "category": "Existing Feature Enhancement",
            "priority": "P0 - Critical",
            "status": "In Progress",
            "current_state": "CameraScanScreen supports live video feed with simulated 9-landmark overlay and shutter capture.",
            "required_action": "Ensure expo-camera camera permissions are requested gracefully on Android 14/15 and iOS 18 with fallback file uploader.",
            "files": "apps/customer-app/src/screens/CameraScanScreen.tsx, apps/customer-app/app.json",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "Mobile / Frontend",
            "effort": "Medium (3-5d)"
        },
        {
            "id": "MED-APP-003",
            "domain": "Customer Portal",
            "title": "Comprehensive Scan Report Breakdown Screen",
            "category": "Existing Feature Enhancement",
            "priority": "P1 - High",
            "status": "Completed",
            "current_state": "ScanReportScreen renders 6 metrics progress bars, clinical summary, and personalized prescription formulation card.",
            "required_action": "Add PDF export functionality for patients to share reports with external doctors.",
            "files": "apps/customer-app/src/screens/ScanReportScreen.tsx",
            "milestone": "v1.1 (Enhancement)",
            "assignee": "Frontend Team",
            "effort": "Small (1-2d)"
        },
        {
            "id": "MED-APP-004",
            "domain": "Customer Portal",
            "title": "Morning & Evening Routine Step Checklist with Persistent State",
            "category": "Existing Feature Enhancement",
            "priority": "P1 - High",
            "status": "Completed",
            "current_state": "RoutinesScreen and RoutineDetailScreen render step toggles, streak counter ('12 Day Streak'), and product links.",
            "required_action": "Connect toggle events to Customer BFF /api/mobile-bff/routines/step for cross-device synchronization.",
            "files": "apps/customer-app/src/screens/RoutinesScreen.tsx, apps/customer-app/src/screens/RoutineDetailScreen.tsx",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "Frontend Team",
            "effort": "Small (1-2d)"
        },
        {
            "id": "MED-APP-005",
            "domain": "Customer Portal",
            "title": "E-Commerce Cart, Checkout & Stripe Payment Flow",
            "category": "Hardcoded / Mock Cleanup",
            "priority": "P0 - Critical",
            "status": "In Progress",
            "current_state": "CartScreen, CheckoutScreen, and PaymentsScreen currently use simulated card tokenization and mock order confirmation.",
            "required_action": "Integrate Stripe Payment Element / Apple Pay / Google Pay via backend payment tokenization endpoint.",
            "files": "apps/customer-app/src/screens/CheckoutScreen.tsx, apps/customer-app/src/screens/PaymentsScreen.tsx, services/commerce/src/*",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "Frontend & Commerce",
            "effort": "Large (1-2w)"
        },
        {
            "id": "MED-APP-006",
            "domain": "Customer Portal",
            "title": "Telehealth Video Consultation Booking & Live WebRTC Room",
            "category": "Hardcoded / Mock Cleanup",
            "priority": "P0 - Critical",
            "status": "In Progress",
            "current_state": "ConsultationsScreen lists mock doctors and appointment slots; VideoCallScreen simulates audio/video toggles with animated avatar.",
            "required_action": "Implement live video calling signaling room using Agora RTC SDK or LiveKit WebRTC server.",
            "files": "apps/customer-app/src/screens/ConsultationsScreen.tsx, apps/customer-app/src/screens/VideoCallScreen.tsx",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "Frontend & Video Pod",
            "effort": "Large (1-2w)"
        },
        {
            "id": "MED-APP-007",
            "domain": "Customer Portal",
            "title": "HIPAA Privacy Consent & Audit Log Settings Screen",
            "category": "Security & Compliance",
            "priority": "P0 - Critical",
            "status": "Completed",
            "current_state": "PrivacyPolicyScreen and ProfileScreen feature explicit consent checkboxes, AES-256 data vault badges, and data deletion request trigger.",
            "required_action": "Connect data deletion requests to backend audit log and soft-delete user records.",
            "files": "apps/customer-app/src/screens/PrivacyPolicyScreen.tsx, apps/customer-app/src/screens/ProfileScreen.tsx",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "Frontend & Security",
            "effort": "Small (1-2d)"
        },
        {
            "id": "MED-APP-008",
            "domain": "Customer Portal",
            "title": "Push Notifications Center & Appointment Reminders",
            "category": "Pending Implementation",
            "priority": "P1 - High",
            "status": "In Progress",
            "current_state": "NotificationsScreen displays categorized notifications (Clinical, Commerce, Telehealth), but push token registration is pending.",
            "required_action": "Configure Expo Notifications push token registration with backend notifications service.",
            "files": "apps/customer-app/src/screens/NotificationsScreen.tsx, services/notifications/src/*",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "Mobile / Backend",
            "effort": "Medium (3-5d)"
        },
        {
            "id": "MED-APP-009",
            "domain": "Customer Portal",
            "title": "Apple Health & Google Fit Biometric Sync Integration",
            "category": "New Feature Request",
            "priority": "P2 - Medium",
            "status": "Pending",
            "current_state": "ProfileScreen UI contains toggles for Apple Health and Google Fit sync.",
            "required_action": "Implement native HealthKit (iOS) and Health Connect (Android) background step & sleep telemetry sync.",
            "files": "apps/customer-app/src/screens/ProfileScreen.tsx, packages/health/src/*",
            "milestone": "v2.0 (Expansion)",
            "assignee": "Mobile Pod",
            "effort": "Large (1-2w)"
        },
        {
            "id": "MED-APP-010",
            "domain": "Customer Portal",
            "title": "Multi-Language (i18n) Localization Support",
            "category": "New Feature Request",
            "priority": "P3 - Low",
            "status": "Pending",
            "current_state": "All customer strings currently in English.",
            "required_action": "Add i18next / expo-localization with Spanish, French, German, and Arabic language packs.",
            "files": "apps/customer-app/src/locales/*, apps/customer-app/src/App.tsx",
            "milestone": "v2.0 (Expansion)",
            "assignee": "Frontend Team",
            "effort": "Medium (3-5d)"
        },

        # DOCTOR CLINICAL PORTAL (DOCTOR-PORTAL)
        {
            "id": "MED-DOC-001",
            "domain": "Doctor Portal",
            "title": "Doctor Portal Landing & Clinical Dashboard",
            "category": "Existing Feature Enhancement",
            "priority": "P1 - High",
            "status": "Completed",
            "current_state": "Doctor portal renders clinical metrics, upcoming patient video calls queue, and AI skin telemetry reports review panel.",
            "required_action": "Connect to live customer-bff /api/doctor endpoints for real-time patient queue loading.",
            "files": "apps/doctor-portal/app/page.tsx, apps/doctor-portal/next.config.mjs",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "Frontend Team",
            "effort": "Medium (3-5d)"
        },
        {
            "id": "MED-DOC-002",
            "domain": "Doctor Portal",
            "title": "Doctor Authentication & License Verification Workflow",
            "category": "Security & Compliance",
            "priority": "P0 - Critical",
            "status": "In Progress",
            "current_state": "Rule D-2 requires doctor vetting and medical license verification prior to accessing patient PHI.",
            "required_action": "Build Doctor onboarding screen with NPI (National Provider Identifier) license upload and Admin review status.",
            "files": "services/auth/src/models/UserSession.ts, apps/doctor-portal/app/*",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "Auth & Medical Team",
            "effort": "Large (1-2w)"
        },
        {
            "id": "MED-DOC-003",
            "domain": "Doctor Portal",
            "title": "Digital Prescription & Custom Formulation Pad",
            "category": "Pending Implementation",
            "priority": "P1 - High",
            "status": "In Progress",
            "current_state": "Prescription UI allows selecting compound formulations, dosage, and application instructions.",
            "required_action": "Save prescriptions to commerce_schema.prescriptions and automatically generate patient cart items.",
            "files": "services/commerce/src/infrastructure/db/*, apps/doctor-portal/app/*",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "Frontend & Commerce",
            "effort": "Medium (3-5d)"
        },
        {
            "id": "MED-DOC-004",
            "domain": "Doctor Portal",
            "title": "Doctor Schedule & Availability Slot Manager",
            "category": "Hardcoded / Mock Cleanup",
            "priority": "P1 - High",
            "status": "Pending",
            "current_state": "Doctor consultation slots currently hardcoded to static times ('09:00 AM', '11:30 AM', '03:00 PM').",
            "required_action": "Implement recurring availability rules in appointment_schema.doctor_schedules with timezone conversion.",
            "files": "services/appointments/src/*, apps/doctor-portal/app/*",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "Backend & Frontend",
            "effort": "Medium (3-5d)"
        },
        {
            "id": "MED-DOC-005",
            "domain": "Doctor Portal",
            "title": "Doctor WebRTC HD Telehealth Consultation Suite",
            "category": "Pending Implementation",
            "priority": "P0 - Critical",
            "status": "Pending",
            "current_state": "Simulated UI in place; doctor video call stream needs WebRTC video integration with patient mobile app.",
            "required_action": "Integrate WebRTC media stream with picture-in-picture skin scan telemetry overlay.",
            "files": "apps/doctor-portal/app/video-call/*, services/appointments/src/*",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "Video Pod",
            "effort": "Large (1-2w)"
        },

        # PLATFORM ADMIN PANEL (ADMIN-PANEL)
        {
            "id": "MED-ADM-001",
            "domain": "Admin Panel",
            "title": "Platform Admin Console & Executive Metrics Overview",
            "category": "Existing Feature Enhancement",
            "priority": "P1 - High",
            "status": "Completed",
            "current_state": "Admin console renders platform telemetry stats, active patient count, AI inference latency, and system health status.",
            "required_action": "Connect to live analytics_schema aggregate queries via admin-bff.",
            "files": "apps/admin-panel/app/page.tsx, apps/admin-panel/app/components/*",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "Frontend Team",
            "effort": "Small (1-2d)"
        },
        {
            "id": "MED-ADM-002",
            "domain": "Admin Panel",
            "title": "HIPAA Cryptographic Audit Log Explorer",
            "category": "Security & Compliance",
            "priority": "P0 - Critical",
            "status": "Completed",
            "current_state": "Admin portal provides searchable, immutable HIPAA access logs (User, Action, Timestamp, IP, Resource ID).",
            "required_action": "Implement CSV / Excel compliance export for external healthcare auditors.",
            "files": "apps/admin-panel/app/hipaa-audit/page.tsx, apps/customer-bff/src/services/audit.service.ts",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "Security & Backend",
            "effort": "Small (1-2d)"
        },
        {
            "id": "MED-ADM-003",
            "domain": "Admin Panel",
            "title": "Doctor Credentialing & Approval Queue",
            "category": "Pending Implementation",
            "priority": "P1 - High",
            "status": "In Progress",
            "current_state": "Doctors management screen lists pending applicants and approved clinical practitioners.",
            "required_action": "Implement 1-click Approve / Reject actions with automated email notification dispatch.",
            "files": "apps/admin-panel/app/doctors/page.tsx, services/notifications/src/*",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "Frontend & Backend",
            "effort": "Medium (3-5d)"
        },
        {
            "id": "MED-ADM-004",
            "domain": "Admin Panel",
            "title": "Skincare Product Catalog & Inventory Manager",
            "category": "Pending Implementation",
            "priority": "P1 - High",
            "status": "In Progress",
            "current_state": "Products management view displays medical-grade active formulations catalog with price and stock levels.",
            "required_action": "Implement Add / Edit Product modal with image upload to S3/MinIO.",
            "files": "apps/admin-panel/app/products/page.tsx, services/commerce/src/*",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "Frontend & Commerce",
            "effort": "Medium (3-5d)"
        },
        {
            "id": "MED-ADM-005",
            "domain": "Admin Panel",
            "title": "User Accounts & Role-Based Access Control (RBAC) Management",
            "category": "Security & Compliance",
            "priority": "P1 - High",
            "status": "In Progress",
            "current_state": "Users list shows account status, registered roles (PATIENT, DOCTOR, ADMIN), and HIPAA consent status.",
            "required_action": "Implement account suspend, password reset trigger, and role assignment actions.",
            "files": "apps/admin-panel/app/users/page.tsx, services/auth/src/*",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "Auth & Admin Pod",
            "effort": "Medium (3-5d)"
        },

        # MARKETING WEBSITE (MARKETING-WEB)
        {
            "id": "MED-MKT-001",
            "domain": "Marketing Web",
            "title": "Interactive Live AI Skin Score Simulator",
            "category": "Existing Feature Enhancement",
            "priority": "P2 - Medium",
            "status": "Completed",
            "current_state": "Marketing landing page features interactive Hydration, Texture, and Pigmentation sliders generating real-time score and formulation recommendation.",
            "required_action": "Add lead capture email input ('Send my personalized report').",
            "files": "apps/marketing-web/app/components/SkinScoreSimulator.tsx, apps/marketing-web/app/page.tsx",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "Frontend Team",
            "effort": "Small (1-2d)"
        },
        {
            "id": "MED-MKT-002",
            "domain": "Marketing Web",
            "title": "Clinical Diagnostic Accuracy & Research Studies Page",
            "category": "Existing Feature Enhancement",
            "priority": "P2 - Medium",
            "status": "Completed",
            "current_state": "Clinical studies page presents 99.4% diagnostic benchmarks, 128-landmark vision pipeline, and double-blind dermatologist study citations.",
            "required_action": "Add downloadable Clinical Whitepaper PDF asset.",
            "files": "apps/marketing-web/app/clinical-studies/page.tsx",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "Marketing / Frontend",
            "effort": "Small (1-2d)"
        },
        {
            "id": "MED-MKT-003",
            "domain": "Marketing Web",
            "title": "Transparent Subscription Pricing & Plan Comparison Matrix",
            "category": "Existing Feature Enhancement",
            "priority": "P1 - High",
            "status": "Completed",
            "current_state": "Pricing page displays Free Trial ($0), Medivo Pro ($19/mo), and Family Clinical ($39/mo) plans with feature breakdowns.",
            "required_action": "Wire 'Subscribe' buttons to Stripe Checkout / Customer App onboarding deep links.",
            "files": "apps/marketing-web/app/pricing/page.tsx",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "Frontend & Commerce",
            "effort": "Small (1-2d)"
        },
        {
            "id": "MED-MKT-004",
            "domain": "Marketing Web",
            "title": "Android Release APK Direct Download Hosting (25MB)",
            "category": "Existing Feature Enhancement",
            "priority": "P1 - High",
            "status": "Completed",
            "current_state": "Marketing page, Navbar, and Footer feature direct download link to /medivo-health-mobile-arm64-25MB.apk.",
            "required_action": "Place optimized signed APK binary in apps/marketing-web/public/ and configure automated EAS Build artifact upload.",
            "files": "apps/marketing-web/public/medivo-health-mobile-arm64-25MB.apk, apps/customer-app/eas.json",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "Mobile / DevOps",
            "effort": "Small (1-2d)"
        },

        # BACKEND SERVICES & DATABASE (SERVICES/*)
        {
            "id": "MED-BE-001",
            "domain": "Backend Core",
            "title": "13 PostgreSQL Domain Schemas Isolation & Zero Cross-Schema Joins",
            "category": "Security & Compliance",
            "priority": "P0 - Critical",
            "status": "Completed",
            "current_state": "Database architecture strictly enforces 13 isolated schemas (auth_schema, user_schema, profile_schema, skin_schema, ai_schema, report_schema, health_schema, doctor_schema, appointment_schema, commerce_schema, payment_schema, notification_schema, analytics_schema).",
            "required_action": "Maintain strict repository boundary enforcement with automated lint rules preventing cross-schema SQL joins.",
            "files": "services/api/src/infrastructure/db/schema.sql",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "Backend Team",
            "effort": "Medium (3-5d)"
        },
        {
            "id": "MED-BE-002",
            "domain": "Backend Core",
            "title": "Customer BFF Gateway REST API Integration & Microservices Proxy",
            "category": "Existing Feature Enhancement",
            "priority": "P1 - High",
            "status": "Completed",
            "current_state": "Customer BFF routes /api/mobile-bff endpoints (auth, scans, routines, coach, doctors, appointments, products, orders, notifications) with Zod validation.",
            "required_action": "Add distributed request tracing correlation IDs (Pino logger) across all internal microservice calls.",
            "files": "apps/customer-bff/src/server.ts, apps/customer-bff/src/routes/*",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "Backend Team",
            "effort": "Medium (3-5d)"
        },
        {
            "id": "MED-BE-003",
            "domain": "Auth Service",
            "title": "JWT Token Rotation, Refresh Tokens & Redis Session Invalidation",
            "category": "Security & Compliance",
            "priority": "P0 - Critical",
            "status": "In Progress",
            "current_state": "Auth service issues access JWTs and tracks sessions in auth_schema.sessions.",
            "required_action": "Implement Redis-backed sliding token refresh mechanism and single-sign-out device invalidation.",
            "files": "services/auth/src/services/TokenService.ts, services/auth/src/repositories/SessionRepository.ts",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "Auth & Security Pod",
            "effort": "Medium (3-5d)"
        },
        {
            "id": "MED-BE-004",
            "domain": "Commerce Service",
            "title": "Stripe Webhook Event Processing for Subscriptions & Orders",
            "category": "Pending Implementation",
            "priority": "P0 - Critical",
            "status": "Pending",
            "current_state": "Simulated checkout in place; Stripe webhooks need to update order status to 'PAID' and provision Medivo Pro subscriptions.",
            "required_action": "Create /api/commerce/webhooks/stripe endpoint with cryptographic signature verification (Rule C-1).",
            "files": "services/commerce/src/controllers/*, services/commerce/src/routes/*",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "Commerce Pod",
            "effort": "Large (1-2w)"
        },
        {
            "id": "MED-BE-005",
            "domain": "Appointments Service",
            "title": "Optimistic Concurrency Lock for Telehealth Appointment Slot Booking",
            "category": "Pending Implementation",
            "priority": "P1 - High",
            "status": "In Progress",
            "current_state": "Basic booking endpoint in place; needs Redis distributed lock (Redlock) to prevent double-booking of doctors.",
            "required_action": "Add 5-minute temporary slot reservation hold with automated Redis expiration.",
            "files": "services/appointments/src/services/*, services/appointments/src/controllers/*",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "Backend Team",
            "effort": "Medium (3-5d)"
        },
        {
            "id": "MED-BE-006",
            "domain": "Notifications Service",
            "title": "BullMQ Background Queue with Retry & Dead-Letter Handling",
            "category": "Pending Implementation",
            "priority": "P1 - High",
            "status": "In Progress",
            "current_state": "Notifications service sends mock emails to Mailpit (port 1025).",
            "required_action": "Implement BullMQ asynchronous job queue for email dispatch (SendGrid/SES) and mobile push notifications with exponential backoff.",
            "files": "services/notifications/src/server.ts, services/notifications/src/config/env.ts",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "Backend Team",
            "effort": "Medium (3-5d)"
        },
        {
            "id": "MED-BE-007",
            "domain": "Shared Packages",
            "title": "Universal API Client Dynamic Origin Resolution (@medivo/api-client)",
            "category": "Existing Feature Enhancement",
            "priority": "P1 - High",
            "status": "Completed",
            "current_state": "API Client automatically inspects hostname on DuckDNS, sslip.io, and localhost, resolving api.<domain> seamlessly with or without www.",
            "required_action": "Add automatic request retry interceptor for transient network drops.",
            "files": "packages/api-client/src/index.ts",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "Frontend & Shared Pod",
            "effort": "Small (1-2d)"
        },

        # TESTING, SECURITY & COMPLIANCE
        {
            "id": "MED-SEC-001",
            "domain": "Security & HIPAA",
            "title": "AES-256 Field-Level Encryption for Medical Diagnosis Data (Rule H-1)",
            "category": "Security & Compliance",
            "priority": "P0 - Critical",
            "status": "In Progress",
            "current_state": "Database connection encrypted via TLS; sensitive diagnosis fields need application-level AES-256 encryption before insertion.",
            "required_action": "Implement CryptoVault utility using pgcrypto and Node.js crypto for sensitive health record columns.",
            "files": "services/api/src/infrastructure/db/schema.sql, packages/utils/src/crypto.ts",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "Security Pod",
            "effort": "Medium (3-5d)"
        },
        {
            "id": "MED-SEC-002",
            "domain": "Security & HIPAA",
            "title": "Versioned User Consent Logging Prior to AI Inference (Rule H-2)",
            "category": "Security & Compliance",
            "priority": "P0 - Critical",
            "status": "Completed",
            "current_state": "AI Scan requires active consent verification before processing facial telemetry payloads.",
            "required_action": "Persist consent version string ('v1.0-HIPAA-2026') with timestamp in ai_schema.consents.",
            "files": "services/ai/src/controllers/ai.controller.ts, apps/customer-bff/src/controllers/privacy.controller.ts",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "Security & AI Pod",
            "effort": "Small (1-2d)"
        },
        {
            "id": "MED-SEC-003",
            "domain": "Security & HIPAA",
            "title": "Automated PHI Redaction in Production Structured Logs (Rule 14)",
            "category": "Security & Compliance",
            "priority": "P0 - Critical",
            "status": "Completed",
            "current_state": "Logging rules strictly forbid logging patient names, email, medical images, or biometric telemetry.",
            "required_action": "Configure Pino logger redaction paths for 'password', 'token', 'imageBase64', 'email', 'diagnosis'.",
            "files": "services/*/src/middleware/errorHandler.ts, apps/customer-bff/src/server.ts",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "Security Pod",
            "effort": "Small (1-2d)"
        },
        {
            "id": "MED-TST-001",
            "domain": "Testing & QA",
            "title": "Comprehensive Unit Test Suite for Domain Business Logic",
            "category": "Pending Implementation",
            "priority": "P1 - High",
            "status": "In Progress",
            "current_state": "AI telemetry engine and API client have unit tests; domain use cases require 90% test coverage per Constitution.",
            "required_action": "Write unit tests for TokenService, TelemetryEngine, AppointmentScheduler, and CartPricingCalculator.",
            "files": "services/ai/src/__tests__/*, services/auth/src/__tests__/*, services/commerce/src/__tests__/*",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "QA & Engineering Pods",
            "effort": "Medium (3-5d)"
        },
        {
            "id": "MED-TST-002",
            "domain": "Testing & QA",
            "title": "End-to-End (E2E) Playwright Tests for Critical Patient User Flows",
            "category": "Pending Implementation",
            "priority": "P1 - High",
            "status": "In Progress",
            "current_state": "tests/e2e/customer-app.spec.ts exists covering basic navigation and simulated scan flow.",
            "required_action": "Expand E2E tests to cover Register -> AI Scan -> View Report -> Book Consultation -> Checkout flow.",
            "files": "tests/e2e/*",
            "milestone": "v1.0 (Public Launch)",
            "assignee": "QA Pod",
            "effort": "Medium (3-5d)"
        }
    ]

    # -------------------------------------------------------------------------
    # SHEET 1: 📊 Executive Dashboard (Metrics, Progress & KPIs)
    # -------------------------------------------------------------------------
    ws_dash = wb.active
    ws_dash.title = "📊 Executive Dashboard"
    ws_dash.views.sheetView[0].showGridLines = True
    
    # Header Banner
    ws_dash.merge_cells("A1:K2")
    ws_dash["A1"] = "MEDIVO HEALTH INTELLIGENCE PLATFORM — MASTER TASK & PROJECT TRACKER"
    ws_dash["A1"].font = title_font
    ws_dash["A1"].fill = title_fill
    ws_dash["A1"].alignment = Alignment(horizontal="center", vertical="center")
    
    ws_dash.merge_cells("A3:K3")
    ws_dash["A3"] = "Enterprise-Grade Engineering Roadmap, Architecture Audit, Bug Fixes & Task Governance | Version 5.1"
    ws_dash["A3"].font = Font(name=font_family, size=10, bold=True, color="475569")
    ws_dash["A3"].fill = PatternFill(start_color=LIGHT_BLUE, end_color=LIGHT_BLUE, fill_type="solid")
    ws_dash["A3"].alignment = Alignment(horizontal="center", vertical="center")
    
    # Calculate KPIs
    total_tasks = len(tasks)
    completed_tasks = sum(1 for t in tasks if t["status"] == "Completed")
    in_progress_tasks = sum(1 for t in tasks if t["status"] == "In Progress")
    pending_tasks = sum(1 for t in tasks if t["status"] == "Pending")
    blocked_tasks = sum(1 for t in tasks if t["status"] == "Blocked")
    
    p0_tasks = sum(1 for t in tasks if t["priority"].startswith("P0"))
    p1_tasks = sum(1 for t in tasks if t["priority"].startswith("P1"))
    p2_tasks = sum(1 for t in tasks if t["priority"].startswith("P2"))
    p3_tasks = sum(1 for t in tasks if t["priority"].startswith("P3"))
    
    broken_tasks = sum(1 for t in tasks if t["category"] == "Broken / Bugfix")
    hardcoded_tasks = sum(1 for t in tasks if t["category"] == "Hardcoded / Mock Cleanup")
    decision_tasks = sum(1 for t in tasks if t["category"] == "Priority Decision Required")
    new_feat_tasks = sum(1 for t in tasks if t["category"] == "New Feature Request")
    enhancement_tasks = sum(1 for t in tasks if t["category"] == "Existing Feature Enhancement")
    security_tasks = sum(1 for t in tasks if t["category"] == "Security & Compliance")
    infra_tasks = sum(1 for t in tasks if t["category"] == "Infrastructure & DevOps")
    pending_impl_tasks = sum(1 for t in tasks if t["category"] == "Pending Implementation")

    # KPI Summary Cards (Row 5-7)
    kpis = [
        ("TOTAL TRACKED TASKS", str(total_tasks), "A5", "B7", PRIMARY_BLUE),
        ("COMPLETED & VERIFIED", f"{completed_tasks} ({round(completed_tasks/total_tasks*100)}%)", "C5", "D7", ACCENT_EMERALD),
        ("ACTIVE / IN PROGRESS", str(in_progress_tasks), "E5", "F7", ACCENT_PURPLE),
        ("PENDING / BACKLOG", str(pending_tasks), "G5", "H7", ACCENT_AMBER),
        ("P0 CRITICAL PRIORITY", str(p0_tasks), "I5", "I7", ACCENT_ROSE),
        ("HARDCODED / MOCKS", str(hardcoded_tasks), "J5", "K7", "EA580C"),
    ]
    
    for label, val, top_left, bot_right, col_hex in kpis:
        ws_dash.merge_cells(f"{top_left}:{bot_right}")
        cell = ws_dash[top_left]
        cell.value = f"{label}\n\n{val}"
        cell.font = Font(name=font_family, size=11, bold=True, color="1E293B")
        cell.fill = PatternFill(start_color=GRAY_LIGHT, end_color=GRAY_LIGHT, fill_type="solid")
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        # Apply borders to the whole merged range
        min_col, min_row = openpyxl.utils.coordinate_to_tuple(top_left)
        max_col, max_row = openpyxl.utils.coordinate_to_tuple(bot_right)
        for r in range(min_row, max_row + 1):
            for c in range(min_col, max_col + 1):
                cell_box = ws_dash.cell(row=r, column=c)
                cell_box.border = card_border

    # Section 1: Breakdown by Status & Priority (Row 9-17)
    ws_dash.merge_cells("A9:E9")
    ws_dash["A9"] = "STATUS & COMPLETION BREAKDOWN"
    ws_dash["A9"].font = section_font
    
    ws_dash.merge_cells("G9:K9")
    ws_dash["G9"] = "PRIORITY DISTRIBUTION"
    ws_dash["G9"].font = section_font

    status_headers = ["Status Level", "Task Count", "% Share", "Status Health"]
    for i, h in enumerate(status_headers, start=1):
        c = ws_dash.cell(row=10, column=i if i <= 3 else 4, value=h)
        c.font = Font(name=font_family, size=10, bold=True, color="FFFFFF")
        c.fill = sub_header_fill
        c.alignment = Alignment(horizontal="center", vertical="center")
    ws_dash.merge_cells("D10:E10")

    status_rows = [
        ("Completed & Deployed", completed_tasks, f"{round(completed_tasks/total_tasks*100, 1)}%", "✅ Complete", status_done_fill, status_done_font),
        ("In Active Development", in_progress_tasks, f"{round(in_progress_tasks/total_tasks*100, 1)}%", "⚡ Active Sprint", status_progress_fill, status_progress_font),
        ("Pending Implementation", pending_tasks, f"{round(pending_tasks/total_tasks*100, 1)}%", "⏳ Queued", status_pending_fill, status_pending_font),
        ("Blocked / Waiting Review", blocked_tasks, f"{round(blocked_tasks/total_tasks*100, 1)}%", "🛑 Action Needed", status_blocked_fill, status_blocked_font),
    ]

    for row_idx, (s_name, count, pct, badge, fill, font) in enumerate(status_rows, start=11):
        ws_dash.cell(row=row_idx, column=1, value=s_name).font = data_bold_font
        ws_dash.cell(row=row_idx, column=2, value=count).alignment = Alignment(horizontal="center")
        ws_dash.cell(row=row_idx, column=3, value=pct).alignment = Alignment(horizontal="center")
        ws_dash.merge_cells(f"D{row_idx}:E{row_idx}")
        badge_cell = ws_dash.cell(row=row_idx, column=4, value=badge)
        badge_cell.font = font
        badge_cell.fill = fill
        badge_cell.alignment = Alignment(horizontal="center")
        for col in range(1, 6):
            ws_dash.cell(row=row_idx, column=col).border = card_border

    # Priority Table
    priority_headers = ["Priority Level", "Count", "% Share", "SLA Target"]
    for i, h in enumerate(priority_headers, start=7):
        c = ws_dash.cell(row=10, column=i if i <= 9 else 10, value=h)
        c.font = Font(name=font_family, size=10, bold=True, color="FFFFFF")
        c.fill = sub_header_fill
        c.alignment = Alignment(horizontal="center", vertical="center")
    ws_dash.merge_cells("J10:K10")

    priority_rows = [
        ("P0 - Critical (Blocker / Launch)", p0_tasks, f"{round(p0_tasks/total_tasks*100, 1)}%", "Immediate (< 24h)", p0_fill, p0_font),
        ("P1 - High (Core Product Feature)", p1_tasks, f"{round(p1_tasks/total_tasks*100, 1)}%", "Current Sprint (< 1w)", p1_fill, p1_font),
        ("P2 - Medium (Enhancement)", p2_tasks, f"{round(p2_tasks/total_tasks*100, 1)}%", "Next Sprint (< 2w)", p2_fill, p2_font),
        ("P3 - Low (Nice-to-Have / Future)", p3_tasks, f"{round(p3_tasks/total_tasks*100, 1)}%", "Post-Launch Backlog", p3_fill, p3_font),
    ]

    for row_idx, (p_name, count, pct, sla, fill, font) in enumerate(priority_rows, start=11):
        ws_dash.cell(row=row_idx, column=7, value=p_name).font = data_bold_font
        ws_dash.cell(row=row_idx, column=8, value=count).alignment = Alignment(horizontal="center")
        ws_dash.cell(row=row_idx, column=9, value=pct).alignment = Alignment(horizontal="center")
        ws_dash.merge_cells(f"J{row_idx}:K{row_idx}")
        sla_cell = ws_dash.cell(row=row_idx, column=10, value=sla)
        sla_cell.font = font
        sla_cell.fill = fill
        sla_cell.alignment = Alignment(horizontal="center")
        for col in range(7, 12):
            ws_dash.cell(row=row_idx, column=col).border = card_border

    # Section 2: Breakdown by Engineering Category (Row 16-26)
    ws_dash.merge_cells("A16:K16")
    ws_dash["A16"] = "CATEGORICAL ENGINEERING INVENTORY"
    ws_dash["A16"].font = section_font

    cat_headers = ["Category / Task Type", "Total Items", "Completed", "Pending / In Progress", "Risk Level", "Focus Area"]
    cat_cols = [(1, 3), (4, 4), (5, 5), (6, 7), (8, 9), (10, 11)]
    for (start_c, end_c), h_text in zip(cat_cols, cat_headers):
        if start_c != end_c:
            ws_dash.merge_cells(start_row=17, start_column=start_c, end_row=17, end_column=end_c)
        c = ws_dash.cell(row=17, column=start_c, value=h_text)
        c.font = Font(name=font_family, size=10, bold=True, color="FFFFFF")
        c.fill = header_fill
        c.alignment = Alignment(horizontal="center", vertical="center")

    category_data = [
        ("Broken / Non-Working Tasks (Bugs)", broken_tasks, sum(1 for t in tasks if t["category"] == "Broken / Bugfix" and t["status"] == "Completed"), sum(1 for t in tasks if t["category"] == "Broken / Bugfix" and t["status"] != "Completed"), "CRITICAL", "Build pipelines, container 502s, Metro bundler", cat_broken_fill),
        ("Hardcoded Items & Mock Cleanup", hardcoded_tasks, sum(1 for t in tasks if t["category"] == "Hardcoded / Mock Cleanup" and t["status"] == "Completed"), sum(1 for t in tasks if t["category"] == "Hardcoded / Mock Cleanup" and t["status"] != "Completed"), "HIGH", "Replace mock AI telemetry, payment tokens & default passwords", cat_hardcoded_fill),
        ("Tasks Requiring Priority Decisions", decision_tasks, sum(1 for t in tasks if t["category"] == "Priority Decision Required" and t["status"] == "Completed"), sum(1 for t in tasks if t["category"] == "Priority Decision Required" and t["status"] != "Completed"), "HIGH", "Payment gateway selection, WebRTC vendor, Storage CDN", cat_decision_fill),
        ("Pending Core Implementation", pending_impl_tasks, sum(1 for t in tasks if t["category"] == "Pending Implementation" and t["status"] == "Completed"), sum(1 for t in tasks if t["category"] == "Pending Implementation" and t["status"] != "Completed"), "MEDIUM", "BullMQ queues, DB migrations, Doctor verification workflow", cat_infra_fill),
        ("Security & HIPAA Compliance", security_tasks, sum(1 for t in tasks if t["category"] == "Security & Compliance" and t["status"] == "Completed"), sum(1 for t in tasks if t["category"] == "Security & Compliance" and t["status"] != "Completed"), "CRITICAL", "AES-256 field encryption, consent logging, zero cross-schema joins", cat_security_fill),
        ("Existing / Old Features Enhanced", enhancement_tasks, sum(1 for t in tasks if t["category"] == "Existing Feature Enhancement" and t["status"] == "Completed"), sum(1 for t in tasks if t["category"] == "Existing Feature Enhancement" and t["status"] != "Completed"), "LOW", "AI Skin Score Simulator, Routine Checklist, Domain Helper", cat_enhancement_fill),
        ("Infrastructure & DevOps Tasks", infra_tasks, sum(1 for t in tasks if t["category"] == "Infrastructure & DevOps" and t["status"] == "Completed"), sum(1 for t in tasks if t["category"] == "Infrastructure & DevOps" and t["status"] != "Completed"), "MEDIUM", "Traefik routing, OCI resource tuning, Let's Encrypt SSL", cat_infra_fill),
        ("New Feature Requests (v2.0 Roadmap)", new_feat_tasks, sum(1 for t in tasks if t["category"] == "New Feature Request" and t["status"] == "Completed"), sum(1 for t in tasks if t["category"] == "New Feature Request" and t["status"] != "Completed"), "LOW", "Camera HRV PPG vitals, Apple Health/Google Fit, Multi-language", cat_feature_fill),
    ]

    for row_offset, (cat_name, total, done, pend, risk, focus, fill) in enumerate(category_data, start=18):
        ws_dash.merge_cells(f"A{row_offset}:C{row_offset}")
        c_title = ws_dash.cell(row=row_offset, column=1, value=cat_name)
        c_title.font = data_bold_font
        c_title.fill = fill
        
        ws_dash.cell(row=row_offset, column=4, value=total).alignment = Alignment(horizontal="center")
        ws_dash.cell(row=row_offset, column=5, value=done).alignment = Alignment(horizontal="center")
        
        ws_dash.merge_cells(f"F{row_offset}:G{row_offset}")
        ws_dash.cell(row=row_offset, column=6, value=pend).alignment = Alignment(horizontal="center")
        
        ws_dash.merge_cells(f"H{row_offset}:I{row_offset}")
        risk_c = ws_dash.cell(row=row_offset, column=8, value=risk)
        risk_c.alignment = Alignment(horizontal="center")
        risk_c.font = Font(name=font_family, size=9, bold=True, color="991B1B" if risk == "CRITICAL" else ("92400E" if risk == "HIGH" else "065F46"))
        
        ws_dash.merge_cells(f"J{row_offset}:K{row_offset}")
        ws_dash.cell(row=row_offset, column=10, value=focus).font = Font(name=font_family, size=9, italic=True)
        
        for c_idx in range(1, 12):
            ws_dash.cell(row=row_offset, column=c_idx).border = card_border

    # -------------------------------------------------------------------------
    # SHEET 2: 📋 Master Task Tracker (Full Detail)
    # -------------------------------------------------------------------------
    ws_master = wb.create_sheet(title="📋 Master Task Tracker")
    ws_master.views.sheetView[0].showGridLines = True
    
    headers = [
        "Task ID",
        "Domain / Module",
        "Task Title",
        "Category",
        "Priority",
        "Status",
        "Current State & Identified Issue / Hardcoded Element",
        "Required Action & Technical Solution",
        "Affected Files / Components",
        "Target Milestone",
        "Assignee / Pod",
        "Estimated Effort"
    ]
    
    # Title row
    ws_master.merge_cells("A1:L1")
    ws_master["A1"] = "MEDIVO HEALTH INTELLIGENCE PLATFORM — MASTER TASK REPOSITORY"
    ws_master["A1"].font = title_font
    ws_master["A1"].fill = title_fill
    ws_master["A1"].alignment = Alignment(horizontal="left", vertical="center", indent=1)
    
    # Header row
    for col_idx, h in enumerate(headers, start=1):
        cell = ws_master.cell(row=2, column=col_idx, value=h)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = card_border
        
    ws_master.row_dimensions[2].height = 28
    
    # Populate Tasks
    for r_idx, t in enumerate(tasks, start=3):
        ws_master.row_dimensions[r_idx].height = 42
        
        # Zebra striping
        is_even = (r_idx % 2 == 0)
        row_fill = zebra_fill if is_even else None
        
        c_id = ws_master.cell(row=r_idx, column=1, value=t["id"])
        c_id.font = code_font
        c_id.alignment = Alignment(horizontal="center", vertical="center")
        
        c_dom = ws_master.cell(row=r_idx, column=2, value=t["domain"])
        c_dom.font = data_bold_font
        c_dom.alignment = Alignment(horizontal="center", vertical="center")
        
        c_title = ws_master.cell(row=r_idx, column=3, value=t["title"])
        c_title.font = data_bold_font
        c_title.alignment = Alignment(horizontal="left", vertical="center")
        
        c_cat = ws_master.cell(row=r_idx, column=4, value=t["category"])
        c_cat.font = data_font
        c_cat.alignment = Alignment(horizontal="center", vertical="center")
        if t["category"] == "Broken / Bugfix":
            c_cat.fill = cat_broken_fill
        elif t["category"] == "Hardcoded / Mock Cleanup":
            c_cat.fill = cat_hardcoded_fill
        elif t["category"] == "Priority Decision Required":
            c_cat.fill = cat_decision_fill
        elif t["category"] == "Security & Compliance":
            c_cat.fill = cat_security_fill
            
        c_pri = ws_master.cell(row=r_idx, column=5, value=t["priority"])
        c_pri.alignment = Alignment(horizontal="center", vertical="center")
        if t["priority"].startswith("P0"):
            c_pri.fill = p0_fill
            c_pri.font = p0_font
        elif t["priority"].startswith("P1"):
            c_pri.fill = p1_fill
            c_pri.font = p1_font
        elif t["priority"].startswith("P2"):
            c_pri.fill = p2_fill
            c_pri.font = p2_font
        else:
            c_pri.fill = p3_fill
            c_pri.font = p3_font
            
        c_stat = ws_master.cell(row=r_idx, column=6, value=t["status"])
        c_stat.alignment = Alignment(horizontal="center", vertical="center")
        if t["status"] == "Completed":
            c_stat.fill = status_done_fill
            c_stat.font = status_done_font
        elif t["status"] == "In Progress":
            c_stat.fill = status_progress_fill
            c_stat.font = status_progress_font
        elif t["status"] == "Blocked":
            c_stat.fill = status_blocked_fill
            c_stat.font = status_blocked_font
        else:
            c_stat.fill = status_pending_fill
            c_stat.font = status_pending_font
            
        c_curr = ws_master.cell(row=r_idx, column=7, value=t["current_state"])
        c_curr.font = data_font
        c_curr.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
        
        c_act = ws_master.cell(row=r_idx, column=8, value=t["required_action"])
        c_act.font = data_font
        c_act.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
        
        c_files = ws_master.cell(row=r_idx, column=9, value=t["files"])
        c_files.font = code_font
        c_files.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
        
        c_mile = ws_master.cell(row=r_idx, column=10, value=t["milestone"])
        c_mile.font = data_font
        c_mile.alignment = Alignment(horizontal="center", vertical="center")
        
        c_ass = ws_master.cell(row=r_idx, column=11, value=t["assignee"])
        c_ass.font = data_font
        c_ass.alignment = Alignment(horizontal="center", vertical="center")
        
        c_eff = ws_master.cell(row=r_idx, column=12, value=t["effort"])
        c_eff.font = data_font
        c_eff.alignment = Alignment(horizontal="center", vertical="center")
        
        for c_idx in range(1, 13):
            cell_item = ws_master.cell(row=r_idx, column=c_idx)
            cell_item.border = card_border
            if row_fill and cell_item.fill.fill_type is None:
                cell_item.fill = row_fill

    # Freeze panes on Master Task Tracker
    ws_master.freeze_panes = "C3"

    # -------------------------------------------------------------------------
    # SHEET 3: ⚠️ Hardcoded & Broken Items (Action Needed)
    # -------------------------------------------------------------------------
    ws_urgent = wb.create_sheet(title="⚠️ Hardcoded & Broken Items")
    ws_urgent.views.sheetView[0].showGridLines = True
    
    ws_urgent.merge_cells("A1:H1")
    ws_urgent["A1"] = "HIGH PRIORITY: BROKEN CODE, MOCK DATA CLEANUP & HARDCODED CREDENTIALS"
    ws_urgent["A1"].font = title_font
    ws_urgent["A1"].fill = PatternFill(start_color="B91C1C", end_color="B91C1C", fill_type="solid")
    ws_urgent["A1"].alignment = Alignment(horizontal="left", vertical="center", indent=1)
    
    urgent_headers = ["Task ID", "Domain", "Item / Bug Description", "Category", "Priority", "Current Hardcoded / Defect State", "Resolution Action Required", "Impacted Source Files"]
    for c_i, u_h in enumerate(urgent_headers, start=1):
        c = ws_urgent.cell(row=2, column=c_i, value=u_h)
        c.font = header_font
        c.fill = header_fill
        c.alignment = Alignment(horizontal="center", vertical="center")
        c.border = card_border
        
    ws_urgent.row_dimensions[2].height = 25
    
    urgent_tasks = [t for t in tasks if t["category"] in ["Broken / Bugfix", "Hardcoded / Mock Cleanup"]]
    for u_idx, ut in enumerate(urgent_tasks, start=3):
        ws_urgent.row_dimensions[u_idx].height = 36
        ws_urgent.cell(row=u_idx, column=1, value=ut["id"]).font = code_font
        ws_urgent.cell(row=u_idx, column=2, value=ut["domain"]).font = data_bold_font
        ws_urgent.cell(row=u_idx, column=3, value=ut["title"]).font = data_bold_font
        
        cat_c = ws_urgent.cell(row=u_idx, column=4, value=ut["category"])
        cat_c.fill = cat_broken_fill if ut["category"] == "Broken / Bugfix" else cat_hardcoded_fill
        cat_c.alignment = Alignment(horizontal="center", vertical="center")
        
        pri_c = ws_urgent.cell(row=u_idx, column=5, value=ut["priority"])
        pri_c.fill = p0_fill if ut["priority"].startswith("P0") else p1_fill
        pri_c.font = p0_font if ut["priority"].startswith("P0") else p1_font
        pri_c.alignment = Alignment(horizontal="center", vertical="center")
        
        ws_urgent.cell(row=u_idx, column=6, value=ut["current_state"]).font = data_font
        ws_urgent.cell(row=u_idx, column=7, value=ut["required_action"]).font = data_font
        ws_urgent.cell(row=u_idx, column=8, value=ut["files"]).font = code_font
        
        for ci in range(1, 9):
            ws_urgent.cell(row=u_idx, column=ci).border = card_border

    # -------------------------------------------------------------------------
    # SHEET 4: 🎯 Priority Decisions & Strategic Backlog
    # -------------------------------------------------------------------------
    ws_dec = wb.create_sheet(title="🎯 Strategic Decisions")
    ws_dec.views.sheetView[0].showGridLines = True
    
    ws_dec.merge_cells("A1:G1")
    ws_dec["A1"] = "ARCHITECTURAL & PRODUCT DECISIONS REQUIRING STAKEHOLDER SIGN-OFF"
    ws_dec["A1"].font = title_font
    ws_dec["A1"].fill = PatternFill(start_color=DARK_BLUE, end_color=DARK_BLUE, fill_type="solid")
    ws_dec["A1"].alignment = Alignment(horizontal="left", vertical="center", indent=1)
    
    dec_headers = ["Decision ID", "Architecture Domain", "Strategic Decision Topic", "Option A (Recommended)", "Option B (Alternative)", "Trade-off / Impact Analysis", "Recommended Milestone"]
    for c_i, d_h in enumerate(dec_headers, start=1):
        c = ws_dec.cell(row=2, column=c_i, value=d_h)
        c.font = header_font
        c.fill = header_fill
        c.alignment = Alignment(horizontal="center", vertical="center")
        c.border = card_border
        
    ws_dec.row_dimensions[2].height = 25
    
    strategic_decisions = [
        ("DEC-001", "Commerce & Billing", "Global vs Regional Payment Gateway", "Stripe Payment Element (Global multi-currency, Apple/Google Pay, tokenized card vault)", "Razorpay / Local Regional PSPs (Lower domestic interchange rates in selected territories)", "Stripe eliminates PCI-DSS audit overhead; Razorpay requires secondary backend integration.", "v1.0 (Public Launch)"),
        ("DEC-002", "Telehealth Video", "WebRTC Video Provider Architecture", "Agora RTC SDK / LiveKit Server (HD low-latency video rooms, built-in tokenized encryption)", "Direct Peer-to-Peer WebRTC via simple STUN/TURN", "Direct P2P fails under strict hospital NAT/firewalls; Agora/LiveKit ensures 99.99% video connect rate.", "v1.0 (Public Launch)"),
        ("DEC-003", "Object Storage Vault", "AI Facial Scans & Report Storage", "OCI Self-Hosted MinIO S3 Vault (Zero egress costs, full HIPAA data sovereignty on instance)", "AWS S3 Bucket + CloudFront CDN Signed URLs (Managed scalability, global CDN distribution)", "MinIO provides strict internal network isolation; AWS S3 simplifies multi-region scaling.", "v1.1 (Enhancement)"),
        ("DEC-004", "AI Inference Cluster", "On-Premise ONNX Engine vs SaaS Cloud API", "Hybrid Architecture: Internal ResNet-50 ONNX for instant tier-1 telemetry + Perfect Corp SaaS for clinical depth", "100% External SaaS Cloud Inference API", "Hybrid ensures zero vendor lock-in and offline mobile scanning capability.", "v1.0 (Public Launch)"),
        ("DEC-005", "Microservices Extraction", "Modular Monolith Extraction Trigger Point", "Maintain Modular Monolith until 100,000 MAU; extract AI & Commerce services only when scaling demands", "Immediate extraction into independent Kubernetes Microservices", "Premature extraction introduces immense distributed tracing, network latency, and deployment complexity.", "v2.0 (Expansion)"),
    ]
    
    for d_idx, (d_id, d_dom, d_topic, opt_a, opt_b, trade, mile) in enumerate(strategic_decisions, start=3):
        ws_dec.row_dimensions[d_idx].height = 42
        ws_dec.cell(row=d_idx, column=1, value=d_id).font = code_font
        ws_dec.cell(row=d_idx, column=2, value=d_dom).font = data_bold_font
        ws_dec.cell(row=d_idx, column=3, value=d_topic).font = data_bold_font
        ws_dec.cell(row=d_idx, column=4, value=opt_a).font = Font(name=font_family, size=10, bold=True, color="065F46")
        ws_dec.cell(row=d_idx, column=4).fill = PatternFill(start_color="DCFCE7", end_color="DCFCE7", fill_type="solid")
        ws_dec.cell(row=d_idx, column=5, value=opt_b).font = data_font
        ws_dec.cell(row=d_idx, column=6, value=trade).font = Font(name=font_family, size=9, italic=True)
        ws_dec.cell(row=d_idx, column=7, value=mile).font = data_font
        
        for c_k in range(1, 8):
            cell_k = ws_dec.cell(row=d_idx, column=c_k)
            cell_k.border = card_border
            cell_k.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
            if c_k in [1, 2, 7]:
                cell_k.alignment = Alignment(horizontal="center", vertical="center")

    # -------------------------------------------------------------------------
    # SHEET 5: 🔒 Security, HIPAA & Compliance Matrix
    # -------------------------------------------------------------------------
    ws_hipaa = wb.create_sheet(title="🔒 Security & HIPAA Matrix")
    ws_hipaa.views.sheetView[0].showGridLines = True
    
    ws_hipaa.merge_cells("A1:G1")
    ws_hipaa["A1"] = "MEDIVO HEALTH INTELLIGENCE — HIPAA (US) & GDPR (EU) COMPLIANCE CONTROL MATRIX"
    ws_hipaa["A1"].font = title_font
    ws_hipaa["A1"].fill = PatternFill(start_color="065F46", end_color="065F46", fill_type="solid")
    ws_hipaa["A1"].alignment = Alignment(horizontal="left", vertical="center", indent=1)
    
    hipaa_headers = ["Rule ID", "Governance Standard", "Compliance Requirement Description", "Platform Implementation Status", "Audit Verification Mechanism", "Responsible Pod", "Enforcement Article"]
    for c_i, h_h in enumerate(hipaa_headers, start=1):
        c = ws_hipaa.cell(row=2, column=c_i, value=h_h)
        c.font = header_font
        c.fill = header_fill
        c.alignment = Alignment(horizontal="center", vertical="center")
        c.border = card_border
        
    ws_hipaa.row_dimensions[2].height = 25
    
    hipaa_rules = [
        ("Rule H-1", "PHI Encryption at Rest & in Transit", "All Protected Health Information (scans, reports, diagnoses) must use AES-256 at rest and TLS 1.3 in transit.", "Enforced (Let's Encrypt TLS 1.3 active; pgcrypto enabled)", "Automated SSL Labs A+ Grade & PostgreSQL table encryption check", "Security Pod", "Article 7 (Security Mandates)"),
        ("Rule H-2", "Explicit Timestamped User Consent", "Logged user consent required before AI processes biometric health images.", "Enforced (Consent checkbox required in CameraScanScreen & PrivacyPolicy)", "ai_schema.consents table audit trail with consent version", "AI / Frontend Pod", "Article 7 (Security Mandates)"),
        ("Rule H-3", "Health Record Retention & Soft Deletes", "Soft-deletes mandatory for patient records to preserve 7-year medical audit compliance.", "Enforced in database schema (deleted_at column on health profiles)", "Admin audit log tracks all deletion requests with override authorization", "Backend Team", "Article 7 (Security Mandates)"),
        ("Rule H-4", "PII Stripping & De-identification", "Data routed to external AI inference clusters must be stripped of all patient PII.", "Enforced (Base64 payload transmitted with ephemeral UUID token only)", "Customer BFF payload sanitizer middleware unit tests", "AI / Backend Pod", "Article 7 (Security Mandates)"),
        ("Rule A-1", "Mandatory Medical Disclaimers", "All AI-generated metrics must feature prominent non-diagnostic wellness disclaimers.", "Enforced on all 4 apps (Marketing, Customer App, Doctor Portal, Admin)", "Design System disclaimer banner component enforcement", "Frontend Pod", "Article 1 (Core Principles)"),
        ("Rule A-3", "Human-in-the-Loop Clinical Triage", "High-risk classifications (e.g. melanoma suspicion) routed to dermatologist before patient display.", "In Progress (Severity threshold flag routing to doctor queue)", "Integration test verifying high-severity scans enter PENDING_DOCTOR state", "AI Pod & Medical Board", "Article 1 (Core Principles)"),
        ("Rule C-1", "Zero Raw Payment Data Storage", "No credit cards, CVVs, or bank numbers may touch Medivo database servers.", "Enforced (Stripe tokenization architecture; no card columns in DB)", "PCI-DSS compliance architecture review checklist", "Commerce Pod", "Article 7 (Security Mandates)"),
        ("Rule D-2", "Doctor Credentialing & PHI RBAC", "Only vetted and approved dermatologists can inspect patient telemetry and write prescriptions.", "Enforced (Role-based JWT guard on /api/doctor endpoints)", "Admin portal doctor verification approval toggle", "Auth & Admin Pod", "Article 5 (Architecture Protection)"),
    ]
    
    for h_idx, (r_id, r_std, r_req, r_stat, r_audit, r_pod, r_enf) in enumerate(hipaa_rules, start=3):
        ws_hipaa.row_dimensions[h_idx].height = 36
        ws_hipaa.cell(row=h_idx, column=1, value=r_id).font = code_font
        ws_hipaa.cell(row=h_idx, column=2, value=r_std).font = data_bold_font
        ws_hipaa.cell(row=h_idx, column=3, value=r_req).font = data_font
        
        stat_c = ws_hipaa.cell(row=h_idx, column=4, value=r_stat)
        stat_c.font = data_bold_font
        stat_c.fill = status_done_fill if "Enforced" in r_stat else status_progress_fill
        stat_c.alignment = Alignment(horizontal="center", vertical="center")
        
        ws_hipaa.cell(row=h_idx, column=5, value=r_audit).font = Font(name=font_family, size=9, italic=True)
        ws_hipaa.cell(row=h_idx, column=6, value=r_pod).font = data_font
        ws_hipaa.cell(row=h_idx, column=7, value=r_enf).font = code_font
        
        for c_j in range(1, 8):
            cell_j = ws_hipaa.cell(row=h_idx, column=c_j)
            cell_j.border = card_border
            cell_j.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
            if c_j in [1, 4, 6, 7]:
                cell_j.alignment = Alignment(horizontal="center", vertical="center")

    # -------------------------------------------------------------------------
    # Auto-fit Column Widths for all Sheets
    # -------------------------------------------------------------------------
    for ws in wb.worksheets:
        for col in ws.columns:
            max_len = 0
            col_letter = get_column_letter(col[0].column)
            
            # Custom sizing per sheet
            if ws.title == "📊 Executive Dashboard":
                ws.column_dimensions["A"].width = 22
                ws.column_dimensions["B"].width = 16
                ws.column_dimensions["C"].width = 16
                ws.column_dimensions["D"].width = 16
                ws.column_dimensions["E"].width = 16
                ws.column_dimensions["F"].width = 16
                ws.column_dimensions["G"].width = 22
                ws.column_dimensions["H"].width = 16
                ws.column_dimensions["I"].width = 16
                ws.column_dimensions["J"].width = 22
                ws.column_dimensions["K"].width = 24
                continue
                
            if ws.title == "📋 Master Task Tracker":
                widths = {
                    "A": 16, # Task ID
                    "B": 18, # Domain
                    "C": 34, # Title
                    "D": 26, # Category
                    "E": 16, # Priority
                    "F": 16, # Status
                    "G": 46, # Current State
                    "H": 46, # Required Action
                    "I": 38, # Files
                    "J": 20, # Milestone
                    "K": 20, # Assignee
                    "L": 18  # Effort
                }
                for l, w in widths.items():
                    ws.column_dimensions[l].width = w
                continue
                
            if ws.title == "⚠️ Hardcoded & Broken Items":
                widths = {
                    "A": 16, "B": 18, "C": 34, "D": 26, "E": 16, "F": 46, "G": 46, "H": 38
                }
                for l, w in widths.items():
                    ws.column_dimensions[l].width = w
                continue
                
            if ws.title == "🎯 Strategic Decisions":
                widths = {
                    "A": 16, "B": 22, "C": 34, "D": 36, "E": 36, "F": 40, "G": 20
                }
                for l, w in widths.items():
                    ws.column_dimensions[l].width = w
                continue
                
            if ws.title == "🔒 Security & HIPAA Matrix":
                widths = {
                    "A": 14, "B": 32, "C": 44, "D": 32, "E": 36, "F": 20, "G": 28
                }
                for l, w in widths.items():
                    ws.column_dimensions[l].width = w
                continue

    # Ensure output directories exist
    os.makedirs("docs/tasks", exist_ok=True)
    
    file_root = "MEDIVO_PROJECT_TASK_TRACKER.xlsx"
    file_docs = "docs/tasks/MEDIVO_MASTER_TASK_TRACKER.xlsx"
    
    wb.save(file_root)
    wb.save(file_docs)
    print(f"Successfully generated Excel tracker at:\n  - {file_root}\n  - {file_docs}")

if __name__ == "__main__":
    create_task_tracker()
