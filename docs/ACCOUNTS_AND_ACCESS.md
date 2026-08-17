# Accounts and course access

Nexo is free and open source. The complete `spanish-foundations` course is available without a purchase, subscription, entitlement, coupon, or premium tier.

## Access sequence

1. Start Here (Module 0) and the Library are public.
2. Modules 1–16 require a free account.
3. Lessons unlock in dependency order.
4. A new stage requires the preceding checkpoint.
5. Review becomes the dashboard's primary recommendation whenever review is due.

The account boundary is educational, not commercial. It exists because later lessons depend on a coherent record of completed prerequisites, preserved first attempts, concept evidence, checkpoints, and delayed review.

## Persistence

Supabase provides email/password authentication and account-scoped storage for:

- the last visited lesson;
- completed lessons and checkpoints;
- immutable learner attempts; and
- concept-level evidence.

The browser keeps a local copy behind the same persistence boundary for responsive interactions. When a learner creates an account after Start Here, Module 0 progress is merged into that account rather than discarded.

Row Level Security restricts each learner to their own records. The browser uses only the public Supabase URL and publishable key; no service-role or payment secrets are part of the application.

## Open-source boundary

- Application code and general project documentation use the MIT License.
- Authored curriculum and grammar content under `content/` use CC BY-SA 4.0.
- The Nexo name and logo remain reserved so forks cannot imply official endorsement.

Contributions to grammar content should trace a correction through explanation, examples, practice, production, review, and later dependent lessons. Nexo should remain one coherent course, not become an unordered collection of grammar notes.

## Legacy schema note

The existing migration contains `course_entitlements` and `purchases` tables from an earlier paid-access experiment. Runtime code no longer reads or writes those tables. Do not drop historical payment records from a deployed database without an explicit retention and migration decision.
