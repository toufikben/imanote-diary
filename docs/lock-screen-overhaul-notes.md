# Lock-screen overhaul notes — 2026-08-15

The redesigned PrivacyGate now uses a tall lock surface, a large local wolf asset, a local SVG fallback illustration of a girl behind the wolf, and a generated background URL at low opacity when available. The PIN keypad and primary action are inside a ScrollView with bottom padding so the create/unlock action remains reachable above the safe area.

The implementation is privacy-preserving for diary data: the lock verifier remains encapsulated behind `useDiary().unlock`; no PIN value is read by the visual component. Per-digit input triggers a short local happy sound and jump reaction, while rejected complete attempts or setup mismatches trigger the local sad sound and droop reaction. A successful complete unlock continues to use the long howl and eye glow.

The first web preview showed the keypad and primary action together, and the wolf asset rendered. The initial remote girl layer was not visually reliable in the preview, so a local SVG girl illustration was added behind the wolf as a guaranteed offline fallback. TypeScript and the existing 16 validation tests pass. The preview server later needed a restart and should be rechecked before checkpointing.


Final preview check: after restarting and exposing the current preview, the lock screen rendered successfully. The large wolf is visible above the PIN panel; the local girl illustration is visibly rendered behind it as a soft portrait/background layer; the four PIN dots, keypad, and primary action are all visible together without bottom clipping. The generated remote girl image remains a low-opacity enhancement only, while the local illustration guarantees offline visibility.
