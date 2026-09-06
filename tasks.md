# Implementation Plan

- [ ] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Multi-State Location Selection
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples showing Andhra Pradesh and Assam options are absent from the dropdown
  - **Scoped PBT Approach**: Scope the property to the concrete failing cases: each of the required new locations must appear in the rendered dropdown options
  - Test that the rendered dropdown contains option values for "Vijayawada, Andhra Pradesh", "Guwahati, Assam", "Dibrugarh, Assam", "Silchar, Assam", "Jorhat, Assam", and "Tezpur, Assam" (from Bug Condition in design: isBugCondition where requestedState IN ['Andhra Pradesh', 'Assam'] AND NOT locationAvailableInDropdown(requestedState))
  - The test assertions should match the Expected Behavior: for all required new locations, locationAvailableInDropdown(location) = true AND canSelectLocation(location) = true
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists, e.g., "Vijayawada, Andhra Pradesh" option not found in dropdown)
  - Document counterexamples found to understand root cause (e.g., only UP options rendered; no Andhra Pradesh or Assam options present)
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 2.1, 2.2, 2.3, 2.5_

- [ ] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Existing Uttar Pradesh Functionality
  - **IMPORTANT**: Follow observation-first methodology
  - Observe: All four UP districts ("Varanasi, UP", "Prayagraj, UP", "Mirzapur, UP", "Ghazipur, UP") render as options on unfixed code
  - Observe: Default selected value is "Varanasi, UP" on unfixed code
  - Observe: Calling setDistrict with any UP value updates AuthContext district state correctly on unfixed code
  - Write property-based test: for all location IN ['Varanasi, UP', 'Prayagraj, UP', 'Mirzapur, UP', 'Ghazipur, UP'], originalDropdownBehavior(location) holds — option is present, selectable, and updates AuthContext state
  - Verify test PASSES on UNFIXED code (confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 3. Fix location-town dropdown to support multi-state selection

  - [ ] 3.1 Create src/data/locations.ts with hierarchical location data
    - Define a typed `LocationEntry` interface with `id`, `value`, `label`, `state`, `stateCode` fields
    - Add Uttar Pradesh entries: Varanasi, Prayagraj, Mirzapur, Ghazipur (preserving existing option values exactly)
    - Add Andhra Pradesh entry: Vijayawada
    - Add Assam entries: Guwahati, Dibrugarh, Silchar, Jorhat, Tezpur
    - Export a `LOCATIONS_BY_STATE` structure (state label → entries array) to support `<optgroup>` rendering
    - Export a flat `ALL_LOCATIONS` array for lookup/default resolution
    - _Bug_Condition: isBugCondition(input) where input.requestedState IN ['Andhra Pradesh', 'Assam'] AND NOT locationAvailableInDropdown(input.requestedState)_
    - _Expected_Behavior: locationAvailableInDropdown(location) = true for all new locations_
    - _Preservation: Uttar Pradesh entries must use identical value strings to existing hardcoded options_
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 3.1_

  - [ ] 3.2 Update AuthContext.tsx to default district to "Vijayawada, Andhra Pradesh"
    - Change the initial `district` useState value from `'Varanasi, UP'` to `'Vijayawada, Andhra Pradesh'`
    - Change the initial `user.district` field to `'Vijayawada, Andhra Pradesh'`
    - Change the `login()` function's hardcoded district to `'Vijayawada, Andhra Pradesh'`
    - Keep all other AuthContext logic and interface unchanged
    - _Requirements: 2.2, 3.4_

  - [ ] 3.3 Update TopHeader.tsx district selector to render hierarchical optgroup dropdown
    - Import `LOCATIONS_BY_STATE` from `src/data/locations.ts`
    - Replace the four hardcoded `<option>` elements with a `.map()` over `LOCATIONS_BY_STATE` entries rendering `<optgroup label={state}>` containing mapped `<option>` elements
    - Add a mobile-visible district selector (currently hidden on small screens with `hidden md:flex`) so it is also accessible on mobile — render a compact version below the header bar or make the existing one visible on mobile
    - Preserve all existing styling: `bg-transparent text-xs font-extrabold text-cyan-300 outline-none cursor-pointer` on the select, `bg-[#081A2E]` on options, parent container classes unchanged
    - Preserve the `value={district}` / `onChange={(e) => setDistrict(e.target.value)}` wiring to AuthContext
    - _Bug_Condition: isBugCondition where dropdown renders no AP/Assam options_
    - _Expected_Behavior: all six new location options appear under correct optgroup headers_
    - _Preservation: UP districts remain under "Uttar Pradesh" optgroup with same option values; styling and layout unchanged_
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 3.1, 3.2, 3.3_

  - [ ] 3.4 Update src/data/mockData.ts to add location-specific mock data for new locations
    - Add a `MOCK_ALERT_VIJAYAWADA` active alert referencing Krishna River and Vijayawada flood risk context
    - Add a `MOCK_DRAINAGE_VIJAYAWADA` drainage/river status referencing Krishna River gauge at Vijayawada
    - Add a `MOCK_ALERT_GUWAHATI` and `MOCK_DRAINAGE_GUWAHATI` referencing Brahmaputra River and Guwahati context
    - Keep all existing exports (MOCK_VILLAGES, MOCK_ALERT, MOCK_DRAINAGE, etc.) completely unchanged
    - _Preservation: All existing exports must remain exported with identical shapes and values_
    - _Requirements: 2.4, 3.1_

  - [ ] 3.5 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Multi-State Location Selection
    - **IMPORTANT**: Re-run the SAME test from task 1 — do NOT write a new test
    - The test from task 1 encodes the expected behavior: all new location options present and selectable
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms Andhra Pradesh and Assam options are now rendered)
    - _Requirements: 2.1, 2.2, 2.3, 2.5_

  - [ ] 3.6 Verify preservation tests still pass
    - **Property 2: Preservation** - Existing Uttar Pradesh Functionality
    - **IMPORTANT**: Re-run the SAME tests from task 2 — do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (UP districts still present, AuthContext wiring unchanged, UI styling preserved)
    - Confirm all tests still pass after fix (no regressions)

- [ ] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass; ask the user if questions arise.
