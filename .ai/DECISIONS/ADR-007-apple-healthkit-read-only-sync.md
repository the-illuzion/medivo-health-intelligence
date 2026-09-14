# ADR-007: Apple HealthKit Read-Only Anchored Sync

## Status
Accepted

## Date
2026-09-14

## Context

The Medivo mobile application needs to consume Apple Health data for patient-facing metrics and future insights. The current mobile runtime is Expo SDK 51, React Native 0.74.5, and React 18.2.0. The latest major versions of `@kingstinct/react-native-healthkit` require a newer React/React Native runtime, so adopting the latest package would couple HealthKit delivery to a major mobile-platform upgrade.

Health data is sensitive and must remain behind Medivo's health-domain boundary. The mobile application also needs an incremental synchronization mechanism that handles both newly created and deleted HealthKit samples without repeatedly uploading the user's full history.

## Decision

1. Use `@kingstinct/react-native-healthkit` version `8.0.0`, pinned exactly, for the Expo 51 / React Native 0.74 application.
2. Configure HealthKit as read-only. Medivo does not request permission to write HealthKit data.
3. Do not enable HealthKit background-delivery entitlement in the first release. Synchronization is user initiated/foreground only.
4. Request only the initial metric set required by the product: steps, heart rate, resting heart rate, active energy burned, sleep analysis, and heart-rate variability (SDNN).
5. Import up to the previous 30 days on first connection, then use HealthKit anchored queries for incremental synchronization. HealthKit anchors are stored with Expo SecureStore and scoped to the authenticated Medivo user.
6. Send HealthKit sample UUIDs to the backend as provider external IDs. The backend uses `(user_id, provider, external_id)` as the idempotency boundary and soft-deletes records when HealthKit reports deleted samples.
7. Keep the backend contract provider-neutral inside the health domain (`apple_health` today, `health_connect` prepared for a later Android implementation).
8. The Customer BFF derives patient ownership from the authenticated token. Client payloads never choose a user ID.

## Consequences

### Positive

- HealthKit can ship without a major Expo/React Native upgrade.
- No HealthKit write access is requested.
- Incremental sync minimizes repeated transfer of sensitive health data.
- Deleted HealthKit samples are propagated without hard-deleting Medivo health-domain records.
- The persistence model can support Health Connect later without redesigning the API/domain model.

### Trade-offs

- HealthKit requires an iOS native development/TestFlight build; it cannot be tested in Expo Go.
- Foreground/manual sync means updates are not immediate when Medivo is closed.
- A future Expo/React Native upgrade should revisit the pinned HealthKit dependency and background-delivery support.

## Follow-up

When the mobile runtime is upgraded, evaluate the then-current HealthKit package release and add observer/background delivery only with dedicated lifecycle, consent, battery, retry, and test coverage.
