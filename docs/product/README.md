# Product Specification — Customer Portal

## Executive Overview
The **Medivo Customer Portal** (`apps/customer-platform`) is an AI-powered health and skin intelligence web & mobile experience designed for seamless user engagement, real-time facial camera scanning, telehealth scheduling, and routine tracking.

---

## 9 Customer Portal Screens Specifications

1. **Dashboard (`dashboard`)**:
   - SVG Score ring with count-up animation (`87/100`).
   - AI Summary Card with contextual daily insights.
   - 5 Quick Action pills (**Face Scan**, **AI Coach**, **Routines**, **Consult**, **Shop**).
   - 4-column Health Metrics grid (Hydration, Wrinkles, Pigmentation, Oil Balance, Texture, Dark Circles).
   - Weekly / Monthly Recharts area trend graph.

2. **AI Face Match (`faceMatch`)**:
   - WebRTC live camera integration (`navigator.mediaDevices.getUserMedia`).
   - Facial bounding box, 9 landmark mesh dots, vertical glowing scanline.
   - Progressive scan messages and score generation.

3. **Scan Report (`scanReport`)**:
   - Detailed metric breakdown with animated progress bars.
   - AI clinical analysis overview & personalized action plan.

4. **AI Coach (`coach`)**:
   - Conversational chat interface with bouncing 3-dot typing indicator.
   - Quick suggestion pills and auto-scrolling response stream.

5. **History (`history`)**:
   - 8-week area chart side-by-side with chronologically grouped monthly scan entries.

6. **Routines (`routines`)**:
   - Morning & Evening skincare routine tabs.
   - 12-Day Streak banner ("🔥 12 Day Streak").
   - Step-by-step checklist with instant completion toggles.

7. **Products Marketplace (`products`)**:
   - Category filter pills ('All', 'Cleansers', 'Serums', 'Moisturizers', 'SPF').
   - SVG bottle glyph product cards with star ratings and Add-to-Bag buttons.

8. **Dermatologist Consultations (`consultations`)**:
   - Upcoming HD video appointment card.
   - Board-certified doctor directory cards with time slot selector & reservation modal.

9. **Profile & HIPAA Settings (`profile`)**:
   - User card, skin type, active goals.
   - HIPAA Data Privacy & AI analysis consent manager.
   - Apple Health / Google Fit sync toggles.
   - 3-mode App Theme Switcher (**System**, **Dark**, **Light**).